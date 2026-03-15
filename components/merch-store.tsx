"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingBag, Tag, MapPin } from "lucide-react"

// Products from Timi Dakolo's official merch - prices converted to CAD
// Online prices are discounted, venue prices are at full retail
const products = [
  {
    id: 1,
    name: "Omo Ope Tee",
    onlinePrice: 30,
    venuePrice: 40,
    image: "/images/merch-tshirt.jpg",
    description:
      "Classic 'Omo Ope' t-shirt. Premium cotton with bold design. Unisex fit.",
    badge: "Best Seller",
    category: "tee",
  },
  {
    id: 2,
    name: "People Wey Love Us Hoodie",
    onlinePrice: 55,
    venuePrice: 70,
    image: "/images/merch-hoodie.jpg",
    description:
      "Cozy hoodie featuring the iconic 'People Wey Love Us' design. Perfect for cool Canadian nights.",
    badge: null,
    category: "hoodie",
  },
  {
    id: 3,
    name: "Premium Enjoyment Hoodie",
    onlinePrice: 55,
    venuePrice: 70,
    image: "/images/merch-hoodie.jpg",
    description:
      "Premium quality hoodie with 'Enjoyment' theme. Soft fleece interior.",
    badge: "Popular",
    category: "hoodie",
  },
  {
    id: 4,
    name: "Omo Ope Hoodie",
    onlinePrice: 55,
    venuePrice: 70,
    image: "/images/merch-hoodie.jpg",
    description:
      "The classic 'Omo Ope' design on a premium hoodie. A must-have for true fans.",
    badge: null,
    category: "hoodie",
  },
  {
    id: 5,
    name: "Yard People Hoodie",
    onlinePrice: 55,
    venuePrice: 70,
    image: "/images/merch-hoodie.jpg",
    description:
      "Celebrate with the 'Yard People' hoodie. Represent the movement in style.",
    badge: "New",
    category: "hoodie",
  },
  {
    id: 6,
    name: "TCL Singlet",
    onlinePrice: 25,
    venuePrice: 35,
    image: "/images/merch-tshirt.jpg",
    description:
      "Lightweight singlet perfect for summer. TCL logo print. Breathable fabric.",
    badge: null,
    category: "singlet",
  },
  {
    id: 7,
    name: "Tour Poster (Signed)",
    onlinePrice: 35,
    venuePrice: 45,
    image: "/images/merch-poster.jpg",
    description:
      "Limited edition tour poster featuring all five Canadian cities. Hand-signed by Timi.",
    badge: "Limited",
    category: "poster",
  },
  {
    id: 8,
    name: "Signed Album",
    onlinePrice: 40,
    venuePrice: 50,
    image: "/images/merch-album.jpg",
    description:
      "Get your copy of the latest album, personally signed by Timi Dakolo.",
    badge: "Exclusive",
    category: "album",
  },
]

const vipPackage = {
  name: "VIP Love Letter Package",
  onlinePrice: 20,
  venuePrice: 25,
  description:
    "Guarantee your letter is read privately at the Meet & Greet. Includes a personalized response from Timi and a signed card.",
}

export function MerchStore() {
  const [pricingMode, setPricingMode] = useState<"online" | "venue">("online")

  const formatPrice = (onlinePrice: number, venuePrice: number) => {
    const price = pricingMode === "online" ? onlinePrice : venuePrice
    return `$${price} CAD`
  }

  const getSavings = (onlinePrice: number, venuePrice: number) => {
    if (pricingMode === "online") {
      return venuePrice - onlinePrice
    }
    return 0
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-foreground py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Official Store
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-6xl text-balance">
            Merch Store
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70">
            Take a piece of the tour home with you. Every purchase supports the
            Wish Me Well movement.
          </p>

          {/* Pricing Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-background/10 p-1">
            <button
              onClick={() => setPricingMode("online")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                pricingMode === "online"
                  ? "bg-primary text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              <Tag className="h-4 w-4" />
              Online Prices
            </button>
            <button
              onClick={() => setPricingMode("venue")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                pricingMode === "venue"
                  ? "bg-primary text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Venue Prices
            </button>
          </div>

          {pricingMode === "online" && (
            <p className="mt-4 text-sm text-accent font-medium">
              Save up to $15 when you order online!
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const savings = getSavings(product.onlinePrice, product.venuePrice)
              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {product.badge}
                      </span>
                    )}
                    {pricingMode === "online" && savings > 0 && (
                      <span className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        Save ${savings}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-lg font-bold text-card-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(product.onlinePrice, product.venuePrice)}
                        </span>
                        {pricingMode === "online" && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.venuePrice} at venue
                          </span>
                        )}
                      </div>
                      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* VIP Love Letter Package */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-border bg-card p-8 text-center md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Special Experience
            </p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-card-foreground md:text-4xl">
              {vipPackage.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {vipPackage.description}
            </p>
            <div className="mt-6">
              <p className="font-serif text-3xl font-bold text-primary">
                {formatPrice(vipPackage.onlinePrice, vipPackage.venuePrice)}
              </p>
              {pricingMode === "online" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="line-through">${vipPackage.venuePrice} CAD</span>
                  <span className="ml-2 text-accent font-medium">
                    Save ${vipPackage.venuePrice - vipPackage.onlinePrice}!
                  </span>
                </p>
              )}
            </div>
            <button className="mt-8 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Purchase Love Letter Package
            </button>
          </div>
        </div>
      </section>

      {/* Personalized shoutout */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Personalized Shoutout Video
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Request a personalized video message from Timi Dakolo for a birthday,
            anniversary, graduation, or just because. A keepsake your loved one
            will treasure forever.
          </p>
          <div className="mt-6">
            <p className="font-serif text-2xl font-bold text-primary">
              {pricingMode === "online" ? "$50 CAD" : "$65 CAD"}
            </p>
            {pricingMode === "online" && (
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="line-through">$65 CAD</span>
                <span className="ml-2 text-accent font-medium">Save $15!</span>
              </p>
            )}
          </div>
          <button className="mt-6 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Request a Shoutout
          </button>
        </div>
      </section>

      {/* Pricing Info Banner */}
      <section className="bg-muted py-8">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Why different prices?</strong>{" "}
            Online orders save you money because we can ship directly. Venue prices
            include handling and on-site availability. Order online before the show
            and pick up at will-call for the best deal!
          </p>
        </div>
      </section>
    </div>
  )
}
