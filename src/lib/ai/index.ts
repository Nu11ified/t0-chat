import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createProviderRegistry } from 'ai';
import { type userSettings } from '@/server/db/schema/settings';

type UserSettings = typeof userSettings.$inferSelect;

export function createRegistry(settings: UserSettings | null | undefined) {
  return createProviderRegistry({
    openai: createOpenAI({
      apiKey: settings?.openaiApiKey ?? undefined,
    }),
    google: createGoogleGenerativeAI({
      apiKey: settings?.googleApiKey ?? undefined,
    }),
    anthropic: createAnthropic({
      apiKey: settings?.anthropicApiKey ?? undefined,
    }),
    openrouter: createOpenAI({
      apiKey: settings?.openrouterApiKey ?? undefined,
      baseURL: 'https://openrouter.ai/api/v1',
    }),
  });
}