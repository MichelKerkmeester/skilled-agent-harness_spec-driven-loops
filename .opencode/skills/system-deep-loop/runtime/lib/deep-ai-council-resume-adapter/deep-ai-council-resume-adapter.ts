// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Resume Adapter
// ───────────────────────────────────────────────────────────────────

import { rebuildProjection } from '../authorized-ledger/index.js';
import {
  parseDeepAiCouncilCertificateBundle,
  verifyDeepAiCouncilCertificateOffline,
} from '../deep-ai-council-certificates/index.js';
import {
  DeepAiCouncilWireEventTypes,
  isDeepAiCouncilEventStem,
  prepareDeepAiCouncilEvent,
} from '../deep-ai-council-ledger-schema/index.js';
import {
  DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION,
  DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_REDUCER_VERSION,
  assertDeepAiCouncilProjectionState,
  deepAiCouncilProjectionIntegrityDigest,
  foldDeepAiCouncilEvents,
} from '../deep-ai-council-reducers/index.js';
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
import { ReplayFingerprintError } from '../replay-fingerprint/index.js';

import type {
  LedgerHead,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepAiCouncilCompatibilityStatus,
  DeepAiCouncilEventStem,
  DeepAiCouncilLedgerEvent,
} from '../deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilProjectionCheckpoint,
  DeepAiCouncilProjectionState,
} from '../deep-ai-council-reducers/index.js';
import type {
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  OperatorResolutionPayload,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DeepAiCouncilAuthenticatedMigrationRegistry,
  DeepAiCouncilAuthenticatedTail,
  DeepAiCouncilBranchResumeDecision,
  DeepAiCouncilCompatibilityComponentDecision,
  DeepAiCouncilContinuityLadderRow,
  DeepAiCouncilContinuityProjection,
  DeepAiCouncilEffectResumeDecision,
  DeepAiCouncilInvalidationDecision,
  DeepAiCouncilManifestDisposition,
  DeepAiCouncilPersistedRunLease,
  DeepAiCouncilResumeAdapterOptions,
  DeepAiCouncilResumeAdapterResult,
  DeepAiCouncilResumeCompatibilityComponent,
  DeepAiCouncilResumeCompatibilityRule,
  DeepAiCouncilResumeDecision,
  DeepAiCouncilResumeExecutionPoolEntry,
  DeepAiCouncilResumeFingerprint,
  DeepAiCouncilResumeRebuildReasonCode,
  DeepAiCouncilResumeRequest,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_AI_COUNCIL_RESUME_ADAPTER_VERSION =
  'deep-ai-council-resume-adapter@1';

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+\-]{0,255}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const COMPONENTS: readonly DeepAiCouncilResumeCompatibilityComponent[] =
  Object.freeze([
    'manifest',
    'reducer',
    'adapter',
    'schema',
    'codec',
    'policy',
    'target',
    'tool',
    'model',
    'judge',
  ]);
const COMPATIBILITY_OUTCOMES: readonly DeepAiCouncilCompatibilityStatus[] =
  Object.freeze(['exact', 'compatible', 'migrate', 'pin-old-runtime', 'blocked']);

export const DEEP_AI_COUNCIL_CONTINUITY_LADDER:
readonly DeepAiCouncilContinuityLadderRow[] = Object.freeze([
  Object.freeze({
    step: 'init',
    eventFamilies: Object.freeze([
      'ai_council.run_initialized',
      'ai_council.run_resumed',
      'ai_council.run_restarted',
    ]),
    reducerFields: Object.freeze(['run', 'status', 'seenEvents']),
    reentryActions: Object.freeze(['reuse', 'blocked'] as const),
  }),
  Object.freeze({
    step: 'deliberation',
    eventFamilies: Object.freeze([
      'ai_council.round_started',
      'ai_council.seat_selected',
      'ai_council.seat_dispatched',
      'ai_council.proposal_observed',
      'ai_council.seat_returned',
    ]),
    reducerFields: Object.freeze(['councilSeats']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'wait', 'blocked'] as const),
  }),
  Object.freeze({
    step: 'critique',
    eventFamilies: Object.freeze([
      'ai_council.critique_round_started',
      'ai_council.critique_recorded',
      'ai_council.candidate_blinded',
      'ai_council.pairwise_judgment_recorded',
      'ai_council.bias_audit_recorded',
      'ai_council.adjudication_decision',
    ]),
    reducerFields: Object.freeze(['critique', 'blindedAdjudication']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'wait', 'blocked'] as const),
  }),
  Object.freeze({
    step: 'convergence',
    eventFamilies: Object.freeze([
      'ai_council.stance_recorded',
      'ai_council.stance_flipped',
      'ai_council.deliberation_synthesized',
      'ai_council.convergence_evaluated',
      'ai_council.convergence_blocked',
      'ai_council.round_ended',
    ]),
    reducerFields: Object.freeze(['convergence']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'wait', 'blocked'] as const),
  }),
  Object.freeze({
    step: 'artifacts',
    eventFamilies: Object.freeze([
      'ai_council.artifact_committed',
      'ai_council.artifact_superseded',
      'ai_council.rollback_recorded',
    ]),
    reducerFields: Object.freeze(['artifacts']),
    reentryActions: Object.freeze(['reuse', 'reconcile', 'blocked'] as const),
  }),
  Object.freeze({
    step: 'council-test-gate',
    eventFamilies: Object.freeze(['ai_council.council_test_gate_evaluated']),
    reducerFields: Object.freeze(['testGate']),
    reentryActions: Object.freeze(['reuse', 'reexecute', 'wait', 'blocked'] as const),
  }),
  Object.freeze({
    step: 'complete',
    eventFamilies: Object.freeze(['ai_council.council_complete']),
    reducerFields: Object.freeze(['status']),
    reentryActions: Object.freeze(['reuse', 'blocked'] as const),
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
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
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
  if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > maximum) {
    throw new TypeError(`${field} must be a bounded non-negative integer`);
  }
  return Number(value);
}

