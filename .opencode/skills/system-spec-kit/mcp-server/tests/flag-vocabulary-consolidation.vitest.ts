// ───────────────────────────────────────────────────────────────────
// MODULE: Flag Vocabulary Consolidation tests
// ───────────────────────────────────────────────────────────────────
// Regression coverage for hand-rolled boolean env-flag sites that now delegate
// to the shared parseFlagTristate() helper, for sites not already covered by
// their own site-specific test files (memory-roadmap-flags.vitest.ts,
// generated-metadata-integrity.vitest.ts, retrieval-rescue.vitest.ts,
// memory-idempotency-and-near-duplicate.vitest.ts, causal-boost.vitest.ts,
// memory-retention-sweep.vitest.ts, description/repair-specimens.vitest.ts).
// The exhaustive parseFlagTristate() vocabulary matrix itself lives in
// search-flags.vitest.ts.

import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import {
  GENERATED_METADATA_DRIFT_GATE_ENV,
  GENERATOR_HARDENING_ENV,
  IDEMPOTENT_DESCRIPTION_WRITES_ENV,
  IDENTITY_MERGE_SAFETY_ENV,
  CAPABILITY_ENV,
  getMemoryRoadmapCapabilityFlags,
  isGeneratedMetadataDriftGateEnabled,
  isGeneratorHardeningEnabled,
  isIdempotentDescriptionWritesEnabled,
  isIdentityMergeSafetyEnabled,
} from '../lib/config/capability-flags.js';
import { isGeneratedMetadataZExclusionEnabled } from '../lib/search/folder-discovery.js';
import { isEntityLinkingEnabled } from '../lib/search/search-flags.js';
import { getAdaptiveMode } from '../lib/cognitive/adaptive-ranking.js';
import { collectCausalWeightedNeighbors } from '../lib/graph/bfs-traversal.js';

const BFS_RELATION_WEIGHTS: Readonly<Record<string, number>> = { caused: 1.0 };
import { onIndex } from '../lib/search/graph-lifecycle.js';

const OPT_IN_VALUES = ['true', '1', 'yes', 'on', 'enabled'];
const OPT_OUT_VALUES = ['false', '0', 'no', 'off', 'disabled'];

function withEnv<T>(name: string, value: string | undefined, fn: () => T): T {
  const previous = process.env[name];
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
  try {
    return fn();
  } finally {
    if (previous === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = previous;
    }
  }
}

describe('capability-flags.ts: remaining standalone default-ON sites', () => {
  const CASES: Array<{ name: string; env: string; fn: () => boolean }> = [
    { name: 'isIdentityMergeSafetyEnabled', env: IDENTITY_MERGE_SAFETY_ENV, fn: isIdentityMergeSafetyEnabled },
    { name: 'isGeneratedMetadataDriftGateEnabled', env: GENERATED_METADATA_DRIFT_GATE_ENV, fn: isGeneratedMetadataDriftGateEnabled },
    { name: 'isGeneratorHardeningEnabled', env: GENERATOR_HARDENING_ENV, fn: isGeneratorHardeningEnabled },
    { name: 'isIdempotentDescriptionWritesEnabled', env: IDEMPOTENT_DESCRIPTION_WRITES_ENV, fn: isIdempotentDescriptionWritesEnabled },
  ];

  for (const { name, env, fn } of CASES) {
    it(`${name}: unset-env baseline is unchanged (stays ON) after migration`, () => {
      withEnv(env, undefined, () => {
        expect(fn()).toBe(true);
      });
    });

    it(`${name}: every recognized opt-out value disables it, including the previously-unrecognized "no"/"disabled"`, () => {
      for (const value of OPT_OUT_VALUES) {
        withEnv(env, value, () => {
          expect(fn(), `value=${value}`).toBe(false);
        });
      }
    });

    it(`${name}: recognized opt-in values (or unset) keep it enabled`, () => {
      for (const value of OPT_IN_VALUES) {
        withEnv(env, value, () => {
          expect(fn(), `value=${value}`).toBe(true);
        });
      }
    });
  }
});

describe('folder-discovery.ts: isGeneratedMetadataZExclusionEnabled', () => {
  const ENV = 'SPECKIT_GENERATED_METADATA_Z_EXCLUSION';

  it('unset-env baseline is unchanged (stays ON) after migration', () => {
    withEnv(ENV, undefined, () => {
      expect(isGeneratedMetadataZExclusionEnabled()).toBe(true);
    });
  });

  it('widens to the full opt-out vocabulary, previously only false/0', () => {
    for (const value of OPT_OUT_VALUES) {
      withEnv(ENV, value, () => {
        expect(isGeneratedMetadataZExclusionEnabled(), `value=${value}`).toBe(false);
      });
    }
  });
});

