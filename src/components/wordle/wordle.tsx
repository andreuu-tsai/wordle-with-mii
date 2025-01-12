"use client";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/wordle/Board";
import Keyboard from "@/components/wordle/Keyboard";
import useKeydown from "@/hooks/useKeydown";
import { getGameByUserId, resetGame, submitWord } from "@/lib/wordle-actions";
import { DEFAULT_GAME_STATE, Game, WORD_LENGTH } from "@/lib/wordleGame";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import { useState } from "react";

export default function Wordle({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const {
    isPending,
    isError,
    data: game,
    error,
  } = useQuery<Game>({
    queryKey: ["games", { userId }],
    queryFn: async () => await getGameByUserId(userId),
  });

  const { mutate: submit } = useMutation({
    mutationFn: (word: string) => submitWord(word, userId),
    onSuccess: (updatedGame: Game) => {
      queryClient.setQueryData(["games", { userId }], updatedGame);
    },
  });

  const handleInput = (key: string) => {
    key = key.toUpperCase();
    if (!game || game.isGameOver) return;
    else if (key === "ENTER" && inputValue.length === WORD_LENGTH) {
      submit(inputValue);
    }
    setInputValue((prev) => {
      if (key === "ENTER" && prev.length === WORD_LENGTH) {
        return "";
      } else if (key === "BACKSPACE") {
        return prev.slice(0, -1);
      } else if (key.match(/^[A-Z]$/) && prev.length < WORD_LENGTH) {
        return prev + key;
      }
      return prev;
    });
  };

  const { mutateAsync: reset } = useMutation({
    mutationFn: async () => resetGame(userId),
    onMutate: async () => {
      queryClient.setQueryData(["games", { userId }], {
        userId,
        ...DEFAULT_GAME_STATE,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["games", { userId }], {
        ...game,
        ...DEFAULT_GAME_STATE,
      });
    },
  });

  useKeydown((e) => {
    handleInput(e.key);
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Something is wrong...</div>;
  }
  const words = game.words;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Board
        nWords={game.maxAttempts}
        nCharacters={WORD_LENGTH}
        words={words}
      />
      <p className="m-1 h-4">{inputValue}</p>
      <Keyboard handleInput={handleInput} words={words} />
      {game.gameResult === "win" && (
        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold">You win!</div>
        </div>
      )}
      {game.gameResult === "lose" && (
        <div className="text-lg font-semibold">You lose!</div>
      )}
      {game.isGameOver && (
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            setInputValue("");
            reset();
            e.currentTarget.blur();
          }}
        >
          <RotateCw />
        </Button>
      )}
    </div>
  );
}
