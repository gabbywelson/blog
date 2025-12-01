import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects | Gabby's Garden",
  description: "Things I've built and am proud of.",
};

interface Project {
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  isInternal?: boolean;
  tags?: string[];
}

const projects: Project[] = [
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
    githubUrl: "https://github.com/gabbywelson/chris_zombik_blog",
    tags: ["Portfolio", "Next.js", "Design"],
    image: "https://m2odgjcmaljdcanu.public.blob.vercel-storage.com/zombik.jpg",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={cn(
        "group flex flex-col bg-card border border-border rounded-lg overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
        "hover:border-primary/30"
      )}
    >
      {/* Screenshot area */}
      <div className="relative aspect-video overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* Gradient placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
            {/* Decorative shapes */}
            <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-accent/10 rounded-full blur-xl" />
          </div>
        )}
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content - flex-1 to take remaining space */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-xl font-semibold mb-2">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer to push links to bottom */}
        <div className="flex-1" />

        {/* Links - pinned to bottom */}
        <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target={project.isInternal ? undefined : "_blank"}
              rel={project.isInternal ? undefined : "noopener noreferrer"}
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium",
                "text-primary hover:text-primary/80 transition-colors"
              )}
            >
              {project.isInternal ? (
                <>
                  View
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Visit site
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </Link>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium",
                "text-muted-foreground hover:text-foreground transition-colors"
              )}
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Things I&apos;ve built and am proud of. From personal tools to sites
          for friends, here&apos;s a collection of my work.
        </p>
      </header>

      {/* Projects Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
