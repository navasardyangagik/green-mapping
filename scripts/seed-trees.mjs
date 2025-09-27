import { MongoClient } from "mongodb"

const uri = "mongodb+srv://gnavasa608_db_user:AJl5bFUyAAHhPGfq@jewelcityhackaton.lmolsqg.mongodb.net/plant-mapping"
const dbName = "plant-mapping"

// Glendale, CA coordinates (approximate bounds)
const GLENDALE_BOUNDS = {
  north: 34.1800,
  south: 34.1200,
  east: -118.2200,
  west: -118.2800
}

function getRandomCoordinate(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(6))
}

function getRandomGlendaleCoordinate() {
  return {
    lat: getRandomCoordinate(GLENDALE_BOUNDS.south, GLENDALE_BOUNDS.north),
    lng: getRandomCoordinate(GLENDALE_BOUNDS.west, GLENDALE_BOUNDS.east)
  }
}

const treeSpecies = [
  "California Oak", "Jacaranda", "Palm Tree", "Eucalyptus", "Pine Tree",
  "Maple", "Sycamore", "Magnolia", "Pepper Tree", "Olive Tree",
  "Citrus Tree", "Avocado Tree", "Fig Tree", "Willow Tree", "Cedar"
]

const conditions = ["Healthy", "Diseased", "Pest Damage", "Drought Stress", "Storm Damage"]
const locations = [
  "Verdugo Park", "Brand Park", "Deukmejian Wilderness Park", "Glenoaks Boulevard",
  "Brand Boulevard", "Central Avenue", "Broadway", "Colorado Street",
  "Chevy Chase Drive", "Mountain Street", "Glendale Avenue", "Pacific Avenue"
]

function generateGlendaleTrees(count = 50) {
  const trees = []
  
  for (let i = 0; i < count; i++) {
    const coord = getRandomGlendaleCoordinate()
    const species = treeSpecies[Math.floor(Math.random() * treeSpecies.length)]
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    
    trees.push({
      species: species,
      condition: condition,
      location: `Near ${location}, Glendale, CA`,
      coordinates: {
        lat: coord.lat,
        lng: coord.lng
      },
      description: `${species} tree in ${condition.toLowerCase()} condition located near ${location}`,
      reportedAt: new Date(),
      city: "Glendale",
      state: "CA"
    })
  }
  
  return trees
}

async function seedGlendaleTrees() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    
    const db = client.db(dbName)
    const collection = db.collection("trees")
    
    // Clear existing trees (optional - remove this line if you want to keep existing data)
    // await collection.deleteMany({})
    // console.log("Cleared existing trees")
    
    const trees = generateGlendaleTrees(50)
    const result = await collection.insertMany(trees)
    
    console.log(`Successfully inserted ${result.insertedCount} trees in Glendale area`)
    console.log("Sample tree:", trees[0])
    
  } catch (error) {
    console.error("Error seeding trees:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

seedGlendaleTrees()
