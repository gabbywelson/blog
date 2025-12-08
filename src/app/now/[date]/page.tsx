import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNowEntries, getNowEntryByDate } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { components } from "@/components/MDXComponents";
import { mdxOptions } from "@/lib/mdx-options";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
	params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
	const entries = getAllNowEntries();
	return entries.map((entry) => ({ date: entry.date }));
}

export async function generateMetadata({ params }: PageProps) {
	const { date } = await params;
	const entry = getNowEntryByDate(date);

	if (!entry) {
		return { title: "Entry Not Found" };
	}

	return {
		title: `Now - ${format(
			new Date(entry.date),
			"MMMM d, yyyy",
		)} | Gabby's Garden`,
		description: `What I was up to on ${format(
			new Date(entry.date),
			"MMMM d, yyyy",
		)}`,
	};
}

export default async function NowEntryPage({ params }: PageProps) {
	const { date } = await params;
	const entry = getNowEntryByDate(date);

	if (!entry) {
		notFound();
	}

	return (
		<article className="max-w-3xl mx-auto px-6 py-12">
			{/* Back link */}
			<Link
				href="/now"
				className={cn(
					"inline-flex items-center gap-2 text-sm font-medium mb-8",
					"text-muted-foreground hover:text-foreground transition-colors",
				)}
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Now
			</Link>

			{/* Header */}
			<header className="mb-12">
				<h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Then</h1>
				<p className="text-xl text-muted-foreground">
					{format(new Date(entry.date), "MMMM d, yyyy")}
				</p>
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
					"prose-img:rounded-lg",
				)}
			>
				<MDXRemote
					source={entry.content}
					components={components}
					options={{ mdxOptions }}
				/>
			</div>
		</article>
	);
}

