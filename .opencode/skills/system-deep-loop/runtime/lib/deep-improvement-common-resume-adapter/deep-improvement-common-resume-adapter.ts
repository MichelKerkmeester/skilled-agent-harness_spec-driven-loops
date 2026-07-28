// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Resume Adapter
// ───────────────────────────────────────────────────────────────────

import {
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  verifyDeepImprovementCommonCertificateOffline,
} from '../deep-improvement-common-certificates/index.js';
import {
  DeepImprovementCommonWireEventTypes,
  isDeepImprovementCommonEventStem,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
  DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
  assertDeepImprovementCommonProjectionState,
  deepImprovementCommonProjectionIntegrityDigest,
  foldDeepImprovementCommonEvents,
} from '../deep-improvement-common-reducers/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  readDeepImprovementCommonArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
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

import type {
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationResult,
  DeepImprovementCommonTransitionKind,
  DeepImprovementCommonTransitionReceipt,
} from '../deep-improvement-common-certificates/index.js';
import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonProjectionCheckpoint,
  DeepImprovementCommonProjectionState,
  DeepImprovementCommonRebuildReasonCode,
} from '../deep-improvement-common-reducers/index.js';
import type {
  DeepImprovementCandidateInputMaterial,
  DeepImprovementEvaluatorCapsuleMaterial,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  OperatorResolutionPayload,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DeepImprovementCommonAuthenticatedTail,
  DeepImprovementCommonBranchResumeDecision,
  DeepImprovementCommonCompatibilityComponentDecision,
  DeepImprovementCommonContinuityLadderRow,
  DeepImprovementCommonContinuityProjection,
  DeepImprovementCommonEffectResumeDecision,
  DeepImprovementCommonInvalidationDecision,
  DeepImprovementCommonMigrationRegistry,
  DeepImprovementCommonMigrationRegistryEntry,
  DeepImprovementCommonOperationKind,
  DeepImprovementCommonPersistedRunLease,
  DeepImprovementCommonResumeAdapterOptions,
  DeepImprovementCommonResumeCompatibilityComponent,
  DeepImprovementCommonResumeComponentFact,
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeDisposition,
  DeepImprovementCommonResumeFingerprint,
  DeepImprovementCommonResumeRequest,
  DeepImprovementCommonResumeRebuildReasonCode,
  DeepImprovementCommonResumeResult,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_IMPROVEMENT_COMMON_RESUME_ADAPTER_VERSION =
  'deep-improvement-common-resume-adapter@1';

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+~-]{0,255}$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/u;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const COMPONENT_ORDER = Object.freeze([
  'tool',
  'model',
  'policy',
  'target',
  'schema',
] as const satisfies readonly DeepImprovementCommonResumeCompatibilityComponent[]);
const COMPONENT_OUTCOMES = Object.freeze([
  'exact',
  'compatible',
  'migrate',
  'pin-old-runtime',
  'incompatible',
] as const);
const RESUME_DISPOSITIONS = Object.freeze([
  'exact-reuse',
  'compatible',
  'migrate',
  'rebuild-required',
  'blocked',
] as const);

export const DEEP_IMPROVEMENT_COMMON_CONTINUITY_LADDER:
readonly DeepImprovementCommonContinuityLadderRow[] = Object.freeze([
  Object.freeze({
    step: 'run-identity',
    eventFamilies: Object.freeze([
      'deep_improvement_common.run_started',
      'deep_improvement_common.run_resumed',
    ]),
    reducerFields: Object.freeze(['run', 'seenEvents']),
    reentryActions: Object.freeze(['reuse', 'reject'] as const),
  }),
  Object.freeze({
    step: 'candidate-generation',
    eventFamilies: Object.freeze([
      'deep_improvement_common.candidate_proposed',
      'deep_improvement_common.candidate_generated',
      'deep_improvement_common.candidate_rejected',
      'deep_improvement_common.candidate_lineage_attached',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.candidates',
      'artifactIndex.candidates',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'evaluation',
    eventFamilies: Object.freeze([
      'deep_improvement_common.evaluation_epoch_sealed',
      'deep_improvement_common.evaluation_started',
      'deep_improvement_common.evaluation_observation_recorded',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.evaluatorEpochs',
      'artifactIndex.rawObservations',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'compensate', 'reject'] as const),
  }),
  Object.freeze({
    step: 'scoring',
    eventFamilies: Object.freeze([
      'deep_improvement_common.evaluation_normalized',
      'deep_improvement_common.evaluation_verification_requested',
      'deep_improvement_common.evaluation_verification_recorded',
      'deep_improvement_common.evaluation_inconclusive',
      'deep_improvement_common.evaluation_failed',
    ]),
    reducerFields: Object.freeze(['artifactIndex.derivedScores', 'modeStatus']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'canary',
    eventFamilies: Object.freeze([
      'deep_improvement_common.canary_suite_sealed',
      'deep_improvement_common.canary_executed',
      'deep_improvement_common.canary_gate_passed',
      'deep_improvement_common.canary_gate_failed',
      'deep_improvement_common.canary_vetoed',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.canaries',
      'iterationConvergence.hardVetoes',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'promotion',
    eventFamilies: Object.freeze([
      'deep_improvement_common.promotion_proposed',
      'deep_improvement_common.promotion_authorized',
      'deep_improvement_common.promotion_denied',
      'deep_improvement_common.promotion_shadow_started',
      'deep_improvement_common.promotion_canary_started',
      'deep_improvement_common.promotion_paused',
      'deep_improvement_common.promotion_aborted',
      'deep_improvement_common.promotion_baseline_restored',
      'deep_improvement_common.promotion_completed',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.promotions',
      'modeStatus',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'compensate', 'reject'] as const),
  }),
  Object.freeze({
    step: 'terminal-or-blocked',
    eventFamilies: Object.freeze([
      'deep_improvement_common.run_completed',
      'deep_improvement_common.run_aborted',
      'deep_improvement_common.run_quarantined',
    ]),
    reducerFields: Object.freeze([
      'run.state',
      'iterationConvergence.stopReason',
      'iterationConvergence.sessionOutcome',
    ]),
    reentryActions: Object.freeze(['reuse', 'reject'] as const),
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

function hasExactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const actual = Object.keys(value);
  const expected = new Set(keys);
  return actual.length === keys.length
    && actual.every((key) => expected.has(key));
}

function scanForbiddenKeys(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(scanForbiddenKeys);
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) {
      throw new TypeError(`Resume input contains forbidden key ${key}`);
    }
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
  if (
    typeof value !== 'string'
    || !TIMESTAMP_PATTERN.test(value)
    || Number.isNaN(Date.parse(value))
  ) {
    throw new TypeError(`${field} must be an RFC3339 UTC timestamp`);
  }
  return value;
}

function prose(value: unknown, field: string): string {
  if (
    typeof value !== 'string'
    || value.length === 0
    || value.length > 1_024
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value)
  ) {
    throw new TypeError(`${field} must be bounded prose`);
  }
  return value;
}

function uint(
  value: unknown,
  field: string,
  maximum = Number.MAX_SAFE_INTEGER,
): number {
  if (
    !Number.isSafeInteger(value)
    || Number(value) < 0
    || Number(value) > maximum
  ) {
    throw new TypeError(`${field} must be a bounded non-negative integer`);
  }
  return Number(value);
}

function parseComponentFact(
  value: unknown,
  field: string,
): DeepImprovementCommonResumeComponentFact {
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['component', 'version', 'digest'])
    || !COMPONENT_ORDER.includes(
      value.component as DeepImprovementCommonResumeCompatibilityComponent,
    )
  ) {
    throw new TypeError(`${field} must use the closed component-fact shape`);
  }
  return Object.freeze({
    component:
      value.component as DeepImprovementCommonResumeCompatibilityComponent,
    version: token(value.version, `${field}.version`),
    digest: digest(value.digest, `${field}.digest`),
  });
}

function parseComponentFacts(
  value: unknown,
  field: string,
): readonly DeepImprovementCommonResumeComponentFact[] {
  if (!Array.isArray(value) || value.length !== COMPONENT_ORDER.length) {
    throw new TypeError(`${field} must contain every compatibility component once`);
  }
  const parsed = value.map((entry, index) => (
    parseComponentFact(entry, `${field}[${index}]`)
  ));
  for (const [index, component] of COMPONENT_ORDER.entries()) {
    if (parsed[index]?.component !== component) {
      throw new TypeError(`${field} must use canonical component ordering`);
    }
  }
  return Object.freeze(parsed);
}

function parseMigrationEntry(
  value: unknown,
  field: string,
): DeepImprovementCommonMigrationRegistryEntry {
  if (
    !isRecord(value)
    || !hasExactKeys(value, [
      'component',
      'fromVersion',
      'fromDigest',
      'toVersion',
      'toDigest',
      'outcome',
      'revision',
    ])
    || !COMPONENT_ORDER.includes(
      value.component as DeepImprovementCommonResumeCompatibilityComponent,
    )
    || !['compatible', 'migrate', 'pin-old-runtime'].includes(
      String(value.outcome),
    )
  ) {
    throw new TypeError(`${field} must use the closed migration-entry shape`);
  }
  return Object.freeze({
    component:
      value.component as DeepImprovementCommonResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `${field}.fromVersion`),
    fromDigest: digest(value.fromDigest, `${field}.fromDigest`),
    toVersion: token(value.toVersion, `${field}.toVersion`),
    toDigest: digest(value.toDigest, `${field}.toDigest`),
    outcome: value.outcome as DeepImprovementCommonMigrationRegistryEntry['outcome'],
    revision: token(value.revision, `${field}.revision`),
  });
}

/** Commit an authenticated migration registry without its commitment field. */
export function deepImprovementCommonMigrationRegistryDigest(
  registry: Omit<DeepImprovementCommonMigrationRegistry, 'registryDigest'>
    | DeepImprovementCommonMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    entries: registry.entries,
  }));
}

