# Get Sora 2 Working NOW with Replicate

Since OpenAI requires 90-day verification, use Replicate instead - **works immediately, no verification!**

## ⚡ Quick Setup (5 minutes)

### Step 1: Sign Up for Replicate

1. Go to: https://replicate.com/signin
2. Sign up with GitHub or Email
3. **You get $5 free credit to start!**

### Step 2: Get Your API Token

1. Go to: https://replicate.com/account/api-tokens
2. Click "Create token"
3. Copy the token (starts with `r8_...`)

### Step 3: Add to Your App

Open `.env.local` and update:

```bash
# Turn OFF mock mode
NEXT_PUBLIC_MOCK_MODE="false"

# Turn ON Replicate
NEXT_PUBLIC_USE_REPLICATE="true"
REPLICATE_API_TOKEN="r8_your_actual_token_here"
```

### Step 4: Restart Dev Server

```bash
# Press Ctrl+C to stop current server
# Then:
pnpm dev
```

### Step 5: Test!

1. Go to your app in Whop
2. Create a prompt
3. Generate a video
4. **It will use REAL Sora 2!** 🎉

---

## 💰 Pricing

**Same as OpenAI:**
- Standard (720p): $0.10/second = $1.20 for 12s
- Pro (1080p): $0.50/second = $6.00 for 12s

**Free Credit:**
- You get $5 free
- That's ~4 standard videos or 1 pro video
- Perfect for testing!

---

## 🔍 Verify It's Working

After generating a video, check the browser console (F12):

```
📹 Using Replicate API for Sora 2
```

If you see this, you're using Replicate successfully!

---

## 📊 Monitor Usage

1. Go to: https://replicate.com/account
2. See "Usage" tab
3. Monitor your spend
4. Add payment method when free credit runs out

---

## 🚨 Troubleshooting

**Error: "REPLICATE_API_TOKEN not set"**
- Make sure you added the token to `.env.local`
- Make sure there are no quotes around the token value
- Restart dev server after adding

**Error: "Unauthorized"**
- Check your token is correct
- Make sure it starts with `r8_`
- Try regenerating the token

**Videos not generating:**
- Check Replicate dashboard for errors
- Ensure you have credit available
- Check browser console for error messages

---

## ✅ Benefits of Replicate

✅ No verification - works immediately
✅ Same Sora 2 models as OpenAI
✅ Same quality
✅ Free $5 credit
✅ Pay-as-you-go pricing
✅ Good documentation
✅ Fast support

---

## 🔄 Switch Back to OpenAI Later

When your organization gets verified (in 90 days), just update `.env.local`:

```bash
NEXT_PUBLIC_MOCK_MODE="false"
NEXT_PUBLIC_USE_REPLICATE="false"
# OpenAI API KEY already set
```

---

## 🎯 Ready to Launch!

With Replicate, you can:
- ✅ Generate real Sora 2 videos TODAY
- ✅ Test your full app flow
- ✅ Show to potential customers
- ✅ Launch your Whop app
- ✅ Start making money!

No need to wait 90 days!

---

**Questions?** Check [ALTERNATIVE_APIS.md](./ALTERNATIVE_APIS.md) for more options.
