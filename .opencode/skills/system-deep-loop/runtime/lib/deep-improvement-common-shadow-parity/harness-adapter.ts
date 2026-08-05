// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Shadow Parity Harness Adapter
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
import { appendFencedLedgerRecord } from '../locks-and-fencing/fenced-ledger-writer.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  verifyDeepImprovementCommonCertificateOffline,
} from '../deep-improvement-common-certificates/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_EVENT_VERSION,
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
  createDeepImprovementCommonLedgerPayload,
  deepImprovementCommonEventDefinitions,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
  foldDeepImprovementCommonEvents,
} from '../deep-improvement-common-reducers/index.js';
import {
  DeepImprovementCommonResumeAdapter,
  parseDeepImprovementCommonResumeDecision,
  parseDeepImprovementCommonResumeRequest,
} from '../deep-improvement-common-resume-adapter/index.js';
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
  FingerprintVersionRegistry,
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
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerifierReceipt,
} from '../deep-improvement-common-certificates/index.js';
import type {
  DeepImprovementCommonEventEnvelope,
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';
import type {
  DeepImprovementCommonResumeDecision,
  DeepImprovementCommonResumeRequest,
} from '../deep-improvement-common-resume-adapter/index.js';
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
  DeepImprovementCommonFrozenParityInput,
  DeepImprovementCommonLifecycleEventMapping,
  DeepImprovementCommonLegacyResumeOracle,
  DeepImprovementCommonLegacyResumeSnapshot,
  DeepImprovementCommonModeCertificateBinding,
  DeepImprovementCommonModeGateBlockReasonCode,
  DeepImprovementCommonModeGateInput,
  DeepImprovementCommonParityCanary,
  DeepImprovementCommonParityCandidate,
  DeepImprovementCommonParityCaseOutcome,
  DeepImprovementCommonParityCaseRun,
  DeepImprovementCommonParityCertificateEvidenceBinding,
  DeepImprovementCommonParityDiffClass,
  DeepImprovementCommonParityDiffRecord,
  DeepImprovementCommonParityEventObservation,
  DeepImprovementCommonParityEvaluatorEpoch,
  DeepImprovementCommonParityExecutorPair,
  DeepImprovementCommonParityFaultInjection,
  DeepImprovementCommonParityFixture,
  DeepImprovementCommonParityFixtureScenario,
  DeepImprovementCommonParityProjection,
  DeepImprovementCommonParityPromotion,
  DeepImprovementCommonParityRawObservation,
  DeepImprovementCommonParityReceipt,
  DeepImprovementCommonParityReplayState,
  DeepImprovementCommonParityScore,
  DeepImprovementCommonParitySuiteResult,
  DeepImprovementCommonParityVeto,
  DeepImprovementCommonPathEvidence,
  DeepImprovementCommonResumeParityEvidence,
  DeepImprovementCommonTerminalDecision,
  DeepImprovementCommonVolatilityAllowance,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION =
  'deep-improvement-common-shadow-parity@1' as const;
export const DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION =
  'deep-improvement-common-event-comparator@1' as const;
export const DEEP_IMPROVEMENT_COMMON_MODE_GATE_INPUT_VERSION =
  'deep-improvement-common-mode-gate-input@1' as const;
export const DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION =
  'deep-improvement-common-parity-projection@1' as const;
export const DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT = Object.freeze({
  contractId: 'deep-improvement-common-shadow-parity',
  contractVersion: 1,
  schemaVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
  comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  projectionVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
  replayFingerprintVersion: 2,
  authority: 'shadow-evidence-only',
  owner: 'deep-improvement-common',
  consumers: Object.freeze([
    'deep-improvement-common',
    'agent-improvement',
    'model-benchmark',
    'skill-benchmark',
  ]),
} as const);

const PARITY_REDUCER_ID = 'deep-improvement-common:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'deep-improvement-common-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'deep-improvement-common-parity-projection';
const PARITY_LEDGER_ID = 'deep-improvement-common-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'deep-improvement-common-shadow-parity-audit';
const PARITY_POLICY_ID = 'deep-improvement-common-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'deep-improvement-common-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-28T00:00:00.000Z';
const MAX_REASON_LENGTH = 512;
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;
const VERSION_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,191}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const RESUME_LEASE_CONTINUITY_ERROR_CODE =
  'DEEP_IMPROVEMENT_COMMON_RESUME_LEASE_CONTINUITY' as const;
const RESUME_LEASE_CONTINUITY_FIELDS = Object.freeze([
  'leaseId',
  'runId',
  'lineageId',
  'generation',
  'deadlineAt',
] as const);

export const DEEP_IMPROVEMENT_COMMON_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'healthy-progress',
  'candidate-rejection',
  'score-policy-change',
  'evaluator-epoch-change',
  'canary-leak',
  'canary-drift',
  'promotion-veto',
  'inconclusive-evidence',
  'rollback-target-preservation',
  'crash-resume',
  'duplicate-delivery',
  'unsupported-version',
] as const satisfies readonly DeepImprovementCommonParityFixtureScenario[]);

export const DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST = Object.freeze([
  Object.freeze({
    field: 'occurred_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-improvement-common-shadow-parity',
    volatilityReason: 'Wall-clock emission time cannot alter semantic identity or projected state.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'recorded_at',
    valueKind: 'iso-timestamp',
    owner: 'deep-improvement-common-shadow-parity',
    volatilityReason: 'Transport persistence time is outside evaluator and promotion semantics.',
    semanticIdentity: false,
  }),
  Object.freeze({
    field: 'correlation_id',
    valueKind: 'transport-token',
    owner: 'deep-improvement-common-shadow-parity',
    volatilityReason: 'Opaque transport correlation cannot carry a shared-service decision.',
    semanticIdentity: false,
  }),
] as const satisfies readonly DeepImprovementCommonVolatilityAllowance[]);

function mapping(
  stem: DeepImprovementCommonEventStem,
  lifecycleStage: DeepImprovementCommonLifecycleEventMapping['lifecycleStage'],
  stepKey: string,
): DeepImprovementCommonLifecycleEventMapping {
  return Object.freeze({
    wireEventType: DeepImprovementCommonWireEventTypes[stem],
    lifecycleStage,
    stepKey,
  });
}

const EventStages:
  Readonly<Record<DeepImprovementCommonEventStem, DeepImprovementCommonLifecycleEventMapping>> =
  Object.freeze({
    'deep_improvement_common.run_started':
      mapping('deep_improvement_common.run_started', 'run', 'run-start'),
    'deep_improvement_common.run_resumed':
      mapping('deep_improvement_common.run_resumed', 'run', 'run-resume'),
    'deep_improvement_common.run_paused':
      mapping('deep_improvement_common.run_paused', 'run', 'run-pause'),
    'deep_improvement_common.run_completed':
      mapping('deep_improvement_common.run_completed', 'terminal', 'run-complete'),
    'deep_improvement_common.run_aborted':
      mapping('deep_improvement_common.run_aborted', 'terminal', 'run-abort'),
    'deep_improvement_common.run_quarantined':
      mapping('deep_improvement_common.run_quarantined', 'terminal', 'run-quarantine'),
    'deep_improvement_common.candidate_proposed':
      mapping('deep_improvement_common.candidate_proposed', 'candidate', 'candidate-propose'),
    'deep_improvement_common.candidate_generated':
      mapping('deep_improvement_common.candidate_generated', 'candidate', 'candidate-generate'),
    'deep_improvement_common.candidate_rejected':
      mapping('deep_improvement_common.candidate_rejected', 'candidate', 'candidate-reject'),
    'deep_improvement_common.candidate_lineage_attached':
      mapping('deep_improvement_common.candidate_lineage_attached', 'candidate', 'candidate-lineage'),
    'deep_improvement_common.evaluation_epoch_sealed':
      mapping('deep_improvement_common.evaluation_epoch_sealed', 'evaluation', 'evaluation-seal'),
    'deep_improvement_common.evaluation_started':
      mapping('deep_improvement_common.evaluation_started', 'evaluation', 'evaluation-start'),
    'deep_improvement_common.evaluation_observation_recorded':
      mapping('deep_improvement_common.evaluation_observation_recorded', 'evaluation', 'observation-record'),
    'deep_improvement_common.evaluation_normalized':
      mapping('deep_improvement_common.evaluation_normalized', 'evaluation', 'evaluation-normalize'),
    'deep_improvement_common.evaluation_verification_requested':
      mapping('deep_improvement_common.evaluation_verification_requested', 'evaluation', 'verification-request'),
    'deep_improvement_common.evaluation_verification_recorded':
      mapping('deep_improvement_common.evaluation_verification_recorded', 'evaluation', 'verification-record'),
    'deep_improvement_common.evaluation_inconclusive':
      mapping('deep_improvement_common.evaluation_inconclusive', 'evaluation', 'evaluation-inconclusive'),
    'deep_improvement_common.evaluation_failed':
      mapping('deep_improvement_common.evaluation_failed', 'evaluation', 'evaluation-fail'),
    'deep_improvement_common.canary_suite_sealed':
      mapping('deep_improvement_common.canary_suite_sealed', 'canary', 'canary-seal'),
    'deep_improvement_common.canary_executed':
      mapping('deep_improvement_common.canary_executed', 'canary', 'canary-execute'),
    'deep_improvement_common.canary_leak_detected':
      mapping('deep_improvement_common.canary_leak_detected', 'canary', 'canary-leak'),
    'deep_improvement_common.canary_drift_detected':
      mapping('deep_improvement_common.canary_drift_detected', 'canary', 'canary-drift'),
    'deep_improvement_common.canary_invariant_failed':
      mapping('deep_improvement_common.canary_invariant_failed', 'canary', 'canary-invariant'),
    'deep_improvement_common.canary_gate_passed':
      mapping('deep_improvement_common.canary_gate_passed', 'canary', 'canary-pass'),
    'deep_improvement_common.canary_gate_failed':
      mapping('deep_improvement_common.canary_gate_failed', 'canary', 'canary-fail'),
    'deep_improvement_common.canary_vetoed':
      mapping('deep_improvement_common.canary_vetoed', 'canary', 'canary-veto'),
    'deep_improvement_common.promotion_proposed':
      mapping('deep_improvement_common.promotion_proposed', 'promotion', 'promotion-propose'),
    'deep_improvement_common.promotion_authorized':
      mapping('deep_improvement_common.promotion_authorized', 'promotion', 'promotion-authorize'),
    'deep_improvement_common.promotion_denied':
      mapping('deep_improvement_common.promotion_denied', 'promotion', 'promotion-deny'),
    'deep_improvement_common.promotion_shadow_started':
      mapping('deep_improvement_common.promotion_shadow_started', 'promotion', 'promotion-shadow'),
    'deep_improvement_common.promotion_canary_started':
      mapping('deep_improvement_common.promotion_canary_started', 'promotion', 'promotion-canary'),
    'deep_improvement_common.promotion_paused':
      mapping('deep_improvement_common.promotion_paused', 'promotion', 'promotion-pause'),
    'deep_improvement_common.promotion_aborted':
      mapping('deep_improvement_common.promotion_aborted', 'promotion', 'promotion-abort'),
    'deep_improvement_common.promotion_baseline_restored':
      mapping('deep_improvement_common.promotion_baseline_restored', 'rollback', 'baseline-restore'),
    'deep_improvement_common.promotion_completed':
      mapping('deep_improvement_common.promotion_completed', 'promotion', 'promotion-complete'),
  });

export const DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP = EventStages;

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

const DIFF_CLASSES = Object.freeze([
  'artifact',
  'causal-link',
  'canary',
  'duplicated',
  'evaluator-integrity',
  'extra',
  'malformed',
  'missing',
  'nondeterministic',
  'payload',
  'projection',
  'promotion',
  'receipt',
  'reference-digest',
  'reordered',
  'stale',
  'telemetry-gap',
  'terminal-decision',
  'unauthorized',
  'unsupported-version',
] as const satisfies readonly DeepImprovementCommonParityDiffClass[]);

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED VALIDATION AND CANONICALIZATION
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

function validateParityFixtureShape(fixture: DeepImprovementCommonParityFixture): void {
  if (!isRecord(fixture) || !hasExactKeys(fixture, [
    'fixtureId',
    'scenario',
    'variant',
    'frozenInput',
    'events',
    'expectedTerminalDecision',
    'resumeEvidence',
  ])) {
    throw new TypeError('fixture must use the closed allowed-key set');
  }
  if (
    fixture.resumeEvidence !== null
    && (
      !isRecord(fixture.resumeEvidence)
      || !hasExactKeys(fixture.resumeEvidence, [
        'legacyDecision',
        'ledgerDecision',
        'legacyEventTailDigest',
        'ledgerEventTailDigest',
        'legacyFreshProjectionFingerprint',
        'ledgerFreshProjectionFingerprint',
      ])
    )
  ) {
    throw new TypeError('resumeEvidence must use the closed allowed-key set');
  }
}

function validateVolatilityBoundary(event: DeepImprovementCommonLedgerEvent): void {
  requireTimestamp(event.occurred_at, 'occurred_at');
  requireTimestamp(event.recorded_at, 'recorded_at');
  if (!TRANSPORT_TOKEN_PATTERN.test(event.correlation_id)) {
    throw new TypeError('correlation_id must use the closed transport-only token grammar');
  }
  if (
    Object.prototype.hasOwnProperty.call(event.payload, 'occurred_at')
    || Object.prototype.hasOwnProperty.call(event.payload, 'recorded_at')
    || Object.prototype.hasOwnProperty.call(event.payload, 'correlation_id')
  ) {
    throw new TypeError('volatile envelope fields cannot appear in the semantic payload');
  }
}

function scopeIdentity(event: DeepImprovementCommonLedgerEvent) {
  const scope = event.payload.scope;
  return Object.freeze({
    eventStem: event.payload.stem,
    runId: scope.runId,
    lineageId: scope.lineageId,
    variant: scope.variant,
    candidateId: 'candidateId' in scope ? String(scope.candidateId) : null,
    evaluationEpochId:
      'evaluationEpochId' in scope ? String(scope.evaluationEpochId) : null,
    fixtureId: 'fixtureId' in scope ? String(scope.fixtureId) : null,
    observationId: 'observationId' in scope ? String(scope.observationId) : null,
    canaryEpochId: 'canaryEpochId' in scope ? String(scope.canaryEpochId) : null,
    canarySuiteId: 'canarySuiteId' in scope ? String(scope.canarySuiteId) : null,
    promotionId: 'promotionId' in scope ? String(scope.promotionId) : null,
    baselineId: 'baselineId' in scope ? String(scope.baselineId) : null,
    producerSequence: event.stream_sequence,
  });
}

