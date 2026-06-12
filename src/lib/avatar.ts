import { createClient } from "@/lib/supabase/client";

/**
 * Returns the public URL for a user's avatar.
 * If the avatar path is already a full external URL (e.g. from Google OAuth), it returns it directly.
 * Otherwise, it retrieves the public URL from the Supabase "avatars" storage bucket.
 */
export function getAvatarUrl(path: string | null | undefined, cacheBust = false): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const supabase = createClient();
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  if (!data?.publicUrl) return null;
  return cacheBust ? `${data.publicUrl}?t=${Date.now()}` : data.publicUrl;
}
