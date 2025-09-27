import type { Collection, ObjectId } from "mongodb"
import { connectToDatabase } from "./db"

export interface DeadPlant {
  _id?: ObjectId
  userId: string
  latitude: number
  longitude: number
  type: string
  description: string
  condition: string
  createdAt: Date
  updatedAt: Date
}

let deadPlantsCollection: Collection<DeadPlant> | null = null

async function getDeadPlantsCollection(): Promise<Collection<DeadPlant>> {
  if (!deadPlantsCollection) {
    try {
      console.log("[v0] Connecting to database...")
      const db = await connectToDatabase()
      console.log("[v0] Database connected, accessing dead_plants collection...")
      deadPlantsCollection = db.collection<DeadPlant>("dead_plants")

      // Create indexes for better performance
      await deadPlantsCollection.createIndex({ userId: 1 })
      await deadPlantsCollection.createIndex({ latitude: 1, longitude: 1 })
      await deadPlantsCollection.createIndex({ createdAt: -1 })
      console.log("[v0] Database indexes created successfully")
    } catch (error) {
      console.error("[v0] Failed to connect to database or create collection:", error)
      throw error
    }
  }
  return deadPlantsCollection
}

export async function createDeadPlant(
  plantData: Omit<DeadPlant, "_id" | "createdAt" | "updatedAt">,
): Promise<DeadPlant> {
  try {
    const collection = await getDeadPlantsCollection()

    const plant: Omit<DeadPlant, "_id"> = {
      ...plantData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(plant as DeadPlant)
    console.log("[v0] Dead plant inserted with ID:", result.insertedId)
    return { ...plant, _id: result.insertedId }
  } catch (error) {
    console.error("[v0] Error creating dead plant:", error)
    throw error
  }
}

export async function getAllDeadPlants(): Promise<DeadPlant[]> {
  try {
    console.log("[v0] Fetching all dead plants from database...")
    const collection = await getDeadPlantsCollection()
    const plants = await collection.find({}).sort({ createdAt: -1 }).toArray()
    console.log("[v0] Successfully fetched", plants.length, "dead plants from database")
    return plants
  } catch (error) {
    console.error("[v0] Error fetching dead plants:", error)
    throw error
  }
}

export async function getDeadPlantsByUser(userId: string): Promise<DeadPlant[]> {
  try {
    console.log("[v0] Fetching dead plants by user ID:", userId)
    const collection = await getDeadPlantsCollection()
    const plants = await collection.find({ userId }).sort({ createdAt: -1 }).toArray()
    console.log("[v0] Successfully fetched", plants.length, "dead plants for user ID:", userId)
    return plants
  } catch (error) {
    console.error("[v0] Error fetching dead plants by user:", error)
    throw error
  }
}
