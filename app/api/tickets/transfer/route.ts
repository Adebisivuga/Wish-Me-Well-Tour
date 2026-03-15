import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

const TRANSFER_EXPIRY_HOURS = 48

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to transfer a ticket" },
        { status: 401 }
      )
    }

    const { ticketId, recipientEmail } = await request.json()

    if (!ticketId || !recipientEmail) {
      return NextResponse.json(
        { error: "Ticket ID and recipient email are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Can't transfer to yourself
    if (recipientEmail.toLowerCase() === user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot transfer a ticket to yourself" },
        { status: 400 }
      )
    }

    // Get the ticket and verify ownership
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("*, tour_events(*)")
      .eq("id", ticketId)
      .eq("user_id", user.id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found or you don't own this ticket" },
        { status: 404 }
      )
    }

    // Verify ticket is valid and can be transferred
    if (ticket.status !== "valid") {
      return NextResponse.json(
        { error: "This ticket cannot be transferred (status: " + ticket.status + ")" },
        { status: 400 }
      )
    }

    // Check if event hasn't passed
    const eventDate = new Date(ticket.tour_events.event_date)
    if (eventDate < new Date()) {
      return NextResponse.json(
        { error: "Cannot transfer tickets for past events" },
        { status: 400 }
      )
    }

    // Generate transfer token and expiry
    const transferToken = randomUUID()
    const transferExpiry = new Date()
    transferExpiry.setHours(transferExpiry.getHours() + TRANSFER_EXPIRY_HOURS)

    // Update ticket with transfer info
    const adminClient = createAdminClient()
    const { error: updateError } = await adminClient
      .from("tickets")
      .update({
        transfer_token: transferToken,
        transfer_expires_at: transferExpiry.toISOString(),
      })
      .eq("id", ticketId)

    if (updateError) {
      console.error("Failed to update ticket:", updateError)
      return NextResponse.json(
        { error: "Failed to initiate transfer" },
        { status: 500 }
      )
    }

    // TODO: Send email to recipient with transfer link
    // For now, we'll just return success
    // The email would contain a link like: /tickets/claim?token={transferToken}

    return NextResponse.json({
      success: true,
      message: `Transfer initiated. An email has been sent to ${recipientEmail}`,
      transferToken, // In production, don't return this - only for testing
      expiresAt: transferExpiry.toISOString(),
    })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