/** Parse a migration registry and reject ambiguous or unauthenticated shapes. */
export function parseDeepImprovementCommonMigrationRegistry(
  input: unknown,
): DeepImprovementCommonMigrationRegistry {
  if (
    !isRecord(input)
    || !hasExactKeys(input, ['registryVersion', 'entries', 'registryDigest'])
    || input.registryVersion !== 1
    || !Array.isArray(input.entries)
    || input.entries.length > 64
  ) {
    throw new TypeError('Migration registry must use the closed versioned shape');
  }
  const entries = input.entries.map((entry, index) => (
    parseMigrationEntry(entry, `migrationRegistry.entries[${index}]`)
  ));
  const identities = entries.map((entry) => [
    entry.component,
    entry.fromVersion,
    entry.fromDigest,
    entry.toVersion,
    entry.toDigest,
  ].join('\u0000'));
  if (new Set(identities).size !== identities.length) {
    throw new TypeError('Migration registry contains an ambiguous duplicate identity');
  }
  const registry = Object.freeze({
    registryVersion: 1 as const,
    entries: Object.freeze(entries),
    registryDigest: digest(
      input.registryDigest,
      'migrationRegistry.registryDigest',
    ),
  });
  if (
    deepImprovementCommonMigrationRegistryDigest(registry)
    !== registry.registryDigest
  ) {
    throw new TypeError('Migration registry digest does not commit its entries');
  }
  return registry;
}

function parseLease(value: unknown): DeepImprovementCommonPersistedRunLease {
  if (
    !isRecord(value)
    || !hasExactKeys(value, [
      'runId',
      'leaseId',
      'lineageId',
      'generation',
      'deadlineAt',
      'remainingMs',
      'certificateDigest',
      'replayFingerprint',
    ])
  ) {
    throw new TypeError('Lease must use the closed persisted-run shape');
  }
  return Object.freeze({
    runId: token(value.runId, 'lease.runId'),
    leaseId: token(value.leaseId, 'lease.leaseId'),
    lineageId: token(value.lineageId, 'lease.lineageId'),
    generation: uint(value.generation, 'lease.generation', 0xffff_ffff),
    deadlineAt: timestamp(value.deadlineAt, 'lease.deadlineAt'),
    remainingMs: uint(value.remainingMs, 'lease.remainingMs'),
    certificateDigest: digest(
      value.certificateDigest,
      'lease.certificateDigest',
    ),
    replayFingerprint: digest(
      value.replayFingerprint,
      'lease.replayFingerprint',
    ),
  });
}

function parseCheckpoint(
  value: unknown,
): DeepImprovementCommonProjectionCheckpoint | null {
  if (value === null || value === undefined) return null;
  if (
    !isRecord(value)
    || !hasExactKeys(value, [
      'projection',
      'integrityDigest',
      'sourceTailSequence',
    ])
  ) {
    throw new TypeError('Checkpoint must use the closed reducer checkpoint shape');
  }
  assertDeepImprovementCommonProjectionState(value.projection);
  return Object.freeze({
    projection: value.projection,
    integrityDigest: digest(
      value.integrityDigest,
      'checkpoint.integrityDigest',
    ),
    sourceTailSequence: uint(
      value.sourceTailSequence,
      'checkpoint.sourceTailSequence',
    ),
  });
}

/** Parse one resume request while leaving certificate authority to the verifier. */
export function parseDeepImprovementCommonResumeRequest(
  input: unknown,
): DeepImprovementCommonResumeRequest {
  scanForbiddenKeys(input);
  const legacyKeys = [
    'runId',
    'idempotencyKey',
    'requestedAt',
    'resumeReason',
    'currentInputs',
    'migrationRegistry',
    'lease',
    'priorRunBundle',
  ];
  const checkpointKeys = [
    ...legacyKeys.slice(0, -1),
    'checkpoint',
    'priorRunBundle',
  ];
  if (
    !isRecord(input)
    || (
      !hasExactKeys(input, legacyKeys)
      && !hasExactKeys(input, checkpointKeys)
    )
    || !isRecord(input.priorRunBundle)
  ) {
    throw new TypeError('Resume request must use the closed request shape');
  }
  return Object.freeze({
    runId: token(input.runId, 'runId'),
    idempotencyKey: token(input.idempotencyKey, 'idempotencyKey'),
    requestedAt: timestamp(input.requestedAt, 'requestedAt'),
    resumeReason: prose(input.resumeReason, 'resumeReason'),
    currentInputs: parseComponentFacts(input.currentInputs, 'currentInputs'),
    migrationRegistry: parseDeepImprovementCommonMigrationRegistry(
      input.migrationRegistry,
    ),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    priorRunBundle:
      input.priorRunBundle as unknown as DeepImprovementCommonCertificateBundle,
  });
}

