/**
 * Tech logo URLs and fallback sticker SVGs for StickerPeel.
 */

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const DEVICON_MAP: Record<string, string> = {
  "React.js (17+)": `${DEVICON_BASE}/react/react-original.svg`,
  "Next.js (14+)": `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  Redux: `${DEVICON_BASE}/redux/redux-original.svg`,
  TypeScript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  "JavaScript (ES6+)": `${DEVICON_BASE}/javascript/javascript-original.svg`,
  HTML5: `${DEVICON_BASE}/html5/html5-original.svg`,
  CSS3: `${DEVICON_BASE}/css3/css3-original.svg`,
};

const STICKER_COLORS: Record<string, string> = {
  "React Admin": "#2563eb",
  Refine: "#ef4444",
};

export interface StickerLayoutSlot {
  /** Horizontal position as fraction of available board width (0–1). */
  xPct: number;
  /** Vertical position as fraction of available board height (0–1). */
  yPct: number;
  rotate: number;
  peelDirection: number;
  width: number;
}

/**
 * Builds a sticker-style SVG data URL with icon area and label.
 */
function buildStickerDataUrl(label: string, accentColor: string): string {
  const shortLabel = label.length > 14 ? `${label.slice(0, 12)}…` : label;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="18" fill="url(#bg)"/>
      <rect x="8" y="8" width="184" height="184" rx="14" fill="none" stroke="white" stroke-opacity="0.25" stroke-width="2"/>
      <circle cx="100" cy="78" r="36" fill="white" fill-opacity="0.15"/>
      <text x="100" y="88" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="white">${label.slice(0, 2).toUpperCase()}</text>
      <text x="100" y="158" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="white">${shortLabel}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Returns an image source URL for a frontend tech sticker.
 */
export function getTechStickerSrc(skillName: string): string {
  if (DEVICON_MAP[skillName]) {
    return DEVICON_MAP[skillName];
  }

  const accent = STICKER_COLORS[skillName] ?? "#6366f1";
  return buildStickerDataUrl(skillName, accent);
}

/** Percentage-based scatter slots — positions scale to any board width. */
export const FRONTEND_STICKER_LAYOUT: StickerLayoutSlot[] = [
  { xPct: 0.02, yPct: 0.14, rotate: -14, peelDirection: 0, width: 96 },
  { xPct: 0.22, yPct: 0.62, rotate: 16, peelDirection: 12, width: 96 },
  { xPct: 0.38, yPct: 0.08, rotate: -9, peelDirection: -8, width: 92 },
  { xPct: 0.52, yPct: 0.48, rotate: 21, peelDirection: 6, width: 92 },
  { xPct: 0.66, yPct: 0.18, rotate: -18, peelDirection: 4, width: 92 },
  { xPct: 0.78, yPct: 0.68, rotate: 11, peelDirection: -6, width: 92 },
  { xPct: 0.88, yPct: 0.10, rotate: -22, peelDirection: 10, width: 88 },
  { xPct: 0.12, yPct: 0.82, rotate: 8, peelDirection: -12, width: 92 },
  { xPct: 0.58, yPct: 0.78, rotate: -11, peelDirection: 8, width: 88 },
];

/**
 * Computes pixel positions for stickers based on board dimensions.
 */
export function computeStickerPositions(
  boardWidth: number,
  boardHeight: number,
  slots: StickerLayoutSlot[],
  options?: { topInset?: number; padding?: number; mobile?: boolean },
): Array<StickerLayoutSlot & { x: number; y: number }> {
  const topInset = options?.topInset ?? 36;
  const padding = options?.padding ?? 8;
  const mobileScale = options?.mobile ? 0.82 : 1;

  const usableHeight = Math.max(boardHeight - topInset - padding, 1);

  return slots.map((slot) => {
    const width = Math.round(slot.width * mobileScale);
    const stickerHeight = width;
    const maxX = Math.max(0, boardWidth - width - padding);
    const maxY = Math.max(0, usableHeight - stickerHeight);

    return {
      ...slot,
      width,
      x: Math.round(padding + slot.xPct * maxX),
      y: Math.round(topInset + slot.yPct * maxY),
    };
  });
}
