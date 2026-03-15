import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Webhook secret should be set in Supabase and matched here
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  record: any
  old_record?: any
  schema: string
}

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization")
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload: WebhookPayload = await request.json()
    const { type, table, record } = payload

    // Handle different webhook events
    switch (table) {
      case "wish_me_well_letters":
        await handleLetterWebhook(type, record)
        break
      case "auction_bids":
        await handleBidWebhook(type, record)
        break
      case "tickets":
        await handleTicketWebhook(type, record, payload.old_record)
        break
      default:
        console.log(`Unhandled webhook for table: ${table}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleLetterWebhook(type: string, record: any) {
  if (type === "INSERT") {
    // New letter submitted - notify admins
    await sendNotification({
      type: "new_letter",
      data: {
        letterId: record.id,
        senderName: record.sender_name,
        packageTier: record.package_tier,
        amount: record.amount_paid,
      },
    })
  } else if (type === "UPDATE" && record.status === "approved") {
    // Letter approved - notify user
    await sendNotification({
      type: "letter_approved",
      data: {
        letterId: record.id,
        userId: record.user_id,
      },
    })
  }
}

async function handleBidWebhook(type: string, record: any) {
  if (type === "INSERT") {
    const supabase = createAdminClient()
    
    // Get the auction and previous highest bidder
    const { data: auction } = await supabase
      .from("auctions")
      .select("*")
      .eq("id", record.auction_id)
      .single()

    if (!auction) return

    // Get the previous bid (outbid user)
    const { data: previousBids } = await supabase
      .from("auction_bids")
      .select("*")
      .eq("auction_id", record.auction_id)
      .neq("id", record.id)
      .order("amount", { ascending: false })
      .limit(1)

    const previousBid = previousBids?.[0]

    if (previousBid && previousBid.user_id !== record.user_id) {
      // Notify the outbid user
      await sendNotification({
        type: "outbid",
        data: {
          auctionId: record.auction_id,
          auctionTitle: auction.title,
          userId: previousBid.user_id,
          newBidAmount: record.amount,
          previousBidAmount: previousBid.amount,
        },
      })
    }
  }
}

async function handleTicketWebhook(type: string, record: any, oldRecord?: any) {
  if (type === "UPDATE") {
    // Check if transfer was initiated
    if (record.transfer_token && !oldRecord?.transfer_token) {
      await sendNotification({
        type: "ticket_transfer_initiated",
        data: {
          ticketId: record.id,
          transferToken: record.transfer_token,
          expiresAt: record.transfer_expires_at,
        },
      })
    }

    // Check if ticket was claimed (transferred to new owner)
    if (record.user_id !== oldRecord?.user_id && !record.transfer_token) {
      await sendNotification({
        type: "ticket_claimed",
        data: {
          ticketId: record.id,
          newOwnerId: record.user_id,
          previousOwnerId: oldRecord?.user_id,
        },
      })
    }
  }
}

interface NotificationPayload {
  type: string
  data: any
}

async function sendNotification(payload: NotificationPayload) {
  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wishmewell.tour"
  
  console.log("Notification triggered:", payload.type, payload.data)

  // If RESEND_API_KEY is not set, log and return
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set - email notifications disabled")
    return { success: true, type: payload.type, sent: false }
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    switch (payload.type) {
      case "new_letter": {
        // Notify admins of new letter submission
        const { data: admins } = await supabase
          .from("profiles")
          .select("email")
          .in("role", ["admin", "manager"])

        const adminEmails = admins?.map(a => a.email).filter(Boolean) || []
        
        if (adminEmails.length > 0) {
          await resend.emails.send({
            from: "Wish Me Well Tour <noreply@wishmewell.tour>",
            to: adminEmails,
            subject: "New Letter Submitted - Review Required",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8B5E34;">New Letter Requires Review</h2>
                <p>A new Tier ${payload.data.packageTier} letter has been submitted by ${payload.data.senderName}.</p>
                <p><strong>Amount paid:</strong> ₦${payload.data.amount.toLocaleString()}</p>
                <a href="${appUrl}/admin/letters/${payload.data.letterId}" 
                   style="display: inline-block; background: #8B5E34; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                  Review Now
                </a>
              </div>
            `,
          })
        }
        break
      }

      case "letter_approved": {
        // Notify user their letter was approved
        const { data: user } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", payload.data.userId)
          .single()

        if (user?.email) {
          await resend.emails.send({
            from: "Wish Me Well Tour <noreply@wishmewell.tour>",
            to: user.email,
            subject: "Your Letter Has Been Approved!",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8B5E34;">Great News, ${user.full_name || "Fan"}!</h2>
                <p>Your wish letter to Timi Dakolo has been approved and will be delivered.</p>
                <p>Thank you for being part of the Wish Me Well Tour!</p>
                <a href="${appUrl}/dashboard/letters" 
                   style="display: inline-block; background: #8B5E34; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                  View Your Letters
                </a>
              </div>
            `,
          })
        }
        break
      }

      case "outbid": {
        // Notify user they were outbid
        const { data: user } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", payload.data.userId)
          .single()

        if (user?.email) {
          await resend.emails.send({
            from: "Wish Me Well Tour <noreply@wishmewell.tour>",
            to: user.email,
            subject: `You've Been Outbid on "${payload.data.auctionTitle}"`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d97706;">You've Been Outbid!</h2>
                <p>Hi ${user.full_name || "there"},</p>
                <p>Someone placed a higher bid on <strong>"${payload.data.auctionTitle}"</strong>.</p>
                <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 0;"><strong>New highest bid:</strong> ₦${payload.data.newBidAmount.toLocaleString()}</p>
                  <p style="margin: 8px 0 0 0;"><strong>Your previous bid:</strong> ₦${payload.data.previousBidAmount.toLocaleString()}</p>
                </div>
                <p>Don't miss out on this exclusive experience with Timi Dakolo!</p>
                <a href="${appUrl}/dashboard/auctions/${payload.data.auctionId}" 
                   style="display: inline-block; background: #8B5E34; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                  Place a New Bid
                </a>
              </div>
            `,
          })
        }
        break
      }

      case "ticket_transfer_initiated": {
        // This would need the recipient email passed in the payload
        // For now, log the event
        console.log("Ticket transfer initiated:", payload.data)
        break
      }

      case "ticket_claimed": {
        // Notify the new owner
        const { data: newOwner } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", payload.data.newOwnerId)
          .single()

        // Get ticket details
        const { data: ticket } = await supabase
          .from("tickets")
          .select("*, tour_events(name, city, event_date)")
          .eq("id", payload.data.ticketId)
          .single()

        if (newOwner?.email && ticket) {
          await resend.emails.send({
            from: "Wish Me Well Tour <noreply@wishmewell.tour>",
            to: newOwner.email,
            subject: "Ticket Successfully Claimed!",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Ticket Claimed Successfully!</h2>
                <p>Hi ${newOwner.full_name || "there"},</p>
                <p>You've successfully claimed your ticket for:</p>
                <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 0; font-weight: bold;">${ticket.tour_events?.name}</p>
                  <p style="margin: 8px 0 0 0;">${ticket.tour_events?.city} - ${new Date(ticket.tour_events?.event_date).toLocaleDateString()}</p>
                </div>
                <a href="${appUrl}/dashboard/tickets" 
                   style="display: inline-block; background: #8B5E34; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                  View Your Tickets
                </a>
              </div>
            `,
          })
        }
        break
      }
    }

    return { success: true, type: payload.type, sent: true }
  } catch (error) {
    console.error("Email notification error:", error)
    return { success: false, type: payload.type, error }
  }
}
