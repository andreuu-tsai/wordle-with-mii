export enum Correctness {
  Unknown = 0,
  Incorrect = 1,
  Misplaced = 2,
  Correct = 3,
}

export type CharacterStatus = {
  character: string;
  correctness: Correctness;
};

export type WordStatus = CharacterStatus[];
