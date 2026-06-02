import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : "https://places4friends.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile/", "/activities/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
