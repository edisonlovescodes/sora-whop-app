import { enhancePromptWithAI } from "@/lib/sora";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { prompt } = await request.json();

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ success: false, error: "Invalid prompt" },
				{ status: 400 },
			);
		}

		const { jsonPrompt, error } = await enhancePromptWithAI(prompt);

		if (error || !jsonPrompt) {
			return NextResponse.json(
				{ success: false, error: error ?? "Failed to enhance prompt" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, jsonPrompt });
	} catch (error) {
		console.error("Error in enhance-prompt API:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
