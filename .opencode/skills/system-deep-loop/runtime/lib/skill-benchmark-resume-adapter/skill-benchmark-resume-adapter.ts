// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Resume Adapter
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
  parseSkillBenchmarkCertificateBundle,
  verifySkillBenchmarkCertificateOffline,
} from '../skill-benchmark-certificates/index.js';
import {
  assertSkillBenchmarkProjectionState,
  SKILL_BENCHMARK_PROJECTION_CODEC_VERSION,
  SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  SKILL_BENCHMARK_REDUCER_VERSION,
  foldSkillBenchmarkEvents,
  skillBenchmarkProjectionIntegrityDigest,
} from '../skill-benchmark-reducers/index.js';
import {
  isSkillBenchmarkEventStem,
  skillBenchmarkWireEventType,
} from '../skill-benchmark-ledger-schema/index.js';
import {
  readSkillBenchmarkArtifact,
} from '../skill-benchmark-sealed-artifacts/index.js';

import type {
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonMigrationRegistryEntry,
  DeepImprovementCommonResumeCompatibilityComponent,
  DeepImprovementCommonResumeComponentFact,
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeDisposition,
} from '../deep-improvement-common-resume-adapter/index.js';
import type {
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkOfflineVerificationResult,
} from '../skill-benchmark-certificates/index.js';
import type {
  SkillBenchmarkLedgerEvent,
} from '../skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkProjectionCheckpoint,
  SkillBenchmarkProjectionState,
  SkillBenchmarkScenarioCell,
  SkillBenchmarkStreamTail,
} from '../skill-benchmark-reducers/index.js';
import type {
  SkillBenchmarkBranchResumeDecision,
  SkillBenchmarkCompatibilityComponentDecision,
  SkillBenchmarkContinuityLadderRow,
  SkillBenchmarkContinuityProjection,
  SkillBenchmarkInvalidationDecision,
  SkillBenchmarkMigrationRegistry,
  SkillBenchmarkMigrationRegistryEntry,
  SkillBenchmarkPersistedRunLease,
  SkillBenchmarkResumeAdapterOptions,
  SkillBenchmarkResumeCompatibilityComponent,
  SkillBenchmarkResumeComponentFact,
  SkillBenchmarkResumeDecision,
  SkillBenchmarkResumeDisposition,
  SkillBenchmarkResumeFingerprint,
  SkillBenchmarkResumeRebuildReasonCode,
  SkillBenchmarkResumeRequest,
  SkillBenchmarkResumeResult,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const SKILL_BENCHMARK_RESUME_ADAPTER_VERSION =
  'skill-benchmark-resume-adapter@1';

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
  'treatment',
  'skill-bundle',
  'registry',
  'executor',
  'permission',
  'environment',
  'gold',
  'evaluator',
  'reducer',
  'scoring-policy',
  'adapter',
  'codec',
] as const satisfies readonly SkillBenchmarkResumeCompatibilityComponent[]);
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

