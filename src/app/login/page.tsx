"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import posthog from "posthog-js";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result?.error) {
        // Track failed login attempt on client side
        posthog.capture("admin_login_failed", {
          error: result.error,
          source: "client",
        });

        toast.error("Authentication failed", {
          description: result.error,
        });
        setIsLoading(false);
      } else {
        // Identify admin user on successful login
        posthog.identify("admin", {
          role: "admin",
        });
      }
      // If successful, redirect happens server-side
    } catch (error) {
      // Track unexpected errors
      posthog.captureException(error as Error);

      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-card border border-border text-foreground",
        }}
      />

      <div
        className={cn(
          "w-full max-w-md",
          "bg-card border border-border rounded-lg p-8",
          "shadow-xl shadow-foreground/5"
        )}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Hidden Garden</h1>
          <p className="text-muted-foreground mt-2">
            Enter the secret phrase to access the admin area.
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-6">
          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className={cn(
                  "w-full px-4 py-3 pr-12 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  "transition-all duration-200"
                )}
                placeholder="Enter your secret..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "p-1 rounded text-muted-foreground hover:text-foreground",
                  "transition-colors"
                )}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg",
              "bg-primary text-primary-foreground font-medium",
              "hover:opacity-90 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Enter the Garden"
            )}
          </button>
        </form>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          This is a private area. If you're lost, head back{" "}
          <a href="/" className="text-primary hover:underline">
            home
          </a>
          .
        </p>
      </div>
    </div>
  );
}
