import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TourDatesSection } from "@/components/tour-dates-section"
import { HighlightsSection } from "@/components/highlights-section"
import { WishWallSection } from "@/components/wish-wall-section"
import { GallerySection } from "@/components/gallery-section"
import { PartnersSection } from "@/components/partners-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <HighlightsSection />
      <TourDatesSection />
      <PartnersSection />
      <WishWallSection />
    </>
  )
}
