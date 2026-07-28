// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Resume Adapter
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonResumeAdapter,
  deepImprovementCommonMigrationRegistryDigest,
  parseDeepImprovementCommonMigrationRegistry,
  parseDeepImprovementCommonResumeDecision,
} from '../deep-improvement-common-resume-adapter/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  parseModelBenchmarkCertificateBundle,
  verifyModelBenchmarkCertificateOffline,
} from '../model-benchmark-certificates/index.js';
import {
  assertModelBenchmarkProjectionState,
  MODEL_BENCHMARK_PROJECTION_CODEC_VERSION,
  MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  MODEL_BENCHMARK_REDUCER_VERSION,
  foldModelBenchmarkEvents,
  modelBenchmarkProjectionIntegrityDigest,
} from '../model-benchmark-reducers/index.js';
import {
  ModelBenchmarkWireEventTypes,
  isModelBenchmarkEventStem,
} from '../model-benchmark-ledger-schema/index.js';
import {
  readModelBenchmarkArtifact,
} from '../model-benchmark-sealed-artifacts/index.js';

import type {
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonMigrationRegistryEntry,
  DeepImprovementCommonResumeCompatibilityComponent,
  DeepImprovementCommonResumeComponentFact,
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeDisposition,
  DeepImprovementCommonResumeResult,
} from '../deep-improvement-common-resume-adapter/index.js';
import type {
  ModelBenchmarkCertificateBundle,
  ModelBenchmarkOfflineVerificationResult,
} from '../model-benchmark-certificates/index.js';
import type {
  ModelBenchmarkLedgerEvent,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkProjectionCheckpoint,
  ModelBenchmarkProjectionState,
  ModelBenchmarkCellRecord,
  ModelBenchmarkStreamFrontier,
} from '../model-benchmark-reducers/index.js';
import type {
  ModelBenchmarkBranchResumeDecision,
  ModelBenchmarkAuthenticatedTail,
  ModelBenchmarkCompatibilityComponentDecision,
  ModelBenchmarkContinuityLadderRow,
  ModelBenchmarkContinuityProjection,
  ModelBenchmarkInvalidationDecision,
  ModelBenchmarkMigrationRegistry,
  ModelBenchmarkMigrationRegistryEntry,
  ModelBenchmarkPersistedRunLease,
  ModelBenchmarkResumeAdapterOptions,
  ModelBenchmarkResumeCompatibilityComponent,
  ModelBenchmarkResumeComponentFact,
  ModelBenchmarkResumeDecision,
  ModelBenchmarkResumeDisposition,
  ModelBenchmarkResumeFingerprint,
  ModelBenchmarkResumeRequest,
  ModelBenchmarkResumeRebuildReasonCode,
  ModelBenchmarkResumeResult,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const MODEL_BENCHMARK_RESUME_ADAPTER_VERSION =
  'model-benchmark-resume-adapter@1';

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+~-]{0,255}$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/u;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const SHARED_COMPONENTS = Object.freeze([
  'tool',
  'model',
  'policy',
  'target',
  'schema',
] as const satisfies readonly DeepImprovementCommonResumeCompatibilityComponent[]);
const COMPONENT_ORDER = Object.freeze([
  ...SHARED_COMPONENTS,
  'manifest',
  'recipe',
  'prompt',
  'workload',
  'matrix',
  'evaluator',
  'judge',
  'contamination',
  'validity',
  'projection-schema',
  'reducer',
  'scoring-policy',
  'adapter',
  'codec',
] as const satisfies readonly ModelBenchmarkResumeCompatibilityComponent[]);
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

export const MODEL_BENCHMARK_CONTINUITY_LADDER:
readonly ModelBenchmarkContinuityLadderRow[] = Object.freeze([
  Object.freeze({
    step: 'run-identity',
    eventFamilies: Object.freeze([
      'deep_improvement_common.run_started',
      'model_benchmark.run_declared',
    ]),
    reducerFields: Object.freeze(['common.run', 'modelBenchmark.run', 'seenEvents']),
    reentryActions: Object.freeze(['reuse', 'block'] as const),
  }),
  Object.freeze({
    step: 'design-and-workload',
    eventFamilies: Object.freeze([
      'model_benchmark.benchmark_capsule_sealed',
      'model_benchmark.workload_snapshot_sealed',
      'model_benchmark.benchmark_design_declared',
    ]),
    reducerFields: Object.freeze([
      'modelBenchmark.run',
      'modelBenchmark.iterationConvergence.designIds',
      'modelBenchmark.artifactIndex.artifacts',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'block'] as const),
  }),
  Object.freeze({
    step: 'matrix-dispatch',
    eventFamilies: Object.freeze([
      'model_benchmark.trial_block_declared',
      'model_benchmark.trial_case_admitted',
      'model_benchmark.trial_case_rejected',
      'model_benchmark.trial_dispatched',
    ]),
    reducerFields: Object.freeze(['modelBenchmark.iterationConvergence.cells']),
    reentryActions: Object.freeze([
      'reuse', 'reexecute', 'compensate', 'unknown', 'block',
    ] as const),
  }),
  Object.freeze({
    step: 'evidence-collection',
    eventFamilies: Object.freeze([
      'model_benchmark.trial_completed',
      'model_benchmark.trial_failed',
      'model_benchmark.trial_unknown',
      'model_benchmark.trial_observation_recorded',
      'model_benchmark.usage_observed',
    ]),
    reducerFields: Object.freeze([
      'modelBenchmark.iterationConvergence.cells',
      'modelBenchmark.scoringMatrix.rawObservations',
      'modelBenchmark.scoringMatrix.costLatencySlices',
    ]),
    reentryActions: Object.freeze([
      'reuse', 'reconcile', 'reexecute', 'unknown', 'block',
    ] as const),
  }),
  Object.freeze({
    step: 'scoring-and-validity',
    eventFamilies: Object.freeze([
      'model_benchmark.score_vector_observed',
      'model_benchmark.judge_observation_recorded',
      'model_benchmark.contamination_evidence_recorded',
      'model_benchmark.validity_card_derived',
      'model_benchmark.validity_unknown_recorded',
    ]),
    reducerFields: Object.freeze([
      'modelBenchmark.scoringMatrix.scores',
      'modelBenchmark.scoringMatrix.judgeObservations',
      'modelBenchmark.scoringMatrix.validity',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'block'] as const),
  }),
  Object.freeze({
    step: 'selection',
    eventFamilies: Object.freeze([
      'model_benchmark.selection_evidence_sealed',
      'model_benchmark.selection_reduction_requested',
    ]),
    reducerFields: Object.freeze([
      'modelBenchmark.scoringMatrix.selectionEvidence',
      'modelBenchmark.scoringMatrix.rankings',
      'modelBenchmark.modeStatus',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'block'] as const),
  }),
  Object.freeze({
    step: 'shared-status',
    eventFamilies: Object.freeze([
      'deep_improvement_common.canary_gate_passed',
      'deep_improvement_common.canary_vetoed',
      'deep_improvement_common.promotion_completed',
    ]),
    reducerFields: Object.freeze([
      'common.modeStatus',
      'modelBenchmark.modeStatus.blockingVetoCodes',
    ]),
    reentryActions: Object.freeze(['reuse', 'compensate', 'block'] as const),
  }),
  Object.freeze({
    step: 'terminal-or-blocked',
    eventFamilies: Object.freeze([
      'model_benchmark.run_closed',
    ]),
    reducerFields: Object.freeze([
      'modelBenchmark.run.state',
      'modelBenchmark.run.terminalOutcome',
      'modelBenchmark.modeStatus.rankingState',
    ]),
    reentryActions: Object.freeze(['reuse', 'block'] as const),
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
): ModelBenchmarkResumeComponentFact {
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['component', 'version', 'digest'])
    || !COMPONENT_ORDER.includes(
      value.component as ModelBenchmarkResumeCompatibilityComponent,
    )
  ) {
    throw new TypeError(`${field} must use the closed component-fact shape`);
  }
  return Object.freeze({
    component: value.component as ModelBenchmarkResumeCompatibilityComponent,
    version: token(value.version, `${field}.version`),
    digest: digest(value.digest, `${field}.digest`),
  });
}

function parseComponentFacts(
  value: unknown,
  field: string,
): readonly ModelBenchmarkResumeComponentFact[] {
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
): ModelBenchmarkMigrationRegistryEntry {
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
      value.component as ModelBenchmarkResumeCompatibilityComponent,
    )
    || !['compatible', 'migrate', 'pin-old-runtime'].includes(
      String(value.outcome),
    )
  ) {
    throw new TypeError(`${field} must use the closed migration-entry shape`);
  }
  return Object.freeze({
    component: value.component as ModelBenchmarkResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `${field}.fromVersion`),
    fromDigest: digest(value.fromDigest, `${field}.fromDigest`),
    toVersion: token(value.toVersion, `${field}.toVersion`),
    toDigest: digest(value.toDigest, `${field}.toDigest`),
    outcome: value.outcome as ModelBenchmarkMigrationRegistryEntry['outcome'],
    revision: token(value.revision, `${field}.revision`),
  });
}

