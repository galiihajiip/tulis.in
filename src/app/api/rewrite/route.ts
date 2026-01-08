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

    if (!text || !params || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Rate limiting check (simple implementation)
    // In production, use Redis or similar
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

    const engine = new RewriteEngine();
    const result = await engine.rewrite(text, params);

    // Save job record if documentId provided
    if (documentId) {
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
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Rewrite error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
