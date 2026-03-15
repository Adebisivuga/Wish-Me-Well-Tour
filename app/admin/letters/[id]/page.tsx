import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Mail, User, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LetterReviewActions } from "@/components/admin/letter-review-actions"

interface LetterReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function LetterReviewPage({ params }: LetterReviewPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const adminProfile = await getProfile()

  const { data: letter, error } = await supabase
    .from("wish_me_well_letters")
    .select("*, profiles(full_name, email, phone), tour_events(name, city, event_date)")
    .eq("id", id)
    .single()

  if (error || !letter) {
    notFound()
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    delivered: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" asChild>
        <Link href="/admin/letters">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Letters
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Review Letter</h1>
          <p className="text-muted-foreground mt-1">
            Review and take action on this submission
          </p>
        </div>
        <Badge className={statusColors[letter.status as keyof typeof statusColors]}>
          {letter.status}
        </Badge>
      </div>

      {/* Letter Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Letter Content
          </CardTitle>
          <CardDescription>
            Package Tier {letter.package_tier} - ₦{letter.amount_paid.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-6">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {letter.message}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Signed:</span>
            <span className="font-medium text-foreground">
              {letter.is_anonymous ? "Anonymous" : letter.sender_name}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sender Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sender Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account Name</p>
              <p className="font-medium">{letter.profiles?.full_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{letter.profiles?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{letter.profiles?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Display Name</p>
              <p className="font-medium">
                {letter.is_anonymous ? "Anonymous (hidden)" : letter.sender_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Info */}
      {letter.tour_events && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Associated Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Event</p>
                <p className="font-medium">{letter.tour_events.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">City</p>
                <p className="font-medium">{letter.tour_events.city}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(letter.tour_events.event_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Submission Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {new Date(letter.submitted_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount Paid</p>
              <p className="font-medium">₦{letter.amount_paid.toLocaleString()}</p>
            </div>
            {letter.reviewed_at && (
              <>
                <div>
                  <p className="text-muted-foreground">Reviewed</p>
                  <p className="font-medium">
                    {new Date(letter.reviewed_at).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>
          {letter.admin_notes && (
            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Admin Notes:</p>
              <p className="text-sm">{letter.admin_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {letter.status === "pending" && (
        <LetterReviewActions letterId={letter.id} adminId={adminProfile?.id || ""} />
      )}
    </div>
  )
}
