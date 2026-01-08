import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, url, text } = body;

    // Verify document ownership
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Generate citation suggestion (simple APA format)
    const citation = generateCitation(url, text);

    const source = await prisma.source.create({
      data: {
        documentId,
        url: url || null,
        text,
        citation,
      },
    });

    return NextResponse.json(source);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateCitation(url?: string, text?: string): string {
  if (!url && !text) return "";

  const currentYear = new Date().getFullYear();
  
  if (url) {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return `${domain}. (${currentYear}). Retrieved from ${url}`;
    } catch {
      return `Source. (${currentYear}). ${url}`;
    }
  }

  // For text without URL, suggest manual citation
  return `[Author]. (${currentYear}). [Title]. [Publisher/Source].`;
}
