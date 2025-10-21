import type { SubscriptionTier } from "./types/database";
import { CREDIT_COSTS, TIER_CONFIG } from "./types/database";
import { supabaseAdmin } from "./supabase";

/**
 * Calculate credits required for a video generation
 */
export function calculateCreditsRequired(
	model: "sora-2" | "sora-2-pro",
	durationSeconds: 4 | 8 | 12,
): number {
	return CREDIT_COSTS[model][durationSeconds];
}

/**
 * Check if user has enough credits for a video generation
 */
export async function hasEnoughCredits(
	userId: string,
	requiredCredits: number,
): Promise<{ hasCredits: boolean; remainingCredits: number }> {
	const { data: user, error } = await supabaseAdmin
		.from("users")
		.select("credits_remaining")
		.eq("id", userId)
		.single();

	if (error || !user) {
		return { hasCredits: false, remainingCredits: 0 };
	}

	return {
		hasCredits: user.credits_remaining >= requiredCredits,
		remainingCredits: user.credits_remaining,
	};
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(
	userId: string,
	creditsToDeduct: number,
): Promise<{ success: boolean; remainingCredits: number | null }> {
	const { data: user, error: fetchError } = await supabaseAdmin
		.from("users")
		.select("credits_remaining")
		.eq("id", userId)
		.single();

	if (fetchError || !user) {
		return { success: false, remainingCredits: null };
	}

	if (user.credits_remaining < creditsToDeduct) {
		return { success: false, remainingCredits: user.credits_remaining };
	}

	const newBalance = user.credits_remaining - creditsToDeduct;

	const { error: updateError } = await supabaseAdmin
		.from("users")
		.update({ credits_remaining: newBalance })
		.eq("id", userId);

	if (updateError) {
		return { success: false, remainingCredits: null };
	}

	return { success: true, remainingCredits: newBalance };
}

/**
 * Add credits to user account (for upgrades, purchases, etc.)
 */
export async function addCredits(
	userId: string,
	creditsToAdd: number,
): Promise<{ success: boolean; newBalance: number | null }> {
	const { data: user, error: fetchError } = await supabaseAdmin
		.from("users")
		.select("credits_remaining, total_credits_purchased")
		.eq("id", userId)
		.single();

	if (fetchError || !user) {
		return { success: false, newBalance: null };
	}

	const newBalance = user.credits_remaining + creditsToAdd;
	const newTotalPurchased = user.total_credits_purchased + creditsToAdd;

	const { error: updateError } = await supabaseAdmin
		.from("users")
		.update({
			credits_remaining: newBalance,
			total_credits_purchased: newTotalPurchased,
		})
		.eq("id", userId);

	if (updateError) {
		return { success: false, newBalance: null };
	}

	return { success: true, newBalance };
}

/**
 * Get tier information for a subscription
 */
export function getTierInfo(tier: SubscriptionTier) {
	return TIER_CONFIG[tier];
}

/**
 * Check if a tier allows a specific model
 */
export function isTierAllowedModel(
	tier: SubscriptionTier,
	model: "sora-2" | "sora-2-pro",
): boolean {
	const tierConfig = TIER_CONFIG[tier];
	return tierConfig.allowedModels.includes(model);
}

/**
 * Refund credits if a video generation fails
 */
export async function refundCredits(
	userId: string,
	creditsToRefund: number,
): Promise<{ success: boolean }> {
	const { data: user, error: fetchError } = await supabaseAdmin
		.from("users")
		.select("credits_remaining")
		.eq("id", userId)
		.single();

	if (fetchError || !user) {
		return { success: false };
	}

	const newBalance = user.credits_remaining + creditsToRefund;

	const { error: updateError } = await supabaseAdmin
		.from("users")
		.update({ credits_remaining: newBalance })
		.eq("id", userId);

	return { success: !updateError };
}
