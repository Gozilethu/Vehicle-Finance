"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Check, X, Upload } from "lucide-react"

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

export default function AdminPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    monthlyPayment: "",
    transmission: "",
    features: "",
    imageUrls: "",
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const auth = localStorage.getItem("admin_auth")
    if (auth) {
      try {
        const authData = JSON.parse(auth)
        if (authData.isAuthenticated) {
          setIsAuthenticated(true)
        }
      } catch (e) {
        // Invalid JSON in localStorage, ignore
        localStorage.removeItem("admin_auth")
      }
    }
  }, [])

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!isAuthenticated) return

      try {
        const response = await fetch("/api/vehicles")
        const data = await response.json()
        setVehicles(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Add new URLs to existing ones
      setUploadedImages((prev) => [...prev, ...uploadedUrls])

      // Update the form data with all URLs
      const allUrls = [...uploadedImages, ...uploadedUrls]
      setFormData((prev) => ({
        ...prev,
        imageUrls: allUrls.join("\n"),
      }))

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} image(s)`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Combine manually entered URLs with uploaded ones
      const imageUrls = formData.imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url !== "")

      const vehicleData = {
        ...formData,
        year: Number(formData.year),
        imageUrls,
      }

      if (editId) {
        // Update existing vehicle
        const response = await fetch(`/api/vehicles/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleData),
        })

        if (response.ok) {
          toast({
            title: "Vehicle updated",
            description: "The vehicle has been updated successfully.",
          })

          // Refresh vehicle list
          const updatedVehicle = await response.json()
          const updatedVehicles = vehicles.map((vehicle) => (vehicle.id === editId ? updatedVehicle : vehicle))
          setVehicles(updatedVehicles)

          // Reset form
          resetForm()
        } else {
          throw new Error("Failed to update vehicle")
        }
      } else {
        // Add new vehicle
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleData),
        })

        if (response.ok) {
          const newVehicle = await response.json()

          toast({
            title: "Vehicle added",
            description: "The vehicle has been added successfully.",
          })

          // Add new vehicle to list
          setVehicles((prev) => [...prev, newVehicle])

          // Reset form
          resetForm()
        } else {
          throw new Error("Failed to add vehicle")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the vehicle. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditId(vehicle.id)
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      monthlyPayment: vehicle.monthly_payment,
      transmission: vehicle.transmission || "",
      features: vehicle.features || "",
      imageUrls: vehicle.VehicleImage.map((img) => img.url).join("\n"),
    })

    // Set uploaded images from existing vehicle
    setUploadedImages(vehicle.VehicleImage.map((img) => img.url))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Vehicle deleted",
          description: "The vehicle has been deleted successfully.",
        })

        // Remove vehicle from list
        setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id))
      } else {
        throw new Error("Failed to delete vehicle")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting the vehicle. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleSold = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/vehicles/${id}/toggle-sold`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSold: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: currentStatus ? "Marked as available" : "Marked as sold",
          description: `The vehicle has been marked as ${currentStatus ? "available" : "sold"}.`,
        })

        // Update vehicle in list
        setVehicles((prev) =>
          prev.map((vehicle) => (vehicle.id === id ? { ...vehicle, is_sold: !currentStatus } : vehicle)),
        )
      } else {
        throw new Error("Failed to update vehicle status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating the vehicle status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: "",
      monthlyPayment: "",
      transmission: "",
      features: "",
      imageUrls: "",
    })
    setUploadedImages([])
    setEditId(null)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)

    try {
      // For demo purposes, allow a hardcoded login
      if (username === "admin" && password === "1234") {
        setIsAuthenticated(true)
        localStorage.setItem("admin_auth", JSON.stringify({ isAuthenticated: true }))
        toast({
          title: "Logged in",
          description: "You are now logged in to the admin panel.",
        })
        return
      }

      // Otherwise try the API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem("admin_auth", JSON.stringify({ isAuthenticated: true }))
        toast({
          title: "Logged in",
          description: "You are now logged in to the admin panel.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "There was a problem logging in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_auth")
    setUsername("")
    setPassword("")
  }

  const handleSeedDatabase = async () => {
    if (confirm("Are you sure you want to reset all vehicle listings to default? This cannot be undone.")) {
      try {
        setLoading(true)
        const response = await fetch("/api/seed", {
          method: "POST",
        })

        if (response.ok) {
          toast({
            title: "Reset complete",
            description: "All vehicle listings have been reset to default.",
          })

          // Refresh vehicle list
          const vehiclesResponse = await fetch("/api/vehicles")
          const data = await vehiclesResponse.json()
          setVehicles(data)
        } else {
          throw new Error("Failed to reset database")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "There was a problem resetting the database. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <p className="mb-6 text-gray-600">Enter your credentials to access the admin panel</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                <strong>Note:</strong> Use username "admin" and password "1234" for demo access
              </p>
            </form>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={handleSeedDatabase}>
              Reset to Default
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="manage">
          <TabsList className="mb-6">
            <TabsTrigger value="manage">Manage Listings</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Vehicle</TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4">Loading vehicles...</p>
              </div>
            ) : vehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-32 bg-muted relative">
                        {vehicle.VehicleImage.length > 0 ? (
                          <div className="w-full h-full relative">
                            <img
                              src={vehicle.VehicleImage[0].url || "/placeholder.svg"}
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                            {vehicle.is_sold && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold transform -rotate-30">SOLD</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">No Image</div>
                        )}
                      </div>

                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {vehicle.mileage} km | {vehicle.monthly_payment}
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleSold(vehicle.id, vehicle.is_sold)}
                            >
                              {vehicle.is_sold ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => handleDelete(vehicle.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-lg text-gray-500">No vehicles found. Add some vehicles to get started.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{editId ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input id="make" name="make" value={formData.make} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" name="model" value={formData.model} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage (km)</Label>
                      <Input id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPayment">Monthly Payment</Label>
                      <Input
                        id="monthlyPayment"
                        name="monthlyPayment"
                        placeholder="e.g. R2600 per month"
                        value={formData.monthlyPayment}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Input
                        id="transmission"
                        name="transmission"
                        placeholder="e.g. Manual, Automatic"
                        value={formData.transmission}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Features</Label>
                    <Textarea
                      id="features"
                      name="features"
                      placeholder="e.g. Full service history, DEKRA approved"
                      value={formData.features}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="imageUpload">Vehicle Images</Label>
                      <div className="flex space-x-2">
                        <input
                          type="file"
                          id="imageUpload"
                          ref={fileInputRef}
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={triggerFileInput}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Images
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Image preview */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {uploadedImages.map((url, index) => (
                          <div key={index} className="relative h-24 bg-muted rounded overflow-hidden">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => {
                                const newImages = [...uploadedImages]
                                newImages.splice(index, 1)
                                setUploadedImages(newImages)
                                setFormData((prev) => ({
                                  ...prev,
                                  imageUrls: newImages.join("\n"),
                                }))
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-2">
                      <Label htmlFor="imageUrls" className="text-sm text-muted-foreground">
                        Or enter image URLs manually (one per line)
                      </Label>
                      <Textarea
                        id="imageUrls"
                        name="imageUrls"
                        placeholder="https://example.com/car-image1.jpg&#10;https://example.com/car-image2.jpg"
                        value={formData.imageUrls}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="submit">{editId ? "Update Vehicle" : "Add Vehicle"}</Button>

                    {editId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </>
  )
}

