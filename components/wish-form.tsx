"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { LETTER_PACKAGES } from "@/lib/types/database"
import { 
  Heart, 
  Sparkles, 
  Crown, 
  CheckCircle, 
  Loader2,
  Instagram,
  Mail,
  User,
  PenLine,
  Clock,
  Printer,
  Send,
  Share2,
  ArrowRight
} from "lucide-react"

const tierIcons = {
  1: Heart,
  2: Sparkles,
  3: Crown,
}

const statusSteps = [
  { key: "pending", label: "Received", icon: Clock, description: "Your letter is being reviewed" },
  { key: "printed", label: "Printed", icon: Printer, description: "Your letter has been printed" },
  { key: "delivered", label: "Delivered", icon: Send, description: "Delivered to Timi" },
  { key: "shared", label: "Shared", icon: Share2, description: "Featured on tour" },
]

interface SubmittedLetter {
  id: string
  status: string
  package_tier: number
  recipient_name: string
  submitted_at: string
}

export function WishForm() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "confirm">("form")
  const [submittedLetter, setSubmittedLetter] = useState<SubmittedLetter | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    senderName: "",
    senderInstagram: "",
    recipientName: "",
    recipientEmail: "",
    recipientInstagram: "",
    message: "",
    packageTier: "1",
    consent: false,
    isPublic: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push(`/auth/login?redirect=/send-a-wish`)
        return
      }

      // Get user profile for email
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single()

      const pkg = LETTER_PACKAGES[parseInt(formData.packageTier) as 1 | 2 | 3]

      const { data, error: insertError } = await supabase
        .from("wish_me_well_letters")
        .insert({
          user_id: user.id,
          sender_name: formData.senderName,
          sender_email: profile?.email || user.email,
          sender_instagram: formData.senderInstagram || null,
          recipient_name: formData.recipientName || "Timi Dakolo",
          recipient_email: formData.recipientEmail || null,
          recipient_instagram: formData.recipientInstagram || null,
          message: formData.message,
          package_tier: parseInt(formData.packageTier),
          amount_paid: pkg.price,
          is_public: formData.isPublic,
          status: "pending",
        })
        .select()
        .single()

      if (insertError) throw insertError

      setSubmittedLetter({
        id: data.id,
        status: data.status,
        package_tier: data.package_tier,
        recipient_name: data.recipient_name,
        submitted_at: data.submitted_at,
      })
      setStep("confirm")
    } catch (err) {
      console.error("Error submitting letter:", err)
      setError(err instanceof Error ? err.message : "Failed to submit your wish. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (step === "confirm" && submittedLetter) {
    const currentStatusIndex = statusSteps.findIndex(s => s.key === submittedLetter.status)
    const pkg = LETTER_PACKAGES[submittedLetter.package_tier as 1 | 2 | 3]

    return (
      <div className="flex flex-col items-center py-8 text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-foreground">
          Your Wish Has Been Sent
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
          Your heartfelt message to <span className="font-semibold text-foreground">{submittedLetter.recipient_name}</span> is on its way. 
          This is more than a letter - it&apos;s a moment that will be treasured forever.
        </p>

        {/* Package Info */}
        <Card className="mt-8 w-full max-w-sm border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const TierIcon = tierIcons[submittedLetter.package_tier as 1 | 2 | 3]
                  return <TierIcon className="h-5 w-5 text-primary" />
                })()}
                <span className="font-medium">{pkg.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(submittedLetter.submitted_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Status Tracking */}
        <div className="mt-10 w-full max-w-md">
          <h3 className="mb-6 font-serif text-lg font-semibold">Your Letter&apos;s Journey</h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-0.5 bg-border" />
            <div 
              className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-500"
              style={{ height: `${Math.max(0, currentStatusIndex) * 33}%` }}
            />

            <div className="space-y-6">
              {statusSteps.map((status, index) => {
                const isComplete = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const StatusIcon = status.icon

                return (
                  <div key={status.key} className="relative flex items-start gap-4">
                    <div 
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isComplete 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-muted-foreground/30 bg-background text-muted-foreground/50"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                    >
                      {isComplete ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StatusIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`font-medium ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                        {status.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {status.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => {
            setStep("form")
            setSubmittedLetter(null)
            setFormData({
              senderName: "",
              senderInstagram: "",
              recipientName: "",
              recipientEmail: "",
              recipientInstagram: "",
              message: "",
              packageTier: "1",
              consent: false,
              isPublic: false,
            })
          }}>
            Send Another Wish
          </Button>
          <Button onClick={() => router.push("/dashboard/letters")}>
            View All My Letters
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Package Tier Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Choose Your Package
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select how you want your message delivered
          </p>
        </div>

        <RadioGroup
          value={formData.packageTier}
          onValueChange={(v) => updateField("packageTier", v)}
          className="grid gap-4 md:grid-cols-3"
        >
          {Object.entries(LETTER_PACKAGES).map(([tier, pkg]) => {
            const TierIcon = tierIcons[parseInt(tier) as 1 | 2 | 3]
            const isSelected = formData.packageTier === tier

            return (
              <Label
                key={tier}
                htmlFor={`tier-${tier}`}
                className="cursor-pointer"
              >
                <Card className={`relative transition-all hover:border-primary/50 ${
                  isSelected ? "border-primary ring-2 ring-primary/20" : ""
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <TierIcon className="h-5 w-5" />
                      </div>
                      <RadioGroupItem value={tier} id={`tier-${tier}`} />
                    </div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-2xl font-bold text-primary">
                      NGN{pkg.price.toLocaleString()}
                    </p>
                    <ul className="space-y-1.5">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Label>
            )
          })}
        </RadioGroup>
      </div>

      <div className="h-px bg-border" />

      {/* Sender Details */}
      <div className="space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
            <User className="h-5 w-5 text-primary" />
            About You
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us who is sending this heartfelt message
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="senderName">Your Name *</Label>
            <Input
              id="senderName"
              placeholder="Your full name"
              value={formData.senderName}
              onChange={(e) => updateField("senderName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderInstagram" className="flex items-center gap-1">
              <Instagram className="h-3.5 w-3.5" />
              Your Instagram
            </Label>
            <Input
              id="senderInstagram"
              placeholder="@yourusername"
              value={formData.senderInstagram}
              onChange={(e) => updateField("senderInstagram", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Recipient Details */}
      <div className="space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
            <Heart className="h-5 w-5 text-primary" />
            The Recipient
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Who is this special message for?
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name *</Label>
            <Input
              id="recipientName"
              placeholder="e.g., My mother, Adaeze"
              value={formData.recipientName}
              onChange={(e) => updateField("recipientName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientEmail" className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              Recipient Email
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="their@email.com"
              value={formData.recipientEmail}
              onChange={(e) => updateField("recipientEmail", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll notify them when delivered
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientInstagram" className="flex items-center gap-1">
            <Instagram className="h-3.5 w-3.5" />
            Recipient Instagram
          </Label>
          <Input
            id="recipientInstagram"
            placeholder="@theirusername"
            value={formData.recipientInstagram}
            onChange={(e) => updateField("recipientInstagram", e.target.value)}
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Message */}
      <div className="space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
            <PenLine className="h-5 w-5 text-primary" />
            Your Message
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Write from your heart. This is your moment to express something beautiful.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Your Wish Message *</Label>
          <Textarea
            id="message"
            placeholder="Dear [recipient], I want you to know how much you mean to me..."
            rows={8}
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            required
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            Write something that will touch their heart
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Consent */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={(checked) => updateField("consent", checked === true)}
            required
          />
          <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
            I give permission for Timi Dakolo to read this message on stage, at a meet & greet, 
            or feature it on the Wish Me Well website. *
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) => updateField("isPublic", checked === true)}
          />
          <Label htmlFor="isPublic" className="text-sm leading-relaxed text-muted-foreground">
            I want my message to be featured publicly on the Wish Wall (your name will be visible)
          </Label>
        </div>
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={loading || !formData.consent}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Your Wish...
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4" />
            Send My Wish - NGN{LETTER_PACKAGES[parseInt(formData.packageTier) as 1 | 2 | 3].price.toLocaleString()}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
