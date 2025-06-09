export interface ModelConfig {
  id: string;
  name: string;
  provider: "google" | "anthropic" | "openai" | "openrouter";
  hasSearch: boolean;
  description: string;
} 