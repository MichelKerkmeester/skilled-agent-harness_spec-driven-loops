// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Resume Adapter
// ───────────────────────────────────────────────────────────────────

import {
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  DeepResearchWireEventTypes,
  isDeepResearchEventStem,
  prepareDeepResearchEvent,
} from '../deep-research-ledger-schema/index.js';
import {
  DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_VERSION,
  assertDeepResearchProjectionState,
  deepResearchProjectionIntegrityDigest,
  foldDeepResearchEvents,
} from '../deep-research-reducers/index.js';
import {
  parseDeepResearchSealedArtifactBinding,
  readDeepResearchArtifact,
} from '../deep-research-sealed-artifacts/index.js';
import {
  parseDeepResearchTransitionReceipt,
} from '../deep-research-certificates/index.js';
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
  DeepResearchCompatibilityStatus,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
} from '../deep-research-ledger-schema/index.js';
import type {
  DeepResearchProjectionCheckpoint,
  DeepResearchProjectionState,
  DeepResearchRebuildReasonCode,
} from '../deep-research-reducers/index.js';
import type {
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  OperatorResolutionPayload,
} from '../receipts-and-effect-recovery/index.js';
import type {
  DeepResearchAuthenticatedTail,
  DeepResearchBranchResumeDecision,
  DeepResearchCompatibilityComponentDecision,
  DeepResearchContinuityLadderRow,
  DeepResearchContinuityProjection,
  DeepResearchEffectResumeDecision,
  DeepResearchInvalidationDecision,
  DeepResearchManifestDisposition,
  DeepResearchPersistedRunLease,
  DeepResearchResumeAdapterOptions,
  DeepResearchResumeAdapterResult,
  DeepResearchResumeCompatibilityComponent,
  DeepResearchResumeCompatibilityRule,
  DeepResearchResumeDecision,
  DeepResearchResumeExecutionPoolEntry,
  DeepResearchResumeFingerprint,
  DeepResearchResumeRequest,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_RESUME_ADAPTER_VERSION = 'deep-research-resume-adapter@1';

const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/+\-]{0,255}$/;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const COMPONENTS: readonly DeepResearchResumeCompatibilityComponent[] = Object.freeze([
  'manifest', 'reducer', 'adapter', 'schema', 'codec', 'policy',
]);
const COMPATIBILITY_OUTCOMES: readonly DeepResearchCompatibilityStatus[] = Object.freeze([
  'exact', 'compatible', 'migrate', 'pin-old-runtime', 'blocked',
]);

