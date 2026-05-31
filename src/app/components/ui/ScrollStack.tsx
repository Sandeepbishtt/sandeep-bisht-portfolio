import {
  useLayoutEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

/**
 * Individual card wrapper for ScrollStack stacking animation.
 * Transform is applied to the outer shell; visual styles go on the inner surface.
 */
export function ScrollStackItem({ children, itemClassName = "" }: ScrollStackItemProps) {
  return (
    <div className="scroll-stack-card">
      <div className={`scroll-stack-card-surface ${itemClassName}`.trim()}>{children}</div>
    </div>
  );
}

export interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface CardTransform {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

interface CardLayoutCache {
  tops: number[];
  endTop: number;
}

/**
 * Scroll-driven stacked cards with Lenis smooth scrolling.
 */
export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const layoutCacheRef = useRef<CardLayoutCache>({ tops: [], endTop: 0 });
  const lastTransformsRef = useRef<Map<number, CardTransform>>(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(String(value));
  }, []);

  const getScrollTop = useCallback(() => {
    if (useWindowScroll) {
      return lenisRef.current?.scroll ?? window.scrollY;
    }
    return scrollerRef.current?.scrollTop ?? 0;
  }, [useWindowScroll]);

  const getContainerHeight = useCallback(() => {
    if (useWindowScroll) {
      return window.innerHeight;
    }
    return scrollerRef.current?.clientHeight ?? 0;
  }, [useWindowScroll]);

  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !cardsRef.current.length) return;

    cardsRef.current.forEach((card) => {
      card.style.transform = "translate3d(0, 0, 0) scale(1)";
      card.style.filter = "none";
    });

    const scrollTop = getScrollTop();
    const tops = cardsRef.current.map((card) => {
      const rect = card.getBoundingClientRect();
      return rect.top + scrollTop;
    });

    const endElement = scroller.querySelector(".scroll-stack-end");
    const endTop = endElement
      ? endElement.getBoundingClientRect().top + scrollTop
      : 0;

    layoutCacheRef.current = { tops, endTop };
    lastTransformsRef.current.clear();
  }, [getScrollTop]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const scrollTop = getScrollTop();
    const containerHeight = getContainerHeight();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const { tops, endTop } = layoutCacheRef.current;
    const pinEnd = endTop - containerHeight / 2;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const cardTop = tops[index] ?? 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * index;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j += 1) {
          const jCardTop = tops[j] ?? 0;
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (index < topCardIndex) {
          blur = Math.max(0, (topCardIndex - index) * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const newTransform: CardTransform = {
        translateY: Math.round(translateY * 10) / 10,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(index);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.5 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.002 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "none";
        lastTransformsRef.current.set(index, newTransform);
      }

      if (index === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollTop,
    getContainerHeight,
  ]);

  const setupLenis = useCallback(() => {
    const runFrame = (time: number) => {
      lenisRef.current?.raf(time);
      updateCardTransforms();
      animationFrameRef.current = requestAnimationFrame(runFrame);
    };

    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 0.9,
        lerp: 0.12,
        syncTouch: true,
        syncTouchLerp: 0.1,
      });

      animationFrameRef.current = requestAnimationFrame(runFrame);
      lenisRef.current = lenis;
      return lenis;
    }

    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const inner = scroller.querySelector(".scroll-stack-inner");
    if (!inner) return undefined;

    const lenis = new Lenis({
      wrapper: scroller,
      content: inner as HTMLElement,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.9,
      lerp: 0.12,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });

    animationFrameRef.current = requestAnimationFrame(runFrame);
    lenisRef.current = lenis;
    return lenis;
  }, [updateCardTransforms, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll<HTMLElement>(".scroll-stack-card"));
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translate3d(0, 0, 0)";
    });

    setupLenis();
    measureLayout();
    updateCardTransforms();

    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measureLayout();
        updateCardTransforms();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      layoutCacheRef.current = { tops: [], endTop: 0 };
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    measureLayout,
    updateCardTransforms,
  ]);

  const scrollerClassName = [
    "scroll-stack-scroller",
    useWindowScroll ? "scroll-stack-scroller--window" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={scrollerClassName} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden="true" />
      </div>
    </div>
  );
}