/** Commit an authenticated migration registry without its commitment field. */
export function modelBenchmarkMigrationRegistryDigest(
  registry: Omit<ModelBenchmarkMigrationRegistry, 'registryDigest'>
    | ModelBenchmarkMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    entries: registry.entries,
  }));
}

/** Parse a migration registry and reject ambiguous compatibility identities. */
export function parseModelBenchmarkMigrationRegistry(
  input: unknown,
): ModelBenchmarkMigrationRegistry {
  if (
    !isRecord(input)
    || !hasExactKeys(input, ['registryVersion', 'entries', 'registryDigest'])
    || input.registryVersion !== 1
    || !Array.isArray(input.entries)
    || input.entries.length > 128
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
  if (modelBenchmarkMigrationRegistryDigest(registry) !== registry.registryDigest) {
    throw new TypeError('Migration registry digest does not commit its entries');
  }
  return registry;
}

function parseLease(value: unknown): ModelBenchmarkPersistedRunLease {
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
    certificateDigest: digest(value.certificateDigest, 'lease.certificateDigest'),
    replayFingerprint: digest(value.replayFingerprint, 'lease.replayFingerprint'),
  });
}

function parseStreamFrontier(
  value: unknown,
  field: string,
): ModelBenchmarkStreamFrontier {
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['streamId', 'lastSequence'])
  ) {
    throw new TypeError(`${field} must use the closed stream-frontier shape`);
  }
  return Object.freeze({
    streamId: token(value.streamId, `${field}.streamId`),
    lastSequence: uint(value.lastSequence, `${field}.lastSequence`),
  });
}

function parseCheckpoint(value: unknown): ModelBenchmarkProjectionCheckpoint | null {
  if (value === null) return null;
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['projection', 'integrityDigest', 'sourceStreamTails'])
    || !Array.isArray(value.sourceStreamTails)
  ) {
    throw new TypeError('Checkpoint must use the closed reducer checkpoint shape');
  }
  assertModelBenchmarkProjectionState(
    value.projection as ModelBenchmarkProjectionState,
  );
  const sourceStreamTails = value.sourceStreamTails.map((entry, index) => (
    parseStreamFrontier(entry, `checkpoint.sourceStreamTails[${index}]`)
  ));
  const streamIds = sourceStreamTails.map((tail) => tail.streamId);
  if (
    new Set(streamIds).size !== streamIds.length
    || streamIds.some((streamId, index) => (
      index > 0 && streamIds[index - 1]!.localeCompare(streamId) >= 0
    ))
  ) {
    throw new TypeError('Checkpoint stream tails must be unique and canonically ordered');
  }
  return Object.freeze({
    projection: value.projection as ModelBenchmarkProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceStreamTails:
      Object.freeze(sourceStreamTails) as unknown as ModelBenchmarkStreamFrontier[],
  });
}

/** Parse one request while leaving prior-run authority to the offline verifier. */
export function parseModelBenchmarkResumeRequest(
  input: unknown,
): ModelBenchmarkResumeRequest {
  scanForbiddenKeys(input);
  if (
    !isRecord(input)
    || !hasExactKeys(input, [
      'runId',
      'idempotencyKey',
      'requestedAt',
      'resumeReason',
      'currentInputs',
      'migrationRegistry',
      'lease',
      'checkpoint',
      'priorRunBundle',
    ])
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
    migrationRegistry: parseModelBenchmarkMigrationRegistry(
      input.migrationRegistry,
    ),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    priorRunBundle:
      input.priorRunBundle as unknown as ModelBenchmarkCertificateBundle,
  });
}

