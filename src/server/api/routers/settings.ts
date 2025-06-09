import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { userSettings, updateUserSettingsSchema } from "@/server/db/schema/settings";
import { eq } from "drizzle-orm";

export const settingsRouter = createTRPCRouter({
  getUserSettings: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session.session;
    let settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    });

    if (!settings) {
      const newUserSettings = {
        userId,
        defaultModel: 'openai:gpt-4o',
      };
      await db.insert(userSettings).values(newUserSettings);
      settings = await db.query.userSettings.findFirst({
        where: eq(userSettings.userId, userId),
      });
    }

    return settings;
  }),

  updateUserSettings: protectedProcedure
    .input(updateUserSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.session;
      await db
        .update(userSettings)
        .set(input)
        .where(eq(userSettings.userId, userId));
      return { success: true };
    }),
}); 