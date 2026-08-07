// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Resume Adapter
// ───────────────────────────────────────────────────────────────────

import {
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  parseDeepAlignmentCertificateBundle,
  verifyDeepAlignmentCertificateOffline,
} from '../deep-alignment-certificates/index.js';
import {
  DeepAlignmentWireEventTypes,
  isDeepAlignmentEventStem,
  prepareDeepAlignmentEvent,
} from '../deep-alignment-ledger-schema/index.js';
import {
  DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION,
  DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  DEEP_ALIGNMENT_REDUCER_VERSION,
  assertDeepAlignmentProjectionState,
  deepAlignmentProjectionIntegrityDigest,
  foldDeepAlignmentEvents,
} from '../deep-alignment-reducers/index.js';
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
  DeepAlignmentOfflineVerificationResult,
} from '../deep-alignment-certificates/index.js';
import type {
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
} from '../deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentProjectionCheckpoint,
  DeepAlignmentProjectionState,
} from '../deep-alignment-reducers/index.js';
import type {
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  OperatorResolutionPayload,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DeepAlignmentAuthenticatedMigrationRegistry,
  DeepAlignmentAuthenticatedTail,
  DeepAlignmentCompatibilityComponentDecision,
  DeepAlignmentContinuityLadderRow,
  DeepAlignmentContinuityProjection,
  DeepAlignmentEffectResumeDecision,
  DeepAlignmentInvalidationDecision,
  DeepAlignmentManifestDisposition,
  DeepAlignmentMigrationRegistryEntry,
  DeepAlignmentBranchResumeDecision,
  DeepAlignmentPersistedRunLease,
  DeepAlignmentResumeAdapterOptions,
  DeepAlignmentResumeAdapterResult,
  DeepAlignmentResumeCompatibilityComponent,
  DeepAlignmentResumeCompatibilityOutcome,
  DeepAlignmentResumeDecision,
  DeepAlignmentResumeExecutionPoolEntry,
  DeepAlignmentResumeFingerprint,
  DeepAlignmentResumeRebuildReasonCode,
  DeepAlignmentResumeRequest,
  DeepAlignmentResumeReuseDisposition,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_ALIGNMENT_RESUME_ADAPTER_VERSION = 'deep-alignment-resume-adapter@1';

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+\-]{0,255}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const COMPONENTS: readonly DeepAlignmentResumeCompatibilityComponent[] = Object.freeze([
  'manifest',
  'authority',
  'target',
  'tool',
  'model',
  'verifier',
  'reducer',
  'adapter',
  'schema',
  'codec',
  'policy',
  'replay',
]);
const COMPATIBILITY_OUTCOMES: readonly DeepAlignmentResumeCompatibilityOutcome[] = Object.freeze([
  'exact', 'compatible', 'migrate', 'pin-old-runtime', 'blocked',
]);
const MIGRATION_REQUIRED_COMPONENTS = new Set<DeepAlignmentResumeCompatibilityComponent>([
  'manifest', 'authority', 'target', 'verifier', 'reducer', 'adapter', 'schema', 'codec',
  'policy', 'replay',
]);

