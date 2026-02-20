import Link from "next/link"
import { Heart, Mail, UtensilsCrossed } from "lucide-react"

const features = [
  {
    icon: Mail,
    title: "Send a Wish",
    description:
      "Submit a birthday wish, love letter, or appreciation note. Selected messages will be read live on stage by Timi.",
    href: "/send-a-wish",
    cta: "Write Your Message",
  },
  {
    icon: UtensilsCrossed,
    title: "Invite Timi for Dinner",
    description:
      "Share your family story and invite Timi to your home for a meal. Selected families will be featured in a mini documentary.",
    href: "/dinner",
    cta: "Submit Your Invitation",
  },
  {
    icon: Heart,
    title: "Stories from Canada",
    description:
      "After each show, relive the magic through photos, video highlights, letters read, and fan testimonials from every city.",
    href: "/stories",
    cta: "View Stories",
  },
]

export function HighlightsSection() {
  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Be Part of the Story
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">
            More than a concert
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            The Wish Me Well Tour is built on community, connection, and the
            stories you bring.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 font-serif text-xl font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-6 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {feature.cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
