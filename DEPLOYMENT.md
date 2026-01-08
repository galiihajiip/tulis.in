# Deployment Guide - Tulis.in

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Database** - PostgreSQL (Supabase or Neon recommended)
3. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com)
4. **Supabase Project** (optional) - For auth and database

## Step 1: Setup Database

### Option A: Supabase (Recommended)

1. Create project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database
3. Copy the connection string (URI format)
4. Note down:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Option B: Neon

1. Create project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Use for `DATABASE_URL`

## Step 2: Deploy to Vercel

### Via GitHub (Recommended)

1. Push code to GitHub (already done ✅)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository: `galiihajiip/tulis.in`
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Via Vercel CLI

```bash
npm i -g vercel
vercel
```

## Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Variables

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional Variables

```env
# Anthropic (alternative AI provider)
ANTHROPIC_API_KEY=sk-ant-...
```

## Step 4: Run Database Migration

After deployment, run migration:

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Link to your project
vercel link

# Run migration
vercel env pull .env.local
npx prisma db push
```

Or use Vercel's built-in Postgres (if available):

```bash
vercel postgres create
```

## Step 5: Seed Database (Optional)

```bash
npm run db:seed
```

This creates:
- Demo user: `demo@tulis.in`
- Demo workspace
- Demo document

## Step 6: Test Deployment

1. Visit your Vercel URL
2. Click "Coba Gratis"
3. Try the rewrite feature
4. Check if:
   - ✅ Editor loads
   - ✅ Rewrite works
   - ✅ Diff view shows
   - ✅ Similarity metrics display

## Troubleshooting

### Error: "OpenAI API key not configured"

**Solution**: Add `OPENAI_API_KEY` to Vercel environment variables and redeploy.

### Error: "Prisma Client not generated"

**Solution**: Already fixed with `postinstall` script. If still occurs:
1. Check build logs
2. Ensure `prisma generate` runs during build
3. Redeploy

### Error: "Database connection failed"

**Solution**: 
1. Verify `DATABASE_URL` is correct
2. Check database is accessible from Vercel
3. Whitelist Vercel IPs in database firewall

### Error: "You exceeded your current quota"

**Cause**: OpenAI API key has no credits or exceeded quota.

**Solution**:
1. Go to [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Check your billing status
3. Add payment method if not added
4. Add credits ($5 minimum recommended)
5. Wait a few minutes for credits to activate
6. Try again

**Alternative**: Use a different API key or create new OpenAI account with free trial credits.

### Error: "Rate limit exceeded"

**Solution**: 
1. Check OpenAI account has credits
2. Upgrade OpenAI plan if needed
3. Implement Redis-based rate limiting

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster response times, add to API routes:

```typescript
export const runtime = 'edge';
```

### Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};
```

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics

### Error Tracking

Add Sentry (optional):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Security Checklist

- ✅ Environment variables set in Vercel (not in code)
- ✅ Database connection uses SSL
- ✅ API keys have appropriate permissions
- ✅ Rate limiting enabled
- ✅ CORS configured properly
- ✅ Input validation on all endpoints

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain: `tulis.in`
3. Configure DNS:
   - Type: `A` or `CNAME`
   - Value: Provided by Vercel
4. Wait for SSL certificate (automatic)

## Scaling Considerations

### Database

- **Supabase Free**: 500MB, 2GB bandwidth
- **Neon Free**: 3GB storage, 1 compute
- Upgrade when needed

### OpenAI

- Monitor token usage
- Set spending limits
- Consider caching common rewrites

### Vercel

- **Hobby**: Free, 100GB bandwidth
- **Pro**: $20/mo, 1TB bandwidth
- Upgrade based on traffic

## Backup Strategy

### Database

- Supabase: Automatic daily backups
- Neon: Point-in-time recovery
- Manual: `pg_dump` weekly

### Code

- GitHub: Already backed up ✅
- Vercel: Deployment history

## Support

- **Documentation**: See README.md
- **Issues**: GitHub Issues
- **Email**: support@tulis.in (if configured)

---

**Deployment Status**: ✅ Ready for Production

Last Updated: January 2026
