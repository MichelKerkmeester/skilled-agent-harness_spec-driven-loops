// ───────────────────────────────────────────────────────────────
// FEATURE FLAG CEILING TEST
// ───────────────────────────────────────────────────────────────
// TEST: Validates that every SPECKIT_* gate the package still registers can be
// Activated at once without interaction, and that a newly registered flag
// Cannot drift in unnoticed. The ceiling used to span the search pipeline; the
// Surviving registry is the capability-gate module, so that is what it covers.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  isGeneratedMetadataDriftGateEnabled,
  isGeneratedMetadataGrandfatherEnabled,
  isGeneratorHardeningEnabled,
  isIdempotentDescriptionWritesEnabled,
  isIdentityMergeSafetyEnabled,
  isStatusCompletionConsistencyGateEnabled,
} from '../lib/config/capability-flags';

/**
 * The SPECKIT_* gates this ceiling test activates simultaneously. A drift
 * guard below derives the live token set from the module source so a silent
 * coverage gap fails loudly instead of passing quietly.
 */
const ALL_SPECKIT_FLAGS = [
  'SPECKIT_IDENTITY_MERGE_SAFETY',
  'SPECKIT_GENERATED_METADATA_GRANDFATHER',
  'SPECKIT_GENERATED_METADATA_DRIFT_GATE',
  'SPECKIT_GENERATOR_HARDENING',
  'SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES',
  'SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE',
];

const FLAG_CHECKERS: Array<{ flag: string; checker: () => boolean }> = [
  { flag: 'SPECKIT_IDENTITY_MERGE_SAFETY', checker: isIdentityMergeSafetyEnabled },
  { flag: 'SPECKIT_GENERATED_METADATA_GRANDFATHER', checker: isGeneratedMetadataGrandfatherEnabled },
  { flag: 'SPECKIT_GENERATED_METADATA_DRIFT_GATE', checker: isGeneratedMetadataDriftGateEnabled },
  { flag: 'SPECKIT_GENERATOR_HARDENING', checker: isGeneratorHardeningEnabled },
  { flag: 'SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES', checker: isIdempotentDescriptionWritesEnabled },
  {
    flag: 'SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE',
    checker: isStatusCompletionConsistencyGateEnabled,
  },
];

const ORIGINAL_ENV: Partial<Record<string, string | undefined>> = {};
const FLAG_SOURCE_PATHS = [
  '../lib/config/capability-flags.ts',
] as const;

function collectRegisteredFlagTokens(): Set<string> {
  const tokens = new Set<string>();
  for (const sourcePath of FLAG_SOURCE_PATHS) {
    const source = readFileSync(new URL(sourcePath, import.meta.url), 'utf8');
    for (const match of source.matchAll(/['"](SPECKIT_[A-Z0-9_]+)['"]/g)) {
      tokens.add(match[1]);
    }
    for (const match of source.matchAll(/process\.env\.(SPECKIT_[A-Z0-9_]+)/g)) {
      tokens.add(match[1]);
    }
  }
  return tokens;
}

function saveOriginalEnv(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    ORIGINAL_ENV[flag] = process.env[flag];
  }
}

function restoreOriginalEnv(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    if (ORIGINAL_ENV[flag] === undefined) {
      delete process.env[flag];
    } else {
      process.env[flag] = ORIGINAL_ENV[flag];
    }
  }
}

function activateAllFlags(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    process.env[flag] = 'true';
  }
}

function deactivateAllFlags(): void {
  for (const flag of ALL_SPECKIT_FLAGS) {
    delete process.env[flag];
  }
}

describe('Feature Flag Ceiling Test (A10-P2-2)', () => {
  beforeEach(() => {
    saveOriginalEnv();
    deactivateAllFlags();
  });

  afterEach(() => {
    restoreOriginalEnv();
  });

  it('activates every registered SPECKIT_* gate simultaneously without crash', () => {
    activateAllFlags();

    for (const { flag, checker } of FLAG_CHECKERS) {
      expect(checker(), `${flag} should be enabled`).toBe(true);
    }
  });

  it('reports all flags as enabled when all are set to "true"', () => {
    activateAllFlags();

    const results = FLAG_CHECKERS.map(({ flag, checker }) => ({
      flag,
      enabled: checker(),
    }));

    expect(results.every((r) => r.enabled)).toBe(true);
    expect(results.filter((r) => r.enabled).length).toBe(ALL_SPECKIT_FLAGS.length);
  });

  it('handles rapid toggle of all flags without state corruption', () => {
    activateAllFlags();
    for (const { checker } of FLAG_CHECKERS) {
      expect(checker()).toBe(true);
    }

    for (const flag of ALL_SPECKIT_FLAGS) {
      process.env[flag] = 'false';
    }
    for (const { checker } of FLAG_CHECKERS) {
      expect(checker()).toBe(false);
    }

    activateAllFlags();
    for (const { checker } of FLAG_CHECKERS) {
      expect(checker()).toBe(true);
    }
  });

  it('mixed flag states do not cause cross-flag interference', () => {
    const half = Math.floor(ALL_SPECKIT_FLAGS.length / 2);
    for (let i = 0; i < ALL_SPECKIT_FLAGS.length; i++) {
      process.env[ALL_SPECKIT_FLAGS[i]] = i < half ? 'true' : 'false';
    }

    for (let i = 0; i < FLAG_CHECKERS.length; i++) {
      const { flag, checker } = FLAG_CHECKERS[i];
      const expected = i < half;
      expect(checker(), `${flag} expected=${expected}`).toBe(expected);
    }
  });

  it('concurrent flag reads under all-active do not throw', () => {
    activateAllFlags();

    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      for (const { checker } of FLAG_CHECKERS) {
        expect(() => checker()).not.toThrow();
      }
    }
  });

  it('drift guard: every registered flag across the canonical flag modules is known', () => {
    const liveTokens = collectRegisteredFlagTokens();
    const known = new Set<string>([...ALL_SPECKIT_FLAGS, ...ACKNOWLEDGED_UNCEILINGED_FLAGS]);
    const unknown = [...liveTokens].filter((token) => !known.has(token)).sort();
    // A new flag must either join the ceiling list or be explicitly
    // acknowledged below — never drift in silently.
    expect(unknown).toEqual([]);
  });

  it('keeps ceiling and acknowledged inventories mutually exclusive', () => {
    const ceiling = new Set<string>(ALL_SPECKIT_FLAGS);
    const duplicates = ACKNOWLEDGED_UNCEILINGED_FLAGS
      .filter((token) => ceiling.has(token))
      .sort();
    expect(duplicates).toEqual([]);
  });
});

/**
 * Flags the canonical module registers that this ceiling suite deliberately
 * does not activate (rollout knobs or non-boolean semantics). This is a FROZEN
 * snapshot, not derived from the source — a newly added flag appears in neither
 * list and fails the drift guard, forcing an explicit decision here.
 */
const ACKNOWLEDGED_UNCEILINGED_FLAGS: string[] = [];
