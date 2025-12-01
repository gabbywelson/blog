import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  addWeeks,
  differenceInWeeks,
  isBefore,
  isAfter,
  startOfWeek,
  isSameWeek,
} from "date-fns";

// Birth date - the starting point
const BIRTH_DATE = new Date(1993, 5, 12); // June 12, 1993
const WEEKS_IN_100_YEARS = 52 * 100; // ~5,200 weeks

// Type for raw YAML event data
interface RawEventData {
  title?: string;
  emoji?: string;
  based?: string;
  doing?: string;
}

// Type for a milestone event
export interface MilestoneEvent {
  date: Date;
  title: string;
  emoji: string;
  based?: string;
  doing?: string;
}

// Type for each week in the visualization
export interface Week {
  index: number;
  startDate: Date;
  decade: number;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  age: number;
  event?: MilestoneEvent;
  currentBased?: string;
  currentDoing?: string;
}

// Parse the YAML file and extract events
function parseWeeksYaml(): MilestoneEvent[] {
  const filePath = path.join(process.cwd(), "src/data/weeks.yml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(fileContents) as Record<string, RawEventData[]>;

  const events: MilestoneEvent[] = [];

  for (const [dateStr, items] of Object.entries(data)) {
    // Parse date string (format: "YYYY-MM-DD")
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Combine all items for this date into one event
    const combined: MilestoneEvent = {
      date,
      title: "",
      emoji: "",
    };

    for (const item of items) {
      if (item.title) combined.title = item.title;
      if (item.emoji) combined.emoji = item.emoji;
      if (item.based) combined.based = item.based;
      if (item.doing) combined.doing = item.doing;
    }

    events.push(combined);
  }

  // Sort by date
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Get the decade for a given date
function getDecade(date: Date): number {
  return Math.floor(date.getFullYear() / 10) * 10;
}

// Generate all weeks data
export function generateWeeksData(): Week[] {
  const events = parseWeeksYaml();
  const now = new Date();
  const weeks: Week[] = [];

  // Track current state (location/activity) as we iterate
  let currentBased: string | undefined;
  let currentDoing: string | undefined;

  // Create an index of events by week number for quick lookup
  const eventsByWeek = new Map<number, MilestoneEvent>();
  for (const event of events) {
    const weekIndex = differenceInWeeks(event.date, BIRTH_DATE);
    if (weekIndex >= 0 && weekIndex < WEEKS_IN_100_YEARS) {
      eventsByWeek.set(weekIndex, event);
    }
  }

  // Generate all weeks
  for (let i = 0; i < WEEKS_IN_100_YEARS; i++) {
    const weekStart = addWeeks(BIRTH_DATE, i);
    const decade = getDecade(weekStart);
    const age = Math.floor(i / 52);

    // Check if this week has an event
    const event = eventsByWeek.get(i);

    // Update current state if this event has new info
    if (event) {
      if (event.based) currentBased = event.based;
      if (event.doing) currentDoing = event.doing;
    }

    // Determine if past/current/future
    const weekEnd = addWeeks(weekStart, 1);
    const isPast = isBefore(weekEnd, now);
    const isCurrent = isSameWeek(weekStart, now, { weekStartsOn: 0 });
    const isFuture = isAfter(weekStart, now) && !isCurrent;

    weeks.push({
      index: i,
      startDate: weekStart,
      decade,
      isPast,
      isCurrent,
      isFuture,
      age,
      event,
      currentBased: currentBased,
      currentDoing: currentDoing,
    });
  }

  return weeks;
}

// Get summary stats
export function getWeeksStats(weeks: Week[]) {
  const now = new Date();
  const weeksLived = differenceInWeeks(now, BIRTH_DATE);
  const weeksRemaining = WEEKS_IN_100_YEARS - weeksLived;
  const percentageLived = (weeksLived / WEEKS_IN_100_YEARS) * 100;

  return {
    totalWeeks: WEEKS_IN_100_YEARS,
    weeksLived,
    weeksRemaining,
    percentageLived: percentageLived.toFixed(1),
    currentAge: Math.floor(weeksLived / 52),
  };
}

// Get decade label for display
export function getDecadeLabel(decade: number): string {
  if (decade < 2000) return `${decade - 1900}s`;
  return `${decade}s`;
}

