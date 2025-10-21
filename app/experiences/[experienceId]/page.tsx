// app/experiences/[experienceId]/page.tsx
import { headers } from "next/headers";
import { getOrCreateUser } from "@/lib/users";
import { VideoGenerator } from "./VideoGenerator";
import VideoGallery from "@/app/components/VideoGallery";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  // Debug flag removed per request; always render the full experience UI

  const headersList = await headers();
  const whopUserToken = headersList.get('x-whop-user-token') || '';

  const { experienceId } = await params;
  const { user, error } = await getOrCreateUser(whopUserToken);

  if (error || !user) {
    return <div>Error: User not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#141212] text-[#FCF6F5]">
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {/* Top bar with credits + Pricing */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight text-[#FCF6F5]">Sora 2 Studio</div>
          <div className="flex items-center gap-3">
            <a
              href="/pricing"
              className="hidden rounded-full border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-1.5 text-xs font-semibold text-[#FA4616] transition-colors hover:bg-[#FA4616]/20 sm:inline"
            >
              Pricing
            </a>
            <div className="rounded-full border border-[#FA4616]/30 bg-[#FA4616]/10 px-4 py-1.5 text-xs font-semibold text-[#FCF6F5]">
              <span className="text-[#FCF6F5]/70">Credits:</span> <span className="text-[#FA4616]">{user?.credits_remaining ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <header className="mb-10 rounded-3xl border border-[#FA4616]/20 bg-gradient-to-br from-[#FA4616]/10 via-transparent to-transparent p-8">
          <span className="inline-block rounded-full bg-[#FA4616]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FA4616]">
            Powered by Sora 2
          </span>
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create Professional Videos in Seconds
            </h1>
            <p className="text-base text-[#FCF6F5]/70 max-w-2xl">
              Describe your vision. Our AI brings it to life. No cameras, no crew, no complexity—just stunning videos ready to share.
            </p>
          </div>
        </header>

        <VideoGenerator userId={user.id} experienceId={experienceId} />

        <section className="mt-12 rounded-3xl border border-[#FA4616]/20 bg-[#141212] p-6">
          <VideoGallery userId={user.id} />
        </section>
      </main>
    </div>
  );
}
