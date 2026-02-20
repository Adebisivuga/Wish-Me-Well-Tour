import type { Metadata } from "next"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Merch Store | Wish Me Well Canada Tour",
  description:
    "Official Wish Me Well Canada Tour merchandise. Hoodies, signed albums, tour posters, and personalized shoutout videos.",
}

const products = [
  {
    name: "Wish Me Well Hoodie",
    price: "$65",
    image: "/images/merch-hoodie.jpg",
    description:
      "Premium black hoodie with gold 'Wish Me Well' script. Unisex fit.",
    badge: "Best Seller",
  },
  {
    name: "Tour Poster (Signed)",
    price: "$35",
    image: "/images/merch-poster.jpg",
    description:
      "Limited edition tour poster featuring all five Canadian cities. Hand-signed by Timi.",
    badge: "Limited",
  },
  {
    name: "Signed Album",
    price: "$45",
    image: "/images/merch-album.jpg",
    description:
      "Get your copy of the latest album, personally signed by Timi Dakolo.",
    badge: null,
  },
  {
    name: "Wish Me Well T-Shirt",
    price: "$40",
    image: "/images/merch-tshirt.jpg",
    description:
      "Classic white tee with elegant 'Wish Me Well' design. 100% cotton.",
    badge: "New",
  },
]

const vipPackage = {
  name: "VIP Love Letter Package",
  price: "$20",
  description:
    "Guarantee your letter is read privately at the Meet & Greet. Includes a personalized response from Timi and a signed card.",
}

export default function MerchPage() {
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
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.name}
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
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-lg font-bold text-card-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      {product.price}
                    </span>
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <p className="mt-6 font-serif text-3xl font-bold text-primary">
              {vipPackage.price}
            </p>
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
          <p className="mt-6 font-serif text-2xl font-bold text-primary">
            $50
          </p>
          <button className="mt-6 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Request a Shoutout
          </button>
        </div>
      </section>
    </div>
  )
}
