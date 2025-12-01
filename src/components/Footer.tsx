"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const socialLinks = [
  {
    href: "https://github.com/gabbywelson",
    icon: <Image src="/icons/github.svg" alt="GitHub" width={20} height={20} />,
    label: "GitHub",
    customIcon: true,
  },
  {
    href: "https://twitter.com/gabbywelson",
    icon: (
      <Image src="/icons/twitter.svg" alt="Twitter" width={20} height={20} />
    ),
    label: "Twitter",
    customIcon: true,
  },
  {
    href: "https://linkedin.com/in/gabbywelson",
    icon: (
      <Image src="/icons/linkedin.svg" alt="Linkedin" width={20} height={20} />
    ),
    label: "Linkedin",
    customIcon: true,
  },
  {
    href: "https://tacobelllabs.net/@gabby",
    icon: (
      <Image src="/icons/mastodon.svg" alt="Mastodon" width={20} height={20} />
    ),
    label: "Mastodon",
    customIcon: true,
  },
  {
    href: "https://bsky.app/profile/gabby.gay",
    icon: (
      <Image src="/icons/bluesky.svg" alt="Bluesky" width={20} height={20} />
    ),
    label: "Bluesky",
    customIcon: true,
  },
  {
    href: "mailto:hello@welson.net",
    icon: <Image src="/icons/email.svg" alt="Email" width={20} height={20} />,
    label: "Email me",
    customIcon: true,
  },
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
    <footer
      className={cn("border-t border-border mt-16", isRetro && "border-t-4")}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Retro marquee banner */}
        {isRetro && (
          <div className="mb-8 overflow-hidden border-2 border-[#ff00ff] bg-[#000033] py-2">
            <div className="retro-marquee whitespace-nowrap text-[#00ffff]">
              ★ Thanks for visiting my page! ★ Don&apos;t forget to sign my
              guestbook! ★ You are visitor #
              {Math.floor(Math.random() * 9000) + 1000} ★ Come back soon! ★ Add
              me to your bookmarks! ★ Thanks for visiting my page! ★ Don&apos;t
              forget to sign my guestbook! ★
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
                  {link.customIcon ? link.icon : <Icon className="w-5 h-5" />}
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div
          className={cn(
            "mt-8 pt-6 border-t border-border",
            isRetro && "border-t-2"
          )}
        >
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
