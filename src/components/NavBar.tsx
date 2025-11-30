"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
];

// Retro nav labels with some fun alternatives
const retroNavLabels: Record<string, string> = {
  "/": "~Home~",
  "/posts": "Blog",
  "/projects": "Stuff",
  "/about": "About Me!",
  "/now": "Now",
};

export function NavBar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetro = mounted && resolvedTheme === "retro";

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 z-50",
        !isRetro && "animate-float"
      )}
    >
      <nav
        className={cn(
          "flex items-center gap-1 px-2 py-2",
          "bg-card/80 backdrop-blur-md",
          "border border-border",
          "rounded-full shadow-lg shadow-foreground/5",
          // Retro overrides
          isRetro && [
            "rounded-none",
            "bg-[#000066]",
            "border-4",
            "border-t-[#6666ff] border-l-[#6666ff]",
            "border-b-[#000033] border-r-[#000033]",
            "shadow-[4px_4px_0px_#000000]",
            "backdrop-blur-none",
          ]
        )}
      >
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          const label = isRetro
            ? retroNavLabels[link.href] || link.label
            : link.label;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                // Retro overrides
                isRetro && [
                  "rounded-none",
                  "border-2",
                  isActive
                    ? [
                        "bg-[#ff00ff]",
                        "text-white",
                        "border-t-[#ff66ff] border-l-[#ff66ff]",
                        "border-b-[#990099] border-r-[#990099]",
                      ]
                    : [
                        "bg-[#000099]",
                        "text-[#00ffff]",
                        "border-t-[#3333cc] border-l-[#3333cc]",
                        "border-b-[#000033] border-r-[#000033]",
                        "hover:bg-[#0000cc]",
                        "hover:text-[#ffff00]",
                      ],
                ]
              )}
            >
              {label}
            </Link>
          );
        })}
        <div
          className={cn(
            "w-px h-6 bg-border mx-1",
            isRetro && "w-[3px] bg-[#ff00ff]"
          )}
        />
        <ThemeToggle />
      </nav>
    </header>
  );
}
