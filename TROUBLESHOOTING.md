# Troubleshooting Guide

Common issues and solutions for the Sora 2 Pro Whop app.

## Development Setup Issues

### Issue: "App Base URL not set" in Whop iframe

**What you're seeing:**
```
App Base URL not set
If you are the developer, update the app config for your app in the Whop dashboard.
If you are still developing your app, enable localhost mode in the top right of this frame.
```

**Solution:**

1. **For Local Development (Recommended):**
   - Look for a translucent settings icon in the **top right** of the Whop iframe
   - Click it
   - Select "localhost"
   - Use port: `3000`
   - The app should reload and work

2. **For Production:**
   - Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
   - Select your app
   - Go to "Hosting" tab
   - Set "Base URL" to your deployment URL (e.g., `https://your-app.vercel.app`)
   - Save changes

### Issue: Server running but showing default landing page

**What you see:**
The default Whop app template landing page with "Welcome to Your Whop App"

**Why this happens:**
You're accessing `http://localhost:3000` directly in your browser instead of through Whop's iframe.

**Solution:**
The Sora 2 Pro app is designed to run **inside a Whop iframe**. You need to:

1. Create a Whop (or use existing one)
2. Add your app to the Whop
3. Access it through Whop's interface
4. Enable localhost mode (see above)

**Testing the app directly:**
If you want to test outside Whop, navigate to:
- `http://localhost:3000/experiences/test-experience-id`

But this will fail authentication without Whop's iframe context.

### Issue: TypeScript errors on start

**Error:**
```
Type error: Cannot find module '@/lib/...' or its corresponding type declarations
```

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Restart dev server
pnpm dev
```

### Issue: Supabase connection errors

**Error:**
```
Error: Invalid Supabase URL or Key
```

**Check:**
1. `.env.local` file exists in project root
2. All Supabase variables are filled:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
   SUPABASE_SERVICE_ROLE_KEY="eyJ..."
   ```
3. No extra quotes or spaces
4. Supabase project is active (not paused)

**Test connection:**
```bash
# In your browser console on localhost:3000
fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/')
  .then(r => r.json())
  .then(console.log)
```

### Issue: Whop authentication not working

**Error:**
```
Error: User not found
Failed to load user data
```

**Check:**
1. All Whop environment variables are set:
   ```bash
   WHOP_API_KEY="whk_..."
   NEXT_PUBLIC_WHOP_APP_ID="app_..."
   NEXT_PUBLIC_WHOP_AGENT_USER_ID="user_..."
   NEXT_PUBLIC_WHOP_COMPANY_ID="biz_..."
   ```

2. You're accessing the app through Whop (not directly)

3. The Whop app has correct paths set:
   - App path: `/experiences/[experienceId]`
   - Dashboard path: `/dashboard/[companyId]`
   - Discover path: `/discover`

### Issue: "Module not found" errors

**Error:**
```
Module not found: Can't resolve '@/lib/supabase'
```

**Solution:**
This usually means TypeScript path aliases aren't working.

Check `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Then restart dev server.

## Runtime Issues

### Issue: Credits not showing

**Problem:** User sees 0 credits or credits don't load

**Check:**
1. User record created in Supabase:
   ```sql
   SELECT * FROM users WHERE whop_user_id = 'your_whop_user_id';
   ```

2. If no record, user should be auto-created on first visit
   - Check browser console for errors
   - Check server logs for database errors

**Manual fix:**
```sql
-- In Supabase SQL Editor
INSERT INTO users (whop_user_id, subscription_tier, credits_remaining, total_credits_purchased)
VALUES ('your_whop_user_id', 'starter', 15, 15);
```

### Issue: Templates not loading

**Check Supabase:**
```sql
SELECT * FROM templates WHERE is_public = true;
```

**Should see 3 templates.** If not, re-run:
```sql
-- Delete old templates
DELETE FROM templates WHERE is_public = true;

-- Re-run the INSERT INTO templates section from supabase-schema.sql
```

### Issue: "Enhance with AI" button doesn't work

**Error in console:**
```
Failed to enhance prompt
```

**Causes:**
1. OpenAI API key not set or invalid
2. API key doesn't have GPT-4 access
3. Rate limit exceeded

**Check:**
```bash
# Test OpenAI API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Workaround:**
Use JSON mode directly instead of AI enhancement.

### Issue: Video generation fails immediately

**Error:**
```
Failed to start video generation
```

**Common causes:**

1. **Insufficient credits:**
   - Check your credit balance
   - Verify credit calculation is correct

2. **OpenAI API issues:**
   - Invalid API key
   - No Sora 2 access (waitlist)
   - Rate limit exceeded
   - Insufficient OpenAI credits

3. **Invalid parameters:**
   - Check console for validation errors
   - Verify model, duration, resolution are valid

**Debug:**
```javascript
// Browser console
fetch('/api/generate-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'your_user_id',
    prompt: 'test',
    jsonPrompt: {},
    model: 'sora-2',
    duration: 4,
    resolution: '1280x720'
  })
}).then(r => r.json()).then(console.log)
```

### Issue: Video stuck in "processing" status

**Problem:** Status never completes, keeps polling forever

**Causes:**
1. OpenAI API is slow (can take 5-10 minutes)
2. Job actually failed but status not updated
3. Invalid job ID

**Check:**
1. Wait at least 5 minutes before troubleshooting
2. Check OpenAI dashboard for job status
3. Check Supabase videos table:
   ```sql
   SELECT * FROM videos
   WHERE openai_job_id = 'your_job_id';
   ```

