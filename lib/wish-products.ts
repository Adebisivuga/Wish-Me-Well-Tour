export interface WishProduct {
  id: string
  tier: number
  name: string
  description: string
  priceInCents: number
  features: string[]
  popular?: boolean
}

export interface WishAddon {
  id: string
  name: string
  description: string
  priceInCents: number
}

// Wish letter packages - prices in CAD cents
export const WISH_PRODUCTS: WishProduct[] = [
  {
    id: "soulful-signature",
    tier: 1,
    name: "Soulful Signature",
    description: "Printed letter signed by Timi, delivered during Meet & Greet",
    priceInCents: 4500, // $45 CAD
    features: [
      "Handwritten-style printed letter",
      "Personally signed by Timi Dakolo",
      "Delivered during Meet & Greet",
      "Digital confirmation receipt",
    ],
  },
  {
    id: "stage-whisper",
    tier: 2,
    name: "The Stage Whisper",
    description: "Includes Tier 1 + Timi mentions the loved one's name during performance",
    priceInCents: 12000, // $120 CAD
    features: [
      "Everything in Soulful Signature",
      "Name mentioned on stage by Timi",
      "Special dedication during performance",
      "Video clip of the moment",
    ],
  },
  {
    id: "global-echo",
    tier: 3,
    name: "The Global Echo",
    description: "Includes Tier 1 & 2 + Timi posts the letter on his social media",
    priceInCents: 25000, // $250 CAD
    popular: true,
    features: [
      "Everything in Stage Whisper",
      "Letter posted on Timi's social media",
      "Tagged in the post",
      "Permanent feature on Wish Wall",
      "Exclusive merchandise bundle",
    ],
  },
]

// Concert ticket add-on
export const TICKET_ADDON: WishAddon = {
  id: "concert-ticket",
  name: "Concert Ticket",
  description: "Add a ticket for the recipient to attend the show",
  priceInCents: 8500, // $85 CAD
}

export function getWishProductById(id: string): WishProduct | undefined {
  return WISH_PRODUCTS.find((p) => p.id === id)
}

export function calculateTotal(productId: string, includeTicket: boolean): number {
  const product = getWishProductById(productId)
  if (!product) return 0
  
  let total = product.priceInCents
  if (includeTicket) {
    total += TICKET_ADDON.priceInCents
  }
  return total
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)} CAD`
}
