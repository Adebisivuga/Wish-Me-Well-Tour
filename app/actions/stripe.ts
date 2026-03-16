"use server"

import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getWishProductById, TICKET_ADDON } from "@/lib/wish-products"
import { createClient } from "@/lib/supabase/server"

export interface WishCheckoutData {
  productId: string
  includeTicket: boolean
  senderName: string
  senderEmail: string
  recipientName: string
  message: string
  selectedCity: string
  socialHandle?: string
}

export async function startWishCheckoutSession(data: WishCheckoutData) {
  const product = getWishProductById(data.productId)
  if (!product) {
    throw new Error(`Product with id "${data.productId}" not found`)
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || "https://wishmewell.ca"

  // Build line items
  const lineItems: any[] = [
    {
      price_data: {
        currency: "cad",
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.priceInCents,
      },
      quantity: 1,
    },
  ]

  // Add ticket addon if selected
  if (data.includeTicket) {
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: TICKET_ADDON.name,
          description: TICKET_ADDON.description,
        },
        unit_amount: TICKET_ADDON.priceInCents,
      },
      quantity: 1,
    })
  }

  // Create pending letter record in database
  const supabase = await createClient()
  const { data: letter, error: letterError } = await supabase
    .from("wish_letters")
    .insert({
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      recipient_name: data.recipientName,
      message: data.message,
      package_tier: product.tier,
      amount_paid: lineItems.reduce((sum, item) => sum + item.price_data.unit_amount, 0),
      selected_city: data.selectedCity,
      include_ticket: data.includeTicket,
      social_handle: data.socialHandle || null,
      status: "draft",
      payment_status: "pending",
    })
    .select()
    .single()

  if (letterError) {
    console.error("Error creating letter:", letterError)
    throw new Error("Failed to create letter record")
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    metadata: {
      letter_id: letter.id,
      product_id: data.productId,
      include_ticket: data.includeTicket.toString(),
      recipient_name: data.recipientName,
      sender_email: data.senderEmail,
    },
    customer_email: data.senderEmail,
  })

  return {
    clientSecret: session.client_secret,
    letterId: letter.id,
  }
}
