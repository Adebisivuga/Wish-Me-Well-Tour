"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TICKET_TIERS } from "@/lib/types/database"
import type { Ticket, TourEvent } from "@/lib/types/database"
import { QrCode, Send, Calendar, MapPin, Clock } from "lucide-react"
import { TransferTicketDialog } from "./transfer-ticket-dialog"

interface TicketCardProps {
  ticket: Ticket & { tour_events: TourEvent }
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [showQR, setShowQR] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const tier = TICKET_TIERS[ticket.ticket_tier as keyof typeof TICKET_TIERS]
  const event = ticket.tour_events

  const eventDate = new Date(event.event_date)
  const isUpcoming = eventDate > new Date()

  return (
    <Card className={`relative overflow-hidden ${tier?.color}`}>
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-primary/5" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary text-primary-foreground">
            {tier?.name || ticket.ticket_tier}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground">
            #{ticket.ticket_number}
          </span>
        </div>
        <CardTitle className="text-lg font-serif">{event.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {eventDate.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {event.doors_open && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Doors open: {event.doors_open}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <QrCode className="h-4 w-4 mr-2" />
                View QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Your Ticket QR Code</DialogTitle>
                <DialogDescription>
                  Present this code at the venue entrance
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center py-6">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <QrCode className="h-24 w-24 mx-auto text-foreground" />
                    <p className="text-xs font-mono mt-2">{ticket.qr_code}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-semibold">{event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tier?.name} - #{ticket.ticket_number}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {isUpcoming && (
            <TransferTicketDialog 
              ticket={ticket}
              open={showTransfer}
              onOpenChange={setShowTransfer}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
