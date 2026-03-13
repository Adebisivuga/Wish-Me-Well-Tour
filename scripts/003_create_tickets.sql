-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.tour_events(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticket_type TEXT NOT NULL DEFAULT 'general' CHECK (ticket_type IN ('general', 'vip', 'premium')),
  price DECIMAL(10, 2) NOT NULL,
  qr_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'transferred', 'cancelled')),
  seat_info TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ticket_transfers table for secure transfers
CREATE TABLE IF NOT EXISTS public.ticket_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  transfer_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_transfers ENABLE ROW LEVEL SECURITY;

-- Users can read their own tickets
CREATE POLICY "tickets_select_own" ON public.tickets 
  FOR SELECT USING (owner_id = auth.uid());

-- Admins can read all tickets
CREATE POLICY "tickets_select_admin" ON public.tickets 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Admins can insert tickets
CREATE POLICY "tickets_insert_admin" ON public.tickets 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Users can update their own tickets (for transfers)
CREATE POLICY "tickets_update_own" ON public.tickets 
  FOR UPDATE USING (owner_id = auth.uid());

-- Admins can update any ticket
CREATE POLICY "tickets_update_admin" ON public.tickets 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Ticket transfers policies
CREATE POLICY "transfers_select_own" ON public.ticket_transfers 
  FOR SELECT USING (from_user_id = auth.uid());

CREATE POLICY "transfers_insert_own" ON public.ticket_transfers 
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "transfers_update_own" ON public.ticket_transfers 
  FOR UPDATE USING (from_user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_owner ON public.tickets(owner_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_transfers_token ON public.ticket_transfers(transfer_token);
