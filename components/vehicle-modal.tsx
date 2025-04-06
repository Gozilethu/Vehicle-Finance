"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VehicleImage {
  id: number
  url: string
  vehicle_id?: number
}

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  mileage: string
  monthly_payment: string
  transmission?: string | null
  features?: string | null
  is_sold: boolean
  VehicleImage: VehicleImage[]
}

interface VehicleModalProps {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehicleModal({ vehicle, open, onOpenChange }: VehicleModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!vehicle) return null

  const nextImage = () => {
    if (vehicle.VehicleImage.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.VehicleImage.length)
    }
  }

  const prevImage = () => {
    if (vehicle.VehicleImage.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.VehicleImage.length) % vehicle.VehicleImage.length)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </DialogTitle>
            {vehicle.is_sold && <span className="text-destructive font-bold">SOLD</span>}
          </div>
        </DialogHeader>

        <div className="relative h-[300px] w-full">
          {vehicle.VehicleImage.length > 0 ? (
            <Image
              src={vehicle.VehicleImage[currentImageIndex].url || "/placeholder.svg"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">No Image</div>
          )}

          {vehicle.is_sold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-4xl font-bold transform -rotate-30">SOLD</span>
            </div>
          )}

          {vehicle.VehicleImage.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {vehicle.VehicleImage.map((_, index) => (
                  <div
                    key={index}
                    className={cn("h-2 w-2 rounded-full", index === currentImageIndex ? "bg-white" : "bg-primary")}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-primary">{vehicle.monthly_payment}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>
                <span className="font-semibold">Year:</span> {vehicle.year}
              </p>
              <p>
                <span className="font-semibold">Mileage:</span> {vehicle.mileage} km
              </p>
            </div>
            <div>
              {vehicle.transmission && (
                <p>
                  <span className="font-semibold">Transmission:</span> {vehicle.transmission}
                </p>
              )}
            </div>
          </div>

          {vehicle.features && (
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Features</h4>
              <p>{vehicle.features}</p>
            </div>
          )}

          <div className="flex space-x-2 mt-4">
            <Link href="/finance-options" className="flex-1">
              <Button variant="outline" className="w-full">
                Finance Calculator
              </Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button className="w-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

