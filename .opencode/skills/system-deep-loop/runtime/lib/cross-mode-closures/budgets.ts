// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Budget Closure
// ───────────────────────────────────────────────────────────────────

import {
  applyDeterministicOverride,
  assertExactKeys,
  getClosureServicePorts,
  verifySealedInputs,
} from './internal.js';
import { ClosureOwnerIds } from './types.js';

import type {
  BudgetDecision,
  BudgetMutationResult,
  BudgetVector,
  NormalizedBudgetReceipt,
} from '../hierarchical-budgets/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  CrossModeClosureContext,
  ModeDataPolicyOverride,
} from './types.js';

/** Mode-owned estimate selected without admission authority. */
export interface BudgetAdmissionPolicy {
  readonly estimate: BudgetVector;
}

/** Reservation request whose accounting is known before dispatch. */
export interface BudgetAdmissionInput {
  readonly operation: 'admit';
  readonly accountingStatus: 'certain' | 'uncertain';
  readonly requestId: string;
  readonly reservationId: string;
  readonly dispatchId: string;
  readonly leaseDurationMs: number;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly policyInput: Readonly<JsonObject>;
  readonly override: ModeDataPolicyOverride<JsonObject, BudgetAdmissionPolicy>;
}

/** Receipt-backed terminal settlement request. */
export interface BudgetSettlementInput {
  readonly operation: 'settle';
  readonly accountingStatus: 'certain' | 'uncertain';
  readonly requestId: string;
  readonly reservationId: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly receipt: Readonly<NormalizedBudgetReceipt> | null;
}

/** Closed admission or settlement operation accepted by the budget owner. */
export type TypedBudgetInput = BudgetAdmissionInput | BudgetSettlementInput;

/** Fail-closed result from the shared typed budget authority. */
export interface TypedBudgetOutcome {
  readonly ownerId: typeof ClosureOwnerIds.budgets;
  readonly status: 'admitted' | 'denied' | 'settled';
  readonly reasonCode: string;
  readonly admission: BudgetMutationResult | null;
  readonly attempt: BudgetMutationResult | null;
  readonly settlement: BudgetMutationResult | null;
}

function deny(reasonCode: string): Readonly<TypedBudgetOutcome> {
  return Object.freeze({
    ownerId: ClosureOwnerIds.budgets,
    status: 'denied',
    reasonCode,
    admission: null,
    attempt: null,
    settlement: null,
  });
}

function admissionAllows(decision: Readonly<BudgetDecision>): boolean {
  return decision.dispatchAllowed && !decision.incomplete;
}

/** Route admission and settlement through the typed authority, failing closed. */
export async function admitTypedBudget(
  context: CrossModeClosureContext,
  input: Readonly<TypedBudgetInput>,
): Promise<Readonly<TypedBudgetOutcome>> {
  if (input.accountingStatus !== 'certain') return deny('uncertain-accounting');
  await verifySealedInputs(context);
  const services = getClosureServicePorts(context);
  const evidence = {
    mode: context.modeIdentity,
    actorId: input.actorId,
    capabilityId: input.capabilityId,
    authorityEpoch: input.authorityEpoch,
    evidenceDigest: context.lifecycleEvent.canonicalDigest,
    replayFingerprint: context.lifecycleEvent.canonicalDigest,
    correlationId: context.correlation.correlationId,
    causationId: context.correlation.causationId,
  } as const;

  if (input.operation === 'settle') {
    if (input.receipt === null) return deny('uncertain-terminal-usage');
    const settlement = await services.budgets.settle({
      ...evidence,
      requestId: input.requestId,
      reservationId: input.reservationId,
      receipt: input.receipt,
    });
    if (settlement.decision.status !== 'settled' || settlement.decision.incomplete) {
      return Object.freeze({
        ...deny(settlement.decision.reasonCode),
        settlement,
      });
    }
    return Object.freeze({
      ownerId: ClosureOwnerIds.budgets,
      status: 'settled',
      reasonCode: settlement.decision.reasonCode,
      admission: null,
      attempt: null,
      settlement,
    });
  }

  const policy = await applyDeterministicOverride(input.override, input.policyInput);
  assertExactKeys(policy, ['estimate']);
  const admission = await services.budgets.admit({
    ...evidence,
    requestId: input.requestId,
    scopeId: context.budgetScope.scope.scopeId,
    reservationId: input.reservationId,
    dispatchId: input.dispatchId,
    estimate: policy.estimate,
    leaseDurationMs: input.leaseDurationMs,
  });
  if (!admissionAllows(admission.decision)) {
    return Object.freeze({
      ...deny(admission.decision.reasonCode),
      admission,
    });
  }
  const attempt = await services.budgets.startAttempt({
    ...evidence,
    requestId: `${input.requestId}:attempt`,
    reservationId: input.reservationId,
  });
  if (attempt.decision.status !== 'committed' || attempt.decision.incomplete) {
    return Object.freeze({
      ...deny(attempt.decision.reasonCode),
      admission,
      attempt,
    });
  }
  return Object.freeze({
    ownerId: ClosureOwnerIds.budgets,
    status: 'admitted',
    reasonCode: attempt.decision.reasonCode,
    admission,
    attempt,
    settlement: null,
  });
}
