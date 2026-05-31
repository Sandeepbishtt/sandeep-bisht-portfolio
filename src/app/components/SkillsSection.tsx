import { useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import Orb from "./ui/Orb";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { springPop } from "../lib/motionVariants";
import {
  TECH_STACK_ITEMS,
  buildFunnelRows,
  getTechDisplayName,
  type TechStackItem,
} from "../lib/techStackData";

/**
 * Single glassmorphism tech icon card with hover glow.
 */
function TechStackCard({
  item,
  index,
  isInView,
  reducedMotion,
}: {
  item: TechStackItem;
  index: number;
  isInView: boolean;
  reducedMotion: boolean;
}) {
  const label = getTechDisplayName(item);

  return (
    <motion.div
      variants={springPop}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 22,
        delay: reducedMotion ? 0 : 0.08 + index * 0.025,
      }}
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.06 }}
      className="group relative"
    >
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 opacity-0 blur-md transition-all duration-300 group-hover:from-purple-500/40 group-hover:to-fuchsia-500/30 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div
        className="relative flex w-[4.5rem] flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2 py-3 backdrop-blur-md transition-all duration-300 group-hover:border-purple-400/70 group-hover:bg-white/[0.1] group-hover:shadow-[0_0_24px_rgba(168,85,247,0.35)] sm:w-[5.25rem]"
        title={item.name}
      >
        <img
          src={item.iconSrc}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className="h-8 w-8 object-contain sm:h-9 sm:w-9"
        />
        <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight text-white/80 sm:text-[11px]">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Funnel-shaped tech icon grid — widest row at top, narrowing toward center.
 */
function TechStackFunnel({
  rows,
  isInView,
  reducedMotion,
}: {
  rows: TechStackItem[][];
  isInView: boolean;
  reducedMotion: boolean;
}) {
  let cardIndex = 0;

  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 sm:gap-4"
      style={{ perspective: "900px" }}
    >
      {rows.map((row, rowIndex) => {
        const depthScale = 1 - rowIndex * 0.035;
        const depthOpacity = 1 - rowIndex * 0.04;

        return (
          <motion.div
            key={`row-${rowIndex}`}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={
              isInView
                ? { opacity: depthOpacity, y: 0, scale: depthScale }
                : { opacity: 0, y: 24, scale: 0.92 }
            }
            transition={{
              duration: 0.55,
              delay: reducedMotion ? 0 : 0.15 + rowIndex * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            style={{ transformStyle: "preserve-3d" }}
          >
            {row.map((item) => {
              const currentIndex = cardIndex;
              cardIndex += 1;

              return (
                <TechStackCard
                  key={item.name}
                  item={item}
                  index={currentIndex}
                  isInView={isInView}
                  reducedMotion={reducedMotion}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Static grid fallback when reduced motion is preferred.
 */
function TechStackGrid({
  items,
  isInView,
  reducedMotion,
}: {
  items: TechStackItem[];
  isInView: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {items.map((item, index) => (
        <TechStackCard
          key={item.name}
          item={item}
          index={index}
          isInView={isInView}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

/**
 * Tech Stack section with Orb background and funnel icon grid.
 */
export default function SkillsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  const funnelRows = useMemo(() => buildFunnelRows(TECH_STACK_ITEMS, 10), []);

  return (
    <section
      id="skills"
      ref={ref}
      aria-labelledby="skills-heading"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 pt-10 pb-20 sm:px-6 md:pt-12 md:pb-24"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {!reducedMotion ? (
          <Orb
            hue={0}
            hoverIntensity={2}
            rotateOnHover
            forceHoverState={false}
            backgroundColor="#050508"
            className="h-full w-full"
          />
        ) : (
          <div className="h-full w-full bg-[#050508]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050508_75%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center sm:mb-14"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-purple-300/80">
            Expertise
          </p>
          <h2
            id="skills-heading"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Tech Stack
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/55 sm:text-base">
            Frameworks, languages, and tools I use to ship production-grade frontend experiences.
          </p>
        </motion.header>

        {reducedMotion ? (
          <TechStackGrid
            items={TECH_STACK_ITEMS}
            isInView={isInView}
            reducedMotion={reducedMotion}
          />
        ) : (
          <TechStackFunnel rows={funnelRows} isInView={isInView} reducedMotion={reducedMotion} />
        )}
      </div>
    </section>
  );
}