**Manual status update:**
```sql
UPDATE videos
SET status = 'failed',
    error_message = 'Manual timeout - investigate OpenAI job'
WHERE openai_job_id = 'your_job_id';
```

### Issue: Video gallery shows "Loading forever"

**Check browser console** for error.

**Common causes:**
1. API route error
2. Database query failed
3. Invalid user ID

**Test API directly:**
```bash
curl http://localhost:3000/api/videos?userId=YOUR_USER_ID
```

**Should return:**
```json
{
  "success": true,
  "videos": [...]
}
```

## Production Issues

### Issue: App won't load in production

**Check:**
1. Vercel deployment succeeded
2. All environment variables copied to Vercel
3. Whop app "Base URL" updated to Vercel URL
4. No build errors in Vercel logs

**Verify build:**
```bash
# Locally
pnpm build

# Should succeed with no errors
```

### Issue: Environment variables not working in production

**Problem:** Works locally but fails in production

**Solution:**
1. Go to Vercel project settings
2. Environment Variables section
3. Ensure ALL variables are set for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Redeploy after adding variables

**Important:** Vercel requires redeployment after env var changes!

### Issue: Database connection fails in production

**Check:**
1. Supabase project is not paused
2. IP allowlist includes Vercel (should be "Allow all" by default)
3. Service role key is correct (not anon key)

**Test from Vercel:**
Check deployment logs for Supabase connection errors.

### Issue: High costs - OpenAI API

**Monitor:**
1. Check OpenAI usage dashboard daily
2. Set up billing alerts at $50, $100, $200
3. Monitor Supabase videos table for volume

**Calculate costs:**
```sql
-- Total spent this month
SELECT
  COUNT(*) as videos,
  SUM(credits_used) as total_credits,
  SUM(CASE
    WHEN sora_model = 'sora-2' THEN duration_seconds * 0.10
    WHEN sora_model = 'sora-2-pro' THEN duration_seconds * 0.50
  END) as estimated_cost
FROM videos
WHERE created_at >= date_trunc('month', NOW())
  AND status = 'completed';
```

**If costs too high:**
1. Increase credit costs
2. Lower tier credit allocations
3. Add rate limiting
4. Increase pricing

## Database Issues

### Issue: "relation does not exist" errors

**Error:**
```
relation "users" does not exist
```

**Solution:**
The database schema wasn't run.

1. Go to Supabase SQL Editor
2. Copy all of `supabase-schema.sql`
3. Paste and execute
4. Verify tables exist in Table Editor

### Issue: Duplicate key errors

**Error:**
```
duplicate key value violates unique constraint "users_whop_user_id_key"
```

**Cause:** Trying to create user that already exists

**This is usually fine** - the app should handle this gracefully. If not, it's a bug in the user creation logic.

**Check:**
```sql
SELECT * FROM users WHERE whop_user_id = 'problematic_id';
```

### Issue: Trigger errors when running schema

**Error:**
```
trigger "update_users_updated_at" for relation "users" already exists
```

**Solution:**
The fixed schema (already updated) now uses `DROP TRIGGER IF EXISTS` before creating triggers.

**If you already ran the old version:**
```sql
-- Manually drop and recreate
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;

-- Then re-run the CREATE TRIGGER sections
```

## Performance Issues

### Issue: Slow page loads

**Check:**
1. Database indexes created (run schema)
2. No N+1 query issues
3. Images optimized
4. No large bundle size

**Analyze:**
```bash
pnpm build
# Check output for large bundles
```

### Issue: Memory leaks

**Symptoms:**
- Tab becomes slow over time
- High memory usage
- Video polling doesn't stop

**Check:**
1. Polling intervals are cleaned up on component unmount
2. No zombie event listeners
3. React DevTools for component leaks

**Already handled in VideoStatus component** with cleanup in useEffect return.

## Need More Help?

### Debugging Checklist
- [ ] Check browser console (F12)
- [ ] Check server logs (terminal where `pnpm dev` runs)
- [ ] Check Vercel deployment logs (production)
- [ ] Check Supabase logs
- [ ] Check OpenAI API dashboard
- [ ] Review this troubleshooting guide

### Useful Debugging Commands

```bash
# Check environment variables are loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.WHOP_API_KEY)"

# Test database connection
# (create a test script if needed)

# Build to catch TypeScript errors
pnpm build

# Check for outdated dependencies
pnpm outdated
```

### Getting Logs

**Local development:**
- Terminal output where `pnpm dev` runs
- Browser console (F12 > Console tab)
- Network tab (F12 > Network tab)

**Production:**
- Vercel: Project > Deployments > Click deployment > Runtime Logs
- Supabase: Project > Logs
- Browser console on production URL

### Still Stuck?

1. Review the relevant doc:
   - Setup issues → [SETUP.md](./SETUP.md)
   - Testing → [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
   - Deployment → [DEPLOYMENT.md](./DEPLOYMENT.md)

2. Check official docs:
   - [Whop Developer Docs](https://docs.whop.com)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [OpenAI API Docs](https://platform.openai.com/docs)

3. Double-check your environment variables match the examples

4. Try the "nuclear option":
   ```bash
   # Delete everything and start fresh
   rm -rf node_modules .next
   pnpm install
   pnpm dev
   ```

---

**Last Updated:** Ready for troubleshooting
**Version:** 1.0.0
