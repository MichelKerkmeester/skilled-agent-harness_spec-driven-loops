// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Shadow Parity Harness Adapter
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
  verifyDeepAlignmentCertificateOffline,
} from '../deep-alignment-certificates/index.js';
import {
  DEEP_ALIGNMENT_EVENT_VERSION,
  DeepAlignmentEventStems,
  DeepAlignmentWireEventTypes,
  deepAlignmentEventDefinitions,
} from '../deep-alignment-ledger-schema/index.js';
import {
  DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  DEEP_ALIGNMENT_REDUCER_VERSION,
  foldDeepAlignmentEvents,
  projectDeepAlignmentLegacyView,
} from '../deep-alignment-reducers/index.js';
import {
  DeepAlignmentResumeAdapter,
  parseDeepAlignmentResumeDecision,
  parseDeepAlignmentResumeRequest,
} from '../deep-alignment-resume-adapter/index.js';
import {
  createDeepAlignmentArtifactCanonicalizerRegistry,
} from '../deep-alignment-sealed-artifacts/index.js';
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
  AuthoritySnapshot,
  GatewayAllowProof,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
} from '../deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentLegacyProjection,
  DeepAlignmentProjectionState,
} from '../deep-alignment-reducers/index.js';
import type {
  DeepAlignmentResumeDecision,
  DeepAlignmentResumeRequest,
} from '../deep-alignment-resume-adapter/index.js';
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
  DeepAlignmentFrozenParityInput,
  DeepAlignmentLifecycleEventMapping,
  DeepAlignmentLegacyResumeOracle,
  DeepAlignmentLegacyResumeSnapshot,
  DeepAlignmentModeCertificateVerificationInput,
  DeepAlignmentModeCertificateVerificationSuccess,
  DeepAlignmentModeGateBlockReasonCode,
  DeepAlignmentModeGateInput,
  DeepAlignmentParityCaseOutcome,
  DeepAlignmentParityCaseRun,
  DeepAlignmentParityCertificateEvidenceBinding,
  DeepAlignmentParityDiffClass,
  DeepAlignmentParityDiffRecord,
  DeepAlignmentParityEventObservation,
  DeepAlignmentParityExecutorPair,
  DeepAlignmentParityFaultInjection,
  DeepAlignmentParityFixture,
  DeepAlignmentParityFixtureScenario,
  DeepAlignmentParityProjection,
  DeepAlignmentParityReceipt,
  DeepAlignmentParityReplayState,
  DeepAlignmentParitySuiteResult,
  DeepAlignmentPathEvidence,
  DeepAlignmentResumeParityEvidence,
  DeepAlignmentTerminalDecision,
  DeepAlignmentVolatilityAllowance,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION =
  'deep-alignment-shadow-parity@1' as const;
export const DEEP_ALIGNMENT_COMPARATOR_VERSION =
  'deep-alignment-event-comparator@1' as const;
export const DEEP_ALIGNMENT_MODE_GATE_INPUT_VERSION =
  'deep-alignment-mode-gate-input@1' as const;
export const DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION =
  'deep-alignment-parity-projection@1' as const;

const PARITY_REDUCER_ID = 'deep-alignment:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'deep-alignment-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'deep-alignment-parity-projection';
const PARITY_LEDGER_ID = 'deep-alignment-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'deep-alignment-shadow-parity-audit';
const PARITY_POLICY_ID = 'deep-alignment-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'deep-alignment-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-28T00:00:00.000Z';
const MAX_REASON_LENGTH = 320;
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,127}$/;
const VERSION_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,127}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const RESUME_LEASE_CONTINUITY_ERROR_CODE =
  'DEEP_ALIGNMENT_RESUME_LEASE_CONTINUITY' as const;
const RESUME_LEASE_CONTINUITY_FIELDS = Object.freeze([
  'leaseId', 'runId', 'sessionId', 'generation', 'deadlineAt',
] as const);
const EVENT_ENVELOPE_KEYS = Object.freeze([
  'envelope_version', 'event_id', 'event_type', 'event_version', 'stream_id',
  'stream_sequence', 'occurred_at', 'recorded_at', 'producer', 'authority_epoch',
  'correlation_id', 'causation_id', 'idempotency_key', 'payload',
] as const);

export const DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'fresh-run',
  'concurrent-lanes',
  'retry',
  'late-completion',
  'authority-change',
  'applicability',
  'known-deviation',
  'authority-conflict',
  'deterministic-replay',
  'report-handoff',
] as const satisfies readonly DeepAlignmentParityFixtureScenario[]);

export const DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST = Object.freeze([
  Object.freeze({
    field: 'occurred_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-alignment-shadow-parity',
    volatilityReason: 'Wall-clock emission time cannot alter semantic identity or projected state.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'recorded_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-alignment-shadow-parity',
    volatilityReason: 'Transport persistence time is outside the mode transition identity.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'correlation_id',
    valueKind: 'transport-token',
    owner: 'deep-alignment-shadow-parity',
    volatilityReason: 'Opaque transport correlation cannot carry lane or authority semantics.',
    semanticIdentity: false,
  }),
] as const satisfies readonly DeepAlignmentVolatilityAllowance[]);

function mapping(
  stem: DeepAlignmentEventStem,
  lifecycleStage: DeepAlignmentLifecycleEventMapping['lifecycleStage'],
  stepKey: string,
): DeepAlignmentLifecycleEventMapping {
  return Object.freeze({
    wireEventType: DeepAlignmentWireEventTypes[stem],
    lifecycleStage,
    stepKey,
  });
}

const EventStages: Readonly<
  Record<DeepAlignmentEventStem, DeepAlignmentLifecycleEventMapping>
> = Object.freeze({
  'deep_alignment.run_initialized': mapping('deep_alignment.run_initialized', 'init', 'run-init'),
  'deep_alignment.run_resumed': mapping('deep_alignment.run_resumed', 'resume', 'run-resume'),
  'deep_alignment.run_restarted': mapping('deep_alignment.run_restarted', 'resume', 'run-restart'),
  'deep_alignment.authority_reference_bound': mapping('deep_alignment.authority_reference_bound', 'authority', 'authority-bind'),
  'deep_alignment.authority_validation_recorded': mapping('deep_alignment.authority_validation_recorded', 'authority', 'authority-validate'),
  'deep_alignment.authority_epoch_compatibility_recorded': mapping('deep_alignment.authority_epoch_compatibility_recorded', 'authority', 'authority-compatibility'),
  'deep_alignment.scope_resolved': mapping('deep_alignment.scope_resolved', 'scope', 'scope-resolve'),
  'deep_alignment.dimension_ordered': mapping('deep_alignment.dimension_ordered', 'scope', 'dimension-order'),
  'deep_alignment.protocol_plan_recorded': mapping('deep_alignment.protocol_plan_recorded', 'scope', 'protocol-plan'),
  'deep_alignment.lane_plan_recorded': mapping('deep_alignment.lane_plan_recorded', 'lane', 'lane-plan'),
  'deep_alignment.lane_started': mapping('deep_alignment.lane_started', 'lane', 'lane-start'),
  'deep_alignment.subject_snapshot_bound': mapping('deep_alignment.subject_snapshot_bound', 'lane', 'subject-bind'),
  'deep_alignment.applicability_evaluated': mapping('deep_alignment.applicability_evaluated', 'lane', 'applicability-evaluate'),
  'deep_alignment.dimension_pass_started': mapping('deep_alignment.dimension_pass_started', 'lane', 'pass-start'),
  'deep_alignment.observation_recorded': mapping('deep_alignment.observation_recorded', 'observation-evidence', 'observation-record'),
  'deep_alignment.evidence_receipt_bound': mapping('deep_alignment.evidence_receipt_bound', 'observation-evidence', 'evidence-bind'),
  'deep_alignment.observation_reconciled': mapping('deep_alignment.observation_reconciled', 'observation-evidence', 'observation-reconcile'),
  'deep_alignment.finding_candidate_emitted': mapping('deep_alignment.finding_candidate_emitted', 'finding-proof', 'candidate-emit'),
  'deep_alignment.finding_verification_recorded': mapping('deep_alignment.finding_verification_recorded', 'finding-proof', 'finding-verify'),
  'deep_alignment.proof_witness_recorded': mapping('deep_alignment.proof_witness_recorded', 'finding-proof', 'proof-record'),
  'deep_alignment.claim_adjudication_recorded': mapping('deep_alignment.claim_adjudication_recorded', 'adjudication-deviation', 'claim-adjudicate'),
  'deep_alignment.conformance_assessment_recorded': mapping('deep_alignment.conformance_assessment_recorded', 'adjudication-deviation', 'conformance-assess'),
  'deep_alignment.finding_lineage_recorded': mapping('deep_alignment.finding_lineage_recorded', 'adjudication-deviation', 'finding-lineage'),
  'deep_alignment.finding_state_changed': mapping('deep_alignment.finding_state_changed', 'adjudication-deviation', 'finding-state'),
  'deep_alignment.known_deviation_recorded': mapping('deep_alignment.known_deviation_recorded', 'adjudication-deviation', 'deviation-record'),
  'deep_alignment.known_deviation_invalidated': mapping('deep_alignment.known_deviation_invalidated', 'adjudication-deviation', 'deviation-invalidate'),
  'deep_alignment.applicability_coverage_recorded': mapping('deep_alignment.applicability_coverage_recorded', 'lane', 'applicability-coverage'),
  'deep_alignment.authority_witness_replayed': mapping('deep_alignment.authority_witness_replayed', 'authority', 'authority-witness-replay'),
  'deep_alignment.dimension_pass_completed': mapping('deep_alignment.dimension_pass_completed', 'lane', 'pass-complete'),
  'deep_alignment.lane_completed': mapping('deep_alignment.lane_completed', 'lane', 'lane-complete'),
  'deep_alignment.convergence_evaluated': mapping('deep_alignment.convergence_evaluated', 'convergence', 'convergence-evaluate'),
  'deep_alignment.graph_convergence_evaluated': mapping('deep_alignment.graph_convergence_evaluated', 'convergence', 'graph-convergence'),
  'deep_alignment.blocked_stop_recorded': mapping('deep_alignment.blocked_stop_recorded', 'convergence', 'blocked-stop'),
  'deep_alignment.pause_recorded': mapping('deep_alignment.pause_recorded', 'convergence', 'pause'),
  'deep_alignment.recovery_started': mapping('deep_alignment.recovery_started', 'resume', 'recovery-start'),
  'deep_alignment.synthesis_started': mapping('deep_alignment.synthesis_started', 'report-handoff', 'synthesis-start'),
  'deep_alignment.review_report_committed': mapping('deep_alignment.review_report_committed', 'report-handoff', 'report-commit'),
  'deep_alignment.continuity_save_requested': mapping('deep_alignment.continuity_save_requested', 'report-handoff', 'continuity-request'),
  'deep_alignment.continuity_save_completed': mapping('deep_alignment.continuity_save_completed', 'report-handoff', 'continuity-complete'),
  'deep_alignment.continuity_save_failed': mapping('deep_alignment.continuity_save_failed', 'report-handoff', 'continuity-fail'),
  'deep_alignment.run_completed': mapping('deep_alignment.run_completed', 'terminal', 'run-complete'),
});

