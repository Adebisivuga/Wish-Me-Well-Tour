import type { Metadata } from "next"
import Image from "next/image"
import { DinnerForm } from "@/components/dinner-form"

export const metadata: Metadata = {
  title: "Invite Timi for Dinner | Wish Me Well Canada Tour",
  description:
    "Share your family story and invite Timi Dakolo to your home for a meal. Selected families will be featured in a mini documentary.",
}

export default function DinnerPage() {
  return (
    <div className="pt-20">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-foreground py-20 md:py-28">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/dinner-scene.jpg"
            alt="Family dinner gathering"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            A Unique Experience
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-6xl text-balance">
            Invite Timi for Dinner
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70">
            In every tour city, Timi will join one local family for a
            home-cooked meal. Share your story, your culture, and your table.
            These moments will be captured as mini documentaries.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <DinnerForm />
        </div>
      </section>
    </div>
  )
}
