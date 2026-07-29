// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Resume Adapter
// ───────────────────────────────────────────────────────────────────

import {
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  parseDeepReviewCertificateBundle,
  verifyDeepReviewCertificateOffline,
} from '../deep-review-certificates/index.js';
import {
  DeepReviewWireEventTypes,
  isDeepReviewEventStem,
  prepareDeepReviewEvent,
} from '../deep-review-ledger-schema/index.js';
import {
  DEEP_REVIEW_PROJECTION_CODEC_VERSION,
  DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
  DEEP_REVIEW_REDUCER_VERSION,
  assertDeepReviewProjectionState,
  deepReviewProjectionIntegrityDigest,
  foldDeepReviewEvents,
} from '../deep-review-reducers/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EFFECT_RECOVERY_STARTED_EVENT_TYPE,
  EVIDENCE_CONTROL_REDUCER_VERSION,
  INITIAL_EVIDENCE_CONTROL_PROJECTION,
  createEvidenceControlReducerRegistry,
  effectConfirmationBindsIntent,
} from '../receipts-and-effect-recovery/index.js';
import {
  ReplayFingerprintError,
} from '../replay-fingerprint/index.js';

import type {
  LedgerHead,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepReviewOfflineVerificationResult,
} from '../deep-review-certificates/index.js';
import type {
  DeepReviewCompatibilityStatus,
  DeepReviewEventStem,
  DeepReviewLedgerEvent,
} from '../deep-review-ledger-schema/index.js';
import type {
  DeepReviewProjectionCheckpoint,
  DeepReviewProjectionState,
} from '../deep-review-reducers/index.js';
import type {
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  OperatorResolutionPayload,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DeepReviewAuthenticatedMigrationRegistry,
  DeepReviewAuthenticatedTail,
  DeepReviewCompatibilityComponentDecision,
  DeepReviewContinuityLadderRow,
  DeepReviewContinuityProjection,
  DeepReviewEffectResumeDecision,
  DeepReviewInvalidationDecision,
  DeepReviewManifestDisposition,
  DeepReviewMigrationRegistryEntry,
  DeepReviewPassResumeDecision,
  DeepReviewPersistedRunLease,
  DeepReviewResumeAdapterOptions,
  DeepReviewResumeAdapterResult,
  DeepReviewResumeCompatibilityComponent,
  DeepReviewResumeDecision,
  DeepReviewResumeExecutionPoolEntry,
  DeepReviewResumeFingerprint,
  DeepReviewResumeRebuildReasonCode,
  DeepReviewResumeRequest,
  DeepReviewResumeReuseDisposition,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_REVIEW_RESUME_ADAPTER_VERSION = 'deep-review-resume-adapter@1';

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+\-]{0,255}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const COMPONENTS: readonly DeepReviewResumeCompatibilityComponent[] = Object.freeze([
  'manifest',
  'target',
  'tool',
  'model',
  'reducer',
  'adapter',
  'schema',
  'codec',
  'policy',
  'replay',
]);
const COMPATIBILITY_OUTCOMES: readonly DeepReviewCompatibilityStatus[] = Object.freeze([
  'exact', 'compatible', 'migrate', 'pin-old-runtime', 'blocked',
]);
const MIGRATION_REQUIRED_COMPONENTS = new Set<DeepReviewResumeCompatibilityComponent>([
  'manifest', 'target', 'reducer', 'adapter', 'schema', 'codec', 'policy', 'replay',
]);

