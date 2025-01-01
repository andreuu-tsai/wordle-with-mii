"use server";
import { db } from "@/db/db";
import { messages } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function addMessage(
  userId: number,
  role: string,
  content: string,
) {
  const newMessage = {
    userId,
    role,
    content,
  };
  await db.insert(messages).values(newMessage).execute();
}

export async function getMessagesByUserId(userId: number) {
  return await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(asc(messages.createdAt))
    .execute();
}
