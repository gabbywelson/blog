export interface Project {
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  isInternal?: boolean;
  tags?: string[];
}

export const projects: Project[] = [
  {
    title: "Gabby's Garden",
    description:
      "This very site! A personal blog and digital garden built with Next.js 15, featuring MDX content, multiple themes (light, dark, retro), and a cozy aesthetic. It's where I share my writing, thoughts, and projects.",
    // Add image: "/projects/garden.png" when screenshot is ready
    liveUrl: "/",
    githubUrl: "https://github.com/gabbywelson/blog",
    isInternal: true,
    tags: ["Next.js", "MDX", "Tailwind CSS"],
    image: "https://m2odgjcmaljdcanu.public.blob.vercel-storage.com/home.png",
  },
  {
    title: "Life in Weeks",
    description:
      "A visualization of my life in weeks, inspired by Wait But Why and Gina Trapani. Each cell represents one week from birth to age 100, color-coded by decade with milestone events highlighted.",
    // Add image: "/projects/weeks.png" when screenshot is ready
    liveUrl: "/weeks",
    githubUrl:
      "https://github.com/gabbywelson/blog/blob/main/src/app/weeks/page.tsx",
    isInternal: true,
    tags: ["Data Viz", "React", "CSS Grid"],
    image: "https://m2odgjcmaljdcanu.public.blob.vercel-storage.com/weeks.png",
  },
  {
    title: "Micro Feed",
    description:
      "A Twitter/X-style micro-blogging feed integrated into my site. Short-form thoughts and updates that don't warrant a full blog post, complete with a posting interface in the admin dashboard.",
    // Add image: "/projects/micro.png" when screenshot is ready
    liveUrl: "/micro",
    githubUrl:
      "https://github.com/gabbywelson/blog/blob/main/src/app/micro/page.tsx",
    isInternal: true,
    tags: ["Social", "Val.town", "Backend"],
    image: "https://m2odgjcmaljdcanu.public.blob.vercel-storage.com/micro.png",
  },
  {
    title: "Chris Zombik Portfolio",
    description:
      "A portfolio and author website I designed and built for my friend Chris Zombik, a writer and creative. Clean, minimal design focused on showcasing his work and making it easy for visitors to learn about him. Built using Next.js, Payload CMS, and Neon DB",
    // Add image: "/projects/chriszombik.png" when screenshot is ready
    liveUrl: "https://chriszombik.com",
    githubUrl: "https://github.com/gabbywelson/chris-zombik-blog",
    tags: ["Portfolio", "Next.js", "Design"],
    image: "https://m2odgjcmaljdcanu.public.blob.vercel-storage.com/zombik.jpg",
  },
];
