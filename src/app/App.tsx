import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from "motion/react";
import { useRef, useState, useEffect, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { letterReveal } from "./lib/motionVariants";
import SplashCursor from "./components/SplashCursor";
import StickySidebar from "./components/StickySidebar";
import { LampContainer } from "./components/ui/lamp";
import Galaxy from "./components/ui/Galaxy";
import AboutSection from "./components/AboutSection";
import AchievementsSection from "./components/AchievementsSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import {
  Github,
  Mail,
  Twitter,
  MapPin,
  ExternalLink,
} from "lucide-react";

const HERO_NAME = "Sandeep Bisht";
const TWITTER_URL = "https://x.com/Sandeep07594432";
const TWITTER_HANDLE = "@Sandeep07594432";

/**
 * Anchor link with optional magnetic cursor-follow hover effect.
 */
function MagneticLink({
  href,
  className,
  children,
  target,
  rel,
  reducedMotion,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/**
 * Per-character stagger reveal for the hero name.
 */
function LetterStaggerName({
  text,
  reducedMotion,
  className = "text-5xl md:text-7xl font-bold tracking-tight",
}: {
  text: string;
  reducedMotion: boolean;
  className?: string;
}) {
  if (reducedMotion) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <motion.h1
      className={`${className} flex flex-wrap`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.04, delayChildren: 0.4 } },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={letterReveal}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, reducedMotion ? 1 : 0]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "experience", "skills", "projects", "achievements", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="dark min-h-screen bg-background text-foreground overflow-x-hidden">
      {!reducedMotion && <SplashCursor />}

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Galaxy starfield background — sits behind all page sections */}
      <div className="fixed inset-0 z-0 bg-background pointer-events-none" aria-hidden="true">
        {!reducedMotion ? (
          <Galaxy
            hueShift={260}
            density={1.15}
            glowIntensity={0.4}
            speed={0.65}
            rotationSpeed={0.06}
            twinkleIntensity={0.4}
            saturation={0.2}
            mouseInteraction={false}
            transparent
            className="h-full w-full"
          />
        ) : null}
        <div className="absolute inset-0 bg-background/25" />
      </div>

      {/* Sticky sidebar with Aurora */}
      <StickySidebar activeSection={activeSection} reducedMotion={reducedMotion} />

      <main className="relative z-10 md:pl-24 pt-16 md:pt-0">
      {/* Hero with Lamp effect */}
      <LampContainer
        id="hero"
        reducedMotion={reducedMotion}
        className="min-h-screen bg-transparent"
        childrenClassName="max-w-7xl mx-auto w-full -translate-y-36 md:-translate-y-44 px-6 md:px-12 lg:px-16"
      >
        <div className="w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-8 md:pt-16">
          <div className="w-full space-y-10">
            <motion.div style={{ opacity }} className="space-y-6">
              <LetterStaggerName
                text={HERO_NAME}
                reducedMotion={reducedMotion}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-base md:text-lg lg:text-xl font-medium bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-shimmer max-w-xl"
              >
                Software Development Engineer III
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                7.8+ years crafting high-performance, scalable e-commerce experiences.
                Specializing in React, Next.js, and frontend architecture.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticLink
                href="#contact"
                reducedMotion={reducedMotion}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/50 flex items-center gap-2"
              >
                Get in Touch
                <ExternalLink className="w-4 h-4" />
              </MagneticLink>
              <MagneticLink
                href="https://github.com/Sandeepbishtt"
                target="_blank"
                rel="noopener noreferrer"
                reducedMotion={reducedMotion}
                className="px-8 py-4 bg-card border border-border rounded-lg hover:border-primary transition-all flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                View GitHub
              </MagneticLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Gurugram, India
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                sandeepbishtit@gmail.com
              </div>
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
                {TWITTER_HANDLE}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: reducedMotion ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-full max-w-xl mx-auto lg:max-w-none lg:ml-auto"
          >
            <img
              src="/hero-background.png"
              alt="Sandeep Bisht — Software Development Engineer III portfolio portrait"
              width={800}
              height={800}
              className="relative w-full aspect-square object-contain rounded-2xl"
            />
          </motion.div>
        </div>

        {!reducedMotion && (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 md:left-[calc(50%+3rem)] -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-2 bg-muted-foreground rounded-full"
              />
            </div>
          </motion.div>
        )}
      </LampContainer>

      {/* About Section */}
      <AboutSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* AI Projects Section */}
      <ProjectsSection />

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Contact Section */}
      <ContactSection />
      </main>
    </div>
  );
}