export const SKILL_BENCHMARK_CONTINUITY_LADDER:
readonly SkillBenchmarkContinuityLadderRow[] = Object.freeze([
  Object.freeze({
    step: 'run-identity',
    eventFamilies: Object.freeze([
      'deep_improvement_common.run_started',
      'skill_benchmark.run_planned',
    ]),
    reducerFields: Object.freeze(['common.run', 'run', 'seenEvents']),
    reentryActions: Object.freeze(['reuse', 'reject'] as const),
  }),
  Object.freeze({
    step: 'treatment-design',
    eventFamilies: Object.freeze([
      'skill_benchmark.run_planned',
      'skill_benchmark.treatment_assigned',
    ]),
    reducerFields: Object.freeze([
      'run.benchmarkDesignId',
      'iterationConvergence.scenarios',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'scenario-setup',
    eventFamilies: Object.freeze([
      'skill_benchmark.scenario_started',
      'skill_benchmark.scenario_finished',
      'skill_benchmark.scenario_aborted',
    ]),
    reducerFields: Object.freeze(['iterationConvergence.scenarios']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'compensate', 'reject'] as const),
  }),
  Object.freeze({
    step: 'skill-path',
    eventFamilies: Object.freeze([
      'skill_benchmark.skill_discovered',
      'skill_benchmark.skill_loaded',
      'skill_benchmark.skill_invoked',
      'skill_benchmark.resource_exposed',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.scenarios.collectionStage',
      'artifactIndex.artifacts',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'trajectory-outcome',
    eventFamilies: Object.freeze([
      'skill_benchmark.milestone_observed',
      'skill_benchmark.trajectory_recorded',
      'skill_benchmark.outcome_recorded',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.scenarios',
      'artifactIndex.artifacts',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'gold-scoring',
    eventFamilies: Object.freeze([
      'skill_benchmark.gold_integrity_recorded',
      'skill_benchmark.score_observed',
      'deep_improvement_common.evaluation_normalized',
    ]),
    reducerFields: Object.freeze([
      'artifactIndex.rawMeasurements',
      'artifactIndex.derivedRankings',
      'modeStatus.scoringState',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
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
      'iterationConvergence.hardVetoes',
    ]),
    reentryActions: Object.freeze(['reuse', 'compensate', 'reject'] as const),
  }),
  Object.freeze({
    step: 'terminal-or-blocked',
    eventFamilies: Object.freeze([
      'skill_benchmark.run_closed',
      'skill_benchmark.effect_certificate_issued',
      'skill_benchmark.effect_certificate_withheld',
      'skill_benchmark.effect_certificate_expired',
    ]),
    reducerFields: Object.freeze([
      'run.state',
      'modeStatus.state',
      'modeStatus.certificateState',
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
): SkillBenchmarkResumeComponentFact {
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['component', 'version', 'digest'])
    || !COMPONENT_ORDER.includes(
      value.component as SkillBenchmarkResumeCompatibilityComponent,
    )
  ) {
    throw new TypeError(`${field} must use the closed component-fact shape`);
  }
  return Object.freeze({
    component: value.component as SkillBenchmarkResumeCompatibilityComponent,
    version: token(value.version, `${field}.version`),
    digest: digest(value.digest, `${field}.digest`),
  });
}

function parseComponentFacts(
  value: unknown,
  field: string,
): readonly SkillBenchmarkResumeComponentFact[] {
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
): SkillBenchmarkMigrationRegistryEntry {
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
      value.component as SkillBenchmarkResumeCompatibilityComponent,
    )
    || !['compatible', 'migrate', 'pin-old-runtime'].includes(
      String(value.outcome),
    )
  ) {
    throw new TypeError(`${field} must use the closed migration-entry shape`);
  }
  return Object.freeze({
    component: value.component as SkillBenchmarkResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `${field}.fromVersion`),
    fromDigest: digest(value.fromDigest, `${field}.fromDigest`),
    toVersion: token(value.toVersion, `${field}.toVersion`),
    toDigest: digest(value.toDigest, `${field}.toDigest`),
    outcome: value.outcome as SkillBenchmarkMigrationRegistryEntry['outcome'],
    revision: token(value.revision, `${field}.revision`),
  });
}

/** Commit an authenticated migration registry without its commitment field. */
export function skillBenchmarkMigrationRegistryDigest(
  registry: Omit<SkillBenchmarkMigrationRegistry, 'registryDigest'>
    | SkillBenchmarkMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    entries: registry.entries,
  }));
}

/** Parse a migration registry and reject ambiguous compatibility identities. */
export function parseSkillBenchmarkMigrationRegistry(
  input: unknown,
): SkillBenchmarkMigrationRegistry {
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
  if (skillBenchmarkMigrationRegistryDigest(registry) !== registry.registryDigest) {
    throw new TypeError('Migration registry digest does not commit its entries');
  }
  return registry;
}

function parseLease(value: unknown): SkillBenchmarkPersistedRunLease {
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

function parseStreamTail(
  value: unknown,
  field: string,
): SkillBenchmarkStreamTail {
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['streamId', 'sequence', 'eventId', 'eventDigest'])
  ) {
    throw new TypeError(`${field} must use the closed stream-tail shape`);
  }
  return Object.freeze({
    streamId: token(value.streamId, `${field}.streamId`),
    sequence: uint(value.sequence, `${field}.sequence`),
    eventId: token(value.eventId, `${field}.eventId`),
    eventDigest: digest(value.eventDigest, `${field}.eventDigest`),
  });
}

function parseCheckpoint(value: unknown): SkillBenchmarkProjectionCheckpoint | null {
  if (value === null) return null;
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['projection', 'integrityDigest', 'sourceTails'])
    || !Array.isArray(value.sourceTails)
  ) {
    throw new TypeError('Checkpoint must use the closed reducer checkpoint shape');
  }
  assertSkillBenchmarkProjectionState(value.projection);
  const sourceTails = value.sourceTails.map((entry, index) => (
    parseStreamTail(entry, `checkpoint.sourceTails[${index}]`)
  ));
  const streamIds = sourceTails.map((tail) => tail.streamId);
  if (
    new Set(streamIds).size !== streamIds.length
    || streamIds.some((streamId, index) => (
      index > 0 && streamIds[index - 1]!.localeCompare(streamId) >= 0
    ))
  ) {
    throw new TypeError('Checkpoint stream tails must be unique and canonically ordered');
  }
  return Object.freeze({
    projection: value.projection as SkillBenchmarkProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceTails: Object.freeze(sourceTails) as unknown as SkillBenchmarkStreamTail[],
  });
}

