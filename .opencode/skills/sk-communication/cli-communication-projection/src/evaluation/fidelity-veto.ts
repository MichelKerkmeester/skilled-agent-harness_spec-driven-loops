// ───────────────────────────────────────────────────────────────────
// MODULE: Absolute Evaluation Fidelity Veto
// ───────────────────────────────────────────────────────────────────

import { validateProjectionCandidate } from '../fidelity/validator.js';

import type {
  FidelityReasonCode,
  ProjectionValidationInput,
} from '../fidelity/types.js';

/** Ephemeral candidate validation input associated with one blind comparison. */
export interface EvaluationFidelityCandidate {
  readonly comparisonId: string;
  readonly stratumId: string;
  readonly validation: Omit<ProjectionValidationInput, 'judgeMode'>;
}

/** Content-free fidelity decision consumed by the release gate. */
export interface EvaluationFidelityVetoDecision {
  readonly decisionVersion: 'evaluation-fidelity-veto/1.0.0';
  readonly comparisonId: string;
  readonly stratumId: string;
  readonly status: 'passed' | 'vetoed';
  readonly reasonCode: FidelityReasonCode;
  readonly absoluteVeto: boolean;
  readonly checkCount: number;
}

/** Run deterministic protected-span and factual checks with no judge or model call. */
export async function evaluateFidelityVeto(
  input: EvaluationFidelityCandidate,
): Promise<EvaluationFidelityVetoDecision> {
  if (input.comparisonId.length === 0 || input.stratumId.length === 0) {
    throw new TypeError('Fidelity evaluation identities must be non-empty.');
  }
  const result = await validateProjectionCandidate({
    ...input.validation,
    judgeMode: 'disabled',
  });
  const passed = result.status === 'accepted';
  return Object.freeze({
    decisionVersion: 'evaluation-fidelity-veto/1.0.0',
    comparisonId: input.comparisonId,
    stratumId: input.stratumId,
    status: passed ? 'passed' : 'vetoed',
    reasonCode: result.reasonCode,
    absoluteVeto: !passed,
    checkCount: 'checks' in result ? result.checks.length : 0,
  });
}

/** Evaluate candidates sequentially while retaining only content-free decisions. */
export async function evaluateFidelityVetoes(
  inputs: readonly EvaluationFidelityCandidate[],
): Promise<readonly EvaluationFidelityVetoDecision[]> {
  const decisions: EvaluationFidelityVetoDecision[] = [];
  for (const input of inputs) {
    decisions.push(await evaluateFidelityVeto(input));
  }
  return Object.freeze(decisions);
}