function logicalIdentityKey(
  value: DeepImprovementCommonParityEventObservation,
): string {
  return digest(value.logicalIdentity);
}

function logicalIdentityForEvent(event: DeepImprovementCommonLedgerEvent): string {
  return digest(scopeIdentity(event));
}

function receiptRefs(event: DeepImprovementCommonLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_improvement_common.run_resumed':
      return [event.payload.data.recoveryReceiptRef];
    case 'deep_improvement_common.candidate_generated':
      return [event.payload.data.generationReceiptRef];
    case 'deep_improvement_common.evaluation_started':
    case 'deep_improvement_common.evaluation_observation_recorded':
    case 'deep_improvement_common.canary_executed':
      return [event.payload.data.executionReceiptRef];
    case 'deep_improvement_common.evaluation_normalized':
      return [event.payload.data.normalizationReceiptRef];
    case 'deep_improvement_common.evaluation_verification_recorded':
      return [event.payload.data.verificationReceiptRef];
    case 'deep_improvement_common.evaluation_failed':
      return [event.payload.data.failureReceiptRef];
    case 'deep_improvement_common.canary_gate_passed':
    case 'deep_improvement_common.canary_gate_failed':
      return [event.payload.data.decisionReceiptRef];
    case 'deep_improvement_common.promotion_authorized':
      return [event.payload.data.authorizationReceiptRef];
    case 'deep_improvement_common.promotion_denied':
      return [event.payload.data.decisionReceiptRef];
    case 'deep_improvement_common.promotion_aborted':
      return [event.payload.data.decisionReceiptRef];
    case 'deep_improvement_common.promotion_baseline_restored':
      return [event.payload.data.restorationReceiptRef];
    case 'deep_improvement_common.promotion_completed':
      return [event.payload.data.completionReceiptRef];
    default:
      return [];
  }
}

function artifactRefs(event: DeepImprovementCommonLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_improvement_common.candidate_proposed':
      return [event.payload.data.proposalDigest, event.payload.data.targetDigest];
    case 'deep_improvement_common.candidate_generated':
      return [event.payload.data.candidateArtifactDigest];
    case 'deep_improvement_common.evaluation_epoch_sealed':
      return [event.payload.data.evaluatorCapsuleDigest, event.payload.data.fixtureSetDigest];
    case 'deep_improvement_common.evaluation_observation_recorded':
      return [event.payload.data.rawObservationDigest];
    case 'deep_improvement_common.evaluation_normalized':
      return [event.payload.data.observationSetDigest];
    case 'deep_improvement_common.evaluation_verification_recorded':
      return [event.payload.data.verificationEvidenceDigest];
    case 'deep_improvement_common.canary_suite_sealed':
      return [event.payload.data.suiteDigest, event.payload.data.protectedMaterialDigest];
    case 'deep_improvement_common.canary_executed':
      return [event.payload.data.canaryObservationDigest];
    case 'deep_improvement_common.canary_leak_detected':
      return [event.payload.data.leakEvidenceDigest];
    case 'deep_improvement_common.canary_drift_detected':
      return [event.payload.data.baselineDigest, event.payload.data.driftEvidenceDigest];
    case 'deep_improvement_common.canary_invariant_failed':
      return [event.payload.data.evidenceDigest];
    case 'deep_improvement_common.promotion_authorized':
      return [event.payload.data.externalAuthorizationDigest];
    case 'deep_improvement_common.promotion_denied':
      return [event.payload.data.externalDecisionDigest];
    case 'deep_improvement_common.promotion_shadow_started':
    case 'deep_improvement_common.promotion_canary_started':
      return [event.payload.data.rolloutDigest];
    case 'deep_improvement_common.promotion_baseline_restored':
      return [event.payload.data.baselineDigest];
    default:
      return [];
  }
}

function authorizationRefs(event: DeepImprovementCommonLedgerEvent): string[] {
  switch (event.payload.stem) {
    case 'deep_improvement_common.promotion_authorized':
      return [event.payload.data.externalAuthorizationRef];
    case 'deep_improvement_common.promotion_denied':
      return [event.payload.data.externalDecisionRef];
    default:
      return [];
  }
}

function terminalDecisionForEvent(
  event: DeepImprovementCommonLedgerEvent,
): DeepImprovementCommonTerminalDecision | null {
  switch (event.payload.stem) {
    case 'deep_improvement_common.run_paused':
      return 'paused';
    case 'deep_improvement_common.run_aborted':
      return 'aborted';
    case 'deep_improvement_common.run_quarantined':
      return 'quarantined';
    case 'deep_improvement_common.run_completed':
      return event.payload.data.sessionOutcome === 'rolledBack'
        ? 'rolled-back'
        : event.payload.data.sessionOutcome === 'promoted'
          ? 'shipped'
          : 'completed';
    case 'deep_improvement_common.evaluation_inconclusive':
      return 'inconclusive';
    case 'deep_improvement_common.canary_vetoed':
    case 'deep_improvement_common.promotion_denied':
      return 'blocked';
    case 'deep_improvement_common.promotion_baseline_restored':
      return 'rolled-back';
    case 'deep_improvement_common.promotion_completed':
      return 'shipped';
    default:
      return null;
  }
}

function canonicalObservation(
  event: DeepImprovementCommonLedgerEvent,
  projectionFingerprint: string,
  identitiesByRawId: ReadonlyMap<string, string>,
): DeepImprovementCommonParityEventObservation {
  validateVolatilityBoundary(event);
  return Object.freeze({
    eventId: event.event_id,
    eventType: event.event_type,
    logicalIdentity: scopeIdentity(event),
    stepKey: EventStages[event.payload.stem].stepKey,
    producerSequence: event.stream_sequence,
    causalLogicalIdentity: event.causation_id === null
      ? null
      : identitiesByRawId.get(event.causation_id) ?? digest({
        unresolvedCausation: event.causation_id,
      }),
    stablePayloadDigest: event.payload.payloadDigest,
    projectionFingerprint,
    receiptRefs: Object.freeze(sortedUnique(receiptRefs(event))),
    artifactRefs: Object.freeze(sortedUnique(artifactRefs(event))),
    authorizationRefs: Object.freeze(sortedUnique(authorizationRefs(event))),
    terminalDecision: terminalDecisionForEvent(event),
  });
}

