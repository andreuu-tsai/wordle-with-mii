"use client";
import { Board } from "@/components/wordle/Board";
import Keyboard from "@/components/wordle/Keyboard";
import useKeydown from "@/hooks/useKeydown";
import useWordle from "@/hooks/useWordle";
import { checkWord } from "@/lib/checkWord";
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
  const words = wordleState.words;

  function handleInput(key: string) {
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
          setWordleState((prevState) => ({
            ...prevState,
            words: [...prevState.words, currentGuess],
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

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Board n_words={MAX_ATTEMPTS} n_characters={WORD_LENGTH} words={words} />
      <p className="h-4 m-2">{inputValue}</p>
      <input
        type="button"
        value="Reset"
        onClick={(e) => {
          setInputValue("");
          e.currentTarget.blur();
        }}
        className="w-full"
      />
      <Keyboard handleInput={handleInput} />
    </div>
  );
}
