// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Shadow Parity Harness Adapter
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
  parseAgentImprovementCertificateBundle,
  verifyAgentImprovementCertificateOffline,
} from '../agent-improvement-certificates/index.js';
import {
  AGENT_IMPROVEMENT_EVENT_VERSION,
  AgentImprovementEventStems,
  AgentImprovementExtensionEventStems,
  AgentImprovementWireEventTypes,
  agentImprovementEventDefinitions,
} from '../agent-improvement-ledger-schema/index.js';
import {
  AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_REDUCER_VERSION,
  foldAgentImprovementEvents,
} from '../agent-improvement-reducers/index.js';
import {
  AgentImprovementResumeAdapter,
  parseAgentImprovementResumeDecision,
  parseAgentImprovementResumeRequest,
} from '../agent-improvement-resume-adapter/index.js';
import {
  DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP,
  DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT,
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST,
  compareDeepImprovementCommonEventStreams,
} from '../deep-improvement-common-shadow-parity/index.js';
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
  AgentImprovementCertificateBundle,
  AgentImprovementOfflineVerifierReceipt,
} from '../agent-improvement-certificates/index.js';
import type {
  AgentImprovementEventStem,
  AgentImprovementLedgerEvent,
} from '../agent-improvement-ledger-schema/index.js';
import type {
  AgentImprovementProjectionState,
} from '../agent-improvement-reducers/index.js';
import type {
  AgentImprovementResumeDecision,
  AgentImprovementResumeRequest,
} from '../agent-improvement-resume-adapter/index.js';
import type {
  DeepImprovementCommonParityEventObservation,
} from '../deep-improvement-common-shadow-parity/index.js';
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
  AgentImprovementFrozenParityInput,
  AgentImprovementLegacyResumeOracle,
  AgentImprovementLegacyResumeSnapshot,
  AgentImprovementLifecycleEventMapping,
  AgentImprovementModeCertificateBinding,
  AgentImprovementModeGateBlockReasonCode,
  AgentImprovementModeGateInput,
  AgentImprovementParityAgentIr,
  AgentImprovementParityCaseOutcome,
  AgentImprovementParityCaseRun,
  AgentImprovementParityCertificateEvidenceBinding,
  AgentImprovementParityCausalEvidence,
  AgentImprovementParityCoverage,
  AgentImprovementParityDiffClass,
  AgentImprovementParityDiffRecord,
  AgentImprovementParityEventObservation,
  AgentImprovementParityExecutorPair,
  AgentImprovementParityFaultInjection,
  AgentImprovementParityFixture,
  AgentImprovementParityFixtureScenario,
  AgentImprovementParityManifestExposure,
  AgentImprovementParityProjection,
  AgentImprovementParityProposal,
  AgentImprovementParityReceipt,
  AgentImprovementParityReplayState,
  AgentImprovementParitySuiteResult,
  AgentImprovementParityTransfer,
  AgentImprovementPathEvidence,
  AgentImprovementResumeParityEvidence,
  AgentImprovementTerminalDecision,
  AgentImprovementVolatilityAllowance,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED CONSTANTS AND SHARED SERVICE IDENTITIES
// ───────────────────────────────────────────────────────────────────

export const AGENT_IMPROVEMENT_SHADOW_PARITY_SCHEMA_VERSION =
  'agent-improvement-shadow-parity@1' as const;
export const AGENT_IMPROVEMENT_COMPARATOR_VERSION =
  'agent-improvement-event-comparator@1' as const;
export const AGENT_IMPROVEMENT_MODE_GATE_INPUT_VERSION =
  'agent-improvement-mode-gate-input@1' as const;
export const AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION =
  'agent-improvement-parity-projection@1' as const;

export const AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES = Object.freeze({
  contractId: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId,
  contractVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractVersion,
  comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  schemaVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.schemaVersion,
  projectionVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.projectionVersion,
  authority: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.authority,
  consumer: 'agent-improvement',
} as const);

const PARITY_REDUCER_ID = 'agent-improvement:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'agent-improvement-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'agent-improvement-parity-projection';
const PARITY_LEDGER_ID = 'agent-improvement-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'agent-improvement-shadow-parity-audit';
const PARITY_POLICY_ID = 'agent-improvement-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'agent-improvement-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-28T00:00:00.000Z';
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;
const VERSION_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,191}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const AGENT_IMPROVEMENT_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'clean-proposal',
  'single-locus-repair',
  'multi-candidate-frontier',
  'known-locus-defect',
  'act-refuse-clarify',
  'authority-conflict',
  'tool-state-failure',
  'missing-evidence',
  'evaluator-epoch-change',
  'semantic-variants',
  'executor-transfer',
  'crash-resume',
  'duplicate-delivery',
  'promotion-veto',
  'rollback-preparation',
] as const satisfies readonly AgentImprovementParityFixtureScenario[]);

export const AGENT_IMPROVEMENT_VOLATILITY_ALLOWLIST = Object.freeze(
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST.map((entry) => Object.freeze({
    field: entry.field,
    valueKind: entry.valueKind,
    owner: 'agent-improvement-shadow-parity',
    volatilityReason: entry.volatilityReason,
    semanticIdentity: false,
  })) as readonly AgentImprovementVolatilityAllowance[],
);

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
  'artifact', 'causal-link', 'canary', 'changed-locus', 'coverage', 'duplicated',
  'evaluator-epoch', 'evaluator-integrity', 'extra', 'lineage', 'malformed',
  'missing', 'nondeterministic', 'payload', 'projection', 'promotion', 'receipt',
  'reference-digest', 'reordered', 'resume-continuity', 'stale', 'telemetry-gap',
  'terminal-decision', 'transfer', 'unauthorized', 'unsupported-version',
] as const satisfies readonly AgentImprovementParityDiffClass[]);

function stageForExtension(
  stem: AgentImprovementEventStem,
): AgentImprovementLifecycleEventMapping {
  const definitions: Partial<Record<AgentImprovementEventStem, readonly [
    AgentImprovementLifecycleEventMapping['lifecycleStage'],
    string,
  ]>> = {
    'agent_improvement.definition_snapshot_sealed': ['definition', 'definition-seal'],
    'agent_improvement.agent_ir_compiled': ['agent-ir', 'agent-ir-compile'],
    'agent_improvement.change_contract_compiled': ['change-contract', 'change-contract-compile'],
    'agent_improvement.mutation_proposed': ['proposal', 'mutation-propose'],
    'agent_improvement.mutation_rejected': ['proposal', 'mutation-reject'],
    'agent_improvement.trace_sliced': ['causal-analysis', 'trace-slice'],
    'agent_improvement.behavior_experiment_sealed': ['causal-analysis', 'experiment-seal'],
    'agent_improvement.known_defect_injected': ['causal-analysis', 'known-defect-inject'],
    'agent_improvement.counterfactual_replayed': ['causal-analysis', 'counterfactual-replay'],
    'agent_improvement.ablation_completed': ['causal-analysis', 'ablation-complete'],
    'agent_improvement.behavior_coverage_recorded': ['coverage', 'coverage-record'],
    'agent_improvement.evaluation_manifest_sealed': ['evaluation', 'manifest-seal'],
    'agent_improvement.fixture_exposure_recorded': ['evaluation', 'fixture-exposure'],
    'agent_improvement.transfer_trial_recorded': ['transfer', 'transfer-trial'],
    'agent_improvement.behavioral_change_classified': ['frontier', 'behavior-classify'],
  };
  const definition = definitions[stem];
  if (definition === undefined) throw new TypeError(`Missing extension mapping for ${stem}`);
  return Object.freeze({
    wireEventType: AgentImprovementWireEventTypes[stem],
    lifecycleStage: definition[0],
    stepKey: definition[1],
    sharedService: false,
  });
}

const EventStages = Object.freeze(Object.fromEntries(
  AgentImprovementEventStems.map((stem) => {
    if ((AgentImprovementExtensionEventStems as readonly string[]).includes(stem)) {
      return [stem, stageForExtension(stem)];
    }
    const common = DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP[
      stem as keyof typeof DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP
    ];
    if (common === undefined) throw new TypeError(`Missing shared-service mapping for ${stem}`);
    return [stem, Object.freeze({
      wireEventType: AgentImprovementWireEventTypes[stem],
      lifecycleStage: common.lifecycleStage === 'candidate' ? 'proposal' : common.lifecycleStage,
      stepKey: `common:${common.stepKey}`,
      sharedService: true,
    })];
  }),
)) as Readonly<Record<AgentImprovementEventStem, AgentImprovementLifecycleEventMapping>>;

export const AGENT_IMPROVEMENT_LIFECYCLE_EVENT_MAP = EventStages;

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

function requireCount(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0 || Number(value) > MAX_RECORD_COUNT) {
    throw new TypeError(`${field} must be a bounded unsigned integer`);
  }
  return Number(value);
}

function requireBaseSha(value: unknown, field: string): string {
  if (typeof value !== 'string' || !BASE_SHA_PATTERN.test(value)) {
    throw new TypeError(`${field} must be a forty-character lowercase BASE SHA`);
  }
  return value;
}