export const DEEP_ALIGNMENT_CONTINUITY_LADDER: readonly DeepAlignmentContinuityLadderRow[] =
  Object.freeze([
    Object.freeze({
      step: 'init',
      eventFamilies: Object.freeze([
        'deep_alignment.run_initialized',
        'deep_alignment.run_resumed',
        'deep_alignment.run_restarted',
      ]),
      reducerFields: Object.freeze(['run', 'status', 'seenEvents']),
      reentryActions: Object.freeze(['reuse', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'authority',
      eventFamilies: Object.freeze([
        'deep_alignment.authority_reference_bound',
        'deep_alignment.authority_validation_recorded',
        'deep_alignment.authority_epoch_compatibility_recorded',
      ]),
      reducerFields: Object.freeze(['authorityAlignment', 'status.activeAuthorityEpochs']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'lane/scope',
      eventFamilies: Object.freeze([
        'deep_alignment.scope_resolved',
        'deep_alignment.lane_plan_recorded',
        'deep_alignment.lane_started',
        'deep_alignment.subject_snapshot_bound',
        'deep_alignment.applicability_evaluated',
        'deep_alignment.lane_completed',
      ]),
      reducerFields: Object.freeze(['reviewLoop', 'lanePlan', 'applicability']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'observation/evidence',
      eventFamilies: Object.freeze([
        'deep_alignment.observation_recorded',
        'deep_alignment.evidence_receipt_bound',
        'deep_alignment.observation_reconciled',
      ]),
      reducerFields: Object.freeze(['conformance.observations', 'proofWitness.evidenceReceipts']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'finding/proof',
      eventFamilies: Object.freeze([
        'deep_alignment.finding_candidate_emitted',
        'deep_alignment.finding_verification_recorded',
        'deep_alignment.proof_witness_recorded',
      ]),
      reducerFields: Object.freeze([
        'conformance.candidates',
        'conformance.verifications',
        'proofWitness.witnesses',
      ]),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'adjudication/deviation',
      eventFamilies: Object.freeze([
        'deep_alignment.claim_adjudication_recorded',
        'deep_alignment.conformance_assessment_recorded',
        'deep_alignment.known_deviation_recorded',
        'deep_alignment.known_deviation_invalidated',
      ]),
      reducerFields: Object.freeze(['conformance.findings', 'conformance.deviations']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reconcile', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'convergence',
      eventFamilies: Object.freeze([
        'deep_alignment.convergence_evaluated',
        'deep_alignment.graph_convergence_evaluated',
        'deep_alignment.blocked_stop_recorded',
      ]),
      reducerFields: Object.freeze(['reviewLoop.evaluations', 'reviewLoop.outcome', 'status']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'report/handoff',
      eventFamilies: Object.freeze([
        'deep_alignment.synthesis_started',
        'deep_alignment.review_report_committed',
        'deep_alignment.continuity_save_requested',
        'deep_alignment.continuity_save_completed',
        'deep_alignment.continuity_save_failed',
        'deep_alignment.run_completed',
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

function parseFingerprint(value: unknown, field: string): DeepAlignmentResumeFingerprint {
  if (!isRecord(value) || !hasExactKeys(value, [
    'fingerprintVersion',
    'manifestRevision',
    'authorityEpochId',
    'targetDigest',
    'toolVersion',
    'modelVersion',
    'verifierVersion',
    'reducerVersion',
    'adapterVersion',
    'schemaVersion',
    'codecVersion',
    'policyVersion',
    'replayFingerprint',
    'certificateDigest',
    'finalDigest',
  ])) throw new TypeError(`${field} must use the closed resume-fingerprint shape`);
  const parsed: DeepAlignmentResumeFingerprint = Object.freeze({
    fingerprintVersion: uint(value.fingerprintVersion, `${field}.fingerprintVersion`, 65_535),
    manifestRevision: token(value.manifestRevision, `${field}.manifestRevision`),
    authorityEpochId: token(value.authorityEpochId, `${field}.authorityEpochId`),
    targetDigest: digest(value.targetDigest, `${field}.targetDigest`),
    toolVersion: token(value.toolVersion, `${field}.toolVersion`),
    modelVersion: token(value.modelVersion, `${field}.modelVersion`),
    verifierVersion: token(value.verifierVersion, `${field}.verifierVersion`),
    reducerVersion: token(value.reducerVersion, `${field}.reducerVersion`),
    adapterVersion: token(value.adapterVersion, `${field}.adapterVersion`),
    schemaVersion: token(value.schemaVersion, `${field}.schemaVersion`),
    codecVersion: token(value.codecVersion, `${field}.codecVersion`),
    policyVersion: token(value.policyVersion, `${field}.policyVersion`),
    replayFingerprint: digest(value.replayFingerprint, `${field}.replayFingerprint`),
    certificateDigest: digest(value.certificateDigest, `${field}.certificateDigest`),
    finalDigest: digest(value.finalDigest, `${field}.finalDigest`),
  });
  if (deepAlignmentResumeFingerprintDigest(parsed) !== parsed.finalDigest) {
    throw new TypeError(`${field}.finalDigest does not commit the ordered fingerprint fields`);
  }
  return parsed;
}

function parseLease(value: unknown): DeepAlignmentPersistedRunLease {
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

function parseCheckpoint(value: unknown): DeepAlignmentProjectionCheckpoint | null {
  if (value === null) return null;
  if (!isRecord(value) || !hasExactKeys(value, [
    'projection', 'integrityDigest', 'sourceTailSequence', 'sourceTailEventDigest',
  ])) throw new TypeError('checkpoint must use the closed reducer checkpoint shape');
  assertDeepAlignmentProjectionState(value.projection);
  return Object.freeze({
    projection: value.projection as DeepAlignmentProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceTailSequence: uint(value.sourceTailSequence, 'checkpoint.sourceTailSequence'),
    sourceTailEventDigest: digest(value.sourceTailEventDigest, 'checkpoint.sourceTailEventDigest'),
  });
}

/** Parse one resume request with closed keys and kind-specific field rules. */
export function parseDeepAlignmentResumeRequest(input: unknown): DeepAlignmentResumeRequest {
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
    priorCertificateBundle: parseDeepAlignmentCertificateBundle(input.priorCertificateBundle),
  });
}

/** Commit the ordered resume facts instead of adopting a caller digest. */
export function deepAlignmentResumeFingerprintDigest(
  fingerprint: Omit<DeepAlignmentResumeFingerprint, 'finalDigest'> | DeepAlignmentResumeFingerprint,
): string {
  return sha256Bytes(canonicalBytes({
    fingerprintVersion: fingerprint.fingerprintVersion,
    manifestRevision: fingerprint.manifestRevision,
    authorityEpochId: fingerprint.authorityEpochId,
    targetDigest: fingerprint.targetDigest,
    toolVersion: fingerprint.toolVersion,
    modelVersion: fingerprint.modelVersion,
    verifierVersion: fingerprint.verifierVersion,
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
export function deepAlignmentMigrationRegistryDigest(
  registry: Omit<DeepAlignmentAuthenticatedMigrationRegistry, 'registryDigest'>
    | DeepAlignmentAuthenticatedMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    authorityEpoch: registry.authorityEpoch,
    entries: registry.entries,
  }));
}

function parseMigrationEntry(value: unknown, index: number): DeepAlignmentMigrationRegistryEntry {
  if (!isRecord(value) || !hasExactKeys(value, [
    'component', 'fromVersion', 'toVersion', 'outcome', 'revision',
  ])) throw new TypeError(`migrationRegistry.entries[${index}] must use the closed entry shape`);
  if (!COMPONENTS.includes(value.component as DeepAlignmentResumeCompatibilityComponent)) {
    throw new TypeError(`migrationRegistry.entries[${index}].component is unknown`);
  }
  if (value.outcome !== 'compatible'
    && value.outcome !== 'migrate'
    && value.outcome !== 'pin-old-runtime') {
    throw new TypeError(`migrationRegistry.entries[${index}].outcome is unknown`);
  }
  return Object.freeze({
    component: value.component as DeepAlignmentResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `migrationRegistry.entries[${index}].fromVersion`),
    toVersion: token(value.toVersion, `migrationRegistry.entries[${index}].toVersion`),
    outcome: value.outcome,
    revision: token(value.revision, `migrationRegistry.entries[${index}].revision`),
  });
}

function parseMigrationRegistry(input: unknown): DeepAlignmentAuthenticatedMigrationRegistry {
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

interface DeepAlignmentHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: DeepAlignmentLedgerEvent;
}

interface AuthenticatedHistory {
  readonly entries: readonly DeepAlignmentHistoryEntry[];
  readonly tail: DeepAlignmentAuthenticatedTail;
}

function eventForRun(
  verified: VerifiedLedgerEvent,
  runId: string,
): DeepAlignmentLedgerEvent | null {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isRecord(payload) || !isDeepAlignmentEventStem(payload.stem)) return null;
  const stem = payload.stem as DeepAlignmentEventStem;
  if (envelope.event_type !== DeepAlignmentWireEventTypes[stem]) {
    throw new TypeError('Verified Deep Alignment event type does not match its typed stem');
  }
  if (!isRecord(payload.scope) || payload.scope.runId !== runId) return null;
  return envelope as unknown as DeepAlignmentLedgerEvent;
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
    .filter((entry): entry is DeepAlignmentHistoryEntry => entry !== null);
  if (entries.length === 0 || entries[0].event.payload.stem !== 'deep_alignment.run_initialized') {
    throw new TypeError('Resume requires one authenticated run initialization event');
  }
  const streamId = entries[0].event.stream_id;
  let previousEventId: string | null = null;
  for (const [index, entry] of entries.entries()) {
    if (entry.event.stream_id !== streamId
      || entry.event.stream_sequence !== index + 1
      || (index > 0 && entry.event.causation_id !== previousEventId)) {
      throw new TypeError('Authenticated Deep Alignment stream contains a causal cursor gap or split');
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
  checkpoint: DeepAlignmentProjectionCheckpoint | null,
  history: AuthenticatedHistory,
): readonly DeepAlignmentResumeRebuildReasonCode[] {
  if (checkpoint === null) return [];
  if (checkpoint.sourceTailSequence > history.tail.streamSequence) return ['cursor-gap'];
  const prefix = history.entries
    .filter((entry) => entry.event.stream_sequence <= checkpoint.sourceTailSequence)
    .map((entry) => entry.event);
  if (checkpoint.sourceTailSequence > 0
    && prefix.at(-1)?.stream_sequence !== checkpoint.sourceTailSequence) return ['cursor-gap'];
  const expected = foldDeepAlignmentEvents(prefix, {
    sourceTailSequence: checkpoint.sourceTailSequence,
  });
  if (expected.outcome === 'rebuild_required') return expected.reasonCodes;
  if (deepAlignmentProjectionIntegrityDigest(expected.projection)
      !== deepAlignmentProjectionIntegrityDigest(checkpoint.projection)
    || expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || expected.checkpoint.sourceTailEventDigest !== checkpoint.sourceTailEventDigest) {
    return ['checkpoint-digest-mismatch'];
  }
  return [];
}

function verificationReason(
  result: Exclude<DeepAlignmentOfflineVerificationResult, { readonly verdict: 'valid' }>,
): DeepAlignmentResumeRebuildReasonCode {
  if (result.verdict === 'incomplete') return 'prior-certificate-incomplete';
  if (result.verdict === 'unverifiable') return 'prior-certificate-unverifiable';
  return 'prior-certificate-invalid';
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPATIBILITY AND INVALIDATION
// ───────────────────────────────────────────────────────────────────

function componentVersion(
  fingerprint: DeepAlignmentResumeFingerprint,
  component: DeepAlignmentResumeCompatibilityComponent,
): string {
  switch (component) {
    case 'manifest': return fingerprint.manifestRevision;
    case 'authority': return fingerprint.authorityEpochId;
    case 'target': return fingerprint.targetDigest;
    case 'tool': return fingerprint.toolVersion;
    case 'model': return fingerprint.modelVersion;
    case 'verifier': return fingerprint.verifierVersion;
    case 'reducer': return fingerprint.reducerVersion;
    case 'adapter': return fingerprint.adapterVersion;
    case 'schema': return fingerprint.schemaVersion;
    case 'codec': return fingerprint.codecVersion;
    case 'policy': return fingerprint.policyVersion;
    case 'replay': return fingerprint.replayFingerprint;
  }
}

function classifyCompatibility(
  request: DeepAlignmentResumeRequest,
  registry: DeepAlignmentAuthenticatedMigrationRegistry,
  registryAuthenticated: boolean,
  fingerprintVersionsKnown: boolean,
): {
  readonly outcome: DeepAlignmentResumeCompatibilityOutcome;
  readonly reuseDisposition: DeepAlignmentResumeReuseDisposition;
  readonly manifestDisposition: DeepAlignmentManifestDisposition;
  readonly decisions: readonly DeepAlignmentCompatibilityComponentDecision[];
} {
  const decisions = COMPONENTS.map((component): DeepAlignmentCompatibilityComponentDecision => {
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
  const outcome: DeepAlignmentResumeCompatibilityOutcome = outcomes.has('blocked')
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
  const manifestDisposition: DeepAlignmentManifestDisposition = !manifestChanged
    ? 'original'
    : manifestDecision?.outcome === 'migrate' || manifestDecision?.outcome === 'compatible'
      ? 'restart'
      : 'reject';
  const reuseDisposition: DeepAlignmentResumeReuseDisposition = outcome === 'exact'
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
  projection: DeepAlignmentProjectionState,
  request: DeepAlignmentResumeRequest,
  compatibility: DeepAlignmentResumeCompatibilityOutcome,
): DeepAlignmentInvalidationDecision {
  const targetChanged = request.persistedFingerprint.targetDigest
    !== request.currentFingerprint.targetDigest;
  const authorityChanged = request.persistedFingerprint.authorityEpochId
    !== request.currentFingerprint.authorityEpochId;
  const verifierChanged = request.persistedFingerprint.verifierVersion
    !== request.currentFingerprint.verifierVersion;
  const reopensState = targetChanged
    || authorityChanged
    || verifierChanged
    || compatibility === 'migrate'
    || request.persistedFingerprint.manifestRevision
      !== request.currentFingerprint.manifestRevision;
  return Object.freeze({
    targetChanged,
    authorityChanged,
    verifierChanged,
    reopenedLaneIds: Object.freeze(reopensState
      ? projection.lanePlan.lanes.map((lane) => lane.laneId).sort()
      : []),
    invalidatedFindingIds: Object.freeze(reopensState
      ? projection.conformance.findings.map((finding) => finding.findingId).sort()
      : []),
    reopenedObligationIds: Object.freeze(reopensState
      ? projection.reviewLoop.obligations.map((obligation) => obligation.obligationId).sort()
      : projection.reviewLoop.obligations
        .filter((obligation) => obligation.status !== 'resolved')
        .map((obligation) => obligation.obligationId)
        .sort()),
    reopenedProofIds: Object.freeze(reopensState
      ? projection.proofWitness.witnesses.map((witness) => witness.proofId).sort()
      : []),
    convergenceReopened: reopensState,
    reportReopened: reopensState,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. PASS, EFFECT, AND CONTINUITY PLANNING
// ───────────────────────────────────────────────────────────────────

function retryKey(manifestRevision: string, logicalBranchId: string): string {
  return `retry:${sha256Bytes(canonicalBytes({ manifestRevision, logicalBranchId }))}`;
}

function attemptId(kind: 'branch' | 'effect', identity: string, idempotencyKey: string): string {
  return `${kind}-attempt-${sha256Bytes(canonicalBytes({ identity, idempotencyKey })).slice(0, 40)}`;
}

function branchDecisions(
  projection: DeepAlignmentProjectionState,
  request: DeepAlignmentResumeRequest,
  compatibility: DeepAlignmentResumeCompatibilityOutcome,
  manifestDisposition: DeepAlignmentManifestDisposition,
  invalidation: DeepAlignmentInvalidationDecision,
): readonly DeepAlignmentBranchResumeDecision[] {
  const reopened = new Set(invalidation.reopenedLaneIds);
  return Object.freeze(projection.lanePlan.lanes.map((lane) => {
    const logicalBranchId = lane.laneId;
    const key = retryKey(request.manifestRevision, logicalBranchId);
    const blocked = compatibility === 'blocked'
      || compatibility === 'pin-old-runtime'
      || manifestDisposition === 'reject';
    const disposition = blocked
      ? 'reject' as const
      : manifestDisposition === 'restart'
        || reopened.has(lane.laneId)
        || lane.status === 'incomplete'
        ? 'reexecute' as const
        : lane.status === 'blocked'
          ? 'reconcile' as const
          : lane.status === 'complete'
            ? 'reuse' as const
            : 'reexecute' as const;
    return Object.freeze({
      logicalBranchId,
      iterationId: lane.iterationId,
      laneId: lane.laneId,
      authorityEpochId: projection.run.authorityEpochId ?? '',
      subjectSnapshotDigest: lane.subjectSnapshotDigest.length === 0
        ? null
        : lane.subjectSnapshotDigest,
      manifestRevision: request.manifestRevision,
      retryKey: key,
      disposition,
      attemptId: disposition === 'reexecute'
        ? attemptId('branch', `${request.manifestRevision}:${logicalBranchId}`, request.idempotencyKey)
        : null,
      evidenceEventIds: Object.freeze([
        lane.lanePlanEventId,
        lane.authorityValidationEventId,
        lane.producerEventId,
      ]),
      decisionReason: blocked
        ? 'Compatibility or manifest policy blocks lane execution.'
        : manifestDisposition === 'restart'
          ? 'A changed manifest requires a fresh logical lane attempt.'
          : reopened.has(lane.laneId)
            ? 'Verified authority, target, verifier, or runtime drift reopens this lane.'
            : lane.status === 'complete'
              ? 'The committed complete lane remains reusable.'
              : lane.status === 'blocked'
                ? 'The blocked lane requires explicit reconciliation.'
                : 'The lane did not reach a reusable committed completion.',
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
  request: DeepAlignmentResumeRequest,
  globallyBlocked: boolean,
): readonly DeepAlignmentEffectResumeDecision[] {
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
    let applicationState: DeepAlignmentEffectResumeDecision['applicationState'];
    let disposition: DeepAlignmentEffectResumeDecision['disposition'];
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
  projection: DeepAlignmentProjectionState,
  sourceTailSequence: number,
  invalidation: DeepAlignmentInvalidationDecision,
): DeepAlignmentContinuityProjection {
  const reports = projection.artifactIndex.artifacts.filter(
    (entry) => entry.artifactKind === 'review-report',
  );
  const saves = projection.artifactIndex.artifacts.filter(
    (entry) => entry.artifactKind === 'continuity-save',
  );
  const latestReport = reports.at(-1);
  const latestSave = saves.at(-1);
  const reportStarted = projection.status.provenance.some(
    (entry) => entry.producerStem === 'deep_alignment.synthesis_started',
  );
  const activeLane = [...projection.lanePlan.lanes]
    .reverse()
    .find((lane) => lane.status !== 'complete') ?? null;
  const activeObservation = [...projection.conformance.observations].at(-1) ?? null;
  const unresolvedObservationIds = projection.conformance.observations
    .filter((observation) => observation.freshness !== 'fresh'
      || !projection.conformance.reconciliations.some(
        (entry) => entry.observationId === observation.observationId,
      ))
    .map((observation) => observation.observationId)
    .sort();
  const unresolvedFindingIds = projection.conformance.findings
    .filter((finding) => finding.lifecycle === 'candidate'
      || finding.adjudicationOutcome === 'blocked'
      || finding.adjudicationOutcome === 'deferred')
    .map((finding) => finding.findingId)
    .sort();
  const unresolvedProofIds = projection.proofWitness.witnesses
    .filter((witness) => witness.outcome === 'inconclusive')
    .map((witness) => witness.proofId)
    .sort();
  const currentStep = latestSave !== undefined
    ? 'report/handoff' as const
    : latestReport !== undefined || reportStarted
      ? 'report/handoff' as const
      : projection.reviewLoop.evaluations.length > 0
        ? 'convergence' as const
        : projection.conformance.adjudications.length > 0
          || projection.conformance.deviations.length > 0
          ? 'adjudication/deviation' as const
          : projection.conformance.candidates.length > 0
            || projection.conformance.verifications.length > 0
            || projection.proofWitness.witnesses.length > 0
            ? 'finding/proof' as const
            : projection.conformance.observations.length > 0
              || projection.proofWitness.evidenceReceipts.length > 0
              ? 'observation/evidence' as const
              : projection.lanePlan.lanes.length > 0
                ? 'lane/scope' as const
                : projection.authorityAlignment.references.length > 0
                  ? 'authority' as const
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
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: projection.run.runId ?? '',
    sessionId: projection.run.sessionId ?? '',
    generation: projection.run.generation,
    authorityEpochId: projection.run.authorityEpochId,
    lastAppliedSeq: sourceTailSequence,
    seenEventIds: Object.freeze(projection.seenEvents.map((entry) => entry.eventId)),
    currentStep,
    initialized: projection.run.initializationEventId !== null,
    orderedLaneIds: Object.freeze(projection.lanePlan.plans.map((plan) => plan.laneId)),
    activeLaneId: activeLane?.laneId ?? null,
    activeSubjectId: activeObservation?.subjectId ?? null,
    activeRuleId: activeObservation?.ruleId ?? null,
    unresolvedObservationIds: Object.freeze(unresolvedObservationIds),
    unresolvedFindingIds: Object.freeze(unresolvedFindingIds),
    unresolvedProofIds: Object.freeze(unresolvedProofIds),
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

function assertClosedDecisionRecord(value: unknown): asserts value is DeepAlignmentResumeDecision {
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
    'branches',
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
    || !COMPATIBILITY_OUTCOMES.includes(
      value.compatibilityOutcome as DeepAlignmentResumeCompatibilityOutcome,
    )
    || !['original', 'restart', 'reject'].includes(String(value.manifestDisposition))
    || !Array.isArray(value.compatibility)
    || !Array.isArray(value.branches)
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
    if (!COMPONENTS.includes(entry.component as DeepAlignmentResumeCompatibilityComponent)
      || !COMPATIBILITY_OUTCOMES.includes(
        entry.outcome as DeepAlignmentResumeCompatibilityOutcome,
      )) {
      throw new TypeError(`compatibility[${index}] has an unknown discriminator`);
    }
    token(entry.persistedVersion, `compatibility[${index}].persistedVersion`);
    token(entry.installedVersion, `compatibility[${index}].installedVersion`);
    if (entry.revision !== null) token(entry.revision, `compatibility[${index}].revision`);
    prose(entry.decisionReason, `compatibility[${index}].decisionReason`);
  }
  for (const [index, entry] of value.branches.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'logicalBranchId', 'iterationId', 'laneId', 'authorityEpochId',
      'subjectSnapshotDigest', 'manifestRevision', 'retryKey', 'disposition',
      'attemptId', 'evidenceEventIds', 'decisionReason',
    ]) || !['reuse', 'reexecute', 'reconcile', 'reject'].includes(String(entry.disposition))
      || !Array.isArray(entry.evidenceEventIds)) {
      throw new TypeError(`branches[${index}] is not closed`);
    }
    token(entry.logicalBranchId, `branches[${index}].logicalBranchId`);
    token(entry.iterationId, `branches[${index}].iterationId`);
    token(entry.laneId, `branches[${index}].laneId`);
    token(entry.authorityEpochId, `branches[${index}].authorityEpochId`);
    if (entry.subjectSnapshotDigest !== null) {
      digest(entry.subjectSnapshotDigest, `branches[${index}].subjectSnapshotDigest`);
    }
    token(entry.manifestRevision, `branches[${index}].manifestRevision`);
    token(entry.retryKey, `branches[${index}].retryKey`);
    if (entry.attemptId !== null) token(entry.attemptId, `branches[${index}].attemptId`);
    entry.evidenceEventIds.forEach((eventId, eventIndex) => (
      token(eventId, `branches[${index}].evidenceEventIds[${eventIndex}]`)
    ));
    prose(entry.decisionReason, `branches[${index}].decisionReason`);
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
    'authorityChanged',
    'verifierChanged',
    'reopenedLaneIds',
    'invalidatedFindingIds',
    'reopenedObligationIds',
    'reopenedProofIds',
    'convergenceReopened',
    'reportReopened',
  ])) throw new TypeError('decision.invalidation is not closed');
  for (const field of [
    'reopenedLaneIds', 'invalidatedFindingIds', 'reopenedObligationIds', 'reopenedProofIds',
  ] as const) {
    const entries = value.invalidation[field];
    if (!Array.isArray(entries)) throw new TypeError(`decision.invalidation.${field} must be an array`);
    entries.forEach((entry, index) => (
      token(entry, `decision.invalidation.${field}[${index}]`)
    ));
  }
  for (const field of [
    'targetChanged',
    'authorityChanged',
    'verifierChanged',
    'convergenceReopened',
    'reportReopened',
  ] as const) {
    if (typeof value.invalidation[field] !== 'boolean') {
      throw new TypeError(`decision.invalidation.${field} must be boolean`);
    }
  }
}

/** Validate a decision at module boundaries and reject every unknown key. */
export function parseDeepAlignmentResumeDecision(input: unknown): DeepAlignmentResumeDecision {
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
export class DeepAlignmentResumeAdapter {
  readonly #options: DeepAlignmentResumeAdapterOptions;
  readonly #migrationRegistry: DeepAlignmentAuthenticatedMigrationRegistry;
  readonly #registryAuthenticated: boolean;

  public constructor(options: DeepAlignmentResumeAdapterOptions) {
    this.#options = options;
    this.#migrationRegistry = parseMigrationRegistry(options.migrationRegistry);
    this.#registryAuthenticated = (
      this.#migrationRegistry.authorityEpoch === options.authorityEpoch
      && deepAlignmentMigrationRegistryDigest(this.#migrationRegistry)
        === this.#migrationRegistry.registryDigest
      && this.#migrationRegistry.registryDigest === options.trustedMigrationRegistryDigest
    );
  }

  public async resume(input: unknown): Promise<DeepAlignmentResumeAdapterResult> {
    const request = parseDeepAlignmentResumeRequest(input);
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
          'certificate-frontier-mismatch' as DeepAlignmentResumeRebuildReasonCode,
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
          'certificate-frontier-mismatch' as DeepAlignmentResumeRebuildReasonCode,
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
    const certificateVerification = await verifyDeepAlignmentCertificateOffline({
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
    const folded = foldDeepAlignmentEvents(
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
    if (request.currentFingerprint.reducerVersion !== DEEP_ALIGNMENT_REDUCER_VERSION
      || request.currentFingerprint.adapterVersion !== DEEP_ALIGNMENT_RESUME_ADAPTER_VERSION
      || request.currentFingerprint.schemaVersion !== DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION
      || request.currentFingerprint.codecVersion !== DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION
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
    if (request.persistedFingerprint.authorityEpochId
        !== certificate.body.authorityEvidence.authorityEpochId
      || request.persistedFingerprint.verifierVersion
        !== certificate.body.convergenceEvidence.evaluatorFingerprint) {
      evidenceFailures.push('Persisted authority or verifier facts are not bound by the certificate.');
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
    const branches = branchDecisions(
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
      branches,
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
    const decision = parseDeepAlignmentResumeDecision(Object.freeze({
      ...decisionBody,
      decisionDigest: sha256Bytes(canonicalBytes(decisionBody)),
    }));
    const continuity = continuityProjection(
      projection,
      history.tail.streamSequence,
      invalidation,
    );
    const executionPool = Object.freeze(branches
      .filter((branch): branch is DeepAlignmentBranchResumeDecision & {
        readonly attemptId: string;
      } => (
        branch.disposition === 'reexecute' && branch.attemptId !== null
      ))
      .map((branch): DeepAlignmentResumeExecutionPoolEntry => Object.freeze({
        logicalBranchId: branch.logicalBranchId,
        iterationId: branch.iterationId,
        laneId: branch.laneId,
        authorityEpochId: branch.authorityEpochId,
        subjectSnapshotDigest: branch.subjectSnapshotDigest,
        manifestRevision: branch.manifestRevision,
        retryKey: branch.retryKey,
        attemptId: branch.attemptId,
      })));

    const existing = allVerified.filter((verified) => {
      const envelope = verified.event.effective.envelope;
      const payload = envelope.payload;
      return envelope.idempotency_key === request.idempotencyKey
        && isRecord(payload)
        && payload.stem === 'deep_alignment.run_resumed'
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
    const prepared = prepareDeepAlignmentEvent({
      stem: 'deep_alignment.run_resumed',
      scope: {
        runId: request.runId,
        sessionId: request.lease.sessionId,
        generation: request.lease.generation,
        authorityEpochId: request.currentFingerprint.authorityEpochId,
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
      mode: 'alignment',
      event: prepared,
      priorHead,
      priorStateVersion: this.#options.priorStateVersion,
      priorStateFingerprint: deepAlignmentProjectionIntegrityDigest(projection),
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
    let dispatchedBranches = 0;
    if (existing.length === 0
      && this.#options.enableDarkDispatch === true
      && this.#options.branchDispatcher !== undefined
      && decision.compatibilityOutcome !== 'blocked'
      && decision.compatibilityOutcome !== 'pin-old-runtime') {
      for (const entry of executionPool) {
        await this.#options.branchDispatcher.dispatch(entry);
        dispatchedBranches += 1;
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
      dispatchedBranches,
    });
  }

  #assertRunLeaseAndCertificate(
    request: DeepAlignmentResumeRequest,
    projection: DeepAlignmentProjectionState,
    verification: Extract<DeepAlignmentOfflineVerificationResult, { readonly verdict: 'valid' }>,
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
