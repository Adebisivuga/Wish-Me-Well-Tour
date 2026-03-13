import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Ticket } from "lucide-react"

const statusColors = {
  valid: "bg-green-100 text-green-800",
  used: "bg-gray-100 text-gray-800",
  transferred: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
}

const tierColors = {
  regular: "bg-muted",
  vip: "bg-primary/20 text-primary",
  vvip: "bg-accent/20 text-accent-foreground",
}

export default async function AdminTicketsPage() {
  const supabase = await createClient()

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, profiles(full_name, email), tour_events(name, city, event_date)")
    .order("purchased_at", { ascending: false })
    .limit(100)

  // Get stats
  const { count: totalCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })

  const { count: validCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "valid")

  const { count: usedCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "used")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Tickets Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all tour tickets
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valid Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{validCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Used Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">{usedCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{tickets?.reduce((sum, t) => sum + t.price_paid, 0).toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            All Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets && tickets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Purchased</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-xs">
                      {ticket.ticket_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {ticket.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ticket.profiles?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{ticket.tour_events?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ticket.tour_events?.city}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={tierColors[ticket.ticket_tier as keyof typeof tierColors]}>
                        {ticket.ticket_tier.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>₦{ticket.price_paid.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(ticket.purchased_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No tickets found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
