"use client";

import { Github, Twitter, Linkedin, Newspaper, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && resolvedTheme === "retro";

  return (
    <footer className={cn("border-t border-border mt-16", isRetro && "border-t-4")}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Retro decorative element */}
        {isRetro && (
          <div className="text-center mb-8">
            <div className="inline-block">
              <span className="text-2xl">
                🌟 ✨ 💫 ⭐ 🌟 ✨ 💫 ⭐ 🌟
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p
              className={cn(
                "font-serif text-lg font-semibold text-foreground",
                isRetro && "retro-glow text-[#ff00ff]"
              )}
            >
              {isRetro ? "~*~ Gabby's Garden ~*~" : "Gabby's Garden"}
            </p>
            <div className="text-sm text-muted-foreground mt-1">
              <ul className={cn(isRetro && "text-[#00ffff]")}>
                <li>
                  <Link href="/notes">{isRetro ? "» Notes" : "Notes"}</Link>
                </li>
                <li>
                  <Link href="/colophon">
                    {isRetro ? "» Colophon" : "Colophon"}
                  </Link>
                </li>
                <li>
                  <Link href="/ai">{isRetro ? "» AI usage" : "AI usage"}</Link>
                </li>
              </ul>
            </div>
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
                    "hover:bg-muted",
                    isRetro && [
                      "rounded-none",
                      "border-2",
                      "border-[#00ffff]",
                      "text-[#00ff00]",
                      "hover:bg-[#000066]",
                      "hover:text-[#ffff00]",
                    ]
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
        <div className={cn("mt-8 pt-6 border-t border-border", isRetro && "border-t-2")}>
          {isRetro ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#ffff00]">
                <span className="retro-blink">★</span> Best viewed in Netscape
                Navigator 4.0 at 800x600 <span className="retro-blink">★</span>
              </p>
              <p className="text-xs text-[#00ffff]">
                This page is under construction! Check back soon!
              </p>
              <div className="flex justify-center gap-4 text-2xl">
                <span>🚧</span>
                <span className="retro-sparkle">⚒️</span>
                <span>🚧</span>
              </div>
              <p className="text-sm text-[#ff00ff]">
                &copy; {currentYear} Gabby Welson | Made with 💜 in San
                Francisco
              </p>
              <p className="text-xs text-[#00ff00]">
                Sign my guestbook! | Webring | Links
              </p>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              &copy; {currentYear} Gabby Welson. Made with 💜 in San Francisco.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
