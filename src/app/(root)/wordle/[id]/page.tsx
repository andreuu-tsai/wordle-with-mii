"use client";
import Wordle from "@/components/wordle/wordle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const queryClient = new QueryClient();
  const { id } = use<{ id: number }>(params);

  return (
    <QueryClientProvider client={queryClient}>
      <Wordle id={id} />
    </QueryClientProvider>
  );
}
