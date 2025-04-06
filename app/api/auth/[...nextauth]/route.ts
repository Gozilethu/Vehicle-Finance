import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createServerClient } from "@/lib/supabase"
import { compare } from "bcryptjs"

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

        const supabase = createServerClient()

        const { data: user, error } = await supabase
          .from("User")
          .select("*")
          .eq("username", credentials.username)
          .single()

        if (error || !user) {
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

