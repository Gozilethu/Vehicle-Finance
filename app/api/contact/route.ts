import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Create contact entry in database
    const { data: contact, error } = await supabase
      .from("Contact")
      .insert({
        name,
        email,
        phone,
        subject,
        message,
      })
      .select()
      .single()

    if (error) throw error

    // In a real application, you would also send an email notification here

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error("Error saving contact:", error)
    return NextResponse.json({ error: "Failed to save contact information" }, { status: 500 })
  }
}

