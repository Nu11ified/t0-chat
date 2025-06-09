export interface ModelConfig {
  id: string;
  name: string;
  provider: "google" | "anthropic" | "openai" | "mistral";
  hasSearch: boolean;
  description: string;
} 