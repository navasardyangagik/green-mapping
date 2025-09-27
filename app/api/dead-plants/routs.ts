import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { createDeadPlant, getAllDeadPlants } from "@/lib/dead-plants"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { latitude, longitude, type, description, condition } = await request.json()

    // Validate input
    if (!latitude || !longitude || !type || !description) {
      return NextResponse.json({ message: "Latitude, longitude, type, and description are required" }, { status: 400 })
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json({ message: "Latitude and longitude must be numbers" }, { status: 400 })
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 })
    }

    // Create dead plant entry
    const deadPlant = await createDeadPlant({
      userId: user.id,
      latitude,
      longitude,
      type,
      description,
      condition: condition || "Unknown",
    })

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
    console.error("Dead plant creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const deadPlants = await getAllDeadPlants()

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
    console.error("Dead plants fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
