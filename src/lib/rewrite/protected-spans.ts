import { ProtectedSpan } from "./types";

export function extractProtectedSpans(
  text: string,
  glossary: string[] = []
): ProtectedSpan[] {
  const spans: ProtectedSpan[] = [];

  // Numbers (including decimals, percentages, years)
  const numberRegex = /\b\d+([.,]\d+)?%?\b/g;
  let match;
  while ((match = numberRegex.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
      type: "number",
    });
  }

  // Dates (various formats)
  const dateRegex =
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g;
  while ((match = dateRegex.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
      type: "date",
    });
  }

  // Quotes (double and single)
  const quoteRegex = /["']([^"']+)["']/g;
  while ((match = quoteRegex.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
      type: "quote",
    });
  }

  // URLs
  const urlRegex = /https?:\/\/[^\s]+/g;
  while ((match = urlRegex.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
      type: "url",
    });
  }

  // Code blocks (backticks)
  const codeRegex = /`([^`]+)`/g;
  while ((match = codeRegex.exec(text)) !== null) {
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
      type: "code",
    });
  }

  // Glossary terms (case-insensitive)
  for (const term of glossary) {
    const termRegex = new RegExp(`\\b${term}\\b`, "gi");
    while ((match = termRegex.exec(text)) !== null) {
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        type: "glossary",
      });
    }
  }

  // Sort by start position and merge overlapping spans
  return mergeOverlappingSpans(spans.sort((a, b) => a.start - b.start));
}

function mergeOverlappingSpans(spans: ProtectedSpan[]): ProtectedSpan[] {
  if (spans.length === 0) return [];

  const merged: ProtectedSpan[] = [spans[0]];

  for (let i = 1; i < spans.length; i++) {
    const current = spans[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      // Overlapping, extend the last span
      last.end = Math.max(last.end, current.end);
      last.text = last.text + current.text.slice(last.end - current.start);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

export function validateProtectedSpans(
  original: string,
  rewritten: string,
  protectedSpans: ProtectedSpan[]
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const span of protectedSpans) {
    if (!rewritten.includes(span.text)) {
      violations.push(
        `Protected ${span.type} "${span.text}" was modified or removed`
      );
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}
