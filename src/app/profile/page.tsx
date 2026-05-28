import ProfileView from "@/components/ProfileView";
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get('token')?.value;
  const user = await getUserFromToken(tokenCookie);

  return <ProfileView user={user} />;
}
