import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "./utils";

export interface LampContainerProps {
  children: ReactNode;
  className?: string;
  childrenClassName?: string;
  id?: string;
  reducedMotion?: boolean;
}

/**
 * Aceternity lamp lighting effect container for hero/header sections.
 */
export function LampContainer({
  children,
  className,
  childrenClassName,
  id,
  reducedMotion = false,
}: LampContainerProps) {
  const motionProps = reducedMotion
    ? { initial: false as const, animate: false as const }
    : {
        initial: { opacity: 0.5, width: "15rem" },
        whileInView: { opacity: 1, width: "30rem" },
        transition: { delay: 0.3, duration: 0.8, ease: "easeInOut" as const },
      };

  const centerMotionProps = reducedMotion
    ? { initial: false as const, animate: false as const }
    : {
        initial: { width: "8rem" },
        whileInView: { width: "16rem" },
        transition: { delay: 0.3, duration: 0.8, ease: "easeInOut" as const },
      };

  const lineMotionProps = reducedMotion
    ? { initial: false as const, animate: false as const }
    : {
        initial: { width: "15rem" },
        whileInView: { width: "30rem" },
        transition: { delay: 0.3, duration: 0.8, ease: "easeInOut" as const },
      };

  return (
    <div
      id={id}
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background z-0",
        className
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
        <motion.div
          {...motionProps}
          style={{
            backgroundImage: "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible bg-gradient-conic from-primary via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        <motion.div
          {...motionProps}
          style={{
            backgroundImage: "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-primary opacity-50 blur-3xl" />

        <motion.div
          {...centerMotionProps}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-accent blur-2xl"
        />

        <motion.div
          {...lineMotionProps}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-accent"
        />

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-background" />
      </div>

      <div
        className={cn(
          "relative z-50 flex w-full flex-col items-stretch px-6 -translate-y-48 md:-translate-y-56",
          childrenClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
