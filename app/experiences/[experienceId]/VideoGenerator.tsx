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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <PromptBuilder onPromptChange={handlePromptChange} />

            <div className="flex flex-col gap-6">
                {!jsonOnly && <VideoSettings onSettingsChange={setSettings} />}

                <div className="rounded-3xl border border-[#FA4616]/20 bg-[#141212] p-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-[#FCF6F5]">{jsonOnly ? 'Export' : 'Summary'}</h2>
                        <p className="text-sm text-[#FCF6F5]/70">
                          {jsonOnly ? 'Copy your JSON and paste into Sora' : 'Review and render'}
                        </p>
                    </div>

                    {!jsonOnly && (
                    <dl className="mt-5 grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center justify-between rounded-2xl border border-[#FA4616]/20 bg-[#141212]/50 px-4 py-3">
                            <dt className="text-[#FCF6F5]/70">Model</dt>
                            <dd className="font-bold text-[#FCF6F5]">{modelLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-[#FA4616]/20 bg-[#141212]/50 px-4 py-3">
                            <dt className="text-[#FCF6F5]/70">Aspect</dt>
                            <dd className="font-bold text-[#FCF6F5]">{resolutionLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-[#FA4616]/20 bg-[#141212]/50 px-4 py-3">
                            <dt className="text-[#FCF6F5]/70">Duration</dt>
                            <dd className="font-bold text-[#FCF6F5]">{durationLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3">
                            <dt className="font-semibold text-[#FCF6F5]">Credits</dt>
                            <dd className="font-bold text-[#FA4616]">{creditsRequired}</dd>
                        </div>
                    </dl>
                    )}

                    {!jsonOnly ? (
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FA4616] px-6 py-3 text-sm font-bold text-[#141212] shadow-lg hover:bg-[#FA4616]/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isGenerating ? (
                            <>
                                <span className="h-2 w-2 animate-ping rounded-full bg-[#141212]" />
                                Starting render…
                            </>
                        ) : (
                            <>
                                <span className="h-2 w-2 rounded-full bg-[#141212]/80" />
                                Render Clip
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
                          className="inline-flex items-center justify-center rounded-full bg-[#FA4616] px-6 py-3 text-sm font-bold text-[#141212] shadow-lg hover:bg-[#FA4616]/90"
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
                          className="inline-flex items-center justify-center rounded-full border border-[#FA4616]/40 px-6 py-3 text-sm font-bold text-[#FA4616] hover:bg-[#FA4616]/10"
                        >
                          Download JSON
                        </button>
                      </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3 text-sm text-[#FA4616]">
                            <p>{error}</p>
                            <a
                              href="/pricing"
                              className="mt-3 inline-flex items-center justify-center rounded-full bg-[#FA4616] px-4 py-2 text-xs font-bold text-[#141212] hover:bg-[#FA4616]/90"
                            >
                              Get More Credits
                            </a>
                        </div>
                    )}

					{successMessage && (
						<p className="mt-4 rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3 text-sm text-[#FCF6F5]">
							{successMessage}
						</p>
					)}

					{typeof creditsRemaining === "number" && (
						<p className="mt-4 text-xs text-[#FCF6F5]/70">
							Credits after run:{" "}
							<span className="font-bold text-[#FA4616]">
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
