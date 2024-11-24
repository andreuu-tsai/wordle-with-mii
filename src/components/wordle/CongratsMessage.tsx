"use client";
import getCongrats from "@/lib/getCongrats";
import { WordStatus } from "@/lib/wordleGame";
import { useEffect, useState } from "react";

export default function CongratsMessage({ words }: { words: WordStatus[] }) {
  const [congratsMessage, setCongratsMessage] = useState("");
  useEffect(() => {
    async function handleGetCongrats() {
      try {
        const congrats = await getCongrats(words);
        setCongratsMessage(congrats);
      } catch (error) {
        console.error("Error fetching congrats message:", error);
      }
    }
    handleGetCongrats();
  }, [words]);
  return <div className="text-xl text-muted-foreground">{congratsMessage}</div>;
}
