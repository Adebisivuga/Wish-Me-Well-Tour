import type { Metadata } from "next"
import Image from "next/image"
import { WishForm } from "@/components/wish-form"

export const metadata: Metadata = {
  title: "Send a Wish | Wish Me Well Canada Tour",
  description:
    "Submit a birthday wish, love letter, or appreciation note. Selected messages will be read live on stage by Timi Dakolo.",
}

export default function SendAWishPage() {
  return (
    <div className="pt-20">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-foreground py-20 md:py-28">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/timi-red.jpg"
            alt="Timi Dakolo portrait"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Fan Shoutout Platform
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-6xl text-balance">
            Send a Wish
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70">
            Write a birthday wish, appreciation letter, or love message. Timi
            may read your message live on stage, at a meet & greet, or feature
            it on the website. This is your moment.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <WishForm />
        </div>
      </section>
    </div>
  )
}
