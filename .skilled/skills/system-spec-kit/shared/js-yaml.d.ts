// ───────────────────────────────────────────────────────────────────
// MODULE: js-yaml Ambient Types
// ───────────────────────────────────────────────────────────────────

// Ambient declaration for the js-yaml API surface the shared package uses.
// The CLI carries its own (load-only) declaration; shared needs dump as well.

declare module 'js-yaml' {
  export function load(source: string): unknown;
  export function dump(source: unknown, options?: { lineWidth?: number }): string;
}
