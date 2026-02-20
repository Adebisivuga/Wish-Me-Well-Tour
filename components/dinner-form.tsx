"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

const cities = ["Montreal", "Toronto", "Edmonton", "Vancouver", "Ottawa"]

export function DinnerForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-6 font-serif text-2xl font-bold text-foreground">
          Your invitation has been submitted!
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you for opening your home. Our team will review submissions and
          reach out to selected families before the tour reaches your city.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Submit Another Invitation
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
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" required />
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

        <div className="grid gap-6 sm:grid-cols-2">
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
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="guests">Number of People</Label>
            <Input
              id="guests"
              type="number"
              min={2}
              max={20}
              placeholder="e.g. 6"
              required
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-6">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Your story
        </h3>

        <div className="flex flex-col gap-2">
          <Label htmlFor="story">Family Story</Label>
          <Textarea
            id="story"
            placeholder="Tell us about your family, your journey to Canada, and what makes your home special..."
            rows={5}
            required
            className="resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="why">Why do you want to host Timi?</Label>
          <Textarea
            id="why"
            placeholder="What would this experience mean to your family?"
            rows={4}
            required
            className="resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="meal">Cultural Meal Idea</Label>
          <Input
            id="meal"
            placeholder="e.g. Jollof rice with plantain, Haitian griot, Pho..."
            required
          />
          <p className="text-xs text-muted-foreground">
            What dish would you prepare? We love celebrating cultural diversity
            through food.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="video">Short Video Upload (optional)</Label>
          <Input id="video" type="file" accept="video/*" />
          <p className="text-xs text-muted-foreground">
            Record a short video telling us why your family should host Timi.
            Max 30 seconds, 50MB.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Submit My Invitation
      </button>
    </form>
  )
}