/** Commit every ordered real input except the commitment itself. */
export function deepImprovementCommonResumeFingerprintDigest(
  fingerprint: Omit<DeepImprovementCommonResumeFingerprint, 'finalDigest'>
    | DeepImprovementCommonResumeFingerprint,
): string {
  return sha256Bytes(canonicalBytes({
    fingerprintVersion: fingerprint.fingerprintVersion,
    runId: fingerprint.runId,
    certificateDigest: fingerprint.certificateDigest,
    replayFingerprint: fingerprint.replayFingerprint,
    reducerVersion: fingerprint.reducerVersion,
    adapterVersion: fingerprint.adapterVersion,
    schemaVersion: fingerprint.schemaVersion,
    codecVersion: fingerprint.codecVersion,
    artifactSetDigest: fingerprint.artifactSetDigest,
    receiptChainDigest: fingerprint.receiptChainDigest,
    componentFacts: fingerprint.componentFacts,
  }));
}

function createFingerprint(
  runId: string,
  certificateDigest: string,
  replayFingerprint: string,
  artifactSetDigest: string,
  receiptChainDigest: string,
  componentFacts: readonly DeepImprovementCommonResumeComponentFact[],
): DeepImprovementCommonResumeFingerprint {
  const body = Object.freeze({
    fingerprintVersion: 1 as const,
    runId,
    certificateDigest,
    replayFingerprint,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    adapterVersion: DEEP_IMPROVEMENT_COMMON_RESUME_ADAPTER_VERSION,
    schemaVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    codecVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_CODEC_VERSION,
    artifactSetDigest,
    receiptChainDigest,
    componentFacts,
  });
  return Object.freeze({
    ...body,
    finalDigest: deepImprovementCommonResumeFingerprintDigest(body),
  });
}

function parseFingerprint(
  value: unknown,
  field: string,
): DeepImprovementCommonResumeFingerprint | null {
  if (value === null) return null;
  if (
    !isRecord(value)
    || !hasExactKeys(value, [
      'fingerprintVersion',
      'runId',
      'certificateDigest',
      'replayFingerprint',
      'reducerVersion',
      'adapterVersion',
      'schemaVersion',
      'codecVersion',
      'artifactSetDigest',
      'receiptChainDigest',
      'componentFacts',
      'finalDigest',
    ])
    || value.fingerprintVersion !== 1
  ) {
    throw new TypeError(`${field} must use the closed fingerprint shape`);
  }
  const parsed: DeepImprovementCommonResumeFingerprint = Object.freeze({
    fingerprintVersion: 1,
    runId: token(value.runId, `${field}.runId`),
    certificateDigest: digest(
      value.certificateDigest,
      `${field}.certificateDigest`,
    ),
    replayFingerprint: digest(
      value.replayFingerprint,
      `${field}.replayFingerprint`,
    ),
    reducerVersion: token(value.reducerVersion, `${field}.reducerVersion`),
    adapterVersion: token(value.adapterVersion, `${field}.adapterVersion`),
    schemaVersion: token(value.schemaVersion, `${field}.schemaVersion`),
    codecVersion: token(value.codecVersion, `${field}.codecVersion`),
    artifactSetDigest: digest(
      value.artifactSetDigest,
      `${field}.artifactSetDigest`,
    ),
    receiptChainDigest: digest(
      value.receiptChainDigest,
      `${field}.receiptChainDigest`,
    ),
    componentFacts: parseComponentFacts(
      value.componentFacts,
      `${field}.componentFacts`,
    ),
    finalDigest: digest(value.finalDigest, `${field}.finalDigest`),
  });
  if (
    deepImprovementCommonResumeFingerprintDigest(parsed)
    !== parsed.finalDigest
  ) {
    throw new TypeError(`${field}.finalDigest does not commit the real inputs`);
  }
  return parsed;
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFIED LEDGER RECONSTRUCTION
// ───────────────────────────────────────────────────────────────────

interface AuthenticatedHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: DeepImprovementCommonLedgerEvent;
}

interface AuthenticatedHistory {
  readonly entries: readonly AuthenticatedHistoryEntry[];
  readonly tail: DeepImprovementCommonAuthenticatedTail;
}

class ResumeIntegrityError extends TypeError {
  public readonly reasonCode: DeepImprovementCommonResumeRebuildReasonCode;

  public constructor(
    reasonCode: DeepImprovementCommonResumeRebuildReasonCode,
    message: string,
  ) {
    super(message);
    this.name = 'ResumeIntegrityError';
    this.reasonCode = reasonCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function canonicalDigest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function typedEventForRun(
  verified: VerifiedLedgerEvent,
  runId: string,
): DeepImprovementCommonLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (
    !isRecord(payload)
    || !isDeepImprovementCommonEventStem(payload.stem)
    || envelope.event_type
      !== DeepImprovementCommonWireEventTypes[
        payload.stem as DeepImprovementCommonEventStem
      ]
    || !isRecord(payload.scope)
    || payload.scope.runId !== runId
  ) {
    throw new ResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay contains a foreign or malformed event',
    );
  }
  return envelope as DeepImprovementCommonLedgerEvent;
}

function authenticatedHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  projectionEvents: readonly DeepImprovementCommonLedgerEvent[],
  runId: string,
  rangeStartSequence: number,
  rangeEndSequence: number,
): AuthenticatedHistory {
  if (
    !Number.isSafeInteger(rangeStartSequence)
    || !Number.isSafeInteger(rangeEndSequence)
    || rangeStartSequence < 1
    || rangeEndSequence < rangeStartSequence
  ) {
    throw new ResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay range is invalid',
    );
  }
  const covered = verifiedEvents.slice(
    rangeStartSequence - 1,
    rangeEndSequence,
  );
  if (covered.length !== rangeEndSequence - rangeStartSequence + 1) {
    throw new ResumeIntegrityError(
      'cursor-gap',
      'Authenticated replay contains a ledger cursor gap',
    );
  }
  const entries = covered.map((verified, index) => {
    if (verified.frame.sequence !== rangeStartSequence + index) {
      throw new ResumeIntegrityError(
        'cursor-gap',
        'Authenticated replay is out of ledger order',
      );
    }
    return Object.freeze({
      verified,
      event: typedEventForRun(verified, runId),
    });
  });
  const events = entries.map((entry) => entry.event);
  if (canonicalDigest(events) !== canonicalDigest(projectionEvents)) {
    throw new ResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay differs from the requested projection events',
    );
  }
  const first = entries[0];
  const last = entries.at(-1);
  if (
    first === undefined
    || last === undefined
    || first.event.payload.stem !== 'deep_improvement_common.run_started'
  ) {
    throw new ResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay lacks the run genesis event',
    );
  }
  const streamId = first.event.stream_id;
  for (const [index, entry] of entries.entries()) {
    const previous = entries[index - 1];
    if (
      entry.event.stream_id !== streamId
      || entry.event.stream_sequence !== index + 1
      || entry.event.causation_id !== (previous?.event.event_id ?? null)
    ) {
      throw new ResumeIntegrityError(
        'cursor-gap',
        'Authenticated replay contains a causal cursor gap or stream split',
      );
    }
  }
  return Object.freeze({
    entries: Object.freeze(entries),
    tail: Object.freeze({
      ledgerId: last.verified.frame.ledger_id,
      rangeStartSequence,
      rangeEndSequence,
      startHeadHash: first.verified.frame.prev_record_hash,
      finalHeadHash: last.verified.frame.record_hash,
      streamId,
      streamSequence: last.event.stream_sequence,
      eventCount: entries.length,
    }),
  });
}

