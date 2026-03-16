"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Check, ChevronRight, ChevronLeft, Heart, Mic, Globe, Ticket, Star } from "lucide-react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { WISH_PRODUCTS, TICKET_ADDON, formatPrice, calculateTotal } from "@/lib/wish-products"
import { startWishCheckoutSession, type WishCheckoutData } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Step = "experience" | "message" | "review" | "checkout"

const CITIES = [
  { id: "toronto", name: "Toronto", date: "June 7, 2026" },
  { id: "montreal", name: "Montreal", date: "TBA" },
  { id: "vancouver", name: "Vancouver", date: "TBA" },
  { id: "edmonton", name: "Edmonton", date: "TBA" },
  { id: "ottawa", name: "Ottawa", date: "TBA" },
]

const STEP_ICONS = {
  1: Heart,
  2: Mic,
  3: Globe,
}

export function SendWishForm() {
  const [currentStep, setCurrentStep] = useState<Step>("experience")
  const [selectedProduct, setSelectedProduct] = useState<string>("soulful-signature")
  const [includeTicket, setIncludeTicket] = useState(false)
  const [selectedCity, setSelectedCity] = useState("toronto")
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    recipientName: "",
    message: "",
    socialHandle: "",
  })
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const product = WISH_PRODUCTS.find((p) => p.id === selectedProduct)
  const total = calculateTotal(selectedProduct, includeTicket)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const canProceedToMessage = selectedProduct && selectedCity
  const canProceedToReview =
    formData.senderName &&
    formData.senderEmail &&
    formData.recipientName &&
    formData.message.length >= 10

  const handleProceedToCheckout = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const data: WishCheckoutData = {
        productId: selectedProduct,
        includeTicket,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        recipientName: formData.recipientName,
        message: formData.message,
        selectedCity,
        socialHandle: formData.socialHandle,
      }

      const result = await startWishCheckoutSession(data)
      setCheckoutSecret(result.clientSecret)
      setCurrentStep("checkout")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsProcessing(false)
    }
  }

  const fetchClientSecret = useCallback(() => {
    return Promise.resolve(checkoutSecret!)
  }, [checkoutSecret])

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Steps */}
      {currentStep !== "checkout" && (
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {(["experience", "message", "review"] as const).map((step, index) => {
              const isActive = currentStep === step
              const isPast =
                (step === "experience" && (currentStep === "message" || currentStep === "review")) ||
                (step === "message" && currentStep === "review")

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isPast
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {isPast ? <Check className="h-5 w-5" /> : <span className="text-sm font-semibold">{index + 1}</span>}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium capitalize ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                  {index < 2 && <ChevronRight className="mx-4 h-5 w-5 text-muted-foreground" />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 1: Experience Selection */}
      {currentStep === "experience" && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Choose Your Experience</h2>
            <p className="mt-2 text-muted-foreground">Select the perfect way to share your wish with someone special</p>
          </div>

          {/* Package Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {WISH_PRODUCTS.map((pkg) => {
              const Icon = STEP_ICONS[pkg.tier as keyof typeof STEP_ICONS]
              const isSelected = selectedProduct === pkg.id

              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedProduct(pkg.id)}
                  className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition-all hover:shadow-lg ${
                    isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-card-foreground">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>

                  <div className="my-4">
                    <span className="font-serif text-3xl font-bold text-foreground">{formatPrice(pkg.priceInCents)}</span>
                  </div>

                  <ul className="mt-auto space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>

          {/* City Selection */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-lg font-bold text-card-foreground">Select Concert City</h3>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`rounded-lg border p-3 text-center transition-all ${
                    selectedCity === city.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs">{city.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Upsell */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-card-foreground">Add a Concert Ticket</h3>
                    <p className="text-sm text-muted-foreground">
                      Let the recipient experience the show live! Perfect for making your wish extra special.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-xl font-bold text-foreground">+{formatPrice(TICKET_ADDON.priceInCents)}</div>
                  </div>
                </div>
                <button
                  onClick={() => setIncludeTicket(!includeTicket)}
                  className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    includeTicket
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary"
                  }`}
                >
                  {includeTicket ? <Check className="h-4 w-4" /> : <Ticket className="h-4 w-4" />}
                  {includeTicket ? "Ticket Added" : "Add Ticket"}
                </button>
              </div>
            </div>
          </div>

          {/* Total & Continue */}
          <div className="flex items-center justify-between rounded-2xl bg-secondary p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-serif text-3xl font-bold text-foreground">{formatPrice(total)}</p>
            </div>
            <button
              onClick={() => setCurrentStep("message")}
              disabled={!canProceedToMessage}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Message */}
      {currentStep === "message" && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Write Your Message</h2>
            <p className="mt-2 text-muted-foreground">Share your heartfelt words with Timi to deliver</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Your Name</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Your Email</label>
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-foreground">Recipient's Name</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="Who is this wish for?"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-foreground">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                placeholder="Write your heartfelt message here... Share what this person means to you, a special memory, or your wishes for them."
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-2 text-xs text-muted-foreground">{formData.message.length} characters (minimum 10)</p>
            </div>

            {product && product.tier === 3 && (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Social Media Handle (for tagging)
                </label>
                <input
                  type="text"
                  name="socialHandle"
                  value={formData.socialHandle}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep("experience")}
              className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep("review")}
              disabled={!canProceedToReview}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              Review Order
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === "review" && product && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Review Your Order</h2>
            <p className="mt-2 text-muted-foreground">Make sure everything looks perfect before checkout</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-lg font-bold text-card-foreground">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatPrice(product.priceInCents)}</p>
                </div>

                {includeTicket && (
                  <div className="flex items-start justify-between border-b border-border pb-4">
                    <div>
                      <p className="font-medium text-foreground">Concert Ticket</p>
                      <p className="text-sm text-muted-foreground">
                        {CITIES.find((c) => c.id === selectedCity)?.name} - {CITIES.find((c) => c.id === selectedCity)?.date}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">{formatPrice(TICKET_ADDON.priceInCents)}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-bold text-foreground">Total</p>
                  <p className="font-serif text-2xl font-bold text-primary">{formatPrice(total)}</p>
                </div>
              </div>
            </div>

            {/* Message Preview */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-lg font-bold text-card-foreground">Message Preview</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium text-foreground">{formData.senderName}</p>
                  <p className="text-muted-foreground">{formData.senderEmail}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">To</p>
                  <p className="font-medium text-foreground">{formData.recipientName}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Concert City</p>
                  <p className="font-medium text-foreground">
                    {CITIES.find((c) => c.id === selectedCity)?.name}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-muted-foreground">Message</p>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="whitespace-pre-wrap text-foreground">{formData.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">{error}</div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep("message")}
              className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleProceedToCheckout}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Checkout */}
      {currentStep === "checkout" && checkoutSecret && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Complete Your Payment</h2>
            <p className="mt-2 text-muted-foreground">Secure checkout powered by Stripe</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setCurrentStep("review")
                setCheckoutSecret(null)
              }}
              className="text-sm text-muted-foreground underline hover:text-foreground"
            >
              Back to review
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
