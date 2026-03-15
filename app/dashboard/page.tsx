import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Ticket, Mail, Gavel, Calendar, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  // Get user stats
  const { count: ticketCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile?.id || "")

  const { count: letterCount } = await supabase
    .from("wish_me_well_letters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile?.id || "")

  const { count: bidCount } = await supabase
    .from("auction_bids")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile?.id || "")

  // Get upcoming events
  const { data: upcomingEvents } = await supabase
    .from("tour_events")
    .select("*")
    .eq("is_active", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3)

  // Get active auctions
  const { data: activeAuctions } = await supabase
    .from("auctions")
    .select("*, tour_events(*)")
    .eq("status", "active")
    .order("end_time", { ascending: true })
    .limit(2)

  const stats = [
    {
      title: "My Tickets",
      value: ticketCount || 0,
      description: "Active tickets",
      icon: Ticket,
      href: "/dashboard/tickets",
      color: "text-primary",
    },
    {
      title: "My Letters",
      value: letterCount || 0,
      description: "Wishes sent",
      icon: Mail,
      href: "/dashboard/letters",
      color: "text-accent",
    },
    {
      title: "My Bids",
      value: bidCount || 0,
      description: "Auction bids placed",
      icon: Gavel,
      href: "/dashboard/auctions",
      color: "text-chart-3",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Fan"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your tickets, letters, and auction bids
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link href={stat.href}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tour Dates
          </CardTitle>
          <CardDescription>
            Get tickets to see Timi Dakolo live
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.venue}, {event.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/tickets/${event.id}`}>Get Tickets</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No upcoming events at the moment. Check back soon!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active Auctions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Live Auctions
          </CardTitle>
          <CardDescription>
            Bid on exclusive experiences with Timi Dakolo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAuctions && activeAuctions.length > 0 ? (
            <div className="space-y-4">
              {activeAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div>
                    <h3 className="font-semibold">{auction.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Current bid: ₦{auction.current_price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ends: {new Date(auction.end_time).toLocaleString()}
                    </p>
                  </div>
                  <Button asChild variant="secondary">
                    <Link href={`/dashboard/auctions/${auction.id}`}>Place Bid</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No active auctions right now. Check back soon!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
