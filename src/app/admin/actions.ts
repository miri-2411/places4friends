"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function checkAdminStatus(): Promise<{ isAdmin: boolean; email?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { isAdmin: false };
    }

    const adminEmailsStr = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsStr.split(",").map((e) => e.trim().toLowerCase());
    const isAdmin = adminEmails.includes(user.email.toLowerCase());

    return { isAdmin, email: user.email };
  } catch (error) {
    console.error("Fehler bei der Admin-Prüfung:", error);
    return { isAdmin: false };
  }
}

export async function getAdminData() {
  const { isAdmin } = await checkAdminStatus();
  if (!isAdmin) {
    throw new Error("Nicht autorisiert. Zugriff verweigert.");
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    throw new Error("Supabase-Admin-Client konnte nicht initialisiert werden.");
  }

  // Fetch counts from different tables
  const [
    usersRes,
    activitiesRes,
    wishlistRes,
    friendshipsRes,
    invitesRes,
    commentsRes,
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("activities").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("wishlist").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("friendships").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("friend_invite_links").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("activity_comments").select("*", { count: "exact", head: true }),
  ]);

  if (usersRes.error) throw usersRes.error;
  if (activitiesRes.error) throw activitiesRes.error;

  // Fetch all friendships to count status breakdown
  const { data: friendshipsData } = await supabaseAdmin
    .from("friendships")
    .select("status");

  const pendingFriendships = friendshipsData?.filter((f) => f.status === "pending").length || 0;
  const acceptedFriendships = friendshipsData?.filter((f) => f.status === "accepted").length || 0;

  // Fetch invite links usage
  const { data: invitesData } = await supabaseAdmin
    .from("friend_invite_links")
    .select("use_count, max_uses");

  const totalInviteUses = invitesData?.reduce((sum, item) => sum + (item.use_count || 0), 0) || 0;

  // Fetch profiles
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, username, full_name, created_at, avatar_url")
    .order("created_at", { ascending: false });

  if (profilesError) throw profilesError;

  // Fetch auth users to map emails
  const { data: authUsersRes, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();
  if (authUsersError) throw authUsersError;
  const authUsers = authUsersRes.users || [];

  // Fetch all activities
  const { data: allActivities, error: actError } = await supabaseAdmin
    .from("activities")
    .select("id, user_id, place_name, place_address, categories, is_superlike, created_at, image_urls, description")
    .order("created_at", { ascending: false });

  if (actError) throw actError;

  const userActivityCounts = allActivities.reduce((acc: Record<string, number>, curr) => {
    if (curr.user_id) {
      acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
    }
    return acc;
  }, {});

  // Compute category distribution and superlikes
  const categoryCounts: Record<string, number> = {};
  let totalSuperlikes = 0;
  allActivities.forEach((act) => {
    if (act.is_superlike) totalSuperlikes++;
    if (Array.isArray(act.categories)) {
      act.categories.forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    }
  });

  // Enrich user profiles
  const enrichedUsers = profiles.map((p) => {
    const authUser = authUsers.find((au) => au.id === p.id);
    return {
      id: p.id,
      username: p.username || "Kein Username",
      full_name: p.full_name || "Kein Name",
      avatar_url: p.avatar_url,
      created_at: p.created_at,
      email: authUser?.email || "Keine E-Mail",
      activityCount: userActivityCounts[p.id] || 0,
    };
  });

  // Enrich activities
  const enrichedActivities = allActivities.map((act) => {
    const creator = profiles.find((p) => p.id === act.user_id);
    return {
      id: act.id,
      place_name: act.place_name,
      place_address: act.place_address || "",
      categories: Array.isArray(act.categories) ? act.categories : [],
      is_superlike: act.is_superlike,
      created_at: act.created_at,
      image_urls: Array.isArray(act.image_urls) ? act.image_urls : [],
      description: act.description || "",
      user: creator
        ? {
            id: creator.id,
            username: creator.username || "Kein Username",
            full_name: creator.full_name || "Kein Name",
            avatar_url: creator.avatar_url,
          }
        : null,
    };
  });

  // Fetch invite links
  const { data: rawInvites, error: invitesErr } = await supabaseAdmin
    .from("friend_invite_links")
    .select("id, creator_id, token, use_count, max_uses, expires_at, created_at")
    .order("created_at", { ascending: false });

  if (invitesErr) throw invitesErr;

  const enrichedInvites = rawInvites.map((inv) => {
    const creator = profiles.find((p) => p.id === inv.creator_id);
    return {
      id: inv.id,
      token: inv.token,
      use_count: inv.use_count,
      max_uses: inv.max_uses,
      expires_at: inv.expires_at,
      created_at: inv.created_at,
      creator: creator
        ? {
            id: creator.id,
            username: creator.username || "Kein Username",
            full_name: creator.full_name || "Kein Name",
          }
        : null,
    };
  });

  return {
    stats: {
      users: usersRes.count || 0,
      activities: activitiesRes.count || 0,
      wishlist: wishlistRes.count || 0,
      friendships: friendshipsRes.count || 0,
      pendingFriendships,
      acceptedFriendships,
      invites: invitesRes.count || 0,
      inviteUses: totalInviteUses,
      comments: commentsRes.count || 0,
      superlikes: totalSuperlikes,
    },
    categoryCounts,
    users: enrichedUsers,
    activities: enrichedActivities,
    invites: enrichedInvites,
  };
}

