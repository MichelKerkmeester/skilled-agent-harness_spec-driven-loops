// ───────────────────────────────────────────────────────────────
// MODULE: Root Vitest configuration
// ───────────────────────────────────────────────────────────────

export default {
  test: {
    include: [
      'tests/**/*.vitest.ts',
      'scripts/tests/**/*.vitest.ts',
      'mcp-server/tests/**/*.vitest.ts',
    ],
    globals: true,
  },
};
