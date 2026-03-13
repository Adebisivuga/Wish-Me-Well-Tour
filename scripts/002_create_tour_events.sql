-- Create tour_events table
CREATE TABLE IF NOT EXISTS public.tour_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  tickets_sold INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'sold_out', 'completed', 'cancelled')),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tour_events ENABLE ROW LEVEL SECURITY;

-- Everyone can read tour events
CREATE POLICY "tour_events_select_all" ON public.tour_events 
  FOR SELECT TO authenticated, anon
  USING (true);

-- Only admins can insert tour events
CREATE POLICY "tour_events_insert_admin" ON public.tour_events 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Only admins can update tour events
CREATE POLICY "tour_events_update_admin" ON public.tour_events 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Only admins can delete tour events
CREATE POLICY "tour_events_delete_admin" ON public.tour_events 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER tour_events_updated_at
  BEFORE UPDATE ON public.tour_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
