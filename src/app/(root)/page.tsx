import MainMenu from "@/components/wordle/main-menu";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <MainMenu userId={session.user?.id!} />
    </div>
  );
}
