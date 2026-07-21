// ───────────────────────────────────────────────────────────────────
// MODULE: Cycle Health Events
// ───────────────────────────────────────────────────────────────────

import {
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import { immutableJsonClone } from '../event-envelope/canonical-json.js';
import {
  assertCycleDetectorPolicy,
  resolveCycleDetectorPolicy,
} from './cycle-detection-policy.js';
import {
  CycleDetectionError,
  CycleDetectionErrorCodes,
  CycleEvaluationStatuses,
  CycleProgressVerdicts,
  CycleSignatureKinds,
} from './cycle-detection-types.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
  PolicyEvaluationInput,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  CycleEvaluationResult,
  CycleHealthEventEnvelopeInput,
  CycleHealthEventPayload,
  CycleHealthRecordResult,
  CycleHealthState,
  CycleHealthWriteContext,
  CycleStoppingClockInput,
} from './cycle-detection-types.js';

export const CYCLE_SUSPECTED_EVENT_TYPE = 'deep-loop.cycle.suspected';
export const CYCLE_CONFIRMED_EVENT_TYPE = 'deep-loop.cycle.confirmed';
export const CYCLE_CLEARED_EVENT_TYPE = 'deep-loop.cycle.cleared';
export const CYCLE_HEALTH_EVENT_VERSION = 1;
export const CYCLE_HEALTH_SHADOW_MODE = 'cycle-detection-shadow';
export const CYCLE_HEALTH_CAPABILITY_ID = 'deep-loop.cycle-health.append';
export const CYCLE_HEALTH_POLICY_ID = 'deep-loop.cycle-health.shadow';
export const CYCLE_HEALTH_POLICY_VERSION = 1;

const CYCLE_HEALTH_EVALUATOR_VERSION = 'cycle-health-shadow-evaluator-v1';
const CYCLE_HEALTH_RULE_ID = 'cycle-health-shadow-evidence-only';
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const REQUIRED_FIELDS = [
  'health_event_id',
  'health_state',
  'run_lineage_id',
  'detector_policy_version',
  'detector_policy_digest',
  'signature_kind',
  'period',
  'occurrence_count',
  'start_cursor',
  'end_cursor',
  'start_iteration',
  'end_iteration',
  'progress_assessment',
  'source_fingerprints',
  'trace',
  'evidence_digest',
] as const;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function eventTypeFor(state: CycleHealthState): string {
  if (state === CycleEvaluationStatuses.CYCLE_SUSPECTED) return CYCLE_SUSPECTED_EVENT_TYPE;
  if (state === CycleEvaluationStatuses.CYCLE_CONFIRMED) return CYCLE_CONFIRMED_EVENT_TYPE;
  return CYCLE_CLEARED_EVENT_TYPE;
}

function evidenceCore(payload: Readonly<CycleHealthEventPayload>): JsonObject {
  return {
    detector_policy_version: payload.detector_policy_version,
    signature_kind: payload.signature_kind,
    period: payload.period,
    occurrence_count: payload.occurrence_count,
    start_iteration: payload.start_iteration,
    end_iteration: payload.end_iteration,
    start_cursor: payload.start_cursor,
    end_cursor: payload.end_cursor,
    source_fingerprints: payload.source_fingerprints,
    trace: payload.trace,
    progress_assessment: payload.progress_assessment,
  };
}

