import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import "./StarBorder.css";

export interface StarBorderProps<T extends ElementType = "button"> {
  as?: T;
  className?: string;
  innerClassName?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  reducedMotion?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * Animated star-border wrapper with traveling gradient glow edges.
 */
export default function StarBorder<T extends ElementType = "button">({
  as,
  className = "",
  innerClassName = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  reducedMotion = false,
  children,
  style,
  ...rest
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button";

  return (
    <Component
      className={["star-border-container", reducedMotion ? "star-border-reduced" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div className={["inner-content", innerClassName].filter(Boolean).join(" ")}>{children}</div>
    </Component>
  );
}
