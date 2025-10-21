// api/generate-video/route.ts
import { calculateCreditsRequired, deductCredits, hasEnoughCredits } from '@/lib/credits';
import { generateVideo } from '@/lib/sora-provider';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserById } from '@/lib/users';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, prompt, jsonPrompt, model, duration, resolution } = await request.json();

    if (!userId || !prompt || !model || !duration || !resolution) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { user, error: userError } = await getUserById(userId);

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    const creditsRequired = calculateCreditsRequired(
      model,
      Number.parseInt(duration) as 4 | 8 | 12,
    );

    const { hasCredits, remainingCredits } = await hasEnoughCredits(
      userId,
      creditsRequired,
    );

    if (!hasCredits) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. Required: ${creditsRequired}, Available: ${remainingCredits}`,
        },
        { status: 400 },
      );
    }

    const { success: deductSuccess, remainingCredits: newBalance } = await deductCredits(
      userId,
      creditsRequired,
    );

    if (!deductSuccess) {
      return NextResponse.json(
        { success: false, error: 'Failed to deduct credits' },
        { status: 500 },
      );
    }

    const { jobId, error: soraError } = await generateVideo({
      prompt,
      model,
      size: resolution,
      seconds: duration.toString() as '4' | '8' | '12',
    });

    if (soraError || !jobId) {
      await deductCredits(userId, -creditsRequired);
      return NextResponse.json(
        { success: false, error: soraError ?? 'Failed to start video generation' },
        { status: 500 },
      );
    }

    const { data: insertedVideo, error: dbError } = await supabaseAdmin
      .from('videos')
      .insert({
        user_id: userId,
        prompt_text: prompt,
        prompt_json: jsonPrompt ?? {},
        sora_model: model,
        duration_seconds: Number.parseInt(duration),
        resolution,
        status: 'pending',
        openai_job_id: jobId,
        credits_used: creditsRequired,
      })
      .select('id')
      .single();

    if (dbError || !insertedVideo) {
      console.error('Failed to store video record:', dbError);
      await deductCredits(userId, -creditsRequired);
      return NextResponse.json(
        { success: false, error: 'Failed to store video record' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      jobId,
      videoId: insertedVideo.id,
      creditsRemaining: newBalance,
    });
  } catch (error) {
    console.error('Error in generate-video API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
