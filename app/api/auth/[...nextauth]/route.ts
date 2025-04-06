import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { compare } from "bcrypt"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.username,
          email: null,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
})

export { handler as GET, handler as POST }