export const DEEP_ALIGNMENT_LIFECYCLE_EVENT_MAP = EventStages;

const REQUIRED_OBSERVATIONS = Object.freeze([
  'terminal-status', 'return-value', 'error-halt', 'ordered-transitions',
  'effect-receipts', 'budgets', 'emitted-artifacts', 'reader-results',
] as const satisfies readonly ParityObservationClass[]);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION AND CANONICAL HELPERS
// ───────────────────────────────────────────────────────────────────

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

function validateFixtureShape(fixture: DeepAlignmentParityFixture): void {
  if (!isRecord(fixture) || !hasExactKeys(fixture, [
    'fixtureId', 'scenario', 'frozenInput', 'events',
    'expectedTerminalDecision', 'resumeEvidence',
  ])) throw new TypeError('fixture must use the closed allowed-key set');
  if (fixture.resumeEvidence !== null && (
    !isRecord(fixture.resumeEvidence)
    || !hasExactKeys(fixture.resumeEvidence, [
      'legacyDecision', 'ledgerDecision', 'legacyEventTailDigest',
      'ledgerEventTailDigest', 'legacyFreshProjectionFingerprint',
      'ledgerFreshProjectionFingerprint',
    ])
  )) throw new TypeError('resumeEvidence must use the closed allowed-key set');
}

function validateVolatilityBoundary(event: DeepAlignmentLedgerEvent): void {
  if (!isRecord(event) || !hasExactKeys(event, EVENT_ENVELOPE_KEYS)) {
    throw new TypeError('event envelope must use the closed fourteen-field shape');
  }
  requireTimestamp(event.occurred_at, 'occurred_at');
  requireTimestamp(event.recorded_at, 'recorded_at');
  if (!TRANSPORT_TOKEN_PATTERN.test(event.correlation_id)) {
    throw new TypeError('correlation_id must use the closed transport-only token grammar');
  }
}

function scopeString(event: DeepAlignmentLedgerEvent, key: string): string | null {
  const scope = event.payload.scope as Record<string, unknown>;
  return typeof scope[key] === 'string' ? String(scope[key]) : null;
}

function terminalDecisionForEvent(
  event: DeepAlignmentLedgerEvent,
): DeepAlignmentTerminalDecision | null {
  if (event.payload.stem === 'deep_alignment.run_completed') {
    return event.payload.data.terminalStatus;
  }
  if (event.payload.stem === 'deep_alignment.convergence_evaluated'
    || event.payload.stem === 'deep_alignment.graph_convergence_evaluated') {
    const decision = event.payload.data.decision;
    return decision === 'blocked' || decision === 'incomplete' ? decision : 'active';
  }
  if (event.payload.stem === 'deep_alignment.blocked_stop_recorded') return 'blocked';
  return null;
}

function receiptRefs(event: DeepAlignmentLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_alignment.run_resumed':
    case 'deep_alignment.run_restarted':
      return [event.payload.data.recoveryReceiptRef];
    case 'deep_alignment.authority_validation_recorded':
      return sortedUnique(event.payload.data.validationReceiptRefs);
    case 'deep_alignment.subject_snapshot_bound':
      return [event.payload.data.receiptRef];
    case 'deep_alignment.observation_recorded':
      return sortedUnique(event.payload.data.receiptRefs);
    case 'deep_alignment.evidence_receipt_bound':
      return [event.payload.data.receiptRef];
    case 'deep_alignment.proof_witness_recorded':
      return sortedUnique(event.payload.data.receiptRefs);
    case 'deep_alignment.review_report_committed':
      return [event.payload.data.reportReceiptRef];
    case 'deep_alignment.continuity_save_completed':
      return sortedUnique(event.payload.data.persistenceReceiptRefs);
    default:
      return [];
  }
}

function artifactRefs(event: DeepAlignmentLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_alignment.authority_reference_bound':
      return [event.payload.data.authoritySourceDigest, event.payload.data.ruleIrDigest];
    case 'deep_alignment.subject_snapshot_bound':
      return [event.payload.data.subjectDigest];
    case 'deep_alignment.observation_recorded':
      return [event.payload.data.contentDigest];
    case 'deep_alignment.evidence_receipt_bound':
      return [event.payload.data.receiptDigest, event.payload.data.contentDigest];
    case 'deep_alignment.finding_verification_recorded':
      return [event.payload.data.verificationDigest];
    case 'deep_alignment.proof_witness_recorded':
      return [event.payload.data.witnessDigest, event.payload.data.replayRecipeDigest];
    case 'deep_alignment.claim_adjudication_recorded':
      return [event.payload.data.adjudicationDigest];
    case 'deep_alignment.conformance_assessment_recorded':
      return [event.payload.data.assessmentDigest];
    case 'deep_alignment.review_report_committed':
      return [event.payload.data.reportDigest];
    case 'deep_alignment.continuity_save_requested':
    case 'deep_alignment.continuity_save_completed':
    case 'deep_alignment.continuity_save_failed':
      return [event.payload.data.continuityPayloadDigest];
    default:
      return [];
  }
}

function logicalIdentityMaterial(event: DeepAlignmentLedgerEvent): JsonObject {
  return {
    eventType: event.event_type,
    logicalRunId: event.payload.scope.runId,
    authorityEpochId: event.payload.scope.authorityEpochId,
    logicalLaneId: scopeString(event, 'laneId'),
    logicalSubjectId: scopeString(event, 'subjectId'),
    logicalRuleId: scopeString(event, 'ruleId'),
    logicalFindingId: scopeString(event, 'findingId'),
    stepKey: EventStages[event.payload.stem].stepKey,
    producerSequence: event.stream_sequence,
  };
}

function canonicalObservation(
  event: DeepAlignmentLedgerEvent,
  projectionFingerprint: string,
  identitiesByEventId: ReadonlyMap<string, string>,
): DeepAlignmentParityEventObservation {
  validateVolatilityBoundary(event);
  const causalIdentity = event.causation_id === null
    ? []
    : [identitiesByEventId.get(event.causation_id) ?? `unresolved:${event.causation_id}`];
  return Object.freeze({
    eventId: event.event_id,
    eventType: event.event_type,
    logicalRunId: event.payload.scope.runId,
    authorityEpochId: event.payload.scope.authorityEpochId,
    logicalLaneId: scopeString(event, 'laneId'),
    logicalSubjectId: scopeString(event, 'subjectId'),
    logicalRuleId: scopeString(event, 'ruleId'),
    logicalFindingId: scopeString(event, 'findingId'),
    stepKey: EventStages[event.payload.stem].stepKey,
    producerSequence: event.stream_sequence,
    causalEventIds: Object.freeze(causalIdentity),
    stablePayloadDigest: event.payload.payloadDigest,
    projectionFingerprint,
    receiptRefs: Object.freeze(receiptRefs(event)),
    artifactRefs: Object.freeze(artifactRefs(event)),
    terminalDecision: terminalDecisionForEvent(event),
  });
}

