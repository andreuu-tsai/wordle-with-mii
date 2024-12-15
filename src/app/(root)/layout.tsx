import Nav from "@/components/Nav";
import ChatWindow from "@/components/chat-window";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-screen flex-col items-center">
      <Nav />
      {children}
      <ChatWindow />
    </div>
  );
}
