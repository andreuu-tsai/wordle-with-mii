import UserButton from "@/components/UserButton";
import { CircleHelp, Medal, Menu, Settings } from "lucide-react";
import { Button } from "./ui/button";

export default async function Nav() {
  return (
    <div className="flex w-full items-center justify-between border border-slate-200">
      <Button className="m-1" variant="ghost" size="icon">
        <Menu />
      </Button>
      <div className="flex items-center">
        <div className="mx-2 flex items-center gap-2">
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
        <div className="mr-2">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
