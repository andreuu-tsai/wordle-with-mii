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
          <div key={index} className="flex justify-center mb-1 p-1 w-full h-16">
            {keyboardRow.map((k) => (
              <Button
                variant="secondary"
                key={k}
                className={cn(
                  "m-1 h-full w-min-11",
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
