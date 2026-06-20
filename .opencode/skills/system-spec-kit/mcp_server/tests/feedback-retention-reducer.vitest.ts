// ───────────────────────────────────────────────────────────────────
// MODULE: Feedback Retention Reducer Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AggregatedSignal } from '../lib/feedback/batch-learning.js';
import { resolveEdgeTierBasement } from '../lib/feedback/edge-tier-basement.js';
import {
  evaluateFeedbackRetention,
  revalidateSpareOnlyRetention,
} from '../lib/feedback/feedback-retention-reducer.js';
import type { RetentionCandidateRow } from '../lib/feedback/feedback-retention-reducer.js';

const RETENTION_FORGETTING_FLAG = 'SPECKIT_RETENTION_FORGETTING_V1';

afterEach(() => {
  vi.unstubAllEnvs();
});

function candidate(
  id: number,
  tier: string | null,
  overrides: Partial<RetentionCandidateRow> = {},
): RetentionCandidateRow {
  return {
    id,
    specFolder: 'specs/test-retention',
    filePath: `specs/test-retention/${id}.md`,
    tenantId: 'tenant-a',
    userId: 'user-a',
    agentId: 'agent-a',
    sessionId: 'session-a',
    deleteAfter: '2026-01-01T00:00:00.000Z',
    importanceTier: tier,
    decayHalfLifeDays: 90,
    isPinned: 0,
    accessCount: 0,
    lastAccessed: null,
    ...overrides,
  };
}

function signal(memoryId: number, overrides: Partial<AggregatedSignal> = {}): AggregatedSignal {
  return {
    memoryId: String(memoryId),
    sessionCount: 3,
    queryCount: 2,
    strongCount: 3,
    mediumCount: 0,
    weakCount: 0,
    firstSeen: 1_780_000_000_000,
    lastSeen: 1_780_000_000_000,
    weightedHitCount: 3,
    weightedScore: 3,
    computedBoost: 0.03,
    ...overrides,
  };
}

describe('feedback retention reducer', () => {
  it('protects constitutional, critical, and pinned expired rows', () => {
    const result = evaluateFeedbackRetention([
      candidate(1, 'constitutional'),
      candidate(2, 'critical'),
      candidate(3, 'normal', { isPinned: 1 }),
    ], []);

    expect(result.decisions.map((decision) => decision.decision)).toEqual([
      'protect',
      'protect',
      'protect',
    ]);
    expect(result.byDecision.protect).toBe(3);
  });

  it('extends important rows with positive supported feedback', () => {
    const result = evaluateFeedbackRetention([candidate(1, 'important')], [signal(1)], {
      runAt: 1_780_000_000_000,
      extendDays: 14,
    });

    expect(result.decisions[0]).toMatchObject({
      memoryId: 1,
      decision: 'extend',
      reason: 'important_positive_feedback',
      weightedHitCount: 3,
      queryCount: 2,
      sessionCount: 3,
    });
    expect(result.decisions[0].nextDeleteAfter).toBe('2026-06-11T20:26:40.000Z');
  });

  it('does not over-retain normal or temporary rows from exposure-only signals', () => {
    const result = evaluateFeedbackRetention([
      candidate(1, 'normal'),
      candidate(2, 'temporary'),
    ], [
      signal(1, { strongCount: 0, weakCount: 10, weightedHitCount: 0, weightedScore: 1 }),
      signal(2, { strongCount: 0, weakCount: 8, weightedHitCount: 0, weightedScore: 0.8 }),
    ]);

    expect(result.decisions.map((decision) => decision.decision)).toEqual(['delete', 'delete']);
    expect(result.byDecision.delete).toBe(2);
  });

  it('uses the damped weighted hit metric instead of raw score volume', () => {
    const result = evaluateFeedbackRetention([candidate(1, 'important')], [
      signal(1, {
        sessionCount: 4,
        queryCount: 3,
        strongCount: 4,
        mediumCount: 4,
        weightedHitCount: 0.5,
        weightedScore: 6,
      }),
    ]);

    expect(result.decisions[0]).toMatchObject({
      decision: 'delete',
      reason: 'positive_signal_below_retention_threshold',
      weightedHitCount: 0.5,
      weightedScore: 6,
    });
  });

  it('extends normal rows with supported positive feedback when retention forgetting is enabled', () => {
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'true');

    const result = evaluateFeedbackRetention([candidate(1, 'normal')], [signal(1)], {
      runAt: 1_780_000_000_000,
      extendDays: 7,
    });

    expect(result.decisions[0]).toMatchObject({
      memoryId: 1,
      decision: 'extend',
      reason: 'positive_feedback_spare',
      weightedHitCount: 3,
      queryCount: 2,
      sessionCount: 3,
    });
    expect(result.decisions[0].nextDeleteAfter).toBe('2026-06-04T20:26:40.000Z');
  });

  it('spares rows before comparison when importance or trust axes are non-finite', () => {
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'true');

    const result = evaluateFeedbackRetention([
      candidate(1, 'normal', { importanceWeight: Number.NaN }),
      candidate(2, 'temporary', { retentionTrustScore: Number.NEGATIVE_INFINITY }),
    ], []);

    expect(result.decisions.map((decision) => ({
      id: decision.memoryId,
      decision: decision.decision,
      reason: decision.reason,
    }))).toEqual([
      { id: 1, decision: 'protect', reason: 'non_finite_importance_axis' },
      { id: 2, decision: 'protect', reason: 'non_finite_trust_axis' },
    ]);
  });

  it('refuses retention forgetting thresholds that put both floors at the ceiling', () => {
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'true');

    expect(() => evaluateFeedbackRetention([candidate(1, 'normal')], [], {
      minImportanceWeight: 1,
      minTrustScore: 1,
    })).toThrow(/floors cannot both be at the ceiling/i);
  });
});