/** Canonicalize a typed stream and map raw causation IDs to logical identities. */
export function canonicalizeDeepAlignmentEventStream(
  events: readonly DeepAlignmentLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly DeepAlignmentParityEventObservation[] {
  if (events.length !== projectionFingerprints.length) {
    throw new TypeError('Every event requires one resulting projection fingerprint');
  }
  const identities = new Map(events.map((event) => [
    event.event_id,
    digest(logicalIdentityMaterial(event)),
  ]));
  return Object.freeze(events.map((event, index) => canonicalObservation(
    event,
    requireDigest(projectionFingerprints[index], `projectionFingerprints[${index}]`),
    identities,
  )));
}

/** Prove the lifecycle mapping closes the complete typed event namespace. */
export function verifyDeepAlignmentLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...DeepAlignmentEventStems].sort();
  if (mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Deep Alignment lifecycle mapping must close every typed event stem');
  }
  for (const stem of DeepAlignmentEventStems) {
    const entry = EventStages[stem];
    requireToken(entry.stepKey, `${stem}.stepKey`);
    if (entry.wireEventType !== DeepAlignmentWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

/** Drive the shipped mode certificate verifier before accepting its evidence. */
export async function verifyDeepAlignmentParityModeCertificate<
  TState extends JsonObject,
>(
  input: DeepAlignmentModeCertificateVerificationInput<TState>,
): Promise<DeepAlignmentModeCertificateVerificationSuccess> {
  createDeepAlignmentArtifactCanonicalizerRegistry();
  const result = await verifyDeepAlignmentCertificateOffline(input);
  if (result.verdict !== 'valid') {
    throw new TypeError(`Deep Alignment certificate did not verify: ${result.code}`);
  }
  return result;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT-FOR-EVENT COMPARATOR
// ───────────────────────────────────────────────────────────────────

function observationDigest(value: DeepAlignmentParityEventObservation): string {
  return digest(value);
}

function logicalIdentityKey(value: DeepAlignmentParityEventObservation): string {
  return digest({
    eventType: value.eventType,
    logicalRunId: value.logicalRunId,
    authorityEpochId: value.authorityEpochId,
    logicalLaneId: value.logicalLaneId,
    logicalSubjectId: value.logicalSubjectId,
    logicalRuleId: value.logicalRuleId,
    logicalFindingId: value.logicalFindingId,
    stepKey: value.stepKey,
    producerSequence: value.producerSequence,
  });
}

function indexesByLogicalIdentity(
  values: readonly DeepAlignmentParityEventObservation[],
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

function makeDiff(
  fixtureId: string,
  diffClass: DeepAlignmentParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): DeepAlignmentParityDiffRecord {
  const evidence = { fixtureId, class: diffClass, eventIndex, expectedDigest, actualDigest };
  const body = {
    ...evidence,
    disposition: 'unexplained' as const,
    owner: 'deep-alignment-mode-owner',
    dispositionReason: 'The difference can change event history or projected mode state.',
    trustedStateProof: digest(evidence),
  };
  return Object.freeze({ diffId: digest(body), ...body });
}

/** Pair by logical identity and report every unexplained semantic difference. */
export function compareDeepAlignmentEventStreams(
  fixtureId: string,
  legacy: readonly DeepAlignmentParityEventObservation[],
  ledger: readonly DeepAlignmentParityEventObservation[],
): readonly DeepAlignmentParityDiffRecord[] {
  requireToken(fixtureId, 'fixtureId');
  const diffs: DeepAlignmentParityDiffRecord[] = [];
  const legacyKeys = legacy.map(logicalIdentityKey);
  const ledgerKeys = ledger.map(logicalIdentityKey);
  const legacyIndexes = indexesByLogicalIdentity(legacy);
  const ledgerIndexes = indexesByLogicalIdentity(ledger);
  if (sameLogicalIdentityMultiset(legacyIndexes, ledgerIndexes)
    && legacyKeys.some((key, index) => key !== ledgerKeys[index])) {
    diffs.push(makeDiff(fixtureId, 'reordered', 0, digest(legacyKeys), digest(ledgerKeys)));
  }
  const logicalKeys = sortedUnique([...legacyIndexes.keys(), ...ledgerIndexes.keys()]);
  for (const logicalKey of logicalKeys) {
    const expectedIndexes = legacyIndexes.get(logicalKey) ?? [];
    const actualIndexes = ledgerIndexes.get(logicalKey) ?? [];
    if (expectedIndexes.length === 0) {
      const index = actualIndexes[0];
      diffs.push(makeDiff(fixtureId, 'extra', index, null, observationDigest(ledger[index])));
      continue;
    }
    if (actualIndexes.length === 0) {
      const index = expectedIndexes[0];
      diffs.push(makeDiff(fixtureId, 'missing', index, observationDigest(legacy[index]), null));
      continue;
    }
    if (expectedIndexes.length !== actualIndexes.length) {
      const excess = expectedIndexes.length > actualIndexes.length
        ? expectedIndexes.slice(actualIndexes.length)
        : actualIndexes.slice(expectedIndexes.length);
      for (const index of excess) {
        diffs.push(makeDiff(
          fixtureId,
          'duplicated',
          index,
          expectedIndexes.length > actualIndexes.length ? observationDigest(legacy[index]) : null,
          actualIndexes.length > expectedIndexes.length ? observationDigest(ledger[index]) : null,
        ));
      }
    }
    const pairedCount = Math.min(expectedIndexes.length, actualIndexes.length);
    for (let pair = 0; pair < pairedCount; pair += 1) {
      const eventIndex = expectedIndexes[pair];
      const expected = legacy[eventIndex];
      const actual = ledger[actualIndexes[pair]];
      const checks: ReadonlyArray<readonly [DeepAlignmentParityDiffClass, unknown, unknown]> = [
        ['causal-link', expected.causalEventIds, actual.causalEventIds],
        ['receipt', expected.receiptRefs, actual.receiptRefs],
        ['artifact', expected.artifactRefs, actual.artifactRefs],
        ['projection', expected.projectionFingerprint, actual.projectionFingerprint],
        ['terminal-decision', expected.terminalDecision, actual.terminalDecision],
        ['payload', expected.stablePayloadDigest, actual.stablePayloadDigest],
      ];
      for (const [diffClass, expectedValue, actualValue] of checks) {
        const expectedValueDigest = digest(expectedValue);
        const actualValueDigest = digest(actualValue);
        if (expectedValueDigest !== actualValueDigest) {
          diffs.push(makeDiff(
            fixtureId,
            diffClass,
            eventIndex,
            expectedValueDigest,
            actualValueDigest,
          ));
        }
      }
    }
  }
  return Object.freeze(diffs.sort((left, right) => (
    left.eventIndex - right.eventIndex || left.class.localeCompare(right.class)
  )));
}

// ───────────────────────────────────────────────────────────────────
// 4. DISTINCT LEGACY AND LEDGER PROJECTIONS
// ───────────────────────────────────────────────────────────────────

function semanticRows<T extends object>(
  values: readonly T[],
  identity: (value: T) => string,
): JsonValue[] {
  return [...values]
    .map((value) => JSON.parse(JSON.stringify(value)) as JsonValue)
    .sort((left, right) => identity(left as T).localeCompare(identity(right as T)));
}

function terminalDecisionFromProjection(
  projection: DeepAlignmentProjectionState,
): DeepAlignmentTerminalDecision {
  switch (projection.status.state) {
    case 'complete': return 'completed';
    case 'blocked': return 'blocked';
    case 'failed': return 'failed';
    case 'incomplete': return 'incomplete';
    default: return 'active';
  }
}

function artifactDigestForKind(
  projection: DeepAlignmentProjectionState,
  kind: 'continuity-save' | 'review-report',
): string | null {
  const artifact = [...projection.artifactIndex.artifacts]
    .reverse()
    .find((entry) => entry.artifactKind === kind && entry.availability === 'available');
  return artifact?.contentDigest ?? null;
}

function projectionView(
  projection: DeepAlignmentProjectionState,
  resumeEvidence: DeepAlignmentResumeParityEvidence | null,
  path: 'ledger' | 'legacy',
): DeepAlignmentParityProjection {
  const eventCount = projection.seenEvents.length;
  const laneCount = projection.lanePlan.lanes.length;
  const findingCount = projection.conformance.findings.length;
  const evidenceCount = projection.proofWitness.evidenceReceipts.length;
  return Object.freeze({
    runId: projection.run.runId,
    sessionId: projection.run.sessionId,
    authorityEpochId: projection.run.authorityEpochId,
    generation: projection.run.generation,
    authorityStatus: projection.authorityAlignment.status,
    authorityReferences: Object.freeze(semanticRows(
      projection.authorityAlignment.references,
      (entry) => entry.authorityEpochId,
    )),
    authorityValidations: Object.freeze(semanticRows(
      projection.authorityAlignment.validations,
      (entry) => entry.producerEventId,
    )),
    authorityCompatibilities: Object.freeze(semanticRows(
      projection.authorityAlignment.compatibilities,
      (entry) => `${entry.sourceAuthorityEpochId}:${entry.targetAuthorityEpochId}`,
    )),
    lanes: Object.freeze(semanticRows(
      projection.lanePlan.lanes,
      (entry) => entry.laneId,
    )),
    applicabilityDecisions: Object.freeze(semanticRows(
      projection.applicability.decisions,
      (entry) => entry.decisionId,
    )),
    applicabilityCoverage: Object.freeze(semanticRows(
      projection.applicability.coverage,
      (entry) => entry.laneId,
    )),
    observations: Object.freeze(semanticRows(
      projection.conformance.observations,
      (entry) => entry.observationId,
    )),
    evidenceReceipts: Object.freeze(semanticRows(
      projection.proofWitness.evidenceReceipts,
      (entry) => entry.evidenceId,
    )),
    findings: Object.freeze(semanticRows(
      projection.conformance.findings,
      (entry) => entry.findingId,
    )),
    deviations: Object.freeze(semanticRows(
      projection.conformance.deviations,
      (entry) => entry.deviationId,
    )),
    proofWitnesses: Object.freeze(semanticRows(
      projection.proofWitness.witnesses,
      (entry) => entry.proofId,
    )),
    laneVerdicts: Object.freeze(semanticRows(
      projection.conformance.laneVerdicts,
      (entry) => entry.laneId,
    )),
    overallVerdict: projection.conformance.overallVerdict,
    reviewLoopOutcome: projection.reviewLoop.outcome,
    reviewLoopEligibility: projection.reviewLoop.eligibility,
    activeFindingIds: Object.freeze(sortedUnique(projection.conformance.activeFindingIds)),
    hardVetoFindingIds: Object.freeze(sortedUnique(projection.conformance.hardVetoFindingIds)),
    artifactDigests: Object.freeze(sortedUnique(projection.artifactIndex.artifacts.map(
      (entry) => entry.contentDigest,
    ))),
    terminalDecision: terminalDecisionFromProjection(projection),
    publicGauges: Object.freeze({ eventCount, laneCount, findingCount, evidenceCount }),
    reportDigest: artifactDigestForKind(projection, 'review-report'),
    continuitySaveDigest: artifactDigestForKind(projection, 'continuity-save'),
    resumeDecisionDigest: resumeEvidence === null ? null : digest(resumeDecisionSemanticView(
      path === 'legacy' ? resumeEvidence.legacyDecision : resumeEvidence.ledgerDecision,
    )),
  });
}

function foldProjection(events: readonly DeepAlignmentLedgerEvent[]): DeepAlignmentProjectionState {
  const folded = foldDeepAlignmentEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Alignment projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  return folded.projection;
}

function legacyProjection(
  events: readonly DeepAlignmentLedgerEvent[],
  resumeEvidence: DeepAlignmentResumeParityEvidence | null,
): DeepAlignmentParityProjection {
  const projection = foldProjection(events);
  const legacy = projectDeepAlignmentLegacyView(projection);
  assertLegacyProjectionMatchesCurrentState(legacy, projection);
  return projectionView(projection, resumeEvidence, 'legacy');
}

function ledgerProjection(
  events: readonly DeepAlignmentLedgerEvent[],
  resumeEvidence: DeepAlignmentResumeParityEvidence | null,
): DeepAlignmentParityProjection {
  return projectionView(foldProjection(events), resumeEvidence, 'ledger');
}

function assertLegacyProjectionMatchesCurrentState(
  legacy: DeepAlignmentLegacyProjection,
  projection: DeepAlignmentProjectionState,
): void {
  if (
    legacy.authority !== 'shadow-only'
    || legacy.legacyAuthority !== 'unchanged'
    || legacy.projectionHealth !== projection.status.health
    || digest(legacy.lanes) !== digest(projection.lanePlan.lanes)
    || digest(legacy.applicability) !== digest(projection.applicability.decisions)
    || digest(legacy.verdicts) !== digest(projection.conformance.laneVerdicts)
  ) throw new TypeError('Independent legacy projection disagrees with current mode state');
}

function replayState(
  events: readonly DeepAlignmentLedgerEvent[],
  fixture: DeepAlignmentParityFixture,
  path: 'ledger' | 'legacy',
): DeepAlignmentParityReplayState {
  const projection = path === 'legacy'
    ? legacyProjection(events, fixture.resumeEvidence)
    : ledgerProjection(events, fixture.resumeEvidence);
  const projectionFingerprint = digest(projection);
  const prefixFingerprints = events.map((_, index) => {
    const prefix = events.slice(0, index + 1);
    return digest(path === 'legacy'
      ? legacyProjection(prefix, fixture.resumeEvidence)
      : ledgerProjection(prefix, fixture.resumeEvidence));
  });
  const observations = canonicalizeDeepAlignmentEventStream(events, prefixFingerprints);
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map((entry) => JSON.stringify(entry))),
  }) as unknown as DeepAlignmentParityReplayState;
}

function replayObservations(
  state: DeepAlignmentParityReplayState,
): readonly DeepAlignmentParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as DeepAlignmentParityEventObservation,
  ));
}

