// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Resume Adapter
// ───────────────────────────────────────────────────────────────────

import {
  parseAgentImprovementCertificateBundle,
  verifyAgentImprovementCertificateOffline,
} from '../agent-improvement-certificates/index.js';
import {
  AGENT_IMPROVEMENT_EVENT_VERSION,
  AgentImprovementWireEventTypes,
  agentImprovementEventDefinitions,
  isAgentImprovementEventStem,
} from '../agent-improvement-ledger-schema/index.js';
import {
  AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
  AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_REDUCER_VERSION,
  agentImprovementProjectionIntegrityDigest,
  assertAgentImprovementProjectionState,
  foldAgentImprovementEvents,
} from '../agent-improvement-reducers/index.js';
import {
  readAgentImprovementArtifact,
} from '../agent-improvement-sealed-artifacts/index.js';
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

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  AgentImprovementCertificateBundle,
  AgentImprovementOfflineVerificationResult,
} from '../agent-improvement-certificates/index.js';
import type {
  AgentImprovementLedgerEvent,
} from '../agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementProjectionCheckpoint,
  AgentImprovementProjectionState,
  AgentImprovementStreamFrontier,
} from '../agent-improvement-reducers/index.js';
import type {
  DeepImprovementCommonMigrationRegistryEntry,
  DeepImprovementCommonResumeCompatibilityComponent,
  DeepImprovementCommonResumeComponentFact,
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeDisposition,
} from '../deep-improvement-common-resume-adapter/index.js';
import type {
  AgentImprovementAuthenticatedTail,
  AgentImprovementBranchResumeDecision,
  AgentImprovementCompatibilityComponentDecision,
  AgentImprovementContinuityLadderRow,
  AgentImprovementContinuityProjection,
  AgentImprovementInvalidationDecision,
  AgentImprovementMigrationRegistry,
  AgentImprovementMigrationRegistryEntry,
  AgentImprovementPersistedRunLease,
  AgentImprovementResumeAdapterOptions,
  AgentImprovementResumeCompatibilityComponent,
  AgentImprovementResumeComponentFact,
  AgentImprovementResumeDecision,
  AgentImprovementResumeDisposition,
  AgentImprovementResumeFingerprint,
  AgentImprovementResumeRebuildReasonCode,
  AgentImprovementResumeRequest,
  AgentImprovementResumeResult,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION =
  'agent-improvement-resume-adapter@1';

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
  'agent-ir',
  'change-contract',
  'mutation-operator',
  'behavior-manifest',
  'evaluator',
  'executor',
  'profile',
  'topology',
  'upcaster',
  'reducer',
  'adapter',
  'codec',
] as const satisfies readonly AgentImprovementResumeCompatibilityComponent[]);
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

export const AGENT_IMPROVEMENT_CONTINUITY_LADDER:
readonly AgentImprovementContinuityLadderRow[] = Object.freeze([
  Object.freeze({
    step: 'run-identity',
    eventFamilies: Object.freeze([
      'deep_improvement_common.run_started',
      'deep_improvement_common.run_resumed',
    ]),
    reducerFields: Object.freeze(['common.run', 'seenEvents', 'streamFrontiers']),
    reentryActions: Object.freeze(['reuse', 'reject'] as const),
  }),
  Object.freeze({
    step: 'agent-ir-and-change-contract',
    eventFamilies: Object.freeze([
      'agent_improvement.definition_snapshot_sealed',
      'agent_improvement.agent_ir_compiled',
      'agent_improvement.change_contract_compiled',
    ]),
    reducerFields: Object.freeze([
      'artifactIndex.definitionSnapshots',
      'artifactIndex.agentIrVersions',
      'artifactIndex.changeContracts',
    ]),
    reentryActions: Object.freeze(['reuse', 'reject'] as const),
  }),
  Object.freeze({
    step: 'candidate-generation',
    eventFamilies: Object.freeze([
      'agent_improvement.mutation_proposed',
      'agent_improvement.mutation_rejected',
    ]),
    reducerFields: Object.freeze(['iterationConvergence.mutations']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'behavior-experiment',
    eventFamilies: Object.freeze([
      'agent_improvement.trace_sliced',
      'agent_improvement.behavior_experiment_sealed',
      'agent_improvement.known_defect_injected',
      'agent_improvement.counterfactual_replayed',
      'agent_improvement.ablation_completed',
      'agent_improvement.behavior_coverage_recorded',
    ]),
    reducerFields: Object.freeze([
      'iterationConvergence.traceSlices',
      'iterationConvergence.experiments',
      'iterationConvergence.interventions',
      'iterationConvergence.coverage',
    ]),
    reentryActions: Object.freeze([
      'reuse', 'reexecute', 'compensate', 'reject',
    ] as const),
  }),
  Object.freeze({
    step: 'evaluation-and-scoring',
    eventFamilies: Object.freeze([
      'agent_improvement.evaluation_manifest_sealed',
      'agent_improvement.transfer_trial_recorded',
      'agent_improvement.behavioral_change_classified',
      'deep_improvement_common.evaluation_normalized',
    ]),
    reducerFields: Object.freeze([
      'artifactIndex.manifests',
      'artifactIndex.transferTrials',
      'iterationConvergence.classifications',
      'common.artifactIndex.derivedScores',
    ]),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
  }),
  Object.freeze({
    step: 'canary-and-promotion',
    eventFamilies: Object.freeze([
      'deep_improvement_common.canary_executed',
      'deep_improvement_common.canary_vetoed',
      'deep_improvement_common.promotion_completed',
    ]),
    reducerFields: Object.freeze([
      'common.iterationConvergence.canaries',
      'common.iterationConvergence.promotions',
    ]),
    reentryActions: Object.freeze([
      'reuse', 'reexecute', 'compensate', 'reject',
    ] as const),
  }),
  Object.freeze({
    step: 'terminal-or-blocked',
    eventFamilies: Object.freeze([
      'deep_improvement_common.run_completed',
      'deep_improvement_common.run_aborted',
      'deep_improvement_common.run_quarantined',
    ]),
    reducerFields: Object.freeze([
      'common.run.state',
      'modeStatus.blockingVetoCodes',
    ]),
    reentryActions: Object.freeze(['reuse', 'reject'] as const),
  }),
]);

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED-SHAPE VALIDATION
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    return false;
  }
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

