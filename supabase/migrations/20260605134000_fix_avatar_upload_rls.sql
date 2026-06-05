-- Drop the existing policies for avatars on storage.objects
DROP POLICY IF EXISTS "Users can upload their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;

-- Recreate with folder-based (path-based) check using split_part
CREATE POLICY "Users can upload their own avatar."
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (split_part(name, '/', 1) = auth.uid()::text)
);

CREATE POLICY "Users can update their own avatar."
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (split_part(name, '/', 1) = auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (split_part(name, '/', 1) = auth.uid()::text)
);

CREATE POLICY "Users can delete their own avatar."
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (split_part(name, '/', 1) = auth.uid()::text)
);

-- Public SELECT access for both public buckets to prevent select/upsert errors
DROP POLICY IF EXISTS "Public SELECT access for avatars" ON storage.objects;
CREATE POLICY "Public SELECT access for avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public SELECT access for activity-images" ON storage.objects;
CREATE POLICY "Public SELECT access for activity-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'activity-images');
