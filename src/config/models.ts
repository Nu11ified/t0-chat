import { type ModelConfig } from "@/types/models";

export const models: ModelConfig[] = [
  {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    hasSearch: true,
    description: "The latest and most advanced model from OpenAI.",
  },
  {
    id: "google:gemini-1.5-pro-latest",
    name: "Gemini 1.5 Pro",
    provider: "google",
    hasSearch: true,
    description: "Google's latest generation, multimodal model.",
  },
  {
    id: "anthropic:claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
    hasSearch: false,
    description: "Most powerful model from Anthropic for complex tasks.",
  },
  {
    id: "openrouter:anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet (via OpenRouter)",
    provider: "openrouter",
    hasSearch: false,
    description: "Anthropic's latest model, available through OpenRouter.",
  },
  {
    id: "openrouter:deepseek/deepseek-r1-0528-qwen3-8b:free",
    name: "DeepSeek R1 (free)",
    provider: "openrouter",
    hasSearch: false,
    description: "DeepSeek-R1-0528 is a lightly upgraded release of DeepSeek R1 that taps more compute and smarter post-training tricks, pushing its reasoning and inference to the brink of flagship models like O3 and Gemini 2.5 Pro.",
  },
]; 