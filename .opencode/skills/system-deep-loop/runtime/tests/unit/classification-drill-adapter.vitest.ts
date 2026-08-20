// ───────────────────────────────────────────────────────────────────
// MODULE: Classification → Rollback Drill Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { adaptClassificationForDrill } from '../../lib/rollback-drills/classification-drill-adapter.js';
import type { DrillClassificationRow } from '../../lib/rollback-drills/classification-drill-adapter.js';
import type {
  ClassificationEvidence,
  ClassifiedInflightStateRow,
  LeaseState,
  PendingEffectsState,
} from '../../lib/inflight-state-classification/index.js';
import { InflightDisposition } from '../../lib/inflight-state-classification/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const VERIFIER_IDENTITY = 'verifier-classification-adapter';

function digest(label: string): string {
  return createHash('sha256').update(label, 'utf8').digest('hex');
}

interface EvidenceOverrides {
  readonly rowId?: string;
  readonly leaseState?: LeaseState;
  readonly activeLeaseCount?: number;
  readonly pendingEffectsState?: PendingEffectsState;
  readonly receiptDigest?: string;
  readonly identityCoverage?: boolean;
  readonly orderCoverage?: boolean;
}

function evidenceFor(overrides: EvidenceOverrides = {}): ClassificationEvidence {
  const rowId = overrides.rowId ?? 'row-quiescent';
  return {
    rowId,
    isPresent: true,
    stateDigest: digest(`${rowId}:state`),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(`${rowId}:schema`),
    lifecyclePoint: 'active',
    authorityState: 'legacy_authoritative',
    authorityEpoch: 7,
    mutability: 'append-only',
    leaseState: overrides.leaseState ?? 'none',
    activeLeaseCount: overrides.activeLeaseCount ?? 0,
    leaseSetDigest: digest(`${rowId}:leases`),
    pendingEffectsState: overrides.pendingEffectsState ?? 'none',
    pendingEffectSetDigest: digest(`${rowId}:effects`),
    identityCoverage: overrides.identityCoverage ?? true,
    orderCoverage: overrides.orderCoverage ?? true,
    idempotencyCoverage: true,
    budgetCoverage: true,
    receiptCoverage: true,
    pendingWorkCoverage: true,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: `legacy-anchor-${rowId}`,
      digest: digest(`${rowId}:rollback-anchor`),
      retained: true,
      restorable: true,
      minimumRetentionDays: 14,
      minimumSuccessfulRuns: 5,
    },
    verifier: {
      verified: true,
      receiptDigest: overrides.receiptDigest ?? digest(`${rowId}:verifier`),
      replayFingerprintDigest: digest(`${rowId}:replay-fingerprint`),
      rollbackScenarioDigest: digest(`${rowId}:rollback-scenario`),
      parityCaseDigest: null,
    },
    proof: {
      kind: 'upcast',
      adjacentChainComplete: true,
      pure: true,
      deterministic: true,
      sideEffectFree: true,
      sourceBytesPreserved: true,
      immutableIdentityPreserved: true,
      replayEquivalent: true,
      sourceBytesDigest: digest(`${rowId}:source`),
      effectiveStateDigest: digest(`${rowId}:effective`),
      registryDigest: digest(`${rowId}:registry`),
      chainIdentitiesDigest: digest(`${rowId}:chain`),
    },
  };
}

