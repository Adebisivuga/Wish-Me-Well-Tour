import { MapPin, Calendar, Ticket } from "lucide-react"

const tourDates = [
  {
    city: "Montreal",
    date: "May 17, 2025",
    venue: "Theatre Maisonneuve",
    vip: true,
    ticketUrl: "#",
  },
  {
    city: "Toronto",
    date: "May 24, 2025",
    venue: "York Theatre",
    vip: true,
    ticketUrl: "#",
  },
  {
    city: "Edmonton",
    date: "May 31, 2025",
    venue: "Winspear Centre",
    vip: true,
    ticketUrl: "#",
  },
  {
    city: "Vancouver",
    date: "June 7, 2025",
    venue: "To Be Announced",
    vip: false,
    ticketUrl: "#",
  },
  {
    city: "Ottawa",
    date: "June 14, 2025",
    venue: "National Arts Centre",
    vip: true,
    ticketUrl: "#",
  },
]

export function TourDatesSection() {
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

        <div className="mt-16 flex flex-col gap-4">
          {tourDates.map((show) => (
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
                <a
                  href={show.ticketUrl}
                  className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90"
                >
                  <Ticket className="h-4 w-4" />
                  Get Tickets
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
