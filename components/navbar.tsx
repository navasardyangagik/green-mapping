"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Leaf, LogOut, Map, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { href: "/map", label: "Map" },
    { href: "/#overview", label: "Overview" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/15">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-foreground">SoCal Trees</h1>
              <p className="hidden text-xs leading-tight text-muted-foreground sm:block">Glendale plant map</p>
            </div>
          </Link>

          <div className="hidden items-center rounded-md border border-border/80 bg-card/70 p-1 md:flex">
            {navItems.map((item) => {
              const isActive = item.href === "/map" ? pathname === "/map" : pathname === "/" && item.href.includes("#")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-secondary text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="max-w-[180px]">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/map">
                      <Map className="mr-2 h-4 w-4" /> Map
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
