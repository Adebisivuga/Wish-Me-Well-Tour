import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Music } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            We&apos;ve sent you a confirmation link to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to complete your registration and access your Wish Me Well Tour dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Music className="h-4 w-4" />
            <span>Welcome to the Timi Dakolo Wish Me Well Tour</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
