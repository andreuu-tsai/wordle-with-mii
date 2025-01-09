import MainMenu from "@/components/wordle/main-menu";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div>
      <MainMenu userId={session.user?.id!} />
    </div>
  );
}
