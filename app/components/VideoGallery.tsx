"use client";

import { useEffect, useState } from "react";

interface Video {
	id: string;
	prompt_text: string;
	video_url: string | null;
	status: string;
	sora_model: string;
	duration_seconds: number;
	credits_used: number;
	created_at: string;
}

interface VideoGalleryProps {
	userId: string;
}

export default function VideoGallery({ userId }: VideoGalleryProps) {
	const [videos, setVideos] = useState<Video[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await fetch(`/api/videos?userId=${userId}`);
				const data = await response.json();

				if (data.success) {
					setVideos(data.videos);
				} else {
					setError(data.error ?? "Failed to load videos");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		fetchVideos();
	}, [userId]);

	if (loading) {
		return (
			<div className="w-full rounded-3xl border border-white/10 bg-slate-900/60 p-10 text-center text-slate-300">
				<div className="mx-auto h-10 w-10 rounded-full border-4 border-white/10 border-t-sky-400 animate-spin" />
				<p className="mt-6 text-sm text-slate-400">Loading clips…</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-center text-sm text-rose-100">
				{error}
			</div>
		);
	}

	if (videos.length === 0) {
		return (
				<div className="w-full rounded-3xl border border-white/10 bg-slate-900/60 p-10 text-center">
					<p className="text-sm text-slate-300">
						No clips yet—spin one up above.
					</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			<h3 className="mb-4 text-lg font-semibold text-white">
				Your clips ({videos.length})
			</h3>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{videos.map((video) => (
					<div
						key={video.id}
						className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-md shadow-black/15"
					>
						{/* Video Preview */}
						{video.video_url && video.status === "completed" ? (
							<div className="aspect-video bg-black/80">
								<video
									src={video.video_url}
									controls
									className="h-full w-full object-cover"
								>
									<track kind="captions" />
								</video>
							</div>
						) : (
							<div className="flex aspect-video items-center justify-center bg-slate-900/80">
								<div className="text-center text-sm text-slate-400">
									{video.status === "pending" && "Pending…"}
									{video.status === "processing" && (
										<div className="mx-auto h-8 w-8 rounded-full border-4 border-white/10 border-t-sky-400 animate-spin" />
									)}
									{video.status === "failed" && (
										<span className="text-rose-300">Failed</span>
									)}
								</div>
							</div>
						)}

						{/* Video Info */}
						<div className="flex flex-1 flex-col gap-3 p-5">
							<p className="line-clamp-2 text-sm text-white">
								{video.prompt_text}
							</p>

							<div className="flex items-center justify-between text-xs text-slate-300">
								<div>
									<span className="capitalize">{video.sora_model}</span> •{" "}
									{video.duration_seconds}s
								</div>
								<div>{video.credits_used} credits</div>
							</div>

							<p className="text-xs text-slate-500">
								{new Date(video.created_at).toLocaleDateString()}
							</p>

							{video.video_url && (
								<div className="mt-auto">
									<a
										href={video.video_url}
										download
										className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
									>
										Download
									</a>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
