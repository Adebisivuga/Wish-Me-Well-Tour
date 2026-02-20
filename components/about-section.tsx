import Image from "next/image"
import Link from "next/link"

export function AboutSection() {
  return (
    <section id="about" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/timi-portrait.jpg"
              alt="Timi Dakolo portrait"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              About the Tour
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl text-balance">
              Inspired by love, resilience, and appreciating the ones who matter
            </h2>
            <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
              <p>
                The Wish Me Well Tour is more than a concert. Inspired by the
                song that has become a prayer on the lips of millions, this tour
                is Timi Dakolo&apos;s way of bringing people together through
                music, storytelling, and shared humanity.
              </p>
              <p>
                At every stop, fans submit letters and messages that Timi reads
                live on stage &mdash; birthday wishes, love letters,
                appreciation notes for mothers, fathers, and partners. These are
                the moments that turn a concert into something deeply personal.
              </p>
              <p>
                The tour also features intimate meet-and-greet sessions and a
                one-of-a-kind dinner experience where Timi joins a local family
                for a home-cooked meal, captured as a mini documentary.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/send-a-wish"
                className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Send Your Message
              </Link>
              <Link
                href="/dinner"
                className="rounded-lg border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Host Timi for Dinner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
