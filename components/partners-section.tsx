import Image from "next/image"

const partners = [
  {
    name: "AfroVan Connect",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/afrovan-logo%20-z4SGHc8lWckrM3SHyDLdP4TPlZyG9w.jpg",
    description: "Transportation Partner",
  },
  {
    name: "The Cultch",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20Cultch%20Logo%20-JmlmsqQxGNotLOnWmY6Pn2stE9bb8w.png",
    description: "Venue Partner",
  },
  {
    name: "Lagos in Toronto",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lagos%20in%20Toronto%20%28logo%29-cq4GgonCFt2t1uwcT9nfnv54MOEpYY.png",
    description: "Community Partner",
  },
  {
    name: "Abedorc Media",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Abedorc%20Media%20%28logo%29-lHIDopsULttL3GU08PBvy1aMVAEhuU.jpeg",
    description: "Media Partner",
  },
  {
    name: "FreePass",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FreePass%20logo-Vw5z2M7cUjkaB7UHa7bZrHe7IN4vWs.png",
    description: "Ticketing Partner",
  },
  {
    name: "Adeba Connector",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adeba%20logo%20-6bAzEjJD1nm2O9VnYNbjZwLem4hTA1.jpeg",
    description: "Technology Partner",
  },
]

export function PartnersSection() {
  return (
    <section id="partners" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Our Partners
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Supported by Amazing Organizations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We are grateful to these incredible partners who support the Wish Me
            Well Tour with their services, resources, and influence across the
            country.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="mt-16 grid grid-cols-2 items-center gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center gap-3"
            >
              <div className="flex h-24 w-full items-center justify-center rounded-xl bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="relative h-16 w-full">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {partner.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
