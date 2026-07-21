// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Artifact Ledger Events
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  prepareEventWrite,
} from '../event-envelope/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';
import { parseSealedArtifactReference } from './sealed-artifact-store.js';

import type {
  AuthorizationDecisionRecord,
  DurableAppendReceipt,
  LedgerHead,
  PolicyReference,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type { SealedArtifactStore } from './sealed-artifact-store.js';
import type {
  SealedArtifactReference,
  VerifiedSealedArtifact,
} from './sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT TYPES
// ───────────────────────────────────────────────────────────────────

export const ARTIFACT_SEALED_EVENT_TYPE = 'deep-loop.artifact.sealed';
export const ARTIFACT_LIFECYCLE_EVENT_TYPE = 'deep-loop.artifact.lifecycle-recorded';

export const ArtifactLifecycleActions = Object.freeze({
  REFERENCE_ADDED: 'reference-added',
  REFERENCE_RELEASED: 'reference-released',
  HOLD_PLACED: 'hold-placed',
  HOLD_RELEASED: 'hold-released',
  RETENTION_SET: 'retention-set',
  QUARANTINED: 'quarantined',
  DELETION_ELIGIBLE: 'deletion-eligible',
  DELETION_AUTHORIZED: 'deletion-authorized',
  RESTORATION_AUTHORIZED: 'restoration-authorized',
} as const);

/** Append-only lifecycle transitions that never rewrite artifact identity. */
export type ArtifactLifecycleAction =
  typeof ArtifactLifecycleActions[keyof typeof ArtifactLifecycleActions];

export const ArtifactRetentionRootTypes = Object.freeze({
  LIVE_RUN: 'live-run',
  REPLAY_ATTESTATION: 'replay-attestation',
  RECEIPT_CERTIFICATE: 'receipt-certificate',
  ROLLBACK_WINDOW: 'rollback-window',
  ARCHIVAL_READER: 'archival-reader',
  EXPLICIT_HOLD: 'explicit-hold',
} as const);

/** Protected-root classes that conservatively retain sealed inputs. */
export type ArtifactRetentionRootType =
  typeof ArtifactRetentionRootTypes[keyof typeof ArtifactRetentionRootTypes];

const SEALED_EVENT_FIELDS = new Set([
  'reference',
  'descriptor_digest',
  'sealed_at',
  'retention_class',
]);

const LIFECYCLE_EVENT_FIELDS = new Set([
  'reference',
  'action',
  'root_type',
  'root_id',
  'retention_until',
  'reason_digest',
]);

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. PUBLIC TYPES
// ───────────────────────────────────────────────────────────────────

/** Stable envelope metadata supplied by the dark runtime caller. */
export interface ArtifactEventMetadata {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

/** Gateway request fields supplied without replacing event or prior-head identity. */
export interface ArtifactAuthorizationContext {
  readonly requestId: string;
  readonly mode: string;
  readonly priorStateVersion: string;
  readonly priorStateFingerprint: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly authorityEpoch: number;
  readonly policy: PolicyReference;
  readonly evidenceDigest: string;
}

/** Existing authorized-ledger services required for every durable artifact event. */
export interface ArtifactEventRecorder {
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly authorizationContext: (
    event: EventWritePreflight,
    priorHead: LedgerHead,
  ) => ArtifactAuthorizationContext | Promise<ArtifactAuthorizationContext>;
}

/** Durable domain receipt and gateway decision for one artifact event. */
export interface ArtifactEventWriteResult {
  readonly receipt: DurableAppendReceipt;
  readonly event: EventWritePreflight;
  readonly decision: AuthorizationDecisionRecord;
}

/** Closed creation payload that binds a seal to its descriptor commitment. */
export interface ArtifactSealedPayload extends JsonObject {
  readonly reference: SealedArtifactReference;
  readonly descriptor_digest: string;
  readonly sealed_at: string;
  readonly retention_class: string;
}

/** Closed lifecycle payload used for roots, holds, retention, and recovery. */
export interface ArtifactLifecyclePayload extends JsonObject {
  readonly reference: SealedArtifactReference;
  readonly action: ArtifactLifecycleAction;
  readonly root_type: ArtifactRetentionRootType | null;
  readonly root_id: string | null;
  readonly retention_until: string | null;
  readonly reason_digest: string;
}

/** Caller-facing lifecycle transition before exact event preparation. */
export interface ArtifactLifecycleInput {
  readonly action: ArtifactLifecycleAction;
  readonly rootType?: ArtifactRetentionRootType | null;
  readonly rootId?: string | null;
  readonly retentionUntil?: string | null;
  readonly reasonDigest: string;
}

/** Store bytes paired with verified ledger creation evidence. */
export interface VerifiedArtifactEvidence {
  readonly artifact: VerifiedSealedArtifact;
  readonly sealedEvent: VerifiedLedgerEvent;
  readonly receipt: DurableAppendReceipt;
}

// ───────────────────────────────────────────────────────────────────
// 3. PAYLOAD VALIDATION
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactFields(value: Record<string, unknown>, fields: ReadonlySet<string>): boolean {
  const keys = Object.keys(value);
  return keys.length === fields.size && keys.every((key) => fields.has(key));
}

function isBoundedString(value: unknown, maxLength = 1_024): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function isUtcTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !value.endsWith('Z')) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function validateSealedPayload(payload: Readonly<JsonObject>): boolean {
  if (!isRecord(payload) || !hasExactFields(payload, SEALED_EVENT_FIELDS)) return false;
  try {
    const reference = parseSealedArtifactReference(payload.reference);
    return payload.descriptor_digest === reference.descriptor_digest
      && isUtcTimestamp(payload.sealed_at)
      && isBoundedString(payload.retention_class, 128);
  } catch {
    return false;
  }
}

function isLifecycleAction(value: unknown): value is ArtifactLifecycleAction {
  return typeof value === 'string'
    && (Object.values(ArtifactLifecycleActions) as string[]).includes(value);
}

function isRootType(value: unknown): value is ArtifactRetentionRootType {
  return typeof value === 'string'
    && (Object.values(ArtifactRetentionRootTypes) as string[]).includes(value);
}

function hasValidLifecycleShape(payload: Readonly<JsonObject>): boolean {
  if (!isRecord(payload) || !hasExactFields(payload, LIFECYCLE_EVENT_FIELDS)) return false;
  try {
    parseSealedArtifactReference(payload.reference);
  } catch {
    return false;
  }
  if (!isLifecycleAction(payload.action) || !DIGEST_PATTERN.test(String(payload.reason_digest))) {
    return false;
  }
  const rootType = payload.root_type;
  const rootId = payload.root_id;
  const retentionUntil = payload.retention_until;
  if (rootType !== null && !isRootType(rootType)) return false;
  if (rootId !== null && !isBoundedString(rootId)) return false;
  if (retentionUntil !== null && !isUtcTimestamp(retentionUntil)) return false;

  switch (payload.action) {
    case ArtifactLifecycleActions.REFERENCE_ADDED:
    case ArtifactLifecycleActions.REFERENCE_RELEASED:
      return rootType !== null
        && rootType !== ArtifactRetentionRootTypes.EXPLICIT_HOLD
        && rootId !== null
        && retentionUntil === null;
    case ArtifactLifecycleActions.HOLD_PLACED:
    case ArtifactLifecycleActions.HOLD_RELEASED:
      return rootType === ArtifactRetentionRootTypes.EXPLICIT_HOLD
        && rootId !== null
        && retentionUntil === null;
    case ArtifactLifecycleActions.RETENTION_SET:
      return rootType === null && rootId === null && retentionUntil !== null;
    default:
      return rootType === null && rootId === null && retentionUntil === null;
  }
}

/** Return event definitions callers add to their existing validator-bound registry. */
export function sealedArtifactEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    {
      eventType: ARTIFACT_SEALED_EVENT_TYPE,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: Array.from(SEALED_EVENT_FIELDS),
          validate: validateSealedPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: ARTIFACT_LIFECYCLE_EVENT_TYPE,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: Array.from(LIFECYCLE_EVENT_FIELDS),
          validate: hasValidLifecycleShape,
        },
      }],
      upcasters: [],
    },
  ]);
}