/** Canonicalize a verified stream without adopting raw transport identities. */
export function canonicalizeDeepImprovementCommonEventStream(
  events: readonly DeepImprovementCommonLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly DeepImprovementCommonParityEventObservation[] {
  if (events.length !== projectionFingerprints.length) {
    throw new TypeError('Every event requires one resulting projection fingerprint');
  }
  const identitiesByRawId = new Map(events.map(
    (event) => [event.event_id, logicalIdentityForEvent(event)],
  ));
  return Object.freeze(events.map((event, index) => canonicalObservation(
    event,
    requireDigest(projectionFingerprints[index], `projectionFingerprints[${index}]`),
    identitiesByRawId,
  )));
}

/** Prove the lifecycle map is an exact closure over the typed event namespace. */
export function verifyDeepImprovementCommonLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...DeepImprovementCommonEventStems].sort();
  if (
    mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])
  ) {
    throw new TypeError('Deep Improvement Common lifecycle mapping must close every event stem');
  }
  for (const stem of DeepImprovementCommonEventStems) {
    const entry = EventStages[stem];
    requireToken(entry.stepKey, `${stem}.stepKey`);
    if (entry.wireEventType !== DeepImprovementCommonWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. DISTINCT LEGACY ORACLE AND REAL LEDGER PROJECTION
// ───────────────────────────────────────────────────────────────────

function emptyProjection(): DeepImprovementCommonParityProjection {
  return Object.freeze({
    runId: null,
    lineageId: null,
    variant: null,
    generation: 0,
    runState: 'planned',
    candidates: Object.freeze([]),
    evaluatorEpochs: Object.freeze([]),
    rawObservations: Object.freeze([]),
    scores: Object.freeze([]),
    canaries: Object.freeze([]),
    promotions: Object.freeze([]),
    hardVetoes: Object.freeze([]),
    evaluationBudgetRefs: Object.freeze([]),
    unresolvedEvidenceRefs: Object.freeze([]),
    rollbackTargetBaselineId: null,
    stopReason: null,
    sessionOutcome: null,
    terminalDecision: 'active',
    resumeDecisionDigest: null,
  });
}

function resumeSemanticView(decision: DeepImprovementCommonResumeDecision): JsonValue {
  return {
    disposition: decision.disposition,
    compatibilityOutcome: decision.compatibilityOutcome,
    priorCertificateVerdict: decision.priorCertificateVerdict,
    offlineVerificationVerdict: decision.offlineVerificationVerdict,
    compatibility: [...decision.compatibility].map((entry) => ({
      component: entry.component,
      persistedVersion: entry.persistedVersion,
      persistedDigest: entry.persistedDigest,
      installedVersion: entry.installedVersion,
      installedDigest: entry.installedDigest,
      outcome: entry.outcome,
      revision: entry.revision,
    })).sort((left, right) => left.component.localeCompare(right.component)),
    branches: [...decision.branches].map((entry) => ({
      logicalOperationId: entry.logicalOperationId,
      operationKind: entry.operationKind,
      receiptIdentityDigest: entry.receiptIdentityDigest,
      disposition: entry.disposition,
      evidenceEventIds: sortedUnique(entry.evidenceEventIds),
    })).sort((left, right) => left.logicalOperationId.localeCompare(right.logicalOperationId)),
    effects: [...decision.effects].map((entry) => ({
      effectId: entry.effectId,
      logicalEffectId: entry.logicalEffectId,
      applicationState: entry.applicationState,
      disposition: entry.disposition,
      intentEventId: entry.intentEventId,
      evidenceRefs: sortedUnique(entry.evidenceRefs),
    })).sort((left, right) => left.effectId.localeCompare(right.effectId)),
    invalidation: decision.invalidation,
    lease: decision.lease,
  } as unknown as JsonValue;
}

function legacyResumeProjectionSemanticView(
  projection: DeepImprovementCommonParityProjection,
): JsonValue {
  return {
    runId: projection.runId,
    lineageId: projection.lineageId,
    variant: projection.variant,
    generation: projection.generation,
    runState: projection.runState,
    candidateIds: projection.candidates.map((entry) => entry.candidateId).sort(),
    evaluatorEpochIds: projection.evaluatorEpochs.map(
      (entry) => entry.evaluationEpochId,
    ).sort(),
    canaryEpochIds: projection.canaries.map((entry) => entry.canaryEpochId).sort(),
    promotionIds: projection.promotions.map((entry) => entry.promotionId).sort(),
    hardVetoCodes: projection.hardVetoes.map((entry) => entry.vetoCode).sort(),
    terminalDecision: projection.terminalDecision,
  } as unknown as JsonValue;
}

function ledgerResumeProjectionSemanticView(
  projection: DeepImprovementCommonProjectionState,
): JsonValue {
  return {
    runId: projection.run.runId,
    lineageId: projection.run.lineageId,
    variant: projection.run.variant,
    generation: projection.run.generation,
    runState: projection.run.state,
    candidateIds: projection.iterationConvergence.candidates.map(
      (entry) => entry.candidateId,
    ).sort(),
    evaluatorEpochIds: projection.iterationConvergence.evaluatorEpochs.map(
      (entry) => entry.evaluationEpochId,
    ).sort(),
    canaryEpochIds: projection.iterationConvergence.canaries.map(
      (entry) => entry.canaryEpochId,
    ).sort(),
    promotionIds: projection.iterationConvergence.promotions.map(
      (entry) => entry.promotionId,
    ).sort(),
    hardVetoCodes: projection.iterationConvergence.hardVetoes.map(
      (entry) => entry.vetoCode,
    ).sort(),
    terminalDecision: terminalFromProjectionFacts(
      projection.run.state,
      projection.iterationConvergence.sessionOutcome,
      projection.iterationConvergence.hardVetoes,
      projection.iterationConvergence.convergenceDisposition === 'inconclusive',
    ),
  } as unknown as JsonValue;
}

function resumeDecisionDigest(
  evidence: DeepImprovementCommonResumeParityEvidence | null,
  path: 'ledger' | 'legacy',
): string | null {
  if (evidence === null) return null;
  const decision = parseDeepImprovementCommonResumeDecision(
    path === 'legacy' ? evidence.legacyDecision : evidence.ledgerDecision,
  );
  return digest({
    decision: resumeSemanticView(decision),
    eventTailDigest: path === 'legacy'
      ? evidence.legacyEventTailDigest
      : evidence.ledgerEventTailDigest,
    freshProjectionFingerprint: path === 'legacy'
      ? evidence.legacyFreshProjectionFingerprint
      : evidence.ledgerFreshProjectionFingerprint,
  });
}

function candidateFor(
  candidates: Map<string, DeepImprovementCommonParityCandidate>,
  candidateId: string,
): DeepImprovementCommonParityCandidate | undefined {
  return candidates.get(candidateId);
}

function setCandidateStage(
  candidates: Map<string, DeepImprovementCommonParityCandidate>,
  candidateId: string,
  stage: DeepImprovementCommonParityCandidate['stage'],
): void {
  const current = candidateFor(candidates, candidateId);
  if (current !== undefined) candidates.set(candidateId, { ...current, stage });
}

function upsertCanary(
  canaries: Map<string, DeepImprovementCommonParityCanary>,
  key: string,
  value: DeepImprovementCommonParityCanary,
): void {
  canaries.set(key, Object.freeze(value));
}

function upsertPromotion(
  promotions: Map<string, DeepImprovementCommonParityPromotion>,
  promotionId: string,
  update: Partial<DeepImprovementCommonParityPromotion>
    & Pick<DeepImprovementCommonParityPromotion, 'candidateId' | 'baselineId'>,
): void {
  const prior = promotions.get(promotionId);
  promotions.set(promotionId, Object.freeze({
    promotionId,
    candidateId: update.candidateId,
    baselineId: update.baselineId,
    stage: update.stage ?? prior?.stage ?? 'not-proposed',
    requestedRollout: update.requestedRollout ?? prior?.requestedRollout ?? null,
    externalAuthorizationRef:
      update.externalAuthorizationRef ?? prior?.externalAuthorizationRef ?? null,
    rollbackTargetBaselineId:
      update.rollbackTargetBaselineId ?? prior?.rollbackTargetBaselineId ?? null,
    receiptRefs: Object.freeze(sortedUnique([
      ...(prior?.receiptRefs ?? []),
      ...(update.receiptRefs ?? []),
    ])),
  }));
}

function terminalFromProjectionFacts(
  runState: DeepImprovementCommonParityProjection['runState'],
  sessionOutcome: string | null,
  hardVetoes: readonly DeepImprovementCommonParityVeto[],
  hasInconclusive: boolean,
): DeepImprovementCommonTerminalDecision {
  if (runState === 'quarantined') return 'quarantined';
  if (runState === 'aborted') return 'aborted';
  if (sessionOutcome === 'rolledBack') return 'rolled-back';
  if (sessionOutcome === 'promoted') return 'shipped';
  if (runState === 'completed') return 'completed';
  if (runState === 'paused') return 'paused';
  if (hardVetoes.length > 0) return 'blocked';
  if (hasInconclusive) return 'inconclusive';
  return 'active';
}

/**
 * Model the legacy emitter from its event contract. This implementation never
 * calls the typed reducer and therefore remains an independent behavior oracle.
 */
function legacyProjection(
  events: readonly DeepImprovementCommonLedgerEvent[],
  resumeEvidence: DeepImprovementCommonResumeParityEvidence | null,
): DeepImprovementCommonParityProjection {
  if (events.length === 0) return emptyProjection();
  let runId: string | null = null;
  let lineageId: string | null = null;
  let variant: DeepImprovementCommonParityProjection['variant'] = null;
  let generation = 0;
  let runState: DeepImprovementCommonParityProjection['runState'] = 'planned';
  let rollbackTargetBaselineId: string | null = null;
  let stopReason: string | null = null;
  let sessionOutcome: string | null = null;
  let hasInconclusive = false;
  const candidates = new Map<string, DeepImprovementCommonParityCandidate>();
  const evaluatorEpochs = new Map<string, DeepImprovementCommonParityEvaluatorEpoch>();
  const rawObservations = new Map<string, DeepImprovementCommonParityRawObservation>();
  const scores = new Map<string, DeepImprovementCommonParityScore>();
  const canaries = new Map<string, DeepImprovementCommonParityCanary>();
  const promotions = new Map<string, DeepImprovementCommonParityPromotion>();
  const hardVetoes: DeepImprovementCommonParityVeto[] = [];
  const evaluationBudgetRefs = new Set<string>();
  const unresolvedEvidenceRefs = new Set<string>();

  for (const event of events) {
    const scope = event.payload.scope;
    runId = scope.runId;
    lineageId = scope.lineageId;
    variant = scope.variant;
    switch (event.payload.stem) {
      case 'deep_improvement_common.run_started':
        generation = event.payload.data.generation;
        runState = 'active';
        break;
      case 'deep_improvement_common.run_resumed':
        generation = event.payload.data.generation;
        runState = 'active';
        break;
      case 'deep_improvement_common.run_paused':
        runState = 'paused';
        break;
      case 'deep_improvement_common.run_completed':
        runState = event.payload.data.terminalOutcome === 'quarantined'
          ? 'quarantined'
          : event.payload.data.terminalOutcome === 'aborted'
            ? 'aborted'
            : 'completed';
        stopReason = event.payload.data.stopReason;
        sessionOutcome = event.payload.data.sessionOutcome;
        break;
      case 'deep_improvement_common.run_aborted':
        runState = 'aborted';
        break;
      case 'deep_improvement_common.run_quarantined':
        runState = 'quarantined';
        break;
      case 'deep_improvement_common.candidate_proposed':
        candidates.set(String(scope.candidateId), Object.freeze({
          candidateId: String(scope.candidateId),
          parentCandidateId: event.payload.data.parentCandidateId,
          proposalDigest: event.payload.data.proposalDigest,
          candidateArtifactDigest: null,
          stage: 'proposed',
        }));
        break;
      case 'deep_improvement_common.candidate_generated': {
        const current = candidateFor(candidates, String(scope.candidateId));
        if (current !== undefined) {
          candidates.set(String(scope.candidateId), Object.freeze({
            ...current,
            candidateArtifactDigest: event.payload.data.candidateArtifactDigest,
            stage: 'generated',
          }));
        }
        break;
      }
      case 'deep_improvement_common.candidate_rejected':
        setCandidateStage(candidates, String(scope.candidateId), 'rejected');
        break;
      case 'deep_improvement_common.candidate_lineage_attached': {
        const current = candidateFor(candidates, String(scope.candidateId));
        if (current !== undefined) {
          candidates.set(String(scope.candidateId), Object.freeze({
            ...current,
            parentCandidateId: event.payload.data.parentCandidateId,
          }));
        }
        break;
      }
      case 'deep_improvement_common.evaluation_epoch_sealed':
        evaluatorEpochs.set(String(scope.evaluationEpochId), Object.freeze({
          evaluationEpochId: String(scope.evaluationEpochId),
          candidateId: String(scope.candidateId),
          evaluatorRef: event.payload.data.evaluatorRef,
          evaluatorCapsuleDigest: event.payload.data.evaluatorCapsuleDigest,
          fixtureSetRef: event.payload.data.fixtureSetRef,
          fixtureSetDigest: event.payload.data.fixtureSetDigest,
          scorePolicyVersion: event.payload.data.scorePolicyVersion,
          evaluationBudgetRef: event.payload.data.evaluationBudgetRef,
        }));
        evaluationBudgetRefs.add(event.payload.data.evaluationBudgetRef);
        setCandidateStage(candidates, String(scope.candidateId), 'evaluating');
        break;
      case 'deep_improvement_common.evaluation_started':
        setCandidateStage(candidates, String(scope.candidateId), 'evaluating');
        break;
      case 'deep_improvement_common.evaluation_observation_recorded':
        rawObservations.set(String(scope.observationId), Object.freeze({
          candidateId: String(scope.candidateId),
          evaluationEpochId: String(scope.evaluationEpochId),
          fixtureId: String(scope.fixtureId),
          observationId: String(scope.observationId),
          evaluatorRef: event.payload.data.evaluatorRef,
          fixtureRef: event.payload.data.fixtureRef,
          rawObservationRef: event.payload.data.rawObservationRef,
          rawObservationDigest: event.payload.data.rawObservationDigest,
          executionReceiptRef: event.payload.data.executionReceiptRef,
          observationOutcome: event.payload.data.observationOutcome,
        }));
        break;
      case 'deep_improvement_common.evaluation_normalized':
        scores.set(String(scope.evaluationEpochId), Object.freeze({
          candidateId: String(scope.candidateId),
          evaluationEpochId: String(scope.evaluationEpochId),
          observationEventIds: Object.freeze(sortedUnique(
            event.payload.data.observationEventIds,
          )),
          observationSetDigest: event.payload.data.observationSetDigest,
          scorePolicyVersion: event.payload.data.scorePolicyVersion,
          scorerFingerprint: event.payload.data.scorerFingerprint,
          scoreVector: event.payload.data.scoreVector,
          normalizationReceiptRef: event.payload.data.normalizationReceiptRef,
        }));
        setCandidateStage(candidates, String(scope.candidateId), 'scored');
        break;
      case 'deep_improvement_common.evaluation_verification_recorded':
        if (event.payload.data.verificationOutcome === 'confirmed') {
          setCandidateStage(candidates, String(scope.candidateId), 'verified');
        } else {
          hasInconclusive = event.payload.data.verificationOutcome === 'inconclusive';
          setCandidateStage(candidates, String(scope.candidateId), 'inconclusive');
          if (event.payload.data.verificationOutcome === 'disputed') {
            hardVetoes.push(Object.freeze({
              candidateId: String(scope.candidateId),
              vetoCode: 'evaluator-integrity-disputed',
              source: 'evaluator-integrity',
              evidenceRef: event.payload.data.verificationEvidenceRef,
              evidenceDigest: event.payload.data.verificationEvidenceDigest,
            }));
          }
        }
        break;
      case 'deep_improvement_common.evaluation_inconclusive':
        hasInconclusive = true;
        setCandidateStage(candidates, String(scope.candidateId), 'inconclusive');
        event.payload.data.evidenceRefs.forEach((entry) => unresolvedEvidenceRefs.add(entry));
        break;
      case 'deep_improvement_common.evaluation_failed':
        setCandidateStage(candidates, String(scope.candidateId), 'failed');
        unresolvedEvidenceRefs.add(event.payload.data.failureReceiptRef);
        break;
      case 'deep_improvement_common.canary_suite_sealed': {
        const key = `${String(scope.canaryEpochId)}:${String(scope.canarySuiteId)}`;
        upsertCanary(canaries, key, {
          candidateId: String(scope.candidateId),
          canaryEpochId: String(scope.canaryEpochId),
          canarySuiteId: String(scope.canarySuiteId),
          stage: 'sealed',
          suiteDigest: event.payload.data.suiteDigest,
          observationDigests: Object.freeze([]),
          decisionReceiptRefs: Object.freeze([]),
        });
        break;
      }
      case 'deep_improvement_common.canary_executed': {
        const key = `${String(scope.canaryEpochId)}:${String(scope.canarySuiteId)}`;
        const prior = canaries.get(key);
        if (prior !== undefined) {
          upsertCanary(canaries, key, {
            ...prior,
            stage: 'executed',
            observationDigests: Object.freeze(sortedUnique([
              ...prior.observationDigests,
              event.payload.data.canaryObservationDigest,
            ])),
            decisionReceiptRefs: Object.freeze(sortedUnique([
              ...prior.decisionReceiptRefs,
              event.payload.data.executionReceiptRef,
            ])),
          });
        }
        break;
      }
      case 'deep_improvement_common.canary_gate_passed':
      case 'deep_improvement_common.canary_gate_failed': {
        const key = `${String(scope.canaryEpochId)}:${String(scope.canarySuiteId)}`;
        const prior = canaries.get(key);
        if (prior !== undefined) {
          upsertCanary(canaries, key, {
            ...prior,
            stage: event.payload.stem === 'deep_improvement_common.canary_gate_passed'
              ? 'passed'
              : 'failed',
            decisionReceiptRefs: Object.freeze(sortedUnique([
              ...prior.decisionReceiptRefs,
              event.payload.data.decisionReceiptRef,
            ])),
          });
        }
        break;
      }
      case 'deep_improvement_common.canary_leak_detected':
        hardVetoes.push(Object.freeze({
          candidateId: String(scope.candidateId),
          vetoCode: event.payload.data.reasonCode,
          source: 'canary',
          evidenceRef: event.payload.data.leakEvidenceRef,
          evidenceDigest: event.payload.data.leakEvidenceDigest,
        }));
        break;
      case 'deep_improvement_common.canary_drift_detected':
        hardVetoes.push(Object.freeze({
          candidateId: String(scope.candidateId),
          vetoCode: 'canary-drift',
          source: 'canary',
          evidenceRef: event.payload.data.driftEvidenceRef,
          evidenceDigest: event.payload.data.driftEvidenceDigest,
        }));
        break;
      case 'deep_improvement_common.canary_invariant_failed':
        hardVetoes.push(Object.freeze({
          candidateId: String(scope.candidateId),
          vetoCode: event.payload.data.invariantCode,
          source: 'canary',
          evidenceRef: event.payload.data.evidenceRef,
          evidenceDigest: event.payload.data.evidenceDigest,
        }));
        break;
      case 'deep_improvement_common.canary_vetoed': {
        const key = `${String(scope.canaryEpochId)}:${String(scope.canarySuiteId)}`;
        const prior = canaries.get(key);
        if (prior !== undefined) upsertCanary(canaries, key, { ...prior, stage: 'vetoed' });
        hardVetoes.push(Object.freeze({
          candidateId: String(scope.candidateId),
          vetoCode: event.payload.data.vetoReasonCode,
          source: 'canary',
          evidenceRef: event.payload.data.vetoEvidenceRef,
          evidenceDigest: event.payload.data.vetoEvidenceDigest,
        }));
        break;
      }
      case 'deep_improvement_common.promotion_proposed':
        rollbackTargetBaselineId = String(scope.baselineId);
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'proposed',
          requestedRollout: event.payload.data.requestedRollout,
        });
        break;
      case 'deep_improvement_common.promotion_authorized':
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'authorized',
          externalAuthorizationRef: event.payload.data.externalAuthorizationRef,
          receiptRefs: [event.payload.data.authorizationReceiptRef],
        });
        break;
      case 'deep_improvement_common.promotion_denied':
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'denied',
          externalAuthorizationRef: event.payload.data.externalDecisionRef,
          receiptRefs: [event.payload.data.decisionReceiptRef],
        });
        hardVetoes.push(Object.freeze({
          candidateId: String(scope.candidateId),
          vetoCode: event.payload.data.denialReasonCode,
          source: 'promotion',
          evidenceRef: event.payload.data.externalDecisionRef,
          evidenceDigest: event.payload.data.externalDecisionDigest,
        }));
        break;
      case 'deep_improvement_common.promotion_shadow_started':
      case 'deep_improvement_common.promotion_canary_started':
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: event.payload.stem === 'deep_improvement_common.promotion_shadow_started'
            ? 'shadow'
            : 'canary',
        });
        break;
      case 'deep_improvement_common.promotion_paused':
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'paused',
        });
        break;
      case 'deep_improvement_common.promotion_aborted':
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'aborted',
          rollbackTargetBaselineId: event.payload.data.restorationRequired
            ? String(scope.baselineId)
            : null,
          receiptRefs: [event.payload.data.decisionReceiptRef],
        });
        if (event.payload.data.restorationRequired) rollbackTargetBaselineId = String(scope.baselineId);
        break;
      case 'deep_improvement_common.promotion_baseline_restored':
        rollbackTargetBaselineId = String(scope.baselineId);
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'rolled-back',
          rollbackTargetBaselineId: String(scope.baselineId),
          receiptRefs: [event.payload.data.restorationReceiptRef],
        });
        break;
      case 'deep_improvement_common.promotion_completed':
        upsertPromotion(promotions, String(scope.promotionId), {
          candidateId: String(scope.candidateId),
          baselineId: String(scope.baselineId),
          stage: 'shipped',
          receiptRefs: [event.payload.data.completionReceiptRef],
        });
        break;
      default:
        break;
    }
  }

  const sortedVetoes = [...hardVetoes].sort((left, right) => (
    left.candidateId.localeCompare(right.candidateId)
    || left.vetoCode.localeCompare(right.vetoCode)
  ));
  return Object.freeze({
    runId,
    lineageId,
    variant,
    generation,
    runState,
    candidates: Object.freeze([...candidates.values()].sort(
      (left, right) => left.candidateId.localeCompare(right.candidateId),
    )),
    evaluatorEpochs: Object.freeze([...evaluatorEpochs.values()].sort(
      (left, right) => left.evaluationEpochId.localeCompare(right.evaluationEpochId),
    )),
    rawObservations: Object.freeze([...rawObservations.values()].sort(
      (left, right) => left.observationId.localeCompare(right.observationId),
    )),
    scores: Object.freeze([...scores.values()].sort(
      (left, right) => left.evaluationEpochId.localeCompare(right.evaluationEpochId),
    )),
    canaries: Object.freeze([...canaries.values()].sort((left, right) => (
      left.canaryEpochId.localeCompare(right.canaryEpochId)
      || left.canarySuiteId.localeCompare(right.canarySuiteId)
    ))),
    promotions: Object.freeze([...promotions.values()].sort(
      (left, right) => left.promotionId.localeCompare(right.promotionId),
    )),
    hardVetoes: Object.freeze(sortedVetoes),
    evaluationBudgetRefs: Object.freeze(sortedUnique([...evaluationBudgetRefs])),
    unresolvedEvidenceRefs: Object.freeze(sortedUnique([...unresolvedEvidenceRefs])),
    rollbackTargetBaselineId,
    stopReason,
    sessionOutcome,
    terminalDecision: terminalFromProjectionFacts(
      runState,
      sessionOutcome,
      sortedVetoes,
      hasInconclusive,
    ),
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'deep_improvement_common.run_resumed',
    ) ? resumeDecisionDigest(resumeEvidence, 'legacy') : null,
  });
}

function ledgerCanaryDetails(
  events: readonly DeepImprovementCommonLedgerEvent[],
  record: DeepImprovementCommonProjectionState['iterationConvergence']['canaries'][number],
): Pick<
  DeepImprovementCommonParityCanary,
  'suiteDigest' | 'observationDigests' | 'decisionReceiptRefs'
> {
  const matching = events.filter((event) => (
    'canaryEpochId' in event.payload.scope
    && String(event.payload.scope.canaryEpochId) === record.canaryEpochId
    && String(event.payload.scope.canarySuiteId) === record.canarySuiteId
  ));
  const sealed = matching.find(
    (event) => event.payload.stem === 'deep_improvement_common.canary_suite_sealed',
  );
  return {
    suiteDigest: sealed?.payload.stem === 'deep_improvement_common.canary_suite_sealed'
      ? sealed.payload.data.suiteDigest
      : digest({ missingSuite: record.canarySuiteId }),
    observationDigests: Object.freeze(sortedUnique(matching.flatMap((event) => (
      event.payload.stem === 'deep_improvement_common.canary_executed'
        ? [event.payload.data.canaryObservationDigest]
        : []
    )))),
    decisionReceiptRefs: Object.freeze(sortedUnique(matching.flatMap((event) => (
      event.payload.stem === 'deep_improvement_common.canary_executed'
        ? [event.payload.data.executionReceiptRef]
        : event.payload.stem === 'deep_improvement_common.canary_gate_passed'
          || event.payload.stem === 'deep_improvement_common.canary_gate_failed'
          ? [event.payload.data.decisionReceiptRef]
          : []
    )))),
  };
}

function ledgerPromotionDetails(
  events: readonly DeepImprovementCommonLedgerEvent[],
  record: DeepImprovementCommonProjectionState['iterationConvergence']['promotions'][number],
): Pick<
  DeepImprovementCommonParityPromotion,
  'externalAuthorizationRef' | 'rollbackTargetBaselineId' | 'receiptRefs'
> {
  const matching = events.filter((event) => (
    'promotionId' in event.payload.scope
    && String(event.payload.scope.promotionId) === record.promotionId
  ));
  const authorized = matching.find(
    (event) => event.payload.stem === 'deep_improvement_common.promotion_authorized',
  );
  const denied = matching.find(
    (event) => event.payload.stem === 'deep_improvement_common.promotion_denied',
  );
  const restored = matching.find(
    (event) => event.payload.stem === 'deep_improvement_common.promotion_baseline_restored',
  );
  return {
    externalAuthorizationRef:
      authorized?.payload.stem === 'deep_improvement_common.promotion_authorized'
        ? authorized.payload.data.externalAuthorizationRef
        : denied?.payload.stem === 'deep_improvement_common.promotion_denied'
          ? denied.payload.data.externalDecisionRef
          : null,
    rollbackTargetBaselineId: restored === undefined ? null : record.baselineId,
    receiptRefs: Object.freeze(sortedUnique(matching.flatMap(receiptRefs))),
  };
}

/** Translate the real typed reducer projection into the protected parity surface. */
function ledgerProjection(
  events: readonly DeepImprovementCommonLedgerEvent[],
  resumeEvidence: DeepImprovementCommonResumeParityEvidence | null,
): DeepImprovementCommonParityProjection {
  if (events.length === 0) return emptyProjection();
  const folded = foldDeepImprovementCommonEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Ledger projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  const projection = folded.projection;
  const stages = new Map(projection.iterationConvergence.candidates.map(
    (candidate) => [candidate.candidateId, candidate.stage],
  ));
  const hasInconclusive = projection.iterationConvergence.convergenceDisposition
    === 'inconclusive';
  const vetoes: DeepImprovementCommonParityVeto[] =
    projection.iterationConvergence.hardVetoes.map((entry) => ({
      candidateId: entry.candidateId,
      vetoCode: entry.vetoCode,
      source: entry.source,
      evidenceRef: entry.evidenceRef,
      evidenceDigest: entry.evidenceDigest,
    }));
  const statuses = projection.modeStatus.statuses.filter(
    (status) => status.workstream !== 'deep-improvement-common',
  );
  const rollbackTargetBaselineId = statuses.find(
    (status) => status.rollbackTargetBaselineId !== null,
  )?.rollbackTargetBaselineId ?? null;
  const terminalDecision = terminalFromProjectionFacts(
    projection.run.state,
    projection.iterationConvergence.sessionOutcome,
    vetoes,
    hasInconclusive,
  );
  return Object.freeze({
    runId: projection.run.runId,
    lineageId: projection.run.lineageId,
    variant: projection.run.variant,
    generation: projection.run.generation,
    runState: projection.run.state,
    candidates: Object.freeze(projection.artifactIndex.candidates.map((candidate) => ({
      candidateId: candidate.candidateId,
      parentCandidateId: candidate.parentCandidateId,
      proposalDigest: candidate.proposalDigest,
      candidateArtifactDigest: candidate.candidateArtifactDigest,
      stage: stages.get(candidate.candidateId) ?? 'proposed',
    })).sort((left, right) => left.candidateId.localeCompare(right.candidateId))),
    evaluatorEpochs: Object.freeze(projection.iterationConvergence.evaluatorEpochs.map(
      (epoch) => ({
        evaluationEpochId: epoch.evaluationEpochId,
        candidateId: epoch.candidateId,
        evaluatorRef: epoch.evaluatorRef,
        evaluatorCapsuleDigest: epoch.evaluatorCapsuleDigest,
        fixtureSetRef: epoch.fixtureSetRef,
        fixtureSetDigest: epoch.fixtureSetDigest,
        scorePolicyVersion: epoch.scorePolicyVersion,
        evaluationBudgetRef: epoch.evaluationBudgetRef,
      }),
    ).sort((left, right) => (
      left.evaluationEpochId.localeCompare(right.evaluationEpochId)
    ))),
    rawObservations: Object.freeze(projection.artifactIndex.rawObservations.map(
      (entry) => ({
        candidateId: entry.candidateId,
        evaluationEpochId: entry.evaluationEpochId,
        fixtureId: entry.fixtureId,
        observationId: entry.observationId,
        evaluatorRef: entry.evaluatorRef,
        fixtureRef: entry.fixtureRef,
        rawObservationRef: entry.rawObservationRef,
        rawObservationDigest: entry.rawObservationDigest,
        executionReceiptRef: entry.executionReceiptRef,
        observationOutcome: entry.observationOutcome,
      }),
    ).sort((left, right) => left.observationId.localeCompare(right.observationId))),
    scores: Object.freeze(projection.artifactIndex.derivedScores.map((entry) => ({
      candidateId: entry.candidateId,
      evaluationEpochId: entry.evaluationEpochId,
      observationEventIds: Object.freeze(sortedUnique(entry.observationEventIds)),
      observationSetDigest: entry.observationSetDigest,
      scorePolicyVersion: entry.scorePolicyVersion,
      scorerFingerprint: entry.scorerFingerprint,
      scoreVector: entry.scoreVector,
      normalizationReceiptRef: entry.normalizationReceiptRef,
    })).sort((left, right) => (
      left.evaluationEpochId.localeCompare(right.evaluationEpochId)
    ))),
    canaries: Object.freeze(projection.iterationConvergence.canaries.map((record) => ({
      candidateId: record.candidateId,
      canaryEpochId: record.canaryEpochId,
      canarySuiteId: record.canarySuiteId,
      stage: record.stage,
      ...ledgerCanaryDetails(events, record),
    })).sort((left, right) => (
      left.canaryEpochId.localeCompare(right.canaryEpochId)
      || left.canarySuiteId.localeCompare(right.canarySuiteId)
    ))),
    promotions: Object.freeze(projection.iterationConvergence.promotions.map((record) => ({
      promotionId: record.promotionId,
      candidateId: record.candidateId,
      baselineId: record.baselineId,
      stage: record.stage,
      requestedRollout: record.requestedRollout,
      ...ledgerPromotionDetails(events, record),
    })).sort((left, right) => left.promotionId.localeCompare(right.promotionId))),
    hardVetoes: Object.freeze(vetoes.sort((left, right) => (
      left.candidateId.localeCompare(right.candidateId)
      || left.vetoCode.localeCompare(right.vetoCode)
    ))),
    evaluationBudgetRefs: Object.freeze(sortedUnique(
      projection.iterationConvergence.evaluationBudgetRefs,
    )),
    unresolvedEvidenceRefs: Object.freeze(sortedUnique(
      projection.iterationConvergence.unresolvedEvidenceRefs,
    )),
    rollbackTargetBaselineId,
    stopReason: projection.iterationConvergence.stopReason,
    sessionOutcome: projection.iterationConvergence.sessionOutcome,
    terminalDecision,
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'deep_improvement_common.run_resumed',
    ) ? resumeDecisionDigest(resumeEvidence, 'ledger') : null,
  });
}

function replayState(
  events: readonly DeepImprovementCommonLedgerEvent[],
  fixture: DeepImprovementCommonParityFixture,
  path: 'ledger' | 'legacy',
): DeepImprovementCommonParityReplayState {
  const projection = path === 'legacy'
    ? legacyProjection(events, fixture.resumeEvidence)
    : ledgerProjection(events, fixture.resumeEvidence);
  const projectionFingerprint = digest(projection);
  const priorFingerprints = events.map((_, index) => {
    const prefix = events.slice(0, index + 1);
    return digest(path === 'legacy'
      ? legacyProjection(prefix, fixture.resumeEvidence)
      : ledgerProjection(prefix, fixture.resumeEvidence));
  });
  const observations = canonicalizeDeepImprovementCommonEventStream(
    events,
    priorFingerprints,
  );
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map(
      (observation) => JSON.stringify(observation),
    )),
  }) as unknown as DeepImprovementCommonParityReplayState;
}

function replayObservations(
  state: DeepImprovementCommonParityReplayState,
): readonly DeepImprovementCommonParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as DeepImprovementCommonParityEventObservation,
  ));
}

function replayProjection(
  state: DeepImprovementCommonParityReplayState,
): DeepImprovementCommonParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as DeepImprovementCommonParityProjection;
}

// ───────────────────────────────────────────────────────────────────
// 4. RESUME ORACLE AND LEASE CONTINUITY
// ───────────────────────────────────────────────────────────────────

function resumeRequestDigest(request: DeepImprovementCommonResumeRequest): string {
  return digest({
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
  });
}

function modeledLegacyResumeDecision(
  request: DeepImprovementCommonResumeRequest,
): DeepImprovementCommonResumeDecision {
  const requestCommitment = resumeRequestDigest(request);
  const body = Object.freeze({
    decisionVersion: 1 as const,
    decisionId: `legacy-resume-${digest({
      runId: request.runId,
      idempotencyKey: request.idempotencyKey,
      requestCommitment,
    }).slice(0, 40)}`,
    idempotencyKey: request.idempotencyKey,
    requestDigest: requestCommitment,
    authority: 'dark-evidence-only' as const,
    legacyAuthority: 'unchanged' as const,
    productionCompletion: false as const,
    disposition: 'blocked' as const,
    compatibilityOutcome: 'blocked' as const,
    priorCertificateVerdict:
      request.priorRunBundle.certificate?.body.verdict ?? null,
    offlineVerificationVerdict: 'unverifiable' as const,
    persistedFingerprint: null,
    currentFingerprint: null,
    compatibility: Object.freeze([]),
    branches: Object.freeze([]),
    effects: Object.freeze([]),
    invalidation: Object.freeze({
      changedComponents: Object.freeze([]),
      invalidatedOperationIds: Object.freeze([]),
      recoveryRequiredEffectIds: Object.freeze([]),
      rebuildRequired: true,
    }),
    lease: request.lease,
    decisionReason:
      'The modeled legacy journal blocks continuation until its certificate is independently verified.',
  });
  return parseDeepImprovementCommonResumeDecision(Object.freeze({
    ...body,
    decisionDigest: digest(body),
  }));
}

