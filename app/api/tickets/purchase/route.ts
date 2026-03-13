import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const TICKET_PRICING: Record<string, number> = {
  regular: 25000,
  vip: 75000,
  vvip: 150000,
}

function generateTicketNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "WMW-"
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateQRCode(ticketId: string, ticketNumber: string): string {
  // In production, this would generate an actual QR code
  // For now, we return a unique string that can be used to generate QR
  return `TICKET:${ticketId}:${ticketNumber}:${Date.now()}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, ticketTier } = body

    // Validate inputs
    if (!eventId || !ticketTier) {
      return NextResponse.json(
        { error: "Event ID and ticket tier are required" },
        { status: 400 }
      )
    }

    if (!TICKET_PRICING[ticketTier]) {
      return NextResponse.json(
        { error: "Invalid ticket tier" },
        { status: 400 }
      )
    }

    // Check if event exists and is upcoming
    const { data: event, error: eventError } = await supabase
      .from("tour_events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    if (event.status === "sold_out") {
      return NextResponse.json(
        { error: "This event is sold out" },
        { status: 400 }
      )
    }

    if (event.status === "cancelled") {
      return NextResponse.json(
        { error: "This event has been cancelled" },
        { status: 400 }
      )
    }

    // Check for existing ticket for this event
    const { data: existingTicket } = await supabase
      .from("tickets")
      .select("id")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .eq("status", "valid")
      .single()

    if (existingTicket) {
      return NextResponse.json(
        { error: "You already have a ticket for this event" },
        { status: 400 }
      )
    }

    // Generate ticket details
    const ticketId = uuidv4()
    const ticketNumber = generateTicketNumber()
    const qrCode = generateQRCode(ticketId, ticketNumber)
    const price = TICKET_PRICING[ticketTier]

    // Create ticket
    const { data: ticket, error: insertError } = await supabase
      .from("tickets")
      .insert({
        id: ticketId,
        user_id: user.id,
        event_id: eventId,
        ticket_tier: ticketTier,
        ticket_number: ticketNumber,
        qr_code: qrCode,
        status: "valid",
        price_paid: price,
        purchased_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating ticket:", insertError)
      return NextResponse.json(
        { error: "Failed to create ticket" },
        { status: 500 }
      )
    }

    // Update event tickets_sold count
    await supabase
      .from("tour_events")
      .update({ tickets_sold: (event.tickets_sold || 0) + 1 })
      .eq("id", eventId)

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      ticketNumber: ticket.ticket_number,
      message: "Ticket purchased successfully",
    })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
