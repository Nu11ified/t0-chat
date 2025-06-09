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
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "./auth-schema";

const defaultPriority = {
  value: 50,
  decay: 0.1,
};

const defaultScope = {
  models: [],
  contexts: [],
};

const defaultMemoryConfig = {
  maxMemories: 10,
  minPriority: 0,
  recencyWeight: 0.5,
  categoryWeights: {},
};

const defaultModelParameters = {
  temperature: 0.7,
  topP: 1,
  maxTokens: 1000,
  searchMode: false,
};

// AI Memory table for storing long-term context
export const aiMemories = pgTable(
  "ai_memories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(), // Encrypted memory content
    category: varchar("category", { length: 100 }).notNull(),
    priority: json("priority")
      .$type<typeof defaultPriority>()
      .default(defaultPriority),
    scope: json("scope")
      .$type<typeof defaultScope>()
      .default(defaultScope),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// AI Instructions table for storing user-defined instructions
export const aiInstructions = pgTable(
  "ai_instructions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(), // Encrypted instruction content
    type: varchar("type", { length: 50 }).notNull(), // personality, knowledge, behavior, style
    priority: json("priority")
      .$type<typeof defaultPriority>()
      .default(defaultPriority),
    scope: json("scope")
      .$type<typeof defaultScope>()
      .default(defaultScope),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Chat table for storing chat sessions
export const chats = pgTable(
  "chats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    useMemory: boolean("use_memory").default(true).notNull(),
    useInstructions: boolean("use_instructions").default(true).notNull(),
    customModelParameters: json("custom_model_parameters")
      .$type<typeof defaultModelParameters>()
      .default(defaultModelParameters),
    customMemoryConfig: json("custom_memory_config")
      .$type<typeof defaultMemoryConfig>()
      .default(defaultMemoryConfig),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Message table for storing chat messages
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(), // user, assistant, system
    content: text("content").notNull(), // Encrypted message content
    index: integer("index").notNull(), // Message index in the chat
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Relations
export const chatRelations = relations(chats, ({ one, many }) => ({
  user: one(user, {
    fields: [chats.userId],
    references: [user.id],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export const aiMemoryRelations = relations(aiMemories, ({ one }) => ({
  user: one(user, {
    fields: [aiMemories.userId],
    references: [user.id],
  }),
}));

export const aiInstructionRelations = relations(aiInstructions, ({ one }) => ({
  user: one(user, {
    fields: [aiInstructions.userId],
    references: [user.id],
  }),
}));

// Schemas
export type InsertChat = typeof chats.$inferInsert;
export type SelectChat = typeof chats.$inferSelect;

export type InsertMessage = typeof messages.$inferInsert;
export type SelectMessage = typeof messages.$inferSelect;

export type InsertAiMemory = typeof aiMemories.$inferInsert;
export type SelectAiMemory = typeof aiMemories.$inferSelect;

export type InsertAiInstruction = typeof aiInstructions.$inferInsert;
export type SelectAiInstruction = typeof aiInstructions.$inferSelect;

// Custom Zod schemas for API validation
export const messageRoleSchema = z.enum(["user", "assistant", "system"]);

export const createChatSchema = z.object({
  title: z.string().min(1).max(255),
  useMemory: z.boolean().optional(),
  useInstructions: z.boolean().optional(),
  customModelParameters: z.object({
    temperature: z.number().min(0).max(2),
    topP: z.number().min(0).max(1),
    maxTokens: z.number().min(1).max(32000),
    searchMode: z.boolean(),
  }).optional(),
  customMemoryConfig: z.object({
    maxMemories: z.number().min(1).max(100),
    minPriority: z.number().min(0).max(100),
    recencyWeight: z.number().min(0).max(1),
    categoryWeights: z.record(z.number().min(0).max(1)),
  }).optional(),
});

export const createMessageSchema = z.object({
  chatId: z.string().uuid(),
  role: messageRoleSchema,
  content: z.string().min(1),
  index: z.number().int().min(0),
});

export const createAiMemorySchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  category: z.string().min(1).max(100),
  priority: z.object({
    value: z.number().min(0).max(100),
    decay: z.number().min(0).max(1),
  }).optional(),
  scope: z.object({
    models: z.array(z.string()),
    contexts: z.array(z.string()),
  }).optional(),
});

export const createAiInstructionSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  type: z.enum(["personality", "knowledge", "behavior", "style"]),
  priority: z.object({
    value: z.number().min(0).max(100),
    decay: z.number().min(0).max(1),
  }).optional(),
  scope: z.object({
    models: z.array(z.string()),
    contexts: z.array(z.string()),
  }).optional(),
});


