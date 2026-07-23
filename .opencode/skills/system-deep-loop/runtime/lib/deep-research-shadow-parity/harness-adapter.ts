// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Shadow Parity Harness Adapter
// ───────────────────────────────────────────────────────────────────

import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  AppendOnlyLedger,
  GENESIS_RECORD_HASH,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  DEEP_RESEARCH_EVENT_VERSION,
  DeepResearchEventStems,
  DeepResearchWireEventTypes,
  createDeepResearchLedgerPayload,
  deepResearchEventDefinitions,
} from '../deep-research-ledger-schema/index.js';
import {
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_VERSION,
  deepResearchProjectionIntegrityDigest,
  foldDeepResearchEvents,
} from '../deep-research-reducers/index.js';
import {
  DeepResearchResumeAdapter,
  parseDeepResearchResumeDecision,
  parseDeepResearchResumeRequest,
} from '../deep-research-resume-adapter/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  LegacyProjectionEngine,
  foldLegacyProjection,
  serializeLegacyJson,
} from '../legacy-projections/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
  prepareReplayFingerprintAttestation,
  recordReplayFingerprintAttestation,
  replayFingerprintAttestationEventDefinition,
} from '../replay-fingerprint/index.js';
import { SEALED_ARTIFACT_REPLAY_INPUT_KEY } from '../sealed-reference-artifacts/index.js';
import {
  compileParityCaseManifest,
  issueParityCertificate,
  runShadowParityCase,
  verifyParityCertificate,
} from '../shadow-parity/index.js';

import type {
  DeepResearchResumeDecision,
  DeepResearchResumeRequest,
} from '../deep-research-resume-adapter/index.js';
import type {
  AuthoritySnapshot,
  GatewayAllowProof,
  LedgerHead,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepResearchEventEnvelope,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
} from '../deep-research-ledger-schema/index.js';
import type {
  DeepResearchProjectionState,
} from '../deep-research-reducers/index.js';
import type {
  EventEnvelope,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
  VerifyReplayFingerprintInput,
} from '../replay-fingerprint/index.js';
import type {
  ParityBaselineRow,
  ParityCaseDefinition,
  ParityCaseManifest,
  ParityCertificateBindings,
  ParityExecutionContext,
  ParityObservationClass,
  ParityPathExecution,
  ShadowParityCaseResult,
} from '../shadow-parity/index.js';
import type {
  DeepResearchFrozenParityInput,
  DeepResearchLifecycleEventMapping,
  DeepResearchLegacyResumeOracle,
  DeepResearchLegacyResumeSnapshot,
  DeepResearchModeGateBlockReasonCode,
  DeepResearchModeGateInput,
  DeepResearchParityCaseOutcome,
  DeepResearchParityCaseRun,
  DeepResearchParityCertificateEvidenceBinding,
  DeepResearchParityDiffClass,
  DeepResearchParityDiffRecord,
  DeepResearchParityEventObservation,
  DeepResearchParityExecutorPair,
  DeepResearchParityFaultInjection,
  DeepResearchParityFixture,
  DeepResearchParityFixtureScenario,
  DeepResearchParityProjection,
  DeepResearchParityReceipt,
  DeepResearchParityReplayState,
  DeepResearchParitySuiteResult,
  DeepResearchPathEvidence,
  DeepResearchProjectionArtifact,
  DeepResearchProjectionBranch,
  DeepResearchProjectionClaim,
  DeepResearchProjectionEvidence,
  DeepResearchProjectionSource,
  DeepResearchProjectionSupersession,
  DeepResearchResumeParityEvidence,
  DeepResearchTerminalDecision,
  DeepResearchVolatilityAllowance,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION =
  'deep-research-shadow-parity@1' as const;
export const DEEP_RESEARCH_COMPARATOR_VERSION =
  'deep-research-event-comparator@1' as const;
export const DEEP_RESEARCH_MODE_GATE_INPUT_VERSION =
  'deep-research-mode-gate-input@1' as const;
export const DEEP_RESEARCH_PARITY_PROJECTION_VERSION =
  'deep-research-parity-projection@1' as const;

const PARITY_REDUCER_ID = 'deep-research:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'deep-research-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'deep-research-parity-projection';
const PARITY_LEDGER_ID = 'deep-research-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'deep-research-shadow-parity-audit';
const PARITY_POLICY_ID = 'deep-research-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'deep-research-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-22T00:00:00.000Z';
const MAX_REASON_LENGTH = 320;
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,127}$/;
const VERSION_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,127}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const RESUME_LEASE_CONTINUITY_ERROR_CODE =
  'DEEP_RESEARCH_RESUME_LEASE_CONTINUITY' as const;
const RESUME_LEASE_CONTINUITY_FIELDS = Object.freeze([
  'leaseId',
  'runId',
  'lineageId',
  'generation',
  'deadlineAt',
] as const);

export const DEEP_RESEARCH_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'fresh-run',
  'multi-branch',
  'quarantined-evidence',
  'contradiction-supersession',
  'max-iteration-incomplete',
  'converged',
  'crash-resume',
  'source-mutation-refresh',
  'synthesis',
  'memory-save-handoff',
] as const satisfies readonly DeepResearchParityFixtureScenario[]);

export const DEEP_RESEARCH_VOLATILITY_ALLOWLIST = Object.freeze([
  Object.freeze({
    field: 'occurred_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-research-shadow-parity',
    volatilityReason: 'Wall-clock emission time cannot alter semantic identity or trusted state.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'recorded_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-research-shadow-parity',
    volatilityReason: 'Transport persistence time is outside the mode transition identity.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'correlation_id',
    valueKind: 'transport-token',
    owner: 'deep-research-shadow-parity',
    volatilityReason: 'Opaque transport correlation cannot carry a mode or projection identity.',
    semanticIdentity: false,
  }),
] as const satisfies readonly DeepResearchVolatilityAllowance[]);

const EventStages: Readonly<Record<DeepResearchEventStem, DeepResearchLifecycleEventMapping>> =
  Object.freeze({
    'deep_research.run_initialized': mapping('deep_research.run_initialized', 'init', 'run-init'),
    'deep_research.run_resumed': mapping('deep_research.run_resumed', 'resume', 'run-resume'),
    'deep_research.run_restarted': mapping('deep_research.run_restarted', 'resume', 'run-restart'),
    'deep_research.question_registered': mapping('deep_research.question_registered', 'plan', 'question-register'),
    'deep_research.branch_planned': mapping('deep_research.branch_planned', 'plan', 'branch-plan'),
    'deep_research.branch_selected': mapping('deep_research.branch_selected', 'plan', 'branch-select'),
    'deep_research.iteration_started': mapping('deep_research.iteration_started', 'gather-analyze', 'iteration-start'),
    'deep_research.iteration_completed': mapping('deep_research.iteration_completed', 'projection', 'iteration-complete'),
    'deep_research.source_captured': mapping('deep_research.source_captured', 'gather-analyze', 'source-capture'),
    'deep_research.evidence_admission_decided': mapping('deep_research.evidence_admission_decided', 'gather-analyze', 'evidence-admit'),
    'deep_research.claim_asserted': mapping('deep_research.claim_asserted', 'projection', 'claim-assert'),
    'deep_research.claim_relation_recorded': mapping('deep_research.claim_relation_recorded', 'projection', 'claim-relate'),
    'deep_research.claim_superseded': mapping('deep_research.claim_superseded', 'projection', 'claim-supersede'),
    'deep_research.gap_detected': mapping('deep_research.gap_detected', 'next-focus', 'gap-detect'),
    'deep_research.next_focus_selected': mapping('deep_research.next_focus_selected', 'next-focus', 'focus-select'),
    'deep_research.convergence_evaluated': mapping('deep_research.convergence_evaluated', 'convergence', 'convergence-evaluate'),
    'deep_research.convergence_blocked': mapping('deep_research.convergence_blocked', 'convergence', 'convergence-block'),
    'deep_research.synthesis_started': mapping('deep_research.synthesis_started', 'synthesis', 'synthesis-start'),
    'deep_research.synthesis_committed': mapping('deep_research.synthesis_committed', 'synthesis', 'synthesis-commit'),
    'deep_research.memory_save_requested': mapping('deep_research.memory_save_requested', 'memory-save', 'memory-request'),
    'deep_research.memory_save_completed': mapping('deep_research.memory_save_completed', 'memory-save', 'memory-complete'),
    'deep_research.memory_save_failed': mapping('deep_research.memory_save_failed', 'memory-save', 'memory-fail'),
    'deep_research.run_completed': mapping('deep_research.run_completed', 'terminal', 'run-complete'),
  });

export const DEEP_RESEARCH_LIFECYCLE_EVENT_MAP = EventStages;

const REQUIRED_OBSERVATIONS = Object.freeze([
  'terminal-status',
  'return-value',
  'error-halt',
  'ordered-transitions',
  'effect-receipts',
  'budgets',
  'emitted-artifacts',
  'reader-results',
] as const satisfies readonly ParityObservationClass[]);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION AND CANONICAL HELPERS
// ───────────────────────────────────────────────────────────────────

function mapping(
  stem: DeepResearchEventStem,
  lifecycleStage: DeepResearchLifecycleEventMapping['lifecycleStage'],
  stepKey: string,
): DeepResearchLifecycleEventMapping {
  return Object.freeze({
    wireEventType: DeepResearchWireEventTypes[stem],
    lifecycleStage,
    stepKey,
  });
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((entry, index) => entry === expected[index]);
}

function validateParityFixtureShape(fixture: DeepResearchParityFixture): void {
  if (!isRecord(fixture) || !hasExactKeys(fixture, [
    'fixtureId', 'scenario', 'frozenInput', 'events',
    'expectedTerminalDecision', 'resumeEvidence',
  ])) {
    throw new TypeError('fixture must use the closed allowed-key set');
  }
  if (
    fixture.resumeEvidence !== null
    && (
      !isRecord(fixture.resumeEvidence)
      || !hasExactKeys(fixture.resumeEvidence, [
        'legacyDecision', 'ledgerDecision', 'legacyEventTailDigest',
        'ledgerEventTailDigest', 'legacyFreshProjectionFingerprint',
        'ledgerFreshProjectionFingerprint',
      ])
    )
  ) {
    throw new TypeError('resumeEvidence must use the closed allowed-key set');
  }
}

function requireToken(value: unknown, field: string, version = false): string {
  const pattern = version ? VERSION_TOKEN_PATTERN : TOKEN_PATTERN;
  if (typeof value !== 'string' || !pattern.test(value)) {
    throw new TypeError(`${field} must be a bounded token`);
  }
  return value;
}

function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !SHA256_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 digest`);
  }
  return value;
}

function requireBaseSha(value: unknown, field: string): string {
  if (typeof value !== 'string' || !BASE_SHA_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a forty-character lowercase BASE SHA`);
  }
  return value;
}

function requireCount(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > MAX_RECORD_COUNT) {
    throw new TypeError(`${field} must be a bounded unsigned integer`);
  }
  return Number(value);
}

function requireReason(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_REASON_LENGTH) {
    throw new TypeError(`${field} must be bounded reason text`);
  }
  return value;
}

function requireTimestamp(value: unknown, field: string): string {
  if (typeof value !== 'string' || !ISO_TIMESTAMP_PATTERN.test(value)) {
    throw new TypeError(`${field} must be an ISO-8601 millisecond timestamp`);
  }
  return value;
}

function validateVolatilityBoundary(event: DeepResearchLedgerEvent): void {
  requireTimestamp(event.occurred_at, 'occurred_at');
  requireTimestamp(event.recorded_at, 'recorded_at');
  if (!TRANSPORT_TOKEN_PATTERN.test(event.correlation_id)) {
    throw new TypeError('correlation_id must use the closed transport-only token grammar');
  }
}

function asMutableArray<T>(values: readonly T[]): T[] {
  return [...values];
}

function emptyProjection(): DeepResearchParityProjection {
  return Object.freeze({
    runId: null,
    lineageId: null,
    generation: 0,
    questionIds: Object.freeze([]),
    branches: Object.freeze([]),
    sources: Object.freeze([]),
    evidence: Object.freeze([]),
    claims: Object.freeze([]),
    supersessions: Object.freeze([]),
    activeClaimVersionIds: Object.freeze([]),
    contradictionClaimVersionIds: Object.freeze([]),
    nextFocusId: null,
    convergenceDecision: null,
    convergenceOutcome: 'active',
    synthesisInputDigest: null,
    reportDigest: null,
    memorySaveState: 'none',
    memorySaveDigest: null,
    artifacts: Object.freeze([]),
    terminalDecision: 'active',
    resumeDecisionDigest: null,
  });
}

function terminalDecisionForEvent(
  event: DeepResearchLedgerEvent,
): DeepResearchTerminalDecision | null {
  if (event.payload.stem === 'deep_research.run_completed') {
    const terminal = event.payload.data.terminalStatus;
    return terminal === 'completed' ? 'completed' : terminal;
  }
  if (
    event.payload.stem === 'deep_research.convergence_evaluated'
    || event.payload.stem === 'deep_research.convergence_blocked'
  ) {
    const decision = event.payload.data.decision;
    return decision === 'continue' || decision === 'recover' ? 'active' : decision;
  }
  if (event.payload.stem === 'deep_research.evidence_admission_decided') {
    return event.payload.data.disposition === 'quarantine' ? 'quarantined' : null;
  }
  if (event.payload.stem === 'deep_research.source_captured') {
    return event.payload.data.instructionScanResult === 'flagged' ? 'quarantined' : null;
  }
  return null;
}

function receiptRefs(event: DeepResearchLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_research.run_resumed':
    case 'deep_research.run_restarted':
      return [event.payload.data.recoveryReceiptRef];
    case 'deep_research.source_captured':
      return [event.payload.data.retrievalReceiptRef];
    case 'deep_research.synthesis_committed':
      return [event.payload.data.synthesisReceiptRef];
    case 'deep_research.memory_save_completed':
      return sortedUnique(event.payload.data.persistenceReceiptRefs);
    default:
      return [];
  }
}

function artifactRefs(event: DeepResearchLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_research.source_captured':
      return [event.payload.data.contentDigest];
    case 'deep_research.iteration_completed':
      return [event.payload.data.outputDigest];
    case 'deep_research.synthesis_committed':
      return [event.payload.data.reportDigest];
    case 'deep_research.memory_save_requested':
    case 'deep_research.memory_save_completed':
    case 'deep_research.memory_save_failed':
      return [event.payload.data.continuityPayloadDigest];
    default:
      return [];
  }
}

function logicalBranchId(event: DeepResearchLedgerEvent): string | null {
  return 'branchId' in event.payload.scope
    ? String(event.payload.scope.branchId)
    : null;
}

function canonicalObservation(
  event: DeepResearchLedgerEvent,
  projectionFingerprint: string,
): DeepResearchParityEventObservation {
  validateVolatilityBoundary(event);
  const mappingEntry = EventStages[event.payload.stem];
  return Object.freeze({
    eventId: event.event_id,
    eventType: event.event_type,
    logicalRunId: event.payload.scope.runId,
    logicalBranchId: logicalBranchId(event),
    stepKey: mappingEntry.stepKey,
    producerSequence: event.stream_sequence,
    causalEventIds: Object.freeze(event.causation_id === null ? [] : [event.causation_id]),
    stablePayloadDigest: event.payload.payloadDigest,
    projectionFingerprint,
    receiptRefs: Object.freeze(receiptRefs(event)),
    artifactRefs: Object.freeze(artifactRefs(event)),
    terminalDecision: terminalDecisionForEvent(event),
  });
}

