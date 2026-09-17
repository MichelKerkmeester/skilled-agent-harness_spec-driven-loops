// ───────────────────────────────────────────────────────────────────
// MODULE: Reject-Only Evaluation Offer Consult
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';

import type { DatedReleaseEvidence } from '../release/evidence.js';
import type { ReleaseGateDecision } from './gate.js';

/** Content-free reason for every unsafe offer terminal. */
export const OfferReasonCodes = {
  EVALUATION_EVIDENCE_INVALID: 'evaluation-evidence-invalid',
  EVALUATION_EVIDENCE_STALE: 'evaluation-evidence-stale',
  EVALUATION_VERDICT_REJECTED: 'evaluation-verdict-rejected',
} as const;

/** Content-free offer reason. */
export type OfferReasonCode = typeof OfferReasonCodes[keyof typeof OfferReasonCodes];

/** Typed terminal returned by the reject-only offer consult. */
export type OfferVerdict =
  | { readonly status: 'proceed' }
  | { readonly status: 'exact-original'; readonly reasonCode: OfferReasonCode };

type OfferEvidenceState = 'fresh' | 'invalid' | 'stale';

const EVALUATION_GATE_VERSION = 'evaluation-release-gate/1.0.0';

/**
 * Compose the blind non-inferiority verdict as a reject-only offer decision.
 * A fresh, approved verdict lets projection be offered; any fail, inconclusive,
 * stale, or invalid verdict returns the exact original and never a rewrite.
 */
export function evaluateOfferVerdict(
  evaluation: DatedReleaseEvidence<ReleaseGateDecision>,
  now: string,
): OfferVerdict {
  const evidenceState = assessOfferEvidence(evaluation, now);
  if (evidenceState === 'invalid') {
    return exactOriginal(OfferReasonCodes.EVALUATION_EVIDENCE_INVALID);
  }
  if (evidenceState === 'stale') {
    return exactOriginal(OfferReasonCodes.EVALUATION_EVIDENCE_STALE);
  }
  const result = evaluation.result;
  if (
    result.gateVersion !== EVALUATION_GATE_VERSION
    || result.status !== 'pass'
    || result.releaseApproved !== true
  ) {
    return exactOriginal(OfferReasonCodes.EVALUATION_VERDICT_REJECTED);
  }
  return deepFreeze({ status: 'proceed' });
}

function assessOfferEvidence(
  evaluation: DatedReleaseEvidence<ReleaseGateDecision>,
  now: string,
): OfferEvidenceState {
  const evaluatedAt = toInstant(now);
  const observedAt = toInstant(evaluation.observedAt);
  const expiresAt = toInstant(evaluation.expiresAt);
  if (
    evaluatedAt === null
    || evaluation.evidenceRef.trim().length === 0
    || observedAt === null
    || expiresAt === null
    || observedAt > evaluatedAt
    || expiresAt < observedAt
  ) {
    return 'invalid';
  }
  return evaluatedAt > expiresAt ? 'stale' : 'fresh';
}

function toInstant(value: string): number | null {
  if (/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    const timestamp = Date.parse(`${value}T00:00:00.000Z`);
    return !Number.isNaN(timestamp) ? timestamp : null;
  }
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function exactOriginal(reasonCode: OfferReasonCode): OfferVerdict {
  return deepFreeze({ status: 'exact-original', reasonCode });
}
