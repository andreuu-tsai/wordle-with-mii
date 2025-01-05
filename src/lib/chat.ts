"use server";
import { db } from "@/db/db";
import { messages } from "@/db/schema";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { asc, eq } from "drizzle-orm";
import { WordStatus } from "./wordleGame";

export default async function generateCongrats(
  userId: string,
  words: WordStatus[],
) {
  const solution = words[words.length - 1].map((c) => c.character).join("");
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });
  const guess = words
    .map((word) => word.map((char) => char.character).join(""))
    .join(", ");
  const messages = [
    new SystemMessage(`You are a friendly game master of wordle game. 
        The user win the game. Make a joke about user's guesses and congrats user in 50 words
        The answer is ${solution}`),
    new HumanMessage(`My guesses are ${guess}`),
  ];
  const content = (await model.invoke(messages)).content.toString();
  addMessage(userId, "mii", content);
}

export async function addMessage(
  userId: string,
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

export async function getMessagesByUserId(userId: string) {
  return await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(asc(messages.createdAt))
    .execute();
}
