import { Feed } from "feed";
import { getAllPosts } from "@/lib/mdx";

const SITE_URL = process.env.SITE_URL || "https://gabbybloom.com";

export async function GET() {
	const posts = getAllPosts();

	const feed = new Feed({
		title: "Gabby's Garden",
		description: "A soft digital garden where ideas bloom and grow",
		id: SITE_URL,
		link: SITE_URL,
		language: "en",
		image: `${SITE_URL}/hero.png`,
		favicon: `${SITE_URL}/favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}, Gabby`,
		feedLinks: {
			rss2: `${SITE_URL}/feed.xml`,
		},
		author: {
			name: "Gabby",
			link: SITE_URL,
		},
	});

	for (const post of posts) {
		feed.addItem({
			title: post.title,
			id: `${SITE_URL}/posts/${post.slug}`,
			link: `${SITE_URL}/posts/${post.slug}`,
			description: post.excerpt,
			date: new Date(post.date),
			image: post.image,
		});
	}

	return new Response(feed.rss2(), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
