// ───────────────────────────────────────────────────────────────────
// MODULE: Node Globals Shim
// ───────────────────────────────────────────────────────────────────

// `tsconfig.pi.json` resolves no `@types/node` (the repository has no root
// `node_modules`), and the Pi spec-gate extensions touch exactly one Node global. Declaring
// that one keeps the type gate honest: a new global shows up as an error here instead of
// being silently available because a shim widened the environment.

declare const process: {
  env: Record<string, string | undefined>;
};
