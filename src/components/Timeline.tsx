"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { usePreferencesSafe } from "@/lib/usePreferences";

export interface TimelineEntry {
	yearStart: string;
	yearEnd?: string;
	title: string;
	items: string[];
}

interface TimelineProps {
	entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [lineHeight, setLineHeight] = useState(0);
	const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
	const preferences = usePreferencesSafe();
	const animationsEnabled = preferences?.animationsEnabled ?? true;

	// Handle scroll-based line drawing
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateLineHeight = () => {
			const rect = container.getBoundingClientRect();
			const containerTop = rect.top;
			const containerHeight = rect.height;
			const viewportHeight = window.innerHeight;

			// Calculate how much of the container has been scrolled past
			const scrollProgress = Math.max(
				0,
				Math.min(1, (viewportHeight * 0.5 - containerTop) / containerHeight),
			);

			setLineHeight(scrollProgress * 100);
		};

		updateLineHeight();
		window.addEventListener("scroll", updateLineHeight, { passive: true });
		window.addEventListener("resize", updateLineHeight, { passive: true });

		return () => {
			window.removeEventListener("scroll", updateLineHeight);
			window.removeEventListener("resize", updateLineHeight);
		};
	}, []);

	// Handle intersection observer for revealing items
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = Number(entry.target.getAttribute("data-index"));
					if (entry.isIntersecting) {
						setVisibleItems((prev) => new Set([...prev, index]));
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: "0px 0px -10% 0px",
			},
		);

		const items = containerRef.current?.querySelectorAll("[data-index]");
		items?.forEach((item) => observer.observe(item));

		return () => observer.disconnect();
	}, [entries]);

	return (
		<div ref={containerRef} className="relative py-8">
			{/* SVG Timeline Line */}
			<div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2">
				{/* Background track */}
				<div className="absolute inset-0 bg-border" />
				{/* Animated fill */}
				<div
					className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-secondary to-accent transition-all duration-150 ease-out"
					style={{ height: `${lineHeight}%` }}
				/>
			</div>

			{/* Timeline Entries */}
			<div className="relative space-y-12 md:space-y-16">
				{entries.map((entry, index) => {
					const isVisible = visibleItems.has(index);
					const isEven = index % 2 === 0;

					return (
						<div
							key={index}
							data-index={index}
							className={`
                relative pl-12 md:pl-0 
                md:grid md:grid-cols-2 md:gap-8
                transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
							style={{ transitionDelay: `${index * 50}ms` }}
						>
							{/* Timeline Node */}
							<div
								className={`
                  absolute left-4 md:left-1/2 top-1 
                  w-3 h-3 -translate-x-1/2
                  rounded-full border-2 border-primary bg-background
                  transition-all duration-500
                  ${isVisible ? "scale-100 border-primary" : "scale-0 border-transparent"}
                `}
								style={{ transitionDelay: `${index * 50 + 200}ms` }}
							>
								{/* Pulse effect */}
								<div
									className={`
                    absolute inset-0 rounded-full bg-primary/30
                    transition-all duration-500
                    ${isVisible ? "animate-ping" : "opacity-0"}
                  `}
									style={{
										animationIterationCount: 1,
										animationDuration: "1s",
									}}
								/>
							</div>

							{/* Content positioning for desktop */}
							<div
								className={`
                  md:contents
                  ${isEven ? "" : "md:flex md:flex-row-reverse"}
                `}
							>
								{/* Year Badge - positioned based on even/odd */}
								<div
									className={`
                    ${isEven ? "md:text-right md:pr-12" : "md:text-left md:pl-12 md:col-start-2"}
                  `}
								>
									<div
										className={`
                      inline-flex items-center gap-1.5
                      px-4 py-2
                      text-sm font-mono font-bold tracking-wide
                      bg-card text-foreground
                      rounded-lg border border-border
                      shadow-sm
                      transition-all duration-500
                      ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                    `}
										style={{ transitionDelay: `${index * 50 + 100}ms` }}
									>
										<span className="text-primary">{entry.yearStart}</span>
										{entry.yearEnd && (
											<>
												<ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
												<span className="text-secondary">{entry.yearEnd}</span>
											</>
										)}
									</div>
								</div>

								{/* Content Card */}
								<div
									className={`
                    mt-3 md:mt-0
                    ${isEven ? "md:pl-12 md:col-start-2" : "md:pr-12 md:text-right md:col-start-1 md:row-start-1"}
                  `}
								>
									<h3 className="font-serif text-xl font-semibold mb-3 text-foreground">
										{entry.title}
									</h3>
									<ul
										className={`
                      space-y-2 text-muted-foreground
                      ${isEven ? "" : "md:text-right"}
                    `}
									>
										{entry.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className={`
                          relative pl-4 
                          ${isEven ? "md:pl-4" : "md:pl-0 md:pr-4"}
                          transition-all duration-500
                          ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${isEven ? "-translate-x-4" : "translate-x-4"}`}
                        `}
												style={{
													transitionDelay: `${index * 50 + 200 + itemIndex * 100}ms`,
												}}
											>
												{/* Bullet */}
												<span
													className={`
                            absolute top-2 w-1.5 h-1.5 rounded-full bg-secondary
                            ${isEven ? "left-0" : "md:right-0 md:left-auto left-0"}
                          `}
												/>
												<span dangerouslySetInnerHTML={{ __html: item }} />
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* End cap */}
			<div
				className={`
          absolute left-4 md:left-1/2 bottom-0 
          w-4 h-4 -translate-x-1/2 translate-y-1/2
          rounded-full bg-gradient-to-br from-primary to-accent
          transition-all duration-700
          ${lineHeight > 95 ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        `}
			/>
		</div>
	);
}
