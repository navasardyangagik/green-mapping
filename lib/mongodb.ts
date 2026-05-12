import { MongoClient, type MongoClientOptions } from "mongodb"

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: "majority",
}

let clientPromise: Promise<MongoClient> | undefined

export default function getClientPromise() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local")
  }

  if (clientPromise) {
    return clientPromise
  }

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(process.env.MONGODB_URI, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }

    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    const client = new MongoClient(process.env.MONGODB_URI, options)
    clientPromise = client.connect()
  }

  return clientPromise
}
