import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Ticket, Mail, Gavel, Users, TrendingUp, ArrowRight } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  // Get counts
  const { count: eventCount } = await supabase
    .from("tour_events")
    .select("*", { count: "exact", head: true })

  const { count: ticketCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })

  const { count: letterCount } = await supabase
    .from("wish_me_well_letters")
    .select("*", { count: "exact", head: true })

  const { count: pendingLetterCount } = await supabase
    .from("wish_me_well_letters")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: auctionCount } = await supabase
    .from("auctions")
    .select("*", { count: "exact", head: true })

  const { count: activeAuctionCount } = await supabase
    .from("auctions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  // Get recent letters needing review
  const { data: recentPendingLetters } = await supabase
    .from("wish_me_well_letters")
    .select("*, profiles(full_name)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: false })
    .limit(5)

  // Get active auctions
  const { data: activeAuctions } = await supabase
    .from("auctions")
    .select("*")
    .eq("status", "active")
    .order("end_time", { ascending: true })
    .limit(3)

  const stats = [
    {
      title: "Tour Events",
      value: eventCount || 0,
      icon: Calendar,
      href: "/admin/events",
      color: "text-blue-500",
    },
    {
      title: "Tickets Sold",
      value: ticketCount || 0,
      icon: Ticket,
      href: "/admin/tickets",
      color: "text-green-500",
    },
    {
      title: "Letters",
      value: letterCount || 0,
      description: pendingLetterCount ? `${pendingLetterCount} pending` : undefined,
      icon: Mail,
      href: "/admin/letters",
      color: "text-amber-500",
    },
    {
      title: "Auctions",
      value: auctionCount || 0,
      description: activeAuctionCount ? `${activeAuctionCount} active` : undefined,
      icon: Gavel,
      href: "/admin/auctions",
      color: "text-purple-500",
    },
    {
      title: "Users",
      value: userCount || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-primary",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage the Wish Me Well Tour backend
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link href={stat.href}>
                  Manage <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Letters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Letters Awaiting Review
                </CardTitle>
                <CardDescription>
                  Review and approve fan submissions
                </CardDescription>
              </div>
              {pendingLetterCount && pendingLetterCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  {pendingLetterCount}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recentPendingLetters && recentPendingLetters.length > 0 ? (
              <div className="space-y-3">
                {recentPendingLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {letter.is_anonymous ? "Anonymous" : letter.sender_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tier {letter.package_tier} - ₦{letter.amount_paid.toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/letters/${letter.id}`}>Review</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/admin/letters?status=pending">View All Pending</Link>
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No pending letters to review
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Auctions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Active Auctions
            </CardTitle>
            <CardDescription>
              Monitor live bidding activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeAuctions && activeAuctions.length > 0 ? (
              <div className="space-y-3">
                {activeAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div>
                      <p className="font-medium text-sm">{auction.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Current: ₦{auction.current_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Ends: {new Date(auction.end_time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/admin/auctions">Manage Auctions</Link>
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No active auctions
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
