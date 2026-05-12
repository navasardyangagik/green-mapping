"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, MapPin, Skull, TreePine } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

const stats = [
  { label: "Trees viewed", value: "23", detail: "+2 from last week", icon: TreePine, tone: "text-primary" },
  { label: "Dead plants found", value: "7", detail: "+1 from last week", icon: Skull, tone: "text-destructive" },
  { label: "Areas explored", value: "3", detail: "Glendale focused", icon: MapPin, tone: "text-chart-2" },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">Loading dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Welcome back, {user.name}. Your field activity is below.</p>
            </div>
            <Button asChild>
              <Link href="/map">
                <MapPin className="h-4 w-4" />
                Open map
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardDescription>{stat.label}</CardDescription>
                      <CardTitle className={`mt-3 text-3xl font-semibold ${stat.tone}`}>{stat.value}</CardTitle>
                    </div>
                    <div className="rounded-md bg-secondary p-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{stat.detail}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Shortcuts for the workflows that matter most.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <Button asChild>
                  <Link href="/map">
                    <MapPin className="h-4 w-4" />
                    Explore
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/map">
                    <TreePine className="h-4 w-4" />
                    View trees
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/map">
                    <Skull className="h-4 w-4" />
                    Report issue
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent status</CardTitle>
                <CardDescription>Local-only demo metrics until live activity history is wired in.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-md bg-secondary/70 px-3 py-2">
                  <span className="flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Last map session
                  </span>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-secondary/70 px-3 py-2">
                  <span className="text-foreground">Focus area</span>
                  <span className="text-muted-foreground">Glendale</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