function parseFingerprint(
  value: unknown,
  field: string,
): DeepAiCouncilResumeFingerprint {
  if (!isRecord(value) || !hasExactKeys(value, [
    'fingerprintVersion',
    'manifestRevision',
    'reducerVersion',
    'adapterVersion',
    'schemaVersion',
    'codecVersion',
    'policyVersion',
    'targetDigest',
    'toolFingerprint',
    'modelFingerprint',
    'judgeFingerprint',
    'finalDigest',
  ])) {
    throw new TypeError(`${field} must use the closed resume-fingerprint shape`);
  }
  const parsed: DeepAiCouncilResumeFingerprint = Object.freeze({
    fingerprintVersion: uint(
      value.fingerprintVersion,
      `${field}.fingerprintVersion`,
      65_535,
    ),
    manifestRevision: token(value.manifestRevision, `${field}.manifestRevision`),
    reducerVersion: token(value.reducerVersion, `${field}.reducerVersion`),
    adapterVersion: token(value.adapterVersion, `${field}.adapterVersion`),
    schemaVersion: token(value.schemaVersion, `${field}.schemaVersion`),
    codecVersion: token(value.codecVersion, `${field}.codecVersion`),
    policyVersion: token(value.policyVersion, `${field}.policyVersion`),
    targetDigest: digest(value.targetDigest, `${field}.targetDigest`),
    toolFingerprint: digest(value.toolFingerprint, `${field}.toolFingerprint`),
    modelFingerprint: digest(value.modelFingerprint, `${field}.modelFingerprint`),
    judgeFingerprint: digest(value.judgeFingerprint, `${field}.judgeFingerprint`),
    finalDigest: digest(value.finalDigest, `${field}.finalDigest`),
  });
  if (deepAiCouncilResumeFingerprintDigest(parsed) !== parsed.finalDigest) {
    throw new TypeError(`${field}.finalDigest does not commit the ordered inputs`);
  }
  return parsed;
}

function parseCompatibilityRule(
  value: unknown,
  index: number,
): DeepAiCouncilResumeCompatibilityRule {
  if (!isRecord(value) || !hasExactKeys(value, [
    'component',
    'fromVersion',
    'toVersion',
    'outcome',
    'revision',
  ])) {
    throw new TypeError(`migrationRegistry.rules[${index}] must use the closed rule shape`);
  }
  if (!COMPONENTS.includes(value.component as DeepAiCouncilResumeCompatibilityComponent)) {
    throw new TypeError(`migrationRegistry.rules[${index}].component is unknown`);
  }
  if (
    value.outcome !== 'compatible'
    && value.outcome !== 'migrate'
    && value.outcome !== 'pin-old-runtime'
  ) {
    throw new TypeError(`migrationRegistry.rules[${index}].outcome is unknown`);
  }
  return Object.freeze({
    component: value.component as DeepAiCouncilResumeCompatibilityComponent,
    fromVersion: token(
      value.fromVersion,
      `migrationRegistry.rules[${index}].fromVersion`,
    ),
    toVersion: token(value.toVersion, `migrationRegistry.rules[${index}].toVersion`),
    outcome: value.outcome,
    revision: token(value.revision, `migrationRegistry.rules[${index}].revision`),
  });
}

/** Recompute the authenticated migration-registry commitment. */
export function deepAiCouncilMigrationRegistryDigest(
  registry: Omit<DeepAiCouncilAuthenticatedMigrationRegistry, 'registryDigest'>
    | DeepAiCouncilAuthenticatedMigrationRegistry,
): string {
  return sha256Bytes(canonicalBytes({
    registryVersion: registry.registryVersion,
    revision: registry.revision,
    rules: registry.rules,
  }));
}

function parseMigrationRegistry(
  value: unknown,
): DeepAiCouncilAuthenticatedMigrationRegistry {
  if (!isRecord(value) || !hasExactKeys(value, [
    'registryVersion',
    'revision',
    'rules',
    'registryDigest',
  ]) || value.registryVersion !== 1 || !Array.isArray(value.rules)) {
    throw new TypeError('migrationRegistry must use the closed registry shape');
  }
  const rules = value.rules.map(parseCompatibilityRule);
  const identities = rules.map((rule) => [
    rule.component,
    rule.fromVersion,
    rule.toVersion,
  ].join('\u0000'));
  if (new Set(identities).size !== identities.length) {
    throw new TypeError('migrationRegistry contains an ambiguous duplicate identity');
  }
  const parsed = Object.freeze({
    registryVersion: 1 as const,
    revision: token(value.revision, 'migrationRegistry.revision'),
    rules: Object.freeze(rules),
    registryDigest: digest(value.registryDigest, 'migrationRegistry.registryDigest'),
  });
  if (deepAiCouncilMigrationRegistryDigest(parsed) !== parsed.registryDigest) {
    throw new TypeError('migrationRegistry.registryDigest does not commit its rules');
  }
  return parsed;
}

function parseLease(value: unknown): DeepAiCouncilPersistedRunLease {
  if (!isRecord(value) || !hasExactKeys(value, [
    'runId',
    'roundId',
    'leaseId',
    'generation',
    'deadlineAt',
    'remainingMs',
    'replayFingerprint',
  ])) {
    throw new TypeError('lease must use the closed persisted lease shape');
  }
  return Object.freeze({
    runId: token(value.runId, 'lease.runId'),
    roundId: token(value.roundId, 'lease.roundId'),
    leaseId: token(value.leaseId, 'lease.leaseId'),
    generation: uint(value.generation, 'lease.generation', 0xffff_ffff),
    deadlineAt: timestamp(value.deadlineAt, 'lease.deadlineAt'),
    remainingMs: uint(value.remainingMs, 'lease.remainingMs'),
    replayFingerprint: digest(value.replayFingerprint, 'lease.replayFingerprint'),
  });
}

function parseCheckpoint(value: unknown): DeepAiCouncilProjectionCheckpoint | null {
  if (value === null) return null;
  if (!isRecord(value) || !hasExactKeys(value, [
    'projection',
    'integrityDigest',
    'sourceTailSequence',
    'sourceTailDigest',
  ])) {
    throw new TypeError('checkpoint must use the closed reducer checkpoint shape');
  }
  assertDeepAiCouncilProjectionState(value.projection);
  return Object.freeze({
    projection: value.projection as DeepAiCouncilProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceTailSequence: uint(value.sourceTailSequence, 'checkpoint.sourceTailSequence'),
    sourceTailDigest: digest(value.sourceTailDigest, 'checkpoint.sourceTailDigest'),
  });
}

