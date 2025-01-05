import Nav from "@/components/Nav";
import ChatWindow from "@/components/chat-window";
import ReactQueryProvider from "@/components/provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className="flex w-screen flex-col items-center">
        <Nav />
        {children}
        <ChatWindow userId={2} />
      </div>
    </ReactQueryProvider>
  );
}
