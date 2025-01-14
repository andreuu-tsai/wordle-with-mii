"use server";
import { db } from "@/db/db";
import { messages } from "@/db/schema";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { asc, eq } from "drizzle-orm";
import { authenticate } from "./utils";
import { WordStatus } from "./wordleGame";

export default async function generateCongrats(
  userId: string,
  words: WordStatus[],
) {
  await authenticate(userId);
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

export async function generateEncouragementOrTaunt(
  userId: string,
  words: WordStatus[],
  solution: string,
) {
  await authenticate(userId);
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });
  const guess = words
    .map((word) => word.map((char) => char.character).join(""))
    .join(", ");
  let systemMessage;
  if (Math.random() < 0.5) {
    systemMessage =
      new SystemMessage(`You are a humor game master of wordle game. 
      The user lost the game. Taunt the user with a joke about user's guesses in 50 words
      The answer is ${solution}`);
  } else {
    systemMessage =
      new SystemMessage(`You are a humor game master of wordle game. 
      The user lost the game. Encourage the user. You can talk about user's guesses in 50 words
      The answer is ${solution}`);
  }
  const content = (
    await model.invoke([
      systemMessage,
      new HumanMessage(`guesses are ${guess}`),
    ])
  ).content.toString();
  addMessage(userId, "mii", content);
}

export async function addMessage(
  userId: string,
  role: string,
  content: string,
) {
  await authenticate(userId);
  const newMessage = {
    userId,
    role,
    content,
  };
  await db.insert(messages).values(newMessage).execute();
}

export async function getMessagesByUserId(userId: string) {
  await authenticate(userId);
  return await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(asc(messages.createdAt))
    .execute();
}

export async function generateOneMoreChance(
  userId: string,
  words: WordStatus[],
) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });
  const guess = words
    .map((word) => word.map((char) => char.character).join(""))
    .join(", ");
  const messages = [
    new SystemMessage("You are a humor game master of wordle game."),
    new HumanMessage(
      `The user lost the game. But you want to give him another chance. 
      Please generate a sentence tell the user about it. 
      Here are player's guesses: ${guess}`,
    ),
  ];

  const content = (await model.invoke(messages)).content.toString();
  addMessage(userId, "mii", content);
}
