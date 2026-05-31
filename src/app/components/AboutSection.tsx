import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Award,
  Briefcase,
  Code2,
  Cpu,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATS = [
  { icon: Briefcase, label: "Years of Experience", value: "7.8+" },
  { icon: Code2, label: "Years in React/Next.js", value: "4.9+" },
  { icon: Award, label: "Best Performer Awards", value: "3x" },
  { icon: Users, label: "Team Leadership", value: "POD Lead" },
] as const;

/**
 * About section with GSAP scroll-driven motion and a distinct aurora-style background.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.to(".about-bg-orb", {
        x: "random(-50, 50)",
        y: "random(-40, 40)",
        scale: "random(0.85, 1.15)",
        duration: "random(7, 12)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.6, from: "random" },
      });

      gsap.to(".about-grid", {
        backgroundPosition: "0px 80px",
        duration: 24,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".about-bg-layer", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .from(".about-accent-line", {
          scaleX: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".about-title",
          { y: 56, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.45",
        )
        .from(
          ".about-desc",
          { y: 36, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        )
        .from(
          ".about-stat-card",
          { y: 48, opacity: 0, duration: 0.65, stagger: 0.12, ease: "power3.out" },
          "-=0.35",
        )
        .from(
          ".about-detail-card",
          { y: 40, opacity: 0, duration: 0.7, stagger: 0.14, ease: "power3.out" },
          "-=0.25",
        );

      const cards = gsap.utils.toArray<HTMLElement>(".about-stat-card");
      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const onEnter = () => {
          gsap.to(card, { y: -6, scale: 1.03, duration: 0.35, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card.addEventListener("focusin", onEnter);
        card.addEventListener("focusout", onLeave);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
          card.removeEventListener("focusin", onEnter);
          card.removeEventListener("focusout", onLeave);
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative isolate min-h-screen overflow-hidden px-6 py-20"
    >
      {/* Distinct section background — teal/cyan aurora mesh */}
      <div
        className="about-bg-layer pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-teal-950/95 to-cyan-950/90" />
        <div className="about-bg-orb absolute -left-24 top-16 h-80 w-80 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="about-bg-orb absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="about-bg-orb absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div
          className="about-grid absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/25" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl items-center">
        <div className="w-full space-y-12">
          <header className="space-y-4">
            <div
              className="about-accent-line h-1 w-16 origin-left rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
              aria-hidden="true"
            />
            <h2 id="about-heading" className="about-title text-5xl font-bold">
              About Me
            </h2>
            <p className="about-desc max-w-3xl text-xl text-muted-foreground">
              Passionate about building scalable, performant web applications that deliver
              exceptional user experiences. Leading the FNP.com Search & Discovery POD with
              expertise in SSR/SSG architecture, SEO optimization, and production reliability.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <article
                  tabIndex={0}
                  className="about-stat-card group relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70"
                >
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-xl transition-all group-hover:blur-2xl"
                    aria-hidden="true"
                  />
                  <div className="relative space-y-4 rounded-2xl border border-border/80 bg-card/90 p-6 backdrop-blur-sm transition-colors group-hover:border-teal-400/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                      <stat.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="about-detail-card rounded-2xl border border-border/80 bg-card/90 p-8 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <Target className="h-6 w-6 text-teal-400" aria-hidden="true" />
                <h3 className="text-2xl font-semibold">Specializations</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>Core Web Vitals optimization (LCP, INP, CLS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>SSR/SSG architecture & performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>SEO & technical optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>High-traffic B2C e-commerce platforms</span>
                </li>
              </ul>
            </article>

            <article className="about-detail-card rounded-2xl border border-border/80 bg-card/90 p-8 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-teal-400" aria-hidden="true" />
                <h3 className="text-2xl font-semibold">Current Focus</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Cpu className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>Generative AI integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Cpu className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>RAG pipelines & LLM integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Cpu className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>pgVector semantic search systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Cpu className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <span>Advanced frontend architecture</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
