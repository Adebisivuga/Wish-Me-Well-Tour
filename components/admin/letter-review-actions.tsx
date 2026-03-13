"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface LetterReviewActionsProps {
  letterId: string
  adminId: string
}

export function LetterReviewActions({ letterId, adminId }: LetterReviewActionsProps) {
  const [adminNotes, setAdminNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAction = async (newStatus: "approved" | "rejected") => {
    setIsLoading(true)
    setAction(newStatus === "approved" ? "approve" : "reject")
    setError(null)

    const { error } = await supabase
      .from("wish_me_well_letters")
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
      })
      .eq("id", letterId)

    if (error) {
      setError(error.message)
      setIsLoading(false)
      setAction(null)
      return
    }

    router.push("/admin/letters")
    router.refresh()
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Review Actions</CardTitle>
        <CardDescription>
          Approve or reject this letter submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Admin Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about your decision (visible for rejections)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleAction("approved")}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLoading && action === "approve" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </>
            )}
          </Button>
          <Button
            onClick={() => handleAction("rejected")}
            disabled={isLoading}
            variant="destructive"
            className="flex-1"
          >
            {isLoading && action === "reject" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
