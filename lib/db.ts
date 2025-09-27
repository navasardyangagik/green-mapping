import clientPromise from "./mongodb"
import type { Db } from "mongodb"

let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "nextjs-app")

  cachedDb = db
  return db
}
