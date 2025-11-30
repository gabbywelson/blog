import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPageBySlug, getAllPageSlugs } from "@/lib/mdx";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: `${page.title} | Digital Garden`,
    description: page.excerpt || `${page.title} - Digital Garden`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="text-xl text-muted-foreground">{page.excerpt}</p>
        )}
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
          "prose-hr:border-border",
          // Images
          "prose-img:rounded-lg"
        )}
      >
        <MDXRemote source={page.content} />
      </div>
    </article>
  );
}

