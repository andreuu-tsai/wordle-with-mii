"use client";
import { newGame } from "@/lib/wordle-actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function MainMenu({ userId }: { userId: string }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Main Menu</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around">
        <Button
          onClick={async () => {
            await newGame(userId);
            redirect("/wordle");
          }}
        >
          New Game
        </Button>
        <Button variant="outline">
          <Link href="/wordle">Continue</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
