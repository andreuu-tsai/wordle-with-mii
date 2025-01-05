import ChatWindow from "@/components/chat-window";
import Wordle from "@/components/wordle/wordle";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (session) {
    const userId = session.user?.id as string;
    return (
      <>
        <Wordle id={id} userId={userId} />
        <ChatWindow userId={userId} />
      </>
    );
  }
  redirect("/api/auth/signin");
}
