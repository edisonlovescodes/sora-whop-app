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
		label: "In Queue",
		description: "Your video is waiting to be processed.",
		accent: "bg-amber-400",
	},
	processing: {
		label: "Generating",
		description: "AI is creating your video.",
		accent: "bg-sky-400",
	},
	completed: {
		label: "Complete",
		description: "Your video is ready to watch and download.",
		accent: "bg-emerald-400",
	},
	failed: {
		label: "Generation Failed",
		description: "Something went wrong. Please try again.",
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
				? `${progress}% complete. Almost there!`
			: statusMeta.description;

	return (
		<div className="rounded-2xl border border-[#FA4616]/20 bg-[#141212] p-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p className="text-xs font-bold uppercase tracking-wider text-[#FA4616]">
						Render Status
					</p>
					<h3 className="mt-1 text-lg font-bold text-[#FCF6F5]">
						{statusMeta.label}
					</h3>
					<p className="mt-2 text-sm text-[#FCF6F5]/70">{dynamicDescription}</p>
				</div>
				<span
					className={`inline-flex h-2 w-16 rounded-full ${statusMeta.accent} opacity-90`}
					aria-hidden="true"
				/>
			</div>

			<div className="mt-6">
				<div className="flex items-center gap-3">
					{PROGRESS_STEPS.map((step, index) => {
						const isComplete = currentStepIndex > index || status === "completed";
						const isActive = currentStepIndex === index;

						return (
							<div key={step} className="flex-1">
								<div
									className={`h-2 rounded-full transition ${
										isComplete || isActive
											? "bg-[#FA4616]"
											: "bg-[#FA4616]/20"
									}`}
								/>
								<p
									className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
										isActive
											? "text-[#FA4616]"
											: isComplete
											? "text-[#FCF6F5]"
											: "text-[#FCF6F5]/50"
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
				<p className="mt-4 rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3 text-sm text-[#FA4616]">
					{error ?? "Video generation failed. Please try again or contact support if the issue persists."}
				</p>
			)}

			{status === "processing" && (
				<div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3 text-sm text-[#FCF6F5]">
					<span className="h-2 w-2 animate-ping rounded-full bg-[#FA4616]" />
					{typeof progress === "number"
						? `${progress}% complete—hang tight!`
						: "Processing your video..."}
				</div>
			)}

			{showLagWarning && (
				<p className="mt-3 text-xs text-[#FA4616]/70">
					This is taking longer than usual. Your video is still processing.
				</p>
			)}

			{status === "completed" && videoUrl && (
				<div className="mt-6 space-y-4">
					<div className="overflow-hidden rounded-2xl border border-[#FA4616]/20 bg-black/80">
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
							className="inline-flex items-center justify-center rounded-full border border-[#FA4616]/40 px-5 py-2 text-sm font-bold text-[#FA4616] transition hover:bg-[#FA4616]/10"
							href={videoUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							View Full Size
						</a>
						<a
							className="inline-flex items-center justify-center rounded-full bg-[#FA4616] px-5 py-2 text-sm font-bold text-[#141212] transition hover:bg-[#FA4616]/90"
							href={videoUrl}
							download
						>
							Download Video
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
