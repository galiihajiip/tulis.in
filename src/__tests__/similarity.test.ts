import { describe, it, expect } from "vitest";
import { calculateSimilarity } from "@/lib/rewrite/similarity";

describe("Similarity Metrics", () => {
  it("should return 1.0 for identical texts", () => {
    const text = "This is a test sentence.";
    const metrics = calculateSimilarity(text, text);
    
    expect(metrics.trigramJaccard).toBeCloseTo(1.0, 1);
    expect(metrics.tfidfCosine).toBeCloseTo(1.0, 1);
  });

  it("should return lower scores for different texts", () => {
    const text1 = "This is a test sentence.";
    const text2 = "This is a completely different sentence.";
    const metrics = calculateSimilarity(text1, text2);
    
    expect(metrics.trigramJaccard).toBeLessThan(1.0);
    expect(metrics.trigramJaccard).toBeGreaterThan(0);
    expect(metrics.tfidfCosine).toBeLessThan(1.0);
    expect(metrics.tfidfCosine).toBeGreaterThan(0);
  });

  it("should return 0 for completely different texts", () => {
    const text1 = "abc";
    const text2 = "xyz";
    const metrics = calculateSimilarity(text1, text2);
    
    expect(metrics.trigramJaccard).toBe(0);
  });

  it("should handle paraphrased text", () => {
    const original = "The quick brown fox jumps over the lazy dog.";
    const paraphrased = "A fast brown fox leaps over a sleepy dog.";
    const metrics = calculateSimilarity(original, paraphrased);
    
    // Should have moderate similarity
    expect(metrics.trigramJaccard).toBeGreaterThan(0.2);
    expect(metrics.trigramJaccard).toBeLessThan(0.8);
    expect(metrics.tfidfCosine).toBeGreaterThan(0.3);
  });
});
