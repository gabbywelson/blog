export interface Post {
  id: string;
  source: "bluesky" | "mastodon" | "microblog";
  post_id: string;
  content: string;
  created_at: string;
  archived_at: string;
  media_urls: string[];
  metadata: Record<string, unknown>;
}

export interface PostsApiResponse {
  success: boolean;
  data?: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filter: {
      source: string;
    };
  };
  error?: string;
}

export interface FetchPostsOptions {
  source?: "all" | "bluesky" | "mastodon" | "microblog";
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export class PostsApiClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    if (!apiUrl || !apiKey) {
      throw new Error("API URL and API Key are required");
    }
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  async fetchPosts(options: FetchPostsOptions = {}): Promise<PostsApiResponse> {
    const params = new URLSearchParams({
      source: options.source || "all",
      page: (options.page || 1).toString(),
      limit: (options.limit || 20).toString(),
      sort: options.sort || "desc",
    });

    try {
      const response = await fetch(`${this.apiUrl}?${params}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async fetchBlueskyPosts(page = 1, limit = 20): Promise<PostsApiResponse> {
    return this.fetchPosts({ source: "bluesky", page, limit });
  }

  async fetchMastodonPosts(page = 1, limit = 20): Promise<PostsApiResponse> {
    return this.fetchPosts({ source: "mastodon", page, limit });
  }

  async fetchMicroblogPosts(page = 1, limit = 20): Promise<PostsApiResponse> {
    return this.fetchPosts({ source: "microblog", page, limit });
  }
}


