import Nav from "@/components/Nav";
import { AuthSessionProvider, ReactQueryProvider } from "@/components/provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthSessionProvider>
      <ReactQueryProvider>
        <div className="flex h-screen max-w-full flex-col items-center">
          <Nav />
          {children}
        </div>
      </ReactQueryProvider>
    </AuthSessionProvider>
  );
}
