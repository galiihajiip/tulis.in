# Tulis.in - Architecture Documentation

## System Overview

Tulis.in adalah aplikasi SaaS untuk parafrase etis yang dibangun dengan prinsip **clarity**, **transparency**, dan **academic integrity**.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Landing   │  │   Editor     │  │   Components     │   │
│  │   Page     │  │   (TipTap)   │  │  (shadcn/ui)     │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (Server)                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │ /rewrite │  │/documents│  │    /sources      │  │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────────────┘  │  │
│  └───────┼─────────────┼─────────────┼────────────────┘  │
│          │             │             │                     │
│  ┌───────▼─────────────▼─────────────▼────────────────┐  │
│  │           Rewrite Engine (Core Logic)              │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │  │
│  │  │  Protected   │  │   Similarity Calculator  │   │  │
│  │  │    Spans     │  │  (Trigram + TF-IDF)      │   │  │
│  │  └──────────────┘  └──────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │      AI Provider (OpenAI/Anthropic)          │ │  │
│  │  │  + Ethical Guardrails                        │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL  │  │  Supabase    │  │   Prisma ORM     │ │
│  │  (Neon/      │  │    Auth      │  │                  │ │
│  │  Supabase)   │  │              │  │                  │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Rewrite Engine (`src/lib/rewrite/engine.ts`)

**Responsibility**: Orchestrate the entire rewrite pipeline.

**Pipeline Steps**:
1. **Normalize Text** - Clean whitespace, standardize format
2. **Extract Protected Spans** - Identify elements that must not change
3. **Generate Rewrite** - Call AI provider with ethical constraints
4. **Validate** - Ensure protected spans unchanged
5. **Calculate Similarity** - Compute metrics for awareness
6. **Generate Diff** - Create visual comparison

**Key Methods**:
```typescript
async rewrite(text: string, params: RewriteParams): Promise<RewriteResult>
```

### 2. Protected Spans (`src/lib/rewrite/protected-spans.ts`)

**Responsibility**: Extract and validate elements that must remain unchanged.

**Protected Types**:
- Numbers (integers, decimals, percentages)
- Dates (various formats)
- Quotes (double/single)
- URLs
- Code blocks (backticks)
- Glossary terms (user-defined)

**Key Methods**:
```typescript
extractProtectedSpans(text: string, glossary?: string[]): ProtectedSpan[]
validateProtectedSpans(original: string, rewritten: string, spans: ProtectedSpan[]): ValidationResult
```

### 3. Similarity Calculator (`src/lib/rewrite/similarity.ts`)

**Responsibility**: Calculate similarity metrics for awareness.

**Metrics**:
- **Trigram Jaccard**: Character-level n-gram similarity
- **TF-IDF Cosine**: Word-level semantic similarity

**Purpose**: Inform user of similarity level, NOT to force low scores for bypass.

### 4. AI Provider Abstraction (`src/lib/rewrite/providers/`)

**Responsibility**: Abstract AI provider implementation with ethical guardrails.

**Interface**:
```typescript
interface RewriteProvider {
  rewrite(text: string, params: RewriteParams, protectedSpans: ProtectedSpan[]): Promise<string>
}
```

**Implementations**:
- `OpenAIRewriteProvider` - GPT-4o-mini with ethical system prompts

**Guardrails**:
- Explicit "no deception" instructions
- Meaning preservation constraints
- Protected spans enforcement
- Temperature control based on strictness

## Data Model

### Entity Relationship

```
User (1) ──────< (N) Workspace
  │
  └──────< (N) Document
              │
              ├──────< (N) DocumentVersion (max 20)
              ├──────< (N) Source (citations)
              └──────< (N) RewriteJob (audit log)
```

### Key Entities

**User**
- Authentication via Supabase
- Minimal PII storage

**Document**
- `contentOriginal`: User's input text
- Soft delete support (`deletedAt`)

**DocumentVersion**
- `contentRewritten`: AI-generated output
- `rewriteParams`: JSON of parameters used
- `similarityScore`: Stored for history
- Limited to 20 versions per document

**RewriteJob**
- Audit trail for all rewrite operations
- Tracks latency, token usage, errors
- Used for rate limiting and analytics

## Security Architecture

### Authentication
- **Supabase Auth** - Magic link or OAuth
- JWT tokens for API authentication
- Row-level security (RLS) in database

### Rate Limiting
- 10 requests per minute per user
- Tracked via `RewriteJob` table
- Returns 429 status when exceeded

### Prompt Injection Defense
1. System instructions have highest priority
2. User content sanitized before AI call
3. Protected spans extracted before AI processing
4. Validation after AI response

### Data Privacy
- Encryption at rest (database provider)
- HTTPS only
- No API keys in client
- User can permanently delete documents

## API Design

### RESTful Endpoints

**POST `/api/rewrite`**
- Main rewrite operation
- Rate limited
- Saves version history
- Returns full result with diff

**GET/POST/PATCH/DELETE `/api/documents`**
- CRUD operations for documents
- User ownership validation
- Soft delete support

