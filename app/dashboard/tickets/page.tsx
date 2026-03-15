import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TICKET_TIERS } from "@/lib/types/database"
import type { Ticket, TourEvent } from "@/lib/types/database"
import Link from "next/link"
import { Ticket as TicketIcon, QrCode, Send, Calendar, MapPin } from "lucide-react"
import { TicketCard } from "@/components/dashboard/ticket-card"

export default async function TicketsPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*, tour_events:event_id(*)")
    .eq("user_id", profile?.id || "")
    .order("purchased_at", { ascending: false })

  const allTickets = tickets || []
  const validTickets = allTickets.filter(t => t.status === "valid")
  const usedTickets = allTickets.filter(t => t.status === "used")
  const transferredTickets = allTickets.filter(t => t.status === "transferred")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">My Tickets</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your tour tickets
        </p>
      </div>

      {/* Active Tickets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TicketIcon className="h-5 w-5 text-primary" />
          Active Tickets ({validTickets.length})
        </h2>
        
        {validTickets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {validTickets.map((ticket) => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket as Ticket & { tour_events: TourEvent }} 
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TicketIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                You don&apos;t have any active tickets yet
              </p>
              <Button asChild>
                <Link href="/#tour-dates">Browse Tour Dates</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Used Tickets */}
      {usedTickets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Past Events ({usedTickets.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {usedTickets.map((ticket) => (
              <Card key={ticket.id} className="opacity-60">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Used</Badge>
                    <Badge variant="outline">
                      {TICKET_TIERS[ticket.ticket_tier as keyof typeof TICKET_TIERS]?.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {ticket.tour_events?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {ticket.tour_events?.venue}, {ticket.tour_events?.city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.tour_events?.event_date || "").toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Transferred Tickets */}
      {transferredTickets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Transferred ({transferredTickets.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {transferredTickets.map((ticket) => (
              <Card key={ticket.id} className="opacity-60">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Transferred</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {ticket.tour_events?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This ticket was transferred to another user
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
