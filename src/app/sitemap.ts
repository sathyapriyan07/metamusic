import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/search",
    "/charts",
    "/genres",
    "/login",
    "/signup",
    "/profile",
    "/admin",
  ];

  return routes.map((route) => ({
    url: `https://metamusic.local${route}`,
    lastModified: new Date(),
  }));
}
