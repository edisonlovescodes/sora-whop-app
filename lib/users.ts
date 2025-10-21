import type { SubscriptionTier, User } from "./types/database";
import { supabaseAdmin } from "./supabase";
import { TIER_CONFIG } from "./types/database";

/**
 * Get or create user from Whop user ID
 */
export async function getOrCreateUser(
	whopUserId: string,
	email?: string,
	username?: string,
): Promise<{ user: User | null; error: string | null }> {
	// Try to find existing user
	const { data: existingUser } = await supabaseAdmin
		.from("users")
		.select("*")
		.eq("whop_user_id", whopUserId)
		.single();

	if (existingUser) {
		return { user: existingUser as User, error: null };
	}

	// Create new user with starter tier and initial credits
	const starterConfig = TIER_CONFIG.starter;
	const { data: newUser, error: createError } = await supabaseAdmin
		.from("users")
		.insert({
			whop_user_id: whopUserId,
			email: email ?? null,
			username: username ?? null,
			subscription_tier: "starter",
			credits_remaining: starterConfig.creditsPerMonth,
			total_credits_purchased: starterConfig.creditsPerMonth,
		})
		.select()
		.single();

	if (createError) {
		return { user: null, error: createError.message };
	}

	return { user: newUser as User, error: null };
}

/**
 * Update user subscription tier
 */
export async function updateUserTier(
	userId: string,
	newTier: SubscriptionTier,
): Promise<{ success: boolean; error: string | null }> {
	const { error } = await supabaseAdmin
		.from("users")
		.update({
			subscription_tier: newTier,
		})
		.eq("id", userId);

	if (error) {
		return { success: false, error: error.message };
	}

	// Optionally add credits when upgrading
	// You can implement logic here to add the new tier's credits

	return { success: true, error: null };
}

/**
 * Get user by Whop user ID
 */
export async function getUserByWhopId(
	whopUserId: string,
): Promise<{ user: User | null; error: string | null }> {
	const { data, error } = await supabaseAdmin
		.from("users")
		.select("*")
		.eq("whop_user_id", whopUserId)
		.single();

	if (error) {
		return { user: null, error: error.message };
	}

	return { user: data as User, error: null };
}

/**
 * Get user by database ID
 */
export async function getUserById(
	userId: string,
): Promise<{ user: User | null; error: string | null }> {
	const { data, error } = await supabaseAdmin
		.from("users")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) {
		return { user: null, error: error.message };
	}

	return { user: data as User, error: null };
}

/**
 * Update Google Drive connection status
 */
export async function updateGoogleDriveConnection(
	userId: string,
	connected: boolean,
	folderId?: string,
): Promise<{ success: boolean; error: string | null }> {
	const { error } = await supabaseAdmin
		.from("users")
		.update({
			google_drive_connected: connected,
			google_drive_folder_id: folderId ?? null,
		})
		.eq("id", userId);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, error: null };
}

/**
 * Get user's video history
 */
export async function getUserVideos(
	userId: string,
	limit = 50,
): Promise<{ videos: unknown[]; error: string | null }> {
	const { data, error } = await supabaseAdmin
		.from("videos")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return { videos: [], error: error.message };
	}

	return { videos: data ?? [], error: null };
}

/**
 * Get user's subscription tier info
 */
export async function getUserTierInfo(userId: string): Promise<{
	tier: SubscriptionTier | null;
	config: (typeof TIER_CONFIG)[SubscriptionTier] | null;
	error: string | null;
}> {
	const { user, error } = await getUserById(userId);

	if (error || !user) {
		return { tier: null, config: null, error: error ?? "User not found" };
	}

	return {
		tier: user.subscription_tier,
		config: TIER_CONFIG[user.subscription_tier],
		error: null,
	};
}
