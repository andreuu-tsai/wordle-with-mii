"use server";
import { db } from "@/db/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkWord } from "./checkWord";
import { Game } from "./wordleGame";

export async function getGameById(id: number): Promise<Game> {
  const game = (
    await db.select().from(games).where(eq(games.id, id)).execute()
  )[0];
  const words = game.words as Array<string>;
  return {
    id: game.id,
    userId: game.userId!,
    words: words.map((word) => checkWord(word, game.solution)),
    isGameOver: game.isGameOver,
    gameResult: game.gameResult,
  };
}
