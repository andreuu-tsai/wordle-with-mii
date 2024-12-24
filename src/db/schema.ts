import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 100 }),
    authProvider: varchar("auth_provider", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return [uniqueIndex("unique_idx").on(users.email)];
  },
);

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  words: json("words").default([]).notNull(),
  solution: varchar("solution").notNull(),
  isGameOver: boolean("is_game_over").default(false).notNull(),
  gameResult: varchar("game_result", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  role: varchar("role", { length: 50 }).notNull(), // user, agent
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
