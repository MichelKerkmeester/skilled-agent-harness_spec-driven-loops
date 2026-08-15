// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Shadow Parity Harness Adapter
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
import { appendAuthorizedThroughFence } from '../locks-and-fencing/index.js';
import {
  DEEP_AI_COUNCIL_EVENT_VERSION,
  DeepAiCouncilEventStems,
  DeepAiCouncilWireEventTypes,
  createDeepAiCouncilLedgerPayload,
  deepAiCouncilEventDefinitions,
} from '../deep-ai-council-ledger-schema/index.js';
import {
  DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_REDUCER_VERSION,
  deepAiCouncilProjectionIntegrityDigest,
  foldDeepAiCouncilEvents,
} from '../deep-ai-council-reducers/index.js';
import {
  verifyDeepAiCouncilCertificateOffline,
} from '../deep-ai-council-certificates/index.js';
import {
  DeepAiCouncilArtifactKinds,
} from '../deep-ai-council-sealed-artifacts/index.js';
import {
  DeepAiCouncilResumeAdapter,
  parseDeepAiCouncilResumeDecision,
  parseDeepAiCouncilResumeRequest,
} from '../deep-ai-council-resume-adapter/index.js';
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
  DeepAiCouncilResumeDecision,
  DeepAiCouncilResumeRequest,
} from '../deep-ai-council-resume-adapter/index.js';
import type {
  DeepAiCouncilOfflineVerificationInput,
  DeepAiCouncilOfflineVerificationSuccess,
} from '../deep-ai-council-certificates/index.js';
import type {
  AuthoritySnapshot,
  GatewayAllowProof,
  LedgerHead,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepAiCouncilEventEnvelope,
  DeepAiCouncilEventStem,
  DeepAiCouncilLedgerEvent,
} from '../deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilProjectionState,
  DeepAiCouncilSeenEvent,
} from '../deep-ai-council-reducers/index.js';
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
  DeepAiCouncilFrozenParityInput,
  DeepAiCouncilLifecycleEventMapping,
  DeepAiCouncilLegacyResumeOracle,
  DeepAiCouncilLegacyResumeSnapshot,
  DeepAiCouncilModeGateBlockReasonCode,
  DeepAiCouncilModeGateInput,
  DeepAiCouncilParityCaseOutcome,
  DeepAiCouncilParityCaseRun,
  DeepAiCouncilParityCertificateEvidenceBinding,
  DeepAiCouncilParityDiffClass,
  DeepAiCouncilParityDiffRecord,
  DeepAiCouncilParityEventObservation,
  DeepAiCouncilParityExecutorPair,
  DeepAiCouncilParityFaultInjection,
  DeepAiCouncilParityFixture,
  DeepAiCouncilParityFixtureScenario,
  DeepAiCouncilParityProjection,
  DeepAiCouncilParityReceipt,
  DeepAiCouncilParityReplayState,
  DeepAiCouncilParitySuiteResult,
  DeepAiCouncilPathEvidence,
  DeepAiCouncilProjectionArtifact,
  DeepAiCouncilProjectionBranch,
  DeepAiCouncilProjectionClaim,
  DeepAiCouncilProjectionEvidence,
  DeepAiCouncilProjectionSource,
  DeepAiCouncilProjectionSupersession,
  DeepAiCouncilResumeParityEvidence,
  DeepAiCouncilTerminalDecision,
  DeepAiCouncilVolatilityAllowance,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION =
  'deep-ai-council-shadow-parity@1' as const;
export const DEEP_AI_COUNCIL_COMPARATOR_VERSION =
  'deep-ai-council-event-comparator@1' as const;
export const DEEP_AI_COUNCIL_MODE_GATE_INPUT_VERSION =
  'deep-ai-council-mode-gate-input@1' as const;
export const DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION =
  'deep-ai-council-parity-projection@1' as const;

const PARITY_REDUCER_ID = 'deep-ai-council:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'deep-ai-council-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'deep-ai-council-parity-projection';
const PARITY_LEDGER_ID = 'deep-ai-council-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'deep-ai-council-shadow-parity-audit';
const PARITY_POLICY_ID = 'deep-ai-council-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'deep-ai-council-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-22T00:00:00.000Z';
const MAX_REPLAY_ATTESTATION_RANGE_EVENTS = 6;
const MAX_REASON_LENGTH = 320;
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,127}$/;
const VERSION_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,127}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const RESUME_LEASE_CONTINUITY_ERROR_CODE =
  'DEEP_AI_COUNCIL_RESUME_LEASE_CONTINUITY' as const;
const RESUME_LEASE_CONTINUITY_FIELDS = Object.freeze([
  'leaseId',
  'runId',
  'roundId',
  'generation',
  'deadlineAt',
] as const);

export const DEEP_AI_COUNCIL_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'normal-completion',
  'multi-round-deliberation',
  'seat-timeout',
  'seat-error',
  'unresolved-contradiction',
  'max-round-non-convergence',
  'partial-artifact-persistence',
  'rollback',
  'resume-boundaries',
  'blinded-adjudication',
] as const satisfies readonly DeepAiCouncilParityFixtureScenario[]);

export const DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST = Object.freeze([
  Object.freeze({
    field: 'occurred_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-ai-council-shadow-parity',
    volatilityReason: 'Wall-clock emission time cannot alter semantic identity or trusted state.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'recorded_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-ai-council-shadow-parity',
    volatilityReason: 'Transport persistence time is outside the mode transition identity.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'correlation_id',
    valueKind: 'transport-token',
    owner: 'deep-ai-council-shadow-parity',
    volatilityReason: 'Opaque transport correlation cannot carry a mode or projection identity.',
    semanticIdentity: false,
  }),
] as const satisfies readonly DeepAiCouncilVolatilityAllowance[]);

const EventStages: Readonly<Record<DeepAiCouncilEventStem, DeepAiCouncilLifecycleEventMapping>> =
  Object.freeze({
    'ai_council.run_initialized': mapping('ai_council.run_initialized', 'init', 'run-init'),
    'ai_council.run_resumed': mapping('ai_council.run_resumed', 'resume', 'run-resume'),
    'ai_council.run_restarted': mapping('ai_council.run_restarted', 'resume', 'run-restart'),
    'ai_council.round_started': mapping('ai_council.round_started', 'deliberation', 'round-start'),
    'ai_council.seat_selected': mapping('ai_council.seat_selected', 'deliberation', 'seat-select'),
    'ai_council.seat_dispatched': mapping('ai_council.seat_dispatched', 'deliberation', 'seat-dispatch'),
    'ai_council.proposal_observed': mapping('ai_council.proposal_observed', 'deliberation', 'proposal-observe'),
    'ai_council.seat_returned': mapping('ai_council.seat_returned', 'deliberation', 'seat-return'),
    'ai_council.critique_round_started': mapping('ai_council.critique_round_started', 'critique', 'critique-start'),
    'ai_council.critique_recorded': mapping('ai_council.critique_recorded', 'critique', 'critique-record'),
    'ai_council.candidate_blinded': mapping('ai_council.candidate_blinded', 'adjudication', 'candidate-blind'),
    'ai_council.pairwise_judgment_recorded': mapping('ai_council.pairwise_judgment_recorded', 'adjudication', 'pairwise-judge'),
    'ai_council.bias_audit_recorded': mapping('ai_council.bias_audit_recorded', 'adjudication', 'bias-audit'),
    'ai_council.adjudication_decision': mapping('ai_council.adjudication_decision', 'adjudication', 'adjudication-decide'),
    'ai_council.stance_recorded': mapping('ai_council.stance_recorded', 'deliberation', 'stance-record'),
    'ai_council.stance_flipped': mapping('ai_council.stance_flipped', 'deliberation', 'stance-flip'),
    'ai_council.deliberation_synthesized': mapping('ai_council.deliberation_synthesized', 'synthesis', 'deliberation-synthesize'),
    'ai_council.convergence_evaluated': mapping('ai_council.convergence_evaluated', 'convergence', 'convergence-evaluate'),
    'ai_council.convergence_blocked': mapping('ai_council.convergence_blocked', 'convergence', 'convergence-block'),
    'ai_council.round_ended': mapping('ai_council.round_ended', 'deliberation', 'round-end'),
    'ai_council.artifact_committed': mapping('ai_council.artifact_committed', 'artifacts', 'artifact-commit'),
    'ai_council.artifact_superseded': mapping('ai_council.artifact_superseded', 'artifacts', 'artifact-supersede'),
    'ai_council.council_test_gate_evaluated': mapping('ai_council.council_test_gate_evaluated', 'test-gate', 'test-gate-evaluate'),
    'ai_council.rollback_recorded': mapping('ai_council.rollback_recorded', 'rollback', 'rollback-record'),
    'ai_council.council_complete': mapping('ai_council.council_complete', 'terminal', 'council-complete'),
  });

