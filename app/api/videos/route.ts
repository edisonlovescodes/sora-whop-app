import { getUserVideos } from "@/lib/users";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Missing user ID" },
				{ status: 400 },
			);
		}

		const { videos, error } = await getUserVideos(userId, 50);

		if (error) {
			return NextResponse.json(
				{ success: false, error },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, videos });
	} catch (error) {
		console.error("Error in videos API:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
