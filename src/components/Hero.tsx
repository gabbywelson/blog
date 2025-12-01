"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Hero() {
	const { resolvedTheme } = useTheme();

	const heroImage = resolvedTheme === "dark" ? "/hero-dark.jpg" : "/hero.png";
	const showImage = resolvedTheme !== "retro";
	const isRetro = resolvedTheme === "retro";

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
					<div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
				</div>
			)}

			{/* Retro animated stars background */}
			{isRetro && (
				<div className="absolute inset-0 -z-10 overflow-hidden">
					{/* Animated shooting star */}
					<div className="absolute top-20 left-0 w-full">
						<div className="retro-marquee text-4xl">
							✨ ⭐ 💫 ✨ ⭐ 💫 ✨ ⭐ 💫 ✨ ⭐ 💫
						</div>
					</div>
				</div>
			)}

			{/* Content - The Clearing */}
			<div className="relative z-10 text-center space-y-4 max-w-2xl px-4">
				{/* Retro welcome banner */}
				{isRetro && (
					<div className="mb-6">
						<span className="retro-sparkle-decor text-2xl font-bold text-[#ffff00] retro-glow">
							WELCOME TO MY HOMEPAGE
						</span>
					</div>
				)}

				<h1
					className={cn(
						"font-serif text-5xl md:text-7xl font-bold tracking-tight",
						isRetro && "retro-rainbow",
					)}
				>
					{isRetro ? (
						<>Gabby&apos;s Garden</>
					) : (
						<>
							<span className="text-primary">Gabby&apos;s</span>{" "}
							<span className="text-secondary">Garden</span>
						</>
					)}
				</h1>

				{isRetro ? (
					<div className="overflow-hidden">
						<p className="text-xl text-[#00ffff] max-w-2xl mx-auto leading-relaxed retro-glow">
							<span className="retro-blink">★</span> My own little corner of the
							internet <span className="retro-blink">★</span>
						</p>
						<p className="text-lg text-[#00ff00] mt-2">
							~ Est. 2024 ~ Best viewed in Netscape Navigator ~
						</p>
					</div>
				) : (
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						My own little corner of the internet to share thoughts, link to my
						work, and let folks know what I&apos;m up to.
					</p>
				)}

				{/* Retro hit counter */}
				{isRetro && (
					<div className="mt-8 inline-block bg-black border-2 border-[#00ff00] px-4 py-2">
						<span className="text-[#00ff00] font-mono text-sm">
							You are visitor #{" "}
							<span className="text-[#ffff00]">
								{String(Math.floor(Math.random() * 9000) + 1000).padStart(
									6,
									"0",
								)}
							</span>
						</span>
					</div>
				)}
			</div>
		</section>
	);
}
