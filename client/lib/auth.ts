import bcrypt from "bcrypt";
import db from "./db";
import CredentialsProvider from "next-auth/providers/credentials";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials: any) {
        let user = await db.user.findUnique({
          where: {
            username: credentials.username,
          },
        });
        if (!user) {
          throw new Error("No user found");
        }

        const validpass = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!validpass) throw new Error("Invalid Password");
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ token, session }: any) {
      session.user.id = token.id;
      session.user.name = token.username;
      return session;
    },
  },
};