/** Canonicalize a verified mode stream while rejecting semantic data in volatile slots. */
export function canonicalizeDeepResearchEventStream(
  events: readonly DeepResearchLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly DeepResearchParityEventObservation[] {
  if (events.length !== projectionFingerprints.length) {
    throw new TypeError('Every event requires one resulting projection fingerprint');
  }
  return Object.freeze(events.map((event, index) => canonicalObservation(
    event,
    requireDigest(projectionFingerprints[index], `projectionFingerprints[${index}]`),
  )));
}

/** Prove the lifecycle map is an exact closure over the typed event namespace. */
export function verifyDeepResearchLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...DeepResearchEventStems].sort();
  if (mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Deep Research lifecycle mapping must close every typed event stem');
  }
  for (const stem of DeepResearchEventStems) {
    const entry = EventStages[stem];
    requireToken(entry.stepKey, `${stem}.stepKey`);
    if (entry.wireEventType !== DeepResearchWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. INDEPENDENT LEGACY AND LEDGER PROJECTIONS
// ───────────────────────────────────────────────────────────────────

function projectionArtifactFromEvent(
  event: DeepResearchLedgerEvent,
): DeepResearchProjectionArtifact | null {
  switch (event.payload.stem) {
    case 'deep_research.source_captured':
      return {
        artifactKind: 'source-capture',
        digest: event.payload.data.contentDigest,
        validityState: event.payload.data.instructionScanResult === 'flagged'
          ? 'invalid'
          : 'valid',
        receiptRefs: [event.payload.data.retrievalReceiptRef],
      };
    case 'deep_research.iteration_completed':
      return {
        artifactKind: 'iteration-output',
        digest: event.payload.data.outputDigest,
        validityState: 'pending',
        receiptRefs: [],
      };
    case 'deep_research.synthesis_committed':
      return {
        artifactKind: 'research-report',
        digest: event.payload.data.reportDigest,
        validityState: 'valid',
        receiptRefs: [event.payload.data.synthesisReceiptRef],
      };
    case 'deep_research.memory_save_requested':
      return {
        artifactKind: 'continuity-save',
        digest: event.payload.data.continuityPayloadDigest,
        validityState: 'pending',
        receiptRefs: [],
      };
    case 'deep_research.memory_save_completed':
      return {
        artifactKind: 'continuity-save',
        digest: event.payload.data.continuityFingerprint,
        validityState: event.payload.data.persistenceReceiptRefs.length > 0
          ? 'valid'
          : 'unknown',
        receiptRefs: sortedUnique(event.payload.data.persistenceReceiptRefs),
      };
    case 'deep_research.memory_save_failed':
      return {
        artifactKind: 'continuity-save',
        digest: event.payload.data.continuityPayloadDigest,
        validityState: 'invalid',
        receiptRefs: [],
      };
    default:
      return null;
  }
}

function latestSynthesis(events: readonly DeepResearchLedgerEvent[]): Readonly<{
  inputDigest: string | null;
  reportDigest: string | null;
}> {
  let inputDigest: string | null = null;
  let reportDigest: string | null = null;
  for (const event of events) {
    if (
      event.payload.stem === 'deep_research.synthesis_started'
      || event.payload.stem === 'deep_research.synthesis_committed'
    ) {
      inputDigest = event.payload.data.selectedClaimVersionSetDigest;
      if (event.payload.stem === 'deep_research.synthesis_committed') {
        reportDigest = event.payload.data.reportDigest;
      }
    }
  }
  return Object.freeze({ inputDigest, reportDigest });
}

function latestMemorySave(events: readonly DeepResearchLedgerEvent[]): Readonly<{
  state: DeepResearchParityProjection['memorySaveState'];
  digest: string | null;
}> {
  let state: DeepResearchParityProjection['memorySaveState'] = 'none';
  let memoryDigest: string | null = null;
  for (const event of events) {
    if (event.payload.stem === 'deep_research.memory_save_requested') {
      state = 'requested';
      memoryDigest = event.payload.data.continuityPayloadDigest;
    } else if (event.payload.stem === 'deep_research.memory_save_completed') {
      state = 'completed';
      memoryDigest = event.payload.data.continuityFingerprint;
    } else if (event.payload.stem === 'deep_research.memory_save_failed') {
      state = 'failed';
      memoryDigest = event.payload.data.continuityPayloadDigest;
    }
  }
  return Object.freeze({ state, digest: memoryDigest });
}

function resumeDecisionDigest(
  evidence: DeepResearchResumeParityEvidence | null,
  path: 'ledger' | 'legacy',
): string | null {
  if (evidence === null) return null;
  const decision = parseDeepResearchResumeDecision(
    path === 'legacy' ? evidence.legacyDecision : evidence.ledgerDecision,
  );
  return digest({
    decision: resumeDecisionSemanticView(decision),
    eventTailDigest: path === 'legacy'
      ? evidence.legacyEventTailDigest
      : evidence.ledgerEventTailDigest,
    freshContinuationProjectionFingerprint: path === 'legacy'
      ? evidence.legacyFreshProjectionFingerprint
      : evidence.ledgerFreshProjectionFingerprint,
  });
}

function resumeDecisionSemanticView(decision: DeepResearchResumeDecision): JsonValue {
  return {
    compatibilityOutcome: decision.compatibilityOutcome,
    manifestDisposition: decision.manifestDisposition,
    compatibility: [...decision.compatibility].map((entry) => ({
      component: entry.component,
      persistedVersion: entry.persistedVersion,
      installedVersion: entry.installedVersion,
      outcome: entry.outcome,
      revision: entry.revision,
    })).sort((left, right) => left.component.localeCompare(right.component)),
    branches: [...decision.branches].map((entry) => ({
      logicalLeafId: entry.logicalLeafId,
      manifestRevision: entry.manifestRevision,
      disposition: entry.disposition,
      evidenceEventIds: sortedUnique(entry.evidenceEventIds),
    })).sort((left, right) => left.logicalLeafId.localeCompare(right.logicalLeafId)),
    effects: [...decision.effects].map((entry) => ({
      effectId: entry.effectId,
      logicalEffectId: entry.logicalEffectId,
      disposition: entry.disposition,
      attemptRefs: sortedUnique(entry.attemptRefs),
      nextAttemptId: entry.nextAttemptId,
    })).sort((left, right) => left.effectId.localeCompare(right.effectId)),
    invalidation: decision.invalidation,
    lease: decision.lease,
    forensicReceiptDigests: sortedUnique(decision.forensicReceiptDigests),
    verifiedArtifactDigests: sortedUnique(decision.verifiedArtifactDigests),
  } as unknown as JsonValue;
}

function legacyResumeProjectionSemanticView(
  projection: DeepResearchParityProjection,
): JsonValue {
  return {
    runId: projection.runId,
    lineageId: projection.lineageId,
    generation: projection.generation,
    questionIds: sortedUnique(projection.questionIds),
    branches: [...projection.branches].sort(
      (left, right) => left.branchId.localeCompare(right.branchId),
    ),
    sources: [...projection.sources].sort(
      (left, right) => left.sourceVersionId.localeCompare(right.sourceVersionId),
    ),
    evidence: [...projection.evidence].sort(
      (left, right) => left.evidenceId.localeCompare(right.evidenceId),
    ),
    claims: [...projection.claims].sort(
      (left, right) => left.claimVersionId.localeCompare(right.claimVersionId),
    ),
    activeClaimVersionIds: sortedUnique(projection.activeClaimVersionIds),
    contradictionClaimVersionIds: sortedUnique(projection.contradictionClaimVersionIds),
    convergenceOutcome: projection.convergenceOutcome,
    terminalDecision: projection.terminalDecision,
  } as unknown as JsonValue;
}

function ledgerResumeProjectionSemanticView(
  projection: DeepResearchProjectionState,
): JsonValue {
  const terminalDecision: DeepResearchTerminalDecision = projection.status.state === 'converged'
    ? 'converged'
    : projection.status.state === 'quarantined'
      ? 'quarantined'
      : projection.status.state === 'incomplete'
        ? 'incomplete'
        : projection.status.state === 'blocked' || projection.status.state === 'failed'
          ? 'blocked'
          : 'active';
  return {
    runId: projection.run.runId,
    lineageId: projection.run.lineageId,
    generation: projection.run.generation,
    questionIds: sortedUnique(projection.researchPlan.questions.map(
      (question) => question.questionId,
    )),
    branches: projection.researchPlan.branches.map((branch) => ({
      questionId: branch.questionId,
      branchId: branch.branchId,
      lifecycle: branch.lifecycle,
    })).sort((left, right) => left.branchId.localeCompare(right.branchId)),
    sources: projection.claimLedger.sources.map((source) => ({
      sourceVersionId: source.sourceVersionId,
      contentDigest: source.contentDigest,
      parentSourceVersionId: source.parentSourceVersionId,
      instructionScanResult: source.instructionScanResult,
    })).sort((left, right) => left.sourceVersionId.localeCompare(right.sourceVersionId)),
    evidence: projection.claimLedger.evidence.map((entry) => ({
      evidenceId: entry.evidenceId,
      sourceVersionId: entry.sourceVersionId,
      disposition: entry.disposition,
      contaminationStatus: entry.contaminationStatus,
    })).sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)),
    claims: projection.claimLedger.claims.map((claim) => ({
      claimId: claim.claimId,
      claimVersionId: claim.claimVersionId,
      relation: claim.relation,
      evidenceIds: sortedUnique(claim.evidenceIds),
      claimStatus: claim.claimStatus,
    })).sort((left, right) => left.claimVersionId.localeCompare(right.claimVersionId)),
    activeClaimVersionIds: sortedUnique(projection.claimLedger.activeClaimVersionIds),
    contradictionClaimVersionIds: sortedUnique(
      projection.claimLedger.contradictionClaimVersionIds,
    ),
    convergenceOutcome: projection.convergence.outcome,
    terminalDecision,
  } as unknown as JsonValue;
}

function resumeTailDigest(tail: Readonly<{
  streamId: string;
  streamSequence: number;
  eventCount: number;
}>): string {
  return digest({
    streamId: tail.streamId,
    streamSequence: tail.streamSequence,
    eventCount: tail.eventCount,
  });
}

function assertPersistedLease(
  decision: DeepResearchResumeDecision,
  request: DeepResearchResumeRequest,
): void {
  if (digest(decision.lease) !== digest(request.lease)) {
    throw new TypeError('Resume parity cannot allocate or replace the persisted lease');
  }
}

class DeepResearchResumeLeaseContinuityError extends TypeError {
  public readonly code = RESUME_LEASE_CONTINUITY_ERROR_CODE;
  public readonly decisionPath: 'legacyDecision' | 'ledgerDecision';
  public readonly mismatchedFields:
    readonly (typeof RESUME_LEASE_CONTINUITY_FIELDS)[number][];

  public constructor(
    decisionPath: 'legacyDecision' | 'ledgerDecision',
    mismatchedFields: readonly (typeof RESUME_LEASE_CONTINUITY_FIELDS)[number][],
  ) {
    super(
      `${RESUME_LEASE_CONTINUITY_ERROR_CODE}: resumeEvidence.${decisionPath}.lease `
      + `does not match frozenInput.budgetLease across ${mismatchedFields.join(', ')}`,
    );
    this.name = 'DeepResearchResumeLeaseContinuityError';
    this.decisionPath = decisionPath;
    this.mismatchedFields = Object.freeze([...mismatchedFields]);
  }
}

function assertResumeEvidenceLeaseContinuity(
  frozen: DeepResearchFrozenParityInput,
  resumeEvidence: DeepResearchResumeParityEvidence | null,
): void {
  if (resumeEvidence === null) return;
  const decisions = [
    ['legacyDecision', parseDeepResearchResumeDecision(resumeEvidence.legacyDecision)],
    ['ledgerDecision', parseDeepResearchResumeDecision(resumeEvidence.ledgerDecision)],
  ] as const;
  for (const [decisionPath, decision] of decisions) {
    const mismatchedFields = RESUME_LEASE_CONTINUITY_FIELDS.filter(
      (field) => decision.lease[field] !== frozen.budgetLease[field],
    );
    if (mismatchedFields.length > 0) {
      throw new DeepResearchResumeLeaseContinuityError(
        decisionPath,
        mismatchedFields,
      );
    }
  }
}

/** Typed evidence that independent resume models disagree on continuation semantics. */
export class DeepResearchResumeParityDivergenceError extends Error {
  public readonly code = 'DEEP_RESEARCH_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(
    dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[],
  ) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'DeepResearchResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare a modeled legacy resume oracle with the real ledger resume adapter. */
export async function driveDeepResearchResumeParity(input: Readonly<{
  legacyOracle: DeepResearchLegacyResumeOracle;
  ledgerAdapter: DeepResearchResumeAdapter;
  request: DeepResearchResumeRequest;
}>): Promise<DeepResearchResumeParityEvidence> {
  if (typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof DeepResearchResumeAdapter)) {
    throw new TypeError('Resume parity requires a legacy oracle and a real ledger adapter');
  }
  const request = parseDeepResearchResumeRequest(input.request);
  const [legacyResult, ledgerResult] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  if (ledgerResult.status === 'rebuild_required') {
    throw new TypeError('Resume parity cannot compare a rebuild-required continuation');
  }
  const legacyDecision = parseDeepResearchResumeDecision(legacyResult.decision);
  const ledgerDecision = parseDeepResearchResumeDecision(ledgerResult.decision);
  assertPersistedLease(legacyDecision, request);
  assertPersistedLease(ledgerDecision, request);
  const legacyEventTailDigest = resumeTailDigest(legacyResult.eventTail);
  const ledgerEventTailDigest = resumeTailDigest(ledgerResult.authenticatedTail);
  const legacyFreshProjectionFingerprint = digest(
    legacyResumeProjectionSemanticView(legacyResult.freshProjection),
  );
  const ledgerFreshProjectionFingerprint = digest(
    ledgerResumeProjectionSemanticView(ledgerResult.projection),
  );
  const dimensions: Array<'decision' | 'event-tail' | 'fresh-projection'> = [];
  if (digest(resumeDecisionSemanticView(legacyDecision))
    !== digest(resumeDecisionSemanticView(ledgerDecision))) {
    dimensions.push('decision');
  }
  if (legacyEventTailDigest !== ledgerEventTailDigest) dimensions.push('event-tail');
  if (legacyFreshProjectionFingerprint !== ledgerFreshProjectionFingerprint) {
    dimensions.push('fresh-projection');
  }
  if (dimensions.length > 0) throw new DeepResearchResumeParityDivergenceError(dimensions);
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}

function directConvergence(
  events: readonly DeepResearchLedgerEvent[],
  evidence: readonly DeepResearchProjectionEvidence[],
  claims: readonly DeepResearchProjectionClaim[],
  sources: readonly DeepResearchProjectionSource[],
): Readonly<{
  decision: DeepResearchParityProjection['convergenceDecision'];
  outcome: DeepResearchParityProjection['convergenceOutcome'];
}> {
  const sourceIds = new Set(sources.map((source) => source.sourceVersionId));
  const admitted = new Set(evidence.filter((entry) => (
    entry.disposition === 'admit'
    && entry.contaminationStatus === 'clean'
    && sourceIds.has(entry.sourceVersionId)
  )).map((entry) => entry.evidenceId));
  const hasTrustedClaim = claims.some((claim) => (
    claim.claimStatus === 'supported'
    && claim.evidenceIds.some((evidenceId) => admitted.has(evidenceId))
  ));
  const quarantined = sources.some((source) => source.instructionScanResult === 'flagged')
    || evidence.some((entry) => (
      entry.disposition === 'quarantine'
      || entry.contaminationStatus === 'contaminated'
      || entry.contaminationStatus === 'suspected'
    ));
  const convergenceEvents = events.filter((event) => (
    event.payload.stem === 'deep_research.convergence_evaluated'
    || event.payload.stem === 'deep_research.convergence_blocked'
  ));
  const latest = convergenceEvents.at(-1);
  if (!latest || (
    latest.payload.stem !== 'deep_research.convergence_evaluated'
    && latest.payload.stem !== 'deep_research.convergence_blocked'
  )) {
    return Object.freeze({
      decision: null,
      outcome: quarantined ? 'quarantined' : 'active',
    });
  }
  const gates = latest.payload.data.qualityGateResults;
  const canStop = hasTrustedClaim
    && !quarantined
    && gates.sourceDiversity === 'pass'
    && gates.contradictionResolution === 'pass'
    && gates.citationIntegrity === 'pass';
  const decision = latest.payload.data.decision;
  const outcome = quarantined
    ? 'quarantined'
    : decision === 'converged' && !canStop
      ? 'blocked'
      : decision === 'converged'
        ? 'converged'
        : decision === 'incomplete'
          ? 'incomplete'
          : decision === 'blocked'
            ? 'blocked'
            : 'active';
  return Object.freeze({ decision, outcome });
}

