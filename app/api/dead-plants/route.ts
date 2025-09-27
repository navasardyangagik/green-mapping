import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { createDeadPlant, getAllDeadPlants } from "@/lib/dead-plants"

export async function POST(request: NextRequest) {
  console.log("[v0] POST /api/dead-plants endpoint hit")

  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    console.log("[v0] Auth header:", authHeader ? "present" : "missing")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[v0] Authentication failed - no valid auth header")
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = verifyToken(token)
    console.log("[v0] User verification result:", user ? "success" : "failed")

    if (!user) {
      console.log("[v0] Invalid token")
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { latitude, longitude, type, description, condition } = body

    // Validate input
    if (!latitude || !longitude || !type || !description) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ message: "Latitude, longitude, type, and description are required" }, { status: 400 })
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      console.log("[v0] Validation failed - invalid coordinate types")
      return NextResponse.json({ message: "Latitude and longitude must be numbers" }, { status: 400 })
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.log("[v0] Validation failed - invalid coordinate ranges")
      return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 })
    }

    console.log("[v0] Creating dead plant entry...")
    // Create dead plant entry
    const deadPlant = await createDeadPlant({
      userId: user.id,
      latitude,
      longitude,
      type,
      description,
      condition: condition || "Unknown",
    })

    console.log("[v0] Dead plant created successfully:", deadPlant._id)

    return NextResponse.json(
      {
        message: "Dead plant matter added successfully",
        deadPlant: {
          id: deadPlant._id!.toString(),
          latitude: deadPlant.latitude,
          longitude: deadPlant.longitude,
          type: deadPlant.type,
          description: deadPlant.description,
          condition: deadPlant.condition,
          createdAt: deadPlant.createdAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Dead plant creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  console.log("[v0] GET /api/dead-plants endpoint hit")

  try {
    console.log("[v0] Attempting to fetch dead plants...")
    const deadPlants = await getAllDeadPlants()
    console.log("[v0] Successfully retrieved", deadPlants.length, "dead plants")

    return NextResponse.json({
      deadPlants: deadPlants.map((plant) => ({
        id: plant._id!.toString(),
        latitude: plant.latitude,
        longitude: plant.longitude,
        type: plant.type,
        description: plant.description,
        condition: plant.condition,
        createdAt: plant.createdAt,
      })),
    })
  } catch (error) {
    console.error("[v0] Dead plants fetch error:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch dead plants",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
