import { type ModelConfig } from "@/types/models";

export const models: ModelConfig[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    hasSearch: true,
    description: "Fast and efficient model for general tasks",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    hasSearch: false,
    description: "Quick responses for simple tasks",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    hasSearch: true,
    description: "Advanced reasoning and complex tasks",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "mistral",
    hasSearch: false,
    description: "Open source large language model",
  },
]; 