/** Parse one request while leaving prior-run authority to the offline verifier. */
export function parseSkillBenchmarkResumeRequest(
  input: unknown,
): SkillBenchmarkResumeRequest {
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
    migrationRegistry: parseSkillBenchmarkMigrationRegistry(
      input.migrationRegistry,
    ),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    priorRunBundle:
      input.priorRunBundle as unknown as SkillBenchmarkCertificateBundle,
  });
}

/** Commit every ordered resume input except the commitment itself. */
export function skillBenchmarkResumeFingerprintDigest(
  fingerprint: Omit<SkillBenchmarkResumeFingerprint, 'finalDigest'>
    | SkillBenchmarkResumeFingerprint,
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
  verification: Extract<SkillBenchmarkOfflineVerificationResult, { verdict: 'valid' }>,
  componentFacts: readonly SkillBenchmarkResumeComponentFact[],
): SkillBenchmarkResumeFingerprint {
  const body = Object.freeze({
    fingerprintVersion: 1 as const,
    runId,
    certificateDigest: verification.certificateDigest,
    replayFingerprint: verification.replayFingerprint,
    reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
    adapterVersion: SKILL_BENCHMARK_RESUME_ADAPTER_VERSION,
    schemaVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    codecVersion: SKILL_BENCHMARK_PROJECTION_CODEC_VERSION,
    artifactSetDigest: verification.artifactSetDigest,
    receiptChainDigest: verification.receiptChainDigest,
    componentFacts,
  });
  return Object.freeze({
    ...body,
    finalDigest: skillBenchmarkResumeFingerprintDigest(body),
  });
}

