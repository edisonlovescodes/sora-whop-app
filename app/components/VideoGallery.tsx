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
			<div className="w-full rounded-3xl border border-[#FA4616]/20 bg-[#141212] p-10 text-center">
				<div className="mx-auto h-10 w-10 rounded-full border-4 border-[#FA4616]/20 border-t-[#FA4616] animate-spin" />
				<p className="mt-6 text-sm text-[#FCF6F5]/70">Loading clips…</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full rounded-3xl border border-[#FA4616]/40 bg-[#FA4616]/10 p-8 text-center text-sm text-[#FA4616]">
				{error}
			</div>
		);
	}

	if (videos.length === 0) {
		return (
				<div className="w-full rounded-3xl border border-[#FA4616]/20 bg-[#141212] p-10 text-center">
					<p className="text-sm text-[#FCF6F5]/70">
						No clips yet—create one above
					</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			<h3 className="mb-5 text-xl font-bold text-[#FCF6F5]">
				Your Clips ({videos.length})
			</h3>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{videos.map((video) => (
					<div
						key={video.id}
						className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#FA4616]/20 bg-[#141212] shadow-lg"
					>
						{/* Video Preview */}
						{video.video_url && video.status === "completed" ? (
							<div className="aspect-video bg-black">
								<video
									src={video.video_url}
									controls
									className="h-full w-full object-cover"
								>
									<track kind="captions" />
								</video>
							</div>
						) : (
							<div className="flex aspect-video items-center justify-center bg-[#141212]/50">
								<div className="text-center text-sm text-[#FCF6F5]/70">
									{video.status === "pending" && "Pending…"}
									{video.status === "processing" && (
										<div className="mx-auto h-8 w-8 rounded-full border-4 border-[#FA4616]/20 border-t-[#FA4616] animate-spin" />
									)}
									{video.status === "failed" && (
										<span className="text-[#FA4616]">Failed</span>
									)}
								</div>
							</div>
						)}

						{/* Video Info */}
						<div className="flex flex-1 flex-col gap-3 p-5">
							<p className="line-clamp-2 text-sm font-medium text-[#FCF6F5]">
								{video.prompt_text}
							</p>

							<div className="flex items-center justify-between text-xs text-[#FCF6F5]/70">
								<div>
									<span className="capitalize">{video.sora_model}</span> •{" "}
									{video.duration_seconds}s
								</div>
								<div className="font-semibold text-[#FA4616]">{video.credits_used} credits</div>
							</div>

							<p className="text-xs text-[#FCF6F5]/50">
								{new Date(video.created_at).toLocaleDateString()}
							</p>

							{video.video_url && (
								<div className="mt-auto">
									<a
										href={video.video_url}
										download
										className="inline-flex w-full items-center justify-center rounded-full bg-[#FA4616] px-4 py-2 text-sm font-bold text-[#141212] transition hover:bg-[#FA4616]/90"
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