function healthIdentityCore(payload: Readonly<CycleHealthEventPayload>): JsonObject {
  return {
    run_lineage_id: payload.run_lineage_id,
    health_state: payload.health_state,
    detector_policy_version: payload.detector_policy_version,
    signature_kind: payload.signature_kind,
    period: payload.period,
    end_iteration: payload.end_iteration,
    end_cursor: payload.end_cursor,
    evidence_digest: payload.evidence_digest,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(value: Readonly<Record<string, unknown>>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function validCursor(value: unknown): value is {
  readonly ledger_id: string;
  readonly sequence: number;
  readonly record_hash: string;
} {
  return isRecord(value)
    && hasExactKeys(value, ['ledger_id', 'sequence', 'record_hash'])
    && typeof value.ledger_id === 'string'
    && value.ledger_id.trim() !== ''
    && Number.isSafeInteger(value.sequence)
    && (value.sequence as number) > 0
    && typeof value.record_hash === 'string'
    && HASH_PATTERN.test(value.record_hash);
}

function validTrace(payload: Readonly<CycleHealthEventPayload>): boolean {
  if (payload.trace.length === 0) return false;
  for (const [index, entry] of payload.trace.entries()) {
    if (
      !hasExactKeys(entry, ['iteration', 'ledger_cursor', 'fingerprint'])
      || !Number.isSafeInteger(entry.iteration)
      || entry.iteration <= 0
      || !validCursor(entry.ledger_cursor)
      || !HASH_PATTERN.test(entry.fingerprint)
      || (index > 0 && (
        entry.iteration <= payload.trace[index - 1].iteration
        || entry.ledger_cursor.ledger_id !== payload.trace[index - 1].ledger_cursor.ledger_id
        || entry.ledger_cursor.sequence <= payload.trace[index - 1].ledger_cursor.sequence
      ))
    ) {
      return false;
    }
  }
  const first = payload.trace[0];
  const last = payload.trace[payload.trace.length - 1];
  const traceFingerprints = [...new Set(payload.trace.map((entry) => entry.fingerprint))];
  return first.iteration === payload.start_iteration
    && last.iteration === payload.end_iteration
    && digest(first.ledger_cursor) === digest(payload.start_cursor)
    && digest(last.ledger_cursor) === digest(payload.end_cursor)
    && digest(traceFingerprints) === digest(payload.source_fingerprints);
}

function validProgressAssessment(value: unknown): boolean {
  if (
    !isRecord(value)
    || !hasExactKeys(value, [
      'gate_version',
      'verdict',
      'basis',
      'start_iteration',
      'end_iteration',
      'path_coverage_gain_bps',
      'community_coverage_gain_bps',
    ])
    || typeof value.gate_version !== 'string'
    || (
      value.verdict !== CycleProgressVerdicts.PROGRESS
      && value.verdict !== CycleProgressVerdicts.NO_PROGRESS
      && value.verdict !== CycleProgressVerdicts.NOT_EVALUABLE
    )
    || !Array.isArray(value.basis)
    || !value.basis.every((entry) => typeof entry === 'string' && entry.trim() !== '')
    || !Number.isSafeInteger(value.start_iteration)
    || !Number.isSafeInteger(value.end_iteration)
    || (value.start_iteration as number) <= 0
    || (value.end_iteration as number) < (value.start_iteration as number)
  ) {
    return false;
  }
  return [value.path_coverage_gain_bps, value.community_coverage_gain_bps].every(
    (gain) => gain === null || (Number.isSafeInteger(gain) && (gain as number) >= 0),
  );
}

function validHealthPayload(
  payload: Readonly<JsonObject>,
  expectedState: CycleHealthState,
): boolean {
  if (
    payload.health_state !== expectedState
    || typeof payload.health_event_id !== 'string'
    || typeof payload.run_lineage_id !== 'string'
    || typeof payload.detector_policy_version !== 'string'
    || typeof payload.detector_policy_digest !== 'string'
    || typeof payload.signature_kind !== 'string'
    || !Number.isSafeInteger(payload.period)
    || !Number.isSafeInteger(payload.occurrence_count)
    || !Number.isSafeInteger(payload.start_iteration)
    || !Number.isSafeInteger(payload.end_iteration)
    || !isRecord(payload.start_cursor)
    || !isRecord(payload.end_cursor)
    || !validProgressAssessment(payload.progress_assessment)
    || !Array.isArray(payload.source_fingerprints)
    || !Array.isArray(payload.trace)
    || typeof payload.evidence_digest !== 'string'
    || !HASH_PATTERN.test(payload.evidence_digest)
  ) {
    return false;
  }
  let policy;
  try {
    policy = assertCycleDetectorPolicy(
      payload.detector_policy_version,
      payload.detector_policy_digest,
    );
  } catch {
    return false;
  }
  const typed = payload as unknown as CycleHealthEventPayload;
  const expectedEvidenceDigest = digest(evidenceCore(typed));
  const expectedId = `cycle-health-${digest({
    ...healthIdentityCore(typed),
    evidence_digest: expectedEvidenceDigest,
  })}`;
  const validKind = typed.signature_kind === CycleSignatureKinds.FOCUS
    || typed.signature_kind === CycleSignatureKinds.CLAIM_FRONTIER
    || typed.signature_kind === CycleSignatureKinds.COMPOSITE_STATE;
  const validStateSemantics = expectedState === CycleEvaluationStatuses.CYCLE_CONFIRMED
    ? typed.signature_kind === CycleSignatureKinds.COMPOSITE_STATE
      && typed.period >= 1
      && typed.period <= policy.max_period
      && typed.occurrence_count === policy.minimum_traversals
      && typed.trace.length === typed.period * typed.occurrence_count
      && typed.progress_assessment.verdict === CycleProgressVerdicts.NO_PROGRESS
    : expectedState === CycleEvaluationStatuses.CYCLE_SUSPECTED
      ? typed.signature_kind !== CycleSignatureKinds.COMPOSITE_STATE
        && typed.period === 0
        && typed.occurrence_count === policy.occurrence_threshold
        && typed.trace.length === policy.occurrence_threshold
        && typed.progress_assessment.verdict === CycleProgressVerdicts.NO_PROGRESS
      : typed.progress_assessment.verdict === CycleProgressVerdicts.PROGRESS;
  return typed.evidence_digest === expectedEvidenceDigest
    && typed.health_event_id === expectedId
    && typed.run_lineage_id.trim() !== ''
    && typed.start_iteration > 0
    && typed.end_iteration >= typed.start_iteration
    && typed.occurrence_count > 0
    && typed.period >= 0
    && validCursor(typed.start_cursor)
    && validCursor(typed.end_cursor)
    && typed.start_cursor.ledger_id === typed.end_cursor.ledger_id
    && typed.start_cursor.sequence <= typed.end_cursor.sequence
    && typed.progress_assessment.gate_version === policy.progress_gate_version
    && validKind
    && validStateSemantics
    && validTrace(typed)
    && typed.source_fingerprints.every((value) => (
      typeof value === 'string' && HASH_PATTERN.test(value)
    ));
}

function eventDefinition(
  eventType: string,
  state: CycleHealthState,
): EventTypeDefinition {
  return {
    eventType,
    currentVersion: CYCLE_HEALTH_EVENT_VERSION,
    versions: [{
      version: CYCLE_HEALTH_EVENT_VERSION,
      payload: {
        requiredFields: [...REQUIRED_FIELDS],
        validate: (payload) => validHealthPayload(payload, state),
      },
    }],
    upcasters: [],
  };
}

function receiptFor(event: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...event.frame.receipt,
    canonicalEventHash: event.frame.canonical_event_hash,
    recordHash: event.frame.record_hash,
    authorizationRef: event.frame.authorization_ref,
  });
}

function payloadDigest(event: VerifiedLedgerEvent): string {
  return digest(event.event.effective.envelope.payload);
}

async function existingEvent(
  ledger: AppendOnlyLedger,
  eventId: string,
): Promise<VerifiedLedgerEvent | null> {
  const matches = (await ledger.readVerifiedEvents()).filter(
    (entry) => entry.event.effective.envelope.event_id === eventId,
  );
  if (matches.length > 1) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.EVENT_CONFLICT,
      'Cycle health identity resolves to multiple ledger events',
      { eventId },
    );
  }
  return matches[0] ?? null;
}