/** Parse a verified creation event payload into the closed typed contract. */
export function parseArtifactSealedPayload(input: unknown): ArtifactSealedPayload {
  if (!isRecord(input) || !validateSealedPayload(input as JsonObject)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Verified sealed-artifact event has an invalid payload contract',
    );
  }
  const reference = parseSealedArtifactReference(input.reference);
  return Object.freeze({
    reference,
    descriptor_digest: reference.descriptor_digest,
    sealed_at: input.sealed_at as string,
    retention_class: input.retention_class as string,
  });
}

/** Parse one verified append-only lifecycle payload. */
export function parseArtifactLifecyclePayload(input: unknown): ArtifactLifecyclePayload {
  if (!isRecord(input) || !hasValidLifecycleShape(input as JsonObject)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Verified artifact lifecycle event has an invalid payload contract',
    );
  }
  return Object.freeze({
    reference: parseSealedArtifactReference(input.reference),
    action: input.action as ArtifactLifecycleAction,
    root_type: input.root_type as ArtifactRetentionRootType | null,
    root_id: input.root_id as string | null,
    retention_until: input.retention_until as string | null,
    reason_digest: input.reason_digest as string,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. EVENT PREPARATION AND RECORDING
// ───────────────────────────────────────────────────────────────────

function prepareArtifactEvent(
  eventType: string,
  payload: JsonObject,
  registry: EventTypeRegistry,
  metadata: ArtifactEventMetadata,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: metadata.eventId,
    event_type: eventType,
    event_version: 1,
    stream_id: metadata.streamId,
    stream_sequence: metadata.streamSequence,
    occurred_at: metadata.occurredAt,
    recorded_at: metadata.recordedAt,
    producer: metadata.producer,
    authority_epoch: metadata.authorityEpoch,
    correlation_id: metadata.correlationId,
    causation_id: metadata.causationId,
    idempotency_key: metadata.idempotencyKey,
    payload,
  }, registry);
}

