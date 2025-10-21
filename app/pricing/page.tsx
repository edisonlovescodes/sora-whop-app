// app/pricing/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import EmbeddedCheckout from "@/app/components/EmbeddedCheckout";
import { getOrCreateUser } from "@/lib/users";
import { CREDIT_COSTS } from "@/lib/types/database";

export default async function PricingPage() {
  const headersList = await headers();
  const whopUserToken = headersList.get("x-whop-user-token") || "";

  const { user } = await getOrCreateUser(whopUserToken);

  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID || "";
  const installUrl = appId ? `https://whop.com/apps/${appId}/install/` : "#";
  const basicUrl = process.env.NEXT_PUBLIC_WHOP_PRICE_BASIC_URL || installUrl;
  const proUrl = process.env.NEXT_PUBLIC_WHOP_PRICE_PRO_URL || installUrl;
  const maxUrl = process.env.NEXT_PUBLIC_WHOP_PRICE_MAX_URL || installUrl;
  const topup10 = process.env.NEXT_PUBLIC_WHOP_TOPUP_10_URL || installUrl;
  const topup25 = process.env.NEXT_PUBLIC_WHOP_TOPUP_25_URL || installUrl;
  const topup50 = process.env.NEXT_PUBLIC_WHOP_TOPUP_50_URL || installUrl;

  const std = CREDIT_COSTS["sora-2"]; // {4:1, 8:2, 12:3}
  const pro = CREDIT_COSTS["sora-2-pro"]; // {4:2, 8:4, 12:6}

  return (
    <div className="min-h-screen bg-[#141212] text-[#FCF6F5]">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/discover" className="text-sm text-[#FCF6F5]/80 hover:underline">
            ← Back
          </Link>
          <div className="rounded-full border border-[#FA4616]/30 bg-[#FA4616]/10 px-3 py-1 text-xs">
            Credits: <span className="font-semibold">{user?.credits_remaining ?? 0}</span>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold">Simple, Transparent Pricing</h1>
          <p className="mt-2 text-[#FCF6F5]/80">
            Pay for what you create. No hidden fees, no surprises.
          </p>
        </header>

        {/* Cost per duration card */}
        <section className="mb-8 rounded-3xl border border-[#FA4616]/20 bg-white/5 p-5">
          <h2 className="text-lg font-bold">How Credits Work</h2>
          <p className="mt-1 text-sm text-[#FCF6F5]/80">
            Standard quality costs fewer credits. Pro delivers maximum fidelity.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#141212] p-4">
              <h3 className="font-semibold">Sora 2 Standard (720p)</h3>
              <ul className="mt-2 space-y-1 text-sm text-[#FCF6F5]/90">
                <li>4 seconds — <span className="font-semibold">{std[4]} credit</span></li>
                <li>8 seconds — <span className="font-semibold">{std[8]} credits</span></li>
                <li>12 seconds — <span className="font-semibold">{std[12]} credits</span></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141212] p-4">
              <h3 className="font-semibold">Sora 2 Pro (1080p)</h3>
              <ul className="mt-2 space-y-1 text-sm text-[#FCF6F5]/90">
                <li>4 seconds — <span className="font-semibold">{pro[4]} credits</span></li>
                <li>8 seconds — <span className="font-semibold">{pro[8]} credits</span></li>
                <li>12 seconds — <span className="font-semibold">{pro[12]} credits</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Free */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-[#141212] p-6">
            <div className="text-sm text-[#FCF6F5]/80">Free</div>
            <div className="mt-2 text-3xl font-semibold">$0</div>
            <p className="mt-3 text-sm text-[#FCF6F5]/80">Try with 2 credits</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ 1× 720p 8s render</li>
              <li>✓ Prompt + JSON builder</li>
              <li>✓ Copy/Download JSON</li>
            </ul>
            <div className="mt-6">
              <span className="inline-block rounded-full border border-white/20 px-4 py-2 text-sm text-[#FCF6F5]/80">
                Your Current Plan
              </span>
            </div>
          </div>

          {/* Basic */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-[#141212] p-6">
            <div className="text-sm text-[#FCF6F5]/80">Basic</div>
            <div className="mt-2 text-3xl font-semibold">$19</div>
            <p className="mt-3 text-sm text-[#FCF6F5]/80">Monthly</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ 25 credits per month</li>
              <li>✓ All Free features</li>
              <li>✓ Priority queue</li>
            </ul>
            <div className="mt-6">
              <EmbeddedCheckout url="https://whop.com/checkout/plan_X7AiyljbPxgwd?d2c=true" label="Upgrade Now" />
            </div>
          </div>

          {/* Pro (Most Popular) */}
          <div className="relative flex flex-col rounded-3xl border border-[#FA4616] bg-[#141212] p-6 shadow-[0_0_0_1px_rgba(250,70,22,0.3)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FA4616] px-3 py-1 text-xs font-semibold text-[#141212]">
              Most Popular
            </span>
            <div className="text-sm text-[#FCF6F5]/80">Pro</div>
            <div className="mt-2 text-3xl font-semibold">$99</div>
            <p className="mt-3 text-sm text-[#FCF6F5]/80">Monthly</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ 250 credits per month</li>
              <li>✓ Pro 1080p quality access</li>
              <li>✓ Premium support</li>
            </ul>
            <div className="mt-6">
              <EmbeddedCheckout url={proUrl} label="Upgrade Now" />
            </div>
          </div>

          {/* Max */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-[#141212] p-6">
            <div className="text-sm text-[#FCF6F5]/80">Max</div>
            <div className="mt-2 text-3xl font-semibold">$399</div>
            <p className="mt-3 text-sm text-[#FCF6F5]/80">Monthly</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ 1,000 credits per month</li>
              <li>✓ Dedicated support</li>
              <li>✓ Team collaboration</li>
            </ul>
            <div className="mt-6">
              <EmbeddedCheckout url={maxUrl} label="Upgrade Now" />
            </div>
          </div>
        </section>

        {/* Top up one-time credits */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-bold">Need More Credits?</h2>
          <p className="mt-1 text-sm text-[#FCF6F5]/80">One-time credit packs. No subscription required.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#141212] p-4">
              <div className="text-sm text-[#FCF6F5]/80">Starter Pack</div>
              <div className="mt-1 text-2xl font-semibold">$10</div>
              <p className="mt-1 text-sm text-[#FA4616] font-semibold">5 credits</p>
              <div className="mt-4">
                <EmbeddedCheckout url={topup10} label="Buy Now" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141212] p-4">
              <div className="text-sm text-[#FCF6F5]/80">Creator Pack</div>
              <div className="mt-1 text-2xl font-semibold">$25</div>
              <p className="mt-1 text-sm text-[#FA4616] font-semibold">14 credits</p>
              <div className="mt-4">
                <EmbeddedCheckout url={topup25} label="Buy Now" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141212] p-4">
              <div className="text-sm text-[#FCF6F5]/80">Pro Pack</div>
              <div className="mt-1 text-2xl font-semibold">$50</div>
              <p className="mt-1 text-sm text-[#FA4616] font-semibold">30 credits</p>
              <div className="mt-4">
                <EmbeddedCheckout url={topup50} label="Buy Now" />
              </div>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-[#FCF6F5]/60">
          All plans include access to the full platform. Credits never expire. Cancel anytime.
        </p>
      </main>
    </div>
  );
}
