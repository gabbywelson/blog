import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Project, projects } from "@/data/projects";
export const metadata: Metadata = {
  title: "Projects | Gabby's Garden",
  description: "Things I've built and am proud of.",
};

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
