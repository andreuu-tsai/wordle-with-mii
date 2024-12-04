import { cn } from "@/lib/utils";
import {
  WordStatus,
  buildCharCorrectnessMap,
  getCharacterStyle,
} from "@/lib/wordleGame";
import { Button } from "../ui/button";

export default function Keyboard({
  handleInput,
  words,
}: {
  handleInput: (k: string) => void;
  words: WordStatus[];
}) {
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];
  const charCorrectnessMap = buildCharCorrectnessMap(words);

  return (
    <div className="flex flex-col">
      {keyboardRows.map((keyboardRow, index) => {
        return (
          <div key={index} className="mb-1 flex h-16 w-full justify-center p-1">
            {keyboardRow.map((k) => (
              <Button
                variant="secondary"
                key={k}
                className={cn(
                  "w-min-11 m-1 h-full",
                  getCharacterStyle(charCorrectnessMap.get(k)!),
                )}
                onClick={(e) => {
                  handleInput(k);
                  e.currentTarget.blur();
                }}
              >
                {k}
              </Button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
