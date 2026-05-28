import ProfileView from "@/components/ProfileView";

export default async function ProfilePage() {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
    const url = new URL('/api/auth/me', base).toString();
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    const user = json?.user ?? null;
    return <ProfileView user={user} />;
  } catch (err) {
    return <ProfileView user={null} />;
  }
}