function eventConflict(eventId: string): CycleDetectionError {
  return new CycleDetectionError(
    CycleDetectionErrorCodes.EVENT_CONFLICT,
    'Cycle health identity is already bound to different canonical evidence',
    { eventId },
  );
}

/** Return the closed versioned health-event definitions. */
export function cycleHealthEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    eventDefinition(CYCLE_SUSPECTED_EVENT_TYPE, CycleEvaluationStatuses.CYCLE_SUSPECTED),
    eventDefinition(CYCLE_CONFIRMED_EVENT_TYPE, CycleEvaluationStatuses.CYCLE_CONFIRMED),
    eventDefinition(CYCLE_CLEARED_EVENT_TYPE, CycleEvaluationStatuses.CYCLE_CLEARED),
  ]);
}

/** Create a registry that rejects unknown health event types and versions. */
export function createCycleHealthEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(cycleHealthEventDefinitions());
}

/** Register a policy that permits health evidence only while legacy authority remains active. */
export function createCycleHealthPolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: CYCLE_HEALTH_POLICY_ID,
    policyVersion: CYCLE_HEALTH_POLICY_VERSION,
    evaluatorVersion: CYCLE_HEALTH_EVALUATOR_VERSION,
    ruleIds: [CYCLE_HEALTH_RULE_ID],
    evaluate: (input: Readonly<PolicyEvaluationInput>) => {
      const allowed = input.mode === CYCLE_HEALTH_SHADOW_MODE
        && input.capabilityId === CYCLE_HEALTH_CAPABILITY_ID
        && (
          input.authorityState === 'legacy_authoritative'
          || input.authorityState === 'shadowing'
        )
        && (
          input.requestedEventType === CYCLE_SUSPECTED_EVENT_TYPE
          || input.requestedEventType === CYCLE_CONFIRMED_EVENT_TYPE
          || input.requestedEventType === CYCLE_CLEARED_EVENT_TYPE
        );
      return allowed
        ? {
            verdict: AuthorizationVerdicts.ALLOW,
            reasonCode: AuthorizationReasonCodes.ALLOWED,
            matchedRuleIds: [CYCLE_HEALTH_RULE_ID],
          }
        : {
            verdict: AuthorizationVerdicts.DENY,
            reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
            matchedRuleIds: [],
          };
    },
  }]);
}