export const DEEP_AI_COUNCIL_LIFECYCLE_EVENT_MAP = EventStages;

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
  stem: DeepAiCouncilEventStem,
  lifecycleStage: DeepAiCouncilLifecycleEventMapping['lifecycleStage'],
  stepKey: string,
): DeepAiCouncilLifecycleEventMapping {
  return Object.freeze({
    wireEventType: DeepAiCouncilWireEventTypes[stem],
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

function validateParityFixtureShape(fixture: DeepAiCouncilParityFixture): void {
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

function validateVolatilityBoundary(event: DeepAiCouncilLedgerEvent): void {
  requireTimestamp(event.occurred_at, 'occurred_at');
  requireTimestamp(event.recorded_at, 'recorded_at');
  if (!TRANSPORT_TOKEN_PATTERN.test(event.correlation_id)) {
    throw new TypeError('correlation_id must use the closed transport-only token grammar');
  }
}

function asMutableArray<T>(values: readonly T[]): T[] {
  return [...values];
}

function terminalDecisionForEvent(
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilTerminalDecision | null {
  if (event.payload.stem === 'ai_council.council_complete') {
    const terminal = event.payload.data.terminalStatus;
    return terminal === 'completed' ? 'completed' : terminal;
  }
  if (
    event.payload.stem === 'ai_council.convergence_evaluated'
    || event.payload.stem === 'ai_council.convergence_blocked'
  ) {
    const decision = event.payload.data.decision;
    return decision === 'continue' ? 'active' : decision;
  }
  if (event.payload.stem === 'ai_council.rollback_recorded') {
    return 'blocked';
  }
  if (
    event.payload.stem === 'ai_council.council_test_gate_evaluated'
    && event.payload.data.verdict !== 'pass'
  ) {
    return 'blocked';
  }
  return null;
}

function receiptRefs(event: DeepAiCouncilLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'ai_council.run_resumed':
    case 'ai_council.run_restarted':
      return [event.payload.data.recoveryReceiptRef];
    case 'ai_council.seat_dispatched':
      return [event.payload.data.dispatchReceiptRef];
    case 'ai_council.proposal_observed':
    case 'ai_council.seat_returned':
      return [event.payload.data.usage.receiptRef];
    case 'ai_council.deliberation_synthesized':
      return [event.payload.data.synthesisReceiptRef];
    case 'ai_council.adjudication_decision':
      return [event.payload.data.evaluatorReceiptRef];
    case 'ai_council.council_test_gate_evaluated':
      return [event.payload.data.gateReceiptRef];
    case 'ai_council.rollback_recorded':
      return [event.payload.data.authorizationRef, event.payload.data.recoveryReceiptRef];
    default:
      return [];
  }
}

function artifactRefs(event: DeepAiCouncilLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'ai_council.proposal_observed':
    case 'ai_council.seat_returned':
    case 'ai_council.candidate_blinded':
      return [event.payload.data.artifactRef];
    case 'ai_council.critique_recorded':
      return [event.payload.data.critiqueArtifactRef];
    case 'ai_council.deliberation_synthesized':
      return [event.payload.data.reportDraftRef];
    case 'ai_council.artifact_committed':
      return [event.payload.scope.artifactId];
    case 'ai_council.artifact_superseded':
      return [event.payload.data.priorArtifactId, event.payload.data.successorArtifactId];
    case 'ai_council.rollback_recorded':
      return sortedUnique(event.payload.data.supersededArtifactRefs);
    default:
      return [];
  }
}

function logicalBranchId(event: DeepAiCouncilLedgerEvent): string | null {
  const { runId: ignoredRun, roundId: ignoredRound, ...identity } = event.payload.scope;
  void ignoredRun;
  void ignoredRound;
  return Object.keys(identity).length === 0 ? null : digest(identity);
}

function canonicalObservation(
  event: DeepAiCouncilLedgerEvent,
  projectionFingerprint: string,
  causalIdentityByEventId: ReadonlyMap<string, string>,
): DeepAiCouncilParityEventObservation {
  validateVolatilityBoundary(event);
  const mappingEntry = EventStages[event.payload.stem];
  return Object.freeze({
    eventId: event.event_id,
    eventType: event.event_type,
    logicalRunId: event.payload.scope.runId,
    logicalBranchId: logicalBranchId(event),
    stepKey: mappingEntry.stepKey,
    producerSequence: event.stream_sequence,
    causalEventIds: Object.freeze(event.causation_id === null
      ? []
      : [causalIdentityByEventId.get(event.causation_id) ?? `unresolved:${event.causation_id}`]),
    stablePayloadDigest: event.payload.payloadDigest,
    projectionFingerprint,
    receiptRefs: Object.freeze(receiptRefs(event)),
    artifactRefs: Object.freeze(artifactRefs(event)),
    terminalDecision: terminalDecisionForEvent(event),
  });
}

/** Canonicalize a verified mode stream while rejecting semantic data in volatile slots. */
export function canonicalizeDeepAiCouncilEventStream(
  events: readonly DeepAiCouncilLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly DeepAiCouncilParityEventObservation[] {
  if (events.length !== projectionFingerprints.length) {
    throw new TypeError('Every event requires one resulting projection fingerprint');
  }
  const causalIdentityByEventId = new Map(events.map((event) => [
    event.event_id,
    digest({
      eventType: event.event_type,
      logicalRunId: event.payload.scope.runId,
      logicalBranchId: logicalBranchId(event),
      stepKey: EventStages[event.payload.stem].stepKey,
      producerSequence: event.stream_sequence,
    }),
  ]));
  return Object.freeze(events.map((event, index) => canonicalObservation(
    event,
    requireDigest(projectionFingerprints[index], `projectionFingerprints[${index}]`),
    causalIdentityByEventId,
  )));
}

/** Prove the lifecycle map is an exact closure over the typed event namespace. */
export function verifyDeepAiCouncilLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...DeepAiCouncilEventStems].sort();
  if (mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Deep AI Council lifecycle mapping must close every typed event stem');
  }
  for (const stem of DeepAiCouncilEventStems) {
    const entry = EventStages[stem];
    requireToken(entry.stepKey, `${stem}.stepKey`);
    if (entry.wireEventType !== DeepAiCouncilWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

/** Re-run the mode certificate's shipped offline verifier before accepting its evidence. */
export async function verifyDeepAiCouncilParityModeCertificate<
  TState extends JsonObject,
>(
  input: DeepAiCouncilOfflineVerificationInput<TState>,
): Promise<DeepAiCouncilOfflineVerificationSuccess> {
  const result = await verifyDeepAiCouncilCertificateOffline(input);
  if (result.verdict !== 'valid') {
    throw new TypeError(`Council certificate did not verify: ${result.code}`);
  }
  return result;
}

// ───────────────────────────────────────────────────────────────────
// 3. INDEPENDENT LEGACY AND LEDGER PROJECTIONS
// ───────────────────────────────────────────────────────────────────

function projectionArtifactFromEvent(
  event: DeepAiCouncilLedgerEvent,
): DeepAiCouncilProjectionArtifact | null {
  switch (event.payload.stem) {
    case 'ai_council.proposal_observed':
    case 'ai_council.seat_returned':
      return {
        artifactKind: 'proposal',
        digest: event.payload.data.artifactDigest,
        validityState: event.payload.data.responseStatus === 'returned' ? 'valid' : 'unknown',
        receiptRefs: [event.payload.data.usage.receiptRef],
      };
    case 'ai_council.critique_recorded':
      return {
        artifactKind: 'critique',
        digest: event.payload.data.critiqueArtifactDigest,
        validityState: 'valid',
        receiptRefs: [],
      };
    case 'ai_council.candidate_blinded':
      return {
        artifactKind: 'candidate',
        digest: event.payload.data.artifactDigest,
        validityState: 'valid',
        receiptRefs: [],
      };
    case 'ai_council.deliberation_synthesized':
      return {
        artifactKind: 'synthesis',
        digest: event.payload.data.selectedPlanDigest,
        validityState: event.payload.data.planDisposition === 'selected' ? 'valid' : 'unknown',
        receiptRefs: [event.payload.data.synthesisReceiptRef],
      };
    case 'ai_council.artifact_committed':
      return {
        artifactKind: event.payload.data.artifactKind,
        digest: event.payload.data.contentDigest,
        validityState: 'valid',
        receiptRefs: [],
      };
    case 'ai_council.artifact_superseded':
      return {
        artifactKind: event.payload.data.artifactKind,
        digest: event.payload.data.contentDigest,
        validityState: 'valid',
        receiptRefs: [],
      };
    default:
      return null;
  }
}

function latestSynthesis(events: readonly DeepAiCouncilLedgerEvent[]): Readonly<{
  inputDigest: string | null;
  reportDigest: string | null;
}> {
  let inputDigest: string | null = null;
  let reportDigest: string | null = null;
  for (const event of events) {
    if (event.payload.stem === 'ai_council.deliberation_synthesized') {
      inputDigest = digest(event.payload.data.inputEventRange);
      reportDigest = event.payload.data.selectedPlanDigest;
    }
  }
  return Object.freeze({ inputDigest, reportDigest });
}

function latestMemorySave(events: readonly DeepAiCouncilLedgerEvent[]): Readonly<{
  state: 'completed' | 'none';
  digest: string | null;
}> {
  const artifact = [...events].reverse().find(
    (event) => event.payload.stem === 'ai_council.artifact_committed',
  );
  return Object.freeze({
    state: artifact === undefined ? 'none' : 'completed',
    digest: artifact?.payload.stem === 'ai_council.artifact_committed'
      ? artifact.payload.data.contentDigest
      : null,
  });
}

function resumeDecisionDigest(
  evidence: DeepAiCouncilResumeParityEvidence | null,
  path: 'ledger' | 'legacy',
): string | null {
  if (evidence === null) return null;
  const decision = parseDeepAiCouncilResumeDecision(
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

function resumeDecisionSemanticView(decision: DeepAiCouncilResumeDecision): JsonValue {
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
      logicalBranchId: entry.logicalBranchId,
      seatId: entry.seatId,
      roundId: entry.roundId,
      retryKey: entry.retryKey,
      disposition: entry.disposition,
      evidenceEventIds: sortedUnique(entry.evidenceEventIds),
    })).sort((left, right) => left.logicalBranchId.localeCompare(right.logicalBranchId)),
    effects: [...decision.effects].map((entry) => ({
      effectId: entry.effectId,
      logicalEffectId: entry.logicalEffectId,
      disposition: entry.disposition,
      attemptRefs: sortedUnique(entry.attemptRefs),
      nextAttemptId: entry.nextAttemptId,
    })).sort((left, right) => left.effectId.localeCompare(right.effectId)),
    invalidation: decision.invalidation,
    lease: decision.lease,
    receiptDigests: sortedUnique(decision.receiptDigests),
    verifiedArtifactDigests: sortedUnique(decision.verifiedArtifactDigests),
  } as unknown as JsonValue;
}

function legacyResumeProjectionSemanticView(
  projection: DeepAiCouncilParityProjection,
): JsonValue {
  return {
    runId: projection.runId,
    roundId: projection.roundId,
    generation: projection.generation,
    roundIds: sortedUnique(projection.roundIds),
    seatIds: sortedUnique(projection.seatIds),
    proposalIds: sortedUnique(projection.proposalIds),
    critiqueRoundIds: sortedUnique(projection.critiqueRoundIds),
    candidateIds: sortedUnique(projection.candidateIds),
    judgmentIds: sortedUnique(projection.judgmentIds),
    minorityRefs: sortedUnique(projection.minorityRefs),
    contradictionRefs: sortedUnique(projection.contradictionRefs),
    convergenceOutcome: projection.convergenceOutcome,
    testGateVerdict: projection.testGateVerdict,
    terminalDecision: projection.terminalDecision,
  } as unknown as JsonValue;
}

function ledgerResumeProjectionSemanticView(
  projection: DeepAiCouncilProjectionState,
): JsonValue {
  const terminalDecision: DeepAiCouncilTerminalDecision =
    projection.status.state === 'complete' ? 'completed'
      : projection.status.state === 'non-converged' ? 'non-converged'
      : projection.status.state === 'incomplete'
        ? 'incomplete'
        : projection.status.state === 'blocked' || projection.status.state === 'failed'
          ? 'blocked'
          : 'active';
  return {
    runId: projection.run.runId,
    roundId: projection.run.roundId,
    generation: projection.run.generation,
    roundIds: sortedUnique(projection.councilSeats.rounds.map((entry) => entry.roundId)),
    seatIds: sortedUnique(projection.councilSeats.seats.map((entry) => entry.seatId)),
    proposalIds: sortedUnique(
      projection.councilSeats.proposals.map((entry) => entry.proposalId),
    ),
    critiqueRoundIds: sortedUnique(
      projection.critique.rounds.map((entry) => entry.critiqueRoundId),
    ),
    candidateIds: sortedUnique(
      projection.blindedAdjudication.candidates.map((entry) => entry.candidateId),
    ),
    judgmentIds: sortedUnique(
      projection.blindedAdjudication.judgments.map((entry) => entry.judgmentId),
    ),
    minorityRefs: sortedUnique(projection.convergence.presentation.minorityRefs),
    contradictionRefs: sortedUnique(
      projection.convergence.presentation.contradictionRefs,
    ),
    convergenceOutcome: projection.convergence.outcome,
    testGateVerdict: projection.testGate.verdict,
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
  decision: DeepAiCouncilResumeDecision,
  request: DeepAiCouncilResumeRequest,
): void {
  if (digest(decision.lease) !== digest(request.lease)) {
    throw new TypeError('Resume parity cannot allocate or replace the persisted lease');
  }
}

class DeepAiCouncilResumeLeaseContinuityError extends TypeError {
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
    this.name = 'DeepAiCouncilResumeLeaseContinuityError';
    this.decisionPath = decisionPath;
    this.mismatchedFields = Object.freeze([...mismatchedFields]);
  }
}

function assertResumeEvidenceLeaseContinuity(
  frozen: DeepAiCouncilFrozenParityInput,
  resumeEvidence: DeepAiCouncilResumeParityEvidence | null,
): void {
  if (resumeEvidence === null) return;
  const decisions = [
    ['legacyDecision', parseDeepAiCouncilResumeDecision(resumeEvidence.legacyDecision)],
    ['ledgerDecision', parseDeepAiCouncilResumeDecision(resumeEvidence.ledgerDecision)],
  ] as const;
  for (const [decisionPath, decision] of decisions) {
    const mismatchedFields = RESUME_LEASE_CONTINUITY_FIELDS.filter(
      (field) => decision.lease[field] !== frozen.budgetLease[field],
    );
    if (mismatchedFields.length > 0) {
      throw new DeepAiCouncilResumeLeaseContinuityError(
        decisionPath,
        mismatchedFields,
      );
    }
  }
}

/** Typed evidence that independent resume models disagree on continuation semantics. */
export class DeepAiCouncilResumeParityDivergenceError extends Error {
  public readonly code = 'DEEP_AI_COUNCIL_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(
    dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[],
  ) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'DeepAiCouncilResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare a modeled legacy resume oracle with the real ledger resume adapter. */
export async function driveDeepAiCouncilResumeParity(input: Readonly<{
  legacyOracle: DeepAiCouncilLegacyResumeOracle;
  ledgerAdapter: DeepAiCouncilResumeAdapter;
  request: DeepAiCouncilResumeRequest;
}>): Promise<DeepAiCouncilResumeParityEvidence> {
  if (typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof DeepAiCouncilResumeAdapter)) {
    throw new TypeError('Resume parity requires a legacy oracle and a real ledger adapter');
  }
  const request = parseDeepAiCouncilResumeRequest(input.request);
  const [legacyResult, ledgerResult] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  if (ledgerResult.status === 'rebuild_required') {
    throw new TypeError('Resume parity cannot compare a rebuild-required continuation');
  }
  const legacyDecision = parseDeepAiCouncilResumeDecision(legacyResult.decision);
  const ledgerDecision = parseDeepAiCouncilResumeDecision(ledgerResult.decision);
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
  if (dimensions.length > 0) throw new DeepAiCouncilResumeParityDivergenceError(dimensions);
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}

const LegacyResumeComponents = Object.freeze([
  'adapter', 'codec', 'manifest', 'policy', 'reducer', 'schema',
] as const);

function legacyResumeComponentVersion(
  fingerprint: DeepAiCouncilResumeRequest['persistedFingerprint'],
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

function legacyResumeCompatibility(request: DeepAiCouncilResumeRequest): Readonly<{
  outcome: DeepAiCouncilResumeDecision['compatibilityOutcome'];
  manifestDisposition: DeepAiCouncilResumeDecision['manifestDisposition'];
  decisions: DeepAiCouncilResumeDecision['compatibility'];
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
    const rule = request.migrationRegistry.rules.find((candidate) => (
      candidate.component === component
      && candidate.fromVersion === persistedVersion
      && candidate.toVersion === installedVersion
    ));
    const outcome: DeepAiCouncilResumeDecision['compatibility'][number]['outcome'] =
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
  const outcome: DeepAiCouncilResumeDecision['compatibilityOutcome'] = outcomes.has('blocked')
    ? 'blocked'
    : outcomes.has('pin-old-runtime')
      ? 'pin-old-runtime'
      : outcomes.has('migrate')
        ? 'migrate'
        : outcomes.has('compatible')
          ? 'compatible'
          : 'exact';
  const manifest = decisions.find((decision) => decision.component === 'manifest');
  const manifestDisposition: DeepAiCouncilResumeDecision['manifestDisposition'] =
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

function legacyResumeEffectDecisions(
  snapshot: DeepAiCouncilLegacyResumeSnapshot,
  request: DeepAiCouncilResumeRequest,
): DeepAiCouncilResumeDecision['effects'] {
  return Object.freeze((snapshot.effects ?? []).map((effect) => {
    const disposition = effect.state === 'compensation-required'
      ? 'blocked' as const
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
/** Build the distinct legacy continuation model without invoking the ledger adapter. */
export function createDeepAiCouncilLegacyResumeOracle(
  snapshot: DeepAiCouncilLegacyResumeSnapshot,
): DeepAiCouncilLegacyResumeOracle {
  const events = Object.freeze([...snapshot.events]);
  if (events.length === 0) throw new TypeError('Legacy resume oracle requires persisted events');
  const verifiedArtifactDigests = Object.freeze(sortedUnique(
    snapshot.verifiedArtifactDigests ?? [],
  ));
  const receiptDigests = Object.freeze(sortedUnique(
    snapshot.forensicReceiptDigests ?? [],
  ));
  receiptDigests.forEach((entry) => requireDigest(entry, 'forensicReceiptDigest'));
  verifiedArtifactDigests.forEach((entry) => requireDigest(entry, 'verifiedArtifactDigest'));
  return Object.freeze({
    async resume(input: DeepAiCouncilResumeRequest) {
      const request = parseDeepAiCouncilResumeRequest(input);
      const projection = councilLegacyProjection(events, null);
      const tail = events.at(-1);
      if (
        tail === undefined
        || projection.runId !== request.runId
        || projection.roundId !== request.roundId
        || request.lease.runId !== request.runId
        || request.lease.roundId !== request.roundId
        || projection.generation !== request.lease.generation
      ) {
        throw new TypeError('Persisted lease does not match the legacy continuation identity');
      }
      const compatibility = legacyResumeCompatibility(request);
      const blocked = compatibility.outcome === 'blocked'
        || compatibility.outcome === 'pin-old-runtime'
        || compatibility.manifestDisposition === 'reject';
      const branchRows = new Map<string, {
        seatId: string;
        roundId: string;
        evidenceEventIds: string[];
        returned: boolean;
      }>();
      for (const event of events) {
        if (
          event.payload.stem !== 'ai_council.seat_selected'
          && event.payload.stem !== 'ai_council.seat_dispatched'
          && event.payload.stem !== 'ai_council.proposal_observed'
          && event.payload.stem !== 'ai_council.seat_returned'
        ) continue;
        const seatId = event.payload.scope.seatId;
        const roundId = event.payload.scope.roundId;
        const logicalBranchId = event.payload.stem === 'ai_council.seat_dispatched'
          ? event.payload.data.logicalBranchRef
          : `seat:${roundId}:${seatId}`;
        const current = branchRows.get(logicalBranchId) ?? {
          seatId,
          roundId,
          evidenceEventIds: [],
          returned: false,
        };
        current.evidenceEventIds.push(event.event_id);
        current.returned = current.returned
          || (
            (event.payload.stem === 'ai_council.proposal_observed'
              || event.payload.stem === 'ai_council.seat_returned')
            && event.payload.data.responseStatus === 'returned'
          );
        branchRows.set(logicalBranchId, current);
      }
      const branches = Object.freeze([...branchRows].map(([logicalBranchId, row]) => {
        const disposition = blocked
          ? 'blocked' as const
          : row.returned
            ? 'reuse' as const
            : 'reexecute' as const;
        return Object.freeze({
          logicalBranchId,
          seatId: row.seatId,
          roundId: row.roundId,
          retryKey: `retry:${digest({ roundId: row.roundId, logicalBranchId })}`,
          disposition,
          attemptId: disposition === 'reexecute'
            ? `branch-attempt-${digest({
              logicalBranchId,
              idempotencyKey: request.idempotencyKey,
            }).slice(0, 40)}`
            : null,
          evidenceEventIds: Object.freeze([...row.evidenceEventIds]),
          decisionReason: blocked
            ? 'Compatibility blocks legacy continuation.'
            : row.returned
              ? 'The legacy journal contains one completed logical branch.'
              : 'The legacy journal requires a fresh logical branch attempt.',
        });
      }).sort((left, right) => left.logicalBranchId.localeCompare(right.logicalBranchId)));
      const effects = legacyResumeEffectDecisions(snapshot, request);
      const invalidation = Object.freeze({
        changedComponents: Object.freeze(compatibility.decisions
          .filter((entry) => entry.outcome !== 'exact')
          .map((entry) => entry.component)
          .sort()),
        invalidatedLogicalBranchIds: Object.freeze(blocked
          ? branches.map((entry) => entry.logicalBranchId)
          : []),
        invalidatedArtifactIds: Object.freeze([]),
        convergenceReopened: compatibility.outcome !== 'exact',
        testGateReopened: compatibility.outcome !== 'exact',
      });
      const disposition = blocked
        ? 'blocked' as const
        : compatibility.outcome === 'migrate'
          ? 'migrate' as const
          : compatibility.outcome === 'compatible'
            ? 'compatible' as const
            : 'exact-reuse' as const;
      const decisionBody = {
        decisionVersion: 1 as const,
        decisionId: `legacy-resume-${digest({
          runId: request.runId,
          tailEventId: tail.event_id,
          idempotencyKey: request.idempotencyKey,
        }).slice(0, 40)}`,
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
        certificateDigest: request.certificateBundle.certificate.certificateDigest,
        receiptDigests,
        verifiedArtifactDigests,
        persistedResumeFingerprint: request.persistedFingerprint.finalDigest,
        installedResumeFingerprint: request.installedFingerprint.finalDigest,
        decisionReason: blocked
          ? 'The legacy journal cannot continue under the installed contracts.'
          : 'The legacy journal has one deterministic continuation.',
      };
      const decision = parseDeepAiCouncilResumeDecision(Object.freeze({
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
        freshProjection: projection,
      });
    },
  });
}

function councilProjectionFromEvents(
  events: readonly DeepAiCouncilLedgerEvent[],
  resumeEvidence: DeepAiCouncilResumeParityEvidence | null,
  path: 'ledger' | 'legacy',
): DeepAiCouncilParityProjection {
  const latest = events.at(-1);
  const initialization = events.find(
    (event) => event.payload.stem === 'ai_council.run_initialized',
  );
  const generationEvent = [...events].reverse().find((event) => (
    event.payload.stem === 'ai_council.run_resumed'
    || event.payload.stem === 'ai_council.run_restarted'
  ));
  const convergenceEvent = [...events].reverse().find((event) => (
    event.payload.stem === 'ai_council.convergence_evaluated'
    || event.payload.stem === 'ai_council.convergence_blocked'
  ));
  const synthesisEvent = [...events].reverse().find(
    (event) => event.payload.stem === 'ai_council.deliberation_synthesized',
  );
  const gateEvent = [...events].reverse().find(
    (event) => event.payload.stem === 'ai_council.council_test_gate_evaluated',
  );
  const terminalEvent = [...events].reverse().find(
    (event) => event.payload.stem === 'ai_council.council_complete',
  );
  const artifacts = events
    .map(projectionArtifactFromEvent)
    .filter((entry): entry is DeepAiCouncilProjectionArtifact => entry !== null)
    .sort((left, right) => (
      left.artifactKind.localeCompare(right.artifactKind)
      || left.digest.localeCompare(right.digest)
    ));
  const refs = events.flatMap((event) => {
    if (event.payload.stem === 'ai_council.adjudication_decision') {
      return [{
        minorityRefs: event.payload.data.minorityRefs,
        contradictionRefs: event.payload.data.contradictionRefs,
      }];
    }
    if (event.payload.stem === 'ai_council.convergence_evaluated'
      || event.payload.stem === 'ai_council.convergence_blocked') {
      return [{
        minorityRefs: event.payload.data.minorityRefs,
        contradictionRefs: event.payload.data.contradictionRefs,
      }];
    }
    return [];
  });
  const convergenceDecision: DeepAiCouncilParityProjection['convergenceDecision'] =
    convergenceEvent?.payload.stem === 'ai_council.convergence_evaluated'
    || convergenceEvent?.payload.stem === 'ai_council.convergence_blocked'
      ? convergenceEvent.payload.data.decision
      : null;
  const terminalDecision: DeepAiCouncilTerminalDecision =
    terminalEvent?.payload.stem === 'ai_council.council_complete'
      ? terminalEvent.payload.data.terminalStatus
      : convergenceDecision === 'converged'
        ? 'converged'
        : convergenceDecision === 'non-converged'
          ? 'non-converged'
          : convergenceDecision === 'incomplete'
            ? 'incomplete'
            : convergenceDecision === 'blocked'
              ? 'blocked'
              : 'active';
  const generation = generationEvent?.payload.stem === 'ai_council.run_resumed'
    || generationEvent?.payload.stem === 'ai_council.run_restarted'
    ? generationEvent.payload.data.generation
    : initialization === undefined ? 0 : 1;
  return Object.freeze({
    runId: latest?.payload.scope.runId ?? null,
    roundId: latest?.payload.scope.roundId ?? null,
    generation,
    roundIds: Object.freeze(sortedUnique(events.map((event) => event.payload.scope.roundId))),
    seatIds: Object.freeze(sortedUnique(events.flatMap((event) => (
      'seatId' in event.payload.scope ? [String(event.payload.scope.seatId)] : []
    )))),
    proposalIds: Object.freeze(sortedUnique(events.flatMap((event) => (
      'proposalId' in event.payload.scope ? [String(event.payload.scope.proposalId)] : []
    )))),
    critiqueRoundIds: Object.freeze(sortedUnique(events.flatMap((event) => (
      'critiqueRoundId' in event.payload.scope
        ? [String(event.payload.scope.critiqueRoundId)]
        : []
    )))),
    candidateIds: Object.freeze(sortedUnique(events.flatMap((event) => (
      'candidateId' in event.payload.scope ? [String(event.payload.scope.candidateId)] : []
    )))),
    judgmentIds: Object.freeze(sortedUnique(events.flatMap((event) => (
      'judgmentId' in event.payload.scope ? [String(event.payload.scope.judgmentId)] : []
    )))),
    minorityRefs: Object.freeze(sortedUnique(refs.flatMap((entry) => entry.minorityRefs))),
    contradictionRefs: Object.freeze(sortedUnique(
      refs.flatMap((entry) => entry.contradictionRefs),
    )),
    convergenceDecision,
    convergenceOutcome: convergenceDecision === null || convergenceDecision === 'continue'
      ? 'active'
      : convergenceDecision,
    synthesisInputDigest: synthesisEvent?.payload.stem
      === 'ai_council.deliberation_synthesized'
      ? digest(synthesisEvent.payload.data.inputEventRange)
      : null,
    selectedPlanDigest: synthesisEvent?.payload.stem
      === 'ai_council.deliberation_synthesized'
      ? synthesisEvent.payload.data.selectedPlanDigest
      : null,
    testGateVerdict: gateEvent?.payload.stem
      === 'ai_council.council_test_gate_evaluated'
      ? gateEvent.payload.data.verdict
      : 'unknown',
    artifacts: Object.freeze(artifacts),
    terminalDecision,
    resumeDecisionDigest: generationEvent === undefined
      ? null
      : resumeDecisionDigest(resumeEvidence, path),
  });
}

function councilLegacyProjection(
  events: readonly DeepAiCouncilLedgerEvent[],
  resumeEvidence: DeepAiCouncilResumeParityEvidence | null,
): DeepAiCouncilParityProjection {
  return councilProjectionFromEvents(events, resumeEvidence, 'legacy');
}

/**
 * Recover the artifact this seen event produced by reading the reducer's own
 * typed record for it, never the raw event payload. A record that does not
 * exist for a given seen event (a stem the reducer does not persist into a
 * dedicated collection) yields no artifact row, mirroring the legacy scan.
 */
function reducerArtifactEntry(
  seenEvent: DeepAiCouncilSeenEvent,
  state: DeepAiCouncilProjectionState,
): DeepAiCouncilProjectionArtifact | null {
  switch (seenEvent.stem) {
    case 'ai_council.proposal_observed': {
      const record = state.councilSeats.proposals.find(
        (proposal) => proposal.observedEventId === seenEvent.eventId,
      );
      return record === undefined ? null : Object.freeze({
        artifactKind: 'proposal',
        digest: record.artifactDigest,
        validityState: record.responseStatus === 'returned' ? 'valid' as const : 'unknown' as const,
        receiptRefs: Object.freeze([record.usage.receiptRef]),
      });
    }
    case 'ai_council.seat_returned': {
      const record = state.councilSeats.proposals.find(
        (proposal) => proposal.returnedEventId === seenEvent.eventId,
      );
      return record === undefined ? null : Object.freeze({
        artifactKind: 'proposal',
        digest: record.artifactDigest,
        validityState: record.responseStatus === 'returned' ? 'valid' as const : 'unknown' as const,
        receiptRefs: Object.freeze([record.usage.receiptRef]),
      });
    }
    case 'ai_council.critique_recorded': {
      const record = state.critique.critiques.find(
        (critique) => critique.producerEventId === seenEvent.eventId,
      );
      return record === undefined ? null : Object.freeze({
        artifactKind: 'critique',
        digest: record.critiqueArtifactDigest,
        validityState: 'valid' as const,
        receiptRefs: Object.freeze([]),
      });
    }
    case 'ai_council.candidate_blinded': {
      const record = state.blindedAdjudication.candidates.find(
        (candidate) => candidate.producerEventId === seenEvent.eventId,
      );
      return record === undefined ? null : Object.freeze({
        artifactKind: 'candidate',
        digest: record.artifactDigest,
        validityState: 'valid' as const,
        receiptRefs: Object.freeze([]),
      });
    }
    case 'ai_council.deliberation_synthesized': {
      const record = state.convergence.deliberations.find(
        (deliberation) => deliberation.producerEventId === seenEvent.eventId,
      );
      return record === undefined ? null : Object.freeze({
        artifactKind: 'synthesis',
        digest: record.selectedPlanDigest,
        validityState: record.planDisposition === 'selected' ? 'valid' as const : 'unknown' as const,
        receiptRefs: Object.freeze([record.synthesisReceiptRef]),
      });
    }
    case 'ai_council.artifact_committed':
    case 'ai_council.artifact_superseded': {
      const record = state.artifacts.records.find(
        (artifact) => artifact.producerEventId === seenEvent.eventId,
      );
      return record === undefined ? null : Object.freeze({
        artifactKind: record.artifactKind,
        digest: record.contentDigest,
        validityState: 'valid' as const,
        receiptRefs: Object.freeze([]),
      });
    }
    default:
      return null;
  }
}

/** Accumulate minority/contradiction refs across every adjudication and convergence
 *  record the reducer persisted, reading only the typed record content. */
function reducerAdjudicationAndConvergenceRefs(
  state: DeepAiCouncilProjectionState,
): Readonly<{ minorityRefs: readonly string[]; contradictionRefs: readonly string[] }> {
  const minorityRefs: string[] = [];
  const contradictionRefs: string[] = [];
  for (const seenEvent of state.seenEvents) {
    if (seenEvent.stem === 'ai_council.adjudication_decision') {
      const record = state.blindedAdjudication.decisions.find(
        (decision) => decision.producerEventId === seenEvent.eventId,
      );
      if (record !== undefined) {
        minorityRefs.push(...record.minorityRefs);
        contradictionRefs.push(...record.contradictionRefs);
      }
    }
    if (
      seenEvent.stem === 'ai_council.convergence_evaluated'
      || seenEvent.stem === 'ai_council.convergence_blocked'
    ) {
      const record = state.convergence.evaluations.find(
        (evaluation) => evaluation.producerEventId === seenEvent.eventId,
      );
      if (record !== undefined) {
        minorityRefs.push(...record.minorityRefs);
        contradictionRefs.push(...record.contradictionRefs);
      }
    }
  }
  return Object.freeze({
    minorityRefs: Object.freeze(sortedUnique(minorityRefs)),
    contradictionRefs: Object.freeze(sortedUnique(contradictionRefs)),
  });
}

/** The reducer's own terminal status transition when the run reached one, otherwise
 *  the same convergence-decision fallback the legacy scan uses. */
function reducerTerminalDecision(
  state: DeepAiCouncilProjectionState,
  convergenceDecision: DeepAiCouncilParityProjection['convergenceDecision'],
): DeepAiCouncilTerminalDecision {
  const lastTransition = state.status.provenance.at(-1);
  if (state.status.terminal && lastTransition?.producerStem === 'ai_council.council_complete') {
    return lastTransition.state === 'complete'
      ? 'completed'
      : lastTransition.state as 'incomplete' | 'non-converged';
  }
  return convergenceDecision === 'converged' ? 'converged'
    : convergenceDecision === 'non-converged' ? 'non-converged'
      : convergenceDecision === 'incomplete' ? 'incomplete'
        : convergenceDecision === 'blocked' ? 'blocked'
          : 'active';
}

/**
 * Derive the parity projection from the reducer's own typed fold output only.
 *
 * This never reads the raw event stream: every field is read off the typed
 * collections the real reducer (`foldDeepAiCouncilEvents`) persisted, so a
 * defect in the reducer's own field computation is visible here rather than
 * being silently re-derived away by a second scan of the same events.
 */
function councilProjectionFromReducerState(
  state: DeepAiCouncilProjectionState,
  resumeEvidence: DeepAiCouncilResumeParityEvidence | null,
  path: 'ledger',
): DeepAiCouncilParityProjection {
  const latestEvaluation = state.convergence.evaluations.at(-1) ?? null;
  const latestDeliberation = state.convergence.deliberations.at(-1) ?? null;
  const convergenceDecision = latestEvaluation?.decision ?? null;
  const { minorityRefs, contradictionRefs } = reducerAdjudicationAndConvergenceRefs(state);
  const artifacts = state.seenEvents
    .map((seenEvent) => reducerArtifactEntry(seenEvent, state))
    .filter((entry): entry is DeepAiCouncilProjectionArtifact => entry !== null)
    .sort((left, right) => (
      left.artifactKind.localeCompare(right.artifactKind)
      || left.digest.localeCompare(right.digest)
    ));
  const hasGenerationEvent = state.seenEvents.some(
    (seenEvent) => seenEvent.stem === 'ai_council.run_resumed'
      || seenEvent.stem === 'ai_council.run_restarted',
  );
  return Object.freeze({
    runId: state.run.runId,
    roundId: state.run.roundId,
    generation: state.run.generation,
    roundIds: Object.freeze(sortedUnique([
      ...state.councilSeats.rounds.map((round) => round.roundId),
      // The run's current round is referenced in event scope from the first
      // event onward, before that round's own round_started record lands.
      ...(state.run.roundId === null ? [] : [state.run.roundId]),
    ])),
    seatIds: Object.freeze(sortedUnique(state.councilSeats.seats.map((seat) => seat.seatId))),
    proposalIds: Object.freeze(sortedUnique(
      state.councilSeats.proposals.map((proposal) => proposal.proposalId),
    )),
    critiqueRoundIds: Object.freeze(sortedUnique(
      state.critique.rounds.map((round) => round.critiqueRoundId),
    )),
    candidateIds: Object.freeze(sortedUnique(
      state.blindedAdjudication.candidates.map((candidate) => candidate.candidateId),
    )),
    judgmentIds: Object.freeze(sortedUnique(
      state.blindedAdjudication.judgments.map((judgment) => judgment.judgmentId),
    )),
    minorityRefs,
    contradictionRefs,
    convergenceDecision,
    convergenceOutcome: convergenceDecision === null || convergenceDecision === 'continue'
      ? 'active'
      : convergenceDecision,
    synthesisInputDigest: latestDeliberation === null
      ? null
      : digest(latestDeliberation.inputEventRange),
    selectedPlanDigest: latestDeliberation?.selectedPlanDigest ?? null,
    testGateVerdict: state.testGate.verdict,
    artifacts: Object.freeze(artifacts),
    terminalDecision: reducerTerminalDecision(state, convergenceDecision),
    resumeDecisionDigest: hasGenerationEvent
      ? resumeDecisionDigest(resumeEvidence, path)
      : null,
  });
}

function councilLedgerProjection(
  events: readonly DeepAiCouncilLedgerEvent[],
  resumeEvidence: DeepAiCouncilResumeParityEvidence | null,
): DeepAiCouncilParityProjection {
  const folded = foldDeepAiCouncilEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Ledger projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  return councilProjectionFromReducerState(folded.projection, resumeEvidence, 'ledger');
}

function replayState(
  events: readonly DeepAiCouncilLedgerEvent[],
  fixture: DeepAiCouncilParityFixture,
  path: 'ledger' | 'legacy',
): DeepAiCouncilParityReplayState {
  const projection = path === 'legacy'
    ? councilLegacyProjection(events, fixture.resumeEvidence)
    : councilLedgerProjection(events, fixture.resumeEvidence);
  const projectionFingerprint = digest(projection);
  const priorFingerprints = events.map((_, index) => {
    const prefix = events.slice(0, index + 1);
    const prefixProjection = path === 'legacy'
      ? councilLegacyProjection(prefix, fixture.resumeEvidence)
      : councilLedgerProjection(prefix, fixture.resumeEvidence);
    return digest(prefixProjection);
  });
  const observations = canonicalizeDeepAiCouncilEventStream(events, priorFingerprints);
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map(
      (observation) => JSON.stringify(observation),
    )),
  }) as unknown as DeepAiCouncilParityReplayState;
}

function replayObservations(
  state: DeepAiCouncilParityReplayState,
): readonly DeepAiCouncilParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as DeepAiCouncilParityEventObservation,
  ));
}

function replayProjection(
  state: DeepAiCouncilParityReplayState,
): DeepAiCouncilParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as DeepAiCouncilParityProjection;
}

// ───────────────────────────────────────────────────────────────────
// 4. PATH FAULTS AND EVENT-FOR-EVENT DIFFS
// ───────────────────────────────────────────────────────────────────

function rebuildEvent<TStem extends DeepAiCouncilEventStem>(
  event: DeepAiCouncilEventEnvelope<TStem>,
  overrides: Readonly<{
    eventId?: string;
    streamSequence?: number;
    causationId?: string | null;
    idempotencyKey?: string;
    prevEventHash?: string;
    scope?: DeepAiCouncilEventEnvelope<TStem>['payload']['scope'];
    data?: DeepAiCouncilEventEnvelope<TStem>['payload']['data'];
  }>,
): DeepAiCouncilEventEnvelope<TStem> {
  const payload = createDeepAiCouncilLedgerPayload(
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
export function deepAiCouncilParityInitialStateDigest(
  fixture: DeepAiCouncilParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

function replaceReceipt(event: DeepAiCouncilLedgerEvent): DeepAiCouncilLedgerEvent {
  switch (event.payload.stem) {
    case 'ai_council.run_resumed':
    case 'ai_council.run_restarted':
      return rebuildEvent(event, {
        data: { ...event.payload.data, recoveryReceiptRef: 'fault-recovery-receipt' },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.seat_dispatched':
      return rebuildEvent(event, {
        data: { ...event.payload.data, dispatchReceiptRef: 'fault-dispatch-receipt' },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.deliberation_synthesized':
      return rebuildEvent(event, {
        data: { ...event.payload.data, synthesisReceiptRef: 'fault-synthesis-receipt' },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.council_test_gate_evaluated':
      return rebuildEvent(event, {
        data: { ...event.payload.data, gateReceiptRef: 'fault-gate-receipt' },
      }) as DeepAiCouncilLedgerEvent;
    default:
      throw new TypeError('Receipt fault requires an event with a typed receipt reference');
  }
}

function replaceArtifact(event: DeepAiCouncilLedgerEvent): DeepAiCouncilLedgerEvent {
  const changedDigest = digest({ fault: 'artifact', eventId: event.event_id });
  switch (event.payload.stem) {
    case 'ai_council.proposal_observed':
    case 'ai_council.seat_returned':
      return rebuildEvent(event, {
        data: { ...event.payload.data, artifactDigest: changedDigest },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.critique_recorded':
      return rebuildEvent(event, {
        data: { ...event.payload.data, critiqueArtifactDigest: changedDigest },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.candidate_blinded':
      return rebuildEvent(event, {
        data: {
          ...event.payload.data,
          artifactRef: `${event.payload.data.artifactRef}-fault`,
          artifactDigest: changedDigest,
        },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.deliberation_synthesized':
      return rebuildEvent(event, {
        data: { ...event.payload.data, selectedPlanDigest: changedDigest },
      }) as DeepAiCouncilLedgerEvent;
    case 'ai_council.artifact_committed':
    case 'ai_council.artifact_superseded':
      return rebuildEvent(event, {
        data: { ...event.payload.data, contentDigest: changedDigest },
      }) as DeepAiCouncilLedgerEvent;
    default:
      throw new TypeError('Artifact fault requires an artifact-bearing event');
  }
}

function replaceTerminalDecision(event: DeepAiCouncilLedgerEvent): DeepAiCouncilLedgerEvent {
  if (
    event.payload.stem === 'ai_council.convergence_evaluated'
    || event.payload.stem === 'ai_council.convergence_blocked'
  ) {
    const decision = event.payload.stem === 'ai_council.convergence_blocked'
      ? 'blocked'
      : event.payload.data.decision === 'incomplete' ? 'blocked' : 'incomplete';
    return rebuildEvent(event, {
      data: {
        ...event.payload.data,
        decision,
        recoveryOrEscalationReason: 'Fault injection changed the terminal decision.',
      },
    }) as DeepAiCouncilLedgerEvent;
  }
  if (event.payload.stem === 'ai_council.council_complete') {
    const terminalStatus = event.payload.data.terminalStatus === 'incomplete'
      ? 'non-converged'
      : 'incomplete';
    return rebuildEvent(event, {
      data: {
        ...event.payload.data,
        terminalStatus,
        terminalReason: 'Fault injection changed the terminal decision.',
      },
    }) as DeepAiCouncilLedgerEvent;
  }
  throw new TypeError('Terminal fault requires a convergence or council-complete event');
}

function applyPathFault(
  events: readonly DeepAiCouncilLedgerEvent[],
  fault: DeepAiCouncilParityFaultInjection | undefined,
  path: 'ledger' | 'legacy',
): DeepAiCouncilLedgerEvent[] {
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
    if (source.payload.stem !== 'ai_council.candidate_blinded') {
      throw new TypeError('Extra-event fault requires a blinded candidate');
    }
    const clone = rebuildEvent(source, {
      eventId: `${source.event_id}-extra`,
      causationId: source.event_id,
      idempotencyKey: `${source.idempotency_key}-extra-event`,
      scope: {
        ...source.payload.scope,
        candidateId: `${source.payload.scope.candidateId}-extra`,
      },
    });
    output.splice(eventIndex + 1, 0, clone as DeepAiCouncilLedgerEvent);
    return output;
  }
  if (fault.kind === 'duplicate-event') {
    const source = output[eventIndex];
    if (source.payload.stem !== 'ai_council.candidate_blinded') {
      throw new TypeError('Duplicate-event fault requires a blinded candidate');
    }
    const clone = rebuildEvent(source, {
      eventId: `${source.event_id}-duplicate`,
      causationId: source.event_id,
      idempotencyKey: `${source.idempotency_key}-duplicate-event`,
      scope: {
        ...source.payload.scope,
        candidateId: `${source.payload.scope.candidateId}-duplicate`,
      },
    });
    output.splice(eventIndex + 1, 0, clone as DeepAiCouncilLedgerEvent);
    return output;
  }
  const target = output[eventIndex];
  switch (fault.kind) {
    case 'causal-link':
      output[eventIndex] = rebuildEvent(target, {
        causationId: 'fault-causal-event',
      }) as DeepAiCouncilLedgerEvent;
      break;
    case 'payload':
      if (target.payload.stem !== 'ai_council.candidate_blinded') {
        throw new TypeError('Payload fault requires a blinded candidate');
      }
      output[eventIndex] = rebuildEvent(target, {
        data: {
          ...target.payload.data,
          candidateAliasDigest: digest({ fault: 'payload', eventId: target.event_id }),
        },
      }) as DeepAiCouncilLedgerEvent;
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

function rechainPathEvents(
  events: readonly DeepAiCouncilLedgerEvent[],
): DeepAiCouncilLedgerEvent[] {
  let tailDigest = '0'.repeat(64);
  return events.map((event, index) => {
    const data = event.payload.stem === 'ai_council.council_complete'
      ? { ...event.payload.data, finalLedgerTailDigest: tailDigest }
      : event.payload.data;
    const rebuilt = rebuildEvent(event, {
      streamSequence: index + 1,
      prevEventHash: tailDigest,
      data,
    }) as DeepAiCouncilLedgerEvent;
    tailDigest = digest(rebuilt);
    return rebuilt;
  });
}

function observationDigest(value: DeepAiCouncilParityEventObservation): string {
  return digest(value);
}

function makeDiff(
  fixtureId: string,
  diffClass: DeepAiCouncilParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): DeepAiCouncilParityDiffRecord {
  const body = {
    fixtureId,
    class: diffClass,
    eventIndex,
    expectedDigest,
    actualDigest,
    disposition: 'unexplained' as const,
    owner: 'deep-ai-council-mode-owner',
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

function logicalIdentityKey(value: DeepAiCouncilParityEventObservation): string {
  return digest({
    eventType: value.eventType,
    logicalRunId: value.logicalRunId,
    logicalBranchId: value.logicalBranchId,
    stepKey: value.stepKey,
    producerSequence: value.producerSequence,
  });
}

function indexesByLogicalIdentity(
  values: readonly DeepAiCouncilParityEventObservation[],
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
export function compareDeepAiCouncilEventStreams(
  fixtureId: string,
  legacy: readonly DeepAiCouncilParityEventObservation[],
  ledger: readonly DeepAiCouncilParityEventObservation[],
): readonly DeepAiCouncilParityDiffRecord[] {
  requireToken(fixtureId, 'fixtureId');
  const diffs: DeepAiCouncilParityDiffRecord[] = [];
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

/** Pin actor, capability, and evidence to the prepared request so unverified identity cannot authorize. */
function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function createPolicyRegistry(): TransitionPolicyRegistry {
  const authority = createAuthority();
  return new TransitionPolicyRegistry([{
    policyId: PARITY_POLICY_ID,
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['shadow-only-write'],
    capturedAuthorizationState: { state: authority.state, epoch: authority.epoch },
    evaluate: evaluateParityPolicy,
  }]);
}

function createParityEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry([
    ...deepAiCouncilEventDefinitions(),
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
    identityResolver: pinRequestIdentity,
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
    priorStateVersion: DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'deep-ai-council-shadow-parity' }),
    actorId: 'deep-ai-council-shadow-parity',
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
  state: DeepAiCouncilParityReplayState,
  fixture: DeepAiCouncilParityFixture,
  fault: DeepAiCouncilParityFaultInjection | undefined,
  path: 'ledger' | 'legacy',
): DeepAiCouncilParityReplayState {
  if (!fault || fault.path !== path) return state;
  if (fault.kind === 'reorder-event') {
    const producerSequenceByEventId = new Map(fixture.events.map((event) => [
      event.event_id,
      event.stream_sequence,
    ]));
    const adjusted = replayObservations(state).map((entry) => Object.freeze({
      ...entry,
      producerSequence: producerSequenceByEventId.get(entry.eventId) ?? entry.producerSequence,
    }));
    return Object.freeze({
      ...state,
      observationCanonicalJson: Object.freeze(adjusted.map(
        (observation) => JSON.stringify(observation),
      )),
    }) as unknown as DeepAiCouncilParityReplayState;
  }
  if (fault.kind === 'duplicate-event') {
    const observations = replayObservations(state);
    const duplicateIndex = observations.findIndex((entry) => (
      entry.eventId.endsWith('-duplicate')
    ));
    if (duplicateIndex < 0 || fault.eventIndex >= observations.length) return state;
    const source = observations[fault.eventIndex];
    const adjusted = observations.map((entry, index) => (
      index === duplicateIndex
        ? Object.freeze({
          ...entry,
          logicalBranchId: source.logicalBranchId,
          producerSequence: source.producerSequence,
        })
        : entry
    ));
    return Object.freeze({
      ...state,
      observationCanonicalJson: Object.freeze(adjusted.map(
        (observation) => JSON.stringify(observation),
      )),
    }) as unknown as DeepAiCouncilParityReplayState;
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
  }) as unknown as DeepAiCouncilParityReplayState;
}

function createReducerRegistry(
  path: 'ledger' | 'legacy',
  fixture: DeepAiCouncilParityFixture,
  fault: DeepAiCouncilParityFaultInjection | undefined,
): TypedReducerRegistry<DeepAiCouncilParityReplayState> {
  return new TypedReducerRegistry(DeepAiCouncilEventStems.map((stem) => ({
    eventType: DeepAiCouncilWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const typed = event.effective.envelope as DeepAiCouncilLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepAiCouncilLedgerEvent,
      );
      const next = replayState([...history, typed], fixture, path);
      return stateWithPathFault(next, fixture, fault, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'ledger' | 'legacy',
  fixture: DeepAiCouncilParityFixture,
  fault: DeepAiCouncilParityFaultInjection | undefined,
): ReplayComponentRegistry<DeepAiCouncilParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<DeepAiCouncilParityReplayState> => {
    if (!replayInputs[SEALED_ARTIFACT_REPLAY_INPUT_KEY]) {
      throw new TypeError('Deep AI Council parity replay requires sealed fixture inputs');
    }
    return createReducerRegistry(path, fixture, fault);
  };
  const replayInputSources = {
    [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.source,
  };
  return new ReplayComponentRegistry([{
    reducerId: PARITY_REDUCER_ID,
    reducerVersion: PARITY_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function validateFrozenInputAgainstCapsule(
  frozen: DeepAiCouncilFrozenParityInput,
  resumeEvidence: DeepAiCouncilResumeParityEvidence | null,
  context: ParityExecutionContext,
  initialState: DeepAiCouncilParityReplayState,
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
    'leaseId', 'runId', 'roundId', 'generation', 'remainingMs',
    'replayFingerprint', 'deadlineAt',
  ])) {
    throw new TypeError('frozenInput.budgetLease must use the closed allowed-key set');
  }
  requireToken(frozen.budgetLease.leaseId, 'budgetLease.leaseId');
  requireToken(frozen.budgetLease.runId, 'budgetLease.runId');
  requireToken(frozen.budgetLease.roundId, 'budgetLease.roundId');
  requireCount(frozen.budgetLease.generation, 'budgetLease.generation');
  requireCount(frozen.budgetLease.remainingMs, 'budgetLease.remainingMs');
  requireDigest(frozen.budgetLease.replayFingerprint, 'budgetLease.replayFingerprint');
  requireTimestamp(frozen.budgetLease.deadlineAt, 'budgetLease.deadlineAt');
  assertResumeEvidenceLeaseContinuity(frozen, resumeEvidence);
}

function attestationEnvelope(path: 'ledger' | 'legacy', runIndex: number) {
  void runIndex;
  return {
    eventId: `${path}-parity-attestation`,
    streamId: 'deep-ai-council-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'deep-ai-council-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-parity-attestation`,
  };
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: DeepAiCouncilParityFixture,
  fault: DeepAiCouncilParityFaultInjection | undefined,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<DeepAiCouncilParityReplayState>,
  initialState: DeepAiCouncilParityReplayState,
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
    relativePath: 'research/deep-ai-council-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-research-projections-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
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
      DeepAiCouncilEventStems.map((stem) => [DeepAiCouncilWireEventTypes[stem], [1]]),
    ),
    reduce: (
      state: Readonly<DeepAiCouncilParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): DeepAiCouncilParityReplayState => {
      const typed = event.effective.envelope as DeepAiCouncilLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepAiCouncilLedgerEvent,
      );
      return stateWithPathFault(
        replayState([...history, typed], fixture, 'legacy'),
        fixture,
        fault,
        'legacy',
      );
    },
    serialize: (state: Readonly<DeepAiCouncilParityReplayState>): Uint8Array => (
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
  fixture: DeepAiCouncilParityFixture,
  state: DeepAiCouncilParityReplayState,
): Readonly<Partial<Record<ParityObservationClass, JsonValue>>> {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'deep-ai-council-shadow-observation',
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
  fixture: DeepAiCouncilParityFixture,
  fault: DeepAiCouncilParityFaultInjection | undefined,
  captured: DeepAiCouncilPathEvidence[],
): DeepAiCouncilParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<ParityPathExecution<DeepAiCouncilParityReplayState>> => {
    const events = rechainPathEvents(applyPathFault(fixture.events, fault, path));
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
        await appendAuthorizedThroughFence(ledger, prepared, proof);
      }
      ledgerTemplateRoot = resolve(context.executionRoot, '..', `${path}-ledger-template`);
      cpSync(ledgerRoot, ledgerTemplateRoot, { recursive: true, preserveTimestamps: true });
    }
    const componentRegistry = createComponentRegistry(context, path, fixture, fault);
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const rangeStartSequence = Math.max(
      1,
      events.length - MAX_REPLAY_ATTESTATION_RANGE_EVENTS + 1,
    );
    const replayInitialState = replayState(
      events.slice(0, rangeStartSequence - 1),
      fixture,
      path,
    );
    const verification: VerifyReplayFingerprintInput<DeepAiCouncilParityReplayState> = {
      ledger,
      eventRegistry: registry,
      versionRegistry,
      componentRegistry,
      consumer: 'shadow-parity',
      fingerprintVersion: 1,
      runId: `${path}-${fixture.fixtureId}`,
      rangeStartSequence,
      rangeEndSequence: events.length,
      replay: {
        reducerId: PARITY_REDUCER_ID,
        reducerVersion: PARITY_REDUCER_VERSION,
        projectionSchemaVersion: DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
        initialState: replayInitialState,
        replayInputDigests: {
          initial_state: digest(replayInitialState),
          [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.digest,
        },
      },
    };
    const fullVerification: VerifyReplayFingerprintInput<DeepAiCouncilParityReplayState> = {
      ...verification,
      rangeStartSequence: 1,
      replay: {
        ...verification.replay,
        initialState,
        replayInputDigests: {
          ...verification.replay.replayInputDigests,
          initial_state: digest(initialState),
        },
      },
    };
    let derived: DerivedReplayFingerprint<DeepAiCouncilParityReplayState>;
    let fullDerived: DerivedReplayFingerprint<DeepAiCouncilParityReplayState>;
    try {
      fullDerived = await deriveReplayFingerprint(fullVerification);
      derived = await deriveReplayFingerprint(verification);
    } catch (error) {
      throw new TypeError(`Replay derivation failed: ${
        error instanceof Error ? error.message : 'unknown error'
      }`);
    }
    const state = fullDerived.projection.state;
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
          fullDerived,
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
export function createDeepAiCouncilParityExecutors(
  fixture: DeepAiCouncilParityFixture,
  fault?: DeepAiCouncilParityFaultInjection,
): DeepAiCouncilParityExecutorPair {
  verifyDeepAiCouncilLifecycleEventMap();
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: DeepAiCouncilPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: (): readonly DeepAiCouncilPathEvidence[] => Object.freeze([...captured]),
    legacyOracleKind: 'independent-legacy-model',
    substrateImportsReal: true,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. MANIFEST, RECEIPT, AND MODE-GATE BOUNDARIES
// ───────────────────────────────────────────────────────────────────

function caseContractDigest(fixture: DeepAiCouncilParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    lifecycleMap: EventStages,
    comparatorVersion: DEEP_AI_COUNCIL_COMPARATOR_VERSION,
    projectionVersion: DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
  });
}

/** Compile the required ten-scenario mode fixture closure. */
export function compileDeepAiCouncilParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly DeepAiCouncilParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  if (input.fixtures.length !== DEEP_AI_COUNCIL_REQUIRED_FIXTURE_SCENARIOS.length) {
    throw new TypeError('Deep AI Council parity requires the complete ten-scenario fixture set');
  }
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...DEEP_AI_COUNCIL_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (
    new Set(scenarios).size !== expected.length
    || scenarios.some((scenario, index) => scenario !== expected[index])
  ) {
    throw new TypeError('Deep AI Council parity fixture scenarios must be exact and unique');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'deep-ai-council',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  const cases: ParityCaseDefinition[] = input.fixtures.map((fixture) => ({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-ai-council',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-ai-council-bounded-shadow',
  }));
  return compileParityCaseManifest({
    baseSha: input.baseSha,
    baselineRows,
    cases,
  });
}

/** Create one case definition for targeted non-vacuity or failure-path tests. */
export function createDeepAiCouncilParityCaseDefinition(
  fixture: DeepAiCouncilParityFixture,
): ParityCaseDefinition {
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-ai-council',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-ai-council-bounded-shadow',
  });
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: DEEP_AI_COUNCIL_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: DEEP_AI_COUNCIL_VOLATILITY_ALLOWLIST,
    sealedArtifactKinds: DeepAiCouncilArtifactKinds,
    diffClasses: [
      'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision',
    ],
  });
}

function pathEvidence(
  executors: DeepAiCouncilParityExecutorPair,
  path: 'ledger' | 'legacy',
): Readonly<{
  streamDigest: string;
  projectionFingerprint: string;
  observations: readonly DeepAiCouncilParityEventObservation[];
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
  fixture: DeepAiCouncilParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepAiCouncilParityExecutorPair,
): DeepAiCouncilParityCertificateEvidenceBinding | null {
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
  bindings: readonly DeepAiCouncilParityCertificateEvidenceBinding[],
): readonly DeepAiCouncilParityCertificateEvidenceBinding[] {
  return Object.freeze([...bindings].sort((left, right) => (
    left.fixtureId.localeCompare(right.fixtureId)
  )));
}

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: DeepAiCouncilParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepAiCouncilParityExecutorPair,
  certificate: DeepAiCouncilParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepAiCouncilParityCertificateEvidenceBinding[],
  refusalCode: DeepAiCouncilParityReceipt['certificateRefusalCode'],
): Omit<DeepAiCouncilParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareDeepAiCouncilEventStreams(
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
    schemaVersion: DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `deep-ai-council-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: `deep-ai-council-event@${DEEP_AI_COUNCIL_EVENT_VERSION}`,
    reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION,
    comparatorVersion: DEEP_AI_COUNCIL_COMPARATOR_VERSION,
    projectionVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
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
  fixture: DeepAiCouncilParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepAiCouncilParityExecutorPair,
  certificate: DeepAiCouncilParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepAiCouncilParityCertificateEvidenceBinding[],
  refusalCode: DeepAiCouncilParityReceipt['certificateRefusalCode'],
): DeepAiCouncilParityReceipt {
  const body = receiptBody(
    manifest,
    fixture,
    result,
    executors,
    certificate,
    evidenceBindings,
    refusalCode,
  );
  return parseDeepAiCouncilParityReceipt(Object.freeze({
    ...body,
    receiptDigest: digest(body),
  }), manifest);
}

function parseDiff(input: unknown, field: string): DeepAiCouncilParityDiffRecord {
  if (!isRecord(input) || !hasExactKeys(input, [
    'diffId', 'fixtureId', 'class', 'eventIndex', 'expectedDigest', 'actualDigest',
    'disposition', 'owner', 'dispositionReason', 'trustedStateProof',
  ])) throw new TypeError(`${field} must use the closed parity-diff shape`);
  const classes: readonly DeepAiCouncilParityDiffClass[] = [
    'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
    'projection', 'receipt', 'reordered', 'terminal-decision',
  ];
  if (!classes.includes(input.class as DeepAiCouncilParityDiffClass)) {
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
  return Object.freeze(input as unknown as DeepAiCouncilParityDiffRecord);
}

class DeepAiCouncilParityCertificateVerificationError extends TypeError {
  public readonly refusalCode: DeepAiCouncilParityReceipt['certificateRefusalCode'];

  public constructor(
    refusalCode: DeepAiCouncilParityReceipt['certificateRefusalCode'],
    message: string,
  ) {
    super(message);
    this.name = 'DeepAiCouncilParityCertificateVerificationError';
    this.refusalCode = refusalCode;
  }
}

function parseCertificateEvidenceBinding(
  input: unknown,
  field: string,
): DeepAiCouncilParityCertificateEvidenceBinding {
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
    ...(input as unknown as DeepAiCouncilParityCertificateEvidenceBinding),
    attestationFinalDigests: Object.freeze([...input.attestationFinalDigests] as string[]),
  });
}

function parseEmbeddedParityCertificate(
  input: unknown,
): NonNullable<DeepAiCouncilParityReceipt['parityCertificate']> {
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
    DeepAiCouncilParityReceipt['parityCertificate']
  >);
}

function requiredDeepAiCouncilCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases
    .filter((entry) => entry.mode === 'deep-ai-council')
    .map((entry) => entry.caseId)
    .sort((left, right) => left.localeCompare(right));
}

function verifyReceiptCertificate(
  receipt: DeepAiCouncilParityReceipt,
  manifest: ParityCaseManifest,
): void {
  const evidenceBindings = receipt.certificateEvidenceBindings;
  const requiredIds = requiredDeepAiCouncilCaseIds(manifest);
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
    mode: 'deep-ai-council',
    bindings: expectedBindings,
    caseEvidenceDigests,
    referenceSetDigests,
    attestationFinalDigests,
  });
  if (receipt.certificateStatus === 'refused') {
    if (verification.ok || evidenceBindings.length !== 0) {
      throw new DeepAiCouncilParityCertificateVerificationError(
        'UNVERIFIABLE',
        'Refused parity receipt cannot carry verifiable certificate evidence',
      );
    }
    return;
  }
  if (!verification.ok) {
    throw new DeepAiCouncilParityCertificateVerificationError(
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
    throw new DeepAiCouncilParityCertificateVerificationError(
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
    throw new DeepAiCouncilParityCertificateVerificationError(
      'UNVERIFIABLE',
      'Parity receipt streams are not bound to its verified certificate evidence',
    );
  }
}

function assertReceiptEvidenceConsistency(
  receipt: DeepAiCouncilParityReceipt,
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
export function parseDeepAiCouncilParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): DeepAiCouncilParityReceipt {
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
    ...(input as unknown as DeepAiCouncilParityReceipt),
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
}>): Omit<DeepAiCouncilModeGateInput, 'gateInputDigest'> {
  const expectedFixtureIds = sortedUnique(input.expectedFixtureIds);
  const requiredFixtureIds = requiredDeepAiCouncilCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  let certificateUnverifiable = false;
  const parsed: DeepAiCouncilParityReceipt[] = [];
  for (const receipt of input.receipts) {
    try {
      const parsedReceipt = parseDeepAiCouncilParityReceipt(receipt, input.manifest);
      verifyReceiptCertificate(parsedReceipt, input.manifest);
      parsed.push(parsedReceipt);
    } catch (error: unknown) {
      if (
        error instanceof DeepAiCouncilParityCertificateVerificationError
        && error.refusalCode === 'STALE_EVIDENCE'
      ) stale = true;
      else if (error instanceof DeepAiCouncilParityCertificateVerificationError) {
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
  let blockingReasonCode: DeepAiCouncilModeGateBlockReasonCode | null = null;
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
    schemaVersion: DEEP_AI_COUNCIL_MODE_GATE_INPUT_VERSION,
    mode: 'deep-ai-council',
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
export function createDeepAiCouncilModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): DeepAiCouncilModeGateInput {
  const body = modeGateBody(input);
  return parseDeepAiCouncilModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse the successor handoff and reject every unknown or authority-bearing key. */
export function parseDeepAiCouncilModeGateInput(input: unknown): DeepAiCouncilModeGateInput {
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
  if (input.mode !== 'deep-ai-council') throw new TypeError('mode must be deep-ai-council');
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
  const reasonCodes: readonly DeepAiCouncilModeGateBlockReasonCode[] = [
    'CERTIFICATE_UNVERIFIABLE', 'DIFF_UNEXPLAINED', 'FIXTURE_FAILURE', 'MISSING_RECEIPT',
    'NONDETERMINISTIC_REPLAY', 'RECEIPT_MALFORMED', 'RECEIPT_STALE',
    'ZERO_FIXTURES',
  ];
  if (input.blockingReasonCode !== null
    && !reasonCodes.includes(input.blockingReasonCode as DeepAiCouncilModeGateBlockReasonCode)) {
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
  return Object.freeze(input as unknown as DeepAiCouncilModeGateInput);
}

function certificateBindings(
  manifest: ParityCaseManifest,
  evidenceBindings: readonly DeepAiCouncilParityCertificateEvidenceBinding[],
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifestDigest: manifest.manifestDigest,
      schemaVersion: DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
    }),
    harness_digest: digest({
      legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-ai-council-reducers',
      shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-ai-council-resume-adapter',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: DEEP_AI_COUNCIL_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ reducerVersion: DEEP_AI_COUNCIL_REDUCER_VERSION }),
    projection_digest: digest({
      projectionVersion: DEEP_AI_COUNCIL_PROJECTION_SCHEMA_VERSION,
    }),
    adapter_digest: digest({
      adapterVersion: DEEP_AI_COUNCIL_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: EventStages,
      certificateEvidenceBindings: sortedCertificateEvidenceBindings(evidenceBindings),
    }),
    policy_version: 'deep-ai-council-shadow-only@1',
  });
}

async function runCase(
  caseRun: DeepAiCouncilParityCaseRun,
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
export async function runDeepAiCouncilParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: DeepAiCouncilParityCaseRun;
}>): Promise<DeepAiCouncilParityCaseOutcome> {
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
    mode: 'deep-ai-council',
    caseResults: [result],
    bindings,
  });
  if (issuance.ok) {
    const verification = verifyParityCertificate(issuance.certificate, {
      manifest: input.manifest,
      mode: 'deep-ai-council',
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
export async function runDeepAiCouncilParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly DeepAiCouncilParityCaseRun[];
}>): Promise<DeepAiCouncilParitySuiteResult> {
  const manifestIds = input.manifest.cases
    .filter((entry) => entry.mode === 'deep-ai-council')
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
    mode: 'deep-ai-council',
    caseResults,
    bindings,
  });
  const certificate = issuance.ok ? issuance.certificate : null;
  if (certificate !== null) {
    const verification = verifyParityCertificate(certificate, {
      manifest: input.manifest,
      mode: 'deep-ai-council',
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
  const modeGateInput = createDeepAiCouncilModeGateInput({
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