function parseFingerprint(
  value: unknown,
  field: string,
): SkillBenchmarkResumeFingerprint | null {
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
  if (skillBenchmarkResumeFingerprintDigest(parsed) !== parsed.finalDigest) {
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

interface AuthenticatedSkillBenchmarkHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: SkillBenchmarkLedgerEvent;
}

interface AuthenticatedSkillBenchmarkHistory {
  readonly entries: readonly AuthenticatedSkillBenchmarkHistoryEntry[];
  readonly tail: import('./types.js').SkillBenchmarkAuthenticatedTail;
}

class SkillBenchmarkResumeIntegrityError extends TypeError {
  public readonly reasonCode: SkillBenchmarkResumeRebuildReasonCode;

  public constructor(
    reasonCode: SkillBenchmarkResumeRebuildReasonCode,
    message: string,
  ) {
    super(message);
    this.name = 'SkillBenchmarkResumeIntegrityError';
    this.reasonCode = reasonCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function authenticatedReplayHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  projectionEvents: readonly SkillBenchmarkLedgerEvent[],
  runId: string,
  rangeStartSequence: number,
  rangeEndSequence: number,
): AuthenticatedSkillBenchmarkHistory {
  if (
    !Number.isSafeInteger(rangeStartSequence)
    || !Number.isSafeInteger(rangeEndSequence)
    || rangeStartSequence < 1
    || rangeEndSequence < rangeStartSequence
  ) {
    throw new SkillBenchmarkResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay range is invalid',
    );
  }
  const covered = verifiedEvents.slice(
    rangeStartSequence - 1,
    rangeEndSequence,
  );
  if (covered.length !== rangeEndSequence - rangeStartSequence + 1) {
    throw new SkillBenchmarkResumeIntegrityError(
      'cursor-gap',
      'Authenticated replay contains a ledger cursor gap',
    );
  }
  const entries = covered.map((verified, index) => {
    if (verified.frame.sequence !== rangeStartSequence + index) {
      throw new SkillBenchmarkResumeIntegrityError(
        'cursor-gap',
        'Authenticated replay is out of ledger order',
      );
    }
    const envelope = verified.event.effective.envelope;
    const payload = envelope.payload;
    if (
      !isRecord(payload)
      || !isSkillBenchmarkEventStem(payload.stem)
      || envelope.event_type !== skillBenchmarkWireEventType(payload.stem)
      || !isRecord(payload.scope)
      || payload.scope.runId !== runId
    ) {
      throw new SkillBenchmarkResumeIntegrityError(
        'authenticated-history-invalid',
        'Authenticated replay contains a foreign or malformed event',
      );
    }
    return Object.freeze({
      verified,
      event: envelope as SkillBenchmarkLedgerEvent,
    });
  });
  const events = entries.map((entry) => entry.event);
  if (canonicalDigest(events) !== canonicalDigest(projectionEvents)) {
    throw new SkillBenchmarkResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay differs from the requested projection events',
    );
  }
  const streamTails = new Map<string, {
    readonly eventId: string;
    readonly sequence: number;
  }>();
  for (const event of events) {
    const previous = streamTails.get(event.stream_id);
    if (
      previous === undefined
        ? event.stream_sequence !== 1
          || event.causation_id !== null
          || (
            event.payload.stem !== 'deep_improvement_common.run_started'
            && event.payload.stem !== 'skill_benchmark.run_planned'
          )
        : event.stream_sequence !== previous.sequence + 1
          || event.causation_id !== previous.eventId
    ) {
      throw new SkillBenchmarkResumeIntegrityError(
        'cursor-gap',
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
  if (first === undefined || last === undefined) {
    throw new SkillBenchmarkResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay range is empty',
    );
  }
  const sourceTails = Object.freeze([...streamTails.entries()]
    .map(([streamId, tail]) => {
      const entry = [...entries].reverse().find((candidate) => (
        candidate.event.stream_id === streamId
      ));
      if (entry === undefined) {
        throw new SkillBenchmarkResumeIntegrityError(
          'authenticated-history-invalid',
          'Authenticated stream tail has no owning ledger event',
        );
      }
      return Object.freeze({
        streamId,
        sequence: tail.sequence,
        eventId: tail.eventId,
        eventDigest: canonicalDigest(entry.event),
      });
    })
    .sort((left, right) => left.streamId.localeCompare(right.streamId)));
  return Object.freeze({
    entries: Object.freeze(entries),
    tail: Object.freeze({
      ledgerId: last.verified.frame.ledger_id,
      rangeStartSequence,
      rangeEndSequence,
      startHeadHash: first.verified.frame.prev_record_hash,
      finalHeadHash: last.verified.frame.record_hash,
      streamTails: sourceTails,
      eventCount: entries.length,
    }),
  });
}

function validateCheckpoint(
  checkpoint: SkillBenchmarkProjectionCheckpoint | null,
  history: AuthenticatedSkillBenchmarkHistory,
): readonly string[] {
  if (checkpoint === null) return Object.freeze([]);
  const tails = new Map(checkpoint.sourceTails.map((tail) => [
    tail.streamId,
    tail,
  ]));
  for (const tail of checkpoint.sourceTails) {
    const source = history.entries.find((entry) => (
      entry.event.stream_id === tail.streamId
      && entry.event.stream_sequence === tail.sequence
    ));
    if (source === undefined) return Object.freeze(['cursor-gap']);
    if (
      source.event.event_id !== tail.eventId
      || canonicalDigest(source.event) !== tail.eventDigest
    ) {
      return Object.freeze(['checkpoint-digest-mismatch']);
    }
  }
  const prefix = history.entries
    .filter((entry) => (
      entry.event.stream_sequence
      <= (tails.get(entry.event.stream_id)?.sequence ?? 0)
    ))
    .map((entry) => entry.event);
  const expected = foldSkillBenchmarkEvents(prefix);
  if (expected.outcome !== 'projected') return expected.reasonCodes;
  if (
    expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || canonicalDigest(expected.checkpoint.sourceTails)
      !== canonicalDigest(checkpoint.sourceTails)
    || skillBenchmarkProjectionIntegrityDigest(expected.projection)
      !== skillBenchmarkProjectionIntegrityDigest(checkpoint.projection)
  ) {
    return Object.freeze(['checkpoint-digest-mismatch']);
  }
  return Object.freeze([]);
}

function modeComponentFacts(
  projection: SkillBenchmarkProjectionState,
  bundle: SkillBenchmarkCertificateBundle,
): readonly SkillBenchmarkResumeComponentFact[] {
  const body = bundle.certificate.body;
  const scenarios = projection.iterationConvergence.scenarios;
  const scorePolicyVersions = [...new Set(
    projection.artifactIndex.derivedRankings.map((entry) => entry.scorePolicyVersion),
  )].sort();
  const evaluatorVersions = [...new Set(
    projection.artifactIndex.rawMeasurements.map((entry) => entry.evaluatorVersion),
  )].sort();
  const fact = (
    component: SkillBenchmarkResumeCompatibilityComponent,
    version: string,
    value: unknown,
  ): SkillBenchmarkResumeComponentFact => Object.freeze({
    component,
    version,
    digest: typeof value === 'string' && DIGEST_PATTERN.test(value)
      ? value
      : canonicalDigest(value),
  });
  return Object.freeze([
    fact(
      'manifest',
      projection.run.designPolicyVersion ?? 'skill-benchmark-design@1',
      {
        benchmarkDesignId: body.benchmarkDesignId,
        designDigest: body.designDigest,
        taskSetDigest: body.taskSetDigest,
        workloadDigest: body.workloadDigest,
      },
    ),
    fact('treatment', 'skill-benchmark-treatment@1', scenarios.map((entry) => ({
      assignmentId: entry.assignmentId,
      designCellId: entry.designCellId,
      pairedReplicateId: entry.pairedReplicateId,
      replicateIndex: entry.replicateIndex,
      treatmentArm: entry.treatmentArm,
      taskDigest: entry.taskDigest,
    }))),
    fact('skill-bundle', 'skill-benchmark-skill-bundle@1', body.skillBundleDigest),
    fact('registry', 'skill-benchmark-registry@1', body.registryDigest),
    fact('executor', 'skill-benchmark-executor@1', body.executorDigest),
    fact('permission', 'skill-benchmark-permission@1', scenarios.map(
      (entry) => entry.permissionDigest,
    )),
    fact('environment', 'skill-benchmark-environment@1', body.environmentDigest),
    fact('gold', 'skill-benchmark-gold@1', {
      manifests: body.goldManifestQualifiedDigests,
      acceptedScenarioCount: body.acceptedGoldScenarioCount,
    }),
    fact('evaluator', evaluatorVersions.join('+') || 'skill-benchmark-evaluator@1', {
      evaluatorEpochId: body.evaluatorEpochId,
      fingerprints: projection.artifactIndex.rawMeasurements.map(
        (entry) => entry.evaluatorFingerprint,
      ),
    }),
    fact('reducer', projection.reducerVersion, body.projectionIntegrityDigest),
    fact(
      'scoring-policy',
      scorePolicyVersions.join('+') || 'skill-benchmark-scoring@1',
      {
        rawMeasurements: projection.artifactIndex.rawMeasurements,
        derivedRankings: projection.artifactIndex.derivedRankings,
      },
    ),
    fact(
      'adapter',
      SKILL_BENCHMARK_RESUME_ADAPTER_VERSION,
      { adapterVersion: SKILL_BENCHMARK_RESUME_ADAPTER_VERSION },
    ),
    fact('codec', projection.codecVersion, { codecVersion: projection.codecVersion }),
  ]);
}

function classifyModeCompatibility(
  persisted: readonly SkillBenchmarkResumeComponentFact[],
  installed: readonly SkillBenchmarkResumeComponentFact[],
  registry: SkillBenchmarkMigrationRegistry,
): readonly SkillBenchmarkCompatibilityComponentDecision[] {
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
  compatibility: readonly SkillBenchmarkCompatibilityComponentDecision[],
): SkillBenchmarkResumeDisposition {
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
  registry: SkillBenchmarkMigrationRegistry,
): ReturnType<typeof parseDeepImprovementCommonMigrationRegistry> {
  const entries = registry.entries
    .filter((entry): entry is SkillBenchmarkMigrationRegistryEntry & {
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

async function sharedResumeDecision(
  request: SkillBenchmarkResumeRequest,
  bundle: SkillBenchmarkCertificateBundle,
  options: SkillBenchmarkResumeAdapterOptions,
  registryTrusted: boolean,
): Promise<DeepImprovementCommonResumeDecision> {
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
  const result = await commonAdapter.resume({
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
  return result.decision;
}

// ───────────────────────────────────────────────────────────────────
// 4. SCENARIO AND CONTINUITY DECISIONS
// ───────────────────────────────────────────────────────────────────

function scenarioEvidence(cell: SkillBenchmarkScenarioCell): readonly string[] {
  return Object.freeze([
    cell.assignmentEventId,
    cell.startedEventId,
    cell.terminalEventId,
    cell.discoveryEventId,
    cell.loadEventId,
    cell.invocationEventId,
    cell.trajectoryEventId,
    cell.outcomeEventId,
    ...cell.rawScoreEventIds,
    ...cell.goldIntegrityEventIds,
    ...cell.compatibilityEventIds,
  ].filter((entry): entry is string => entry !== null));
}

function branchDecisions(
  projection: SkillBenchmarkProjectionState,
  bundle: SkillBenchmarkCertificateBundle,
  disposition: SkillBenchmarkResumeDisposition,
): readonly SkillBenchmarkBranchResumeDecision[] {
  const vetoed = new Set(projection.iterationConvergence.hardVetoes
    .map((entry) => entry.scenarioId)
    .filter((entry): entry is string => entry !== null));
  return Object.freeze(projection.iterationConvergence.scenarios.map((cell) => {
    const evidenceEventIds = scenarioEvidence(cell);
    const receipt = [...bundle.receipts].reverse().find((candidate) => (
      evidenceEventIds.includes(candidate.facts.resultEventId)
    ));
    let branchDisposition: SkillBenchmarkBranchResumeDecision['disposition'];
    let decisionReason: string;
    if (
      disposition === 'blocked'
      || disposition === 'rebuild-required'
      || receipt === undefined
      || cell.state === 'aborted'
      || vetoed.has(cell.scenarioId)
    ) {
      branchDisposition = 'reject';
      decisionReason = receipt === undefined
        ? 'No verified transition receipt owns this scenario evidence.'
        : 'Compatibility, lifecycle, or a hard veto blocks scenario reuse.';
    } else if (
      disposition === 'exact-reuse'
      && cell.state === 'finished'
      && cell.requiredEvidenceComplete
    ) {
      branchDisposition = 'reuse';
      decisionReason = 'The complete scenario and its receipt remain byte-compatible.';
    } else {
      branchDisposition = 'reexecute';
      decisionReason = 'The stable scenario identity requires explicit re-entry.';
    }
    return Object.freeze({
      scenarioId: cell.scenarioId,
      assignmentId: cell.assignmentId,
      designCellId: cell.designCellId,
      pairedReplicateId: cell.pairedReplicateId,
      treatmentArm: cell.treatmentArm,
      logicalOperationId: `scenario:${cell.scenarioId}`,
      receiptIdentityDigest: receipt?.facts.identity.digest
        ?? canonicalDigest({
          runId: bundle.certificate.body.runId,
          scenarioId: cell.scenarioId,
          state: 'missing-receipt',
        }),
      disposition: branchDisposition,
      evidenceEventIds,
      decisionReason,
    });
  }));
}

function continuityProjection(
  projection: SkillBenchmarkProjectionState,
  generation: number,
): SkillBenchmarkContinuityProjection {
  const scenarios = projection.iterationConvergence.scenarios;
  const terminal = projection.run.state === 'closed'
    || projection.run.state === 'aborted'
    || projection.modeStatus.terminal;
  const currentStep = terminal || projection.modeStatus.blockingVetoCodes.length > 0
    ? 'terminal-or-blocked' as const
    : projection.common.iterationConvergence.promotions.length > 0
      ? 'shared-status' as const
      : projection.modeStatus.scoringState !== 'not-started'
        ? 'gold-scoring' as const
        : scenarios.some((entry) => entry.outcomeEventId !== null)
          ? 'trajectory-outcome' as const
          : scenarios.some((entry) => entry.discoveryEventId !== null)
            ? 'skill-path' as const
            : scenarios.some((entry) => entry.startedEventId !== null)
              ? 'scenario-setup' as const
              : scenarios.length > 0
                ? 'treatment-design' as const
                : 'run-identity' as const;
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: projection.run.runId ?? '',
    lineageId: projection.common.run.lineageId ?? '',
    generation,
    seenEventIds: Object.freeze(
      projection.seenEvents.map((entry) => entry.eventId),
    ),
    streamTails: Object.freeze(
      projection.iterationConvergence.lastAppliedSequenceByStream,
    ),
    currentStep,
    runState: projection.run.state,
    modeState: projection.modeStatus.state,
    scenarioIds: Object.freeze(scenarios.map((entry) => entry.scenarioId)),
    completeScenarioIds: Object.freeze(scenarios
      .filter((entry) => entry.requiredEvidenceComplete)
      .map((entry) => entry.scenarioId)),
    incompleteScenarioIds: Object.freeze(scenarios
      .filter((entry) => !entry.requiredEvidenceComplete)
      .map((entry) => entry.scenarioId)),
    discoveredScenarioIds: Object.freeze(scenarios
      .filter((entry) => entry.discoveryEventId !== null)
      .map((entry) => entry.scenarioId)),
    invokedScenarioIds: Object.freeze(scenarios
      .filter((entry) => entry.invocationEventId !== null)
      .map((entry) => entry.scenarioId)),
    outcomeScenarioIds: Object.freeze(scenarios
      .filter((entry) => entry.outcomeEventId !== null)
      .map((entry) => entry.scenarioId)),
    scoredScenarioIds: Object.freeze(scenarios
      .filter((entry) => entry.rawScoreEventIds.length > 0)
      .map((entry) => entry.scenarioId)),
    blockingVetoCodes: Object.freeze([
      ...new Set([
        ...projection.modeStatus.blockingVetoCodes,
        ...projection.iterationConvergence.hardVetoes.map(
          (entry) => entry.vetoCode,
        ),
      ]),
    ].sort()),
    collectionComplete: projection.iterationConvergence.collectionComplete,
    scoringComplete: projection.iterationConvergence.scoringComplete,
    certificateReady: projection.iterationConvergence.certificateReady,
    terminal,
  });
}

function invalidationDecision(
  compatibility: readonly SkillBenchmarkCompatibilityComponentDecision[],
  branches: readonly SkillBenchmarkBranchResumeDecision[],
  effects: SkillBenchmarkResumeDecision['effects'],
  disposition: SkillBenchmarkResumeDisposition,
): SkillBenchmarkInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze(compatibility
      .filter((entry) => entry.outcome !== 'exact')
      .map((entry) => entry.component)),
    invalidatedScenarioIds: Object.freeze(branches
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.scenarioId)),
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

function requestDigest(request: SkillBenchmarkResumeRequest): string {
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
  request: SkillBenchmarkResumeRequest,
  verification: SkillBenchmarkOfflineVerificationResult,
  disposition: SkillBenchmarkResumeDisposition,
  priorCertificateDisposition: string | null,
  persistedFingerprint: SkillBenchmarkResumeFingerprint | null,
  currentFingerprint: SkillBenchmarkResumeFingerprint | null,
  compatibility: readonly SkillBenchmarkCompatibilityComponentDecision[],
  branches: readonly SkillBenchmarkBranchResumeDecision[],
  sharedDecision: DeepImprovementCommonResumeDecision | null,
  invalidation: SkillBenchmarkInvalidationDecision,
  reason: string,
): SkillBenchmarkResumeDecision {
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
  return parseSkillBenchmarkResumeDecision(Object.freeze({
    ...body,
    decisionDigest: canonicalDigest(body),
  }));
}

/** Validate one decision and its canonical commitment at module boundaries. */
export function parseSkillBenchmarkResumeDecision(
  input: unknown,
): SkillBenchmarkResumeDecision {
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
      input.disposition as SkillBenchmarkResumeDisposition,
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
        entry.component as SkillBenchmarkResumeCompatibilityComponent,
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
        'scenarioId',
        'assignmentId',
        'designCellId',
        'pairedReplicateId',
        'treatmentArm',
        'logicalOperationId',
        'receiptIdentityDigest',
        'disposition',
        'evidenceEventIds',
        'decisionReason',
      ])
      || !['reuse', 'reexecute', 'reject'].includes(String(entry.disposition))
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
      'invalidatedScenarioIds',
      'recoveryRequiredEffectIds',
      'scoreRebuildRequired',
      'newLineageRequired',
    ])
    || !Array.isArray(input.invalidation.changedComponents)
    || !Array.isArray(input.invalidation.invalidatedScenarioIds)
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
  return Object.freeze(input) as unknown as SkillBenchmarkResumeDecision;
}