function classifiedFor(
  rowId: string,
  disposition: typeof InflightDisposition[keyof typeof InflightDisposition] = InflightDisposition.UPCAST,
): ClassifiedInflightStateRow {
  return {
    rowId,
    censusRowDigest: digest(`${rowId}:census-row`),
    modes: ['research'],
    disposition,
    reasonCode: 'UPCAST_PROVEN',
    rationale: 'quiescent upcast',
    evidence: {
      isPresent: true,
      stateDigest: digest(`${rowId}:state`),
      shapeVersion: '1',
      shapeStatus: 'registered',
      schemaDigest: digest(`${rowId}:schema`),
      lifecyclePoint: 'active',
      authorityState: 'legacy_authoritative',
      authorityEpoch: 7,
      mutability: 'append-only',
      leaseState: 'none',
      leaseSetDigest: digest(`${rowId}:leases`),
      pendingEffectsState: 'none',
      pendingEffectSetDigest: digest(`${rowId}:effects`),
      identityCoverage: true,
      orderCoverage: true,
      idempotencyCoverage: true,
      budgetCoverage: true,
      receiptCoverage: true,
      pendingWorkCoverage: true,
      rollbackAnchorId: `legacy-anchor-${rowId}`,
      rollbackAnchorDigest: digest(`${rowId}:rollback-anchor`),
      verifierReceiptDigest: digest(`${rowId}:verifier`),
      replayFingerprintDigest: digest(`${rowId}:replay-fingerprint`),
      rollbackScenarioDigest: digest(`${rowId}:rollback-scenario`),
      parityCaseDigest: null,
      proofDigest: digest(`${rowId}:proof`),
      freshnessDigest: digest(`${rowId}:freshness`),
    },
  };
}

