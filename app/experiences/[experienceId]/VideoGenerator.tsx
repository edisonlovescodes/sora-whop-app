// app/experiences/[experienceId]/VideoGenerator.tsx
"use client";

import PromptBuilder, {
	type PromptChangePayload,
} from "@/app/components/PromptBuilder";
import VideoSettings, {
	type VideoGenerationSettings,
} from "@/app/components/VideoSettings";
import { VideoStatus } from "@/app/components/VideoStatus";
import { CREDIT_COSTS } from "@/lib/types/database";
import { useMemo, useState } from "react";

interface VideoGeneratorProps {
	userId: string;
	experienceId: string;
}

export function VideoGenerator({ userId, experienceId }: VideoGeneratorProps) {
	const [promptState, setPromptState] = useState<PromptChangePayload>({
		promptText: "",
	});
	const [settings, setSettings] = useState<VideoGenerationSettings>({
		model: "sora-2",
		resolution: "1280x720",
		duration: "4",
	});
	const [jobId, setJobId] = useState<string | null>(null);
	const [videoId, setVideoId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const jsonOnly = typeof window !== 'undefined' &&
      (process.env.NEXT_PUBLIC_JSON_ONLY === 'true');

	const creditsRequired = useMemo(() => {
		const durationKey = Number.parseInt(settings.duration, 10) as 4 | 8 | 12;
		return CREDIT_COSTS[settings.model][durationKey];
	}, [settings.duration, settings.model]);

	const handlePromptChange = (payload: PromptChangePayload) => {
		setPromptState(payload);
	};

	const modelLabel =
		settings.model === "sora-2" ? "Sora 2 Standard" : "Sora 2 Pro";
	const resolutionLabel =
		settings.resolution === "1280x720" ? "1280×720 Landscape" : "720×1280 Portrait";
	const durationSeconds = Number.parseInt(settings.duration, 10);
	const durationLabel = `${durationSeconds} second${
		durationSeconds === 1 ? "" : "s"
	}`;

    const handleGenerate = async () => {
        if (jsonOnly) return;
        const promptText = promptState.promptText.trim();

		if (!promptText) {
			setError("Add a prompt before generating your video.");
			setSuccessMessage(null);
			return;
		}

		try {
			setIsGenerating(true);
			setError(null);
			setSuccessMessage(null);

			const response = await fetch("/api/generate-video", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId,
					experienceId,
					prompt: promptText,
					jsonPrompt: promptState.jsonPrompt ?? null,
					model: settings.model,
					duration: settings.duration,
					resolution: settings.resolution,
				}),
			});

			const data = await response.json();
			if (!response.ok || !data.success) {
				throw new Error(data.error ?? "Failed to start video generation");
			}

			setJobId(data.jobId);
			setVideoId(data.videoId);
			setCreditsRemaining(
				typeof data.creditsRemaining === "number" ? data.creditsRemaining : null,
			);
			setSuccessMessage("Queued! Watch the status bar below.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error occurred.");
		} finally {
			setIsGenerating(false);
		}
	};

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <PromptBuilder onPromptChange={handlePromptChange} />

            <div className="flex flex-col gap-5">
                {!jsonOnly && <VideoSettings onSettingsChange={setSettings} />}

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-md shadow-black/10">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-white">{jsonOnly ? 'Export' : 'Summary'}</h2>
                        <p className="text-sm text-slate-300">
                          {jsonOnly ? 'Copy your JSON and paste into Sora.' : 'Looks good? Hit go.'}
                        </p>
                    </div>

                    {!jsonOnly && (
                    <dl className="mt-5 grid grid-cols-1 gap-2 text-sm text-slate-200">
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                            <dt className="text-slate-400">Model</dt>
                            <dd className="font-medium text-white">{modelLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                            <dt className="text-slate-400">Aspect</dt>
                            <dd className="font-medium text-white">{resolutionLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                            <dt className="text-slate-400">Duration</dt>
                            <dd className="font-medium text-white">{durationLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sky-100">
                            <dt className="text-slate-200">Credits</dt>
                            <dd className="font-semibold">{creditsRequired}</dd>
                        </div>
                    </dl>
                    )}

                    {!jsonOnly ? (
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isGenerating ? (
                            <>
                                <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                                Starting render…
                            </>
                        ) : (
                            <>
                                <span className="h-2 w-2 rounded-full bg-white/80" />
                                Render clip
                            </>
                        )}
                    </button>
                    ) : (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => {
                            const json = JSON.stringify(
                              promptState.jsonPrompt ?? {},
                              null,
                              2,
                            );
                            navigator.clipboard.writeText(json).catch(() => {});
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-slate-200"
                        >
                          Copy JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([
                              JSON.stringify(
                                promptState.jsonPrompt ?? {},
                                null,
                                2,
                              ),
                            ], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'sora_prompt.json';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40"
                        >
                          Download JSON
                        </button>
                      </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            <p>{error}</p>
                            <a
                              href="/pricing"
                              className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-slate-200"
                            >
                              Get more credits
                            </a>
                        </div>
                    )}

					{successMessage && (
						<p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
							{successMessage}
						</p>
					)}

					{typeof creditsRemaining === "number" && (
						<p className="mt-4 text-xs text-slate-400">
							Credits after run:{" "}
							<span className="font-semibold text-slate-200">
								{creditsRemaining}
							</span>
						</p>
					)}

                    {!jsonOnly && jobId && videoId && (
                        <div className="mt-6">
                            <VideoStatus videoId={videoId} jobId={jobId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
