"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";

interface TagFilterProps {
  tag: string;
  count: number;
  isActive: boolean;
}

export function TagFilter({ tag, count, isActive }: TagFilterProps) {
  return (
    <Link
      href={`/posts?tag=${encodeURIComponent(tag)}`}
      onClick={() => {
        // Track tag filter click
        posthog.capture("tag_filtered", {
          tag: tag,
          tag_count: count,
        });
      }}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {tag} ({count})
    </Link>
  );
}
