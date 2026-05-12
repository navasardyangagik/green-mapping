"use client"

import { useEffect, useRef } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import { canopyZones, sampleMapFeatures, type MapFeature, type MapFeatureKind } from "@/lib/map-data"

interface MapComponentProps {
  className?: string
  filter?: "All" | "Trees" | "Dead Matter"
  onMapClick?: (lat: number, lng: number) => void
  onFeatureSelect?: (feature: MapFeature) => void
  selectedFeatureId?: string | null
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

const markerColors: Record<MapFeatureKind, { fill: string; stroke: string; halo: string }> = {
  tree: { fill: "#2f6f46", stroke: "#f9faf4", halo: "#b8d7bf" },
  dead: { fill: "#b83b36", stroke: "#fff7ed", halo: "#e8b5a8" },
}

const zoneColors = {
  primary: { stroke: "#2f6f46", fill: "#2f6f46" },
  teal: { stroke: "#159895", fill: "#159895" },
  amber: { stroke: "#a46a24", fill: "#a46a24" },
}

function reportedPlantToFeature(plant: {
  id: string
  latitude: number
  longitude: number
  type: string
  description: string
  condition: string
}): MapFeature {
  return {
    id: `community-${plant.id}`,
    kind: "dead",
    latitude: plant.latitude,
    longitude: plant.longitude,
    title: plant.type,
    type: plant.type,
    condition: plant.condition || "Unknown",
    description: plant.description || "Community-submitted plant material report.",
    source: "community",
    metric: "Community report",
  }
}

export function MapComponent({
  className = "",
  filter = "All",
  onMapClick,
  onFeatureSelect,
  selectedFeatureId = null,
  isClickMode = false,
  newDeadPlants = [],
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map())
  const featuresRef = useRef<Map<string, MapFeature>>(new Map(sampleMapFeatures.map((feature) => [feature.id, feature])))
  const clickMarkerRef = useRef<L.CircleMarker | null>(null)
  const isClickModeRef = useRef(isClickMode)
  const onMapClickRef = useRef(onMapClick)
  const onFeatureSelectRef = useRef(onFeatureSelect)
  const filterRef = useRef(filter)
  const selectedFeatureIdRef = useRef<string | null>(selectedFeatureId)

  const styleMarker = (marker: L.CircleMarker, feature: MapFeature, state: "default" | "hover" | "selected") => {
    const colors = markerColors[feature.kind]
    const isSelected = state === "selected"
    const isHover = state === "hover"

    marker.setStyle({
      radius: isSelected ? 12 : isHover ? 10 : feature.kind === "tree" ? 7 : 8,
      fillColor: colors.fill,
      fillOpacity: isSelected ? 0.96 : 0.86,
      color: isSelected ? colors.halo : colors.stroke,
      opacity: 1,
      weight: isSelected ? 5 : isHover ? 4 : 2,
    })

    if (isSelected || isHover) {
      marker.bringToFront()
    }
  }

  const applyFilter = () => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach((marker, id) => {
      const feature = featuresRef.current.get(id)
      if (!feature) return

      const shouldShow =
        filterRef.current === "All" ||
        (filterRef.current === "Trees" && feature.kind === "tree") ||
        (filterRef.current === "Dead Matter" && feature.kind === "dead")

      if (shouldShow && !map.hasLayer(marker)) {
        marker.addTo(map)
      }

      if (!shouldShow && map.hasLayer(marker)) {
        marker.removeFrom(map)
      }
    })
  }

  const applySelection = () => {
    markersRef.current.forEach((marker, id) => {
      const feature = featuresRef.current.get(id)
      if (feature) {
        styleMarker(marker, feature, id === selectedFeatureIdRef.current ? "selected" : "default")
      }
    })
  }

  const addFeatureMarker = (feature: MapFeature) => {
    const map = mapInstanceRef.current
    if (!map || markersRef.current.has(feature.id)) return

    featuresRef.current.set(feature.id, feature)

    const marker = L.circleMarker([feature.latitude, feature.longitude], {
      interactive: true,
      bubblingMouseEvents: false,
    })

    styleMarker(marker, feature, feature.id === selectedFeatureIdRef.current ? "selected" : "default")

    marker.bindTooltip(
      `<div class="map-tooltip-title">${feature.title}</div><div class="map-tooltip-meta">${feature.condition}</div>`,
      {
        direction: "top",
        offset: [0, -8],
        opacity: 0.96,
      },
    )

    marker.on("mouseover", () => {
      if (selectedFeatureIdRef.current !== feature.id) {
        styleMarker(marker, feature, "hover")
      }
    })

    marker.on("mouseout", () => {
      styleMarker(marker, feature, selectedFeatureIdRef.current === feature.id ? "selected" : "default")
    })

    marker.on("click", () => {
      selectedFeatureIdRef.current = feature.id
      applySelection()
      onFeatureSelectRef.current?.(feature)
      map.panTo([feature.latitude, feature.longitude], { animate: true, duration: 0.45 })
    })

    markersRef.current.set(feature.id, marker)
    marker.addTo(map)
    applyFilter()
  }

