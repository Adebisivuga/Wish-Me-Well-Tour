"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

const sampleWishes = [
  { name: "Adesola", city: "Toronto", message: "Mummy, you are my everything. Thank you for never giving up on us." },
  { name: "Grace O.", city: "Vancouver", message: "Happy 50th birthday Dad! Your love is the greatest gift." },
  { name: "Chidi", city: "Montreal", message: "To my wife: 15 years of marriage and I fall more in love every day." },
  { name: "Blessing A.", city: "Ottawa", message: "Timi, your music got me through the darkest season. God bless you." },
  { name: "Kehinde", city: "Edmonton", message: "Mama, I made it to Canada because of your prayers. This one is for you." },
  { name: "Funmi T.", city: "Toronto", message: "To my children: everything I do, I do for you. Always." },
  { name: "David M.", city: "Vancouver", message: "Dear brother, even though we are oceans apart, my heart is always with you." },
  { name: "Nkem", city: "Montreal", message: "To all the mothers working two jobs and still smiling, we see you." },
]

export function WishWallSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId: number
    const speed = 0.5

    const animate = () => {
      el.scrollLeft += speed
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const allWishes = [...sampleWishes, ...sampleWishes]

  return (
    <section className="bg-background py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Live Wish Wall
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">
            Messages of love, scrolling live
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Real messages from fans across Canada. Yours could be next.
          </p>
        </div>
      </div>

      {/* Scrolling wall */}
      <div
        ref={scrollRef}
        className="mt-16 flex gap-6 overflow-hidden px-6"
        aria-label="Scrolling fan messages"
      >
        {allWishes.map((wish, i) => (
          <div
            key={`${wish.name}-${i}`}
            className="min-w-[300px] max-w-[300px] shrink-0 rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm leading-relaxed text-card-foreground italic">
              &ldquo;{wish.message}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {wish.name[0]}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {wish.name}
                </p>
                <p className="text-xs text-muted-foreground">{wish.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-12 text-center">
        <Link
          href="/send-a-wish"
          className="inline-flex rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add Your Wish to the Wall
        </Link>
      </div>
    </section>
  )
}
