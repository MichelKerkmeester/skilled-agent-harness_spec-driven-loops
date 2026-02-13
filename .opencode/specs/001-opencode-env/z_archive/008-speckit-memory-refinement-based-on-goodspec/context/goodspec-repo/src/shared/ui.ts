/**
 * Shared UI Utilities
 * Common UI elements and formatting functions
 * 
 * @module shared/ui
 */

/**
 * Standard icons used across GoopSpec
 */
export const icons = {
  success: "✓",
  error: "✗",
  pending: "○",
  warning: "⚠",
  info: "ℹ",
  arrow: "→",
  bullet: "•",
  check: "✓",
  cross: "✗",
  circle: "○",
  star: "★",
  flag: "⚑",
} as const;

/**
 * Status indicators with emoji
 */
export const status = {
  ok: "[OK]",
  fail: "[FAIL]",
  warn: "[WARN]",
  info: "[INFO]",
  work: "[WORK]",
  wait: "[WAIT]",
  gate: "[GATE]",
} as const;

/**
 * Create a progress bar
 * 
 * @param percent - Progress percentage (0-100)
 * @param width - Width of the progress bar in characters (default: 20)
 * @returns Formatted progress bar string
 * 
 * @example
 * progressBar(50) // "██████████░░░░░░░░░░ 50%"
 * progressBar(75, 10) // "███████░░░ 75%"
 */
export function progressBar(percent: number, width: number = 20): string {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clampedPercent / 100) * width);
  const empty = width - filled;
  
  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `${bar} ${clampedPercent.toFixed(0)}%`;
}

/**
 * Create a boxed section with title
 * 
 * @param title - Box title
 * @param content - Box content
 * @param width - Box width (default: 60)
 * @returns Formatted box string
 * 
 * @example
 * box("Status", "All systems operational")
 * // ┌──────────────────────────────────────────────────────────┐
 * // │ Status                                                   │
 * // ├──────────────────────────────────────────────────────────┤
 * // │ All systems operational                                  │
 * // └──────────────────────────────────────────────────────────┘
 */
export function box(title: string, content: string, width: number = 60): string {
  const lines: string[] = [];
  const innerWidth = width - 4; // Account for borders and padding
  
  // Top border
  lines.push("┌" + "─".repeat(width - 2) + "┐");
  
  // Title
  const paddedTitle = title.padEnd(innerWidth);
  lines.push(`│ ${paddedTitle} │`);
  
  // Separator
  lines.push("├" + "─".repeat(width - 2) + "┤");
  
  // Content (split by lines and wrap if needed)
  const contentLines = content.split("\n");
  for (const line of contentLines) {
    if (line.length <= innerWidth) {
      lines.push(`│ ${line.padEnd(innerWidth)} │`);
    } else {
      // Wrap long lines
      let remaining = line;
      while (remaining.length > 0) {
        const chunk = remaining.slice(0, innerWidth);
        lines.push(`│ ${chunk.padEnd(innerWidth)} │`);
        remaining = remaining.slice(innerWidth);
      }
    }
  }
  
  // Bottom border
  lines.push("└" + "─".repeat(width - 2) + "┘");
  
  return lines.join("\n");
}

/**
 * Create a simple divider line
 * 
 * @param width - Width of divider (default: 60)
 * @param char - Character to use (default: "─")
 * @returns Divider string
 */
export function divider(width: number = 60, char: string = "─"): string {
  return char.repeat(width);
}

/**
 * Format a list with bullets
 * 
 * @param items - List items
 * @param bullet - Bullet character (default: "•")
 * @returns Formatted list string
 */
export function list(items: string[], bullet: string = "•"): string {
  return items.map(item => `${bullet} ${item}`).join("\n");
}

/**
 * Format a numbered list
 * 
 * @param items - List items
 * @returns Formatted numbered list string
 */
