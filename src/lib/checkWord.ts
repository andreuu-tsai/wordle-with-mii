"use server";
import { Correctness, WordStatus } from "./wordleGame";

export async function checkWord(input: string): Promise<WordStatus> {
  const solution = "PEACH";
  if (input.length !== solution.length) {
    throw new Error("The strings must have the same length");
  }
  return input.split("").map((character: string, index) => ({
    character,
    correctness:
      character === solution[index]
        ? Correctness.Correct
        : solution.includes(character)
          ? Correctness.Misplaced
          : Correctness.Incorrect,
  }));
}
