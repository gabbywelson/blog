import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";

interface ReadwiseDocumentPayload {
  id: string;
  url: string;
  title: string;
  author: string | null;
  source: string | null;
  category: string | null;
  location: string | null;
  tags: Record<string, { name: string; type: string; created: number }> | null;
  site_name: string | null;
  word_count: number | null;
  reading_time: string | null;
  created_at: string;
  updated_at: string;
  published_date: string | null;
  summary: string | null;
  image_url: string | null;
  content: string | null;
  source_url: string | null;
  notes: string | null;
  parent_id: string | null;
  reading_progress: number | null;
  first_opened_at: string | null;
  last_opened_at: string | null;
  saved_at: string;
  last_moved_at: string | null;
  event_type: string;
  secret: string;
}

export async function POST(request: NextRequest) {
  console.log("[Readwise Webhook] === Incoming POST request ===");
  console.log("[Readwise Webhook] URL:", request.url);
  console.log("[Readwise Webhook] Method:", request.method);
  console.log(
    "[Readwise Webhook] Headers:",
    JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2)
  );

  // Read the raw body first for logging
  const rawBody = await request.text();
  console.log("[Readwise Webhook] Raw body length:", rawBody.length);
  console.log("[Readwise Webhook] Raw body:", rawBody || "(empty)");

  // Handle empty body (likely a test request)
  if (!rawBody || rawBody.trim() === "") {
    console.log("[Readwise Webhook] Empty body - likely a test request");
    return NextResponse.json({ status: "Webhook endpoint is working" });
  }

  try {
    const payload: ReadwiseDocumentPayload = JSON.parse(rawBody);
    console.log(
      "[Readwise Webhook] Parsed payload:",
      JSON.stringify(payload, null, 2)
    );

    // Verify the webhook secret (optional - skip if not configured)
    const expectedSecret = process.env.READWISE_WEBHOOK_SECRET;
    if (expectedSecret && payload.secret !== expectedSecret) {
      console.error("[Readwise Webhook] Invalid webhook secret");
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 }
      );
    }
    if (!expectedSecret) {
      console.warn(
        "[Readwise Webhook] READWISE_WEBHOOK_SECRET not configured - skipping verification"
      );
    }

    // Only process shortlisted (starred) documents
    if (payload.event_type !== "reader.document.shortlisted") {
      console.log(
        `[Readwise Webhook] Ignoring event type: ${payload.event_type}`
      );
      return NextResponse.json({ message: "Event type ignored" });
    }

    console.log(`[Readwise Webhook] Processing article: ${payload.title}`);

    // Upsert the article into the database
    await db
      .insert(articles)
      .values({
        id: payload.id,
        url: payload.url,
        title: payload.title,
        author: payload.author,
        siteName: payload.site_name,
        summary: payload.summary,
        imageUrl: payload.image_url,
        wordCount: payload.word_count,
        readingTime: payload.reading_time,
        category: payload.category,
        publishedDate: payload.published_date,
        savedAt: payload.saved_at ? new Date(payload.saved_at) : null,
      })
      .onConflictDoUpdate({
        target: articles.id,
        set: {
          url: payload.url,
          title: payload.title,
          author: payload.author,
          siteName: payload.site_name,
          summary: payload.summary,
          imageUrl: payload.image_url,
          wordCount: payload.word_count,
          readingTime: payload.reading_time,
          category: payload.category,
          publishedDate: payload.published_date,
          savedAt: payload.saved_at ? new Date(payload.saved_at) : null,
        },
      });

    console.log(`[Readwise Webhook] Successfully saved article: ${payload.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Readwise Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Readwise tests the endpoint with a GET request
export async function GET() {
  return NextResponse.json({ status: "Readwise webhook endpoint is active" });
}