function directTerminalDecision(
  events: readonly DeepResearchLedgerEvent[],
  convergenceOutcome: DeepResearchParityProjection['convergenceOutcome'],
): DeepResearchTerminalDecision {
  const completed = [...events].reverse().find(
    (event) => event.payload.stem === 'deep_research.run_completed',
  );
  if (completed?.payload.stem === 'deep_research.run_completed') {
    if (completed.payload.data.terminalStatus === 'completed') return 'completed';
    return completed.payload.data.terminalStatus;
  }
  if (convergenceOutcome === 'quarantined') return 'quarantined';
  if (convergenceOutcome !== 'active') return convergenceOutcome;
  return 'active';
}

function legacyProjection(
  events: readonly DeepResearchLedgerEvent[],
  resumeEvidence: DeepResearchResumeParityEvidence | null,
): DeepResearchParityProjection {
  let runId: string | null = null;
  let lineageId: string | null = null;
  let generation = 0;
  const questionIds: string[] = [];
  const branches = new Map<string, DeepResearchProjectionBranch>();
  const sources = new Map<string, DeepResearchProjectionSource>();
  const evidence = new Map<string, DeepResearchProjectionEvidence>();
  const claims = new Map<string, DeepResearchProjectionClaim>();
  const supersessions: DeepResearchProjectionSupersession[] = [];
  const activeClaims = new Set<string>();
  const contradictions = new Set<string>();
  let nextFocusId: string | null = null;
  const artifacts: DeepResearchProjectionArtifact[] = [];

  for (const event of events) {
    runId = event.payload.scope.runId;
    lineageId = event.payload.scope.lineageId;
    switch (event.payload.stem) {
      case 'deep_research.run_initialized':
      case 'deep_research.run_resumed':
      case 'deep_research.run_restarted':
        generation = event.payload.data.generation;
        break;
      case 'deep_research.question_registered':
        questionIds.push(event.payload.scope.questionId);
        break;
      case 'deep_research.branch_planned':
      case 'deep_research.branch_selected':
        branches.set(event.payload.scope.branchId, {
          questionId: event.payload.scope.questionId,
          branchId: event.payload.scope.branchId,
          lifecycle: event.payload.stem === 'deep_research.branch_selected'
            ? 'selected'
            : 'planned',
        });
        break;
      case 'deep_research.source_captured':
        sources.set(event.payload.scope.sourceVersionId, {
          sourceVersionId: event.payload.scope.sourceVersionId,
          contentDigest: event.payload.data.contentDigest,
          parentSourceVersionId: event.payload.data.parentSourceVersionId,
          instructionScanResult: event.payload.data.instructionScanResult,
        });
        break;
      case 'deep_research.evidence_admission_decided':
        evidence.set(event.payload.scope.evidenceId, {
          evidenceId: event.payload.scope.evidenceId,
          sourceVersionId: event.payload.scope.sourceVersionId,
          disposition: event.payload.data.disposition,
          contaminationStatus: event.payload.data.contaminationStatus,
        });
        break;
      case 'deep_research.claim_asserted':
        claims.set(event.payload.scope.claimVersionId, {
          claimId: event.payload.data.claimId,
          claimVersionId: event.payload.scope.claimVersionId,
          relation: 'asserts',
          evidenceIds: sortedUnique(event.payload.data.evidenceIds),
          claimStatus: event.payload.data.claimStatus,
        });
        activeClaims.add(event.payload.scope.claimVersionId);
        break;
      case 'deep_research.claim_relation_recorded':
        claims.set(event.payload.scope.claimVersionId, {
          claimId: event.payload.data.claimId,
          claimVersionId: event.payload.scope.claimVersionId,
          relation: event.payload.data.relation,
          evidenceIds: sortedUnique(event.payload.data.evidenceIds),
          claimStatus: event.payload.data.claimStatus,
        });
        activeClaims.add(event.payload.scope.claimVersionId);
        if (event.payload.data.relation === 'contradicts') {
          contradictions.add(event.payload.scope.claimVersionId);
          contradictions.add(event.payload.data.relatedClaimVersionId);
        }
        break;
      case 'deep_research.claim_superseded':
        supersessions.push({
          priorClaimVersionId: event.payload.data.priorClaimVersionId,
          successorClaimVersionId: event.payload.data.successorClaimVersionId,
        });
        activeClaims.delete(event.payload.data.priorClaimVersionId);
        activeClaims.add(event.payload.data.successorClaimVersionId);
        break;
      case 'deep_research.next_focus_selected':
        nextFocusId = event.payload.data.chosenBranchId
          ?? event.payload.data.chosenQuestionId;
        break;
      default:
        break;
    }
    const artifact = projectionArtifactFromEvent(event);
    if (artifact !== null) {
      if (
        event.payload.stem === 'deep_research.source_captured'
        && event.payload.data.parentSourceVersionId !== null
      ) {
        const parent = sources.get(event.payload.data.parentSourceVersionId);
        if (parent !== undefined) {
          const parentIndex = artifacts.findIndex((entry) => (
            entry.artifactKind === 'source-capture'
            && entry.digest === parent.contentDigest
          ));
          if (parentIndex >= 0) {
            artifacts[parentIndex] = {
              ...artifacts[parentIndex],
              validityState: 'invalid',
            };
          }
        }
      }
      if (
        artifact.artifactKind === 'continuity-save'
        && event.payload.stem !== 'deep_research.memory_save_requested'
      ) {
        const priorIndex = artifacts.map((entry) => entry.artifactKind)
          .lastIndexOf('continuity-save');
        if (priorIndex >= 0) {
          artifacts[priorIndex] = {
            ...artifacts[priorIndex],
            validityState: 'invalid',
          };
        }
      }
      artifacts.push(artifact);
    }
  }
  const sourceList = [...sources.values()].sort(
    (left, right) => left.sourceVersionId.localeCompare(right.sourceVersionId),
  );
  const evidenceList = [...evidence.values()].sort(
    (left, right) => left.evidenceId.localeCompare(right.evidenceId),
  );
  const claimList = [...claims.values()].sort(
    (left, right) => left.claimVersionId.localeCompare(right.claimVersionId),
  );
  const convergence = directConvergence(events, evidenceList, claimList, sourceList);
  const synthesis = latestSynthesis(events);
  const memory = latestMemorySave(events);
  return Object.freeze({
    runId,
    lineageId,
    generation,
    questionIds: Object.freeze(sortedUnique(questionIds)),
    branches: Object.freeze([...branches.values()].sort(
      (left, right) => left.branchId.localeCompare(right.branchId),
    )),
    sources: Object.freeze(sourceList),
    evidence: Object.freeze(evidenceList),
    claims: Object.freeze(claimList),
    supersessions: Object.freeze(supersessions.sort((left, right) => (
      left.priorClaimVersionId.localeCompare(right.priorClaimVersionId)
    ))),
    activeClaimVersionIds: Object.freeze(sortedUnique([...activeClaims])),
    contradictionClaimVersionIds: Object.freeze(sortedUnique([...contradictions])),
    nextFocusId,
    convergenceDecision: convergence.decision,
    convergenceOutcome: convergence.outcome,
    synthesisInputDigest: synthesis.inputDigest,
    reportDigest: synthesis.reportDigest,
    memorySaveState: memory.state,
    memorySaveDigest: memory.digest,
    artifacts: Object.freeze(artifacts.sort((left, right) => (
      left.artifactKind.localeCompare(right.artifactKind)
      || left.digest.localeCompare(right.digest)
    ))),
    terminalDecision: directTerminalDecision(events, convergence.outcome),
    resumeDecisionDigest: events.some((event) => (
      event.payload.stem === 'deep_research.run_resumed'
      || event.payload.stem === 'deep_research.run_restarted'
    )) ? resumeDecisionDigest(resumeEvidence, 'legacy') : null,
  });
}

const LegacyResumeComponents = Object.freeze([
  'adapter', 'codec', 'manifest', 'policy', 'reducer', 'schema',
] as const);

function legacyResumeComponentVersion(
  fingerprint: DeepResearchResumeRequest['persistedFingerprint'],
  component: (typeof LegacyResumeComponents)[number],
): string {
  switch (component) {
    case 'adapter': return fingerprint.adapterVersion;
    case 'codec': return fingerprint.codecVersion;
    case 'manifest': return fingerprint.manifestRevision;
    case 'policy': return fingerprint.policyVersion;
    case 'reducer': return fingerprint.reducerVersion;
    case 'schema': return fingerprint.schemaVersion;
  }
}

function legacyResumeCompatibility(request: DeepResearchResumeRequest): Readonly<{
  outcome: DeepResearchResumeDecision['compatibilityOutcome'];
  manifestDisposition: DeepResearchResumeDecision['manifestDisposition'];
  decisions: DeepResearchResumeDecision['compatibility'];
}> {
  const decisions = LegacyResumeComponents.map((component) => {
    const persistedVersion = legacyResumeComponentVersion(
      request.persistedFingerprint,
      component,
    );
    const installedVersion = legacyResumeComponentVersion(
      request.installedFingerprint,
      component,
    );
    const rule = request.compatibilityRules.find((candidate) => (
      candidate.component === component
      && candidate.fromVersion === persistedVersion
      && candidate.toVersion === installedVersion
    ));
    const outcome: DeepResearchResumeDecision['compatibility'][number]['outcome'] =
      persistedVersion === installedVersion ? 'exact' : rule?.outcome ?? 'blocked';
    return Object.freeze({
      component,
      persistedVersion,
      installedVersion,
      outcome,
      revision: rule?.revision ?? null,
      decisionReason: persistedVersion === installedVersion
        ? 'The legacy full-state view uses the installed component without conversion.'
        : rule === undefined
          ? 'The legacy full-state view has no conversion for this component pair.'
          : 'The legacy full-state view applies the registered conversion.',
    });
  });
  const outcomes = new Set(decisions.map((decision) => decision.outcome));
  const outcome: DeepResearchResumeDecision['compatibilityOutcome'] = outcomes.has('blocked')
    ? 'blocked'
    : outcomes.has('pin-old-runtime')
      ? 'pin-old-runtime'
      : outcomes.has('migrate')
        ? 'migrate'
        : outcomes.has('compatible')
          ? 'compatible'
          : 'exact';
  const manifest = decisions.find((decision) => decision.component === 'manifest');
  const manifestDisposition: DeepResearchResumeDecision['manifestDisposition'] =
    request.persistedFingerprint.manifestRevision
      === request.installedFingerprint.manifestRevision
      ? 'original'
      : manifest?.outcome === 'migrate' || manifest?.outcome === 'compatible'
        ? 'restart'
        : 'reject';
  return Object.freeze({
    outcome,
    manifestDisposition,
    decisions: Object.freeze(decisions),
  });
}

function legacyResumeInvalidation(
  projection: DeepResearchParityProjection,
): DeepResearchResumeDecision['invalidation'] {
  const changedSourceVersionIds = new Set(projection.sources.flatMap((source) => (
    source.parentSourceVersionId === null ? [] : [source.parentSourceVersionId]
  )));
  const invalidatedEvidenceIds = new Set(projection.evidence.filter(
    (entry) => changedSourceVersionIds.has(entry.sourceVersionId),
  ).map((entry) => entry.evidenceId));
  const invalidatedClaimVersionIds = new Set(projection.claims.filter((claim) => (
    claim.evidenceIds.some((evidenceId) => invalidatedEvidenceIds.has(evidenceId))
    || projection.supersessions.some(
      (entry) => entry.priorClaimVersionId === claim.claimVersionId,
    )
  )).map((claim) => claim.claimVersionId));
  const hasInvalidatedClaims = invalidatedClaimVersionIds.size > 0;
  const reopenedQuestionIds = hasInvalidatedClaims
    ? sortedUnique(projection.questionIds)
    : [];
  const reopened = new Set(reopenedQuestionIds);
  return Object.freeze({
    changedSourceVersionIds: Object.freeze(sortedUnique([...changedSourceVersionIds])),
    invalidatedEvidenceIds: Object.freeze(sortedUnique([...invalidatedEvidenceIds])),
    invalidatedClaimVersionIds: Object.freeze(sortedUnique([...invalidatedClaimVersionIds])),
    reopenedQuestionIds: Object.freeze(reopenedQuestionIds),
    reopenedLogicalLeafIds: Object.freeze(projection.branches.filter(
      (branch) => reopened.has(branch.questionId),
    ).map((branch) => branch.branchId).sort()),
    synthesisReopened: hasInvalidatedClaims,
  });
}

function legacyResumeEffectDecisions(
  snapshot: DeepResearchLegacyResumeSnapshot,
  request: DeepResearchResumeRequest,
): DeepResearchResumeDecision['effects'] {
  return Object.freeze((snapshot.effects ?? []).map((effect) => {
    const disposition = effect.state === 'compensation-required'
      ? 'compensate' as const
      : effect.state === 'uncertain'
        ? 'reconcile' as const
        : effect.state === 'conflicted'
          ? 'blocked' as const
          : 'reexecute' as const;
    return Object.freeze({
      effectId: requireToken(effect.effectId, 'legacyEffect.effectId'),
      logicalEffectId: requireToken(effect.logicalEffectId, 'legacyEffect.logicalEffectId'),
      disposition,
      attemptRefs: Object.freeze(effect.attemptRefs.map(
        (entry) => requireToken(entry, 'legacyEffect.attemptRef'),
      )),
      nextAttemptId: disposition === 'reexecute'
        ? `effect-attempt-${digest({
          logicalEffectId: effect.logicalEffectId,
          idempotencyKey: request.idempotencyKey,
        }).slice(0, 40)}`
        : null,
      decisionReason: effect.state === 'compensation-required'
        ? 'The legacy effect journal requires compensation before continuation.'
        : effect.state === 'uncertain'
          ? 'The legacy effect journal requires reconciliation before continuation.'
          : effect.state === 'conflicted'
            ? 'The legacy effect journal contains an unresolved conflict.'
            : 'The legacy effect journal has no confirmed completion.',
    });
  }));
}

