import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function authenticate(userId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized: No session found");
  }
  if (session.user?.id !== userId) {
    throw new Error("Unauthorized: User ID mismatch");
  }
}
