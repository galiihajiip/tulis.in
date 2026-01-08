# Groq Setup Guide - FREE AI Provider

## Why Groq?

✅ **100% FREE** - No credit card required  
✅ **Very Fast** - Faster than OpenAI  
✅ **Generous Limits** - 30 requests/minute free tier  
✅ **Powerful Model** - Llama 3.3 70B  
✅ **No Billing** - Never pay anything  

## Step-by-Step Setup

### 1. Create Groq Account

1. Visit [console.groq.com](https://console.groq.com)
2. Click **Sign Up**
3. Choose sign-up method:
   - Google
   - GitHub
   - Email
4. Complete registration (no credit card needed!)

### 2. Get API Key

1. After login, go to **API Keys** section
2. Click **Create API Key**
3. Give it a name (e.g., "Tulis.in Production")
4. Click **Submit**
5. **Copy the key** (starts with `gsk_`)
   - ⚠️ Save it securely - you won't see it again!

### 3. Add to Vercel

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Set:
   - **Name**: `GROQ_API_KEY`
   - **Value**: `gsk_...` (paste your key)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**

### 4. Redeploy

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait for build to complete

### 5. Test

1. Visit your app URL
2. Go to editor page
3. Type some text
4. Click **Rewrite**
5. ✅ Should work instantly!

## Rate Limits (Free Tier)

- **Requests**: 30 per minute
- **Tokens**: 14,400 per minute
- **Daily**: Unlimited

**For Tulis.in usage**:
- 1 rewrite ≈ 1 request
- Can handle ~1,800 rewrites per hour
- More than enough for most use cases!

## Supported Models

Groq provides several models, we use:

- **llama-3.3-70b-versatile** (default)
  - Best for general paraphrasing
  - Fast and accurate
  - Great for Indonesian and English

Alternative models (can be changed in code):
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

## Comparison: Groq vs OpenAI

| Feature | Groq | OpenAI |
|---------|------|--------|
| **Cost** | FREE | $0.15-0.60 per 1M tokens |
| **Speed** | Very Fast | Fast |
| **Setup** | No credit card | Credit card required |
| **Rate Limit** | 30 req/min | Depends on tier |
| **Model** | Llama 3.3 70B | GPT-4o-mini |
| **Quality** | Excellent | Excellent |

## Troubleshooting

### Error: "Invalid API key"

**Solution**: 
1. Check key starts with `gsk_`
2. Verify no extra spaces
3. Regenerate key if needed

### Error: "Rate limit exceeded"

**Solution**:
- Free tier: 30 requests/minute
- Wait 1 minute and try again
- For production: Implement queue system

### Slow Response

**Possible causes**:
1. High Groq server load (rare)
2. Large text input
3. Network latency

**Solution**: Usually resolves in seconds

## Upgrading (Optional)

Groq offers paid plans for higher limits:

- **Pay-as-you-go**: $0.05-0.27 per 1M tokens
- **Higher rate limits**: Up to 14,400 req/min
- **Priority support**

But for most users, **FREE tier is enough**!

## Security Best Practices

1. ✅ Never commit API key to Git
2. ✅ Use environment variables only
3. ✅ Rotate keys periodically
4. ✅ Monitor usage in Groq dashboard
5. ✅ Set up alerts for unusual activity

## Alternative: Local Setup

Want to run locally without any API?

```bash
# Install Ollama
# Visit ollama.ai

# Pull Llama model
ollama pull llama3.1

# Update code to use Ollama provider
# (Implementation guide in ARCHITECTURE.md)
```

## Support

- **Groq Docs**: [console.groq.com/docs](https://console.groq.com/docs)
- **Community**: [discord.gg/groq](https://discord.gg/groq)
- **Status**: [status.groq.com](https://status.groq.com)

---

**Ready to use Tulis.in with FREE AI!** 🚀

No credit card. No billing. Just pure paraphrasing power.
