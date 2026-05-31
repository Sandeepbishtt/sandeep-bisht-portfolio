/**
 * Tech stack items and icon URLs for the wormhole tech grid.
 */

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export interface TechStackItem {
  name: string;
  shortName?: string;
  iconSrc: string;
}

const ACCENT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#06b6d4",
  "#3b82f6",
  "#10b981",
];

/**
 * Builds a fallback SVG icon for tools without Devicon entries.
 */
function buildFallbackIcon(label: string, accentColor: string): string {
  const initials = label
    .split(/[\s./]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="12" fill="${accentColor}" fill-opacity="0.25"/>
      <text x="32" y="38" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="white">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function devicon(path: string): string {
  return `${DEVICON_BASE}/${path}`;
}

function icon(name: string, path: string): TechStackItem {
  return { name, iconSrc: devicon(path) };
}

function fallback(name: string, colorIndex: number): TechStackItem {
  return {
    name,
    iconSrc: buildFallbackIcon(name, ACCENT_COLORS[colorIndex % ACCENT_COLORS.length]),
  };
}

/** Full portfolio tech stack in display order (funnel rows top → bottom). */
export const TECH_STACK_ITEMS: TechStackItem[] = [
  icon("React", "react/react-original.svg"),
  icon("Next.js", "nextjs/nextjs-original.svg"),
  icon("TypeScript", "typescript/typescript-original.svg"),
  icon("JavaScript", "javascript/javascript-original.svg"),
  icon("Redux", "redux/redux-original.svg"),
  icon("HTML5", "html5/html5-original.svg"),
  icon("CSS3", "css3/css3-original.svg"),
  icon("Tailwind", "tailwindcss/tailwindcss-original.svg"),
  icon("Bootstrap", "bootstrap/bootstrap-original.svg"),
  icon("Sass", "sass/sass-original.svg"),
  icon("Material UI", "materialui/materialui-original.svg"),
  icon("Ant Design", "antdesign/antdesign-original.svg"),
  icon("Node.js", "nodejs/nodejs-original.svg"),
  icon("Git", "git/git-original.svg"),
  icon("GitLab", "gitlab/gitlab-original.svg"),
  icon("Jira", "jira/jira-original.svg"),
  icon("Figma", "figma/figma-original.svg"),
  icon("VS Code", "vscode/vscode-original.svg"),
  icon("Playwright", "playwright/playwright-original.svg"),
  icon("Jest", "jest/jest-plain.svg"),
  icon("Chrome", "chrome/chrome-original.svg"),
  icon("Firebase", "firebase/firebase-plain.svg"),
  icon("MongoDB", "mongodb/mongodb-original.svg"),
  icon("PostgreSQL", "postgresql/postgresql-original.svg"),
  icon("MySQL", "mysql/mysql-original.svg"),
  icon("Docker", "docker/docker-original.svg"),
  icon("Nginx", "nginx/nginx-original.svg"),
  icon("Vite", "vite/vite-original.svg"),
  icon("Webpack", "webpack/webpack-original.svg"),
  icon("NPM", "npm/npm-original-wordmark.svg"),
  icon("GraphQL", "graphql/graphql-plain.svg"),
  icon("REST API", "fastapi/fastapi-original.svg"),
  icon("Agile", "jira/jira-original.svg"),
  icon("Lighthouse", "google/google-original.svg"),
  icon("Analytics", "google/google-original.svg"),
  fallback("React Admin", 0),
  fallback("Refine", 1),
  fallback("Cursor", 2),
  fallback("Claude", 3),
  fallback("Co-pilot", 4),
  fallback("Codex", 5),
  fallback("MCP", 6),
  fallback("Chakra UI", 7),
  fallback("CleverTap", 0),
  fallback("CDP", 1),
  fallback("CubeAPM", 2),
  fallback("Kibana", 3),
  fallback("New Relic", 4),
];

/**
 * Splits tech items into funnel rows — widest at top, narrowing toward bottom.
 */
export function buildFunnelRows(items: TechStackItem[], startWidth = 10): TechStackItem[][] {
  const rows: TechStackItem[][] = [];
  let index = 0;
  let rowWidth = startWidth;

  while (index < items.length) {
    const count = Math.min(rowWidth, items.length - index);
    rows.push(items.slice(index, index + count));
    index += count;
    rowWidth = Math.max(4, rowWidth - 1);
  }

  return rows;
}

/**
 * Returns display label for a tech stack item.
 */
export function getTechDisplayName(item: TechStackItem): string {
  return item.shortName ?? item.name;
}
