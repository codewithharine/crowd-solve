-- Remove email column from profiles table to prevent public exposure
-- Email is already securely stored in auth.users and doesn't need to be duplicated

-- First, update the handle_new_user function to not insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Then remove the email column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;