export async function deleteActivityAdmin(activityId: string) {
  const { isAdmin } = await checkAdminStatus();
  if (!isAdmin) {
    throw new Error("Nicht autorisiert. Zugriff verweigert.");
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    throw new Error("Supabase-Admin-Client konnte nicht initialisiert werden.");
  }

  // Fetch image URLs to clean storage
  const { data: activity } = await supabaseAdmin
    .from("activities")
    .select("image_urls")
    .eq("id", activityId)
    .maybeSingle();

  // 1. Delete associated activity comments
  const { error: commentsError } = await supabaseAdmin
    .from("activity_comments")
    .delete()
    .eq("activity_id", activityId);

  if (commentsError) {
    console.error("Admin-Fehler beim Löschen der Kommentare:", commentsError);
  }

  // 2. Delete associated wishlist entries
  const { error: wishlistError } = await supabaseAdmin
    .from("wishlist")
    .delete()
    .eq("activity_id", activityId);

  if (wishlistError) {
    console.error("Admin-Fehler beim Löschen der Wunschliste:", wishlistError);
  }

  // 3. Delete the activity itself
  const { data, error } = await supabaseAdmin
    .from("activities")
    .delete()
    .eq("id", activityId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Admin-Fehler beim Löschen der Aktivität:", error);
    throw new Error("Empfehlung konnte nicht gelöscht werden.");
  }

  if (!data) {
    throw new Error("Empfehlung nicht gefunden.");
  }

  // Clean up storage files if present
  if (activity?.image_urls && activity.image_urls.length > 0) {
    const fileNames = activity.image_urls.map((url: string) => {
      const parts = url.split("/");
      return parts[parts.length - 1];
    });
    if (fileNames.length > 0) {
      const { error: storageErr } = await supabaseAdmin.storage
        .from("activity-images")
        .remove(fileNames);
      if (storageErr) {
        console.error("Admin-Fehler beim Löschen der Bilder aus dem Storage:", storageErr);
      }
    }
  }

  return { success: true, id: activityId };
}

export async function deleteInviteLinkAdmin(linkId: string) {
  const { isAdmin } = await checkAdminStatus();
  if (!isAdmin) {
    throw new Error("Nicht autorisiert. Zugriff verweigert.");
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    throw new Error("Supabase-Admin-Client konnte nicht initialisiert werden.");
  }

  const { error } = await supabaseAdmin
    .from("friend_invite_links")
    .delete()
    .eq("id", linkId);

  if (error) {
    console.error("Admin-Fehler beim Löschen des Einladungslinks:", error);
    throw new Error("Einladungslink konnte nicht gelöscht werden.");
  }

  return { success: true, id: linkId };
}
