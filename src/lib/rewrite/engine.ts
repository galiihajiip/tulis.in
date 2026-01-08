import { RewriteProvider, RewriteParams, RewriteResult } from "./types";
import { extractProtectedSpans, validateProtectedSpans } from "./protected-spans";
import { calculateSimilarity } from "./similarity";
import { generateDiff } from "./diff";
import { OpenAIRewriteProvider } from "./providers/openai";

export class RewriteEngine {
  private provider: RewriteProvider;

  constructor(provider?: RewriteProvider) {
    this.provider = provider || new OpenAIRewriteProvider(process.env.OPENAI_API_KEY!);
  }

  async rewrite(text: string, params: RewriteParams): Promise<RewriteResult> {
    const startTime = Date.now();

    // 1. Normalize input
    const normalized = this.normalizeText(text);

    // 2. Extract protected spans
    const protectedSpans = extractProtectedSpans(normalized, params.glossary);

    // 3. Generate rewrite
    const rewritten = await this.provider.rewrite(normalized, params, protectedSpans);

    // 4. Validate protected spans
    const validation = validateProtectedSpans(normalized, rewritten, protectedSpans);
    if (!validation.valid) {
      console.warn("Protected spans validation failed:", validation.violations);
      // Return original if validation fails
      return {
        original: normalized,
        rewritten: normalized,
        diff: [],
        similarity: { trigramJaccard: 1, tfidfCosine: 1 },
        protectedSpans,
        metadata: { latencyMs: Date.now() - startTime },
      };
    }

    // 5. Calculate similarity
    const similarity = calculateSimilarity(normalized, rewritten);

    // 6. Generate diff
    const diff = generateDiff(normalized, rewritten);

    return {
      original: normalized,
      rewritten,
      diff,
      similarity,
      protectedSpans,
      metadata: {
        latencyMs: Date.now() - startTime,
      },
    };
  }

  private normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, "  ")
      .trim();
  }
}
