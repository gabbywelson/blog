import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getNoteBySlug, getAllNoteSlugs } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { components } from "@/components/MDXComponents";
import { mdxOptions } from "@/lib/mdx-options";
import { getPostHogClient } from "@/lib/posthog-server";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    return { title: "Note Not Found" };
  }

  return {
    title: `${note.title} | Notes`,
    description: note.excerpt,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  // Track note view on server-side
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: "anonymous",
    event: "note_viewed",
    properties: {
      note_slug: slug,
      note_title: note.title,
    },
  });
  await posthog.shutdown();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link
        href="/notes"
        className={cn(
          "inline-flex items-center gap-2 text-sm font-medium mb-8",
          "text-muted-foreground hover:text-foreground transition-colors"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to notes
      </Link>

      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
          {note.title}
        </h1>
      </header>

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
        <MDXRemote
          source={note.content}
          components={components}
          options={{ mdxOptions }}
        />
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            This is an evergreen note from my digital garden.
          </p>
          <Link
            href="/notes"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-primary text-primary-foreground font-medium",
              "hover:opacity-90 transition-opacity"
            )}
          >
            Browse all notes
          </Link>
        </div>
      </footer>
    </article>
  );
}

