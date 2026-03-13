// Email service abstraction for sending notifications
// Currently stubbed out - integrate with Resend, SendGrid, etc.

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface EmailTemplateData {
  [key: string]: any
}

// Email templates
export const emailTemplates = {
  // Letter notifications
  letterSubmitted: (data: { letterUrl: string; packageTier: number; amount: number }) => ({
    subject: "New Letter Submitted - Review Required",
    html: `
      <h2>New Letter Requires Review</h2>
      <p>A new Tier ${data.packageTier} letter has been submitted.</p>
      <p>Amount paid: ₦${data.amount.toLocaleString()}</p>
      <p><a href="${data.letterUrl}" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Now</a></p>
    `,
  }),

  letterApproved: (data: { senderName: string }) => ({
    subject: "Your Wish Has Been Approved!",
    html: `
      <h2>Great News, ${data.senderName}!</h2>
      <p>Your wish letter to Timi Dakolo has been approved and will be delivered.</p>
      <p>Thank you for being part of the Wish Me Well Tour!</p>
    `,
  }),

  letterRejected: (data: { senderName: string; reason?: string }) => ({
    subject: "Update on Your Wish Letter",
    html: `
      <h2>Hello ${data.senderName},</h2>
      <p>Unfortunately, your wish letter could not be approved at this time.</p>
      ${data.reason ? `<p>Reason: ${data.reason}</p>` : ""}
      <p>Please contact support if you have any questions.</p>
    `,
  }),

  // Auction notifications
  outbid: (data: { auctionTitle: string; auctionUrl: string; newBid: number; yourBid: number }) => ({
    subject: `You've been outbid on "${data.auctionTitle}"`,
    html: `
      <h2>You've Been Outbid!</h2>
      <p>Someone placed a higher bid of <strong>₦${data.newBid.toLocaleString()}</strong> on "${data.auctionTitle}".</p>
      <p>Your previous bid: ₦${data.yourBid.toLocaleString()}</p>
      <p><a href="${data.auctionUrl}" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Place a New Bid</a></p>
    `,
  }),

  auctionWon: (data: { auctionTitle: string; finalBid: number; nextStepsUrl: string }) => ({
    subject: `Congratulations! You won "${data.auctionTitle}"`,
    html: `
      <h2>Congratulations!</h2>
      <p>You've won the auction for "${data.auctionTitle}" with a winning bid of <strong>₦${data.finalBid.toLocaleString()}</strong>!</p>
      <p><a href="${data.nextStepsUrl}" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Your Purchase</a></p>
    `,
  }),

  auctionEnding: (data: { auctionTitle: string; auctionUrl: string; endsIn: string }) => ({
    subject: `Auction ending soon: "${data.auctionTitle}"`,
    html: `
      <h2>Auction Ending Soon!</h2>
      <p>The auction for "${data.auctionTitle}" ends in ${data.endsIn}.</p>
      <p><a href="${data.auctionUrl}" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Check the Auction</a></p>
    `,
  }),

  // Ticket notifications
  ticketTransfer: (data: { eventName: string; claimUrl: string; expiresIn: string; senderName: string }) => ({
    subject: `${data.senderName} sent you a ticket to ${data.eventName}!`,
    html: `
      <h2>You've Received a Ticket!</h2>
      <p>${data.senderName} has sent you a ticket to <strong>${data.eventName}</strong>.</p>
      <p>Click the button below to claim your ticket. This link expires in ${data.expiresIn}.</p>
      <p><a href="${data.claimUrl}" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Claim Your Ticket</a></p>
    `,
  }),

  ticketClaimed: (data: { eventName: string; recipientName: string }) => ({
    subject: "Your ticket transfer was completed",
    html: `
      <h2>Transfer Complete</h2>
      <p>Your ticket to <strong>${data.eventName}</strong> has been successfully claimed by ${data.recipientName}.</p>
      <p>The ticket has been removed from your account.</p>
    `,
  }),
}

// Send email function (stub - implement with your email provider)
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html, text } = options

  // Check if email service is configured
  if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
    console.log("📧 Email would be sent (no email service configured):")
    console.log("  To:", to)
    console.log("  Subject:", subject)
    return { success: true }
  }

  try {
    // Implement with Resend
    if (process.env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Wish Me Well Tour <noreply@tour.example.com>",
          to,
          subject,
          html,
          text,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to send email")
      }

      return { success: true }
    }

    // Add more email providers here (SendGrid, AWS SES, etc.)

    return { success: true }
  } catch (error) {
    console.error("Email send error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

// Convenience functions for common notifications
export async function notifyOutbid(
  userEmail: string,
  auctionTitle: string,
  auctionId: string,
  newBid: number,
  yourBid: number
) {
  const template = emailTemplates.outbid({
    auctionTitle,
    auctionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/auctions/${auctionId}`,
    newBid,
    yourBid,
  })

  return sendEmail({
    to: userEmail,
    ...template,
  })
}

export async function notifyTicketTransfer(
  recipientEmail: string,
  eventName: string,
  transferToken: string,
  senderName: string
) {
  const template = emailTemplates.ticketTransfer({
    eventName,
    claimUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/claim?token=${transferToken}`,
    expiresIn: "48 hours",
    senderName,
  })

  return sendEmail({
    to: recipientEmail,
    ...template,
  })
}

export async function notifyNewLetter(
  adminEmail: string,
  letterId: string,
  packageTier: number,
  amount: number
) {
  const template = emailTemplates.letterSubmitted({
    letterUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/letters/${letterId}`,
    packageTier,
    amount,
  })

  return sendEmail({
    to: adminEmail,
    ...template,
  })
}
