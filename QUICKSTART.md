# Quick Start Guide

Get your Sora 2 Pro app running in under 30 minutes!

## What You Need

- [ ] Whop developer account → [Sign up](https://whop.com/dashboard/developer/)
- [ ] OpenAI API key → [Get one](https://platform.openai.com/api-keys)
- [ ] Supabase account → [Create free account](https://supabase.com)
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)

## 5-Step Setup

### Step 1: Create Whop App (5 min)

1. Go to https://whop.com/dashboard/developer/
2. Click "Create App"
3. Fill in:
   - Name: Sora 2 Pro
   - Category: AI
4. Go to Hosting tab, set paths:
   - App: `/experiences/[experienceId]`
   - Dashboard: `/dashboard/[companyId]`
   - Discover: `/discover`
5. Copy these values (you'll need them):
   - App ID
   - API Key
   - Agent User ID
   - Company ID

### Step 2: Set Up Supabase (10 min)

1. Go to https://supabase.com/dashboard
2. Create new project
3. Wait for initialization (~2 min)
4. Go to SQL Editor
5. Copy the contents of `supabase-schema.sql` from this project
6. Paste and run the SQL
7. Verify tables created under Table Editor
8. Go to Settings > API, copy:
   - Project URL
   - Anon/Public key
   - Service role key

### Step 3: Configure Environment (2 min)

Open `.env.local` and fill in:

```bash
# From Whop (Step 1)
WHOP_API_KEY="whk_..."
NEXT_PUBLIC_WHOP_APP_ID="app_..."
NEXT_PUBLIC_WHOP_AGENT_USER_ID="user_..."
NEXT_PUBLIC_WHOP_COMPANY_ID="biz_..."

# Your OpenAI API key
OPENAI_API_KEY="sk-..."

# From Supabase (Step 2)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### Step 4: Install & Run (3 min)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

App runs at http://localhost:3000

### Step 5: Test in Whop (5 min)

1. Create a test whop in your organization
2. Go to Settings > Tools > Add App
3. Select your app
4. Click the settings icon (translucent, top-right)
5. Select "localhost" with port 3000
6. Your app should load!

## First Test

1. You should see your username and credits (15 for new users)
2. Click "Cinematic Scene" template
3. The JSON editor should populate
4. Try switching to Simple mode and back
5. Check that the gallery is empty initially

## Common Issues

**App won't load in Whop?**
- Check that App path in Whop is set to `/experiences/[experienceId]`
- Make sure you clicked "localhost" in the settings menu

**Supabase connection error?**
- Verify all 3 Supabase credentials are correct
- Check that schema SQL ran successfully

**TypeScript errors?**
- Run `pnpm install` again
- Restart your IDE

## What's Next?

### To Test Video Generation (Requires OpenAI Credits)

⚠️ **Warning**: Testing video generation will use real OpenAI credits!

- 4s standard video = $0.40 (1 credit)
- 12s standard video = $1.20 (3 credits)

Only test if you have OpenAI credits and want to verify the full flow.

### To Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment checklist.

Quick version:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel
4. Deploy
5. Update Whop app Base URL to Vercel URL

### To Submit to Whop App Store

See [DEPLOYMENT.md](./DEPLOYMENT.md) section 11 for full submission process.

You'll need:
- App icon (512x512px)
- 5-10 screenshots
- Demo video (30-60s)
- Pricing configured
- Terms of Service

## File Structure Overview

```
sora-whop-app/
├── app/                          # Next.js app directory
│   ├── components/               # React components
│   │   ├── PromptBuilder.tsx     # Prompt input UI
│   │   ├── VideoSettings.tsx     # Settings panel
│   │   ├── VideoStatus.tsx       # Progress tracker
│   │   └── VideoGallery.tsx      # Video history
│   ├── experiences/[id]/         # Main app page
│   └── api/                      # Backend API routes
├── lib/                          # Utility functions
│   ├── types/database.ts         # TypeScript types
│   ├── credits.ts                # Credit management
│   ├── users.ts                  # User operations
│   ├── sora.ts                   # OpenAI integration
│   └── supabase.ts               # Database client
├── supabase-schema.sql           # Database schema
├── .env.local                    # Your credentials (don't commit!)
├── README.md                     # Project overview
├── SETUP.md                      # Detailed setup guide
├── DEPLOYMENT.md                 # Deployment checklist
├── TESTING_CHECKLIST.md          # Testing guide
└── QUICKSTART.md                 # This file
```

## Key Concepts

### How Credits Work

- Each tier gets monthly credits
- Credits = video generation capacity
- Standard video: duration/4 = credits
- Pro video: duration/2 = credits
- Auto-refunded if generation fails

### How Video Generation Works

1. User creates prompt (simple or JSON)
2. User selects settings (quality, duration, resolution)
3. System checks credits and deducts
4. API call to OpenAI Sora 2
5. Job ID returned
6. Frontend polls status every 10s
7. Video URL returned when complete
8. User can watch/download

### Subscription Tiers

| Tier | Monthly | Credits | Quality | Max Duration |
|------|---------|---------|---------|--------------|
| Starter | $29 | 15 | 720p only | 12s |
| Pro | $79 | 40 | Both | 12s |
| Max | $199 | 80 | Both | 12s |

## Development Tips

### Making Changes

1. Edit files in `app/` or `lib/`
2. Save (hot reload is enabled)
3. Check browser for updates
4. Check terminal for errors

### Adding Features

- New components → `app/components/`
- New API routes → `app/api/`
- New utilities → `lib/`
- New types → `lib/types/`

### Debugging

1. Check browser console (F12)
2. Check terminal output
3. Check Supabase logs
4. Check Vercel logs (in production)

### Before Committing

```bash
# Check for TypeScript errors
pnpm build

# Fix formatting (if using Biome)
pnpm lint
```

## Resources

**Official Documentation:**
- Whop Docs: https://docs.whop.com
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- OpenAI Sora Docs: https://platform.openai.com/docs/guides/video-generation

**This Project:**
- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Testing procedures
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Complete project summary

## Getting Help

**Issues?**
1. Check [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
2. Review error messages carefully
3. Check that all environment variables are set
4. Verify Supabase schema ran correctly
5. Ensure Whop app paths are configured

**Still stuck?**
- Review Whop docs
- Check Supabase status page
- Verify OpenAI API quota

## Next Steps After Setup

✅ **You should now have:**
- Running local development server
- App loading in Whop iframe
- User authentication working
- Templates loading correctly

📋 **Next actions:**
1. Review [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) to test features
2. (Optional) Test video generation with real OpenAI API
3. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. Create marketing materials for App Store submission
5. Plan V2 features based on user feedback

**Good luck with your launch!**
