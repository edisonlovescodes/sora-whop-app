# Sora 2 Pro - Whop App Setup Guide

This guide will walk you through setting up the Sora 2 Pro video generator Whop app from scratch.

## Prerequisites

- Node.js 18+ and pnpm installed
- A Whop account with developer access
- OpenAI API key with Sora 2 access
- Supabase account (free tier is fine)

## Step 1: Whop App Setup

### Create Your Whop App

1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. Click "Create App"
3. Fill in app details:
   - Name: "Sora 2 Pro - AI Video Generator"
   - Description: "Transform your ideas into stunning AI videos with advanced JSON prompting"
   - Category: AI

### Configure Hosting Settings

In your app's Hosting section, set:
- **Base URL**: Your deployment URL (e.g., `https://your-app.vercel.app`)
- **App path**: `/experiences/[experienceId]`
- **Dashboard path**: `/dashboard/[companyId]`
- **Discover path**: `/discover`

### Get API Credentials

1. Copy your **App ID** from the app overview page
2. Generate and copy your **API Key**
3. Create a webhook and copy the **Webhook Secret**
4. Create an agent user and copy the **Agent User ID**
5. Note your **Company ID**

## Step 2: Supabase Setup

### Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose a name and strong database password
4. Wait for project to initialize (~2 minutes)

### Run Database Schema

1. Go to SQL Editor in Supabase
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. Verify tables were created under "Table Editor"

### Get Supabase Credentials

From Settings > API:
- Copy **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
- Copy **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Copy **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

## Step 3: OpenAI API Setup

### Get Sora 2 API Access

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Ensure you have API access (Sora 2 requires API access)
3. Generate an API key from API Keys section
4. Copy your API key

**Note**: Sora 2 API is currently in limited preview. You may need to join the waitlist.

## Step 4: Configure Environment Variables

1. Copy `.env.local` template (already created)
2. Fill in all the values:

```bash
# Whop Configuration
WHOP_API_KEY="your_whop_api_key_from_step_1"
WHOP_WEBHOOK_SECRET="your_webhook_secret_from_step_1"
NEXT_PUBLIC_WHOP_AGENT_USER_ID="your_agent_user_id_from_step_1"
NEXT_PUBLIC_WHOP_APP_ID="your_app_id_from_step_1"
NEXT_PUBLIC_WHOP_COMPANY_ID="your_company_id_from_step_1"

# OpenAI API
OPENAI_API_KEY="your_openai_api_key_from_step_3"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_from_step_2"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_from_step_2"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key_from_step_2"
```

## Step 5: Install Dependencies

```bash
pnpm install
```

## Step 6: Local Development

### Start Development Server

```bash
pnpm dev
```

The dev server will start with Whop's proxy at `http://localhost:3000`

### Test in Whop

1. Create a test whop in your organization
2. Go to Tools > Add App
3. Select your app
4. Click the settings icon (top right)
5. Select "localhost" with port 3000
6. Your app should load in the iframe

### Initial Testing Checklist

- [ ] App loads without errors
- [ ] User authentication works (shows your username)
- [ ] Credits are displayed correctly
- [ ] Template selection works
- [ ] Prompt builder UI functions
- [ ] Can switch between Simple and JSON modes

## Step 7: Seed Test Data (Optional)

For testing, you can manually add credits to your user:

```sql
-- Run in Supabase SQL Editor
UPDATE users
SET credits_remaining = 100,
    subscription_tier = 'max'
WHERE whop_user_id = 'your_whop_user_id';
```

## Step 8: Deploy to Vercel

### Create Vercel Project

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Configure build settings (auto-detected for Next.js)

### Add Environment Variables

In Vercel project settings > Environment Variables, add all variables from `.env.local`

**Important**: Make sure to add them to all environments (Production, Preview, Development)

### Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your deployment URL (e.g., `https://your-app.vercel.app`)

