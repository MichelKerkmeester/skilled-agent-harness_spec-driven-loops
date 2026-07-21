// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Receipt and Effect Closure
// ───────────────────────────────────────────────────────────────────

import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
import {
  assertContextLifecycleFact,
  getClosureServicePorts,
  verifySealedInputs,
} from './internal.js';
import { ClosureOwnerIds } from './types.js';

import type {
  AuthorizedEvidenceAppendResult,
  BoundaryReceiptIssueInput,
  BoundaryReceiptIssueResult,
  EffectAdapter,
  EffectExecutionInput,
  EffectExecutionResult,
  EffectRecoveryInput,
  EffectRecoveryResult,
} from '../receipts-and-effect-recovery/index.js';
import type { EventWritePreflight } from '../event-envelope/index.js';
import type { CrossModeClosureContext } from './types.js';

/** Effect execution delegated to the existing recovery gateway. */
export interface ClosureEffectExecution<TRequest = unknown> {
  readonly input: Readonly<EffectExecutionInput<TRequest>>;
  readonly adapter: EffectAdapter<TRequest>;
}

/** Recovery execution delegated to the existing recovery gateway. */
export interface ClosureEffectRecovery<TRequest = unknown> {
  readonly input: Readonly<EffectRecoveryInput<TRequest>>;
  readonly adapter: EffectAdapter<TRequest>;
}

/** Ordered fact, effect or recovery, and optional boundary request. */
export interface ReceiptEffectInput<TRequest = unknown> {
  readonly authorizedFact: Readonly<EventWritePreflight>;
  readonly effect?: ClosureEffectExecution<TRequest>;
  readonly recovery?: ClosureEffectRecovery<TRequest>;
  readonly boundary?: Readonly<BoundaryReceiptIssueInput>;
}

/** Receipts and service results in their durable execution order. */
export interface ReceiptEffectOutcome {
  readonly ownerId: typeof ClosureOwnerIds['receipts-effects'];
  readonly orderedSteps: readonly string[];
  readonly authorizedFact: AuthorizedEvidenceAppendResult;
  readonly effect: EffectExecutionResult | null;
  readonly recovery: EffectRecoveryResult | null;
  readonly boundary: BoundaryReceiptIssueResult | null;
}

/** Append the authorized fact before delegating effects and receipts to their ports. */
export async function orderReceiptAndEffects<TRequest = unknown>(
  context: CrossModeClosureContext,
  input: Readonly<ReceiptEffectInput<TRequest>>,
): Promise<Readonly<ReceiptEffectOutcome>> {
  if (input.effect && input.recovery) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.RECEIPT_ORDER_VIOLATION,
      'Execution and recovery are mutually exclusive closure operations',
    );
  }
  assertContextLifecycleFact(context, input.authorizedFact);
  await verifySealedInputs(context);
  const services = getClosureServicePorts(context);
  const orderedSteps: string[] = [];
  let authorizedFact: AuthorizedEvidenceAppendResult;
  try {
    authorizedFact = await services.authorization.append(input.authorizedFact);
  } catch (error: unknown) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.AUTHORIZED_FACT_REQUIRED,
      'No receipt or effect may run without an authorized durable fact',
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
  orderedSteps.push('authorized-ledger-append');

  let effect: EffectExecutionResult | null = null;
  let recovery: EffectRecoveryResult | null = null;
  if (input.effect) {
    effect = await services.receipts.effects.execute(
      input.effect.input,
      input.effect.adapter,
    );
    orderedSteps.push('intent-effect-confirmation');
  } else if (input.recovery) {
    recovery = await services.receipts.effects.recover(
      input.recovery.input,
      input.recovery.adapter,
    );
    orderedSteps.push('intent-recovery-confirmation');
  }

  let boundary: BoundaryReceiptIssueResult | null = null;
  if (input.boundary) {
    if (input.boundary.resultEventId !== authorizedFact.verified.event.effective.envelope.event_id) {
      throw new CrossModeClosureError(
        CrossModeClosureErrorCodes.RECEIPT_ORDER_VIOLATION,
        'Boundary receipt must reference the fact authorized by this closure invocation',
      );
    }
    boundary = await services.receipts.boundaries.issue(input.boundary);
    orderedSteps.push('boundary-receipt');
  }

  return Object.freeze({
    ownerId: ClosureOwnerIds['receipts-effects'],
    orderedSteps: Object.freeze(orderedSteps),
    authorizedFact,
    effect,
    recovery,
    boundary,
  });
}