const DRILL_ROW_KEYS = Object.freeze([
  'activeLeaseIds',
  'authorityEpoch',
  'disposition',
  'identityCoverageComplete',
  'isQuiescent',
  'lifecyclePoint',
  'mutability',
  'orderCoverageComplete',
  'pendingEffectIds',
  'reasonCode',
  'rollbackAnchorDigest',
  'rowId',
  'shapeVersion',
  'stateDigest',
  'terminalReceiptId',
  'verifier',
] as const);

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('adaptClassificationForDrill', () => {
  it('adapts a clean quiescent row to a valid sixteen-key drill row with empty lease and effect ids', () => {
    const rowId = 'row-quiescent';
    const result = adaptClassificationForDrill({
      evidence: [evidenceFor({ rowId })],
      classified: [classifiedFor(rowId)],
      expectedRowIds: [rowId],
      verifierIdentity: VERIFIER_IDENTITY,
    });

    expect(result.expectedRowIds).toEqual([rowId]);
    expect(result.rows).toHaveLength(1);
    const row = result.rows[0] as DrillClassificationRow;
    expect(Object.keys(row).sort()).toEqual([...DRILL_ROW_KEYS].sort());
    expect(row.rowId).toBe(rowId);
    expect(row.activeLeaseIds).toEqual([]);
    expect(row.pendingEffectIds).toEqual([]);
    expect(row.identityCoverageComplete).toBe(true);
    expect(row.orderCoverageComplete).toBe(true);
    expect(row.isQuiescent).toBe(true);
    expect(row.verifier).toBe(VERIFIER_IDENTITY);
    expect(row.terminalReceiptId).toBe(digest(`${rowId}:verifier`));
    expect(row.disposition).toBe(InflightDisposition.UPCAST);
  });

  it('throws when activeLeaseCount is greater than zero, naming the row', () => {
    const rowId = 'row-live-lease';
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId, leaseState: 'active', activeLeaseCount: 2 })],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId],
        verifierIdentity: VERIFIER_IDENTITY,
      }),
    ).toThrow(TypeError);
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId, leaseState: 'active', activeLeaseCount: 2 })],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId],
        verifierIdentity: VERIFIER_IDENTITY,
      }),
    ).toThrow(new RegExp(rowId));
  });

  it('throws when pendingEffectsState is "active-legacy"', () => {
    const rowId = 'row-active-legacy';
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId, pendingEffectsState: 'active-legacy' })],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId],
        verifierIdentity: VERIFIER_IDENTITY,
      }),
    ).toThrow(TypeError);
  });

  it('throws for an expected row with no evidence', () => {
    const rowId = 'row-missing-evidence';
    expect(() =>
      adaptClassificationForDrill({
        evidence: [],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId],
        verifierIdentity: VERIFIER_IDENTITY,
      }),
    ).toThrow(/No classification evidence/);
  });

  it('throws for an expected row with no classified row', () => {
    const rowId = 'row-missing-classified';
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId })],
        classified: [],
        expectedRowIds: [rowId],
        verifierIdentity: VERIFIER_IDENTITY,
      }),
    ).toThrow(/No classified inflight state row/);
  });

  it('throws on duplicate ids in expectedRowIds', () => {
    const rowId = 'row-duplicate';
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId })],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId, rowId],
        verifierIdentity: VERIFIER_IDENTITY,
      }),
    ).toThrow(/Duplicate expected row id/);
  });

  it('throws when verifierIdentity is empty', () => {
    const rowId = 'row-quiescent';
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId })],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId],
        verifierIdentity: '',
      }),
    ).toThrow(/verifierIdentity/);
    expect(() =>
      adaptClassificationForDrill({
        evidence: [evidenceFor({ rowId })],
        classified: [classifiedFor(rowId)],
        expectedRowIds: [rowId],
        verifierIdentity: '   ',
      }),
    ).toThrow(/verifierIdentity/);
  });

  it('emits rows in expectedRowIds order and excludes rows outside that set', () => {
    const first = 'row-first';
    const second = 'row-second';
    const third = 'row-third';
    const result = adaptClassificationForDrill({
      evidence: [
        evidenceFor({ rowId: first }),
        evidenceFor({ rowId: second }),
        evidenceFor({ rowId: third }),
      ],
      classified: [
        classifiedFor(first),
        classifiedFor(second),
        classifiedFor(third),
      ],
      expectedRowIds: [third, first],
      verifierIdentity: VERIFIER_IDENTITY,
    });

    expect(result.rows.map((r) => r.rowId)).toEqual([third, first]);
    expect(result.expectedRowIds).toEqual([third, first]);
  });

  it('computes isQuiescent true only for none/quiescent lease with none/reconciled effects, false otherwise', () => {
    // isQuiescent is false whenever the lease state is not none/quiescent or
    // the effects state is not none/reconciled. The non-quiescent effect
    // states ('active-legacy', 'uncertain') are refused by the adapter before
    // a row is produced, so the only non-throwing path to isQuiescent=false
    // is a non-quiescent lease state with a zero live-lease count.
    const cases: Array<{
      readonly rowId: string;
      readonly leaseState: LeaseState;
      readonly pendingEffectsState: PendingEffectsState;
      readonly expected: boolean;
    }> = [
      { rowId: 'q-none-none', leaseState: 'none', pendingEffectsState: 'none', expected: true },
      { rowId: 'q-quiescent-none', leaseState: 'quiescent', pendingEffectsState: 'none', expected: true },
      { rowId: 'q-none-reconciled', leaseState: 'none', pendingEffectsState: 'reconciled', expected: true },
      { rowId: 'q-quiescent-reconciled', leaseState: 'quiescent', pendingEffectsState: 'reconciled', expected: true },
      { rowId: 'q-active-none', leaseState: 'active', pendingEffectsState: 'none', expected: false },
      { rowId: 'q-uncertain-none', leaseState: 'uncertain', pendingEffectsState: 'none', expected: false },
    ];

    const evidence: ClassificationEvidence[] = [];
    const classified: ClassifiedInflightStateRow[] = [];
    const expectedRowIds: string[] = [];
    for (const c of cases) {
      // Keep count zero so a non-quiescent lease state still produces a row;
      // only the state values drive isQuiescent here.
      evidence.push(
        evidenceFor({
          rowId: c.rowId,
          leaseState: c.leaseState,
          activeLeaseCount: 0,
          pendingEffectsState: c.pendingEffectsState,
        }),
      );
      classified.push(classifiedFor(c.rowId));
      expectedRowIds.push(c.rowId);
    }

    const result = adaptClassificationForDrill({
      evidence,
      classified,
      expectedRowIds,
      verifierIdentity: VERIFIER_IDENTITY,
    });

    for (let i = 0; i < cases.length; i += 1) {
      const row = result.rows[i] as DrillClassificationRow;
      expect(row.isQuiescent).toBe(cases[i].expected);
    }
  });

  it('sets terminalReceiptId to null when the receipt digest is absent', () => {
    const rowId = 'row-no-receipt';
    const result = adaptClassificationForDrill({
      evidence: [evidenceFor({ rowId, receiptDigest: '' })],
      classified: [classifiedFor(rowId)],
      expectedRowIds: [rowId],
      verifierIdentity: VERIFIER_IDENTITY,
    });

    expect((result.rows[0] as DrillClassificationRow).terminalReceiptId).toBeNull();
  });
});
