import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostSlugs } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { components } from "@/components/MDXComponents";
import { mdxOptions } from "@/lib/mdx-options";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Digital Garden`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link
        href="/posts"
        className={cn(
          "inline-flex items-center gap-2 text-sm font-medium mb-8",
          "text-muted-foreground hover:text-foreground transition-colors"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to posts
      </Link>

      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {post.image && (
        <div className="relative w-full aspect-[2/1] mb-12 rounded-xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "prose prose-lg max-w-none",
          // Headings
          "prose-headings:font-serif prose-headings:font-semibold",
          // Links
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          // Code blocks
          "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg",
          "prose-code:text-accent prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
          // Blockquotes
          "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic",
          // Lists
          "prose-li:marker:text-primary",
          // Horizontal rules
          "prose-hr:border-border"
        )}
      >
        <MDXRemote source={post.content} components={components} options={{ mdxOptions }} />
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Thanks for reading! This post is part of my digital garden.
          </p>
          <Link
            href="/posts"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-primary text-primary-foreground font-medium",
              "hover:opacity-90 transition-opacity"
            )}
          >
            Explore more posts
          </Link>
        </div>
      </footer>
    </article>
  );
}

