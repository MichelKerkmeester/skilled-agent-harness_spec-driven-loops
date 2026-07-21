// ───────────────────────────────────────────────────────────────────
// MODULE: Receipt and Effect Replay Projection
// ───────────────────────────────────────────────────────────────────

import { TypedReducerRegistry } from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { ReplayComponentRegistry } from '../replay-fingerprint/index.js';
import {
  BOUNDARY_RECEIPT_EVENT_TYPE,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EFFECT_RECOVERY_STARTED_EVENT_TYPE,
  BoundaryRegistry,
  createBoundaryRegistry,
} from './event-contracts.js';

import type {
  ReplayExecutionInput,
} from '../replay-fingerprint/index.js';
import type {
  EventReadResult,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  BoundaryReceiptPayload,
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  OperatorResolutionPayload,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REPLAY CONTRACT
// ───────────────────────────────────────────────────────────────────

export const EVIDENCE_CONTROL_REDUCER_ID = 'receipts-and-effect-recovery';
export const EVIDENCE_CONTROL_REDUCER_VERSION = '1';
export const EVIDENCE_CONTROL_PROJECTION_SCHEMA_VERSION = '1';

export interface EvidenceControlProjection extends JsonObject {
  readonly ordered_events: string[];
  readonly boundary_results: string[];
  readonly receipts: string[];
  readonly intents: string[];
  readonly confirmations: string[];
  readonly recovery_attempts: string[];
  readonly reconciliation_verdicts: string[];
  readonly conflicts: string[];
  readonly operator_resolutions: string[];
}

export const INITIAL_EVIDENCE_CONTROL_PROJECTION: EvidenceControlProjection = Object.freeze({
  ordered_events: [],
  boundary_results: [],
  receipts: [],
  intents: [],
  confirmations: [],
  recovery_attempts: [],
  reconciliation_verdicts: [],
  conflicts: [],
  operator_resolutions: [],
});

// ───────────────────────────────────────────────────────────────────
// 2. REDUCERS
// ───────────────────────────────────────────────────────────────────

function appendOrdered(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  return {
    ...state,
    ordered_events: [...state.ordered_events, event.effective.envelope.event_id],
  };
}

function reduceBoundaryResult(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload;
  return {
    ...next,
    boundary_results: [
      ...next.boundary_results,
      `${String(payload.boundary_id)}:${event.stored.digest}`,
    ],
  };
}

function reduceReceipt(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as BoundaryReceiptPayload;
  return {
    ...next,
    receipts: [...next.receipts, `${payload.receipt_id}:${payload.result_event_digest}`],
  };
}

function reduceIntent(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as EffectIntentPayload;
  return {
    ...next,
    intents: [...next.intents, `${payload.effect_id}:${payload.input_digest}`],
  };
}

function reduceConfirmation(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as EffectConfirmationPayload;
  return {
    ...next,
    confirmations: [...next.confirmations, `${payload.effect_id}:${payload.output_digest}`],
  };
}

function reduceRecoveryStarted(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as EffectRecoveryStartedPayload;
  return {
    ...next,
    recovery_attempts: [...next.recovery_attempts, `${payload.recovery_id}:${payload.attempt}`],
  };
}

function reduceReconciled(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as EffectReconciledPayload;
  return {
    ...next,
    reconciliation_verdicts: [
      ...next.reconciliation_verdicts,
      `${payload.recovery_id}:${payload.verdict}:${payload.retry_decision}`,
    ],
  };
}

function reduceConflict(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as EffectConflictPayload;
  return {
    ...next,
    conflicts: [...next.conflicts, `${payload.conflict_id}:${payload.reason_code}`],
  };
}

function reduceOperatorResolution(
  state: Readonly<EvidenceControlProjection>,
  event: Readonly<EventReadResult>,
): EvidenceControlProjection {
  const next = appendOrdered(state, event);
  const payload = event.effective.envelope.payload as OperatorResolutionPayload;
  return {
    ...next,
    operator_resolutions: [
      ...next.operator_resolutions,
      `${payload.resolution_id}:${payload.resolution}`,
    ],
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC FACTORIES
// ───────────────────────────────────────────────────────────────────

/** Register deterministic reducers for every boundary and service event. */
export function createEvidenceControlReducerRegistry(
  boundaries: BoundaryRegistry = createBoundaryRegistry(),
): TypedReducerRegistry<EvidenceControlProjection> {
  const reducerVersion = EVIDENCE_CONTROL_REDUCER_VERSION;
  return new TypedReducerRegistry([
    ...boundaries.inspect().map((entry) => ({
      eventType: String(entry.result_event_type),
      reducerVersion,
      reduce: reduceBoundaryResult,
    })),
    { eventType: BOUNDARY_RECEIPT_EVENT_TYPE, reducerVersion, reduce: reduceReceipt },
    { eventType: EFFECT_INTENT_EVENT_TYPE, reducerVersion, reduce: reduceIntent },
    { eventType: EFFECT_CONFIRMATION_EVENT_TYPE, reducerVersion, reduce: reduceConfirmation },
    {
      eventType: EFFECT_RECOVERY_STARTED_EVENT_TYPE,
      reducerVersion,
      reduce: reduceRecoveryStarted,
    },
    { eventType: EFFECT_RECONCILED_EVENT_TYPE, reducerVersion, reduce: reduceReconciled },
    { eventType: EFFECT_CONFLICT_EVENT_TYPE, reducerVersion, reduce: reduceConflict },
    {
      eventType: EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
      reducerVersion,
      reduce: reduceOperatorResolution,
    },
  ]);
}

/** Create the exact component registry consumed by replay fingerprint derivation. */
export function createEvidenceControlReplayComponentRegistry(
  boundaries: BoundaryRegistry = createBoundaryRegistry(),
): ReplayComponentRegistry<EvidenceControlProjection> {
  return new ReplayComponentRegistry([{
    reducerId: EVIDENCE_CONTROL_REDUCER_ID,
    reducerVersion: EVIDENCE_CONTROL_REDUCER_VERSION,
    projectionSchemaVersion: EVIDENCE_CONTROL_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry: createEvidenceControlReducerRegistry(boundaries),
  }]);
}

/** Build caller values whose initial-state digest is independently recomputable. */
export function createEvidenceControlReplayInput(): ReplayExecutionInput<EvidenceControlProjection> {
  return Object.freeze({
    reducerId: EVIDENCE_CONTROL_REDUCER_ID,
    reducerVersion: EVIDENCE_CONTROL_REDUCER_VERSION,
    projectionSchemaVersion: EVIDENCE_CONTROL_PROJECTION_SCHEMA_VERSION,
    initialState: INITIAL_EVIDENCE_CONTROL_PROJECTION,
    replayInputDigests: Object.freeze({
      initial_state: sha256Bytes(canonicalBytes(INITIAL_EVIDENCE_CONTROL_PROJECTION)),
    }),
  });
}
