import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Tag, X } from "lucide-react";

export const metadata = {
  title: "Posts | Digital Garden",
  description: "All posts from the digital garden",
};

interface PostsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { tag: activeTag } = await searchParams;
  const allPosts = getAllPosts();
  const allTags = getAllTags();

  // Filter posts by tag if one is selected
  const posts = activeTag
    ? allPosts.filter((post) => post.tags.includes(activeTag))
    : allPosts;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          {activeTag ? `Posts tagged "${activeTag}"` : "Posts"}
        </h1>
        <p className="text-xl text-muted-foreground">
          Thoughts, explorations, and notes from the garden. Some are seedlings,
          others are well-tended evergreens.
        </p>

        {/* Tag Filter */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            href="/posts"
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              !activeTag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </Link>
          {allTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tag} ({count})
            </Link>
          ))}
        </div>

        {/* Active filter indicator */}
        {activeTag && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {posts.length} post{posts.length !== 1 ? "s" : ""} with tag:
            </span>
            <Link
              href="/posts"
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm",
                "bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              )}
            >
              {activeTag}
              <X className="w-3 h-3" />
            </Link>
          </div>
        )}
      </header>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {activeTag
              ? `No posts found with tag "${activeTag}".`
              : "No posts yet. The garden is still being planted."}
          </p>
          {activeTag && (
            <Link
              href="/posts"
              className="mt-4 inline-block text-primary hover:underline"
            >
              View all posts
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className={cn(
                "group bg-card border border-border rounded-lg overflow-hidden",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "hover:border-primary/30"
              )}
            >
              <Link
                href={`/posts/${post.slug}`}
                className={cn(
                  "block",
                  post.image && "md:flex md:items-stretch"
                )}
              >
                {post.image && (
                  <div className="relative w-full md:w-72 lg:w-80 shrink-0 aspect-[16/9] md:aspect-auto">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-center">
                  <h2 className="font-serif text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "px-2 py-0.5 rounded-full",
                                activeTag === tag
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
