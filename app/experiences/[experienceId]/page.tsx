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
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        {/* Top bar with credits + Pricing */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm font-semibold">Sora 2 Studio</div>
          <div className="flex items-center gap-3">
            <a
              href="/pricing"
              className="hidden rounded-full border border-[#FA4616]/40 bg-[#FA4616]/10 px-3 py-1 text-xs font-semibold hover:bg-[#FA4616]/20 sm:inline"
            >
              Pricing
            </a>
            <div className="rounded-full border border-[#FA4616]/30 bg-[#FA4616]/10 px-3 py-1 text-xs">
              Credits: <span className="font-semibold">{user?.credits_remaining ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <header className="mb-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-md shadow-black/10">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#FA4616]">
            Make a clip
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Type it. Render it. Share it.
            </h1>
            <p className="text-sm text-[#FCF6F5]/80">
              Say your idea. We handle the rest.
            </p>
          </div>
        </header>

        <VideoGenerator userId={user.id} experienceId={experienceId} />

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10">
          <VideoGallery userId={user.id} />
        </section>
      </main>
    </div>
  );
}
