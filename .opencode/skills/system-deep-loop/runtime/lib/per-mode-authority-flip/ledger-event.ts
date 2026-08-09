// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Authority-Transition Ledger Event
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedThroughFence } from '../locks-and-fencing/fenced-ledger-writer.js';
import {
  canonicalBytes,
  EventTypeRegistry,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import { ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS, ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS } from '../cutover-certificate/index.js';
import { AUTHORITY_FLIP_EVENT_TYPE, AUTHORITY_FLIP_SCHEMA_VERSION } from './types.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
} from '../authorized-ledger/index.js';
import type {
  CutoverCertificate,
} from '../cutover-certificate/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type { AuthorityTransitionEvent, AuthorityTransitionFacts, CutoverCertificateMode } from './types.js';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

export interface AuthorityTransitionFactsInput {
  readonly mode: CutoverCertificateMode;
  readonly fromAuthorityEpoch: number;
  readonly candidateSha: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly policyDigest: string;
  readonly certificate: CutoverCertificate;
  readonly classificationManifestDigest: string;
  readonly migrationHandoffDigest: string;
  readonly rollbackAssetSetDigest: string;
  readonly actorId: string;
  readonly requestDigest: string;
  readonly decidedAt: string;
}

/**
 * Bind exactly one mode's forward-flip identities into one immutable fact
 * set. Every reference is a digest already independently verified by an
 * upstream module (the cutover certificate, its own evidence bindings, the
 * migration handoff, and the rollback asset set); this function never
 * re-derives any of them.
 */
export function buildAuthorityTransitionFacts(
  input: AuthorityTransitionFactsInput,
): AuthorityTransitionFacts {
  const toAuthorityEpoch = input.fromAuthorityEpoch + 1;
  const core = Object.freeze({
    schemaVersion: AUTHORITY_FLIP_SCHEMA_VERSION,
    eventKind: 'authority-transition-flip' as const,
    mode: input.mode,
    fromAuthorityState: 'cutover_ready' as const,
    toAuthorityState: 'new_authoritative_reversible' as const,
    fromAuthorityEpoch: input.fromAuthorityEpoch,
    toAuthorityEpoch,
    candidateSha: input.candidateSha,
    policyId: input.policyId,
    policyVersion: input.policyVersion,
    policyDigest: input.policyDigest,
    cutoverCertificateDigest: input.certificate.certificateDigest,
    modeGateCertificateDigest: input.certificate.facts.evidence.modeGateCertificateDigest,
    rollbackDrillCertificateDigest: input.certificate.facts.evidence.rollbackDrillCertificateDigest,
    shadowParityEvidenceDigest: input.certificate.facts.evidence.shadowParityEvidenceDigest,
    classificationManifestDigest: input.classificationManifestDigest,
    migrationHandoffDigest: input.migrationHandoffDigest,
    rollbackAssetSetDigest: input.rollbackAssetSetDigest,
    rollbackWindowMinimumCalendarDays: ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS,
    rollbackWindowMinimumSuccessfulExecutions: ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS,
    actorId: input.actorId,
    requestDigest: input.requestDigest,
    decidedAt: input.decidedAt,
  });
  return Object.freeze({ ...core, transitionDigest: digest(core) });
}

/** Bind the exact facts into the one immutable event this module ever writes. */
export function buildAuthorityTransitionEvent(
  facts: AuthorityTransitionFacts,
): AuthorityTransitionEvent {
  return Object.freeze({ facts, eventDigest: digest(facts) });
}

function isAuthorityTransitionPayload(payload: Readonly<JsonObject>): boolean {
  const facts = payload.transitionFacts;
  return typeof facts === 'object'
    && facts !== null
    && !Array.isArray(facts)
    && (facts as JsonObject).schemaVersion === AUTHORITY_FLIP_SCHEMA_VERSION
    && (facts as JsonObject).eventKind === 'authority-transition-flip'
    && typeof (facts as JsonObject).mode === 'string'
    && typeof (facts as JsonObject).transitionDigest === 'string';
}

/** Register the one event type this authority transition is written as. */
export function createAuthorityTransitionEventRegistry(): EventTypeRegistry {
  const definition: EventTypeDefinition = {
    eventType: AUTHORITY_FLIP_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['transitionFacts'],
        validate: isAuthorityTransitionPayload,
      },
    }],
    upcasters: [],
  };
  return new EventTypeRegistry([definition]);
}

export interface AuthorityTransitionEnvelopeFields {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

/** Build the write-preflight for one authority-transition event, current version only. */
export function prepareAuthorityTransitionEventWrite(
  event: AuthorityTransitionEvent,
  envelope: Readonly<AuthorityTransitionEnvelopeFields>,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: 1,
    event_id: envelope.eventId,
    event_type: AUTHORITY_FLIP_EVENT_TYPE,
    event_version: 1,
    stream_id: envelope.streamId,
    stream_sequence: envelope.streamSequence,
    occurred_at: envelope.occurredAt,
    recorded_at: envelope.recordedAt,
    producer: envelope.producer,
    authority_epoch: event.facts.fromAuthorityEpoch,
    correlation_id: envelope.correlationId,
    causation_id: envelope.causationId,
    idempotency_key: envelope.idempotencyKey,
    payload: { transitionFacts: event.facts },
  }, registry);
}

/**
 * Append exactly one authority-transition event through the existing
 * fenced, gateway-authorized append seam. A caller-supplied preflight for a
 * different event type is refused before the fence is even acquired.
 */
export async function appendAuthorityTransitionEvent(
  ledger: AppendOnlyLedger,
  preparedEvent: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  if (preparedEvent.identity.eventType !== AUTHORITY_FLIP_EVENT_TYPE) {
    throw new TypeError('Authority transition append received an event of a different type');
  }
  return appendAuthorizedThroughFence(ledger, preparedEvent, proof);
}
