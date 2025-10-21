# Deployment Checklist

Use this checklist to ensure smooth deployment of your Sora 2 Pro Whop app.

## Pre-Deployment Checklist

### 1. Accounts & Services Setup
- [ ] Whop developer account created
- [ ] Whop app created in dashboard
- [ ] OpenAI account with API access (Sora 2 enabled)
- [ ] Supabase project created
- [ ] GitHub repository created
- [ ] Vercel account created

### 2. Whop App Configuration
- [ ] App name set: "Sora 2 Pro - AI Video Generator"
- [ ] App description written
- [ ] Category set to "AI"
- [ ] App ID copied
- [ ] API key generated and copied
- [ ] Webhook secret created and copied
- [ ] Agent user created, user ID copied
- [ ] Company ID noted

### 3. Supabase Setup
- [ ] Database schema (`supabase-schema.sql`) executed
- [ ] Tables verified in Table Editor:
  - [ ] users
  - [ ] videos
  - [ ] templates
- [ ] RLS policies enabled
- [ ] Test templates inserted
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] Service role key copied

### 4. Environment Variables Ready
- [ ] All Whop credentials filled in `.env.local`
- [ ] OpenAI API key added
- [ ] Supabase credentials added
- [ ] Google OAuth credentials ready (optional for V1)

### 5. Local Testing Complete
- [ ] `pnpm install` runs without errors
- [ ] `pnpm dev` starts successfully
- [ ] App loads in Whop iframe (localhost mode)
- [ ] User authentication works
- [ ] Credits display correctly
- [ ] Template selection works
- [ ] Prompt builder UI functional
- [ ] Simple to JSON mode switching works
- [ ] (Optional) Test video generation with real OpenAI key

## Deployment Process

### Step 1: Code Review
- [ ] All TypeScript errors resolved
- [ ] All console errors fixed
- [ ] No hardcoded credentials in code
- [ ] `.gitignore` includes `.env.local`
- [ ] Comments removed or cleaned up
- [ ] TODO items addressed or documented

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Initial Sora 2 Pro app commit"
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] Repository is private (recommended)
- [ ] README.md looks good on GitHub

### Step 3: Vercel Deployment
- [ ] New project created in Vercel
- [ ] GitHub repository connected
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Root directory: `./` (default)
- [ ] Build command: `pnpm build` (auto-detected)
- [ ] Install command: `pnpm install` (auto-detected)

### Step 4: Environment Variables in Vercel
Add all variables from `.env.local` to Vercel:

**Whop:**
- [ ] WHOP_API_KEY
- [ ] WHOP_WEBHOOK_SECRET
- [ ] NEXT_PUBLIC_WHOP_AGENT_USER_ID
- [ ] NEXT_PUBLIC_WHOP_APP_ID
- [ ] NEXT_PUBLIC_WHOP_COMPANY_ID

**OpenAI:**
- [ ] OPENAI_API_KEY

**Supabase:**
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY

**Google (Optional):**
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET

- [ ] All environment variables added to Production
- [ ] All environment variables added to Preview
- [ ] All environment variables added to Development

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] No build errors
- [ ] Deployment successful
- [ ] Deployment URL copied (e.g., `https://your-app.vercel.app`)

### Step 6: Update Whop App Settings
- [ ] Go to Whop Developer Dashboard
- [ ] Navigate to app settings > Hosting
- [ ] Update Base URL to Vercel deployment URL
- [ ] Verify paths are set:
  - [ ] App path: `/experiences/[experienceId]`
  - [ ] Dashboard path: `/dashboard/[companyId]`
  - [ ] Discover path: `/discover`
- [ ] Save changes

### Step 7: Production Testing
- [ ] Create or use test whop in your organization
- [ ] Navigate to Tools > Add App
- [ ] Add your app to the whop
- [ ] Open the app
- [ ] App loads from production URL
- [ ] No console errors
- [ ] User authentication works
- [ ] Credits display correctly

**Critical Flow Testing:**
- [ ] Can select a template
- [ ] Can switch between modes
- [ ] Can enter a prompt
- [ ] Settings page loads with correct tier info
- [ ] (If you have test OpenAI credits) Generate a test video
- [ ] Video status polling works
- [ ] Completed video displays
- [ ] Video can be downloaded
- [ ] Gallery shows video history

