"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

const cities = ["Montreal", "Toronto", "Edmonton", "Vancouver", "Ottawa"]
const relationships = [
  "Mother",
  "Father",
  "Wife",
  "Husband",
  "Partner",
  "Sibling",
  "Child",
  "Friend",
  "Grandparent",
  "Other",
]

export function WishForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-6 font-serif text-2xl font-bold text-foreground">
          Your wish has been sent!
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you for sharing your heart. If your message is selected, Timi
          may read it live on stage, at a meet & greet, or feature it on the
          Wish Me Well Wall.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Send Another Wish
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-6">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Your details
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Full name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="city">Your City</Label>
          <Select required>
            <SelectTrigger id="city">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase()}>
                  {city}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-6">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Your message
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="recipient">Who is this message for?</Label>
            <Input id="recipient" placeholder="e.g. My mother, Adaeze" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select required>
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationships.map((rel) => (
                  <SelectItem key={rel} value={rel.toLowerCase()}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            placeholder="Write your wish, letter, or message here..."
            rows={6}
            required
            className="resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="photo">Upload a Photo (optional)</Label>
          <Input id="photo" type="file" accept="image/*" />
          <p className="text-xs text-muted-foreground">
            A photo of you, your loved one, or your family. Max 5MB.
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-start gap-3">
        <Checkbox id="consent" required />
        <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
          I give permission for Timi Dakolo to read this message on stage, at a
          meet & greet, or feature it on the Wish Me Well website.
        </Label>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Send My Wish
      </button>
    </form>
  )
}
