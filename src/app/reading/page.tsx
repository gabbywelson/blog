import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink, Clock, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { articles, type Article } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const metadata: Metadata = {
	title: "Reading | Gabby's Garden",
	description: "Articles I've read and enjoyed, plus books on my shelf.",
};

// Revalidate every hour
export const revalidate = 3600;

function ArticleCard({ article }: { article: Article }) {
	return (
		<article
			className={cn(
				"group flex flex-col bg-card border border-border rounded-lg overflow-hidden",
				"transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
				"hover:border-primary/30",
			)}
		>
			{/* Image area */}
			{article.imageUrl ? (
				<div className="relative aspect-[2/1] overflow-hidden">
					<img
						src={article.imageUrl}
						alt=""
						className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
			) : (
				<div className="relative aspect-[3/1] overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
						<div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
						<div className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
						<div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-secondary/10 rounded-full blur-2xl" />
					</div>
				</div>
			)}

			{/* Content */}
			<div className="flex flex-col flex-1 p-5">
				<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
					{article.siteName && (
						<span className="font-medium">{article.siteName}</span>
					)}
					{article.siteName && article.author && <span>·</span>}
					{article.author && <span>{article.author}</span>}
				</div>

				<h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">
					{article.title}
				</h3>

				{article.summary && (
					<p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
						{article.summary}
					</p>
				)}

				{/* Spacer */}
				<div className="flex-1" />

				{/* Footer */}
				<div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						{article.readingTime && (
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{article.readingTime}
							</span>
						)}
						{article.category && (
							<span className="px-2 py-0.5 rounded-full bg-muted capitalize">
								{article.category}
							</span>
						)}
					</div>

					<Link
						href={article.url}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							"inline-flex items-center gap-1.5 text-sm font-medium",
							"text-primary hover:text-primary/80 transition-colors",
						)}
					>
						Read
						<ExternalLink className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>
		</article>
	);
}

function BooksComingSoon() {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-16 px-6",
				"bg-card border border-border rounded-lg",
				"text-center",
			)}
		>
			<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
				<BookOpen className="w-8 h-8 text-muted-foreground" />
			</div>
			<h3 className="font-serif text-xl font-semibold mb-2">Books</h3>
			<p className="text-muted-foreground max-w-md">
				Coming soon! I&apos;ll be sharing books I&apos;m reading and have read,
				along with notes and reviews.
			</p>
		</div>
	);
}

export default async function ReadingPage() {
	const allArticles = await db
		.select()
		.from(articles)
		.orderBy(desc(articles.savedAt));

	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
				<h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
					Reading
				</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					A collection of articles I&apos;ve read and found interesting, plus
					books on my shelf.
				</p>
			</header>

			{/* Books Section */}
			<section className="max-w-5xl mx-auto px-6 pb-12">
				<BooksComingSoon />
			</section>

			{/* Articles Section */}
			<section className="max-w-5xl mx-auto px-6 pb-24">
				<h2 className="font-serif text-2xl font-semibold mb-6">Articles</h2>

				{allArticles.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{allArticles.map((article) => (
							<ArticleCard key={article.id} article={article} />
						))}
					</div>
				) : (
					<div className="text-center py-12 text-muted-foreground">
						<p>No articles yet. Check back soon!</p>
					</div>
				)}
			</section>
		</div>
	);
}

