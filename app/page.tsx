"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleModal } from "@/components/vehicle-modal"
import { VehicleFilter } from "@/components/vehicle-filter"

interface VehicleImage {
  id: number
  url: string
  vehicle_id: number
}

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  mileage: string
  monthly_payment: string
  transmission: string | null
  features: string | null
  is_sold: boolean
  VehicleImage: VehicleImage[]
}

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles")
        const data = await response.json()
        setVehicles(data)
        setFilteredVehicles(data.filter((vehicle: Vehicle) => !vehicle.is_sold))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const handleFilterChange = ({ search, sort, showSold }: { search: string; sort: string; showSold: boolean }) => {
    let filtered = [...vehicles]

    // Filter by sold status
    if (!showSold) {
      filtered = filtered.filter((vehicle) => !vehicle.is_sold)
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.year.toString().includes(searchLower),
      )
    }

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.year - b.year
        case "priceAsc":
          return (
            Number.parseFloat(a.monthly_payment.replace(/[^0-9.]/g, "")) -
            Number.parseFloat(b.monthly_payment.replace(/[^0-9.]/g, ""))
          )
        case "priceDesc":
          return (
            Number.parseFloat(b.monthly_payment.replace(/[^0-9.]/g, "")) -
            Number.parseFloat(a.monthly_payment.replace(/[^0-9.]/g, ""))
          )
        case "newest":
        default:
          return b.year - a.year
      }
    })

    setFilteredVehicles(filtered)
  }

  const handleViewDetails = (id: number) => {
    const vehicle = vehicles.find((v) => v.id === id) || null
    setSelectedVehicle(vehicle)
    setModalOpen(true)
  }

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Find Your Dream Car Today</h2>
            <p className="text-lg mb-6">
              Browse our selection of quality vehicles with affordable monthly payments. We deliver nationwide and offer
              competitive financing options.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => document.getElementById("vehicle-listings")?.scrollIntoView({ behavior: "smooth" })}
              >
                View All Cars
              </Button>
              <Link href="/finance-options">
                <Button size="lg" variant="outline">
                  Finance Calculator
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="vehicle-listings">
          <VehicleFilter onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  make={vehicle.make}
                  model={vehicle.model}
                  year={vehicle.year}
                  mileage={vehicle.mileage}
                  monthlyPayment={vehicle.monthly_payment}
                  features={vehicle.features}
                  isSold={vehicle.is_sold}
                  images={vehicle.VehicleImage}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-lg text-gray-500">No vehicles found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>

      <VehicleModal vehicle={selectedVehicle} open={modalOpen} onOpenChange={setModalOpen} />

      <Footer />
    </>
  )
}

