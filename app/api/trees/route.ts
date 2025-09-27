import { type NextRequest, NextResponse } from "next/server"
import { createTree, getAllTrees } from "@/lib/trees"
import { getUser } from "@/lib/auth"

export async function GET() {
  try {
    console.log("[v0] GET /api/trees - Fetching all trees")

    const trees = await getAllTrees()
    console.log("[v0] Successfully fetched trees:", trees.length)

    return NextResponse.json(trees)
  } catch (error) {
    console.error("[v0] Error fetching trees:", error)
    return NextResponse.json({ error: "Failed to fetch trees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/trees - Creating new tree")

    const user = await getUser(request)
    if (!user) {
      console.log("[v0] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { name, type, latitude, longitude, condition, description } = body

    if (!name || !type || !latitude || !longitude || !condition) {
      console.log("[v0] Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields: name, type, latitude, longitude, condition" },
        { status: 400 },
      )
    }

    const treeData = {
      name,
      type,
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
      condition,
      description: description || "",
      reportedBy: user.email,
    }

    console.log("[v0] Creating tree with data:", treeData)
    const tree = await createTree(treeData)
    console.log("[v0] Successfully created tree:", tree)

    return NextResponse.json(tree, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating tree:", error)
    return NextResponse.json({ error: "Failed to create tree" }, { status: 500 })
  }
}
