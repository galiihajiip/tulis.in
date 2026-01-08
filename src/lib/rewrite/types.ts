export type ToneLevel = 1 | 2 | 3 | 4 | 5; // 1=santai, 5=formal
export type ReadabilityLevel = 1 | 2 | 3 | 4 | 5; // 1=SMA, 5=akademik
export type StrictnessLevel = "low" | "medium" | "high";

export type RewriteMode =
  | "ringkas"
  | "formal"
  | "santai"
  | "akademik"
  | "baku";

export interface RewriteParams {
  mode?: RewriteMode;
  tone: ToneLevel;
  readability: ReadabilityLevel;
  strictness: StrictnessLevel;
  glossary?: string[];
}

export interface ProtectedSpan {
  start: number;
  end: number;
  text: string;
  type: "number" | "date" | "name" | "quote" | "url" | "code" | "glossary";
}

export interface RewriteCandidate {
  text: string;
  readabilityScore: number;
  semanticSimilarity: number;
}

export interface RewriteResult {
  original: string;
  rewritten: string;
  diff: DiffToken[];
  similarity: SimilarityMetrics;
  protectedSpans: ProtectedSpan[];
  metadata: {
    latencyMs: number;
    tokenUsage?: number;
  };
}

export interface DiffToken {
  type: "equal" | "insert" | "delete";
  text: string;
}

export interface SimilarityMetrics {
  trigramJaccard: number;
  tfidfCosine: number;
  semanticSimilarity?: number;
}

export interface RewriteProvider {
  rewrite(
    text: string,
    params: RewriteParams,
    protectedSpans: ProtectedSpan[]
  ): Promise<string>;
}