export const DEEP_RESEARCH_CONTINUITY_LADDER: readonly DeepResearchContinuityLadderRow[] =
  Object.freeze([
    Object.freeze({
      step: 'init',
      eventFamilies: Object.freeze(['deep_research.run_initialized', 'deep_research.run_resumed']),
      reducerFields: Object.freeze(['run', 'status', 'seenEvents']),
      reentryActions: Object.freeze(['reuse', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'plan/frontier',
      eventFamilies: Object.freeze([
        'deep_research.question_registered',
        'deep_research.branch_planned',
        'deep_research.branch_selected',
        'deep_research.next_focus_selected',
      ]),
      reducerFields: Object.freeze(['researchPlan.questions', 'researchPlan.branches', 'researchPlan.focusObligations']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'reject'] as const),
    }),
    Object.freeze({
      step: 'gather/analyze',
      eventFamilies: Object.freeze([
        'deep_research.iteration_started',
        'deep_research.iteration_completed',
        'deep_research.source_captured',
        'deep_research.evidence_admission_decided',
        'deep_research.claim_asserted',
        'deep_research.claim_relation_recorded',
        'deep_research.claim_superseded',
        'deep_research.gap_detected',
      ]),
      reducerFields: Object.freeze(['iterations', 'claimLedger', 'artifactIndex']),
      reentryActions: Object.freeze([
        'reuse', 'reexecute', 'reconcile', 'compensate', 'blocked',
      ] as const),
    }),
    Object.freeze({
      step: 'convergence',
      eventFamilies: Object.freeze([
        'deep_research.convergence_evaluated',
        'deep_research.convergence_blocked',
      ]),
      reducerFields: Object.freeze(['convergence', 'status']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'synthesis',
      eventFamilies: Object.freeze([
        'deep_research.synthesis_started',
        'deep_research.synthesis_committed',
      ]),
      reducerFields: Object.freeze(['artifactIndex.artifacts', 'status.provenance']),
      reentryActions: Object.freeze(['reuse', 'reexecute', 'blocked'] as const),
    }),
    Object.freeze({
      step: 'memory-save',
      eventFamilies: Object.freeze([
        'deep_research.memory_save_requested',
        'deep_research.memory_save_completed',
        'deep_research.memory_save_failed',
        'deep_research.run_completed',
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
  if (typeof value !== 'string' || value.length === 0 || value.length > 1_024 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
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

function parseFingerprint(value: unknown, field: string): DeepResearchResumeFingerprint {
  if (!isRecord(value) || !hasExactKeys(value, [
    'fingerprintVersion', 'manifestRevision', 'reducerVersion', 'adapterVersion',
    'schemaVersion', 'codecVersion', 'policyVersion', 'finalDigest',
  ])) throw new TypeError(`${field} must use the closed resume-fingerprint shape`);
  const parsed: DeepResearchResumeFingerprint = Object.freeze({
    fingerprintVersion: uint(value.fingerprintVersion, `${field}.fingerprintVersion`, 65_535),
    manifestRevision: token(value.manifestRevision, `${field}.manifestRevision`),
    reducerVersion: token(value.reducerVersion, `${field}.reducerVersion`),
    adapterVersion: token(value.adapterVersion, `${field}.adapterVersion`),
    schemaVersion: token(value.schemaVersion, `${field}.schemaVersion`),
    codecVersion: token(value.codecVersion, `${field}.codecVersion`),
    policyVersion: token(value.policyVersion, `${field}.policyVersion`),
    finalDigest: digest(value.finalDigest, `${field}.finalDigest`),
  });
  if (deepResearchResumeFingerprintDigest(parsed) !== parsed.finalDigest) {
    throw new TypeError(`${field}.finalDigest does not commit the closed fingerprint fields`);
  }
  return parsed;
}

function parseCompatibilityRule(value: unknown, index: number): DeepResearchResumeCompatibilityRule {
  if (!isRecord(value) || !hasExactKeys(value, [
    'component', 'fromVersion', 'toVersion', 'outcome', 'revision',
  ])) throw new TypeError(`compatibilityRules[${index}] must use the closed rule shape`);
  if (!COMPONENTS.includes(value.component as DeepResearchResumeCompatibilityComponent)) {
    throw new TypeError(`compatibilityRules[${index}].component is unknown`);
  }
  if (value.outcome !== 'compatible' && value.outcome !== 'migrate' && value.outcome !== 'pin-old-runtime') {
    throw new TypeError(`compatibilityRules[${index}].outcome is unknown`);
  }
  return Object.freeze({
    component: value.component as DeepResearchResumeCompatibilityComponent,
    fromVersion: token(value.fromVersion, `compatibilityRules[${index}].fromVersion`),
    toVersion: token(value.toVersion, `compatibilityRules[${index}].toVersion`),
    outcome: value.outcome,
    revision: token(value.revision, `compatibilityRules[${index}].revision`),
  });
}

function parseLease(value: unknown): DeepResearchPersistedRunLease {
  if (!isRecord(value) || !hasExactKeys(value, [
    'runId', 'leaseId', 'lineageId', 'generation', 'deadlineAt', 'remainingMs',
    'replayFingerprint',
  ])) throw new TypeError('lease must use the closed persisted lease shape');
  return Object.freeze({
    runId: token(value.runId, 'lease.runId'),
    leaseId: token(value.leaseId, 'lease.leaseId'),
    lineageId: token(value.lineageId, 'lease.lineageId'),
    generation: uint(value.generation, 'lease.generation', 0xffff_ffff),
    deadlineAt: timestamp(value.deadlineAt, 'lease.deadlineAt'),
    remainingMs: uint(value.remainingMs, 'lease.remainingMs'),
    replayFingerprint: digest(value.replayFingerprint, 'lease.replayFingerprint'),
  });
}

function parseCheckpoint(value: unknown): DeepResearchProjectionCheckpoint | null {
  if (value === null) return null;
  if (!isRecord(value) || !hasExactKeys(value, ['projection', 'integrityDigest', 'sourceTailSequence'])) {
    throw new TypeError('checkpoint must use the closed reducer checkpoint shape');
  }
  assertDeepResearchProjectionState(value.projection);
  return Object.freeze({
    projection: value.projection as DeepResearchProjectionState,
    integrityDigest: digest(value.integrityDigest, 'checkpoint.integrityDigest'),
    sourceTailSequence: uint(value.sourceTailSequence, 'checkpoint.sourceTailSequence'),
  });
}

/** Parse one resume request with closed keys and kind-specific field rules. */
export function parseDeepResearchResumeRequest(input: unknown): DeepResearchResumeRequest {
  scanForbiddenKeys(input);
  if (!isRecord(input) || !hasExactKeys(input, [
    'runId', 'manifestRevision', 'idempotencyKey', 'requestedAt', 'resumeReason',
    'persistedFingerprint', 'installedFingerprint', 'compatibilityRules', 'lease',
    'checkpoint', 'artifactBindings', 'transitionReceipts',
  ])) throw new TypeError('Resume request must use the closed request shape');
  if (!Array.isArray(input.compatibilityRules)
    || !Array.isArray(input.artifactBindings)
    || !Array.isArray(input.transitionReceipts)) {
    throw new TypeError('Resume request collections must be arrays');
  }
  const compatibilityRules = input.compatibilityRules.map(parseCompatibilityRule);
  const ruleKeys = compatibilityRules.map((rule) => [
    rule.component, rule.fromVersion, rule.toVersion,
  ].join('\u0000'));
  if (new Set(ruleKeys).size !== ruleKeys.length) {
    throw new TypeError('Compatibility rules contain an ambiguous duplicate identity');
  }
  return Object.freeze({
    runId: token(input.runId, 'runId'),
    manifestRevision: token(input.manifestRevision, 'manifestRevision'),
    idempotencyKey: token(input.idempotencyKey, 'idempotencyKey'),
    requestedAt: timestamp(input.requestedAt, 'requestedAt'),
    resumeReason: prose(input.resumeReason, 'resumeReason'),
    persistedFingerprint: parseFingerprint(input.persistedFingerprint, 'persistedFingerprint'),
    installedFingerprint: parseFingerprint(input.installedFingerprint, 'installedFingerprint'),
    compatibilityRules: Object.freeze(compatibilityRules),
    lease: parseLease(input.lease),
    checkpoint: parseCheckpoint(input.checkpoint),
    artifactBindings: Object.freeze(input.artifactBindings.map(
      (binding) => parseDeepResearchSealedArtifactBinding(binding),
    )),
    transitionReceipts: Object.freeze(input.transitionReceipts.map(
      (receipt) => parseDeepResearchTransitionReceipt(receipt),
    )),
  });
}

/** Commit every compatibility field except the commitment itself. */
export function deepResearchResumeFingerprintDigest(
  fingerprint: Omit<DeepResearchResumeFingerprint, 'finalDigest'> | DeepResearchResumeFingerprint,
): string {
  return sha256Bytes(canonicalBytes({
    fingerprintVersion: fingerprint.fingerprintVersion,
    manifestRevision: fingerprint.manifestRevision,
    reducerVersion: fingerprint.reducerVersion,
    adapterVersion: fingerprint.adapterVersion,
    schemaVersion: fingerprint.schemaVersion,
    codecVersion: fingerprint.codecVersion,
    policyVersion: fingerprint.policyVersion,
  }));
}

// ───────────────────────────────────────────────────────────────────
// 3. VERIFIED LEDGER RECONSTRUCTION
// ───────────────────────────────────────────────────────────────────

interface DeepResearchHistoryEntry {
  readonly verified: VerifiedLedgerEvent;
  readonly event: DeepResearchLedgerEvent;
}

interface AuthenticatedHistory {
  readonly entries: readonly DeepResearchHistoryEntry[];
  readonly head: LedgerHead;
  readonly tail: DeepResearchAuthenticatedTail;
}

function deepResearchEventForRun(
  verified: VerifiedLedgerEvent,
  runId: string,
): DeepResearchLedgerEvent | null {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isRecord(payload) || !isDeepResearchEventStem(payload.stem)) return null;
  const stem = payload.stem as DeepResearchEventStem;
  if (envelope.event_type !== DeepResearchWireEventTypes[stem]) {
    throw new TypeError('Verified Deep Research event type does not match its typed stem');
  }
  if (!isRecord(payload.scope) || payload.scope.runId !== runId) return null;
  return envelope as unknown as DeepResearchLedgerEvent;
}

function authenticatedHistory(
  verifiedEvents: readonly VerifiedLedgerEvent[],
  head: LedgerHead,
  runId: string,
): AuthenticatedHistory {
  const entries = verifiedEvents
    .map((verified) => {
      const event = deepResearchEventForRun(verified, runId);
      return event === null ? null : { verified, event };
    })
    .filter((entry): entry is DeepResearchHistoryEntry => entry !== null)
    .sort((left, right) => left.event.stream_sequence - right.event.stream_sequence);
  if (entries.length === 0 || entries[0].event.payload.stem !== 'deep_research.run_initialized') {
    throw new TypeError('Resume requires one authenticated run initialization event');
  }
  const streamId = entries[0].event.stream_id;
  for (const [index, entry] of entries.entries()) {
    if (entry.event.stream_id !== streamId || entry.event.stream_sequence !== index + 1) {
      throw new TypeError('Authenticated Deep Research stream contains a cursor gap or stream split');
    }
  }
  return Object.freeze({
    entries: Object.freeze(entries),
    head,
    tail: Object.freeze({
      ledgerId: head.ledgerId,
      ledgerSequence: head.sequence,
      recordHash: head.recordHash,
      streamId,
      streamSequence: entries.at(-1)?.event.stream_sequence ?? 0,
      eventCount: entries.length,
    }),
  });
}

function validateCheckpoint(
  checkpoint: DeepResearchProjectionCheckpoint | null,
  history: AuthenticatedHistory,
): readonly DeepResearchRebuildReasonCode[] {
  if (checkpoint === null) return [];
  if (checkpoint.sourceTailSequence > history.tail.streamSequence) return ['cursor-gap'];
  const prefix = history.entries
    .filter((entry) => entry.event.stream_sequence <= checkpoint.sourceTailSequence)
    .map((entry) => entry.event);
  if (checkpoint.sourceTailSequence > 0
    && prefix.at(-1)?.stream_sequence !== checkpoint.sourceTailSequence) return ['cursor-gap'];
  const expected = foldDeepResearchEvents(prefix, {
    sourceTailSequence: checkpoint.sourceTailSequence,
  });
  if (expected.outcome === 'rebuild_required') return expected.reasonCodes;
  const sameProjection = deepResearchProjectionIntegrityDigest(expected.projection)
    === deepResearchProjectionIntegrityDigest(checkpoint.projection);
  if (!sameProjection || expected.checkpoint.integrityDigest !== checkpoint.integrityDigest) {
    return ['checkpoint-digest-mismatch'];
  }
  return [];
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPATIBILITY AND INVALIDATION
// ───────────────────────────────────────────────────────────────────

function componentVersion(
  fingerprint: DeepResearchResumeFingerprint,
  component: DeepResearchResumeCompatibilityComponent,
): string {
  switch (component) {
    case 'manifest': return fingerprint.manifestRevision;
    case 'reducer': return fingerprint.reducerVersion;
    case 'adapter': return fingerprint.adapterVersion;
    case 'schema': return fingerprint.schemaVersion;
    case 'codec': return fingerprint.codecVersion;
    case 'policy': return fingerprint.policyVersion;
  }
}

function classifyCompatibility(
  request: DeepResearchResumeRequest,
  fingerprintVersionKnown: boolean,
): {
  readonly outcome: DeepResearchCompatibilityStatus;
  readonly manifestDisposition: DeepResearchManifestDisposition;
  readonly decisions: readonly DeepResearchCompatibilityComponentDecision[];
} {
  const decisions = COMPONENTS.map((component): DeepResearchCompatibilityComponentDecision => {
    const persistedVersion = componentVersion(request.persistedFingerprint, component);
    const installedVersion = componentVersion(request.installedFingerprint, component);
    if (!fingerprintVersionKnown) return Object.freeze({
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
      decisionReason: 'Persisted and installed component versions are identical.',
    });
    const rule = request.compatibilityRules.find((candidate) => (
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
      decisionReason: 'No registered compatibility revision covers this version pair.',
    });
    return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome: rule.outcome,
      revision: rule.revision,
      decisionReason: 'A registered compatibility revision covers this version pair.',
    });
  });
  const outcomes = new Set(decisions.map((decision) => decision.outcome));
  const outcome: DeepResearchCompatibilityStatus = outcomes.has('blocked')
    ? 'blocked'
    : outcomes.has('pin-old-runtime')
      ? 'pin-old-runtime'
      : outcomes.has('migrate')
        ? 'migrate'
        : outcomes.has('compatible')
          ? 'compatible'
          : 'exact';
  const manifestChanged = request.persistedFingerprint.manifestRevision
    !== request.installedFingerprint.manifestRevision;
  const manifestDecision = decisions.find((decision) => decision.component === 'manifest');
  const manifestDisposition: DeepResearchManifestDisposition = !manifestChanged
    ? 'original'
    : manifestDecision?.outcome === 'migrate' || manifestDecision?.outcome === 'compatible'
      ? 'restart'
      : 'reject';
  return Object.freeze({ outcome, manifestDisposition, decisions: Object.freeze(decisions) });
}

function deriveInvalidation(projection: DeepResearchProjectionState): DeepResearchInvalidationDecision {
  const sourceGroups = new Map<string, typeof projection.claimLedger.sources>();
  for (const source of projection.claimLedger.sources) {
    const group = sourceGroups.get(source.sourceIdentityDigest) ?? [];
    group.push(source);
    sourceGroups.set(source.sourceIdentityDigest, group);
  }
  const changedSourceVersionIds = new Set<string>();
  const sourceSequence = (sourceVersionId: string): number => projection.artifactIndex.artifacts
    .find((artifact) => artifact.logicalArtifactId === `source:${sourceVersionId}`)?.logicalSequence ?? 0;
  for (const sources of sourceGroups.values()) {
    const ordered = [...sources].sort((left, right) => (
      left.iteration - right.iteration
      || sourceSequence(left.sourceVersionId) - sourceSequence(right.sourceVersionId)
      || left.producerEventId.localeCompare(right.producerEventId)
    ));
    const latest = ordered.at(-1);
    if (latest === undefined || new Set(ordered.map((source) => source.contentDigest)).size < 2) continue;
    ordered.filter((source) => source.sourceVersionId !== latest.sourceVersionId)
      .forEach((source) => changedSourceVersionIds.add(source.sourceVersionId));
  }
  projection.claimLedger.sources.forEach((source) => {
    if (source.parentSourceVersionId !== null) changedSourceVersionIds.add(source.parentSourceVersionId);
  });
  const invalidatedEvidenceIds = new Set(projection.claimLedger.evidence
    .filter((evidence) => changedSourceVersionIds.has(evidence.sourceVersionId))
    .map((evidence) => evidence.evidenceId));
  const invalidatedClaimVersionIds = new Set<string>(
    projection.claimLedger.supersessions.map((entry) => entry.priorClaimVersionId),
  );
  projection.claimLedger.claims.forEach((claim) => {
    if (claim.evidenceIds.some((evidenceId) => invalidatedEvidenceIds.has(evidenceId))) {
      invalidatedClaimVersionIds.add(claim.claimVersionId);
    }
  });
  let changed = true;
  while (changed) {
    changed = false;
    for (const claim of projection.claimLedger.claims) {
      if (claim.relatedClaimVersionId !== null
        && invalidatedClaimVersionIds.has(claim.relatedClaimVersionId)
        && !invalidatedClaimVersionIds.has(claim.claimVersionId)) {
        invalidatedClaimVersionIds.add(claim.claimVersionId);
        changed = true;
      }
    }
  }
  const invalidatedClaimIds = new Set(projection.claimLedger.claims
    .filter((claim) => invalidatedClaimVersionIds.has(claim.claimVersionId))
    .map((claim) => claim.claimId));
  const reopenedQuestionIds = new Set<string>();
  projection.claimLedger.gapObligations.forEach((gap) => {
    if (gap.affectedClaimIds.some((claimId) => invalidatedClaimIds.has(claimId))) {
      gap.affectedQuestionIds.forEach((questionId) => reopenedQuestionIds.add(questionId));
    }
  });
  const reopenedLogicalLeafIds = projection.researchPlan.branches
    .filter((branch) => reopenedQuestionIds.has(branch.questionId))
    .map((branch) => branch.branchId)
    .sort();
  return Object.freeze({
    changedSourceVersionIds: Object.freeze([...changedSourceVersionIds].sort()),
    invalidatedEvidenceIds: Object.freeze([...invalidatedEvidenceIds].sort()),
    invalidatedClaimVersionIds: Object.freeze([...invalidatedClaimVersionIds].sort()),
    reopenedQuestionIds: Object.freeze([...reopenedQuestionIds].sort()),
    reopenedLogicalLeafIds: Object.freeze(reopenedLogicalLeafIds),
    synthesisReopened: invalidatedClaimVersionIds.size > 0,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. BRANCH, EFFECT, AND CONTINUITY PLANNING
// ───────────────────────────────────────────────────────────────────

function retryKey(manifestRevision: string, logicalLeafId: string): string {
  return `retry:${sha256Bytes(canonicalBytes({ manifestRevision, logicalLeafId }))}`;
}

function attemptId(kind: 'branch' | 'effect', identity: string, idempotencyKey: string): string {
  return `${kind}-attempt-${sha256Bytes(canonicalBytes({ identity, idempotencyKey })).slice(0, 40)}`;
}

function branchDecisions(
  projection: DeepResearchProjectionState,
  request: DeepResearchResumeRequest,
  compatibility: DeepResearchCompatibilityStatus,
  manifestDisposition: DeepResearchManifestDisposition,
  invalidation: DeepResearchInvalidationDecision,
): readonly DeepResearchBranchResumeDecision[] {
  const reopened = new Set(invalidation.reopenedLogicalLeafIds);
  return Object.freeze(projection.researchPlan.branches.map((branch) => {
    const key = retryKey(request.manifestRevision, branch.branchId);
    const blocked = compatibility === 'blocked'
      || compatibility === 'pin-old-runtime'
      || manifestDisposition === 'reject';
    const requiresReservationCompensation = !blocked
      && (manifestDisposition === 'restart' || reopened.has(branch.branchId))
      && branch.reservationRef.length > 0;
    const disposition = blocked
      ? 'reject' as const
      : requiresReservationCompensation
        ? 'compensate' as const
        : manifestDisposition === 'restart' || reopened.has(branch.branchId)
        ? 'reexecute' as const
        : branch.lifecycle === 'selected'
          ? 'reuse' as const
          : 'reexecute' as const;
    return Object.freeze({
      logicalLeafId: branch.branchId,
      manifestRevision: request.manifestRevision,
      retryKey: key,
      disposition,
      attemptId: disposition === 'reexecute'
        ? attemptId('branch', `${request.manifestRevision}:${branch.branchId}`, request.idempotencyKey)
        : null,
      evidenceEventIds: Object.freeze([
        ...(branch.plannedEventId === null ? [] : [branch.plannedEventId]),
        ...(branch.selectedEventId === null ? [] : [branch.selectedEventId]),
      ]),
      decisionReason: blocked
        ? 'Compatibility or manifest policy blocks branch execution.'
        : requiresReservationCompensation
          ? 'The live external reservation must be compensated before a fresh attempt.'
          : manifestDisposition === 'restart'
          ? 'A registered changed-manifest revision requires a fresh attempt.'
          : reopened.has(branch.branchId)
            ? 'Ledger-grounded dependency drift reopens this branch.'
            : branch.lifecycle === 'selected'
              ? 'The committed selected branch remains reusable.'
              : 'The committed branch has not reached a reusable selected state.',
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
  request: DeepResearchResumeRequest,
  globallyBlocked: boolean,
): readonly DeepResearchEffectResumeDecision[] {
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
    let disposition: DeepResearchEffectResumeDecision['disposition'];
    let decisionReason: string;
    if (globallyBlocked || hasConflict) {
      disposition = 'blocked';
      decisionReason = 'Compatibility or an immutable effect conflict blocks recovery.';
    } else if (confirmation !== undefined || latest?.verdict === 'applied') {
      disposition = 'reconcile';
      decisionReason = 'Verified effect evidence records an applied external outcome.';
    } else if (latest?.verdict === 'in_doubt' || latest?.verdict === 'conflict') {
      disposition = 'blocked';
      decisionReason = 'Reconciliation left the external outcome uncertain or conflicting.';
    } else if (latest?.verdict === 'not_applied' && intent.adapter.replay_safe) {
      disposition = 'reexecute';
      decisionReason = 'Verified reconciliation proves no application and the adapter is replay-safe.';
    } else if (intent.adapter.reconciliation === 'conclusive') {
      disposition = 'reconcile';
      decisionReason = 'The adapter can conclusively reconcile the unresolved durable intent.';
    } else if (intent.adapter.replay_safe) {
      disposition = 'reexecute';
      decisionReason = 'The unresolved intent is replay-safe under its stable target key.';
    } else {
      disposition = 'blocked';
      decisionReason = 'An irreversible unresolved effect has no conclusive reconciliation capability.';
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
  projection: DeepResearchProjectionState,
  sourceTailSequence: number,
  invalidation: DeepResearchInvalidationDecision,
): DeepResearchContinuityProjection {
  const reports = projection.artifactIndex.artifacts.filter(
    (entry) => entry.artifactKind === 'research-report',
  );
  const saves = projection.artifactIndex.artifacts.filter(
    (entry) => entry.artifactKind === 'continuity-save',
  );
  const latestReport = reports.at(-1);
  const latestSave = saves.at(-1);
  const synthesisStarted = projection.status.provenance.some(
    (entry) => entry.producerStem === 'deep_research.synthesis_started',
  );
  const currentStep = latestSave !== undefined
    ? 'memory-save' as const
    : latestReport !== undefined || synthesisStarted
      ? 'synthesis' as const
      : projection.convergence.evaluations.length > 0
        ? 'convergence' as const
        : projection.claimLedger.sources.length > 0 || projection.iterations.records.length > 0
          ? 'gather/analyze' as const
          : projection.researchPlan.questions.length > 0
            ? 'plan/frontier' as const
            : 'init' as const;
  const synthesisState = invalidation.synthesisReopened
    ? 'rebuild-required' as const
    : latestReport?.validityState === 'valid'
      ? 'committed' as const
      : synthesisStarted
        ? 'started' as const
        : 'none' as const;
  const memorySaveState = latestSave === undefined
    ? 'none' as const
    : latestSave.validityState === 'valid'
      ? 'completed' as const
      : latestSave.validityState === 'invalid'
        ? 'failed' as const
        : latestSave.validityState === 'unknown' || latestSave.validityState === 'unavailable'
          ? 'reconcile' as const
          : 'requested' as const;
  const terminalState = projection.status.terminal
    ? projection.status.state === 'converged'
      ? 'completed' as const
      : projection.status.state === 'incomplete'
        ? 'incomplete' as const
        : projection.status.state === 'quarantined'
          ? 'quarantined' as const
          : projection.status.state === 'failed'
            ? 'failed' as const
            : 'blocked' as const
    : 'active' as const;
  return Object.freeze({
    authority: 'shadow-only',
    productionCompletion: false,
    runId: projection.run.runId ?? '',
    lineageId: projection.run.lineageId ?? '',
    generation: projection.run.generation,
    lastAppliedSeq: sourceTailSequence,
    seenEventIds: Object.freeze(projection.seenEvents.map((entry) => entry.eventId)),
    currentStep,
    initialized: projection.run.initializationEventId !== null,
    plannedLogicalLeafIds: Object.freeze(projection.researchPlan.branches.map((entry) => entry.branchId)),
    selectedLogicalLeafIds: Object.freeze(projection.researchPlan.branches
      .filter((entry) => entry.lifecycle === 'selected').map((entry) => entry.branchId)),
    sourceVersionIds: Object.freeze(projection.claimLedger.sources.map((entry) => entry.sourceVersionId)),
    admittedEvidenceIds: Object.freeze(projection.claimLedger.evidence
      .filter((entry) => entry.disposition === 'admit').map((entry) => entry.evidenceId)),
    activeClaimVersionIds: Object.freeze([...projection.claimLedger.activeClaimVersionIds]),
    contradictionClaimVersionIds: Object.freeze([...projection.claimLedger.contradictionClaimVersionIds]),
    convergenceOutcome: projection.convergence.outcome,
    convergenceFinalizedRevision: projection.convergence.finalizedRevision,
    synthesisState,
    synthesisRevision: latestReport?.logicalArtifactId ?? null,
    memorySaveState,
    memorySaveRevision: latestSave?.logicalArtifactId ?? null,
    terminalState,
    incomplete: projection.status.state === 'incomplete'
      || projection.convergence.outcome === 'incomplete'
      || synthesisState === 'rebuild-required'
      || memorySaveState === 'failed',
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. DECISION VALIDATION
// ───────────────────────────────────────────────────────────────────

function assertClosedDecisionRecord(value: unknown): asserts value is DeepResearchResumeDecision {
  if (!isRecord(value) || !hasExactKeys(value, [
    'decisionVersion', 'decisionId', 'decisionDigest', 'authority', 'legacyAuthority',
    'productionCompletion', 'compatibilityOutcome', 'manifestDisposition', 'compatibility',
    'branches', 'effects', 'invalidation', 'lease', 'forensicReceiptDigests',
    'verifiedArtifactDigests', 'decisionReason',
  ])) throw new TypeError('Resume decision must use the closed decision shape');
  if (value.decisionVersion !== 1
    || value.authority !== 'dark-evidence-only'
    || value.legacyAuthority !== 'unchanged'
    || value.productionCompletion !== false
    || !COMPATIBILITY_OUTCOMES.includes(value.compatibilityOutcome as DeepResearchCompatibilityStatus)
    || !['original', 'restart', 'reject'].includes(String(value.manifestDisposition))
    || !Array.isArray(value.compatibility)
    || !Array.isArray(value.branches)
    || !Array.isArray(value.effects)
    || !Array.isArray(value.forensicReceiptDigests)
    || !Array.isArray(value.verifiedArtifactDigests)) {
    throw new TypeError('Resume decision contains an invalid closed discriminator');
  }
  token(value.decisionId, 'decision.decisionId');
  digest(value.decisionDigest, 'decision.decisionDigest');
  prose(value.decisionReason, 'decision.decisionReason');
  parseLease(value.lease);
  value.forensicReceiptDigests.forEach((entry, index) => digest(entry, `forensicReceiptDigests[${index}]`));
  value.verifiedArtifactDigests.forEach((entry, index) => digest(entry, `verifiedArtifactDigests[${index}]`));
  for (const [index, entry] of value.compatibility.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'component', 'persistedVersion', 'installedVersion', 'outcome', 'revision', 'decisionReason',
    ])) throw new TypeError(`compatibility[${index}] is not closed`);
    if (!COMPONENTS.includes(entry.component as DeepResearchResumeCompatibilityComponent)
      || !COMPATIBILITY_OUTCOMES.includes(entry.outcome as DeepResearchCompatibilityStatus)) {
      throw new TypeError(`compatibility[${index}] has an unknown discriminator`);
    }
    token(entry.persistedVersion, `compatibility[${index}].persistedVersion`);
    token(entry.installedVersion, `compatibility[${index}].installedVersion`);
    if (entry.revision !== null) token(entry.revision, `compatibility[${index}].revision`);
    prose(entry.decisionReason, `compatibility[${index}].decisionReason`);
  }
  for (const [index, entry] of value.branches.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'logicalLeafId', 'manifestRevision', 'retryKey', 'disposition', 'attemptId',
      'evidenceEventIds', 'decisionReason',
    ]) || !['reuse', 'reexecute', 'compensate', 'reject'].includes(String(entry.disposition))
      || !Array.isArray(entry.evidenceEventIds)) throw new TypeError(`branches[${index}] is not closed`);
    token(entry.logicalLeafId, `branches[${index}].logicalLeafId`);
    token(entry.manifestRevision, `branches[${index}].manifestRevision`);
    token(entry.retryKey, `branches[${index}].retryKey`);
    if (entry.attemptId !== null) token(entry.attemptId, `branches[${index}].attemptId`);
    entry.evidenceEventIds.forEach((eventId, eventIndex) => token(eventId, `branches[${index}].evidenceEventIds[${eventIndex}]`));
    prose(entry.decisionReason, `branches[${index}].decisionReason`);
  }
  for (const [index, entry] of value.effects.entries()) {
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'effectId', 'logicalEffectId', 'disposition', 'attemptRefs', 'nextAttemptId', 'decisionReason',
    ]) || !['reexecute', 'compensate', 'reconcile', 'blocked'].includes(String(entry.disposition))
      || !Array.isArray(entry.attemptRefs)) throw new TypeError(`effects[${index}] is not closed`);
    token(entry.effectId, `effects[${index}].effectId`);
    token(entry.logicalEffectId, `effects[${index}].logicalEffectId`);
    if (entry.nextAttemptId !== null) token(entry.nextAttemptId, `effects[${index}].nextAttemptId`);
    entry.attemptRefs.forEach((attempt, attemptIndex) => token(attempt, `effects[${index}].attemptRefs[${attemptIndex}]`));
    prose(entry.decisionReason, `effects[${index}].decisionReason`);
  }
  if (!isRecord(value.invalidation) || !hasExactKeys(value.invalidation, [
    'changedSourceVersionIds', 'invalidatedEvidenceIds', 'invalidatedClaimVersionIds',
    'reopenedQuestionIds', 'reopenedLogicalLeafIds', 'synthesisReopened',
  ])) throw new TypeError('decision.invalidation is not closed');
  for (const field of [
    'changedSourceVersionIds', 'invalidatedEvidenceIds', 'invalidatedClaimVersionIds',
    'reopenedQuestionIds', 'reopenedLogicalLeafIds',
  ] as const) {
    const entries = value.invalidation[field];
    if (!Array.isArray(entries)) throw new TypeError(`decision.invalidation.${field} must be an array`);
    entries.forEach((entry, index) => token(entry, `decision.invalidation.${field}[${index}]`));
  }
  if (typeof value.invalidation.synthesisReopened !== 'boolean') {
    throw new TypeError('decision.invalidation.synthesisReopened must be boolean');
  }
}

/** Validate a decision at module boundaries and reject every unknown key. */
export function parseDeepResearchResumeDecision(input: unknown): DeepResearchResumeDecision {
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
export class DeepResearchResumeAdapter {
  readonly #options: DeepResearchResumeAdapterOptions;

  public constructor(options: DeepResearchResumeAdapterOptions) {
    this.#options = options;
  }

  public async resume(input: unknown): Promise<DeepResearchResumeAdapterResult> {
    const request = parseDeepResearchResumeRequest(input);
    if (request.manifestRevision !== request.installedFingerprint.manifestRevision) {
      throw new TypeError('Requested manifest revision must equal the installed fingerprint revision');
    }
    const allVerified = await this.#options.ledger.readVerifiedEvents();
    const currentHead = await this.#options.ledger.getVerifiedHead();
    const existing = allVerified.filter((verified) => {
      const envelope = verified.event.effective.envelope;
      const payload = envelope.payload;
      return envelope.idempotency_key === request.idempotencyKey
        && isRecord(payload)
        && payload.stem === 'deep_research.run_resumed'
        && isRecord(payload.scope)
        && payload.scope.runId === request.runId;
    });
    if (existing.length > 1) throw new TypeError('Resume idempotency key resolves to multiple events');
    const priorHead: LedgerHead = existing.length === 1
      ? Object.freeze({
        ledgerId: currentHead.ledgerId,
        sequence: existing[0].frame.sequence - 1,
        recordHash: existing[0].frame.prev_record_hash,
      })
      : currentHead;
    const prefix = existing.length === 1
      ? allVerified.filter((verified) => verified.frame.sequence < existing[0].frame.sequence)
      : allVerified;
    const history = authenticatedHistory(prefix, priorHead, request.runId);
    const checkpointReasons = validateCheckpoint(request.checkpoint, history);
    if (checkpointReasons.length > 0) {
      return Object.freeze({
        status: 'rebuild_required',
        reasonCodes: Object.freeze([...checkpointReasons]),
        authenticatedTail: history.tail,
      });
    }
    const folded = foldDeepResearchEvents(
      history.entries.map((entry) => entry.event),
      { sourceTailSequence: history.tail.streamSequence },
    );
    if (folded.outcome === 'rebuild_required') return Object.freeze({
      status: 'rebuild_required',
      reasonCodes: folded.reasonCodes,
      authenticatedTail: history.tail,
    });
    const projection = folded.projection;
    this.#assertRunAndLease(request, projection);
    const policy = this.#options.policies.resolve(
      this.#options.policyId,
      this.#options.policyVersion,
    );

    let fingerprintVersionKnown = true;
    try {
      this.#options.fingerprintVersions.resolve(request.persistedFingerprint.fingerprintVersion);
      this.#options.fingerprintVersions.resolve(request.installedFingerprint.fingerprintVersion);
    } catch (error: unknown) {
      if (!(error instanceof ReplayFingerprintError)) throw error;
      fingerprintVersionKnown = false;
    }
    let compatibility = classifyCompatibility(request, fingerprintVersionKnown);
    const evidenceFailures: string[] = [];
    if (request.installedFingerprint.reducerVersion !== DEEP_RESEARCH_REDUCER_VERSION
      || request.installedFingerprint.adapterVersion !== DEEP_RESEARCH_RESUME_ADAPTER_VERSION
      || request.installedFingerprint.schemaVersion !== DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION
      || request.installedFingerprint.codecVersion !== DEEP_RESEARCH_PROJECTION_CODEC_VERSION
      || request.installedFingerprint.policyVersion
        !== `${policy.policyId}@${policy.policyVersion}`) {
      evidenceFailures.push('Installed fingerprint does not identify the real loaded runtime contracts.');
    }
    if (projection.run.replayFingerprint !== request.persistedFingerprint.finalDigest) {
      evidenceFailures.push('Persisted compatibility fingerprint is not bound by run initialization.');
    }
    const verifiedArtifactDigests: string[] = [];
    for (const binding of request.artifactBindings) {
      try {
        const verified = await readDeepResearchArtifact(this.#options.artifactStore, binding);
        verifiedArtifactDigests.push(verified.descriptor.content_digest);
      } catch {
        evidenceFailures.push('A sealed artifact reference failed exact store verification.');
      }
    }
    const forensicReceiptDigests: string[] = [];
    for (const receipt of request.transitionReceipts) {
      try {
        forensicReceiptDigests.push(parseDeepResearchTransitionReceipt(receipt).receiptDigest);
      } catch {
        evidenceFailures.push('A transition receipt failed closed-shape validation.');
      }
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
      outcome: 'blocked',
      manifestDisposition: compatibility.manifestDisposition === 'original'
        ? 'original' as const
        : 'reject' as const,
    });

    const invalidation = deriveInvalidation(projection);
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
        tail: history.tail.recordHash,
        idempotencyKey: request.idempotencyKey,
      })).slice(0, 40)}`,
      authority: 'dark-evidence-only' as const,
      legacyAuthority: 'unchanged' as const,
      productionCompletion: false as const,
      compatibilityOutcome: compatibility.outcome,
      manifestDisposition: compatibility.manifestDisposition,
      compatibility: compatibility.decisions,
      branches,
      effects,
      invalidation,
      lease: request.lease,
      forensicReceiptDigests: Object.freeze([...new Set(forensicReceiptDigests)].sort()),
      verifiedArtifactDigests: Object.freeze([...new Set(verifiedArtifactDigests)].sort()),
      decisionReason: evidenceFailures.length > 0
        ? evidenceFailures.join(' ')
        : compatibility.outcome === 'blocked'
          ? 'One or more persisted component versions have no registered compatibility path.'
          : 'Verified ledger state has one explicit compatibility and recovery plan.',
    };
    const decision = parseDeepResearchResumeDecision(Object.freeze({
      ...decisionBody,
      decisionDigest: sha256Bytes(canonicalBytes(decisionBody)),
    }));
    const continuity = continuityProjection(projection, history.tail.streamSequence, invalidation);
    const executionPool = Object.freeze(branches
      .filter((branch): branch is DeepResearchBranchResumeDecision & { readonly attemptId: string } => (
        branch.disposition === 'reexecute' && branch.attemptId !== null
      ))
      .map((branch): DeepResearchResumeExecutionPoolEntry => Object.freeze({
        logicalLeafId: branch.logicalLeafId,
        manifestRevision: branch.manifestRevision,
        retryKey: branch.retryKey,
        attemptId: branch.attemptId,
      })));

    const eventId = `resume-${sha256Bytes(canonicalBytes({
      decisionId: decision.decisionId,
      idempotencyKey: request.idempotencyKey,
    })).slice(0, 40)}`;
    const prepared = prepareDeepResearchEvent({
      stem: 'deep_research.run_resumed',
      scope: { runId: request.runId, lineageId: request.lease.lineageId },
      prevEventHash: history.tail.recordHash,
      replay: history.entries[0].event.payload.replay,
      data: {
        priorTailDigest: history.tail.recordHash,
        sourceLineageId: request.lease.lineageId,
        resumeReason: request.resumeReason,
        generation: request.lease.generation,
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
      mode: 'research',
      event: prepared,
      priorHead,
      priorStateVersion: this.#options.priorStateVersion,
      priorStateFingerprint: deepResearchProjectionIntegrityDigest(projection),
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

  #assertRunAndLease(
    request: DeepResearchResumeRequest,
    projection: DeepResearchProjectionState,
  ): void {
    if (projection.run.runId !== request.runId
      || request.lease.runId !== request.runId
      || projection.run.lineageId !== request.lease.lineageId
      || projection.run.generation !== request.lease.generation
      || request.lease.replayFingerprint !== request.persistedFingerprint.finalDigest) {
      throw new TypeError('Persisted lease does not match ledger-reconstructed continuity identity');
    }
  }
}
