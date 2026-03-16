export type UserRole = "fan" | "admin" | "manager"

export type TicketStatus = "valid" | "used" | "transferred" | "cancelled"
export type TicketTier = "vip" | "regular" | "vvip"

export type LetterStatus = "draft" | "pending" | "printed" | "delivered" | "shared"
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded"
export type LetterPackageTier = 1 | 2 | 3

export type AuctionStatus = "upcoming" | "active" | "ended" | "cancelled"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface TourEvent {
  id: string
  name: string
  venue: string
  city: string
  event_date: string
  doors_open: string | null
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  user_id: string
  event_id: string
  ticket_tier: TicketTier
  ticket_number: string
  qr_code: string
  status: TicketStatus
  price_paid: number
  purchased_at: string
  transfer_token: string | null
  transfer_expires_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  event?: TourEvent
  user?: Profile
}

export interface WishMeWellLetter {
  id: string
  user_id: string
  event_id: string | null
  package_tier: LetterPackageTier
  message: string
  sender_name: string
  sender_email: string
  sender_instagram: string | null
  recipient_name: string
  recipient_email: string | null
  recipient_instagram: string | null
  is_anonymous: boolean
  is_public: boolean
  status: LetterStatus
  admin_notes: string | null
  amount_paid: number
  submitted_at: string
  created_at: string
  updated_at: string
  // Joined fields
  event?: TourEvent
  user?: Profile
  tour_events?: TourEvent
}

export interface Auction {
  id: string
  event_id: string
  title: string
  description: string | null
  image_url: string | null
  starting_price: number
  current_price: number
  min_bid_increment: number
  start_time: string
  end_time: string
  original_end_time: string
  status: AuctionStatus
  winner_id: string | null
  created_at: string
  updated_at: string
  // Joined fields
  event?: TourEvent
  winner?: Profile
  bids?: AuctionBid[]
}

export interface AuctionBid {
  id: string
  auction_id: string
  user_id: string
  amount: number
  created_at: string
  // Joined fields
  user?: Profile
  auction?: Auction
}

// Package tier details - Prices in CAD
export const LETTER_PACKAGES = {
  1: {
    name: "Soulful Signature",
    description: "Printed letter signed by Timi, delivered during Meet & Greet",
    price: 45,
    features: [
      "Handwritten-style printed letter",
      "Personally signed by Timi Dakolo",
      "Delivered during Meet & Greet",
      "Digital confirmation receipt",
    ],
  },
  2: {
    name: "The Stage Whisper",
    description: "Includes Tier 1 + Timi mentions the loved one's name during performance",
    price: 120,
    features: [
      "Everything in Soulful Signature",
      "Name mentioned on stage by Timi",
      "Special dedication during performance",
      "Video clip of the moment",
    ],
  },
  3: {
    name: "The Global Echo",
    description: "Includes Tier 1 & 2 + Timi posts the letter on his social media",
    price: 250,
    popular: true,
    features: [
      "Everything in Stage Whisper",
      "Letter posted on Timi's social media",
      "Tagged in the post",
      "Permanent feature on Wish Wall",
      "Exclusive merchandise bundle",
    ],
  },
} as const

// Concert ticket add-on price in CAD
export const TICKET_ADDON_PRICE = 85

// Currency
export const CURRENCY = "CAD"

export const TICKET_TIERS = {
  regular: {
    name: "Regular",
    description: "General admission",
    color: "bg-muted",
  },
  vip: {
    name: "VIP",
    description: "Premium seating with perks",
    color: "bg-primary/20",
  },
  vvip: {
    name: "VVIP",
    description: "Ultimate experience",
    color: "bg-accent/20",
  },
} as const
