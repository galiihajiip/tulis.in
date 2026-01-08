import { describe, it, expect } from "vitest";
import { extractProtectedSpans, validateProtectedSpans } from "@/lib/rewrite/protected-spans";

describe("Protected Spans", () => {
  it("should extract numbers", () => {
    const text = "The price is $99.99 and quantity is 42.";
    const spans = extractProtectedSpans(text);
    
    const numbers = spans.filter((s) => s.type === "number");
    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers.some((s) => s.text === "99.99")).toBe(true);
    expect(numbers.some((s) => s.text === "42")).toBe(true);
  });

  it("should extract quotes", () => {
    const text = 'He said "Hello World" yesterday.';
    const spans = extractProtectedSpans(text);
    
    const quotes = spans.filter((s) => s.type === "quote");
    expect(quotes.length).toBe(1);
    expect(quotes[0].text).toBe('"Hello World"');
  });

  it("should extract URLs", () => {
    const text = "Visit https://example.com for more info.";
    const spans = extractProtectedSpans(text);
    
    const urls = spans.filter((s) => s.type === "url");
    expect(urls.length).toBe(1);
    expect(urls[0].text).toBe("https://example.com");
  });

  it("should extract glossary terms", () => {
    const text = "Machine Learning is a subset of AI.";
    const glossary = ["Machine Learning", "AI"];
    const spans = extractProtectedSpans(text, glossary);
    
    const glossarySpans = spans.filter((s) => s.type === "glossary");
    expect(glossarySpans.length).toBeGreaterThan(0);
  });

  it("should validate protected spans are unchanged", () => {
    const original = "The value is 42 and the quote is \"test\".";
    const rewritten = "The amount is 42 and the quote is \"test\".";
    const spans = extractProtectedSpans(original);
    
    const validation = validateProtectedSpans(original, rewritten, spans);
    expect(validation.valid).toBe(true);
    expect(validation.violations.length).toBe(0);
  });

  it("should detect violations when protected spans change", () => {
    const original = "The value is 42.";
    const rewritten = "The value is 43.";
    const spans = extractProtectedSpans(original);
    
    const validation = validateProtectedSpans(original, rewritten, spans);
    expect(validation.valid).toBe(false);
    expect(validation.violations.length).toBeGreaterThan(0);
  });
});
