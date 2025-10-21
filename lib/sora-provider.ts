// lib/sora-provider.ts (update checkVideoStatus)
import {
  checkSoraJobStatus as checkOpenAI,
  generateSoraVideo as generateOpenAI,
} from './sora';
import {
  checkSoraJobStatusReplicate,
  generateSoraVideoReplicate,
  SoraGenerationParams,
} from './sora-replicate';

console.log('🔧 Provider debug: USE_REPLICATE =', process.env.NEXT_PUBLIC_USE_REPLICATE);

const USE_REPLICATE = process.env.NEXT_PUBLIC_USE_REPLICATE === 'true';

export type SoraJobStatus = {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  progress?: number;
};

export type { SoraGenerationParams };

export async function generateVideo(
  params: SoraGenerationParams,
): Promise<{ jobId: string | null; error: string | null }> {
  if (USE_REPLICATE) {
    console.log('📹 Using Replicate API for Sora 2');
    return generateSoraVideoReplicate(params);
  }
  console.log('📹 Using OpenAI API for Sora 2');
  return generateOpenAI(params);
}

export async function checkVideoStatus(
  jobId: string,
): Promise<{ status: SoraJobStatus | null; error: string | null }> {
  if (USE_REPLICATE) {
    const { status: rawStatus, error, videoUrl, progress } =
      await checkSoraJobStatusReplicate(jobId);
    if (rawStatus === null) {
      return { status: null, error };
    }
    const normalizedStatus: SoraJobStatus['status'] =
      rawStatus === 'succeeded'
        ? 'completed'
        : rawStatus === 'failed' || rawStatus === 'canceled'
        ? 'failed'
        : rawStatus === 'queued' || rawStatus === 'starting'
        ? 'pending'
        : 'processing';
    const mappedStatus: SoraJobStatus = {
      id: jobId,
      status: normalizedStatus,
      videoUrl: videoUrl || undefined,
      error: error || undefined,
      progress,
    };
    return { status: mappedStatus, error: null };
  }
  return checkOpenAI(jobId);
}

export function getProviderName(): string {
  return USE_REPLICATE ? 'Replicate' : 'OpenAI';
}
