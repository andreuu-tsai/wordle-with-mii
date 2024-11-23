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
  n_words,
  n_characters,
  words,
}: {
  n_words: number;
  n_characters: number;
  words: WordStatus[];
}) {
  if (words.length < n_words) {
    words = words.concat(
      Array(n_words - words.length).fill(
        Array(n_characters).fill({
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
