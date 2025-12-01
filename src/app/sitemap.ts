import type { MetadataRoute } from "next";
import { getAllPosts, getAllPageSlugs, getAllNotes, getAllNowEntries } from "@/lib/mdx";

const SITE_URL = process.env.SITE_URL || "https://gabbybloom.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const pageSlugs = getAllPageSlugs();
  const notes = getAllNotes();
  const nowEntries = getAllNowEntries();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/now`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic pages (about, uses, colophon, etc.)
  const dynamicPages: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog posts
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  // Notes
  const notePages: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${SITE_URL}/notes/${note.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Now entries
  const nowPages: MetadataRoute.Sitemap = nowEntries.map((entry) => ({
    url: `${SITE_URL}/now/${entry.date}`,
    lastModified: new Date(entry.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...dynamicPages, ...postPages, ...notePages, ...nowPages];
}

