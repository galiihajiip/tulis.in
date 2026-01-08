import { NextRequest, NextResponse } from "next/server";
import { RewriteEngine } from "@/lib/rewrite/engine";
import { RewriteParams } from "@/lib/rewrite/types";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, params, documentId, userId } = body as {
      text: string;
      params: RewriteParams;
      documentId?: string;
      userId: string;
    };

    if (!text || !params) {
      return NextResponse.json(
        { error: "Missing required fields: text and params are required" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // Rate limiting check (simple implementation) - skip if no database
    if (userId && documentId) {
      try {
        const recentJobs = await prisma.rewriteJob.count({
          where: {
            document: { userId },
            createdAt: { gte: new Date(Date.now() - 60000) }, // last minute
          },
        });

        if (recentJobs > 10) {
          return NextResponse.json(
            { error: "Rate limit exceeded. Please wait." },
            { status: 429 }
          );
        }
      } catch (dbError) {
        console.warn("Database not available, skipping rate limit check:", dbError);
      }
    }

    const engine = new RewriteEngine();
    const result = await engine.rewrite(text, params);

    // Save job record if documentId provided and database available
    if (documentId && userId) {
      try {
        await prisma.rewriteJob.create({
          data: {
            documentId,
            rewriteParams: params as any,
            similarityScore: result.similarity.trigramJaccard,
            latencyMs: result.metadata.latencyMs,
            tokenUsage: result.metadata.tokenUsage,
            status: "completed",
          },
        });

        // Save version (limit to 20)
        const versionCount = await prisma.documentVersion.count({
          where: { documentId },
        });

        if (versionCount >= 20) {
          const oldestVersion = await prisma.documentVersion.findFirst({
            where: { documentId },
            orderBy: { createdAt: "asc" },
          });
          if (oldestVersion) {
            await prisma.documentVersion.delete({
              where: { id: oldestVersion.id },
            });
          }
        }

        await prisma.documentVersion.create({
          data: {
            documentId,
            contentRewritten: result.rewritten,
            rewriteParams: params as any,
            similarityScore: result.similarity.trigramJaccard,
          },
        });
      } catch (dbError) {
        console.warn("Database save failed, continuing without persistence:", dbError);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Rewrite error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Internal server error";
    if (error.message?.includes("API key")) {
      errorMessage = "OpenAI API configuration error. Please check your API key.";
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "OpenAI rate limit exceeded. Please try again later.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