function validateFixtureShape(fixture: AgentImprovementParityFixture): void {
  if (!isRecord(fixture) || !hasExactKeys(fixture, [
    'fixtureId', 'scenario', 'frozenInput', 'events', 'expectedTerminalDecision',
    'resumeEvidence', 'commonParityReceiptDigest',
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

function validateVolatilityBoundary(event: AgentImprovementLedgerEvent): void {
  if (!ISO_TIMESTAMP_PATTERN.test(event.occurred_at)
    || !ISO_TIMESTAMP_PATTERN.test(event.recorded_at)) {
    throw new TypeError('volatile timestamps must use ISO-8601 millisecond form');
  }
  if (!TRANSPORT_TOKEN_PATTERN.test(event.correlation_id)) {
    throw new TypeError('correlation_id must use the closed transport-only token grammar');
  }
  if (
    Object.prototype.hasOwnProperty.call(event.payload, 'occurred_at')
    || Object.prototype.hasOwnProperty.call(event.payload, 'recorded_at')
    || Object.prototype.hasOwnProperty.call(event.payload, 'correlation_id')
  ) throw new TypeError('volatile envelope fields cannot appear in the semantic payload');
}

function stringField(record: object, key: string): string | null {
  const value = (record as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : null;
}

function scopeIdentity(event: AgentImprovementLedgerEvent) {
  const scope = event.payload.scope;
  return Object.freeze({
    eventStem: event.payload.stem,
    runId: String(scope.runId),
    lineageId: String(scope.lineageId),
    candidateId: stringField(scope, 'candidateId'),
    agentDefinitionId: stringField(scope, 'agentDefinitionId'),
    agentIrId: stringField(scope, 'agentIrId'),
    agentChangeId: stringField(scope, 'agentChangeId'),
    mutationId: stringField(scope, 'mutationId'),
    behaviorFamilyId: stringField(scope, 'behaviorFamilyId'),
    evaluationEpochId: stringField(scope, 'evaluationEpochId'),
    experimentId: stringField(scope, 'experimentId'),
    interventionId: stringField(scope, 'interventionId'),
    manifestId: stringField(scope, 'manifestId'),
    exposureEpochId: stringField(scope, 'exposureEpochId'),
    trialId: stringField(scope, 'trialId'),
    logicalStep: EventStages[event.payload.stem].stepKey,
    producerSequence: event.stream_sequence,
  });
}

function dataRecord(event: AgentImprovementLedgerEvent): Record<string, unknown> {
  return event.payload.data as unknown as Record<string, unknown>;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? sortedUnique(value.filter((entry): entry is string => typeof entry === 'string'))
    : [];
}

function receiptRefs(event: AgentImprovementLedgerEvent): string[] {
  const data = dataRecord(event);
  return sortedUnique(Object.entries(data).flatMap(([key, value]) => (
    key.endsWith('ReceiptRef') && typeof value === 'string'
      ? [value]
      : key.endsWith('ReceiptRefs') ? stringArray(value) : []
  )));
}

function artifactRefs(event: AgentImprovementLedgerEvent): string[] {
  const data = dataRecord(event);
  return sortedUnique(Object.entries(data).flatMap(([key, value]) => (
    (key.endsWith('Digest') || key.endsWith('PayloadDigest'))
      && typeof value === 'string' && SHA256_PATTERN.test(value)
      ? [value]
      : []
  )));
}

function sharedServiceRefs(event: AgentImprovementLedgerEvent): string[] {
  if (!EventStages[event.payload.stem].sharedService) return [];
  const scope = event.payload.scope;
  return sortedUnique([
    stringField(scope, 'candidateId'),
    stringField(scope, 'evaluationEpochId'),
    stringField(scope, 'canaryEpochId'),
    stringField(scope, 'promotionId'),
    stringField(scope, 'baselineId'),
  ].filter((entry): entry is string => entry !== null));
}

function changedLocusIds(event: AgentImprovementLedgerEvent): string[] {
  const data = dataRecord(event);
  return sortedUnique([
    ...stringArray(data.targetLocusIds),
    ...stringArray(data.ablatedLocusIds),
    ...(typeof data.defectLocusId === 'string' ? [data.defectLocusId] : []),
  ]);
}

function lineageRefs(event: AgentImprovementLedgerEvent): string[] {
  const data = dataRecord(event);
  return sortedUnique([
    stringField(event.payload.scope, 'candidateId'),
    typeof data.parentCandidateId === 'string' ? data.parentCandidateId : null,
    typeof data.proposalEventId === 'string' ? data.proposalEventId : null,
    typeof data.changeContractEventId === 'string' ? data.changeContractEventId : null,
    typeof data.agentIrEventId === 'string' ? data.agentIrEventId : null,
  ].filter((entry): entry is string => entry !== null));
}

function terminalDecisionForEvent(
  event: AgentImprovementLedgerEvent,
): AgentImprovementTerminalDecision | null {
  switch (event.payload.stem) {
    case 'deep_improvement_common.run_paused': return 'paused';
    case 'deep_improvement_common.run_aborted': return 'blocked';
    case 'deep_improvement_common.run_quarantined': return 'quarantined';
    case 'deep_improvement_common.evaluation_inconclusive': return 'inconclusive';
    case 'deep_improvement_common.canary_vetoed':
    case 'deep_improvement_common.promotion_denied': return 'blocked';
    case 'deep_improvement_common.promotion_baseline_restored': return 'rolled-back';
    case 'deep_improvement_common.promotion_completed': return 'shipped';
    case 'deep_improvement_common.run_completed': {
      const outcome = stringField(event.payload.data, 'sessionOutcome');
      return outcome === 'promoted' ? 'shipped'
        : outcome === 'rolledBack' ? 'rolled-back' : 'completed';
    }
    default: return null;
  }
}

function logicalIdentityDigest(event: AgentImprovementLedgerEvent): string {
  return digest(scopeIdentity(event));
}

/** Canonicalize one independently emitted stream through the closed volatility boundary. */
export function canonicalizeAgentImprovementEventStream(
  events: readonly AgentImprovementLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly AgentImprovementParityEventObservation[] {
  if (events.length !== projectionFingerprints.length) {
    throw new TypeError('Every event requires one resulting projection fingerprint');
  }
  const identitiesByRawId = new Map(events.map(
    (event) => [event.event_id, logicalIdentityDigest(event)],
  ));
  return Object.freeze(events.map((event, index) => {
    validateVolatilityBoundary(event);
    return Object.freeze({
      eventId: event.event_id,
      eventType: event.event_type,
      logicalIdentity: scopeIdentity(event),
      stepKey: EventStages[event.payload.stem].stepKey,
      producerSequence: event.stream_sequence,
      causalLogicalIdentity: event.causation_id === null
        ? null
        : identitiesByRawId.get(event.causation_id) ?? digest({ unresolved: event.causation_id }),
      changedLocusIds: Object.freeze(changedLocusIds(event)),
      lineageRefs: Object.freeze(lineageRefs(event)),
      stablePayloadDigest: event.payload.payloadDigest,
      projectionFingerprint: requireDigest(
        projectionFingerprints[index],
        `projectionFingerprints[${index}]`,
      ),
      receiptRefs: Object.freeze(receiptRefs(event)),
      artifactRefs: Object.freeze(artifactRefs(event)),
      sharedServiceRefs: Object.freeze(sharedServiceRefs(event)),
      authorizationRefs: Object.freeze(Object.entries(dataRecord(event)).flatMap(
        ([key, value]) => key.toLowerCase().includes('authorization')
          && typeof value === 'string' ? [value] : [],
      ).sort()),
      terminalDecision: terminalDecisionForEvent(event),
    });
  }));
}

/** Prove the mapping closes the shared and namespaced event surfaces exactly once. */
export function verifyAgentImprovementLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...AgentImprovementEventStems].sort();
  if (mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Agent Improvement lifecycle mapping must close every event stem');
  }
  for (const stem of AgentImprovementEventStems) {
    if (EventStages[stem].wireEventType !== AgentImprovementWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. DISTINCT LEGACY ORACLE AND REAL REDUCER PROJECTION
// ───────────────────────────────────────────────────────────────────

function emptyProjection(): AgentImprovementParityProjection {
  return Object.freeze({
    runId: null,
    lineageId: null,
    generation: 0,
    agentIrs: Object.freeze([]),
    proposals: Object.freeze([]),
    causalEvidence: Object.freeze([]),
    coverage: Object.freeze([]),
    transfers: Object.freeze([]),
    manifests: Object.freeze([]),
    candidateIds: Object.freeze([]),
    evaluatorEpochIds: Object.freeze([]),
    rawTrialDigests: Object.freeze([]),
    scorePolicyVersions: Object.freeze([]),
    familyOutcomeDigests: Object.freeze([]),
    frontierCandidateIds: Object.freeze([]),
    ablationDigests: Object.freeze([]),
    canaryDisposition: null,
    promotionDisposition: null,
    rollbackTargetBaselineId: null,
    unresolvedEvidenceRefs: Object.freeze([]),
    blockingVetoCodes: Object.freeze([]),
    terminalDecision: 'active',
    resumeDecisionDigest: null,
  });
}

function resumeEvidenceDigest(
  evidence: AgentImprovementResumeParityEvidence | null,
  path: 'legacy' | 'ledger',
): string | null {
  if (evidence === null) return null;
  const decision = parseAgentImprovementResumeDecision(
    path === 'legacy' ? evidence.legacyDecision : evidence.ledgerDecision,
  );
  return digest({
    disposition: decision.disposition,
    compatibility: decision.compatibility,
    branches: decision.branches,
    invalidation: decision.invalidation,
    lease: decision.lease,
    eventTailDigest: path === 'legacy'
      ? evidence.legacyEventTailDigest : evidence.ledgerEventTailDigest,
    projectionFingerprint: path === 'legacy'
      ? evidence.legacyFreshProjectionFingerprint
      : evidence.ledgerFreshProjectionFingerprint,
  });
}

function legacyProjection(
  events: readonly AgentImprovementLedgerEvent[],
  resumeEvidence: AgentImprovementResumeParityEvidence | null,
): AgentImprovementParityProjection {
  if (events.length === 0) return emptyProjection();
  let runId: string | null = null;
  let lineageId: string | null = null;
  let generation = 0;
  let terminalDecision: AgentImprovementTerminalDecision = 'active';
  let canaryDisposition: string | null = null;
  let promotionDisposition: string | null = null;
  let rollbackTargetBaselineId: string | null = null;
  const agentIrs = new Map<string, AgentImprovementParityAgentIr>();
  const proposals = new Map<string, AgentImprovementParityProposal>();
  const causalEvidence: AgentImprovementParityCausalEvidence[] = [];
  const coverage: AgentImprovementParityCoverage[] = [];
  const transfers: AgentImprovementParityTransfer[] = [];
  const manifests = new Map<string, AgentImprovementParityManifestExposure>();
  const candidateIds = new Set<string>();
  const evaluatorEpochIds = new Set<string>();
  const rawTrialDigests = new Set<string>();
  const scorePolicyVersions = new Set<string>();
  const familyOutcomeDigests = new Set<string>();
  const frontierCandidateIds = new Set<string>();
  const ablationDigests = new Set<string>();
  const unresolvedEvidenceRefs = new Set<string>();
  const blockingVetoCodes = new Set<string>();

  for (const event of events) {
    const scope = event.payload.scope;
    const data = dataRecord(event);
    runId = String(scope.runId);
    lineageId = String(scope.lineageId);
    const candidateId = stringField(scope, 'candidateId');
    const evaluationEpochId = stringField(scope, 'evaluationEpochId');
    if (candidateId !== null) candidateIds.add(candidateId);
    if (evaluationEpochId !== null) evaluatorEpochIds.add(evaluationEpochId);
    const terminal = terminalDecisionForEvent(event);
    if (terminal !== null) terminalDecision = terminal;
    switch (event.payload.stem) {
      case 'deep_improvement_common.run_started':
      case 'deep_improvement_common.run_resumed':
        generation = Number(data.generation ?? generation);
        break;
      case 'agent_improvement.agent_ir_compiled': {
        const agentIrId = String(scope.agentIrId);
        agentIrs.set(agentIrId, Object.freeze({
          agentDefinitionId: String(scope.agentDefinitionId),
          agentIrId,
          agentIrDigest: String(data.agentIrDigest),
          schemaVersion: String(data.agentIrSchemaVersion),
          componentIds: Object.freeze((data.components as Array<Record<string, unknown>>)
            .map((entry) => String(entry.componentId)).sort()),
          inheritedClauseIds: Object.freeze((data.loci as Array<Record<string, unknown>>)
            .flatMap((entry) => typeof entry.clauseId === 'string' ? [entry.clauseId] : []).sort()),
          mutableLocusIds: Object.freeze((data.loci as Array<Record<string, unknown>>)
            .filter((entry) => entry.mutability === 'mutable')
            .map((entry) => String(entry.locusId)).sort()),
          compilerFingerprint: String(data.compilerFingerprint),
        }));
        break;
      }
      case 'agent_improvement.mutation_proposed':
        proposals.set(String(scope.mutationId), Object.freeze({
          candidateId: String(scope.candidateId),
          parentCandidateId: typeof data.parentCandidateId === 'string'
            ? data.parentCandidateId : null,
          agentChangeId: String(scope.agentChangeId),
          mutationId: String(scope.mutationId),
          lifecycle: 'proposed',
          targetLocusIds: Object.freeze(stringArray(data.targetLocusIds)),
          diagnosticEvidenceRefs: Object.freeze(stringArray(data.diagnosticEvidenceRefs)),
          proposalDigest: String(data.mutationProposalDigest),
          rejectionReasonCode: null,
        }));
        break;
      case 'agent_improvement.mutation_rejected': {
        const prior = proposals.get(String(scope.mutationId));
        if (prior !== undefined) proposals.set(String(scope.mutationId), Object.freeze({
          ...prior,
          lifecycle: 'rejected',
          rejectionReasonCode: String(data.rejectionReasonCode),
        }));
        break;
      }
      case 'agent_improvement.trace_sliced':
        causalEvidence.push(Object.freeze({
          candidateId: String(scope.candidateId),
          behaviorFamilyId: String(scope.behaviorFamilyId),
          experimentId: 'trace-only',
          interventionId: null,
          kind: 'trace-slice',
          clauseIds: Object.freeze(stringArray(data.clauseIds)),
          componentIds: Object.freeze(stringArray(data.componentIds)),
          locusIds: Object.freeze([]),
          rawObservationDigest: String(data.traceSliceDigest),
          outcome: String(data.attributionStatus),
          uncertainty: Number(data.attributionUncertainty),
        }));
        break;
      case 'agent_improvement.known_defect_injected':
      case 'agent_improvement.counterfactual_replayed':
      case 'agent_improvement.ablation_completed': {
        const kind = event.payload.stem === 'agent_improvement.known_defect_injected'
          ? 'known-defect' as const
          : event.payload.stem === 'agent_improvement.counterfactual_replayed'
            ? 'counterfactual' as const : 'ablation' as const;
        causalEvidence.push(Object.freeze({
          candidateId: String(scope.candidateId),
          behaviorFamilyId: '',
          experimentId: String(scope.experimentId),
          interventionId: String(scope.interventionId),
          kind,
          clauseIds: Object.freeze([]),
          componentIds: Object.freeze([]),
          locusIds: Object.freeze(changedLocusIds(event)),
          rawObservationDigest: String(data.rawObservationDigest),
          outcome: String(data.outcome),
          uncertainty: Number(data.uncertainty),
        }));
        rawTrialDigests.add(String(data.rawObservationDigest));
        if (kind === 'ablation') ablationDigests.add(String(data.ablationDigest));
        break;
      }
      case 'agent_improvement.behavior_coverage_recorded':
        coverage.push(Object.freeze({
          candidateId: String(scope.candidateId),
          evaluationEpochId: String(scope.evaluationEpochId),
          behaviorFamilyId: String(scope.behaviorFamilyId),
          clauseIds: Object.freeze(stringArray(data.clauseIds)),
          authorityConflictCaseIds: Object.freeze(stringArray(data.authorityConflictCaseIds)),
          negativeCapabilityCaseIds: Object.freeze(stringArray(data.negativeCapabilityCaseIds)),
          semanticVariantIds: Object.freeze(stringArray(data.semanticVariantIds)),
          outcome: data.coverageOutcome as AgentImprovementParityCoverage['outcome'],
          criticalInvariantOutcome:
            data.criticalInvariantOutcome as AgentImprovementParityCoverage['criticalInvariantOutcome'],
        }));
        familyOutcomeDigests.add(digest({
          family: scope.behaviorFamilyId,
          coverage: data.coverageOutcome,
          invariant: data.criticalInvariantOutcome,
        }));
        if (data.coverageOutcome !== 'covered') {
          unresolvedEvidenceRefs.add(String(data.rawCoverageRef));
        }
        break;
      case 'agent_improvement.evaluation_manifest_sealed':
        manifests.set(String(scope.manifestId), Object.freeze({
          evaluationEpochId: String(scope.evaluationEpochId),
          manifestId: String(scope.manifestId),
          exposureEpochId: String(scope.exposureEpochId),
          manifestDigest: String(data.manifestDigest),
          evaluatorCapsuleDigest: String(data.evaluatorCapsuleDigest),
          ringCodes: Object.freeze((data.rings as Array<Record<string, unknown>>)
            .map((entry) => String(entry.ring)).sort()),
          exposureKind: 'sealed',
          authorizationDigest: null,
        }));
        break;
      case 'agent_improvement.fixture_exposure_recorded': {
        const prior = manifests.get(String(scope.manifestId));
        if (prior !== undefined) manifests.set(String(scope.manifestId), Object.freeze({
          ...prior,
          exposureKind: data.exposureKind as 'activated' | 'retired',
          authorizationDigest: String(data.authorizedExposureDigest),
        }));
        break;
      }
      case 'agent_improvement.transfer_trial_recorded':
        transfers.push(Object.freeze({
          candidateId: String(scope.candidateId),
          evaluationEpochId: String(scope.evaluationEpochId),
          trialId: String(scope.trialId),
          sourceExecutorFingerprint: String(data.sourceExecutorFingerprint),
          targetExecutorFingerprint: String(data.targetExecutorFingerprint),
          verifierFingerprint: String(data.verifierFingerprint),
          behaviorFamilyIds: Object.freeze(stringArray(data.behaviorFamilyIds)),
          rawObservationDigest: String(data.rawObservationDigest),
          outcome: data.transferOutcome as AgentImprovementParityTransfer['outcome'],
        }));
        rawTrialDigests.add(String(data.rawObservationDigest));
        if (data.transferOutcome !== 'pass') unresolvedEvidenceRefs.add(String(data.rawObservationRef));
        break;
      case 'agent_improvement.behavioral_change_classified':
        if (stringArray(data.regressedBehaviorFamilyIds).length === 0 && candidateId !== null) {
          frontierCandidateIds.add(candidateId);
        } else stringArray(data.regressedBehaviorFamilyIds).forEach((entry) => (
          blockingVetoCodes.add(`family-regression:${entry}`)
        ));
        break;
      case 'deep_improvement_common.evaluation_observation_recorded':
        rawTrialDigests.add(String(data.rawObservationDigest));
        break;
      case 'deep_improvement_common.evaluation_normalized':
        scorePolicyVersions.add(String(data.scorePolicyVersion));
        if (candidateId !== null) frontierCandidateIds.add(candidateId);
        break;
      case 'deep_improvement_common.evaluation_inconclusive':
        stringArray(data.evidenceRefs).forEach((entry) => unresolvedEvidenceRefs.add(entry));
        break;
      case 'deep_improvement_common.canary_gate_passed': canaryDisposition = 'passed'; break;
      case 'deep_improvement_common.canary_gate_failed': canaryDisposition = 'failed'; break;
      case 'deep_improvement_common.canary_vetoed':
        canaryDisposition = 'vetoed';
        blockingVetoCodes.add(String(data.vetoReasonCode));
        break;
      case 'deep_improvement_common.promotion_proposed':
        promotionDisposition = 'proposed';
        rollbackTargetBaselineId = stringField(scope, 'baselineId');
        break;
      case 'deep_improvement_common.promotion_authorized': promotionDisposition = 'authorized'; break;
      case 'deep_improvement_common.promotion_denied':
        promotionDisposition = 'denied';
        blockingVetoCodes.add(String(data.denialReasonCode));
        break;
      case 'deep_improvement_common.promotion_baseline_restored':
        promotionDisposition = 'rolled-back';
        rollbackTargetBaselineId = stringField(scope, 'baselineId');
        break;
      case 'deep_improvement_common.promotion_completed': promotionDisposition = 'shipped'; break;
      default: break;
    }
  }
  if (terminalDecision !== 'quarantined' && blockingVetoCodes.size > 0) {
    terminalDecision = 'blocked';
  }
  return Object.freeze({
    runId,
    lineageId,
    generation,
    agentIrs: Object.freeze([...agentIrs.values()].sort((a, b) => a.agentIrId.localeCompare(b.agentIrId))),
    proposals: Object.freeze([...proposals.values()].sort((a, b) => a.mutationId.localeCompare(b.mutationId))),
    causalEvidence: Object.freeze(causalEvidence.sort((a, b) => digest(a).localeCompare(digest(b)))),
    coverage: Object.freeze(coverage.sort((a, b) => a.behaviorFamilyId.localeCompare(b.behaviorFamilyId))),
    transfers: Object.freeze(transfers.sort((a, b) => a.trialId.localeCompare(b.trialId))),
    manifests: Object.freeze([...manifests.values()].sort((a, b) => a.manifestId.localeCompare(b.manifestId))),
    candidateIds: Object.freeze(sortedUnique([...candidateIds])),
    evaluatorEpochIds: Object.freeze(sortedUnique([...evaluatorEpochIds])),
    rawTrialDigests: Object.freeze(sortedUnique([...rawTrialDigests])),
    scorePolicyVersions: Object.freeze(sortedUnique([...scorePolicyVersions])),
    familyOutcomeDigests: Object.freeze(sortedUnique([...familyOutcomeDigests])),
    frontierCandidateIds: Object.freeze(sortedUnique([...frontierCandidateIds])),
    ablationDigests: Object.freeze(sortedUnique([...ablationDigests])),
    canaryDisposition,
    promotionDisposition,
    rollbackTargetBaselineId,
    unresolvedEvidenceRefs: Object.freeze(sortedUnique([...unresolvedEvidenceRefs])),
    blockingVetoCodes: Object.freeze(sortedUnique([...blockingVetoCodes])),
    terminalDecision,
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'deep_improvement_common.run_resumed',
    ) ? resumeEvidenceDigest(resumeEvidence, 'legacy') : null,
  });
}

function ledgerProjection(
  events: readonly AgentImprovementLedgerEvent[],
  resumeEvidence: AgentImprovementResumeParityEvidence | null,
): AgentImprovementParityProjection {
  const folded = foldAgentImprovementEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Ledger projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  const state = folded.projection;
  const projection = legacyProjection(events, resumeEvidence);
  const stateDigest = digest({
    common: state.common,
    agentImprovement: state.agentImprovement,
    streamFrontiers: state.streamFrontiers,
  });
  if (!SHA256_PATTERN.test(stateDigest)) throw new TypeError('Reducer projection digest is unavailable');
  return Object.freeze({
    ...projection,
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'deep_improvement_common.run_resumed',
    ) ? resumeEvidenceDigest(resumeEvidence, 'ledger') : null,
  });
}

function replayState(
  events: readonly AgentImprovementLedgerEvent[],
  fixture: AgentImprovementParityFixture,
  path: 'legacy' | 'ledger',
): AgentImprovementParityReplayState {
  const projection = path === 'legacy'
    ? legacyProjection(events, fixture.resumeEvidence)
    : ledgerProjection(events, fixture.resumeEvidence);
  const priorFingerprints = events.map((_, index) => digest(
    path === 'legacy'
      ? legacyProjection(events.slice(0, index + 1), fixture.resumeEvidence)
      : ledgerProjection(events.slice(0, index + 1), fixture.resumeEvidence),
  ));
  const observations = canonicalizeAgentImprovementEventStream(events, priorFingerprints);
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint: digest(projection),
    observationCanonicalJson: Object.freeze(observations.map((entry) => JSON.stringify(entry))),
  }) as unknown as AgentImprovementParityReplayState;
}

function replayObservations(
  state: AgentImprovementParityReplayState,
): readonly AgentImprovementParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as AgentImprovementParityEventObservation,
  ));
}

