# Sora 2 Pro - AI Video Generator for Whop

Transform your ideas into stunning AI videos with advanced JSON prompting. First Sora 2 app on the Whop marketplace!

## Features

- **Smart Prompt Builder**: Simple mode for beginners, JSON mode for advanced users
- **Template Library**: Pre-built templates for Cinematic, Product Demo, and Tutorial videos
- **AI Prompt Enhancement**: Convert natural language to optimized JSON prompts
- **Real-time Generation**: Track video generation progress with live status updates
- **Video Gallery**: Browse and download all your generated videos
- **Credit System**: Subscription-based pricing with transparent credit usage
- **Multi-tier Plans**: Starter, Pro, and Max plans with different quality options

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: Whop SDK with iframe integration
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI Sora 2 API
- **Deployment**: Vercel
- **Forms**: React Hook Form with Zod validation

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
# Whop
WHOP_API_KEY="your_key"
NEXT_PUBLIC_WHOP_APP_ID="your_app_id"

# OpenAI
OPENAI_API_KEY="your_openai_key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_key"
```

### 3. Set Up Database

Run `supabase-schema.sql` in your Supabase SQL editor to create tables.

### 4. Start Development Server

```bash
pnpm dev
```

## Full Setup Guide

See [SETUP.md](./SETUP.md) for complete setup instructions including:
- Whop app configuration
- Supabase database setup
- OpenAI API access
- Deployment to Vercel
- Submitting to Whop App Store

## Project Structure

```
/app
  /api
    /enhance-prompt      # AI prompt enhancement
    /generate-video      # Video generation
    /check-status/[id]   # Job status polling
    /videos             # User video history
  /components
    PromptBuilder.tsx   # Prompt input UI
    VideoSettings.tsx   # Generation settings
    VideoStatus.tsx     # Progress tracking
    VideoGallery.tsx    # Video history grid
  /experiences/[id]
    page.tsx           # Main app page
    VideoGenerator.tsx # Main logic component

/lib
  /types
    database.ts        # TypeScript types
  credits.ts           # Credit management
  users.ts            # User operations
  sora.ts             # OpenAI Sora integration
  supabase.ts         # Database client
  whop-sdk.ts         # Whop SDK setup
```

## API Routes

### `POST /api/enhance-prompt`
Convert natural language to JSON prompt structure

### `POST /api/generate-video`
Start a new Sora 2 video generation

### `GET /api/check-status/[jobId]`
Poll video generation status

### `GET /api/videos`
Fetch user's video history

## Pricing Structure

| Tier | Price | Credits | Features |
|------|-------|---------|----------|
| **Starter** | $29/mo | 15 standard | 720p, 12s max |
| **Pro** | $79/mo | 30 std + 10 pro | 1080p, mix quality |
| **Max** | $199/mo | 60 std + 20 pro | Best quality, most credits |

## Credit Costs

**Standard (720p - Sora 2):**
- 4 seconds = 1 credit
- 8 seconds = 2 credits
- 12 seconds = 3 credits

**Pro (1080p - Sora 2 Pro):**
- 4 seconds = 2 credits
- 8 seconds = 4 credits
- 12 seconds = 6 credits

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Update Whop App Settings

After deployment, update your Whop app's Base URL to your Vercel deployment URL.

## First Mover Advantage

This is the **first Sora 2 app** on the Whop marketplace. The AI category has ~20 apps total, with zero video generation tools. This presents a significant opportunity to capture early adopters and establish market presence.

## Contributing

This is V1 MVP. Future enhancements:
- Google Drive auto-upload
- Custom template creation
- Batch video generation
- Advanced analytics dashboard
- Video remixing tools

## License

Private - Commercial Use

## Support

For issues or questions:
- Whop Docs: https://docs.whop.com
- OpenAI Sora Docs: https://platform.openai.com/docs/guides/video-generation
