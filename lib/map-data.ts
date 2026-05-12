export type MapFeatureKind = "tree" | "dead"

export interface MapFeature {
  id: string
  kind: MapFeatureKind
  latitude: number
  longitude: number
  title: string
  type: string
  condition: string
  description: string
  source: "sample" | "community"
  metric?: string
}

export interface CanopyZone {
  id: string
  name: string
  tone: "primary" | "teal" | "amber"
  coordinates: Array<[number, number]>
}

export const sampleMapFeatures: MapFeature[] = [
  {
    id: "tree-brand-park-oak",
    kind: "tree",
    latitude: 34.1445,
    longitude: -118.2571,
    title: "Oak Tree - Brand Park",
    type: "Oak",
    condition: "Healthy",
    description: "Mature canopy tree near Brand Park with strong shade coverage.",
    source: "sample",
    metric: "High canopy value",
  },
  {
    id: "tree-downtown-palm",
    kind: "tree",
    latitude: 34.1405,
    longitude: -118.2531,
    title: "Palm Tree - Downtown",
    type: "Palm",
    condition: "Stable",
    description: "Street-facing palm in the downtown corridor.",
    source: "sample",
    metric: "Street corridor",
  },
  {
    id: "tree-verdugo-pine",
    kind: "tree",
    latitude: 34.1465,
    longitude: -118.2591,
    title: "Pine Tree - Verdugo Mountains",
    type: "Pine",
    condition: "Healthy",
    description: "Hillside pine near the Verdugo foothill edge.",
    source: "sample",
    metric: "Slope habitat",
  },
  {
    id: "tree-residential-maple",
    kind: "tree",
    latitude: 34.1385,
    longitude: -118.2511,
    title: "Maple Tree - Residential Area",
    type: "Maple",
    condition: "Good",
    description: "Residential shade tree with moderate canopy spread.",
    source: "sample",
    metric: "Neighborhood shade",
  },
  {
    id: "dead-brand-park-bush",
    kind: "dead",
    latitude: 34.1435,
    longitude: -118.2561,
    title: "Dead Bush - Brand Park",
    type: "Dead Bush",
    condition: "Completely Dead",
    description: "Dry brush material near a public walking route.",
    source: "sample",
    metric: "Verify removal",
  },
  {
    id: "dead-downtown-shrub",
    kind: "dead",
    latitude: 34.1415,
    longitude: -118.2541,
    title: "Dry Shrub - Downtown Area",
    type: "Dry Shrub",
    condition: "Dried Out",
    description: "Dry ornamental planting in the downtown area.",
    source: "sample",
    metric: "Maintenance check",
  },
  {
    id: "dead-hillside-tree",
    kind: "dead",
    latitude: 34.1455,
    longitude: -118.2581,
    title: "Dead Tree - Hillside",
    type: "Dead Tree",
    condition: "Recently Dead",
    description: "Hillside tree with visible dieback.",
    source: "sample",
    metric: "Field priority",
  },
  {
    id: "dead-residential-withered",
    kind: "dead",
    latitude: 34.1395,
    longitude: -118.2521,
    title: "Withered Plant - Residential",
    type: "Withered Plant",
    condition: "Partially Dead",
    description: "Partially withered plant material near a residential block.",
    source: "sample",
    metric: "Monitor",
  },
]

export const canopyZones: CanopyZone[] = [
  {
    id: "brand-park-canopy",
    name: "Brand Park canopy",
    tone: "primary",
    coordinates: [
      [34.1471, -118.2634],
      [34.1495, -118.2579],
      [34.1452, -118.2538],
      [34.1417, -118.2581],
      [34.1432, -118.2624],
    ],
  },
  {
    id: "downtown-corridor",
    name: "Downtown corridor",
    tone: "teal",
    coordinates: [
      [34.1426, -118.2576],
      [34.1441, -118.2537],
      [34.1387, -118.2496],
      [34.1368, -118.2529],
      [34.1397, -118.2561],
    ],
  },
  {
    id: "residential-shade",
    name: "Residential shade pocket",
    tone: "amber",
    coordinates: [
      [34.1411, -118.2546],
      [34.1392, -118.2505],
      [34.1359, -118.2519],
      [34.1374, -118.2562],
    ],
  },
]
