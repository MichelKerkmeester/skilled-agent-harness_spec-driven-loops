// ───────────────────────────────────────────────────────────────
// TEST — Generic-Query Deep Routing
// ───────────────────────────────────────────────────────────────
// Generic short queries read "weak" because the cheap simple route suppresses
// the recall machinery they most need. These tests pin the escalation contract:
//   1. A low/fallback-confidence short query escalates to the deep (complex)
//      route — full channels + un-suppressed expansion.
//   2. A confident short query stays on the cheap simple route (cost control).
//   3. A weak result yields non-empty recovery.suggestedQueries.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { classifyQueryComplexity } from '../lib/search/query-classifier';
import { buildRecoveryPayload, type RecoveryContext } from '../lib/search/recovery-payload';

const TRIGGER_PHRASES = ['save context', 'memory search'];

function withRouter(fn: () => void): void {
  const original = process.env.SPECKIT_COMPLEXITY_ROUTER;
  process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
  try {
    fn();
  } finally {
    if (original === undefined) delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    else process.env.SPECKIT_COMPLEXITY_ROUTER = original;
  }
}

function makeCtx(overrides: Partial<RecoveryContext> = {}): RecoveryContext {
  return { query: null, hasSpecFolderFilter: false, resultCount: 0, ...overrides };
}

/* ───────────────────────────────────────────────────────────────
   1. ESCALATION — low-signal short query → deep route
──────────────────────────────────────────────────────────────── */

describe('Generic-query deep routing: escalation', () => {
  it('escalates a high-stop-word short query to complex with low confidence', () => {
    withRouter(() => {
      // "is it on" — 3 terms, all stop words (ratio 1.0), no trigger anchor.
      const result = classifyQueryComplexity('is it on');
      expect(result.features.termCount).toBeLessThanOrEqual(3);
      expect(result.features.stopWordRatio).toBeGreaterThanOrEqual(0.5);
      expect(result.tier).toBe('complex');
      expect(result.confidence).toBe('low');
      // The escalated plan must reflect the full-pipeline complexity tier.
      expect(result.queryPlan.complexity).toBe('complex');
    });
  });

  it('escalation flips the low-signal flag the budget/recovery paths read', () => {
    withRouter(() => {
      // "to do it" — 3 terms, all stop words; escalated off the simple route.
      const result = classifyQueryComplexity('to do it');
      expect(result.features.termCount).toBe(3);
      expect(result.tier).toBe('complex');
      // Confidence in {low, fallback} is the contract hybrid-search keys
      // lowSignalQuery off — escalated generic queries must satisfy it.
      expect(['low', 'fallback']).toContain(result.confidence);
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   2. NON-ESCALATION — confident short queries stay cheap
──────────────────────────────────────────────────────────────── */

describe('Generic-query deep routing: cost control', () => {
  it('keeps a content-rich short query on the simple route', () => {
    withRouter(() => {
      const result = classifyQueryComplexity('semantic retrieval embedding');
      expect(result.features.stopWordRatio).toBe(0);
      expect(result.tier).toBe('simple');
    });
  });

  it('keeps a one-stop-word short query (ratio below floor) on the simple route', () => {
    withRouter(() => {
      // "fix the bug" — 1 stop word of 3 (ratio 0.333) is below the 0.5 floor.
      const result = classifyQueryComplexity('fix the bug');
      expect(result.features.stopWordRatio).toBeCloseTo(0.333, 2);
      expect(result.tier).toBe('simple');
    });
  });

  it('keeps a trigger-anchored short query on the simple route', () => {
    withRouter(() => {
      const result = classifyQueryComplexity('memory search', TRIGGER_PHRASES);
      expect(result.features.hasTriggerMatch).toBe(true);
      expect(result.tier).toBe('simple');
      expect(result.confidence).toBe('high');
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   3. RECOVERY — weak result yields actionable suggestions
──────────────────────────────────────────────────────────────── */

describe('Generic-query deep routing: recovery suggestions', () => {
  it('emits synonym-expansion suggestions for a weak generic short query', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 5,
      avgConfidence: 0.2,
      query: 'semantic search',
    }));
    expect(payload.status).toBe('low_confidence');
    expect(payload.suggestedQueries.length).toBeGreaterThan(0);
    // Variants come from the domain synonym map (semantic→embedding/vector,
    // search→retrieval/query), so at least one must differ from the original.
    expect(payload.suggestedQueries.some((s) => s !== 'semantic search')).toBe(true);
    expect(
      payload.suggestedQueries.some((s) => /embedding|vector|retrieval|query/.test(s)),
    ).toBe(true);
  });

  it('fills suggestions for a single-word query that previously returned none', () => {
    const payload = buildRecoveryPayload(makeCtx({ resultCount: 1, query: 'memory' }));
    expect(payload.suggestedQueries.length).toBeGreaterThan(0);
    expect(payload.suggestedQueries.every((s) => s.trim().length > 0)).toBe(true);
  });

  it('never exceeds the three-suggestion cap', () => {
    const payload = buildRecoveryPayload(makeCtx({
      resultCount: 0,
      query: 'auth error fix deploy cache',
    }));
    expect(payload.suggestedQueries.length).toBeLessThanOrEqual(3);
  });
});
