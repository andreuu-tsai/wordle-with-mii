import { Game, WORD_LENGTH } from "@/lib/wordleGame";
import { useState } from "react";

export function useWordleInput(
  game: Game | undefined,
  onSubmit: (word: string) => void,
) {
  const [inputValue, setInputValue] = useState("");
  const handleInput = (key: string) => {
    key = key.toUpperCase();
    if (!game || game.isGameOver) return;
    setInputValue((prev) => {
      if (key === "ENTER" && prev.length === WORD_LENGTH) {
        onSubmit(prev);
        return "";
      } else if (key === "BACKSPACE") {
        return prev.slice(0, -1);
      } else if (key.match(/^[A-Z]$/) && prev.length < WORD_LENGTH) {
        return prev + key;
      }
      return prev;
    });
  };
  const resetInput = () => {
    setInputValue("");
  };

  return { inputValue, handleInput, resetInput };
}
