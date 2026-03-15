import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const POPCORN_EXTENSION_MS = 2 * 60 * 1000 // 2 minutes

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to place a bid" },
        { status: 401 }
      )
    }

    const { auctionId, amount } = await request.json()

    if (!auctionId || !amount) {
      return NextResponse.json(
        { error: "Auction ID and amount are required" },
        { status: 400 }
      )
    }

    // Get current auction state
    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .select("*")
      .eq("id", auctionId)
      .single()

    if (auctionError || !auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      )
    }

    // Validate auction is active
    if (auction.status !== "active") {
      return NextResponse.json(
        { error: "This auction is not active" },
        { status: 400 }
      )
    }

    // Check if auction has ended
    const now = new Date()
    const endTime = new Date(auction.end_time)
    if (now >= endTime) {
      return NextResponse.json(
        { error: "This auction has ended" },
        { status: 400 }
      )
    }

    // Validate bid amount
    const minBid = auction.current_price + auction.min_bid_increment
    if (amount < minBid) {
      return NextResponse.json(
        { error: `Minimum bid is ₦${minBid.toLocaleString()}` },
        { status: 400 }
      )
    }

    // Check if within last 2 minutes (Popcorn Bidding)
    const timeUntilEnd = endTime.getTime() - now.getTime()
    const isInPopcornZone = timeUntilEnd <= POPCORN_EXTENSION_MS

    // Start transaction
    // Insert the bid
    const { data: bid, error: bidError } = await supabase
      .from("auction_bids")
      .insert({
        auction_id: auctionId,
        user_id: user.id,
        amount,
      })
      .select()
      .single()

    if (bidError) {
      return NextResponse.json(
        { error: "Failed to place bid" },
        { status: 500 }
      )
    }

    // Update auction price and optionally extend time
    const updateData: any = {
      current_price: amount,
    }

    // If in popcorn zone, extend by 2 minutes
    if (isInPopcornZone) {
      const newEndTime = new Date(now.getTime() + POPCORN_EXTENSION_MS)
      updateData.end_time = newEndTime.toISOString()
    }

    const { error: updateError } = await supabase
      .from("auctions")
      .update(updateData)
      .eq("id", auctionId)

    if (updateError) {
      // Bid was placed but auction update failed - log this
      console.error("Failed to update auction after bid:", updateError)
    }

    return NextResponse.json({
      success: true,
      bid,
      extended: isInPopcornZone,
      message: isInPopcornZone 
        ? "Bid placed! Auction extended by 2 minutes." 
        : "Bid placed successfully!",
    })
  } catch (error) {
    console.error("Bid error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
