"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Auction, TourEvent, AuctionBid } from "@/lib/types/database"
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Loader2, 
  Trophy,
  ArrowLeft,
  Calendar,
  MapPin
} from "lucide-react"
import Link from "next/link"

interface AuctionBiddingProps {
  auction: Auction & { tour_events: TourEvent }
  initialBids: (AuctionBid & { profiles: { full_name: string } })[]
  userId: string
}

export function AuctionBidding({ auction: initialAuction, initialBids, userId }: AuctionBiddingProps) {
  const [auction, setAuction] = useState(initialAuction)
  const [bids, setBids] = useState(initialBids)
  const [bidAmount, setBidAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [isEnding, setIsEnding] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const minBid = auction.current_price + auction.min_bid_increment
  const isActive = auction.status === "active"
  const isWinning = bids[0]?.user_id === userId

  // Calculate time left
  const calculateTimeLeft = useCallback(() => {
    const end = new Date(auction.end_time)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) {
      setTimeLeft("Auction ended")
      return
    }

    // Check if within last 2 minutes (popcorn bidding zone)
    setIsEnding(diff <= 2 * 60 * 1000)

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (hours > 0) {
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    } else if (minutes > 0) {
      setTimeLeft(`${minutes}m ${seconds}s`)
    } else {
      setTimeLeft(`${seconds}s`)
    }
  }, [auction.end_time])

  // Timer effect
  useEffect(() => {
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`auction-${auction.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auction.id}`,
        },
        (payload) => {
          setAuction(prev => ({ ...prev, ...payload.new }))
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "auction_bids",
          filter: `auction_id=eq.${auction.id}`,
        },
        async () => {
          // Fetch updated bids
          const { data: newBids } = await supabase
            .from("auction_bids")
            .select("*, profiles(full_name)")
            .eq("auction_id", auction.id)
            .order("created_at", { ascending: false })
            .limit(10)
          
          if (newBids) {
            setBids(newBids)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, auction.id])

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const amount = parseFloat(bidAmount)

    if (isNaN(amount) || amount < minBid) {
      setError(`Minimum bid is ₦${minBid.toLocaleString()}`)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auctions/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: auction.id,
          amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to place bid")
      }

      setBidAmount("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const quickBidAmounts = [
    minBid,
    minBid + auction.min_bid_increment,
    minBid + auction.min_bid_increment * 2,
    minBid + auction.min_bid_increment * 5,
  ]

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/auctions">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auctions
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Auction Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {auction.status}
                </Badge>
                {isEnding && isActive && (
                  <Badge variant="destructive" className="animate-pulse">
                    Ending Soon!
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-serif">{auction.title}</CardTitle>
              {auction.tour_events && (
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(auction.tour_events.event_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {auction.tour_events.city}
                  </span>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {auction.description && (
                <p className="text-muted-foreground">{auction.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-3xl font-bold text-primary">
                    ₦{auction.current_price.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-lg p-4 ${isEnding ? "bg-destructive/10" : "bg-muted"}`}>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time Left
                  </p>
                  <p className={`text-3xl font-bold ${isEnding ? "text-destructive" : ""}`}>
                    {timeLeft}
                  </p>
                </div>
              </div>

              {isEnding && isActive && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Popcorn Bidding Active!</strong> Any bid placed in the final 2 minutes will extend the auction by 2 minutes.
                  </AlertDescription>
                </Alert>
              )}

              {isWinning && (
                <Alert className="border-green-200 bg-green-50">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>You&apos;re winning!</strong> Keep watching - someone might outbid you.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Bid History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {bids.length > 0 ? (
                  <div className="space-y-3">
                    {bids.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted"
                        }`}
                      >
                        <div>
                          <p className="font-medium">
                            {bid.user_id === userId ? "You" : bid.profiles?.full_name || "Anonymous"}
                            {index === 0 && <Badge className="ml-2" variant="secondary">Highest</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(bid.created_at).toLocaleString()}
                          </p>
                        </div>
                        <p className="font-bold">₦{bid.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No bids yet. Be the first!
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bidding Panel */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Place Your Bid
              </CardTitle>
              <CardDescription>
                Minimum bid: ₦{minBid.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isActive ? (
                <form onSubmit={handleBid} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bidAmount">Your Bid (₦)</Label>
                    <Input
                      id="bidAmount"
                      type="number"
                      placeholder={minBid.toString()}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={minBid}
                      step={auction.min_bid_increment}
                      disabled={isLoading}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Quick bid</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickBidAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setBidAmount(amount.toString())}
                          disabled={isLoading}
                        >
                          ₦{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || !bidAmount}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Bid...
                      </>
                    ) : (
                      <>
                        <Gavel className="mr-2 h-4 w-4" />
                        Place Bid
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By bidding, you agree to purchase if you win
                  </p>
                </form>
              ) : (
                <div className="text-center py-6">
                  <Gavel className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {auction.status === "upcoming"
                      ? "Auction hasn't started yet"
                      : "This auction has ended"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