export const DEEP_REVIEW_CONTINUITY_LADDER: readonly DeepReviewContinuityLadderRow[] =
  Object.freeze([
    Object.freeze({
      step: 'init',
      eventFamilies: Object.freeze([
        'deep_review.run_initialized',
        'deep_review.run_resumed',
        'deep_review.run_restarted',
      ]),
      reducerFields: Object.freeze(['run', 'status', 'seenEvents']),
      reentryActions: Object.freeze(['reuse', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'scope',
      eventFamilies: Object.freeze([
        'deep_review.scope_resolved',
        'deep_review.dimension_ordered',
        'deep_review.protocol_plan_recorded',
      ]),
      reducerFields: Object.freeze(['reviewLoop.scope', 'reviewLoop.obligations']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
    }),
    Object.freeze({
      step: 'dimension-pass',
      eventFamilies: Object.freeze([
        'deep_review.dimension_pass_started',
        'deep_review.dimension_pass_completed',
        'deep_review.review_depth_recorded',
        'deep_review.recovery_started',
      ]),
      reducerFields: Object.freeze(['reviewLoop.coverageCells', 'reviewLoop.passes']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'findings/evidence',
      eventFamilies: Object.freeze([
        'deep_review.finding_candidate_emitted',
        'deep_review.evidence_observed',
        'deep_review.evidence_reconciled',
        'deep_review.claim_adjudication_recorded',
        'deep_review.finding_lineage_recorded',
        'deep_review.finding_state_changed',
      ]),
      reducerFields: Object.freeze(['findingLedger.findings', 'findingLedger.evidence']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'convergence',
      eventFamilies: Object.freeze([
        'deep_review.convergence_evaluated',
        'deep_review.graph_convergence_evaluated',
        'deep_review.blocked_stop_recorded',
      ]),
      reducerFields: Object.freeze(['reviewLoop.evaluations', 'reviewLoop.outcome', 'status']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'review-report',
      eventFamilies: Object.freeze([
        'deep_review.synthesis_started',
        'deep_review.review_report_committed',
      ]),
      reducerFields: Object.freeze(['artifactIndex.artifacts', 'status.provenance']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'continuity-save',
      eventFamilies: Object.freeze([
        'deep_review.continuity_save_requested',
        'deep_review.continuity_save_completed',
        'deep_review.continuity_save_failed',
        'deep_review.run_completed',
      ]),
      reducerFields: Object.freeze(['artifactIndex.artifacts', 'status']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
  ]);

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED-SHAPE VALIDATION
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  const allowed = new Set(keys);
  return actual.length === keys.length && actual.every((key) => allowed.has(key));
}

function scanForbiddenKeys(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(scanForbiddenKeys);
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) throw new TypeError(`Resume input contains forbidden key ${key}`);
    scanForbiddenKeys(entry);
  }
}

function token(value: unknown, field: string): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a bounded no-space token`);
  }
  return value;
}

function digest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a lowercase sha256 digest`);
  }
  return value;
}

function timestamp(value: unknown, field: string): string {
  if (typeof value !== 'string' || !TIMESTAMP_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${field} must be an RFC3339 UTC timestamp`);
  }
  return value;
}

function prose(value: unknown, field: string): string {
  if (typeof value !== 'string'
    || value.length === 0
    || value.length > 1_024
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
    throw new TypeError(`${field} must be bounded prose`);
  }
  return value;
}

function uint(value: unknown, field: string, maximum = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > maximum) {
    throw new TypeError(`${field} must be a bounded non-negative integer`);
  }
  return Number(value);
}

function parseFingerprint(value: unknown, field: string): DeepReviewResumeFingerprint {
  if (!isRecord(value) || !hasExactKeys(value, [
    'fingerprintVersion',
    'manifestRevision',
    'targetDigest',
    'toolVersion',
    'modelVersion',
    'reducerVersion',
    'adapterVersion',
    'schemaVersion',
    'codecVersion',
    'policyVersion',
    'replayFingerprint',
    'certificateDigest',
    'finalDigest',
  ])) throw new TypeError(`${field} must use the closed resume-fingerprint shape`);
  const parsed: DeepReviewResumeFingerprint = Object.freeze({
    fingerprintVersion: uint(value.fingerprintVersion, `${field}.fingerprintVersion`, 65_535),
    manifestRevision: token(value.manifestRevision, `${field}.manifestRevision`),
    targetDigest: digest(value.targetDigest, `${field}.targetDigest`),
    toolVersion: token(value.toolVersion, `${field}.toolVersion`),
    modelVersion: token(value.modelVersion, `${field}.modelVersion`),
    reducerVersion: token(value.reducerVersion, `${field}.reducerVersion`),
    adapterVersion: token(value.adapterVersion, `${field}.adapterVersion`),
    schemaVersion: token(value.schemaVersion, `${field}.schemaVersion`),
    codecVersion: token(value.codecVersion, `${field}.codecVersion`),
    policyVersion: token(value.policyVersion, `${field}.policyVersion`),
    replayFingerprint: digest(value.replayFingerprint, `${field}.replayFingerprint`),
    certificateDigest: digest(value.certificateDigest, `${field}.certificateDigest`),
    finalDigest: digest(value.finalDigest, `${field}.finalDigest`),
  });
  if (deepReviewResumeFingerprintDigest(parsed) !== parsed.finalDigest) {
    throw new TypeError(`${field}.finalDigest does not commit the ordered fingerprint fields`);
  }
  return parsed;
}

function parseLease(value: unknown): DeepReviewPersistedRunLease {
  if (!isRecord(value) || !hasExactKeys(value, [
    'runId', 'sessionId', 'leaseId', 'generation', 'deadlineAt', 'remainingMs',
    'replayFingerprint',
  ])) throw new TypeError('lease must use the closed persisted lease shape');
  return Object.freeze({
    runId: token(value.runId, 'lease.runId'),
    sessionId: token(value.sessionId, 'lease.sessionId'),
    leaseId: token(value.leaseId, 'lease.leaseId'),
    generation: uint(value.generation, 'lease.generation', 0xffff_ffff),
    deadlineAt: timestamp(value.deadlineAt, 'lease.deadlineAt'),
    remainingMs: uint(value.remainingMs, 'lease.remainingMs'),
    replayFingerprint: digest(value.replayFingerprint, 'lease.replayFingerprint'),
  });
}

function parseCheckpoint(value: unknown): DeepReviewProjectionCheckpoint | null {
  if (value === null) return null;
  if (!isRecord(value) || !hasExactKeys(value, [
    'projection', 'integrityDigest', 'sourceTailSequence', 'sourceTailEventDigest',
  ])) throw new TypeError('checkpoint must use the closed reducer checkpoint shape');
  assertDeepReviewProjectionState(value.projection);
  return Object.freeze({
    projection: value.projection as DeepReviewProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceTailSequence: uint(value.sourceTailSequence, 'checkpoint.sourceTailSequence'),
    sourceTailEventDigest: digest(value.sourceTailEventDigest, 'checkpoint.sourceTailEventDigest'),
  });
}

/** Parse one resume request with closed keys and kind-specific field rules. */
export function parseDeepReviewResumeRequest(input: unknown): DeepReviewResumeRequest {
  scanForbiddenKeys(input);
  if (!isRecord(input) || !hasExactKeys(input, [
    'runId',
    'manifestRevision',
    'idempotencyKey',
    'requestedAt',
    'resumeReason',
    'persistedFingerprint',
    'currentFingerprint',
    'lease',
    'checkpoint',
    'priorCertificateBundle',
  ])) throw new TypeError('Resume request must use the closed request shape');
  return Object.freeze({
    runId: token(input.runId, 'runId'),
    manifestRevision: token(input.manifestRevision, 'manifestRevision'),
    idempotencyKey: token(input.idempotencyKey, 'idempotencyKey'),
    requestedAt: timestamp(input.requestedAt, 'requestedAt'),
    resumeReason: prose(input.resumeReason, 'resumeReason'),
    persistedFingerprint: parseFingerprint(input.persistedFingerprint, 'persistedFingerprint'),
    currentFingerprint: parseFingerprint(input.currentFingerprint, 'currentFingerprint'),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    priorCertificateBundle: parseDeepReviewCertificateBundle(input.priorCertificateBundle),
  });
}

/** Commit the ordered resume facts instead of adopting a caller digest. */
export function deepReviewResumeFingerprintDigest(
  fingerprint: Omit<DeepReviewResumeFingerprint, 'finalDigest'> | DeepReviewResumeFingerprint,
): string {
  return sha256Bytes(canonicalBytes({
    fingerprintVersion: fingerprint.fingerprintVersion,
    manifestRevision: fingerprint.manifestRevision,
    targetDigest: fingerprint.targetDigest,
    toolVersion: fingerprint.toolVersion,
    modelVersion: fingerprint.modelVersion,
    reducerVersion: fingerprint.reducerVersion,
    adapterVersion: fingerprint.adapterVersion,
    schemaVersion: fingerprint.schemaVersion,
    codecVersion: fingerprint.codecVersion,
    policyVersion: fingerprint.policyVersion,
    replayFingerprint: fingerprint.replayFingerprint,
    certificateDigest: fingerprint.certificateDigest,
  }));
}

/** Commit the complete migration registry before any entry can affect classification. */
export function deepReviewMigrationRegistryDigest(
  registry: Omit<DeepReviewAuthenticatedMigrationRegistry, 'registryDigest'>
    | DeepReviewAuthenticatedMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    authorityEpoch: registry.authorityEpoch,
    entries: registry.entries,
  }));
}

function parseMigrationEntry(value: unknown, index: number): DeepReviewMigrationRegistryEntry {
  if (!isRecord(value) || !hasExactKeys(value, [
    'component', 'fromVersion', 'toVersion', 'outcome', 'revision',
  ])) throw new TypeError(`migrationRegistry.entries[${index}] must use the closed entry shape`);
  if (!COMPONENTS.includes(value.component as DeepReviewResumeCompatibilityComponent)) {
    throw new TypeError(`migrationRegistry.entries[${index}].component is unknown`);
  }
  if (value.outcome !== 'compatible'
    && value.outcome !== 'migrate'
    && value.outcome !== 'pin-old-runtime') {
    throw new TypeError(`migrationRegistry.entries[${index}].outcome is unknown`);
  }
  return Object.freeze({
    component: value.component as DeepReviewResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `migrationRegistry.entries[${index}].fromVersion`),
    toVersion: token(value.toVersion, `migrationRegistry.entries[${index}].toVersion`),
    outcome: value.outcome,
    revision: token(value.revision, `migrationRegistry.entries[${index}].revision`),
  });
}

function parseMigrationRegistry(input: unknown): DeepReviewAuthenticatedMigrationRegistry {
  scanForbiddenKeys(input);
  if (!isRecord(input) || !hasExactKeys(input, [
    'registryVersion', 'authorityEpoch', 'entries', 'registryDigest',
  ]) || input.registryVersion !== 1 || !Array.isArray(input.entries)) {
    throw new TypeError('Migration registry must use the closed authenticated shape');
  }
  const entries = input.entries.map(parseMigrationEntry);
  const identities = entries.map((entry) => (
    `${entry.component}\u0000${entry.fromVersion}\u0000${entry.toVersion}`
  ));
  if (new Set(identities).size !== identities.length) {
    throw new TypeError('Migration registry contains an ambiguous duplicate identity');
  }
  return Object.freeze({
    registryVersion: 1,
    authorityEpoch: uint(input.authorityEpoch, 'migrationRegistry.authorityEpoch', 0xffff_ffff),
    entries: Object.freeze(entries),
    registryDigest: digest(input.registryDigest, 'migrationRegistry.registryDigest'),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFIED PRIOR-RUN RECONSTRUCTION
// ───────────────────────────────────────────────────────────────────

interface DeepReviewHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: DeepReviewLedgerEvent;
}

interface AuthenticatedHistory {
  readonly entries: readonly DeepReviewHistoryEntry[];
  readonly tail: DeepReviewAuthenticatedTail;
}

function eventForRun(
  verified: VerifiedLedgerEvent,
  runId: string,
): DeepReviewLedgerEvent | null {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isRecord(payload) || !isDeepReviewEventStem(payload.stem)) return null;
  const stem = payload.stem as DeepReviewEventStem;
  if (envelope.event_type !== DeepReviewWireEventTypes[stem]) {
    throw new TypeError('Verified Deep Review event type does not match its typed stem');
  }
  if (!isRecord(payload.scope) || payload.scope.runId !== runId) return null;
  return envelope as unknown as DeepReviewLedgerEvent;
}

function authenticatedHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  runId: string,
): AuthenticatedHistory {
  const entries = verifiedEvents
    .map((verified) => {
      const event = eventForRun(verified, runId);
      return event === null ? null : { verified, event };
    })
    .filter((entry): entry is DeepReviewHistoryEntry => entry !== null);
  if (entries.length === 0 || entries[0].event.payload.stem !== 'deep_review.run_initialized') {
    throw new TypeError('Resume requires one authenticated run initialization event');
  }
  const streamId = entries[0].event.stream_id;
  let previousEventId: string | null = null;
  for (const [index, entry] of entries.entries()) {
    if (entry.event.stream_id !== streamId
      || entry.event.stream_sequence !== index + 1
      || (index > 0 && entry.event.causation_id !== previousEventId)) {
      throw new TypeError('Authenticated Deep Review stream contains a causal cursor gap or split');
    }
    previousEventId = entry.event.event_id;
  }
  const final = entries.at(-1)!;
  return Object.freeze({
    entries: Object.freeze(entries),
    tail: Object.freeze({
      ledgerId: final.verified.frame.ledger_id,
      ledgerSequence: final.verified.frame.sequence,
      recordHash: final.verified.frame.record_hash,
      streamId,
      streamSequence: final.event.stream_sequence,
      eventCount: entries.length,
    }),
  });
}

function validateCheckpoint(
  checkpoint: DeepReviewProjectionCheckpoint | null,
  history: AuthenticatedHistory,
): readonly DeepReviewResumeRebuildReasonCode[] {
  if (checkpoint === null) return [];
  if (checkpoint.sourceTailSequence > history.tail.streamSequence) return ['cursor-gap'];
  const prefix = history.entries
    .filter((entry) => entry.event.stream_sequence <= checkpoint.sourceTailSequence)
    .map((entry) => entry.event);
  if (checkpoint.sourceTailSequence > 0
    && prefix.at(-1)?.stream_sequence !== checkpoint.sourceTailSequence) return ['cursor-gap'];
  const expected = foldDeepReviewEvents(prefix, {
    sourceTailSequence: checkpoint.sourceTailSequence,
  });
  if (expected.outcome === 'rebuild_required') return expected.reasonCodes;
  if (deepReviewProjectionIntegrityDigest(expected.projection)
      !== deepReviewProjectionIntegrityDigest(checkpoint.projection)
    || expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || expected.checkpoint.sourceTailEventDigest !== checkpoint.sourceTailEventDigest) {
    return ['checkpoint-digest-mismatch'];
  }
  return [];
}

function verificationReason(
  result: Exclude<DeepReviewOfflineVerificationResult, { readonly verdict: 'valid' }>,
): DeepReviewResumeRebuildReasonCode {
  if (result.verdict === 'incomplete') return 'prior-certificate-incomplete';
  if (result.verdict === 'unverifiable') return 'prior-certificate-unverifiable';
  return 'prior-certificate-invalid';
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPATIBILITY AND INVALIDATION
// ───────────────────────────────────────────────────────────────────

function componentVersion(
  fingerprint: DeepReviewResumeFingerprint,
  component: DeepReviewResumeCompatibilityComponent,
): string {
  switch (component) {
    case 'manifest': return fingerprint.manifestRevision;
    case 'target': return fingerprint.targetDigest;
    case 'tool': return fingerprint.toolVersion;
    case 'model': return fingerprint.modelVersion;
    case 'reducer': return fingerprint.reducerVersion;
    case 'adapter': return fingerprint.adapterVersion;
    case 'schema': return fingerprint.schemaVersion;
    case 'codec': return fingerprint.codecVersion;
    case 'policy': return fingerprint.policyVersion;
    case 'replay': return fingerprint.replayFingerprint;
  }
}

function classifyCompatibility(
  request: DeepReviewResumeRequest,
  registry: DeepReviewAuthenticatedMigrationRegistry,
  registryAuthenticated: boolean,
  fingerprintVersionsKnown: boolean,
): {
  readonly outcome: DeepReviewCompatibilityStatus;
  readonly reuseDisposition: DeepReviewResumeReuseDisposition;
  readonly manifestDisposition: DeepReviewManifestDisposition;
  readonly decisions: readonly DeepReviewCompatibilityComponentDecision[];
} {
  const decisions = COMPONENTS.map((component): DeepReviewCompatibilityComponentDecision => {
    const persistedVersion = componentVersion(request.persistedFingerprint, component);
    const installedVersion = componentVersion(request.currentFingerprint, component);
    if (!fingerprintVersionsKnown) return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome: 'blocked',
      revision: null,
      decisionReason: 'Fingerprint version is not registered.',
    });
    if (persistedVersion === installedVersion) return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome: 'exact',
      revision: null,
      decisionReason: 'Persisted and installed facts are identical.',
    });
    if (!registryAuthenticated) return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome: 'blocked',
      revision: null,
      decisionReason: 'The migration registry is not authenticated by the configured digest and epoch.',
    });
    const rule = registry.entries.find((candidate) => (
      candidate.component === component
      && candidate.fromVersion === persistedVersion
      && candidate.toVersion === installedVersion
    ));
    if (rule === undefined) return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome: 'blocked',
      revision: null,
      decisionReason: 'No authenticated migration entry covers the real version pair.',
    });
    const outcome = rule.outcome === 'compatible' && MIGRATION_REQUIRED_COMPONENTS.has(component)
      ? 'migrate' as const
      : rule.outcome;
    return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome,
      revision: rule.revision,
      decisionReason: outcome === rule.outcome
        ? 'An authenticated migration entry covers the real version pair.'
        : 'The adapter promoted a caller-compatible claim to migration for a state-bearing component.',
    });
  });
  const outcomes = new Set(decisions.map((decision) => decision.outcome));
  const outcome: DeepReviewCompatibilityStatus = outcomes.has('blocked')
    ? 'blocked'
    : outcomes.has('pin-old-runtime')
      ? 'pin-old-runtime'
      : outcomes.has('migrate')
        ? 'migrate'
        : outcomes.has('compatible')
          ? 'compatible'
          : 'exact';
  const manifestChanged = request.persistedFingerprint.manifestRevision
    !== request.currentFingerprint.manifestRevision;
  const manifestDecision = decisions.find((decision) => decision.component === 'manifest');
  const manifestDisposition: DeepReviewManifestDisposition = !manifestChanged
    ? 'original'
    : manifestDecision?.outcome === 'migrate' || manifestDecision?.outcome === 'compatible'
      ? 'restart'
      : 'reject';
  const reuseDisposition: DeepReviewResumeReuseDisposition = outcome === 'exact'
    ? 'exact-reuse'
    : outcome;
  return Object.freeze({
    outcome,
    reuseDisposition,
    manifestDisposition,
    decisions: Object.freeze(decisions),
  });
}

function deriveInvalidation(
  projection: DeepReviewProjectionState,
  request: DeepReviewResumeRequest,
  compatibility: DeepReviewCompatibilityStatus,
): DeepReviewInvalidationDecision {
  const targetChanged = request.persistedFingerprint.targetDigest
    !== request.currentFingerprint.targetDigest;
  const reopensState = targetChanged
    || compatibility === 'migrate'
    || request.persistedFingerprint.manifestRevision
      !== request.currentFingerprint.manifestRevision;
  return Object.freeze({
    targetChanged,
    reopenedDimensionIds: Object.freeze(reopensState
      ? [...projection.reviewLoop.scope.orderedDimensionIds]
      : []),
    invalidatedFindingIds: Object.freeze(reopensState
      ? projection.findingLedger.findings.map((finding) => finding.findingId).sort()
      : []),
    reopenedObligationIds: Object.freeze(reopensState
      ? projection.reviewLoop.obligations.map((obligation) => obligation.obligationId).sort()
      : projection.reviewLoop.obligations
        .filter((obligation) => obligation.status !== 'resolved')
        .map((obligation) => obligation.obligationId)
        .sort()),
    convergenceReopened: reopensState,
    reportReopened: reopensState,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. PASS, EFFECT, AND CONTINUITY PLANNING
// ───────────────────────────────────────────────────────────────────

function retryKey(manifestRevision: string, logicalPassId: string): string {
  return `retry:${sha256Bytes(canonicalBytes({ manifestRevision, logicalPassId }))}`;
}

function attemptId(kind: 'pass' | 'effect', identity: string, idempotencyKey: string): string {
  return `${kind}-attempt-${sha256Bytes(canonicalBytes({ identity, idempotencyKey })).slice(0, 40)}`;
}

function passDecisions(
  projection: DeepReviewProjectionState,
  request: DeepReviewResumeRequest,
  compatibility: DeepReviewCompatibilityStatus,
  manifestDisposition: DeepReviewManifestDisposition,
  invalidation: DeepReviewInvalidationDecision,
): readonly DeepReviewPassResumeDecision[] {
  const reopened = new Set(invalidation.reopenedDimensionIds);
  const latestByLogicalPass = new Map<string, typeof projection.reviewLoop.passes[number]>();
  for (const pass of projection.reviewLoop.passes) {
    latestByLogicalPass.set(
      `${pass.iterationId}:${pass.dimensionId}:${pass.passNumber}`,
      pass,
    );
  }
  return Object.freeze([...latestByLogicalPass.values()].map((pass) => {
    const logicalPassId = `${pass.iterationId}:${pass.dimensionId}:${pass.passNumber}`;
    const key = retryKey(request.manifestRevision, logicalPassId);
    const blocked = compatibility === 'blocked'
      || compatibility === 'pin-old-runtime'
      || manifestDisposition === 'reject';
    const disposition = blocked
      ? 'reject' as const
      : manifestDisposition === 'restart'
        || reopened.has(pass.dimensionId)
        || pass.status !== 'complete'
        ? 'reexecute' as const
        : 'reuse' as const;
    return Object.freeze({
      logicalPassId,
      iterationId: pass.iterationId,
      dimensionId: pass.dimensionId,
      passNumber: pass.passNumber,
      manifestRevision: request.manifestRevision,
      retryKey: key,
      disposition,
      attemptId: disposition === 'reexecute'
        ? attemptId('pass', `${request.manifestRevision}:${logicalPassId}`, request.idempotencyKey)
        : null,
      evidenceEventIds: Object.freeze([pass.producerEventId]),
      decisionReason: blocked
        ? 'Compatibility or manifest policy blocks pass execution.'
        : manifestDisposition === 'restart'
          ? 'A changed manifest requires a fresh logical pass attempt.'
          : reopened.has(pass.dimensionId)
            ? 'Verified input drift reopens this dimension.'
            : pass.status === 'complete'
              ? 'The committed complete pass remains reusable.'
              : 'The pass did not reach a reusable committed completion.',
    });
  }));
}

interface EffectHistory {
  readonly intents: readonly {
    readonly eventId: string;
    readonly eventDigest: string;
    readonly payload: EffectIntentPayload;
  }[];
  readonly confirmations: readonly EffectConfirmationPayload[];
  readonly recoveries: readonly EffectRecoveryStartedPayload[];
  readonly reconciliations: readonly EffectReconciledPayload[];
  readonly conflicts: readonly EffectConflictPayload[];
  readonly resolutions: readonly OperatorResolutionPayload[];
}

function effectHistory(events: readonly VerifiedLedgerEvent[], runId: string): EffectHistory {
  const intents: Array<{
    readonly eventId: string;
    readonly eventDigest: string;
    readonly payload: EffectIntentPayload;
  }> = [];
  const confirmations: EffectConfirmationPayload[] = [];
  const recoveries: EffectRecoveryStartedPayload[] = [];
  const reconciliations: EffectReconciledPayload[] = [];
  const conflicts: EffectConflictPayload[] = [];
  const resolutions: OperatorResolutionPayload[] = [];
  for (const verified of events) {
    const envelope = verified.event.effective.envelope;
    const payload = envelope.payload;
    if (envelope.event_type === EFFECT_INTENT_EVENT_TYPE && payload.run_id === runId) {
      intents.push(Object.freeze({
        eventId: envelope.event_id,
        eventDigest: verified.event.stored.digest,
        payload: payload as EffectIntentPayload,
      }));
    } else if (envelope.event_type === EFFECT_CONFIRMATION_EVENT_TYPE) {
      confirmations.push(payload as EffectConfirmationPayload);
    } else if (envelope.event_type === EFFECT_RECOVERY_STARTED_EVENT_TYPE) {
      recoveries.push(payload as EffectRecoveryStartedPayload);
    } else if (envelope.event_type === EFFECT_RECONCILED_EVENT_TYPE) {
      reconciliations.push(payload as EffectReconciledPayload);
    } else if (envelope.event_type === EFFECT_CONFLICT_EVENT_TYPE && payload.run_id === runId) {
      conflicts.push(payload as EffectConflictPayload);
    } else if (envelope.event_type === EFFECT_OPERATOR_RESOLVED_EVENT_TYPE) {
      resolutions.push(payload as OperatorResolutionPayload);
    }
  }
  return { intents, confirmations, recoveries, reconciliations, conflicts, resolutions };
}

function effectDecisions(
  history: EffectHistory,
  request: DeepReviewResumeRequest,
  globallyBlocked: boolean,
): readonly DeepReviewEffectResumeDecision[] {
  return Object.freeze(history.intents.map((intentRecord) => {
    const intent = intentRecord.payload;
    const confirmation = history.confirmations.find((entry) => effectConfirmationBindsIntent(
      entry,
      intent,
      intentRecord.eventId,
      intentRecord.eventDigest,
    ));
    const relatedRecoveries = history.recoveries.filter(
      (entry) => entry.intent_event_id === intentRecord.eventId
        && entry.intent_event_digest === intentRecord.eventDigest,
    );
    const relatedReconciliations = history.reconciliations.filter((entry) => (
      entry.intent_event_id === intentRecord.eventId
      && relatedRecoveries.some((recovery) => recovery.recovery_id === entry.recovery_id)
    ));
    const latest = relatedReconciliations.at(-1);
    const hasConflict = history.conflicts.some(
      (entry) => entry.existing_intent_event_id === intentRecord.eventId,
    );
    let applicationState: DeepReviewEffectResumeDecision['applicationState'];
    let disposition: DeepReviewEffectResumeDecision['disposition'];
    let decisionReason: string;
    if (globallyBlocked || hasConflict) {
      applicationState = 'unknown';
      disposition = 'blocked';
      decisionReason = 'Compatibility or immutable effect conflict blocks recovery.';
    } else if (confirmation !== undefined) {
      applicationState = 'applied';
      disposition = 'reuse';
      decisionReason = 'The shared descriptor confirms all intent and postcondition binding facts.';
    } else if (latest?.verdict === 'not_applied' && intent.adapter.replay_safe) {
      applicationState = 'not-applied';
      disposition = 'reexecute';
      decisionReason = 'Verified recovery proves non-application and the adapter is replay-safe.';
    } else if (latest?.verdict === 'in_doubt'
      || latest?.verdict === 'conflict'
      || latest?.verdict === 'applied') {
      applicationState = 'unknown';
      disposition = 'blocked';
      decisionReason = 'Recovery evidence cannot replace a descriptor-bound confirmation.';
    } else if (intent.adapter.reconciliation === 'conclusive') {
      applicationState = 'unknown';
      disposition = 'reconcile';
      decisionReason = 'The unresolved intent supports conclusive reconciliation.';
    } else if (intent.adapter.replay_safe) {
      applicationState = 'unknown';
      disposition = 'reexecute';
      decisionReason = 'The unresolved intent is replay-safe under its stable target identity.';
    } else {
      applicationState = 'unknown';
      disposition = 'blocked';
      decisionReason = 'An irreversible unresolved effect lacks a valid bound confirmation.';
    }
    const attemptRefs = [
      intentRecord.eventId,
      ...relatedRecoveries.map((entry) => entry.recovery_id),
      ...relatedReconciliations.map((entry) => entry.recovery_id),
      ...(confirmation === undefined ? [] : [confirmation.confirmation_id]),
      ...history.resolutions
        .filter((entry) => entry.intent_event_id === intentRecord.eventId
          && relatedRecoveries.some((recovery) => recovery.recovery_id === entry.recovery_id))
        .map((entry) => entry.resolution_id),
    ];
    return Object.freeze({
      effectId: intent.effect_id,
      logicalEffectId: intent.logical_effect_id,
      applicationState,
      disposition,
      attemptRefs: Object.freeze([...new Set(attemptRefs)].sort()),
      nextAttemptId: disposition === 'reexecute'
        ? attemptId('effect', intent.effect_id, request.idempotencyKey)
        : null,
      decisionReason,
    });
  }));
}

function continuityProjection(
  projection: DeepReviewProjectionState,
  sourceTailSequence: number,
  invalidation: DeepReviewInvalidationDecision,
): DeepReviewContinuityProjection {
  const reports = projection.artifactIndex.artifacts.filter(
    (entry) => entry.artifactKind === 'review-report',
  );
  const saves = projection.artifactIndex.artifacts.filter(
    (entry) => entry.artifactKind === 'continuity-save',
  );
  const latestReport = reports.at(-1);
  const latestSave = saves.at(-1);
  const reportStarted = projection.status.provenance.some(
    (entry) => entry.producerStem === 'deep_review.synthesis_started',
  );
  const findingsStarted = projection.findingLedger.findings.length > 0
    || projection.findingLedger.evidence.length > 0;
  const currentStep = latestSave !== undefined
    ? 'continuity-save' as const
    : latestReport !== undefined || reportStarted
      ? 'review-report' as const
      : projection.reviewLoop.evaluations.length > 0
        ? 'convergence' as const
        : findingsStarted
          ? 'findings/evidence' as const
          : projection.reviewLoop.passes.length > 0
            ? 'dimension-pass' as const
            : projection.reviewLoop.scope.targets.length > 0
              ? 'scope' as const
              : 'init' as const;
  const reportState = invalidation.reportReopened
    ? 'rebuild-required' as const
    : latestReport?.availability === 'available'
      ? 'committed' as const
      : reportStarted
        ? 'started' as const
        : 'none' as const;
  const continuitySaveState = latestSave === undefined
    ? 'none' as const
    : latestSave.availability === 'available'
      ? 'completed' as const
      : latestSave.availability === 'unavailable'
        ? 'failed' as const
        : latestSave.availability === 'pending'
          ? 'requested' as const
          : 'reconcile' as const;
  const terminalState = projection.status.terminal
    ? projection.status.state === 'complete'
      ? 'completed' as const
      : projection.status.state === 'incomplete'
        ? 'incomplete' as const
        : projection.status.state === 'failed'
          ? 'failed' as const
          : 'blocked' as const
    : 'active' as const;
  const activePass = [...projection.reviewLoop.passes]
    .reverse()
    .find((pass) => pass.status !== 'complete') ?? null;
  const adjudicatedCandidates = new Set(projection.findingLedger.findings
    .filter((finding) => finding.lifecycle !== 'candidate')
    .map((finding) => finding.candidateId));
  const unresolvedCandidateIds = projection.findingLedger.findings
    .filter((finding) => !adjudicatedCandidates.has(finding.candidateId))
    .map((finding) => finding.candidateId)
    .sort();
  const candidatesWithEvidence = new Set(projection.findingLedger.evidence
    .map((evidence) => evidence.candidateId));
  const unresolvedEvidenceIds = projection.findingLedger.findings
    .filter((finding) => !candidatesWithEvidence.has(finding.candidateId))
    .map((finding) => finding.candidateId)
    .sort();
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: projection.run.runId ?? '',
    sessionId: projection.run.sessionId ?? '',
    generation: projection.run.generation,
    lastAppliedSeq: sourceTailSequence,
    seenEventIds: Object.freeze(projection.seenEvents.map((entry) => entry.eventId)),
    currentStep,
    initialized: projection.run.initializationEventId !== null,
    orderedDimensionIds: Object.freeze([...projection.reviewLoop.scope.orderedDimensionIds]),
    activeDimensionId: activePass?.dimensionId ?? null,
    activePassId: activePass === null
      ? null
      : `${activePass.iterationId}:${activePass.dimensionId}:${activePass.passNumber}`,
    unresolvedCandidateIds: Object.freeze(unresolvedCandidateIds),
    unresolvedEvidenceIds: Object.freeze(unresolvedEvidenceIds),
    unresolvedObligationIds: Object.freeze(projection.reviewLoop.obligations
      .filter((obligation) => obligation.status !== 'resolved')
      .map((obligation) => obligation.obligationId)
      .sort()),
    convergenceOutcome: projection.reviewLoop.outcome,
    reportState,
    reportRevision: latestReport?.logicalArtifactId ?? null,
    continuitySaveState,
    terminalState,
    incomplete: projection.status.state === 'incomplete'
      || projection.reviewLoop.outcome === 'incomplete'
      || reportState === 'rebuild-required'
      || continuitySaveState === 'failed',
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. DECISION VALIDATION
// ───────────────────────────────────────────────────────────────────

function assertClosedDecisionRecord(value: unknown): asserts value is DeepReviewResumeDecision {
  if (!isRecord(value) || !hasExactKeys(value, [
    'decisionVersion',
    'decisionId',
    'decisionDigest',
    'authority',
    'legacyAuthority',
    'productionCompletion',
    'reuseDisposition',
    'compatibilityOutcome',
    'manifestDisposition',
    'compatibility',
    'passes',
    'effects',
    'invalidation',
    'lease',
    'priorCertificateDigest',
    'receiptChainDigest',
    'artifactSetDigest',
    'decisionReason',
  ])) throw new TypeError('Resume decision must use the closed decision shape');
  if (value.decisionVersion !== 1
    || value.authority !== 'dark-evidence-only'
    || value.legacyAuthority !== 'unchanged'
    || value.productionCompletion !== false
    || !['exact-reuse', 'compatible', 'migrate', 'pin-old-runtime', 'blocked']
      .includes(String(value.reuseDisposition))
    || !COMPATIBILITY_OUTCOMES.includes(value.compatibilityOutcome as DeepReviewCompatibilityStatus)
    || !['original', 'restart', 'reject'].includes(String(value.manifestDisposition))
    || !Array.isArray(value.compatibility)
    || !Array.isArray(value.passes)
    || !Array.isArray(value.effects)) {
    throw new TypeError('Resume decision contains an invalid closed discriminator');
  }
  token(value.decisionId, 'decision.decisionId');
  digest(value.decisionDigest, 'decision.decisionDigest');
  digest(value.priorCertificateDigest, 'decision.priorCertificateDigest');
  digest(value.receiptChainDigest, 'decision.receiptChainDigest');
  digest(value.artifactSetDigest, 'decision.artifactSetDigest');
  prose(value.decisionReason, 'decision.decisionReason');
  parseLease(value.lease);
  for (const [index, entry] of value.compatibility.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'component', 'persistedVersion', 'installedVersion', 'outcome', 'revision', 'decisionReason',
    ])) throw new TypeError(`compatibility[${index}] is not closed`);
    if (!COMPONENTS.includes(entry.component as DeepReviewResumeCompatibilityComponent)
      || !COMPATIBILITY_OUTCOMES.includes(entry.outcome as DeepReviewCompatibilityStatus)) {
      throw new TypeError(`compatibility[${index}] has an unknown discriminator`);
    }
    token(entry.persistedVersion, `compatibility[${index}].persistedVersion`);
    token(entry.installedVersion, `compatibility[${index}].installedVersion`);
    if (entry.revision !== null) token(entry.revision, `compatibility[${index}].revision`);
    prose(entry.decisionReason, `compatibility[${index}].decisionReason`);
  }
  for (const [index, entry] of value.passes.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'logicalPassId', 'iterationId', 'dimensionId', 'passNumber', 'manifestRevision',
      'retryKey', 'disposition', 'attemptId', 'evidenceEventIds', 'decisionReason',
    ]) || !['reuse', 'reexecute', 'reject'].includes(String(entry.disposition))
      || !Array.isArray(entry.evidenceEventIds)) {
      throw new TypeError(`passes[${index}] is not closed`);
    }
    token(entry.logicalPassId, `passes[${index}].logicalPassId`);
    token(entry.iterationId, `passes[${index}].iterationId`);
    token(entry.dimensionId, `passes[${index}].dimensionId`);
    uint(entry.passNumber, `passes[${index}].passNumber`, 0xffff_ffff);
    token(entry.manifestRevision, `passes[${index}].manifestRevision`);
    token(entry.retryKey, `passes[${index}].retryKey`);
    if (entry.attemptId !== null) token(entry.attemptId, `passes[${index}].attemptId`);
    entry.evidenceEventIds.forEach((eventId, eventIndex) => (
      token(eventId, `passes[${index}].evidenceEventIds[${eventIndex}]`)
    ));
    prose(entry.decisionReason, `passes[${index}].decisionReason`);
  }
  for (const [index, entry] of value.effects.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'effectId', 'logicalEffectId', 'applicationState', 'disposition', 'attemptRefs',
      'nextAttemptId', 'decisionReason',
    ]) || !['applied', 'not-applied', 'unknown'].includes(String(entry.applicationState))
      || !['reuse', 'reexecute', 'reconcile', 'blocked'].includes(String(entry.disposition))
      || !Array.isArray(entry.attemptRefs)) {
      throw new TypeError(`effects[${index}] is not closed`);
    }
    token(entry.effectId, `effects[${index}].effectId`);
    token(entry.logicalEffectId, `effects[${index}].logicalEffectId`);
    if (entry.nextAttemptId !== null) token(entry.nextAttemptId, `effects[${index}].nextAttemptId`);
    entry.attemptRefs.forEach((attempt, attemptIndex) => (
      token(attempt, `effects[${index}].attemptRefs[${attemptIndex}]`)
    ));
    prose(entry.decisionReason, `effects[${index}].decisionReason`);
  }
  if (!isRecord(value.invalidation) || !hasExactKeys(value.invalidation, [
    'targetChanged',
    'reopenedDimensionIds',
    'invalidatedFindingIds',
    'reopenedObligationIds',
    'convergenceReopened',
    'reportReopened',
  ])) throw new TypeError('decision.invalidation is not closed');
  for (const field of [
    'reopenedDimensionIds', 'invalidatedFindingIds', 'reopenedObligationIds',
  ] as const) {
    const entries = value.invalidation[field];
    if (!Array.isArray(entries)) throw new TypeError(`decision.invalidation.${field} must be an array`);
    entries.forEach((entry, index) => (
      token(entry, `decision.invalidation.${field}[${index}]`)
    ));
  }
  for (const field of ['targetChanged', 'convergenceReopened', 'reportReopened'] as const) {
    if (typeof value.invalidation[field] !== 'boolean') {
      throw new TypeError(`decision.invalidation.${field} must be boolean`);
    }
  }
}

/** Validate a decision at module boundaries and reject every unknown key. */
export function parseDeepReviewResumeDecision(input: unknown): DeepReviewResumeDecision {
  scanForbiddenKeys(input);
  assertClosedDecisionRecord(input);
  const { decisionDigest: ignored, ...body } = input;
  void ignored;
  if (sha256Bytes(canonicalBytes(body)) !== input.decisionDigest) {
    throw new TypeError('Resume decision digest does not commit the closed decision body');
  }
  return Object.freeze(input);
}

// ───────────────────────────────────────────────────────────────────
// 7. ADAPTER
// ───────────────────────────────────────────────────────────────────

/** Reconstruct and re-enter one run through verified, additive-dark substrate boundaries. */
export class DeepReviewResumeAdapter {
  readonly #options: DeepReviewResumeAdapterOptions;
  readonly #migrationRegistry: DeepReviewAuthenticatedMigrationRegistry;
  readonly #registryAuthenticated: boolean;

  public constructor(options: DeepReviewResumeAdapterOptions) {
    this.#options = options;
    this.#migrationRegistry = parseMigrationRegistry(options.migrationRegistry);
    this.#registryAuthenticated = (
      this.#migrationRegistry.authorityEpoch === options.authorityEpoch
      && deepReviewMigrationRegistryDigest(this.#migrationRegistry)
        === this.#migrationRegistry.registryDigest
      && this.#migrationRegistry.registryDigest === options.trustedMigrationRegistryDigest
    );
  }

  public async resume(input: unknown): Promise<DeepReviewResumeAdapterResult> {
    const request = parseDeepReviewResumeRequest(input);
    if (request.manifestRevision !== request.currentFingerprint.manifestRevision) {
      throw new TypeError('Requested manifest revision must equal the current fingerprint revision');
    }
    if (request.currentFingerprint.finalDigest !== this.#options.installedFingerprint.finalDigest) {
      throw new TypeError('Current request fingerprint does not identify the configured runtime facts');
    }
    const bundle = request.priorCertificateBundle;
    const certificate = bundle.certificate;
    const allVerified = await this.#options.ledger.readVerifiedEvents();
    const covered = allVerified.filter((verified) => (
      verified.frame.sequence > certificate.body.startHead.sequence
      && verified.frame.sequence <= certificate.body.finalHead.sequence
    ));
    let history: AuthenticatedHistory;
    try {
      history = authenticatedHistory(covered, request.runId);
    } catch {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([
          'certificate-frontier-mismatch' as DeepReviewResumeRebuildReasonCode,
        ]),
        authenticatedTail: null,
      });
    }
    if (history.tail.ledgerId !== certificate.body.finalHead.ledger_id
      || history.tail.ledgerSequence !== certificate.body.finalHead.sequence
      || history.tail.recordHash !== certificate.body.finalHead.record_hash
      || this.#options.certificateReplay.ledger !== this.#options.ledger
      || this.#options.certificateReplay.runId !== request.runId
      || this.#options.certificateReplay.rangeStartSequence
        !== certificate.body.startHead.sequence + 1
      || this.#options.certificateReplay.rangeEndSequence
        !== certificate.body.finalHead.sequence) {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([
          'certificate-frontier-mismatch' as DeepReviewResumeRebuildReasonCode,
        ]),
        authenticatedTail: history.tail,
      });
    }
    const checkpointReasons = validateCheckpoint(request.checkpoint, history);
    if (checkpointReasons.length > 0) {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([...checkpointReasons]),
        authenticatedTail: history.tail,
      });
    }
    const certificateVerification = await verifyDeepReviewCertificateOffline({
      bundle,
      projectionEvents: history.entries.map((entry) => entry.event),
      artifactStore: this.#options.artifactStore,
      replay: this.#options.certificateReplay,
      providers: this.#options.certificateProviders,
    });
    if (certificateVerification.verdict !== 'valid') {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([verificationReason(certificateVerification)]),
        authenticatedTail: history.tail,
      });
    }
    const folded = foldDeepReviewEvents(
      history.entries.map((entry) => entry.event),
      { sourceTailSequence: history.tail.streamSequence },
    );
    if (folded.outcome === 'rebuild_required') {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: folded.reasonCodes,
        authenticatedTail: history.tail,
      });
    }
    const projection = folded.projection;
    this.#assertRunLeaseAndCertificate(request, projection, certificateVerification);
    const policy = this.#options.policies.resolve(
      this.#options.policyId,
      this.#options.policyVersion,
    );

    let fingerprintVersionsKnown = true;
    try {
      this.#options.fingerprintVersions.resolve(request.persistedFingerprint.fingerprintVersion);
      this.#options.fingerprintVersions.resolve(request.currentFingerprint.fingerprintVersion);
    } catch (error: unknown) {
      if (!(error instanceof ReplayFingerprintError)) throw error;
      fingerprintVersionsKnown = false;
    }
    let compatibility = classifyCompatibility(
      request,
      this.#migrationRegistry,
      this.#registryAuthenticated,
      fingerprintVersionsKnown,
    );
    const evidenceFailures: string[] = [];
    if (request.currentFingerprint.reducerVersion !== DEEP_REVIEW_REDUCER_VERSION
      || request.currentFingerprint.adapterVersion !== DEEP_REVIEW_RESUME_ADAPTER_VERSION
      || request.currentFingerprint.schemaVersion !== DEEP_REVIEW_PROJECTION_SCHEMA_VERSION
      || request.currentFingerprint.codecVersion !== DEEP_REVIEW_PROJECTION_CODEC_VERSION
      || request.currentFingerprint.policyVersion
        !== `${policy.policyId}@${policy.policyVersion}`) {
      evidenceFailures.push('Current fingerprint does not identify the real loaded runtime contracts.');
    }
    if (request.persistedFingerprint.replayFingerprint
      !== certificateVerification.replayFingerprint
      || request.persistedFingerprint.certificateDigest
        !== certificateVerification.certificateDigest) {
      evidenceFailures.push('Persisted fingerprint is not bound to the offline-verified certificate.');
    }
    const initializedTarget = history.entries[0].event.payload.data;
    if (!isRecord(initializedTarget) || !('target' in initializedTarget)
      || sha256Bytes(canonicalBytes(initializedTarget.target))
        !== request.persistedFingerprint.targetDigest) {
      evidenceFailures.push('Persisted target identity is not bound to run initialization.');
    }

    const effectEvents = await this.#options.effectLedger.readVerifiedEvents();
    const effectHead = await this.#options.effectLedger.getVerifiedHead();
    try {
      rebuildProjection(
        effectEvents,
        INITIAL_EVIDENCE_CONTROL_PROJECTION,
        EVIDENCE_CONTROL_REDUCER_VERSION,
        effectHead,
        createEvidenceControlReducerRegistry(),
      );
    } catch {
      evidenceFailures.push('Effect evidence failed deterministic substrate replay.');
    }
    if (evidenceFailures.length > 0) compatibility = Object.freeze({
      ...compatibility,
      outcome: 'blocked' as const,
      reuseDisposition: 'blocked' as const,
      manifestDisposition: compatibility.manifestDisposition === 'original'
        ? 'original' as const
        : 'reject' as const,
    });

    const invalidation = deriveInvalidation(projection, request, compatibility.outcome);
    const passes = passDecisions(
      projection,
      request,
      compatibility.outcome,
      compatibility.manifestDisposition,
      invalidation,
    );
    const effects = effectDecisions(
      effectHistory(effectEvents, request.runId),
      request,
      compatibility.outcome === 'blocked' || compatibility.outcome === 'pin-old-runtime',
    );
    const decisionBody = {
      decisionVersion: 1 as const,
      decisionId: `resume-decision-${sha256Bytes(canonicalBytes({
        runId: request.runId,
        manifestRevision: request.manifestRevision,
        certificateDigest: certificateVerification.certificateDigest,
        idempotencyKey: request.idempotencyKey,
      })).slice(0, 40)}`,
      authority: 'dark-evidence-only' as const,
      legacyAuthority: 'unchanged' as const,
      productionCompletion: false as const,
      reuseDisposition: compatibility.reuseDisposition,
      compatibilityOutcome: compatibility.outcome,
      manifestDisposition: compatibility.manifestDisposition,
      compatibility: compatibility.decisions,
      passes,
      effects,
      invalidation,
      lease: request.lease,
      priorCertificateDigest: certificateVerification.certificateDigest,
      receiptChainDigest: certificateVerification.receiptChainDigest,
      artifactSetDigest: certificateVerification.artifactSetDigest,
      decisionReason: evidenceFailures.length > 0
        ? evidenceFailures.join(' ')
        : compatibility.outcome === 'blocked'
          ? 'One or more real component versions have no authenticated compatibility path.'
          : 'Offline-verified prior evidence has one deterministic compatibility and recovery plan.',
    };
    const decision = parseDeepReviewResumeDecision(Object.freeze({
      ...decisionBody,
      decisionDigest: sha256Bytes(canonicalBytes(decisionBody)),
    }));
    const continuity = continuityProjection(
      projection,
      history.tail.streamSequence,
      invalidation,
    );
    const executionPool = Object.freeze(passes
      .filter((pass): pass is DeepReviewPassResumeDecision & { readonly attemptId: string } => (
        pass.disposition === 'reexecute' && pass.attemptId !== null
      ))
      .map((pass): DeepReviewResumeExecutionPoolEntry => Object.freeze({
        logicalPassId: pass.logicalPassId,
        iterationId: pass.iterationId,
        dimensionId: pass.dimensionId,
        passNumber: pass.passNumber,
        manifestRevision: pass.manifestRevision,
        retryKey: pass.retryKey,
        attemptId: pass.attemptId,
      })));

    const existing = allVerified.filter((verified) => {
      const envelope = verified.event.effective.envelope;
      const payload = envelope.payload;
      return envelope.idempotency_key === request.idempotencyKey
        && isRecord(payload)
        && payload.stem === 'deep_review.run_resumed'
        && isRecord(payload.scope)
        && payload.scope.runId === request.runId;
    });
    if (existing.length > 1) throw new TypeError('Resume idempotency key resolves to multiple events');
    const currentHead = await this.#options.ledger.getVerifiedHead();
    const priorHead: LedgerHead = existing.length === 1
      ? Object.freeze({
        ledgerId: currentHead.ledgerId,
        sequence: existing[0].frame.sequence - 1,
        recordHash: existing[0].frame.prev_record_hash,
      })
      : currentHead;
    const eventId = `resume-${sha256Bytes(canonicalBytes({
      decisionId: decision.decisionId,
      idempotencyKey: request.idempotencyKey,
    })).slice(0, 40)}`;
    const prepared = prepareDeepReviewEvent({
      stem: 'deep_review.run_resumed',
      scope: {
        runId: request.runId,
        sessionId: request.lease.sessionId,
        generation: request.lease.generation,
      },
      prevEventHash: history.tail.recordHash,
      replay: history.entries[0].event.payload.replay,
      data: {
        priorTailDigest: history.tail.recordHash,
        sourceSessionId: request.lease.sessionId,
        resumeReason: request.resumeReason,
        continuedFromRunId: request.runId,
        compatibilityDecision: decision.compatibilityOutcome,
        recoveryReceiptRef: decision.decisionId,
      },
      eventId,
      streamId: history.tail.streamId,
      streamSequence: history.tail.streamSequence + 1,
      occurredAt: request.requestedAt,
      recordedAt: request.requestedAt,
      producer: this.#options.producer,
      authorityEpoch: this.#options.authorityEpoch,
      correlationId: `resume-${request.runId}`,
      causationId: history.entries.at(-1)?.event.event_id ?? null,
      idempotencyKey: request.idempotencyKey,
    }, this.#options.eventRegistry);
    if (existing.length === 1
      && existing[0].event.effective.envelope.event_id !== prepared.identity.eventId) {
      throw new TypeError('Resume idempotency key is already bound to different semantic bytes');
    }
    const authorization = await this.#options.gateway.authorize({
      requestId: `resume-auth-${sha256Bytes(canonicalBytes(request.idempotencyKey)).slice(0, 40)}`,
      mode: 'review',
      event: prepared,
      priorHead,
      priorStateVersion: this.#options.priorStateVersion,
      priorStateFingerprint: deepReviewProjectionIntegrityDigest(projection),
      actorId: this.#options.actorId,
      capabilityId: this.#options.capabilityId,
      authorityEpoch: this.#options.authorityEpoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: decision.decisionDigest,
    });
    if (authorization.verdict !== 'allow') {
      throw new TypeError(`Resume decision authorization was denied: ${authorization.reasonCode}`);
    }
    const appendReceipt = await this.#options.ledger.appendAuthorized(prepared, authorization.proof);
    let dispatchedPasses = 0;
    if (existing.length === 0
      && this.#options.enableDarkDispatch === true
      && this.#options.passDispatcher !== undefined
      && decision.compatibilityOutcome !== 'blocked'
      && decision.compatibilityOutcome !== 'pin-old-runtime') {
      for (const entry of executionPool) {
        await this.#options.passDispatcher.dispatch(entry);
        dispatchedPasses += 1;
      }
    }
    return Object.freeze({
      status: existing.length === 1 ? 'idempotent' : 'appended',
      decision,
      continuity,
      projection,
      checkpoint: folded.checkpoint,
      authenticatedTail: history.tail,
      executionPool,
      appendReceipt,
      dispatchedPasses,
    });
  }

  #assertRunLeaseAndCertificate(
    request: DeepReviewResumeRequest,
    projection: DeepReviewProjectionState,
    verification: Extract<DeepReviewOfflineVerificationResult, { readonly verdict: 'valid' }>,
  ): void {
    if (projection.run.runId !== request.runId
      || request.lease.runId !== request.runId
      || projection.run.sessionId !== request.lease.sessionId
      || projection.run.generation !== request.lease.generation
      || request.lease.replayFingerprint !== verification.replayFingerprint
      || request.persistedFingerprint.certificateDigest !== verification.certificateDigest) {
      throw new TypeError('Persisted lease does not match offline-verified run identity');
    }
  }
}
