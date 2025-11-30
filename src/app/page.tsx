import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getAllTags,
  getLatestNowEntry,
  extractBulletPoints,
} from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, BookOpen, User } from "lucide-react";
import { format } from "date-fns";
import { Hero } from "@/components/Hero";

// Colors for tag buttons
const tagColors = [
  "hover:border-secondary/30 hover:bg-secondary/5",
  "hover:border-accent/30 hover:bg-accent/5",
  "hover:border-primary/30 hover:bg-primary/5",
];

// Bullet colors for the Now section
const bulletColors = [
  "bg-secondary",
  "bg-primary",
  "bg-accent",
  "bg-muted-foreground",
];

export default function HomePage() {
  const posts = getAllPosts();
  const latestPost = posts[0];
  const tags = getAllTags().slice(0, 6); // Get top 6 tags

  // Get latest now entry and extract bullet points
  const latestNowEntry = getLatestNowEntry();
  const nowBullets = latestNowEntry
    ? extractBulletPoints(latestNowEntry.content).slice(0, 4)
    : [];

  return (
    <>
      <Hero />
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Now Block - Large */}
          <Link
            href="/now"
            className={cn(
              "md:col-span-2 lg:col-span-2",
              "bg-card border border-border rounded-lg p-8",
              "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
              "hover:border-primary/30",
              "block"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-semibold">Now</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              {nowBullets.length > 0 ? (
                <ul className="space-y-2">
                  {nowBullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full mt-2 shrink-0",
                          bulletColors[index % bulletColors.length]
                        )}
                      />
                      <span className="line-clamp-2">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Check out what I&apos;m up to right now.</p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between">
              {latestNowEntry && (
                <p className="text-sm text-muted-foreground/60">
                  Last updated:{" "}
                  {format(new Date(latestNowEntry.date), "MMMM d, yyyy")}
                </p>
              )}
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium",
                  "text-primary"
                )}
              >
                See more
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

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
              I&apos;m an east coast gal living in SF with my partner and our
              two cats. I like to write good code, cook good food, and spend
              time exploring my beautiful city.
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
                "bg-card border border-border rounded-lg overflow-hidden",
                "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
                "hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "flex flex-col",
                  latestPost.image ? "lg:flex-row" : ""
                )}
              >
                {/* Post Image */}
                {latestPost.image && (
                  <div className="relative lg:w-2/5 aspect-video lg:aspect-auto lg:min-h-[280px] shrink-0">
                    <Image
                      src={latestPost.image}
                      alt={latestPost.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-transparent to-card/20" />
                  </div>
                )}

                {/* Post Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <h2 className="font-serif text-2xl font-semibold">
                      Latest Post
                    </h2>
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
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div
            className={cn(
              "lg:col-span-3",
              "bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10",
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
                {tags.map(({ tag }, index) => (
                  <Link
                    key={tag}
                    href={`/posts?tag=${encodeURIComponent(tag)}`}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium",
                      "bg-card border border-border",
                      "transition-all",
                      tagColors[index % tagColors.length]
                    )}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
