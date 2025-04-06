import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Supabase Storage
    const supabase = createServerClient()

    // Create bucket if it doesn't exist (first time setup)
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.find((bucket) => bucket.name === "vehicle-images")) {
      await supabase.storage.createBucket("vehicle-images", {
        public: true,
      })
    }

    const { data, error } = await supabase.storage.from("vehicle-images").upload(filename, buffer, {
      contentType: file.type,
      cacheControl: "3600",
    })

    if (error) throw error

    // Get the public URL
    const { data: publicUrl } = supabase.storage.from("vehicle-images").getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl.publicUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

