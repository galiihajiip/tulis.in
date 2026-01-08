import { SimilarityMetrics } from "./types";

export function calculateSimilarity(
  text1: string,
  text2: string
): SimilarityMetrics {
  return {
    trigramJaccard: trigramJaccard(text1, text2),
    tfidfCosine: tfidfCosine(text1, text2),
  };
}

function trigramJaccard(text1: string, text2: string): number {
  const trigrams1 = getTrigrams(text1.toLowerCase());
  const trigrams2 = getTrigrams(text2.toLowerCase());

  const intersection = new Set(
    [...trigrams1].filter((x) => trigrams2.has(x))
  );
  const union = new Set([...trigrams1, ...trigrams2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

function getTrigrams(text: string): Set<string> {
  const trigrams = new Set<string>();
  const normalized = text.replace(/\s+/g, " ").trim();

  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.slice(i, i + 3));
  }

  return trigrams;
}

function tfidfCosine(text1: string, text2: string): number {
  const words1 = tokenize(text1);
  const words2 = tokenize(text2);

  const allWords = new Set([...words1, ...words2]);
  const vector1: number[] = [];
  const vector2: number[] = [];

  for (const word of allWords) {
    vector1.push(words1.filter((w) => w === word).length);
    vector2.push(words2.filter((w) => w === word).length);
  }

  return cosineSimilarity(vector1, vector2);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}
