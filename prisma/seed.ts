import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.vehicleImage.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  await prisma.user.create({
    data: {
      username: "admin",
      // In production, use a proper hashing mechanism
      password: "$2a$10$GQH.xZUBYZmJxmfS5vv3C.oGcQQXOaNT1VVr.CJcj4CQ4CCPF0MlW", // "password123"
    },
  })

  // Create vehicles
  const vehicles = [
    {
      make: "Volkswagen",
      model: "Polo Vivo 1.4 Trendline",
      year: 2017,
      mileage: "81,000",
      monthlyPayment: "R2,600 per month",
      transmission: "Manual",
      features: "DEKRA approved",
      isSold: true,
      soldDate: new Date(),
      images: ["https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+Vivo+2017"],
    },
    {
      make: "Hyundai",
      model: "Atos Motion",
      year: 2021,
      mileage: "45,000",
      monthlyPayment: "R2,700 per month",
      transmission: "Manual",
      features: "Air Conditioning, Power Steering",
      isSold: false,
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
      monthlyPayment: "R3,200 per month",
      transmission: "Manual",
      features: "Full service history",
      isSold: false,
      images: ["https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+Comfortline"],
    },
    {
      make: "Volkswagen",
      model: "Polo",
      year: 2024,
      mileage: "17,000",
      monthlyPayment: "R4,995 per month",
      transmission: "Manual",
      features: "Demo Model",
      isSold: false,
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
      monthlyPayment: "R2,100 per month",
      transmission: "Automatic",
      features: "Extremely neat, DEKRA approved",
      isSold: false,
      images: ["https://placehold.co/600x400/e2e8f0/1e40af?text=VW+Polo+Vivo+Auto"],
    },
  ]

  for (const vehicle of vehicles) {
    const { images, ...vehicleData } = vehicle

    const createdVehicle = await prisma.vehicle.create({
      data: vehicleData,
    })

    // Create vehicle images
    for (const imageUrl of images) {
      await prisma.vehicleImage.create({
        data: {
          url: imageUrl,
          vehicleId: createdVehicle.id,
        },
      })
    }
  }

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

