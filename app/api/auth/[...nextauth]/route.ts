import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { compare } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: user, error } = await supabase.from("User").select("*").eq("username", username).single()

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

