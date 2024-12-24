import { db } from "@/db/db";
import { games } from "@/db/schema";
import { checkWord } from "@/lib/checkWord";
import { Correctness, MAX_ATTEMPTS } from "@/lib/wordleGame";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: number }> },
) {
  const { id } = await params;
  try {
    const game = (await db.select().from(games).where(eq(games.id, id)))[0];
    if (!game) {
      return NextResponse.json(
        { error: `Invalid input. The game ${id} is not found.` },
        { status: 400 },
      );
    }
    const words = game.words as Array<string>;
    if (game.isGameOver) {
      return NextResponse.json(
        { error: "Invalid input. The game is over." },
        { status: 400 },
      );
    }
    const body = await request.json();
    let { word } = body;
    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Invalid input. 'word' must be a string." },
        { status: 400 },
      );
    }
    word = word.toUpperCase();

    const wordStatus = checkWord(word, game.solution);
    let newGame;
    if (wordStatus.every((c) => c.correctness === Correctness.Correct)) {
      newGame = {
        ...game,
        words: [...words, word],
        gameResult: "win",
        isGameOver: true,
      };
    } else if (words.length + 1 === MAX_ATTEMPTS) {
      newGame = {
        ...game,
        words: [...words, word],
        gameResult: "lose",
        isGameOver: true,
      };
    } else {
      newGame = { ...game, words: [...words, word] };
    }
    await db.update(games).set(newGame).where(eq(games.id, id)).execute();
    return NextResponse.json({
      id: newGame.id,
      userId: newGame.userId!,
      words: newGame.words.map((word) => checkWord(word, newGame.solution)),
      isGameOver: newGame.isGameOver,
      gameResult: newGame.gameResult,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