describe('graph-lifecycle.ts reuse-fix: canonical isEntityLinkingEnabled() replaces the inline SPECKIT_ENTITY_LINKING re-parse', () => {
  // The inline guard used to check only 'false'/'0' and never consulted
  // SPECKIT_ROLLOUT_PERCENT. Calling the canonical isEntityLinkingEnabled() getter
  // means graph-lifecycle.ts can no longer diverge from every other consumer of
  // SPECKIT_ENTITY_LINKING — including its rollout-percentage semantics.
  it('agrees with the pre-migration inline vocabulary for the explicit-disable values', () => {
    for (const value of ['false', '0']) {
      withEnv('SPECKIT_ENTITY_LINKING', value, () => {
        withEnv('SPECKIT_ROLLOUT_PERCENT', undefined, () => {
          expect(isEntityLinkingEnabled(), `value=${value}`).toBe(false);
        });
      });
    }
  });

  it('stays enabled for unset/other values at full rollout, matching pre-migration behavior', () => {
    withEnv('SPECKIT_ENTITY_LINKING', undefined, () => {
      withEnv('SPECKIT_ROLLOUT_PERCENT', undefined, () => {
        expect(isEntityLinkingEnabled()).toBe(true);
      });
    });
  });

  it('resolves onIndex to skipReason entity_linking_disabled when disabled, matching the old inline guard', () => {
    withEnv('SPECKIT_ENTITY_LINKING', 'false', () => {
      withEnv('SPECKIT_GRAPH_REFRESH_MODE', undefined, () => {
        withEnv('SPECKIT_QUERY_SURROGATES', 'false', () => {
          const result = onIndex(new Database(':memory:'), 1, '');
          expect(result).toMatchObject({ skipped: true, skipReason: 'entity_linking_disabled' });
        });
      });
    });
  });
});

describe('duplicate pair: SPECKIT_MEMORY_ADAPTIVE_RANKING (capability-flags.ts vs adaptive-ranking.ts)', () => {
  // Both copies now call parseFlagTristate('SPECKIT_MEMORY_ADAPTIVE_RANKING', false)
  // so they can no longer disagree on the same env var.
  it('agrees on enabled/disabled across the full vocabulary, unset, and garbage', () => {
    const ENV = CAPABILITY_ENV.adaptiveRanking;
    for (const value of [undefined, ...OPT_IN_VALUES, ...OPT_OUT_VALUES, 'garbage']) {
      withEnv(ENV, value, () => {
        withEnv('SPECKIT_ROLLOUT_PERCENT', '100', () => {
          const roadmapEnabled = getMemoryRoadmapCapabilityFlags().adaptiveRanking;
          const adaptiveEnabled = getAdaptiveMode() !== 'disabled';
          expect(adaptiveEnabled, `value=${String(value)}`).toBe(roadmapEnabled);
        });
      });
    }
  });
});

describe('duplicate pair: SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES (bfs-traversal.ts side)', () => {
  const ENV = 'SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES';

  function createCausalDbWithProvenance(): Database.Database {
    const db = new Database(':memory:');
    db.exec(`
      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relation TEXT NOT NULL,
        strength REAL DEFAULT 1.0,
        created_by TEXT DEFAULT 'manual'
      );
    `);
    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength, created_by)
      VALUES ('1', '2', 'caused', 1.0, 'entity_linker')
    `).run();
    return db;
  }

  it('opts in to entity-linker causal edges for the widened opt-in vocabulary, agreeing with the causal-boost.ts side', () => {
    const db = createCausalDbWithProvenance();
    try {
      for (const value of OPT_IN_VALUES) {
        withEnv(ENV, value, () => {
          const neighbors = collectCausalWeightedNeighbors(db, [1], 1, BFS_RELATION_WEIGHTS);
          expect(neighbors.has(2), `value=${value}`).toBe(true);
        });
      }

      for (const value of [undefined, ...OPT_OUT_VALUES]) {
        withEnv(ENV, value, () => {
          const neighbors = collectCausalWeightedNeighbors(db, [1], 1, BFS_RELATION_WEIGHTS);
          expect(neighbors.has(2), `value=${String(value)}`).toBe(false);
        });
      }
    } finally {
      db.close();
    }
  });
});
