-- Grant select, insert, update, and delete privileges on user tables to service_role
-- to support admin panel operations that bypass RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlist TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_comments TO service_role;
