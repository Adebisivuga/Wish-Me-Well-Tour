"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Ticket, Mail, Gavel, Users } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Tickets",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    title: "Letters",
    href: "/admin/letters",
    icon: Mail,
  },
  {
    title: "Auctions",
    href: "/admin/auctions",
    icon: Gavel,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex w-64 flex-col border-r bg-muted/30 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