function validateCheckpoint(
  checkpoint: DeepImprovementCommonProjectionCheckpoint | null,
  history: AuthenticatedHistory,
): readonly DeepImprovementCommonRebuildReasonCode[] {
  if (checkpoint === null) return Object.freeze([]);
  if (checkpoint.sourceTailSequence > history.tail.streamSequence) {
    return Object.freeze(['cursor-gap']);
  }
  const prefix = history.entries
    .filter((entry) => (
      entry.event.stream_sequence <= checkpoint.sourceTailSequence
    ))
    .map((entry) => entry.event);
  if (
    checkpoint.sourceTailSequence > 0
    && prefix.at(-1)?.stream_sequence !== checkpoint.sourceTailSequence
  ) {
    return Object.freeze(['cursor-gap']);
  }
  const expected = foldDeepImprovementCommonEvents(prefix, {
    sourceTailSequence: checkpoint.sourceTailSequence,
  });
  if (expected.outcome !== 'projected') return expected.reasonCodes;
  if (
    expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || deepImprovementCommonProjectionIntegrityDigest(expected.projection)
      !== deepImprovementCommonProjectionIntegrityDigest(checkpoint.projection)
  ) {
    return Object.freeze(['checkpoint-digest-mismatch']);
  }
  return Object.freeze([]);
}

// ───────────────────────────────────────────────────────────────────
// 4. VERIFIED PRIOR FACTS AND COMPATIBILITY
// ───────────────────────────────────────────────────────────────────

async function priorComponentFacts(
  bundle: DeepImprovementCommonCertificateBundle,
  projection: DeepImprovementCommonProjectionState,
  options: DeepImprovementCommonResumeAdapterOptions,
): Promise<readonly DeepImprovementCommonResumeComponentFact[]> {
  const candidateClaim = bundle.certificate.body.artifactClaims.find(
    (claim) => (
      claim.binding.artifactKind
      === DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT
    ),
  );
  const evaluatorClaim = bundle.certificate.body.artifactClaims.find(
    (claim) => (
      claim.binding.artifactKind
      === DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE
    ),
  );
  if (candidateClaim === undefined || evaluatorClaim === undefined) {
    throw new TypeError('Verified certificate lacks required common input claims');
  }
  const candidate = await readDeepImprovementCommonArtifact(
    options.verification.artifactStore,
    candidateClaim.binding,
    {
      consumer: 'deep-improvement-common',
      accessRole: 'evaluator',
      requiredEvaluationEpochId: bundle.certificate.body.evaluatorEpochId,
    },
  );
  const evaluator = await readDeepImprovementCommonArtifact(
    options.verification.artifactStore,
    evaluatorClaim.binding,
    {
      consumer: 'deep-improvement-common',
      accessRole: 'evaluator',
      requiredEvaluationEpochId: bundle.certificate.body.evaluatorEpochId,
    },
  );
  const candidateMaterial =
    candidate.material as DeepImprovementCandidateInputMaterial;
  const evaluatorMaterial =
    evaluator.material as DeepImprovementEvaluatorCapsuleMaterial;
  const candidateProjection = projection.artifactIndex.candidates.find(
    (entry) => entry.candidateId === bundle.certificate.body.candidateId,
  );
  if (candidateProjection === undefined) {
    throw new TypeError('Verified certificate candidate has no reducer-owned target facts');
  }
  return Object.freeze([
    Object.freeze({
      component: 'tool' as const,
      version: candidateMaterial.producerVersion,
      digest: candidateMaterial.toolConfigurationDigest,
    }),
    Object.freeze({
      component: 'model' as const,
      version: candidateMaterial.producerVersion,
      digest: candidateMaterial.modelConfigurationDigest,
    }),
    Object.freeze({
      component: 'policy' as const,
      version: evaluatorMaterial.producerVersion,
      digest: evaluatorMaterial.policyDigest,
    }),
    Object.freeze({
      component: 'target' as const,
      version: candidateMaterial.mutationOperatorVersion,
      digest: candidateProjection.targetDigest,
    }),
    Object.freeze({
      component: 'schema' as const,
      version: evaluatorMaterial.schemaVersion,
      digest: evaluatorMaterial.evaluatorSchemaDigest,
    }),
  ]);
}

function classifyCompatibility(
  persisted: readonly DeepImprovementCommonResumeComponentFact[],
  installed: readonly DeepImprovementCommonResumeComponentFact[],
  registry: DeepImprovementCommonMigrationRegistry,
): readonly DeepImprovementCommonCompatibilityComponentDecision[] {
  return Object.freeze(COMPONENT_ORDER.map((component, index) => {
    const prior = persisted[index] as DeepImprovementCommonResumeComponentFact;
    const current = installed[index] as DeepImprovementCommonResumeComponentFact;
    if (prior.component !== component || current.component !== component) {
      throw new TypeError('Compatibility facts lost canonical component ordering');
    }
    if (
      prior.version === current.version
      && prior.digest === current.digest
    ) {
      return Object.freeze({
        component,
        persistedVersion: prior.version,
        persistedDigest: prior.digest,
        installedVersion: current.version,
        installedDigest: current.digest,
        outcome: 'exact' as const,
        revision: null,
        decisionReason: 'Persisted and installed facts are byte-identical.',
      });
    }
    const migration = registry.entries.find((entry) => (
      entry.component === component
      && entry.fromVersion === prior.version
      && entry.fromDigest === prior.digest
      && entry.toVersion === current.version
      && entry.toDigest === current.digest
    ));
    if (migration === undefined) {
      return Object.freeze({
        component,
        persistedVersion: prior.version,
        persistedDigest: prior.digest,
        installedVersion: current.version,
        installedDigest: current.digest,
        outcome: 'incompatible' as const,
        revision: null,
        decisionReason: 'No authenticated migration entry covers the real fact pair.',
      });
    }
    return Object.freeze({
      component,
      persistedVersion: prior.version,
      persistedDigest: prior.digest,
      installedVersion: current.version,
      installedDigest: current.digest,
      outcome: migration.outcome,
      revision: migration.revision,
      decisionReason: 'An authenticated migration entry covers the real fact pair.',
    });
  }));
}

function aggregateDisposition(
  compatibility: readonly DeepImprovementCommonCompatibilityComponentDecision[],
): DeepImprovementCommonResumeDisposition {
  const outcomes = new Set(compatibility.map((entry) => entry.outcome));
  if (outcomes.has('pin-old-runtime')) return 'blocked';
  if (outcomes.has('incompatible')) return 'rebuild-required';
  if (outcomes.has('migrate')) return 'migrate';
  if (outcomes.has('compatible')) return 'compatible';
  return 'exact-reuse';
}

function compatibilityOutcome(
  disposition: DeepImprovementCommonResumeDisposition,
) {
  switch (disposition) {
    case 'exact-reuse': return 'exact' as const;
    case 'compatible': return 'compatible' as const;
    case 'migrate': return 'migrate' as const;
    case 'rebuild-required':
    case 'blocked':
      return 'blocked' as const;
  }
}

function hasDurableResumeTrust(
  bundle: DeepImprovementCommonCertificateBundle,
): boolean {
  return bundle.certificate.sharedCertificationReceipt.certification.trust_scope
      === 'durable-cross-resume'
    && bundle.receipts.every((receipt) => (
      receipt.sharedReceipt.certification.trust_scope === 'durable-cross-resume'
    ));
}

