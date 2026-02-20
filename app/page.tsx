import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TourDatesSection } from "@/components/tour-dates-section"
import { HighlightsSection } from "@/components/highlights-section"
import { WishWallSection } from "@/components/wish-wall-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HighlightsSection />
      <TourDatesSection />
      <WishWallSection />
    </>
  )
}
