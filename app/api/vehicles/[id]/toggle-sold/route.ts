import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { isSold } = body

    const supabase = createServerClient()

    // Update vehicle sold status
    const { data: vehicle, error } = await supabase
      .from("Vehicle")
      .update({
        is_sold: isSold,
        sold_date: isSold ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error updating vehicle sold status:", error)
    return NextResponse.json({ error: "Failed to update vehicle sold status" }, { status: 500 })
  }
}

