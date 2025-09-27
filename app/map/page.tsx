"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, Layers, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import dynamic from "next/dynamic"
import { AddDeadPlantForm } from "@/components/add-dead-plant-form"
import { useAuth } from "@/lib/auth-context"

const MapComponent = dynamic(
  () => import("@/components/map-component").then((mod) => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
)

export default function MapPage() {
  const [filter, setFilter] = useState<"All" | "Trees" | "Dead Matter">("All")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMapClickMode, setIsMapClickMode] = useState(false)
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | undefined>()
  const [newDeadPlants, setNewDeadPlants] = useState<
    Array<{
      id: string
      latitude: number
      longitude: number
      type: string
      description: string
      condition: string
    }>
  >([])

  const { user } = useAuth()

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng })
  }

  const handleFormSubmit = async (data: {
    latitude: number
    longitude: number
    type: string
    description: string
    condition: string
  }) => {
    if (!user) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/dead-plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        // Add the new dead plant to the map immediately
        setNewDeadPlants((prev) => [
          ...prev,
          {
            id: result.deadPlant.id,
            latitude: result.deadPlant.latitude,
            longitude: result.deadPlant.longitude,
            type: result.deadPlant.type,
            description: result.deadPlant.description,
            condition: result.deadPlant.condition,
          },
        ])
        setIsMapClickMode(false)
        setSelectedCoordinates(undefined)
      } else {
        const error = await response.json()
        alert(error.message || "Failed to add dead plant matter")
      }
    } catch (error) {
      console.error("Error adding dead plant:", error)
      alert("Failed to add dead plant matter")
    }
  }

  const toggleMapClickMode = () => {
    setIsMapClickMode(!isMapClickMode)
    if (!isMapClickMode) {
      setSelectedCoordinates(undefined)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">SoCal Tree Map</h1>
                <p className="text-muted-foreground mt-1">Explore trees and vegetation in Glendale, CA</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
                <Button
                  variant={filter === "All" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("All")}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filter === "Trees" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("Trees")}
                  className="text-xs"
                >
                  Trees
                </Button>
                <Button
                  variant={filter === "Dead Matter" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("Dead Matter")}
                  className="text-xs"
                >
                  Dead Matter
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Layers className="w-4 h-4 mr-2" />
                Layers
              </Button>
              <Button variant="outline" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Info
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-card p-3 rounded-lg border border-border">
              <div className="text-lg font-bold text-primary">2,847</div>
              <div className="text-xs text-muted-foreground">Trees Mapped</div>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border">
              <div className="text-lg font-bold text-primary">156</div>
              <div className="text-xs text-muted-foreground">Species</div>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border">
              <div className="text-lg font-bold text-primary">42.3k</div>
              <div className="text-xs text-muted-foreground">lbs CO₂</div>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border">
              <div className="text-lg font-bold text-primary">Glendale</div>
              <div className="text-xs text-muted-foreground">Focus Area</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl h-full">
          <div className="bg-card rounded-lg border border-border p-4 h-[calc(100vh-300px)]">
            <MapComponent
              className="h-full"
              filter={filter}
              onMapClick={handleMapClick}
              isClickMode={isMapClickMode}
              newDeadPlants={newDeadPlants}
            />
          </div>

          {user && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Report Dead Plant Matter
              </Button>
            </div>
          )}
        </div>
      </section>

      <AddDeadPlantForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setIsMapClickMode(false)
          setSelectedCoordinates(undefined)
        }}
        onSubmit={handleFormSubmit}
        initialCoordinates={selectedCoordinates}
        onMapClick={toggleMapClickMode}
        isMapClickMode={isMapClickMode}
      />
    </div>
  )
}