**POST `/api/sources`**
- Add citation sources
- Auto-generate citation suggestions
- Supports URL and text sources

### Response Format

All endpoints return JSON:
```json
{
  "data": { ... },
  "error": "Error message if any"
}
```

Status codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 429: Rate limit exceeded
- 500: Server error

## Frontend Architecture

### Component Hierarchy

```
App Layout
├── Landing Page
│   ├── Hero
│   ├── Features
│   └── Principles
└── Editor Page (/app/doc/[id])
    ├── Top Bar
    │   ├── Logo
    │   ├── Export Controls
    │   └── User Menu
    ├── Main Content (Split)
    │   ├── Left: Editor Panel
    │   │   ├── Original (TipTap)
    │   │   └── Rewritten (TipTap readonly)
    │   └── Tabs: Editor | Diff View
    └── Right Sidebar
        ├── Controls Panel
        │   ├── Mode Select
        │   ├── Tone Slider
        │   ├── Readability Slider
        │   ├── Strictness Select
        │   └── Rewrite Button
        └── Similarity Panel
            ├── Trigram Jaccard
            └── TF-IDF Cosine
```

### State Management

**Local State** (React useState):
- Editor content
- UI toggles
- Loading states

**Server State** (API calls):
- Document data
- Rewrite results
- Version history

**No global state library needed** for MVP (Zustand available if needed).

### Auto-save Strategy

- Debounced save (2 seconds after last edit)
- Visual indicator: "Saved" / "Saving..."
- Optimistic UI updates

## Performance Considerations

### Frontend
- Code splitting via Next.js App Router
- Lazy load Monaco/TipTap
- Debounced auto-save
- Optimistic UI updates

### Backend
- Database connection pooling (Prisma)
- API route caching where appropriate
- Efficient similarity algorithms (O(n))

### AI Layer
- Use smaller model (GPT-4o-mini) for speed
- Stream responses (future enhancement)
- Timeout handling (30s max)

## Observability

### Logging
- **pino** for structured logging
- Log levels: error, warn, info, debug
- Sensitive data redaction

### Error Tracking
- **Sentry** integration ready
- Client and server error capture
- User context for debugging

### Analytics
- **PostHog** for product analytics
- Minimal event tracking:
  - Rewrite initiated
  - Rewrite completed
  - Export action
  - No content tracking (privacy)

## Deployment Architecture

### Vercel (Recommended)

```
┌─────────────────────────────────────────┐
│         Vercel Edge Network             │
│  ┌───────────────────────────────────┐ │
│  │   Next.js App (Serverless)        │ │
│  │   - API Routes                    │ │
│  │   - SSR Pages                     │ │
│  │   - Static Assets (CDN)           │ │
│  └───────────────┬───────────────────┘ │
└──────────────────┼─────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐  ┌──────▼──────┐  ┌───▼────┐
│ Neon/  │  │  Supabase   │  │ OpenAI │
│Supabase│  │    Auth     │  │  API   │
│   DB   │  │             │  │        │
└────────┘  └─────────────┘  └────────┘
```

### Environment Variables
- Set in Vercel dashboard
- Separate for preview/production
- Secrets encrypted

### Database
- **Neon**: Serverless PostgreSQL, auto-scaling
- **Supabase**: Includes auth, realtime, storage

## Testing Strategy

### Unit Tests (Vitest)
- ✅ Protected spans extraction
- ✅ Similarity calculation
- ✅ Diff generation
- ✅ Validation logic

### Integration Tests (Future)
- API endpoint testing
- Database operations
- Auth flow

### E2E Tests (Future)
- Playwright for critical flows
- Create document → Rewrite → Export

## Scalability Considerations

### Current Limits (MVP)
- 20 versions per document
- 10 requests/min per user
- Single AI provider

### Future Enhancements
- Redis for rate limiting
- Queue system (BullMQ) for exports
- Multiple AI providers with fallback
- Caching layer for common rewrites
- Team collaboration features

## Ethical Guardrails

### System Level
1. **No Bypass Features** - Explicitly forbidden in codebase
2. **Transparency** - Disclosure option always available
3. **Meaning Preservation** - Default to "high" strictness
4. **Protected Spans** - Automatic fact preservation

### AI Prompt Level
1. System instructions emphasize ethics
2. "Do not generate deception" explicit
3. Preserve entities/numbers/quotes
4. Focus on clarity, not similarity reduction

### UI/UX Level
1. Similarity shown as "awareness", not goal
2. Disclosure button prominent
3. Educational copy about ethical use
4. No marketing around "bypass"

## Maintenance & Monitoring

### Health Checks
- Database connectivity
- AI provider availability
- Auth service status

### Alerts
- High error rate
- Rate limit exceeded frequently
- Database connection issues
- AI provider failures

### Backup Strategy
- Database: Automated daily backups (provider)
- User can export documents anytime
- Version history provides rollback

---

**Last Updated**: January 2026
**Version**: 1.0.0
