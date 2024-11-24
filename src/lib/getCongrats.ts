"use server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { WordStatus } from "./wordleGame";

export default async function getCongrats(
  words: WordStatus[],
): Promise<string> {
  const solution = "PEACH"; // mock solution
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
  return (await model.invoke(messages)).content.toString();
}
