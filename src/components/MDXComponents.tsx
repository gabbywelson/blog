import Image from "next/image";
import { cn } from "@/lib/utils";

type MDXComponents = Record<
	string,
	React.ComponentType<Record<string, unknown>>
>;

// Custom responsive image component for MDX
function MDXImage({
	src,
	alt,
	...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
	if (!src || typeof src !== "string") return null;

	// Handle both relative and absolute URLs
	const imageSrc = src.startsWith("/") || src.startsWith("http") ? src : src;

	return (
		<figure className="my-8">
			<div
				className={cn(
					"relative overflow-hidden rounded-lg",
					"border border-border",
					"bg-muted",
				)}
			>
				<Image
					src={imageSrc}
					alt={alt || "Blog image"}
					width={0}
					height={0}
					sizes="100vw"
					className="w-full h-auto"
					// Allow unoptimized for external blob URLs if needed
					unoptimized={src.includes("blob.vercel-storage.com")}
				/>
			</div>
			{alt && (
				<figcaption
					className={cn(
						"mt-3 text-center text-sm text-muted-foreground",
						"italic",
					)}
				>
					{alt}
				</figcaption>
			)}
		</figure>
	);
}

// Custom link component for external links
function MDXLink({
	href,
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const isExternal = href?.startsWith("http");

	return (
		<a
			href={href}
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			className="text-primary hover:underline"
			{...props}
		>
			{children}
		</a>
	);
}

// Custom code block wrapper
function MDXPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
	return (
		<pre
			className={cn(
				"my-6 overflow-x-auto rounded-lg",
				"bg-muted border border-border",
				"p-4 text-sm",
			)}
			{...props}
		>
			{children}
		</pre>
	);
}

// Custom blockquote
function MDXBlockquote({
	children,
	...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
	return (
		<blockquote
			className={cn(
				"my-6 border-l-4 border-primary",
				"bg-muted/50 py-2 px-6 rounded-r-lg",
				"text-muted-foreground not-italic",
			)}
			{...props}
		>
			{children}
		</blockquote>
	);
}

// Export components object for MDXRemote
export const components: MDXComponents = {
	img: MDXImage,
	a: MDXLink,
	pre: MDXPre,
	blockquote: MDXBlockquote,
	// Add more custom components as needed
	// h1: (props) => <h1 className="..." {...props} />,
	// h2: (props) => <h2 className="..." {...props} />,
};

export default components;
