import { cn } from "@/lib/utils";
import { Mail, Github, Twitter, MapPin, Briefcase } from "lucide-react";

export const metadata = {
  title: "About | Digital Garden",
  description: "Learn more about the person behind this digital garden",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          About
        </h1>
        <p className="text-xl text-muted-foreground">
          The gardener behind the garden.
        </p>
      </header>

      {/* Bio Card */}
      <section
        className={cn(
          "bg-card border border-border rounded-lg p-8 mb-12",
          "transition-all duration-300"
        )}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar placeholder */}
          <div className="shrink-0">
            <div
              className={cn(
                "w-32 h-32 rounded-lg",
                "bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30",
                "flex items-center justify-center",
                "font-serif text-4xl font-bold text-foreground"
              )}
            >
              DG
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Hello, I'm a Senior Full-Stack Engineer
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I believe great software is grown, not built. Like a garden, it
                requires patience, care, and the wisdom to know when to prune.
              </p>
              <p>
                By day, I craft digital experiences at the intersection of code
                and design. By night, I tend to this digital garden — a space
                for ideas to bloom and evolve.
              </p>
            </div>

            {/* Quick facts */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>Senior Full-Stack Engineer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="space-y-12">
        {/* What I Do */}
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-4">What I Do</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Frontend Development",
                description:
                  "Building beautiful, accessible interfaces with React, Next.js, and modern CSS.",
              },
              {
                title: "Backend Systems",
                description:
                  "Designing robust APIs and services that scale gracefully.",
              },
              {
                title: "Design Systems",
                description:
                  "Creating cohesive component libraries that bridge design and development.",
              },
              {
                title: "Technical Writing",
                description:
                  "Sharing knowledge through documentation, blog posts, and tutorials.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={cn(
                  "bg-muted/50 border border-border rounded-lg p-4",
                  "hover:border-primary/30 transition-colors"
                )}
              >
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-4">
            What I Believe
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
              <span>
                <strong className="text-foreground">Simplicity wins.</strong>{" "}
                The best code is often the code you don't write.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2 rounded-full bg-secondary shrink-0" />
              <span>
                <strong className="text-foreground">
                  Details matter deeply.
                </strong>{" "}
                The difference between good and great is in the margins.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-2 rounded-full bg-accent shrink-0" />
              <span>
                <strong className="text-foreground">Learning never stops.</strong>{" "}
                Every project is an opportunity to grow.
              </span>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-4">Connect</h2>
          <p className="text-muted-foreground mb-6">
            I love meeting new people and hearing about interesting projects.
            Feel free to reach out!
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:hello@example.com"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-card border border-border",
                "hover:border-primary/30 hover:bg-primary/5 transition-all"
              )}
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-card border border-border",
                "hover:border-primary/30 hover:bg-primary/5 transition-all"
              )}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-card border border-border",
                "hover:border-primary/30 hover:bg-primary/5 transition-all"
              )}
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

