import bcrypt from "bcryptjs";
import NextAuth, { type AuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import credentials from "next-auth/providers/credentials";
import prisma from "@/app/libs/prismadb";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    credentials({
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
          throw new Error("无效的凭证");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          }
        })

        if(!user || !user?.hashedPassword) {
          throw new Error("无效的凭证");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if(!isCorrectPassword) {
          throw new Error("无效的凭证");
        }
        return user;
      },
    }),
    GitHub,
    Google,
  ],
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
} 

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };