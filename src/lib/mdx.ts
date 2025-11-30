import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");
const pagesDirectory = path.join(process.cwd(), "src/content/pages");

export interface PostMeta {
  title: string;
  date: string;
  tags: string[];
  slug: string;
  excerpt: string;
  image?: string;
}

export interface Post extends PostMeta {
  content: string;
}

/**
 * Recursively find all MDX files in a directory and its subdirectories
 */
function findMdxFiles(dir: string, baseDir: string = dir): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recursively search subdirectories
      files.push(...findMdxFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      // Get the relative path from the base directory and convert to slug
      const relativePath = path.relative(baseDir, fullPath);
      const slug = relativePath.replace(/\.mdx$/, "");
      files.push(slug);
    }
  }

  return files;
}

export function getAllPosts(): PostMeta[] {
  const slugs = findMdxFiles(postsDirectory);

  const posts = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      excerpt: data.excerpt || "",
      image: data.image,
    };
  });

  // Sort by date, newest first
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  // Handle both single segment and multi-segment slugs
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    excerpt: data.excerpt || "",
    image: data.image,
    content,
  };
}

export function getAllPostSlugs(): string[][] {
  const slugs = findMdxFiles(postsDirectory);
  // Return as array of slug segments for catch-all routes
  return slugs.map((slug) => slug.split("/"));
}

export function getPageBySlug(slug: string): Post | null {
  const fullPath = path.join(pagesDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    excerpt: data.excerpt || "",
    content,
  };
}

export function getAllPageSlugs(): string[] {
  if (!fs.existsSync(pagesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}
