"use client"

import { AddDeadPlantForm } from "@/components/add-dead-plant-form"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { sampleMapFeatures, type MapFeature } from "@/lib/map-data"
import { cn } from "@/lib/utils"
import { ArrowLeft, Crosshair, Leaf, LocateFixed, Plus, Skull, TreePine, X } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"

const MapComponent = dynamic(
  () => import("@/components/map-component").then((mod) => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[620px] min-h-[620px] items-center justify-center rounded-md bg-secondary">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading map</p>
        </div>
      </div>
    ),
  },
)

const filters = [
  { value: "All", label: "All", icon: Leaf },
  { value: "Trees", label: "Trees", icon: TreePine },
  { value: "Dead Matter", label: "Dead matter", icon: Skull },
] as const

const stats = [
  { value: "2,847", label: "Trees" },
  { value: "156", label: "Species" },
  { value: "42.3k", label: "lbs CO2" },
  { value: "Glendale", label: "Focus" },
]

export default function MapPage() {
  const [filter, setFilter] = useState<"All" | "Trees" | "Dead Matter">("All")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMapClickMode, setIsMapClickMode] = useState(false)
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | undefined>()
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(sampleMapFeatures[0])
  const [refreshMap, setRefreshMap] = useState(0)
  const [notice, setNotice] = useState("")

  const { user } = useAuth()

  const handleMapClick = (lat: number, lng: number) => {
    if (!isMapClickMode) return

    setSelectedCoordinates({ lat, lng })
    setIsMapClickMode(false)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: {
    type: string
    latitude: number
    longitude: number
    condition: string
    description: string
  }) => {
    if (!user) {
      throw new Error("Please sign in before reporting plant material.")
    }

    const token = localStorage.getItem("token")
    const response = await fetch("/api/dead-plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.message || result.error || "Failed to add dead plant report.")
    }

    setRefreshMap((prev) => prev + 1)
    setIsMapClickMode(false)
    setSelectedCoordinates(undefined)
    setNotice("Report saved. The map has been refreshed.")
  }

  const startLocationPick = () => {
    setNotice("")
    setIsFormOpen(false)
    setSelectedCoordinates(undefined)
    setIsMapClickMode(true)
  }

  const cancelLocationPick = () => {
    setIsMapClickMode(false)
    setSelectedCoordinates(undefined)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">SoCal Tree Map</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Filter living trees and dead plant material around Glendale. Click a marker for field details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex rounded-md border border-border bg-card p-1 shadow-sm shadow-foreground/5">
                {filters.map((item) => {
                  const Icon = item.icon
                  const isActive = filter === item.value

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      className={cn(
                        "inline-flex h-9 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              {user ? (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Report
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/login">Sign in to report</Link>
                </Button>
              )}
            </div>
          </div>

          {isMapClickMode && (
            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Pick a report location</p>
                  <p className="text-muted-foreground">Click the map where the dead plant material is located.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={cancelLocationPick}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}

          {notice && (
            <div className="mb-4 rounded-lg border border-primary/20 bg-card px-4 py-3 text-sm font-medium text-primary">
              {notice}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="min-h-[620px] overflow-hidden rounded-lg border border-border bg-card p-2 shadow-xl shadow-foreground/5">
              <MapComponent
                className="h-[620px] min-h-[620px]"
                filter={filter}
                onMapClick={handleMapClick}
                onFeatureSelect={setSelectedFeature}
                selectedFeatureId={selectedFeature?.id || null}
                isClickMode={isMapClickMode}
                key={refreshMap}
              />
            </div>

            <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm shadow-foreground/5">
                <p className="text-sm font-semibold text-foreground">Field snapshot</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-md bg-secondary/70 p-3">
                      <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                      <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedFeature && (
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm shadow-foreground/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        {selectedFeature.kind === "tree" ? "Living tree" : "Dead material"}
                      </p>
                      <h2 className="mt-1 text-base font-semibold leading-snug text-foreground">
                        {selectedFeature.title}
                      </h2>
                    </div>
                    <span
                      className={cn(
                        "mt-0.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-white",
                        selectedFeature.kind === "tree" ? "bg-primary" : "bg-destructive",
                      )}
                    />
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div className="rounded-md bg-secondary/70 p-3">
                      <dt className="text-xs font-medium text-muted-foreground">Condition</dt>
                      <dd className="mt-1 font-medium text-foreground">{selectedFeature.condition}</dd>
                    </div>
                    <div className="rounded-md bg-secondary/70 p-3">
                      <dt className="text-xs font-medium text-muted-foreground">Type</dt>
                      <dd className="mt-1 font-medium text-foreground">{selectedFeature.type}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{selectedFeature.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <LocateFixed className="h-3.5 w-3.5" />
                    {selectedFeature.latitude.toFixed(4)}, {selectedFeature.longitude.toFixed(4)}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm shadow-foreground/5">
                <p className="text-sm font-semibold text-foreground">Legend</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-primary ring-2 ring-white" />
                    Living tree
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-destructive ring-2 ring-white" />
                    Dead plant material
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-chart-2 ring-2 ring-white" />
                    Selected location
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm shadow-foreground/5 sm:col-span-2 lg:col-span-1">
                <p className="text-sm font-semibold text-foreground">Visible records</p>
                <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                  {sampleMapFeatures
                    .filter(
                      (feature) =>
                        filter === "All" ||
                        (filter === "Trees" && feature.kind === "tree") ||
                        (filter === "Dead Matter" && feature.kind === "dead"),
                    )
                    .map((feature) => (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => setSelectedFeature(feature)}
                        className={cn(
                          "w-full rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:border-border hover:bg-secondary/70",
                          selectedFeature?.id === feature.id && "border-primary/30 bg-primary/10",
                        )}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              feature.kind === "tree" ? "bg-primary" : "bg-destructive",
                            )}
                          />
                          {feature.title}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">{feature.metric}</span>
                      </button>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <AddDeadPlantForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setIsMapClickMode(false)
          setSelectedCoordinates(undefined)
        }}
        onSubmit={handleFormSubmit}
        initialCoordinates={selectedCoordinates}
        onMapClick={startLocationPick}
        isMapClickMode={isMapClickMode}
      />
    </div>
  )
}
