import type { Metadata } from "next"
import Image from "next/image"
import { WishForm } from "@/components/wish-form"
import { Heart, Quote, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Send a Wish | Wish Me Well Canada Tour",
  description:
    "Submit a birthday wish, love letter, or appreciation note. Selected messages will be read live on stage by Timi Dakolo.",
}

export default function SendAWishPage() {
  return (
    <div className="pt-20">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-foreground py-24 md:py-32">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/timi-red.jpg"
            alt="Timi Dakolo portrait"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute left-10 top-20 hidden opacity-20 md:block">
          <Heart className="h-24 w-24 text-accent" />
        </div>
        <div className="absolute right-10 bottom-20 hidden opacity-20 md:block">
          <Sparkles className="h-20 w-20 text-accent" />
        </div>
        
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Heart className="h-8 w-8 text-accent" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Share Your Heart
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-6xl text-balance">
            Send a Wish Me Well Letter
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            Every love story, every moment of gratitude, every wish deserves to be heard. 
            Write a message that could be read live on stage, shared at a meet & greet, 
            or featured on the Wish Me Well Wall.
          </p>
          
          {/* Testimonial Quote */}
          <div className="mx-auto mt-10 max-w-lg rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
            <Quote className="mx-auto h-6 w-6 text-accent/60" />
            <p className="mt-3 font-serif text-sm italic text-primary-foreground/90">
              &ldquo;Music has the power to carry our deepest emotions. Let me be the voice 
              that delivers your heart&apos;s message.&rdquo;
            </p>
            <p className="mt-3 text-xs font-semibold text-accent">
              - Timi Dakolo
            </p>
          </div>
        </div>
      </section>

      {/* Why send a wish section */}
      <section className="bg-secondary/30 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">Express Love</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Share your deepest appreciation with someone special in your life
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">Create Magic</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Imagine Timi reading your message live on stage to thousands
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Quote className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">Be Remembered</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your words become part of the Wish Me Well tour legacy forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <WishForm />
        </div>
      </section>
    </div>
  )
}