// ───────────────────────────────────────────────────────────────────
// 5. BRANCH, EFFECT, AND CONTINUITY PLANNING
// ───────────────────────────────────────────────────────────────────

function operationKind(
  transitionKind: DeepImprovementCommonTransitionKind,
): DeepImprovementCommonOperationKind {
  switch (transitionKind) {
    case 'candidate-generated':
      return 'candidate-generation';
    case 'evaluator-epoch-established':
    case 'evaluation-started':
      return 'evaluation';
    case 'candidate-scored':
      return 'scoring';
    case 'canary-checked':
      return 'canary';
    case 'promotion-proposed':
    case 'promotion-authorized':
    case 'promotion-blocked':
    case 'guarded-promotion':
      return 'promotion';
    case 'aborted':
    case 'restored':
      return 'terminal';
  }
}

function branchDecisions(
  receipts: readonly DeepImprovementCommonTransitionReceipt[],
  disposition: DeepImprovementCommonResumeDisposition,
): readonly DeepImprovementCommonBranchResumeDecision[] {
  return Object.freeze(receipts.map((receipt) => {
    const rejected = disposition === 'blocked'
      || disposition === 'rebuild-required';
    const requiresReexecution = disposition === 'migrate'
      || receipt.facts.outcome === 'uncertain'
      || receipt.facts.uncertaintyState === 'unknown-effect';
    const branchDisposition = rejected
      ? 'reject' as const
      : requiresReexecution
        ? 'reexecute' as const
        : 'reuse' as const;
    return Object.freeze({
      logicalOperationId: receipt.facts.logicalOperationId,
      operationKind: operationKind(receipt.facts.transitionKind),
      receiptIdentityDigest: receipt.facts.identity.digest,
      disposition: branchDisposition,
      evidenceEventIds: Object.freeze([receipt.facts.resultEventId]),
      decisionReason: rejected
        ? 'Compatibility or trust policy blocks prior operation reuse.'
        : requiresReexecution
          ? 'Migration or uncertain effect state requires a fresh logical attempt.'
          : 'Offline-verified receipt evidence preserves this branch-local result.',
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

function effectHistory(
  events: readonly VerifiedLedgerEvent[],
  runId: string,
): EffectHistory {
  const intents: Array<EffectHistory['intents'][number]> = [];
  const confirmations: EffectConfirmationPayload[] = [];
  const recoveries: EffectRecoveryStartedPayload[] = [];
  const reconciliations: EffectReconciledPayload[] = [];
  const conflicts: EffectConflictPayload[] = [];
  const resolutions: OperatorResolutionPayload[] = [];
  for (const verified of events) {
    const envelope = verified.event.effective.envelope;
    const payload = envelope.payload;
    if (
      envelope.event_type === EFFECT_INTENT_EVENT_TYPE
      && payload.run_id === runId
    ) {
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
    } else if (
      envelope.event_type === EFFECT_CONFLICT_EVENT_TYPE
      && payload.run_id === runId
    ) {
      conflicts.push(payload as EffectConflictPayload);
    } else if (envelope.event_type === EFFECT_OPERATOR_RESOLVED_EVENT_TYPE) {
      resolutions.push(payload as OperatorResolutionPayload);
    }
  }
  return { intents, confirmations, recoveries, reconciliations, conflicts, resolutions };
}

function effectDecisions(
  history: EffectHistory,
  globallyBlocked: boolean,
): readonly DeepImprovementCommonEffectResumeDecision[] {
  return Object.freeze(history.intents.map((intentRecord) => {
    const intent = intentRecord.payload;
    const confirmation = history.confirmations.find((candidate) => (
      effectConfirmationBindsIntent(
        candidate,
        intent,
        intentRecord.eventId,
        intentRecord.eventDigest,
      )
    ));
    const recoveries = history.recoveries.filter((candidate) => (
      candidate.intent_event_id === intentRecord.eventId
      && candidate.intent_event_digest === intentRecord.eventDigest
    ));
    const reconciliations = history.reconciliations.filter((candidate) => (
      candidate.intent_event_id === intentRecord.eventId
      && recoveries.some((recovery) => (
        recovery.recovery_id === candidate.recovery_id
      ))
    ));
    const resolutions = history.resolutions.filter((candidate) => (
      candidate.intent_event_id === intentRecord.eventId
      && recoveries.some((recovery) => (
        recovery.recovery_id === candidate.recovery_id
      ))
    ));
    const latestReconciliation = reconciliations.at(-1);
    const latestResolution = resolutions.at(-1);
    const hasConflict = history.conflicts.some((candidate) => (
      candidate.existing_intent_event_id === intentRecord.eventId
    ));
    let applicationState:
    DeepImprovementCommonEffectResumeDecision['applicationState'] = 'unknown';
    let disposition: DeepImprovementCommonEffectResumeDecision['disposition'];
    let decisionReason: string;
    if (globallyBlocked || hasConflict) {
      disposition = 'blocked';
      decisionReason = 'Compatibility, trust, or an immutable conflict blocks recovery.';
    } else if (confirmation !== undefined) {
      applicationState = 'applied';
      disposition = 'reuse';
      decisionReason = 'The shared seven-fact confirmation binds the durable intent.';
    } else if (latestResolution?.resolution === 'terminal_failed') {
      disposition = 'compensate';
      decisionReason = 'Operator evidence records terminal failure requiring compensation.';
    } else if (latestReconciliation?.verdict === 'not_applied') {
      applicationState = 'not-applied';
      disposition = intent.adapter.replay_safe ? 'reexecute' : 'blocked';
      decisionReason = intent.adapter.replay_safe
        ? 'Reconciliation proves non-application and the adapter is replay-safe.'
        : 'Reconciliation proves non-application but replay is not safe.';
    } else if (latestReconciliation?.verdict === 'applied') {
      disposition = 'reconcile';
      decisionReason = 'Recovery evidence reports application but still needs bound confirmation.';
    } else if (
      latestReconciliation?.verdict === 'conflict'
      || latestReconciliation?.verdict === 'in_doubt'
    ) {
      disposition = 'blocked';
      decisionReason = 'Recovery evidence leaves the external outcome conflicting or uncertain.';
    } else if (intent.adapter.reconciliation === 'conclusive') {
      disposition = 'reconcile';
      decisionReason = 'The descriptor supports conclusive recovery of the unknown outcome.';
    } else if (intent.adapter.replay_safe) {
      disposition = 'reexecute';
      decisionReason = 'The unknown outcome is replay-safe under its stable target key.';
    } else {
      disposition = 'blocked';
      decisionReason = 'An irreversible unknown outcome has no conclusive recovery path.';
    }
    return Object.freeze({
      effectId: intent.effect_id,
      logicalEffectId: intent.logical_effect_id,
      applicationState,
      disposition,
      intentEventId: intentRecord.eventId,
      evidenceRefs: Object.freeze([
        intentRecord.eventId,
        ...recoveries.map((entry) => entry.recovery_id),
        ...reconciliations.map((entry) => entry.recovery_id),
        ...resolutions.map((entry) => entry.resolution_id),
        ...(confirmation === undefined ? [] : [confirmation.confirmation_id]),
      ]),
      decisionReason,
    });
  }));
}

function continuityProjection(
  projection: DeepImprovementCommonProjectionState,
  sourceTailSequence: number,
): DeepImprovementCommonContinuityProjection {
  const commonStatus = projection.modeStatus.statuses.find((entry) => (
    entry.workstream === 'deep-improvement-common'
  ));
  const terminal = projection.run.state === 'completed'
    || projection.run.state === 'aborted'
    || projection.run.state === 'quarantined'
    || commonStatus?.terminal === true;
  const currentStep = terminal
    ? 'terminal-or-blocked' as const
    : projection.iterationConvergence.promotions.length > 0
      ? 'promotion' as const
      : projection.iterationConvergence.canaries.length > 0
        ? 'canary' as const
        : projection.artifactIndex.derivedScores.length > 0
          ? 'scoring' as const
          : projection.iterationConvergence.evaluatorEpochs.length > 0
            ? 'evaluation' as const
            : projection.iterationConvergence.candidates.length > 0
              ? 'candidate-generation' as const
              : 'run-identity' as const;
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: projection.run.runId ?? '',
    lineageId: projection.run.lineageId ?? '',
    generation: projection.run.generation,
    lastAppliedSeq: sourceTailSequence,
    seenEventIds: Object.freeze(
      projection.seenEvents.map((entry) => entry.eventId),
    ),
    currentStep,
    runState: projection.run.state,
    candidateIds: Object.freeze(
      projection.iterationConvergence.candidates.map((entry) => entry.candidateId),
    ),
    evaluatorEpochIds: Object.freeze(
      projection.iterationConvergence.evaluatorEpochs.map(
        (entry) => entry.evaluationEpochId,
      ),
    ),
    scoredCandidateIds: Object.freeze(
      projection.artifactIndex.derivedScores.map((entry) => entry.candidateId),
    ),
    canaryEpochIds: Object.freeze(
      projection.iterationConvergence.canaries.map((entry) => entry.canaryEpochId),
    ),
    promotionIds: Object.freeze(
      projection.iterationConvergence.promotions.map((entry) => entry.promotionId),
    ),
    terminal,
    blockingVetoCodes: Object.freeze(commonStatus?.blockingVetoCodes ?? []),
  });
}

function invalidationDecision(
  compatibility: readonly DeepImprovementCommonCompatibilityComponentDecision[],
  branches: readonly DeepImprovementCommonBranchResumeDecision[],
  effects: readonly DeepImprovementCommonEffectResumeDecision[],
  disposition: DeepImprovementCommonResumeDisposition,
): DeepImprovementCommonInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze(compatibility
      .filter((entry) => entry.outcome !== 'exact')
      .map((entry) => entry.component)),
    invalidatedOperationIds: Object.freeze(branches
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.logicalOperationId)),
    recoveryRequiredEffectIds: Object.freeze(effects
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.effectId)),
    rebuildRequired: disposition === 'rebuild-required',
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. DECISION VALIDATION
// ───────────────────────────────────────────────────────────────────

function assertDecisionCollections(value: Record<string, unknown>): void {
  if (
    !Array.isArray(value.compatibility)
    || !Array.isArray(value.branches)
    || !Array.isArray(value.effects)
  ) {
    throw new TypeError('Resume decision collections must be arrays');
  }
  for (const [index, entry] of value.compatibility.entries()) {
    if (
      !isRecord(entry)
      || !hasExactKeys(entry, [
        'component',
        'persistedVersion',
        'persistedDigest',
        'installedVersion',
        'installedDigest',
        'outcome',
        'revision',
        'decisionReason',
      ])
      || !COMPONENT_ORDER.includes(
        entry.component as DeepImprovementCommonResumeCompatibilityComponent,
      )
      || !COMPONENT_OUTCOMES.includes(
        entry.outcome as typeof COMPONENT_OUTCOMES[number],
      )
    ) {
      throw new TypeError(`compatibility[${index}] is not closed`);
    }
    token(entry.persistedVersion, `compatibility[${index}].persistedVersion`);
    digest(entry.persistedDigest, `compatibility[${index}].persistedDigest`);
    token(entry.installedVersion, `compatibility[${index}].installedVersion`);
    digest(entry.installedDigest, `compatibility[${index}].installedDigest`);
    if (entry.revision !== null) {
      token(entry.revision, `compatibility[${index}].revision`);
    }
    prose(entry.decisionReason, `compatibility[${index}].decisionReason`);
  }
  for (const [index, entry] of value.branches.entries()) {
    if (
      !isRecord(entry)
      || !hasExactKeys(entry, [
        'logicalOperationId',
        'operationKind',
        'receiptIdentityDigest',
        'disposition',
        'evidenceEventIds',
        'decisionReason',
      ])
      || ![
        'candidate-generation',
        'evaluation',
        'scoring',
        'canary',
        'promotion',
        'terminal',
      ].includes(String(entry.operationKind))
      || !['reuse', 'reexecute', 'compensate', 'reject'].includes(
        String(entry.disposition),
      )
      || !Array.isArray(entry.evidenceEventIds)
    ) {
      throw new TypeError(`branches[${index}] is not closed`);
    }
    token(entry.logicalOperationId, `branches[${index}].logicalOperationId`);
    digest(
      entry.receiptIdentityDigest,
      `branches[${index}].receiptIdentityDigest`,
    );
    entry.evidenceEventIds.forEach((eventId, eventIndex) => (
      token(eventId, `branches[${index}].evidenceEventIds[${eventIndex}]`)
    ));
    prose(entry.decisionReason, `branches[${index}].decisionReason`);
  }
  for (const [index, entry] of value.effects.entries()) {
    if (
      !isRecord(entry)
      || !hasExactKeys(entry, [
        'effectId',
        'logicalEffectId',
        'applicationState',
        'disposition',
        'intentEventId',
        'evidenceRefs',
        'decisionReason',
      ])
      || !['applied', 'not-applied', 'unknown'].includes(
        String(entry.applicationState),
      )
      || ![
        'reuse',
        'reexecute',
        'compensate',
        'reconcile',
        'blocked',
      ].includes(String(entry.disposition))
      || !Array.isArray(entry.evidenceRefs)
    ) {
      throw new TypeError(`effects[${index}] is not closed`);
    }
    token(entry.effectId, `effects[${index}].effectId`);
    token(entry.logicalEffectId, `effects[${index}].logicalEffectId`);
    token(entry.intentEventId, `effects[${index}].intentEventId`);
    entry.evidenceRefs.forEach((reference, referenceIndex) => (
      token(reference, `effects[${index}].evidenceRefs[${referenceIndex}]`)
    ));
    prose(entry.decisionReason, `effects[${index}].decisionReason`);
  }
}

/** Validate one decision and its canonical commitment at module boundaries. */
export function parseDeepImprovementCommonResumeDecision(
  input: unknown,
): DeepImprovementCommonResumeDecision {
  scanForbiddenKeys(input);
  if (
    !isRecord(input)
    || !hasExactKeys(input, [
      'decisionVersion',
      'decisionId',
      'idempotencyKey',
      'requestDigest',
      'decisionDigest',
      'authority',
      'legacyAuthority',
      'productionCompletion',
      'disposition',
      'compatibilityOutcome',
      'priorCertificateVerdict',
      'offlineVerificationVerdict',
      'persistedFingerprint',
      'currentFingerprint',
      'compatibility',
      'branches',
      'effects',
      'invalidation',
      'lease',
      'decisionReason',
    ])
    || input.decisionVersion !== 1
    || input.authority !== 'dark-evidence-only'
    || input.legacyAuthority !== 'unchanged'
    || input.productionCompletion !== false
    || !RESUME_DISPOSITIONS.includes(
      input.disposition as DeepImprovementCommonResumeDisposition,
    )
    || !['blocked', 'compatible', 'exact', 'migrate', 'pin-old-runtime'].includes(
      String(input.compatibilityOutcome),
    )
    || !['valid', 'invalid', 'incomplete', 'unverifiable', 'unsupported'].includes(
      String(input.offlineVerificationVerdict),
    )
  ) {
    throw new TypeError('Resume decision must use the closed decision shape');
  }
  token(input.decisionId, 'decision.decisionId');
  token(input.idempotencyKey, 'decision.idempotencyKey');
  digest(input.requestDigest, 'decision.requestDigest');
  digest(input.decisionDigest, 'decision.decisionDigest');
  if (input.priorCertificateVerdict !== null) {
    token(input.priorCertificateVerdict, 'decision.priorCertificateVerdict');
  }
  parseFingerprint(input.persistedFingerprint, 'decision.persistedFingerprint');
  parseFingerprint(input.currentFingerprint, 'decision.currentFingerprint');
  parseLease(input.lease);
  assertDecisionCollections(input);
  if (
    !isRecord(input.invalidation)
    || !hasExactKeys(input.invalidation, [
      'changedComponents',
      'invalidatedOperationIds',
      'recoveryRequiredEffectIds',
      'rebuildRequired',
    ])
    || !Array.isArray(input.invalidation.changedComponents)
    || !Array.isArray(input.invalidation.invalidatedOperationIds)
    || !Array.isArray(input.invalidation.recoveryRequiredEffectIds)
    || typeof input.invalidation.rebuildRequired !== 'boolean'
  ) {
    throw new TypeError('decision.invalidation must use the closed shape');
  }
  input.invalidation.changedComponents.forEach((component) => {
    if (!COMPONENT_ORDER.includes(
      component as DeepImprovementCommonResumeCompatibilityComponent,
    )) {
      throw new TypeError('decision.invalidation contains an unknown component');
    }
  });
  input.invalidation.invalidatedOperationIds.forEach((entry, index) => (
    token(entry, `decision.invalidation.invalidatedOperationIds[${index}]`)
  ));
  input.invalidation.recoveryRequiredEffectIds.forEach((entry, index) => (
    token(entry, `decision.invalidation.recoveryRequiredEffectIds[${index}]`)
  ));
  prose(input.decisionReason, 'decision.decisionReason');
  const { decisionDigest: ignored, ...body } = input;
  void ignored;
  if (sha256Bytes(canonicalBytes(body)) !== input.decisionDigest) {
    throw new TypeError('Resume decision digest does not commit the closed body');
  }
  return Object.freeze(input) as unknown as DeepImprovementCommonResumeDecision;
}

// ───────────────────────────────────────────────────────────────────
// 7. ADAPTER
// ───────────────────────────────────────────────────────────────────

function requestDigest(request: DeepImprovementCommonResumeRequest): string {
  return sha256Bytes(canonicalBytes({
    runId: request.runId,
    idempotencyKey: request.idempotencyKey,
    requestedAt: request.requestedAt,
    resumeReason: request.resumeReason,
    currentInputs: request.currentInputs,
    migrationRegistryDigest: request.migrationRegistry.registryDigest,
    lease: request.lease,
    checkpoint: request.checkpoint,
    priorCertificateDigest:
      request.priorRunBundle.certificate?.certificateDigest ?? null,
  }));
}

function decisionId(
  request: DeepImprovementCommonResumeRequest,
  requestCommitment: string,
): string {
  return `resume-decision-${sha256Bytes(canonicalBytes({
    runId: request.runId,
    idempotencyKey: request.idempotencyKey,
    requestCommitment,
  })).slice(0, 40)}`;
}

function createDecision(
  request: DeepImprovementCommonResumeRequest,
  verification: DeepImprovementCommonOfflineVerificationResult,
  disposition: DeepImprovementCommonResumeDisposition,
  priorCertificateVerdict: string | null,
  persistedFingerprint: DeepImprovementCommonResumeFingerprint | null,
  currentFingerprint: DeepImprovementCommonResumeFingerprint | null,
  compatibility: readonly DeepImprovementCommonCompatibilityComponentDecision[],
  branches: readonly DeepImprovementCommonBranchResumeDecision[],
  effects: readonly DeepImprovementCommonEffectResumeDecision[],
  invalidation: DeepImprovementCommonInvalidationDecision,
  reason: string,
): DeepImprovementCommonResumeDecision {
  const requestCommitment = requestDigest(request);
  const body = Object.freeze({
    decisionVersion: 1 as const,
    decisionId: decisionId(request, requestCommitment),
    idempotencyKey: request.idempotencyKey,
    requestDigest: requestCommitment,
    authority: 'dark-evidence-only' as const,
    legacyAuthority: 'unchanged' as const,
    productionCompletion: false as const,
    disposition,
    compatibilityOutcome: compatibilityOutcome(disposition),
    priorCertificateVerdict,
    offlineVerificationVerdict: verification.verdict,
    persistedFingerprint,
    currentFingerprint,
    compatibility,
    branches,
    effects,
    invalidation,
    lease: request.lease,
    decisionReason: reason,
  });
  return parseDeepImprovementCommonResumeDecision(Object.freeze({
    ...body,
    decisionDigest: sha256Bytes(canonicalBytes(body)),
  }));
}

function emptyInvalidation(
  rebuildRequired: boolean,
): DeepImprovementCommonInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze([]),
    invalidatedOperationIds: Object.freeze([]),
    recoveryRequiredEffectIds: Object.freeze([]),
    rebuildRequired,
  });
}

