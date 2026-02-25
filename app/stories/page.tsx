import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Quote } from "lucide-react"

export const metadata: Metadata = {
  title: "Stories from Canada | Wish Me Well Canada Tour",
  description:
    "Relive the magic through photos, video highlights, letters read, and fan testimonials from every city on the Wish Me Well Canada Tour.",
}

const cityStories = [
  {
    city: "Vancouver",
    date: "May 31, 2026",
    status: "upcoming" as const,
    testimonial: null,
    photos: [],
  },
  {
    city: "Edmonton",
    date: "TBA",
    status: "upcoming" as const,
    testimonial: null,
    photos: [],
  },
  {
    city: "Toronto",
    date: "TBA",
    status: "upcoming" as const,
    testimonial: null,
    photos: [],
  },
  {
    city: "Montreal",
    date: "TBA",
    status: "upcoming" as const,
    testimonial: null,
    photos: [],
  },
  {
    city: "Ottawa",
    date: "TBA",
    status: "upcoming" as const,
    testimonial: null,
    photos: [],
  },
]

const sampleTestimonials = [
  {
    name: "Adesola K.",
    city: "Toronto",
    quote:
      "When Timi read my letter to my mother on stage, I could not hold back the tears. She was right there in the audience. It was the most beautiful moment of my life.",
  },
  {
    name: "Marie-Claire D.",
    city: "Montreal",
    quote:
      "I have been to many concerts, but nothing compares to the warmth of this tour. It felt like family.",
  },
  {
    name: "Chukwuemeka A.",
    city: "Edmonton",
    quote:
      "Hosting Timi for dinner was a dream. He ate my wife's jollof rice and asked for seconds. That video is now our most precious family memory.",
  },
]

export default function StoriesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-20 md:py-28">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/timi-stage.jpg"
            alt="Timi Dakolo performing on stage"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            City by City
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-6xl text-balance">
            Stories from Canada
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70">
            After each show, we capture the magic. Photos, video highlights,
            letters read, and fan testimonials. The story grows city by city.
          </p>
        </div>
      </section>

      {/* City timeline */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-8">
            {cityStories.map((story) => (
              <div
                key={story.city}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-center md:gap-8"
              >
                <div className="flex items-center gap-3 md:min-w-[180px]">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-card-foreground">
                      {story.city}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {story.date}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  {story.status === "upcoming" ? (
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                        Upcoming
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Stories and photos will appear here after the show.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Content coming soon...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview testimonials */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              What Fans Are Saying
            </p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Voices from the tour
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              These are sample testimonials. Real stories will be featured here
              as the tour progresses.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {sampleTestimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-8"
              >
                <Quote className="h-8 w-8 text-primary/30" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-card-foreground italic">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Share your story
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Post your photos and experiences with the hashtag
          </p>
          <p className="mt-4 font-serif text-2xl font-bold text-primary">
            #WishMeWellCanada
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            The best posts will be featured on this page and on the Wish Me Well
            Wall at upcoming shows.
          </p>
        </div>
      </section>
    </div>
  )
}