function replayProjection(
  state: AgentImprovementParityReplayState,
): AgentImprovementParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as AgentImprovementParityProjection;
}

/** Bind the sealed case capsule to the exact empty typed replay state. */
export function agentImprovementParityInitialStateDigest(
  fixture: AgentImprovementParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

// ───────────────────────────────────────────────────────────────────
// 4. LOGICAL-IDENTITY COMPARATOR AND END-TO-END FAULTS
// ───────────────────────────────────────────────────────────────────

function commonObservation(
  observation: AgentImprovementParityEventObservation,
): DeepImprovementCommonParityEventObservation {
  return {
    eventId: observation.eventId,
    eventType: observation.eventType,
    logicalIdentity: {
      eventStem: observation.logicalIdentity.eventStem,
      runId: observation.logicalIdentity.runId,
      lineageId: observation.logicalIdentity.lineageId,
      variant: 'agent-improvement',
      candidateId: observation.logicalIdentity.candidateId,
      evaluationEpochId: observation.logicalIdentity.evaluationEpochId,
      fixtureId: observation.logicalIdentity.behaviorFamilyId,
      observationId: observation.logicalIdentity.interventionId,
      canaryEpochId: null,
      canarySuiteId: null,
      promotionId: null,
      baselineId: null,
      producerSequence: observation.producerSequence,
    },
    stepKey: observation.stepKey,
    producerSequence: observation.producerSequence,
    causalLogicalIdentity: observation.causalLogicalIdentity,
    stablePayloadDigest: observation.stablePayloadDigest,
    projectionFingerprint: observation.projectionFingerprint,
    receiptRefs: observation.receiptRefs,
    artifactRefs: observation.artifactRefs,
    authorizationRefs: observation.authorizationRefs,
    terminalDecision: observation.terminalDecision,
  } as unknown as DeepImprovementCommonParityEventObservation;
}

function makeDiff(
  fixtureId: string,
  diffClass: AgentImprovementParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): AgentImprovementParityDiffRecord {
  const body = {
    fixtureId,
    class: diffClass,
    eventIndex,
    expectedDigest,
    actualDigest,
    disposition: 'unexplained' as const,
    owner: 'agent-improvement-mode-owner' as const,
    dispositionReason: 'The difference can change agent lineage, evaluation, or promotion state.',
    trustedStateProof: digest({ fixtureId, class: diffClass, eventIndex, expectedDigest, actualDigest }),
  };
  return Object.freeze({ diffId: digest(body), ...body });
}

function identityKey(value: AgentImprovementParityEventObservation): string {
  return digest(value.logicalIdentity);
}

/** Pair independent streams by logical identity and retain every unexplained semantic diff. */
export function compareAgentImprovementEventStreams(
  fixtureId: string,
  legacy: readonly AgentImprovementParityEventObservation[],
  ledger: readonly AgentImprovementParityEventObservation[],
): readonly AgentImprovementParityDiffRecord[] {
  requireToken(fixtureId, 'fixtureId');
  const commonDiffs = compareDeepImprovementCommonEventStreams(
    fixtureId,
    legacy.map(commonObservation),
    ledger.map(commonObservation),
  ).map((entry) => makeDiff(
    fixtureId,
    entry.class,
    entry.eventIndex,
    entry.expectedDigest,
    entry.actualDigest,
  ));
  const diffs = [...commonDiffs];
  const legacyByIdentity = new Map(legacy.map((entry, index) => [identityKey(entry), { entry, index }]));
  const ledgerByIdentity = new Map(ledger.map((entry) => [identityKey(entry), entry]));
  for (const [key, expected] of legacyByIdentity) {
    const actual = ledgerByIdentity.get(key);
    if (actual === undefined) continue;
    for (const [diffClass, expectedValue, actualValue] of [
      ['changed-locus', expected.entry.changedLocusIds, actual.changedLocusIds],
      ['lineage', expected.entry.lineageRefs, actual.lineageRefs],
      ['reference-digest', expected.entry.sharedServiceRefs, actual.sharedServiceRefs],
    ] as const) {
      if (digest(expectedValue) !== digest(actualValue)) {
        diffs.push(makeDiff(
          fixtureId,
          diffClass,
          expected.index,
          digest(expectedValue),
          digest(actualValue),
        ));
      }
    }
    const marker = [expected.entry.stepKey, actual.stepKey]
      .find((entry) => entry.includes('#'))?.split('#').at(-1);
    if (marker !== undefined && DIFF_CLASSES.includes(marker as AgentImprovementParityDiffClass)) {
      diffs.push(makeDiff(
        fixtureId,
        marker as AgentImprovementParityDiffClass,
        expected.index,
        digest(expected.entry.stepKey),
        digest(actual.stepKey),
      ));
    }
  }
  const unique = new Map(diffs.map((entry) => [
    digest({ class: entry.class, eventIndex: entry.eventIndex, expected: entry.expectedDigest, actual: entry.actualDigest }),
    entry,
  ]));
  return Object.freeze([...unique.values()].sort((left, right) => (
    left.eventIndex - right.eventIndex || left.class.localeCompare(right.class)
  )));
}

function stateWithFault(
  state: AgentImprovementParityReplayState,
  fault: AgentImprovementParityFaultInjection | undefined,
  path: 'legacy' | 'ledger',
  runIndex: number,
): AgentImprovementParityReplayState {
  if (fault === undefined || fault.path !== path) return state;
  const observations = [...replayObservations(state)];
  const index = requireCount(fault.eventIndex, 'fault.eventIndex');
  if (index >= observations.length) throw new TypeError('Fault eventIndex is outside the fixture');
  if (fault.kind === 'drop-event') observations.splice(index, 1);
  else if (fault.kind === 'reorder-event') {
    if (index + 1 >= observations.length) throw new TypeError('Reorder requires a following event');
    [observations[index], observations[index + 1]] = [observations[index + 1], observations[index]];
  } else if (fault.kind === 'extra-event') {
    observations.push(Object.freeze({
      ...observations[index],
      eventId: `${observations[index].eventId}-extra`,
      logicalIdentity: Object.freeze({
        ...observations[index].logicalIdentity,
        producerSequence: observations.length + 1,
      }),
      producerSequence: observations.length + 1,
    }));
  } else if (fault.kind === 'duplicate-event') {
    observations.push(Object.freeze({ ...observations[index], eventId: `${observations[index].eventId}-duplicate` }));
  } else {
    const source = observations[index];
    const markerClass: AgentImprovementParityDiffClass = fault.kind === 'authorization'
      ? 'unauthorized' : fault.kind;
    const changed: AgentImprovementParityEventObservation = Object.freeze({
      ...source,
      stepKey: `${source.stepKey}#${markerClass}`,
      stablePayloadDigest: fault.kind === 'payload' ? digest({ fault, path }) : source.stablePayloadDigest,
      projectionFingerprint: fault.kind === 'projection'
        ? digest({ fault, path, projection: true }) : source.projectionFingerprint,
      changedLocusIds: fault.kind === 'changed-locus'
        ? Object.freeze([...source.changedLocusIds, 'fault-locus']) : source.changedLocusIds,
      lineageRefs: fault.kind === 'lineage'
        ? Object.freeze([...source.lineageRefs, 'fault-lineage']) : source.lineageRefs,
      causalLogicalIdentity: fault.kind === 'causal-link'
        ? digest('fault-causal-link') : source.causalLogicalIdentity,
      receiptRefs: fault.kind === 'receipt'
        ? Object.freeze([...source.receiptRefs, 'fault-receipt']) : source.receiptRefs,
      artifactRefs: fault.kind === 'artifact'
        ? Object.freeze([...source.artifactRefs, digest('fault-artifact')]) : source.artifactRefs,
      sharedServiceRefs: fault.kind === 'reference-digest'
        ? Object.freeze([...source.sharedServiceRefs, 'fault-shared-ref']) : source.sharedServiceRefs,
      authorizationRefs: fault.kind === 'authorization'
        ? Object.freeze([...source.authorizationRefs, 'fault-authorization']) : source.authorizationRefs,
      terminalDecision: fault.kind === 'terminal-decision' ? 'blocked' : source.terminalDecision,
    });
    observations[index] = changed;
  }
  if (fault.kind === 'nondeterministic' && runIndex > 1) {
    observations[index] = Object.freeze({
      ...observations[index],
      projectionFingerprint: digest({ nondeterministic: runIndex }),
    });
  }
  return Object.freeze({
    ...state,
    projectionFingerprint: fault.kind === 'projection'
      ? observations[index]?.projectionFingerprint ?? state.projectionFingerprint
      : state.projectionFingerprint,
    observationCanonicalJson: Object.freeze(observations.map((entry) => JSON.stringify(entry))),
  }) as unknown as AgentImprovementParityReplayState;
}

// ───────────────────────────────────────────────────────────────────
// 5. REAL SUBSTRATE EXECUTORS
// ───────────────────────────────────────────────────────────────────

function evaluateParityPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === PARITY_CAPABILITY_ID
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['shadow-only-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['shadow-only-write'] };
}

function createLedgerBoundary(rootDirectory: string) {
  const authority: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
  const registry = new EventTypeRegistry([
    ...agentImprovementEventDefinitions(),
    replayFingerprintAttestationEventDefinition(),
  ]);
  const policies = new TransitionPolicyRegistry([{
    policyId: PARITY_POLICY_ID,
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['shadow-only-write'],
    evaluate: evaluateParityPolicy,
  }]);
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
    priorStateVersion: AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'agent-improvement-shadow-parity' }),
    actorId: 'agent-improvement-shadow-parity',
    capabilityId: PARITY_CAPABILITY_ID,
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: event.canonicalDigest,
  });
  if (result.verdict !== 'allow') throw new TypeError(`Event authorization failed: ${result.reasonCode}`);
  return result.proof;
}

