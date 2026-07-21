// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Adjudication Closure
// ───────────────────────────────────────────────────────────────────

import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
import {
  applyDeterministicOverride,
  assertExactKeys,
  getClosureServicePorts,
  verifySealedInputs,
} from './internal.js';
import { ClosureOwnerIds } from './types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  AdjudicationInvocationPlan,
  AdjudicationInvocationResult,
  CrossModeClosureContext,
  ModeDataPolicyOverride,
} from './types.js';

const PLAN_KEYS = Object.freeze([
  'adjudicationId',
  'request',
  'candidates',
  'judgePolicy',
  'counterfactualPolicy',
] as const);
const LOCAL_REDUCTION_KEYS = Object.freeze([
  'decision',
  'localVerdict',
  'pass',
  'status',
] as const);

/** Shared service verdict with all raw judgments and counterfactual probes intact. */
export interface SharedAdjudicationOutcome extends AdjudicationInvocationResult {
  readonly ownerId: typeof ClosureOwnerIds.adjudication;
}

/** Invoke the service verdict once and return its evidence without local reduction. */
export async function invokeBlindedAdjudication(
  context: CrossModeClosureContext,
  policyInput: Readonly<JsonObject>,
  override: ModeDataPolicyOverride<JsonObject, AdjudicationInvocationPlan>,
): Promise<Readonly<SharedAdjudicationOutcome>> {
  await verifySealedInputs(context);
  const services = getClosureServicePorts(context);
  const plan = await applyDeterministicOverride(override, policyInput);
  if (LOCAL_REDUCTION_KEYS.some((field) => Object.hasOwn(plan, field))) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.LOCAL_ADJUDICATION_REDUCTION_FORBIDDEN,
      'Mode policy cannot derive a local adjudication result',
    );
  }
  assertExactKeys(plan, PLAN_KEYS);
  if (
    plan.request.authorityPosture !== 'legacy-canonical-shadow-only'
    || plan.request.replayFingerprint !== context.lifecycleEvent.canonicalDigest
  ) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_OVERRIDE,
      'Adjudication policy cannot widen authority or detach replay identity',
    );
  }

  const result = await services.adjudication.invoke(
    services.adjudication.service,
    plan,
  );
  if (
    result.verdict.adjudicationId !== plan.adjudicationId
    || result.verdict.replayFingerprint !== plan.request.replayFingerprint
    || result.verdict.legacyAuthority !== 'canonical'
    || result.verdict.serviceAuthority !== 'shadow-only'
  ) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.ADJUDICATION_RESULT_INVALID,
      'Adjudication service returned evidence outside the bound invocation',
    );
  }

  return Object.freeze({
    ownerId: ClosureOwnerIds.adjudication,
    verdict: result.verdict,
    rawJudgments: result.rawJudgments,
    counterfactualResults: result.counterfactualResults,
  });
}
