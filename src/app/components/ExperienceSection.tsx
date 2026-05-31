import { useRef } from "react";
import { motion, useInView } from "motion/react";
import LaserFlow from "./ui/LaserFlow";
import ScrollStack, { ScrollStackItem } from "./ui/ScrollStack";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  color: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    company: "Ferns and Petals (FNP)",
    role: "SDE III",
    period: "March 2022 - Present",
    location: "Leading Search & Discovery POD",
    highlights: [
      "Leading FNP.com Search & Discovery POD and Merchandising Platform, driving frontend architecture and performance optimization",
      "Optimized Core Web Vitals through lazy loading, code splitting, Akamai CDN caching, and SSR strategies",
      "Enhanced SEO via structured data, metadata optimization, and technical audits using PageSpeed Insights",
      "Architected backend-driven homepage platform with dynamic, UI-driven system for B2B users",
      "Designed dynamic grid and widget-based rendering system for flexible, responsive layouts",
      "Monitor production using CubeAPM, Kibana, New Relic ensuring high availability",
    ],
    color: "from-primary to-accent",
  },
  {
    company: "Green Apex Technolabs",
    role: "JS Engineer",
    period: "Aug 2021 - Jan 2022",
    location: "B2B Application Development",
    highlights: [
      "Developed responsive B2B React Admin applications using React, TypeScript, and REST APIs",
      "Delivered pixel-perfect, cross-browser compatible UIs with reusable components",
      "Worked in Agile environments ensuring rapid delivery and quality",
    ],
    color: "from-accent to-secondary",
  },
  {
    company: "Vivo India Pvt Ltd",
    role: "QA Engineer",
    period: "Dec 2018 - June 2020",
    location: "Mobile Software Testing",
    highlights: [
      "Performed manual mobile software and functional testing for smartphones",
      "Ensured high-quality user experience and defect-free releases",
    ],
    color: "from-secondary to-primary",
  },
  {
    company: "Dixon Technologies",
    role: "QA Engineer",
    period: "Aug 2017 - Oct 2018",
    location: "Mobile Validation",
    highlights: [
      "Conducted comprehensive mobile validation and cross-platform testing",
      "Ensured zero critical bugs for high-traffic applications",
    ],
    color: "from-primary/70 to-accent/70",
  },
];

/**
 * Single experience card content used inside ScrollStackItem.
 */
function ExperienceCardContent({ exp }: { exp: ExperienceItem }) {
  return (
    <article className="flex h-full flex-col">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="experience-card-title text-2xl font-semibold text-foreground">{exp.company}</h3>
          <p className="experience-card-role mt-1 text-lg text-primary">{exp.role}</p>
          <p className="experience-card-meta mt-1 text-sm text-muted-foreground">{exp.location}</p>
        </div>
        <time className="experience-card-meta whitespace-nowrap text-sm text-muted-foreground">{exp.period}</time>
      </div>
      <ul className="experience-card-list space-y-3">
        {exp.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3 text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * Static timeline fallback when reduced motion is preferred.
 */
function ExperienceTimelineStatic({
  isInView,
  reducedMotion,
}: {
  isInView: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative space-y-8 pl-8 md:pl-12">
      <div
        className="absolute left-3 top-0 bottom-0 w-0.5 origin-top rounded-full bg-gradient-to-b from-primary via-accent to-secondary md:left-5"
        aria-hidden="true"
      />

      {EXPERIENCES.map((exp, index) => (
        <motion.article
          key={exp.company}
          initial={{ opacity: 0, x: reducedMotion ? 0 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reducedMotion ? 0 : -50 }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          className="group relative"
        >
          <div
            className="absolute -left-[1.35rem] top-8 z-10 h-3 w-3 rounded-full border-2 border-background bg-primary md:-left-[1.85rem]"
            aria-hidden="true"
          />
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${exp.color} opacity-10 blur-xl`}
            aria-hidden="true"
          />
          <div className="experience-stack-card relative rounded-2xl border border-border/80 bg-card/75 p-8 backdrop-blur-md">
            <ExperienceCardContent exp={exp} />
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/**
 * Experience section with ScrollStack card stacking and LaserFlow background.
 */
export default function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="experience"
      ref={ref}
      aria-labelledby="experience-heading"
      className="experience-section relative isolate overflow-hidden px-6 pt-20 pb-8"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#0a0810]" aria-hidden="true">
        {!reducedMotion ? (
          <LaserFlow
            color="#CF9EFF"
            horizontalBeamOffset={0.1}
            verticalBeamOffset={0.0}
            horizontalSizing={0.5}
            verticalSizing={2}
            wispDensity={1}
            wispSpeed={15}
            wispIntensity={5}
            flowSpeed={0.35}
            flowStrength={0.25}
            fogIntensity={0.45}
            fogScale={0.3}
            fogFallSpeed={0.6}
            mouseTiltStrength={0.01}
            decay={1.1}
            falloffStart={1.2}
            className="h-full w-full"
          />
        ) : null}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,hsl(var(--background)/0.4)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-2 sm:px-4">
        <motion.header
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-4"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "4rem" } : { width: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 rounded-full bg-gradient-to-r from-primary to-accent"
            aria-hidden="true"
          />
          <h2 id="experience-heading" className="experience-section-heading text-5xl font-bold">
            Experience
          </h2>
          <p className="experience-section-subtitle max-w-xl text-muted-foreground">
            Scroll to explore roles — cards stack as you move through my career timeline.
          </p>
        </motion.header>

        {reducedMotion ? (
          <ExperienceTimelineStatic isInView={isInView} reducedMotion={reducedMotion} />
        ) : (
          <ScrollStack
            useWindowScroll
            className="experience-scroll-stack"
            itemDistance={120}
            itemScale={0.035}
            itemStackDistance={32}
            stackPosition="22%"
            scaleEndPosition="12%"
            baseScale={0.9}
            blurAmount={0}
            rotationAmount={0}
          >
            {EXPERIENCES.map((exp) => (
              <ScrollStackItem
                key={exp.company}
                itemClassName="experience-stack-card border border-border/80 bg-card/95 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
              >
                <div
                  className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br ${exp.color} opacity-[0.08]`}
                  aria-hidden="true"
                />
                <div className="relative">
                  <ExperienceCardContent exp={exp} />
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        )}
      </div>
    </section>
  );
}
