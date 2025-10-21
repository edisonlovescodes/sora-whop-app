// api/check-status/route.ts
import { checkVideoStatus } from '@/lib/sora-provider';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const videoId = searchParams.get('videoId');

    if (!jobId || !videoId) {
      return NextResponse.json({ success: false, error: 'Missing jobId or videoId' }, { status: 400 });
    }

    const { status: soraStatus, error: soraError } = await checkVideoStatus(jobId);

    if (soraError || !soraStatus) {
      await supabaseAdmin.from('videos').update({
        status: 'failed',
        error_message: soraError || 'Unknown error',
      }).eq('id', videoId);

      return NextResponse.json({ success: false, error: soraError || 'Failed to check status' }, { status: 500 });
    }

    await supabaseAdmin.from('videos').update({
      status: soraStatus.status,
      video_url: soraStatus.videoUrl || null,
      error_message: soraStatus.error || null,
    }).eq('id', videoId);

    return NextResponse.json({
      success: true,
      status: soraStatus,
    });
  } catch (error) {
    console.error('Error in check-status API:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