/** Commit every ordered resume input except the commitment itself. */
export function modelBenchmarkResumeFingerprintDigest(
  fingerprint: Omit<ModelBenchmarkResumeFingerprint, 'finalDigest'>
    | ModelBenchmarkResumeFingerprint,
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
  verification: Extract<ModelBenchmarkOfflineVerificationResult, { verdict: 'valid' }>,
  componentFacts: readonly ModelBenchmarkResumeComponentFact[],
): ModelBenchmarkResumeFingerprint {
  const body = Object.freeze({
    fingerprintVersion: 1 as const,
    runId,
    certificateDigest: verification.certificateDigest,
    replayFingerprint: verification.replayFingerprint,
    reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
    adapterVersion: MODEL_BENCHMARK_RESUME_ADAPTER_VERSION,
    schemaVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    codecVersion: MODEL_BENCHMARK_PROJECTION_CODEC_VERSION,
    artifactSetDigest: verification.artifactSetDigest,
    receiptChainDigest: verification.receiptChainDigest,
    componentFacts,
  });
  return Object.freeze({
    ...body,
    finalDigest: modelBenchmarkResumeFingerprintDigest(body),
  });
}

function parseFingerprint(
  value: unknown,
  field: string,
): ModelBenchmarkResumeFingerprint | null {
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
  const parsed = Object.freeze({
    fingerprintVersion: 1 as const,
    runId: token(value.runId, `${field}.runId`),
    certificateDigest: digest(value.certificateDigest, `${field}.certificateDigest`),
    replayFingerprint: digest(value.replayFingerprint, `${field}.replayFingerprint`),
    reducerVersion: token(value.reducerVersion, `${field}.reducerVersion`),
    adapterVersion: token(value.adapterVersion, `${field}.adapterVersion`),
    schemaVersion: token(value.schemaVersion, `${field}.schemaVersion`),
    codecVersion: token(value.codecVersion, `${field}.codecVersion`),
    artifactSetDigest: digest(value.artifactSetDigest, `${field}.artifactSetDigest`),
    receiptChainDigest: digest(value.receiptChainDigest, `${field}.receiptChainDigest`),
    componentFacts: parseComponentFacts(
      value.componentFacts,
      `${field}.componentFacts`,
    ),
    finalDigest: digest(value.finalDigest, `${field}.finalDigest`),
  });
  if (modelBenchmarkResumeFingerprintDigest(parsed) !== parsed.finalDigest) {
    throw new TypeError(`${field}.finalDigest does not commit the real inputs`);
  }
  return parsed;
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFIED PRIOR FACTS AND COMPATIBILITY
// ───────────────────────────────────────────────────────────────────

function canonicalDigest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

interface AuthenticatedModelBenchmarkHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: ModelBenchmarkLedgerEvent;
}

interface AuthenticatedModelBenchmarkHistory {
  readonly entries: readonly AuthenticatedModelBenchmarkHistoryEntry[];
  readonly tail: ModelBenchmarkAuthenticatedTail;
}

function authenticatedReplayHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  projectionEvents: readonly ModelBenchmarkLedgerEvent[],
  runId: string,
  rangeStartSequence: number,
  rangeEndSequence: number,
): AuthenticatedModelBenchmarkHistory {
  if (
    !Number.isSafeInteger(rangeStartSequence)
    || !Number.isSafeInteger(rangeEndSequence)
    || rangeStartSequence < 1
    || rangeEndSequence < rangeStartSequence
  ) {
    throw new TypeError('Authenticated replay range is invalid');
  }
  const covered = verifiedEvents.slice(
    rangeStartSequence - 1,
    rangeEndSequence,
  );
  if (covered.length !== rangeEndSequence - rangeStartSequence + 1) {
    throw new TypeError('Authenticated replay contains a ledger cursor gap');
  }
  const entries = covered.map((verified, index) => {
    if (verified.frame.sequence !== rangeStartSequence + index) {
      throw new TypeError('Authenticated replay is out of ledger order');
    }
    const envelope = verified.event.effective.envelope;
    const payload = envelope.payload;
    if (
      !isRecord(payload)
      || !isModelBenchmarkEventStem(payload.stem)
      || envelope.event_type !== ModelBenchmarkWireEventTypes[payload.stem]
      || !isRecord(payload.scope)
      || payload.scope.runId !== runId
    ) {
      throw new TypeError('Authenticated replay contains a foreign or malformed event');
    }
    return Object.freeze({
      verified,
      event: envelope as ModelBenchmarkLedgerEvent,
    });
  });
  const events = entries.map((entry) => entry.event);
  if (canonicalDigest(events) !== canonicalDigest(projectionEvents)) {
    throw new TypeError('Authenticated replay differs from the requested projection events');
  }
  const runStreamId = events[0]?.stream_id;
  if (
    runStreamId === undefined
    || events.some((event) => event.stream_id !== runStreamId)
  ) {
    throw new TypeError('Authenticated replay contains a run stream split');
  }
  const streamTails = new Map<string, {
    readonly eventId: string;
    readonly sequence: number;
  }>();
  for (const event of events) {
    const previous = streamTails.get(event.stream_id);
    if (
      previous === undefined
        ? event.stream_sequence !== 1 || event.causation_id !== null
        : event.stream_sequence !== previous.sequence + 1
          || event.causation_id !== previous.eventId
    ) {
      throw new TypeError(
        'Authenticated replay contains a causal cursor gap, out-of-order event, or stream split',
      );
    }
    streamTails.set(event.stream_id, {
      eventId: event.event_id,
      sequence: event.stream_sequence,
    });
  }
  const first = entries[0];
  const last = entries.at(-1);
  if (
    first === undefined
    || last === undefined
    || first.event.payload.stem !== 'model_benchmark.run_declared'
  ) {
    throw new TypeError('Authenticated replay lacks the Model Benchmark run genesis');
  }
  return Object.freeze({
    entries: Object.freeze(entries),
    tail: Object.freeze({
      ledgerId: last.verified.frame.ledger_id,
      rangeStartSequence,
      rangeEndSequence,
      startHeadHash: first.verified.frame.prev_record_hash,
      finalHeadHash: last.verified.frame.record_hash,
      streamFrontiers: Object.freeze([...streamTails.entries()]
        .map(([streamId, tail]) => Object.freeze({
          streamId,
          lastSequence: tail.sequence,
          eventId: tail.eventId,
        }))
        .sort((left, right) => left.streamId.localeCompare(right.streamId))),
      eventCount: entries.length,
    }),
  });
}

