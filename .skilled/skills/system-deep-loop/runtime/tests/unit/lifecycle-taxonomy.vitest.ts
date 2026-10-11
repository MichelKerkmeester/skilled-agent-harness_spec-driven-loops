// ───────────────────────────────────────────────────────────────────
// MODULE: Lifecycle Taxonomy Contract Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';

const nodeRequire = createRequire(import.meta.url);

const TAXONOMY = '../../lib/deep-loop/lifecycle-taxonomy.cjs';

const taxonomy = nodeRequire(TAXONOMY) as {
  STOP_REASONS: Record<string, string>;
  SESSION_OUTCOMES: Record<string, string>;
};

describe('lifecycle taxonomy (promoted contract)', () => {
  it('declares exactly the seven stopReasons in contractual order', () => {
    expect(Object.values(taxonomy.STOP_REASONS)).toEqual([
      'converged',
      'maxIterationsReached',
      'blockedStop',
      'manualStop',
      'error',
      'stuckRecovery',
      'userPaused',
    ]);
  });

  it('declares exactly the four sessionOutcomes in contractual order', () => {
    expect(Object.values(taxonomy.SESSION_OUTCOMES)).toEqual([
      'keptBaseline',
      'promoted',
      'rolledBack',
      'advisoryOnly',
    ]);
  });

  it('freezes both enums', () => {
    expect(Object.isFrozen(taxonomy.STOP_REASONS)).toBe(true);
    expect(Object.isFrozen(taxonomy.SESSION_OUTCOMES)).toBe(true);
  });
});