function emptyInvalidation(
  rebuildRequired: boolean,
): SkillBenchmarkInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze([]),
    invalidatedScenarioIds: Object.freeze([]),
    recoveryRequiredEffectIds: Object.freeze([]),
    scoreRebuildRequired: rebuildRequired,
    newLineageRequired: rebuildRequired,
  });
}

function replayIntegrityFailure(
  request: SkillBenchmarkResumeRequest,
  verification: SkillBenchmarkOfflineVerificationResult,
  priorCertificateDisposition: string | null,
  authenticatedTail: import('./types.js').SkillBenchmarkAuthenticatedTail | null,
  reasonCodes: readonly SkillBenchmarkResumeRebuildReasonCode[],
  reason: string,
): SkillBenchmarkResumeResult {
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
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. ADAPTER
// ───────────────────────────────────────────────────────────────────

/**
 * Reconstruct a prior Skill Benchmark run and derive a dark recovery decision.
 *
 * Shared compatibility and effect decisions retain the common adapter's
 * objects, while this adapter adds only scenario and scoring bindings.
 */
export class SkillBenchmarkResumeAdapter {
  readonly #options: SkillBenchmarkResumeAdapterOptions;

  public constructor(options: SkillBenchmarkResumeAdapterOptions) {
    this.#options = options;
  }

  public async resume(input: unknown): Promise<SkillBenchmarkResumeResult> {
    const request = parseSkillBenchmarkResumeRequest(input);
    const offlineVerificationPromise = verifySkillBenchmarkCertificateOffline({
      ...this.#options.verification,
      bundle: request.priorRunBundle,
    });
    let bundle: SkillBenchmarkCertificateBundle | null = null;
    try {
      bundle = parseSkillBenchmarkCertificateBundle(request.priorRunBundle);
    } catch {
      bundle = null;
    }
    const replay = this.#options.verification.replay;
    let history: AuthenticatedSkillBenchmarkHistory | null = null;
    let historyFailure: SkillBenchmarkResumeIntegrityError | null = null;
    try {
      history = authenticatedReplayHistory(
        await replay.ledger.readVerifiedEvents(),
        this.#options.verification.projectionEvents,
        request.runId,
        replay.rangeStartSequence,
        replay.rangeEndSequence,
      );
    } catch (error: unknown) {
      historyFailure = error instanceof SkillBenchmarkResumeIntegrityError
        ? error
        : new SkillBenchmarkResumeIntegrityError(
          'authenticated-history-invalid',
          error instanceof Error ? error.message : String(error),
        );
    }
    const offlineVerification = await offlineVerificationPromise;
    if (historyFailure !== null) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.disposition ?? null,
        null,
        Object.freeze([historyFailure.reasonCode]),
        `Authenticated replay integrity failed closed: ${historyFailure.message}.`,
      );
    }
    if (history === null) {
      return replayIntegrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.disposition ?? null,
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
        bundle?.certificate.body.disposition ?? null,
        history.tail,
        checkpointReasons as readonly SkillBenchmarkResumeRebuildReasonCode[],
        `Checkpoint failed authenticated replay validation: ${checkpointReasons.join(',')}.`,
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
        null,
        emptyInvalidation(false),
        'Prior Skill Benchmark certificate evidence did not offline-verify.',
      );
      return Object.freeze({
        status: 'decided',
        decision,
        continuity: null,
        projection: null,
        checkpoint: null,
        authenticatedTail: history.tail,
        reasonCodes: Object.freeze(['certificate-unverified'] as const),
        offlineVerification,
      });
    }

    const folded = foldSkillBenchmarkEvents(
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
    const lifecycleTrusted = projection.run.runId === body.runId
      && projection.common.run.lineageId === body.lineageId
      && projection.run.state === 'closed'
      && projection.modeStatus.certificateState === 'issued'
      && projection.iterationConvergence.collectionComplete
      && projection.iterationConvergence.scoringComplete
      && projection.iterationConvergence.certificateReady;

    let sealedReadsValid = true;
    for (const claim of body.artifactClaims) {
      try {
        await readSkillBenchmarkArtifact(
          this.#options.verification.artifactStore,
          claim.binding,
          {
            consumer: 'skill-benchmark',
            accessRole: 'evaluator',
            requiredEvaluationEpochId: body.evaluatorEpochId,
          },
        );
      } catch {
        sealedReadsValid = false;
      }
    }

    const sharedDecision = await sharedResumeDecision(
      request,
      bundle,
      this.#options,
      registryTrusted,
    );
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
      });
    }

    const persistedFacts = Object.freeze([
      ...sharedPersistedFacts,
      ...modeComponentFacts(projection, bundle),
    ] as readonly SkillBenchmarkResumeComponentFact[]);
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
    ] as readonly SkillBenchmarkCompatibilityComponentDecision[]);
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
    });
  }
}
