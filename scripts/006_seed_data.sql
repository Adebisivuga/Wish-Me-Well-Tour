-- Seed tour events data
INSERT INTO public.tour_events (city, venue, event_date, event_time, capacity, tickets_sold, status, description)
VALUES 
  ('Lagos', 'Eko Convention Centre', '2025-08-15', '19:00', 5000, 0, 'upcoming', 'The grand opening of the Wish Me Well Tour in Lagos'),
  ('Abuja', 'International Conference Centre', '2025-08-22', '19:00', 3000, 0, 'upcoming', 'Wish Me Well Tour comes to the capital city'),
  ('Port Harcourt', 'Aztech Arcum', '2025-08-29', '19:00', 2500, 0, 'upcoming', 'Garden City edition of the Wish Me Well Tour'),
  ('London', 'O2 Academy Brixton', '2025-09-12', '20:00', 4000, 0, 'upcoming', 'International leg - London show'),
  ('Houston', 'Arena Theatre', '2025-09-26', '20:00', 3500, 0, 'upcoming', 'US Tour - Houston show')
ON CONFLICT DO NOTHING;

-- Seed auctions (one per major event)
INSERT INTO public.auctions (
  event_id, 
  title, 
  description, 
  starting_price, 
  current_price, 
  min_bid_increment,
  start_time, 
  end_time, 
  original_end_time,
  status,
  dinner_location,
  max_guests
)
SELECT 
  id,
  'Dinner with Timi Dakolo - ' || city,
  'An exclusive dinner experience with Timi Dakolo in ' || city || '. Includes a 3-course meal, photo opportunities, and intimate conversation with the artist.',
  500000.00,
  500000.00,
  10000.00,
  event_date - INTERVAL '14 days',
  event_date - INTERVAL '7 days',
  event_date - INTERVAL '7 days',
  'upcoming',
  city,
  2
FROM public.tour_events
WHERE status = 'upcoming'
ON CONFLICT DO NOTHING;
