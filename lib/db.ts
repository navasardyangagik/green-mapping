import clientPromise from "./mongodb"
import type { Db } from "mongodb"

let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || "plant-mapping")

    cachedDb = db
    return db
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    throw error
  }
}
