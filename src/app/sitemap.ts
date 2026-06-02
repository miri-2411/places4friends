import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : "https://places4friends.com";

  const staticRoutes = [
    "",
    "/login",
    "/register",
    "/impressum",
    "/datenschutz",
    "/agb",
    "/activities",
    "/profile",
    "/profile/friends",
    "/profile/settings",
    "/create",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));
}
