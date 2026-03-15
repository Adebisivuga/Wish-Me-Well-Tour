"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Ticket, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface TourEvent {
  id: string
  city: string
  venue: string
  event_date: string
  event_time: string
  status: string
}

// Fallback static data in case database isn't set up yet
const fallbackDates = [
  { city: "Vancouver", date: "May 31, 2026", venue: "York Theatre, Vancouver", vip: true },
  { city: "Edmonton", date: "TBA", venue: "To Be Announced", vip: true },
  { city: "Toronto", date: "TBA", venue: "To Be Announced", vip: true },
  { city: "Montreal", date: "TBA", venue: "To Be Announced", vip: true },
  { city: "Ottawa", date: "TBA", venue: "To Be Announced", vip: true },
]

export function TourDatesSection() {
  const [events, setEvents] = useState<TourEvent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("tour_events")
        .select("*")
        .order("event_date", { ascending: true })

      if (data && data.length > 0) {
        setEvents(data)
      }
      setLoading(false)
    }
    loadEvents()
  }, [supabase])
  return (
    <section id="tour-dates" className="bg-foreground py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            On the Road
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-5xl text-balance">
            Tour Dates
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-primary-foreground/60">
            Five cities. Five nights of music, letters, and unforgettable
            connection.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : events.length > 0 ? (
          <div className="mt-16 flex flex-col gap-4">
            {events.map((event) => {
              const eventDate = new Date(event.event_date)
              const formattedDate = eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })

              return (
                <div
                  key={event.id}
                  className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 transition-all hover:bg-primary-foreground/10 md:flex-row md:items-center"
                >
                  <div className="flex flex-col gap-1 md:min-w-[160px]">
                    <div className="flex items-center gap-2 text-accent">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="font-serif text-2xl font-bold text-primary-foreground">
                      {event.city}
                    </h3>
                    <div className="flex items-center gap-2 text-primary-foreground/60">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-sm">{event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                      VIP Meet & Greet
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90"
                    >
                      <Ticket className="h-4 w-4" />
                      Get Tickets
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-16 flex flex-col gap-4">
            {fallbackDates.map((show) => (
              <div
                key={show.city}
                className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 transition-all hover:bg-primary-foreground/10 md:flex-row md:items-center"
              >
                <div className="flex flex-col gap-1 md:min-w-[160px]">
                  <div className="flex items-center gap-2 text-accent">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{show.date}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="font-serif text-2xl font-bold text-primary-foreground">
                    {show.city}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-sm">{show.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {show.vip && (
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                      VIP Meet & Greet
                    </span>
                  )}
                  <span className="flex items-center gap-2 rounded-lg bg-accent/50 px-6 py-2.5 text-sm font-semibold text-accent-foreground cursor-not-allowed">
                    <Ticket className="h-4 w-4" />
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
