"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  PostsApiClient,
  type Post,
  type PostsApiResponse,
} from "@/lib/posts-api-client";
import { RefreshCw } from "lucide-react";

interface SocialFeedProps {
  apiUrl: string;
  apiKey: string;
}

interface SourceStyle {
  name: string;
  badgeClass: string;
  buttonActiveClass: string;
}

const getSourceStyle = (source: string): SourceStyle => {
  switch (source) {
    case "bluesky":
      return {
        name: "Bluesky",
        badgeClass: "bg-[#0085ff]/10 text-[#0085ff]",
        buttonActiveClass: "bg-[#0085ff] text-white",
      };
    case "mastodon":
      return {
        name: "Mastodon",
        badgeClass: "bg-[#6364ff]/10 text-[#6364ff]",
        buttonActiveClass: "bg-[#6364ff] text-white",
      };
    case "microblog":
      return {
        name: "Micro.blog",
        badgeClass: "bg-[#ff8800]/10 text-[#ff8800]",
        buttonActiveClass: "bg-[#ff8800] text-white",
      };
    default:
      return {
        name: source,
        badgeClass: "bg-muted text-muted-foreground",
        buttonActiveClass: "bg-primary text-primary-foreground",
      };
  }
};

const getPostUrl = (post: Post): string => {
  if (post.metadata?.url && typeof post.metadata.url === "string") {
    return post.metadata.url;
  }

  switch (post.source) {
    case "bluesky":
      if (post.post_id) {
        const parts = post.post_id.split("/");
        const slug = parts[parts.length - 1];
        return `https://bsky.app/profile/gabby.gay/post/${slug}`;
      }
      break;
    case "mastodon":
      if (post.metadata?.instance && post.post_id) {
        const instance = post.metadata.instance as string;
        const username = (post.metadata.username as string) || "user";
        return `https://${instance}/@${username}/${post.post_id}`;
      }
      break;
  }

  return "#";
};

function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const sourceStyle = getSourceStyle(post.source);
  const postUrl = getPostUrl(post);

  return (
    <article
      className={cn(
        "bg-card border border-border rounded-lg p-5",
        "transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5",
        "hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
              sourceStyle.badgeClass
            )}
          >
            {sourceStyle.name}
          </span>
        </a>
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      </div>

      <div
        className="prose prose-sm max-w-none text-foreground [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.media_urls && post.media_urls.length > 0 && (
        <div
          className={cn(
            "mt-4 grid gap-2",
            post.media_urls.length > 1 ? "grid-cols-2" : ""
          )}
        >
          {post.media_urls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt=""
              className="rounded-lg max-w-full h-auto border border-border"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </article>
  );
}

export function SocialFeed({ apiUrl, apiKey }: SocialFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSource, setCurrentSource] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [client, setClient] = useState<PostsApiClient | null>(null);

  // Initialize client on mount
  useEffect(() => {
    if (apiUrl && apiKey && typeof window !== "undefined") {
      setClient(new PostsApiClient(apiUrl, apiKey));
    } else {
      setError("API configuration is missing");
      setLoading(false);
    }
  }, [apiUrl, apiKey]);

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page") || "1");
    const source = urlParams.get("source") || "all";
    setCurrentPage(page);
    setCurrentSource(source);
  }, []);

  // Update URL without page reload
  const updateUrl = (page: number, source: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("source", source);
    window.history.pushState({}, "", url);
  };

  // Fetch posts
  const fetchPosts = async (page: number, source: string) => {
    if (!client) {
      setError("API client not initialized");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: PostsApiResponse = await client.fetchPosts({
        source: source as "all" | "bluesky" | "mastodon" | "microblog",
        page,
        limit: 20,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch posts");
      }

      setPosts(response.data.posts);
      setPagination(response.data.pagination);
      updateUrl(page, source);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when page or source changes
  useEffect(() => {
    if (client) {
      fetchPosts(currentPage, currentSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentSource, client]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get("page") || "1");
      const source = urlParams.get("source") || "all";
      setCurrentPage(page);
      setCurrentSource(source);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSourceChange = (source: string) => {
    setCurrentSource(source);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sources = [
    { key: "all", label: "All" },
    { key: "bluesky", label: "Bluesky" },
    { key: "mastodon", label: "Mastodon" },
    { key: "microblog", label: "Micro.blog" },
  ];

  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full"
          role="status"
          aria-label="loading"
        />
        <p className="mt-4 text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-accent mb-4">Failed to load posts: {error}</p>
        <button
          onClick={() => fetchPosts(currentPage, currentSource)}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 transition-opacity"
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Source filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {sources.map(({ key, label }) => {
          const isActive = key === currentSource;
          const sourceStyle = getSourceStyle(key);

          return (
            <button
              key={key}
              onClick={() => handleSourceChange(key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive
                  ? sourceStyle.buttonActiveClass
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No posts found. Check back later!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className={cn(
              "px-5 py-2.5 rounded-lg font-medium transition-all duration-200",
              "bg-primary text-primary-foreground",
              "hover:opacity-90",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            ← Previous
          </button>
          <span className="text-muted-foreground tabular-nums">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className={cn(
              "px-5 py-2.5 rounded-lg font-medium transition-all duration-200",
              "bg-primary text-primary-foreground",
              "hover:opacity-90",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default SocialFeed;