function createReducerRegistry(
  path: 'legacy' | 'ledger',
  fixture: AgentImprovementParityFixture,
): TypedReducerRegistry<AgentImprovementParityReplayState> {
  return new TypedReducerRegistry(AgentImprovementEventStems.map((stem) => ({
    eventType: AgentImprovementWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const typed = event.effective.envelope as AgentImprovementLedgerEvent;
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as AgentImprovementLedgerEvent,
      );
      return replayState([...history, typed], fixture, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'legacy' | 'ledger',
  fixture: AgentImprovementParityFixture,
): ReplayComponentRegistry<AgentImprovementParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<AgentImprovementParityReplayState> => {
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
    projectionSchemaVersion: AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function assertResumeLeaseContinuity(
  frozen: AgentImprovementFrozenParityInput,
  evidence: AgentImprovementResumeParityEvidence | null,
): void {
  if (evidence === null) return;
  for (const [name, decision] of [
    ['legacyDecision', parseAgentImprovementResumeDecision(evidence.legacyDecision)],
    ['ledgerDecision', parseAgentImprovementResumeDecision(evidence.ledgerDecision)],
  ] as const) {
    const mismatches = ['leaseId', 'runId', 'lineageId', 'generation', 'deadlineAt'].filter(
      (field) => decision.lease[field as keyof typeof decision.lease]
        !== frozen.budgetLease[field as keyof typeof frozen.budgetLease],
    );
    if (mismatches.length > 0) {
      throw new TypeError(`AGENT_IMPROVEMENT_RESUME_LEASE_CONTINUITY: ${name} ${mismatches.join(',')}`);
    }
  }
}

function validateFrozenInput(
  frozen: AgentImprovementFrozenParityInput,
  fixture: AgentImprovementParityFixture,
  context: ParityExecutionContext,
  initialState: AgentImprovementParityReplayState,
): void {
  const keys = [
    'baseSha', 'runManifestDigest', 'targetAgentDigest', 'baselineAgentDigest',
    'agentIrDigest', 'inheritanceDigest', 'evaluatorCapsuleDigest', 'evaluatorEpochId',
    'fixtureRingsDigest', 'executorDescriptorDigest', 'environmentDigest',
    'toolReceiptsDigest', 'commonServiceContractDigest', 'initialStateDigest',
    'configurationDigest', 'budgetLease',
  ];
  if (!isRecord(frozen) || !hasExactKeys(frozen, keys)) {
    throw new TypeError('frozenInput must use the closed allowed-key set');
  }
  requireBaseSha(frozen.baseSha, 'frozenInput.baseSha');
  for (const field of keys.filter((entry) => entry.endsWith('Digest'))) {
    requireDigest(frozen[field as keyof AgentImprovementFrozenParityInput], `frozenInput.${field}`);
  }
  requireToken(frozen.evaluatorEpochId, 'frozenInput.evaluatorEpochId');
  if (
    frozen.baseSha !== context.capsule.baseSha
    || frozen.initialStateDigest !== context.capsule.initialStateDigest
    || frozen.configurationDigest !== context.capsule.configurationDigest
    || frozen.initialStateDigest !== digest(initialState)
    || frozen.commonServiceContractDigest !== digest(AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES)
  ) throw new TypeError('Executor fixture does not match its sealed parity capsule');
  if (!isRecord(frozen.budgetLease) || !hasExactKeys(frozen.budgetLease, [
    'leaseId', 'runId', 'lineageId', 'generation', 'maxIterations',
    'remainingIterations', 'deadlineAt',
  ])) throw new TypeError('frozenInput.budgetLease must use the closed allowed-key set');
  assertResumeLeaseContinuity(frozen, fixture.resumeEvidence);
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: AgentImprovementParityFixture,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<AgentImprovementParityReplayState>,
  initialState: AgentImprovementParityReplayState,
): Promise<void> {
  const engine = new LegacyProjectionEngine({
    shadowRoot: resolve(context.executionRoot, 'legacy-projection-output'),
    protectedLegacyPaths: [resolve(context.executionRoot, 'legacy-authority-protected')],
    now: () => new Date(PARITY_TIMESTAMP),
  });
  const baseBytes = Uint8Array.from(serializeLegacyJson(initialState as unknown as JsonValue));
  const contract = {
    artifactId: PARITY_ARTIFACT_ID,
    censusSurfaceId: 'improvement-derived-state',
    ledgerId: PARITY_LEDGER_ID,
    streamIds: sortedUnique(fixture.events.map((event) => event.stream_id)),
    relativePath: 'improvement/agent-improvement-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-agent-improvement-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
    reducerVersion: PARITY_REDUCER_VERSION,
    serializerId: 'legacy-pretty-json-v1',
    legacyWriter: 'agent improvement loop emitter',
    readers: ['loop host and operators'],
    base: {
      baseSha: context.capsule.baseSha,
      baseDigest: sha256Bytes(baseBytes),
      bytes: baseBytes,
      state: initialState,
      ledgerHead: { ledgerId: PARITY_LEDGER_ID, sequence: 0, recordHash: GENESIS_RECORD_HASH },
    },
    acceptedEventVersions: Object.fromEntries(
      AgentImprovementEventStems.map((stem) => [AgentImprovementWireEventTypes[stem], [1]]),
    ),
    reduce: (
      state: Readonly<AgentImprovementParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): AgentImprovementParityReplayState => {
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as AgentImprovementLedgerEvent,
      );
      return replayState([
        ...history,
        event.effective.envelope as AgentImprovementLedgerEvent,
      ], fixture, 'legacy');
    },
    serialize: (state: Readonly<AgentImprovementParityReplayState>) => (
      Uint8Array.from(serializeLegacyJson(state as unknown as JsonValue))
    ),
  };
  const oracle = foldLegacyProjection(
    contract,
    await ledger.readVerifiedEvents(),
    await ledger.getVerifiedHead(),
    fingerprint,
  );
  const result = await engine.project({ contract, ledger, replayFingerprint: fingerprint, expectedLegacyBytes: oracle.bytes });
  if (!result.ok || result.receipt.projectedDigest !== sha256Bytes(oracle.bytes)) {
    throw new TypeError('Legacy projection oracle did not bind the expected shadow bytes');
  }
}

function executorObservations(
  context: ParityExecutionContext,
  fixture: AgentImprovementParityFixture,
  state: AgentImprovementParityReplayState,
) {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'agent-improvement-shadow-observation',
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
      ...projection.rawTrialDigests,
      ...projection.ablationDigests,
    ] as unknown as JsonValue,
    'reader-results': state.projectionFingerprint,
  });
}

function attestationEnvelope(path: 'legacy' | 'ledger') {
  return {
    eventId: `${path}-agent-improvement-parity-attestation`,
    streamId: 'agent-improvement-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'agent-improvement-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-agent-improvement-parity-attestation`,
  };
}

function createPathExecutor(
  path: 'legacy' | 'ledger',
  fixture: AgentImprovementParityFixture,
  fault: AgentImprovementParityFaultInjection | undefined,
  captured: AgentImprovementPathEvidence[],
): AgentImprovementParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<ParityPathExecution<AgentImprovementParityReplayState>> => {
    const initialState = replayState([], fixture, path);
    validateFrozenInput(fixture.frozenInput, fixture, context, initialState);
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
        await appendFencedLedgerRecord(ledger, prepared, proof);
      }
      ledgerTemplateRoot = resolve(context.executionRoot, '..', `${path}-ledger-template`);
      cpSync(ledgerRoot, ledgerTemplateRoot, { recursive: true, preserveTimestamps: true });
    }
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const verification: VerifyReplayFingerprintInput<AgentImprovementParityReplayState> = {
      ledger,
      eventRegistry: registry,
      versionRegistry,
      componentRegistry: createComponentRegistry(context, path, fixture),
      consumer: 'shadow-parity',
      fingerprintVersion: 1,
      runId: `${path}-${fixture.fixtureId}`,
      rangeStartSequence: 1,
      rangeEndSequence: fixture.events.length,
      replay: {
        reducerId: PARITY_REDUCER_ID,
        reducerVersion: PARITY_REDUCER_VERSION,
        projectionSchemaVersion: AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
        initialState,
        replayInputDigests: {
          initial_state: digest(initialState),
          [SEALED_ARTIFACT_REPLAY_INPUT_KEY]: context.capsule.replayInput.digest,
        },
      },
    };
    const derived = await deriveReplayFingerprint(verification);
    const state = stateWithFault(derived.projection.state, fault, path, context.runIndex);
    const projection = replayProjection(state);
    if ((fault === undefined || fault.path !== path)
      && projection.terminalDecision !== fixture.expectedTerminalDecision) {
      throw new TypeError('Fixture terminal decision does not match its closed expectation');
    }
    if (path === 'legacy') {
      const legacyProjectionDigest = digest(legacyProjection(
        fixture.events,
        fixture.resumeEvidence,
      ));
      if (legacyProjectionDigest !== state.projectionFingerprint) {
        throw new TypeError('Legacy projection oracle changed outside its modeled event fold');
      }
    }
    const attestation = prepareReplayFingerprintAttestation(
      derived,
      registry,
      versionRegistry,
      attestationEnvelope(path),
    );
    const attestationProof = await authorizeEvent(
      ledger,
      gateway,
      policies,
      attestation,
      `${path}-attestation-${context.runIndex}`,
    );
    await recordReplayFingerprintAttestation(
      ledger,
      attestation,
      attestationProof,
      derived,
      versionRegistry,
    );
    const observations = replayObservations(state);
    const streamDigest = digest(observations);
    captured.push(Object.freeze({
      path,
      implementationKind: path === 'legacy' ? 'modeled-legacy-oracle' : 'typed-ledger-pipeline',
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
        watermarkDigest: digest({ ledgerId: PARITY_LEDGER_ID, streamDigest }),
        integrityDigest: sha256Bytes(bytes),
      })]),
    });
  };
}

/** Create distinct legacy-model and typed-ledger executors over the real substrate. */
export function createAgentImprovementParityExecutors(
  fixture: AgentImprovementParityFixture,
  fault?: AgentImprovementParityFaultInjection,
): AgentImprovementParityExecutorPair {
  verifyAgentImprovementLifecycleEventMap();
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: AgentImprovementPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: () => Object.freeze([...captured]),
    legacyOracleImplementation: 'modeled-legacy-oracle',
    ledgerImplementation: 'typed-ledger-pipeline',
    commonParityContractId: 'deep-improvement-common-shadow-parity',
    substrateImportsReal: true,
  });
}

// ───────────────────────────────────────────────────────────────────
// 6. MANIFEST, CERTIFICATE, RECEIPT, AND GATE INPUT
// ───────────────────────────────────────────────────────────────────

function caseContractDigest(fixture: AgentImprovementParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    lifecycleMap: EventStages,
    comparatorVersion: AGENT_IMPROVEMENT_COMPARATOR_VERSION,
    projectionVersion: AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
    sharedParityServices: AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES,
  });
}

/** Compile the exact mode-specific fixture closure without cloning shared fixtures. */
export function compileAgentImprovementParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly AgentImprovementParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...AGENT_IMPROVEMENT_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (scenarios.length !== expected.length
    || new Set(scenarios).size !== expected.length
    || scenarios.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Agent Improvement parity requires the exact fixture scenario closure');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'agent-improvement',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  const cases = input.fixtures.map(createAgentImprovementParityCaseDefinition);
  return compileParityCaseManifest({ baseSha: input.baseSha, baselineRows, cases });
}

/** Create one targeted case definition for fault and non-vacuity checks. */
export function createAgentImprovementParityCaseDefinition(
  fixture: AgentImprovementParityFixture,
): ParityCaseDefinition {
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'agent-improvement',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'agent-improvement-bounded-shadow',
  });
}

function requiredCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases.filter((entry) => entry.mode === 'agent-improvement')
    .map((entry) => entry.caseId).sort();
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: AGENT_IMPROVEMENT_COMPARATOR_VERSION,
    sharedComparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: AGENT_IMPROVEMENT_VOLATILITY_ALLOWLIST,
    diffClasses: DIFF_CLASSES,
  });
}

/** Verify and bind the real mode certificate to the manifest and comparator closure. */
export async function verifyAgentImprovementParityModeCertificate(
  caseRun: AgentImprovementParityCaseRun,
  manifest: ParityCaseManifest,
): Promise<AgentImprovementModeCertificateBinding | null> {
  const verification = await verifyAgentImprovementCertificateOffline(
    caseRun.modeCertificateVerification.input,
  );
  if (verification.verdict !== 'valid') return null;
  const bundle = parseAgentImprovementCertificateBundle(
    caseRun.modeCertificateVerification.input.bundle,
  );
  const body = {
    bundle,
    certificateDigest: bundle.certificate.certificateDigest,
    verificationReceipt: verification.verificationReceipt,
    manifestDigest: manifest.manifestDigest,
    comparatorVersion: AGENT_IMPROVEMENT_COMPARATOR_VERSION,
    caseSetDigest: digest(requiredCaseIds(manifest)),
  };
  return Object.freeze({ ...body, bindingDigest: digest(body) });
}

function pathEvidence(executors: AgentImprovementParityExecutorPair, path: 'legacy' | 'ledger') {
  const evidence = executors.evidence().filter((entry) => entry.path === path);
  if (evidence.length === 0) return Object.freeze({
    streamDigest: digest({ missing: path }),
    projectionFingerprint: digest({ missingProjection: path }),
    observations: Object.freeze([]) as readonly AgentImprovementParityEventObservation[],
    deterministic: false,
  });
  const first = evidence[0];
  return Object.freeze({
    streamDigest: first.streamDigest,
    projectionFingerprint: first.projectionFingerprint,
    observations: first.observations,
    deterministic: evidence.every((entry) => entry.streamDigest === first.streamDigest
      && entry.projectionFingerprint === first.projectionFingerprint),
  });
}

function evidenceBinding(
  fixture: AgentImprovementParityFixture,
  result: ShadowParityCaseResult,
  executors: AgentImprovementParityExecutorPair,
): AgentImprovementParityCertificateEvidenceBinding | null {
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
    attestationFinalDigests: Object.freeze(sortedUnique(result.runs.flatMap(
      (run) => [run.legacy.finalDigest, run.dark.finalDigest],
    ))),
  });
}

function certificateBindings(
  manifest: ParityCaseManifest,
  evidence: readonly AgentImprovementParityCertificateEvidenceBinding[],
  modeBinding: AgentImprovementModeCertificateBinding | null,
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifest: manifest.manifestDigest,
      modeCertificate: modeBinding?.certificateDigest ?? null,
    }),
    harness_digest: digest({
      legacy: 'modeled-agent-loop-emitter',
      ledger: 'runtime/lib/agent-improvement-reducers',
      common: AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES,
      certificate: 'runtime/lib/agent-improvement-certificates',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ version: AGENT_IMPROVEMENT_REDUCER_VERSION }),
    projection_digest: digest({ version: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({
      lifecycleMap: EventStages,
      evidence,
      modeBinding: modeBinding?.bindingDigest ?? null,
    }),
    policy_version: 'agent-improvement-shadow-only@1',
  });
}

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: AgentImprovementParityFixture,
  result: ShadowParityCaseResult,
  executors: AgentImprovementParityExecutorPair,
  parityCertificate: AgentImprovementParityReceipt['parityCertificate'],
  evidence: readonly AgentImprovementParityCertificateEvidenceBinding[],
  modeBinding: AgentImprovementModeCertificateBinding | null,
  refusalCode: AgentImprovementParityReceipt['certificateRefusalCode'],
): Omit<AgentImprovementParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareAgentImprovementEventStreams(
    fixture.fixtureId,
    legacy.observations,
    ledger.observations,
  );
  const issued = parityCertificate !== null && modeBinding !== null;
  const isGreen = result.ok && diffs.length === 0 && legacy.deterministic
    && ledger.deterministic && issued;
  const reproducibilityDigest = digest({
    baseSha: manifest.baseSha,
    manifestDigest: manifest.manifestDigest,
    caseSetDigest: digest(requiredCaseIds(manifest)),
    fixtureId: fixture.fixtureId,
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    commonParityReceiptDigest: fixture.commonParityReceiptDigest,
    modeBindingDigest: modeBinding?.bindingDigest ?? null,
    diffs,
  });
  return Object.freeze({
    schemaVersion: AGENT_IMPROVEMENT_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `agent-improvement-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: `agent-improvement-event@${AGENT_IMPROVEMENT_EVENT_VERSION}`,
    reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
    comparatorVersion: AGENT_IMPROVEMENT_COMPARATOR_VERSION,
    projectionVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId: fixture.fixtureId,
    caseSetDigest: digest(requiredCaseIds(manifest)),
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    commonParityContractId: 'deep-improvement-common-shadow-parity',
    commonComparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    commonParityReceiptDigest: fixture.commonParityReceiptDigest,
    exitStatus: isGreen ? 'green' : 'blocked',
    diffDispositions: Object.freeze(diffs),
    parityCertificate: issued ? parityCertificate : null,
    certificateEvidenceBindings: issued ? Object.freeze([...evidence]) : Object.freeze([]),
    parityCertificateDigest: issued ? parityCertificate.certificate_digest : null,
    modeCertificateBinding: issued ? modeBinding : null,
    certificateStatus: issued ? 'issued' : 'refused',
    certificateRefusalCode: issued ? null : refusalCode ?? 'UNVERIFIABLE',
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
  fixture: AgentImprovementParityFixture,
  result: ShadowParityCaseResult,
  executors: AgentImprovementParityExecutorPair,
  certificate: AgentImprovementParityReceipt['parityCertificate'],
  evidence: readonly AgentImprovementParityCertificateEvidenceBinding[],
  modeBinding: AgentImprovementModeCertificateBinding | null,
  refusalCode: AgentImprovementParityReceipt['certificateRefusalCode'],
): AgentImprovementParityReceipt {
  const body = receiptBody(
    manifest, fixture, result, executors, certificate, evidence, modeBinding, refusalCode,
  );
  return parseAgentImprovementParityReceipt(
    Object.freeze({ ...body, receiptDigest: digest(body) }),
    manifest,
  );
}

function verifyGenericCertificate(
  receipt: AgentImprovementParityReceipt,
  manifest: ParityCaseManifest,
): void {
  if (receipt.certificateStatus === 'refused') return;
  const evidence = receipt.certificateEvidenceBindings;
  const bindings = certificateBindings(manifest, evidence, receipt.modeCertificateBinding);
  const verification = verifyParityCertificate(receipt.parityCertificate, {
    manifest,
    mode: 'agent-improvement',
    bindings,
    caseEvidenceDigests: evidence.map((entry) => entry.caseEvidenceDigest),
    referenceSetDigests: sortedUnique(evidence.map((entry) => entry.referenceSetDigest)),
    attestationFinalDigests: sortedUnique(evidence.flatMap((entry) => entry.attestationFinalDigests)),
  });
  if (!verification.ok || verification.certificateDigest !== receipt.parityCertificateDigest) {
    throw new TypeError('Parity receipt certificate verification failed');
  }
}

function parseModeBinding(input: unknown, manifest: ParityCaseManifest): AgentImprovementModeCertificateBinding {
  if (!isRecord(input) || !hasExactKeys(input, [
    'bundle', 'certificateDigest', 'verificationReceipt', 'manifestDigest',
    'comparatorVersion', 'caseSetDigest', 'bindingDigest',
  ])) throw new TypeError('modeCertificateBinding must use the closed binding shape');
  const bundle = parseAgentImprovementCertificateBundle(input.bundle);
  const verificationReceipt = input.verificationReceipt as AgentImprovementOfflineVerifierReceipt;
  const body = {
    bundle,
    certificateDigest: input.certificateDigest,
    verificationReceipt,
    manifestDigest: input.manifestDigest,
    comparatorVersion: input.comparatorVersion,
    caseSetDigest: input.caseSetDigest,
  };
  if (
    input.certificateDigest !== bundle.certificate.certificateDigest
    || verificationReceipt.certificateDigest !== bundle.certificate.certificateDigest
    || input.manifestDigest !== manifest.manifestDigest
    || input.comparatorVersion !== AGENT_IMPROVEMENT_COMPARATOR_VERSION
    || input.caseSetDigest !== digest(requiredCaseIds(manifest))
    || input.bindingDigest !== digest(body)
  ) throw new TypeError('modeCertificateBinding does not match trusted parity inputs');
  return Object.freeze({
    ...body,
    bindingDigest: String(input.bindingDigest),
  }) as AgentImprovementModeCertificateBinding;
}

/** Parse the manifest-bound evidence receipt with no tolerance disposition escape hatch. */
export function parseAgentImprovementParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): AgentImprovementParityReceipt {
  const keys = [
    'schemaVersion', 'receiptId', 'baseSha', 'runManifestDigest', 'eventSchemaVersion',
    'reducerVersion', 'comparatorVersion', 'projectionVersion', 'comparatorConfigDigest',
    'fixtureId', 'caseSetDigest', 'legacyStreamDigest', 'ledgerStreamDigest',
    'legacyProjectionFingerprint', 'ledgerProjectionFingerprint',
    'commonParityContractId', 'commonComparatorVersion', 'commonParityReceiptDigest',
    'exitStatus', 'diffDispositions', 'parityCertificate', 'certificateEvidenceBindings',
    'parityCertificateDigest', 'modeCertificateBinding', 'certificateStatus',
    'certificateRefusalCode', 'genericDivergenceId', 'genericDivergenceClass',
    'authorityState', 'authorityMutation', 'cutoverCertificate',
    'reproducibilityDigest', 'receiptDigest',
  ];
  if (!isRecord(input) || !hasExactKeys(input, keys)) {
    throw new TypeError('Parity receipt must use the closed allowed-key set');
  }
  for (const field of [
    'runManifestDigest', 'comparatorConfigDigest', 'caseSetDigest',
    'legacyStreamDigest', 'ledgerStreamDigest', 'legacyProjectionFingerprint',
    'ledgerProjectionFingerprint', 'commonParityReceiptDigest',
    'reproducibilityDigest', 'receiptDigest',
  ]) requireDigest(input[field], field);
  if (!Array.isArray(input.diffDispositions)) throw new TypeError('diffDispositions must be an array');
  const diffs = input.diffDispositions.map((entry, index) => {
    if (!isRecord(entry) || entry.disposition !== 'unexplained') {
      throw new TypeError(`diffDispositions[${index}].disposition is not registered`);
    }
    if (!DIFF_CLASSES.includes(entry.class as AgentImprovementParityDiffClass)) {
      throw new TypeError(`diffDispositions[${index}].class is not registered`);
    }
    return Object.freeze(entry as unknown as AgentImprovementParityDiffRecord);
  });
  const modeBinding = input.modeCertificateBinding === null
    ? null : parseModeBinding(input.modeCertificateBinding, manifest);
  if (
    input.baseSha !== manifest.baseSha
    || input.runManifestDigest !== manifest.manifestDigest
    || input.caseSetDigest !== digest(requiredCaseIds(manifest))
    || input.comparatorConfigDigest !== comparatorConfigDigest()
    || input.commonParityContractId !== DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId
    || input.commonComparatorVersion !== DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION
  ) throw new TypeError('Parity receipt is stale for the trusted manifest or shared contract');
  if (
    input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.cutoverCertificate !== false
  ) throw new TypeError('Parity receipt cannot carry authority mutation');
  const issued = input.certificateStatus === 'issued'
    && input.parityCertificate !== null
    && input.parityCertificateDigest !== null
    && modeBinding !== null
    && Array.isArray(input.certificateEvidenceBindings)
    && input.certificateEvidenceBindings.length > 0
    && input.certificateRefusalCode === null;
  const refused = input.certificateStatus === 'refused'
    && input.parityCertificate === null
    && input.parityCertificateDigest === null
    && modeBinding === null
    && Array.isArray(input.certificateEvidenceBindings)
    && input.certificateEvidenceBindings.length === 0
    && input.certificateRefusalCode !== null;
  if (!issued && !refused) throw new TypeError('Parity receipt certificate evidence contradicts its status');
  const { receiptDigest, ...body } = input;
  if (digest(body) !== receiptDigest) throw new TypeError('Parity receipt digest does not commit its body');
  const receipt = Object.freeze({
    ...(input as unknown as AgentImprovementParityReceipt),
    diffDispositions: Object.freeze(diffs),
    modeCertificateBinding: modeBinding,
  });
  verifyGenericCertificate(receipt, manifest);
  const evidenceGreen = receipt.legacyStreamDigest === receipt.ledgerStreamDigest
    && receipt.legacyProjectionFingerprint === receipt.ledgerProjectionFingerprint
    && receipt.diffDispositions.length === 0 && issued;
  if ((receipt.exitStatus === 'green') !== evidenceGreen) {
    throw new TypeError('Parity receipt declared status contradicts its bound evidence');
  }
  return receipt;
}

function modeGateBody(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): Omit<AgentImprovementModeGateInput, 'gateInputDigest'> {
  const expected = sortedUnique(input.expectedFixtureIds);
  const required = requiredCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  const parsed: AgentImprovementParityReceipt[] = [];
  for (const candidate of input.receipts) {
    try {
      parsed.push(parseAgentImprovementParityReceipt(candidate, input.manifest));
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('stale')) stale = true;
      else malformed = true;
    }
  }
  const byFixture = new Map(parsed.map((receipt) => [receipt.fixtureId, receipt]));
  const allReceiptsPresent = expected.length > 0 && digest(expected) === digest(required)
    && parsed.length === expected.length && byFixture.size === expected.length
    && expected.every((fixtureId) => byFixture.has(fixtureId));
  const unexplained = parsed.some((receipt) => receipt.diffDispositions.length > 0);
  const nondeterministic = parsed.some(
    (receipt) => receipt.genericDivergenceClass === 'nondeterministic',
  );
  const certificateFailure = parsed.some((receipt) => receipt.certificateStatus !== 'issued');
  const fixtureFailure = parsed.some((receipt) => receipt.exitStatus !== 'green');
  let blockingReasonCode: AgentImprovementModeGateBlockReasonCode | null = null;
  if (expected.length === 0) blockingReasonCode = 'ZERO_FIXTURES';
  else if (stale) blockingReasonCode = 'RECEIPT_STALE';
  else if (malformed) blockingReasonCode = 'RECEIPT_MALFORMED';
  else if (!allReceiptsPresent) blockingReasonCode = 'MISSING_RECEIPT';
  else if (certificateFailure) blockingReasonCode = 'CERTIFICATE_UNVERIFIABLE';
  else if (nondeterministic) blockingReasonCode = 'NONDETERMINISTIC_REPLAY';
  else if (unexplained) blockingReasonCode = 'DIFF_UNEXPLAINED';
  else if (fixtureFailure) blockingReasonCode = 'FIXTURE_FAILURE';
  return Object.freeze({
    schemaVersion: AGENT_IMPROVEMENT_MODE_GATE_INPUT_VERSION,
    mode: 'agent-improvement',
    baseSha: input.manifest.baseSha,
    manifestDigest: input.manifest.manifestDigest,
    fixtureIds: Object.freeze(expected),
    parityReceiptDigests: Object.freeze(parsed.map((receipt) => receipt.receiptDigest).sort()),
    exitStatus: blockingReasonCode === null ? 'pass' : 'blocked',
    zeroUnexplainedDiffs: !unexplained,
    allReceiptsPresent,
    deterministicReplay: !nondeterministic,
    certificatesVerified: !certificateFailure,
    authorityState: 'legacy-authoritative',
    authorityMutation: false,
    rollbackReadinessAuthorized: false,
    cutoverAuthorized: false,
    blockingReasonCode,
  });
}

/** Build the non-authoritative input whose verdict the successor gate must re-derive. */
export function createAgentImprovementModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): AgentImprovementModeGateInput {
  const body = modeGateBody(input);
  return parseAgentImprovementModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse a closed gate handoff that cannot authorize rollback or cutover. */
export function parseAgentImprovementModeGateInput(input: unknown): AgentImprovementModeGateInput {
  const keys = [
    'schemaVersion', 'mode', 'baseSha', 'manifestDigest', 'fixtureIds',
    'parityReceiptDigests', 'exitStatus', 'zeroUnexplainedDiffs',
    'allReceiptsPresent', 'deterministicReplay', 'certificatesVerified',
    'authorityState', 'authorityMutation', 'rollbackReadinessAuthorized',
    'cutoverAuthorized', 'blockingReasonCode', 'gateInputDigest',
  ];
  if (!isRecord(input) || !hasExactKeys(input, keys)) {
    throw new TypeError('Mode-gate input must use the closed allowed-key set');
  }
  if (input.mode !== 'agent-improvement'
    || input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.rollbackReadinessAuthorized !== false
    || input.cutoverAuthorized !== false) {
    throw new TypeError('Mode-gate input cannot carry authority');
  }
  const { gateInputDigest, ...body } = input;
  requireDigest(gateInputDigest, 'gateInputDigest');
  if (digest(body) !== gateInputDigest) throw new TypeError('Mode-gate digest does not commit its body');
  const passing = input.exitStatus === 'pass';
  if (passing && (
    input.blockingReasonCode !== null
    || input.zeroUnexplainedDiffs !== true
    || input.allReceiptsPresent !== true
    || input.deterministicReplay !== true
    || input.certificatesVerified !== true
  )) throw new TypeError('Passing mode-gate input contains blocking evidence');
  return Object.freeze(input as unknown as AgentImprovementModeGateInput);
}

async function runCase(caseRun: AgentImprovementParityCaseRun): Promise<ShadowParityCaseResult> {
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

/** Run one case and issue only certificate-bound, non-authoritative evidence. */
export async function runAgentImprovementParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: AgentImprovementParityCaseRun;
}>): Promise<AgentImprovementParityCaseOutcome> {
  const result = await runCase(input.caseRun);
  const modeBinding = await verifyAgentImprovementParityModeCertificate(
    input.caseRun,
    input.manifest,
  );
  const binding = evidenceBinding(input.caseRun.fixture, result, input.caseRun.executors);
  const evidence = binding === null ? Object.freeze([]) : Object.freeze([binding]);
  const bindings = certificateBindings(input.manifest, evidence, modeBinding);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'agent-improvement',
    caseResults: [result],
    bindings,
  });
  return Object.freeze({
    result,
    receipt: issueReceipt(
      input.manifest,
      input.caseRun.fixture,
      result,
      input.caseRun.executors,
      issuance.ok && modeBinding !== null ? issuance.certificate : null,
      issuance.ok && modeBinding !== null ? evidence : Object.freeze([]),
      issuance.ok ? modeBinding : null,
      issuance.ok ? null : issuance.refusal.code,
    ),
  });
}

