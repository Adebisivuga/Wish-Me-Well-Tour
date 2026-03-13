import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Music2 } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Music2 className="h-8 w-8" />
            </Link>
          </div>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4 text-2xl">Check your email</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                We&apos;ve sent you a confirmation link. Please check your email
                and click the link to verify your account.
              </p>
              <p className="text-sm text-muted-foreground">
                Once verified, you&apos;ll be able to access your dashboard,
                purchase tickets, bid on auctions, and send wishes to Timi.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link href="/auth/login">Back to Login</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
