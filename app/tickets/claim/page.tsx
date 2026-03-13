"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Ticket, CheckCircle, XCircle, LogIn } from "lucide-react"
import Link from "next/link"

export default function ClaimTicketPage() {
  const [status, setStatus] = useState<"loading" | "auth-required" | "ready" | "claiming" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [ticketInfo, setTicketInfo] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (!token) {
        setError("No transfer token provided")
        setStatus("error")
        return
      }

      if (!user) {
        setStatus("auth-required")
        return
      }

      setStatus("ready")
    }
    checkAuth()
  }, [supabase, token])

  const handleClaim = async () => {
    setStatus("claiming")
    setError(null)

    try {
      const response = await fetch("/api/tickets/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim ticket")
      }

      setTicketInfo(data.ticket)
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStatus("error")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "auth-required") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">Sign In Required</CardTitle>
            <CardDescription>
              You need to sign in to claim this ticket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Someone has sent you a ticket! Sign in or create an account to add it to your collection.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={`/auth/login?redirect=/tickets/claim?token=${token}`}>
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/auth/signup?redirect=/tickets/claim?token=${token}`}>
                Create Account
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-serif">Ticket Claimed!</CardTitle>
            <CardDescription>
              The ticket has been added to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ticketInfo && (
              <div className="rounded-lg bg-muted p-4">
                <p className="font-semibold">{ticketInfo.event}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {ticketInfo.tier} Ticket
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/tickets">View My Tickets</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-serif">Unable to Claim</CardTitle>
            <CardDescription>
              {error || "Something went wrong"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The transfer link may have expired or already been used. Contact the person who sent you the ticket.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Ticket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Claim Your Ticket</CardTitle>
          <CardDescription>
            Someone has transferred a ticket to you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            Click the button below to add this ticket to your account.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleClaim} 
            className="w-full" 
            disabled={status === "claiming"}
          >
            {status === "claiming" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Ticket className="mr-2 h-4 w-4" />
                Claim Ticket
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