function resumeResult(
  decision: DeepImprovementCommonResumeDecision,
  continuity: DeepImprovementCommonContinuityProjection | null,
  projection: DeepImprovementCommonProjectionState | null,
  checkpoint: DeepImprovementCommonProjectionCheckpoint | null,
  authenticatedTail: DeepImprovementCommonAuthenticatedTail | null,
  reasonCodes: readonly DeepImprovementCommonResumeRebuildReasonCode[],
  offlineVerification: DeepImprovementCommonOfflineVerificationResult,
): DeepImprovementCommonResumeResult {
  return Object.freeze({
    status: 'decided',
    decision,
    continuity,
    projection,
    checkpoint,
    authenticatedTail,
    reasonCodes: Object.freeze([...reasonCodes]),
    offlineVerification,
  });
}

function replayIntegrityFailure(
  request: DeepImprovementCommonResumeRequest,
  verification: DeepImprovementCommonOfflineVerificationResult,
  priorCertificateVerdict: string | null,
  authenticatedTail: DeepImprovementCommonAuthenticatedTail | null,
  reasonCodes: readonly DeepImprovementCommonResumeRebuildReasonCode[],
  reason: string,
): DeepImprovementCommonResumeResult {
  const decision = createDecision(
    request,
    verification,
    'rebuild-required',
    priorCertificateVerdict,
    null,
    null,
    Object.freeze([]),
    Object.freeze([]),
    Object.freeze([]),
    emptyInvalidation(true),
    reason,
  );
  return resumeResult(
    decision,
    null,
    null,
    null,
    authenticatedTail,
    reasonCodes,
    verification,
  );
}

