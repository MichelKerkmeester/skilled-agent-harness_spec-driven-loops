// ───────────────────────────────────────────────────────────────────
// MODULE: runtime/ Vitest Config
// ───────────────────────────────────────────────────────────────────
//
// The suite runs from this skill root (npm test) and collects only the
// *.vitest.ts files, the naming every Skilled runtime uses.

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.vitest.ts'],
    testTimeout: 30_000,
  },
});
