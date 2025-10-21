/**
 * Mock Sora API for testing without OpenAI access
 * Set NEXT_PUBLIC_MOCK_MODE=true in .env.local to enable
 */

export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

// Sample video URLs for testing (public domain/creative commons videos)
const MOCK_VIDEOS = [
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

export interface MockSoraGenerationParams {
	prompt: string;
	model: "sora-2" | "sora-2-pro";
	size: string;
	seconds: "4" | "8" | "12";
}

/**
 * Mock video generation - returns immediately with a job ID
 */
export async function mockGenerateSoraVideo(
	params: MockSoraGenerationParams,
): Promise<{ jobId: string | null; error: string | null }> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	const promptSignature = params.prompt
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.slice(0, 16)
		.replace(/^-|-$/g, "");

	// Random chance of "failure" to test error handling
	if (Math.random() < 0.05) {
		// 5% failure rate
		return {
			jobId: null,
			error: "Mock API error: Random failure for testing",
		};
	}

	const randomSuffix = Math.random().toString(36).slice(2, 8);
	const jobId = `mock_job_${promptSignature || "prompt"}_${Date.now()}_${randomSuffix}`;

	return { jobId, error: null };
}

/**
 * Mock job status checking - simulates processing time
 */
export async function mockCheckSoraJobStatus(jobId: string): Promise<{
	status: {
		id: string;
		status: "pending" | "processing" | "completed" | "failed";
		videoUrl?: string;
		error?: string;
	} | null;
	error: string | null;
}> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 300));

	// Extract timestamp from job ID
	const timestamp = Number.parseInt(jobId.split("_")[2]) || Date.now();
	const elapsed = Date.now() - timestamp;

	// Simulate progression: pending → processing → completed
	// Mock videos complete after 30 seconds (instead of real 2-5 minutes)
	if (elapsed < 5000) {
		// First 5 seconds: pending
		return {
			status: {
				id: jobId,
				status: "pending",
			},
			error: null,
		};
	}

	if (elapsed < 30000) {
		// 5-30 seconds: processing
		return {
			status: {
				id: jobId,
				status: "processing",
			},
			error: null,
		};
	}

	// After 30 seconds: completed with random video
	const randomVideo = MOCK_VIDEOS[Math.floor(Math.random() * MOCK_VIDEOS.length)];

	return {
		status: {
			id: jobId,
			status: "completed",
			videoUrl: randomVideo,
		},
		error: null,
	};
}

/**
 * Mock prompt enhancement
 */
export async function mockEnhancePrompt(
	naturalLanguagePrompt: string,
): Promise<{ jsonPrompt: Record<string, unknown> | null; error: string | null }> {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const promptSummary =
		naturalLanguagePrompt.trim().slice(0, 120) || "scene from prompt";

	// Create a simple JSON structure based on the prompt
	const jsonPrompt = {
		scene: {
			subject: promptSummary,
			environment: "based on description",
			composition: "cinematic framing",
		},
		camera: {
			angle: "eye level",
			movement: "smooth tracking",
			lens: "35mm equivalent",
			focus: "subject in focus",
		},
		motion: {
			primary: "main action",
			pace: "moderate",
		},
		lighting: {
			source: "natural light",
			direction: "soft directional",
			quality: "cinematic",
			color_temp: "warm 3200K",
			mood: "professional",
		},
		timeline: {
			"0-3s": "establish scene",
			"3-8s": "main action",
			"8-12s": "conclusion",
		},
	};

	return { jsonPrompt, error: null };
}

export function getMockModeWarning(): string {
	return "🧪 MOCK MODE: Using test videos instead of real Sora 2 API. Set NEXT_PUBLIC_MOCK_MODE=false to use real API.";
}
