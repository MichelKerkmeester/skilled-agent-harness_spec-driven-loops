// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Projection Closure
// ───────────────────────────────────────────────────────────────────

import { computeIntegrityHash } from '../deep-loop/atomic-state.js';
import { canonicalizeProtectedResource } from '../locks-and-fencing/index.js';
import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
import {
  applyDeterministicOverride,
  assertContextLifecycleFact,
  assertExactKeys,
  cloneFrozenJson,
  eventIdentity,
  getClosureServicePorts,
  verifySealedInputs,
} from './internal.js';
import { ClosureOwnerIds } from './types.js';

import type { EventReadResult, EventWritePreflight, JsonObject } from '../event-envelope/index.js';
import type { FencedLease, FencedStateReceipt, ReplayIdentity } from '../locks-and-fencing/index.js';
import type {
  CrossModeClosureContext,
  ModeDataPolicyOverride,
} from './types.js';

/** Data-only reducer input assembled after authorized gauge folding. */
export interface ProjectionPolicyInput {
  readonly priorProjection: Readonly<JsonObject>;
  readonly lifecyclePayload: Readonly<JsonObject>;
  readonly gaugeOutput: Readonly<JsonObject>;
  readonly eventIdentity: Readonly<JsonObject>;
}

/** Authorized projection update bound to a declared fenced resource. */
export interface ProjectionUpdateInput {
  readonly authorizedFact: Readonly<EventWritePreflight>;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly priorGaugeAccumulator: Readonly<JsonObject> | null;
  readonly priorProjection: Readonly<JsonObject>;
  readonly projectionKeys: readonly string[];
  readonly lease: Readonly<FencedLease>;
  readonly expectedVersion: number;
  readonly replayIdentity: Readonly<ReplayIdentity>;
  readonly override: ModeDataPolicyOverride<ProjectionPolicyInput, JsonObject>;
}

/** Deterministic fold, projection, digest, and fenced write receipt. */
export interface ProjectionUpdateOutcome {
  readonly ownerId: typeof ClosureOwnerIds.projections;
  readonly gaugeAccumulator: Readonly<JsonObject>;
  readonly gaugeOutput: Readonly<JsonObject>;
  readonly modeProjection: Readonly<JsonObject>;
  readonly projectionHash: string;
  readonly stateReceipt: FencedStateReceipt;
}

/** Fold a verified event and commit one deterministic projection under a fence. */
export async function updateProjectionAndGauge(
  context: CrossModeClosureContext,
  input: Readonly<ProjectionUpdateInput>,
): Promise<Readonly<ProjectionUpdateOutcome>> {
  assertContextLifecycleFact(context, input.authorizedFact);
  await verifySealedInputs(context);
  const services = getClosureServicePorts(context);
  const leaseResourceDeclared = context.writeSet.some((binding) => (
    canonicalizeProtectedResource(binding.protectedResource).resourceDigest
    === input.lease.resource.resourceDigest
  ));
  if (!leaseResourceDeclared) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.PROJECTION_REJECTED,
      'Projection lease resource is outside the context write set',
    );
  }
  const appended = await services.authorization.append(input.authorizedFact);
  const verifiedEvent: Readonly<EventReadResult> = appended.verified.event;
  const initial = input.priorGaugeAccumulator
    ?? services.gauges.initialAccumulator(input.gaugeId, input.gaugeVersion);
  const gaugeAccumulator = services.gauges.reduce(
    input.gaugeId,
    input.gaugeVersion,
    initial,
    verifiedEvent,
    appended.verified.frame.sequence,
  );
  const gaugeOutput = services.gauges.finalize(
    input.gaugeId,
    input.gaugeVersion,
    gaugeAccumulator,
  );
  const modeProjection = await applyDeterministicOverride(input.override, {
    priorProjection: input.priorProjection,
    lifecyclePayload: verifiedEvent.effective.envelope.payload,
    gaugeOutput,
    eventIdentity: eventIdentity(context),
  });
  assertExactKeys(modeProjection, input.projectionKeys);
  const nextState = cloneFrozenJson({
    mode_identity: context.modeIdentity,
    interface_version: context.interfaceVersion,
    continuity_identity: context.continuityIdentity,
    lifecycle_event: eventIdentity(context),
    sealed_reference_digests: context.sealedReferences.map((reference) => (
      reference.qualified_digest
    )),
    gauge: {
      gauge_id: input.gaugeId,
      gauge_version: input.gaugeVersion,
      accumulator: gaugeAccumulator,
      output: gaugeOutput,
    },
    mode_projection: modeProjection,
    authority_posture: context.posture,
  } as unknown as JsonObject);
  const projectionHash = computeIntegrityHash(nextState);
  try {
    const stateReceipt = await services.fencing.stateStore.replace({
      lease: input.lease,
      expectedVersion: input.expectedVersion,
      continuityIdentity: context.continuityIdentity,
      replayIdentity: input.replayIdentity,
      nextState,
    });
    return Object.freeze({
      ownerId: ClosureOwnerIds.projections,
      gaugeAccumulator,
      gaugeOutput,
      modeProjection,
      projectionHash,
      stateReceipt,
    });
  } catch (error: unknown) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.PROJECTION_REJECTED,
      'Projection commit failed authorization or fence validation',
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
}
