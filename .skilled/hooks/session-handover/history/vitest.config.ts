// ───────────────────────────────────────────────────────────────────
// MODULE: Vitest Config - History Lookup Engine
// ───────────────────────────────────────────────────────────────────

import { defineConfig } from 'vitest/config';

// Collection stays inside this package. The suites import vitest's functions themselves, so no
// globals and no shared setup are needed.
export default defineConfig({
  root: import.meta.dirname,
  test: {
    include: ['tests/**/*.vitest.ts'],
    environment: 'node',
  },
});
