"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useTheme } from "next-themes";
import posthog from "posthog-js";

// Types
export type Theme = "light" | "dark" | "retro";

interface Preferences {
  theme: Theme;
  animationsEnabled: boolean;
}

interface PreferencesContextValue {
  // Theme
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  mounted: boolean;

  // Animations
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleAnimations: () => void;

  // Helper booleans
  isLight: boolean;
  isDark: boolean;
  isRetro: boolean;
}

const STORAGE_KEY = "gabby-garden-preferences";

const defaultPreferences: Preferences = {
  theme: "light",
  animationsEnabled: true,
};

// Create context
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

// Provider component
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme, setTheme: setNextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    setMounted(true);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs: Partial<Preferences> = JSON.parse(stored);

        // Apply animations preference
        if (typeof prefs.animationsEnabled === "boolean") {
          setAnimationsEnabledState(prefs.animationsEnabled);
        }
      }
    } catch (error) {
      console.warn("Failed to load preferences from localStorage:", error);
    }
  }, []);

  // Apply animations class to document
  useEffect(() => {
    if (!mounted) return;

    if (animationsEnabled) {
      document.documentElement.classList.remove("animations-disabled");
    } else {
      document.documentElement.classList.add("animations-disabled");
    }
  }, [animationsEnabled, mounted]);

  // Save preferences to localStorage whenever they change
  const savePreferences = useCallback(
    (updates: Partial<Preferences>) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const current: Preferences = stored
          ? JSON.parse(stored)
          : defaultPreferences;
        const updated = { ...current, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to save preferences to localStorage:", error);
      }
    },
    []
  );

  // Theme setter with persistence
  const setTheme = useCallback(
    (newTheme: Theme) => {
      const currentTheme = resolvedTheme as Theme;

      // Track theme change
      posthog.capture("theme_changed", {
        from_theme: currentTheme,
        to_theme: newTheme,
      });

      setNextTheme(newTheme);
      savePreferences({ theme: newTheme });
    },
    [setNextTheme, savePreferences, resolvedTheme]
  );

  // Animation setter with persistence
  const setAnimationsEnabled = useCallback(
    (enabled: boolean) => {
      // Track animation preference change
      posthog.capture("animations_preference_changed", {
        animations_enabled: enabled,
      });

      setAnimationsEnabledState(enabled);
      savePreferences({ animationsEnabled: enabled });
    },
    [savePreferences]
  );

  // Toggle animations convenience function
  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(!animationsEnabled);
  }, [animationsEnabled, setAnimationsEnabled]);

  // Current theme (undefined during SSR/hydration)
  const currentTheme = mounted ? (resolvedTheme as Theme) : undefined;

  const value: PreferencesContextValue = {
    theme: currentTheme,
    setTheme,
    mounted,
    animationsEnabled,
    setAnimationsEnabled,
    toggleAnimations,
    isLight: currentTheme === "light",
    isDark: currentTheme === "dark",
    isRetro: currentTheme === "retro",
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Hook to use preferences
export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
}

// Optional hook that won't throw if used outside provider (for backwards compatibility)
export function usePreferencesSafe(): PreferencesContextValue | null {
  return useContext(PreferencesContext);
}

