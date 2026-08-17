// ───────────────────────────────────────────────────────────────────
// MODULE: Status Indicator
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { STATUS_KEY, type FastModeConfig, type ModelRef } from "./types";
import { findMatchingTarget } from "./payload";

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Text displayed when Fast Mode is active for the current model. */
export type StatusText = "fast" | undefined;

/** Renderable status indicator component used by the TUI. */
export type FastIndicatorComponent = {
  render(width: number): string[];
  invalidate(): void;
};

/** Factory that creates a status indicator component. */
export type FastIndicatorFactory = (
  ...args: unknown[]
) => FastIndicatorComponent;

/** Minimal UI context required to update Fast Mode status. */
export type StatusContext = {
  hasUI?: boolean;
  mode?: string;
  ui?: {
    setStatus?: (key: string, text: string | undefined) => void;
    setWidget?: {
      (
        key: string,
        content: string[] | undefined,
        options?: { placement?: "aboveEditor" | "belowEditor" },
      ): void;
      (
        key: string,
        content: FastIndicatorFactory | undefined,
        options?: { placement?: "aboveEditor" | "belowEditor" },
      ): void;
    };
  };
};

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function setFastIndicator(ctx: StatusContext, text: StatusText): void {
  if (typeof ctx.ui?.setWidget === "function") {
    ctx.ui.setStatus?.(STATUS_KEY, undefined);
    ctx.ui.setWidget(
      STATUS_KEY,
      text === undefined ? undefined : createFastIndicatorFactory(text),
      { placement: "belowEditor" },
    );
    return;
  }

  ctx.ui?.setStatus?.(STATUS_KEY, text);
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Resolve the status text for the current configuration and model. */
export function getStatusText(
  config: FastModeConfig,
  model: ModelRef | undefined,
): StatusText {
  return config.enabled && findMatchingTarget(model, config.targets)
    ? "fast"
    : undefined;
}

/** Right-align status text within a fixed-width display area. */
export function getRightAlignedStatusLine(text: string, width: number): string {
  const safeWidth = Math.max(0, Math.floor(width));
  if (safeWidth === 0) return "";
  if (text.length >= safeWidth) return text.slice(0, safeWidth);
  return `${" ".repeat(safeWidth - text.length)}${text}`;
}

/** Create a TUI indicator factory for the supplied status text. */
export function createFastIndicatorFactory(text: string): FastIndicatorFactory {
  return () => ({
    render(width: number): string[] {
      return [getRightAlignedStatusLine(text, width)];
    },
    invalidate(): void {},
  });
}

/** Check whether the current context can publish a TUI status indicator. */
export function canSetTuiStatus(ctx: StatusContext): boolean {
  if (!ctx.hasUI) return false;
  if (ctx.mode !== undefined && ctx.mode !== "tui") return false;
  return (
    typeof ctx.ui?.setWidget === "function" ||
    typeof ctx.ui?.setStatus === "function"
  );
}

/** Update the TUI indicator for the current Fast Mode state. */
export function updateFastStatus(
  ctx: StatusContext,
  config: FastModeConfig,
  model: ModelRef | undefined,
): void {
  if (!canSetTuiStatus(ctx)) return;
  setFastIndicator(ctx, getStatusText(config, model));
}

/** Clear the Fast Mode indicator from the TUI. */
export function clearFastStatus(ctx: StatusContext): void {
  if (!canSetTuiStatus(ctx)) return;
  setFastIndicator(ctx, undefined);
}
