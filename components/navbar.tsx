"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#tour-dates", label: "Tour Dates" },
  { href: "/send-a-wish", label: "Send a Wish" },
  { href: "/dinner", label: "Invite Timi" },
  { href: "/stories", label: "Stories" },
  { href: "/merch", label: "Merch" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-bold text-foreground tracking-tight">
          Wish Me Well
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#tour-dates"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buy Tickets
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#tour-dates"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Buy Tickets
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