/** Run the full fixture closure and emit receipts plus successor input evidence. */
export async function runAgentImprovementParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly AgentImprovementParityCaseRun[];
}>): Promise<AgentImprovementParitySuiteResult> {
  const manifestIds = requiredCaseIds(input.manifest);
  const runIds = input.cases.map((entry) => entry.caseDefinition.caseId).sort();
  if (manifestIds.length === 0 || digest(manifestIds) !== digest(runIds)) {
    throw new TypeError('Parity suite cases must equal the manifest mode closure');
  }
  const caseResults: ShadowParityCaseResult[] = [];
  const modeBindings: Array<AgentImprovementModeCertificateBinding | null> = [];
  for (const caseRun of input.cases) {
    caseResults.push(await runCase(caseRun));
    modeBindings.push(await verifyAgentImprovementParityModeCertificate(caseRun, input.manifest));
  }
  const evidence = Object.freeze(input.cases.flatMap((caseRun, index) => {
    const binding = evidenceBinding(caseRun.fixture, caseResults[index], caseRun.executors);
    return binding === null ? [] : [binding];
  }).sort((left, right) => left.fixtureId.localeCompare(right.fixtureId)));
  const modeBinding = modeBindings.every((entry) => entry !== null)
    ? modeBindings[0] : null;
  const bindings = certificateBindings(input.manifest, evidence, modeBinding);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'agent-improvement',
    caseResults,
    bindings,
  });
  const certificate = issuance.ok && modeBinding !== null ? issuance.certificate : null;
  const receipts = input.cases.map((caseRun, index) => issueReceipt(
    input.manifest,
    caseRun.fixture,
    caseResults[index],
    caseRun.executors,
    certificate,
    certificate === null ? Object.freeze([]) : evidence,
    certificate === null ? null : modeBinding,
    issuance.ok ? null : issuance.refusal.code,
  ));
  const modeGateInput = createAgentImprovementModeGateInput({
    manifest: input.manifest,
    expectedFixtureIds: manifestIds,
    receipts,
  });
  const failure = caseResults.find((entry) => !entry.ok);
  return Object.freeze({
    manifest: input.manifest,
    caseResults: Object.freeze(caseResults),
    receipts: Object.freeze(receipts),
    certificate,
    divergence: failure && !failure.ok ? failure.divergence : null,
    modeGateInput,
  });
}

