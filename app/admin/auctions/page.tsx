import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Plus, Gavel, Eye } from "lucide-react"

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  ended: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

export default async function AdminAuctionsPage() {
  const supabase = await createClient()

  const { data: auctions } = await supabase
    .from("auctions")
    .select("*, tour_events(name, city), profiles(full_name)")
    .order("created_at", { ascending: false })

  // Get bid counts for each auction
  const auctionIds = auctions?.map(a => a.id) || []
  const { data: bidCounts } = await supabase
    .from("auction_bids")
    .select("auction_id")
    .in("auction_id", auctionIds)

  const bidCountMap = (bidCounts || []).reduce((acc, bid) => {
    acc[bid.auction_id] = (acc[bid.auction_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Auctions Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage auction experiences
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/auctions/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Auction
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            All Auctions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auctions && auctions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>
                      <p className="font-medium">{auction.title}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{auction.tour_events?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {auction.tour_events?.city}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[auction.status as keyof typeof statusColors]}>
                        {auction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₦{auction.current_price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {bidCountMap[auction.id] || 0} bids
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(auction.end_time).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/auctions/${auction.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No auctions found. Create your first auction.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
