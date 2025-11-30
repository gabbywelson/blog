"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = ["light", "dark", "retro"] as const;

const themeIcons = {
  light: Sun,
  dark: Moon,
  retro: Sparkles,
};

const themeLabels = {
  light: "Light",
  dark: "Dark",
  retro: "Retro",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-muted"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  const currentTheme = (theme as (typeof themes)[number]) || "light";
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];

  const Icon = themeIcons[currentTheme];

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "bg-muted hover:bg-primary/20",
        "border border-transparent hover:border-primary/30",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
      aria-label={`Switch to ${themeLabels[nextTheme]} theme`}
      title={`Current: ${themeLabels[currentTheme]}. Click for ${themeLabels[nextTheme]}`}
    >
      <Icon className="w-5 h-5 text-foreground" />
    </button>
  );
}

