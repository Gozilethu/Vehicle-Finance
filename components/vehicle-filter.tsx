"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface VehicleFilterProps {
  onFilterChange: (filters: {
    search: string
    sort: string
    showSold: boolean
  }) => void
}

export function VehicleFilter({ onFilterChange }: VehicleFilterProps) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [showSold, setShowSold] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onFilterChange({ search: value, sort, showSold })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    onFilterChange({ search, sort: value, showSold })
  }

  const handleShowSoldChange = (checked: boolean) => {
    setShowSold(checked)
    onFilterChange({ search, sort, showSold: checked })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Available Vehicles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by make, model, or year"
              className="pl-8"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <Checkbox id="show-sold" checked={showSold} onCheckedChange={handleShowSoldChange} />
          <Label htmlFor="show-sold">Show Sold Vehicles</Label>
        </div>
      </div>
    </div>
  )
}

