import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : "https://places4friends.com";

  // Static routes in the app
  const staticRoutes = [
    "",
    "/login",
    "/register",
    "/impressum",
    "/datenschutz",
    "/activities",
    "/profile",
    "/profile/friends",
    "/profile/settings",
    "/create",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic profiles from the database
  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, created_at");

    if (!error && profiles) {
      profileRoutes = profiles.map((p) => ({
        url: `${baseUrl}/profile/${p.id}`,
        lastModified: p.created_at ? new Date(p.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Error generating profile sitemap routes:", err);
  }

  // Fetch dynamic activities from the database
  let activityRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: activities, error } = await supabase
      .from("activities")
      .select("id, created_at");

    if (!error && activities) {
      activityRoutes = activities.map((a) => ({
        url: `${baseUrl}/activities/${a.id}`,
        lastModified: a.created_at ? new Date(a.created_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Error generating activity sitemap routes:", err);
  }

  return [...staticRoutes, ...profileRoutes, ...activityRoutes];
}
