import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Activity, ArrowRight, Leaf, MapPin, Sprout, TreePine } from "lucide-react"
import Link from "next/link"

const stats = [
  { value: "2,847", label: "Trees mapped" },
  { value: "156", label: "Species identified" },
  { value: "42.3k", label: "lbs CO2 tracked" },
]

const features = [
  {
    icon: TreePine,
    title: "Living tree inventory",
    description: "Track location, species, and condition with a map that is built for field checks.",
  },
  {
    icon: Activity,
    title: "Health and impact",
    description: "Surface plant condition and carbon contribution without burying useful details.",
  },
  {
    icon: Sprout,
    title: "Community reports",
    description: "Signed-in users can report dead plant material directly from the map.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.88fr]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                Glendale, CA plant intelligence
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                A cleaner map for the urban canopy.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Explore tree locations, scan health signals, and contribute field reports without the clutter that
                usually makes civic tools feel like homework.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/map">
                    Open map
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#overview">View overview</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 shadow-xl shadow-foreground/5">
              <div className="overflow-hidden rounded-md border border-border bg-[#edf1e7]">
                <div className="flex items-center justify-between border-b border-border bg-card/90 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">SoCal Tree Map</p>
                    <p className="text-xs text-muted-foreground">Brand Park to Downtown Glendale</p>
                  </div>
                  <div className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Live</div>
                </div>
                <div className="relative h-[360px] overflow-hidden">
                  <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(47,68,55,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,68,55,.12)_1px,transparent_1px)] [background-size:44px_44px]" />
                  <div className="absolute left-[14%] top-[18%] h-24 w-52 rotate-[-8deg] rounded-full border border-primary/20 bg-primary/10" />
                  <div className="absolute bottom-[16%] right-[10%] h-28 w-64 rotate-[10deg] rounded-full border border-chart-2/25 bg-chart-2/10" />
                  {[
                    ["18%", "28%", "Oak", "bg-primary"],
                    ["35%", "54%", "Pine", "bg-primary"],
                    ["56%", "35%", "Palm", "bg-primary"],
                    ["72%", "62%", "Dry shrub", "bg-destructive"],
                    ["62%", "74%", "Maple", "bg-primary"],
                    ["25%", "72%", "Dead bush", "bg-destructive"],
                  ].map(([left, top, label, color]) => (
                    <div
                      key={`${left}-${top}`}
                      className="absolute"
                      style={{ left, top }}
                    >
                      <div className={`h-3.5 w-3.5 rounded-full border-2 border-white ${color} shadow-md`} />
                      <span className="mt-1 block rounded bg-card/90 px-1.5 py-0.5 text-[11px] font-medium text-foreground shadow-sm">
                        {label}
                      </span>
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-4 rounded-md border border-border bg-card/90 p-3 shadow-lg">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Field summary
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                          <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="border-y border-border bg-card/45 px-4 py-12 sm:px-6 lg:px-8">
          <div className="container mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-background px-5 py-4">
                <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-normal text-foreground">Built for scanning, not scrolling.</h2>
              <p className="mt-3 text-muted-foreground">
                The app keeps the map, reporting flow, and environmental context close together so you can move from
                observation to action quickly.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-lg border border-border bg-card p-5 shadow-sm shadow-foreground/5">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
