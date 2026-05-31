// CREDIT
// Component inspired by React Bits StickerPeel

import { useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import "./StickerPeel.css";

gsap.registerPlugin(Draggable);

type InitialPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | { x: number; y: number };

export interface StickerPeelProps {
  /** Source URL for the sticker image. */
  imageSrc: string;
  /** Accessible label for the sticker image. */
  imageAlt?: string;
  /** Rotation angle in degrees applied to the sticker artwork. */
  rotate?: number;
  /** Peel percentage on hover (0–100). */
  peelBackHoverPct?: number;
  /** Peel percentage when active/pressed (0–100). */
  peelBackActivePct?: number;
  /** Peel direction in degrees (0–360). */
  peelDirection?: number;
  /** GSAP easing for peel animations. */
  peelEasing?: string;
  /** GSAP easing for hover transitions. */
  peelHoverEasing?: string;
  /** Sticker width in pixels. */
  width?: number;
  /** Shadow intensity (0–1). */
  shadowIntensity?: number;
  /** Lighting intensity (0–1). */
  lightingIntensity?: number;
  /** Initial drag position. */
  initialPosition?: InitialPosition;
  /** Disable drag and peel interactions. */
  reducedMotion?: boolean;
  className?: string;
}

const DEFAULT_PADDING = 10;

/**
 * Draggable peel-off sticker with GSAP physics and SVG lighting filters.
 */
export default function StickerPeel({
  imageSrc,
  imageAlt = "Tech sticker",
  rotate = 30,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelDirection = 0,
  peelEasing = "power3.out",
  peelHoverEasing = "power2.out",
  width = 200,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  initialPosition = "center",
  reducedMotion = false,
  className = "",
}: StickerPeelProps) {
  const instanceId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const pointLightRef = useRef<SVGFEPointLightElement>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null);
  const draggableInstanceRef = useRef<Draggable | null>(null);

  const filterIds = useMemo(
    () => ({
      pointLight: `pointLight-${instanceId}`,
      pointLightFlipped: `pointLightFlipped-${instanceId}`,
      dropShadow: `dropShadow-${instanceId}`,
      expandAndFill: `expandAndFill-${instanceId}`,
    }),
    [instanceId],
  );

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target || reducedMotion) return;

    let startX = 0;
    let startY = 0;

    if (initialPosition === "center") {
      return;
    }

    if (typeof initialPosition === "object") {
      startX = initialPosition.x;
      startY = initialPosition.y;
    }

    gsap.set(target, { x: startX, y: startY });
  }, [initialPosition, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const target = dragTargetRef.current;
    if (!target?.parentNode) return;

    const boundsEl = target.parentNode as Element;

    draggableInstanceRef.current = Draggable.create(target, {
      type: "x,y",
      bounds: boundsEl,
      inertia: true,
      onDrag() {
        const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4);
        gsap.to(target, { rotation: rot, duration: 0.15, ease: "power1.out" });
      },
      onDragEnd() {
        gsap.to(target, { rotation: 0, duration: 0.8, ease: "power2.out" });
      },
    })[0];

    const handleResize = () => {
      draggableInstanceRef.current?.update();

      const currentX = gsap.getProperty(target, "x") as number;
      const currentY = gsap.getProperty(target, "y") as number;
      const boundsRect = boundsEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const maxX = boundsRect.width - targetRect.width;
      const maxY = boundsRect.height - targetRect.height;
      const newX = Math.max(0, Math.min(currentX, maxX));
      const newY = Math.max(0, Math.min(currentY, maxY));

      if (newX !== currentX || newY !== currentY) {
        gsap.to(target, { x: newX, y: newY, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      draggableInstanceRef.current?.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const updateLight = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      gsap.set(pointLightRef.current, { attr: { x, y } });

      const normalizedAngle = Math.abs(peelDirection % 360);
      if (normalizedAngle !== 180) {
        gsap.set(pointLightFlippedRef.current, { attr: { x, y: rect.height - y } });
      } else {
        gsap.set(pointLightFlippedRef.current, { attr: { x: -1000, y: -1000 } });
      }
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", updateLight);
    return () => container?.removeEventListener("mousemove", updateLight);
  }, [peelDirection, reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = () => container.classList.add("touch-active");
    const handleTouchEnd = () => container.classList.remove("touch-active");

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const cssVars = useMemo(
    (): CSSProperties => ({
      ["--sticker-rotate" as string]: `${rotate}deg`,
      ["--sticker-p" as string]: `${DEFAULT_PADDING}px`,
      ["--sticker-peelback-hover" as string]: `${peelBackHoverPct}%`,
      ["--sticker-peelback-active" as string]: `${peelBackActivePct}%`,
      ["--sticker-peel-easing" as string]: peelEasing,
      ["--sticker-peel-hover-easing" as string]: peelHoverEasing,
      ["--sticker-width" as string]: `${width}px`,
      ["--sticker-shadow-opacity" as string]: String(shadowIntensity),
      ["--sticker-lighting-constant" as string]: String(lightingIntensity),
      ["--peel-direction" as string]: `${peelDirection}deg`,
      ["--sticker-filter-point-light" as string]: `url(#${filterIds.pointLight})`,
      ["--sticker-filter-point-light-flipped" as string]: `url(#${filterIds.pointLightFlipped})`,
      ["--sticker-filter-drop-shadow" as string]: `url(#${filterIds.dropShadow})`,
      ["--sticker-filter-expand-fill" as string]: `url(#${filterIds.expandAndFill})`,
    }),
    [
      rotate,
      peelBackHoverPct,
      peelBackActivePct,
      peelEasing,
      peelHoverEasing,
      width,
      shadowIntensity,
      lightingIntensity,
      peelDirection,
      filterIds,
    ],
  );

  if (reducedMotion) {
    return (
      <div className={className} style={{ ...cssVars, position: "relative" }}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="sticker-peel-image rounded-lg border border-border bg-card p-2"
          style={{ width }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`sticker-peel sticker-peel-draggable ${className}`.trim()}
      ref={dragTargetRef}
      style={cssVars}
    >
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={filterIds.pointLight}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id={filterIds.pointLightFlipped}>
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity * 7}
              lightingColor="white"
            >
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id={filterIds.dropShadow}>
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id={filterIds.expandAndFill}>
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div className="sticker-peel-container" ref={containerRef}>
        <div className="sticker-peel-main">
          <div className="sticker-peel-lighting">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="sticker-peel-image"
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
            />
          </div>
        </div>

        <div className="sticker-peel-flap">
          <div className="sticker-peel-flap-lighting">
            <img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              className="sticker-peel-flap-image"
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
