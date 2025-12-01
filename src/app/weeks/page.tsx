import { Metadata } from "next";
import { generateWeeksData, getWeeksStats, getDecadeLabel } from "@/lib/weeks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
	title: "Weeks | Gabby's Garden",
	description:
		"A visualization of my life in weeks, showing each week until my 100th birthday.",
};

// Map decades to CSS class names
const decadeColors: Record<number, string> = {
	1990: "week-decade-1990",
	2000: "week-decade-2000",
	2010: "week-decade-2010",
	2020: "week-decade-2020",
	2030: "week-decade-2030",
	2040: "week-decade-2040",
	2050: "week-decade-2050",
	2060: "week-decade-2060",
	2070: "week-decade-2070",
	2080: "week-decade-2080",
	2090: "week-decade-2090",
};

// Age milestones to show labels for
const ageMilestones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function WeeksPage() {
	const weeks = generateWeeksData();
	const stats = getWeeksStats(weeks);

	// Group weeks by year (52 weeks each) for the year markers
	const yearsData = ageMilestones.map((age) => ({
		age,
		weekIndex: age * 52,
		year: 1993 + age,
	}));

	// Get unique decades for the legend
	const decades = [...new Set(weeks.map((w) => w.decade))].sort();

	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="max-w-6xl mx-auto px-6 pt-12 pb-8">
				<h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-center">
					My Life in Weeks
				</h1>
				<p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
					This is a visualization of my life in weeks, showing each week until
					my 100th birthday with important dates and life transitions called
					out.
				</p>
			</header>

			{/* Stats Bar */}
			<section className="max-w-6xl mx-auto px-6 pb-8">
				<div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<span className="font-medium text-foreground">
							{stats.weeksLived.toLocaleString()}
						</span>
						<span>weeks lived</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium text-foreground">
							{stats.weeksRemaining.toLocaleString()}
						</span>
						<span>weeks remaining</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium text-foreground">
							{stats.percentageLived}%
						</span>
						<span>of 100 years</span>
					</div>
				</div>
			</section>

			{/* Legend */}
			<section className="max-w-6xl mx-auto px-6 pb-8">
				<div className="flex flex-wrap justify-center gap-3 text-xs">
					{decades.slice(0, 6).map((decade) => (
						<div key={decade} className="flex items-center gap-1.5">
							<div
								className={cn(
									"w-3 h-3 rounded-sm",
									decadeColors[decade] || "bg-muted",
								)}
							/>
							<span className="text-muted-foreground">
								{getDecadeLabel(decade)}
							</span>
						</div>
					))}
					<div className="flex items-center gap-1.5">
						<div className="w-3 h-3 rounded-sm bg-muted opacity-40" />
						<span className="text-muted-foreground">Future</span>
					</div>
				</div>
			</section>

			{/* Weeks Grid */}
			<section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
				<div className="relative">
					{/* Year markers on the left */}
					<div className="hidden md:block absolute left-0 top-0 w-12 -ml-14">
						{yearsData.map(({ age, weekIndex, year }) => (
							<div
								key={age}
								className="absolute text-xs text-muted-foreground whitespace-nowrap"
								style={{
									top: `${Math.floor(weekIndex / 52) * (10 + 3)}px`, // 10px cell + 3px gap
								}}
							>
								<span className="font-medium">{age}</span>
								<span className="text-muted-foreground/60 ml-1">({year})</span>
							</div>
						))}
					</div>

					{/* The grid */}
					<div className="weeks-grid">
						{weeks.map((week) => (
							<div
								key={week.index}
								className={cn(
									"week-cell group relative",
									decadeColors[week.decade] || "bg-muted",
									week.isFuture && "week-future",
									week.isCurrent && "week-current",
									week.event && "week-milestone",
								)}
								data-has-event={!!week.event}
							>
								{/* Emoji indicator for milestones */}
								{week.event && (
									<span className="week-emoji">{week.event.emoji}</span>
								)}

								{/* Tooltip */}
								<div className="week-tooltip">
									<div className="week-tooltip-content">
										{week.event ? (
											<>
												<div className="flex items-center gap-2 mb-1">
													<span className="text-base">{week.event.emoji}</span>
													<span className="font-medium">
														{week.event.title}
													</span>
												</div>
												<div className="text-xs text-muted-foreground mb-2">
													{format(week.startDate, "MMMM d, yyyy")} · Age{" "}
													{week.age}
												</div>
											</>
										) : (
											<div className="text-xs text-muted-foreground mb-2">
												{format(week.startDate, "MMMM d, yyyy")} · Age{" "}
												{week.age}
											</div>
										)}
										{(week.currentBased || week.currentDoing) && (
											<div className="text-xs space-y-1 border-t border-border pt-2 mt-1">
												{week.currentBased && (
													<div className="flex items-center gap-1.5">
														<span>📍</span>
														<span>{week.currentBased}</span>
													</div>
												)}
												{week.currentDoing && (
													<div className="flex items-center gap-1.5">
														<span>💼</span>
														<span>{week.currentDoing}</span>
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer note */}
			<section className="max-w-2xl mx-auto px-6 pb-12 text-center">
				<p className="text-sm text-muted-foreground">
					Inspired by{" "}
					<a
						href="https://weeks.ginatrapani.org"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						Gina Trapani&apos;s Life in Weeks
					</a>{" "}
					and{" "}
					<a
						href="https://waitbutwhy.com/2014/05/life-weeks.html"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						Wait But Why
					</a>
					.
				</p>
			</section>
		</div>
	);
}