export function numberedList(items: string[]): string {
  return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

/**
 * Create a table from data
 * 
 * @param headers - Column headers
 * @param rows - Table rows
 * @returns Formatted table string
 */
export function table(headers: string[], rows: string[][]): string {
  const lines: string[] = [];
  
  // Calculate column widths
  const widths = headers.map((h, i) => {
    const maxRowWidth = Math.max(...rows.map(r => (r[i] || "").length));
    return Math.max(h.length, maxRowWidth);
  });
  
  // Header
  const headerRow = headers.map((h, i) => h.padEnd(widths[i])).join(" | ");
  lines.push(headerRow);
  
  // Separator
  const separator = widths.map(w => "─".repeat(w)).join("─┼─");
  lines.push(separator);
  
  // Rows
  for (const row of rows) {
    const formattedRow = row.map((cell, i) => (cell || "").padEnd(widths[i])).join(" | ");
    lines.push(formattedRow);
  }
  
  return lines.join("\n");
}

export interface StageBannerOptions {
  width?: number;
  tag?: string;
  dividerChar?: string;
  uppercase?: boolean;
}

/**
 * Format a compact stage banner using ASCII-friendly output
 *
 * @param stage - Stage name
 * @param detail - Optional detail text
 * @param options - Banner formatting options
 * @returns Stage banner string
 *
 * @example
 * stageBanner("plan", "Capture intent")
 * // [STAGE] PLAN - Capture intent
 */
export function stageBanner(
  stage: string,
  detail?: string,
  options: StageBannerOptions = {},
): string {
  const tag = options.tag ?? "[STAGE]";
  const dividerChar = options.dividerChar ?? "-";
  const uppercased = options.uppercase !== false;
  const stageLabel = uppercased ? stage.toUpperCase() : stage;
  const base = detail ? `${tag} ${stageLabel} - ${detail}` : `${tag} ${stageLabel}`;

  if (!options.width || base.length >= options.width) {
    return base;
  }

  const padding = options.width - base.length - 1;
  return `${base} ${dividerChar.repeat(padding)}`;
}

export interface DecisionGateOptions {
  statusLabel?: string;
  actionLabel?: string;
  details?: string[];
}

/**
 * Format a decision gate block
 *
 * @param title - Gate title
 * @param action - Action prompt
 * @param options - Gate formatting options
 * @returns Decision gate string
 *
 * @example
 * decisionGate("Specify", "Confirm the specification")
 * // [GATE] Specify\nAction: Confirm the specification
 */
export function decisionGate(
  title: string,
  action: string,
  options: DecisionGateOptions = {},
): string {
  const statusLabel = options.statusLabel ?? status.gate;
  const actionLabel = options.actionLabel ?? "Action";
  const lines = [`${statusLabel} ${title}`, `${actionLabel}: ${action}`];

  if (options.details?.length) {
    for (const detail of options.details) {
      lines.push(`- ${detail}`);
    }
  }

  return lines.join("\n");
}

export interface ProgressSegment {
  label: string;
  value?: string | number;
  width?: number;
}

export interface ProgressRowOptions {
  statusLabel?: string;
  separator?: string;
}

/**
 * Format a compact progress row
 *
 * @param segments - Progress segments
 * @param options - Row formatting options
 * @returns Progress row string
 *
 * @example
 * compactProgressRow([
 *   { label: "Wave", value: "2/5" },
 *   { label: "Task", value: "3/7" },
 *   { label: "Stage", value: "Execute" },
 * ])
 * // [WORK] Wave 2/5 | Task 3/7 | Stage Execute
 */
export function compactProgressRow(
  segments: ProgressSegment[],
  options: ProgressRowOptions = {},
): string {
  const statusLabel = options.statusLabel ?? status.work;
  const separator = options.separator ?? " | ";
  const formattedSegments = segments.map((segment) => {
    const value = segment.value === undefined ? segment.label : `${segment.label} ${segment.value}`;
    return segment.width ? value.padEnd(segment.width) : value;
  });

  return [statusLabel, ...formattedSegments].join(separator);
}

/**
 * Colorize text (for terminal output)
 * Note: These are ANSI color codes
 */
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  
  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  
  // Background colors
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
} as const;

/**
 * Apply color to text
 * 
 * @param text - Text to colorize
 * @param color - Color code
 * @returns Colorized text
 */
export function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Convenience functions for common colors
 */
export const colored = {
  success: (text: string) => colorize(text, "green"),
  error: (text: string) => colorize(text, "red"),
  warning: (text: string) => colorize(text, "yellow"),
  info: (text: string) => colorize(text, "cyan"),
  muted: (text: string) => colorize(text, "dim"),
  bold: (text: string) => colorize(text, "bold"),
} as const;

/**
 * Default export with all utilities
 */
export const UI = {
  icons,
  status,
  progressBar,
  box,
  divider,
  list,
  numberedList,
  table,
  stageBanner,
  decisionGate,
  compactProgressRow,
  colors,
  colorize,
  colored,
} as const;

export default UI;
