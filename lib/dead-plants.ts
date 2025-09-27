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
    const db = await connectToDatabase()
    deadPlantsCollection = db.collection<DeadPlant>("dead_plants")

    // Create indexes for better performance
    await deadPlantsCollection.createIndex({ userId: 1 })
    await deadPlantsCollection.createIndex({ latitude: 1, longitude: 1 })
    await deadPlantsCollection.createIndex({ createdAt: -1 })
  }
  return deadPlantsCollection
}

export async function createDeadPlant(
  plantData: Omit<DeadPlant, "_id" | "createdAt" | "updatedAt">,
): Promise<DeadPlant> {
  const collection = await getDeadPlantsCollection()

  const plant: Omit<DeadPlant, "_id"> = {
    ...plantData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(plant as DeadPlant)
  return { ...plant, _id: result.insertedId }
}

export async function getAllDeadPlants(): Promise<DeadPlant[]> {
  const collection = await getDeadPlantsCollection()
  return await collection.find({}).sort({ createdAt: -1 }).toArray()
}

export async function getDeadPlantsByUser(userId: string): Promise<DeadPlant[]> {
  const collection = await getDeadPlantsCollection()
  return await collection.find({ userId }).sort({ createdAt: -1 }).toArray()
}
