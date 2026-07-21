// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clock Ledger Events
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
import { validateLoopTerminationDeclared } from './stopping-clock-arbiter.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
  PolicyEvaluationInput,
  PolicyReference,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
} from '../event-envelope/index.js';
import type { LoopTerminationDeclared } from './stopping-clock-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────────

export const LOOP_TERMINATION_DECLARED_EVENT_TYPE = 'deep-loop.termination.declared';
export const LOOP_TERMINATION_DECLARED_EVENT_VERSION = 1;
export const STOPPING_CLOCK_SHADOW_MODE = 'stopping-clocks-shadow';
export const STOPPING_CLOCK_CAPABILITY_ID = 'deep-loop.stopping-clocks.append';
export const STOPPING_CLOCK_POLICY_ID = 'deep-loop.stopping-clocks.shadow';
export const STOPPING_CLOCK_POLICY_VERSION = 1;

const STOPPING_CLOCK_EVALUATOR_VERSION = 'stopping-clocks-shadow-evaluator-v1';
const STOPPING_CLOCK_RULE_ID = 'stopping-clocks-shadow-evidence-only';

/** Envelope metadata for the canonical terminal event write. */
export interface LoopTerminationEventEnvelopeInput {
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
}

/** Durable append outcome, including byte-identical idempotent retries. */
export interface LoopTerminationEventRecordResult {
  readonly status: 'appended' | 'idempotent';
  readonly receipt: DurableAppendReceipt;
}

/** Authorization inputs pinned to the additive-dark transition policy. */
export interface StoppingClockWriteContext {
  readonly mode: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly evidenceDigest: string;
  readonly policy: PolicyReference;
}

export const loopTerminationDeclaredEventDefinition: EventTypeDefinition = {
  eventType: LOOP_TERMINATION_DECLARED_EVENT_TYPE,
  currentVersion: LOOP_TERMINATION_DECLARED_EVENT_VERSION,
  versions: [{
    version: LOOP_TERMINATION_DECLARED_EVENT_VERSION,
    payload: {
      requiredFields: [
        'schema_version',
        'run_lineage_id',
        'mode',
        'profile_version',
        'authority',
        'tie_rank_version',
        'primary_cause',
        'co_firing_causes',
        'termination_class',
        'observations',
        'comparator_trace',
        'authorized_ledger_head',
        'projection_watermark',
        'replay_fingerprint',
        'final_coverage_gaps',
        'unresolved_blockers',
        'last_authorized_work',
        'in_flight_evidence',
        'admission',
        'termination_event_id',
        'termination_event_hash',
      ],
      validate: validateLoopTerminationDeclared,
    },
  }],
  upcasters: [],
};

/** Create the closed event registry accepted by the stopping-clock writer. */
export function createStoppingClockEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([loopTerminationDeclaredEventDefinition]);
}

/** Permit shadow termination evidence only while the legacy path owns authority. */
export function createStoppingClockPolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: STOPPING_CLOCK_POLICY_ID,
    policyVersion: STOPPING_CLOCK_POLICY_VERSION,
    evaluatorVersion: STOPPING_CLOCK_EVALUATOR_VERSION,
    ruleIds: [STOPPING_CLOCK_RULE_ID],
    evaluate: (input: Readonly<PolicyEvaluationInput>) => {
      const allowed = input.mode === STOPPING_CLOCK_SHADOW_MODE
        && input.capabilityId === STOPPING_CLOCK_CAPABILITY_ID
        && (
          input.authorityState === 'legacy_authoritative'
          || input.authorityState === 'shadowing'
        )
        && input.requestedEventType === LOOP_TERMINATION_DECLARED_EVENT_TYPE;
      return allowed
        ? {
            verdict: AuthorizationVerdicts.ALLOW,
            reasonCode: AuthorizationReasonCodes.ALLOWED,
            matchedRuleIds: [STOPPING_CLOCK_RULE_ID],
          }
        : {
            verdict: AuthorizationVerdicts.DENY,
            reasonCode: AuthorizationReasonCodes.POLICY_DENIED,
            matchedRuleIds: [],
          };
    },
  }]);
}

/** Derive the exact shadow policy reference and evidence digest for authorization. */
export function stoppingClockWriteContext(
  payload: Readonly<LoopTerminationDeclared>,
  policies: TransitionPolicyRegistry,
  actorId: string,
): StoppingClockWriteContext {
  const policy = policies.resolve(STOPPING_CLOCK_POLICY_ID, STOPPING_CLOCK_POLICY_VERSION);
  return Object.freeze({
    mode: STOPPING_CLOCK_SHADOW_MODE,
    actorId,
    capabilityId: STOPPING_CLOCK_CAPABILITY_ID,
    evidenceDigest: payload.termination_event_hash,
    policy: Object.freeze({
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. PREPARE AND RECORD
// ───────────────────────────────────────────────────────────────────

/** Prepare canonical event bytes for authorization and durable append. */
export function prepareLoopTerminationDeclaredEvent(
  payload: LoopTerminationDeclared,
  input: LoopTerminationEventEnvelopeInput,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: payload.termination_event_id,
    event_type: LOOP_TERMINATION_DECLARED_EVENT_TYPE,
    event_version: LOOP_TERMINATION_DECLARED_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: payload.termination_event_id,
    payload,
  }, registry);
}

function payloadDigest(event: VerifiedLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event.event.effective.envelope.payload));
}

function receiptFor(event: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...event.frame.receipt,
    canonicalEventHash: event.frame.canonical_event_hash,
    recordHash: event.frame.record_hash,
    authorizationRef: event.frame.authorization_ref,
  });
}

async function existingEvent(
  ledger: AppendOnlyLedger,
  eventId: string,
): Promise<VerifiedLedgerEvent | null> {
  return (await ledger.readVerifiedEvents()).find((entry) => (
    entry.event.effective.envelope.event_id === eventId
  )) ?? null;
}

/** Append once, accept byte-identical retries, and reject terminal identity conflicts. */
export async function recordLoopTerminationDeclaredEvent(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<LoopTerminationEventRecordResult> {
  const eventId = event.envelope.event_id;
  const semanticDigest = sha256Bytes(canonicalBytes(event.envelope.payload));
  const existing = await existingEvent(ledger, eventId);
  if (existing !== null) {
    if (
      existing.event.effective.envelope.event_type !== LOOP_TERMINATION_DECLARED_EVENT_TYPE
      || payloadDigest(existing) !== semanticDigest
    ) {
      throw new TypeError('Loop termination identity is bound to conflicting payload bytes');
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
      || concurrent.event.effective.envelope.event_type !== LOOP_TERMINATION_DECLARED_EVENT_TYPE
      || payloadDigest(concurrent) !== semanticDigest
    ) {
      throw new TypeError('Loop termination identity is bound to conflicting payload bytes');
    }
    return Object.freeze({ status: 'idempotent', receipt: receiptFor(concurrent) });
  }
}
