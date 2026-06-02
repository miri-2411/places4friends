import type { Metadata } from "next";
import PublicProfilePageClient from "@/app/profile/[id]/PublicProfilePageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil auf places4friends ansehen.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invite?: string }>;
}) {
  const { id: friendId } = await params;
  const sParams = await searchParams;
  const inviteToken =
    sParams.invite && sParams.invite !== "true" ? sParams.invite : null;

  return (
    <PublicProfilePageClient
      friendId={friendId}
      inviteToken={inviteToken}
    />
  );
}
