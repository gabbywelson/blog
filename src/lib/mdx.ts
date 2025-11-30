import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");
const pagesDirectory = path.join(process.cwd(), "src/content/pages");
const nowDirectory = path.join(process.cwd(), "src/content/now");

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

// Now entries
export interface NowEntry {
  date: string;
  content: string;
}

export function getAllNowEntries(): NowEntry[] {
  if (!fs.existsSync(nowDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(nowDirectory);
  const entries = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const fullPath = path.join(nowDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const dateSlug = fileName.replace(/\.mdx$/, "");

      return {
        date: data.date || dateSlug,
        content,
      };
    });

  // Sort by date, newest first
  return entries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getLatestNowEntry(): NowEntry | null {
  const entries = getAllNowEntries();
  return entries.length > 0 ? entries[0] : null;
}

export function getNowEntryByDate(date: string): NowEntry | null {
  const fullPath = path.join(nowDirectory, `${date}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    date: data.date || date,
    content,
  };
}

/**
 * Extract bullet points from MDX content
 * Returns an array of bullet point text (without the leading - or *)
 */
export function extractBulletPoints(content: string): string[] {
  const lines = content.split("\n");
  const bullets: string[] = [];

  for (const line of lines) {
    const match = line.match(/^[-*]\s+(.+)/);
    if (match) {
      // Get the first line of the bullet (in case it spans multiple lines)
      bullets.push(match[1].trim());
    }
  }

  return bullets;
}