## Post-Deployment

### Step 8: Monitoring Setup
- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking set up (Sentry, LogRocket, etc.)
- [ ] Supabase logs reviewed
- [ ] OpenAI API usage dashboard monitored

### Step 9: Documentation
- [ ] README.md updated with production URL
- [ ] SETUP.md verified for accuracy
- [ ] API documentation complete
- [ ] Known issues documented

### Step 10: App Store Submission Prep

**Marketing Materials:**
- [ ] App icon created (512x512px PNG)
- [ ] 5-10 screenshots taken:
  - [ ] Prompt builder interface
  - [ ] Template selection
  - [ ] JSON mode editor
  - [ ] Video generation progress
  - [ ] Completed video player
  - [ ] Video gallery
  - [ ] Settings/credits display
- [ ] Demo video recorded (30-60 seconds)
- [ ] App description written (compelling, SEO-friendly)

**Pricing Configuration:**
- [ ] Subscription plans created in Whop:
  - [ ] Starter: $29/month
  - [ ] Pro: $79/month
  - [ ] Max: $199/month
- [ ] Credits per tier configured
- [ ] Payment processing tested

**Legal & Compliance:**
- [ ] Terms of Service written
- [ ] Privacy Policy created
- [ ] OpenAI usage terms reviewed
- [ ] Whop marketplace policies reviewed

### Step 11: Submit to Whop App Store
- [ ] Go to Whop Developer Dashboard
- [ ] Click "Submit to App Store"
- [ ] Fill in all required information
- [ ] Upload app icon
- [ ] Upload screenshots
- [ ] Upload demo video
- [ ] Write compelling description
- [ ] Set pricing and plans
- [ ] Review submission
- [ ] Submit for approval
- [ ] Wait for Whop team review (2-5 business days)

### Step 12: Launch Preparation
- [ ] Create launch announcement
- [ ] Prepare social media posts
- [ ] Set up customer support channel (Discord, email, etc.)
- [ ] Create onboarding documentation
- [ ] Prepare FAQ page
- [ ] Set up analytics tracking

## Launch Day

- [ ] App approved by Whop
- [ ] Live in Whop App Store
- [ ] Announcement posted
- [ ] Social media promotion started
- [ ] Monitor for issues
- [ ] Respond to early user feedback
- [ ] Track first installations
- [ ] Monitor error logs
- [ ] Celebrate!

## Week 1 Post-Launch

- [ ] Gather user feedback
- [ ] Fix critical bugs (if any)
- [ ] Monitor API costs vs revenue
- [ ] Adjust pricing if needed
- [ ] Create user testimonials/case studies
- [ ] Plan V2 features based on feedback

## Performance Metrics to Track

**User Metrics:**
- Total installations
- Active users (daily/weekly/monthly)
- Conversion rate (free trial to paid)
- Churn rate
- Average videos generated per user

**Technical Metrics:**
- API response times
- Video generation success rate
- Average generation time
- Error rates
- Uptime percentage

**Financial Metrics:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- OpenAI API costs
- Profit margin
- Break-even analysis

## Common Issues & Solutions

**Issue: App won't load in Whop**
- Check Base URL matches deployment URL exactly
- Verify SSL certificate is valid
- Check CORS settings

**Issue: Authentication errors**
- Verify WHOP_API_KEY is correct for production
- Check App ID matches
- Ensure user has whop access

**Issue: Sora API timeouts**
- Implement retry logic
- Increase polling interval
- Add better error messages

**Issue: High costs**
- Monitor API usage patterns
- Implement rate limiting
- Adjust credit costs if needed
- Consider batching requests

## Emergency Contacts

**Vercel Support:** https://vercel.com/support
**Whop Support:** developer@whop.com
**Supabase Support:** https://supabase.com/support
**OpenAI Support:** https://help.openai.com/

## Rollback Plan

If critical issues arise:

1. [ ] Revert to previous Vercel deployment
2. [ ] Disable app in Whop App Store
3. [ ] Communicate with users
4. [ ] Fix issues in staging
5. [ ] Re-deploy when ready
6. [ ] Re-enable app

---

**Last Updated:** Ready for deployment
**Version:** 1.0.0
**Status:** Pre-launch