function uint(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0) {
    throw new TypeError(`${field} must be a non-negative safe integer`);
  }
  return Number(value);
}

function parseComponentFact(
  value: unknown,
  field: string,
): AgentImprovementResumeComponentFact {
  if (
    !isRecord(value)
    || !hasExactKeys(value, ['component', 'version', 'digest'])
    || !COMPONENT_ORDER.includes(
      value.component as AgentImprovementResumeCompatibilityComponent,
    )
  ) {
    throw new TypeError(`${field} must use the closed component-fact shape`);
  }
  return Object.freeze({
    component: value.component as AgentImprovementResumeCompatibilityComponent,
    version: token(value.version, `${field}.version`),
    digest: digest(value.digest, `${field}.digest`),
  });
}

function parseComponentFacts(
  value: unknown,
  field: string,
): readonly AgentImprovementResumeComponentFact[] {
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
): AgentImprovementMigrationRegistryEntry {
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
      value.component as AgentImprovementResumeCompatibilityComponent,
    )
    || !['compatible', 'migrate', 'pin-old-runtime'].includes(
      String(value.outcome),
    )
  ) {
    throw new TypeError(`${field} must use the closed migration-entry shape`);
  }
  return Object.freeze({
    component: value.component as AgentImprovementResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `${field}.fromVersion`),
    fromDigest: digest(value.fromDigest, `${field}.fromDigest`),
    toVersion: token(value.toVersion, `${field}.toVersion`),
    toDigest: digest(value.toDigest, `${field}.toDigest`),
    outcome: value.outcome as AgentImprovementMigrationRegistryEntry['outcome'],
    revision: token(value.revision, `${field}.revision`),
  });
}

/** Commit an authenticated migration registry without its commitment field. */
export function agentImprovementMigrationRegistryDigest(
  registry: Omit<AgentImprovementMigrationRegistry, 'registryDigest'>
    | AgentImprovementMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    entries: registry.entries,
  }));
}

/** Parse the authenticated migration registry without accepting verdicts. */
export function parseAgentImprovementMigrationRegistry(
  input: unknown,
): AgentImprovementMigrationRegistry {
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
    registryDigest: digest(input.registryDigest, 'migrationRegistry.registryDigest'),
  });
  if (
    agentImprovementMigrationRegistryDigest(registry)
    !== registry.registryDigest
  ) {
    throw new TypeError('Migration registry digest does not commit its entries');
  }
  return registry;
}

function parseLease(value: unknown): AgentImprovementPersistedRunLease {
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
    generation: uint(value.generation, 'lease.generation'),
    deadlineAt: timestamp(value.deadlineAt, 'lease.deadlineAt'),
    remainingMs: uint(value.remainingMs, 'lease.remainingMs'),
    certificateDigest: digest(value.certificateDigest, 'lease.certificateDigest'),
    replayFingerprint: digest(value.replayFingerprint, 'lease.replayFingerprint'),
  });
}

function parseStreamFrontier(
  value: unknown,
  field: string,
): AgentImprovementStreamFrontier {
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

function parseCheckpoint(
  value: unknown,
): AgentImprovementProjectionCheckpoint | null {
  if (value === null) return null;
  if (
    !isRecord(value)
    || !hasExactKeys(value, [
      'projection',
      'integrityDigest',
      'sourceStreamTails',
    ])
    || !Array.isArray(value.sourceStreamTails)
  ) {
    throw new TypeError('Checkpoint must use the closed reducer checkpoint shape');
  }
  assertAgentImprovementProjectionState(value.projection);
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
    throw new TypeError('Checkpoint stream tails must be unique and ordered');
  }
  return Object.freeze({
    projection: value.projection as AgentImprovementProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceStreamTails: Object.freeze(sourceStreamTails) as unknown as AgentImprovementStreamFrontier[],
  });
}

/** Parse one request while leaving evidence authority to real verifiers. */
export function parseAgentImprovementResumeRequest(
  input: unknown,
): AgentImprovementResumeRequest {
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
    migrationRegistry: parseAgentImprovementMigrationRegistry(
      input.migrationRegistry,
    ),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    priorRunBundle:
      input.priorRunBundle as unknown as AgentImprovementCertificateBundle,
  });
}

