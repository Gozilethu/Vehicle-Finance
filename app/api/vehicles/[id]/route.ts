import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const supabase = createServerClient()

    const { data: vehicle, error } = await supabase
      .from("Vehicle")
      .select(`
        *,
        VehicleImage (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { make, model, year, mileage, monthlyPayment, transmission, features, imageUrls } = body

    // Validate required fields
    if (!make || !model || !year || !mileage || !monthlyPayment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Update vehicle in database
    const { error } = await supabase
      .from("Vehicle")
      .update({
        make,
        model,
        year,
        mileage,
        monthly_payment: monthlyPayment,
        transmission,
        features,
      })
      .eq("id", id)

    if (error) throw error

    // Delete existing images
    const { error: deleteError } = await supabase.from("VehicleImage").delete().eq("vehicle_id", id)

    if (deleteError) throw deleteError

    // Create new vehicle images
    if (imageUrls && imageUrls.length > 0) {
      const vehicleImages = imageUrls.map((url: string) => ({
        url,
        vehicle_id: id,
      }))

      const { error: imageError } = await supabase.from("VehicleImage").insert(vehicleImages)

      if (imageError) throw imageError
    }

    // Return the updated vehicle with images
    const { data: updatedVehicle, error: fetchError } = await supabase
      .from("Vehicle")
      .select(`
        *,
        VehicleImage (*)
      `)
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const supabase = createServerClient()

    // Delete vehicle (cascade will handle images due to our foreign key constraint)
    const { error } = await supabase.from("Vehicle").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}

