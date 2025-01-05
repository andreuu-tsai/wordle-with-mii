import { db } from "@/db/db";
import { getOrCreateUser } from "@/db/userHelpers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub, Resend({ from: "onboarding@resend.dev" })],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await getOrCreateUser(user.email!, user.name!, account?.provider!);
      } catch (error) {
        console.error("fail to getOrCreate user", error);
        return false;
      }
      return true;
    },
  },
});
