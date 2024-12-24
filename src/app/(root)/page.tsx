"use client";
import { QueryClient } from "@tanstack/react-query";

export default function Page() {
  const queryClient = new QueryClient();
  return (
    <div>
      之後會有new game, continue之類的，現在請先轉往
      <a href="/wordle/1">Wordle/1</a>
    </div>
  );
}
