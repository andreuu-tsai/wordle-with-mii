import { getOrCreateUser } from "@/db/userHelpers";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
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
