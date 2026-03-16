-- Migration: Update wish_me_well_letters table for new package tiers and Stripe integration
-- Run this in your Supabase SQL Editor

-- Add new columns to wish_me_well_letters table if they don't exist
ALTER TABLE wish_me_well_letters 
ADD COLUMN IF NOT EXISTS add_ticket BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sender_social_handle TEXT,
ADD COLUMN IF NOT EXISTS receiver_social_handle TEXT,
ADD COLUMN IF NOT EXISTS draft_saved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- Update status enum to include 'draft' if not already
-- First check if we need to add draft status
DO $$
BEGIN
  -- Add draft to the status check constraint
  ALTER TABLE wish_me_well_letters DROP CONSTRAINT IF EXISTS wish_me_well_letters_status_check;
  ALTER TABLE wish_me_well_letters ADD CONSTRAINT wish_me_well_letters_status_check 
    CHECK (status IN ('draft', 'pending', 'printed', 'delivered', 'shared'));
EXCEPTION
  WHEN others THEN
    NULL; -- Ignore if constraint doesn't exist or can't be modified
END $$;

-- Create index for draft lookup
CREATE INDEX IF NOT EXISTS idx_wish_letters_user_draft ON wish_me_well_letters(user_id, status) WHERE status = 'draft';

-- Create index for Stripe session lookup
CREATE INDEX IF NOT EXISTS idx_wish_letters_stripe_session ON wish_me_well_letters(stripe_session_id);

-- Update RLS policies to allow users to manage their own drafts
DROP POLICY IF EXISTS "Users can view own letters" ON wish_me_well_letters;
CREATE POLICY "Users can view own letters" ON wish_me_well_letters
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own letters" ON wish_me_well_letters;
CREATE POLICY "Users can insert own letters" ON wish_me_well_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own drafts" ON wish_me_well_letters;
CREATE POLICY "Users can update own drafts" ON wish_me_well_letters
  FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');

-- Add comment for documentation
COMMENT ON COLUMN wish_me_well_letters.add_ticket IS 'Whether user wants to add VIP concert ticket for receiver (+$85 CAD)';
COMMENT ON COLUMN wish_me_well_letters.total_amount IS 'Total amount in CAD including package tier and optional ticket';
COMMENT ON COLUMN wish_me_well_letters.payment_status IS 'Payment status: unpaid, pending, paid, failed, refunded';