  useEffect(() => {
    isClickModeRef.current = isClickMode
    onMapClickRef.current = onMapClick
    onFeatureSelectRef.current = onFeatureSelect
    filterRef.current = filter
    selectedFeatureIdRef.current = selectedFeatureId
  }, [isClickMode, onMapClick, onFeatureSelect, filter, selectedFeatureId])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      zoomControl: false,
      preferCanvas: true,
      scrollWheelZoom: true,
    }).setView([34.1425, -118.2551], 14)

    L.control.zoom({ position: "topright" }).addTo(map)

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    }).addTo(map)

    canopyZones.forEach((zone) => {
      const colors = zoneColors[zone.tone]
      const polygon = L.polygon(zone.coordinates, {
        color: colors.stroke,
        fillColor: colors.fill,
        fillOpacity: 0.09,
        opacity: 0.42,
        weight: 1.5,
        dashArray: "5 7",
        interactive: false,
      }).addTo(map)

      polygon.bindTooltip(zone.name, {
        direction: "center",
        permanent: false,
        opacity: 0.92,
      })
    })

    L.circleMarker([34.1425, -118.2551], {
      radius: 5,
      color: "#17251d",
      fillColor: "#17251d",
      fillOpacity: 0.9,
      weight: 2,
    })
      .addTo(map)
      .bindTooltip("Glendale city center", { direction: "top", offset: [0, -8] })

    map.on("click", (event: L.LeafletMouseEvent) => {
      if (!isClickModeRef.current || !onMapClickRef.current) return

      const { lat, lng } = event.latlng
      onMapClickRef.current(lat, lng)

      if (clickMarkerRef.current) {
        clickMarkerRef.current.removeFrom(map)
      }

      clickMarkerRef.current = L.circleMarker([lat, lng], {
        radius: 11,
        color: "#dff6f4",
        fillColor: "#159895",
        fillOpacity: 0.92,
        opacity: 1,
        weight: 5,
      }).addTo(map)
    })

    mapInstanceRef.current = map
    sampleMapFeatures.forEach(addFeatureMarker)

    setTimeout(() => map.invalidateSize(), 80)

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current.clear()
      featuresRef.current = new Map(sampleMapFeatures.map((feature) => [feature.id, feature]))
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    let isMounted = true

    async function loadReportedDeadPlants() {
      try {
        const response = await fetch("/api/dead-plants")
        if (!response.ok) return

        const data = await response.json()
        if (!isMounted || !Array.isArray(data.deadPlants)) return

        data.deadPlants.forEach(
          (plant: {
            id: string
            latitude: number
            longitude: number
            type: string
            description: string
            condition: string
          }) => addFeatureMarker(reportedPlantToFeature(plant)),
        )
      } catch {
        // Keep the demo map usable when the optional database is not configured locally.
      }
    }

    loadReportedDeadPlants()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || newDeadPlants.length === 0) return
    newDeadPlants.forEach((plant) => addFeatureMarker(reportedPlantToFeature(plant)))
  }, [newDeadPlants])

  useEffect(() => {
    filterRef.current = filter
    applyFilter()
  }, [filter])

  useEffect(() => {
    selectedFeatureIdRef.current = selectedFeatureId
    applySelection()

    const map = mapInstanceRef.current
    const feature = selectedFeatureId ? featuresRef.current.get(selectedFeatureId) : null

    if (map && feature) {
      map.panTo([feature.latitude, feature.longitude], { animate: true, duration: 0.35 })
    }
  }, [selectedFeatureId])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const container = map.getContainer()
    container.classList.toggle("is-picking-location", isClickMode)

    if (!isClickMode && clickMarkerRef.current) {
      clickMarkerRef.current.removeFrom(map)
      clickMarkerRef.current = null
    }
  }, [isClickMode])

  return <div ref={mapRef} className={`w-full h-full min-h-[500px] rounded-md ${className}`} />
}
