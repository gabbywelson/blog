import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, BookOpen, User } from "lucide-react";
import { format } from "date-fns";

export default function HomePage() {
  const posts = getAllPosts();
  const latestPost = posts[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-primary">Digital</span>{" "}
          <span className="text-secondary">Garden</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A soft corner of the internet where ideas bloom, evolve, and
          occasionally wither. Welcome to my garden.
        </p>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Now Block - Large */}
        <div
          className={cn(
            "md:col-span-2 lg:col-span-2",
            "bg-card border border-border rounded-lg p-8",
            "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
            "hover:border-primary/30"
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-semibold">Now</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Currently exploring the intersection of design systems and
              developer experience. Building tools that spark joy.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Rebuilding my personal site with Next.js 15
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Reading "A Philosophy of Software Design"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Learning Rust for systems programming
              </li>
            </ul>
          </div>
          <p className="mt-6 text-sm text-muted-foreground/60">
            Last updated: November 2024
          </p>
        </div>

        {/* About Block */}
        <div
          className={cn(
            "bg-card border border-border rounded-lg p-8",
            "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
            "hover:border-primary/30"
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-semibold">About</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Senior full-stack engineer who believes great software is grown, not
            built. I craft experiences at the intersection of code and design.
          </p>
          <Link
            href="/about"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium",
              "text-primary hover:text-primary/80 transition-colors"
            )}
          >
            Learn more about me
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Latest Post Block */}
        {latestPost && (
          <div
            className={cn(
              "md:col-span-2 lg:col-span-3",
              "bg-card border border-border rounded-lg p-8",
              "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
              "hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-semibold">Latest Post</h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Link
                  href={`/posts/${latestPost.slug}`}
                  className="font-serif text-xl font-medium hover:text-primary transition-colors"
                >
                  {latestPost.title}
                </Link>
                <p className="text-muted-foreground mt-2 line-clamp-2">
                  {latestPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(latestPost.date), "MMMM d, yyyy")}
                  </time>
                  <div className="flex gap-2">
                    {latestPost.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href={`/posts/${latestPost.slug}`}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                  "bg-primary text-primary-foreground font-medium",
                  "hover:opacity-90 transition-opacity"
                )}
              >
                Read post
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div
          className={cn(
            "lg:col-span-3",
            "bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10",
            "border border-border rounded-lg p-8"
          )}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl font-semibold mb-2">
                Explore the garden
              </h3>
              <p className="text-muted-foreground">
                Browse all posts, or jump to a specific topic.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/posts"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium",
                  "bg-card border border-border",
                  "hover:border-primary/30 hover:bg-primary/5 transition-all"
                )}
              >
                All Posts
              </Link>
              <Link
                href="/posts?tag=thoughts"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium",
                  "bg-card border border-border",
                  "hover:border-secondary/30 hover:bg-secondary/5 transition-all"
                )}
              >
                Thoughts
              </Link>
              <Link
                href="/posts?tag=code"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium",
                  "bg-card border border-border",
                  "hover:border-accent/30 hover:bg-accent/5 transition-all"
                )}
              >
                Code
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