/**
 * Reconstruct one prior run and derive a non-authoritative recovery decision.
 *
 * The adapter never accepts caller-authored compatibility or effect-application
 * verdicts. Those facts come from the offline verifier, reducers, sealed store,
 * authenticated migration registry, and shared effect confirmation binder.
 */
export class DeepImprovementCommonResumeAdapter {
  readonly #options: DeepImprovementCommonResumeAdapterOptions;

  public constructor(options: DeepImprovementCommonResumeAdapterOptions) {
    this.#options = options;
  }

  public async resume(input: unknown): Promise<DeepImprovementCommonResumeResult> {
    const request = parseDeepImprovementCommonResumeRequest(input);
    const offlineVerificationPromise =
      verifyDeepImprovementCommonCertificateOffline({
        ...this.#options.verification,
        bundle: request.priorRunBundle,
      });
    let bundle: DeepImprovementCommonCertificateBundle | null = null;
    try {
      bundle = parseDeepImprovementCommonCertificateBundle(
        request.priorRunBundle,
      );
    } catch {
      bundle = null;
    }
    const replay = this.#options.verification.replay;
    let history: AuthenticatedHistory | null = null;
    let historyFailure: ResumeIntegrityError | null = null;
    try {
      history = authenticatedHistory(
        await replay.ledger.readVerifiedEvents(),
        this.#options.verification.projectionEvents,
        request.runId,
        replay.rangeStartSequence,
        replay.rangeEndSequence,
      );
    } catch (error: unknown) {
      historyFailure = error instanceof ResumeIntegrityError
        ? error
        : new ResumeIntegrityError(
          'authenticated-history-invalid',
          error instanceof Error ? error.message : String(error),
        );
    }
    const offlineVerification = await offlineVerificationPromise;
    if (historyFailure !== null) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.verdict ?? null,
        null,
        Object.freeze([historyFailure.reasonCode]),
        `Authenticated replay integrity failed closed: ${historyFailure.message}.`,
      );
    }
    if (history === null) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.verdict ?? null,
        null,
        Object.freeze(['authenticated-history-invalid']),
        'Authenticated replay state was not resolved.',
      );
    }
    if (
      bundle !== null
      && (
        history.tail.startHeadHash !== bundle.certificate.body.startHeadHash
        || history.tail.finalHeadHash !== bundle.certificate.body.finalHeadHash
      )
    ) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle.certificate.body.verdict,
        history.tail,
        Object.freeze(['frontier-mismatch']),
        'Certificate frontier differs from the real replayed ledger range.',
      );
    }
    const checkpointReasons = validateCheckpoint(request.checkpoint, history);
    if (checkpointReasons.length > 0) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.verdict ?? null,
        history.tail,
        checkpointReasons,
        `Checkpoint failed authenticated replay validation: ${
          checkpointReasons.join(',')
        }.`,
      );
    }
    if (offlineVerification.verdict !== 'valid' || bundle === null) {
      const decision = createDecision(
        request,
        offlineVerification,
        'blocked',
        null,
        null,
        null,
        Object.freeze([]),
        Object.freeze([]),
        Object.freeze([]),
        emptyInvalidation(false),
        'Prior certificate evidence did not offline-verify.',
      );
      return resumeResult(
        decision,
        null,
        null,
        null,
        history.tail,
        Object.freeze(['certificate-unverified']),
        offlineVerification,
      );
    }

    const folded = foldDeepImprovementCommonEvents(
      history.entries.map((entry) => entry.event),
      { sourceTailSequence: history.tail.streamSequence },
    );
    if (folded.outcome !== 'projected') {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle.certificate.body.verdict,
        history.tail,
        folded.reasonCodes,
        `Reducer reconstruction requires a full rebuild: ${
          folded.reasonCodes.join(',')
        }.`,
      );
    }
    const projection = folded.projection;
    const continuity = continuityProjection(
      projection,
      history.tail.streamSequence,
    );
    const leaseMatches = request.runId === bundle.certificate.body.runId
      && request.lease.runId === bundle.certificate.body.runId
      && request.lease.lineageId === bundle.certificate.body.lineageId
      && request.lease.generation === bundle.certificate.body.generation
      && request.lease.certificateDigest === offlineVerification.certificateDigest
      && request.lease.replayFingerprint === offlineVerification.replayFingerprint;
    const registryTrusted = this.#options.trustedMigrationRegistryDigests.includes(
      request.migrationRegistry.registryDigest,
    );
    const trustIsDurable = hasDurableResumeTrust(bundle);

    const persistedFacts = await priorComponentFacts(
      bundle,
      projection,
      this.#options,
    );
    const persistedFingerprint = createFingerprint(
      request.runId,
      offlineVerification.certificateDigest,
      offlineVerification.replayFingerprint,
      offlineVerification.artifactSetDigest,
      offlineVerification.receiptChainDigest,
      persistedFacts,
    );
    const currentFingerprint = createFingerprint(
      request.runId,
      offlineVerification.certificateDigest,
      offlineVerification.replayFingerprint,
      offlineVerification.artifactSetDigest,
      offlineVerification.receiptChainDigest,
      request.currentInputs,
    );
    const compatibility = classifyCompatibility(
      persistedFacts,
      request.currentInputs,
      request.migrationRegistry,
    );
    let disposition = aggregateDisposition(compatibility);
    let blockingReason: string | null = null;
    if (!registryTrusted) {
      disposition = 'blocked';
      blockingReason = 'Migration registry is not authenticated by this adapter.';
    } else if (!trustIsDurable) {
      disposition = 'blocked';
      blockingReason = 'Prior completion evidence is not trusted across resume.';
    } else if (!leaseMatches) {
      disposition = 'blocked';
      blockingReason = 'Persisted lease does not own the verified prior run.';
    }

    const effectEvents = await this.#options.effectLedger.readVerifiedEvents();
    const effectHead = await this.#options.effectLedger.getVerifiedHead();
    let effectEvidenceValid = true;
    try {
      rebuildProjection(
        effectEvents,
        INITIAL_EVIDENCE_CONTROL_PROJECTION,
        EVIDENCE_CONTROL_REDUCER_VERSION,
        effectHead,
        createEvidenceControlReducerRegistry(),
      );
    } catch {
      effectEvidenceValid = false;
      disposition = 'blocked';
      blockingReason = 'Effect evidence failed deterministic substrate replay.';
    }
    const branches = branchDecisions(bundle.receipts, disposition);
    const effects = effectDecisions(
      effectHistory(effectEvents, request.runId),
      disposition === 'blocked'
        || disposition === 'rebuild-required'
        || !effectEvidenceValid,
    );
    const invalidation = invalidationDecision(
      compatibility,
      branches,
      effects,
      disposition,
    );
    const decision = createDecision(
      request,
      offlineVerification,
      disposition,
      bundle.certificate.body.verdict,
      persistedFingerprint,
      currentFingerprint,
      compatibility,
      branches,
      effects,
      invalidation,
      blockingReason
        ?? (disposition === 'exact-reuse'
          ? 'Offline-verified prior facts match every current ordered input.'
          : disposition === 'compatible'
            ? 'Authenticated compatibility entries preserve reusable prior evidence.'
            : disposition === 'migrate'
              ? 'Authenticated migration entries require explicit re-execution.'
              : 'One or more real input facts require a clean rebuild.'),
    );
    return resumeResult(
      decision,
      continuity,
      projection,
      folded.checkpoint,
      history.tail,
      Object.freeze([]),
      offlineVerification,
    );
  }
}
