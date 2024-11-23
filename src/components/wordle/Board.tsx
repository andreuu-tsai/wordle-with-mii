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
        "flex justify-center items-center aspect-square w-14 text-white",
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
    <div className="flex flex-col h-[360px] w-80 mt-3">
      {words.map((word, index) => {
        return (
          <div
            key={index}
            className="flex justify-center flex-shrink h-14 gap-1 mb-1"
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
