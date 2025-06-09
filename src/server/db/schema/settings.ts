import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "./auth-schema";

const defaultModelParams = {
  temperature: 0.7,
  topP: 1,
  maxTokens: 1000,
  searchMode: false,
};

const defaultMemoryConfig = {
  maxMemories: 10,
  minPriority: 0,
  recencyWeight: 0.5,
  categoryWeights: {},
};

const defaultInstructionTypes = {
  personality: true,
  knowledge: true,
  behavior: true,
  style: true,
};

const defaultStreamChunkSize = {
  tokens: 100,
  characters: 1000,
};

const defaultMaxContextLength = {
  messages: 100,
  tokens: 4000,
};

export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    // Theme settings
    theme: varchar("theme", { length: 20 }).default("system").notNull(),
    // AI settings
    defaultModel: varchar("default_model", { length: 100 }).notNull(),
    defaultModelParameters: json("default_model_parameters")
      .$type<typeof defaultModelParams>()
      .default(defaultModelParams),
    // Memory settings
    memoryConfig: json("memory_config")
      .$type<typeof defaultMemoryConfig>()
      .default(defaultMemoryConfig),
    // Instruction settings
    enabledInstructionTypes: json("enabled_instruction_types")
      .$type<typeof defaultInstructionTypes>()
      .default(defaultInstructionTypes),
    // Stream settings
    streamChunkSize: json("stream_chunk_size")
      .$type<typeof defaultStreamChunkSize>()
      .default(defaultStreamChunkSize),
    maxContextLength: json("max_context_length")
      .$type<typeof defaultMaxContextLength>()
      .default(defaultMaxContextLength),
    // API Keys
    openrouterApiKey: text("openrouter_api_key"),
    openaiApiKey: text("openai_api_key"),
    anthropicApiKey: text("anthropic_api_key"),
    googleApiKey: text("google_api_key"),
    perplexityApiKey: text("perplexity_api_key"),
    cohereApiKey: text("cohere_api_key"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}));

// Schemas
export type InsertUserSettings = typeof userSettings.$inferInsert;
export type SelectUserSettings = typeof userSettings.$inferSelect;

// Custom Zod schemas for API validation
export const themeSchema = z.enum(["light", "dark", "system"]);

export const updateUserSettingsSchema = z.object({
  theme: themeSchema.optional(),
  defaultModel: z.string().min(1).max(100).optional(),
  defaultModelParameters: z.object({
    temperature: z.number().min(0).max(2),
    topP: z.number().min(0).max(1),
    maxTokens: z.number().min(1).max(32000),
    searchMode: z.boolean(),
  }).optional(),
  memoryConfig: z.object({
    maxMemories: z.number().min(1).max(100),
    minPriority: z.number().min(0).max(100),
    recencyWeight: z.number().min(0).max(1),
    categoryWeights: z.record(z.number().min(0).max(1)),
  }).optional(),
  enabledInstructionTypes: z.object({
    personality: z.boolean(),
    knowledge: z.boolean(),
    behavior: z.boolean(),
    style: z.boolean(),
  }).optional(),
  streamChunkSize: z.object({
    tokens: z.number().min(1).max(1000),
    characters: z.number().min(1).max(10000),
  }).optional(),
  maxContextLength: z.object({
    messages: z.number().min(1).max(1000),
    tokens: z.number().min(1).max(32000),
  }).optional(),
  openrouterApiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  anthropicApiKey: z.string().optional(),
  googleApiKey: z.string().optional(),
  perplexityApiKey: z.string().optional(),
  cohereApiKey: z.string().optional(),
});





