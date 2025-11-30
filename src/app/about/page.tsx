import { Metadata } from "next";
import { Timeline, TimelineEntry } from "@/components/Timeline";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Digital Garden",
  description: "The gardener behind the garden.",
};

const introItems = [
  {
    emoji: "🌲",
    text: "I live on the west coast but New England will always be home",
  },
  {
    emoji: "👩‍💻",
    text: "I'm a software engineer passionate about making products that help people",
  },
  {
    emoji: "🏳️‍⚧️",
    text: "I'm a queer trans woman and use she/her/hers pronouns",
  },
  {
    emoji: "🐱",
    text: "I'm a cat mom to two little gremlins who I love very dearly",
  },
  {
    emoji: "☕",
    text: "I love coffee, craft cocktails 🍸, and trying all kinds of food 🍴",
  },
];

const timelineData: TimelineEntry[] = [
  {
    yearStart: "2011",
    yearEnd: "2015",
    title: "Student at Williams College",
    items: [
      "I majored in political science but took a range of classes — from legal theory to the history and culture of French wines!",
      "From <strong>2013-2014</strong> I was extremely fortunate to study at Exeter College at the <strong>University of Oxford</strong> as a visiting student in the Williams-Exeter Programme",
      "In <strong>2015</strong> I got my first taste of programming with <em>Diving Into the Deluge of Data</em>, an introductory computer science course teaching the fundamentals of programming through working with data in Python. It was great!",
    ],
  },
  {
    yearStart: "2015",
    yearEnd: "2019",
    title: "Living and working in Vermont",
    items: [
      "For much of this time I was a <strong>business analyst</strong> at Middlebury Interactive Languages, an EdTech company that helped K-12 students learn foreign languages. It was fun! It also gave me an opportunity to apply some Python skills to my day to day work, deepening my love of programming",
      "I briefly worked in marketing and community outreach for a solar company which felt great and let me spend a lot of time out in the sun",
      "I also freelanced as a tutor and education consultant, helping students apply to colleges",
    ],
  },
  {
    yearStart: "2019",
    title: "Learning software engineering",
    items: [
      "I moved to <strong>Austin, Texas</strong> and did a full-stack software engineering bootcamp through <strong>Hack Reactor.</strong> It changed my life!",
      "I learned everything from jQuery to React Native, built a ton of full-stack apps, and made some life-long friends",
    ],
  },
  {
    yearStart: "2019",
    yearEnd: "2024",
    title: "Working at LinkedIn",
    items: [
      "I moved to the Bay Area and started as an <strong>apprentice engineer</strong> at LinkedIn through REACH, their program targeted at bootcamp grads and self-taught engineers.",
      "Eventually I was able to grow into a <strong>software engineer</strong> and then a <strong>senior software engineer,</strong> doing various product work across a few teams in LinkedIn's Feed org.",
      "I'm most proud of the <strong>accessibility (a11y)</strong> work I did at LinkedIn, helping to make the feed a more accessible user experience for everyone. I was also extremely fortunate to work on hiring, recruiting, and mentorship for the REACH Apprenticeship, helping more engineers from non-traditional backgrounds find their footing and launch their careers.",
    ],
  },
  {
    yearStart: "2025",
    yearEnd: "now",
    title: "Working at Handshake",
    items: [
      "I can't say much about it, but I'm working on an awesome internal startup at Handshake as a <strong>founding engineer</strong> and having a blast!",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          About
        </h1>
        <p className="text-xl text-muted-foreground">
          The gardener behind the garden.
        </p>
      </header>

      {/* Intro Section */}
      <section className="max-w-3xl mx-auto px-6 pb-12 flex-col items-center justify-center flex">
        <h2 className="font-serif text-2xl font-semibold mb-6">
          Here&apos;s a few things about me:
        </h2>
        <ul className="space-y-3">
          {introItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-lg text-foreground"
            >
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Image section */}
      <section className="max-w-3xl mx-auto px-6 pb-12 flex justify-center">
        <Image
          src="https://m2odgjcmaljdcanu.public.blob.vercel-storage.com/gabby-pixel.jpg"
          alt="Orphan Andy"
          width={500}
          height={500}
          className="rounded-lg"
        />
      </section>

      {/* Timeline Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-serif text-2xl font-semibold mb-8 text-center md:text-left">
          Here&apos;s a rough timeline of things I&apos;ve done personally &amp;
          professionally:
        </h2>
        <Timeline entries={timelineData} />
      </section>
    </div>
  );
}
