-- Create auctions table for "Dinner with Timi"
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.tour_events(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Dinner with Timi Dakolo',
  description TEXT,
  image_url TEXT,
  starting_price DECIMAL(10, 2) NOT NULL,
  current_price DECIMAL(10, 2) NOT NULL,
  min_bid_increment DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  original_end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'cancelled')),
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  dinner_date DATE,
  dinner_location TEXT,
  max_guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create auction_bids table
CREATE TABLE IF NOT EXISTS public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  is_winning BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;

-- Everyone can read auctions
CREATE POLICY "auctions_select_all" ON public.auctions 
  FOR SELECT TO authenticated
  USING (true);

-- Only admins can insert auctions
CREATE POLICY "auctions_insert_admin" ON public.auctions 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Only admins can update auctions
CREATE POLICY "auctions_update_admin" ON public.auctions 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Everyone can read bids
CREATE POLICY "bids_select_all" ON public.auction_bids 
  FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own bids
CREATE POLICY "bids_insert_own" ON public.auction_bids 
  FOR INSERT WITH CHECK (bidder_id = auth.uid());

-- Admins can update bids (for marking winners)
CREATE POLICY "bids_update_admin" ON public.auction_bids 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Function to handle popcorn bidding (extend auction by 2 min if bid in final 2 min)
CREATE OR REPLACE FUNCTION public.handle_auction_bid()
RETURNS TRIGGER AS $$
DECLARE
  auction_record RECORD;
  time_remaining INTERVAL;
BEGIN
  -- Get the auction
  SELECT * INTO auction_record FROM public.auctions WHERE id = NEW.auction_id;
  
  -- Check if auction is active
  IF auction_record.status != 'active' THEN
    RAISE EXCEPTION 'Auction is not active';
  END IF;
  
  -- Check if bid is higher than current price + min increment
  IF NEW.amount < (auction_record.current_price + auction_record.min_bid_increment) THEN
    RAISE EXCEPTION 'Bid must be at least % higher than current price', auction_record.min_bid_increment;
  END IF;
  
  -- Calculate time remaining
  time_remaining := auction_record.end_time - NOW();
  
  -- If bid is within final 2 minutes, extend auction by 2 minutes (Popcorn Bidding)
  IF time_remaining <= INTERVAL '2 minutes' AND time_remaining > INTERVAL '0 seconds' THEN
    UPDATE public.auctions 
    SET end_time = end_time + INTERVAL '2 minutes'
    WHERE id = NEW.auction_id;
  END IF;
  
  -- Update current price and mark previous winning bid as not winning
  UPDATE public.auction_bids SET is_winning = false WHERE auction_id = NEW.auction_id AND is_winning = true;
  UPDATE public.auctions SET current_price = NEW.amount WHERE id = NEW.auction_id;
  
  -- Mark this bid as winning
  NEW.is_winning := true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new bids
DROP TRIGGER IF EXISTS on_auction_bid ON public.auction_bids;
CREATE TRIGGER on_auction_bid
  BEFORE INSERT ON public.auction_bids
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auction_bid();

-- Trigger for updated_at
CREATE TRIGGER auctions_updated_at
  BEFORE UPDATE ON public.auctions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auctions_status ON public.auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON public.auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_bids_auction ON public.auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder ON public.auction_bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON public.auction_bids(auction_id, amount DESC);

-- Enable realtime for auctions and bids
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;
