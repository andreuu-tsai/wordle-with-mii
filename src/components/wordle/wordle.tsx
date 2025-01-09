"use client";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/wordle/Board";
import Keyboard from "@/components/wordle/Keyboard";
import { useWordleInput } from "@/hooks/use-wordle-input";
import useKeydown from "@/hooks/useKeydown";
import { getGameByUserId, resetGame, submitWord } from "@/lib/wordle-actions";
import {
  DEFAULT_GAME_STATE,
  Game,
  MAX_ATTEMPTS,
  WORD_LENGTH,
} from "@/lib/wordleGame";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";

export default function Wordle({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

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

  const { inputValue, handleInput, resetInput } = useWordleInput(game, submit);
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
