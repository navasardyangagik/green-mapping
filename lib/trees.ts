import { MongoClient, ObjectId, type Db, type Collection } from "mongodb"

let db: Db
let treesCollection: Collection
let client: MongoClient | undefined

async function connectToDatabase() {
  if (!db) {
    if (!process.env.MONGODB_URI) {
      throw new Error("Please add your MongoDB URI to .env.local")
    }

    client = client || new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    db = client.db("glendale_trees")
    treesCollection = db.collection("trees")
  }
  return { db, treesCollection }
}

export interface Tree {
  _id?: string
  id?: string
  name: string
  type: string
  latitude: number
  longitude: number
  condition: string
  description?: string
  reportedBy?: string
  reportedAt: Date
}

export async function createTree(treeData: Omit<Tree, "_id" | "id" | "reportedAt">) {
  const { treesCollection } = await connectToDatabase()

  const tree: Omit<Tree, "_id" | "id"> = {
    ...treeData,
    reportedAt: new Date(),
  }

  const result = await treesCollection.insertOne(tree)
  return {
    ...tree,
    id: result.insertedId.toString(),
  }
}

export async function getAllTrees() {
  const { treesCollection } = await connectToDatabase()

  const trees = await treesCollection.find({}).toArray()
  return trees.map((tree) => ({
    ...tree,
    id: tree._id.toString(),
  }))
}

export async function getTreesByCondition(condition: string) {
  const { treesCollection } = await connectToDatabase()

  const trees = await treesCollection.find({ condition }).toArray()
  return trees.map((tree) => ({
    ...tree,
    id: tree._id.toString(),
  }))
}

export async function deleteTree(id: string) {
  const { treesCollection } = await connectToDatabase()

  const result = await treesCollection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
