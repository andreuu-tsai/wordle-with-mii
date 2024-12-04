import { cn } from "@/lib/utils";
import {
  CharacterStatus,
  Correctness,
  getCharacterStyle,
  WordStatus,
} from "@/lib/wordleGame";

export function Tile({ character }: { character: CharacterStatus }) {
  return (
    <div
      className={cn(
        "flex aspect-square w-14 items-center justify-center text-white",
        getCharacterStyle(character.correctness),
      )}
    >
      <p className="text-3xl font-bold">{character.character}</p>
    </div>
  );
}

export function Board({
  nWords,
  nCharacters,
  words,
}: {
  nWords: number;
  nCharacters: number;
  words: WordStatus[];
}) {
  if (words.length < nWords) {
    words = words.concat(
      Array(nWords - words.length).fill(
        Array(nCharacters).fill({
          character: " ",
          correctness: Correctness.Unknown,
        }),
      ),
    );
  }
  return (
    <div className="mt-3 flex h-[360px] w-80 flex-col">
      {words.map((word, index) => {
        return (
          <div
            key={index}
            className="mb-1 flex h-14 flex-shrink justify-center gap-1"
          >
            {word.map((character, index) => (
              <Tile key={index} character={character} />
            ))}
          </div>
        );
      })}
      <div></div>
    </div>
  );
}
