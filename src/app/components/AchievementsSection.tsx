import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Award, Calendar, Code2, GraduationCap, Target, TrendingUp, type LucideIcon } from "lucide-react";
import Aurora from "./ui/Aurora";
import ElectricBorder from "./ui/ElectricBorder";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface AchievementItem {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
  borderColor: string;
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    icon: Award,
    title: "Best Performer Award",
    description: "Recognized for outstanding performance and contributions",
    details: "2023, 2024, 2025 - FNP",
    borderColor: "#7df9ff",
  },
  {
    icon: Target,
    title: "POD Leadership",
    description: "Leading Search & Discovery POD at FNP",
    details: "Driving frontend architecture and team excellence",
    borderColor: "#a78bfa",
  },
  {
    icon: TrendingUp,
    title: "Performance Optimization",
    description: "Significantly improved Core Web Vitals",
    details: "Enhanced LCP, INP, and CLS metrics",
    borderColor: "#34d399",
  },
  {
    icon: Code2,
    title: "Continuous Learning",
    description: "Multiple Udemy certifications",
    details: "React, Redux, Hooks, Testing, Node.js, Java, Python",
    borderColor: "#f472b6",
  },
];

interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  level: string;
  borderColor: string;
}

const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Technology",
    field: "Electronics & Communication Engineering",
    institution: "BTKIT",
    location: "Dwarahat, Uttarakhand",
    period: "June 2014 – July 2017",
    level: "BTech",
    borderColor: "#818cf8",
  },
  {
    degree: "Diploma",
    field: "Electronics & Communication Engineering",
    institution: "Government Polytechnic",
    location: "Dwarahat, Uttarakhand",
    period: "June 2011 – July 2014",
    level: "Diploma",
    borderColor: "#c084fc",
  },
];

/**
 * Single education entry card with electric border.
 */
function EducationCard({
  item,
  reducedMotion,
  index,
}: {
  item: EducationItem;
  reducedMotion: boolean;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex min-h-0 flex-1"
    >
      <ElectricBorder
        color={item.borderColor}
        speed={0.85}
        chaos={0.1}
        borderRadius={16}
        reducedMotion={reducedMotion}
        className="h-full w-full"
        style={{ borderRadius: 16 }}
      >
        <article className="flex h-full flex-col gap-5 rounded-2xl bg-card/85 p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: `${item.borderColor}22`,
                color: item.borderColor,
              }}
            >
              {item.level}
            </span>
            <time
              dateTime={item.period.replace(" – ", "/")}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.period}
            </time>
          </div>

          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${item.borderColor}22, ${item.borderColor}44)`,
              }}
            >
              <GraduationCap
                className="h-6 w-6"
                style={{ color: item.borderColor }}
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                {item.degree}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.field}
              </p>
            </div>
          </div>

          <div className="mt-auto border-t border-border/60 pt-4">
            <p className="font-medium text-foreground">{item.institution}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{item.location}</p>
          </div>
        </article>
      </ElectricBorder>
    </motion.li>
  );
}

/**
 * Achievements section with Aurora background and electric-border cards.
 */
export default function AchievementsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="achievements"
      ref={ref}
      aria-labelledby="achievements-heading"
      className="relative isolate min-h-screen overflow-hidden px-6 py-20"
    >
      {/* Aurora background — violet / magenta / amber */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {!reducedMotion ? (
          <Aurora
            colorStops={["#6366f1", "#c026d3", "#f59e0b"]}
            amplitude={1.2}
            blend={0.55}
            className="h-full w-full opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-fuchsia-950/30 to-background" />
        )}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/60 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="w-full space-y-12"
        >
          <header className="space-y-4">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "4rem" } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400"
              aria-hidden="true"
            />
            <h2 id="achievements-heading" className="text-5xl font-bold">
              Achievements & Recognition
            </h2>
          </header>

          <ul className="grid gap-6 md:grid-cols-2">
            {ACHIEVEMENTS.map((achievement, index) => (
              <motion.li
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <ElectricBorder
                  color={achievement.borderColor}
                  speed={1}
                  chaos={0.12}
                  borderRadius={16}
                  reducedMotion={reducedMotion}
                  className="h-full w-full"
                  style={{ borderRadius: 16 }}
                >
                  <article className="h-full space-y-4 rounded-2xl bg-card/85 p-8 backdrop-blur-md">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${achievement.borderColor}22, ${achievement.borderColor}44)`,
                      }}
                    >
                      <achievement.icon
                        className="h-7 w-7"
                        style={{ color: achievement.borderColor }}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{achievement.title}</h3>
                      <p className="mt-2 text-muted-foreground">{achievement.description}</p>
                      <p className="mt-2 text-sm" style={{ color: achievement.borderColor }}>
                        {achievement.details}
                      </p>
                    </div>
                  </article>
                </ElectricBorder>
              </motion.li>
            ))}
          </ul>

          <div className="space-y-6 pt-2">
            <header className="space-y-2">
              <div
                className="h-0.5 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                aria-hidden="true"
              />
              <h3 id="education-heading" className="text-3xl font-bold">
                Education
              </h3>
              <p className="max-w-2xl text-muted-foreground">
                Formal training in electronics and communication engineering from institutions in
                Uttarakhand.
              </p>
            </header>

            <ol
              aria-labelledby="education-heading"
              className="relative grid list-none gap-6 md:grid-cols-2 md:gap-8"
            >
              {EDUCATION.map((item, index) => (
                <EducationCard
                  key={`${item.level}-${item.period}`}
                  item={item}
                  reducedMotion={reducedMotion}
                  index={index}
                />
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
