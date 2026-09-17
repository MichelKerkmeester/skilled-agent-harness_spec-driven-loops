// ───────────────────────────────────────────────────────────────────
// MODULE: Reject-Only Offer Consult Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { OfferReasonCodes, evaluateOfferVerdict } from '../../src/evaluation/index.js';

import type { ReleaseGateDecision } from '../../src/evaluation/index.js';
import type { DatedReleaseEvidence } from '../../src/release/index.js';

const NOW = '2026-08-12T12:00:00.000Z';
const OBSERVED_AT = '2026-08-12T08:00:00.000Z';
const EXPIRES_AT = '2026-08-20T00:00:00.000Z';

function approved(overrides: Partial<ReleaseGateDecision> = {}): ReleaseGateDecision {
  return {
    gateVersion: 'evaluation-release-gate/1.0.0',
    claimTier: 'full-projection',
    evidenceClass: 'human',
    isProvisional: false,
    status: 'pass',
    reasonCode: 'lower-bounds-clear-margins',
    releaseApproved: true,
    diagnosticMetricCount: 0,
    strata: [],
    ...overrides,
  };
}

function dated(
  result: ReleaseGateDecision,
  observedAt: string = OBSERVED_AT,
  expiresAt: string = EXPIRES_AT,
): DatedReleaseEvidence<ReleaseGateDecision> {
  return {
    result,
    evidenceRef: 'evaluation/human-certified.json',
    observedAt,
    expiresAt,
  };
}

describe('evaluateOfferVerdict', () => {
  it('proceeds on a fresh approved verdict', () => {
    expect(evaluateOfferVerdict(dated(approved()), NOW)).toEqual({ status: 'proceed' });
  });

  it('rejects a failing verdict', () => {
    const verdict = evaluateOfferVerdict(
      dated(approved({ status: 'fail', releaseApproved: false, reasonCode: 'noninferiority-fail' })),
      NOW,
    );

    expect(verdict).toEqual({
      status: 'exact-original',
      reasonCode: OfferReasonCodes.EVALUATION_VERDICT_REJECTED,
    });
  });

  it('rejects an inconclusive verdict', () => {
    const verdict = evaluateOfferVerdict(
      dated(approved({ status: 'inconclusive', releaseApproved: false, reasonCode: 'incomplete-evidence' })),
      NOW,
    );

    expect(verdict).toEqual({
      status: 'exact-original',
      reasonCode: OfferReasonCodes.EVALUATION_VERDICT_REJECTED,
    });
  });

  it('rejects stale evidence whose expiry has passed', () => {
    const verdict = evaluateOfferVerdict(
      dated(approved(), OBSERVED_AT, '2026-08-12T09:00:00.000Z'),
      '2026-08-12T12:00:00.000Z',
    );

    expect(verdict).toEqual({
      status: 'exact-original',
      reasonCode: OfferReasonCodes.EVALUATION_EVIDENCE_STALE,
    });
  });

  it('rejects invalid evidence with unusable timestamps', () => {
    const verdict = evaluateOfferVerdict(
      dated(approved(), 'not-a-date', EXPIRES_AT),
      NOW,
    );

    expect(verdict).toEqual({
      status: 'exact-original',
      reasonCode: OfferReasonCodes.EVALUATION_EVIDENCE_INVALID,
    });
  });

  it('rejects a verdict that never approved release', () => {
    const verdict = evaluateOfferVerdict(
      dated(approved({ status: 'pass', releaseApproved: false })),
      NOW,
    );

    expect(verdict).toEqual({
      status: 'exact-original',
      reasonCode: OfferReasonCodes.EVALUATION_VERDICT_REJECTED,
    });
  });
});
