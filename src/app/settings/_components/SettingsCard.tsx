"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { models } from "@/config/models";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateUserSettingsSchema } from "@/server/db/schema/settings";
import { useEffect } from "react";

type FormValues = z.infer<typeof updateUserSettingsSchema>;

export function SettingsCard() {
  const { data: settings, isLoading } = api.settings.getUserSettings.useQuery();
  const updateMutation = api.settings.updateUserSettings.useMutation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      openaiApiKey: "",
      googleApiKey: "",
      anthropicApiKey: "",
      openrouterApiKey: "",
      defaultModel: "openai:gpt-4o",
      systemPrompt: "",
      defaultModelParameters: {
        temperature: 0.7,
        topP: 1,
        maxTokens: 1000,
        searchMode: false,
      },
    },
  });

  useEffect(() => {
    if (settings) {
      const formValues: Partial<FormValues> = {};
      if (settings.openaiApiKey) formValues.openaiApiKey = settings.openaiApiKey;
      if (settings.googleApiKey) formValues.googleApiKey = settings.googleApiKey;
      if (settings.anthropicApiKey) formValues.anthropicApiKey = settings.anthropicApiKey;
      if (settings.openrouterApiKey) formValues.openrouterApiKey = settings.openrouterApiKey;
      if (settings.defaultModel) formValues.defaultModel = settings.defaultModel;
      if (settings.systemPrompt) formValues.systemPrompt = settings.systemPrompt;
      if (settings.defaultModelParameters) {
        formValues.defaultModelParameters = {
            ...formValues.defaultModelParameters,
            ...settings.defaultModelParameters
        }
      }
      reset(formValues);
    }
  }, [settings, reset]);

  const onSubmit = async (data: FormValues) => {
    // Filter out empty string API keys before sending
    const dataToUpdate: FormValues = {
        ...data,
        openaiApiKey: data.openaiApiKey ?? undefined,
        googleApiKey: data.googleApiKey ?? undefined,
        anthropicApiKey: data.anthropicApiKey ?? undefined,
        openrouterApiKey: data.openrouterApiKey ?? undefined,
    }

    await updateMutation.mutateAsync(dataToUpdate, {
      onSuccess: () => {
        toast.success("Settings updated successfully!");
        reset(data); // Resets form state to new values
      },
      onError: (error) => {
        toast.error(`Failed to update settings: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Enter your API keys for the different providers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
              <Controller
                name="openaiApiKey"
                control={control}
                render={({ field }) => (
                  <Input id="openaiApiKey" type="password" {...field} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleApiKey">Google API Key</Label>
              <Controller
                name="googleApiKey"
                control={control}
                render={({ field }) => (
                  <Input id="googleApiKey" type="password" {...field} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropicApiKey">Anthropic API Key</Label>
              <Controller
                name="anthropicApiKey"
                control={control}
                render={({ field }) => (
                  <Input id="anthropicApiKey" type="password" {...field} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openrouterApiKey">OpenRouter API Key</Label>
              <Controller
                name="openrouterApiKey"
                control={control}
                render={({ field }) => (
                  <Input id="openrouterApiKey" type="password" {...field} />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Settings</CardTitle>
            <CardDescription>
              Configure default model and its parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultModel">Default Model</Label>
              <Controller
                name="defaultModel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="cursor-help">Temperature</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Controls randomness. Lower values make the output more
                        focused and deterministic, while higher values make it
                        more creative and diverse.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Controller
                  name="defaultModelParameters.temperature"
                  control={control}
                  render={({ field }) => (
                    <span className="text-sm text-muted-foreground">
                      {field.value?.toFixed(1)}
                    </span>
                  )}
                />
              </div>
              <Controller
                name="defaultModelParameters.temperature"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    <span className="w-1/4 text-center text-xs text-muted-foreground">
                      Precise
                    </span>
                    <Slider
                      value={[field.value ?? 0.7]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={1}
                      step={0.1}
                    />
                    <span className="w-1/4 text-center text-xs text-muted-foreground">
                      Creative
                    </span>
                  </div>
                )}
              />
            </div>
            
            <div className="flex items-center justify-between">
                <Label>Web Search</Label>
                <Controller
                    name="defaultModelParameters.searchMode"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Controller
                    name="systemPrompt"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="systemPrompt"
                            placeholder="You are a helpful assistant."
                            {...field}
                            value={field.value ?? ""}
                        />
                    )}
                />
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </CardFooter>
      </div>
    </form>
  );
} 