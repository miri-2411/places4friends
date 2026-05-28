import ProfileView from "@/components/ProfileView";

export default async function ProfilePage() {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    const json = await res.json();
    const user = json?.user ?? null;
    return <ProfileView user={user} />;
  } catch (err) {
    return <ProfileView user={null} />;
  }
}
