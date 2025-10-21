# Testing Checklist

Use this checklist to systematically test all features before deploying.

## Local Development Testing

### Environment Setup
- [ ] All environment variables in `.env.local` are filled
- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts successfully
- [ ] No console errors on startup

### Database Connection
- [ ] Supabase schema executed successfully
- [ ] Can connect to Supabase from app
- [ ] Tables visible in Supabase dashboard
- [ ] Default templates inserted

### Whop Integration
- [ ] App loads in Whop iframe (localhost mode)
- [ ] User authentication works
- [ ] Username displays correctly
- [ ] Access level shows (customer/admin)
- [ ] No CORS errors

## Feature Testing

### 1. User Management
- [ ] New user auto-created on first visit
- [ ] User record in Supabase users table
- [ ] Default starter tier assigned
- [ ] Initial credits granted (15 for starter)
- [ ] User data persists across sessions

### 2. Prompt Builder - Simple Mode
- [ ] Can type in natural language prompt
- [ ] Character counter works (if added)
- [ ] "Enhance with AI" button enabled when prompt exists
- [ ] Can clear prompt
- [ ] Prompt saves state during mode switching

### 3. Prompt Builder - AI Enhancement
- [ ] Click "Enhance with AI" sends API request
- [ ] Loading state shows during enhancement
- [ ] JSON response populates JSON editor
- [ ] Automatically switches to JSON mode
- [ ] Error handling if API fails

### 4. Prompt Builder - JSON Mode
- [ ] Template buttons visible
- [ ] Click template loads JSON in editor
- [ ] Selected template highlights
- [ ] Can manually edit JSON
- [ ] JSON syntax is preserved
- [ ] Placeholder variables visible ({{...}})

### 5. Template System
- [ ] "Cinematic Scene" template loads
- [ ] "Product Demo" template loads
- [ ] "Tutorial/Educational" template loads
- [ ] Templates have all required sections:
  - [ ] scene
  - [ ] camera
  - [ ] motion
  - [ ] lighting
- [ ] Can customize template JSON

### 6. Video Settings
- [ ] Quality dropdown shows options
- [ ] Pro quality disabled for starter tier
- [ ] Duration selector works (4s/8s/12s)
- [ ] Resolution dropdown shows options
- [ ] Credit calculation updates dynamically
- [ ] "Insufficient Credits" shows when needed
- [ ] "Generate Video" button enables/disables correctly

### 7. Credit System
- [ ] Credits remaining displays correctly
- [ ] Credit cost calculated properly:
  - [ ] Standard 4s = 1 credit
  - [ ] Standard 8s = 2 credits
  - [ ] Standard 12s = 3 credits
  - [ ] Pro 4s = 2 credits
  - [ ] Pro 8s = 4 credits
  - [ ] Pro 12s = 6 credits
- [ ] Can't generate if insufficient credits
- [ ] Credits deducted on generation start
- [ ] Credits refunded if generation fails

### 8. Video Generation Flow
- [ ] Step indicator updates correctly
- [ ] Can navigate back from settings to prompt
- [ ] Generate button triggers API call
- [ ] Loading state shows
- [ ] Redirects to status page
- [ ] Job ID displayed

### 9. Video Status Tracking
- [ ] Status polling starts automatically
- [ ] Progress bar animates
- [ ] Elapsed time counter works
- [ ] Status messages update:
  - [ ] "Queued" for pending
  - [ ] "Generating..." for processing
  - [ ] "Ready!" for completed
  - [ ] Error message for failed
- [ ] Stops polling when complete
- [ ] Transitions to complete screen

### 10. Video Complete
- [ ] Video player loads
- [ ] Video plays correctly
- [ ] Controls work (play/pause/volume)
- [ ] Download button works
- [ ] "Generate Another" resets flow
- [ ] Updated credit balance shows

### 11. Video Gallery
- [ ] Gallery loads user's videos
- [ ] Empty state shows when no videos
- [ ] Video cards display:
  - [ ] Video thumbnail/preview
  - [ ] Prompt text (truncated)
  - [ ] Model type
  - [ ] Duration
  - [ ] Credits used
  - [ ] Creation date
- [ ] Status indicators for pending/processing
- [ ] Completed videos playable
- [ ] Download buttons work

### 12. Error Handling
- [ ] Network errors show user-friendly messages
- [ ] API errors display properly
- [ ] Invalid JSON shows validation error
- [ ] Insufficient credits prevents generation
- [ ] Failed generations show error details
- [ ] Can dismiss error messages

### 13. UI/UX
- [ ] Responsive design works on mobile
- [ ] Dark mode works (if implemented)
- [ ] Loading states are clear
- [ ] Buttons have hover effects
- [ ] Form inputs are accessible
- [ ] Tab navigation works
- [ ] No layout shift on load

## API Testing

### `/api/enhance-prompt`
```bash
curl -X POST http://localhost:3000/api/enhance-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A sunset over mountains"}'
```

- [ ] Returns JSON structure
- [ ] Has scene, camera, motion, lighting sections
- [ ] Error handling for empty prompt
- [ ] Error handling for invalid request

### `/api/generate-video`
```bash
curl -X POST http://localhost:3000/api/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "prompt": "test prompt",
    "jsonPrompt": {},
    "model": "sora-2",
    "duration": 12,
    "resolution": "1280x720"
  }'
```

- [ ] Returns job ID
- [ ] Deducts credits from user
- [ ] Creates video record in database
- [ ] Error handling for insufficient credits
- [ ] Error handling for missing fields

