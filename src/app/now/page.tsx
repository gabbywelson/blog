import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNowEntries, getLatestNowEntry } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { components } from "@/components/MDXComponents";
import { mdxOptions } from "@/lib/mdx-options";
import { format } from "date-fns";
import Link from "next/link";

export const metadata = {
  title: "Now | Gabby's Garden",
  description: "What I'm up to right now.",
};

export default function NowPage() {
  const latestEntry = getLatestNowEntry();
  const allEntries = getAllNowEntries();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Now</h1>
        <p className="text-xl text-muted-foreground">
          What I&apos;m up to right now.
        </p>
      </header>

      {/* Latest Entry Content */}
      {latestEntry && (
        <>
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
              "prose-hr:border-border",
              // Images
              "prose-img:rounded-lg"
            )}
          >
            <MDXRemote
              source={latestEntry.content}
              components={components}
              options={{ mdxOptions }}
            />
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Last updated: {format(new Date(latestEntry.date), "MMMM d, yyyy")}
          </p>
        </>
      )}

      {/* Previous Updates */}
      {allEntries.length > 1 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="font-serif text-2xl font-semibold mb-6">
            Previous Updates
          </h2>
          <ul className="space-y-2">
            {allEntries.slice(1).map((entry) => (
              <li key={entry.date} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <span className="text-muted-foreground">
                  <Link href={`/now/${entry.date}`}>
                    {format(new Date(entry.date), "MMMM d, yyyy")}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

