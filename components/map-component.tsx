"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface MapComponentProps {
  className?: string
  filter?: "All" | "Trees" | "Dead Matter"
  onMapClick?: (lat: number, lng: number) => void
  isClickMode?: boolean
  newDeadPlants?: Array<{
    id: string
    latitude: number
    longitude: number
    type: string
    description: string
    condition: string
  }>
}

export function MapComponent({
  className = "",
  filter = "All",
  onMapClick,
  isClickMode = false,
  newDeadPlants = [],
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const treeMarkersRef = useRef<L.Marker[]>([])
  const deadPlantMarkersRef = useRef<L.Marker[]>([])
  const clickMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on Glendale, CA
    const map = L.map(mapRef.current).setView([34.1425, -118.2551], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const style = document.createElement("style")
    style.textContent = `
      .leaflet-popup-pane {
        z-index: 10001 !important;
      }
      .leaflet-popup {
        z-index: 10001 !important;
      }
      .leaflet-popup-tip-container {
        z-index: 10001 !important;
      }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `
    document.head.appendChild(style)

    map.on("click", (e) => {
      if (isClickMode && onMapClick) {
        const { lat, lng } = e.latlng
        onMapClick(lat, lng)

        // Add temporary marker to show selected location
        if (clickMarkerRef.current) {
          map.removeLayer(clickMarkerRef.current)
        }

        clickMarkerRef.current = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "temp-marker",
            html: `<div style="
              background-color: #3b82f6;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
              z-index: 10002;
            "></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        }).addTo(map)
      }
    })

    // Add a marker for Glendale city center
    const glendaleCenterMarker = L.marker([34.1425, -118.2551])
      .addTo(map)
      .bindPopup("<b>Glendale, CA</b><br>City Center")

    const treeIcon = L.divIcon({
      className: "custom-tree-marker",
      html: `<div style="
        background-color: #2f8530;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    const deadPlantIcon = L.divIcon({
      className: "custom-dead-plant-marker",
      html: `<div style="
        background-color: #dc2626;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    // Add some sample tree markers around Glendale
    const sampleTrees = [
      { lat: 34.1445, lng: -118.2571, name: "Oak Tree - Brand Park" },
      { lat: 34.1405, lng: -118.2531, name: "Palm Tree - Downtown" },
      { lat: 34.1465, lng: -118.2591, name: "Pine Tree - Verdugo Mountains" },
      { lat: 34.1385, lng: -118.2511, name: "Maple Tree - Residential Area" },
    ]

    const sampleDeadPlants = [
      { lat: 34.1435, lng: -118.2561, name: "Dead Bush - Brand Park", type: "Dead Bush" },
      { lat: 34.1415, lng: -118.2541, name: "Dry Shrub - Downtown Area", type: "Dry Shrub" },
      { lat: 34.1455, lng: -118.2581, name: "Dead Tree - Hillside", type: "Dead Tree" },
      { lat: 34.1395, lng: -118.2521, name: "Withered Plant - Residential", type: "Withered Plant" },
    ]

    sampleTrees.forEach((tree) => {
      const marker = L.marker([tree.lat, tree.lng], { icon: treeIcon })
        .addTo(map)
        .bindPopup(`<b>${tree.name}</b><br>Healthy tree location<br><span style="color: #2f8530;">● Living Tree</span>`)
      treeMarkersRef.current.push(marker)
    })

    sampleDeadPlants.forEach((plant) => {
      const marker = L.marker([plant.lat, plant.lng], { icon: deadPlantIcon })
        .addTo(map)
        .bindPopup(
          `<b>${plant.name}</b><br>Type: ${plant.type}<br><span style="color: #dc2626;">● Dead Plant Material</span>`,
        )
      deadPlantMarkersRef.current.push(marker)
    })

    const legend = L.control({ position: "bottomright" })
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "map-legend")
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px;">
          <div style="margin-bottom: 5px;"><span style="color: #2f8530;">●</span> Living Trees</div>
          <div><span style="color: #dc2626;">●</span> Dead Plant Material</div>
        </div>
      `
      return div
    }
    legend.addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    const map = mapInstanceRef.current
    const container = map.getContainer()

    if (isClickMode) {
      container.style.cursor = "crosshair"
    } else {
      container.style.cursor = ""
      // Remove temporary click marker when exiting click mode
      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current)
        clickMarkerRef.current = null
      }
    }
  }, [isClickMode])

  useEffect(() => {
    if (!mapInstanceRef.current || newDeadPlants.length === 0) return

    const map = mapInstanceRef.current
    const deadPlantIcon = L.divIcon({
      className: "custom-dead-plant-marker",
      html: `<div style="
        background-color: #dc2626;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    newDeadPlants.forEach((plant) => {
      const marker = L.marker([plant.latitude, plant.longitude], { icon: deadPlantIcon })
        .addTo(map)
        .bindPopup(
          `<b>${plant.type}</b><br>Condition: ${plant.condition}<br>Description: ${plant.description}<br><span style="color: #dc2626;">● Dead Plant Material</span>`,
        )
      deadPlantMarkersRef.current.push(marker)
    })
  }, [newDeadPlants])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    const map = mapInstanceRef.current

    // Show/hide markers based on filter
    if (filter === "All") {
      // Show all markers
      treeMarkersRef.current.forEach((marker) => {
        if (!map.hasLayer(marker)) {
          map.addLayer(marker)
        }
      })
      deadPlantMarkersRef.current.forEach((marker) => {
        if (!map.hasLayer(marker)) {
          map.addLayer(marker)
        }
      })
    } else if (filter === "Trees") {
      // Show only tree markers
      treeMarkersRef.current.forEach((marker) => {
        if (!map.hasLayer(marker)) {
          map.addLayer(marker)
        }
      })
      deadPlantMarkersRef.current.forEach((marker) => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      })
    } else if (filter === "Dead Matter") {
      // Show only dead plant markers
      treeMarkersRef.current.forEach((marker) => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      })
      deadPlantMarkersRef.current.forEach((marker) => {
        if (!map.hasLayer(marker)) {
          map.addLayer(marker)
        }
      })
    }
  }, [filter])

  return <div ref={mapRef} className={`w-full h-full min-h-[500px] rounded-lg border border-border ${className}`} />
}