/** Parse one resume request with closed keys and kind-specific field rules. */
export function parseDeepAiCouncilResumeRequest(
  input: unknown,
): DeepAiCouncilResumeRequest {
  scanForbiddenKeys(input);
  if (!isRecord(input) || !hasExactKeys(input, [
    'runId',
    'roundId',
    'manifestRevision',
    'idempotencyKey',
    'requestedAt',
    'resumeReason',
    'persistedFingerprint',
    'installedFingerprint',
    'migrationRegistry',
    'lease',
    'checkpoint',
    'certificateBundle',
  ])) {
    throw new TypeError('Resume request must use the closed request shape');
  }
  return Object.freeze({
    runId: token(input.runId, 'runId'),
    roundId: token(input.roundId, 'roundId'),
    manifestRevision: token(input.manifestRevision, 'manifestRevision'),
    idempotencyKey: token(input.idempotencyKey, 'idempotencyKey'),
    requestedAt: timestamp(input.requestedAt, 'requestedAt'),
    resumeReason: prose(input.resumeReason, 'resumeReason'),
    persistedFingerprint: parseFingerprint(
      input.persistedFingerprint,
      'persistedFingerprint',
    ),
    installedFingerprint: parseFingerprint(
      input.installedFingerprint,
      'installedFingerprint',
    ),
    migrationRegistry: parseMigrationRegistry(input.migrationRegistry),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    certificateBundle: parseDeepAiCouncilCertificateBundle(input.certificateBundle),
  });
}

/** Commit the canonical ordered resume inputs rather than a caller-provided digest. */
export function deepAiCouncilResumeFingerprintDigest(
  fingerprint: Omit<DeepAiCouncilResumeFingerprint, 'finalDigest'>
    | DeepAiCouncilResumeFingerprint,
): string {
  const values = COMPONENTS.map((component) => [
    component,
    componentVersion(fingerprint, component),
  ]);
  return sha256Bytes(canonicalBytes({
    fingerprintVersion: fingerprint.fingerprintVersion,
    orderedComponents: values,
  }));
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFIED LEDGER RECONSTRUCTION
// ───────────────────────────────────────────────────────────────────

interface DeepAiCouncilHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: DeepAiCouncilLedgerEvent;
}

interface AuthenticatedHistory {
  readonly entries: readonly DeepAiCouncilHistoryEntry[];
  readonly tail: DeepAiCouncilAuthenticatedTail;
  readonly tailEventDigest: string;
}

function councilEventForRun(
  verified: VerifiedLedgerEvent,
  runId: string,
): DeepAiCouncilLedgerEvent | null {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isRecord(payload) || !isDeepAiCouncilEventStem(payload.stem)) return null;
  const stem = payload.stem as DeepAiCouncilEventStem;
  if (envelope.event_type !== DeepAiCouncilWireEventTypes[stem]) {
    throw new TypeError('Verified council event type does not match its typed stem');
  }
  if (!isRecord(payload.scope) || payload.scope.runId !== runId) return null;
  return envelope as unknown as DeepAiCouncilLedgerEvent;
}

function authenticatedHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  runId: string,
): AuthenticatedHistory {
  const entries = verifiedEvents
    .map((verified) => {
      const event = councilEventForRun(verified, runId);
      return event === null ? null : { verified, event };
    })
    .filter((entry): entry is DeepAiCouncilHistoryEntry => entry !== null)
    .sort((left, right) => left.event.stream_sequence - right.event.stream_sequence);
  if (
    entries.length === 0
    || entries[0].event.payload.stem !== 'ai_council.run_initialized'
  ) {
    throw new TypeError('Resume requires one authenticated run initialization event');
  }
  const streamId = entries[0].event.stream_id;
  for (const [index, entry] of entries.entries()) {
    if (
      entry.event.stream_id !== streamId
      || entry.event.stream_sequence !== index + 1
    ) {
      throw new TypeError('Authenticated council stream contains a cursor gap or split');
    }
  }
  const last = entries.at(-1)!;
  return Object.freeze({
    entries: Object.freeze(entries),
    tail: Object.freeze({
      ledgerId: last.verified.frame.ledger_id,
      ledgerSequence: last.verified.frame.sequence,
      recordHash: last.verified.frame.record_hash,
      streamId,
      streamSequence: last.event.stream_sequence,
      eventCount: entries.length,
    }),
    tailEventDigest: last.verified.event.stored.digest,
  });
}

