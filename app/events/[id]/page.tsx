"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TICKET_TIERS } from "@/lib/types/database"
// Using inline type since the DB schema differs from lib types
import { Calendar, MapPin, Clock, Users, Check, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DBTourEvent {
  id: string
  city: string
  venue: string
  event_date: string
  event_time: string
  capacity: number
  tickets_sold: number
  status: string
  description: string | null
}

interface TicketPricing {
  tier: string
  name: string
  description: string
  price: number
  available: number
  features: string[]
}

const TICKET_PRICING: TicketPricing[] = [
  {
    tier: "regular",
    name: "Regular",
    description: "General admission",
    price: 25000,
    available: 100,
    features: ["General admission seating", "Access to main event"],
  },
  {
    tier: "vip",
    name: "VIP",
    description: "Premium seating with perks",
    price: 75000,
    available: 50,
    features: [
      "Premium seating area",
      "Complimentary drinks",
      "Early entry access",
      "Exclusive VIP lounge",
    ],
  },
  {
    tier: "vvip",
    name: "VVIP",
    description: "Ultimate experience",
    price: 150000,
    available: 20,
    features: [
      "Front row seating",
      "Meet & Greet with Timi",
      "Signed merchandise",
      "Backstage tour",
      "Professional photo opportunity",
      "Complimentary dinner",
    ],
  },
]

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<DBTourEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      // Check user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ? { id: user.id } : null)

      // Load event
      const { data } = await supabase
        .from("tour_events")
        .select("*")
        .eq("id", params.id)
        .single()

      setEvent(data)
      setLoading(false)
    }
    loadData()
  }, [params.id, supabase])

  const handlePurchase = async () => {
    if (!selectedTier || !user) {
      if (!user) {
        router.push(`/auth/login?redirect=/events/${params.id}`)
        return
      }
      return
    }

    setPurchasing(true)
    try {
      const response = await fetch("/api/tickets/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: params.id,
          ticketTier: selectedTier,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to purchase ticket")
      }

      router.push(`/dashboard/tickets?purchased=${data.ticketId}`)
    } catch (error) {
      console.error("Purchase error:", error)
      alert(error instanceof Error ? error.message : "Failed to purchase ticket")
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button asChild>
            <Link href="/#tour-dates">View All Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.event_date)
  const selectedPricing = TICKET_PRICING.find(p => p.tier === selectedTier)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/#tour-dates" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tour Dates
        </Link>

        {/* Event Header */}
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 -mr-32 -mt-32" />
          <div className="relative p-6 md:p-8">
            <Badge className="mb-4">{event.status === "upcoming" ? "Upcoming" : event.status}</Badge>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Wish Me Well Tour - {event.city}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {event.event_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.event_time}</span>
                </div>
              )}
            </div>
            {event.description && (
              <p className="mt-4 text-muted-foreground max-w-2xl">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {/* Ticket Tiers */}
        <h2 className="text-2xl font-serif font-bold mb-6">Select Your Ticket</h2>
        
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {TICKET_PRICING.map((tier) => (
            <Card 
              key={tier.tier}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedTier === tier.tier 
                  ? "ring-2 ring-primary border-primary" 
                  : "hover:border-primary/50"
              } ${tier.tier === "vip" ? "md:scale-105 md:z-10" : ""}`}
              onClick={() => setSelectedTier(tier.tier)}
            >
              {tier.tier === "vip" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  {selectedTier === tier.tier && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  <span className="text-base font-normal text-muted-foreground">NGN </span>
                  {tier.price.toLocaleString()}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{tier.available} tickets left</span>
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Section */}
        <Card className="sticky bottom-4 md:relative md:bottom-0">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6">
            <div>
              {selectedPricing ? (
                <>
                  <p className="text-sm text-muted-foreground">Selected ticket</p>
                  <p className="font-semibold">
                    {selectedPricing.name} - NGN {selectedPricing.price.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Select a ticket tier above</p>
              )}
            </div>
            
            <Button 
              size="lg"
              onClick={handlePurchase}
              disabled={!selectedTier || purchasing}
              className="w-full md:w-auto"
            >
              {purchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : user ? (
                "Purchase Ticket"
              ) : (
                "Sign in to Purchase"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
