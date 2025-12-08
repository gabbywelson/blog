import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
	// Readwise document ID
	id: text("id").primaryKey(),

	// Core article info
	url: text("url").notNull(),
	title: text("title").notNull(),
	author: text("author"),
	siteName: text("site_name"),
	summary: text("summary"),
	imageUrl: text("image_url"),

	// Reading metadata
	wordCount: integer("word_count"),
	readingTime: text("reading_time"),
	category: text("category"),

	// Dates
	publishedDate: text("published_date"),
	savedAt: timestamp("saved_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

