"use client";

import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Sparkles, ChevronDown, Zap, ZapOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences, Theme } from "@/lib/usePreferences";

const themes: { key: Theme; label: string; icon: typeof Sun }[] = [
	{ key: "light", label: "Light", icon: Sun },
	{ key: "dark", label: "Dark", icon: Moon },
	{ key: "retro", label: "Retro", icon: Sparkles },
];

export function ThemeToggle() {
	const {
		theme,
		setTheme,
		mounted,
		animationsEnabled,
		toggleAnimations,
		isRetro,
	} = usePreferences();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close on escape key
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	if (!mounted) {
		return (
			<button className="p-2 rounded-lg bg-muted" aria-label="Toggle theme">
				<Sun className="w-5 h-5" />
			</button>
		);
	}

	const currentTheme = themes.find((t) => t.key === theme) || themes[0];
	const CurrentIcon = currentTheme.icon;

	return (
		<div ref={dropdownRef} className="relative">
			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex items-center gap-1 p-2 rounded-lg transition-all duration-200",
					"bg-muted hover:bg-primary/20",
					"border border-transparent hover:border-primary/30",
					"focus:outline-none focus:ring-2 focus:ring-primary/50",
					isRetro && [
						"rounded-none",
						"bg-[#000099]",
						"border-2",
						"border-t-[#3333cc] border-l-[#3333cc]",
						"border-b-[#000033] border-r-[#000033]",
					],
				)}
				aria-label="Open theme menu"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<CurrentIcon className="w-5 h-5 text-foreground" />
				<ChevronDown
					className={cn(
						"w-3 h-3 text-muted-foreground transition-transform duration-200",
						isOpen && "rotate-180",
					)}
				/>
			</button>

			{/* Dropdown Menu */}
			<div
				className={cn(
					"absolute right-0 top-full mt-2 min-w-[200px]",
					"bg-card border border-border rounded-xl shadow-xl shadow-foreground/5",
					"overflow-hidden",
					"transition-all duration-200 origin-top-right",
					isOpen
						? "opacity-100 scale-100 translate-y-0"
						: "opacity-0 scale-95 -translate-y-2 pointer-events-none",
					isRetro && [
						"rounded-none",
						"bg-[#000066]",
						"border-4",
						"border-t-[#6666ff] border-l-[#6666ff]",
						"border-b-[#000033] border-r-[#000033]",
						"shadow-[4px_4px_0px_#000000]",
					],
				)}
			>
				{/* Theme Section */}
				<div className="p-2">
					<div
						className={cn(
							"px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							isRetro && "text-[#00ffff] font-bold",
						)}
					>
						Theme
					</div>
					<div className="space-y-1">
						{themes.map((themeOption) => {
							const Icon = themeOption.icon;
							const isActive = theme === themeOption.key;
							const isRetroOption = themeOption.key === "retro";

							return (
								<button
									key={themeOption.key}
									onClick={() => {
										setTheme(themeOption.key);
										setIsOpen(false);
									}}
									className={cn(
										"w-full flex items-center gap-3 px-3 py-2 rounded-lg",
										"transition-all duration-150",
										"text-left text-sm",
										isActive
											? "bg-primary/20 text-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted",
										isRetro && [
											"rounded-none",
											isActive
												? "bg-[#ff00ff] text-white"
												: "hover:bg-[#000099] text-[#00ffff] hover:text-[#ffff00]",
										],
									)}
								>
									<Icon className="w-4 h-4" />
									<span
										className={cn(
											"flex-1",
											// Style "Retro" option with fun font
											isRetroOption && [
												"font-bold tracking-wide",
												!isRetro && "font-[var(--font-retro-display)]",
												isRetro &&
													"font-[var(--font-retro-display)] text-[#ffff00]",
											],
										)}
									>
										{isRetroOption ? "✨ Retro ✨" : themeOption.label}
									</span>
									{isActive && (
										<span
											className={cn(
												"w-2 h-2 rounded-full bg-primary",
												isRetro && "bg-[#00ff00] rounded-none",
											)}
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Divider */}
				<div
					className={cn(
						"h-px bg-border mx-2",
						isRetro && "h-[3px] bg-[#ff00ff]",
					)}
				/>

				{/* Animation Toggle Section */}
				<div className="p-2">
					<div
						className={cn(
							"px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							isRetro && "text-[#00ffff] font-bold",
						)}
					>
						Effects
					</div>
					<button
						onClick={() => {
							toggleAnimations();
						}}
						className={cn(
							"w-full flex items-center gap-3 px-3 py-2 rounded-lg",
							"transition-all duration-150",
							"text-left text-sm",
							"text-muted-foreground hover:text-foreground hover:bg-muted",
							isRetro && [
								"rounded-none",
								"hover:bg-[#000099] text-[#00ffff] hover:text-[#ffff00]",
							],
						)}
					>
						{animationsEnabled ? (
							<Zap className="w-4 h-4 text-amber-500" />
						) : (
							<ZapOff className="w-4 h-4" />
						)}
						<span className="flex-1">
							{animationsEnabled ? "Disable Animations" : "Enable Animations"}
						</span>
						<div
							className={cn(
								"w-10 h-5 rounded-full relative transition-colors duration-200",
								animationsEnabled ? "bg-primary" : "bg-muted",
								isRetro && [
									"rounded-none border-2",
									animationsEnabled
										? "bg-[#00ff00] border-[#00ff00]"
										: "bg-[#333] border-[#666]",
								],
							)}
						>
							<div
								className={cn(
									"absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
									animationsEnabled ? "left-5" : "left-0.5",
									isRetro && "rounded-none",
								)}
							/>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