/** Build a resume oracle from the modeled legacy full-state and effect journals. */
export function createDeepResearchLegacyResumeOracle(
  snapshot: DeepResearchLegacyResumeSnapshot,
): DeepResearchLegacyResumeOracle {
  const events = Object.freeze([...snapshot.events]);
  if (events.length === 0) throw new TypeError('Legacy resume oracle requires a persisted event view');
  const forensicReceiptDigests = Object.freeze((snapshot.forensicReceiptDigests ?? []).map(
    (entry) => requireDigest(entry, 'forensicReceiptDigest'),
  ));
  const verifiedArtifactDigests = Object.freeze((snapshot.verifiedArtifactDigests ?? []).map(
    (entry) => requireDigest(entry, 'verifiedArtifactDigest'),
  ));
  return Object.freeze({
    async resume(input: DeepResearchResumeRequest) {
      const request = parseDeepResearchResumeRequest(input);
      const freshProjection = legacyProjection(events, null);
      const initialization = events.find(
        (event) => event.payload.stem === 'deep_research.run_initialized',
      );
      if (
        freshProjection.runId !== request.runId
        || freshProjection.lineageId !== request.lease.lineageId
        || freshProjection.generation !== request.lease.generation
        || request.lease.runId !== request.runId
        || initialization?.payload.stem !== 'deep_research.run_initialized'
        || initialization.payload.data.replayFingerprint
          !== request.lease.replayFingerprint
      ) {
        throw new TypeError('Persisted lease does not match the legacy continuation identity');
      }
      const compatibility = legacyResumeCompatibility(request);
      const invalidation = legacyResumeInvalidation(freshProjection);
      const reopened = new Set(invalidation.reopenedLogicalLeafIds);
      const blocked = compatibility.outcome === 'blocked'
        || compatibility.outcome === 'pin-old-runtime'
        || compatibility.manifestDisposition === 'reject';
      const branches = Object.freeze(freshProjection.branches.map((branch) => {
        const disposition = blocked
          ? 'reject' as const
          : compatibility.manifestDisposition === 'restart'
            || reopened.has(branch.branchId)
            || branch.lifecycle !== 'selected'
            ? 'reexecute' as const
            : 'reuse' as const;
        return Object.freeze({
          logicalLeafId: branch.branchId,
          manifestRevision: request.manifestRevision,
          retryKey: `retry:${digest({
            manifestRevision: request.manifestRevision,
            logicalLeafId: branch.branchId,
          })}`,
          disposition,
          attemptId: disposition === 'reexecute'
            ? `branch-attempt-${digest({
              branchId: branch.branchId,
              idempotencyKey: request.idempotencyKey,
            }).slice(0, 40)}`
            : null,
          evidenceEventIds: Object.freeze(events.filter((event) => (
            (event.payload.stem === 'deep_research.branch_planned'
              || event.payload.stem === 'deep_research.branch_selected')
            && event.payload.scope.branchId === branch.branchId
          )).map((event) => event.event_id)),
          decisionReason: blocked
            ? 'The modeled legacy compatibility view blocks branch continuation.'
            : disposition === 'reuse'
              ? 'The legacy iteration view records this branch as selected.'
              : 'The legacy iteration view requires a fresh branch attempt.',
        });
      }));
      const effects = legacyResumeEffectDecisions(snapshot, request);
      const tail = events.at(-1);
      if (tail === undefined) throw new TypeError('Legacy resume oracle has no event tail');
      const decisionBody = {
        decisionVersion: 1 as const,
        decisionId: `legacy-resume-${digest({
          runId: request.runId,
          manifestRevision: request.manifestRevision,
          tailEventId: tail.event_id,
          idempotencyKey: request.idempotencyKey,
        }).slice(0, 40)}`,
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
        forensicReceiptDigests: Object.freeze(sortedUnique(forensicReceiptDigests)),
        verifiedArtifactDigests: Object.freeze(sortedUnique(verifiedArtifactDigests)),
        decisionReason: blocked
          ? 'The modeled legacy state cannot safely continue under the installed contracts.'
          : 'The modeled legacy state has one deterministic continuation plan.',
      };
      const decision = parseDeepResearchResumeDecision(Object.freeze({
        ...decisionBody,
        decisionDigest: digest(decisionBody),
      }));
      return Object.freeze({
        decision,
        eventTail: Object.freeze({
          streamId: tail.stream_id,
          streamSequence: tail.stream_sequence,
          eventCount: events.length,
        }),
        freshProjection,
      });
    },
  });
}

function artifactViewFromProjection(
  projection: DeepResearchProjectionState,
): DeepResearchProjectionArtifact[] {
  return projection.artifactIndex.artifacts.map((artifact) => ({
    artifactKind: artifact.artifactKind,
    digest: artifact.digest,
    validityState: artifact.validityState === 'unavailable'
      || artifact.validityState === 'superseded'
      ? 'invalid'
      : artifact.validityState,
    receiptRefs: sortedUnique(artifact.receiptRefs),
  })).sort((left, right) => (
    left.artifactKind.localeCompare(right.artifactKind)
    || left.digest.localeCompare(right.digest)
  ));
}

function ledgerProjection(
  events: readonly DeepResearchLedgerEvent[],
  resumeEvidence: DeepResearchResumeParityEvidence | null,
): DeepResearchParityProjection {
  const folded = foldDeepResearchEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Ledger projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  const projection = folded.projection;
  const latestFocus = projection.researchPlan.focusObligations.at(-1);
  const latestConvergence = projection.convergence.evaluations.at(-1);
  const synthesis = latestSynthesis(events);
  const memory = latestMemorySave(events);
  const hasRunCompleted = events.some(
    (event) => event.payload.stem === 'deep_research.run_completed',
  );
  const terminal: DeepResearchTerminalDecision = projection.status.state === 'converged'
    ? events.some((event) => event.payload.stem === 'deep_research.run_completed')
      ? 'completed'
      : 'converged'
    : projection.status.state === 'quarantined'
      ? 'quarantined'
      : projection.status.state === 'incomplete'
        ? 'incomplete'
        : projection.status.state === 'blocked' || projection.status.state === 'failed'
          ? 'blocked'
          : !hasRunCompleted && projection.convergence.outcome !== 'active'
            ? projection.convergence.outcome
            : 'active';
  return Object.freeze({
    runId: projection.run.runId,
    lineageId: projection.run.lineageId,
    generation: projection.run.generation,
    questionIds: Object.freeze(projection.researchPlan.questions.map(
      (question) => question.questionId,
    )),
    branches: Object.freeze(projection.researchPlan.branches.map((branch) => ({
      questionId: branch.questionId,
      branchId: branch.branchId,
      lifecycle: branch.lifecycle,
    }))),
    sources: Object.freeze(projection.claimLedger.sources.map((source) => ({
      sourceVersionId: source.sourceVersionId,
      contentDigest: source.contentDigest,
      parentSourceVersionId: source.parentSourceVersionId,
      instructionScanResult: source.instructionScanResult,
    }))),
    evidence: Object.freeze(projection.claimLedger.evidence.map((entry) => ({
      evidenceId: entry.evidenceId,
      sourceVersionId: entry.sourceVersionId,
      disposition: entry.disposition,
      contaminationStatus: entry.contaminationStatus,
    }))),
    claims: Object.freeze(projection.claimLedger.claims.map((claim) => ({
      claimId: claim.claimId,
      claimVersionId: claim.claimVersionId,
      relation: claim.relation,
      evidenceIds: Object.freeze([...claim.evidenceIds]),
      claimStatus: claim.claimStatus,
    }))),
    supersessions: Object.freeze(projection.claimLedger.supersessions.map((entry) => ({
      priorClaimVersionId: entry.priorClaimVersionId,
      successorClaimVersionId: entry.successorClaimVersionId,
    }))),
    activeClaimVersionIds: Object.freeze([...projection.claimLedger.activeClaimVersionIds]),
    contradictionClaimVersionIds: Object.freeze([
      ...projection.claimLedger.contradictionClaimVersionIds,
    ]),
    nextFocusId: latestFocus?.chosenBranchId ?? latestFocus?.chosenQuestionId ?? null,
    convergenceDecision: latestConvergence?.decision ?? null,
    convergenceOutcome: projection.convergence.outcome,
    synthesisInputDigest: synthesis.inputDigest,
    reportDigest: synthesis.reportDigest,
    memorySaveState: memory.state,
    memorySaveDigest: memory.digest,
    artifacts: Object.freeze(artifactViewFromProjection(projection)),
    terminalDecision: terminal,
    resumeDecisionDigest: events.some((event) => (
      event.payload.stem === 'deep_research.run_resumed'
      || event.payload.stem === 'deep_research.run_restarted'
    )) ? resumeDecisionDigest(resumeEvidence, 'ledger') : null,
  });
}

function replayState(
  events: readonly DeepResearchLedgerEvent[],
  fixture: DeepResearchParityFixture,
  path: 'ledger' | 'legacy',
): DeepResearchParityReplayState {
  const projection = path === 'legacy'
    ? legacyProjection(events, fixture.resumeEvidence)
    : ledgerProjection(events, fixture.resumeEvidence);
  const projectionFingerprint = digest(projection);
  const priorFingerprints = events.map((_, index) => {
    const prefix = events.slice(0, index + 1);
    const prefixProjection = path === 'legacy'
      ? legacyProjection(prefix, fixture.resumeEvidence)
      : ledgerProjection(prefix, fixture.resumeEvidence);
    return digest(prefixProjection);
  });
  const observations = canonicalizeDeepResearchEventStream(events, priorFingerprints);
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map(
      (observation) => JSON.stringify(observation),
    )),
  }) as unknown as DeepResearchParityReplayState;
}

function replayObservations(
  state: DeepResearchParityReplayState,
): readonly DeepResearchParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as DeepResearchParityEventObservation,
  ));
}

function replayProjection(
  state: DeepResearchParityReplayState,
): DeepResearchParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as DeepResearchParityProjection;
}

// ───────────────────────────────────────────────────────────────────
// 4. PATH FAULTS AND EVENT-FOR-EVENT DIFFS
// ───────────────────────────────────────────────────────────────────

function rebuildEvent<TStem extends DeepResearchEventStem>(
  event: DeepResearchEventEnvelope<TStem>,
  overrides: Readonly<{
    eventId?: string;
    streamSequence?: number;
    causationId?: string | null;
    idempotencyKey?: string;
    prevEventHash?: string;
    scope?: DeepResearchEventEnvelope<TStem>['payload']['scope'];
    data?: DeepResearchEventEnvelope<TStem>['payload']['data'];
  }>,
): DeepResearchEventEnvelope<TStem> {
  const payload = createDeepResearchLedgerPayload(
    event.payload.stem,
    overrides.scope ?? event.payload.scope,
    overrides.prevEventHash ?? event.payload.prevEventHash,
    event.payload.replay,
    overrides.data ?? event.payload.data,
  );
  return Object.freeze({
    ...event,
    event_id: overrides.eventId ?? event.event_id,
    stream_sequence: overrides.streamSequence ?? event.stream_sequence,
    causation_id: overrides.causationId === undefined
      ? event.causation_id
      : overrides.causationId,
    idempotency_key: overrides.idempotencyKey ?? event.idempotency_key,
    payload,
  });
}

