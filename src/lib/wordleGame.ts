export enum Correctness {
  Unknown = 0,
  Incorrect = 1,
  Misplaced = 2,
  Correct = 3,
}

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export type CharacterStatus = {
  character: string;
  correctness: Correctness;
};

export const DEFAULT_GAME_STATE = {
  words: [],
  isGameOver: false,
  gameResult: null,
};

export type WordStatus = CharacterStatus[];

export function getCharacterStyle(correctness: Correctness): string {
  switch (correctness) {
    case Correctness.Unknown:
      return "border-2 border-neutral-300 text-black";
    case Correctness.Incorrect:
      return "bg-neutral-400";
    case Correctness.Misplaced:
      return "bg-yellow-400";
    case Correctness.Correct:
      return "bg-green-400";
  }
}

export function buildCharCorrectnessMap(
  words: WordStatus[],
): Map<string, Correctness> {
  return words.reduce((map, word) => {
    word.forEach((char) => {
      const existingCorrectness =
        map.get(char.character) || Correctness.Unknown;
      if (char.correctness > existingCorrectness) {
        map.set(char.character, char.correctness);
      }
    });
    return map;
  }, new Map<string, Correctness>());
}

export type Game = {
  id: number;
  userId: string;
  words: WordStatus[];
  isGameOver: boolean;
  gameResult: string | null;
};
