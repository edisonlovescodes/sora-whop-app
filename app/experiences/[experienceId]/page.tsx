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
  // Debug flag: render a blank white screen to validate the correct build is loaded
  if (process.env.NEXT_PUBLIC_DEBUG_WHITE === 'true') {
    return (
      <div className="min-h-screen bg-white" />
    );
  }

  const headersList = await headers();
  const whopUserToken = headersList.get('x-whop-user-token') || '';

  const { experienceId } = await params;
  const { user, error } = await getOrCreateUser(whopUserToken);

  if (error || !user) {
    return <div>Error: User not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-md shadow-black/10">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-300">
            Make a clip
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              Type it. Render it. Share it.
            </h1>
            <p className="text-sm text-slate-300">
              No deep settings. Just plug in an idea and hit generate.
            </p>
          </div>
        </header>

        <VideoGenerator userId={user.id} experienceId={experienceId} />

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/10">
          <VideoGallery userId={user.id} />
        </section>
      </main>
    </div>
  );
}
