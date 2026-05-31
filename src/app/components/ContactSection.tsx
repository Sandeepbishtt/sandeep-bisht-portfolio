import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import TrueFocus from "./ui/TrueFocus";
import StarBorder from "./ui/StarBorder";
import {
  AnimatedEmailIcon,
  AnimatedGithubIcon,
  AnimatedTwitterIcon,
} from "./icons/AnimatedContactIcons";
import { useReducedMotion } from "../hooks/useReducedMotion";

const TWITTER_URL = "https://x.com/Sandeep07594432";
const TWITTER_HANDLE = "@Sandeep07594432";

interface ContactItem {
  href: string;
  label: string;
  value: string;
  description: string;
  borderColor: string;
  glowColor: string;
  speed: string;
  icon: ReactNode;
  external?: boolean;
}

/**
 * Single contact card with star border and animated platform icon.
 */
function ContactCard({
  item,
  index,
  isInView,
  reducedMotion,
}: {
  item: ContactItem;
  index: number;
  isInView: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay: reducedMotion ? 0 : 0.35 + index * 0.12,
      }}
      className="relative flex min-h-[220px]"
    >
      <StarBorder
        as="div"
        color={item.borderColor}
        speed={reducedMotion ? "0s" : item.speed}
        thickness={3}
        reducedMotion={reducedMotion}
        className="block h-full w-full"
        innerClassName="h-full overflow-hidden !p-0"
      >
        <motion.a
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          aria-label={`${item.label}: ${item.value}`}
          initial="rest"
          whileHover={reducedMotion ? undefined : "hover"}
          animate="rest"
          variants={{
            rest: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="group relative flex h-full min-h-[220px] flex-col items-center justify-between gap-5 p-6 text-center sm:p-7"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${item.glowColor} 0%, transparent 65%)`,
            }}
            aria-hidden="true"
          />

          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 shadow-inner"
            style={{ backgroundColor: `${item.borderColor}18` }}
          >
            <div className="text-foreground transition-colors duration-300 group-hover:text-white">
              {item.icon}
            </div>
          </div>

          <div className="relative space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: item.borderColor }}
            >
              {item.label}
            </p>
            <p className="text-base font-semibold text-foreground transition-colors group-hover:text-white sm:text-lg">
              {item.value}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
          </div>

          <span
            className="relative inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground"
            aria-hidden="true"
          >
            {item.external ? "Open profile" : "Send message"}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </motion.a>
      </StarBorder>
    </motion.li>
  );
}

/**
 * Contact section with animated platform icons and star-border cards.
 */
export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();

  const contactItems: ContactItem[] = [
    {
      href: "mailto:sandeepbishtit@gmail.com",
      label: "Email",
      value: "sandeepbishtit@gmail.com",
      description: "Best for project inquiries and collaboration.",
      borderColor: "#818cf8",
      glowColor: "rgba(129, 140, 248, 0.35)",
      speed: "5s",
      icon: <AnimatedEmailIcon className="h-8 w-8" reducedMotion={reducedMotion} />,
    },
    {
      href: "https://github.com/Sandeepbishtt",
      label: "GitHub",
      value: "@Sandeepbishtt",
      description: "Explore repositories, contributions, and open source work.",
      borderColor: "#c4b5fd",
      glowColor: "rgba(196, 181, 253, 0.3)",
      speed: "6s",
      icon: <AnimatedGithubIcon className="h-8 w-8" reducedMotion={reducedMotion} />,
      external: true,
    },
    {
      href: TWITTER_URL,
      label: "X (Twitter)",
      value: TWITTER_HANDLE,
      description: "Follow updates, thoughts, and frontend experiments.",
      borderColor: "#67e8f9",
      glowColor: "rgba(103, 232, 249, 0.28)",
      speed: "4.5s",
      icon: <AnimatedTwitterIcon className="h-7 w-7" reducedMotion={reducedMotion} />,
      external: true,
    },
  ];

  return (
    <section id="contact" ref={ref} className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="space-y-12 text-center"
        >
          <header className="space-y-6">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "4rem" } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto h-1 rounded-full bg-gradient-to-r from-primary to-accent"
              aria-hidden="true"
            />
            {reducedMotion ? (
              <>
                <h2 className="text-5xl font-bold">Let&apos;s Connect</h2>
                <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                  Always open to discussing new opportunities, innovative projects, or just a chat
                  about frontend development and technology.
                </p>
              </>
            ) : (
              <>
                <TrueFocus
                  sentence="Let's Connect"
                  blurAmount={4}
                  borderColor="#6366f1"
                  glowColor="rgba(99, 102, 241, 0.65)"
                  animationDuration={0.55}
                  pauseBetweenAnimations={0.75}
                  className="true-focus-heading text-foreground"
                />
                <TrueFocus
                  sentence="Always open to discussing new opportunities, innovative projects, or just a chat about frontend development and technology."
                  blurAmount={3}
                  borderColor="#22d3ee"
                  glowColor="rgba(34, 211, 238, 0.55)"
                  animationDuration={0.45}
                  pauseBetweenAnimations={0.35}
                  className="true-focus-body text-muted-foreground"
                />
              </>
            )}
          </header>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative rounded-[2rem] border border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:p-8">
              <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
                {contactItems.map((item, index) => (
                  <ContactCard
                    key={item.label}
                    item={item}
                    index={index}
                    isInView={isInView}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-border/50 pt-6 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>Based in Gurugram, India</span>
              </div>
            </div>
          </motion.div>

          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pb-6 pt-12 text-sm text-muted-foreground"
          >
            <p>© 2026 Sandeep Bisht. Crafted with React, TypeScript, and Motion.</p>
          </motion.footer>
        </motion.div>
      </div>
    </section>
  );
}
