import { Navbar } from "@/components/navbar"
import { MapComponent } from "@/components/map-component"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, Layers, Search } from "lucide-react"
import Link from "next/link"

export default function MapPage() {
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
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
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
            <MapComponent className="h-full" />
          </div>
        </div>
      </section>
    </div>
  )
}