function validateCheckpoint(
  checkpoint: ModelBenchmarkProjectionCheckpoint | null,
  history: AuthenticatedModelBenchmarkHistory,
): readonly ModelBenchmarkResumeRebuildReasonCode[] {
  if (checkpoint === null) return Object.freeze([]);
  const tails = new Map(checkpoint.sourceStreamTails.map((tail) => [
    tail.streamId,
    tail,
  ]));
  for (const tail of checkpoint.sourceStreamTails) {
    const source = history.entries.find((entry) => (
      entry.event.stream_id === tail.streamId
      && entry.event.stream_sequence === tail.lastSequence
    ));
    if (source === undefined) return Object.freeze(['cursor-gap']);
  }
  const prefix = history.entries
    .filter((entry) => (
      entry.event.stream_sequence
      <= (tails.get(entry.event.stream_id)?.lastSequence ?? 0)
    ))
    .map((entry) => entry.event);
  const expected = foldModelBenchmarkEvents(prefix);
  if (expected.outcome !== 'projected') return expected.reasonCodes;
  if (
    expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || canonicalDigest(expected.checkpoint.sourceStreamTails)
      !== canonicalDigest(checkpoint.sourceStreamTails)
    || modelBenchmarkProjectionIntegrityDigest(expected.projection)
      !== modelBenchmarkProjectionIntegrityDigest(checkpoint.projection)
  ) {
    return Object.freeze(['checkpoint-digest-mismatch']);
  }
  return Object.freeze([]);
}

function modeComponentFacts(
  projection: ModelBenchmarkProjectionState,
  bundle: ModelBenchmarkCertificateBundle,
): readonly ModelBenchmarkResumeComponentFact[] {
  const body = bundle.certificate.body;
  const mode = projection.modelBenchmark;
  const cells = mode.iterationConvergence.cells;
  const scorePolicyVersions = [...new Set(
    mode.scoringMatrix.scores.map((entry) => entry.scorePolicyVersion),
  )].sort();
  const evaluatorVersions = [...new Set(
    mode.scoringMatrix.scores.map(
      (entry) => entry.scoreVector.evaluatorFingerprint,
    ),
  )].sort();
  const fact = (
    component: ModelBenchmarkResumeCompatibilityComponent,
    version: string,
    value: unknown,
  ): ModelBenchmarkResumeComponentFact => Object.freeze({
    component,
    version,
    digest: typeof value === 'string' && DIGEST_PATTERN.test(value)
      ? value
      : canonicalDigest(value),
  });
  return Object.freeze([
    fact(
      'manifest',
      'model-benchmark-manifest@1',
      {
        qualifiedDigest: body.runManifestQualifiedDigest,
        matrixProfileId: body.matrixProfileId,
        matrixDigest: body.matrixDigest,
        workloadProfileDigest: body.workloadProfileDigest,
      },
    ),
    fact('recipe', 'model-benchmark-recipe@1', body.recipeQualifiedDigest),
    fact('prompt', 'model-benchmark-prompt@1', cells.map((entry) => ({
      cellKey: entry.cellKey,
      promptRecipeFingerprint: entry.matrixKey.promptRecipeFingerprint,
      routeFingerprint: entry.matrixKey.routeFingerprint,
      frameworkFingerprint: entry.matrixKey.frameworkFingerprint,
      toolRecipeFingerprint: entry.matrixKey.toolRecipeFingerprint,
    }))),
    fact(
      'workload',
      'model-benchmark-workload@1',
      body.workloadProfileDigest,
    ),
    fact('matrix', body.matrixProfileId, {
      matrixDigest: body.matrixDigest,
      cells: cells.map((entry) => ({
        cellKey: entry.cellKey,
        matrixKey: entry.matrixKey,
      })),
    }),
    fact('evaluator', evaluatorVersions.join('+') || 'model-benchmark-evaluator@1', {
      evaluatorEpochId: body.evaluatorEpochId,
      scoreFingerprints: mode.scoringMatrix.scores.map(
        (entry) => entry.scoreVector.evaluatorFingerprint,
      ),
    }),
    fact('judge', 'model-benchmark-judge@1', mode.scoringMatrix.judgeObservations
      .map((entry) => ({
        judgeBuildFingerprint: entry.judgeBuildFingerprint,
        calibrationSliceId: entry.calibrationSliceId,
        orderProbeOutcome: entry.orderProbeOutcome,
        styleProbeOutcome: entry.styleProbeOutcome,
      }))),
    fact('contamination', 'model-benchmark-contamination@1', {
      evidence: mode.scoringMatrix.contaminationEvidence,
      exposures: mode.scoringMatrix.exposures,
      caseLifecycle: mode.scoringMatrix.caseLifecycle,
    }),
    fact('validity', 'model-benchmark-validity@1', {
      validity: mode.scoringMatrix.validity,
      unknowns: mode.scoringMatrix.validityUnknowns,
    }),
    fact(
      'projection-schema',
      projection.schemaVersion,
      { schemaVersion: projection.schemaVersion },
    ),
    fact('reducer', projection.reducerVersion, body.projectionIntegrityDigest),
    fact(
      'scoring-policy',
      scorePolicyVersions.join('+') || 'model-benchmark-scoring@1',
      {
        scores: mode.scoringMatrix.scores,
        rankings: mode.scoringMatrix.rankings,
      },
    ),
    fact(
      'adapter',
      MODEL_BENCHMARK_RESUME_ADAPTER_VERSION,
      { adapterVersion: MODEL_BENCHMARK_RESUME_ADAPTER_VERSION },
    ),
    fact('codec', projection.codecVersion, { codecVersion: projection.codecVersion }),
  ]);
}

