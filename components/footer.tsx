import Link from "next/link"

const tourCities = ["Montreal", "Toronto", "Edmonton", "Vancouver", "Ottawa"]

const quickLinks = [
  { href: "/#about", label: "About the Tour" },
  { href: "/#tour-dates", label: "Tour Dates" },
  { href: "/send-a-wish", label: "Send a Wish" },
  { href: "/dinner", label: "Invite Timi for Dinner" },
  { href: "/stories", label: "Stories from Canada" },
  { href: "/merch", label: "Merch Store" },
]

const socials = [
  { href: "https://instagram.com/timidakolo", label: "Instagram" },
  { href: "https://twitter.com/timaborisa", label: "Twitter" },
  { href: "https://youtube.com/@timidakolo", label: "YouTube" },
  { href: "https://open.spotify.com/artist/timidakolo", label: "Spotify" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-bold tracking-tight">
              Wish Me Well
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
              A tour about love, family, and stories that matter. Join Timi
              Dakolo across Canada.
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-primary-foreground/50">
              #WishMeWellCanada
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
              Quick Links
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Cities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
              Tour Cities
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {tourCities.map((city) => (
                <li key={city}>
                  <span className="text-sm text-primary-foreground/70">
                    {city}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
              Follow Timi
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {socials.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} Timi Dakolo. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Wish Me Well Canada Tour 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