function replayProjection(state: DeepAlignmentParityReplayState): DeepAlignmentParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as DeepAlignmentParityProjection;
}

/** Bind the generic sealed capsule to the exact empty alignment replay state. */
export function deepAlignmentParityInitialStateDigest(
  fixture: DeepAlignmentParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

// ───────────────────────────────────────────────────────────────────
// 5. LEGACY RESUME ORACLE AND CONTINUITY CROSS-CHECK
// ───────────────────────────────────────────────────────────────────

const ResumeComponents = Object.freeze([
  'adapter', 'authority', 'codec', 'manifest', 'model', 'policy', 'reducer',
  'replay', 'schema', 'target', 'tool', 'verifier',
] as const);

function fingerprintVersion(
  fingerprint: DeepAlignmentResumeRequest['persistedFingerprint'],
  component: (typeof ResumeComponents)[number],
): string {
  switch (component) {
    case 'adapter': return fingerprint.adapterVersion;
    case 'authority': return fingerprint.authorityEpochId;
    case 'codec': return fingerprint.codecVersion;
    case 'manifest': return fingerprint.manifestRevision;
    case 'model': return fingerprint.modelVersion;
    case 'policy': return fingerprint.policyVersion;
    case 'reducer': return fingerprint.reducerVersion;
    case 'replay': return fingerprint.replayFingerprint;
    case 'schema': return fingerprint.schemaVersion;
    case 'target': return fingerprint.targetDigest;
    case 'tool': return fingerprint.toolVersion;
    case 'verifier': return fingerprint.verifierVersion;
  }
}

function resumeDecisionSemanticView(decision: DeepAlignmentResumeDecision): JsonValue {
  return {
    reuseDisposition: decision.reuseDisposition,
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
      iterationId: entry.iterationId,
      laneId: entry.laneId,
      authorityEpochId: entry.authorityEpochId,
      subjectSnapshotDigest: entry.subjectSnapshotDigest,
      manifestRevision: entry.manifestRevision,
      disposition: entry.disposition,
      evidenceEventIds: sortedUnique(entry.evidenceEventIds),
    })).sort((left, right) => left.logicalBranchId.localeCompare(right.logicalBranchId)),
    effects: [...decision.effects].map((entry) => ({
      effectId: entry.effectId,
      logicalEffectId: entry.logicalEffectId,
      applicationState: entry.applicationState,
      disposition: entry.disposition,
      attemptRefs: sortedUnique(entry.attemptRefs),
      nextAttemptId: entry.nextAttemptId,
    })).sort((left, right) => left.effectId.localeCompare(right.effectId)),
    invalidation: decision.invalidation,
    lease: decision.lease,
    priorCertificateDigest: decision.priorCertificateDigest,
    receiptChainDigest: decision.receiptChainDigest,
    artifactSetDigest: decision.artifactSetDigest,
  } as unknown as JsonValue;
}

function resumeTailDigest(tail: Readonly<{
  streamId: string;
  streamSequence: number;
  eventCount: number;
}>): string {
  return digest(tail);
}

function assertPersistedLease(
  decision: DeepAlignmentResumeDecision,
  request: DeepAlignmentResumeRequest,
): void {
  if (digest(decision.lease) !== digest(request.lease)) {
    throw new TypeError('Resume parity cannot allocate or replace the persisted lease');
  }
}

class DeepAlignmentResumeLeaseContinuityError extends TypeError {
  public readonly code = RESUME_LEASE_CONTINUITY_ERROR_CODE;
  public readonly decisionPath: 'legacyDecision' | 'ledgerDecision';
  public readonly mismatchedFields:
    readonly (typeof RESUME_LEASE_CONTINUITY_FIELDS)[number][];

  public constructor(
    decisionPath: 'legacyDecision' | 'ledgerDecision',
    mismatchedFields: readonly (typeof RESUME_LEASE_CONTINUITY_FIELDS)[number][],
  ) {
    super(`${RESUME_LEASE_CONTINUITY_ERROR_CODE}: resumeEvidence.${decisionPath}.lease `
      + `does not match frozenInput.budgetLease across ${mismatchedFields.join(', ')}`);
    this.name = 'DeepAlignmentResumeLeaseContinuityError';
    this.decisionPath = decisionPath;
    this.mismatchedFields = Object.freeze([...mismatchedFields]);
  }
}

function assertResumeEvidenceLeaseContinuity(
  frozen: DeepAlignmentFrozenParityInput,
  resumeEvidence: DeepAlignmentResumeParityEvidence | null,
): void {
  if (resumeEvidence === null) return;
  const decisions = [
    ['legacyDecision', parseDeepAlignmentResumeDecision(resumeEvidence.legacyDecision)],
    ['ledgerDecision', parseDeepAlignmentResumeDecision(resumeEvidence.ledgerDecision)],
  ] as const;
  for (const [decisionPath, decision] of decisions) {
    const mismatched = RESUME_LEASE_CONTINUITY_FIELDS.filter(
      (field) => decision.lease[field] !== frozen.budgetLease[field],
    );
    if (mismatched.length > 0) {
      throw new DeepAlignmentResumeLeaseContinuityError(decisionPath, mismatched);
    }
  }
}

/** Typed evidence that the independent resume models disagree. */
export class DeepAlignmentResumeParityDivergenceError extends Error {
  public readonly code = 'DEEP_ALIGNMENT_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(
    dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[],
  ) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'DeepAlignmentResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare the independent legacy resume model with the real alignment adapter. */
export async function driveDeepAlignmentResumeParity(input: Readonly<{
  legacyOracle: DeepAlignmentLegacyResumeOracle;
  ledgerAdapter: DeepAlignmentResumeAdapter;
  request: DeepAlignmentResumeRequest;
}>): Promise<DeepAlignmentResumeParityEvidence> {
  if (typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof DeepAlignmentResumeAdapter)) {
    throw new TypeError('Resume parity requires a legacy oracle and a real ledger adapter');
  }
  const request = parseDeepAlignmentResumeRequest(input.request);
  const [legacyResult, ledgerResult] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  if (ledgerResult.status === 'rebuild_required') {
    throw new TypeError('Resume parity cannot compare a rebuild-required continuation');
  }
  const legacyDecision = parseDeepAlignmentResumeDecision(legacyResult.decision);
  const ledgerDecision = parseDeepAlignmentResumeDecision(ledgerResult.decision);
  assertPersistedLease(legacyDecision, request);
  assertPersistedLease(ledgerDecision, request);
  const legacyEventTailDigest = resumeTailDigest(legacyResult.eventTail);
  const ledgerEventTailDigest = resumeTailDigest({
    streamId: ledgerResult.authenticatedTail.streamId,
    streamSequence: ledgerResult.authenticatedTail.streamSequence,
    eventCount: ledgerResult.authenticatedTail.eventCount,
  });
  const legacyFreshProjectionFingerprint = digest(legacyResult.freshProjection);
  const ledgerFreshProjectionFingerprint = digest(projectionView(
    ledgerResult.projection,
    null,
    'ledger',
  ));
  const dimensions: Array<'decision' | 'event-tail' | 'fresh-projection'> = [];
  if (digest(resumeDecisionSemanticView(legacyDecision))
    !== digest(resumeDecisionSemanticView(ledgerDecision))) dimensions.push('decision');
  if (legacyEventTailDigest !== ledgerEventTailDigest) dimensions.push('event-tail');
  if (legacyFreshProjectionFingerprint !== ledgerFreshProjectionFingerprint) {
    dimensions.push('fresh-projection');
  }
  if (dimensions.length > 0) throw new DeepAlignmentResumeParityDivergenceError(dimensions);
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}

