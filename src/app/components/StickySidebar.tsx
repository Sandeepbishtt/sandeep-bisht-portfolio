import { motion, useScroll, useTransform } from "motion/react";
import { Github, Mail, Twitter } from "lucide-react";
import Aurora from "./ui/Aurora";

const TWITTER_URL = "https://x.com/Sandeep07594432";

const SIDEBAR_NAV = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Tech Stack", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
] as const;

export interface StickySidebarProps {
  activeSection: string;
  reducedMotion: boolean;
}

/**
 * Sticky vertical sidebar with Aurora background and scroll-driven animations.
 */
export default function StickySidebar({ activeSection, reducedMotion }: StickySidebarProps) {
  const { scrollY } = useScroll();

  const sidebarWidth = useTransform(scrollY, [0, 120], [96, 72]);
  const auroraOpacity = useTransform(scrollY, [0, 200], [0.9, 0.35]);
  const backdropOpacity = useTransform(scrollY, [0, 120], [0.55, 0.92]);
  const borderGlow = useTransform(scrollY, [0, 100], ["0 0 0px transparent", "0 0 24px rgba(99,102,241,0.25)"]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.82]);

  return (
    <>
      {/* Desktop vertical sidebar */}
      <motion.aside
        style={{
          width: reducedMotion ? 96 : sidebarWidth,
          boxShadow: reducedMotion ? undefined : borderGlow,
        }}
        className="fixed left-0 top-0 z-[55] hidden h-screen flex-col border-r border-border/30 md:flex"
        aria-label="Site navigation"
      >
        <motion.div
          style={{ opacity: reducedMotion ? 0.7 : auroraOpacity }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          {!reducedMotion && (
            <Aurora
              colorStops={["#6366f1", "#22d3ee", "#6366f1"]}
              amplitude={0.8}
              blend={0.45}
              className="h-full w-full scale-150"
            />
          )}
        </motion.div>

        <motion.div
          style={{ opacity: reducedMotion ? 0.85 : backdropOpacity }}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-between py-8">
          <motion.a
            href="#hero"
            style={{ scale: reducedMotion ? 1 : logoScale }}
            className="text-xl font-bold tracking-tighter text-foreground hover:text-primary transition-colors"
            aria-label="Home"
          >
            SB
          </motion.a>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
            {SIDEBAR_NAV.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group relative flex items-center justify-center"
                  whileHover={reducedMotion ? undefined : { x: 4 }}
                >
                  <span
                    className={`[writing-mode:vertical-rl] rotate-180 text-[11px] uppercase tracking-[0.25em] transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute -right-3 h-full w-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://github.com/Sandeepbishtt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) profile"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="mailto:sandeepbishtit@gmail.com"
              aria-label="Send email"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.aside>

      {/* Mobile sticky top bar with Aurora */}
      <motion.header
        style={{
          boxShadow: reducedMotion ? undefined : borderGlow,
        }}
        className="fixed left-0 right-0 top-0 z-[55] border-b border-border/30 md:hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {!reducedMotion && (
            <Aurora
              colorStops={["#6366f1", "#22d3ee", "#6366f1"]}
              amplitude={0.6}
              blend={0.4}
              className="h-full w-full"
            />
          )}
          <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
        </div>
        <div className="relative z-10 flex items-center justify-between px-4 py-3">
          <a href="#hero" className="text-lg font-bold text-foreground">
            SB
          </a>
          <nav className="flex gap-3 overflow-x-auto" aria-label="Mobile navigation">
            {SIDEBAR_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`whitespace-nowrap text-xs uppercase tracking-wider ${
                  activeSection === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </motion.header>
    </>
  );
}
