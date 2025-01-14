"use server";
import { db } from "@/db/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import generateCongrats, {
  generateEncouragementOrTaunt,
  generateOneMoreChance,
} from "./chat";
import { checkWord } from "./checkWord";
import { authenticate } from "./utils";
import {
  Correctness,
  DEFAULT_GAME_STATE,
  EXTRA_LIFE_PROBABILITY,
  Game,
} from "./wordleGame";

export async function getGameByUserId(userId: string): Promise<Game> {
  await authenticate(userId);
  const game = (
    await db.select().from(games).where(eq(games.userId, userId)).execute()
  )[0];
  const words = game.words as Array<string>;
  return {
    id: game.id,
    userId: game.userId!,
    words: words.map((word) => checkWord(word, game.solution)),
    isGameOver: game.isGameOver,
    gameResult: game.gameResult,
    maxAttempts: game.maxAttempts,
  };
}

export async function submitWord(word: string, userId: string): Promise<Game> {
  await authenticate(userId);
  try {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.userId, userId))
      .then((rows) => rows[0]);
    if (!game) {
      throw new Error("Invalid input. The game is not found");
    }
    if (game.isGameOver) {
      throw new Error("Invalid input. The game is over.");
    }
    if (!word || typeof word !== "string") {
      throw new Error("Invalid input. 'word' must be a string.");
    }
    const wordStatus = checkWord(word.toUpperCase(), game.solution);
    const prevWords = game.words as Array<string>;
    let newGame;

    if (wordStatus.every((c) => c.correctness === Correctness.Correct)) {
      newGame = {
        ...game,
        words: [...prevWords, word],
        gameResult: "win",
        isGameOver: true,
      };
      generateCongrats(
        userId,
        newGame.words.map((word) => checkWord(word, game.solution)),
      );
    } else if (prevWords.length + 1 === game.maxAttempts) {
      if (Math.random() < EXTRA_LIFE_PROBABILITY) {
        newGame = {
          ...game,
          words: [...prevWords, word],
          maxAttempts: game.maxAttempts + 1,
        };
        generateOneMoreChance(
          userId,
          newGame.words.map((word) => checkWord(word, game.solution)),
        );
      } else {
        newGame = {
          ...game,
          words: [...prevWords, word],
          gameResult: "lose",
          isGameOver: true,
        };
        generateEncouragementOrTaunt(
          userId,
          newGame.words.map((word) => checkWord(word, game.solution)),
          game.solution,
        );
      }
    } else {
      newGame = {
        ...game,
        words: [...prevWords, word],
      };
    }
    await db
      .update(games)
      .set(newGame)
      .where(eq(games.userId, userId))
      .execute();
    return {
      id: newGame.id,
      userId: newGame.userId!,
      words: newGame.words.map((word) => checkWord(word, newGame.solution)),
      isGameOver: newGame.isGameOver,
      gameResult: newGame.gameResult,
      maxAttempts: newGame.maxAttempts,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function generateSolution() {
  return "PEACH";
}

export async function newGame(userId: string) {
  await authenticate(userId);
  try {
    const game = await db
      .select()
      .from(games)
      .where(eq(games.userId, userId))
      .execute();
    if (game.length === 0) {
      await db.insert(games).values({ solution: generateSolution(), userId });
    } else {
      await resetGame(userId);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function resetGame(userId: string) {
  await authenticate(userId);
  try {
    await db
      .update(games)
      .set(DEFAULT_GAME_STATE)
      .where(eq(games.userId, userId))
      .execute();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
