import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";

interface ReadwiseWebhookPayload {
  id: string;
  url: string;
  title: string | null;
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

interface ReadwiseDocument {
  id: string;
  url: string;
  source_url: string | null;
  title: string;
  author: string | null;
  source: string | null;
  category: string;
  location: string;
  tags: Record<string, unknown>;
  site_name: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
  published_date: string | null;
  summary: string | null;
  image_url: string | null;
  reading_progress: number;
  first_opened_at: string | null;
  last_opened_at: string | null;
  saved_at: string;
  last_moved_at: string | null;
  notes: string | null;
  parent_id: string | null;
}

async function fetchReadwiseDocument(
  documentId: string
): Promise<ReadwiseDocument | null> {
  const accessToken = process.env.READWISE_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[Readwise Webhook] READWISE_ACCESS_TOKEN not configured");
    return null;
  }

  const response = await fetch(
    `https://readwise.io/api/v3/list/?id=${documentId}`,
    {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      `[Readwise Webhook] Failed to fetch document: ${response.status} ${response.statusText}`
    );
    return null;
  }

  const data = await response.json();
  console.log(
    "[Readwise Webhook] Readwise API response:",
    JSON.stringify(data, null, 2)
  );

  // The API returns { results: [...] } with the document in results
  if (data.results && data.results.length > 0) {
    return data.results[0];
  }

  return null;
}

// Estimate reading time from word count
function estimateReadingTime(wordCount: number | null): string | null {
  if (!wordCount) return null;
  const minutes = Math.ceil(wordCount / 200); // ~200 words per minute
  return `${minutes} min`;
}

export async function POST(request: NextRequest) {
  console.log("[Readwise Webhook] === Incoming POST request ===");
  console.log("[Readwise Webhook] URL:", request.url);
  console.log("[Readwise Webhook] Method:", request.method);

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
    const payload: ReadwiseWebhookPayload = JSON.parse(rawBody);

    // Verify the webhook secret
    const expectedSecret = process.env.READWISE_WEBHOOK_SECRET;
    if (!expectedSecret) {
      console.error(
        "[Readwise Webhook] READWISE_WEBHOOK_SECRET not configured"
      );
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (payload.secret !== expectedSecret) {
      console.error("[Readwise Webhook] Invalid webhook secret");
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Only process tags_updated events
    if (payload.event_type !== "reader.document.tags_updated") {
      console.log(
        `[Readwise Webhook] Ignoring event type: ${payload.event_type}`
      );
      return NextResponse.json({ message: "Event type ignored" });
    }

    // Check if the "starred" tag is present
    const hasStarredTag = payload.tags && "starred" in payload.tags;
    if (!hasStarredTag) {
      console.log("[Readwise Webhook] No 'starred' tag found, ignoring");
      return NextResponse.json({ message: "Not starred, ignoring" });
    }

    console.log(
      `[Readwise Webhook] Document ${payload.id} was starred, fetching details...`
    );

    // Fetch full document details from Readwise API
    const document = await fetchReadwiseDocument(payload.id);
    if (!document) {
      console.error(
        "[Readwise Webhook] Could not fetch document details from Readwise"
      );
      return NextResponse.json(
        { error: "Could not fetch document details" },
        { status: 500 }
      );
    }

    console.log(`[Readwise Webhook] Processing article: ${document.title}`);

    // Use source_url if available (original article URL), otherwise use the Readwise URL
    const articleUrl = document.source_url || document.url;

    // Upsert the article into the database
    await db
      .insert(articles)
      .values({
        id: document.id,
        url: articleUrl,
        title: document.title,
        author: document.author,
        siteName: document.site_name,
        summary: document.summary,
        imageUrl: document.image_url,
        wordCount: document.word_count,
        readingTime: estimateReadingTime(document.word_count),
        category: document.category,
        publishedDate: document.published_date,
        savedAt: document.saved_at ? new Date(document.saved_at) : null,
      })
      .onConflictDoUpdate({
        target: articles.id,
        set: {
          url: articleUrl,
          title: document.title,
          author: document.author,
          siteName: document.site_name,
          summary: document.summary,
          imageUrl: document.image_url,
          wordCount: document.word_count,
          readingTime: estimateReadingTime(document.word_count),
          category: document.category,
          publishedDate: document.published_date,
          savedAt: document.saved_at ? new Date(document.saved_at) : null,
        },
      });

    console.log(
      `[Readwise Webhook] Successfully saved article: ${document.id}`
    );

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
