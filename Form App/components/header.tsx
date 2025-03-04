"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // This would check the authentication state in a real application
  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // For demo purposes, let's consider the user logged in if they're on certain pages
      const loggedInPages = ["/dashboard", "/admin", "/templates/create"]
      const isUserLoggedIn = loggedInPages.some((page) => pathname?.startsWith(page))
      setIsLoggedIn(isUserLoggedIn)

      // For demo purposes, let's consider the user an admin if they're on the admin page
      setIsAdmin(pathname?.startsWith("/admin"))
    }

    checkAuth()
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-4">
                <Link href="/" className="text-lg font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/templates" className="text-lg font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                  Templates
                </Link>
                {isLoggedIn && (
                  <Link href="/dashboard" className="text-lg font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/admin" className="text-lg font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                {!isLoggedIn && (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-lg font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/login?tab=register"
                      className="text-lg font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">FormCraft</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/templates"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname?.startsWith("/templates") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Templates
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname?.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-center px-4">
          <div className="w-full max-w-sm">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // In a real app, this would call a logout API
                    window.location.href = "/"
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/login?tab=register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

