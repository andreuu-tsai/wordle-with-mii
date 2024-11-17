import { Correctness, WordStatus } from "@/lib/wordleGame";
import { useState } from "react";

export default function useWordle() {
  const [wordleState, setWordleState] = useState<{ words: WordStatus[] }>({
    words: [
      [
        { character: "F", correctness: Correctness.Correct },
        { character: "L", correctness: Correctness.Incorrect },
        { character: "O", correctness: Correctness.Misplaced },
        { character: "U", correctness: Correctness.Unknown },
        { character: "R", correctness: Correctness.Correct },
      ],
    ],
  });
  return { wordleState, setWordleState };
}
