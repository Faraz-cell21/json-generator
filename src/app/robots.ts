import type { MetadataRoute } from "next";
import { ADMIN_PATH, LOGIN_PATH } from "@/lib/authRoutes";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [ADMIN_PATH, LOGIN_PATH, "/admin", "/login", "/api/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