/** Build an independent legacy full-state resume oracle. */
export function createDeepImprovementCommonLegacyResumeOracle(
  snapshot: DeepImprovementCommonLegacyResumeSnapshot,
): DeepImprovementCommonLegacyResumeOracle {
  const events = Object.freeze([...snapshot.events]);
  if (events.length === 0) {
    throw new TypeError('Legacy resume oracle requires a persisted event view');
  }
  return Object.freeze({
    async resume(input: DeepImprovementCommonResumeRequest) {
      const request = parseDeepImprovementCommonResumeRequest(input);
      const projection = legacyProjection(events, null);
      if (
        projection.runId !== request.runId
        || projection.lineageId !== request.lease.lineageId
        || projection.generation !== request.lease.generation
        || request.lease.runId !== request.runId
      ) {
        throw new TypeError('Persisted lease does not match the legacy continuation identity');
      }
      const tail = events.at(-1);
      if (tail === undefined) throw new TypeError('Legacy resume oracle has no event tail');
      return Object.freeze({
        decision: modeledLegacyResumeDecision(request),
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

function assertPersistedLease(
  decision: DeepImprovementCommonResumeDecision,
  request: DeepImprovementCommonResumeRequest,
): void {
  if (digest(decision.lease) !== digest(request.lease)) {
    throw new TypeError('Resume parity cannot allocate or replace the persisted lease');
  }
}

class DeepImprovementCommonResumeLeaseContinuityError extends TypeError {
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
    this.name = 'DeepImprovementCommonResumeLeaseContinuityError';
    this.decisionPath = decisionPath;
    this.mismatchedFields = Object.freeze([...mismatchedFields]);
  }
}

function assertResumeEvidenceLeaseContinuity(
  frozen: DeepImprovementCommonFrozenParityInput,
  resumeEvidence: DeepImprovementCommonResumeParityEvidence | null,
): void {
  if (resumeEvidence === null) return;
  const decisions = [
    [
      'legacyDecision',
      parseDeepImprovementCommonResumeDecision(resumeEvidence.legacyDecision),
    ],
    [
      'ledgerDecision',
      parseDeepImprovementCommonResumeDecision(resumeEvidence.ledgerDecision),
    ],
  ] as const;
  for (const [decisionPath, decision] of decisions) {
    const mismatchedFields = RESUME_LEASE_CONTINUITY_FIELDS.filter(
      (field) => decision.lease[field] !== frozen.budgetLease[field],
    );
    if (mismatchedFields.length > 0) {
      throw new DeepImprovementCommonResumeLeaseContinuityError(
        decisionPath,
        mismatchedFields,
      );
    }
  }
}

/** Typed evidence that independent resume models disagree. */
export class DeepImprovementCommonResumeParityDivergenceError extends Error {
  public readonly code =
    'DEEP_IMPROVEMENT_COMMON_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions:
    readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(
    dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[],
  ) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'DeepImprovementCommonResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare a modeled legacy resume oracle with the real common resume adapter. */
export async function driveDeepImprovementCommonResumeParity(input: Readonly<{
  legacyOracle: DeepImprovementCommonLegacyResumeOracle;
  ledgerAdapter: DeepImprovementCommonResumeAdapter;
  request: DeepImprovementCommonResumeRequest;
}>): Promise<DeepImprovementCommonResumeParityEvidence> {
  if (
    typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof DeepImprovementCommonResumeAdapter)
  ) {
    throw new TypeError('Resume parity requires a legacy oracle and the real resume adapter');
  }
  const request = parseDeepImprovementCommonResumeRequest(input.request);
  const [legacyResult, ledgerResult] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  if (
    ledgerResult.projection === null
    || ledgerResult.authenticatedTail === null
  ) {
    throw new TypeError('Resume parity cannot compare a rebuild-required continuation');
  }
  const legacyDecision = parseDeepImprovementCommonResumeDecision(
    legacyResult.decision,
  );
  const ledgerDecision = parseDeepImprovementCommonResumeDecision(
    ledgerResult.decision,
  );
  assertPersistedLease(legacyDecision, request);
  assertPersistedLease(ledgerDecision, request);
  const legacyEventTailDigest = digest(legacyResult.eventTail);
  const ledgerEventTailDigest = digest({
    streamId: ledgerResult.authenticatedTail.streamId,
    streamSequence: ledgerResult.authenticatedTail.streamSequence,
    eventCount: ledgerResult.authenticatedTail.eventCount,
  });
  const legacyComparableProjectionFingerprint = digest(
    legacyResumeProjectionSemanticView(legacyResult.freshProjection),
  );
  const ledgerFreshProjectionFingerprint = digest(
    ledgerResumeProjectionSemanticView(ledgerResult.projection),
  );
  const dimensions: Array<'decision' | 'event-tail' | 'fresh-projection'> = [];
  if (digest(resumeSemanticView(legacyDecision))
    !== digest(resumeSemanticView(ledgerDecision))) dimensions.push('decision');
  if (legacyEventTailDigest !== ledgerEventTailDigest) dimensions.push('event-tail');
  if (legacyComparableProjectionFingerprint !== ledgerFreshProjectionFingerprint) {
    dimensions.push('fresh-projection');
  }
  if (dimensions.length > 0) {
    throw new DeepImprovementCommonResumeParityDivergenceError(dimensions);
  }
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint: legacyComparableProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. FAULT INJECTION AND EVENT-STREAM COMPARATOR
// ───────────────────────────────────────────────────────────────────

function faultMarker(kind: DeepImprovementCommonParityFaultInjection['kind']): string {
  return `fault-${kind}`;
}

function observationWithFault(
  observation: DeepImprovementCommonParityEventObservation,
  fault: DeepImprovementCommonParityFaultInjection,
  path: 'ledger' | 'legacy',
  runIndex: number,
): DeepImprovementCommonParityEventObservation {
  const changedDigest = digest({
    kind: fault.kind,
    eventIndex: fault.eventIndex,
    path,
    runIndex: fault.kind === 'nondeterministic' ? runIndex : 0,
  });
  switch (fault.kind) {
    case 'artifact':
      return Object.freeze({ ...observation, artifactRefs: Object.freeze([changedDigest]) });
    case 'authorization':
      return Object.freeze({
        ...observation,
        authorizationRefs: Object.freeze([faultMarker('authorization')]),
      });
    case 'causal-link':
      return Object.freeze({ ...observation, causalLogicalIdentity: changedDigest });
    case 'evaluator-integrity':
    case 'malformed':
    case 'nondeterministic':
    case 'reference-digest':
    case 'stale':
    case 'telemetry-gap':
    case 'unsupported-version':
      return Object.freeze({
        ...observation,
        stepKey: `${observation.stepKey}#${fault.kind}`,
      });
    case 'payload':
      return Object.freeze({ ...observation, stablePayloadDigest: changedDigest });
    case 'projection':
      return Object.freeze({ ...observation, projectionFingerprint: changedDigest });
    case 'promotion':
      return Object.freeze({
        ...observation,
        stepKey: `${observation.stepKey}#promotion`,
      });
    case 'receipt':
      return Object.freeze({ ...observation, receiptRefs: Object.freeze([changedDigest]) });
    case 'terminal-decision':
      return Object.freeze({
        ...observation,
        terminalDecision: observation.terminalDecision === 'blocked'
          ? 'inconclusive'
          : 'blocked',
      });
    case 'canary':
      return Object.freeze({ ...observation, stepKey: `${observation.stepKey}#canary` });
    case 'drop-event':
    case 'duplicate-event':
    case 'extra-event':
    case 'reorder-event':
      return observation;
  }
}

function stateWithPathFault(
  state: DeepImprovementCommonParityReplayState,
  fault: DeepImprovementCommonParityFaultInjection | undefined,
  path: 'ledger' | 'legacy',
  runIndex: number,
): DeepImprovementCommonParityReplayState {
  if (!fault || fault.path !== path) return state;
  const observations = [...replayObservations(state)];
  const index = requireCount(fault.eventIndex, 'fault.eventIndex');
  if (index >= observations.length) {
    throw new TypeError('Fault eventIndex is outside the fixture');
  }
  switch (fault.kind) {
    case 'drop-event':
      observations.splice(index, 1);
      break;
    case 'reorder-event':
      if (index + 1 >= observations.length) {
        throw new TypeError('Reorder fault requires a following event');
      }
      [observations[index], observations[index + 1]] = [
        observations[index + 1],
        observations[index],
      ];
      break;
    case 'extra-event': {
      const source = observations[index];
      observations.push(Object.freeze({
        ...source,
        eventId: `${source.eventId}-extra`,
        logicalIdentity: Object.freeze({
          ...source.logicalIdentity,
          producerSequence: Math.max(
            ...observations.map((entry) => entry.producerSequence),
          ) + 1,
        }),
        producerSequence: Math.max(
          ...observations.map((entry) => entry.producerSequence),
        ) + 1,
      }));
      break;
    }
    case 'duplicate-event':
      observations.push(Object.freeze({
        ...observations[index],
        eventId: `${observations[index].eventId}-duplicate`,
      }));
      break;
    default:
      observations[index] = observationWithFault(
        observations[index],
        fault,
        path,
        runIndex,
      );
      break;
  }
  const projectionFingerprint = fault.kind === 'projection'
    ? observations[index].projectionFingerprint
    : state.projectionFingerprint;
  return Object.freeze({
    ...state,
    projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map(
      (observation) => JSON.stringify(observation),
    )),
  }) as unknown as DeepImprovementCommonParityReplayState;
}

function makeDiff(
  fixtureId: string,
  diffClass: DeepImprovementCommonParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): DeepImprovementCommonParityDiffRecord {
  const body = {
    fixtureId,
    class: diffClass,
    eventIndex,
    expectedDigest,
    actualDigest,
    disposition: 'unexplained' as const,
    owner: 'deep-improvement-common-mode-owner' as const,
    dispositionReason: 'The difference can change evaluator, canary, promotion, or terminal state.',
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

function indexesByLogicalIdentity(
  values: readonly DeepImprovementCommonParityEventObservation[],
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

function markerDiffClass(
  expected: DeepImprovementCommonParityEventObservation,
  actual: DeepImprovementCommonParityEventObservation,
): DeepImprovementCommonParityDiffClass | null {
  const marker = [expected.stepKey, actual.stepKey].find((entry) => entry.includes('#'));
  if (marker === undefined) return null;
  const value = marker.split('#').at(-1);
  return DIFF_CLASSES.includes(value as DeepImprovementCommonParityDiffClass)
    ? value as DeepImprovementCommonParityDiffClass
    : null;
}

/** Pair streams by logical identity and classify every semantic difference. */
export function compareDeepImprovementCommonEventStreams(
  fixtureId: string,
  legacy: readonly DeepImprovementCommonParityEventObservation[],
  ledger: readonly DeepImprovementCommonParityEventObservation[],
): readonly DeepImprovementCommonParityDiffRecord[] {
  requireToken(fixtureId, 'fixtureId');
  const diffs: DeepImprovementCommonParityDiffRecord[] = [];
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
        digest(ledger[eventIndex]),
      ));
      continue;
    }
    if (actualIndexes.length === 0) {
      const eventIndex = expectedIndexes[0];
      diffs.push(makeDiff(
        fixtureId,
        'missing',
        eventIndex,
        digest(legacy[eventIndex]),
        null,
      ));
      continue;
    }
    if (expectedIndexes.length !== actualIndexes.length) {
      const extras = expectedIndexes.length > actualIndexes.length
        ? expectedIndexes.slice(actualIndexes.length)
        : actualIndexes.slice(expectedIndexes.length);
      for (const eventIndex of extras) {
        diffs.push(makeDiff(
          fixtureId,
          'duplicated',
          eventIndex,
          expectedIndexes.length > actualIndexes.length
            ? digest(legacy[eventIndex])
            : null,
          actualIndexes.length > expectedIndexes.length
            ? digest(ledger[eventIndex])
            : null,
        ));
      }
    }
    const pairedCount = Math.min(expectedIndexes.length, actualIndexes.length);
    for (let pairIndex = 0; pairIndex < pairedCount; pairIndex += 1) {
      const eventIndex = expectedIndexes[pairIndex];
      const expected = legacy[eventIndex];
      const actual = ledger[actualIndexes[pairIndex]];
      const markerClass = markerDiffClass(expected, actual);
      if (markerClass !== null) {
        diffs.push(makeDiff(
          fixtureId,
          markerClass,
          eventIndex,
          digest(expected.stepKey),
          digest(actual.stepKey),
        ));
      }
      if (expected.eventType !== actual.eventType && markerClass === null) {
        diffs.push(makeDiff(
          fixtureId,
          'unsupported-version',
          eventIndex,
          digest(expected.eventType),
          digest(actual.eventType),
        ));
      }
      if (expected.causalLogicalIdentity !== actual.causalLogicalIdentity) {
        diffs.push(makeDiff(
          fixtureId,
          'causal-link',
          eventIndex,
          expected.causalLogicalIdentity === null
            ? null
            : digest(expected.causalLogicalIdentity),
          actual.causalLogicalIdentity === null
            ? null
            : digest(actual.causalLogicalIdentity),
        ));
      }
      if (digest(expected.authorizationRefs) !== digest(actual.authorizationRefs)) {
        diffs.push(makeDiff(
          fixtureId,
          'unauthorized',
          eventIndex,
          digest(expected.authorizationRefs),
          digest(actual.authorizationRefs),
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
      if (
        expected.projectionFingerprint !== actual.projectionFingerprint
        && markerClass !== 'canary'
        && markerClass !== 'evaluator-integrity'
        && markerClass !== 'promotion'
      ) {
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
// 6. REAL SUBSTRATE EXECUTORS
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
    ...deepImprovementCommonEventDefinitions(),
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
    mode: 'improvement',
    event,
    priorHead: await ledger.getVerifiedHead(),
    priorStateVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'deep-improvement-common-shadow-parity' }),
    actorId: 'deep-improvement-common-shadow-parity',
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

function createReducerRegistry(
  path: 'ledger' | 'legacy',
  fixture: DeepImprovementCommonParityFixture,
): TypedReducerRegistry<DeepImprovementCommonParityReplayState> {
  return new TypedReducerRegistry(DeepImprovementCommonEventStems.map((stem) => ({
    eventType: DeepImprovementCommonWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const typed = event.effective.envelope as DeepImprovementCommonLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepImprovementCommonLedgerEvent,
      );
      return replayState([...history, typed], fixture, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'ledger' | 'legacy',
  fixture: DeepImprovementCommonParityFixture,
): ReplayComponentRegistry<DeepImprovementCommonParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<DeepImprovementCommonParityReplayState> => {
    if (!replayInputs[SEALED_ARTIFACT_REPLAY_INPUT_KEY]) {
      throw new TypeError('Parity replay requires sealed fixture inputs');
    }
    return createReducerRegistry(path, fixture);
  };
  const replayInputSources = {
    [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.source,
  };
  return new ReplayComponentRegistry([{
    reducerId: PARITY_REDUCER_ID,
    reducerVersion: PARITY_REDUCER_VERSION,
    projectionSchemaVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function createParityFingerprintVersionRegistry(): FingerprintVersionRegistry {
  const versionOne = createReplayFingerprintVersionRegistry().current();
  return new FingerprintVersionRegistry([
    versionOne,
    {
      fingerprintVersion: 2,
      hashAlgorithm: 'sha256',
      canonicalizationAlgorithm: 'deep-loop-length-delimited-sha256-commitment-v1',
      serializeDescriptor: (descriptor, includeFinalDigest) => Uint8Array.from(
        Buffer.from(
          sha256Bytes(versionOne.serializeDescriptor(descriptor, includeFinalDigest)),
          'hex',
        ),
      ),
    },
  ]);
}

function validateFrozenInputAgainstCapsule(
  frozen: DeepImprovementCommonFrozenParityInput,
  resumeEvidence: DeepImprovementCommonResumeParityEvidence | null,
  context: ParityExecutionContext,
  initialState: DeepImprovementCommonParityReplayState,
): void {
  if (!isRecord(frozen) || !hasExactKeys(frozen, [
    'baseSha',
    'runManifestDigest',
    'evaluatorCapsuleDigest',
    'fixtureSetDigest',
    'baselineDigest',
    'policyDigest',
    'initialStateDigest',
    'configurationDigest',
    'budgetLease',
  ])) {
    throw new TypeError('frozenInput must use the closed allowed-key set');
  }
  requireBaseSha(frozen.baseSha, 'frozenInput.baseSha');
  for (const field of [
    'runManifestDigest',
    'evaluatorCapsuleDigest',
    'fixtureSetDigest',
    'baselineDigest',
    'policyDigest',
    'initialStateDigest',
    'configurationDigest',
  ] as const) requireDigest(frozen[field], `frozenInput.${field}`);
  if (
    frozen.baseSha !== context.capsule.baseSha
    || frozen.initialStateDigest !== context.capsule.initialStateDigest
    || frozen.configurationDigest !== context.capsule.configurationDigest
    || frozen.initialStateDigest !== digest(initialState)
  ) {
    throw new TypeError('Executor fixture does not match the verified sealed case capsule');
  }
  if (!isRecord(frozen.budgetLease) || !hasExactKeys(frozen.budgetLease, [
    'leaseId',
    'runId',
    'lineageId',
    'generation',
    'maxIterations',
    'remainingIterations',
    'deadlineAt',
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

function attestationEnvelope(path: 'ledger' | 'legacy') {
  return {
    eventId: `${path}-deep-improvement-common-parity-attestation`,
    streamId: 'deep-improvement-common-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'deep-improvement-common-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-deep-improvement-common-parity-attestation`,
  };
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: DeepImprovementCommonParityFixture,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<DeepImprovementCommonParityReplayState>,
  initialState: DeepImprovementCommonParityReplayState,
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
    censusSurfaceId: 'improvement-derived-state',
    ledgerId: PARITY_LEDGER_ID,
    streamIds: sortedUnique(fixture.events.map((event) => event.stream_id)),
    relativePath: 'improvement/deep-improvement-common-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-improvement-derived-state-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
    reducerVersion: PARITY_REDUCER_VERSION,
    serializerId: 'legacy-pretty-json-v1',
    legacyWriter: 'improvement reducer and analysis scripts',
    readers: ['loop host, trade-off detector, operators'],
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
      DeepImprovementCommonEventStems.map(
        (stem) => [DeepImprovementCommonWireEventTypes[stem], [1]],
      ),
    ),
    reduce: (
      state: Readonly<DeepImprovementCommonParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): DeepImprovementCommonParityReplayState => {
      const typed = event.effective.envelope as DeepImprovementCommonLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as DeepImprovementCommonLedgerEvent,
      );
      return replayState([...history, typed], fixture, 'legacy');
    },
    serialize: (state: Readonly<DeepImprovementCommonParityReplayState>): Uint8Array => (
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
    throw new TypeError(
      `Legacy projection oracle failed: ${result.error.code} ${
        JSON.stringify(result.error.details)
      }`,
    );
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
  fixture: DeepImprovementCommonParityFixture,
  state: DeepImprovementCommonParityReplayState,
): Readonly<Partial<Record<ParityObservationClass, JsonValue>>> {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'deep-improvement-common-shadow-observation',
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
    'emitted-artifacts': [
      ...projection.rawObservations.map((entry) => entry.rawObservationDigest),
      ...projection.canaries.map((entry) => entry.suiteDigest),
    ] as unknown as JsonValue,
    'reader-results': state.projectionFingerprint,
  });
}

function createPathExecutor(
  path: 'ledger' | 'legacy',
  fixture: DeepImprovementCommonParityFixture,
  fault: DeepImprovementCommonParityFaultInjection | undefined,
  captured: DeepImprovementCommonPathEvidence[],
): DeepImprovementCommonParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<
    ParityPathExecution<DeepImprovementCommonParityReplayState>
  > => {
    const initialState = replayState([], fixture, path);
    validateFrozenInputAgainstCapsule(
      fixture.frozenInput,
      fixture.resumeEvidence,
      context,
      initialState,
    );
    const ledgerRoot = resolve(context.executionRoot, 'ledger');
    if (ledgerTemplateRoot !== null) {
      cpSync(ledgerTemplateRoot, ledgerRoot, {
        recursive: true,
        preserveTimestamps: true,
      });
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
        await appendFencedLedgerRecord(ledger, prepared, proof);
      }
      ledgerTemplateRoot = resolve(context.executionRoot, '..', `${path}-ledger-template`);
      cpSync(ledgerRoot, ledgerTemplateRoot, {
        recursive: true,
        preserveTimestamps: true,
      });
    }
    const componentRegistry = createComponentRegistry(context, path, fixture);
    const versionRegistry = createParityFingerprintVersionRegistry();
    const verification:
      VerifyReplayFingerprintInput<DeepImprovementCommonParityReplayState> = {
        ledger,
        eventRegistry: registry,
        versionRegistry,
        componentRegistry,
        consumer: 'shadow-parity',
        fingerprintVersion: 2,
        runId: `${path}-${fixture.fixtureId}`,
        rangeStartSequence: 1,
        rangeEndSequence: fixture.events.length,
        replay: {
          reducerId: PARITY_REDUCER_ID,
          reducerVersion: PARITY_REDUCER_VERSION,
          projectionSchemaVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
          initialState,
          replayInputDigests: {
            initial_state: digest(initialState),
            [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.digest,
          },
        },
      };
    const derived = await deriveReplayFingerprint(verification);
    const state = stateWithPathFault(
      derived.projection.state,
      fault,
      path,
      context.runIndex,
    );
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
      const legacyFingerprint = await deriveReplayFingerprint({
        ...verification,
        versionRegistry: createReplayFingerprintVersionRegistry(),
      });
      await projectThroughLegacyOracle(
        context,
        fixture,
        ledger,
        legacyFingerprint,
        initialState,
      );
    }
    try {
      const attestation = prepareReplayFingerprintAttestation(
        derived,
        registry,
        versionRegistry,
        attestationEnvelope(path),
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
          throw new TypeError(`record: ${
            error instanceof Error ? error.message : 'unknown'
          }`);
        }
      } catch (error) {
        throw new TypeError(`authorize: ${
          error instanceof Error ? error.message : 'unknown'
        }`);
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
      implementationKind:
        path === 'legacy' ? 'modeled-legacy-oracle' : 'typed-ledger-pipeline',
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
          eventCount: fixture.events.length,
          streamDigest,
        }),
        integrityDigest: sha256Bytes(bytes),
      })]),
    });
  };
}

/** Bind a sealed fixture capsule to the exact empty replay state. */
export function deepImprovementCommonParityInitialStateDigest(
  fixture: DeepImprovementCommonParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

/** Create distinct legacy-oracle and typed-ledger real-substrate executors. */
export function createDeepImprovementCommonParityExecutors(
  fixture: DeepImprovementCommonParityFixture,
  fault?: DeepImprovementCommonParityFaultInjection,
): DeepImprovementCommonParityExecutorPair {
  verifyDeepImprovementCommonLifecycleEventMap();
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: DeepImprovementCommonPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: (): readonly DeepImprovementCommonPathEvidence[] =>
      Object.freeze([...captured]),
    legacyOracleImplementation: 'modeled-legacy-oracle',
    ledgerImplementation: 'typed-ledger-pipeline',
    substrateImportsReal: true,
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. MANIFEST AND CERTIFICATE-BOUND RECEIPTS
// ───────────────────────────────────────────────────────────────────

function caseContractDigest(fixture: DeepImprovementCommonParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    variant: fixture.variant,
    lifecycleMap: EventStages,
    comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    projectionVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
  });
}

/** Compile the complete shared common-service fixture closure. */
export function compileDeepImprovementCommonParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly DeepImprovementCommonParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  if (
    input.fixtures.length
    !== DEEP_IMPROVEMENT_COMMON_REQUIRED_FIXTURE_SCENARIOS.length
  ) {
    throw new TypeError('Parity requires the complete shared fixture scenario set');
  }
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...DEEP_IMPROVEMENT_COMMON_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (
    new Set(scenarios).size !== expected.length
    || scenarios.some((scenario, index) => scenario !== expected[index])
  ) {
    throw new TypeError('Parity fixture scenarios must be exact and unique');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'deep-improvement-common',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  const cases: ParityCaseDefinition[] = input.fixtures.map((fixture) => ({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-improvement-common',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-improvement-common-bounded-shadow',
  }));
  return compileParityCaseManifest({
    baseSha: input.baseSha,
    baselineRows,
    cases,
  });
}

/** Create one case definition for targeted fault and non-vacuity tests. */
export function createDeepImprovementCommonParityCaseDefinition(
  fixture: DeepImprovementCommonParityFixture,
): ParityCaseDefinition {
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'deep-improvement-common',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'deep-improvement-common-bounded-shadow',
  });
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST,
    diffClasses: DIFF_CLASSES,
    logicalIdentityFields: [
      'eventStem',
      'runId',
      'lineageId',
      'variant',
      'candidateId',
      'evaluationEpochId',
      'fixtureId',
      'observationId',
      'canaryEpochId',
      'canarySuiteId',
      'promotionId',
      'baselineId',
      'producerSequence',
    ],
  });
}

function pathEvidence(
  executors: DeepImprovementCommonParityExecutorPair,
  path: 'ledger' | 'legacy',
): Readonly<{
  streamDigest: string;
  projectionFingerprint: string;
  observations: readonly DeepImprovementCommonParityEventObservation[];
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
  fixture: DeepImprovementCommonParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepImprovementCommonParityExecutorPair,
): DeepImprovementCommonParityCertificateEvidenceBinding | null {
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
  bindings: readonly DeepImprovementCommonParityCertificateEvidenceBinding[],
): readonly DeepImprovementCommonParityCertificateEvidenceBinding[] {
  return Object.freeze([...bindings].sort((left, right) => (
    left.fixtureId.localeCompare(right.fixtureId)
  )));
}

function requiredCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases
    .filter((entry) => entry.mode === 'deep-improvement-common')
    .map((entry) => entry.caseId)
    .sort((left, right) => left.localeCompare(right));
}

async function verifyModeCertificateBinding(
  caseRun: DeepImprovementCommonParityCaseRun,
  manifest: ParityCaseManifest,
): Promise<DeepImprovementCommonModeCertificateBinding | null> {
  const verification = await verifyDeepImprovementCommonCertificateOffline(
    caseRun.modeCertificateVerification.input,
  );
  if (verification.verdict !== 'valid') return null;
  const bundle = parseDeepImprovementCommonCertificateBundle(
    caseRun.modeCertificateVerification.input.bundle,
  );
  const caseSetDigest = digest(requiredCaseIds(manifest));
  const body = {
    bundle,
    certificateDigest: bundle.certificate.certificateDigest,
    verificationReceipt: verification.verificationReceipt,
    manifestDigest: manifest.manifestDigest,
    comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    caseSetDigest,
  };
  return Object.freeze({
    ...body,
    bindingDigest: digest(body),
  });
}

function certificateBindings(
  manifest: ParityCaseManifest,
  evidenceBindings: readonly DeepImprovementCommonParityCertificateEvidenceBinding[],
  modeCertificateBinding: DeepImprovementCommonModeCertificateBinding | null,
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifestDigest: manifest.manifestDigest,
      schemaVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
      modeCertificateDigest: modeCertificateBinding?.certificateDigest ?? null,
    }),
    harness_digest: digest({
      legacy: 'runtime/lib/legacy-projections',
      ledger: 'runtime/lib/deep-improvement-common-reducers',
      shadow: 'runtime/lib/shadow-parity',
      resume: 'runtime/lib/deep-improvement-common-resume-adapter',
      certificate: 'runtime/lib/deep-improvement-common-certificates',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: DEEP_IMPROVEMENT_COMMON_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({
      reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    }),
    projection_digest: digest({
      projectionVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    }),
    adapter_digest: digest({
      adapterVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
      lifecycleMap: EventStages,
      certificateEvidenceBindings: sortedCertificateEvidenceBindings(evidenceBindings),
      modeCertificateBindingDigest: modeCertificateBinding?.bindingDigest ?? null,
    }),
    policy_version: 'deep-improvement-common-shadow-only@1',
  });
}

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: DeepImprovementCommonParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepImprovementCommonParityExecutorPair,
  certificate: DeepImprovementCommonParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepImprovementCommonParityCertificateEvidenceBinding[],
  modeCertificateBinding: DeepImprovementCommonModeCertificateBinding | null,
  refusalCode: DeepImprovementCommonParityReceipt['certificateRefusalCode'],
): Omit<DeepImprovementCommonParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareDeepImprovementCommonEventStreams(
    fixture.fixtureId,
    legacy.observations,
    ledger.observations,
  );
  const certificateStatus =
    certificate === null || modeCertificateBinding === null ? 'refused' : 'issued';
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
    modeCertificateBindingDigest: modeCertificateBinding?.bindingDigest ?? null,
  });
  return Object.freeze({
    schemaVersion: DEEP_IMPROVEMENT_COMMON_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `deep-improvement-common-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion:
      `deep-improvement-common-event@${DEEP_IMPROVEMENT_COMMON_EVENT_VERSION}`,
    reducerVersion: DEEP_IMPROVEMENT_COMMON_REDUCER_VERSION,
    comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    projectionVersion: DEEP_IMPROVEMENT_COMMON_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId: fixture.fixtureId,
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    exitStatus: isGreen ? 'green' : 'blocked',
    diffDispositions: Object.freeze([...diffs]),
    parityCertificate: certificateStatus === 'issued' ? certificate : null,
    certificateEvidenceBindings:
      certificateStatus === 'issued'
        ? sortedCertificateEvidenceBindings(evidenceBindings)
        : Object.freeze([]),
    parityCertificateDigest:
      certificateStatus === 'issued' ? certificate?.certificate_digest ?? null : null,
    modeCertificateBinding:
      certificateStatus === 'issued' ? modeCertificateBinding : null,
    certificateStatus,
    certificateRefusalCode:
      certificateStatus === 'issued' ? null : refusalCode ?? 'UNVERIFIABLE',
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
  fixture: DeepImprovementCommonParityFixture,
  result: ShadowParityCaseResult,
  executors: DeepImprovementCommonParityExecutorPair,
  certificate: DeepImprovementCommonParityReceipt['parityCertificate'],
  evidenceBindings: readonly DeepImprovementCommonParityCertificateEvidenceBinding[],
  modeCertificateBinding: DeepImprovementCommonModeCertificateBinding | null,
  refusalCode: DeepImprovementCommonParityReceipt['certificateRefusalCode'],
): DeepImprovementCommonParityReceipt {
  const body = receiptBody(
    manifest,
    fixture,
    result,
    executors,
    certificate,
    evidenceBindings,
    modeCertificateBinding,
    refusalCode,
  );
  return parseDeepImprovementCommonParityReceipt(Object.freeze({
    ...body,
    receiptDigest: digest(body),
  }), manifest);
}

function parseDiff(
  input: unknown,
  field: string,
): DeepImprovementCommonParityDiffRecord {
  if (!isRecord(input) || !hasExactKeys(input, [
    'diffId',
    'fixtureId',
    'class',
    'eventIndex',
    'expectedDigest',
    'actualDigest',
    'disposition',
    'owner',
    'dispositionReason',
    'trustedStateProof',
  ])) throw new TypeError(`${field} must use the closed parity-diff shape`);
  if (!DIFF_CLASSES.includes(input.class as DeepImprovementCommonParityDiffClass)) {
    throw new TypeError(`${field}.class is not registered`);
  }
  if (input.disposition !== 'unexplained') {
    throw new TypeError(`${field}.disposition is not registered`);
  }
  requireDigest(input.diffId, `${field}.diffId`);
  requireToken(input.fixtureId, `${field}.fixtureId`);
  requireCount(input.eventIndex, `${field}.eventIndex`);
  if (input.expectedDigest !== null) {
    requireDigest(input.expectedDigest, `${field}.expectedDigest`);
  }
  if (input.actualDigest !== null) requireDigest(input.actualDigest, `${field}.actualDigest`);
  if (input.owner !== 'deep-improvement-common-mode-owner') {
    throw new TypeError(`${field}.owner is not registered`);
  }
  requireReason(input.dispositionReason, `${field}.dispositionReason`);
  requireDigest(input.trustedStateProof, `${field}.trustedStateProof`);
  return Object.freeze(input as unknown as DeepImprovementCommonParityDiffRecord);
}

function parseCertificateEvidenceBinding(
  input: unknown,
  field: string,
): DeepImprovementCommonParityCertificateEvidenceBinding {
  if (!isRecord(input) || !hasExactKeys(input, [
    'fixtureId',
    'legacyStreamDigest',
    'ledgerStreamDigest',
    'legacyProjectionFingerprint',
    'ledgerProjectionFingerprint',
    'caseEvidenceDigest',
    'referenceSetDigest',
    'attestationFinalDigests',
  ])) throw new TypeError(`${field} must use the closed certificate-evidence shape`);
  requireToken(input.fixtureId, `${field}.fixtureId`);
  for (const digestField of [
    'legacyStreamDigest',
    'ledgerStreamDigest',
    'legacyProjectionFingerprint',
    'ledgerProjectionFingerprint',
    'caseEvidenceDigest',
    'referenceSetDigest',
  ] as const) requireDigest(input[digestField], `${field}.${digestField}`);
  if (!Array.isArray(input.attestationFinalDigests)) {
    throw new TypeError(`${field}.attestationFinalDigests must be an array`);
  }
  input.attestationFinalDigests.forEach(
    (entry, index) => requireDigest(
      entry,
      `${field}.attestationFinalDigests[${index}]`,
    ),
  );
  if (
    input.attestationFinalDigests.length === 0
    || digest(input.attestationFinalDigests)
      !== digest(sortedUnique(input.attestationFinalDigests as string[]))
  ) {
    throw new TypeError(`${field}.attestationFinalDigests must be sorted and unique`);
  }
  return Object.freeze({
    ...(input as unknown as DeepImprovementCommonParityCertificateEvidenceBinding),
    attestationFinalDigests: Object.freeze([
      ...input.attestationFinalDigests,
    ] as string[]),
  });
}

function parseEmbeddedParityCertificate(
  input: unknown,
): NonNullable<DeepImprovementCommonParityReceipt['parityCertificate']> {
  if (!isRecord(input) || !hasExactKeys(input, [
    'schema_version',
    'mode',
    'base_sha',
    'manifest_digest',
    'case_ids',
    'case_evidence_digests',
    'reference_set_digests',
    'attestation_final_digests',
    'bindings',
    'evidence_digest',
    'open_divergence_count',
    'authority_state',
    'authority_mutation',
    'rollback_minimum_days',
    'rollback_minimum_successful_runs',
    'certificate_digest',
  ])) throw new TypeError('parityCertificate must use the closed certificate shape');
  requireCount(input.schema_version, 'parityCertificate.schema_version');
  requireToken(input.mode, 'parityCertificate.mode');
  requireBaseSha(input.base_sha, 'parityCertificate.base_sha');
  requireDigest(input.manifest_digest, 'parityCertificate.manifest_digest');
  for (const arrayField of [
    'case_ids',
    'case_evidence_digests',
    'reference_set_digests',
    'attestation_final_digests',
  ] as const) {
    if (!Array.isArray(input[arrayField])) {
      throw new TypeError(`parityCertificate.${arrayField} must be an array`);
    }
  }
  (input.case_ids as unknown[]).forEach(
    (entry, index) => requireToken(entry, `parityCertificate.case_ids[${index}]`),
  );
  for (const arrayField of [
    'case_evidence_digests',
    'reference_set_digests',
    'attestation_final_digests',
  ] as const) {
    (input[arrayField] as unknown[]).forEach(
      (entry, index) => requireDigest(
        entry,
        `parityCertificate.${arrayField}[${index}]`,
      ),
    );
  }
  if (!isRecord(input.bindings) || !hasExactKeys(input.bindings, [
    'candidate_build_digest',
    'harness_digest',
    'comparator_digest',
    'replay_contract_digest',
    'reducer_digest',
    'projection_digest',
    'adapter_digest',
    'policy_version',
  ])) throw new TypeError('parityCertificate.bindings must use the closed binding shape');
  for (const bindingField of [
    'candidate_build_digest',
    'harness_digest',
    'comparator_digest',
    'replay_contract_digest',
    'reducer_digest',
    'projection_digest',
    'adapter_digest',
  ] as const) {
    requireDigest(
      input.bindings[bindingField],
      `parityCertificate.bindings.${bindingField}`,
    );
  }
  requireToken(
    input.bindings.policy_version,
    'parityCertificate.bindings.policy_version',
    true,
  );
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
    DeepImprovementCommonParityReceipt['parityCertificate']
  >);
}

function parseModeCertificateBinding(
  input: unknown,
  manifest: ParityCaseManifest,
): DeepImprovementCommonModeCertificateBinding {
  if (!isRecord(input) || !hasExactKeys(input, [
    'bundle',
    'certificateDigest',
    'verificationReceipt',
    'manifestDigest',
    'comparatorVersion',
    'caseSetDigest',
    'bindingDigest',
  ])) throw new TypeError('modeCertificateBinding must use the closed binding shape');
  const bundle = parseDeepImprovementCommonCertificateBundle(input.bundle);
  requireDigest(input.certificateDigest, 'modeCertificateBinding.certificateDigest');
  requireDigest(input.manifestDigest, 'modeCertificateBinding.manifestDigest');
  requireToken(
    input.comparatorVersion,
    'modeCertificateBinding.comparatorVersion',
    true,
  );
  requireDigest(input.caseSetDigest, 'modeCertificateBinding.caseSetDigest');
  requireDigest(input.bindingDigest, 'modeCertificateBinding.bindingDigest');
  if (!isRecord(input.verificationReceipt)) {
    throw new TypeError('modeCertificateBinding.verificationReceipt must be an object');
  }
  const verificationReceipt =
    input.verificationReceipt as unknown as DeepImprovementCommonOfflineVerifierReceipt;
  for (const field of [
    'certificateDigest',
    'rulesetDigest',
    'replayFingerprint',
    'verificationDigest',
  ] as const) requireDigest(
    verificationReceipt[field],
    `modeCertificateBinding.verificationReceipt.${field}`,
  );
  if (
    input.certificateDigest !== bundle.certificate.certificateDigest
    || verificationReceipt.certificateDigest !== bundle.certificate.certificateDigest
    || input.manifestDigest !== manifest.manifestDigest
    || input.comparatorVersion !== DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION
    || input.caseSetDigest !== digest(requiredCaseIds(manifest))
  ) {
    throw new TypeError('modeCertificateBinding does not match trusted parity inputs');
  }
  const body = {
    bundle,
    certificateDigest: input.certificateDigest,
    verificationReceipt,
    manifestDigest: input.manifestDigest,
    comparatorVersion: input.comparatorVersion,
    caseSetDigest: input.caseSetDigest,
  };
  if (input.bindingDigest !== digest(body)) {
    throw new TypeError('modeCertificateBinding digest does not commit its evidence');
  }
  return Object.freeze({
    ...body,
    bindingDigest: input.bindingDigest,
  } as DeepImprovementCommonModeCertificateBinding);
}

class DeepImprovementCommonParityCertificateVerificationError extends TypeError {
  public readonly refusalCode:
    DeepImprovementCommonParityReceipt['certificateRefusalCode'];

  public constructor(
    refusalCode: DeepImprovementCommonParityReceipt['certificateRefusalCode'],
    message: string,
  ) {
    super(message);
    this.name = 'DeepImprovementCommonParityCertificateVerificationError';
    this.refusalCode = refusalCode;
  }
}

function verifyReceiptCertificate(
  receipt: DeepImprovementCommonParityReceipt,
  manifest: ParityCaseManifest,
): void {
  const evidenceBindings = receipt.certificateEvidenceBindings;
  const requiredIds = requiredCaseIds(manifest);
  const expectedBindings = certificateBindings(
    manifest,
    evidenceBindings,
    receipt.modeCertificateBinding,
  );
  const verification = verifyParityCertificate(receipt.parityCertificate, {
    manifest,
    mode: 'deep-improvement-common',
    bindings: expectedBindings,
    caseEvidenceDigests: evidenceBindings.map((entry) => entry.caseEvidenceDigest),
    referenceSetDigests: sortedUnique(
      evidenceBindings.map((entry) => entry.referenceSetDigest),
    ),
    attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
      (entry) => entry.attestationFinalDigests,
    )),
  });
  if (receipt.certificateStatus === 'refused') {
    if (
      verification.ok
      || evidenceBindings.length !== 0
      || receipt.modeCertificateBinding !== null
    ) {
      throw new DeepImprovementCommonParityCertificateVerificationError(
        'UNVERIFIABLE',
        'Refused parity receipt cannot carry verifiable certificate evidence',
      );
    }
    return;
  }
  if (!verification.ok) {
    throw new DeepImprovementCommonParityCertificateVerificationError(
      verification.refusal.code,
      `Parity receipt certificate verification failed: ${verification.refusal.message}`,
    );
  }
  if (
    receipt.modeCertificateBinding === null
    || receipt.baseSha !== manifest.baseSha
    || receipt.runManifestDigest !== manifest.manifestDigest
    || digest(requiredIds)
      !== digest(evidenceBindings.map((entry) => entry.fixtureId))
  ) {
    throw new DeepImprovementCommonParityCertificateVerificationError(
      'STALE_EVIDENCE',
      'Parity receipt evidence does not match the trusted manifest closure',
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
    throw new DeepImprovementCommonParityCertificateVerificationError(
      'UNVERIFIABLE',
      'Parity receipt streams are not bound to verified certificate evidence',
    );
  }
}

function assertReceiptEvidenceConsistency(
  receipt: DeepImprovementCommonParityReceipt,
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
    && receipt.modeCertificateBinding !== null
    && receipt.certificateRefusalCode === null;
  const certificateRefused = receipt.certificateStatus === 'refused'
    && receipt.parityCertificate === null
    && receipt.certificateEvidenceBindings.length === 0
    && receipt.parityCertificateDigest === null
    && receipt.modeCertificateBinding === null
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
    modeCertificateBindingDigest:
      receipt.modeCertificateBinding?.bindingDigest ?? null,
  });
  if (receipt.reproducibilityDigest !== expectedReproducibilityDigest) {
    throw new TypeError('Parity receipt reproducibility digest does not bind its evidence');
  }
  const evidenceIsGreen =
    receipt.legacyProjectionFingerprint === receipt.ledgerProjectionFingerprint
    && receipt.legacyStreamDigest === receipt.ledgerStreamDigest
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

/** Parse a receipt and reject unknown keys or self-declared authority. */
export function parseDeepImprovementCommonParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): DeepImprovementCommonParityReceipt {
  const keys = [
    'schemaVersion',
    'receiptId',
    'baseSha',
    'runManifestDigest',
    'eventSchemaVersion',
    'reducerVersion',
    'comparatorVersion',
    'projectionVersion',
    'comparatorConfigDigest',
    'fixtureId',
    'legacyStreamDigest',
    'ledgerStreamDigest',
    'legacyProjectionFingerprint',
    'ledgerProjectionFingerprint',
    'exitStatus',
    'diffDispositions',
    'parityCertificate',
    'certificateEvidenceBindings',
    'parityCertificateDigest',
    'modeCertificateBinding',
    'certificateStatus',
    'certificateRefusalCode',
    'genericDivergenceId',
    'genericDivergenceClass',
    'authorityState',
    'authorityMutation',
    'cutoverCertificate',
    'reproducibilityDigest',
    'receiptDigest',
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
  const modeCertificateBinding = input.modeCertificateBinding === null
    ? null
    : parseModeCertificateBinding(input.modeCertificateBinding, manifest);
  if (input.certificateStatus !== 'issued' && input.certificateStatus !== 'refused') {
    throw new TypeError('certificateStatus must be issued or refused');
  }
  const refusalCodes = [
    'ZERO_DISCOVERY',
    'PARTIAL_CASE_SET',
    'OPEN_DIVERGENCE',
    'DUPLICATE_CONFLICT',
    'WRONG_MODE',
    'STALE_EVIDENCE',
    'UNVERIFIABLE',
  ];
  if (
    input.certificateRefusalCode !== null
    && !refusalCodes.includes(String(input.certificateRefusalCode))
  ) {
    throw new TypeError('certificateRefusalCode is not registered');
  }
  if (input.genericDivergenceId !== null) {
    requireDigest(input.genericDivergenceId, 'genericDivergenceId');
  }
  const divergenceClasses = [
    'input-inequivalent',
    'harness-invalid',
    'replay-contract-drift',
    'execution-outcome',
    'effective-event',
    'projection-semantic',
    'legacy-byte',
    'missing-observation',
    'nondeterministic',
  ];
  if (
    input.genericDivergenceClass !== null
    && !divergenceClasses.includes(String(input.genericDivergenceClass))
  ) {
    throw new TypeError('genericDivergenceClass is not registered');
  }
  if (
    input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.cutoverCertificate !== false
  ) {
    throw new TypeError('Parity receipt cannot carry an authority mutation');
  }
  requireDigest(input.reproducibilityDigest, 'reproducibilityDigest');
  requireDigest(input.receiptDigest, 'receiptDigest');
  const {
    receiptDigest,
    diffDispositions: ignoredDiffs,
    parityCertificate: ignoredCertificate,
    certificateEvidenceBindings: ignoredEvidenceBindings,
    modeCertificateBinding: ignoredModeCertificateBinding,
    ...body
  } = input;
  const canonicalBody = {
    ...body,
    diffDispositions: diffs,
    parityCertificate: certificate,
    certificateEvidenceBindings: evidenceBindings,
    modeCertificateBinding,
  };
  void ignoredDiffs;
  void ignoredCertificate;
  void ignoredEvidenceBindings;
  void ignoredModeCertificateBinding;
  if (digest(canonicalBody) !== receiptDigest) {
    throw new TypeError('Parity receipt digest does not commit the closed receipt body');
  }
  const receipt = Object.freeze({
    ...(input as unknown as DeepImprovementCommonParityReceipt),
    diffDispositions: Object.freeze(diffs),
    parityCertificate: certificate,
    certificateEvidenceBindings: Object.freeze(evidenceBindings),
    modeCertificateBinding,
  });
  assertReceiptEvidenceConsistency(receipt, manifest);
  return receipt;
}

function modeGateBody(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): Omit<DeepImprovementCommonModeGateInput, 'gateInputDigest'> {
  const expectedFixtureIds = sortedUnique(input.expectedFixtureIds);
  const requiredFixtureIds = requiredCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  let certificateUnverifiable = false;
  const parsed: DeepImprovementCommonParityReceipt[] = [];
  for (const receipt of input.receipts) {
    try {
      const parsedReceipt = parseDeepImprovementCommonParityReceipt(
        receipt,
        input.manifest,
      );
      verifyReceiptCertificate(parsedReceipt, input.manifest);
      parsed.push(parsedReceipt);
    } catch (error: unknown) {
      if (
        error instanceof DeepImprovementCommonParityCertificateVerificationError
        && error.refusalCode === 'STALE_EVIDENCE'
      ) stale = true;
      else if (
        error instanceof DeepImprovementCommonParityCertificateVerificationError
      ) certificateUnverifiable = true;
      else malformed = true;
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
    (receipt) => receipt.genericDivergenceClass === 'nondeterministic'
      || receipt.diffDispositions.some((entry) => entry.class === 'nondeterministic'),
  );
  const unexplained = parsed.some((receipt) => (
    receipt.diffDispositions.some((entry) => entry.disposition === 'unexplained')
  ));
  const fixtureFailure = parsed.some((receipt) => receipt.exitStatus !== 'green');
  let blockingReasonCode: DeepImprovementCommonModeGateBlockReasonCode | null = null;
  if (expectedFixtureIds.length === 0) blockingReasonCode = 'ZERO_FIXTURES';
  else if (malformed) blockingReasonCode = 'RECEIPT_MALFORMED';
  else if (stale) blockingReasonCode = 'RECEIPT_STALE';
  else if (certificateUnverifiable) {
    blockingReasonCode = 'CERTIFICATE_UNVERIFIABLE';
  } else if (!allReceiptsPresent) blockingReasonCode = 'MISSING_RECEIPT';
  else if (nondeterministic) blockingReasonCode = 'NONDETERMINISTIC_REPLAY';
  else if (unexplained) blockingReasonCode = 'DIFF_UNEXPLAINED';
  else if (fixtureFailure) blockingReasonCode = 'FIXTURE_FAILURE';
  const isPass = blockingReasonCode === null;
  return Object.freeze({
    schemaVersion: DEEP_IMPROVEMENT_COMMON_MODE_GATE_INPUT_VERSION,
    mode: 'deep-improvement-common',
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

/** Emit the exact non-authoritative input consumed by the successor mode gate. */
export function createDeepImprovementCommonModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): DeepImprovementCommonModeGateInput {
  const body = modeGateBody(input);
  return parseDeepImprovementCommonModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse the successor handoff and reject authority-bearing values. */
export function parseDeepImprovementCommonModeGateInput(
  input: unknown,
): DeepImprovementCommonModeGateInput {
  const keys = [
    'schemaVersion',
    'mode',
    'baseSha',
    'manifestDigest',
    'fixtureIds',
    'parityReceiptDigests',
    'exitStatus',
    'zeroUnexplainedDiffs',
    'allReceiptsPresent',
    'deterministicReplay',
    'authorityState',
    'authorityMutation',
    'rollbackReadinessAuthorized',
    'cutoverAuthorized',
    'blockingReasonCode',
    'gateInputDigest',
  ];
  if (!isRecord(input) || !hasExactKeys(input, keys)) {
    throw new TypeError('Mode-gate input must use the closed allowed-key set');
  }
  requireToken(input.schemaVersion, 'schemaVersion', true);
  if (input.mode !== 'deep-improvement-common') {
    throw new TypeError('mode must be deep-improvement-common');
  }
  requireBaseSha(input.baseSha, 'baseSha');
  requireDigest(input.manifestDigest, 'manifestDigest');
  if (!Array.isArray(input.fixtureIds) || !Array.isArray(input.parityReceiptDigests)) {
    throw new TypeError('Mode-gate fixture and receipt identities must be arrays');
  }
  input.fixtureIds.forEach(
    (entry, index) => requireToken(entry, `fixtureIds[${index}]`),
  );
  input.parityReceiptDigests.forEach(
    (entry, index) => requireDigest(entry, `parityReceiptDigests[${index}]`),
  );
  if (input.exitStatus !== 'pass' && input.exitStatus !== 'blocked') {
    throw new TypeError('Mode-gate exitStatus must be pass or blocked');
  }
  for (const field of [
    'zeroUnexplainedDiffs',
    'allReceiptsPresent',
    'deterministicReplay',
  ] as const) {
    if (typeof input[field] !== 'boolean') {
      throw new TypeError(`${field} must be boolean`);
    }
  }
  if (
    input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.rollbackReadinessAuthorized !== false
    || input.cutoverAuthorized !== false
  ) {
    throw new TypeError('Mode-gate input cannot authorize authority or cutover');
  }
  const reasonCodes: readonly DeepImprovementCommonModeGateBlockReasonCode[] = [
    'CERTIFICATE_UNVERIFIABLE',
    'DIFF_UNEXPLAINED',
    'FIXTURE_FAILURE',
    'MISSING_RECEIPT',
    'NONDETERMINISTIC_REPLAY',
    'RECEIPT_MALFORMED',
    'RECEIPT_STALE',
    'ZERO_FIXTURES',
  ];
  if (
    input.blockingReasonCode !== null
    && !reasonCodes.includes(
      input.blockingReasonCode as DeepImprovementCommonModeGateBlockReasonCode,
    )
  ) {
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
  ) {
    throw new TypeError('Passing mode-gate input contains blocking evidence');
  }
  return Object.freeze(input as unknown as DeepImprovementCommonModeGateInput);
}

async function runCase(
  caseRun: DeepImprovementCommonParityCaseRun,
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

/** Run one case and bind both parity and real common-service certificates. */
export async function runDeepImprovementCommonParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: DeepImprovementCommonParityCaseRun;
}>): Promise<DeepImprovementCommonParityCaseOutcome> {
  const result = await runCase(input.caseRun);
  const modeCertificateBinding = await verifyModeCertificateBinding(
    input.caseRun,
    input.manifest,
  );
  const evidenceBinding = certificateEvidenceBinding(
    input.caseRun.fixture,
    result,
    input.caseRun.executors,
  );
  const evidenceBindings = evidenceBinding === null
    ? Object.freeze([])
    : sortedCertificateEvidenceBindings([evidenceBinding]);
  const bindings = certificateBindings(
    input.manifest,
    evidenceBindings,
    modeCertificateBinding,
  );
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'deep-improvement-common',
    caseResults: [result],
    bindings,
  });
  if (issuance.ok) {
    const verification = verifyParityCertificate(issuance.certificate, {
      manifest: input.manifest,
      mode: 'deep-improvement-common',
      bindings,
      caseEvidenceDigests: evidenceBindings.map(
        (entry) => entry.caseEvidenceDigest,
      ),
      referenceSetDigests: sortedUnique(
        evidenceBindings.map((entry) => entry.referenceSetDigest),
      ),
      attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
        (entry) => entry.attestationFinalDigests,
      )),
    });
    if (!verification.ok) {
      throw new TypeError('Issued parity certificate did not verify');
    }
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
      issuance.ok ? modeCertificateBinding : null,
      issuance.ok ? null : issuance.refusal.code,
    ),
  });
}

/** Run the complete closure and emit receipts plus the successor gate input. */
export async function runDeepImprovementCommonParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly DeepImprovementCommonParityCaseRun[];
}>): Promise<DeepImprovementCommonParitySuiteResult> {
  const manifestIds = requiredCaseIds(input.manifest);
  const runIds = input.cases.map((entry) => entry.caseDefinition.caseId).sort();
  if (
    manifestIds.length === 0
    || manifestIds.length !== runIds.length
    || manifestIds.some((entry, index) => entry !== runIds[index])
  ) {
    throw new TypeError('Parity suite cases must equal the manifest mode closure');
  }
  const caseResults: ShadowParityCaseResult[] = [];
  const modeBindings: Array<DeepImprovementCommonModeCertificateBinding | null> = [];
  for (const caseRun of input.cases) {
    caseResults.push(await runCase(caseRun));
    modeBindings.push(await verifyModeCertificateBinding(caseRun, input.manifest));
  }
  const modeCertificateBinding = modeBindings.length > 0
    && modeBindings.every((entry) => (
      entry !== null
      && entry.bindingDigest === modeBindings[0]?.bindingDigest
    ))
    ? modeBindings[0]
    : null;
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
  const bindings = certificateBindings(
    input.manifest,
    evidenceBindings,
    modeCertificateBinding,
  );
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'deep-improvement-common',
    caseResults,
    bindings,
  });
  const certificate = issuance.ok ? issuance.certificate : null;
  if (certificate !== null) {
    const verification = verifyParityCertificate(certificate, {
      manifest: input.manifest,
      mode: 'deep-improvement-common',
      bindings,
      caseEvidenceDigests: evidenceBindings.map(
        (entry) => entry.caseEvidenceDigest,
      ),
      referenceSetDigests: sortedUnique(
        evidenceBindings.map((entry) => entry.referenceSetDigest),
      ),
      attestationFinalDigests: sortedUnique(evidenceBindings.flatMap(
        (entry) => entry.attestationFinalDigests,
      )),
    });
    if (!verification.ok) {
      throw new TypeError('Mode parity certificate did not verify');
    }
  }
  const refusalCode = issuance.ok ? null : issuance.refusal.code;
  const receipts = input.cases.map((caseRun, index) => issueReceipt(
    input.manifest,
    caseRun.fixture,
    caseResults[index],
    caseRun.executors,
    certificate,
    certificate === null ? Object.freeze([]) : evidenceBindings,
    certificate === null ? null : modeCertificateBinding,
    refusalCode,
  ));
  const modeGateInput = createDeepImprovementCommonModeGateInput({
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
