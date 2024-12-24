"use client";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/wordle/Board";
import CongratsMessage from "@/components/wordle/CongratsMessage";
import Keyboard from "@/components/wordle/Keyboard";
import { useWordleInput } from "@/hooks/use-wordle-input";
import useKeydown from "@/hooks/useKeydown";
import { getGameById } from "@/lib/getGameById";
import { Game, MAX_ATTEMPTS, WORD_LENGTH } from "@/lib/wordleGame";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";

const DEFAULT_GAME_STATE = {
  words: [],
  isGameOver: false,
  gameResult: null,
};

export default function Wordle({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    data: game,
    error,
  } = useQuery<Game>({
    queryKey: ["games", { id: id }],
    queryFn: async () => await getGameById(id),
  });

  const { mutateAsync: submitWord } = useMutation({
    mutationFn: async ({ id, word }: { id: number; word: string }) => {
      const response = await fetch(`/api/wordle/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit word");
      }

      return response.json();
    },
    onSuccess: (updatedGame) => {
      queryClient.setQueryData(["games", { id }], updatedGame);
    },
  });

  const { inputValue, handleInput, resetInput } = useWordleInput(
    game,
    (word) => {
      submitWord({ id, word });
    },
  );

  const { mutateAsync: resetGame } = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/wordle/${id}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reset the game");
      }

      return response.json();
    },
    onMutate: async () => {
      queryClient.setQueryData(["games", { id }], {
        id,
        ...DEFAULT_GAME_STATE,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["games", { id }], {
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
      <Board nWords={MAX_ATTEMPTS} nCharacters={WORD_LENGTH} words={words} />
      <p className="m-1 h-4">{inputValue}</p>
      <Keyboard handleInput={handleInput} words={words} />
      {game.gameResult === "win" && (
        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold">You win!</div>
          <CongratsMessage words={words} />
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
            resetInput();
            resetGame(id);
            e.currentTarget.blur();
          }}
        >
          <RotateCw />
        </Button>
      )}
    </div>
  );
}
