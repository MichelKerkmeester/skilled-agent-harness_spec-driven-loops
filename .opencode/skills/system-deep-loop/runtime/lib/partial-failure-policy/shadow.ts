// ───────────────────────────────────────────────────────────────────
// MODULE: Partial Failure Additive-Dark Projection
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { evaluatePartialFailurePolicy } from './evaluator.js';

import type {
  EvaluatePartialFailureInput,
  LegacyFanOutOutcome,
  PartialFailureEvaluation,
  PartialFailureShadowResult,
  PolicyShadowComparisonReceipt,
  ShadowDifferenceClassification,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const POLICY_SHADOW_COMPARISON_EVENT_NAME =
  'orchestration.partial_failure_shadow_compared';

// ───────────────────────────────────────────────────────────────────
// 2. COMPARISON
// ───────────────────────────────────────────────────────────────────

function classification(
  evaluation: PartialFailureEvaluation,
  legacy: LegacyFanOutOutcome<unknown>,
): ShadowDifferenceClassification {
  if (evaluation.applicability === 'not_applicable' || evaluation.verdict === 'await') {
    return 'not_applicable';
  }
  if (
    (evaluation.verdict === 'proceed' && legacy.status === 'ok' && legacy.exitCode === 0)
    || (evaluation.verdict === 'proceed_degraded'
      && legacy.status === 'partial'
      && legacy.exitCode === 2)
    || (evaluation.verdict === 'abort'
      && legacy.status === 'partial'
      && legacy.exitCode === 3)
  ) {
    return 'aligned';
  }
  if (
    evaluation.verdict === 'abort'
    && legacy.status === 'partial'
    && legacy.exitCode === 2
  ) {
    return 'known_defect_difference';
  }
  return 'unexpected_difference';
}

function comparisonReceipt<TValue>(
  evaluation: PartialFailureEvaluation,
  legacy: LegacyFanOutOutcome<TValue>,
  comparedAt: string,
): PolicyShadowComparisonReceipt {
  if (!comparedAt.endsWith('Z') || Number.isNaN(new Date(comparedAt).getTime())) {
    throw new TypeError('comparedAt must be a valid UTC timestamp');
  }
  const facts = {
    classification: classification(evaluation, legacy),
    compared_at: comparedAt,
    event_name: POLICY_SHADOW_COMPARISON_EVENT_NAME,
    legacy_exit_code: legacy.exitCode,
    legacy_status: legacy.status,
    policy_evaluation_receipt_id: evaluation.policyEvaluationReceipt.receipt_id,
    run_id: evaluation.policyEvaluationReceipt.run_id,
    typed_applicability: evaluation.applicability,
    typed_finality: evaluation.finality,
    typed_verdict: evaluation.verdict,
  };
  const digest = sha256Bytes(canonicalBytes(facts));
  return Object.freeze({
    ...facts,
    comparison_digest: digest,
    comparison_id: `partial-failure-shadow:${digest}`,
  }) as PolicyShadowComparisonReceipt;
}

/** Evaluate in shadow while returning the exact legacy object as the sole authority. */
export function evaluatePartialFailurePolicyDark<TValue>(
  input: EvaluatePartialFailureInput,
  legacyOutcome: LegacyFanOutOutcome<TValue>,
  comparedAt: string,
): PartialFailureShadowResult<TValue> {
  if (
    !['ok', 'partial'].includes(legacyOutcome.status)
    || ![0, 2, 3].includes(legacyOutcome.exitCode)
    || (legacyOutcome.status === 'ok' && legacyOutcome.exitCode !== 0)
    || (legacyOutcome.status === 'partial' && legacyOutcome.exitCode === 0)
  ) {
    throw new TypeError('Legacy fan-out outcome has an incompatible status and exit code');
  }
  const shadowEvaluation = evaluatePartialFailurePolicy(input);
  return Object.freeze({
    authority: 'legacy-authoritative',
    comparison: comparisonReceipt(shadowEvaluation, legacyOutcome, comparedAt),
    legacyOutcome,
    shadowEvaluation,
  });
}

