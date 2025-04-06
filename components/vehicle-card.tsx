"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VehicleImage {
  id: number
  url: string
  vehicle_id?: number
}

interface VehicleCardProps {
  id: number
  make: string
  model: string
  year: number
  mileage: string
  monthlyPayment: string
  features?: string | null
  isSold: boolean
  images: VehicleImage[]
  onViewDetails: (id: number) => void
}

export function VehicleCard({
  id,
  make,
  model,
  year,
  mileage,
  monthlyPayment,
  features,
  isSold,
  images,
  onViewDetails,
}: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {year} {make} {model}
          </CardTitle>
          {isSold && <span className="text-destructive font-bold">SOLD</span>}
        </div>
      </CardHeader>

      <CardContent className="p-0 relative flex-grow overflow-hidden">
        <div className="relative h-48 w-full">
          <div className="relative h-full w-full">
            {images.length > 0 ? (
              <Image
                src={images[currentImageIndex].url || "/placeholder.svg"}
                alt={`${year} ${make} ${model}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">No Image</div>
            )}

            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-3xl font-bold transform -rotate-30">SOLD</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
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
                {images.map((_, index) => (
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
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Mileage:</span> {mileage} km
            </p>
            <p>
              <span className="font-semibold">Monthly Payment:</span> {monthlyPayment}
            </p>
            {features && (
              <p>
                <span className="font-semibold">Features:</span> {features}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-4">
        <Button className="w-full" onClick={() => onViewDetails(id)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

