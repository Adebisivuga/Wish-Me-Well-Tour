import Image from "next/image"

const galleryImages = [
  {
    src: "/images/timi-studio.jpg",
    alt: "Timi Dakolo in the studio with microphone",
    span: "md:col-span-2 md:row-span-2",
    aspect: "aspect-square",
  },
  {
    src: "/images/timi-casual.jpg",
    alt: "Timi Dakolo smiling in green shirt",
    span: "",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/timi-brown.jpg",
    alt: "Timi Dakolo in brown suede jacket",
    span: "",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/timi-hero.jpg",
    alt: "Timi Dakolo in white on rocks with microphone raised to the sky",
    span: "md:col-span-2",
    aspect: "aspect-[16/9]",
  },
  {
    src: "/images/timi-lounge.jpg",
    alt: "Timi Dakolo relaxing in teal jacket",
    span: "",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/timi-teal.jpg",
    alt: "Timi Dakolo leaning against wall",
    span: "",
    aspect: "aspect-[3/4]",
  },
]

export function GallerySection() {
  return (
    <section className="bg-foreground py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            The Artist
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-primary-foreground md:text-5xl text-balance">
            Timi Dakolo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-primary-foreground/60">
            One of Africa&apos;s most beloved voices. A storyteller, a father, a
            man of faith, and a bridge between cultures.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-xl ${img.aspect} ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
