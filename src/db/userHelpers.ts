"use server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(
  email: string,
  username: string,
  authProvider: string,
) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();

  if (existingUser.length > 0) {
    return existingUser[0];
  } else {
    await db.insert(users).values({ email, authProvider, username });
    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    return newUser[0];
  }
}
