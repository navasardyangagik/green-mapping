import type { Collection } from "mongodb"
import { connectToDatabase } from "./db"
import type { User } from "./auth"

let usersCollection: Collection<User> | null = null

async function getUsersCollection(): Promise<Collection<User>> {
  if (!usersCollection) {
    const db = await connectToDatabase()
    usersCollection = db.collection<User>("users")

    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true })
  }
  return usersCollection
}

export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
  const collection = await getUsersCollection()

  const user: Omit<User, "_id"> = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(user as User)
  return { ...user, _id: result.insertedId }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const collection = await getUsersCollection()
  return await collection.findOne({ email: email.toLowerCase() })
}

export async function findUserById(id: string): Promise<User | null> {
  const collection = await getUsersCollection()
  const { ObjectId } = require("mongodb")
  return await collection.findOne({ _id: new ObjectId(id) })
}