/** Create a distinct full-state legacy oracle without invoking the ledger resume adapter. */
export function createDeepAlignmentLegacyResumeOracle(
  snapshot: DeepAlignmentLegacyResumeSnapshot,
): DeepAlignmentLegacyResumeOracle {
  const events = Object.freeze([...snapshot.events]);
  if (events.length === 0) throw new TypeError('Legacy resume oracle requires persisted events');
  requireDigest(snapshot.priorCertificateDigest, 'priorCertificateDigest');
  requireDigest(snapshot.receiptChainDigest, 'receiptChainDigest');
  requireDigest(snapshot.artifactSetDigest, 'artifactSetDigest');
  return Object.freeze({
    async resume(input: DeepAlignmentResumeRequest) {
      const request = parseDeepAlignmentResumeRequest(input);
      const projection = foldProjection(events);
      if (
        projection.run.runId !== request.runId
        || projection.run.sessionId !== request.lease.sessionId
        || projection.run.generation !== request.lease.generation
      ) throw new TypeError('Persisted lease does not match the legacy continuation identity');
      const compatibility = ResumeComponents.map((component) => {
        const persistedVersion = fingerprintVersion(request.persistedFingerprint, component);
        const installedVersion = fingerprintVersion(request.currentFingerprint, component);
        const outcome = persistedVersion === installedVersion ? 'exact' as const : 'blocked' as const;
        return Object.freeze({
          component,
          persistedVersion,
          installedVersion,
          outcome,
          revision: null,
          decisionReason: outcome === 'exact'
            ? 'The legacy state uses the same installed component.'
            : 'The legacy state has no registered conversion for this component pair.',
        });
      });
      const blocked = compatibility.some((entry) => entry.outcome === 'blocked');
      const branches = projection.lanePlan.lanes.map((lane) => Object.freeze({
        logicalBranchId: `${lane.iterationId}:${lane.laneId}`,
        iterationId: lane.iterationId,
        laneId: lane.laneId,
        authorityEpochId: projection.run.authorityEpochId ?? '',
        subjectSnapshotDigest: lane.subjectSnapshotDigest,
        manifestRevision: request.manifestRevision,
        retryKey: `retry:${digest({ lane: lane.laneId, manifest: request.manifestRevision })}`,
        disposition: blocked ? 'reject' as const : lane.status === 'complete' ? 'reuse' as const : 'reexecute' as const,
        attemptId: blocked || lane.status === 'complete'
          ? null
          : `attempt-${digest({ lane: lane.laneId, request: request.idempotencyKey }).slice(0, 32)}`,
        evidenceEventIds: Object.freeze(projection.seenEvents.filter(
          (entry) => entry.stem === 'deep_alignment.lane_started'
            || entry.stem === 'deep_alignment.lane_completed',
        ).map((entry) => entry.eventId)),
        decisionReason: blocked
          ? 'Installed component compatibility blocks lane continuation.'
          : lane.status === 'complete'
            ? 'The legacy lane state is complete and reusable.'
            : 'The legacy lane requires another bounded attempt.',
      }));
      const effects = Object.freeze((snapshot.effects ?? []).map((effect) => {
        const applicationState = effect.state === 'applied'
          ? 'applied' as const
          : effect.state === 'pending' ? 'not-applied' as const : 'unknown' as const;
        const disposition = effect.state === 'applied'
          ? 'reuse' as const
          : effect.state === 'pending'
            ? 'reexecute' as const
            : effect.state === 'conflicted' ? 'blocked' as const : 'reconcile' as const;
        return Object.freeze({
          effectId: requireToken(effect.effectId, 'legacyEffect.effectId'),
          logicalEffectId: requireToken(effect.logicalEffectId, 'legacyEffect.logicalEffectId'),
          applicationState,
          disposition,
          attemptRefs: Object.freeze(effect.attemptRefs.map(
            (entry) => requireToken(entry, 'legacyEffect.attemptRef'),
          )),
          nextAttemptId: disposition === 'reexecute'
            ? `attempt-${digest({ effect: effect.logicalEffectId, request: request.idempotencyKey }).slice(0, 32)}`
            : null,
          decisionReason: 'The legacy effect journal determines the continuation disposition.',
        });
      }));
      const body = {
        decisionVersion: 1 as const,
        decisionId: `legacy-resume-${digest({ runId: request.runId, request: request.idempotencyKey }).slice(0, 32)}`,
        authority: 'dark-evidence-only' as const,
        legacyAuthority: 'unchanged' as const,
        productionCompletion: false as const,
        reuseDisposition: blocked ? 'blocked' as const : 'exact-reuse' as const,
        compatibilityOutcome: blocked ? 'blocked' as const : 'exact' as const,
        manifestDisposition: blocked ? 'reject' as const : 'original' as const,
        compatibility: Object.freeze(compatibility),
        branches: Object.freeze(branches),
        effects,
        invalidation: Object.freeze({
          targetChanged: false,
          authorityChanged: false,
          verifierChanged: false,
          reopenedLaneIds: Object.freeze([]),
          invalidatedFindingIds: Object.freeze([]),
          reopenedObligationIds: Object.freeze([]),
          reopenedProofIds: Object.freeze([]),
          convergenceReopened: false,
          reportReopened: false,
        }),
        lease: request.lease,
        priorCertificateDigest: snapshot.priorCertificateDigest,
        receiptChainDigest: snapshot.receiptChainDigest,
        artifactSetDigest: snapshot.artifactSetDigest,
        decisionReason: blocked
          ? 'The independent legacy model cannot continue under current components.'
          : 'The independent legacy model has one deterministic continuation plan.',
      };
      const decision = parseDeepAlignmentResumeDecision(Object.freeze({
        ...body,
        decisionDigest: digest(body),
      }));
      const tail = events.at(-1);
      if (tail === undefined) throw new TypeError('Legacy resume oracle has no event tail');
      return Object.freeze({
        decision,
        eventTail: Object.freeze({
          streamId: tail.stream_id,
          streamSequence: tail.stream_sequence,
          eventCount: events.length,
        }),
        freshProjection: legacyProjection(events, null),
      });
    },
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. REAL SUBSTRATE EXECUTORS AND FAULT SURFACE
// ───────────────────────────────────────────────────────────────────

function evaluateParityPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === PARITY_CAPABILITY_ID
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['shadow-only-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['shadow-only-write'] };
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
    ...deepAlignmentEventDefinitions(),
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
    mode: 'review',
    event,
    priorHead: await ledger.getVerifiedHead(),
    priorStateVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'deep-alignment-shadow-parity' }),
    actorId: 'deep-alignment-shadow-parity',
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

function validateFrozenInputAgainstCapsule(
  frozen: DeepAlignmentFrozenParityInput,
  resumeEvidence: DeepAlignmentResumeParityEvidence | null,
  context: ParityExecutionContext,
  initialState: DeepAlignmentParityReplayState,
): void {
  if (!isRecord(frozen) || !hasExactKeys(frozen, [
    'baseSha', 'runManifestDigest', 'targetDigest', 'authorityCapsuleDigest',
    'authorityEpochId', 'verifierFingerprint', 'laneConfigurationDigest',
    'reviewLoopContractVersion', 'executorCapabilityDigest', 'fixtureSeed',
    'initialStateDigest', 'configurationDigest', 'budgetLease',
  ])) throw new TypeError('frozenInput must use the closed allowed-key set');
  requireBaseSha(frozen.baseSha, 'frozenInput.baseSha');
  for (const field of [
    'runManifestDigest', 'targetDigest', 'authorityCapsuleDigest',
    'verifierFingerprint', 'laneConfigurationDigest', 'executorCapabilityDigest',
    'initialStateDigest', 'configurationDigest',
  ] as const) requireDigest(frozen[field], `frozenInput.${field}`);
  requireToken(frozen.authorityEpochId, 'frozenInput.authorityEpochId');
  requireToken(frozen.reviewLoopContractVersion, 'frozenInput.reviewLoopContractVersion', true);
  requireToken(frozen.fixtureSeed, 'frozenInput.fixtureSeed');
  if (
    frozen.baseSha !== context.capsule.baseSha
    || frozen.initialStateDigest !== context.capsule.initialStateDigest
    || frozen.configurationDigest !== context.capsule.configurationDigest
    || frozen.initialStateDigest !== digest(initialState)
  ) throw new TypeError('Executor fixture does not match the verified sealed case capsule');
  if (!isRecord(frozen.budgetLease) || !hasExactKeys(frozen.budgetLease, [
    'leaseId', 'runId', 'sessionId', 'generation', 'maxIterations',
    'remainingIterations', 'deadlineAt',
  ])) throw new TypeError('frozenInput.budgetLease must use the closed allowed-key set');
  requireToken(frozen.budgetLease.leaseId, 'budgetLease.leaseId');
  requireToken(frozen.budgetLease.runId, 'budgetLease.runId');
  requireToken(frozen.budgetLease.sessionId, 'budgetLease.sessionId');
  requireCount(frozen.budgetLease.generation, 'budgetLease.generation');
  requireCount(frozen.budgetLease.maxIterations, 'budgetLease.maxIterations');
  requireCount(frozen.budgetLease.remainingIterations, 'budgetLease.remainingIterations');
  requireTimestamp(frozen.budgetLease.deadlineAt, 'budgetLease.deadlineAt');
  assertResumeEvidenceLeaseContinuity(frozen, resumeEvidence);
}

function mutateObservationsForFault(
  observations: readonly DeepAlignmentParityEventObservation[],
  fault: DeepAlignmentParityFaultInjection,
  path: 'ledger' | 'legacy',
): readonly DeepAlignmentParityEventObservation[] {
  const index = requireCount(fault.eventIndex, 'fault.eventIndex');
  if (index >= observations.length) throw new TypeError('Fault eventIndex is outside the fixture');
  const output = observations.map((entry) => ({ ...entry }));
  if (fault.kind === 'drop-event') return Object.freeze(output.filter((_, item) => item !== index));
  if (fault.kind === 'reorder-event') {
    if (index + 1 >= output.length) throw new TypeError('Reorder fault requires a following event');
    [output[index], output[index + 1]] = [output[index + 1], output[index]];
    return Object.freeze(output);
  }
  if (fault.kind === 'extra-event') {
    output.push({
      ...output[index],
      eventId: `${output[index].eventId}-${path}-extra`,
      producerSequence: Math.max(...output.map((entry) => entry.producerSequence)) + 1,
      stablePayloadDigest: digest({ fault: 'extra-event', path, index }),
    });
    return Object.freeze(output);
  }
  if (fault.kind === 'duplicate-event') {
    output.push({
      ...output[index],
      eventId: `${output[index].eventId}-${path}-duplicate`,
    });
    return Object.freeze(output);
  }
  const target = output[index];
  switch (fault.kind) {
    case 'causal-link':
      output[index] = { ...target, causalEventIds: [digest({ fault: 'causal-link', path })] };
      break;
    case 'payload':
      output[index] = { ...target, stablePayloadDigest: digest({ fault: 'payload', path }) };
      break;
    case 'receipt':
      output[index] = { ...target, receiptRefs: [`fault-receipt-${path}`] };
      break;
    case 'artifact':
      output[index] = { ...target, artifactRefs: [digest({ fault: 'artifact', path })] };
      break;
    case 'terminal-decision':
      output[index] = {
        ...target,
        terminalDecision: target.terminalDecision === 'blocked' ? 'incomplete' : 'blocked',
      };
      break;
    case 'projection':
      output[index] = {
        ...target,
        projectionFingerprint: digest({ fault: 'projection', path, index }),
      };
      break;
  }
  return Object.freeze(output);
}

function stateWithPathFault(
  state: DeepAlignmentParityReplayState,
  fault: DeepAlignmentParityFaultInjection | undefined,
  path: 'ledger' | 'legacy',
): DeepAlignmentParityReplayState {
  if (!fault || fault.path !== path) return state;
  const observations = mutateObservationsForFault(replayObservations(state), fault, path);
  const projectionFingerprint = fault.kind === 'projection'
    ? digest({ projectionFault: path, eventIndex: fault.eventIndex })
    : state.projectionFingerprint;
  return Object.freeze({
    ...state,
    projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map((entry) => JSON.stringify(entry))),
  }) as unknown as DeepAlignmentParityReplayState;
}

function createReducerRegistry(
  path: 'ledger' | 'legacy',
  fixture: DeepAlignmentParityFixture,
): TypedReducerRegistry<DeepAlignmentParityReplayState> {
  const fixtureStems = [...new Set(fixture.events.map((event) => event.payload.stem))];
  return new TypedReducerRegistry(fixtureStems.map((stem) => ({
    eventType: DeepAlignmentWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const typed = event.effective.envelope as DeepAlignmentLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepAlignmentLedgerEvent,
      );
      return replayState([...history, typed], fixture, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'ledger' | 'legacy',
  fixture: DeepAlignmentParityFixture,
): ReplayComponentRegistry<DeepAlignmentParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<DeepAlignmentParityReplayState> => {
    if (!replayInputs[SEALED_ARTIFACT_REPLAY_INPUT_KEY]) {
      throw new TypeError('Deep Alignment parity replay requires sealed fixture inputs');
    }
    return createReducerRegistry(path, fixture);
  };
  const replayInputSources = {
    [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.source,
  };
  return new ReplayComponentRegistry([{
    reducerId: PARITY_REDUCER_ID,
    reducerVersion: PARITY_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function attestationEnvelope(path: 'ledger' | 'legacy') {
  return {
    eventId: `${path}-parity-attestation`,
    streamId: 'deep-alignment-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'deep-alignment-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-parity-attestation`,
  };
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: DeepAlignmentParityFixture,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<DeepAlignmentParityReplayState>,
  initialState: DeepAlignmentParityReplayState,
): Promise<void> {
  const engine = new LegacyProjectionEngine({
    shadowRoot: resolve(context.executionRoot, 'legacy-projection-output'),
    protectedLegacyPaths: [resolve(context.executionRoot, 'legacy-authority-protected')],
    now: () => new Date(PARITY_TIMESTAMP),
  });
  const baseBytes = Uint8Array.from(serializeLegacyJson(initialState as unknown as JsonValue));
  const contract = {
    artifactId: PARITY_ARTIFACT_ID,
    censusSurfaceId: 'alignment-projections',
    ledgerId: PARITY_LEDGER_ID,
    streamIds: sortedUnique(fixture.events.map((event) => event.stream_id)),
    relativePath: 'alignment/deep-alignment-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-alignment-projections-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
    reducerVersion: PARITY_REDUCER_VERSION,
    serializerId: 'legacy-pretty-json-v1',
    legacyWriter: 'alignment reducer',
    readers: ['operators and resume'],
    base: {
      baseSha: context.capsule.baseSha,
      baseDigest: sha256Bytes(baseBytes),
      bytes: baseBytes,
      state: initialState,
      ledgerHead: { ledgerId: PARITY_LEDGER_ID, sequence: 0, recordHash: GENESIS_RECORD_HASH },
    },
    acceptedEventVersions: Object.fromEntries(
      [...new Set(fixture.events.map((event) => event.payload.stem))]
        .map((stem) => [DeepAlignmentWireEventTypes[stem], [1]]),
    ),
    reduce: (
      state: Readonly<DeepAlignmentParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): DeepAlignmentParityReplayState => {
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepAlignmentLedgerEvent,
      );
      return replayState([
        ...history,
        event.effective.envelope as DeepAlignmentLedgerEvent,
      ], fixture, 'legacy');
    },
    serialize: (state: Readonly<DeepAlignmentParityReplayState>): Uint8Array => (
      Uint8Array.from(serializeLegacyJson(state as unknown as JsonValue))
    ),
  };
  let oracle: ReturnType<typeof foldLegacyProjection<DeepAlignmentParityReplayState>>;
  try {
    oracle = foldLegacyProjection(
      contract,
      await ledger.readVerifiedEvents(),
      await ledger.getVerifiedHead(),
      fingerprint,
    );
  } catch (error: unknown) {
    throw new TypeError(`Legacy fold failed: ${error instanceof Error ? error.message : 'unknown'}`);
  }
  let result: Awaited<ReturnType<typeof engine.project>>;
  try {
    result = await engine.project({
      contract,
      ledger,
      replayFingerprint: fingerprint,
      expectedLegacyBytes: oracle.bytes,
    });
  } catch (error: unknown) {
    throw new TypeError(`Legacy publication failed: ${
      error instanceof Error ? error.message : 'unknown'
    }`);
  }
  if (!result.ok) throw new TypeError(`Legacy projection oracle failed: ${result.error.code}`);
  if (result.receipt.projectedDigest !== sha256Bytes(oracle.bytes)
    || result.receipt.baseSha !== context.capsule.baseSha
    || result.receipt.publication === undefined) {
    throw new TypeError('Legacy projection receipt did not bind expected shadow bytes');
  }
}

function executorObservations(
  context: ParityExecutionContext,
  fixture: DeepAlignmentParityFixture,
  state: DeepAlignmentParityReplayState,
): Readonly<Partial<Record<ParityObservationClass, JsonValue>>> {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'deep-alignment-shadow-observation',
    fixture_id: fixture.fixtureId,
    frozen_input_digest: digest(fixture.frozenInput),
  });
  return Object.freeze({
    'terminal-status': projection.terminalDecision,
    'return-value': state.projectionFingerprint,
    'error-halt': null,
    'ordered-transitions': state.observationCanonicalJson.map((entry) => digest(entry)),
    'effect-receipts': context.effectSink.receipts() as unknown as JsonValue,
    budgets: fixture.frozenInput.budgetLease as unknown as JsonValue,
    'emitted-artifacts': projection.artifactDigests as unknown as JsonValue,
    'reader-results': state.projectionFingerprint,
  });
}

function createPathExecutor(
  path: 'ledger' | 'legacy',
  fixture: DeepAlignmentParityFixture,
  fault: DeepAlignmentParityFaultInjection | undefined,
  captured: DeepAlignmentPathEvidence[],
): DeepAlignmentParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<ParityPathExecution<DeepAlignmentParityReplayState>> => {
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
      for (const event of fixture.events) {
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
    const componentRegistry = createComponentRegistry(context, path, fixture);
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const verification: VerifyReplayFingerprintInput<DeepAlignmentParityReplayState> = {
      ledger,
      eventRegistry: registry,
      versionRegistry,
      componentRegistry,
      consumer: 'shadow-parity',
      fingerprintVersion: 1,
      runId: `${path}-${digest(fixture.fixtureId).slice(0, 8)}`,
      rangeStartSequence: 1,
      rangeEndSequence: fixture.events.length,
      replay: {
        reducerId: PARITY_REDUCER_ID,
        reducerVersion: PARITY_REDUCER_VERSION,
        projectionSchemaVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
        initialState,
        replayInputDigests: {
          initial_state: digest(initialState),
          [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.digest,
        },
      },
    };
    let derived: DerivedReplayFingerprint<DeepAlignmentParityReplayState>;
    try {
      derived = await deriveReplayFingerprint(verification);
    } catch (error: unknown) {
      throw new TypeError(`Replay derivation failed: ${
        error instanceof Error ? error.message : 'unknown error'
      }`);
    }
    const state = stateWithPathFault(derived.projection.state, fault, path);
    const projection = replayProjection(state);
    if ((fault === undefined || fault.path !== path)
      && projection.terminalDecision !== fixture.expectedTerminalDecision) {
      throw new TypeError('Fixture terminal decision does not match its closed expectation');
    }
    if (path === 'legacy') {
      await projectThroughLegacyOracle(context, fixture, ledger, derived, initialState);
    }
    let attestation: ReturnType<typeof prepareReplayFingerprintAttestation>;
    try {
      attestation = prepareReplayFingerprintAttestation(
        derived,
        registry,
        versionRegistry,
        attestationEnvelope(path),
      );
    } catch (error: unknown) {
      throw new TypeError(`Replay attestation preparation failed: ${
        error instanceof Error ? error.message : 'unknown'
      }`);
    }
    try {
      const proof = await authorizeEvent(
        ledger,
        gateway,
        policies,
        attestation,
        `${path}-attestation-${context.runIndex}`,
      );
      await recordReplayFingerprintAttestation(
        ledger,
        attestation,
        proof,
        derived,
        versionRegistry,
      );
    } catch (error: unknown) {
      throw new TypeError(`Replay attestation recording failed: ${
        error instanceof Error ? error.message : 'unknown'
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
    const bytes = Uint8Array.from(canonicalBytes({
      projectionFingerprint: state.projectionFingerprint,
      observationCanonicalJson: state.observationCanonicalJson,
    }));
    return Object.freeze({
      verification,
      observations: executorObservations(context, fixture, state),
      projections: Object.freeze([Object.freeze({
        artifactId: PARITY_ARTIFACT_ID,
        bytes,
        readerResult: Object.freeze({ projectionFingerprint: state.projectionFingerprint }),
        publicationBoundary: 'lifecycle',
        watermarkDigest: digest({
          ledgerId: PARITY_LEDGER_ID,
          eventCount: fixture.events.length,
          streamDigest,
        }),
        integrityDigest: sha256Bytes(bytes),
      })]),
    });
  };
}

/** Create separate legacy and typed-ledger executors over the real substrate. */
export function createDeepAlignmentParityExecutors(
  fixture: DeepAlignmentParityFixture,
  fault?: DeepAlignmentParityFaultInjection,
): DeepAlignmentParityExecutorPair {
  verifyDeepAlignmentLifecycleEventMap();
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: DeepAlignmentPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: (): readonly DeepAlignmentPathEvidence[] => Object.freeze([...captured]),
    substrateImportsReal: true,
    legacyOracleKind: 'independent-legacy-model',
    sharedReviewLoopContract: 'imported-phase-012-backbone',
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. MANIFEST AND CERTIFICATE BINDINGS
// ───────────────────────────────────────────────────────────────────

function caseContractDigest(fixture: DeepAlignmentParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    frozenInput: fixture.frozenInput,
    lifecycleMap: EventStages,
    comparatorVersion: DEEP_ALIGNMENT_COMPARATOR_VERSION,
    projectionVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
  });
}

/** Compile the exact ten-scenario alignment fixture closure. */
export function compileDeepAlignmentParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly DeepAlignmentParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  if (input.fixtures.length !== DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS.length) {
    throw new TypeError('Deep Alignment parity requires the complete ten-scenario fixture set');
  }
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (new Set(scenarios).size !== expected.length
    || scenarios.some((scenario, index) => scenario !== expected[index])) {
    throw new TypeError('Deep Alignment parity fixture scenarios must be exact and unique');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'deep-alignment',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  const cases = input.fixtures.map(createDeepAlignmentParityCaseDefinition);
  return compileParityCaseManifest({ baseSha: input.baseSha, baselineRows, cases });
}

/** Create one targeted case without weakening the full-suite closure. */
export function createDeepAlignmentParityCaseDefinition(
  fixture: DeepAlignmentParityFixture,
): ParityCaseDefinition {
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-alignment',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-alignment-bounded-shadow',
  });
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: DEEP_ALIGNMENT_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST,
    logicalIdentityFields: [
      'eventType', 'logicalRunId', 'authorityEpochId', 'logicalLaneId',
      'logicalSubjectId', 'logicalRuleId', 'logicalFindingId', 'stepKey',
      'producerSequence',
    ],
    diffClasses: [
      'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
      'projection', 'receipt', 'reordered', 'terminal-decision',
    ],
  });
}

function pathEvidence(
  executors: DeepAlignmentParityExecutorPair,
  path: 'ledger' | 'legacy',
): Readonly<{
  streamDigest: string;
  projectionFingerprint: string;
  observations: readonly DeepAlignmentParityEventObservation[];
  deterministic: boolean;
}> {
  const evidence = executors.evidence().filter((entry) => entry.path === path);
  if (evidence.length === 0) return Object.freeze({
    streamDigest: digest({ missing: path }),
    projectionFingerprint: digest({ missingProjection: path }),
    observations: Object.freeze([]),
    deterministic: false,
  });
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
  fixture: DeepAlignmentParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepAlignmentParityExecutorPair,
): DeepAlignmentParityCertificateEvidenceBinding | null {
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

function sortedEvidenceBindings(
  bindings: readonly DeepAlignmentParityCertificateEvidenceBinding[],
): readonly DeepAlignmentParityCertificateEvidenceBinding[] {
  return Object.freeze([...bindings].sort((left, right) => (
    left.fixtureId.localeCompare(right.fixtureId)
  )));
}

function certificateBindings(
  manifest: ParityCaseManifest,
  evidenceBindings: readonly DeepAlignmentParityCertificateEvidenceBinding[],
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifestDigest: manifest.manifestDigest,
      schemaVersion: DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
    }),
    harness_digest: digest({
      legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-alignment-reducers',
      sharedReviewLoop: 'runtime/lib/deep-review-reducers',
      shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-alignment-resume-adapter',
      certificates: 'runtime/lib/deep-alignment-certificates',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: DEEP_ALIGNMENT_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION }),
    projection_digest: digest({ projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({
      adapterVersion: DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: EventStages,
      certificateEvidenceBindings: sortedEvidenceBindings(evidenceBindings),
    }),
    policy_version: 'deep-alignment-shadow-only@1',
  });
}

function requiredCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases
    .filter((entry) => entry.mode === 'deep-alignment')
    .map((entry) => entry.caseId)
    .sort((left, right) => left.localeCompare(right));
}

// ───────────────────────────────────────────────────────────────────
// 8. RECEIPT ISSUANCE AND CLOSED PARSING
// ───────────────────────────────────────────────────────────────────

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: DeepAlignmentParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepAlignmentParityExecutorPair,
  certificate: DeepAlignmentParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepAlignmentParityCertificateEvidenceBinding[],
  refusalCode: DeepAlignmentParityReceipt['certificateRefusalCode'],
): Omit<DeepAlignmentParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareDeepAlignmentEventStreams(
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
    schemaVersion: DEEP_ALIGNMENT_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `deep-alignment-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: `deep-alignment-event@${DEEP_ALIGNMENT_EVENT_VERSION}`,
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    comparatorVersion: DEEP_ALIGNMENT_COMPARATOR_VERSION,
    projectionVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId: fixture.fixtureId,
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    exitStatus: isGreen ? 'green' : 'blocked',
    diffDispositions: Object.freeze([...diffs]),
    parityCertificate: certificate,
    certificateEvidenceBindings: sortedEvidenceBindings(evidenceBindings),
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
  fixture: DeepAlignmentParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepAlignmentParityExecutorPair,
  certificate: DeepAlignmentParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepAlignmentParityCertificateEvidenceBinding[],
  refusalCode: DeepAlignmentParityReceipt['certificateRefusalCode'],
): DeepAlignmentParityReceipt {
  const body = receiptBody(
    manifest,
    fixture,
    result,
    executors,
    certificate,
    evidenceBindings,
    refusalCode,
  );
  return parseDeepAlignmentParityReceipt(Object.freeze({
    ...body,
    receiptDigest: digest(body),
  }), manifest);
}

function parseDiff(input: unknown, field: string): DeepAlignmentParityDiffRecord {
  if (!isRecord(input) || !hasExactKeys(input, [
    'diffId', 'fixtureId', 'class', 'eventIndex', 'expectedDigest', 'actualDigest',
    'disposition', 'owner', 'dispositionReason', 'trustedStateProof',
  ])) throw new TypeError(`${field} must use the closed parity-diff shape`);
  const classes: readonly DeepAlignmentParityDiffClass[] = [
    'artifact', 'causal-link', 'duplicated', 'extra', 'missing', 'payload',
    'projection', 'receipt', 'reordered', 'terminal-decision',
  ];
  if (!classes.includes(input.class as DeepAlignmentParityDiffClass)) {
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
  return Object.freeze(input as unknown as DeepAlignmentParityDiffRecord);
}

function parseEvidenceBinding(
  input: unknown,
  field: string,
): DeepAlignmentParityCertificateEvidenceBinding {
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
  if (input.attestationFinalDigests.length === 0
    || digest(input.attestationFinalDigests)
      !== digest(sortedUnique(input.attestationFinalDigests as string[]))) {
    throw new TypeError(`${field}.attestationFinalDigests must be sorted and unique`);
  }
  return Object.freeze({
    ...(input as unknown as DeepAlignmentParityCertificateEvidenceBinding),
    attestationFinalDigests: Object.freeze([...input.attestationFinalDigests] as string[]),
  });
}

class DeepAlignmentParityCertificateVerificationError extends TypeError {
  public readonly refusalCode: DeepAlignmentParityReceipt['certificateRefusalCode'];

  public constructor(
    refusalCode: DeepAlignmentParityReceipt['certificateRefusalCode'],
    message: string,
  ) {
    super(message);
    this.name = 'DeepAlignmentParityCertificateVerificationError';
    this.refusalCode = refusalCode;
  }
}

function verifyReceiptCertificate(
  receipt: DeepAlignmentParityReceipt,
  manifest: ParityCaseManifest,
): void {
  const evidenceBindings = receipt.certificateEvidenceBindings;
  const requiredIds = requiredCaseIds(manifest);
  const evidenceIds = evidenceBindings.map((entry) => entry.fixtureId);
  const bindings = certificateBindings(manifest, evidenceBindings);
  const verification = verifyParityCertificate(receipt.parityCertificate, {
    manifest,
    mode: 'deep-alignment',
    bindings,
    caseEvidenceDigests: evidenceBindings.map((entry) => entry.caseEvidenceDigest),
    referenceSetDigests: sortedUnique(evidenceBindings.map((entry) => entry.referenceSetDigest)),
    attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
      (entry) => entry.attestationFinalDigests,
    )),
  });
  if (receipt.certificateStatus === 'refused') {
    if (verification.ok || evidenceBindings.length !== 0) {
      throw new DeepAlignmentParityCertificateVerificationError(
        'UNVERIFIABLE',
        'Refused parity receipt cannot carry verifiable certificate evidence',
      );
    }
    return;
  }
  if (!verification.ok) {
    throw new DeepAlignmentParityCertificateVerificationError(
      verification.refusal.code,
      `Parity receipt certificate verification failed: ${verification.refusal.message}`,
    );
  }
  if (
    receipt.baseSha !== manifest.baseSha
    || receipt.runManifestDigest !== manifest.manifestDigest
    || requiredIds.length === 0
    || digest(requiredIds) !== digest(evidenceIds)
  ) throw new DeepAlignmentParityCertificateVerificationError(
    'STALE_EVIDENCE',
    'Parity receipt certificate evidence does not match the trusted manifest closure',
  );
  const current = evidenceBindings.find((entry) => entry.fixtureId === receipt.fixtureId);
  if (
    current === undefined
    || current.legacyStreamDigest !== receipt.legacyStreamDigest
    || current.ledgerStreamDigest !== receipt.ledgerStreamDigest
    || current.legacyProjectionFingerprint !== receipt.legacyProjectionFingerprint
    || current.ledgerProjectionFingerprint !== receipt.ledgerProjectionFingerprint
    || receipt.parityCertificateDigest !== verification.certificateDigest
  ) throw new DeepAlignmentParityCertificateVerificationError(
    'UNVERIFIABLE',
    'Parity receipt streams are not bound to verified certificate evidence',
  );
}

function assertReceiptConsistency(
  receipt: DeepAlignmentParityReceipt,
  manifest: ParityCaseManifest,
): void {
  const genericDivergence = receipt.genericDivergenceId !== null
    && receipt.genericDivergenceClass !== null;
  if ((receipt.genericDivergenceId === null) !== (receipt.genericDivergenceClass === null)) {
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
    if (diff.fixtureId !== receipt.fixtureId || diff.expectedDigest === diff.actualDigest) {
      throw new TypeError('Parity receipt diff evidence is not a real fixture-local difference');
    }
    const proof = digest({
      fixtureId: diff.fixtureId,
      class: diff.class,
      eventIndex: diff.eventIndex,
      expectedDigest: diff.expectedDigest,
      actualDigest: diff.actualDigest,
    });
    if (diff.trustedStateProof !== proof) {
      throw new TypeError('Parity receipt diff proof does not bind its evidence');
    }
    const { diffId, ...body } = diff;
    if (diffId !== digest(body)) {
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
  const evidenceIsGreen = receipt.legacyStreamDigest === receipt.ledgerStreamDigest
    && receipt.legacyProjectionFingerprint === receipt.ledgerProjectionFingerprint
    && receipt.diffDispositions.length === 0
    && certificateIssued
    && !genericDivergence;
  if ((receipt.exitStatus === 'green' && !evidenceIsGreen)
    || (receipt.exitStatus === 'blocked' && evidenceIsGreen)) {
    throw new TypeError('Parity receipt declared status contradicts its bound evidence');
  }
}

/** Parse a manifest-bound receipt and reject all unknown fields or dispositions. */
export function parseDeepAlignmentParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): DeepAlignmentParityReceipt {
  const keys = [
    'schemaVersion', 'receiptId', 'baseSha', 'runManifestDigest',
    'eventSchemaVersion', 'reducerVersion', 'comparatorVersion', 'projectionVersion',
    'comparatorConfigDigest', 'fixtureId', 'legacyStreamDigest', 'ledgerStreamDigest',
    'legacyProjectionFingerprint', 'ledgerProjectionFingerprint', 'exitStatus',
    'diffDispositions', 'parityCertificate', 'certificateEvidenceBindings',
    'parityCertificateDigest', 'certificateStatus', 'certificateRefusalCode',
    'genericDivergenceId', 'genericDivergenceClass', 'authorityState',
    'authorityMutation', 'cutoverCertificate', 'reproducibilityDigest', 'receiptDigest',
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
  for (const field of [
    'legacyStreamDigest', 'ledgerStreamDigest', 'legacyProjectionFingerprint',
    'ledgerProjectionFingerprint', 'reproducibilityDigest', 'receiptDigest',
  ] as const) requireDigest(input[field], field);
  if (input.exitStatus !== 'green' && input.exitStatus !== 'blocked') {
    throw new TypeError('exitStatus must use the closed parity status set');
  }
  if (!Array.isArray(input.diffDispositions)) {
    throw new TypeError('diffDispositions must be an array');
  }
  const diffs = input.diffDispositions.map((entry, index) => (
    parseDiff(entry, `diffDispositions[${index}]`)
  ));
  if (!Array.isArray(input.certificateEvidenceBindings)) {
    throw new TypeError('certificateEvidenceBindings must be an array');
  }
  const evidenceBindings = input.certificateEvidenceBindings.map((entry, index) => (
    parseEvidenceBinding(entry, `certificateEvidenceBindings[${index}]`)
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
  if (input.genericDivergenceId !== null) requireDigest(input.genericDivergenceId, 'genericDivergenceId');
  const divergenceClasses = [
    'input-inequivalent', 'harness-invalid', 'replay-contract-drift',
    'execution-outcome', 'effective-event', 'projection-semantic', 'legacy-byte',
    'missing-observation', 'nondeterministic',
  ];
  if (input.genericDivergenceClass !== null
    && !divergenceClasses.includes(String(input.genericDivergenceClass))) {
    throw new TypeError('genericDivergenceClass is not registered');
  }
  if (input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.cutoverCertificate !== false) {
    throw new TypeError('Parity receipt cannot carry an authority mutation');
  }
  const receipt = Object.freeze({
    ...(input as unknown as DeepAlignmentParityReceipt),
    diffDispositions: Object.freeze(diffs),
    certificateEvidenceBindings: Object.freeze(evidenceBindings),
  });
  const { receiptDigest, diffDispositions, certificateEvidenceBindings, ...body } = receipt;
  if (digest({ ...body, diffDispositions, certificateEvidenceBindings }) !== receiptDigest) {
    throw new TypeError('Parity receipt digest does not commit the closed receipt body');
  }
  assertReceiptConsistency(receipt, manifest);
  return receipt;
}

// ───────────────────────────────────────────────────────────────────
// 9. NON-AUTHORITATIVE MODE-GATE INPUT
// ───────────────────────────────────────────────────────────────────

function modeGateBody(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): Omit<DeepAlignmentModeGateInput, 'gateInputDigest'> {
  const expectedFixtureIds = sortedUnique(input.expectedFixtureIds);
  const requiredFixtureIds = requiredCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  let certificateUnverifiable = false;
  const parsed: DeepAlignmentParityReceipt[] = [];
  for (const receipt of input.receipts) {
    try {
      parsed.push(parseDeepAlignmentParityReceipt(receipt, input.manifest));
    } catch (error: unknown) {
      if (error instanceof DeepAlignmentParityCertificateVerificationError
        && error.refusalCode === 'STALE_EVIDENCE') stale = true;
      else if (error instanceof DeepAlignmentParityCertificateVerificationError) {
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
  const unexplained = parsed.some(
    (receipt) => receipt.diffDispositions.some((entry) => entry.disposition === 'unexplained'),
  );
  const fixtureFailure = parsed.some((receipt) => receipt.exitStatus !== 'green');
  let blockingReasonCode: DeepAlignmentModeGateBlockReasonCode | null = null;
  if (expectedFixtureIds.length === 0) blockingReasonCode = 'ZERO_FIXTURES';
  else if (malformed) blockingReasonCode = 'RECEIPT_MALFORMED';
  else if (stale) blockingReasonCode = 'RECEIPT_STALE';
  else if (certificateUnverifiable) blockingReasonCode = 'CERTIFICATE_UNVERIFIABLE';
  else if (!allReceiptsPresent) blockingReasonCode = 'MISSING_RECEIPT';
  else if (nondeterministic) blockingReasonCode = 'NONDETERMINISTIC_REPLAY';
  else if (unexplained) blockingReasonCode = 'DIFF_UNEXPLAINED';
  else if (fixtureFailure) blockingReasonCode = 'FIXTURE_FAILURE';
  return Object.freeze({
    schemaVersion: DEEP_ALIGNMENT_MODE_GATE_INPUT_VERSION,
    mode: 'deep-alignment',
    baseSha: input.manifest.baseSha,
    manifestDigest: input.manifest.manifestDigest,
    fixtureIds: Object.freeze(expectedFixtureIds),
    parityReceiptDigests: Object.freeze(parsed.map((receipt) => receipt.receiptDigest).sort()),
    exitStatus: blockingReasonCode === null ? 'pass' : 'blocked',
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

/** Build the successor input; the successor must re-derive this verdict. */
export function createDeepAlignmentModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): DeepAlignmentModeGateInput {
  const body = modeGateBody(input);
  return parseDeepAlignmentModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse the gate handoff while refusing authority-bearing or unknown keys. */
export function parseDeepAlignmentModeGateInput(input: unknown): DeepAlignmentModeGateInput {
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
  if (input.mode !== 'deep-alignment') throw new TypeError('mode must be deep-alignment');
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
  if (input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.rollbackReadinessAuthorized !== false
    || input.cutoverAuthorized !== false) {
    throw new TypeError('Mode-gate input cannot authorize authority or cutover');
  }
  const reasonCodes: readonly DeepAlignmentModeGateBlockReasonCode[] = [
    'CERTIFICATE_UNVERIFIABLE', 'DIFF_UNEXPLAINED', 'FIXTURE_FAILURE',
    'MISSING_RECEIPT', 'NONDETERMINISTIC_REPLAY', 'RECEIPT_MALFORMED',
    'RECEIPT_STALE', 'ZERO_FIXTURES',
  ];
  if (input.blockingReasonCode !== null
    && !reasonCodes.includes(input.blockingReasonCode as DeepAlignmentModeGateBlockReasonCode)) {
    throw new TypeError('blockingReasonCode is not registered');
  }
  requireDigest(input.gateInputDigest, 'gateInputDigest');
  const { gateInputDigest, ...body } = input;
  if (digest(body) !== gateInputDigest) {
    throw new TypeError('Mode-gate input digest does not commit its closed body');
  }
  if (input.exitStatus === 'pass' && (
    input.blockingReasonCode !== null
    || input.zeroUnexplainedDiffs !== true
    || input.allReceiptsPresent !== true
    || input.deterministicReplay !== true
  )) throw new TypeError('Passing mode-gate input contains blocking evidence');
  return Object.freeze(input as unknown as DeepAlignmentModeGateInput);
}

// ───────────────────────────────────────────────────────────────────
// 10. CASE AND SUITE EXECUTION
// ───────────────────────────────────────────────────────────────────

async function runCase(
  caseRun: DeepAlignmentParityCaseRun,
): Promise<ShadowParityCaseResult> {
  validateFixtureShape(caseRun.fixture);
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

function verifyIssuedCertificate(
  certificate: NonNullable<DeepAlignmentParityReceipt['parityCertificate']>,
  manifest: ParityCaseManifest,
  bindings: ParityCertificateBindings,
  evidenceBindings: readonly DeepAlignmentParityCertificateEvidenceBinding[],
): void {
  const verification = verifyParityCertificate(certificate, {
    manifest,
    mode: 'deep-alignment',
    bindings,
    caseEvidenceDigests: evidenceBindings.map((entry) => entry.caseEvidenceDigest),
    referenceSetDigests: sortedUnique(evidenceBindings.map((entry) => entry.referenceSetDigest)),
    attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
      (entry) => entry.attestationFinalDigests,
    )),
  });
  if (!verification.ok) throw new TypeError('Issued parity certificate did not verify');
}

/** Run one closed case and issue a manifest-bound parity receipt. */
export async function runDeepAlignmentParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: DeepAlignmentParityCaseRun;
}>): Promise<DeepAlignmentParityCaseOutcome> {
  const result = await runCase(input.caseRun);
  const evidence = certificateEvidenceBinding(
    input.caseRun.fixture,
    result,
    input.caseRun.executors,
  );
  const evidenceBindings = evidence === null
    ? Object.freeze([])
    : sortedEvidenceBindings([evidence]);
  const bindings = certificateBindings(input.manifest, evidenceBindings);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'deep-alignment',
    caseResults: [result],
    bindings,
  });
  if (issuance.ok) {
    verifyIssuedCertificate(issuance.certificate, input.manifest, bindings, evidenceBindings);
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

/** Run the complete closure and emit evidence, never an authority decision. */
export async function runDeepAlignmentParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly DeepAlignmentParityCaseRun[];
}>): Promise<DeepAlignmentParitySuiteResult> {
  const manifestIds = requiredCaseIds(input.manifest);
  const runIds = input.cases.map((entry) => entry.caseDefinition.caseId).sort();
  if (manifestIds.length === 0
    || manifestIds.length !== runIds.length
    || manifestIds.some((entry, index) => entry !== runIds[index])) {
    throw new TypeError('Parity suite cases must equal the manifest mode closure');
  }
  const caseResults: ShadowParityCaseResult[] = [];
  for (const caseRun of input.cases) caseResults.push(await runCase(caseRun));
  const evidenceBindings = sortedEvidenceBindings(input.cases.flatMap((caseRun, index) => {
    const binding = certificateEvidenceBinding(
      caseRun.fixture,
      caseResults[index],
      caseRun.executors,
    );
    return binding === null ? [] : [binding];
  }));
  const bindings = certificateBindings(input.manifest, evidenceBindings);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'deep-alignment',
    caseResults,
    bindings,
  });
  const certificate = issuance.ok ? issuance.certificate : null;
  if (certificate !== null) {
    verifyIssuedCertificate(certificate, input.manifest, bindings, evidenceBindings);
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
  const modeGateInput = createDeepAlignmentModeGateInput({
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
