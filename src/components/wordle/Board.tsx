import { cn } from "@/lib/utils";
import { CharacterStatus, Correctness, WordStatus } from "@/lib/wordleGame";

export function Tile({ character }: { character: CharacterStatus }) {
  return (
    <div
      className={cn(
        "flex justify-center items-center aspect-square w-14 text-white",
        {
          "border-2 border-neutral-300 text-black":
            character.correctness === Correctness.Unknown,
          "bg-green-400": character.correctness === Correctness.Correct,
          "bg-neutral-400": character.correctness === Correctness.Incorrect,
          "bg-yellow-400": character.correctness === Correctness.Misplaced,
        },
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
    <div className="flex flex-col h-96 w-80 m-3">
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