/** Bind a sealed fixture capsule to the exact empty replay state both paths consume. */
export function deepResearchParityInitialStateDigest(
  fixture: DeepResearchParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

function replaceReceipt(event: DeepResearchLedgerEvent): DeepResearchLedgerEvent {
  switch (event.payload.stem) {
    case 'deep_research.run_resumed':
    case 'deep_research.run_restarted':
      return rebuildEvent(event, {
        data: { ...event.payload.data, recoveryReceiptRef: 'fault-recovery-receipt' },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.source_captured':
      return rebuildEvent(event, {
        data: { ...event.payload.data, retrievalReceiptRef: 'fault-retrieval-receipt' },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.synthesis_committed':
      return rebuildEvent(event, {
        data: { ...event.payload.data, synthesisReceiptRef: 'fault-synthesis-receipt' },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.memory_save_completed':
      return rebuildEvent(event, {
        data: { ...event.payload.data, persistenceReceiptRefs: ['fault-persistence-receipt'] },
      }) as DeepResearchLedgerEvent;
    default:
      throw new TypeError('Receipt fault requires an event with a typed receipt reference');
  }
}

function replaceArtifact(event: DeepResearchLedgerEvent): DeepResearchLedgerEvent {
  const changedDigest = digest({ fault: 'artifact', eventId: event.event_id });
  switch (event.payload.stem) {
    case 'deep_research.source_captured':
      return rebuildEvent(event, {
        data: { ...event.payload.data, contentDigest: changedDigest },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.iteration_completed':
      return rebuildEvent(event, {
        data: { ...event.payload.data, outputDigest: changedDigest },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.synthesis_committed':
      return rebuildEvent(event, {
        data: { ...event.payload.data, reportDigest: changedDigest },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.memory_save_requested':
    case 'deep_research.memory_save_failed':
      return rebuildEvent(event, {
        data: { ...event.payload.data, continuityPayloadDigest: changedDigest },
      }) as DeepResearchLedgerEvent;
    case 'deep_research.memory_save_completed':
      return rebuildEvent(event, {
        data: { ...event.payload.data, continuityFingerprint: changedDigest },
      }) as DeepResearchLedgerEvent;
    default:
      throw new TypeError('Artifact fault requires an artifact-bearing event');
  }
}

function replaceTerminalDecision(event: DeepResearchLedgerEvent): DeepResearchLedgerEvent {
  if (
    event.payload.stem === 'deep_research.convergence_evaluated'
    || event.payload.stem === 'deep_research.convergence_blocked'
  ) {
    const decision = event.payload.stem === 'deep_research.convergence_blocked'
      ? 'blocked'
      : event.payload.data.decision === 'incomplete' ? 'blocked' : 'incomplete';
    return rebuildEvent(event, {
      data: {
        ...event.payload.data,
        decision,
        incompleteReason: decision === 'incomplete'
          ? 'Fault injection changed the terminal decision.'
          : null,
        recoveryReason: null,
      },
    }) as DeepResearchLedgerEvent;
  }
  if (event.payload.stem === 'deep_research.run_completed') {
    const terminalStatus = event.payload.data.terminalStatus === 'incomplete'
      ? 'blocked'
      : 'incomplete';
    return rebuildEvent(event, {
      data: {
        ...event.payload.data,
        terminalStatus,
        completionReason: terminalStatus === 'blocked'
          ? 'Fault injection changed the terminal decision.'
          : null,
        incompleteReason: terminalStatus === 'incomplete'
          ? 'Fault injection changed the terminal decision.'
          : null,
      },
    }) as DeepResearchLedgerEvent;
  }
  throw new TypeError('Terminal fault requires a convergence or run-completed event');
}

function applyPathFault(
  events: readonly DeepResearchLedgerEvent[],
  fault: DeepResearchParityFaultInjection | undefined,
  path: 'ledger' | 'legacy',
): DeepResearchLedgerEvent[] {
  const output = [...events];
  if (!fault || fault.path !== path) return output;
  const eventIndex = requireCount(fault.eventIndex, 'fault.eventIndex');
  if (eventIndex >= output.length) throw new TypeError('Fault eventIndex is outside the fixture');
  if (fault.kind === 'drop-event') {
    output.splice(eventIndex, 1);
    return output;
  }
  if (fault.kind === 'reorder-event') {
    if (eventIndex + 1 >= output.length) {
      throw new TypeError('Reorder fault requires a following event');
    }
    [output[eventIndex], output[eventIndex + 1]] = [
      output[eventIndex + 1],
      output[eventIndex],
    ];
    return output;
  }
  if (fault.kind === 'extra-event') {
    const source = output[eventIndex];
    if (source.payload.stem !== 'deep_research.source_captured') {
      throw new TypeError('Extra-event fault requires a source-captured event');
    }
    const changedDigest = digest({ fault: 'extra-event', eventId: source.event_id });
    const clone = rebuildEvent(source, {
      eventId: `${source.event_id}-extra`,
      streamSequence: Math.max(...output.map((entry) => entry.stream_sequence)) + 1,
      causationId: output.at(-1)?.event_id ?? null,
      idempotencyKey: `${source.idempotency_key}-extra-event`,
      prevEventHash: digest({ extra: source.event_id }),
      scope: {
        ...source.payload.scope,
        sourceVersionId: `${source.payload.scope.sourceVersionId}-extra`,
      },
      data: {
        ...source.payload.data,
        sourceIdentityDigest: changedDigest,
        locator: {
          ...source.payload.data.locator,
          locatorDigest: changedDigest,
          selector: `${source.payload.data.locator.selector}#fault-extra`,
          revision: `${source.payload.data.locator.revision}-extra`,
        },
        contentDigest: changedDigest,
        retrievalReceiptRef: `${source.payload.data.retrievalReceiptRef}-extra`,
        parentSourceVersionId: source.payload.scope.sourceVersionId,
      },
    });
    output.push(clone as DeepResearchLedgerEvent);
    return output;
  }
  if (fault.kind === 'duplicate-event') {
    const source = output[eventIndex];
    const clone = rebuildEvent(source, {
      eventId: `${source.event_id}-duplicate`,
      streamSequence: Math.max(...output.map((entry) => entry.stream_sequence)) + 1,
      causationId: output.at(-1)?.event_id ?? null,
      idempotencyKey: `${source.idempotency_key}-duplicate-event`,
    });
    output.push(clone as DeepResearchLedgerEvent);
    return output;
  }
  const target = output[eventIndex];
  switch (fault.kind) {
    case 'causal-link':
      output[eventIndex] = rebuildEvent(target, {
        causationId: 'fault-causal-event',
      }) as DeepResearchLedgerEvent;
      break;
    case 'payload':
      output[eventIndex] = rebuildEvent(target, {
        prevEventHash: digest({ fault: 'payload', eventId: target.event_id }),
      }) as DeepResearchLedgerEvent;
      break;
    case 'receipt':
      output[eventIndex] = replaceReceipt(target);
      break;
    case 'artifact':
      output[eventIndex] = replaceArtifact(target);
      break;
    case 'terminal-decision':
      output[eventIndex] = replaceTerminalDecision(target);
      break;
    case 'projection':
      break;
  }
  return output;
}

function observationDigest(value: DeepResearchParityEventObservation): string {
  return digest(value);
}

function makeDiff(
  fixtureId: string,
  diffClass: DeepResearchParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): DeepResearchParityDiffRecord {
  const body = {
    fixtureId,
    class: diffClass,
    eventIndex,
    expectedDigest,
    actualDigest,
    disposition: 'unexplained' as const,
    owner: 'deep-research-mode-owner',
    dispositionReason: 'The difference can change event history or trusted projection state.',
    trustedStateProof: digest({
      fixtureId,
      class: diffClass,
      eventIndex,
      expectedDigest,
      actualDigest,
    }),
  };
  return Object.freeze({ diffId: digest(body), ...body });
}

function logicalIdentityKey(value: DeepResearchParityEventObservation): string {
  return digest({
    eventType: value.eventType,
    logicalRunId: value.logicalRunId,
    logicalBranchId: value.logicalBranchId,
    stepKey: value.stepKey,
    producerSequence: value.producerSequence,
  });
}

function indexesByLogicalIdentity(
  values: readonly DeepResearchParityEventObservation[],
): ReadonlyMap<string, readonly number[]> {
  const indexes = new Map<string, number[]>();
  for (const [index, value] of values.entries()) {
    const key = logicalIdentityKey(value);
    indexes.set(key, [...(indexes.get(key) ?? []), index]);
  }
  return indexes;
}

function sameLogicalIdentityMultiset(
  legacy: ReadonlyMap<string, readonly number[]>,
  ledger: ReadonlyMap<string, readonly number[]>,
): boolean {
  if (legacy.size !== ledger.size) return false;
  return [...legacy].every(([key, indexes]) => indexes.length === ledger.get(key)?.length);
}

/** Compare every canonical position and retain all typed semantic dispositions. */
export function compareDeepResearchEventStreams(
  fixtureId: string,
  legacy: readonly DeepResearchParityEventObservation[],
  ledger: readonly DeepResearchParityEventObservation[],
): readonly DeepResearchParityDiffRecord[] {
  requireToken(fixtureId, 'fixtureId');
  const diffs: DeepResearchParityDiffRecord[] = [];
  const legacyKeys = legacy.map(logicalIdentityKey);
  const ledgerKeys = ledger.map(logicalIdentityKey);
  const legacyIndexes = indexesByLogicalIdentity(legacy);
  const ledgerIndexes = indexesByLogicalIdentity(ledger);
  if (
    sameLogicalIdentityMultiset(legacyIndexes, ledgerIndexes)
    && legacyKeys.some((key, index) => key !== ledgerKeys[index])
  ) {
    diffs.push(makeDiff(fixtureId, 'reordered', 0, digest(legacyKeys), digest(ledgerKeys)));
  }
  const logicalKeys = sortedUnique([...legacyIndexes.keys(), ...ledgerIndexes.keys()]);
  for (const logicalKey of logicalKeys) {
    const expectedIndexes = legacyIndexes.get(logicalKey) ?? [];
    const actualIndexes = ledgerIndexes.get(logicalKey) ?? [];
    if (expectedIndexes.length === 0) {
      const eventIndex = actualIndexes[0];
      diffs.push(makeDiff(
        fixtureId,
        'extra',
        eventIndex,
        null,
        observationDigest(ledger[eventIndex]),
      ));
    } else if (actualIndexes.length === 0) {
      const eventIndex = expectedIndexes[0];
      diffs.push(makeDiff(
        fixtureId,
        'missing',
        eventIndex,
        observationDigest(legacy[eventIndex]),
        null,
      ));
    }
    if (expectedIndexes.length > actualIndexes.length && expectedIndexes.length > 1) {
      for (const eventIndex of expectedIndexes.slice(Math.max(1, actualIndexes.length))) {
        diffs.push(makeDiff(
          fixtureId,
          'duplicated',
          eventIndex,
          observationDigest(legacy[eventIndex]),
          null,
        ));
      }
    }
    if (actualIndexes.length > expectedIndexes.length && actualIndexes.length > 1) {
      for (const eventIndex of actualIndexes.slice(Math.max(1, expectedIndexes.length))) {
        diffs.push(makeDiff(
          fixtureId,
          'duplicated',
          eventIndex,
          null,
          observationDigest(ledger[eventIndex]),
        ));
      }
    }
    const pairedCount = Math.min(expectedIndexes.length, actualIndexes.length);
    for (let pairIndex = 0; pairIndex < pairedCount; pairIndex += 1) {
      const eventIndex = expectedIndexes[pairIndex];
      const expected = legacy[eventIndex];
      const actual = ledger[actualIndexes[pairIndex]];
      if (digest(expected.causalEventIds) !== digest(actual.causalEventIds)) {
        diffs.push(makeDiff(
          fixtureId,
          'causal-link',
          eventIndex,
          digest(expected.causalEventIds),
          digest(actual.causalEventIds),
        ));
      }
      if (digest(expected.receiptRefs) !== digest(actual.receiptRefs)) {
        diffs.push(makeDiff(
          fixtureId,
          'receipt',
          eventIndex,
          digest(expected.receiptRefs),
          digest(actual.receiptRefs),
        ));
      }
      if (digest(expected.artifactRefs) !== digest(actual.artifactRefs)) {
        diffs.push(makeDiff(
          fixtureId,
          'artifact',
          eventIndex,
          digest(expected.artifactRefs),
          digest(actual.artifactRefs),
        ));
      }
      if (expected.projectionFingerprint !== actual.projectionFingerprint) {
        diffs.push(makeDiff(
          fixtureId,
          'projection',
          eventIndex,
          expected.projectionFingerprint,
          actual.projectionFingerprint,
        ));
      }
      if (expected.terminalDecision !== actual.terminalDecision) {
        diffs.push(makeDiff(
          fixtureId,
          'terminal-decision',
          eventIndex,
          digest(expected.terminalDecision),
          digest(actual.terminalDecision),
        ));
      }
      if (expected.stablePayloadDigest !== actual.stablePayloadDigest) {
        diffs.push(makeDiff(
          fixtureId,
          'payload',
          eventIndex,
          expected.stablePayloadDigest,
          actual.stablePayloadDigest,
        ));
      }
    }
  }
  return Object.freeze(diffs.sort((left, right) => (
    left.eventIndex - right.eventIndex || left.class.localeCompare(right.class)
  )));
}

// ───────────────────────────────────────────────────────────────────
// 5. REAL SUBSTRATE EXECUTORS
// ───────────────────────────────────────────────────────────────────

function evaluateParityPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === PARITY_CAPABILITY_ID
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['shadow-only-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['shadow-only-write'] };
}

function createPolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: PARITY_POLICY_ID,
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['shadow-only-write'],
    evaluate: evaluateParityPolicy,
  }]);
}

function createParityEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([
    ...deepResearchEventDefinitions(),
    replayFingerprintAttestationEventDefinition(),
  ]);
}

function createAuthority(): AuthoritySnapshot {
  return Object.freeze({ state: 'shadowing', epoch: 1 });
}

function createLedgerBoundary(rootDirectory: string): Readonly<{
  ledger: AppendOnlyLedger;
  gateway: TransitionAuthorizationGateway;
  policies: TransitionPolicyRegistry;
  registry: EventTypeRegistry;
}> {
  const authority = createAuthority();
  const registry = createParityEventRegistry();
  const policies = createPolicyRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: PARITY_LEDGER_ID,
    auditLedgerId: PARITY_AUDIT_LEDGER_ID,
    authorityProvider: () => authority,
    now: () => new Date(PARITY_TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: PARITY_AUDIT_LEDGER_ID,
    authorityProvider: () => authority,
    now: () => new Date(PARITY_TIMESTAMP),
  }, ledger, policies);
  return Object.freeze({ ledger, gateway, policies, registry });
}

async function authorizeEvent(
  ledger: AppendOnlyLedger,
  gateway: TransitionAuthorizationGateway,
  policies: TransitionPolicyRegistry,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const policy = policies.resolve(PARITY_POLICY_ID, 1);
  const result = await gateway.authorize({
    requestId,
    mode: 'research',
    event,
    priorHead: await ledger.getVerifiedHead(),
    priorStateVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'deep-research-shadow-parity' }),
    actorId: 'deep-research-shadow-parity',
    capabilityId: PARITY_CAPABILITY_ID,
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: event.canonicalDigest,
  });
  if (result.verdict !== 'allow') {
    throw new TypeError(`Shadow parity event authorization failed: ${result.reasonCode}`);
  }
  return result.proof;
}

function stateWithPathFault(
  state: DeepResearchParityReplayState,
  fault: DeepResearchParityFaultInjection | undefined,
  path: 'ledger' | 'legacy',
): DeepResearchParityReplayState {
  if (!fault || fault.path !== path) return state;
  if (fault.kind === 'duplicate-event') {
    const observations = replayObservations(state);
    const duplicateIndex = observations.findIndex((entry) => (
      entry.eventId.endsWith('-duplicate')
    ));
    if (duplicateIndex < 0 || fault.eventIndex >= observations.length) return state;
    const sourceSequence = observations[fault.eventIndex].producerSequence;
    const adjusted = observations.map((entry, index) => (
      index === duplicateIndex
        ? Object.freeze({ ...entry, producerSequence: sourceSequence })
        : entry
    ));
    return Object.freeze({
      ...state,
      observationCanonicalJson: Object.freeze(adjusted.map(
        (observation) => JSON.stringify(observation),
      )),
    }) as unknown as DeepResearchParityReplayState;
  }
  if (fault.kind !== 'projection') return state;
  if (fault.eventIndex >= state.observationCanonicalJson.length) return state;
  const changedFingerprint = digest({
    fault: 'projection',
    eventIndex: fault.eventIndex,
    path,
  });
  const observations = replayObservations(state).map((entry, index) => (
    index === fault.eventIndex
      ? Object.freeze({ ...entry, projectionFingerprint: changedFingerprint })
      : entry
  ));
  return Object.freeze({
    ...state,
    projectionFingerprint: changedFingerprint,
    observationCanonicalJson: Object.freeze(observations.map(
      (observation) => JSON.stringify(observation),
    )),
  }) as unknown as DeepResearchParityReplayState;
}

function createReducerRegistry(
  path: 'ledger' | 'legacy',
  fixture: DeepResearchParityFixture,
  fault: DeepResearchParityFaultInjection | undefined,
): TypedReducerRegistry<DeepResearchParityReplayState> {
  return new TypedReducerRegistry(DeepResearchEventStems.map((stem) => ({
    eventType: DeepResearchWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const typed = event.effective.envelope as DeepResearchLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepResearchLedgerEvent,
      );
      const next = replayState([...history, typed], fixture, path);
      return stateWithPathFault(next, fault, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'ledger' | 'legacy',
  fixture: DeepResearchParityFixture,
  fault: DeepResearchParityFaultInjection | undefined,
): ReplayComponentRegistry<DeepResearchParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<DeepResearchParityReplayState> => {
    if (!replayInputs[SEALED_ARTIFACT_REPLAY_INPUT_KEY]) {
      throw new TypeError('Deep Research parity replay requires sealed fixture inputs');
    }
    return createReducerRegistry(path, fixture, fault);
  };
  const replayInputSources = {
    [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.source,
  };
  return new ReplayComponentRegistry([{
    reducerId: PARITY_REDUCER_ID,
    reducerVersion: PARITY_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function validateFrozenInputAgainstCapsule(
  frozen: DeepResearchFrozenParityInput,
  resumeEvidence: DeepResearchResumeParityEvidence | null,
  context: ParityExecutionContext,
  initialState: DeepResearchParityReplayState,
): void {
  if (!isRecord(frozen) || !hasExactKeys(frozen, [
    'baseSha', 'runManifestDigest', 'sourceSnapshotDigest', 'promptFingerprint',
    'modelFingerprint', 'toolFingerprint', 'initialStateDigest',
    'configurationDigest', 'budgetLease',
  ])) {
    throw new TypeError('frozenInput must use the closed allowed-key set');
  }
  requireBaseSha(frozen.baseSha, 'frozenInput.baseSha');
  requireDigest(frozen.runManifestDigest, 'frozenInput.runManifestDigest');
  requireDigest(frozen.sourceSnapshotDigest, 'frozenInput.sourceSnapshotDigest');
  requireDigest(frozen.promptFingerprint, 'frozenInput.promptFingerprint');
  requireDigest(frozen.modelFingerprint, 'frozenInput.modelFingerprint');
  requireDigest(frozen.toolFingerprint, 'frozenInput.toolFingerprint');
  requireDigest(frozen.initialStateDigest, 'frozenInput.initialStateDigest');
  requireDigest(frozen.configurationDigest, 'frozenInput.configurationDigest');
  if (
    frozen.baseSha !== context.capsule.baseSha
    || frozen.initialStateDigest !== context.capsule.initialStateDigest
    || frozen.configurationDigest !== context.capsule.configurationDigest
    || frozen.initialStateDigest !== digest(initialState)
  ) {
    throw new TypeError('Executor fixture does not match the verified sealed case capsule');
  }
  if (!isRecord(frozen.budgetLease) || !hasExactKeys(frozen.budgetLease, [
    'leaseId', 'runId', 'lineageId', 'generation', 'maxIterations',
    'remainingIterations', 'deadlineAt',
  ])) {
    throw new TypeError('frozenInput.budgetLease must use the closed allowed-key set');
  }
  requireToken(frozen.budgetLease.leaseId, 'budgetLease.leaseId');
  requireToken(frozen.budgetLease.runId, 'budgetLease.runId');
  requireToken(frozen.budgetLease.lineageId, 'budgetLease.lineageId');
  requireCount(frozen.budgetLease.generation, 'budgetLease.generation');
  requireCount(frozen.budgetLease.maxIterations, 'budgetLease.maxIterations');
  requireCount(frozen.budgetLease.remainingIterations, 'budgetLease.remainingIterations');
  requireTimestamp(frozen.budgetLease.deadlineAt, 'budgetLease.deadlineAt');
  assertResumeEvidenceLeaseContinuity(frozen, resumeEvidence);
}

function attestationEnvelope(path: 'ledger' | 'legacy', runIndex: number) {
  void runIndex;
  return {
    eventId: `${path}-parity-attestation`,
    streamId: 'deep-research-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'deep-research-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-parity-attestation`,
  };
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: DeepResearchParityFixture,
  fault: DeepResearchParityFaultInjection | undefined,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<DeepResearchParityReplayState>,
  initialState: DeepResearchParityReplayState,
): Promise<void> {
  const engine = new LegacyProjectionEngine({
    shadowRoot: resolve(context.executionRoot, 'legacy-projection-output'),
    protectedLegacyPaths: [resolve(context.executionRoot, 'legacy-authority-protected')],
    now: () => new Date(PARITY_TIMESTAMP),
  });
  const baseBytes = Uint8Array.from(
    serializeLegacyJson(initialState as unknown as JsonValue),
  );
  const contract = {
    artifactId: PARITY_ARTIFACT_ID,
    censusSurfaceId: 'research-projections',
    ledgerId: PARITY_LEDGER_ID,
    streamIds: sortedUnique(fixture.events.map((event) => event.stream_id)),
    relativePath: 'research/deep-research-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-research-projections-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
    reducerVersion: PARITY_REDUCER_VERSION,
    serializerId: 'legacy-pretty-json-v1',
    legacyWriter: 'deep-research reducer',
    readers: ['operators and resume'],
    base: {
      baseSha: context.capsule.baseSha,
      baseDigest: sha256Bytes(baseBytes),
      bytes: baseBytes,
      state: initialState,
      ledgerHead: {
        ledgerId: PARITY_LEDGER_ID,
        sequence: 0,
        recordHash: GENESIS_RECORD_HASH,
      },
    },
    acceptedEventVersions: Object.fromEntries(
      DeepResearchEventStems.map((stem) => [DeepResearchWireEventTypes[stem], [1]]),
    ),
    reduce: (
      state: Readonly<DeepResearchParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): DeepResearchParityReplayState => {
      const typed = event.effective.envelope as DeepResearchLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepResearchLedgerEvent,
      );
      return stateWithPathFault(
        replayState([...history, typed], fixture, 'legacy'),
        fault,
        'legacy',
      );
    },
    serialize: (state: Readonly<DeepResearchParityReplayState>): Uint8Array => (
      Uint8Array.from(serializeLegacyJson(state as unknown as JsonValue))
    ),
  };
  const oracle = foldLegacyProjection(
    contract,
    await ledger.readVerifiedEvents(),
    await ledger.getVerifiedHead(),
    fingerprint,
  );
  const result = await engine.project({
    contract,
    ledger,
    replayFingerprint: fingerprint,
    expectedLegacyBytes: oracle.bytes,
  });
  if (!result.ok) {
    throw new TypeError(`Legacy projection oracle failed: ${result.error.code} ${
      JSON.stringify(result.error.details)
    }`);
  }
  if (
    result.receipt.projectedDigest !== sha256Bytes(oracle.bytes)
    || result.receipt.baseSha !== context.capsule.baseSha
    || result.receipt.publication === undefined
  ) {
    throw new TypeError('Legacy projection oracle receipt did not bind expected shadow bytes');
  }
}

function executorObservations(
  context: ParityExecutionContext,
  fixture: DeepResearchParityFixture,
  state: DeepResearchParityReplayState,
): Readonly<Partial<Record<ParityObservationClass, JsonValue>>> {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'deep-research-shadow-observation',
    fixture_id: fixture.fixtureId,
    frozen_input_digest: digest(fixture.frozenInput),
  });
  return Object.freeze({
    'terminal-status': projection.terminalDecision,
    'return-value': state.projectionFingerprint,
    'error-halt': null,
    'ordered-transitions': state.observationCanonicalJson as unknown as JsonValue,
    'effect-receipts': context.effectSink.receipts() as unknown as JsonValue,
    budgets: fixture.frozenInput.budgetLease as unknown as JsonValue,
    'emitted-artifacts': projection.artifacts.map(
      (artifact) => digest(artifact),
    ) as unknown as JsonValue,
    'reader-results': state.projectionFingerprint,
  });
}

function createPathExecutor(
  path: 'ledger' | 'legacy',
  fixture: DeepResearchParityFixture,
  fault: DeepResearchParityFaultInjection | undefined,
  captured: DeepResearchPathEvidence[],
): DeepResearchParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<ParityPathExecution<DeepResearchParityReplayState>> => {
    const events = applyPathFault(fixture.events, fault, path);
    const initialState = replayState([], fixture, path);
    validateFrozenInputAgainstCapsule(
      fixture.frozenInput,
      fixture.resumeEvidence,
      context,
      initialState,
    );
    const ledgerRoot = resolve(context.executionRoot, 'ledger');
    if (ledgerTemplateRoot !== null) {
      cpSync(ledgerTemplateRoot, ledgerRoot, { recursive: true, preserveTimestamps: true });
    }
    const { ledger, gateway, policies, registry } = createLedgerBoundary(ledgerRoot);
    if (ledgerTemplateRoot === null) {
      for (const event of events) {
        const prepared = prepareEventWrite(event as EventEnvelope, registry);
        const proof = await authorizeEvent(
          ledger,
          gateway,
          policies,
          prepared,
          `${path}-event-${event.stream_sequence}`,
        );
        await ledger.appendAuthorized(prepared, proof);
      }
      ledgerTemplateRoot = resolve(context.executionRoot, '..', `${path}-ledger-template`);
      cpSync(ledgerRoot, ledgerTemplateRoot, { recursive: true, preserveTimestamps: true });
    }
    const componentRegistry = createComponentRegistry(context, path, fixture, fault);
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const verification: VerifyReplayFingerprintInput<DeepResearchParityReplayState> = {
      ledger,
      eventRegistry: registry,
      versionRegistry,
      componentRegistry,
      consumer: 'shadow-parity',
      fingerprintVersion: 1,
      runId: `${path}-${fixture.fixtureId}`,
      rangeStartSequence: 1,
      rangeEndSequence: events.length,
      replay: {
        reducerId: PARITY_REDUCER_ID,
        reducerVersion: PARITY_REDUCER_VERSION,
        projectionSchemaVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
        initialState,
        replayInputDigests: {
          initial_state: digest(initialState),
          [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.digest,
        },
      },
    };
    let derived: DerivedReplayFingerprint<DeepResearchParityReplayState>;
    try {
      derived = await deriveReplayFingerprint(verification);
    } catch (error) {
      throw new TypeError(`Replay derivation failed: ${
        error instanceof Error ? error.message : 'unknown error'
      }`);
    }
    const state = derived.projection.state;
    const projection = replayProjection(state);
    if (
      (fault === undefined || fault.path !== path)
      && projection.terminalDecision !== fixture.expectedTerminalDecision
    ) {
      throw new TypeError('Fixture terminal decision does not match its closed expectation');
    }
    const bytes = Uint8Array.from(canonicalBytes({
      projectionFingerprint: state.projectionFingerprint,
      observationCanonicalJson: state.observationCanonicalJson,
    }));
    if (path === 'legacy') {
      try {
        await projectThroughLegacyOracle(
          context,
          fixture,
          fault,
          ledger,
          derived,
          initialState,
        );
      } catch (error) {
        throw new TypeError(`Legacy oracle failed: ${
          error instanceof Error ? error.message : 'unknown error'
        }`);
      }
    }
    try {
      const attestation = prepareReplayFingerprintAttestation(
        derived,
        registry,
        versionRegistry,
        attestationEnvelope(path, context.runIndex),
      );
      try {
        const attestationProof = await authorizeEvent(
          ledger,
          gateway,
          policies,
          attestation,
          `${path}-attestation-${context.runIndex}`,
        );
        try {
          await recordReplayFingerprintAttestation(
            ledger,
            attestation,
            attestationProof,
            derived,
            versionRegistry,
          );
        } catch (error) {
          throw new TypeError(`record: ${error instanceof Error ? error.message : 'unknown'}`);
        }
      } catch (error) {
        throw new TypeError(`authorize: ${error instanceof Error ? error.message : 'unknown'}`);
      }
    } catch (error) {
      throw new TypeError(`Replay attestation failed: ${
        error instanceof Error ? error.message : 'unknown error'
      }`);
    }
    const observations = replayObservations(state);
    const streamDigest = digest(observations);
    captured.push(Object.freeze({
      path,
      runIndex: context.runIndex,
      streamDigest,
      projectionFingerprint: state.projectionFingerprint,
      observations,
    }));
    return Object.freeze({
      verification,
      observations: executorObservations(context, fixture, state),
      projections: Object.freeze([Object.freeze({
        artifactId: PARITY_ARTIFACT_ID,
        bytes,
        readerResult: Object.freeze({
          projectionFingerprint: state.projectionFingerprint,
        }),
        publicationBoundary: 'lifecycle',
        watermarkDigest: digest({
          ledgerId: PARITY_LEDGER_ID,
          eventCount: events.length,
          streamDigest,
        }),
        integrityDigest: sha256Bytes(bytes),
      })]),
    });
  };
}

/** Create distinct real-substrate legacy and typed-ledger path executors. */
export function createDeepResearchParityExecutors(
  fixture: DeepResearchParityFixture,
  fault?: DeepResearchParityFaultInjection,
): DeepResearchParityExecutorPair {
  verifyDeepResearchLifecycleEventMap();
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: DeepResearchPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: (): readonly DeepResearchPathEvidence[] => Object.freeze([...captured]),
    substrateImportsReal: true,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. MANIFEST, RECEIPT, AND MODE-GATE BOUNDARIES
// ───────────────────────────────────────────────────────────────────

function caseContractDigest(fixture: DeepResearchParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    lifecycleMap: EventStages,
    comparatorVersion: DEEP_RESEARCH_COMPARATOR_VERSION,
    projectionVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
  });
}

/** Compile the required ten-scenario mode fixture closure. */
export function compileDeepResearchParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly DeepResearchParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  if (input.fixtures.length !== DEEP_RESEARCH_REQUIRED_FIXTURE_SCENARIOS.length) {
    throw new TypeError('Deep Research parity requires the complete ten-scenario fixture set');
  }
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...DEEP_RESEARCH_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (
    new Set(scenarios).size !== expected.length
    || scenarios.some((scenario, index) => scenario !== expected[index])
  ) {
    throw new TypeError('Deep Research parity fixture scenarios must be exact and unique');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'deep-research',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  const cases: ParityCaseDefinition[] = input.fixtures.map((fixture) => ({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-research',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-research-bounded-shadow',
  }));
  return compileParityCaseManifest({
    baseSha: input.baseSha,
    baselineRows,
    cases,
  });
}

/** Create one case definition for targeted non-vacuity or failure-path tests. */
export function createDeepResearchParityCaseDefinition(
  fixture: DeepResearchParityFixture,
): ParityCaseDefinition {
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-research',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-research-bounded-shadow',
  });
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: DEEP_RESEARCH_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: DEEP_RESEARCH_VOLATILITY_ALLOWLIST,
    diffClasses: [
      'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision',
    ],
  });
}

function pathEvidence(
  executors: DeepResearchParityExecutorPair,
  path: 'ledger' | 'legacy',
): Readonly<{
  streamDigest: string;
  projectionFingerprint: string;
  observations: readonly DeepResearchParityEventObservation[];
  deterministic: boolean;
}> {
  const evidence = executors.evidence().filter((entry) => entry.path === path);
  if (evidence.length === 0) {
    return Object.freeze({
      streamDigest: digest({ missing: path }),
      projectionFingerprint: digest({ missingProjection: path }),
      observations: Object.freeze([]),
      deterministic: false,
    });
  }
  const first = evidence[0];
  return Object.freeze({
    streamDigest: first.streamDigest,
    projectionFingerprint: first.projectionFingerprint,
    observations: first.observations,
    deterministic: evidence.every((entry) => (
      entry.streamDigest === first.streamDigest
      && entry.projectionFingerprint === first.projectionFingerprint
    )),
  });
}

function certificateEvidenceBinding(
  fixture: DeepResearchParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepResearchParityExecutorPair,
): DeepResearchParityCertificateEvidenceBinding | null {
  if (!result.ok) return null;
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  return Object.freeze({
    fixtureId: fixture.fixtureId,
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    caseEvidenceDigest: result.evidenceDigest,
    referenceSetDigest: result.referenceSetDigest,
    attestationFinalDigests: Object.freeze(sortedUnique(result.runs.flatMap((run) => [
      run.legacy.finalDigest,
      run.dark.finalDigest,
    ]))),
  });
}

function sortedCertificateEvidenceBindings(
  bindings: readonly DeepResearchParityCertificateEvidenceBinding[],
): readonly DeepResearchParityCertificateEvidenceBinding[] {
  return Object.freeze([...bindings].sort((left, right) => (
    left.fixtureId.localeCompare(right.fixtureId)
  )));
}

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: DeepResearchParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepResearchParityExecutorPair,
  certificate: DeepResearchParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepResearchParityCertificateEvidenceBinding[],
  refusalCode: DeepResearchParityReceipt['certificateRefusalCode'],
): Omit<DeepResearchParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareDeepResearchEventStreams(
    fixture.fixtureId,
    legacy.observations,
    ledger.observations,
  );
  const certificateStatus = certificate === null ? 'refused' : 'issued';
  const isGreen = result.ok
    && diffs.length === 0
    && legacy.deterministic
    && ledger.deterministic
    && certificateStatus === 'issued';
  const reproducibilityDigest = digest({
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    fixtureId: fixture.fixtureId,
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    diffDispositions: diffs,
  });
  return Object.freeze({
    schemaVersion: DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `deep-research-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: `deep-research-event@${DEEP_RESEARCH_EVENT_VERSION}`,
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    comparatorVersion: DEEP_RESEARCH_COMPARATOR_VERSION,
    projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId: fixture.fixtureId,
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    exitStatus: isGreen ? 'green' : 'blocked',
    diffDispositions: Object.freeze([...diffs]),
    parityCertificate: certificate,
    certificateEvidenceBindings: sortedCertificateEvidenceBindings(evidenceBindings),
    parityCertificateDigest: certificate?.certificate_digest ?? null,
    certificateStatus,
    certificateRefusalCode: certificate === null ? refusalCode : null,
    genericDivergenceId: result.ok ? null : result.divergence.divergenceId,
    genericDivergenceClass: result.ok ? null : result.divergence.class,
    authorityState: 'legacy-authoritative',
    authorityMutation: false,
    cutoverCertificate: false,
    reproducibilityDigest,
  });
}

function issueReceipt(
  manifest: ParityCaseManifest,
  fixture: DeepResearchParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepResearchParityExecutorPair,
  certificate: DeepResearchParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepResearchParityCertificateEvidenceBinding[],
  refusalCode: DeepResearchParityReceipt['certificateRefusalCode'],
): DeepResearchParityReceipt {
  const body = receiptBody(
    manifest,
    fixture,
    result,
    executors,
    certificate,
    evidenceBindings,
    refusalCode,
  );
  return parseDeepResearchParityReceipt(Object.freeze({
    ...body,
    receiptDigest: digest(body),
  }), manifest);
}

function parseDiff(input: unknown, field: string): DeepResearchParityDiffRecord {
  if (!isRecord(input) || !hasExactKeys(input, [
    'diffId', 'fixtureId', 'class', 'eventIndex', 'expectedDigest', 'actualDigest',
    'disposition', 'owner', 'dispositionReason', 'trustedStateProof',
  ])) throw new TypeError(`${field} must use the closed parity-diff shape`);
  const classes: readonly DeepResearchParityDiffClass[] = [
    'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
    'projection', 'receipt', 'reordered', 'terminal-decision',
  ];
  if (!classes.includes(input.class as DeepResearchParityDiffClass)) {
    throw new TypeError(`${field}.class is not registered`);
  }
  if (input.disposition !== 'unexplained') {
    throw new TypeError(`${field}.disposition is not registered`);
  }
  requireDigest(input.diffId, `${field}.diffId`);
  requireToken(input.fixtureId, `${field}.fixtureId`);
  requireCount(input.eventIndex, `${field}.eventIndex`);
  if (input.expectedDigest !== null) requireDigest(input.expectedDigest, `${field}.expectedDigest`);
  if (input.actualDigest !== null) requireDigest(input.actualDigest, `${field}.actualDigest`);
  requireToken(input.owner, `${field}.owner`);
  requireReason(input.dispositionReason, `${field}.dispositionReason`);
  requireDigest(input.trustedStateProof, `${field}.trustedStateProof`);
  return Object.freeze(input as unknown as DeepResearchParityDiffRecord);
}

class DeepResearchParityCertificateVerificationError extends TypeError {
  public readonly refusalCode: DeepResearchParityReceipt['certificateRefusalCode'];

  public constructor(
    refusalCode: DeepResearchParityReceipt['certificateRefusalCode'],
    message: string,
  ) {
    super(message);
    this.name = 'DeepResearchParityCertificateVerificationError';
    this.refusalCode = refusalCode;
  }
}

function parseCertificateEvidenceBinding(
  input: unknown,
  field: string,
): DeepResearchParityCertificateEvidenceBinding {
  if (!isRecord(input) || !hasExactKeys(input, [
    'fixtureId', 'legacyStreamDigest', 'ledgerStreamDigest',
    'legacyProjectionFingerprint', 'ledgerProjectionFingerprint',
    'caseEvidenceDigest', 'referenceSetDigest', 'attestationFinalDigests',
  ])) throw new TypeError(`${field} must use the closed certificate-evidence shape`);
  requireToken(input.fixtureId, `${field}.fixtureId`);
  for (const digestField of [
    'legacyStreamDigest', 'ledgerStreamDigest', 'legacyProjectionFingerprint',
    'ledgerProjectionFingerprint', 'caseEvidenceDigest', 'referenceSetDigest',
  ] as const) requireDigest(input[digestField], `${field}.${digestField}`);
  if (!Array.isArray(input.attestationFinalDigests)) {
    throw new TypeError(`${field}.attestationFinalDigests must be an array`);
  }
  input.attestationFinalDigests.forEach(
    (entry, index) => requireDigest(entry, `${field}.attestationFinalDigests[${index}]`),
  );
  if (
    input.attestationFinalDigests.length === 0
    || digest(input.attestationFinalDigests)
      !== digest(sortedUnique(input.attestationFinalDigests as string[]))
  ) throw new TypeError(`${field}.attestationFinalDigests must be sorted and unique`);
  return Object.freeze({
    ...(input as unknown as DeepResearchParityCertificateEvidenceBinding),
    attestationFinalDigests: Object.freeze([...input.attestationFinalDigests] as string[]),
  });
}

function parseEmbeddedParityCertificate(
  input: unknown,
): NonNullable<DeepResearchParityReceipt['parityCertificate']> {
  if (!isRecord(input) || !hasExactKeys(input, [
    'schema_version', 'mode', 'base_sha', 'manifest_digest', 'case_ids',
    'case_evidence_digests', 'reference_set_digests', 'attestation_final_digests',
    'bindings', 'evidence_digest', 'open_divergence_count', 'authority_state',
    'authority_mutation', 'rollback_minimum_days',
    'rollback_minimum_successful_runs', 'certificate_digest',
  ])) throw new TypeError('parityCertificate must use the closed certificate shape');
  requireCount(input.schema_version, 'parityCertificate.schema_version');
  requireToken(input.mode, 'parityCertificate.mode');
  requireBaseSha(input.base_sha, 'parityCertificate.base_sha');
  requireDigest(input.manifest_digest, 'parityCertificate.manifest_digest');
  for (const arrayField of [
    'case_ids', 'case_evidence_digests', 'reference_set_digests',
    'attestation_final_digests',
  ] as const) {
    if (!Array.isArray(input[arrayField])) {
      throw new TypeError(`parityCertificate.${arrayField} must be an array`);
    }
  }
  const caseIds = input.case_ids as unknown[];
  const caseEvidenceDigests = input.case_evidence_digests as unknown[];
  const referenceSetDigests = input.reference_set_digests as unknown[];
  const attestationFinalDigests = input.attestation_final_digests as unknown[];
  caseIds.forEach(
    (entry, index) => requireToken(entry, `parityCertificate.case_ids[${index}]`),
  );
  for (const [arrayField, values] of [
    ['case_evidence_digests', caseEvidenceDigests],
    ['reference_set_digests', referenceSetDigests],
    ['attestation_final_digests', attestationFinalDigests],
  ] as const) {
    values.forEach((entry, index) => (
      requireDigest(entry, `parityCertificate.${arrayField}[${index}]`)
    ));
  }
  if (!isRecord(input.bindings) || !hasExactKeys(input.bindings, [
    'candidate_build_digest', 'harness_digest', 'comparator_digest',
    'replay_contract_digest', 'reducer_digest', 'projection_digest',
    'adapter_digest', 'policy_version',
  ])) throw new TypeError('parityCertificate.bindings must use the closed binding shape');
  for (const bindingField of [
    'candidate_build_digest', 'harness_digest', 'comparator_digest',
    'replay_contract_digest', 'reducer_digest', 'projection_digest', 'adapter_digest',
  ] as const) requireDigest(input.bindings[bindingField], `parityCertificate.bindings.${bindingField}`);
  requireToken(input.bindings.policy_version, 'parityCertificate.bindings.policy_version', true);
  requireDigest(input.evidence_digest, 'parityCertificate.evidence_digest');
  requireCount(input.open_divergence_count, 'parityCertificate.open_divergence_count');
  if (typeof input.authority_mutation !== 'boolean') {
    throw new TypeError('parityCertificate.authority_mutation must be boolean');
  }
  requireCount(input.rollback_minimum_days, 'parityCertificate.rollback_minimum_days');
  requireCount(
    input.rollback_minimum_successful_runs,
    'parityCertificate.rollback_minimum_successful_runs',
  );
  requireDigest(input.certificate_digest, 'parityCertificate.certificate_digest');
  return Object.freeze(input as unknown as NonNullable<
    DeepResearchParityReceipt['parityCertificate']
  >);
}

function requiredDeepResearchCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases
    .filter((entry) => entry.mode === 'deep-research')
    .map((entry) => entry.caseId)
    .sort((left, right) => left.localeCompare(right));
}

function verifyReceiptCertificate(
  receipt: DeepResearchParityReceipt,
  manifest: ParityCaseManifest,
): void {
  const evidenceBindings = receipt.certificateEvidenceBindings;
  const requiredIds = requiredDeepResearchCaseIds(manifest);
  const evidenceIds = evidenceBindings.map((entry) => entry.fixtureId);
  const caseEvidenceDigests = evidenceBindings.map((entry) => entry.caseEvidenceDigest);
  const referenceSetDigests = sortedUnique(
    evidenceBindings.map((entry) => entry.referenceSetDigest),
  );
  const attestationFinalDigests = sortedUnique(evidenceBindings.flatMap(
    (entry) => entry.attestationFinalDigests,
  ));
  const expectedBindings = certificateBindings(manifest, evidenceBindings);
  const verification = verifyParityCertificate(receipt.parityCertificate, {
    manifest,
    mode: 'deep-research',
    bindings: expectedBindings,
    caseEvidenceDigests,
    referenceSetDigests,
    attestationFinalDigests,
  });
  if (receipt.certificateStatus === 'refused') {
    if (verification.ok || evidenceBindings.length !== 0) {
      throw new DeepResearchParityCertificateVerificationError(
        'UNVERIFIABLE',
        'Refused parity receipt cannot carry verifiable certificate evidence',
      );
    }
    return;
  }
  if (!verification.ok) {
    throw new DeepResearchParityCertificateVerificationError(
      verification.refusal.code,
      `Parity receipt certificate verification failed: ${verification.refusal.message}`,
    );
  }
  if (
    receipt.baseSha !== manifest.baseSha
    || receipt.runManifestDigest !== manifest.manifestDigest
    || requiredIds.length === 0
    || digest(requiredIds) !== digest(evidenceIds)
  ) {
    throw new DeepResearchParityCertificateVerificationError(
      'STALE_EVIDENCE',
      'Parity receipt certificate evidence does not match the trusted manifest closure',
    );
  }
  const currentEvidence = evidenceBindings.find(
    (entry) => entry.fixtureId === receipt.fixtureId,
  );
  if (
    currentEvidence === undefined
    || currentEvidence.legacyStreamDigest !== receipt.legacyStreamDigest
    || currentEvidence.ledgerStreamDigest !== receipt.ledgerStreamDigest
    || currentEvidence.legacyProjectionFingerprint
      !== receipt.legacyProjectionFingerprint
    || currentEvidence.ledgerProjectionFingerprint
      !== receipt.ledgerProjectionFingerprint
    || receipt.parityCertificateDigest !== verification.certificateDigest
  ) {
    throw new DeepResearchParityCertificateVerificationError(
      'UNVERIFIABLE',
      'Parity receipt streams are not bound to its verified certificate evidence',
    );
  }
}

function assertReceiptEvidenceConsistency(
  receipt: DeepResearchParityReceipt,
  manifest: ParityCaseManifest,
): void {
  const hasGenericDivergence = receipt.genericDivergenceId !== null
    && receipt.genericDivergenceClass !== null;
  if (
    (receipt.genericDivergenceId === null)
    !== (receipt.genericDivergenceClass === null)
  ) {
    throw new TypeError('Parity receipt generic divergence evidence must be complete');
  }
  const certificateIssued = receipt.certificateStatus === 'issued'
    && receipt.parityCertificate !== null
    && receipt.certificateEvidenceBindings.length > 0
    && receipt.parityCertificateDigest !== null
    && receipt.certificateRefusalCode === null;
  const certificateRefused = receipt.certificateStatus === 'refused'
    && receipt.parityCertificate === null
    && receipt.certificateEvidenceBindings.length === 0
    && receipt.parityCertificateDigest === null
    && receipt.certificateRefusalCode !== null;
  if (!certificateIssued && !certificateRefused) {
    throw new TypeError('Parity receipt certificate evidence contradicts its status');
  }
  verifyReceiptCertificate(receipt, manifest);
  for (const diff of receipt.diffDispositions) {
    if (diff.fixtureId !== receipt.fixtureId) {
      throw new TypeError('Parity receipt diff evidence belongs to another fixture');
    }
    if (diff.expectedDigest === diff.actualDigest) {
      throw new TypeError('Parity receipt diff evidence must encode a real difference');
    }
    const trustedStateProof = digest({
      fixtureId: diff.fixtureId,
      class: diff.class,
      eventIndex: diff.eventIndex,
      expectedDigest: diff.expectedDigest,
      actualDigest: diff.actualDigest,
    });
    if (diff.trustedStateProof !== trustedStateProof) {
      throw new TypeError('Parity receipt diff proof does not bind its evidence');
    }
    const { diffId, ...diffBody } = diff;
    if (diffId !== digest(diffBody)) {
      throw new TypeError('Parity receipt diff identity does not bind its disposition');
    }
  }
  const expectedReproducibilityDigest = digest({
    baseSha: receipt.baseSha,
    runManifestDigest: receipt.runManifestDigest,
    fixtureId: receipt.fixtureId,
    legacyStreamDigest: receipt.legacyStreamDigest,
    ledgerStreamDigest: receipt.ledgerStreamDigest,
    legacyProjectionFingerprint: receipt.legacyProjectionFingerprint,
    ledgerProjectionFingerprint: receipt.ledgerProjectionFingerprint,
    diffDispositions: receipt.diffDispositions,
  });
  if (receipt.reproducibilityDigest !== expectedReproducibilityDigest) {
    throw new TypeError('Parity receipt reproducibility digest does not bind its evidence');
  }
  const projectionsMatch = receipt.legacyProjectionFingerprint
    === receipt.ledgerProjectionFingerprint;
  const streamsMatch = receipt.legacyStreamDigest === receipt.ledgerStreamDigest;
  const evidenceIsGreen = projectionsMatch
    && streamsMatch
    && receipt.diffDispositions.length === 0
    && certificateIssued
    && !hasGenericDivergence;
  if (
    (receipt.exitStatus === 'green' && !evidenceIsGreen)
    || (receipt.exitStatus === 'blocked' && evidenceIsGreen)
  ) {
    throw new TypeError('Parity receipt declared status contradicts its bound evidence');
  }
}

/** Parse a parity receipt and reject unknown keys or kind-invalid field values. */
export function parseDeepResearchParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): DeepResearchParityReceipt {
  const keys = [
    'schemaVersion', 'receiptId', 'baseSha', 'runManifestDigest',
    'eventSchemaVersion', 'reducerVersion', 'comparatorVersion', 'projectionVersion',
    'comparatorConfigDigest', 'fixtureId', 'legacyStreamDigest', 'ledgerStreamDigest',
    'legacyProjectionFingerprint', 'ledgerProjectionFingerprint', 'exitStatus',
    'diffDispositions', 'parityCertificate', 'certificateEvidenceBindings',
    'parityCertificateDigest', 'certificateStatus',
    'certificateRefusalCode', 'genericDivergenceId', 'genericDivergenceClass',
    'authorityState', 'authorityMutation', 'cutoverCertificate',
    'reproducibilityDigest', 'receiptDigest',
  ];
  if (!isRecord(input) || !hasExactKeys(input, keys)) {
    throw new TypeError('Parity receipt must use the closed allowed-key set');
  }
  requireToken(input.schemaVersion, 'schemaVersion', true);
  requireToken(input.receiptId, 'receiptId');
  requireBaseSha(input.baseSha, 'baseSha');
  requireDigest(input.runManifestDigest, 'runManifestDigest');
  requireToken(input.eventSchemaVersion, 'eventSchemaVersion', true);
  requireToken(input.reducerVersion, 'reducerVersion', true);
  requireToken(input.comparatorVersion, 'comparatorVersion', true);
  requireToken(input.projectionVersion, 'projectionVersion', true);
  requireDigest(input.comparatorConfigDigest, 'comparatorConfigDigest');
  requireToken(input.fixtureId, 'fixtureId');
  requireDigest(input.legacyStreamDigest, 'legacyStreamDigest');
  requireDigest(input.ledgerStreamDigest, 'ledgerStreamDigest');
  requireDigest(input.legacyProjectionFingerprint, 'legacyProjectionFingerprint');
  requireDigest(input.ledgerProjectionFingerprint, 'ledgerProjectionFingerprint');
  if (input.exitStatus !== 'green' && input.exitStatus !== 'blocked') {
    throw new TypeError('exitStatus must use the closed parity status set');
  }
  if (!Array.isArray(input.diffDispositions)) {
    throw new TypeError('diffDispositions must be an array');
  }
  const diffs = input.diffDispositions.map((entry, index) => parseDiff(
    entry,
    `diffDispositions[${index}]`,
  ));
  const certificate = input.parityCertificate === null
    ? null
    : parseEmbeddedParityCertificate(input.parityCertificate);
  if (!Array.isArray(input.certificateEvidenceBindings)) {
    throw new TypeError('certificateEvidenceBindings must be an array');
  }
  const evidenceBindings = input.certificateEvidenceBindings.map((entry, index) => (
    parseCertificateEvidenceBinding(entry, `certificateEvidenceBindings[${index}]`)
  ));
  if (input.parityCertificateDigest !== null) {
    requireDigest(input.parityCertificateDigest, 'parityCertificateDigest');
  }
  if (input.certificateStatus !== 'issued' && input.certificateStatus !== 'refused') {
    throw new TypeError('certificateStatus must be issued or refused');
  }
  const refusalCodes = [
    'ZERO_DISCOVERY', 'PARTIAL_CASE_SET', 'OPEN_DIVERGENCE', 'DUPLICATE_CONFLICT',
    'WRONG_MODE', 'STALE_EVIDENCE', 'UNVERIFIABLE',
  ];
  if (input.certificateRefusalCode !== null
    && !refusalCodes.includes(String(input.certificateRefusalCode))) {
    throw new TypeError('certificateRefusalCode is not registered');
  }
  if (input.genericDivergenceId !== null) {
    requireDigest(input.genericDivergenceId, 'genericDivergenceId');
  }
  const divergenceClasses = [
    'input-inequivalent', 'harness-invalid', 'replay-contract-drift',
    'execution-outcome', 'effective-event', 'projection-semantic', 'legacy-byte',
    'missing-observation', 'nondeterministic',
  ];
  if (input.genericDivergenceClass !== null
    && !divergenceClasses.includes(String(input.genericDivergenceClass))) {
    throw new TypeError('genericDivergenceClass is not registered');
  }
  if (
    input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.cutoverCertificate !== false
  ) throw new TypeError('Parity receipt cannot carry an authority mutation');
  requireDigest(input.reproducibilityDigest, 'reproducibilityDigest');
  requireDigest(input.receiptDigest, 'receiptDigest');
  const {
    receiptDigest,
    diffDispositions: ignoredDiffs,
    parityCertificate: ignoredCertificate,
    certificateEvidenceBindings: ignoredEvidenceBindings,
    ...body
  } = input;
  const canonicalBody = {
    ...body,
    diffDispositions: diffs,
    parityCertificate: certificate,
    certificateEvidenceBindings: evidenceBindings,
  };
  void ignoredDiffs;
  void ignoredCertificate;
  void ignoredEvidenceBindings;
  if (digest(canonicalBody) !== receiptDigest) {
    throw new TypeError('Parity receipt digest does not commit the closed receipt body');
  }
  const receipt = Object.freeze({
    ...(input as unknown as DeepResearchParityReceipt),
    diffDispositions: Object.freeze(diffs),
    parityCertificate: certificate,
    certificateEvidenceBindings: Object.freeze(evidenceBindings),
  });
  assertReceiptEvidenceConsistency(receipt, manifest);
  return receipt;
}

function modeGateBody(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): Omit<DeepResearchModeGateInput, 'gateInputDigest'> {
  const expectedFixtureIds = sortedUnique(input.expectedFixtureIds);
  const requiredFixtureIds = requiredDeepResearchCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  let certificateUnverifiable = false;
  const parsed: DeepResearchParityReceipt[] = [];
  for (const receipt of input.receipts) {
    try {
      const parsedReceipt = parseDeepResearchParityReceipt(receipt, input.manifest);
      verifyReceiptCertificate(parsedReceipt, input.manifest);
      parsed.push(parsedReceipt);
    } catch (error: unknown) {
      if (
        error instanceof DeepResearchParityCertificateVerificationError
        && error.refusalCode === 'STALE_EVIDENCE'
      ) stale = true;
      else if (error instanceof DeepResearchParityCertificateVerificationError) {
        certificateUnverifiable = true;
      } else malformed = true;
    }
  }
  const byFixture = new Map(parsed.map((receipt) => [receipt.fixtureId, receipt]));
  const allReceiptsPresent = expectedFixtureIds.length > 0
    && digest(expectedFixtureIds) === digest(requiredFixtureIds)
    && parsed.length === expectedFixtureIds.length
    && byFixture.size === expectedFixtureIds.length
    && expectedFixtureIds.every((fixtureId) => byFixture.has(fixtureId));
  stale = stale || parsed.some((receipt) => (
    receipt.baseSha !== input.manifest.baseSha
    || receipt.runManifestDigest !== input.manifest.manifestDigest
    || receipt.comparatorConfigDigest !== comparatorConfigDigest()
  ));
  const nondeterministic = parsed.some(
    (receipt) => receipt.genericDivergenceClass === 'nondeterministic',
  );
  const unexplained = parsed.some((receipt) => (
    receipt.diffDispositions.some((entry) => entry.disposition === 'unexplained')
  ));
  const fixtureFailure = parsed.some((receipt) => receipt.exitStatus !== 'green');
  let blockingReasonCode: DeepResearchModeGateBlockReasonCode | null = null;
  if (expectedFixtureIds.length === 0) blockingReasonCode = 'ZERO_FIXTURES';
  else if (malformed) blockingReasonCode = 'RECEIPT_MALFORMED';
  else if (stale) blockingReasonCode = 'RECEIPT_STALE';
  else if (certificateUnverifiable) blockingReasonCode = 'CERTIFICATE_UNVERIFIABLE';
  else if (!allReceiptsPresent) blockingReasonCode = 'MISSING_RECEIPT';
  else if (nondeterministic) blockingReasonCode = 'NONDETERMINISTIC_REPLAY';
  else if (unexplained) blockingReasonCode = 'DIFF_UNEXPLAINED';
  else if (fixtureFailure) blockingReasonCode = 'FIXTURE_FAILURE';
  const isPass = blockingReasonCode === null;
  return Object.freeze({
    schemaVersion: DEEP_RESEARCH_MODE_GATE_INPUT_VERSION,
    mode: 'deep-research',
    baseSha: input.manifest.baseSha,
    manifestDigest: input.manifest.manifestDigest,
    fixtureIds: Object.freeze(expectedFixtureIds),
    parityReceiptDigests: Object.freeze(parsed.map(
      (receipt) => receipt.receiptDigest,
    ).sort()),
    exitStatus: isPass ? 'pass' : 'blocked',
    zeroUnexplainedDiffs: !unexplained,
    allReceiptsPresent,
    deterministicReplay: !nondeterministic,
    authorityState: 'legacy-authoritative',
    authorityMutation: false,
    rollbackReadinessAuthorized: false,
    cutoverAuthorized: false,
    blockingReasonCode,
  });
}

/** Emit the exact fail-closed handoff consumed by the successor mode gate. */
export function createDeepResearchModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): DeepResearchModeGateInput {
  const body = modeGateBody(input);
  return parseDeepResearchModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse the successor handoff and reject every unknown or authority-bearing key. */
export function parseDeepResearchModeGateInput(input: unknown): DeepResearchModeGateInput {
  const keys = [
    'schemaVersion', 'mode', 'baseSha', 'manifestDigest', 'fixtureIds',
    'parityReceiptDigests', 'exitStatus', 'zeroUnexplainedDiffs',
    'allReceiptsPresent', 'deterministicReplay', 'authorityState',
    'authorityMutation', 'rollbackReadinessAuthorized', 'cutoverAuthorized',
    'blockingReasonCode', 'gateInputDigest',
  ];
  if (!isRecord(input) || !hasExactKeys(input, keys)) {
    throw new TypeError('Mode-gate input must use the closed allowed-key set');
  }
  requireToken(input.schemaVersion, 'schemaVersion', true);
  if (input.mode !== 'deep-research') throw new TypeError('mode must be deep-research');
  requireBaseSha(input.baseSha, 'baseSha');
  requireDigest(input.manifestDigest, 'manifestDigest');
  if (!Array.isArray(input.fixtureIds) || !Array.isArray(input.parityReceiptDigests)) {
    throw new TypeError('Mode-gate fixture and receipt identities must be arrays');
  }
  input.fixtureIds.forEach((entry, index) => requireToken(entry, `fixtureIds[${index}]`));
  input.parityReceiptDigests.forEach(
    (entry, index) => requireDigest(entry, `parityReceiptDigests[${index}]`),
  );
  if (input.exitStatus !== 'pass' && input.exitStatus !== 'blocked') {
    throw new TypeError('Mode-gate exitStatus must be pass or blocked');
  }
  for (const field of [
    'zeroUnexplainedDiffs', 'allReceiptsPresent', 'deterministicReplay',
  ] as const) {
    if (typeof input[field] !== 'boolean') throw new TypeError(`${field} must be boolean`);
  }
  if (
    input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.rollbackReadinessAuthorized !== false
    || input.cutoverAuthorized !== false
  ) throw new TypeError('Mode-gate input cannot authorize authority or cutover');
  const reasonCodes: readonly DeepResearchModeGateBlockReasonCode[] = [
    'CERTIFICATE_UNVERIFIABLE', 'DIFF_UNEXPLAINED', 'FIXTURE_FAILURE', 'MISSING_RECEIPT',
    'NONDETERMINISTIC_REPLAY', 'RECEIPT_MALFORMED', 'RECEIPT_STALE',
    'ZERO_FIXTURES',
  ];
  if (input.blockingReasonCode !== null
    && !reasonCodes.includes(input.blockingReasonCode as DeepResearchModeGateBlockReasonCode)) {
    throw new TypeError('blockingReasonCode is not registered');
  }
  requireDigest(input.gateInputDigest, 'gateInputDigest');
  const { gateInputDigest, ...body } = input;
  if (digest(body) !== gateInputDigest) {
    throw new TypeError('Mode-gate input digest does not commit its closed body');
  }
  if (
    input.exitStatus === 'pass'
    && (
      input.blockingReasonCode !== null
      || input.zeroUnexplainedDiffs !== true
      || input.allReceiptsPresent !== true
      || input.deterministicReplay !== true
    )
  ) throw new TypeError('Passing mode-gate input contains blocking evidence');
  return Object.freeze(input as unknown as DeepResearchModeGateInput);
}

function certificateBindings(
  manifest: ParityCaseManifest,
  evidenceBindings: readonly DeepResearchParityCertificateEvidenceBinding[],
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifestDigest: manifest.manifestDigest,
      schemaVersion: DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
    }),
    harness_digest: digest({
      legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-research-reducers',
      shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-research-resume-adapter',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: DEEP_RESEARCH_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ reducerVersion: DEEP_RESEARCH_REDUCER_VERSION }),
    projection_digest: digest({
      projectionVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    }),
    adapter_digest: digest({
      adapterVersion: DEEP_RESEARCH_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: EventStages,
      certificateEvidenceBindings: sortedCertificateEvidenceBindings(evidenceBindings),
    }),
    policy_version: 'deep-research-shadow-only@1',
  });
}

async function runCase(
  caseRun: DeepResearchParityCaseRun,
): Promise<ShadowParityCaseResult> {
  validateParityFixtureShape(caseRun.fixture);
  if (caseRun.caseDefinition.caseId !== caseRun.fixture.fixtureId) {
    throw new TypeError('Case definition and fixture identity must match');
  }
  return runShadowParityCase({
    caseDefinition: caseRun.caseDefinition,
    shadowRootDirectory: caseRun.shadowRootDirectory,
    protectedRoots: caseRun.protectedRoots,
    legacy: caseRun.legacyBoundary,
    dark: caseRun.ledgerBoundary,
    executeLegacy: caseRun.executors.legacy,
    executeDark: caseRun.executors.ledger,
    deterministicRuns: caseRun.deterministicRuns,
  });
}

/** Run one closed case and issue a receipt through the generic certificate boundary. */
export async function runDeepResearchParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: DeepResearchParityCaseRun;
}>): Promise<DeepResearchParityCaseOutcome> {
  const result = await runCase(input.caseRun);
  const evidenceBinding = certificateEvidenceBinding(
    input.caseRun.fixture,
    result,
    input.caseRun.executors,
  );
  const evidenceBindings = evidenceBinding === null
    ? Object.freeze([])
    : sortedCertificateEvidenceBindings([evidenceBinding]);
  const bindings = certificateBindings(input.manifest, evidenceBindings);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'deep-research',
    caseResults: [result],
    bindings,
  });
  if (issuance.ok) {
    const verification = verifyParityCertificate(issuance.certificate, {
      manifest: input.manifest,
      mode: 'deep-research',
      bindings,
      caseEvidenceDigests: evidenceBindings.map((entry) => entry.caseEvidenceDigest),
      referenceSetDigests: sortedUnique(
        evidenceBindings.map((entry) => entry.referenceSetDigest),
      ),
      attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
        (entry) => entry.attestationFinalDigests,
      )),
    });
    if (!verification.ok) throw new TypeError('Issued parity certificate did not verify');
  }
  return Object.freeze({
    result,
    receipt: issueReceipt(
      input.manifest,
      input.caseRun.fixture,
      result,
      input.caseRun.executors,
      issuance.ok ? issuance.certificate : null,
      issuance.ok ? evidenceBindings : Object.freeze([]),
      issuance.ok ? null : issuance.refusal.code,
    ),
  });
}

/** Run the full mode closure and emit receipts plus the non-authoritative gate input. */
export async function runDeepResearchParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly DeepResearchParityCaseRun[];
}>): Promise<DeepResearchParitySuiteResult> {
  const manifestIds = input.manifest.cases
    .filter((entry) => entry.mode === 'deep-research')
    .map((entry) => entry.caseId)
    .sort();
  const runIds = input.cases.map((entry) => entry.caseDefinition.caseId).sort();
  if (
    manifestIds.length === 0
    || manifestIds.length !== runIds.length
    || manifestIds.some((entry, index) => entry !== runIds[index])
  ) throw new TypeError('Parity suite cases must equal the manifest mode closure');

  const caseResults: ShadowParityCaseResult[] = [];
  for (const caseRun of input.cases) caseResults.push(await runCase(caseRun));
  const evidenceBindings = sortedCertificateEvidenceBindings(input.cases.flatMap(
    (caseRun, index) => {
      const binding = certificateEvidenceBinding(
        caseRun.fixture,
        caseResults[index],
        caseRun.executors,
      );
      return binding === null ? [] : [binding];
    },
  ));
  const bindings = certificateBindings(input.manifest, evidenceBindings);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'deep-research',
    caseResults,
    bindings,
  });
  const certificate = issuance.ok ? issuance.certificate : null;
  if (certificate !== null) {
    const verification = verifyParityCertificate(certificate, {
      manifest: input.manifest,
      mode: 'deep-research',
      bindings,
      caseEvidenceDigests: evidenceBindings.map((entry) => entry.caseEvidenceDigest),
      referenceSetDigests: sortedUnique(
        evidenceBindings.map((entry) => entry.referenceSetDigest),
      ),
      attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
        (entry) => entry.attestationFinalDigests,
      )),
    });
    if (!verification.ok) throw new TypeError('Mode parity certificate did not verify');
  }
  const refusalCode = issuance.ok ? null : issuance.refusal.code;
  const receipts = input.cases.map((caseRun, index) => issueReceipt(
    input.manifest,
    caseRun.fixture,
    caseResults[index],
    caseRun.executors,
    certificate,
    certificate === null ? Object.freeze([]) : evidenceBindings,
    refusalCode,
  ));
  const modeGateInput = createDeepResearchModeGateInput({
    manifest: input.manifest,
    expectedFixtureIds: manifestIds,
    receipts,
  });
  const divergence = caseResults.find((result) => !result.ok);
  return Object.freeze({
    manifest: input.manifest,
    caseResults: Object.freeze(caseResults),
    receipts: Object.freeze(receipts),
    certificate,
    divergence: divergence && !divergence.ok ? divergence.divergence : null,
    modeGateInput,
  });
}
