"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, MapPin } from "lucide-react"

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

  // Update coordinates when initialCoordinates change
  useState(() => {
    if (initialCoordinates) {
      setFormData((prev) => ({
        ...prev,
        latitude: initialCoordinates.lat,
        longitude: initialCoordinates.lng,
      }))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.description) return

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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Add Dead Plant Matter</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
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
              size="sm"
              onClick={onMapClick}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {isMapClickMode ? "Click on map to set location" : "Click on map to select location"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type of Dead Plant Matter *</Label>
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
              placeholder="Describe the dead plant matter, its size, location details, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
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
