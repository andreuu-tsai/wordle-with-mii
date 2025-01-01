import Wordle from "@/components/wordle/wordle";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use<{ id: number }>(params);
  return <Wordle id={id} />;
}