function classifyModeCompatibility(
  persisted: readonly ModelBenchmarkResumeComponentFact[],
  installed: readonly ModelBenchmarkResumeComponentFact[],
  registry: ModelBenchmarkMigrationRegistry,
): readonly ModelBenchmarkCompatibilityComponentDecision[] {
  return Object.freeze(persisted.map((prior, offset) => {
    const index = offset + SHARED_COMPONENTS.length;
    const component = COMPONENT_ORDER[index];
    const current = installed[index];
    if (component === undefined
      || current === undefined
      || prior.component !== component
      || current.component !== component) {
      throw new TypeError('Compatibility facts lost canonical component ordering');
    }
    if (prior.version === current.version && prior.digest === current.digest) {
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
  shared: DeepImprovementCommonResumeDisposition,
  compatibility: readonly ModelBenchmarkCompatibilityComponentDecision[],
): ModelBenchmarkResumeDisposition {
  if (shared === 'blocked') return 'blocked';
  if (shared === 'rebuild-required') return 'rebuild-required';
  const outcomes = new Set(compatibility.map((entry) => entry.outcome));
  if (outcomes.has('pin-old-runtime')) return 'blocked';
  if (outcomes.has('incompatible')) return 'rebuild-required';
  if (shared === 'migrate' || outcomes.has('migrate')) return 'migrate';
  if (shared === 'compatible' || outcomes.has('compatible')) return 'compatible';
  return 'exact-reuse';
}

function commonRegistry(
  registry: ModelBenchmarkMigrationRegistry,
): ReturnType<typeof parseDeepImprovementCommonMigrationRegistry> {
  const entries = registry.entries
    .filter((entry): entry is ModelBenchmarkMigrationRegistryEntry & {
      readonly component: DeepImprovementCommonResumeCompatibilityComponent;
    } => SHARED_COMPONENTS.includes(
      entry.component as DeepImprovementCommonResumeCompatibilityComponent,
    ))
    .map((entry): DeepImprovementCommonMigrationRegistryEntry => Object.freeze({
      component: entry.component,
      fromVersion: entry.fromVersion,
      fromDigest: entry.fromDigest,
      toVersion: entry.toVersion,
      toDigest: entry.toDigest,
      outcome: entry.outcome,
      revision: entry.revision,
    }));
  const body = Object.freeze({
    registryVersion: 1 as const,
    entries: Object.freeze(entries),
  });
  return parseDeepImprovementCommonMigrationRegistry(Object.freeze({
    ...body,
    registryDigest: deepImprovementCommonMigrationRegistryDigest(body),
  }));
}

async function sharedResumeResult(
  request: ModelBenchmarkResumeRequest,
  bundle: ModelBenchmarkCertificateBundle,
  options: ModelBenchmarkResumeAdapterOptions,
  registryTrusted: boolean,
): Promise<DeepImprovementCommonResumeResult> {
  const registry = commonRegistry(request.migrationRegistry);
  const { bundle: ignored, ...commonVerification } =
    options.verification.commonVerification;
  void ignored;
  const commonAdapter = new DeepImprovementCommonResumeAdapter({
    verification: commonVerification,
    effectLedger: options.effectLedger,
    trustedMigrationRegistryDigests: registryTrusted
      ? Object.freeze([registry.registryDigest])
      : Object.freeze([]),
  });
  const commonBody = bundle.commonBundle.certificate.body;
  return commonAdapter.resume({
    runId: request.runId,
    idempotencyKey: request.idempotencyKey,
    requestedAt: request.requestedAt,
    resumeReason: request.resumeReason,
    currentInputs: request.currentInputs.slice(
      0,
      SHARED_COMPONENTS.length,
    ) as readonly DeepImprovementCommonResumeComponentFact[],
    migrationRegistry: registry,
    lease: {
      runId: request.runId,
      leaseId: request.lease.leaseId,
      lineageId: commonBody.lineageId,
      generation: commonBody.generation,
      deadlineAt: request.lease.deadlineAt,
      remainingMs: request.lease.remainingMs,
      certificateDigest: bundle.commonBundle.certificate.certificateDigest,
      replayFingerprint: commonBody.replayFingerprint,
    },
    priorRunBundle: bundle.commonBundle,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. MATRIX-CELL AND CONTINUITY DECISIONS
// ───────────────────────────────────────────────────────────────────

function cellEvidence(cell: ModelBenchmarkCellRecord): readonly string[] {
  return Object.freeze([
    cell.sourceEventId,
    cell.rawResultEventId,
    cell.rawObservationEventId,
    cell.scoreEventId,
  ].filter((entry): entry is string => entry !== null));
}

function branchDecisions(
  projection: ModelBenchmarkProjectionState,
  bundle: ModelBenchmarkCertificateBundle,
  disposition: ModelBenchmarkResumeDisposition,
): readonly ModelBenchmarkBranchResumeDecision[] {
  const mode = projection.modelBenchmark;
  const blockedCells = new Set(mode.modeStatus.blockingCellKeys);
  return Object.freeze(mode.iterationConvergence.cells.map((cell) => {
    const evidenceEventIds = cellEvidence(cell);
    const receipt = [...bundle.receipts].reverse().find((candidate) => (
      evidenceEventIds.includes(candidate.facts.resultEventId)
    ));
    let branchDisposition: ModelBenchmarkBranchResumeDecision['disposition'];
    let decisionReason: string;
    if (
      disposition === 'blocked'
      || disposition === 'rebuild-required'
      || blockedCells.has(cell.cellKey)
    ) {
      branchDisposition = 'block';
      decisionReason =
        'Compatibility, validity, or a hard veto blocks matrix-cell reuse.';
    } else if (
      cell.disposition === 'unknown'
      || cell.disposition === 'dispatched'
    ) {
      branchDisposition = 'unknown';
      decisionReason =
        'The durable dispatch has no verified terminal outcome and requires shared recovery.';
    } else if (
      receipt !== undefined
      && (disposition === 'exact-reuse' || disposition === 'compatible')
      && (cell.disposition === 'completed' || cell.disposition === 'scored')
      && cell.rawObservationEventId !== null
      && cell.scoreEventId !== null
    ) {
      branchDisposition = 'reuse';
      decisionReason =
        'The complete matrix cell and its offline-verified receipt remain compatible.';
    } else if (
      receipt !== undefined
      && (cell.disposition === 'completed' || cell.disposition === 'observed')
    ) {
      branchDisposition = 'reconcile';
      decisionReason =
        'The terminal cell evidence is preserved but scoring or validity remains incomplete.';
    } else {
      branchDisposition = 'reexecute';
      decisionReason =
        'The stable matrix-cell identity requires an authorized new attempt.';
    }
    return Object.freeze({
      cellKey: cell.cellKey,
      trialId: cell.trialId,
      candidateId: cell.matrixKey.candidateId,
      taskInstanceId: cell.matrixKey.taskInstanceId,
      taskFamilyId: cell.matrixKey.taskFamilyId,
      pairedBlockId: cell.matrixKey.pairedBlockId,
      workloadProfileId: cell.matrixKey.workloadProfileId,
      logicalOperationId: `matrix-cell:${cell.cellKey}`,
      receiptIdentityDigest: receipt?.facts.identity.digest
        ?? canonicalDigest({
          runId: bundle.certificate.body.runId,
          cellKey: cell.cellKey,
          state: 'missing-receipt',
        }),
      disposition: branchDisposition,
      evidenceEventIds,
      decisionReason,
    });
  }));
}

function continuityProjection(
  projection: ModelBenchmarkProjectionState,
  generation: number,
): ModelBenchmarkContinuityProjection {
  const mode = projection.modelBenchmark;
  const cells = mode.iterationConvergence.cells;
  const terminal = mode.run.state === 'closed'
    || mode.run.terminalOutcome !== null;
  const currentStep = terminal || mode.modeStatus.blockingVetoCodes.length > 0
    ? 'terminal-or-blocked' as const
    : projection.common.iterationConvergence.promotions.length > 0
      ? 'shared-status' as const
      : mode.scoringMatrix.selectionEvidence.length > 0
        || mode.scoringMatrix.rankings.length > 0
        ? 'selection' as const
        : mode.scoringMatrix.scores.length > 0
          || mode.scoringMatrix.validity.length > 0
          || mode.scoringMatrix.validityUnknowns.length > 0
          ? 'scoring-and-validity' as const
          : mode.scoringMatrix.rawObservations.length > 0
            || mode.scoringMatrix.costLatencySlices.length > 0
            ? 'evidence-collection' as const
            : cells.length > 0
              ? 'matrix-dispatch' as const
              : mode.iterationConvergence.designIds.length > 0
                ? 'design-and-workload' as const
                : 'run-identity' as const;
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: mode.run.runId ?? '',
    lineageId: projection.common.run.lineageId ?? '',
    generation,
    lastAppliedSeq: Math.max(
      0,
      ...projection.streamFrontiers.map((entry) => entry.lastSequence),
    ),
    seenEventIds: Object.freeze(
      projection.seenEvents.map((entry) => entry.eventId),
    ),
    streamFrontiers: Object.freeze(
      projection.streamFrontiers.map((entry) => Object.freeze({ ...entry })),
    ),
    currentStep,
    runState: mode.run.state,
    terminalOutcome: mode.run.terminalOutcome,
    cellKeys: Object.freeze(cells.map((entry) => entry.cellKey)),
    reusableCellKeys: Object.freeze(cells
      .filter((entry) => entry.disposition === 'completed'
        || entry.disposition === 'scored')
      .map((entry) => entry.cellKey)),
    pendingCellKeys: Object.freeze(cells
      .filter((entry) => entry.disposition === 'admitted'
        || entry.disposition === 'dispatched')
      .map((entry) => entry.cellKey)),
    unknownCellKeys: Object.freeze(cells
      .filter((entry) => entry.disposition === 'unknown')
      .map((entry) => entry.cellKey)),
    scoredCellKeys: Object.freeze(mode.scoringMatrix.scores
      .map((entry) => entry.cellKey)),
    validEvidencePlanIds: Object.freeze(mode.scoringMatrix.validity
      .filter((entry) => entry.state === 'valid')
      .map((entry) => entry.validityPlanId)),
    unresolvedEvidenceRefs: Object.freeze([
      ...mode.iterationConvergence.unresolvedEvidenceRefs,
    ]),
    matrixCoverage: mode.modeStatus.matrixCoverage,
    rankingState: mode.modeStatus.rankingState,
    blockingVetoCodes: Object.freeze([
      ...mode.modeStatus.blockingVetoCodes,
    ]),
    terminal,
  });
}

function invalidationDecision(
  compatibility: readonly ModelBenchmarkCompatibilityComponentDecision[],
  branches: readonly ModelBenchmarkBranchResumeDecision[],
  effects: ModelBenchmarkResumeDecision['effects'],
  disposition: ModelBenchmarkResumeDisposition,
): ModelBenchmarkInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze(compatibility
      .filter((entry) => entry.outcome !== 'exact')
      .map((entry) => entry.component)),
    invalidatedCellKeys: Object.freeze(branches
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.cellKey)),
    recoveryRequiredEffectIds: Object.freeze(effects
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.effectId)),
    scoreRebuildRequired: disposition === 'migrate'
      || disposition === 'rebuild-required',
    newLineageRequired: disposition === 'rebuild-required',
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. DECISION VALIDATION
// ───────────────────────────────────────────────────────────────────

function requestDigest(request: ModelBenchmarkResumeRequest): string {
  return canonicalDigest({
    runId: request.runId,
    idempotencyKey: request.idempotencyKey,
    requestedAt: request.requestedAt,
    resumeReason: request.resumeReason,
    currentInputs: request.currentInputs,
    migrationRegistryDigest: request.migrationRegistry.registryDigest,
    lease: request.lease,
    checkpoint: request.checkpoint,
    priorCertificateDigest:
      isRecord(request.priorRunBundle)
      && isRecord(request.priorRunBundle.certificate)
      && typeof request.priorRunBundle.certificate.certificateDigest === 'string'
        ? request.priorRunBundle.certificate.certificateDigest
        : null,
  });
}

function createDecision(
  request: ModelBenchmarkResumeRequest,
  verification: ModelBenchmarkOfflineVerificationResult,
  disposition: ModelBenchmarkResumeDisposition,
  priorCertificateDisposition: string | null,
  persistedFingerprint: ModelBenchmarkResumeFingerprint | null,
  currentFingerprint: ModelBenchmarkResumeFingerprint | null,
  compatibility: readonly ModelBenchmarkCompatibilityComponentDecision[],
  branches: readonly ModelBenchmarkBranchResumeDecision[],
  sharedDecision: DeepImprovementCommonResumeDecision | null,
  invalidation: ModelBenchmarkInvalidationDecision,
  reason: string,
): ModelBenchmarkResumeDecision {
  const requestCommitment = requestDigest(request);
  const body = Object.freeze({
    decisionVersion: 1 as const,
    decisionId: `resume-decision-${canonicalDigest({
      runId: request.runId,
      idempotencyKey: request.idempotencyKey,
      requestCommitment,
    }).slice(0, 40)}`,
    idempotencyKey: request.idempotencyKey,
    requestDigest: requestCommitment,
    authority: 'dark-evidence-only' as const,
    legacyAuthority: 'unchanged' as const,
    productionCompletion: false as const,
    disposition,
    priorCertificateDisposition,
    offlineVerificationVerdict: verification.verdict,
    persistedFingerprint,
    currentFingerprint,
    compatibility,
    branches,
    effects: sharedDecision?.effects ?? Object.freeze([]),
    invalidation,
    sharedDecision,
    lease: request.lease,
    decisionReason: reason,
  });
  return parseModelBenchmarkResumeDecision(Object.freeze({
    ...body,
    decisionDigest: canonicalDigest(body),
  }));
}

/** Validate one decision and its canonical commitment at module boundaries. */
export function parseModelBenchmarkResumeDecision(
  input: unknown,
): ModelBenchmarkResumeDecision {
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
      'priorCertificateDisposition',
      'offlineVerificationVerdict',
      'persistedFingerprint',
      'currentFingerprint',
      'compatibility',
      'branches',
      'effects',
      'invalidation',
      'sharedDecision',
      'lease',
      'decisionReason',
    ])
    || input.decisionVersion !== 1
    || input.authority !== 'dark-evidence-only'
    || input.legacyAuthority !== 'unchanged'
    || input.productionCompletion !== false
    || !RESUME_DISPOSITIONS.includes(
      input.disposition as ModelBenchmarkResumeDisposition,
    )
    || !['valid', 'invalid', 'incomplete', 'unverifiable', 'unsupported'].includes(
      String(input.offlineVerificationVerdict),
    )
    || !Array.isArray(input.compatibility)
    || !Array.isArray(input.branches)
    || !Array.isArray(input.effects)
  ) {
    throw new TypeError('Resume decision must use the closed decision shape');
  }
  token(input.decisionId, 'decision.decisionId');
  token(input.idempotencyKey, 'decision.idempotencyKey');
  digest(input.requestDigest, 'decision.requestDigest');
  digest(input.decisionDigest, 'decision.decisionDigest');
  if (input.priorCertificateDisposition !== null) {
    token(
      input.priorCertificateDisposition,
      'decision.priorCertificateDisposition',
    );
  }
  parseFingerprint(input.persistedFingerprint, 'decision.persistedFingerprint');
  parseFingerprint(input.currentFingerprint, 'decision.currentFingerprint');
  parseLease(input.lease);
  prose(input.decisionReason, 'decision.decisionReason');
  if (input.sharedDecision !== null) {
    parseDeepImprovementCommonResumeDecision(input.sharedDecision);
  }
  for (const [index, entry] of input.compatibility.entries()) {
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
        entry.component as ModelBenchmarkResumeCompatibilityComponent,
      )
      || !COMPONENT_OUTCOMES.includes(
        entry.outcome as typeof COMPONENT_OUTCOMES[number],
      )
    ) {
      throw new TypeError(`compatibility[${index}] is not closed`);
    }
  }
  for (const [index, entry] of input.branches.entries()) {
    if (
      !isRecord(entry)
      || !hasExactKeys(entry, [
        'cellKey',
        'trialId',
        'candidateId',
        'taskInstanceId',
        'taskFamilyId',
        'pairedBlockId',
        'workloadProfileId',
        'logicalOperationId',
        'receiptIdentityDigest',
        'disposition',
        'evidenceEventIds',
        'decisionReason',
      ])
      || ![
        'reuse',
        'reconcile',
        'reexecute',
        'compensate',
        'unknown',
        'block',
      ].includes(String(entry.disposition))
      || !Array.isArray(entry.evidenceEventIds)
    ) {
      throw new TypeError(`branches[${index}] is not closed`);
    }
    digest(entry.receiptIdentityDigest, `branches[${index}].receiptIdentityDigest`);
  }
  if (
    !isRecord(input.invalidation)
    || !hasExactKeys(input.invalidation, [
      'changedComponents',
      'invalidatedCellKeys',
      'recoveryRequiredEffectIds',
      'scoreRebuildRequired',
      'newLineageRequired',
    ])
    || !Array.isArray(input.invalidation.changedComponents)
    || !Array.isArray(input.invalidation.invalidatedCellKeys)
    || !Array.isArray(input.invalidation.recoveryRequiredEffectIds)
    || typeof input.invalidation.scoreRebuildRequired !== 'boolean'
    || typeof input.invalidation.newLineageRequired !== 'boolean'
  ) {
    throw new TypeError('decision.invalidation must use the closed shape');
  }
  const { decisionDigest: ignored, ...body } = input;
  void ignored;
  if (canonicalDigest(body) !== input.decisionDigest) {
    throw new TypeError('Resume decision digest does not commit the closed body');
  }
  return Object.freeze(input) as unknown as ModelBenchmarkResumeDecision;
}

