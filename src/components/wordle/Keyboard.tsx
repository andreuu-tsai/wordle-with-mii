import { Button } from "../ui/button";

export default function Keyboard({
  handleInput,
}: {
  handleInput: (k: string) => void;
}) {
  const keyboardRow1 = "Q W E R T Y U I O P";
  const keyboardRow2 = "A S D F G H J K L";
  const keyboardRow3 = "Enter Z X C V B N M Backspace";

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-1 p-1 w-full h-16">
        {keyboardRow1.split(" ").map((k) => (
          <Button
            variant="secondary"
            key={k}
            className="m-1 h-full w-11"
            onClick={(e) => {
              handleInput(k);
              e.currentTarget.blur();
            }}
          >
            {k}
          </Button>
        ))}
      </div>
      <div className="flex justify-center mb-1 p-1 w-full h-16">
        {keyboardRow2.split(" ").map((k) => (
          <Button
            variant="secondary"
            key={k}
            className="m-1 h-full w-11"
            onClick={(e) => {
              handleInput(k);
              e.currentTarget.blur();
            }}
          >
            {k}
          </Button>
        ))}
      </div>
      <div className="flex justify-center mb-1 p-1 w-full h-16">
        {keyboardRow3.split(" ").map((k) => (
          <Button
            variant="secondary"
            key={k}
            className="m-1 h-full w-min-11"
            onClick={(e) => {
              k = k.toUpperCase(); // match
              handleInput(k);
              e.currentTarget.blur();
            }}
          >
            {k}
          </Button>
        ))}
      </div>
    </div>
  );
}
