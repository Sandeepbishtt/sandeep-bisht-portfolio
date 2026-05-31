import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import "./TrueFocus.css";

export interface TrueFocusProps {
  /** Text displayed with the focus animation. */
  sentence?: string;
  /** Separator used to split the sentence into words. */
  separator?: string;
  /** Disables automatic animation when true. */
  manualMode?: boolean;
  /** Blur applied to non-active words. */
  blurAmount?: number;
  /** Color of the focus border corners. */
  borderColor?: string;
  /** Glow color for the focus frame. */
  glowColor?: string;
  /** Duration of each word transition in seconds. */
  animationDuration?: number;
  /** Pause between word focus cycles in auto mode (seconds). */
  pauseBetweenAnimations?: number;
  /** Additional class on the container. */
  className?: string;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Animated word focus effect with corner frame that cycles through a sentence.
 */
export default function TrueFocus({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = "",
}: TrueFocusProps) {
  const words = sentence.split(separator).filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode || words.length === 0) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => window.clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    const activeWord = wordRefs.current[currentIndex];
    const container = containerRef.current;
    if (!activeWord || !container) return;

    const updateRect = () => {
      const parentRect = container.getBoundingClientRect();
      const activeRect = activeWord.getBoundingClientRect();

      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [currentIndex, words.length, sentence]);

  const handleMouseEnter = (index: number) => {
    if (!manualMode) return;
    setLastActiveIndex(index);
    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    if (!manualMode || lastActiveIndex === null) return;
    setCurrentIndex(lastActiveIndex);
  };

  const wordStyle = (isActive: boolean): CSSProperties & Record<string, string> => ({
    filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
    "--border-color": borderColor,
    "--glow-color": glowColor,
    transition: `filter ${animationDuration}s ease`,
  });

  const containerClassName = ["focus-container", className].filter(Boolean).join(" ");

  return (
    <div className={containerClassName} ref={containerRef} aria-live="polite">
      {words.map((word, index) => {
        const isActive = index === currentIndex;

        return (
          <span
            key={`${word}-${index}`}
            ref={(element) => {
              wordRefs.current[index] = element;
            }}
            className={`focus-word ${manualMode ? "manual" : ""} ${isActive && !manualMode ? "active" : ""}`}
            style={wordStyle(isActive)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={{
          "--border-color": borderColor,
          "--glow-color": glowColor,
        } as CSSProperties & Record<string, string>}
        aria-hidden="true"
      >
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
      </motion.div>
    </div>
  );
}
