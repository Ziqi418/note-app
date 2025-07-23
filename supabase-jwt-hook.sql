-- Since we can't create functions in auth schema, let's use a different approach
-- We'll create an Edge Function instead for JWT customization

-- For now, let's clean up and use the working trigger approach
-- but store claims in app_metadata which gets included in JWT

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's app_metadata with Hasura claims
  -- This will be included in the JWT's app_metadata section
  UPDATE auth.users 
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
    'https://hasura.io/jwt/claims', jsonb_build_object(
      'x-hasura-allowed-roles', jsonb_build_array('user'),
      'x-hasura-default-role', 'user',
      'x-hasura-user-id', NEW.id::text
    )
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();