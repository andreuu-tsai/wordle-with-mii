import { CircleHelp, Medal, Menu, Settings } from "lucide-react";
import { Button } from "./ui/button";

export default function Nav() {
  return (
    <div className="flex w-full justify-between border border-slate-200 p-3">
      <Button variant="ghost" size="icon">
        <Menu />
      </Button>
      <div className="mx-2 flex gap-2">
        <Button variant="ghost" size="icon">
          <Medal />
        </Button>
        <Button variant="ghost" size="icon">
          <CircleHelp />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </div>
    </div>
  );
}
