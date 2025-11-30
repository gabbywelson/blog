"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export function Hero() {
  const { resolvedTheme } = useTheme();

  const heroImage = resolvedTheme === "dark" ? "/hero-dark.jpg" : "/hero.png";
  const showImage = resolvedTheme !== "retro";

  // Gradient overlay adapts: white edges for light, dark edges for dark
  const gradientOverlay =
    resolvedTheme === "dark"
      ? "bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,23,42,0.7)_100%)]"
      : "bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(255,255,255,0.7)_100%)]";

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] -mt-24 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {showImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImage}
            alt="Whimsical 3D clay garden border"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Radial gradient overlay - transparent center, fades at edges */}
          <div className={`absolute inset-0 ${gradientOverlay}`} />
          {/* Bottom fade to background for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Content - The Clearing */}
      <div className="relative z-10 text-center space-y-4 max-w-2xl px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight">
          <span className="text-primary">Gabby&apos;s</span>{" "}
          <span className="text-secondary">Garden</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          My own little corner of the internet to share thoughts, link to my
          work, and let folks know what I&apos;m up to.
        </p>
      </div>
    </section>
  );
}