/** Prepare immutable creation evidence after the store has verified publication. */
export function prepareArtifactSealedEvent(
  artifact: VerifiedSealedArtifact,
  registry: EventTypeRegistry,
  metadata: ArtifactEventMetadata,
  retentionClass: string,
): EventWritePreflight {
  if (!isBoundedString(retentionClass, 128)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'evidence',
      'Artifact retention class must be a bounded identity',
    );
  }
  const payload: ArtifactSealedPayload = Object.freeze({
    reference: artifact.reference,
    descriptor_digest: artifact.reference.descriptor_digest,
    sealed_at: metadata.recordedAt,
    retention_class: retentionClass,
  });
  return prepareArtifactEvent(
    ARTIFACT_SEALED_EVENT_TYPE,
    payload,
    registry,
    metadata,
  );
}

/** Prepare one append-only lifecycle transition without mutating sealed identity. */
export function prepareArtifactLifecycleEvent(
  referenceInput: unknown,
  registry: EventTypeRegistry,
  metadata: ArtifactEventMetadata,
  input: ArtifactLifecycleInput,
): EventWritePreflight {
  const payload: ArtifactLifecyclePayload = Object.freeze({
    reference: parseSealedArtifactReference(referenceInput),
    action: input.action,
    root_type: input.rootType ?? null,
    root_id: input.rootId ?? null,
    retention_until: input.retentionUntil ?? null,
    reason_digest: input.reasonDigest,
  });
  if (!hasValidLifecycleShape(payload)) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.INVALID_INPUT,
      'evidence',
      'Artifact lifecycle transition violates the closed action contract',
      { action: input.action },
    );
  }
  return prepareArtifactEvent(
    ARTIFACT_LIFECYCLE_EVENT_TYPE,
    payload,
    registry,
    metadata,
  );
}

/** Authorize through the gateway and append with its exact single-use allow proof. */
export async function recordArtifactEvent(
  recorder: ArtifactEventRecorder,
  event: EventWritePreflight,
): Promise<ArtifactEventWriteResult> {
  const priorHead = await recorder.ledger.getVerifiedHead();
  const context = await recorder.authorizationContext(event, priorHead);
  const request: TransitionAuthorizationRequest = Object.freeze({
    requestId: context.requestId,
    mode: context.mode,
    event,
    priorHead,
    priorStateVersion: context.priorStateVersion,
    priorStateFingerprint: context.priorStateFingerprint,
    actorId: context.actorId,
    capabilityId: context.capabilityId,
    authorityEpoch: context.authorityEpoch,
    policy: context.policy,
    evidenceDigest: context.evidenceDigest,
  });
  const authorization = await recorder.gateway.authorize(request);
  if (authorization.verdict !== 'allow') {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.LEDGER_AUTHORIZATION_DENIED,
      'ledger',
      'Artifact evidence was denied by the transition authorization gateway',
      { reasonCode: authorization.reasonCode },
    );
  }
  const receipt = await recorder.ledger.appendAuthorized(event, authorization.proof);
  return Object.freeze({ receipt, event, decision: authorization.decision });
}

function receiptFromVerified(event: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...event.frame.receipt,
    canonicalEventHash: event.frame.canonical_event_hash,
    recordHash: event.frame.record_hash,
    authorizationRef: event.frame.authorization_ref,
  });
}

/** Resolve creation evidence through typed ledger reads before releasing store bytes. */
export async function readVerifiedArtifactEvidence(
  ledger: AppendOnlyLedger,
  store: SealedArtifactStore,
  referenceInput: unknown,
  expectedArtifactKind?: string,
): Promise<VerifiedArtifactEvidence> {
  const reference = parseSealedArtifactReference(referenceInput);
  const events = await ledger.readVerifiedEvents();
  const matches = events.filter((event) => {
    if (event.event.effective.envelope.event_type !== ARTIFACT_SEALED_EVENT_TYPE) return false;
    const payload = parseArtifactSealedPayload(event.event.effective.envelope.payload);
    return payload.reference.qualified_digest === reference.qualified_digest;
  });
  if (matches.length === 0) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_MISSING,
      'evidence',
      'Artifact has no verified creation event in the authorized ledger',
      { qualifiedDigest: reference.qualified_digest },
    );
  }
  const first = matches[0];
  if (!first) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_MISSING,
      'evidence',
      'Artifact creation evidence could not be resolved',
    );
  }
  for (const match of matches) {
    const payload = parseArtifactSealedPayload(match.event.effective.envelope.payload);
    if (
      payload.descriptor_digest !== reference.descriptor_digest
      || payload.reference.qualified_digest !== reference.qualified_digest
    ) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'evidence',
        'Authorized ledger contains conflicting artifact creation evidence',
        { qualifiedDigest: reference.qualified_digest },
      );
    }
  }
  const artifact = await store.readVerified(reference, expectedArtifactKind);
  return Object.freeze({
    artifact,
    sealedEvent: first,
    receipt: receiptFromVerified(first),
  });
}
