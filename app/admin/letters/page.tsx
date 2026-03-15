import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Mail, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  delivered: { label: "Delivered", color: "bg-blue-100 text-blue-800", icon: Mail },
}

export default async function AdminLettersPage() {
  const supabase = await createClient()

  const { data: letters } = await supabase
    .from("wish_me_well_letters")
    .select("*, profiles(full_name, email), tour_events(name)")
    .order("submitted_at", { ascending: false })

  const pendingLetters = letters?.filter(l => l.status === "pending") || []
  const approvedLetters = letters?.filter(l => l.status === "approved") || []
  const rejectedLetters = letters?.filter(l => l.status === "rejected") || []
  const deliveredLetters = letters?.filter(l => l.status === "delivered") || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Letters Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage fan letters
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingLetters.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {pendingLetters.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected", "delivered"].map((status) => {
          const statusLetters = letters?.filter(l => l.status === status) || []
          const config = statusConfig[status as keyof typeof statusConfig]
          
          return (
            <TabsContent key={status} value={status} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <config.icon className="h-5 w-5" />
                    {config.label} Letters ({statusLetters.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statusLetters.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sender</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statusLetters.map((letter) => (
                          <TableRow key={letter.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {letter.is_anonymous ? "Anonymous" : letter.sender_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {letter.profiles?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Tier {letter.package_tier}</Badge>
                            </TableCell>
                            <TableCell>
                              {letter.tour_events?.name || "General"}
                            </TableCell>
                            <TableCell>₦{letter.amount_paid.toLocaleString()}</TableCell>
                            <TableCell>
                              {new Date(letter.submitted_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/letters/${letter.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No {status} letters
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
