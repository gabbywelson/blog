import { Github, Twitter, Linkedin, Newspaper, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const socialLinks = [
  { href: "https://github.com/gabbywelson", icon: Github, label: "GitHub" },
  { href: "https://twitter.com/gabbywelson", icon: Twitter, label: "Twitter" },
  {
    href: "https://linkedin.com/in/gabbywelson",
    icon: Linkedin,
    label: "Linkedin",
  },
  {
    href: "https://tacobelllabs.net/@gabby",
    icon: Newspaper,
    label: "Mastodon",
  },
  { href: "mailto:hello@welson.net", icon: Mail, label: "Email me" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-serif text-lg font-semibold text-foreground">
              Digital Garden
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Growing ideas, one thought at a time.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-muted"
                  )}
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Gabby Welson. Made with 💜 in San Francisco.
          </p>
        </div>
      </div>
    </footer>
  );
}
