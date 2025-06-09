'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { updateUserSettingsSchema } from '@/server/db/schema/settings';
import { useEffect } from 'react';

export function UserSettings() {
  const { data: settings, refetch } = api.settings.getUserSettings.useQuery();
  const { mutate: updateSettings, isPending } = api.settings.updateUserSettings.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const form = useForm({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      openaiApiKey: '',
      anthropicApiKey: '',
      googleApiKey: '',
      perplexityApiKey: '',
      cohereApiKey: '',
      openrouterApiKey: '',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        theme: settings.theme as "light" | "dark" | "system",
        defaultModel: settings.defaultModel,
        defaultModelParameters: settings.defaultModelParameters ?? {
          temperature: undefined,
          topP: undefined,
          maxTokens: undefined,
          searchMode: undefined
        },
        memoryConfig: settings.memoryConfig ?? {
          maxMemories: undefined,
          minPriority: undefined,
          recencyWeight: undefined,
          categoryWeights: undefined
        },
        enabledInstructionTypes: settings.enabledInstructionTypes ?? {
          personality: undefined,
          knowledge: undefined,
          behavior: undefined,
          style: undefined
        },
        streamChunkSize: settings.streamChunkSize ?? {
          tokens: undefined,
          characters: undefined
        },
        maxContextLength: settings.maxContextLength ?? {
          messages: undefined,
          tokens: undefined
        },
        openaiApiKey: settings.openaiApiKey ?? '',
        anthropicApiKey: settings.anthropicApiKey ?? '',
        googleApiKey: settings.googleApiKey ?? '',
        perplexityApiKey: settings.perplexityApiKey ?? '',
        cohereApiKey: settings.cohereApiKey ?? '',
        openrouterApiKey: settings.openrouterApiKey ?? '',
      });
    }
  }, [settings, form]);

  const onSubmit = form.handleSubmit(data => {
    updateSettings(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={e => {
        void onSubmit(e);
      }} className="space-y-8">
        <FormField
          control={form.control}
          name="openaiApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API Key</FormLabel>
              <FormControl>
                <Input placeholder="sk-..." {...field} />
              </FormControl>
              <FormDescription>
                Your OpenAI API key.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anthropicApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anthropic API Key</FormLabel>
              <FormControl>
                <Input placeholder="sk-..." {...field} />
              </FormControl>
              <FormDescription>
                Your Anthropic API key.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="googleApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google API Key</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormDescription>
                Your Google API key.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="perplexityApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perplexity API Key</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormDescription>
                Your Perplexity API key.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cohereApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cohere API Key</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormDescription>
                Your Cohere API key.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openrouterApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenRouter API Key</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormDescription>
                Your OpenRouter API key.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
} 