/** Commit every ordered, recomputed resume input. */
export function agentImprovementResumeFingerprintDigest(
  fingerprint: Omit<AgentImprovementResumeFingerprint, 'finalDigest'>
    | AgentImprovementResumeFingerprint,
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
  verification: Extract<
    AgentImprovementOfflineVerificationResult,
    { readonly verdict: 'valid' }
  >,
  componentFacts: readonly AgentImprovementResumeComponentFact[],
): AgentImprovementResumeFingerprint {
  const body = Object.freeze({
    fingerprintVersion: 1 as const,
    runId,
    certificateDigest: verification.certificateDigest,
    replayFingerprint: verification.replayFingerprint,
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    adapterVersion: AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION,
    schemaVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    codecVersion: AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION,
    artifactSetDigest: verification.artifactSetDigest,
    receiptChainDigest: verification.receiptChainDigest,
    componentFacts,
  });
  return Object.freeze({
    ...body,
    finalDigest: agentImprovementResumeFingerprintDigest(body),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. AUTHENTICATED HISTORY AND CHECKPOINTS
// ───────────────────────────────────────────────────────────────────

interface AuthenticatedHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: AgentImprovementLedgerEvent;
}

interface AuthenticatedHistory {
  readonly entries: readonly AuthenticatedHistoryEntry[];
  readonly tail: AgentImprovementAuthenticatedTail;
}

class AgentImprovementResumeIntegrityError extends TypeError {
  public readonly reasonCode: AgentImprovementResumeRebuildReasonCode;

  public constructor(
    reasonCode: AgentImprovementResumeRebuildReasonCode,
    message: string,
  ) {
    super(message);
    this.name = 'AgentImprovementResumeIntegrityError';
    this.reasonCode = reasonCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function canonicalDigest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function authenticatedHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  projectionEvents: readonly AgentImprovementLedgerEvent[],
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
    throw new AgentImprovementResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay range is invalid',
    );
  }
  const covered = verifiedEvents.slice(
    rangeStartSequence - 1,
    rangeEndSequence,
  );
  if (covered.length !== rangeEndSequence - rangeStartSequence + 1) {
    throw new AgentImprovementResumeIntegrityError(
      'cursor-gap',
      'Authenticated replay contains a ledger cursor gap',
    );
  }
  const entries = covered.map((verified, index) => {
    if (verified.frame.sequence !== rangeStartSequence + index) {
      throw new AgentImprovementResumeIntegrityError(
        'cursor-gap',
        'Authenticated replay is out of ledger order',
      );
    }
    const envelope = verified.event.effective.envelope;
    const payload = envelope.payload;
    if (
      !isRecord(payload)
      || !isAgentImprovementEventStem(payload.stem)
      || envelope.event_type !== AgentImprovementWireEventTypes[payload.stem]
      || !isRecord(payload.scope)
      || payload.scope.runId !== runId
    ) {
      throw new AgentImprovementResumeIntegrityError(
        'authenticated-history-invalid',
        'Authenticated replay contains a foreign or malformed event',
      );
    }
    return Object.freeze({
      verified,
      event: envelope as AgentImprovementLedgerEvent,
    });
  });
  const events = entries.map((entry) => entry.event);
  if (canonicalDigest(events) !== canonicalDigest(projectionEvents)) {
    throw new AgentImprovementResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay differs from the reducer input range',
    );
  }
  if (events[0]?.payload.stem !== 'deep_improvement_common.run_started') {
    throw new AgentImprovementResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay lacks the run genesis event',
    );
  }
  const streamTails = new Map<string, {
    readonly eventId: string;
    readonly sequence: number;
  }>();
  const seenEventIds = new Set<string>();
  for (const event of events) {
    if (seenEventIds.has(event.event_id)) {
      throw new AgentImprovementResumeIntegrityError(
        'authenticated-history-invalid',
        'Authenticated replay contains a duplicate event identity',
      );
    }
    const previous = streamTails.get(event.stream_id);
    if (
      previous === undefined
        ? event.stream_sequence !== 1 || event.causation_id !== null
        : event.stream_sequence !== previous.sequence + 1
          || event.causation_id !== previous.eventId
    ) {
      throw new AgentImprovementResumeIntegrityError(
        'cursor-gap',
        'Authenticated replay contains a causal cursor gap or stream split',
      );
    }
    seenEventIds.add(event.event_id);
    streamTails.set(event.stream_id, {
      eventId: event.event_id,
      sequence: event.stream_sequence,
    });
  }
  const first = entries[0];
  const last = entries.at(-1);
  if (first === undefined || last === undefined) {
    throw new AgentImprovementResumeIntegrityError(
      'authenticated-history-invalid',
      'Authenticated replay range is empty',
    );
  }
  return Object.freeze({
    entries: Object.freeze(entries),
    tail: Object.freeze({
      ledgerId: last.verified.frame.ledger_id,
      rangeStartSequence,
      rangeEndSequence,
      startHeadHash: first.verified.frame.prev_record_hash,
      finalHeadHash: last.verified.frame.record_hash,
      streamTails: Object.freeze([...streamTails.entries()]
        .map(([streamId, tail]) => Object.freeze({
          streamId,
          lastSequence: tail.sequence,
        }))
        .sort((left, right) => left.streamId.localeCompare(right.streamId))),
      eventCount: entries.length,
    }),
  });
}

