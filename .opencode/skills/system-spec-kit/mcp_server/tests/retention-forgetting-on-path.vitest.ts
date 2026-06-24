// ───────────────────────────────────────────────────────────────────
// MODULE: Retention Forgetting Safety Layer — ON-path contract
// ───────────────────────────────────────────────────────────────────
// Asserts that enabling SPECKIT_RETENTION_FORGETTING CHANGES the drop
// decision: rows that are expired but spare on a safety axis (importance,
// trust, age) flip from "delete" to "protect". This is the safety contract —
// the flag must drop the right rows and keep the protected keep-set — not a
// flag-off byte-identity check.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  evaluateFeedbackRetention,
  revalidateSpareOnlyRetention,
  type RetentionCandidateRow,
} from '../lib/feedback/feedback-retention-reducer';

const FLAG = 'SPECKIT_RETENTION_FORGETTING';

function candidate(overrides: Partial<RetentionCandidateRow>): RetentionCandidateRow {
  return {
    id: 1,
    specFolder: 'system-spec-kit/028',
    filePath: 'impl.md',
    tenantId: null,
    userId: null,
    agentId: null,
    sessionId: null,
    deleteAfter: '2000-01-01T00:00:00.000Z',
    importanceTier: 'normal',
    importanceWeight: 0.2,
    qualityScore: null,
    retentionTrustScore: null,
    decayHalfLifeDays: null,
    isPinned: 0,
    accessCount: 0,
    lastAccessed: 0,
    createdAt: '2000-01-01T00:00:00.000Z',
    ...overrides,
  };
}

let previous: string | undefined;

beforeEach(() => {
  previous = process.env[FLAG];
});

afterEach(() => {
  if (previous === undefined) delete process.env[FLAG];
  else process.env[FLAG] = previous;
});

function withFlag<T>(enabled: boolean, fn: () => T): T {
  // The flag is now default-ON, so the OFF path must be reached by an explicit
  // 'false' rather than by absence (absence now means ON).
  process.env[FLAG] = enabled ? 'true' : 'false';
  return fn();
}

describe('SPECKIT_RETENTION_FORGETTING — drop decision contract', () => {
  it('protects a high-importance expired row only when the flag is ON', () => {
    // A spare expired row: importance 0.90 is at/above the 0.85 floor.
    const rows = [candidate({ id: 11, importanceWeight: 0.9 })];

    const off = withFlag(false, () => evaluateFeedbackRetention(rows, []));
    const on = withFlag(true, () => evaluateFeedbackRetention(rows, []));

    // OFF: the safety axis is not consulted, the expired row is a clean delete.
    expect(off.decisions[0].decision).toBe('delete');
    expect(off.byDecision.protect).toBe(0);

    // ON: the importance axis spares the row — behavior CHANGES.
    expect(on.decisions[0].decision).toBe('protect');
    expect(on.decisions[0].reason).toBe('importance_axis_spared');
    expect(on.byDecision.protect).toBe(1);

    // The decision genuinely flipped between variants.
    expect(on.decisions[0].decision).not.toBe(off.decisions[0].decision);
  });

  it('protects a high-trust expired row on the trust axis when ON', () => {
    const rows = [candidate({ id: 12, importanceWeight: 0.1, retentionTrustScore: 0.8 })];

    const off = withFlag(false, () => evaluateFeedbackRetention(rows, []));
    const on = withFlag(true, () => evaluateFeedbackRetention(rows, []));

    expect(off.decisions[0].decision).toBe('delete');
    expect(on.decisions[0].decision).toBe('protect');
    expect(on.decisions[0].reason).toBe('trust_axis_spared');
  });

  it('still drops a genuinely spare expired row even with the flag ON', () => {
    // Low importance, no trust, normal tier, unpinned, old: nothing spares it.
    const rows = [candidate({ id: 13, importanceWeight: 0.1, retentionTrustScore: 0.2 })];

    const on = withFlag(true, () => evaluateFeedbackRetention(rows, []));

    // The safety layer must not over-protect: a row spare on every axis drops.
    expect(on.decisions[0].decision).toBe('delete');
    expect(on.byDecision.delete).toBe(1);
  });

  it('keeps constitutional/critical and pinned rows protected regardless of flag', () => {
    const rows = [
      candidate({ id: 14, importanceTier: 'constitutional', importanceWeight: 0.1 }),
      candidate({ id: 15, importanceTier: 'normal', importanceWeight: 0.1, isPinned: 1 }),
    ];

    const off = withFlag(false, () => evaluateFeedbackRetention(rows, []));
    const on = withFlag(true, () => evaluateFeedbackRetention(rows, []));

    for (const evaluation of [off, on]) {
      expect(evaluation.decisions.every((d) => d.decision === 'protect')).toBe(true);
    }
  });

  it('exposes the spare-only revalidation only when the flag is ON', () => {
    const row = candidate({ id: 16, importanceWeight: 0.95 });

    expect(withFlag(false, () => revalidateSpareOnlyRetention(row))).toBeNull();

    const revalidated = withFlag(true, () => revalidateSpareOnlyRetention(row));
    expect(revalidated).not.toBeNull();
    expect(revalidated?.decision).toBe('protect');
    expect(revalidated?.reason).toBe('importance_axis_spared');
  });
});
