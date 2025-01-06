import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div>
      之後會有new game, continue之類的，現在請先轉往
      <a href="/wordle/1">Wordle/1</a>
    </div>
  );
}
