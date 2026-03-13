import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to claim a ticket" },
        { status: 401 }
      )
    }

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Transfer token is required" },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // Find ticket by transfer token
    const { data: ticket, error: ticketError } = await adminClient
      .from("tickets")
      .select("*, tour_events(*)")
      .eq("transfer_token", token)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Invalid or expired transfer link" },
        { status: 404 }
      )
    }

    // Check if transfer has expired
    if (ticket.transfer_expires_at) {
      const expiryDate = new Date(ticket.transfer_expires_at)
      if (expiryDate < new Date()) {
        // Clear the expired transfer token
        await adminClient
          .from("tickets")
          .update({
            transfer_token: null,
            transfer_expires_at: null,
          })
          .eq("id", ticket.id)

        return NextResponse.json(
          { error: "This transfer link has expired" },
          { status: 400 }
        )
      }
    }

    // Can't claim your own ticket
    if (ticket.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot claim your own ticket" },
        { status: 400 }
      )
    }

    // Transfer the ticket to the new owner
    const { error: updateError } = await adminClient
      .from("tickets")
      .update({
        user_id: user.id,
        status: "valid",
        transfer_token: null,
        transfer_expires_at: null,
      })
      .eq("id", ticket.id)

    if (updateError) {
      console.error("Failed to claim ticket:", updateError)
      return NextResponse.json(
        { error: "Failed to claim ticket" },
        { status: 500 }
      )
    }

    // Update original ticket status to transferred (for record keeping)
    // Actually, we're transferring ownership, so the original owner loses the ticket

    return NextResponse.json({
      success: true,
      message: "Ticket claimed successfully!",
      ticket: {
        id: ticket.id,
        event: ticket.tour_events?.name,
        tier: ticket.ticket_tier,
      },
    })
  } catch (error) {
    console.error("Claim error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