/** Derive the exact policy reference and capability required by the shadow writer. */
export function cycleHealthWriteContext(
  payload: Readonly<CycleHealthEventPayload>,
  policies: TransitionPolicyRegistry,
  actorId: string,
): CycleHealthWriteContext {
  const policy = policies.resolve(CYCLE_HEALTH_POLICY_ID, CYCLE_HEALTH_POLICY_VERSION);
  return Object.freeze({
    mode: CYCLE_HEALTH_SHADOW_MODE,
    actorId,
    capabilityId: CYCLE_HEALTH_CAPABILITY_ID,
    evidenceDigest: payload.evidence_digest,
    policy: Object.freeze({
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    }),
  });
}

/** Turn a detector classification into immutable typed health evidence. */
export function createCycleHealthEventPayload(
  evaluation: CycleEvaluationResult,
  runLineageId: string,
): CycleHealthEventPayload {
  if (
    evaluation.status !== CycleEvaluationStatuses.CYCLE_SUSPECTED
    && evaluation.status !== CycleEvaluationStatuses.CYCLE_CONFIRMED
    && evaluation.status !== CycleEvaluationStatuses.CYCLE_CLEARED
  ) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Only a typed cycle health transition can produce a health event',
      { evaluationStatus: evaluation.status },
    );
  }
  if (typeof runLineageId !== 'string' || runLineageId.trim() === '') {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Cycle health events require a stable run lineage identity',
    );
  }
  if (evaluation.evidence.run_lineage_id !== runLineageId) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.INVALID_INPUT,
      'Cycle health event run lineage does not match its detector evidence',
      {
        evidenceRunLineageId: evaluation.evidence.run_lineage_id,
        requestedRunLineageId: runLineageId,
      },
    );
  }
  if (evaluation.evidence.detector_policy_version !== evaluation.detectorPolicyVersion) {
    throw new CycleDetectionError(
      CycleDetectionErrorCodes.UNSUPPORTED_VERSION,
      'Cycle evaluation evidence and result use different detector policies',
    );
  }
  const policy = resolveCycleDetectorPolicy(evaluation.detectorPolicyVersion);
  const core = {
    health_state: evaluation.status,
    run_lineage_id: runLineageId,
    detector_policy_version: policy.policy_version,
    detector_policy_digest: policy.policy_digest,
    signature_kind: evaluation.evidence.signature_kind,
    period: evaluation.evidence.period,
    occurrence_count: evaluation.evidence.occurrence_count,
    start_cursor: evaluation.evidence.start_cursor,
    end_cursor: evaluation.evidence.end_cursor,
    start_iteration: evaluation.evidence.start_iteration,
    end_iteration: evaluation.evidence.end_iteration,
    progress_assessment: evaluation.evidence.progress_assessment,
    source_fingerprints: evaluation.evidence.source_fingerprints,
    trace: evaluation.evidence.trace,
  };
  const evidenceDigest = digest(evidenceCore({
    ...core,
    health_event_id: '',
    evidence_digest: '',
  } as CycleHealthEventPayload));
  const identity = {
    ...core,
    health_event_id: '',
    evidence_digest: evidenceDigest,
  } as CycleHealthEventPayload;
  return immutableJsonClone({
    ...core,
    evidence_digest: evidenceDigest,
    health_event_id: `cycle-health-${digest(healthIdentityCore(identity))}`,
  } as CycleHealthEventPayload);
}

