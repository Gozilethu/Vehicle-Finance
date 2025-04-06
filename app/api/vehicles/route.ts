import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: vehicles, error } = await supabase
      .from("Vehicle")
      .select(`
        *,
        VehicleImage (*)
      `)
      .order("year", { ascending: false })

    if (error) throw error

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { make, model, year, mileage, monthlyPayment, transmission, features, imageUrls } = body

    // Validate required fields
    if (!make || !model || !year || !mileage || !monthlyPayment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Create vehicle in database
    const { data: vehicle, error } = await supabase
      .from("Vehicle")
      .insert({
        make,
        model,
        year,
        mileage,
        monthly_payment: monthlyPayment,
        transmission,
        features,
        is_sold: false,
      })
      .select()
      .single()

    if (error) throw error

    // Create vehicle images
    if (imageUrls && imageUrls.length > 0) {
      const vehicleImages = imageUrls.map((url: string) => ({
        url,
        vehicle_id: vehicle.id,
      }))

      const { error: imageError } = await supabase.from("VehicleImage").insert(vehicleImages)

      if (imageError) throw imageError
    }

    // Return the created vehicle with images
    const { data: createdVehicle, error: fetchError } = await supabase
      .from("Vehicle")
      .select(`
        *,
        VehicleImage (*)
      `)
      .eq("id", vehicle.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json(createdVehicle)
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}

