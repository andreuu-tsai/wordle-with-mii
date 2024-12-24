import { db } from "@/db/db";
import { games } from "@/db/schema";
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
    await db
      .update(games)
      .set({ gameResult: null, isGameOver: false, words: [] })
      .where(eq(games.id, id))
      .execute();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
