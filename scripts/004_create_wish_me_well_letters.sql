-- Create wish_me_well_letters table
CREATE TABLE IF NOT EXISTS public.wish_me_well_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.tour_events(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL DEFAULT 'Timi Dakolo',
  message TEXT NOT NULL,
  package_tier INTEGER NOT NULL DEFAULT 1 CHECK (package_tier IN (1, 2, 3)),
  price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'delivered')),
  admin_notes TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Package tier details:
-- Tier 1: Basic - Text message only
-- Tier 2: Premium - Text + Photo attachment
-- Tier 3: VIP - Text + Photo + Video message + Priority delivery

-- Create letter_attachments table for media
CREATE TABLE IF NOT EXISTS public.letter_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_id UUID NOT NULL REFERENCES public.wish_me_well_letters(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wish_me_well_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_attachments ENABLE ROW LEVEL SECURITY;

-- Users can read their own letters
CREATE POLICY "letters_select_own" ON public.wish_me_well_letters 
  FOR SELECT USING (user_id = auth.uid());

-- Users can read public letters
CREATE POLICY "letters_select_public" ON public.wish_me_well_letters 
  FOR SELECT USING (is_public = true AND status = 'approved');

-- Admins can read all letters
CREATE POLICY "letters_select_admin" ON public.wish_me_well_letters 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Users can insert their own letters
CREATE POLICY "letters_insert_own" ON public.wish_me_well_letters 
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own pending letters
CREATE POLICY "letters_update_own" ON public.wish_me_well_letters 
  FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

-- Admins can update any letter
CREATE POLICY "letters_update_admin" ON public.wish_me_well_letters 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Attachments policies
CREATE POLICY "attachments_select_own" ON public.letter_attachments 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wish_me_well_letters 
      WHERE id = letter_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "attachments_insert_own" ON public.letter_attachments 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wish_me_well_letters 
      WHERE id = letter_id AND user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER letters_updated_at
  BEFORE UPDATE ON public.wish_me_well_letters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_letters_user ON public.wish_me_well_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_letters_status ON public.wish_me_well_letters(status);
CREATE INDEX IF NOT EXISTS idx_letters_tier ON public.wish_me_well_letters(package_tier);
