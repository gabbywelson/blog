import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";

export const metadata = {
  title: "Posts | Digital Garden",
  description: "All posts from the digital garden",
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Posts
        </h1>
        <p className="text-xl text-muted-foreground">
          Thoughts, explorations, and notes from the garden. Some are seedlings,
          others are well-tended evergreens.
        </p>
      </header>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No posts yet. The garden is still being planted.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className={cn(
                "group bg-card border border-border rounded-lg p-6",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "hover:border-primary/30"
              )}
            >
              <Link href={`/posts/${post.slug}`} className="block">
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
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