function validateCheckpoint(
  checkpoint: DeepAiCouncilProjectionCheckpoint | null,
  history: AuthenticatedHistory,
): readonly DeepAiCouncilResumeRebuildReasonCode[] {
  if (checkpoint === null) return [];
  if (checkpoint.sourceTailSequence > history.tail.streamSequence) return ['cursor-gap'];
  const prefix = history.entries
    .filter((entry) => entry.event.stream_sequence <= checkpoint.sourceTailSequence)
    .map((entry) => entry.event);
  const expected = foldDeepAiCouncilEvents(prefix, {
    sourceTailSequence: checkpoint.sourceTailSequence,
    sourceTailDigest: checkpoint.sourceTailDigest,
  });
  if (expected.outcome === 'rebuild_required') return expected.reasonCodes;
  if (
    expected.checkpoint.integrityDigest !== checkpoint.integrityDigest
    || deepAiCouncilProjectionIntegrityDigest(expected.projection)
      !== deepAiCouncilProjectionIntegrityDigest(checkpoint.projection)
  ) {
    return ['checkpoint-digest-mismatch'];
  }
  return [];
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPATIBILITY AND INVALIDATION
// ───────────────────────────────────────────────────────────────────

function componentVersion(
  fingerprint: Omit<DeepAiCouncilResumeFingerprint, 'finalDigest'>
    | DeepAiCouncilResumeFingerprint,
  component: DeepAiCouncilResumeCompatibilityComponent,
): string {
  switch (component) {
    case 'manifest': return fingerprint.manifestRevision;
    case 'reducer': return fingerprint.reducerVersion;
    case 'adapter': return fingerprint.adapterVersion;
    case 'schema': return fingerprint.schemaVersion;
    case 'codec': return fingerprint.codecVersion;
    case 'policy': return fingerprint.policyVersion;
    case 'target': return fingerprint.targetDigest;
    case 'tool': return fingerprint.toolFingerprint;
    case 'model': return fingerprint.modelFingerprint;
    case 'judge': return fingerprint.judgeFingerprint;
  }
}

function classifyCompatibility(
  request: DeepAiCouncilResumeRequest,
  fingerprintVersionKnown: boolean,
  registryAuthenticated: boolean,
): {
  readonly outcome: DeepAiCouncilCompatibilityStatus;
  readonly manifestDisposition: DeepAiCouncilManifestDisposition;
  readonly decisions: readonly DeepAiCouncilCompatibilityComponentDecision[];
} {
  const decisions = COMPONENTS.map(
    (component): DeepAiCouncilCompatibilityComponentDecision => {
      const persistedVersion = componentVersion(request.persistedFingerprint, component);
      const installedVersion = componentVersion(request.installedFingerprint, component);
      if (!fingerprintVersionKnown) {
        return Object.freeze({
          component,
          persistedVersion,
          installedVersion,
          outcome: 'blocked',
          revision: null,
          decisionReason: 'Fingerprint version is not registered.',
        });
      }
      if (persistedVersion === installedVersion) {
        return Object.freeze({
          component,
          persistedVersion,
          installedVersion,
          outcome: 'exact',
          revision: null,
          decisionReason: 'Persisted and installed component facts are identical.',
        });
      }
      const rule = request.migrationRegistry.rules.find((candidate) => (
        candidate.component === component
        && candidate.fromVersion === persistedVersion
        && candidate.toVersion === installedVersion
      ));
      if (rule === undefined) {
        return Object.freeze({
          component,
          persistedVersion,
          installedVersion,
          outcome: 'blocked',
          revision: null,
          decisionReason: 'No authenticated migration path covers this fact pair.',
        });
      }
      if (!registryAuthenticated) {
        return Object.freeze({
          component,
          persistedVersion,
          installedVersion,
          outcome: 'blocked',
          revision: null,
          decisionReason: 'The migration registry commitment is not trusted.',
        });
      }
      return Object.freeze({
        component,
        persistedVersion,
        installedVersion,
        outcome: rule.outcome,
        revision: rule.revision,
        decisionReason: 'A trusted migration registry covers this fact pair.',
      });
    },
  );
  const outcomes = new Set(decisions.map((decision) => decision.outcome));
  const outcome: DeepAiCouncilCompatibilityStatus = outcomes.has('blocked')
    ? 'blocked'
    : outcomes.has('pin-old-runtime')
      ? 'pin-old-runtime'
      : outcomes.has('migrate')
        ? 'migrate'
        : outcomes.has('compatible')
          ? 'compatible'
          : 'exact';
  const manifest = decisions.find((decision) => decision.component === 'manifest');
  const manifestDisposition: DeepAiCouncilManifestDisposition =
    request.persistedFingerprint.manifestRevision
      === request.installedFingerprint.manifestRevision
      ? 'original'
      : manifest?.outcome === 'compatible' || manifest?.outcome === 'migrate'
        ? 'restart'
        : 'reject';
  return Object.freeze({
    outcome,
    manifestDisposition,
    decisions: Object.freeze(decisions),
  });
}

function deriveInvalidation(
  projection: DeepAiCouncilProjectionState,
  compatibility: readonly DeepAiCouncilCompatibilityComponentDecision[],
): DeepAiCouncilInvalidationDecision {
  const changedComponents = compatibility
    .filter((decision) => decision.outcome !== 'exact')
    .map((decision) => decision.component);
  const executionChanged = changedComponents.some((component) => (
    component === 'manifest'
    || component === 'model'
    || component === 'tool'
    || component === 'target'
    || component === 'schema'
    || component === 'reducer'
  ));
  return Object.freeze({
    changedComponents: Object.freeze([...new Set(changedComponents)].sort()),
    invalidatedLogicalBranchIds: Object.freeze(executionChanged
      ? projection.councilSeats.seats.map((seat) => (
        seat.logicalBranchRef ?? `seat:${seat.roundId}:${seat.seatId}`
      )).sort()
      : []),
    invalidatedArtifactIds: Object.freeze(executionChanged
      ? projection.artifacts.records.map((artifact) => artifact.artifactId).sort()
      : []),
    convergenceReopened: executionChanged
      || changedComponents.includes('judge')
      || changedComponents.includes('policy'),
    testGateReopened: changedComponents.length > 0,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. BRANCH, EFFECT, AND CONTINUITY PLANNING
// ───────────────────────────────────────────────────────────────────

function retryKey(roundId: string, logicalBranchId: string): string {
  return `retry:${sha256Bytes(canonicalBytes({ roundId, logicalBranchId }))}`;
}

function attemptId(kind: 'branch' | 'effect', identity: string, key: string): string {
  return `${kind}-attempt-${sha256Bytes(canonicalBytes({
    identity,
    idempotencyKey: key,
  })).slice(0, 40)}`;
}

function branchDecisions(
  projection: DeepAiCouncilProjectionState,
  request: DeepAiCouncilResumeRequest,
  compatibility: DeepAiCouncilCompatibilityStatus,
  invalidation: DeepAiCouncilInvalidationDecision,
): readonly DeepAiCouncilBranchResumeDecision[] {
  const invalidated = new Set(invalidation.invalidatedLogicalBranchIds);
  return Object.freeze(projection.councilSeats.seats.map((seat) => {
    const logicalBranchId =
      seat.logicalBranchRef ?? `seat:${seat.roundId}:${seat.seatId}`;
    const proposal = projection.councilSeats.proposals.find((candidate) => (
      candidate.roundId === seat.roundId
      && candidate.seatId === seat.seatId
      && candidate.responseStatus === 'returned'
    ));
    const blocked =
      compatibility === 'blocked' || compatibility === 'pin-old-runtime';
    const disposition = blocked
      ? 'blocked' as const
      : invalidated.has(logicalBranchId) || proposal === undefined
        ? seat.dispatchEventId === null && proposal === undefined
          ? 'reexecute' as const
          : proposal === undefined && seat.budgetLeaseRef !== null
            ? 'wait' as const
            : 'reexecute' as const
        : 'reuse' as const;
    return Object.freeze({
      logicalBranchId,
      seatId: seat.seatId,
      roundId: seat.roundId,
      retryKey: retryKey(request.roundId, logicalBranchId),
      disposition,
      attemptId: disposition === 'reexecute'
        ? attemptId('branch', logicalBranchId, request.idempotencyKey)
        : null,
      evidenceEventIds: Object.freeze([
        seat.selectedEventId,
        ...(seat.dispatchEventId === null ? [] : [seat.dispatchEventId]),
        ...(proposal === undefined ? [] : [
          proposal.observedEventId,
          ...(proposal.returnedEventId === null ? [] : [proposal.returnedEventId]),
        ]),
      ]),
      decisionReason: blocked
        ? 'Compatibility blocks branch recovery.'
        : disposition === 'reuse'
          ? 'A stable logical branch has one committed returned proposal.'
          : disposition === 'wait'
            ? 'A dispatched branch retains an unresolved durable lease.'
            : 'The logical branch lacks a reusable result or was invalidated.',
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
  request: DeepAiCouncilResumeRequest,
  globallyBlocked: boolean,
): readonly DeepAiCouncilEffectResumeDecision[] {
  return Object.freeze(history.intents.map((intentRecord) => {
    const intent = intentRecord.payload;
    const confirmation = history.confirmations.find((entry) => (
      effectConfirmationBindsIntent(
        entry,
        intent,
        intentRecord.eventId,
        intentRecord.eventDigest,
      )
    ));
    const recoveries = history.recoveries.filter((entry) => (
      entry.intent_event_id === intentRecord.eventId
      && entry.intent_event_digest === intentRecord.eventDigest
    ));
    const reconciliations = history.reconciliations.filter((entry) => (
      entry.intent_event_id === intentRecord.eventId
      && recoveries.some((recovery) => recovery.recovery_id === entry.recovery_id)
    ));
    const latest = reconciliations.at(-1);
    const conflict = history.conflicts.some((entry) => (
      entry.existing_intent_event_id === intentRecord.eventId
    ));
    let disposition: DeepAiCouncilEffectResumeDecision['disposition'];
    let decisionReason: string;
    if (globallyBlocked || conflict) {
      disposition = 'blocked';
      decisionReason = 'Compatibility or an immutable effect conflict blocks recovery.';
    } else if (confirmation !== undefined || latest?.verdict === 'applied') {
      disposition = 'reconcile';
      decisionReason = 'Descriptor-bound evidence records an applied external outcome.';
    } else if (latest?.verdict === 'not_applied' && intent.adapter.replay_safe) {
      disposition = 'reexecute';
      decisionReason = 'Reconciliation proves non-application and replay is safe.';
    } else if (
      latest?.verdict === 'in_doubt'
      || latest?.verdict === 'conflict'
      || intent.adapter.reconciliation !== 'conclusive'
    ) {
      disposition = 'blocked';
      decisionReason = 'The irreversible effect outcome is not conclusively proven.';
    } else {
      disposition = 'reconcile';
      decisionReason = 'The descriptor supports conclusive provider reconciliation.';
    }
    const attemptRefs = [
      intentRecord.eventId,
      ...recoveries.map((entry) => entry.recovery_id),
      ...reconciliations.map((entry) => entry.recovery_id),
      ...(confirmation === undefined ? [] : [confirmation.confirmation_id]),
      ...history.resolutions
        .filter((entry) => (
          entry.intent_event_id === intentRecord.eventId
          && recoveries.some((recovery) => recovery.recovery_id === entry.recovery_id)
        ))
        .map((entry) => entry.resolution_id),
    ];
    return Object.freeze({
      effectId: intent.effect_id,
      logicalEffectId: intent.logical_effect_id,
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
  projection: DeepAiCouncilProjectionState,
  sourceTailSequence: number,
  packetPointer: string,
): DeepAiCouncilContinuityProjection {
  const step = projection.status.state === 'complete'
    ? 'complete' as const
    : projection.testGate.evaluations.length > 0
      ? 'council-test-gate' as const
      : projection.artifacts.records.length > 0
        ? 'artifacts' as const
        : projection.convergence.evaluations.length > 0
          || projection.convergence.deliberations.length > 0
          ? 'convergence' as const
          : projection.critique.rounds.length > 0
            || projection.blindedAdjudication.candidates.length > 0
            ? 'critique' as const
            : projection.councilSeats.rounds.length > 0
              ? 'deliberation' as const
              : 'init' as const;
  const branches = projection.councilSeats.seats.map((seat) => (
    seat.logicalBranchRef ?? `seat:${seat.roundId}:${seat.seatId}`
  ));
  const completed = projection.councilSeats.seats
    .filter((seat) => projection.councilSeats.proposals.some((proposal) => (
      proposal.roundId === seat.roundId
      && proposal.seatId === seat.seatId
      && proposal.responseStatus === 'returned'
    )))
    .map((seat) => seat.logicalBranchRef ?? `seat:${seat.roundId}:${seat.seatId}`);
  const blockers = [
    ...projection.convergence.blockerIds,
    ...(projection.status.blockingReason === null
      ? []
      : [projection.status.blockingReason]),
  ];
  const recent = projection.status.provenance.at(-1)?.producerStem ?? 'ai_council.run_initialized';
  const next = projection.status.terminal
    ? 'none'
    : step === 'init'
      ? 'ai_council.round_started'
      : step === 'deliberation'
        ? 'ai_council.seat_returned'
        : step === 'critique'
          ? 'ai_council.adjudication_decision'
          : step === 'convergence'
            ? 'ai_council.artifact_committed'
            : step === 'artifacts'
              ? 'ai_council.council_test_gate_evaluated'
              : 'ai_council.council_complete';
  const total = Math.max(projection.councilSeats.seats.length, 1);
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    packetPointer,
    runId: projection.run.runId ?? '',
    roundId: projection.run.roundId ?? '',
    generation: projection.run.generation,
    lastAppliedSeq: sourceTailSequence,
    seenEventIds: Object.freeze(projection.seenEvents.map((event) => event.eventId)),
    currentStep: step,
    recentAction: recent,
    nextSafeAction: next,
    blockers: Object.freeze([...new Set(blockers)].sort()),
    progress: Math.min(100, Math.round((completed.length / total) * 100)),
    openQuestions: Object.freeze([
      ...projection.convergence.presentation.unresolvedValueRefs,
      ...projection.convergence.presentation.reopenConditionRefs,
    ].sort()),
    answeredQuestions: Object.freeze([
      ...projection.convergence.presentation.minorityRefs,
      ...projection.convergence.presentation.contradictionRefs,
    ].sort()),
    logicalBranchIds: Object.freeze([...new Set(branches)].sort()),
    completedLogicalBranchIds: Object.freeze([...new Set(completed)].sort()),
    critiqueRoundIds: Object.freeze([
      ...new Set(projection.critique.rounds.map((round) => round.critiqueRoundId)),
    ].sort()),
    minorityClaimIds: Object.freeze([
      ...new Set(projection.convergence.presentation.minorityRefs),
    ].sort()),
    artifactIds: Object.freeze(projection.artifacts.records
      .map((artifact) => artifact.artifactId).sort()),
    convergenceOutcome: projection.convergence.outcome,
    gateVerdict: projection.testGate.verdict,
    terminalState: projection.status.state,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. DECISION VALIDATION
// ───────────────────────────────────────────────────────────────────

function assertTokenArray(value: unknown, field: string): void {
  if (!Array.isArray(value)) throw new TypeError(`${field} must be an array`);
  value.forEach((entry, index) => token(entry, `${field}[${index}]`));
}

function assertClosedDecisionRecord(
  value: unknown,
): asserts value is DeepAiCouncilResumeDecision {
  if (!isRecord(value) || !hasExactKeys(value, [
    'decisionVersion',
    'decisionId',
    'decisionDigest',
    'authority',
    'legacyAuthority',
    'productionCompletion',
    'disposition',
    'compatibilityOutcome',
    'manifestDisposition',
    'compatibility',
    'branches',
    'effects',
    'invalidation',
    'lease',
    'certificateDigest',
    'receiptDigests',
    'verifiedArtifactDigests',
    'persistedResumeFingerprint',
    'installedResumeFingerprint',
    'decisionReason',
  ])) {
    throw new TypeError('Resume decision must use the closed decision shape');
  }
  if (
    value.decisionVersion !== 1
    || value.authority !== 'dark-evidence-only'
    || value.legacyAuthority !== 'unchanged'
    || value.productionCompletion !== false
    || !['exact-reuse', 'compatible', 'migrate', 'blocked'].includes(
      String(value.disposition),
    )
    || !COMPATIBILITY_OUTCOMES.includes(
      value.compatibilityOutcome as DeepAiCouncilCompatibilityStatus,
    )
    || !['original', 'restart', 'reject'].includes(String(value.manifestDisposition))
    || !Array.isArray(value.compatibility)
    || !Array.isArray(value.branches)
    || !Array.isArray(value.effects)
  ) {
    throw new TypeError('Resume decision contains an invalid discriminator');
  }
  token(value.decisionId, 'decision.decisionId');
  digest(value.decisionDigest, 'decision.decisionDigest');
  digest(value.certificateDigest, 'decision.certificateDigest');
  digest(value.persistedResumeFingerprint, 'decision.persistedResumeFingerprint');
  digest(value.installedResumeFingerprint, 'decision.installedResumeFingerprint');
  prose(value.decisionReason, 'decision.decisionReason');
  parseLease(value.lease);
  assertTokenArray(value.receiptDigests, 'decision.receiptDigests');
  assertTokenArray(value.verifiedArtifactDigests, 'decision.verifiedArtifactDigests');
  if (!isRecord(value.invalidation) || !hasExactKeys(value.invalidation, [
    'changedComponents',
    'invalidatedLogicalBranchIds',
    'invalidatedArtifactIds',
    'convergenceReopened',
    'testGateReopened',
  ])) {
    throw new TypeError('decision.invalidation must use the closed shape');
  }
  assertTokenArray(value.invalidation.changedComponents, 'invalidation.changedComponents');
  assertTokenArray(
    value.invalidation.invalidatedLogicalBranchIds,
    'invalidation.invalidatedLogicalBranchIds',
  );
  assertTokenArray(
    value.invalidation.invalidatedArtifactIds,
    'invalidation.invalidatedArtifactIds',
  );
  if (
    typeof value.invalidation.convergenceReopened !== 'boolean'
    || typeof value.invalidation.testGateReopened !== 'boolean'
  ) {
    throw new TypeError('decision.invalidation flags must be booleans');
  }
  for (const [index, entry] of value.compatibility.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'component',
      'persistedVersion',
      'installedVersion',
      'outcome',
      'revision',
      'decisionReason',
    ])) {
      throw new TypeError(`decision.compatibility[${index}] is not closed`);
    }
    if (
      !COMPONENTS.includes(entry.component as DeepAiCouncilResumeCompatibilityComponent)
      || !COMPATIBILITY_OUTCOMES.includes(
        entry.outcome as DeepAiCouncilCompatibilityStatus,
      )
    ) {
      throw new TypeError(`decision.compatibility[${index}] is invalid`);
    }
    token(entry.persistedVersion, `decision.compatibility[${index}].persistedVersion`);
    token(entry.installedVersion, `decision.compatibility[${index}].installedVersion`);
    if (entry.revision !== null) {
      token(entry.revision, `decision.compatibility[${index}].revision`);
    }
    prose(entry.decisionReason, `decision.compatibility[${index}].decisionReason`);
  }
  for (const [index, entry] of value.branches.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'logicalBranchId',
      'seatId',
      'roundId',
      'retryKey',
      'disposition',
      'attemptId',
      'evidenceEventIds',
      'decisionReason',
    ]) || !['reuse', 'reexecute', 'wait', 'blocked'].includes(
      String(entry.disposition),
    )) {
      throw new TypeError(`decision.branches[${index}] is not closed`);
    }
    token(entry.logicalBranchId, `decision.branches[${index}].logicalBranchId`);
    token(entry.seatId, `decision.branches[${index}].seatId`);
    token(entry.roundId, `decision.branches[${index}].roundId`);
    token(entry.retryKey, `decision.branches[${index}].retryKey`);
    if (entry.attemptId !== null) {
      token(entry.attemptId, `decision.branches[${index}].attemptId`);
    }
    assertTokenArray(entry.evidenceEventIds, `decision.branches[${index}].evidenceEventIds`);
    prose(entry.decisionReason, `decision.branches[${index}].decisionReason`);
  }
  for (const [index, entry] of value.effects.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'effectId',
      'logicalEffectId',
      'disposition',
      'attemptRefs',
      'nextAttemptId',
      'decisionReason',
    ]) || !['reexecute', 'reconcile', 'blocked'].includes(
      String(entry.disposition),
    )) {
      throw new TypeError(`decision.effects[${index}] is not closed`);
    }
    token(entry.effectId, `decision.effects[${index}].effectId`);
    token(entry.logicalEffectId, `decision.effects[${index}].logicalEffectId`);
    if (entry.nextAttemptId !== null) {
      token(entry.nextAttemptId, `decision.effects[${index}].nextAttemptId`);
    }
    assertTokenArray(entry.attemptRefs, `decision.effects[${index}].attemptRefs`);
    prose(entry.decisionReason, `decision.effects[${index}].decisionReason`);
  }
}

/** Validate a decision at module boundaries and reject every unknown key. */
export function parseDeepAiCouncilResumeDecision(
  input: unknown,
): DeepAiCouncilResumeDecision {
  scanForbiddenKeys(input);
  assertClosedDecisionRecord(input);
  const { decisionDigest: ignored, ...body } = input;
  void ignored;
  if (sha256Bytes(canonicalBytes(body)) !== input.decisionDigest) {
    throw new TypeError('Resume decision digest does not commit the closed body');
  }
  return Object.freeze(input);
}

// ───────────────────────────────────────────────────────────────────
// 7. ADAPTER
// ───────────────────────────────────────────────────────────────────

/** Reconstruct and re-enter one council run through additive-dark boundaries. */
export class DeepAiCouncilResumeAdapter {
  readonly #options: DeepAiCouncilResumeAdapterOptions;

  public constructor(options: DeepAiCouncilResumeAdapterOptions) {
    this.#options = options;
  }

  public async resume(input: unknown): Promise<DeepAiCouncilResumeAdapterResult> {
    const request = parseDeepAiCouncilResumeRequest(input);
    if (
      request.manifestRevision !== request.installedFingerprint.manifestRevision
      || request.roundId !== request.lease.roundId
    ) {
      throw new TypeError('Requested runtime identity differs from installed continuity');
    }
    const allVerified = await this.#options.ledger.readVerifiedEvents();
    const currentHead = await this.#options.ledger.getVerifiedHead();
    const existing = allVerified.filter((verified) => {
      const envelope = verified.event.effective.envelope;
      const payload = envelope.payload;
      return envelope.idempotency_key === request.idempotencyKey
        && isRecord(payload)
        && payload.stem === 'ai_council.run_resumed'
        && isRecord(payload.scope)
        && payload.scope.runId === request.runId;
    });
    if (existing.length > 1) {
      throw new TypeError('Resume idempotency key resolves to multiple events');
    }
    const prefix = existing.length === 1
      ? allVerified.filter((verified) => (
        verified.frame.sequence < existing[0].frame.sequence
      ))
      : allVerified;
    const history = authenticatedHistory(prefix, request.runId);
    const checkpointReasons = validateCheckpoint(request.checkpoint, history);
    if (checkpointReasons.length > 0) {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([...checkpointReasons]),
        authenticatedTail: history.tail,
      }) as DeepAiCouncilResumeAdapterResult;
    }
    const certificate = request.certificateBundle.certificate;
    const certificateEvents = history.entries.filter((entry) => (
      entry.verified.frame.sequence >= certificate.body.startHead.sequence + 1
      && entry.verified.frame.sequence <= certificate.body.finalHead.sequence
    ));
    const certificateTail = certificateEvents.at(-1)?.verified;
    if (
      certificateTail === undefined
      || certificateTail.frame.sequence !== certificate.body.finalHead.sequence
      || certificateTail.frame.record_hash !== certificate.body.finalHead.record_hash
    ) {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze(['certificate-head-mismatch'] as const),
        authenticatedTail: history.tail,
      });
    }
    const verification = await verifyDeepAiCouncilCertificateOffline({
      bundle: request.certificateBundle,
      projectionEvents: certificateEvents.map((entry) => entry.event),
      artifactStore: this.#options.artifactStore,
      replay: {
        ledger: this.#options.ledger,
        eventRegistry: this.#options.certificateVerification.eventRegistry,
        versionRegistry: this.#options.certificateVerification.versionRegistry,
        componentRegistry: this.#options.certificateVerification.componentRegistry,
        runId: request.runId,
        rangeStartSequence: certificate.body.startHead.sequence + 1,
        rangeEndSequence: certificate.body.finalHead.sequence,
        replay: this.#options.certificateVerification.replay,
      },
      providers: this.#options.certificateVerification.providers,
    });
    if (verification.verdict !== 'valid') {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([
          verification.verdict === 'incomplete'
            ? 'certificate-lifecycle-untrusted'
            : 'certificate-unverified',
        ] as const),
        authenticatedTail: history.tail,
      });
    }
    const folded = foldDeepAiCouncilEvents(
      history.entries.map((entry) => entry.event),
      {
        sourceTailSequence: history.tail.streamSequence,
        sourceTailDigest: history.tailEventDigest,
      },
    );
    if (folded.outcome === 'rebuild_required') {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: folded.reasonCodes,
        authenticatedTail: history.tail,
      });
    }
    const projection = folded.projection;
    this.#assertRunAndLease(request, projection, certificate.body.replayFingerprint);
    const policy = this.#options.policies.resolve(
      this.#options.policyId,
      this.#options.policyVersion,
    );

    let fingerprintVersionKnown = true;
    try {
      this.#options.fingerprintVersions.resolve(
        request.persistedFingerprint.fingerprintVersion,
      );
      this.#options.fingerprintVersions.resolve(
        request.installedFingerprint.fingerprintVersion,
      );
    } catch (error: unknown) {
      if (!(error instanceof ReplayFingerprintError)) throw error;
      fingerprintVersionKnown = false;
    }
    const registryAuthenticated =
      this.#options.trustedMigrationRegistryDigests.includes(
        request.migrationRegistry.registryDigest,
      );
    let compatibility = classifyCompatibility(
      request,
      fingerprintVersionKnown,
      registryAuthenticated,
    );
    const evidenceFailures: string[] = [];
    if (
      request.installedFingerprint.reducerVersion !== DEEP_AI_COUNCIL_REDUCER_VERSION
      || request.installedFingerprint.adapterVersion
        !== DEEP_AI_COUNCIL_RESUME_ADAPTER_VERSION
      || request.installedFingerprint.schemaVersion
        !== DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION
      || request.installedFingerprint.codecVersion
        !== DEEP_AI_COUNCIL_PROJECTION_CODEC_VERSION
      || request.installedFingerprint.policyVersion
        !== `${policy.policyId}@${policy.policyVersion}`
    ) {
      evidenceFailures.push(
        'Installed fingerprint does not identify the loaded runtime contracts.',
      );
    }
    const expectedModels = sha256Bytes(canonicalBytes([
      ...new Set(projection.councilSeats.seats.map((seat) => seat.modelFingerprint)),
    ].sort()));
    const expectedJudges = sha256Bytes(canonicalBytes([
      ...new Set(projection.blindedAdjudication.judgments.map(
        (judgment) => judgment.judgeProfileFingerprint,
      )),
    ].sort()));
    if (
      projection.run.initialReplayFingerprint
        !== request.persistedFingerprint.finalDigest
      || projection.run.targetDigest !== request.persistedFingerprint.targetDigest
      || projection.run.configDigest !== request.persistedFingerprint.toolFingerprint
      || expectedModels !== request.persistedFingerprint.modelFingerprint
      || expectedJudges !== request.persistedFingerprint.judgeFingerprint
    ) {
      evidenceFailures.push(
        'Persisted resume facts are not bound by the reducer projection.',
      );
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
    if (evidenceFailures.length > 0) {
      compatibility = Object.freeze({
        ...compatibility,
        outcome: 'blocked' as const,
        manifestDisposition: compatibility.manifestDisposition === 'original'
          ? 'original' as const
          : 'reject' as const,
      });
    }
    const invalidation = deriveInvalidation(projection, compatibility.decisions);
    const branches = branchDecisions(
      projection,
      request,
      compatibility.outcome,
      invalidation,
    );
    const effects = effectDecisions(
      effectHistory(effectEvents, request.runId),
      request,
      compatibility.outcome === 'blocked'
        || compatibility.outcome === 'pin-old-runtime',
    );
    const disposition = compatibility.outcome === 'exact'
      ? 'exact-reuse' as const
      : compatibility.outcome === 'compatible'
        ? 'compatible' as const
        : compatibility.outcome === 'migrate'
          ? 'migrate' as const
          : 'blocked' as const;
    const decisionBody = {
      decisionVersion: 1 as const,
      decisionId: `resume-decision-${sha256Bytes(canonicalBytes({
        runId: request.runId,
        roundId: request.roundId,
        certificateDigest: certificate.certificateDigest,
        idempotencyKey: request.idempotencyKey,
      })).slice(0, 40)}`,
      authority: 'dark-evidence-only' as const,
      legacyAuthority: 'unchanged' as const,
      productionCompletion: false as const,
      disposition,
      compatibilityOutcome: compatibility.outcome,
      manifestDisposition: compatibility.manifestDisposition,
      compatibility: compatibility.decisions,
      branches,
      effects,
      invalidation,
      lease: request.lease,
      certificateDigest: certificate.certificateDigest,
      receiptDigests: Object.freeze([...certificate.body.receiptDigests]),
      verifiedArtifactDigests: Object.freeze(certificate.body.artifactClaims
        .map((claim) => claim.contentDigest).sort()),
      persistedResumeFingerprint: request.persistedFingerprint.finalDigest,
      installedResumeFingerprint:
        deepAiCouncilResumeFingerprintDigest(request.installedFingerprint),
      decisionReason: evidenceFailures.length > 0
        ? evidenceFailures.join(' ')
        : compatibility.outcome === 'blocked'
          || compatibility.outcome === 'pin-old-runtime'
          ? 'One or more pinned component facts have no trusted recovery path.'
          : 'Offline-verified evidence has one deterministic recovery plan.',
    };
    const decision = parseDeepAiCouncilResumeDecision(Object.freeze({
      ...decisionBody,
      decisionDigest: sha256Bytes(canonicalBytes(decisionBody)),
    }));
    const continuity = continuityProjection(
      projection,
      history.tail.streamSequence,
      this.#options.packetPointer,
    );
    const executionPool = Object.freeze(branches
      .filter(
        (branch): branch is DeepAiCouncilBranchResumeDecision & {
          readonly attemptId: string;
        } => branch.disposition === 'reexecute' && branch.attemptId !== null,
      )
      .map((branch): DeepAiCouncilResumeExecutionPoolEntry => Object.freeze({
        logicalBranchId: branch.logicalBranchId,
        seatId: branch.seatId,
        roundId: branch.roundId,
        retryKey: branch.retryKey,
        attemptId: branch.attemptId,
      })));
    const eventId = `resume-${sha256Bytes(canonicalBytes({
      decisionId: decision.decisionId,
      idempotencyKey: request.idempotencyKey,
    })).slice(0, 40)}`;
    const prepared = prepareDeepAiCouncilEvent({
      stem: 'ai_council.run_resumed',
      scope: {
        runId: request.runId,
        roundId: request.roundId,
        generation: request.lease.generation,
      },
      prevEventHash: history.tailEventDigest,
      replay: history.entries[0].event.payload.replay,
      data: {
        priorTailDigest: history.tail.recordHash,
        sourceRunId: request.runId,
        resumeReason: request.resumeReason,
        generation: request.lease.generation,
        compatibilityDecision: decision.compatibilityOutcome,
        recoveryReceiptRef: decision.decisionId,
        continuationScopeRef: request.lease.leaseId,
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
    if (
      existing.length === 1
      && existing[0].event.effective.envelope.event_id !== prepared.identity.eventId
    ) {
      throw new TypeError(
        'Resume idempotency key is already bound to different semantic bytes',
      );
    }
    const priorHead: LedgerHead = existing.length === 1
      ? Object.freeze({
        ledgerId: currentHead.ledgerId,
        sequence: existing[0].frame.sequence - 1,
        recordHash: existing[0].frame.prev_record_hash,
      })
      : currentHead;
    const authorization = await this.#options.gateway.authorize({
      requestId: `resume-auth-${sha256Bytes(
        canonicalBytes(request.idempotencyKey),
      ).slice(0, 40)}`,
      mode: 'ai-council',
      event: prepared,
      priorHead,
      priorStateVersion: this.#options.priorStateVersion,
      priorStateFingerprint: deepAiCouncilProjectionIntegrityDigest(projection),
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
      throw new TypeError(
        `Resume decision authorization was denied: ${authorization.reasonCode}`,
      );
    }
    const appendReceipt = await this.#options.ledger.appendAuthorized(
      prepared,
      authorization.proof,
    );
    let dispatchedBranches = 0;
    if (
      existing.length === 0
      && this.#options.enableDarkDispatch === true
      && this.#options.branchDispatcher !== undefined
      && decision.disposition !== 'blocked'
    ) {
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

  #assertRunAndLease(
    request: DeepAiCouncilResumeRequest,
    projection: DeepAiCouncilProjectionState,
    certificateReplayFingerprint: string,
  ): void {
    if (
      projection.run.runId !== request.runId
      || projection.run.roundId !== request.roundId
      || request.lease.runId !== request.runId
      || request.lease.roundId !== request.roundId
      || projection.run.generation !== request.lease.generation
      || request.lease.replayFingerprint !== certificateReplayFingerprint
      || request.certificateBundle.certificate.body.lifecycleResult
        !== 'trusted-completion'
    ) {
      throw new TypeError(
        'Persisted lease does not match offline-verified council continuity',
      );
    }
  }
}
