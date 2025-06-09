import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  createChat,
  loadChat,
  saveChat,
  loadStreams,
  appendStreamId,
  getMessagesByChatId,
} from "@/lib/chat-store";
import { type Message } from "ai";

export const chatRouter = createTRPCRouter({
  createChat: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      return await createChat(input.userId);
    }),

  loadChat: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      return await loadChat(input.id, input.userId);
    }),

  getMessagesByChatId: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      return await getMessagesByChatId({ id: input.id, userId: input.userId });
    }),

  saveChat: publicProcedure
    .input(
      z.object({
        id: z.string(),
        messages: z.any().array() as z.ZodType<Message[]>,
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await saveChat(input);
    }),

  loadStreams: publicProcedure
    .input(z.object({ chatId: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      return await loadStreams(input.chatId, input.userId);
    }),

  appendStreamId: publicProcedure
    .input(z.object({ chatId: z.string(), streamId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      await appendStreamId(input);
    }),
}); 