import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Gavel, Clock, Trophy, TrendingUp } from "lucide-react"

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  ended: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

export default async function AuctionsPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  // Get all auctions
  const { data: auctions } = await supabase
    .from("auctions")
    .select("*, tour_events(*)")
    .order("end_time", { ascending: true })

  // Get user's bids with auction info
  const { data: userBids } = await supabase
    .from("auction_bids")
    .select("*, auctions(*, tour_events(*))")
    .eq("user_id", profile?.id || "")
    .order("created_at", { ascending: false })

  const activeAuctions = auctions?.filter(a => a.status === "active") || []
  const upcomingAuctions = auctions?.filter(a => a.status === "upcoming") || []
  const endedAuctions = auctions?.filter(a => a.status === "ended") || []

  // Get auctions where user is currently winning
  const winningAuctions = activeAuctions.filter(auction => {
    const userTopBid = userBids?.find(
      b => b.auction_id === auction.id && b.amount === auction.current_price
    )
    return !!userTopBid
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Auctions</h1>
        <p className="text-muted-foreground mt-1">
          Bid on exclusive experiences with Timi Dakolo
        </p>
      </div>

      {/* Winning Auctions Alert */}
      {winningAuctions.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                You&apos;re winning {winningAuctions.length} auction{winningAuctions.length > 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-muted-foreground">
                Keep an eye on these - someone might outbid you
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="gap-2">
            <span className="hidden sm:inline">Active</span>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs">
              {activeAuctions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <span className="hidden sm:inline">Upcoming</span>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs">
              {upcomingAuctions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="my-bids" className="gap-2">
            <span className="hidden sm:inline">My Bids</span>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs">
              {userBids?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeAuctions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} userBids={userBids || []} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Gavel}
              message="No active auctions right now"
              description="Check back soon for exclusive experiences"
            />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingAuctions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} userBids={userBids || []} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              message="No upcoming auctions scheduled"
              description="New auctions will be announced soon"
            />
          )}
        </TabsContent>

        <TabsContent value="my-bids" className="mt-6">
          {userBids && userBids.length > 0 ? (
            <div className="space-y-4">
              {userBids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{bid.auctions?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Your bid: ₦{bid.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bid.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {bid.auctions?.current_price === bid.amount ? (
                        <Badge className="bg-green-100 text-green-800">Winning</Badge>
                      ) : (
                        <Badge variant="secondary">Outbid</Badge>
                      )}
                      <p className="text-sm mt-1">
                        Current: ₦{bid.auctions?.current_price?.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              message="You haven't placed any bids yet"
              description="Browse active auctions to get started"
            />
          )}
        </TabsContent>

        <TabsContent value="ended" className="mt-6">
          {endedAuctions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {endedAuctions.map((auction) => (
                <Card key={auction.id} className="opacity-75">
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit">Ended</Badge>
                    <CardTitle className="text-lg">{auction.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Final price: ₦{auction.current_price.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Gavel}
              message="No ended auctions"
              description="Completed auctions will appear here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AuctionCardProps {
  auction: any
  userBids: any[]
}

function AuctionCard({ auction, userBids }: AuctionCardProps) {
  const isActive = auction.status === "active"
  const userTopBid = userBids.find(
    b => b.auction_id === auction.id && b.amount === auction.current_price
  )
  const isWinning = !!userTopBid
  const timeLeft = getTimeLeft(auction.end_time)

  return (
    <Card className={isWinning ? "border-primary" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={statusColors[auction.status as keyof typeof statusColors]}>
            {auction.status}
          </Badge>
          {isWinning && <Badge className="bg-green-100 text-green-800">You&apos;re Winning!</Badge>}
        </div>
        <CardTitle className="text-lg font-serif">{auction.title}</CardTitle>
        {auction.tour_events && (
          <CardDescription>
            {auction.tour_events.name} - {auction.tour_events.city}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {auction.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {auction.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Bid</p>
            <p className="text-2xl font-bold text-primary">
              ₦{auction.current_price.toLocaleString()}
            </p>
          </div>
          {isActive && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Time Left</p>
              <p className="font-medium">{timeLeft}</p>
            </div>
          )}
        </div>

        {isActive && (
          <Button asChild className="w-full">
            <Link href={`/dashboard/auctions/${auction.id}`}>
              <Gavel className="h-4 w-4 mr-2" />
              Place Bid
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({ icon: Icon, message, description }: { icon: any; message: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-center">{message}</p>
        <p className="text-sm text-muted-foreground/70 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function getTimeLeft(endTime: string): string {
  const end = new Date(endTime)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