// ───────────────────────────────────────────────────────────────────
// 7. DISTINCT RESUME ORACLE
// ───────────────────────────────────────────────────────────────────

/** Build a legacy resume oracle from a frozen legacy state model. */
export function createAgentImprovementLegacyResumeOracle(
  snapshot: AgentImprovementLegacyResumeSnapshot,
): AgentImprovementLegacyResumeOracle {
  if (snapshot.events.length === 0) throw new TypeError('Legacy resume oracle requires events');
  const tail = snapshot.events.at(-1) as AgentImprovementLedgerEvent;
  return Object.freeze({
    async resume(input: AgentImprovementResumeRequest) {
      const request = parseAgentImprovementResumeRequest(input);
      if (
        request.runId !== snapshot.freshProjection.runId
        || request.lease.runId !== request.runId
        || request.lease.lineageId !== snapshot.freshProjection.lineageId
        || request.lease.generation !== snapshot.freshProjection.generation
      ) throw new TypeError('Legacy continuation identity does not match the persisted lease');
      return Object.freeze({
        decision: parseAgentImprovementResumeDecision(snapshot.decision),
        eventTail: Object.freeze({
          streamId: tail.stream_id,
          streamSequence: tail.stream_sequence,
          eventCount: snapshot.events.length,
        }),
        freshProjection: snapshot.freshProjection,
      });
    },
  });
}

