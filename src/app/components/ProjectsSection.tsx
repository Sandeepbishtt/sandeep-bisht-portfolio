import { useRef, useState, type MouseEvent } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import {
  Brain,
  ExternalLink,
  Github,
  MessageCircle,
  Sparkles,
  TestTube,
  Video,
  type LucideIcon,
} from "lucide-react";
import ScrollVelocity from "./ui/ScrollVelocity";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  image: string;
  gradient: string;
  icon: LucideIcon;
  updated: string;
  highlights: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    title: "AI-Powered Virtual Try-On",
    subtitle: "E-commerce Platform",
    description:
      "Revolutionary virtual try-on experience for e-commerce using AI-powered computer vision and real-time processing.",
    tech: ["Svelte", "Python", "FastAPI", "MongoDB", "TensorFlow.js", "MediaPipe", "PyTorch", "OpenCV"],
    image: "https://images.unsplash.com/photo-1652454107898-eb0050b17f29?w=800&h=600&fit=crop",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    icon: Video,
    updated: "Sep 6, 2025",
    highlights: [
      "Real-time AR try-on using MediaPipe",
      "AI-powered body detection & tracking",
      "Seamless e-commerce integration",
      "High-performance rendering pipeline",
    ],
  },
  {
    title: "Automation Testing Platform",
    subtitle: "Cursor MCP Server Integration",
    description:
      "Intelligent automated testing platform with seamless Cursor MCP server integration for continuous quality assurance.",
    tech: ["Vue.js", "Python", "FastAPI", "Cursor", "MCP Servers"],
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    icon: TestTube,
    updated: "Sep 6, 2025",
    highlights: [
      "Automated test generation with AI",
      "MCP server integration for Cursor",
      "Real-time test execution monitoring",
      "Comprehensive reporting dashboard",
    ],
  },
  {
    title: "AI Feature Testing Automation",
    subtitle: "Intelligent QA System",
    description:
      "AI-powered testing tool that validates feature branches against ticket requirements using LLM and semantic search.",
    tech: ["Angular", "Python", "LLM", "pgVector", "Git"],
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&h=600&fit=crop",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: Brain,
    updated: "Aug 31, 2025",
    highlights: [
      "LLM-powered requirement analysis",
      "Semantic search with pgVector",
      "Automated branch validation",
      "Git integration for CI/CD",
    ],
  },
  {
    title: "E-commerce Chat Platform",
    subtitle: "Vector DB & LLM Integration",
    description:
      "Advanced chat application for e-commerce with vector database and LLM integration for intelligent customer support.",
    tech: ["Vue.js", "Python", "FastAPI", "Transformers", "PyTorch", "PostgreSQL", "pgVector"],
    image: "https://images.unsplash.com/photo-1662974770404-468fd9660389?w=800&h=600&fit=crop",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    icon: MessageCircle,
    updated: "Sep 2025",
    highlights: [
      "Semantic search with pgVector",
      "LLM-powered product recommendations",
      "Real-time customer support",
      "Contextual conversation history",
    ],
  },
];

/**
 * Compact project card for the horizontal ScrollVelocity strip.
 */
function ProjectScrollCard({ project }: { project: ProjectItem }) {
  const ProjectIcon = project.icon;

  return (
    <article className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg md:w-[360px]">
      <div className="relative h-40 overflow-hidden">
        <img
          src={project.image}
          alt=""
          width={360}
          height={160}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-50 mix-blend-multiply`} />
        <div
          className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${project.gradient} shadow-lg`}
        >
          <ProjectIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <span className="absolute right-3 top-3 rounded-full border border-border/50 bg-background/90 px-2.5 py-1 text-[10px] font-medium">
          {project.updated}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
          <p className={`text-xs font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
            {project.subtitle}
          </p>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href="https://github.com/Sandeepbishtt"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}
        >
          View on GitHub
          <ExternalLink className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/**
 * Full project card for reduced-motion grid fallback.
 */
function ProjectGridCard({
  project,
  index,
  isInView,
  isHovered,
  onHoverStart,
  onHoverEnd,
  reducedMotion,
}: {
  project: ProjectItem;
  index: number;
  isInView: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  reducedMotion: boolean;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });
  const ProjectIcon = project.icon;

  const handleCardMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateY.set(((event.clientX - centerX) / rect.width) * 6);
    rotateX.set(((centerY - event.clientY) / rect.height) * 6);
  };

  const handleCardMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: reducedMotion ? 0 : -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: reducedMotion ? 0 : -10 }}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
      onHoverStart={onHoverStart}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      style={
        reducedMotion
          ? undefined
          : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 1000,
            }
      }
      className="group relative perspective-1000"
    >
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.2,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${project.gradient} blur-2xl`}
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-primary/50">
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={project.image}
            alt=""
            className="h-full w-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-60 mix-blend-multiply`} />
          <div className={`absolute left-4 top-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${project.gradient} shadow-2xl`}>
            <ProjectIcon className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="absolute right-4 top-4 rounded-full border border-border/50 bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            Updated {project.updated}
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <h3 className="mb-1 text-2xl font-bold text-foreground">{project.title}</h3>
            <p className={`text-sm font-medium bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
              {project.subtitle}
            </p>
          </div>
          <p className="leading-relaxed text-muted-foreground">{project.description}</p>
          <div className="space-y-2">
            {project.highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href="https://github.com/Sandeepbishtt"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent hover:opacity-80`}
          >
            View on GitHub
            <ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Builds a horizontal track of project cards for ScrollVelocity rows.
 */
function ProjectCardTrack({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="project-scroll-track">
      {projects.map((project) => (
        <ProjectScrollCard key={project.title} project={project} />
      ))}
    </div>
  );
}

/**
 * AI Projects section with ScrollVelocity horizontal card marquee.
 */
export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const scrollRows = [
    <ProjectCardTrack key="row-forward" projects={PROJECTS} />,
    <ProjectCardTrack key="row-reverse" projects={[...PROJECTS].reverse()} />,
  ];

  return (
    <section id="projects" ref={ref} className="min-h-screen overflow-x-hidden py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-7xl space-y-12 px-6"
      >
        <header className="space-y-4 text-center">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "4rem" } : { width: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto h-1 rounded-full bg-gradient-to-r from-primary to-accent"
            aria-hidden="true"
          />
          <h2 className="text-5xl font-bold">AI Projects Portfolio</h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Cutting-edge AI and machine learning projects showcasing expertise in LLM integration,
            computer vision, and intelligent automation.
          </p>
        </header>
      </motion.div>

      {reducedMotion ? (
        <div className="mx-auto mt-12 grid w-full max-w-7xl gap-8 px-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectGridCard
              key={project.title}
              project={project}
              index={index}
              isInView={isInView}
              isHovered={hoveredProject === index}
              onHoverStart={() => setHoveredProject(index)}
              onHoverEnd={() => setHoveredProject(null)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      ) : (
        <ScrollVelocity
          texts={scrollRows}
          velocity={65}
          numCopies={3}
          damping={55}
          stiffness={350}
          velocityMapping={{ input: [0, 1200], output: [0, 4] }}
          wrapperClassName="project-scroll-velocity mt-12"
          parallaxClassName="parallax"
          scrollerClassName="scroller"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mx-auto w-full max-w-7xl px-6 pt-12 text-center"
      >
        <a
          href="https://github.com/Sandeepbishtt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
        >
          <Github className="h-5 w-5" aria-hidden="true" />
          <span className="font-semibold">View All Projects on GitHub</span>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
}
