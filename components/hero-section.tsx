import Link from "next/link"
import Image from "next/image"

const cities = ["Vancouver", "Edmonton", "Toronto", "Montreal", "Ottawa"]

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/timi-concert.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Canada Tour 2026
        </p>

        <h1 className="mt-6 font-serif text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl lg:text-8xl text-balance">
          Canada,
          <br />
          Wish Me Well.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg text-pretty">
          A tour about love, family, and stories that matter. Join Timi Dakolo
          as he travels across Canada sharing music, letters, and unforgettable
          moments.
        </p>

        {/* City ticker */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {cities.map((city, i) => (
            <span key={city} className="flex items-center gap-3">
              <span className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60">
                {city}
              </span>
              {i < cities.length - 1 && (
                <span className="h-1 w-1 rounded-full bg-accent" />
              )}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/#tour-dates"
            className="rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90"
          >
            Buy Tickets
          </Link>
          <Link
            href="/send-a-wish"
            className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-8 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
          >
            Send a Wish
          </Link>
          <Link
            href="/dinner"
            className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-8 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
          >
            Invite Timi for Dinner
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-primary-foreground/40">
              Scroll
            </span>
            <div className="h-10 w-[1px] bg-primary-foreground/20" />
          </div>
        </div>
      </div>
    </section>
  )
}
