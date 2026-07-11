// ───────────────────────────────────────────────────────────────────
// MODULE: Code Index Launcher Owner Reclaim Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type OwnerReclaimInput = {
  pidAlive: boolean;
  socketServing: boolean;
  childSpawnedAtMs: number | null;
  heartbeatAgeMs: number | null;
  nowMs: number;
  graceMs: number;
  maxInitMs: number;
  heartbeatTtlMs: number;
};

// ───────────────────────────────────────────────────────────────────
// 3. TEST SUBJECT (CJS REQUIRE)
// ───────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
const { classifyOwnerReclaim } = require('./mk-code-index-launcher.cjs') as {
  classifyOwnerReclaim: (input: OwnerReclaimInput) => string;
};

// ───────────────────────────────────────────────────────────────────
// 4. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const baseInput: OwnerReclaimInput = {
  pidAlive: true,
  socketServing: false,
  childSpawnedAtMs: 1_000,
  heartbeatAgeMs: null,
  nowMs: 1_000,
  graceMs: 100,
  maxInitMs: 500,
  heartbeatTtlMs: 1_000,
};

// ───────────────────────────────────────────────────────────────────
// 5. HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────

function reclaimInput(overrides: Partial<OwnerReclaimInput>): OwnerReclaimInput {
  return { ...baseInput, ...overrides };
}

// ───────────────────────────────────────────────────────────────────
// 6. TEST SUITE
// ───────────────────────────────────────────────────────────────────

describe('classifyOwnerReclaim', () => {
  it.each([
    [
      'dead-pid',
      reclaimInput({
        pidAlive: false,
        socketServing: true,
        childSpawnedAtMs: null,
        heartbeatAgeMs: 2_000,
      }),
    ],
    [
      'serving',
      reclaimInput({
        socketServing: true,
        childSpawnedAtMs: null,
      }),
    ],
    [
      'still-starting',
      reclaimInput({
        nowMs: 1_099,
      }),
    ],
    [
      'recheck',
      reclaimInput({
        nowMs: 1_101,
      }),
    ],
    [
      'reclaimable',
      reclaimInput({
        nowMs: 1_501,
        heartbeatAgeMs: 1_001,
      }),
    ],
  ])('returns %s for the representative branch', (expected, input) => {
    expect(classifyOwnerReclaim(input)).toBe(expected);
  });

  it('treats the grace boundary as still-starting', () => {
    expect(classifyOwnerReclaim(reclaimInput({ nowMs: 1_100 }))).toBe('still-starting');
  });

  it('treats the max-init boundary as recheck', () => {
    expect(classifyOwnerReclaim(reclaimInput({ nowMs: 1_500, heartbeatAgeMs: 1_001 }))).toBe('recheck');
  });

  it.each([
    [
      'unknown child age',
      reclaimInput({
        childSpawnedAtMs: null,
        nowMs: 10_000,
        heartbeatAgeMs: 10_000,
      }),
    ],
    [
      'past max init with missing heartbeat age',
      reclaimInput({
        nowMs: 1_501,
        heartbeatAgeMs: null,
      }),
    ],
    [
      'past max init with heartbeat age at ttl',
      reclaimInput({
        nowMs: 1_501,
        heartbeatAgeMs: 1_000,
      }),
    ],
    [
      'past max init with fresh heartbeat',
      reclaimInput({
        nowMs: 1_501,
        heartbeatAgeMs: 999,
      }),
    ],
  ])('returns recheck for conservative fallback: %s', (_label, input) => {
    expect(classifyOwnerReclaim(input)).toBe('recheck');
  });
});