/** Prepare current-version canonical bytes for one health event. */
export function prepareCycleHealthEvent(
  payload: Readonly<CycleHealthEventPayload>,
  input: CycleHealthEventEnvelopeInput,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: payload.health_event_id,
    event_type: eventTypeFor(payload.health_state),
    event_version: CYCLE_HEALTH_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: payload.health_event_id,
    payload,
  }, registry);
}

/** Append once, accept exact retries, and reject semantic identity conflicts. */
export async function recordCycleHealthEvent(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<CycleHealthRecordResult> {
  const eventId = event.envelope.event_id;
  const semanticDigest = digest(event.envelope.payload);
  const existing = await existingEvent(ledger, eventId);
  if (existing !== null) {
    if (
      existing.event.effective.envelope.event_type !== event.envelope.event_type
      || payloadDigest(existing) !== semanticDigest
    ) {
      throw eventConflict(eventId);
    }
    return Object.freeze({ status: 'idempotent', receipt: receiptFor(existing) });
  }
  try {
    const receipt = await ledger.appendAuthorized(event, proof);
    return Object.freeze({ status: 'appended', receipt });
  } catch (error: unknown) {
    if (
      !(error instanceof AuthorizedLedgerError)
      || error.code !== AuthorizedLedgerErrorCodes.EVENT_ID_CONFLICT
    ) {
      throw error;
    }
    const concurrent = await existingEvent(ledger, eventId);
    if (
      concurrent === null
      || concurrent.event.effective.envelope.event_type !== event.envelope.event_type
      || payloadDigest(concurrent) !== semanticDigest
    ) {
      throw eventConflict(eventId);
    }
    return Object.freeze({ status: 'idempotent', receipt: receiptFor(concurrent) });
  }
}

/** Convert health state into sibling-clock evidence without representing stop authority. */
export function cycleStoppingClockInput(
  payload: Readonly<CycleHealthEventPayload>,
): CycleStoppingClockInput {
  const confirmed = payload.health_state === CycleEvaluationStatuses.CYCLE_CONFIRMED;
  return immutableJsonClone({
    source: 'cycle_detection',
    authority: 'evidence_only',
    health_event_id: payload.health_event_id,
    health_state: payload.health_state,
    evidence_digest: payload.evidence_digest,
    contributes_to_stopping_clock: confirmed,
    severity_bps: confirmed
      ? 10_000
      : payload.health_state === CycleEvaluationStatuses.CYCLE_SUSPECTED
        ? 5_000
        : 0,
    stop_decision: null,
  });
}
