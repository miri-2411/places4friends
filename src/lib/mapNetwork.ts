import type { SupabaseClient } from "@supabase/supabase-js";

export const MAP_PIN_LIMIT = 400;

export interface MapProfileInfo {
  name: string;
  initials: string;
  color: string;
  avatarUrl: string | null;
}

const USER_COLORS = [
  "bg-emerald-600",
  "bg-rose-500",
  "bg-amber-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-fuchsia-600",
  "bg-cyan-600",
];

export function getUserColorClass(userId: string): string {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }
  return USER_COLORS[sum % USER_COLORS.length];
}

export function profileDisplayName(profile: {
  full_name?: string | null;
  username?: string | null;
} | null): string {
  return profile?.full_name ?? profile?.username ?? "Unbekannt";
}

export function profileInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function getAvatarPublicUrl(
  supabase: SupabaseClient,
  path?: string | null
): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function getNetworkUserIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data: friendships, error } = await supabase
    .from("friendships")
    .select("sender_id, receiver_id")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) {
    throw error;
  }

  const friendIds = (friendships || []).map((friendship) =>
    friendship.sender_id === userId ? friendship.receiver_id : friendship.sender_id
  );

  return [userId, ...friendIds];
}

export async function loadProfileMap(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Map<string, MapProfileInfo>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .in("id", userIds);

  if (error) {
    throw error;
  }

  const profileMap = new Map<string, MapProfileInfo>();
  for (const profile of profiles || []) {
    const name = profileDisplayName(profile);
    profileMap.set(profile.id, {
      name,
      initials: profileInitials(name),
      color: getUserColorClass(profile.id),
      avatarUrl: getAvatarPublicUrl(supabase, profile.avatar_url),
    });
  }

  return profileMap;
}

export function profileInfoForUser(
  profileMap: Map<string, MapProfileInfo>,
  userId: string
): MapProfileInfo {
  return (
    profileMap.get(userId) ?? {
      name: "Unbekannt",
      initials: "?",
      color: "bg-slate-500",
      avatarUrl: null,
    }
  );
}