## Step 9: Update Whop App Settings

1. Go back to Whop Developer Dashboard
2. Update your app's **Base URL** with your Vercel deployment URL
3. Save changes

## Step 10: Test Production

1. Go to your whop
2. Your app should now load from the production URL
3. Test the complete flow:
   - Create a video with a simple prompt
   - Check credits are deducted
   - Monitor video generation status
   - View completed video

## Step 11: Submit to Whop App Store

### Prepare Marketing Materials

1. **App Icon**: 512x512px PNG
2. **Screenshots**: 5-10 screenshots showing:
   - Prompt builder interface
   - JSON mode
   - Video generation in progress
   - Completed video player
   - Video gallery

3. **Demo Video**: 30-60 second demo showing:
   - Creating a prompt
   - Generating a video
   - Viewing results

### Create App Listing

1. Go to Whop Developer Dashboard
2. Click "Submit to App Store"
3. Fill in:
   - App name and description
   - Category: AI
   - Pricing: Monthly subscription
   - Upload marketing materials

### Set Pricing

In the Whop dashboard, configure your pricing tiers:

**Starter - $29/month**
- 15 standard (720p) video credits
- 12 second max duration

**Pro - $79/month**
- 30 standard + 10 pro (1080p) credits
- Mix of quality options

**Max - $199/month**
- 60 standard + 20 pro credits
- Unlimited duration

### Submit for Review

1. Review all information
2. Click "Submit for Review"
3. Wait for Whop team approval (typically 2-5 business days)

## Troubleshooting

### App Won't Load

- Check that Base URL matches your deployment URL
- Verify App path is set to `/experiences/[experienceId]`
- Check browser console for errors
- Verify all environment variables are set correctly

### Authentication Errors

- Verify WHOP_API_KEY is correct
- Check that App ID matches
- Ensure user has access to the whop

### Supabase Connection Issues

- Verify Supabase URL and keys are correct
- Check that database schema was run successfully
- Review Supabase logs for errors

### Sora API Errors

- Verify OpenAI API key is valid and has Sora 2 access
- Check API quota and billing
- Review OpenAI API logs

### Credits Not Deducting

- Check Supabase user record exists
- Verify credit calculation logic
- Check server logs for database errors

## Next Steps

### Optional Enhancements for V2

1. **Google Drive Integration**
   - Add OAuth flow for Google Drive
   - Auto-upload videos to user's Drive
   - Implement in `/api/google-drive`

2. **Custom Templates**
   - Allow users to save custom templates
   - Template marketplace
   - Share templates with community

3. **Batch Generation**
   - Generate multiple videos from CSV
   - Schedule video generations
   - Bulk operations

4. **Analytics Dashboard**
   - Usage statistics
   - Credit consumption graphs
   - Popular templates

5. **Advanced Features**
   - Video editing tools
   - Remix existing videos
   - A/B testing prompts

## Support

If you encounter issues:

1. Check the Whop Developer Docs: https://docs.whop.com
2. Review OpenAI Sora API Docs: https://platform.openai.com/docs
3. Contact Whop support through the developer dashboard

## Cost Breakdown

**Monthly Operating Costs** (approximate):
- Supabase: $0 (free tier, up to 500MB database + 2GB bandwidth)
- Vercel: $0 (free tier, 100GB bandwidth)
- OpenAI API: Variable based on usage
  - $0.10/second for Sora 2 (720p)
  - $0.50/second for Sora 2 Pro (1080p)
- Whop: 3% transaction fee + payment processing

**Revenue Projections**:
- 10 Starter users: $290/month
- 5 Pro users: $395/month
- 2 Max users: $398/month
**Total**: $1,083/month

**Costs for this revenue**:
- Sora API (estimated): ~$400/month
- Whop fees (3%): ~$32/month
- Hosting: $0 (free tier)
**Net profit**: ~$651/month (60% margin)

Good luck with your launch!
