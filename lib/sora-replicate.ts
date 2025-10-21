// lib/sora-replicate.ts (update checkSoraJobStatusReplicate)
import Replicate from 'replicate';

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

export type SoraGenerationParams = {
	prompt: string;
	model: "sora-2" | "sora-2-pro";
	size: string;
	seconds: "4" | "8" | "12";
};

export type ReplicateJobState =
	| "succeeded"
	| "failed"
	| "processing"
	| "starting"
	| "queued"
	| "canceled";

export type SoraJobStatus = ReplicateJobState;

function mapSizeToAspectRatio(size: string): "portrait" | "landscape" {
	const [width, height] = size.split("x").map(Number);
	return width > height ? "landscape" : "portrait";
}

function extractVideoUrl(candidate: unknown): string | undefined {
	if (!candidate) return undefined;
	if (typeof candidate === "string") {
		if (candidate.startsWith("http")) {
			return candidate;
		}
		return undefined;
	}

	if (Array.isArray(candidate)) {
		for (const item of candidate) {
			const resolved = extractVideoUrl(item);
			if (resolved) return resolved;
		}
		return undefined;
	}

	if (typeof candidate === "object") {
		const record = candidate as Record<string, unknown>;
		const directKeys = ["url", "uri", "href", "video", "video_url", "videoUrl"];

		for (const key of directKeys) {
			const maybeValue = record[key];
			if (typeof maybeValue === "string" && maybeValue.startsWith("http")) {
				return maybeValue;
			}
		}

		for (const value of Object.values(record)) {
			const nested = extractVideoUrl(value);
			if (nested) return nested;
		}
	}

	return undefined;
}

export async function generateSoraVideoReplicate(
	params: SoraGenerationParams,
): Promise<{ jobId: string | null; error: string | null }> {
	try {
		const model =
			params.model === "sora-2-pro" ? "openai/sora-2-pro" : "openai/sora-2";
		const input = {
			prompt: params.prompt,
			duration: Number.parseInt(params.seconds, 10),
			aspect_ratio: mapSizeToAspectRatio(params.size),
		};

		const prediction = await replicate.predictions.create({
			version: model,
			input,
		});

		return { jobId: prediction.id, error: null };
	} catch (error) {
		console.error("Replicate generation error:", error);
		return { jobId: null, error: (error as Error).message };
	}
}

export async function checkSoraJobStatusReplicate(
	jobId: string,
): Promise<{
	status: ReplicateJobState | null;
	error: string | null;
	videoUrl?: string;
	progress?: number;
}> {
	try {
		const prediction = await replicate.predictions.get(jobId);
		if (!prediction) {
			return {
				status: null,
				error: "Prediction not found",
				videoUrl: undefined,
				progress: undefined,
			};
		}

		const status = prediction.status as ReplicateJobState;
		const progress =
			typeof prediction.metrics?.progress_percent === "number"
				? prediction.metrics.progress_percent
				: undefined;

		let videoUrl: string | undefined;
		if (status === "succeeded") {
			videoUrl =
				extractVideoUrl(prediction.output) ??
				extractVideoUrl((prediction as Record<string, unknown>).output_url) ??
				extractVideoUrl((prediction as Record<string, unknown>).output_urls) ??
				extractVideoUrl((prediction as Record<string, unknown>).files);
		}

		if (!videoUrl && status === "succeeded") {
			console.warn("Replicate prediction succeeded but no video URL found", {
				id: prediction.id,
				output: prediction.output,
			});
		}

		return {
			status,
			error: (prediction.error as string | null) ?? null,
			videoUrl,
			progress,
		};
	} catch (error) {
		console.error("Replicate status check error:", error);
		return {
			status: null,
			error: (error as Error).message,
			videoUrl: undefined,
			progress: undefined,
		};
	}
}
