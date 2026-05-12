"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, X } from "lucide-react"

interface AddDeadPlantFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    latitude: number
    longitude: number
    type: string
    description: string
    condition: string
  }) => void
  initialCoordinates?: { lat: number; lng: number }
  onMapClick: () => void
  isMapClickMode: boolean
}

export function AddDeadPlantForm({
  isOpen,
  onClose,
  onSubmit,
  initialCoordinates,
  onMapClick,
  isMapClickMode,
}: AddDeadPlantFormProps) {
  const [formData, setFormData] = useState({
    latitude: initialCoordinates?.lat || 34.1425,
    longitude: initialCoordinates?.lng || -118.2551,
    type: "",
    description: "",
    condition: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialCoordinates) {
      setFormData((prev) => ({
        ...prev,
        latitude: initialCoordinates.lat,
        longitude: initialCoordinates.lng,
      }))
    }
  }, [initialCoordinates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.description) return

    setError("")
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        latitude: 34.1425,
        longitude: -118.2551,
        type: "",
        description: "",
        condition: "",
      })
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(error instanceof Error ? error.message : "Unable to save this report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dead-plant-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card shadow-2xl shadow-foreground/20"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 id="dead-plant-title" className="text-lg font-semibold text-foreground">
              Report dead plant material
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pin the location and add enough detail for someone to verify it later.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close report form">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {error && (
            <div className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Location</Label>
              <span className="text-xs text-muted-foreground">Glendale default unless changed</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex-1">
                <Label htmlFor="latitude" className="text-xs text-muted-foreground">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, latitude: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="34.1425"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="longitude" className="text-xs text-muted-foreground">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, longitude: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="-118.2551"
                />
              </div>
            </div>
            <Button
              type="button"
              variant={isMapClickMode ? "default" : "outline"}
              onClick={onMapClick}
              className="w-full"
            >
              <MapPin className="h-4 w-4" />
              Pick location on map
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dead Tree">Dead Tree</SelectItem>
                <SelectItem value="Dead Bush">Dead Bush</SelectItem>
                <SelectItem value="Dead Shrub">Dead Shrub</SelectItem>
                <SelectItem value="Dry Shrub">Dry Shrub</SelectItem>
                <SelectItem value="Withered Plant">Withered Plant</SelectItem>
                <SelectItem value="Dead Grass">Dead Grass</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Recently Dead">Recently Dead</SelectItem>
                <SelectItem value="Partially Dead">Partially Dead</SelectItem>
                <SelectItem value="Completely Dead">Completely Dead</SelectItem>
                <SelectItem value="Dried Out">Dried Out</SelectItem>
                <SelectItem value="Diseased">Diseased</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Size, nearby landmark, visible risk, or anything that helps someone confirm it."
              rows={3}
            />
          </div>

          <div className="grid gap-2 pt-1 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.type || !formData.description || isSubmitting} className="flex-1">
              {isSubmitting ? "Adding..." : "Add Dead Plant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
