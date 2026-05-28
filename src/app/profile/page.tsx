import ProfileView from "@/components/ProfileView";
import AuthPrompt from "@/components/AuthPrompt";
import { createClient } from "@/lib/supabase/server";

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `vor ${days} Tagen`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `vor ${weeks} Wochen`;
  const months = Math.floor(days / 30);
  if (months < 12) return `vor ${months} Monaten`;
  const years = Math.floor(days / 365);
  return `vor ${years} Jahren`;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20 font-sans">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-center border-b border-slate-100 bg-white px-4">
          <h1 className="text-lg font-bold text-slate-900">Mein Profil</h1>
        </header>
        <AuthPrompt context="profile" />
      </div>
    );
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  const userData = {
    id: user.id,
    email: user.email ?? "",
    name: profile?.full_name ?? user.user_metadata?.full_name ?? null,
    username: profile?.username ?? user.user_metadata?.username ?? null,
  };

  const { data: activities } = await supabase
    .from("activities")
    .select("id, place_name, is_superlike, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const places = (activities ?? []).map((activity) => {
    const createdAt = activity.created_at
      ? new Date(activity.created_at)
      : new Date();
    return {
      id: activity.id,
      name: activity.place_name ?? "",
      isSuperLike: activity.is_superlike ?? false,
      review: activity.description ?? null,
      timestamp: formatRelativeTime(createdAt),
    };
  });

  return <ProfileView user={userData} places={places} />;
}