describe('in-transaction spare-axis re-validation', () => {
  it('returns null when retention forgetting is disabled (explicit OFF, unchanged)', () => {
    // The flag is default-ON, so the disabled path is reached by an explicit
    // 'false': a stale delete must stay a delete when the safety layer is off.
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'false');
    expect(revalidateSpareOnlyRetention(candidate(1, 'normal', { importanceWeight: 0.99 }))).toBeNull();
  });

  it('protects when fresh importance reaches the spare floor', () => {
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'true');

    expect(revalidateSpareOnlyRetention(candidate(1, 'normal', { importanceWeight: 0.9 }))).toEqual({
      decision: 'protect',
      reason: 'importance_axis_spared',
      nextDeleteAfter: null,
    });
  });

  it('protects when fresh trust reaches the spare floor', () => {
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'true');

    expect(revalidateSpareOnlyRetention(candidate(1, 'normal', {
      importanceWeight: 0.1,
      retentionTrustScore: 0.8,
    }))).toEqual({
      decision: 'protect',
      reason: 'trust_axis_spared',
      nextDeleteAfter: null,
    });
  });

  it('stays a delete candidate when all fresh axes are below the floors', () => {
    vi.stubEnv(RETENTION_FORGETTING_FLAG, 'true');

    expect(revalidateSpareOnlyRetention(candidate(1, 'normal', {
      importanceWeight: 0.1,
      retentionTrustScore: 0.1,
    }))).toBeNull();
  });
});

describe('edge tier basement', () => {
  it('floors manual or authored high-tier pairs using imported state limits', () => {
    expect(resolveEdgeTierBasement({
      sourceImportanceTier: 'important',
      targetImportanceTier: 'critical',
      provenance: 'manual',
    })).toEqual({
      floored: true,
      floorState: 'HOT',
      stateLimit: 50,
      reason: 'authored_high_tier_pair',
    });

    expect(resolveEdgeTierBasement({
      sourceImportanceTier: 'important',
      targetImportanceTier: 'important',
      provenance: 'authored',
    })).toEqual({
      floored: true,
      floorState: 'WARM',
      stateLimit: 30,
      reason: 'authored_high_tier_pair',
    });
  });

  it('floors explicit constitutional-chain evidence but not auto-derived edges', () => {
    expect(resolveEdgeTierBasement({
      sourceImportanceTier: 'normal',
      targetImportanceTier: 'normal',
      evidence: 'constitutional_chain',
    })).toMatchObject({ floored: true, floorState: 'HOT', stateLimit: 50 });

    expect(resolveEdgeTierBasement({
      sourceImportanceTier: 'constitutional',
      targetImportanceTier: 'normal',
      provenance: 'auto_derived',
      evidence: 'constitutional_chain',
    })).toEqual({
      floored: false,
      floorState: null,
      stateLimit: null,
      reason: 'auto_derived_not_floored',
    });
  });

  it('does not floor a single high-tier endpoint without authored pair evidence', () => {
    expect(resolveEdgeTierBasement({
      sourceImportanceTier: 'constitutional',
      targetImportanceTier: 'normal',
      provenance: 'manual',
    })).toEqual({
      floored: false,
      floorState: null,
      stateLimit: null,
      reason: 'no_floor_evidence',
    });
  });
});
