import { NextResponse } from "next/server";
import { createApiClient, getApiUser } from "@/lib/supabase/apiAuth";

function publicStorageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

function enrichActivityImages(imageUrls: string[] | null) {
  const paths = Array.isArray(imageUrls) ? imageUrls : [];
  return paths.map((path) => ({
    path,
    publicUrl: publicStorageUrl("activity-images", path),
  }));
}

export async function GET(request: Request) {
  const user = await getApiUser(request);
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const supabase = await createApiClient(request);
  const userId = user.id;

  const [
    profileResult,
    activitiesResult,
    commentsResult,
    friendshipsResult,
    wishlistResult,
    inviteLinksResult,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("activities").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("activity_comments").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("friendships")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false }),
    supabase.from("wishlist").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("friend_invite_links")
      .select("*")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const errors = [
    profileResult.error,
    activitiesResult.error,
    commentsResult.error,
    friendshipsResult.error,
    wishlistResult.error,
    inviteLinksResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("User export failed:", errors);
    return NextResponse.json({ error: "Export fehlgeschlagen." }, { status: 500 });
  }

  const profile = profileResult.data;
  const activities = (activitiesResult.data ?? []).map((activity) => ({
    ...activity,
    imageFiles: enrichActivityImages(activity.image_urls),
  }));

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    },
    profile: profile
      ? {
          ...profile,
          avatarFile: profile.avatar_url
            ? {
                path: profile.avatar_url,
                publicUrl: publicStorageUrl("avatars", profile.avatar_url),
              }
            : null,
        }
      : null,
    activities,
    comments: commentsResult.data ?? [],
    friendships: friendshipsResult.data ?? [],
    wishlist: wishlistResult.data ?? [],
    friendInviteLinks: inviteLinksResult.data ?? [],
  };

  const date = new Date().toISOString().slice(0, 10);
  const filename = `places4friends-export-${date}.json`;

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
