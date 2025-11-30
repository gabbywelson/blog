"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "retro";

/**
 * Hook to get the current theme with proper hydration handling.
 * Returns the resolved theme and helper booleans for each theme type.
 */
export function useCurrentTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mounting, return undefined to avoid hydration mismatch
  const currentTheme = mounted ? (resolvedTheme as Theme) : undefined;

  return {
    // The current theme (undefined during SSR/hydration)
    theme: currentTheme,
    // Whether the component has mounted (safe to use theme values)
    mounted,
    // Helper booleans for conditional rendering
    isLight: currentTheme === "light",
    isDark: currentTheme === "dark",
    isRetro: currentTheme === "retro",
    // Function to change theme
    setTheme: setTheme as (theme: Theme) => void,
    // Raw theme value (may not match resolved during system preference)
    rawTheme: theme as Theme | undefined,
  };
}

