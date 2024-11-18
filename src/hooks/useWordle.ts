import { WordStatus } from "@/lib/wordleGame";
import { useState } from "react";

export default function useWordle() {
  const [wordleState, setWordleState] = useState<{
    words: WordStatus[];
    isGameOver: boolean;
    gameResult: "win" | "lose" | null;
  }>({
    words: [],
    isGameOver: false,
    gameResult: null,
  });
  return { wordleState, setWordleState };
}
