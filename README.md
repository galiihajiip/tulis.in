# Tulis.in - Parafrase Etis

Alat bantu menulis untuk parafrase etis dengan fokus pada **clarity**, **style**, dan **proper citation**. Bukan untuk mengakali AI detector atau Turnitin, tapi untuk membantu menulis lebih baik.

## 🎯 Prinsip Utama

1. **Clarity First** - Fokus pada kejelasan dan readability
2. **Meaning Preservation** - Jaga makna asli dengan ketat
3. **Transparency** - Disclosure option untuk transparansi penggunaan alat
4. **No Deception** - Tidak ada fitur untuk bypass detector

## ✨ Fitur Utama

### MVP Features
- **Editor Dua Panel** - Input dan output side-by-side
- **Preset Rewrite Modes**
  - Lebih Ringkas
  - Lebih Formal
  - Lebih Santai
  - Akademik
  - Bahasa Indonesia Baku
- **Controls**
  - Tone slider (santai ↔ formal)
  - Readability level (SMA ↔ akademik)
  - Meaning preservation strictness
- **Diff View** - Highlight insertions/deletions
- **Similarity Meter**
  - Trigram Jaccard
  - TF-IDF Cosine
  - Untuk awareness, bukan bypass
- **Citations Helper** - Suggested citations dari URL/sumber
- **Protected Spans** - Angka, nama, kutipan, istilah tidak berubah
- **Version History** - Simpan 20 versi terakhir

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **TipTap** (Rich text editor)
- **Zustand** (State management)

### Backend
- **Next.js API Routes**
- **PostgreSQL** (via Supabase/Neon)
- **Prisma ORM**
- **Supabase Auth**

### AI Layer
- **OpenAI GPT-4o-mini** (dengan guardrails etis)
- Provider abstraction untuk flexibility

### Testing
- **Vitest** (Unit tests)

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase/Neon recommended)
- OpenAI API key

### 1. Clone & Install
```bash
git clone <repo-url>
cd tulis-in
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tulisin"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

### Test Coverage
- ✅ Protected spans extraction & validation
- ✅ Similarity metrics calculation
- ✅ Rewrite engine pipeline

## 📁 Project Structure

```
tulis-in/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── rewrite/       # Rewrite endpoint
│   │   │   ├── documents/     # CRUD documents
│   │   │   └── sources/       # Citations
│   │   ├── app/doc/[id]/      # Editor page
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── editor/
│   │   │   ├── controls-panel.tsx
│   │   │   ├── editor-panel.tsx
│   │   │   ├── diff-viewer.tsx
│   │   │   └── similarity-panel.tsx
│   │   └── ui/                # shadcn components
│   ├── lib/
│   │   ├── rewrite/
│   │   │   ├── engine.ts      # Main rewrite engine
│   │   │   ├── protected-spans.ts
│   │   │   ├── similarity.ts
│   │   │   ├── diff.ts
│   │   │   ├── types.ts
│   │   │   └── providers/
│   │   │       └── openai.ts
│   │   ├── db.ts              # Prisma client
│   │   ├── supabase/
│   │   └── utils.ts
│   └── __tests__/             # Unit tests
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🔒 Security & Privacy

- **Rate Limiting** - 10 requests per minute per user
- **Protected Spans Validation** - Ensures facts/numbers unchanged
- **Prompt Injection Defense** - System instructions override protection
- **Data Encryption** - At rest via database provider
- **No PII Storage** - Minimal user data collection

## 🎨 Design System

### Colors
- **Primary**: `#4F46E5` (Indigo 600)
- **Accent**: `#22C55E` (Green 500)
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`

### Typography
- **UI Font**: Inter
- **Mono Font**: JetBrains Mono (diff view)

### Spacing
- 8px grid system
- Border radius: 16px (cards), 12px (inputs)

## 📊 Rewrite Algorithm

### Pipeline
1. **Preprocess** - Normalize whitespace, detect language
2. **Extract Protected Spans** - Numbers, dates, quotes, URLs, glossary terms
3. **Generate Rewrite** - AI with ethical guardrails
4. **Validate** - Ensure protected spans unchanged
5. **Calculate Similarity** - Trigram Jaccard + TF-IDF Cosine
6. **Generate Diff** - Highlight changes

### Guardrails
- "Do not generate deception"
- Meaning preservation constraints
- Preserve entities/numbers/quotes
- No bypass instructions

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set all `.env` variables in Vercel dashboard.

### Database
- **Supabase**: Free tier available
- **Neon**: Serverless PostgreSQL

## 📝 API Endpoints

### POST `/api/rewrite`
Rewrite text with parameters.

**Request:**
```json
{
  "text": "Original text",
  "params": {
    "mode": "formal",
    "tone": 4,
    "readability": 3,
    "strictness": "high"
  },
  "documentId": "doc-id",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "original": "...",
  "rewritten": "...",
  "diff": [...],
  "similarity": {
    "trigramJaccard": 0.65,
    "tfidfCosine": 0.72
  },
  "metadata": {
    "latencyMs": 1234
  }
}
```

### GET `/api/documents`
List user documents.

### POST `/api/sources`
Add citation source.

## 🤝 Contributing

Contributions welcome! Please ensure:
1. All tests pass
2. Follow ethical principles (no bypass features)
3. Maintain code quality

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Built with ethical AI principles
- Inspired by academic integrity tools
- Designed for clarity, not deception

---

**Tulis.in** - Menulis lebih baik, bukan mengakali sistem.
