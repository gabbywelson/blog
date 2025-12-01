import { SocialFeed } from "@/components/SocialFeed";

export const metadata = {
  title: "Micro | Gabby's Garden",
  description: "Short-form posts from Bluesky, Mastodon, and Micro.blog",
};

export default function MicroPage() {
  const apiUrl = process.env.POSTS_API_URL;
  const apiKey = process.env.POSTS_API_KEY;

  if (!apiUrl || !apiKey) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Micro
          </h1>
        </header>
        <p className="text-muted-foreground">
          Social feed is not configured. Please set up the API credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Micro
        </h1>
        <p className="text-xl text-muted-foreground">
          Short-form thoughts and updates from across the social web — Bluesky,
          Mastodon, and Micro.blog all in one place.
        </p>
      </header>

      <SocialFeed apiUrl={apiUrl} apiKey={apiKey} />
    </div>
  );
}




