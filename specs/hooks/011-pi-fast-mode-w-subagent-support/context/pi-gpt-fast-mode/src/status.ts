// TUI indicator for Fast Mode.
//
// Modes:
//   - "status": footer status entry via ctx.ui.setStatus  (default, simplest)
//   - "widget": right-aligned "fast" row below the editor via ctx.ui.setWidget
//   - "off":    no visible indicator (injection still happens)

import { STATUS_KEY, type IndicatorMode } from "./types.ts";// Loosely typed so the real ExtensionContext (with its overloaded setWidget)
// is structurally assignable. The extension passes ctx directly.
export interface StatusUI {
  hasUI?: boolean;
  mode?: string;
  ui?: {
    // deno-lint-ignore no-explicit-any
    setStatus?: (key: string, text: any) => void;
    // deno-lint-ignore no-explicit-any
    setWidget?: (key: string, content: any, options?: any) => void;
  };
}

function canRender(ctx: StatusUI): boolean {
  if (!ctx.hasUI) return false;
  if (ctx.mode !== undefined && ctx.mode !== "tui") return false;
  return !!ctx.ui;
}

function rightAlign(text: string, width: number): string {
  const w = Math.max(0, Math.floor(width));
  if (w === 0) return "";
  if (text.length >= w) return text.slice(0, w);
  return `${" ".repeat(w - text.length)}${text}`;
}

/** Clear every indicator surface this extension might have set. */
export function clearIndicator(ctx: StatusUI): void {
  if (!canRender(ctx)) return;
  ctx.ui?.setStatus?.(STATUS_KEY, undefined);
  ctx.ui?.setWidget?.(STATUS_KEY, undefined, { placement: "belowEditor" });
}

/**
 * Reflect the current state in the configured indicator surface.
 * `show` is true when the indicator should appear (active or armed-for-subagents).
 * `label` is the text shown (e.g. "fast", "flex", or "fast\u21e2" when armed).
 */
export function updateIndicator(
  ctx: StatusUI,
  mode: IndicatorMode,
  show: boolean,
  label: string,
): void {
  if (!canRender(ctx)) return;

  // Always clear first so switching modes / state never leaves a stale entry.
  clearIndicator(ctx);

  if (!show || mode === "off") return;

  if (mode === "widget" && typeof ctx.ui?.setWidget === "function") {
    ctx.ui.setWidget(
      STATUS_KEY,
      () => ({
        render: (width: number) => [rightAlign(label, width)],
        dispose() {},
      }),
      { placement: "belowEditor" },
    );
    return;
  }

  ctx.ui?.setStatus?.(STATUS_KEY, label);
}