function emptyInvalidation(
  rebuildRequired: boolean,
): ModelBenchmarkInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze([]),
    invalidatedCellKeys: Object.freeze([]),
    recoveryRequiredEffectIds: Object.freeze([]),
    scoreRebuildRequired: rebuildRequired,
    newLineageRequired: rebuildRequired,
  });
}

function replayIntegrityFailure(
  request: ModelBenchmarkResumeRequest,
  verification: Extract<
    ModelBenchmarkOfflineVerificationResult,
    { verdict: 'valid' }
  >,
  priorCertificateDisposition: string,
  authenticatedTail: ModelBenchmarkAuthenticatedTail | null,
  reasonCodes: readonly ModelBenchmarkResumeRebuildReasonCode[],
  reason: string,
): ModelBenchmarkResumeResult {
  const decision = createDecision(
    request,
    verification,
    'rebuild-required',
    priorCertificateDisposition,
    null,
    null,
    Object.freeze([]),
    Object.freeze([]),
    null,
    emptyInvalidation(true),
    reason,
  );
  return Object.freeze({
    status: 'decided',
    decision,
    continuity: null,
    projection: null,
    checkpoint: null,
    authenticatedTail,
    reasonCodes: Object.freeze([...reasonCodes]),
    offlineVerification: verification,
    common: null,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. ADAPTER
// ───────────────────────────────────────────────────────────────────

/**
 * Reconstruct a prior Model Benchmark run and derive a dark recovery decision.
 *
 * Shared compatibility and effect decisions retain the common adapter's
 * objects, while this adapter adds only matrix-cell and scoring bindings.
 */
export class ModelBenchmarkResumeAdapter {
  readonly #options: ModelBenchmarkResumeAdapterOptions;

  public constructor(options: ModelBenchmarkResumeAdapterOptions) {
    this.#options = options;
  }

  public async resume(input: unknown): Promise<ModelBenchmarkResumeResult> {
    const request = parseModelBenchmarkResumeRequest(input);
    const offlineVerification = await verifyModelBenchmarkCertificateOffline({
      ...this.#options.verification,
      bundle: request.priorRunBundle,
    });
    if (offlineVerification.verdict !== 'valid') {
      const decision = createDecision(
        request,
        offlineVerification,
        'blocked',
        null,
        null,
        null,
        Object.freeze([]),
        Object.freeze([]),
        null,
        emptyInvalidation(false),
        'Prior Model Benchmark certificate evidence did not offline-verify.',
      );
      return Object.freeze({
        status: 'decided',
        decision,
        continuity: null,
        projection: null,
        checkpoint: null,
        authenticatedTail: null,
        reasonCodes: Object.freeze(['certificate-unverified'] as const),
        offlineVerification,
        common: null,
      });
    }

    const bundle = parseModelBenchmarkCertificateBundle(request.priorRunBundle);
    const replay = this.#options.verification.replay;
    let history: AuthenticatedModelBenchmarkHistory;
    try {
      history = authenticatedReplayHistory(
        await replay.ledger.readVerifiedEvents(),
        this.#options.verification.projectionEvents,
        request.runId,
        replay.rangeStartSequence,
        replay.rangeEndSequence,
      );
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      const reasonCode: ModelBenchmarkResumeRebuildReasonCode =
        /cursor gap|stream split|out-of-order/u.test(detail)
          ? 'cursor-gap'
          : 'authenticated-history-invalid';
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle.certificate.body.disposition,
        null,
        Object.freeze([reasonCode]),
        `Authenticated replay integrity failed closed: ${detail}.`,
      );
    }
    if (
      history.tail.startHeadHash !== bundle.certificate.body.startHeadHash
      || history.tail.finalHeadHash !== bundle.certificate.body.finalHeadHash
    ) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle.certificate.body.disposition,
        history.tail,
        Object.freeze(['frontier-mismatch']),
        'Certificate ledger heads differ from the real replayed ledger range.',
      );
    }
    const checkpointReasons = validateCheckpoint(request.checkpoint, history);
    if (checkpointReasons.length > 0) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle.certificate.body.disposition,
        history.tail,
        checkpointReasons,
        `Checkpoint failed authenticated replay validation: ${checkpointReasons.join(',')}.`,
      );
    }
    const folded = foldModelBenchmarkEvents(
      history.entries.map((entry) => entry.event),
    );
    if (folded.outcome !== 'projected') {
      const decision = createDecision(
        request,
        offlineVerification,
        'rebuild-required',
        bundle.certificate.body.disposition,
        null,
        null,
        Object.freeze([]),
        Object.freeze([]),
        null,
        emptyInvalidation(true),
        `Reducer reconstruction requires a full rebuild: ${folded.reasonCodes.join(',')}.`,
      );
      return Object.freeze({
        status: 'decided',
        decision,
        continuity: null,
        projection: null,
        checkpoint: null,
        authenticatedTail: history.tail,
        reasonCodes: folded.reasonCodes,
        offlineVerification,
        common: null,
      });
    }
    const projection = folded.projection;
    const body = bundle.certificate.body;
    const registryTrusted = this.#options.trustedMigrationRegistryDigests.includes(
      request.migrationRegistry.registryDigest,
    );
    const leaseMatches = request.runId === body.runId
      && request.lease.runId === body.runId
      && request.lease.lineageId === body.lineageId
      && request.lease.generation === body.generation
      && request.lease.certificateDigest === offlineVerification.certificateDigest
      && request.lease.replayFingerprint === offlineVerification.replayFingerprint;
    const mode = projection.modelBenchmark;
    const lifecycleTrusted = mode.run.runId === body.runId
      && mode.run.lineageId === body.lineageId
      && mode.run.state === 'closed'
      && mode.run.terminalOutcome === 'completed'
      && mode.modeStatus.matrixCoverage === body.matrixCoverage
      && mode.modeStatus.rankingState === body.rankingState
      && canonicalDigest(mode.modeStatus.blockingCellKeys)
        === canonicalDigest(body.blockingCellKeys)
      && canonicalDigest(mode.modeStatus.blockingVetoCodes)
        === canonicalDigest(body.blockingVetoCodes);

    let sealedReadsValid = true;
    for (const claim of body.artifactClaims) {
      try {
        await readModelBenchmarkArtifact(
          this.#options.verification.artifactStore,
          claim.binding,
          {
            accessRole: 'evaluator',
            requiredEvaluatorEpochId: body.evaluatorEpochId,
          },
        );
      } catch {
        sealedReadsValid = false;
      }
    }

    const common = await sharedResumeResult(
      request,
      bundle,
      this.#options,
      registryTrusted,
    );
    const sharedDecision = common.decision;
    const sharedPersistedFacts =
      sharedDecision.persistedFingerprint?.componentFacts;
    if (sharedPersistedFacts === null
      || sharedPersistedFacts === undefined
      || sharedPersistedFacts.length !== SHARED_COMPONENTS.length) {
      const decision = createDecision(
        request,
        offlineVerification,
        'blocked',
        body.disposition,
        null,
        null,
        Object.freeze([]),
        Object.freeze([]),
        sharedDecision,
        emptyInvalidation(false),
        'The shared resume adapter could not derive persisted common facts.',
      );
      return Object.freeze({
        status: 'decided',
        decision,
        continuity: continuityProjection(projection, body.generation),
        projection,
        checkpoint: folded.checkpoint,
        authenticatedTail: history.tail,
        reasonCodes: Object.freeze([]),
        offlineVerification,
        common,
      });
    }

    const persistedFacts = Object.freeze([
      ...sharedPersistedFacts,
      ...modeComponentFacts(projection, bundle),
    ] as readonly ModelBenchmarkResumeComponentFact[]);
    const currentFacts = request.currentInputs;
    const persistedFingerprint = createFingerprint(
      request.runId,
      offlineVerification,
      persistedFacts,
    );
    const currentFingerprint = createFingerprint(
      request.runId,
      offlineVerification,
      currentFacts,
    );
    const modeCompatibility = classifyModeCompatibility(
      persistedFacts.slice(SHARED_COMPONENTS.length),
      currentFacts,
      request.migrationRegistry,
    );
    const compatibility = Object.freeze([
      ...sharedDecision.compatibility,
      ...modeCompatibility,
    ] as readonly ModelBenchmarkCompatibilityComponentDecision[]);
    let disposition = aggregateDisposition(
      sharedDecision.disposition,
      compatibility,
    );
    let blockingReason: string | null = null;
    if (!registryTrusted) {
      disposition = 'blocked';
      blockingReason = 'Migration registry is not authenticated by this adapter.';
    } else if (!leaseMatches) {
      disposition = 'blocked';
      blockingReason = 'Persisted lease does not own the verified prior run.';
    } else if (!lifecycleTrusted) {
      disposition = 'blocked';
      blockingReason = 'Prior run lifecycle is not trusted for resume.';
    } else if (!sealedReadsValid) {
      disposition = 'blocked';
      blockingReason = 'A named sealed reference failed a verified store read.';
    }
    const branches = branchDecisions(projection, bundle, disposition);
    const invalidation = invalidationDecision(
      compatibility,
      branches,
      sharedDecision.effects,
      disposition,
    );
    const decision = createDecision(
      request,
      offlineVerification,
      disposition,
      body.disposition,
      persistedFingerprint,
      currentFingerprint,
      compatibility,
      branches,
      sharedDecision,
      invalidation,
      blockingReason
        ?? (disposition === 'exact-reuse'
          ? 'Offline-verified prior facts match every current ordered input.'
          : disposition === 'compatible'
            ? 'Authenticated compatibility entries preserve prior evidence.'
            : disposition === 'migrate'
              ? 'Authenticated migration entries require explicit re-entry.'
              : disposition === 'rebuild-required'
                ? 'One or more real inputs require a clean lineage rebuild.'
                : 'Shared trust or compatibility blocks resume.'),
    );
    return Object.freeze({
      status: 'decided',
      decision,
      continuity: continuityProjection(projection, body.generation),
      projection,
      checkpoint: folded.checkpoint,
      authenticatedTail: history.tail,
      reasonCodes: Object.freeze([]),
      offlineVerification,
      common,
    });
  }
}
