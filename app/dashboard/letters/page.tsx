import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LETTER_PACKAGES } from "@/lib/types/database"
import type { WishMeWellLetter, TourEvent } from "@/lib/types/database"
import Link from "next/link"
import { Mail, Clock, CheckCircle, Printer, Send as SendIcon, Share2 } from "lucide-react"

const statusConfig = {
  pending: { label: "Received", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  printed: { label: "Printed", color: "bg-blue-100 text-blue-800", icon: Printer },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: SendIcon },
  shared: { label: "Shared on Tour", color: "bg-purple-100 text-purple-800", icon: Share2 },
}

export default async function LettersPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  const { data: letters } = await supabase
    .from("wish_me_well_letters")
    .select("*, tour_events:event_id(*)")
    .eq("user_id", profile?.id || "")
    .order("submitted_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">My Letters</h1>
          <p className="text-muted-foreground mt-1">
            Your personal wishes to Timi Dakolo
          </p>
        </div>
        <Button asChild>
          <Link href="/send-a-wish">
            <Mail className="h-4 w-4 mr-2" />
            Send New Wish
          </Link>
        </Button>
      </div>

      {/* Package Tiers Info */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(LETTER_PACKAGES).map(([tier, pkg]) => (
          <Card key={tier} className="border-dashed">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit">Tier {tier}</Badge>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                ₦{pkg.price.toLocaleString()}
              </p>
              <ul className="mt-2 space-y-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Letters List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Submitted Letters</h2>

        {letters && letters.length > 0 ? (
          <div className="space-y-4">
            {letters.map((letter) => {
              const status = statusConfig[letter.status as keyof typeof statusConfig]
              const pkg = LETTER_PACKAGES[letter.package_tier as keyof typeof LETTER_PACKAGES]
              const StatusIcon = status.icon

              return (
                <Card key={letter.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Tier {letter.package_tier}</Badge>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(letter.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      {pkg?.name || `Package ${letter.package_tier}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {letter.tour_events && (
                      <p className="text-sm text-muted-foreground">
                        For: {letter.tour_events.name} - {letter.tour_events.city}
                      </p>
                    )}
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm whitespace-pre-wrap line-clamp-4">
                        {letter.message}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        From: {letter.is_anonymous ? "Anonymous" : letter.sender_name}
                      </span>
                      <span className="font-medium">
                        ₦{letter.amount_paid.toLocaleString()}
                      </span>
                    </div>
                    {letter.admin_notes && (
                      <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                        <strong>Note from team:</strong> {letter.admin_notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                You haven&apos;t sent any wishes yet
              </p>
              <Button asChild>
                <Link href="/send-a-wish">Send Your First Wish</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
