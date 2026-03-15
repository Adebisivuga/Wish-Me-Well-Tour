import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { notFound } from "next/navigation"
import { AuctionBidding } from "@/components/auction/auction-bidding"

interface AuctionPageProps {
  params: Promise<{ id: string }>
}

export default async function AuctionPage({ params }: AuctionPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const profile = await getProfile()

  const { data: auction, error } = await supabase
    .from("auctions")
    .select("*, tour_events(*)")
    .eq("id", id)
    .single()

  if (error || !auction) {
    notFound()
  }

  // Get recent bids
  const { data: bids } = await supabase
    .from("auction_bids")
    .select("*, profiles(full_name)")
    .eq("auction_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <AuctionBidding
      auction={auction}
      initialBids={bids || []}
      userId={profile?.id || ""}
    />
  )
}
