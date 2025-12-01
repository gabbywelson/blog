import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Search, Coffee } from "lucide-react";

const funnyMessages = [
	"Looks like this page went on vacation without telling anyone.",
	"This page is playing hide and seek. It's winning.",
	"404: Page not found. But hey, you found this cool error page!",
	"The page you're looking for is in another castle.",
	"This page has been composted. It's now fertilizing better ideas.",
	"Oops! This seedling never sprouted.",
];

export default function NotFound() {
	// Pick a random message (will be consistent per build due to SSG)
	const message =
		funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

	return (
		<div className="min-h-[60vh] flex items-center justify-center px-6">
			<div className="text-center max-w-lg">
				{/* Big 404 */}
				<div className="mb-8">
					<h1 className="font-serif text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter">
						<span className="text-primary">4</span>
						<span className="text-secondary">0</span>
						<span className="text-accent">4</span>
					</h1>
				</div>

				{/* Funny message */}
				<p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
					{message}
				</p>

				{/* Lost plant illustration (ASCII art style) */}
				<div className="mb-8 font-mono text-muted-foreground/50 text-sm leading-relaxed">
					<pre className="inline-block text-left">
						{`     🌱
    /|\\
     |
    ~~~
  (empty pot)`}
					</pre>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link
						href="/"
						className={cn(
							"inline-flex items-center gap-2 px-6 py-3 rounded-lg",
							"bg-primary text-primary-foreground font-medium",
							"hover:opacity-90 transition-opacity",
						)}
					>
						<Home className="w-4 h-4" />
						Back to Garden
					</Link>
					<Link
						href="/posts"
						className={cn(
							"inline-flex items-center gap-2 px-6 py-3 rounded-lg",
							"bg-card border border-border font-medium",
							"hover:border-primary/30 hover:bg-primary/5 transition-all",
						)}
					>
						<Search className="w-4 h-4" />
						Browse Posts
					</Link>
				</div>

				{/* Cheeky footer */}
				<p className="mt-12 text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
					<Coffee className="w-4 h-4" />
					Maybe grab a coffee while you figure out where you meant to go?
				</p>
			</div>
		</div>
	);
}
