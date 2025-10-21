// lib/sora.ts
import { MOCK_MODE, mockCheckSoraJobStatus, mockEnhancePrompt, mockGenerateSoraVideo } from './mock-sora';
import {
  generateVideo as generateSoraVideoProvider,
  checkVideoStatus as checkSoraJobStatusProvider,
} from './sora-provider';
import type { SoraGenerationParams, SoraJobStatus } from './sora-provider';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
});

export type { SoraGenerationParams, SoraJobStatus };

export async function generateSoraVideo(
  params: SoraGenerationParams,
): Promise<{ jobId: string | null; error: string | null }> {
  if (MOCK_MODE) {
    console.log('🧪 Mock mode enabled - using test video');
    return mockGenerateSoraVideo(params);
  }
  return generateSoraVideoProvider(params);
}

export async function checkSoraJobStatus(
  jobId: string,
): Promise<{ status: SoraJobStatus | null; error: string | null }> {
  if (MOCK_MODE) {
    return mockCheckSoraJobStatus(jobId);
  }
  return checkSoraJobStatusProvider(jobId);
}

export async function enhancePromptWithAI(
  naturalLanguagePrompt: string,
): Promise<{ jsonPrompt: Record<string, unknown> | null; error: string | null }> {
  if (MOCK_MODE) {
    return mockEnhancePrompt(naturalLanguagePrompt);
  }
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at converting natural language descriptions into structured JSON prompts for Sora 2 video generation.
Convert the user's description into a JSON structure with these sections:
- scene: {subject, environment, objects, composition}
- camera: {angle, movement, lens, focus}
- motion: {primary, secondary, tertiary, pace}
- lighting: {source, direction, quality, color_temp, mood}
- timeline: {0-Xs, X-Ys, Y-Zs} (based on video duration)
Return ONLY the JSON object, no explanation.`,
        },
        {
          role: 'user',
          content: naturalLanguagePrompt,
        },
      ],
      temperature: 0.7,
    });

    const jsonString = completion.choices[0]?.message?.content ?? '{}';
    try {
      const jsonPrompt = JSON.parse(jsonString);
      return { jsonPrompt, error: null };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return { jsonPrompt: null, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('Error enhancing prompt with AI:', error);
    return {
      jsonPrompt: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
