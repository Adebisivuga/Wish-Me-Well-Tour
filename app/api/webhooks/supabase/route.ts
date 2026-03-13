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
  // This is where you would integrate with an email service like:
  // - Resend
  // - SendGrid
  // - AWS SES
  // - Postmark
  
  console.log("📧 Notification triggered:", payload.type, payload.data)

  // Example implementation with Resend (uncomment when API key is set):
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  switch (payload.type) {
    case "new_letter":
      await resend.emails.send({
        from: "Wish Me Well Tour <noreply@wishmewell.tour>",
        to: "admin@wishmewell.tour",
        subject: "New Letter Submitted",
        html: `
          <h2>New Letter Requires Review</h2>
          <p>A new Tier ${payload.data.packageTier} letter has been submitted.</p>
          <p>Amount paid: ₦${payload.data.amount.toLocaleString()}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/letters/${payload.data.letterId}">Review Now</a></p>
        `,
      })
      break

    case "outbid":
      // Get user email from database first
      await resend.emails.send({
        from: "Wish Me Well Tour <noreply@wishmewell.tour>",
        to: userEmail,
        subject: `You've been outbid on "${payload.data.auctionTitle}"`,
        html: `
          <h2>You've Been Outbid!</h2>
          <p>Someone placed a higher bid of ₦${payload.data.newBidAmount.toLocaleString()} on "${payload.data.auctionTitle}".</p>
          <p>Your previous bid: ₦${payload.data.previousBidAmount.toLocaleString()}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/auctions/${payload.data.auctionId}">Place a New Bid</a></p>
        `,
      })
      break
  }
  */

  // For now, just log the notification
  // In production, replace with actual email sending
  return { success: true, type: payload.type }
}
