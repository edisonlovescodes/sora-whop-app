// app/components/VideoStatus.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type VideoStatusState = "pending" | "processing" | "completed" | "failed";

const STATUS_META: Record<
	VideoStatusState,
	{
		label: string;
		description: string;
		accent: string;
	}
> = {
	pending: {
		label: "Queued up",
		description: "Waiting for the render slot.",
		accent: "bg-amber-400",
	},
	processing: {
		label: "Rendering",
		description: "Frames are cooking.",
		accent: "bg-sky-400",
	},
	completed: {
		label: "All done",
		description: "Clip is ready to play.",
		accent: "bg-emerald-400",
	},
	failed: {
		label: "Didn’t finish",
		description: "Try again or tweak the prompt.",
		accent: "bg-rose-400",
	},
};

const PROGRESS_STEPS: Array<Exclude<VideoStatusState, "failed">> = [
	"pending",
	"processing",
	"completed",
];

export function VideoStatus({
	videoId,
	jobId,
}: {
	videoId: string;
	jobId: string;
}) {
	const [status, setStatus] = useState<VideoStatusState>("pending");
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState<number | null>(null);
	const [lastUpdateAt, setLastUpdateAt] = useState<number | null>(null);

	useEffect(() => {
		if (!jobId || !videoId) return;

		const pollInterval = setInterval(async () => {
			try {
				const response = await fetch(
					`/api/check-status/${jobId}?jobId=${jobId}&videoId=${videoId}`,
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to fetch status");
				}

				if (data.success) {
					setStatus(data.status.status);
					setVideoUrl(data.status.videoUrl || null);
					setError(data.status.error || null);
					setProgress(
						typeof data.status.progress === "number"
							? Math.min(100, Math.max(0, Math.round(data.status.progress)))
							: null,
					);
					setLastUpdateAt(Date.now());

					if (
						data.status.status === "completed" ||
						data.status.status === "failed"
					) {
						clearInterval(pollInterval);
					}
				} else {
					throw new Error(data.error || "Unknown status response");
				}
			} catch (err) {
				console.error("Polling error:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
				setStatus("failed");
				clearInterval(pollInterval);
			}
		}, 5000);

		return () => clearInterval(pollInterval);
	}, [jobId, videoId]);

	const currentStepIndex = useMemo(
		() => PROGRESS_STEPS.findIndex((step) => step === status),
		[status],
	);

	const statusMeta = STATUS_META[status];
	const minutesSinceUpdate =
		lastUpdateAt === null ? null : Math.floor((Date.now() - lastUpdateAt) / 60000);
	const showLagWarning =
		(status === "processing" || status === "pending") &&
		typeof minutesSinceUpdate === "number" &&
		minutesSinceUpdate >= 4;
	const dynamicDescription =
			status === "processing" && typeof progress === "number"
				? `Render ${progress}% done.`
			: statusMeta.description;

	return (
		<div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-md shadow-black/10">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
						Render status
					</p>
					<h3 className="mt-1 text-lg font-semibold text-white">
						{statusMeta.label}
					</h3>
					<p className="mt-2 text-sm text-slate-300">{dynamicDescription}</p>
				</div>
				<span
					className={`inline-flex h-2 w-16 rounded-full ${statusMeta.accent} opacity-90`}
					aria-hidden="true"
				/>
			</div>

			<div className="mt-5">
				<div className="flex items-center gap-3">
					{PROGRESS_STEPS.map((step, index) => {
						const isComplete = currentStepIndex > index || status === "completed";
						const isActive = currentStepIndex === index;

						return (
							<div key={step} className="flex-1">
								<div
									className={`h-1.5 rounded-full transition ${
										isComplete || isActive
											? "bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"
											: "bg-white/10"
									}`}
								/>
								<p
									className={`mt-2 text-xs font-medium uppercase tracking-wide ${
										isActive
											? "text-white"
											: isComplete
											? "text-slate-300"
											: "text-slate-500"
									}`}
								>
									{STATUS_META[step].label}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{status === "failed" && (
				<p className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
					{error ?? "The render could not be completed. Please try again."}
				</p>
			)}

			{status === "processing" && (
				<div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
					<span className="h-2 w-2 animate-ping rounded-full bg-sky-300" />
					{typeof progress === "number"
						? `${progress}% and climbing…`
						: "Sora is stitching frames…"}
				</div>
			)}

			{showLagWarning && (
				<p className="mt-3 text-xs text-amber-200">
					Running long. Peek at Replicate or restart if needed.
				</p>
			)}

			{status === "completed" && videoUrl && (
				<div className="mt-6 space-y-4">
					<div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60">
						<video
							src={videoUrl}
							controls
							className="h-full w-full object-cover"
						>
							<track kind="captions" />
						</video>
					</div>
					<div className="flex flex-wrap gap-3">
						<a
							className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:border-white/40"
							href={videoUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							Open in new tab
						</a>
						<a
							className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
							href={videoUrl}
							download
						>
							Download clip
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
