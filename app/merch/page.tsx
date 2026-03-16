import type { Metadata } from "next"
import { MerchStore } from "@/components/merch-store"

export const metadata: Metadata = {
  title: "Merch Store | Wish Me Well Canada Tour",
  description:
    "Official Wish Me Well Canada Tour merchandise. Hoodies, t-shirts, singlets, and personalized shoutout videos.",
}

export default function MerchPage() {
  return <MerchStore />
}
