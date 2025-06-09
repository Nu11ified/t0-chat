// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `t0-chat_${name}`);

export * from "./schema/auth-schema";
export * from "./schema/ai-chat";
export * from "./schema/settings";