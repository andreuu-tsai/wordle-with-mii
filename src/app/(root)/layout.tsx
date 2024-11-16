import Nav from "@/components/Nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-screen flex-col items-center">
      <Nav />
      {children}
    </div>
  );
}
