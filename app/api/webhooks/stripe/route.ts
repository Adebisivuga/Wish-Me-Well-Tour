import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  const supabase = createAdminSupabaseClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status === "paid") {
        const letterId = session.metadata?.letter_id

        if (letterId) {
          // Update the letter status to pending (ready for processing)
          const { error } = await supabase
            .from("wish_letters")
            .update({
              payment_status: "paid",
              status: "pending",
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq("id", letterId)

          if (error) {
            console.error("Error updating letter:", error)
            return NextResponse.json(
              { error: "Failed to update letter" },
              { status: 500 }
            )
          }

          console.log(`Letter ${letterId} marked as paid`)
        }
      }
      break
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session
      const letterId = session.metadata?.letter_id

      if (letterId) {
        // Mark the letter as failed/expired
        await supabase
          .from("wish_letters")
          .update({
            payment_status: "failed",
            status: "draft",
          })
          .eq("id", letterId)
      }
      break
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string

      if (paymentIntentId) {
        // Find and update the letter by payment intent
        await supabase
          .from("wish_letters")
          .update({
            payment_status: "refunded",
          })
          .eq("stripe_payment_intent_id", paymentIntentId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
