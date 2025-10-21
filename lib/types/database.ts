export type SubscriptionTier = "starter" | "pro" | "max";

export interface User {
	id: string;
	whop_user_id: string;
	email: string | null;
	username: string | null;
	subscription_tier: SubscriptionTier;
	credits_remaining: number;
	total_credits_purchased: number;
	google_drive_connected: boolean;
	google_drive_folder_id: string | null;
	created_at: string;
	updated_at: string;
}

export interface Video {
	id: string;
	user_id: string;
	prompt_text: string;
	prompt_json: Record<string, unknown>;
	sora_model: "sora-2" | "sora-2-pro";
	duration_seconds: number;
	resolution: string;
	status: "pending" | "processing" | "completed" | "failed";
	openai_job_id: string | null;
	video_url: string | null;
	gdrive_file_id: string | null;
	error_message: string | null;
	credits_used: number;
	created_at: string;
	updated_at: string;
}

export interface Template {
	id: string;
	name: string;
	description: string;
	category: string;
	json_structure: Record<string, unknown>;
	preview_image_url: string | null;
	is_public: boolean;
	created_by: string | null;
	usage_count: number;
	created_at: string;
}

// Subscription tier configuration
export const TIER_CONFIG = {
	starter: {
		monthlyPrice: 29,
		creditsPerMonth: 15,
		allowedModels: ["sora-2"] as const,
		maxDuration: 12,
	},
	pro: {
		monthlyPrice: 79,
		creditsPerMonth: 40, // 30 standard + 10 pro
		allowedModels: ["sora-2", "sora-2-pro"] as const,
		maxDuration: 12,
	},
	max: {
		monthlyPrice: 199,
		creditsPerMonth: 80, // 60 standard + 20 pro
		allowedModels: ["sora-2", "sora-2-pro"] as const,
		maxDuration: 12,
	},
} as const;

// Credit costs per video
export const CREDIT_COSTS = {
	"sora-2": {
		4: 1, // 4 second video = 1 credit
		8: 2, // 8 second video = 2 credits
		12: 3, // 12 second video = 3 credits
	},
	"sora-2-pro": {
		4: 2, // 4 second pro video = 2 credits
		8: 4, // 8 second pro video = 4 credits
		12: 6, // 12 second pro video = 6 credits
	},
} as const;