### `/api/check-status/[jobId]`
```bash
curl http://localhost:3000/api/check-status/test-job-id
```

- [ ] Returns status object
- [ ] Updates database record
- [ ] Handles completed jobs
- [ ] Handles failed jobs
- [ ] Error handling for invalid job ID

### `/api/videos`
```bash
curl http://localhost:3000/api/videos?userId=test-user-id
```

- [ ] Returns array of videos
- [ ] Sorted by creation date (newest first)
- [ ] Includes all video metadata
- [ ] Empty array when no videos
- [ ] Error handling for invalid user ID

## Database Testing

### Users Table
```sql
-- Run in Supabase SQL Editor
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

- [ ] New users created correctly
- [ ] Whop user ID is unique
- [ ] Subscription tier set
- [ ] Credits balance tracked
- [ ] Timestamps auto-updated

### Videos Table
```sql
SELECT * FROM videos ORDER BY created_at DESC LIMIT 10;
```

- [ ] Video records created
- [ ] Status transitions work (pending → processing → completed)
- [ ] Video URLs stored
- [ ] Credits used recorded
- [ ] Foreign key to users works

### Templates Table
```sql
SELECT * FROM templates WHERE is_public = true;
```

- [ ] Default templates exist
- [ ] JSON structure valid
- [ ] Usage count increments (if implemented)

## Integration Testing

### Full End-to-End Flow
1. [ ] User opens app in Whop
2. [ ] User sees welcome screen with credit balance
3. [ ] User selects "Cinematic Scene" template
4. [ ] User customizes JSON prompt
5. [ ] User clicks "Generate Video"
6. [ ] User selects settings (Pro, 12s, 16:9)
7. [ ] System checks credits (need 6)
8. [ ] User confirms generation
9. [ ] Credits deducted (balance updates)
10. [ ] Job submitted to Sora 2
11. [ ] Status polling begins
12. [ ] Progress updates every 10s
13. [ ] After ~3 minutes, video completes
14. [ ] Video player loads
15. [ ] User watches video
16. [ ] User downloads video
17. [ ] Video appears in gallery
18. [ ] User generates another video

### Tier Restrictions
- [ ] Starter tier can't select Pro quality
- [ ] Pro tier can select all qualities
- [ ] Max tier has full access
- [ ] Tier upgrade reflects immediately

### Credit Edge Cases
- [ ] Can generate when exactly enough credits
- [ ] Can't generate with 1 credit less than needed
- [ ] Refund works if generation fails
- [ ] Balance updates in real-time

## Performance Testing

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Template selection instant
- [ ] Mode switching instant
- [ ] API calls return < 2 seconds
- [ ] Status polling every 10s (not faster)

### Database Performance
- [ ] User lookup fast (< 100ms)
- [ ] Video history loads < 1 second
- [ ] Credit operations atomic
- [ ] No N+1 query issues

### Memory Leaks
- [ ] No memory leaks in polling
- [ ] Intervals cleaned up on unmount
- [ ] No zombie listeners

## Security Testing

### Authentication
- [ ] Can't access without Whop authentication
- [ ] User ID verified on every request
- [ ] Can't access other users' videos
- [ ] API routes protected

### Input Validation
- [ ] SQL injection prevented (using Supabase parameterized queries)
- [ ] XSS prevented (React auto-escapes)
- [ ] JSON parsing doesn't crash app
- [ ] File upload validation (if added)

### API Security
- [ ] OpenAI API key not exposed to client
- [ ] Supabase service role key server-side only
- [ ] Whop credentials secure
- [ ] No sensitive data in console logs

### Rate Limiting
- [ ] Consider adding rate limiting (V2)
- [ ] Monitor for abuse
- [ ] Set reasonable quotas

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)
- [ ] Responsive design works

### Whop Iframe
- [ ] Works in Whop desktop
- [ ] Works in Whop mobile app
- [ ] No iframe-specific issues

## Accessibility

### Basic Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Labels on form inputs
- [ ] Color contrast sufficient
- [ ] Screen reader friendly (test with VoiceOver/NVDA)

## Pre-Production Checklist

### Code Quality
- [ ] No console.log() in production code
- [ ] No commented-out code
- [ ] No TODO comments
- [ ] TypeScript errors resolved
- [ ] Linting passes
- [ ] Build succeeds (`pnpm build`)

### Environment
- [ ] .env.local not committed to git
- [ ] .gitignore includes sensitive files
- [ ] Environment variables documented
- [ ] Production vs development config separated

### Monitoring
- [ ] Error boundaries in place
- [ ] Logging configured
- [ ] Analytics ready (optional)
- [ ] Alerts set up for API costs

## Production Testing

### After Deployment
- [ ] App loads from Vercel URL
- [ ] All environment variables work
- [ ] Database connects
- [ ] OpenAI API works
- [ ] Whop integration works
- [ ] SSL certificate valid
- [ ] No mixed content warnings

### Real User Testing
- [ ] Create test whop
- [ ] Add app to whop
- [ ] Test with real Whop account
- [ ] Test with real OpenAI API
- [ ] Generate actual video
- [ ] Verify costs match expectations

### Analytics
- [ ] Track installations
- [ ] Track generations
- [ ] Track errors
- [ ] Monitor API usage
- [ ] Monitor costs

---

**Testing Status:** Not Started
**Last Updated:** Ready for testing
**Sign-off:** ________________
