"use client";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/wordle/Board";
import Keyboard from "@/components/wordle/Keyboard";
import useKeydown from "@/hooks/useKeydown";
import useWordle from "@/hooks/useWordle";
import { checkWord } from "@/lib/checkWord";
import getCongrats from "@/lib/getCongrats";
import { Correctness } from "@/lib/wordleGame";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export default function Wordle() {
  const { wordleState, setWordleState } = useWordle();
  const [inputValue, setInputValue] = useState("");
  const [isCheckingWord, setIsCheckingWord] = useState({
    word: "",
    check: false,
  });
  const [congratsMessage, setCongratsMessage] = useState("");
  const words = wordleState.words;

  function restart() {
    setWordleState({
      words: [],
      isGameOver: false,
      gameResult: null,
    });
    setInputValue("");
    setIsCheckingWord({ word: "", check: false });
    setCongratsMessage("");
  }

  function handleInput(key: string) {
    if (wordleState.isGameOver) return;
    key = key.toUpperCase();
    setInputValue((prev) => {
      if (key === "ENTER" && prev.length === WORD_LENGTH) {
        setIsCheckingWord({ word: prev, check: true });
        return "";
      } else if (key === "BACKSPACE") {
        return prev.slice(0, -1);
      } else if (key.match(/^[A-Z]$/) && prev.length < WORD_LENGTH) {
        return prev + key;
      }
      return prev;
    });
  }

  useKeydown((e) => {
    handleInput(e.key);
  });

  useEffect(() => {
    if (isCheckingWord.check) {
      const handleCheckWord = async () => {
        try {
          const currentGuess = await checkWord(isCheckingWord.word);
          setWordleState((prev) => ({
            ...prev,
            words: [...prev.words, currentGuess],
          }));
        } catch (error) {
          console.error("Can't check the word:", error);
        } finally {
          setIsCheckingWord({ word: "", check: false });
        }
      };

      handleCheckWord();
    }
  }, [isCheckingWord, setWordleState]);

  useEffect(() => {
    // win
    if (
      words.some((word) =>
        word.every((c) => c.correctness === Correctness.Correct),
      )
    ) {
      async function handleWin() {
        setWordleState((prev) => ({
          ...prev,
          gameResult: "win",
          isGameOver: true,
        }));
        try {
          const congrats = await getCongrats(words);
          setCongratsMessage(congrats);
        } catch (error) {
          console.error("Error fetching congrats message:", error);
        }
      }
      handleWin();
    }
    // lose
    else if (words.length === MAX_ATTEMPTS) {
      setWordleState((prev) => ({
        ...prev,
        gameResult: "lose",
        isGameOver: true,
      }));
    }
  }, [words, setWordleState]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Board n_words={MAX_ATTEMPTS} n_characters={WORD_LENGTH} words={words} />
      <p className="h-4 m-1">{inputValue}</p>
      <Keyboard handleInput={handleInput} />
      {wordleState.gameResult === "win" && (
        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold">You win!</div>
          <div className="text-xl text-muted-foreground">{congratsMessage}</div>
        </div>
      )}
      {wordleState.gameResult === "lose" && (
        <div className="text-lg font-semibold">You lose!</div>
      )}
      {wordleState.isGameOver && (
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            restart();
            e.currentTarget.blur();
          }}
        >
          <RotateCw />
        </Button>
      )}
    </div>
  );
}
