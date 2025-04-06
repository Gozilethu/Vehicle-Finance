import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcrypt from "bcrypt"

export async function POST() {
  try {
    const supabase = createServerClient()

    // Clear existing data
    await supabase.from("VehicleImage").delete().neq("id", 0)
    await supabase.from("Vehicle").delete().neq("id", 0)
    await supabase.from("User").delete().neq("id", 0)

    // Create admin user
    const hashedPassword = await bcrypt.hash("password123", 10)

    const { error: userError } = await supabase.from("User").insert({
      username: "admin",
      password: hashedPassword,
    })

    if (userError) throw userError

    // Create vehicles
    const vehicles = [
      {
        make: "Volkswagen",
        model: "Polo Vivo 1.4 Trendline",
        year: 2017,
        mileage: "81,000",
        monthly_payment: "R2,600 per month",
        transmission: "Manual",
        features: "DEKRA approved",
        is_sold: true,
        sold_date: new Date().toISOString(),
        images: ["https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+Vivo+2017"],
      },
      {
        make: "Hyundai",
        model: "Atos Motion",
        year: 2021,
        mileage: "45,000",
        monthly_payment: "R2,700 per month",
        transmission: "Manual",
        features: "Air Conditioning, Power Steering",
        is_sold: false,
        images: [
          "https://placehold.co/600x400/e2e8f0/1e40af?text=Hyundai+Atos+2021",
          "https://placehold.co/600x400/e2e8f0/1e40af?text=Hyundai+Atos+Interior",
        ],
      },
      {
        make: "Volkswagen",
        model: "Polo Comfortline",
        year: 2020,
        mileage: "165,000",
        monthly_payment: "R3,200 per month",
        transmission: "Manual",
        features: "Full service history",
        is_sold: false,
        images: ["https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+Comfortline"],
      },
      {
        make: "Volkswagen",
        model: "Polo",
        year: 2024,
        mileage: "17,000",
        monthly_payment: "R4,995 per month",
        transmission: "Manual",
        features: "Demo Model",
        is_sold: false,
        images: [
          "https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+2024+Demo",
          "https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+2024+Interior",
        ],
      },
      {
        make: "Volkswagen",
        model: "Polo Vivo Auto",
        year: 2019,
        mileage: "55,000",
        monthly_payment: "R2,100 per month",
        transmission: "Automatic",
        features: "Extremely neat, DEKRA approved",
        is_sold: false,
        images: ["https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+Vivo+Auto"],
      },
    ]

    for (const vehicle of vehicles) {
      const { images, ...vehicleData } = vehicle

      // Create vehicle
      const { data: createdVehicle, error: vehicleError } = await supabase
        .from("Vehicle")
        .insert(vehicleData)
        .select()
        .single()

      if (vehicleError) throw vehicleError

      // Create vehicle images
      if (images && images.length > 0) {
        const vehicleImages = images.map((url: string) => ({
          url,
          vehicle_id: createdVehicle.id,
        }))

        const { error: imageError } = await supabase.from("VehicleImage").insert(vehicleImages)

        if (imageError) throw imageError
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

