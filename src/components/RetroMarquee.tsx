"use client";

import { useCurrentTheme } from "@/lib/useCurrentTheme";
import { cn } from "@/lib/utils";

interface RetroMarqueeProps {
	children: React.ReactNode;
	/** Speed in seconds for one complete scroll. Default: 15 */
	speed?: number;
	/** Direction: 'left' (default) or 'right' */
	direction?: "left" | "right";
	/** Additional className for the container */
	className?: string;
	/** Whether to show a border */
	bordered?: boolean;
}

/**
 * A scrolling marquee that only renders in retro theme.
 * Classic 90s web vibes!
 */
export function RetroMarquee({
	children,
	speed = 15,
	direction = "left",
	className,
	bordered = true,
}: RetroMarqueeProps) {
	const { isRetro, mounted } = useCurrentTheme();

	if (!mounted || !isRetro) return null;

	return (
		<div
			className={cn(
				"overflow-hidden py-2",
				bordered && "border-2 border-[#ff00ff] bg-[#000033]",
				className,
			)}
		>
			<div
				className="whitespace-nowrap"
				style={{
					animation: `marquee-${direction} ${speed}s linear infinite`,
				}}
			>
				{children}
			</div>
			<style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
		</div>
	);
}

/**
 * A decorative star/emoji marquee for section dividers.
 */
export function RetroStarMarquee({
	speed = 20,
	direction = "left",
}: {
	speed?: number;
	direction?: "left" | "right";
}) {
	return (
		<RetroMarquee speed={speed} direction={direction} bordered={false}>
			<span className="text-xl">
				⭐ 💫 ✨ 🌟 ⭐ 💫 ✨ 🌟 ⭐ 💫 ✨ 🌟 ⭐ 💫 ✨ 🌟 ⭐ 💫 ✨ 🌟 ⭐ 💫 ✨ 🌟
				⭐ 💫 ✨ 🌟 ⭐ 💫 ✨ 🌟
			</span>
		</RetroMarquee>
	);
}

/**
 * A "NEW!" or announcement marquee with blinking elements.
 */
export function RetroAnnouncementMarquee({
	message,
	speed = 12,
}: {
	message: string;
	speed?: number;
}) {
	return (
		<RetroMarquee speed={speed} className="bg-[#ffff00] border-[#ff0000]">
			<span className="text-[#ff0000] font-bold">
				<span className="retro-blink">🔥 NEW! 🔥</span> {message}{" "}
				<span className="retro-blink">🔥 NEW! 🔥</span> {message}{" "}
				<span className="retro-blink">🔥 NEW! 🔥</span> {message}
			</span>
		</RetroMarquee>
	);
}
