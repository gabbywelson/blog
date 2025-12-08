CREATE TABLE "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"site_name" text,
	"summary" text,
	"image_url" text,
	"word_count" integer,
	"reading_time" text,
	"category" text,
	"published_date" text,
	"saved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
