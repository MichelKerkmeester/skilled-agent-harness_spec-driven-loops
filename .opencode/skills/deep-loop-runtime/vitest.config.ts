// MODULE: deep-loop-runtime Vitest Config
//
// Self-contained discovery config so the runtime suite runs from this skill
// root (npm test) without borrowing the system-spec-kit MCP server config.
// The system-spec-kit config still discovers these same tests for the
// combined CI run; this config covers the standalone path.

import { defineConfig } from 'vitest/config';
import path from 'node:path';

const TEST_TIMEOUT_MS = 30_000;
const TEARDOWN_TIMEOUT_MS = 1_000;

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  test: {
    include: ['tests/**/*.{vitest,test}.ts'],
    // Several script and lifecycle suites mutate shared state (the graph
    // writer lock, temp project roots). Run files serially for determinism.
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: TEST_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
  },
});