function validateCheckpoint(
  checkpoint: AgentImprovementProjectionCheckpoint | null,
  history: AuthenticatedHistory,
): readonly AgentImprovementResumeRebuildReasonCode[] {
  if (checkpoint === null) return Object.freeze([]);
  const tails = new Map(checkpoint.sourceStreamTails.map((tail) => [
    tail.streamId,
    tail.lastSequence,
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
      <= (tails.get(entry.event.stream_id) ?? 0)
    ))
    .map((entry) => entry.event);
  const expected = foldAgentImprovementEvents(prefix);
  if (expected.outcome !== 'projected') return expected.reasonCodes;
  if (
    expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || canonicalDigest(expected.checkpoint.sourceStreamTails)
      !== canonicalDigest(checkpoint.sourceStreamTails)
    || agentImprovementProjectionIntegrityDigest(expected.projection)
      !== agentImprovementProjectionIntegrityDigest(checkpoint.projection)
  ) {
    return Object.freeze(['checkpoint-digest-mismatch']);
  }
  return Object.freeze([]);
}

// ───────────────────────────────────────────────────────────────────
// 4. VERIFIED FACTS AND COMPATIBILITY
// ───────────────────────────────────────────────────────────────────

function fact(
  component: AgentImprovementResumeCompatibilityComponent,
  version: string,
  value: unknown,
): AgentImprovementResumeComponentFact {
  return Object.freeze({
    component,
    version,
    digest: typeof value === 'string' && DIGEST_PATTERN.test(value)
      ? value
      : canonicalDigest(value),
  });
}

function modeComponentFacts(
  projection: AgentImprovementProjectionState,
  bundle: AgentImprovementCertificateBundle,
): readonly AgentImprovementResumeComponentFact[] {
  const body = bundle.certificate.body;
  const mode = projection.agentImprovement;
  const agentIr = mode.artifactIndex.agentIrVersions.at(-1);
  const change = mode.artifactIndex.changeContracts.at(-1);
  const mutation = mode.iterationConvergence.mutations.at(-1);
  const manifests = mode.artifactIndex.manifests;
  const executorFacts = [
    ...mode.iterationConvergence.experiments.map((entry) => ({
      ref: entry.executorRef,
      digest: entry.executorFingerprint,
    })),
    ...mode.artifactIndex.transferTrials.map((entry) => ({
      sourceRef: entry.sourceExecutorRef,
      sourceDigest: entry.sourceExecutorFingerprint,
      targetRef: entry.targetExecutorRef,
      targetDigest: entry.targetExecutorFingerprint,
    })),
  ];
  return Object.freeze([
    fact(
      'agent-ir',
      agentIr?.agentIrSchemaVersion ?? 'agent-ir@unknown',
      {
        digest: body.agentIrDigest,
        components: agentIr?.components ?? [],
        inheritanceEdges: agentIr?.inheritanceEdges ?? [],
        loci: agentIr?.loci ?? [],
      },
    ),
    fact(
      'change-contract',
      change?.contractPolicyVersion ?? 'change-contract@unknown',
      {
        digest: body.changeContractDigest,
        intended: change?.intendedObligationIds ?? [],
        preserved: change?.preservedObligationIds ?? [],
      },
    ),
    fact(
      'mutation-operator',
      mutation?.mutationOperatorVersion ?? 'mutation-operator@unknown',
      {
        proposalDigest: body.mutationProposalDigest,
        operatorRef: mutation?.mutationOperatorRef ?? null,
        loci: mutation?.targetLocusIds ?? [],
      },
    ),
    fact(
      'behavior-manifest',
      manifests.map((entry) => entry.manifestVersion).sort().join('+')
        || 'behavior-manifest@unknown',
      {
        manifests,
        coverage: mode.iterationConvergence.coverage,
      },
    ),
    fact(
      'evaluator',
      manifests.map((entry) => entry.manifestVersion).sort().join('+')
        || 'evaluator@unknown',
      {
        evaluationEpochId: body.evaluationEpochId,
        capsules: manifests.map((entry) => ({
          ref: entry.evaluatorCapsuleRef,
          digest: entry.evaluatorCapsuleDigest,
        })),
      },
    ),
    fact('executor', 'agent-improvement-executor@1', executorFacts),
    fact(
      'profile',
      'agent-improvement-profile@1',
      mode.modeStatus.profileChampions,
    ),
    fact(
      'topology',
      agentIr?.compilerFingerprint ?? 'agent-ir-compiler@unknown',
      {
        components: agentIr?.components ?? [],
        inheritanceEdges: agentIr?.inheritanceEdges ?? [],
        loci: agentIr?.loci ?? [],
      },
    ),
    fact(
      'upcaster',
      `agent-improvement-upcaster-registry@${AGENT_IMPROVEMENT_EVENT_VERSION}`,
      agentImprovementEventDefinitions(),
    ),
    fact('reducer', projection.reducerVersion, body.projectionIntegrityDigest),
    fact(
      'adapter',
      AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION,
      { adapterVersion: AGENT_IMPROVEMENT_RESUME_ADAPTER_VERSION },
    ),
    fact('codec', projection.codecVersion, { codecVersion: projection.codecVersion }),
  ]);
}

function classifyModeCompatibility(
  persisted: readonly AgentImprovementResumeComponentFact[],
  installed: readonly AgentImprovementResumeComponentFact[],
  registry: AgentImprovementMigrationRegistry,
): readonly AgentImprovementCompatibilityComponentDecision[] {
  return Object.freeze(persisted.map((prior, offset) => {
    const index = offset + SHARED_COMPONENTS.length;
    const component = COMPONENT_ORDER[index];
    const current = installed[index];
    if (
      component === undefined
      || current === undefined
      || prior.component !== component
      || current.component !== component
    ) {
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
  compatibility: readonly AgentImprovementCompatibilityComponentDecision[],
): AgentImprovementResumeDisposition {
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
  registry: AgentImprovementMigrationRegistry,
): ReturnType<typeof parseDeepImprovementCommonMigrationRegistry> {
  const entries = registry.entries
    .filter((entry): entry is AgentImprovementMigrationRegistryEntry & {
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
  request: AgentImprovementResumeRequest,
  bundle: AgentImprovementCertificateBundle,
  options: AgentImprovementResumeAdapterOptions,
  registryTrusted: boolean,
): Promise<DeepImprovementCommonResumeDecision> {
  const registry = commonRegistry(request.migrationRegistry);
  const { bundle: ignored, ...commonVerification } =
    options.verification.commonVerification;
  void ignored;
  const adapter = new DeepImprovementCommonResumeAdapter({
    verification: commonVerification,
    effectLedger: options.effectLedger,
    trustedMigrationRegistryDigests: registryTrusted
      ? Object.freeze([registry.registryDigest])
      : Object.freeze([]),
  });
  const commonBody = bundle.commonBundle.certificate.body;
  const result = await adapter.resume({
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
    checkpoint: null,
    priorRunBundle: bundle.commonBundle,
  });
  return result.decision;
}

// ───────────────────────────────────────────────────────────────────
// 5. BRANCH AND CONTINUITY DECISIONS
// ───────────────────────────────────────────────────────────────────

function branchEvidence(
  projection: AgentImprovementProjectionState,
  candidateId: string,
): readonly string[] {
  const mode = projection.agentImprovement;
  return Object.freeze([
    ...mode.iterationConvergence.mutations
      .filter((entry) => entry.candidateId === candidateId)
      .flatMap((entry) => [
        entry.proposalEventId,
        entry.terminalEventId,
      ]),
    ...mode.iterationConvergence.traceSlices
      .filter((entry) => entry.candidateId === candidateId)
      .map((entry) => entry.producerEventId),
    ...mode.iterationConvergence.experiments
      .filter((entry) => entry.candidateId === candidateId)
      .map((entry) => entry.producerEventId),
    ...mode.iterationConvergence.coverage
      .filter((entry) => entry.candidateId === candidateId)
      .map((entry) => entry.producerEventId),
    ...mode.iterationConvergence.classifications
      .filter((entry) => entry.candidateId === candidateId)
      .map((entry) => entry.producerEventId),
  ].filter((entry): entry is string => entry !== null));
}

function branchDecisions(
  projection: AgentImprovementProjectionState,
  bundle: AgentImprovementCertificateBundle,
  disposition: AgentImprovementResumeDisposition,
): readonly AgentImprovementBranchResumeDecision[] {
  const mode = projection.agentImprovement;
  return Object.freeze(mode.iterationConvergence.mutations.map((mutation) => {
    const evidenceEventIds = branchEvidence(projection, mutation.candidateId);
    const receipt = [...bundle.receipts].reverse().find((candidate) => (
      evidenceEventIds.includes(candidate.facts.resultEventId)
    ));
    const coverage = mode.iterationConvergence.coverage.filter(
      (entry) => entry.candidateId === mutation.candidateId,
    );
    const profileRefs = mode.modeStatus.profileChampions
      .filter((entry) => entry.candidateId === mutation.candidateId)
      .map((entry) => entry.profileRef);
    const behaviorFamilyIds = [...new Set([
      ...coverage.map((entry) => entry.behaviorFamilyId),
      ...mode.iterationConvergence.classifications
        .filter((entry) => entry.candidateId === mutation.candidateId)
        .flatMap((entry) => entry.affectedBehaviorFamilyIds),
    ])].sort();
    const hasBlockingEvidence = coverage.some((entry) => (
      entry.coverageOutcome !== 'covered'
      || entry.criticalInvariantOutcome !== 'pass'
    ));
    let branchDisposition: AgentImprovementBranchResumeDecision['disposition'];
    let decisionReason: string;
    if (
      disposition === 'blocked'
      || disposition === 'rebuild-required'
      || mutation.lifecycle === 'rejected'
      || receipt === undefined
      || hasBlockingEvidence
    ) {
      branchDisposition = 'reject';
      decisionReason = receipt === undefined
        ? 'No verified transition receipt owns this candidate evidence.'
        : 'Compatibility, lifecycle, or behavior evidence blocks candidate reuse.';
    } else if (disposition === 'exact-reuse') {
      branchDisposition = 'reuse';
      decisionReason = 'The verified candidate branch remains byte-compatible.';
    } else {
      branchDisposition = 'reexecute';
      decisionReason = 'The stable candidate identity requires explicit re-entry.';
    }
    return Object.freeze({
      candidateId: mutation.candidateId,
      mutationId: mutation.mutationId,
      profileRefs: Object.freeze(profileRefs),
      behaviorFamilyIds: Object.freeze(behaviorFamilyIds),
      logicalOperationId: `candidate:${mutation.candidateId}`,
      receiptIdentityDigest: receipt?.facts.identity.digest
        ?? canonicalDigest({
          runId: bundle.certificate.body.runId,
          candidateId: mutation.candidateId,
          state: 'missing-receipt',
        }),
      disposition: branchDisposition,
      evidenceEventIds,
      decisionReason,
    });
  }));
}

function continuityProjection(
  projection: AgentImprovementProjectionState,
  generation: number,
): AgentImprovementContinuityProjection {
  const common = projection.common;
  const mode = projection.agentImprovement;
  const terminal = common.run.state === 'completed'
    || common.run.state === 'aborted'
    || common.run.state === 'quarantined';
  const currentStep = terminal || mode.modeStatus.blockingVetoCodes.length > 0
    ? 'terminal-or-blocked' as const
    : common.iterationConvergence.promotions.length > 0
      || common.iterationConvergence.canaries.length > 0
      ? 'canary-and-promotion' as const
      : mode.iterationConvergence.classifications.length > 0
        || mode.artifactIndex.transferTrials.length > 0
        || common.artifactIndex.derivedScores.length > 0
        ? 'evaluation-and-scoring' as const
        : mode.iterationConvergence.experiments.length > 0
          || mode.iterationConvergence.coverage.length > 0
          ? 'behavior-experiment' as const
          : mode.iterationConvergence.mutations.length > 0
            ? 'candidate-generation' as const
            : mode.artifactIndex.agentIrVersions.length > 0
              || mode.artifactIndex.changeContracts.length > 0
              ? 'agent-ir-and-change-contract' as const
              : 'run-identity' as const;
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: common.run.runId ?? '',
    lineageId: common.run.lineageId ?? '',
    generation,
    seenEventIds: Object.freeze(
      projection.seenEvents.map((entry) => entry.eventId),
    ),
    streamTails: Object.freeze(projection.streamFrontiers),
    currentStep,
    activeAgentIrId: mode.iterationConvergence.activeAgentIrId,
    activeMutationId: mode.iterationConvergence.activeMutationId,
    candidateIds: Object.freeze(
      mode.iterationConvergence.mutations.map((entry) => entry.candidateId),
    ),
    componentIds: Object.freeze([...new Set(
      mode.artifactIndex.agentIrVersions.flatMap((entry) => (
        entry.components.map((component) => component.componentId)
      )),
    )].sort()),
    inheritedClauseIds: Object.freeze([...new Set(
      mode.artifactIndex.changeContracts.flatMap((entry) => [
        ...entry.intendedObligationIds,
        ...entry.preservedObligationIds,
      ]),
    )].sort()),
    behaviorFamilyIds: Object.freeze([...new Set(
      mode.iterationConvergence.coverage.map((entry) => entry.behaviorFamilyId),
    )].sort()),
    profileRefs: Object.freeze([...new Set(
      mode.modeStatus.profileChampions.map((entry) => entry.profileRef),
    )].sort()),
    evaluationEpochIds: Object.freeze([...new Set(
      mode.artifactIndex.manifests.map((entry) => entry.evaluationEpochId),
    )].sort()),
    scoredCandidateIds: Object.freeze(
      common.artifactIndex.derivedScores.map((entry) => entry.candidateId),
    ),
    canaryEpochIds: Object.freeze(
      common.iterationConvergence.canaries.map((entry) => entry.canaryEpochId),
    ),
    promotionIds: Object.freeze(
      common.iterationConvergence.promotions.map((entry) => entry.promotionId),
    ),
    unresolvedEvidenceRefs: Object.freeze([
      ...mode.iterationConvergence.unresolvedEvidenceRefs,
    ]),
    blockingVetoCodes: Object.freeze([...new Set([
      ...mode.iterationConvergence.blockingVetoCodes,
      ...mode.modeStatus.blockingVetoCodes,
    ])].sort()),
    terminal,
  });
}

function invalidationDecision(
  compatibility: readonly AgentImprovementCompatibilityComponentDecision[],
  branches: readonly AgentImprovementBranchResumeDecision[],
  effects: AgentImprovementResumeDecision['effects'],
  disposition: AgentImprovementResumeDisposition,
): AgentImprovementInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze(compatibility
      .filter((entry) => entry.outcome !== 'exact')
      .map((entry) => entry.component)),
    invalidatedCandidateIds: Object.freeze(branches
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.candidateId)),
    recoveryRequiredEffectIds: Object.freeze(effects
      .filter((entry) => entry.disposition !== 'reuse')
      .map((entry) => entry.effectId)),
    scoreRebuildRequired: disposition === 'migrate'
      || disposition === 'rebuild-required',
    newLineageRequired: disposition === 'rebuild-required',
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. DECISION VALIDATION
// ───────────────────────────────────────────────────────────────────

function requestDigest(request: AgentImprovementResumeRequest): string {
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

function emptyInvalidation(
  rebuildRequired: boolean,
): AgentImprovementInvalidationDecision {
  return Object.freeze({
    changedComponents: Object.freeze([]),
    invalidatedCandidateIds: Object.freeze([]),
    recoveryRequiredEffectIds: Object.freeze([]),
    scoreRebuildRequired: rebuildRequired,
    newLineageRequired: rebuildRequired,
  });
}

function createDecision(
  request: AgentImprovementResumeRequest,
  verification: AgentImprovementOfflineVerificationResult,
  disposition: AgentImprovementResumeDisposition,
  priorCertificateDisposition: string | null,
  persistedFingerprint: AgentImprovementResumeFingerprint | null,
  currentFingerprint: AgentImprovementResumeFingerprint | null,
  compatibility: readonly AgentImprovementCompatibilityComponentDecision[],
  branches: readonly AgentImprovementBranchResumeDecision[],
  sharedDecision: DeepImprovementCommonResumeDecision | null,
  invalidation: AgentImprovementInvalidationDecision,
  reason: string,
): AgentImprovementResumeDecision {
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
  return parseAgentImprovementResumeDecision(Object.freeze({
    ...body,
    decisionDigest: canonicalDigest(body),
  }));
}

/** Validate one mode decision and its shared decision commitment. */
export function parseAgentImprovementResumeDecision(
  input: unknown,
): AgentImprovementResumeDecision {
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
      input.disposition as AgentImprovementResumeDisposition,
    )
    || !['valid', 'invalid', 'incomplete', 'unverifiable'].includes(
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
        entry.component as AgentImprovementResumeCompatibilityComponent,
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
        'candidateId',
        'mutationId',
        'profileRefs',
        'behaviorFamilyIds',
        'logicalOperationId',
        'receiptIdentityDigest',
        'disposition',
        'evidenceEventIds',
        'decisionReason',
      ])
      || !['reuse', 'reexecute', 'compensate', 'reject'].includes(
        String(entry.disposition),
      )
      || !Array.isArray(entry.profileRefs)
      || !Array.isArray(entry.behaviorFamilyIds)
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
      'invalidatedCandidateIds',
      'recoveryRequiredEffectIds',
      'scoreRebuildRequired',
      'newLineageRequired',
    ])
    || !Array.isArray(input.invalidation.changedComponents)
    || !Array.isArray(input.invalidation.invalidatedCandidateIds)
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
  return Object.freeze(input) as unknown as AgentImprovementResumeDecision;
}

function integrityFailure(
  request: AgentImprovementResumeRequest,
  verification: AgentImprovementOfflineVerificationResult,
  priorDisposition: string | null,
  authenticatedTail: AgentImprovementAuthenticatedTail | null,
  reasonCodes: readonly AgentImprovementResumeRebuildReasonCode[],
  reason: string,
): AgentImprovementResumeResult {
  const decision = createDecision(
    request,
    verification,
    'rebuild-required',
    priorDisposition,
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

function hasDurableModeTrust(bundle: AgentImprovementCertificateBundle): boolean {
  return bundle.certificate.sharedCertificationReceipt.certification.trust_scope
      === 'durable-cross-resume'
    && bundle.receipts.every((receipt) => (
      receipt.sharedReceipt.certification.trust_scope === 'durable-cross-resume'
    ));
}

function declaredCertificateFrontier(
  input: unknown,
): {
  readonly startHeadHash: string;
  readonly finalHeadHash: string;
} | null {
  if (
    !isRecord(input)
    || !isRecord(input.certificate)
    || !isRecord(input.certificate.body)
    || typeof input.certificate.body.startHeadHash !== 'string'
    || typeof input.certificate.body.finalHeadHash !== 'string'
    || !DIGEST_PATTERN.test(input.certificate.body.startHeadHash)
    || !DIGEST_PATTERN.test(input.certificate.body.finalHeadHash)
  ) {
    return null;
  }
  return Object.freeze({
    startHeadHash: input.certificate.body.startHeadHash,
    finalHeadHash: input.certificate.body.finalHeadHash,
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. ADAPTER
// ───────────────────────────────────────────────────────────────────

/**
 * Reconstruct one prior Agent Improvement run and derive a dark decision.
 *
 * The common adapter retains its compatibility, effect, and decision objects.
 * This layer adds only mode-owned facts, branches, and continuity.
 */
export class AgentImprovementResumeAdapter {
  readonly #options: AgentImprovementResumeAdapterOptions;

  public constructor(options: AgentImprovementResumeAdapterOptions) {
    this.#options = options;
  }

  public async resume(input: unknown): Promise<AgentImprovementResumeResult> {
    const request = parseAgentImprovementResumeRequest(input);
    const offlineVerificationPromise =
      verifyAgentImprovementCertificateOffline({
        ...this.#options.verification,
        bundle: request.priorRunBundle,
      });
    let bundle: AgentImprovementCertificateBundle | null = null;
    try {
      bundle = parseAgentImprovementCertificateBundle(request.priorRunBundle);
    } catch {
      bundle = null;
    }
    const replay = this.#options.verification.replay;
    let history: AuthenticatedHistory | null = null;
    let historyFailure: AgentImprovementResumeIntegrityError | null = null;
    try {
      history = authenticatedHistory(
        await replay.ledger.readVerifiedEvents(),
        this.#options.verification.projectionEvents,
        request.runId,
        replay.rangeStartSequence,
        replay.rangeEndSequence,
      );
    } catch (error: unknown) {
      historyFailure = error instanceof AgentImprovementResumeIntegrityError
        ? error
        : new AgentImprovementResumeIntegrityError(
          'authenticated-history-invalid',
          error instanceof Error ? error.message : String(error),
        );
    }
    const offlineVerification = await offlineVerificationPromise;
    if (historyFailure !== null) {
      return integrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.disposition ?? null,
        null,
        Object.freeze([historyFailure.reasonCode]),
        `Authenticated replay integrity failed closed: ${historyFailure.message}.`,
      );
    }
    if (history === null) {
      return integrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.disposition ?? null,
        null,
        Object.freeze(['authenticated-history-invalid']),
        'Authenticated replay state was not resolved.',
      );
    }
    const declaredFrontier = bundle === null
      ? declaredCertificateFrontier(request.priorRunBundle)
      : bundle.certificate.body;
    if (
      declaredFrontier !== null
      && (
        history.tail.startHeadHash !== declaredFrontier.startHeadHash
        || history.tail.finalHeadHash !== declaredFrontier.finalHeadHash
      )
    ) {
      return integrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.disposition ?? null,
        history.tail,
        Object.freeze(['frontier-mismatch']),
        'Certificate frontier differs from the real replayed ledger range.',
      );
    }
    const checkpointReasons = validateCheckpoint(request.checkpoint, history);
    if (checkpointReasons.length > 0) {
      return integrityFailure(
        request,
        offlineVerification,
        bundle?.certificate.body.disposition ?? null,
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
        null,
        emptyInvalidation(false),
        'Prior Agent Improvement certificate evidence did not offline-verify.',
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

    const folded = foldAgentImprovementEvents(
      history.entries.map((entry) => entry.event),
    );
    if (folded.outcome !== 'projected') {
      return integrityFailure(
        request,
        offlineVerification,
        bundle.certificate.body.disposition,
        history.tail,
        folded.reasonCodes,
        `Reducer reconstruction requires a full rebuild: ${
          folded.reasonCodes.join(',')
        }.`,
      );
    }
    if (request.checkpoint !== null) {
      const tails = new Map(request.checkpoint.sourceStreamTails.map((tail) => [
        tail.streamId,
        tail.lastSequence,
      ]));
      const remaining = history.entries
        .filter((entry) => (
          entry.event.stream_sequence
          > (tails.get(entry.event.stream_id) ?? 0)
        ))
        .map((entry) => entry.event);
      const optimized = foldAgentImprovementEvents(remaining, {
        checkpoint: request.checkpoint,
      });
      if (
        optimized.outcome !== 'projected'
        || agentImprovementProjectionIntegrityDigest(optimized.projection)
          !== agentImprovementProjectionIntegrityDigest(folded.projection)
      ) {
        return integrityFailure(
          request,
          offlineVerification,
          bundle.certificate.body.disposition,
          history.tail,
          Object.freeze(['checkpoint-digest-mismatch']),
          'Checkpoint replay differs from a clean authenticated fold.',
        );
      }
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
    const runtimeVersionsMatch =
      projection.reducerVersion === AGENT_IMPROVEMENT_REDUCER_VERSION
      && projection.schemaVersion === AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION
      && projection.codecVersion === AGENT_IMPROVEMENT_PROJECTION_CODEC_VERSION
      && replay.replay.reducerVersion === AGENT_IMPROVEMENT_REDUCER_VERSION
      && replay.replay.projectionSchemaVersion
        === AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION;
    const lifecycleTrusted = hasDurableModeTrust(bundle)
      && body.disposition === 'PASS'
      && projection.common.run.runId === body.runId
      && projection.common.run.lineageId === body.lineageId;

    let sealedReadsValid = true;
    for (const claim of body.artifactClaims) {
      try {
        await readAgentImprovementArtifact(
          this.#options.verification.artifactStore,
          claim.binding,
          { requiredEvaluationEpochId: body.evaluationEpochId },
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
    if (
      sharedPersistedFacts === null
      || sharedPersistedFacts === undefined
      || sharedPersistedFacts.length !== SHARED_COMPONENTS.length
    ) {
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
        'The shared adapter could not derive persisted common facts.',
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
    ] as readonly AgentImprovementResumeComponentFact[]);
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
    ] as readonly AgentImprovementCompatibilityComponentDecision[]);
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
    } else if (!runtimeVersionsMatch) {
      disposition = 'blocked';
      blockingReason = 'Loaded reducer, schema, or codec identity is not real.';
    } else if (!lifecycleTrusted) {
      disposition = 'blocked';
      blockingReason = 'Prior lifecycle evidence is not trusted across resume.';
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
