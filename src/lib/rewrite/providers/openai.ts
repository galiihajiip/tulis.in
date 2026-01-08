import OpenAI from "openai";
import { RewriteProvider, RewriteParams, ProtectedSpan } from "../types";

export class OpenAIRewriteProvider implements RewriteProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async rewrite(
    text: string,
    params: RewriteParams,
    protectedSpans: ProtectedSpan[]
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(params, protectedSpans);
    const userPrompt = this.buildUserPrompt(text);

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: params.strictness === "high" ? 0.3 : 0.7,
      max_tokens: 4000,
    });

    return response.choices[0]?.message?.content?.trim() || text;
  }

  private buildSystemPrompt(
    params: RewriteParams,
    protectedSpans: ProtectedSpan[]
  ): string {
    const toneMap = {
      1: "sangat santai dan conversational",
      2: "santai namun profesional",
      3: "netral dan seimbang",
      4: "formal dan profesional",
      5: "sangat formal dan akademik",
    };

    const readabilityMap = {
      1: "mudah dipahami siswa SMA",
      2: "level mahasiswa tahun pertama",
      3: "level mahasiswa senior",
      4: "level pascasarjana",
      5: "level akademik/peneliti",
    };

    const protectedList = protectedSpans
      .map((s) => `"${s.text}" (${s.type})`)
      .join(", ");

    return `Kamu adalah asisten parafrase etis untuk meningkatkan clarity dan readability.

PRINSIP UTAMA:
- Jaga makna asli dengan ketat (${params.strictness} strictness)
- Tingkatkan kejelasan dan struktur kalimat
- JANGAN mengubah fakta, angka, nama, kutipan, atau istilah teknis
- JANGAN membuat konten untuk mengakali AI detector atau Turnitin
- Fokus pada clarity, bukan deception

PARAMETER:
- Tone: ${toneMap[params.tone]}
- Readability: ${readabilityMap[params.readability]}
- Mode: ${params.mode || "umum"}

PROTECTED ELEMENTS (JANGAN UBAH):
${protectedList || "Tidak ada"}

OUTPUT:
- Hanya kembalikan teks hasil parafrase
- Jangan tambahkan penjelasan atau komentar
- Pertahankan struktur paragraf asli`;
  }

  private buildUserPrompt(text: string): string {
    return `Parafrase teks berikut dengan mengikuti instruksi sistem:

${text}`;
  }
}
