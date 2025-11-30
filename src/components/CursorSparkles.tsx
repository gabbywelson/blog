"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCurrentTheme } from "@/lib/useCurrentTheme";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  createdAt: number;
}

const SPARKLE_COLORS = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff6600"];
const SPARKLE_LIFETIME = 1000; // ms
const SPARKLE_INTERVAL = 50; // ms between sparkles

export function CursorSparkles() {
  const { isRetro, mounted } = useCurrentTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const idCounterRef = useRef(0);
  const lastSparkleTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const createSparkle = useCallback((x: number, y: number): Sparkle => {
    return {
      id: idCounterRef.current++,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 10 + 8,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      rotation: Math.random() * 360,
      createdAt: Date.now(),
    };
  }, []);

  const updateSparkles = useCallback(() => {
    const now = Date.now();
    sparklesRef.current = sparklesRef.current.filter(
      (sparkle) => now - sparkle.createdAt < SPARKLE_LIFETIME
    );

    if (containerRef.current) {
      const container = containerRef.current;
      // Remove old sparkle elements
      while (container.children.length > sparklesRef.current.length) {
        container.removeChild(container.lastChild!);
      }

      // Update existing and add new sparkle elements
      sparklesRef.current.forEach((sparkle, index) => {
        let element = container.children[index] as HTMLElement;
        if (!element) {
          element = document.createElement("div");
          element.className = "sparkle-element";
          container.appendChild(element);
        }

        const age = now - sparkle.createdAt;
        const progress = age / SPARKLE_LIFETIME;
        const opacity = 1 - progress;
        const scale = 1 - progress * 0.5;
        const yOffset = progress * -30; // Float upward

        element.style.cssText = `
          position: fixed;
          left: ${sparkle.x}px;
          top: ${sparkle.y + yOffset}px;
          width: ${sparkle.size}px;
          height: ${sparkle.size}px;
          opacity: ${opacity};
          transform: rotate(${sparkle.rotation + progress * 180}deg) scale(${scale});
          pointer-events: none;
          z-index: 9999;
        `;
        element.innerHTML = `
          <svg viewBox="0 0 24 24" fill="${sparkle.color}" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
          </svg>
        `;
      });
    }

    animationFrameRef.current = requestAnimationFrame(updateSparkles);
  }, []);

  useEffect(() => {
    if (!isRetro || !mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSparkleTimeRef.current > SPARKLE_INTERVAL) {
        sparklesRef.current.push(createSparkle(e.clientX, e.clientY));
        lastSparkleTimeRef.current = now;
      }
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(updateSparkles);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRetro, mounted, createSparkle, updateSparkles]);

  if (!mounted || !isRetro) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}

