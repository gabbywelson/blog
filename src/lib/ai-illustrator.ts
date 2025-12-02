import { generateText, experimental_generateImage as generateImage } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { put } from "@vercel/blob";

interface KeywordsResponse {
  keyword1: string;
  keyword2: string;
  keyword3: string;
}

/**
 * Extract visual keywords from post content using Gemini 1.5 Flash
 */
async function extractKeywords(postContent: string): Promise<KeywordsResponse> {
  const prompt = `You are a visual concept designer. Given a blog post, extract 3 short visual keywords/nouns that represent the "vibe" and themes of the post. These keywords should be suitable for a botanical/clay aesthetic illustration.

Return ONLY a JSON object in this exact format (no markdown, no code blocks):
{"keyword1": "noun1", "keyword2": "noun2", "keyword3": "accent color name"}

The first two keywords should be botanical or nature elements (like "ferns", "mushrooms", "wildflowers", "succulents", "pine trees", "crystals", "butterflies", "river stones").
The third keyword should be an accent color that matches the post's mood (like "coral", "lavender", "golden yellow", "dusty rose", "terracotta").

Blog post content:
${postContent.slice(0, 4000)}`;

  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
  });

  // Parse the JSON response
  const jsonMatch = text.trim().match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Fallback keywords if parsing fails
    return {
      keyword1: "ferns",
      keyword2: "wildflowers",
      keyword3: "lavender",
    };
  }

  try {
    return JSON.parse(jsonMatch[0]) as KeywordsResponse;
  } catch {
    return {
      keyword1: "ferns",
      keyword2: "wildflowers",
      keyword3: "lavender",
    };
  }
}

/**
 * Generate a hero image for a blog post and upload it to Vercel Blob
 * @param postContent - The full MDX content of the blog post
 * @param postSlug - The slug of the post (used for naming the file)
 * @returns The URL of the uploaded image
 */
export async function generatePostHero(
  postContent: string,
  postSlug: string
): Promise<string> {
  // Step 1: Extract keywords from post content
  const keywords = await extractKeywords(postContent);
  console.log("Extracted keywords:", keywords);

  // Step 2: Build the image prompt
  const imagePrompt = `A high-resolution 3D render of a whimsical forest clearing viewed from directly above (flat lay). The style is clean matte claymorphism with soft rounded shapes. The image features a dense border of ${keywords.keyword1} and ${keywords.keyword2} framing a large, completely empty central clearing. The center must be a smooth, flat, off-white surface (color #faf9f6) with absolutely nothing in it - no objects, no shadows, no patterns. Sharp focus, soft studio lighting. Colors: Sage green, lilac, ${keywords.keyword3}. No text, no watermarks, no labels.`;

  // Step 3: Generate image using OpenAI DALL-E 3
  const { image } = await generateImage({
    model: openai.image("dall-e-3"),
    prompt: imagePrompt,
    size: "1792x1024", // Closest to 16:9 aspect ratio
  });

  console.log("Generated image");

  // Step 4: Upload to Vercel Blob
  // Sanitize slug for file path (replace forward slashes with dashes)
  const sanitizedSlug = postSlug.replace(/\//g, "-");
  const pathname = `posts/heroes/${sanitizedSlug}.png`;

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(image.base64, "base64");

  const blob = await put(pathname, imageBuffer, {
    access: "public",
    contentType: "image/png",
  });

  console.log("Uploaded to Vercel Blob:", blob.url);

  return blob.url;
}