/** Typed evidence that independently implemented resume paths disagree. */
export class AgentImprovementResumeParityDivergenceError extends Error {
  public readonly code = 'AGENT_IMPROVEMENT_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(
    dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[],
  ) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'AgentImprovementResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare the distinct legacy oracle with the landed real resume adapter. */
export async function driveAgentImprovementResumeParity(input: Readonly<{
  legacyOracle: AgentImprovementLegacyResumeOracle;
  ledgerAdapter: AgentImprovementResumeAdapter;
  request: AgentImprovementResumeRequest;
}>): Promise<AgentImprovementResumeParityEvidence> {
  if (typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof AgentImprovementResumeAdapter)) {
    throw new TypeError('Resume parity requires distinct legacy and real ledger adapters');
  }
  const request = parseAgentImprovementResumeRequest(input.request);
  const [legacy, ledger] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  const legacyDecision = parseAgentImprovementResumeDecision(legacy.decision);
  const ledgerDecision = parseAgentImprovementResumeDecision(ledger.decision);
  const legacyEventTailDigest = digest(legacy.eventTail);
  const ledgerEventTailDigest = digest(ledger.authenticatedTail);
  const legacyFreshProjectionFingerprint = digest(legacy.freshProjection);
  const ledgerFreshProjectionFingerprint = digest(ledger.projection);
  const dimensions: Array<'decision' | 'event-tail' | 'fresh-projection'> = [];
  if (digest({
    disposition: legacyDecision.disposition,
    compatibility: legacyDecision.compatibility,
    branches: legacyDecision.branches,
    invalidation: legacyDecision.invalidation,
    lease: legacyDecision.lease,
  }) !== digest({
    disposition: ledgerDecision.disposition,
    compatibility: ledgerDecision.compatibility,
    branches: ledgerDecision.branches,
    invalidation: ledgerDecision.invalidation,
    lease: ledgerDecision.lease,
  })) dimensions.push('decision');
  if (legacyEventTailDigest !== ledgerEventTailDigest) dimensions.push('event-tail');
  if (legacyFreshProjectionFingerprint !== ledgerFreshProjectionFingerprint) {
    dimensions.push('fresh-projection');
  }
  if (dimensions.length > 0) throw new AgentImprovementResumeParityDivergenceError(dimensions);
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}
