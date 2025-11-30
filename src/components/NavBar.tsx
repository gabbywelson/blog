"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-1/2 z-50 animate-float">
      <nav
        className={cn(
          "flex items-center gap-1 px-2 py-2",
          "bg-card/80 backdrop-blur-md",
          "border border-border",
          "rounded-full shadow-lg shadow-foreground/5"
        )}
      >
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <div className="w-px h-6 bg-border mx-1" />
        <ThemeToggle />
      </nav>
    </header>
  );
}
