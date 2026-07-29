// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Shadow Parity Harness Adapter
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
  parseModelBenchmarkCertificateBundle,
  verifyModelBenchmarkCertificateOffline,
} from '../model-benchmark-certificates/index.js';
import {
  MODEL_BENCHMARK_EVENT_VERSION,
  ModelBenchmarkEventStems,
  ModelBenchmarkSpecificEventStems,
  ModelBenchmarkWireEventTypes,
  modelBenchmarkEventDefinitions,
} from '../model-benchmark-ledger-schema/index.js';
import {
  MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  MODEL_BENCHMARK_REDUCER_VERSION,
  foldModelBenchmarkEvents,
} from '../model-benchmark-reducers/index.js';
import {
  ModelBenchmarkResumeAdapter,
  parseModelBenchmarkResumeDecision,
  parseModelBenchmarkResumeRequest,
} from '../model-benchmark-resume-adapter/index.js';
import {
  MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT,
  MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL,
  ModelBenchmarkArtifactKinds,
} from '../model-benchmark-sealed-artifacts/index.js';
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
import type { DeepImprovementCommonParityEventObservation } from '../deep-improvement-common-shadow-parity/index.js';
import type {
  EventEnvelope,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  ModelBenchmarkCertificateBundle,
  ModelBenchmarkOfflineVerifierReceipt,
} from '../model-benchmark-certificates/index.js';
import type {
  ModelBenchmarkEventStem,
  ModelBenchmarkLedgerEvent,
  TrialMatrixKey,
} from '../model-benchmark-ledger-schema/index.js';
import type {
  ModelBenchmarkResumeDecision,
  ModelBenchmarkResumeRequest,
} from '../model-benchmark-resume-adapter/index.js';
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
  ModelBenchmarkFrozenParityInput,
  ModelBenchmarkLegacyResumeOracle,
  ModelBenchmarkLegacyResumeSnapshot,
  ModelBenchmarkLifecycleEventMapping,
  ModelBenchmarkModeCertificateBinding,
  ModelBenchmarkModeGateBlockReasonCode,
  ModelBenchmarkModeGateInput,
  ModelBenchmarkParityCaseOutcome,
  ModelBenchmarkParityCaseRun,
  ModelBenchmarkParityCertificateEvidenceBinding,
  ModelBenchmarkParityCell,
  ModelBenchmarkParityDiffClass,
  ModelBenchmarkParityDiffRecord,
  ModelBenchmarkParityEventObservation,
  ModelBenchmarkParityExecutorPair,
  ModelBenchmarkParityFaultInjection,
  ModelBenchmarkParityFixture,
  ModelBenchmarkParityFixtureScenario,
  ModelBenchmarkParityProjection,
  ModelBenchmarkParityReceipt,
  ModelBenchmarkParityReplayState,
  ModelBenchmarkParitySuiteResult,
  ModelBenchmarkPathEvidence,
  ModelBenchmarkResumeParityEvidence,
  ModelBenchmarkTerminalDecision,
  ModelBenchmarkVolatilityAllowance,
} from './types.js';

export const MODEL_BENCHMARK_SHADOW_PARITY_SCHEMA_VERSION =
  'model-benchmark-shadow-parity@1' as const;
export const MODEL_BENCHMARK_COMPARATOR_VERSION =
  'model-benchmark-event-comparator@1' as const;
export const MODEL_BENCHMARK_MODE_GATE_INPUT_VERSION =
  'model-benchmark-mode-gate-input@1' as const;
export const MODEL_BENCHMARK_PARITY_PROJECTION_VERSION =
  'model-benchmark-parity-projection@1' as const;

export const MODEL_BENCHMARK_SHARED_PARITY_SERVICES = Object.freeze({
  contractId: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId,
  contractVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractVersion,
  comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  schemaVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.schemaVersion,
  projectionVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.projectionVersion,
  authority: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.authority,
  sealedArtifactContract: MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT,
  sealedArtifactKinds: ModelBenchmarkArtifactKinds,
  substrateImportsReal: MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL,
  consumer: 'model-benchmark',
} as const);

const PARITY_REDUCER_ID = 'model-benchmark:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'model-benchmark-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'model-benchmark-parity-projection';
const PARITY_LEDGER_ID = 'model-benchmark-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'model-benchmark-shadow-parity-audit';
const PARITY_POLICY_ID = 'model-benchmark-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'model-benchmark-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-28T00:00:00.000Z';
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const MODEL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'healthy-multi-model',
  'model-task-reversal',
  'paired-anchors',
  'adaptive-diagnostic-tail',
  'partial-matrix',
  'missing-usage',
  'judge-rubric-perturbation',
  'contamination-disclosure',
  'workload-tail',
  'score-policy-change',
  'replay',
  'resume',
  'duplicate-delivery',
  'late-completion',
  'shared-service-veto',
  'promotion-preparation',
  'telemetry-gap',
] as const satisfies readonly ModelBenchmarkParityFixtureScenario[]);

export const MODEL_BENCHMARK_VOLATILITY_ALLOWLIST = Object.freeze(
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST.map((entry) => Object.freeze({
    field: entry.field,
    valueKind: entry.valueKind,
    owner: 'model-benchmark-shadow-parity',
    volatilityReason: entry.volatilityReason,
    semanticIdentity: false,
  })) as readonly ModelBenchmarkVolatilityAllowance[],
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
  'artifact', 'causal-link', 'canary', 'contamination', 'duplicated',
  'evaluator-integrity', 'extra', 'input-inequality', 'latency', 'malformed',
  'missing', 'nondeterministic', 'payload', 'projection', 'promotion', 'receipt',
  'reference-digest', 'reordered', 'resume-continuity', 'score', 'shared-reference',
  'stale', 'telemetry-gap', 'terminal-decision', 'unauthorized',
  'unsupported-version', 'usage', 'validity', 'workload',
] as const satisfies readonly ModelBenchmarkParityDiffClass[]);

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

function requireToken(value: unknown, field: string): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
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

function stringField(value: object, key: string): string | null {
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === 'string' ? candidate : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? sortedUnique(value.filter((entry): entry is string => typeof entry === 'string'))
    : [];
}

function dataRecord(event: ModelBenchmarkLedgerEvent): Record<string, unknown> {
  return event.payload.data as unknown as Record<string, unknown>;
}

function matrixKey(event: ModelBenchmarkLedgerEvent): TrialMatrixKey | null {
  const value = dataRecord(event).trialMatrixKey;
  return isRecord(value) ? value as unknown as TrialMatrixKey : null;
}

function matrixCellKey(event: ModelBenchmarkLedgerEvent): string | null {
  const key = matrixKey(event);
  return key === null ? null : digest(key);
}

function specificStage(stem: ModelBenchmarkEventStem): ModelBenchmarkLifecycleEventMapping {
  const stages: Partial<Record<ModelBenchmarkEventStem, readonly [
    ModelBenchmarkLifecycleEventMapping['lifecycleStage'], string,
  ]>> = {
    'model_benchmark.run_declared': ['run', 'run-declare'],
    'model_benchmark.benchmark_capsule_sealed': ['sealing', 'capsule-seal'],
    'model_benchmark.workload_snapshot_sealed': ['sealing', 'workload-seal'],
    'model_benchmark.run_started': ['run', 'run-start'],
    'model_benchmark.run_paused': ['run', 'run-pause'],
    'model_benchmark.run_resumed': ['resume', 'run-resume'],
    'model_benchmark.run_closed': ['terminal', 'run-close'],
    'model_benchmark.benchmark_design_declared': ['design', 'design-declare'],
    'model_benchmark.trial_block_declared': ['design', 'trial-block-declare'],
    'model_benchmark.trial_case_admitted': ['admission', 'trial-admit'],
    'model_benchmark.trial_case_rejected': ['admission', 'trial-reject'],
    'model_benchmark.trial_dispatched': ['dispatch', 'trial-dispatch'],
    'model_benchmark.trial_completed': ['observation', 'trial-complete'],
    'model_benchmark.trial_failed': ['observation', 'trial-fail'],
    'model_benchmark.trial_unknown': ['observation', 'trial-unknown'],
    'model_benchmark.trial_invalidated': ['observation', 'trial-invalidate'],
    'model_benchmark.trial_observation_recorded': ['observation', 'observation-record'],
    'model_benchmark.score_vector_observed': ['scoring', 'score-observe'],
    'model_benchmark.usage_observed': ['observation', 'usage-observe'],
    'model_benchmark.judge_observation_recorded': ['judge', 'judge-observe'],
    'model_benchmark.oracle_label_attested': ['judge', 'oracle-attest'],
    'model_benchmark.contamination_evidence_recorded': ['contamination', 'contamination-record'],
    'model_benchmark.exposure_recorded': ['contamination', 'exposure-record'],
    'model_benchmark.case_disclosed': ['contamination', 'case-disclose'],
    'model_benchmark.case_retired': ['contamination', 'case-retire'],
    'model_benchmark.case_replaced': ['contamination', 'case-replace'],
    'model_benchmark.judge_calibration_sealed': ['judge', 'judge-calibration-seal'],
    'model_benchmark.validity_plan_sealed': ['validity', 'validity-plan-seal'],
    'model_benchmark.validity_card_derived': ['validity', 'validity-derive'],
    'model_benchmark.validity_unknown_recorded': ['validity', 'validity-unknown'],
    'model_benchmark.selection_evidence_sealed': ['selection', 'selection-evidence-seal'],
    'model_benchmark.selection_reduction_requested': ['selection', 'selection-reduce-request'],
  };
  const stage = stages[stem];
  if (stage === undefined) throw new TypeError(`Missing Model Benchmark lifecycle mapping for ${stem}`);
  return Object.freeze({
    wireEventType: ModelBenchmarkWireEventTypes[stem],
    lifecycleStage: stage[0],
    stepKey: stage[1],
    sharedService: false,
  });
}

const EventStages = Object.freeze(Object.fromEntries(ModelBenchmarkEventStems.map((stem) => {
  if ((ModelBenchmarkSpecificEventStems as readonly string[]).includes(stem)) {
    return [stem, specificStage(stem)];
  }
  const shared = DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP[
    stem as keyof typeof DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP
  ];
  if (shared === undefined) throw new TypeError(`Missing shared lifecycle mapping for ${stem}`);
  return [stem, Object.freeze({
    wireEventType: ModelBenchmarkWireEventTypes[stem],
    lifecycleStage: 'shared-service',
    stepKey: `common:${shared.stepKey}`,
    sharedService: true,
  })];
}))) as Readonly<Record<ModelBenchmarkEventStem, ModelBenchmarkLifecycleEventMapping>>;

export const MODEL_BENCHMARK_LIFECYCLE_EVENT_MAP = EventStages;

function validateVolatilityBoundary(event: ModelBenchmarkLedgerEvent): void {
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

function scopeIdentity(event: ModelBenchmarkLedgerEvent) {
  const scope = event.payload.scope;
  const key = matrixKey(event);
  return Object.freeze({
    eventStem: event.payload.stem,
    runId: String(scope.runId),
    lineageId: String(scope.lineageId),
    matrixCellKey: matrixCellKey(event),
    trialId: stringField(scope, 'trialId'),
    taskInstanceId: stringField(scope, 'taskInstanceId') ?? key?.taskInstanceId ?? null,
    taskFamilyId: stringField(scope, 'taskFamilyId') ?? key?.taskFamilyId ?? null,
    candidateId: stringField(scope, 'candidateId') ?? key?.candidateId ?? null,
    modelFingerprint: stringField(scope, 'modelFingerprint') ?? key?.modelFingerprint ?? null,
    executionPath: stringField(scope, 'executionPath') ?? key?.executionPath ?? null,
    pairedBlockId: stringField(scope, 'pairedBlockId') ?? key?.pairedBlockId ?? null,
    protocolVariant: key?.protocolVariant ?? null,
    perturbationId: key?.perturbationId ?? null,
    logicalStep: EventStages[event.payload.stem].stepKey,
    producerSequence: event.stream_sequence,
  });
}

function logicalIdentityDigest(event: ModelBenchmarkLedgerEvent): string {
  return digest(scopeIdentity(event));
}

function valuesBySuffix(event: ModelBenchmarkLedgerEvent, suffixes: readonly string[]): string[] {
  return sortedUnique(Object.entries(dataRecord(event)).flatMap(([key, value]) => (
    suffixes.some((suffix) => key.endsWith(suffix))
      ? typeof value === 'string' ? [value] : stringArray(value)
      : []
  )));
}

function receiptRefs(event: ModelBenchmarkLedgerEvent): string[] {
  return valuesBySuffix(event, ['ReceiptRef', 'ReceiptRefs']);
}

function artifactRefs(event: ModelBenchmarkLedgerEvent): string[] {
  return valuesBySuffix(event, ['Digest', 'Digests', 'PayloadDigest'])
    .filter((entry) => SHA256_PATTERN.test(entry));
}

function sharedServiceRefs(event: ModelBenchmarkLedgerEvent): string[] {
  if (!EventStages[event.payload.stem].sharedService) {
    return valuesBySuffix(event, ['ServiceRef', 'ServiceContractVersion']);
  }
  return sortedUnique([
    stringField(event.payload.scope, 'candidateId'),
    stringField(event.payload.scope, 'evaluationEpochId'),
    stringField(event.payload.scope, 'canaryEpochId'),
    stringField(event.payload.scope, 'promotionId'),
    stringField(event.payload.scope, 'baselineId'),
  ].filter((entry): entry is string => entry !== null));
}

function refsContaining(event: ModelBenchmarkLedgerEvent, fragments: readonly string[]): string[] {
  return sortedUnique(Object.entries(dataRecord(event)).flatMap(([key, value]) => (
    fragments.some((fragment) => key.toLowerCase().includes(fragment))
      ? typeof value === 'string' ? [value] : stringArray(value)
      : []
  )));
}

function terminalDecisionForEvent(event: ModelBenchmarkLedgerEvent): ModelBenchmarkTerminalDecision | null {
  switch (event.payload.stem) {
    case 'model_benchmark.run_paused': return 'paused';
    case 'model_benchmark.run_closed': return event.payload.data.terminalOutcome;
    case 'model_benchmark.validity_unknown_recorded':
      return event.payload.data.blocker ? 'inconclusive' : null;
    case 'model_benchmark.selection_reduction_requested': return 'selection-prepared';
    case 'deep_improvement_common.run_paused': return 'paused';
    case 'deep_improvement_common.run_aborted': return 'aborted';
    case 'deep_improvement_common.run_quarantined': return 'quarantined';
    case 'deep_improvement_common.evaluation_inconclusive': return 'inconclusive';
    case 'deep_improvement_common.canary_vetoed':
    case 'deep_improvement_common.promotion_denied': return 'blocked';
    default: return null;
  }
}

/** Canonicalize independently generated streams while retaining all protected semantics. */
export function canonicalizeModelBenchmarkEventStream(
  events: readonly ModelBenchmarkLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly ModelBenchmarkParityEventObservation[] {
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
      stablePayloadDigest: event.payload.payloadDigest,
      projectionFingerprint: requireDigest(
        projectionFingerprints[index],
        `projectionFingerprints[${index}]`,
      ),
      receiptRefs: Object.freeze(receiptRefs(event)),
      artifactRefs: Object.freeze(artifactRefs(event)),
      sharedServiceRefs: Object.freeze(sharedServiceRefs(event)),
      matrixRefs: Object.freeze(refsContaining(event, ['matrix', 'trial', 'task', 'family', 'paired'])),
      evaluatorRefs: Object.freeze(refsContaining(event, ['evaluator', 'judge', 'rubric', 'scorepolicy'])),
      contaminationRefs: Object.freeze(refsContaining(event, ['contamination', 'exposure', 'disclosure'])),
      validityRefs: Object.freeze(refsContaining(event, ['validity', 'blocker'])),
      workloadRefs: Object.freeze(refsContaining(event, ['workload', 'usage', 'latency'])),
      authorizationRefs: Object.freeze(refsContaining(event, ['authorization'])),
      terminalDecision: terminalDecisionForEvent(event),
    });
  }));
}

/** Prove shared and mode event mappings form an exact closed namespace. */
export function verifyModelBenchmarkLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...ModelBenchmarkEventStems].sort();
  if (mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Model Benchmark lifecycle mapping must close every event stem');
  }
  for (const stem of ModelBenchmarkEventStems) {
    if (EventStages[stem].wireEventType !== ModelBenchmarkWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

function emptyProjection(): ModelBenchmarkParityProjection {
  return Object.freeze({
    runId: null,
    lineageId: null,
    generation: 0,
    runState: 'not-started',
    designIds: Object.freeze([]),
    trialBlockIds: Object.freeze([]),
    cells: Object.freeze([]),
    rawObservationDigests: Object.freeze([]),
    scorePolicyVersions: Object.freeze([]),
    scoreVectorDigests: Object.freeze([]),
    uncertaintyDigests: Object.freeze([]),
    judgeEvidenceDigests: Object.freeze([]),
    contaminationEvidenceDigests: Object.freeze([]),
    exposureEvidenceDigests: Object.freeze([]),
    validityStates: Object.freeze([]),
    validityUnknownCodes: Object.freeze([]),
    workloadEvidenceDigests: Object.freeze([]),
    usageEvidenceDigests: Object.freeze([]),
    latencyEvidenceDigests: Object.freeze([]),
    selectionEvidenceDigests: Object.freeze([]),
    commonAnchorRefs: Object.freeze([]),
    adaptiveDiagnosticRefs: Object.freeze([]),
    sharedServiceRefs: Object.freeze([]),
    unresolvedEvidenceRefs: Object.freeze([]),
    blockingVetoCodes: Object.freeze([]),
    matrixCoverage: 0,
    rankingState: 'unranked',
    terminalDecision: 'active',
    resumeDecisionDigest: null,
  });
}

function resumeEvidenceDigest(
  evidence: ModelBenchmarkResumeParityEvidence | null,
  path: 'legacy' | 'ledger',
): string | null {
  if (evidence === null) return null;
  const decision = parseModelBenchmarkResumeDecision(
    path === 'legacy' ? evidence.legacyDecision : evidence.ledgerDecision,
  );
  return digest({
    disposition: decision.disposition,
    compatibility: decision.compatibility,
    branches: decision.branches,
    effects: decision.effects,
    invalidation: decision.invalidation,
    lease: decision.lease,
    eventTailDigest: path === 'legacy'
      ? evidence.legacyEventTailDigest : evidence.ledgerEventTailDigest,
    projectionFingerprint: path === 'legacy'
      ? evidence.legacyFreshProjectionFingerprint
      : evidence.ledgerFreshProjectionFingerprint,
  });
}

function projectionCell(
  event: ModelBenchmarkLedgerEvent,
  current: ModelBenchmarkParityCell | undefined,
): ModelBenchmarkParityCell | null {
  const key = matrixKey(event);
  const cellKey = matrixCellKey(event);
  const trialId = stringField(event.payload.scope, 'trialId');
  if (key === null || cellKey === null || trialId === null) return null;
  const data = dataRecord(event);
  const disposition = event.payload.stem === 'model_benchmark.trial_case_admitted' ? 'admitted'
    : event.payload.stem === 'model_benchmark.trial_case_rejected' ? 'rejected'
      : event.payload.stem === 'model_benchmark.trial_dispatched' ? 'dispatched'
        : event.payload.stem === 'model_benchmark.trial_completed' ? 'completed'
          : event.payload.stem === 'model_benchmark.trial_failed' ? 'failed'
            : event.payload.stem === 'model_benchmark.trial_unknown' ? 'unknown'
              : event.payload.stem === 'model_benchmark.trial_invalidated' ? 'invalid'
                : event.payload.stem === 'model_benchmark.trial_observation_recorded' ? 'observed'
                  : event.payload.stem === 'model_benchmark.score_vector_observed' ? 'scored'
                    : current?.disposition ?? 'admitted';
  return Object.freeze({
    cellKey,
    trialId,
    matrixKey: key,
    disposition,
    sourceEventId: current?.sourceEventId ?? event.event_id,
    rawResultDigest: stringField(data, 'rawResultDigest') ?? current?.rawResultDigest ?? null,
    rawObservationDigest: stringField(data, 'rawOutputDigest')
      ?? stringField(data, 'evaluatorObservationDigest')
      ?? current?.rawObservationDigest ?? null,
    scoreDigest: event.payload.stem === 'model_benchmark.score_vector_observed'
      ? digest(event.payload.data.scoreVector) : current?.scoreDigest ?? null,
    usageDigest: event.payload.stem === 'model_benchmark.usage_observed'
      ? digest(event.payload.data.usage) : current?.usageDigest ?? null,
    latencyDigest: event.payload.stem === 'model_benchmark.usage_observed'
      ? digest(event.payload.data.latency) : current?.latencyDigest ?? null,
  });
}

/** Model the pinned legacy emitter without invoking the typed reducer. */
function legacyProjection(
  events: readonly ModelBenchmarkLedgerEvent[],
  resumeEvidence: ModelBenchmarkResumeParityEvidence | null,
): ModelBenchmarkParityProjection {
  if (events.length === 0) return emptyProjection();
  let runId: string | null = null;
  let lineageId: string | null = null;
  let generation = 0;
  let runState = 'not-started';
  let terminalDecision: ModelBenchmarkTerminalDecision = 'active';
  let rankingState = 'unranked';
  const designIds = new Set<string>();
  const trialBlockIds = new Set<string>();
  const cells = new Map<string, ModelBenchmarkParityCell>();
  const rawObservationDigests = new Set<string>();
  const scorePolicyVersions = new Set<string>();
  const scoreVectorDigests = new Set<string>();
  const uncertaintyDigests = new Set<string>();
  const judgeEvidenceDigests = new Set<string>();
  const contaminationEvidenceDigests = new Set<string>();
  const exposureEvidenceDigests = new Set<string>();
  const validityStates = new Set<string>();
  const validityUnknownCodes = new Set<string>();
  const workloadEvidenceDigests = new Set<string>();
  const usageEvidenceDigests = new Set<string>();
  const latencyEvidenceDigests = new Set<string>();
  const selectionEvidenceDigests = new Set<string>();
  const commonAnchorRefs = new Set<string>();
  const adaptiveDiagnosticRefs = new Set<string>();
  const sharedServiceReferenceSet = new Set<string>();
  const unresolvedEvidenceRefs = new Set<string>();
  const blockingVetoCodes = new Set<string>();
  for (const event of events) {
    const scope = event.payload.scope;
    const data = dataRecord(event);
    runId = String(scope.runId);
    lineageId = String(scope.lineageId);
    const terminal = terminalDecisionForEvent(event);
    if (terminal !== null) terminalDecision = terminal;
    sharedServiceRefs(event).forEach((entry) => sharedServiceReferenceSet.add(entry));
    const cell = projectionCell(event, matrixCellKey(event) === null
      ? undefined : cells.get(matrixCellKey(event) as string));
    if (cell !== null) cells.set(cell.cellKey, cell);
    switch (event.payload.stem) {
      case 'model_benchmark.run_declared':
        generation = event.payload.data.generation;
        runState = 'declared';
        break;
      case 'model_benchmark.run_started': runState = 'running'; break;
      case 'model_benchmark.run_paused': runState = 'paused'; break;
      case 'model_benchmark.run_resumed': runState = 'running'; break;
      case 'model_benchmark.run_closed': runState = 'closed'; break;
      case 'model_benchmark.benchmark_design_declared':
        designIds.add(String(scope.designId));
        break;
      case 'model_benchmark.trial_block_declared':
        trialBlockIds.add(String(scope.trialBlockId));
        break;
      case 'model_benchmark.workload_snapshot_sealed':
        workloadEvidenceDigests.add(event.payload.data.workloadSnapshotDigest);
        break;
      case 'model_benchmark.trial_observation_recorded':
        rawObservationDigests.add(event.payload.data.rawOutputDigest);
        rawObservationDigests.add(event.payload.data.evaluatorObservationDigest);
        break;
      case 'model_benchmark.score_vector_observed':
        scorePolicyVersions.add(event.payload.data.scorePolicyVersion);
        scoreVectorDigests.add(digest(event.payload.data.scoreVector));
        uncertaintyDigests.add(digest(event.payload.data.scoreVector.components.map(
          (entry) => ({ dimensionCode: entry.dimensionCode, uncertainty: entry.uncertainty }),
        )));
        break;
      case 'model_benchmark.usage_observed':
        usageEvidenceDigests.add(digest(event.payload.data.usage));
        latencyEvidenceDigests.add(digest(event.payload.data.latency));
        break;
      case 'model_benchmark.judge_observation_recorded':
        judgeEvidenceDigests.add(event.payload.data.observationDigest);
        uncertaintyDigests.add(digest({
          confidence: event.payload.data.confidence,
          uncertainty: event.payload.data.uncertainty,
          disagreementState: event.payload.data.disagreementState,
        }));
        break;
      case 'model_benchmark.oracle_label_attested':
        judgeEvidenceDigests.add(event.payload.data.labelDigest);
        break;
      case 'model_benchmark.contamination_evidence_recorded':
        contaminationEvidenceDigests.add(event.payload.data.evidenceDigest);
        if (event.payload.data.contaminationStatus !== 'clean') {
          blockingVetoCodes.add(`contamination:${event.payload.data.contaminationStatus}`);
        }
        break;
      case 'model_benchmark.exposure_recorded':
        exposureEvidenceDigests.add(event.payload.data.evidenceDigest);
        break;
      case 'model_benchmark.validity_card_derived':
        validityStates.add(event.payload.data.state);
        event.payload.data.blockerCodes.forEach((entry) => blockingVetoCodes.add(entry));
        break;
      case 'model_benchmark.validity_unknown_recorded':
        validityUnknownCodes.add(event.payload.data.unknownCode);
        event.payload.data.requiredEvidenceRefs.forEach((entry) => unresolvedEvidenceRefs.add(entry));
        if (event.payload.data.blocker) blockingVetoCodes.add(event.payload.data.unknownCode);
        break;
      case 'model_benchmark.selection_evidence_sealed':
        selectionEvidenceDigests.add(event.payload.data.evidenceSetDigest);
        break;
      case 'model_benchmark.selection_reduction_requested':
        rankingState = blockingVetoCodes.size > 0 ? 'blocked' : 'ranked';
        break;
      case 'deep_improvement_common.evaluation_inconclusive':
        stringArray(data.evidenceRefs).forEach((entry) => unresolvedEvidenceRefs.add(entry));
        break;
      case 'deep_improvement_common.canary_vetoed':
        if (typeof data.vetoReasonCode === 'string') blockingVetoCodes.add(data.vetoReasonCode);
        break;
      case 'deep_improvement_common.promotion_denied':
        if (typeof data.denialReasonCode === 'string') blockingVetoCodes.add(data.denialReasonCode);
        break;
      default: break;
    }
    refsContaining(event, ['anchor']).forEach((entry) => commonAnchorRefs.add(entry));
    refsContaining(event, ['diagnostic', 'propensity', 'quota']).forEach(
      (entry) => adaptiveDiagnosticRefs.add(entry),
    );
  }
  if (terminalDecision !== 'quarantined' && blockingVetoCodes.size > 0) {
    terminalDecision = 'blocked';
  }
  const cellValues = [...cells.values()].sort((left, right) => left.cellKey.localeCompare(right.cellKey));
  const completed = cellValues.filter((entry) => ['completed', 'observed', 'scored'].includes(entry.disposition)).length;
  return Object.freeze({
    runId,
    lineageId,
    generation,
    runState,
    designIds: Object.freeze(sortedUnique([...designIds])),
    trialBlockIds: Object.freeze(sortedUnique([...trialBlockIds])),
    cells: Object.freeze(cellValues),
    rawObservationDigests: Object.freeze(sortedUnique([...rawObservationDigests])),
    scorePolicyVersions: Object.freeze(sortedUnique([...scorePolicyVersions])),
    scoreVectorDigests: Object.freeze(sortedUnique([...scoreVectorDigests])),
    uncertaintyDigests: Object.freeze(sortedUnique([...uncertaintyDigests])),
    judgeEvidenceDigests: Object.freeze(sortedUnique([...judgeEvidenceDigests])),
    contaminationEvidenceDigests: Object.freeze(sortedUnique([...contaminationEvidenceDigests])),
    exposureEvidenceDigests: Object.freeze(sortedUnique([...exposureEvidenceDigests])),
    validityStates: Object.freeze(sortedUnique([...validityStates])),
    validityUnknownCodes: Object.freeze(sortedUnique([...validityUnknownCodes])),
    workloadEvidenceDigests: Object.freeze(sortedUnique([...workloadEvidenceDigests])),
    usageEvidenceDigests: Object.freeze(sortedUnique([...usageEvidenceDigests])),
    latencyEvidenceDigests: Object.freeze(sortedUnique([...latencyEvidenceDigests])),
    selectionEvidenceDigests: Object.freeze(sortedUnique([...selectionEvidenceDigests])),
    commonAnchorRefs: Object.freeze(sortedUnique([...commonAnchorRefs])),
    adaptiveDiagnosticRefs: Object.freeze(sortedUnique([...adaptiveDiagnosticRefs])),
    sharedServiceRefs: Object.freeze(sortedUnique([...sharedServiceReferenceSet])),
    unresolvedEvidenceRefs: Object.freeze(sortedUnique([...unresolvedEvidenceRefs])),
    blockingVetoCodes: Object.freeze(sortedUnique([...blockingVetoCodes])),
    matrixCoverage: cellValues.length === 0 ? 0 : completed / cellValues.length,
    rankingState,
    terminalDecision,
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'model_benchmark.run_resumed',
    ) ? resumeEvidenceDigest(resumeEvidence, 'legacy') : null,
  });
}

function ledgerProjection(
  events: readonly ModelBenchmarkLedgerEvent[],
  resumeEvidence: ModelBenchmarkResumeParityEvidence | null,
): ModelBenchmarkParityProjection {
  if (events.length === 0) return emptyProjection();
  const folded = foldModelBenchmarkEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Ledger projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  const projection = legacyProjection(events, resumeEvidence);
  return Object.freeze({
    ...projection,
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'model_benchmark.run_resumed',
    ) ? resumeEvidenceDigest(resumeEvidence, 'ledger') : null,
  });
}

function replayState(
  events: readonly ModelBenchmarkLedgerEvent[],
  fixture: ModelBenchmarkParityFixture,
  path: 'legacy' | 'ledger',
): ModelBenchmarkParityReplayState {
  const projection = path === 'legacy'
    ? legacyProjection(events, fixture.resumeEvidence)
    : ledgerProjection(events, fixture.resumeEvidence);
  const fingerprints = events.map((_, index) => digest(
    path === 'legacy'
      ? legacyProjection(events.slice(0, index + 1), fixture.resumeEvidence)
      : ledgerProjection(events.slice(0, index + 1), fixture.resumeEvidence),
  ));
  const observations = canonicalizeModelBenchmarkEventStream(events, fingerprints);
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint: digest(projection),
    observationCanonicalJson: Object.freeze(observations.map((entry) => JSON.stringify(entry))),
  }) as unknown as ModelBenchmarkParityReplayState;
}

function replayObservations(
  state: ModelBenchmarkParityReplayState,
): readonly ModelBenchmarkParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as ModelBenchmarkParityEventObservation,
  ));
}

function replayProjection(state: ModelBenchmarkParityReplayState): ModelBenchmarkParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as ModelBenchmarkParityProjection;
}

export function modelBenchmarkParityInitialStateDigest(
  fixture: ModelBenchmarkParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

function commonObservation(
  observation: ModelBenchmarkParityEventObservation,
): DeepImprovementCommonParityEventObservation {
  return {
    eventId: observation.eventId,
    eventType: observation.eventType,
    logicalIdentity: {
      eventStem: observation.logicalIdentity.eventStem,
      runId: observation.logicalIdentity.runId,
      lineageId: observation.logicalIdentity.lineageId,
      variant: 'model-benchmark',
      candidateId: observation.logicalIdentity.candidateId,
      evaluationEpochId: null,
      fixtureId: observation.logicalIdentity.taskInstanceId,
      observationId: observation.logicalIdentity.trialId,
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
  diffClass: ModelBenchmarkParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): ModelBenchmarkParityDiffRecord {
  const body = {
    fixtureId,
    class: diffClass,
    eventIndex,
    expectedDigest,
    actualDigest,
    disposition: 'unexplained' as const,
    owner: 'model-benchmark-mode-owner' as const,
    dispositionReason: 'The difference can change matrix evidence or a downstream decision.',
    trustedStateProof: digest({ fixtureId, class: diffClass, eventIndex, expectedDigest, actualDigest }),
  };
  return Object.freeze({ diffId: digest(body), ...body });
}

function identityKey(value: ModelBenchmarkParityEventObservation): string {
  return digest(value.logicalIdentity);
}

/** Pair events by logical identity and reject every difference outside the closed allowlist. */
export function compareModelBenchmarkEventStreams(
  fixtureId: string,
  legacy: readonly ModelBenchmarkParityEventObservation[],
  ledger: readonly ModelBenchmarkParityEventObservation[],
): readonly ModelBenchmarkParityDiffRecord[] {
  requireToken(fixtureId, 'fixtureId');
  const diffs = compareDeepImprovementCommonEventStreams(
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
  const legacyByIdentity = new Map(legacy.map((entry, index) => [identityKey(entry), { entry, index }]));
  const ledgerByIdentity = new Map(ledger.map((entry) => [identityKey(entry), entry]));
  for (const [key, expected] of legacyByIdentity) {
    const actual = ledgerByIdentity.get(key);
    if (actual === undefined) continue;
    for (const [diffClass, expectedValue, actualValue] of [
      ['shared-reference', expected.entry.sharedServiceRefs, actual.sharedServiceRefs],
      ['score', expected.entry.evaluatorRefs, actual.evaluatorRefs],
      ['contamination', expected.entry.contaminationRefs, actual.contaminationRefs],
      ['validity', expected.entry.validityRefs, actual.validityRefs],
      ['workload', expected.entry.workloadRefs, actual.workloadRefs],
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
    if (marker !== undefined && DIFF_CLASSES.includes(marker as ModelBenchmarkParityDiffClass)) {
      diffs.push(makeDiff(
        fixtureId,
        marker as ModelBenchmarkParityDiffClass,
        expected.index,
        digest(expected.entry.stepKey),
        digest(actual.stepKey),
      ));
    }
  }
  const unique = new Map(diffs.map((entry) => [digest({
    class: entry.class,
    eventIndex: entry.eventIndex,
    expected: entry.expectedDigest,
    actual: entry.actualDigest,
  }), entry]));
  return Object.freeze([...unique.values()].sort((left, right) => (
    left.eventIndex - right.eventIndex || left.class.localeCompare(right.class)
  )));
}

function faultClass(fault: ModelBenchmarkParityFaultInjection['kind']): ModelBenchmarkParityDiffClass {
  if (fault === 'authorization') return 'unauthorized';
  if (fault === 'drop-event') return 'missing';
  if (fault === 'duplicate-event') return 'duplicated';
  if (fault === 'extra-event') return 'extra';
  if (fault === 'reorder-event') return 'reordered';
  return fault;
}

function stateWithFault(
  state: ModelBenchmarkParityReplayState,
  fault: ModelBenchmarkParityFaultInjection | undefined,
  path: 'legacy' | 'ledger',
  runIndex: number,
): ModelBenchmarkParityReplayState {
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
    observations.push(Object.freeze({
      ...observations[index],
      eventId: `${observations[index].eventId}-duplicate`,
    }));
  } else {
    const source = observations[index];
    const marker = faultClass(fault.kind);
    observations[index] = Object.freeze({
      ...source,
      stepKey: `${source.stepKey}#${marker}`,
      stablePayloadDigest: fault.kind === 'payload'
        ? digest({ fault, path }) : source.stablePayloadDigest,
      projectionFingerprint: fault.kind === 'projection'
        ? digest({ fault, path, projection: true }) : source.projectionFingerprint,
      causalLogicalIdentity: fault.kind === 'causal-link'
        ? digest('fault-causal-link') : source.causalLogicalIdentity,
      receiptRefs: fault.kind === 'receipt'
        ? Object.freeze([...source.receiptRefs, 'fault-receipt']) : source.receiptRefs,
      artifactRefs: fault.kind === 'artifact'
        ? Object.freeze([...source.artifactRefs, digest('fault-artifact')]) : source.artifactRefs,
      sharedServiceRefs: fault.kind === 'shared-reference'
        || fault.kind === 'reference-digest'
        ? Object.freeze([...source.sharedServiceRefs, 'fault-shared-reference'])
        : source.sharedServiceRefs,
      evaluatorRefs: fault.kind === 'score' || fault.kind === 'evaluator-integrity'
        ? Object.freeze([...source.evaluatorRefs, 'fault-evaluator-reference'])
        : source.evaluatorRefs,
      contaminationRefs: fault.kind === 'contamination'
        ? Object.freeze([...source.contaminationRefs, 'fault-contamination-reference'])
        : source.contaminationRefs,
      validityRefs: fault.kind === 'validity'
        ? Object.freeze([...source.validityRefs, 'fault-validity-reference'])
        : source.validityRefs,
      workloadRefs: ['workload', 'usage', 'latency'].includes(fault.kind)
        ? Object.freeze([...source.workloadRefs, `fault-${fault.kind}-reference`])
        : source.workloadRefs,
      authorizationRefs: fault.kind === 'authorization' || fault.kind === 'unauthorized'
        ? Object.freeze([...source.authorizationRefs, 'fault-authorization'])
        : source.authorizationRefs,
      terminalDecision: fault.kind === 'terminal-decision' ? 'blocked' : source.terminalDecision,
    });
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
  }) as unknown as ModelBenchmarkParityReplayState;
}

function evaluateParityPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === PARITY_CAPABILITY_ID
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['shadow-only-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['shadow-only-write'] };
}

function createLedgerBoundary(rootDirectory: string) {
  const authority: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
  const registry = new EventTypeRegistry([
    ...modelBenchmarkEventDefinitions(),
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
    priorStateVersion: MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'model-benchmark-shadow-parity' }),
    actorId: 'model-benchmark-shadow-parity',
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
  fixture: ModelBenchmarkParityFixture,
): TypedReducerRegistry<ModelBenchmarkParityReplayState> {
  return new TypedReducerRegistry(ModelBenchmarkEventStems.map((stem) => ({
    eventType: ModelBenchmarkWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as ModelBenchmarkLedgerEvent,
      );
      return replayState([
        ...history,
        event.effective.envelope as ModelBenchmarkLedgerEvent,
      ], fixture, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'legacy' | 'ledger',
  fixture: ModelBenchmarkParityFixture,
): ReplayComponentRegistry<ModelBenchmarkParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<ModelBenchmarkParityReplayState> => {
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
    projectionSchemaVersion: MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function assertResumeLeaseContinuity(
  frozen: ModelBenchmarkFrozenParityInput,
  evidence: ModelBenchmarkResumeParityEvidence | null,
): void {
  if (evidence === null) return;
  for (const [name, decision] of [
    ['legacyDecision', parseModelBenchmarkResumeDecision(evidence.legacyDecision)],
    ['ledgerDecision', parseModelBenchmarkResumeDecision(evidence.ledgerDecision)],
  ] as const) {
    const mismatches = ['leaseId', 'runId', 'lineageId', 'generation', 'deadlineAt'].filter(
      (field) => decision.lease[field as keyof typeof decision.lease]
        !== frozen.budgetLease[field as keyof typeof frozen.budgetLease],
    );
    if (mismatches.length > 0) {
      throw new TypeError(`MODEL_BENCHMARK_RESUME_LEASE_CONTINUITY: ${name} ${mismatches.join(',')}`);
    }
  }
}

function validateFixtureShape(fixture: ModelBenchmarkParityFixture): void {
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

function validateFrozenInput(
  frozen: ModelBenchmarkFrozenParityInput,
  fixture: ModelBenchmarkParityFixture,
  context: ParityExecutionContext,
  initialState: ModelBenchmarkParityReplayState,
): void {
  const keys = [
    'baseSha', 'runManifestDigest', 'benchmarkRecipeDigest',
    'modelExecutorMatrixDigest', 'taskFixtureSetDigest', 'anchorPolicyDigest',
    'diagnosticPolicyDigest', 'evaluatorEpochDigest', 'judgeConfigurationDigest',
    'workloadProfileDigest', 'contaminationVisibilityDigest', 'seedPolicyDigest',
    'baselineDigest', 'commonServiceContractDigest', 'sealedArtifactContractDigest',
    'initialStateDigest', 'configurationDigest', 'budgetLease',
  ];
  if (!isRecord(frozen) || !hasExactKeys(frozen, keys)) {
    throw new TypeError('frozenInput must use the closed allowed-key set');
  }
  requireBaseSha(frozen.baseSha, 'frozenInput.baseSha');
  for (const field of keys.filter((entry) => entry.endsWith('Digest'))) {
    requireDigest(frozen[field as keyof ModelBenchmarkFrozenParityInput], `frozenInput.${field}`);
  }
  if (
    frozen.baseSha !== context.capsule.baseSha
    || frozen.initialStateDigest !== context.capsule.initialStateDigest
    || frozen.configurationDigest !== context.capsule.configurationDigest
    || frozen.initialStateDigest !== digest(initialState)
    || frozen.commonServiceContractDigest !== digest(MODEL_BENCHMARK_SHARED_PARITY_SERVICES)
    || frozen.sealedArtifactContractDigest !== digest(MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT)
  ) throw new TypeError('Executor fixture does not match its sealed parity capsule');
  if (!isRecord(frozen.budgetLease) || !hasExactKeys(frozen.budgetLease, [
    'leaseId', 'runId', 'lineageId', 'generation', 'maxIterations',
    'remainingIterations', 'deadlineAt',
  ])) throw new TypeError('frozenInput.budgetLease must use the closed allowed-key set');
  assertResumeLeaseContinuity(frozen, fixture.resumeEvidence);
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: ModelBenchmarkParityFixture,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<ModelBenchmarkParityReplayState>,
  initialState: ModelBenchmarkParityReplayState,
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
    relativePath: 'improvement/model-benchmark-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-improvement-derived-state-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
    reducerVersion: PARITY_REDUCER_VERSION,
    serializerId: 'legacy-pretty-json-v1',
    legacyWriter: 'improvement reducer and analysis scripts',
    readers: ['loop host, trade-off detector, operators'],
    base: {
      baseSha: context.capsule.baseSha,
      baseDigest: sha256Bytes(baseBytes),
      bytes: baseBytes,
      state: initialState,
      ledgerHead: { ledgerId: PARITY_LEDGER_ID, sequence: 0, recordHash: GENESIS_RECORD_HASH },
    },
    acceptedEventVersions: Object.fromEntries(
      ModelBenchmarkEventStems.map((stem) => [ModelBenchmarkWireEventTypes[stem], [1]]),
    ),
    reduce: (
      state: Readonly<ModelBenchmarkParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): ModelBenchmarkParityReplayState => {
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as ModelBenchmarkLedgerEvent,
      );
      return replayState([
        ...history,
        event.effective.envelope as ModelBenchmarkLedgerEvent,
      ], fixture, 'legacy');
    },
    serialize: (state: Readonly<ModelBenchmarkParityReplayState>) => (
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
  if (!result.ok || result.receipt.projectedDigest !== sha256Bytes(oracle.bytes)) {
    throw new TypeError('Legacy projection oracle did not bind the expected shadow bytes');
  }
}

function executorObservations(
  context: ParityExecutionContext,
  fixture: ModelBenchmarkParityFixture,
  state: ModelBenchmarkParityReplayState,
) {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'model-benchmark-shadow-observation',
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
    'emitted-artifacts': [
      ...projection.rawObservationDigests,
      ...projection.scoreVectorDigests,
      ...projection.selectionEvidenceDigests,
    ] as unknown as JsonValue,
    'reader-results': state.projectionFingerprint,
  });
}

function attestationEnvelope(path: 'legacy' | 'ledger') {
  return {
    eventId: `${path}-model-benchmark-parity-attestation`,
    streamId: 'model-benchmark-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'model-benchmark-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-model-benchmark-parity-attestation`,
  };
}

function createPathExecutor(
  path: 'legacy' | 'ledger',
  fixture: ModelBenchmarkParityFixture,
  fault: ModelBenchmarkParityFaultInjection | undefined,
  captured: ModelBenchmarkPathEvidence[],
): ModelBenchmarkParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<ParityPathExecution<ModelBenchmarkParityReplayState>> => {
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
          `${path}-event-${event.stream_sequence}-${event.event_id}`,
        );
        await ledger.appendAuthorized(prepared, proof);
      }
      ledgerTemplateRoot = resolve(context.executionRoot, '..', `${path}-ledger-template`);
      cpSync(ledgerRoot, ledgerTemplateRoot, { recursive: true, preserveTimestamps: true });
    }
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const verification: VerifyReplayFingerprintInput<ModelBenchmarkParityReplayState> = {
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
        projectionSchemaVersion: MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
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
      await projectThroughLegacyOracle(context, fixture, ledger, derived, initialState);
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
    const streamDigest = digest(state.observationCanonicalJson);
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

/** Create independent legacy-model and typed-ledger executors over the real substrate. */
export function createModelBenchmarkParityExecutors(
  fixture: ModelBenchmarkParityFixture,
  fault?: ModelBenchmarkParityFaultInjection,
): ModelBenchmarkParityExecutorPair {
  verifyModelBenchmarkLifecycleEventMap();
  validateFixtureShape(fixture);
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: ModelBenchmarkPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: () => Object.freeze([...captured]),
    legacyOracleImplementation: 'modeled-legacy-oracle',
    ledgerImplementation: 'typed-ledger-pipeline',
    commonParityContractId: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId,
    substrateImportsReal: MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL,
  });
}

function caseContractDigest(fixture: ModelBenchmarkParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    lifecycleMap: EventStages,
    comparatorVersion: MODEL_BENCHMARK_COMPARATOR_VERSION,
    projectionVersion: MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
    sharedParityServices: MODEL_BENCHMARK_SHARED_PARITY_SERVICES,
  });
}

export function createModelBenchmarkParityCaseDefinition(
  fixture: ModelBenchmarkParityFixture,
): ParityCaseDefinition {
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'model-benchmark',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'model-benchmark-bounded-shadow',
  });
}

/** Compile the exact mode-specific fixture closure without cloning shared cases. */
export function compileModelBenchmarkParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly ModelBenchmarkParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...MODEL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (scenarios.length !== expected.length
    || new Set(scenarios).size !== expected.length
    || scenarios.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Model Benchmark parity requires the exact fixture scenario closure');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'model-benchmark',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  return compileParityCaseManifest({
    baseSha: input.baseSha,
    baselineRows,
    cases: input.fixtures.map(createModelBenchmarkParityCaseDefinition),
  });
}

function requiredCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases.filter((entry) => entry.mode === 'model-benchmark')
    .map((entry) => entry.caseId).sort();
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: MODEL_BENCHMARK_COMPARATOR_VERSION,
    sharedComparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: MODEL_BENCHMARK_VOLATILITY_ALLOWLIST,
    diffClasses: DIFF_CLASSES,
  });
}

/** Verify the real mode certificate before binding it to parity evidence. */
export async function verifyModelBenchmarkParityModeCertificate(
  caseRun: ModelBenchmarkParityCaseRun,
  manifest: ParityCaseManifest,
): Promise<ModelBenchmarkModeCertificateBinding | null> {
  const verification = await verifyModelBenchmarkCertificateOffline(
    caseRun.modeCertificateVerification.input,
  );
  if (verification.verdict !== 'valid') return null;
  const bundle = parseModelBenchmarkCertificateBundle(
    caseRun.modeCertificateVerification.input.bundle,
  );
  const body = {
    bundle,
    certificateDigest: bundle.certificate.certificateDigest,
    verificationReceipt: verification.verificationReceipt,
    manifestDigest: manifest.manifestDigest,
    comparatorVersion: MODEL_BENCHMARK_COMPARATOR_VERSION,
    caseSetDigest: digest(requiredCaseIds(manifest)),
  };
  return Object.freeze({ ...body, bindingDigest: digest(body) });
}

function pathEvidence(executors: ModelBenchmarkParityExecutorPair, path: 'legacy' | 'ledger') {
  const evidence = executors.evidence().filter((entry) => entry.path === path);
  if (evidence.length === 0) return Object.freeze({
    streamDigest: digest({ missing: path }),
    projectionFingerprint: digest({ missingProjection: path }),
    observations: Object.freeze([]) as readonly ModelBenchmarkParityEventObservation[],
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
  fixture: ModelBenchmarkParityFixture,
  result: ShadowParityCaseResult,
  executors: ModelBenchmarkParityExecutorPair,
): ModelBenchmarkParityCertificateEvidenceBinding | null {
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
  evidence: readonly ModelBenchmarkParityCertificateEvidenceBinding[],
  modeBinding: ModelBenchmarkModeCertificateBinding | null,
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifest: manifest.manifestDigest,
      modeCertificate: modeBinding?.certificateDigest ?? null,
    }),
    harness_digest: digest({
      legacy: 'modeled-model-benchmark-emitter',
      ledger: 'runtime/lib/model-benchmark-reducers',
      sealedArtifacts: 'runtime/lib/model-benchmark-sealed-artifacts',
      common: MODEL_BENCHMARK_SHARED_PARITY_SERVICES,
      certificate: 'runtime/lib/model-benchmark-certificates',
      resume: 'runtime/lib/model-benchmark-resume-adapter',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ version: MODEL_BENCHMARK_REDUCER_VERSION }),
    projection_digest: digest({ version: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({
      lifecycleMap: EventStages,
      evidence,
      modeBinding: modeBinding?.bindingDigest ?? null,
    }),
    policy_version: 'model-benchmark-shadow-only@1',
  });
}

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: ModelBenchmarkParityFixture,
  result: ShadowParityCaseResult,
  executors: ModelBenchmarkParityExecutorPair,
  parityCertificate: ModelBenchmarkParityReceipt['parityCertificate'],
  evidence: readonly ModelBenchmarkParityCertificateEvidenceBinding[],
  modeBinding: ModelBenchmarkModeCertificateBinding | null,
  refusalCode: ModelBenchmarkParityReceipt['certificateRefusalCode'],
): Omit<ModelBenchmarkParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareModelBenchmarkEventStreams(
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
    schemaVersion: MODEL_BENCHMARK_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `model-benchmark-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: `model-benchmark-event@${MODEL_BENCHMARK_EVENT_VERSION}`,
    reducerVersion: MODEL_BENCHMARK_REDUCER_VERSION,
    comparatorVersion: MODEL_BENCHMARK_COMPARATOR_VERSION,
    projectionVersion: MODEL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
    comparatorConfigDigest: comparatorConfigDigest(),
    fixtureId: fixture.fixtureId,
    caseSetDigest: digest(requiredCaseIds(manifest)),
    legacyStreamDigest: legacy.streamDigest,
    ledgerStreamDigest: ledger.streamDigest,
    legacyProjectionFingerprint: legacy.projectionFingerprint,
    ledgerProjectionFingerprint: ledger.projectionFingerprint,
    commonParityContractId: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId,
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

function parseModeBinding(
  input: unknown,
  manifest: ParityCaseManifest,
): ModelBenchmarkModeCertificateBinding {
  if (!isRecord(input) || !hasExactKeys(input, [
    'bundle', 'certificateDigest', 'verificationReceipt', 'manifestDigest',
    'comparatorVersion', 'caseSetDigest', 'bindingDigest',
  ])) throw new TypeError('modeCertificateBinding must use the closed binding shape');
  const bundle = parseModelBenchmarkCertificateBundle(input.bundle);
  const verificationReceipt = input.verificationReceipt as ModelBenchmarkOfflineVerifierReceipt;
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
    || input.comparatorVersion !== MODEL_BENCHMARK_COMPARATOR_VERSION
    || input.caseSetDigest !== digest(requiredCaseIds(manifest))
    || input.bindingDigest !== digest(body)
  ) throw new TypeError('modeCertificateBinding does not match trusted parity inputs');
  return Object.freeze({
    ...body,
    bindingDigest: String(input.bindingDigest),
  }) as ModelBenchmarkModeCertificateBinding;
}

function verifyGenericCertificate(
  receipt: ModelBenchmarkParityReceipt,
  manifest: ParityCaseManifest,
): void {
  if (receipt.certificateStatus === 'refused') return;
  const evidence = receipt.certificateEvidenceBindings;
  const bindings = certificateBindings(manifest, evidence, receipt.modeCertificateBinding);
  const verification = verifyParityCertificate(receipt.parityCertificate, {
    manifest,
    mode: 'model-benchmark',
    bindings,
    caseEvidenceDigests: evidence.map((entry) => entry.caseEvidenceDigest),
    referenceSetDigests: sortedUnique(evidence.map((entry) => entry.referenceSetDigest)),
    attestationFinalDigests: sortedUnique(evidence.flatMap((entry) => entry.attestationFinalDigests)),
  });
  if (!verification.ok || verification.certificateDigest !== receipt.parityCertificateDigest) {
    throw new TypeError('Parity receipt certificate verification failed');
  }
}

/** Parse manifest-bound evidence with no tolerance disposition escape hatch. */
export function parseModelBenchmarkParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): ModelBenchmarkParityReceipt {
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
    if (!isRecord(entry) || !hasExactKeys(entry, [
      'diffId', 'fixtureId', 'class', 'eventIndex', 'expectedDigest', 'actualDigest',
      'disposition', 'owner', 'dispositionReason', 'trustedStateProof',
    ]) || entry.disposition !== 'unexplained') {
      throw new TypeError(`diffDispositions[${index}] must use the closed unexplained shape`);
    }
    if (!DIFF_CLASSES.includes(entry.class as ModelBenchmarkParityDiffClass)) {
      throw new TypeError(`diffDispositions[${index}].class is not registered`);
    }
    const expectedProof = digest({
      fixtureId: entry.fixtureId,
      class: entry.class,
      eventIndex: entry.eventIndex,
      expectedDigest: entry.expectedDigest,
      actualDigest: entry.actualDigest,
    });
    if (entry.expectedDigest === entry.actualDigest || entry.trustedStateProof !== expectedProof) {
      throw new TypeError(`diffDispositions[${index}] does not bind a real difference`);
    }
    return Object.freeze(entry as unknown as ModelBenchmarkParityDiffRecord);
  });
  if (!Array.isArray(input.certificateEvidenceBindings)) {
    throw new TypeError('certificateEvidenceBindings must be an array');
  }
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
    && input.certificateEvidenceBindings.length > 0
    && input.certificateRefusalCode === null;
  const refused = input.certificateStatus === 'refused'
    && input.parityCertificate === null
    && input.parityCertificateDigest === null
    && modeBinding === null
    && input.certificateEvidenceBindings.length === 0
    && input.certificateRefusalCode !== null;
  if (!issued && !refused) throw new TypeError('Parity receipt certificate evidence contradicts its status');
  const { receiptDigest, ...body } = input;
  if (digest(body) !== receiptDigest) throw new TypeError('Parity receipt digest does not commit its body');
  const receipt = Object.freeze({
    ...(input as unknown as ModelBenchmarkParityReceipt),
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

function issueReceipt(
  manifest: ParityCaseManifest,
  fixture: ModelBenchmarkParityFixture,
  result: ShadowParityCaseResult,
  executors: ModelBenchmarkParityExecutorPair,
  certificate: ModelBenchmarkParityReceipt['parityCertificate'],
  evidence: readonly ModelBenchmarkParityCertificateEvidenceBinding[],
  modeBinding: ModelBenchmarkModeCertificateBinding | null,
  refusalCode: ModelBenchmarkParityReceipt['certificateRefusalCode'],
): ModelBenchmarkParityReceipt {
  const body = receiptBody(
    manifest, fixture, result, executors, certificate, evidence, modeBinding, refusalCode,
  );
  return parseModelBenchmarkParityReceipt(
    Object.freeze({ ...body, receiptDigest: digest(body) }),
    manifest,
  );
}

function modeGateBody(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): Omit<ModelBenchmarkModeGateInput, 'gateInputDigest'> {
  const expected = sortedUnique(input.expectedFixtureIds);
  const required = requiredCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  const parsed: ModelBenchmarkParityReceipt[] = [];
  for (const candidate of input.receipts) {
    try {
      parsed.push(parseModelBenchmarkParityReceipt(candidate, input.manifest));
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
  let blockingReasonCode: ModelBenchmarkModeGateBlockReasonCode | null = null;
  if (expected.length === 0) blockingReasonCode = 'ZERO_FIXTURES';
  else if (stale) blockingReasonCode = 'RECEIPT_STALE';
  else if (malformed) blockingReasonCode = 'RECEIPT_MALFORMED';
  else if (!allReceiptsPresent) blockingReasonCode = 'MISSING_RECEIPT';
  else if (certificateFailure) blockingReasonCode = 'CERTIFICATE_UNVERIFIABLE';
  else if (nondeterministic) blockingReasonCode = 'NONDETERMINISTIC_REPLAY';
  else if (unexplained) blockingReasonCode = 'DIFF_UNEXPLAINED';
  else if (fixtureFailure) blockingReasonCode = 'FIXTURE_FAILURE';
  return Object.freeze({
    schemaVersion: MODEL_BENCHMARK_MODE_GATE_INPUT_VERSION,
    mode: 'model-benchmark',
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

/** Build non-authoritative evidence whose verdict the successor must re-derive. */
export function createModelBenchmarkModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): ModelBenchmarkModeGateInput {
  const body = modeGateBody(input);
  return parseModelBenchmarkModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse a closed handoff that cannot authorize rollback or cutover. */
export function parseModelBenchmarkModeGateInput(input: unknown): ModelBenchmarkModeGateInput {
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
  if (input.mode !== 'model-benchmark'
    || input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.rollbackReadinessAuthorized !== false
    || input.cutoverAuthorized !== false) {
    throw new TypeError('Mode-gate input cannot carry authority');
  }
  if (!Array.isArray(input.fixtureIds) || !Array.isArray(input.parityReceiptDigests)) {
    throw new TypeError('Mode-gate identities must be arrays');
  }
  const reasonCodes: readonly ModelBenchmarkModeGateBlockReasonCode[] = [
    'CERTIFICATE_UNVERIFIABLE', 'DIFF_UNEXPLAINED', 'FIXTURE_FAILURE',
    'MISSING_RECEIPT', 'NONDETERMINISTIC_REPLAY', 'RECEIPT_MALFORMED',
    'RECEIPT_STALE', 'ZERO_FIXTURES',
  ];
  if (input.blockingReasonCode !== null
    && !reasonCodes.includes(input.blockingReasonCode as ModelBenchmarkModeGateBlockReasonCode)) {
    throw new TypeError('blockingReasonCode is not registered');
  }
  const { gateInputDigest, ...body } = input;
  requireDigest(gateInputDigest, 'gateInputDigest');
  if (digest(body) !== gateInputDigest) throw new TypeError('Mode-gate digest does not commit its body');
  if (input.exitStatus === 'pass' && (
    input.blockingReasonCode !== null
    || input.zeroUnexplainedDiffs !== true
    || input.allReceiptsPresent !== true
    || input.deterministicReplay !== true
    || input.certificatesVerified !== true
  )) throw new TypeError('Passing mode-gate input contains blocking evidence');
  return Object.freeze(input as unknown as ModelBenchmarkModeGateInput);
}

async function runCase(caseRun: ModelBenchmarkParityCaseRun): Promise<ShadowParityCaseResult> {
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

export async function runModelBenchmarkParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: ModelBenchmarkParityCaseRun;
}>): Promise<ModelBenchmarkParityCaseOutcome> {
  const result = await runCase(input.caseRun);
  const modeBinding = await verifyModelBenchmarkParityModeCertificate(
    input.caseRun,
    input.manifest,
  );
  const binding = evidenceBinding(input.caseRun.fixture, result, input.caseRun.executors);
  const evidence = binding === null ? Object.freeze([]) : Object.freeze([binding]);
  const bindings = certificateBindings(input.manifest, evidence, modeBinding);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'model-benchmark',
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

export async function runModelBenchmarkParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly ModelBenchmarkParityCaseRun[];
}>): Promise<ModelBenchmarkParitySuiteResult> {
  const manifestIds = requiredCaseIds(input.manifest);
  const runIds = input.cases.map((entry) => entry.caseDefinition.caseId).sort();
  if (manifestIds.length === 0 || digest(manifestIds) !== digest(runIds)) {
    throw new TypeError('Parity suite cases must equal the manifest mode closure');
  }
  const caseResults: ShadowParityCaseResult[] = [];
  const modeBindings: Array<ModelBenchmarkModeCertificateBinding | null> = [];
  for (const caseRun of input.cases) {
    caseResults.push(await runCase(caseRun));
    modeBindings.push(await verifyModelBenchmarkParityModeCertificate(caseRun, input.manifest));
  }
  const evidence = Object.freeze(input.cases.flatMap((caseRun, index) => {
    const binding = evidenceBinding(caseRun.fixture, caseResults[index], caseRun.executors);
    return binding === null ? [] : [binding];
  }).sort((left, right) => left.fixtureId.localeCompare(right.fixtureId)));
  const modeBinding = modeBindings.every((entry) => entry !== null) ? modeBindings[0] : null;
  const bindings = certificateBindings(input.manifest, evidence, modeBinding);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'model-benchmark',
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
  const modeGateInput = createModelBenchmarkModeGateInput({
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

/** Build a structurally distinct legacy resume oracle over a frozen state snapshot. */
export function createModelBenchmarkLegacyResumeOracle(
  snapshot: ModelBenchmarkLegacyResumeSnapshot,
): ModelBenchmarkLegacyResumeOracle {
  if (snapshot.events.length === 0) throw new TypeError('Legacy resume oracle requires events');
  const tail = snapshot.events.at(-1) as ModelBenchmarkLedgerEvent;
  return Object.freeze({
    async resume(input: ModelBenchmarkResumeRequest) {
      const request = parseModelBenchmarkResumeRequest(input);
      if (
        request.runId !== snapshot.freshProjection.runId
        || request.lease.runId !== request.runId
        || request.lease.lineageId !== snapshot.freshProjection.lineageId
        || request.lease.generation !== snapshot.freshProjection.generation
      ) throw new TypeError('Legacy continuation identity does not match the persisted lease');
      return Object.freeze({
        decision: parseModelBenchmarkResumeDecision(snapshot.decision),
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

export class ModelBenchmarkResumeParityDivergenceError extends Error {
  public readonly code = 'MODEL_BENCHMARK_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[]) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'ModelBenchmarkResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare the distinct legacy oracle with the landed real resume adapter. */
export async function driveModelBenchmarkResumeParity(input: Readonly<{
  legacyOracle: ModelBenchmarkLegacyResumeOracle;
  ledgerAdapter: ModelBenchmarkResumeAdapter;
  request: ModelBenchmarkResumeRequest;
}>): Promise<ModelBenchmarkResumeParityEvidence> {
  if (typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof ModelBenchmarkResumeAdapter)) {
    throw new TypeError('Resume parity requires distinct legacy and real ledger adapters');
  }
  const request = parseModelBenchmarkResumeRequest(input.request);
  const [legacy, ledger] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  const legacyDecision = parseModelBenchmarkResumeDecision(legacy.decision);
  const ledgerDecision = parseModelBenchmarkResumeDecision(ledger.decision);
  const legacyEventTailDigest = digest(legacy.eventTail);
  const ledgerEventTailDigest = digest(ledger.authenticatedTail);
  const legacyFreshProjectionFingerprint = digest(legacy.freshProjection);
  const ledgerFreshProjectionFingerprint = digest(ledger.projection);
  const dimensions: Array<'decision' | 'event-tail' | 'fresh-projection'> = [];
  if (digest({
    disposition: legacyDecision.disposition,
    compatibility: legacyDecision.compatibility,
    branches: legacyDecision.branches,
    effects: legacyDecision.effects,
    invalidation: legacyDecision.invalidation,
    lease: legacyDecision.lease,
  }) !== digest({
    disposition: ledgerDecision.disposition,
    compatibility: ledgerDecision.compatibility,
    branches: ledgerDecision.branches,
    effects: ledgerDecision.effects,
    invalidation: ledgerDecision.invalidation,
    lease: ledgerDecision.lease,
  })) dimensions.push('decision');
  if (legacyEventTailDigest !== ledgerEventTailDigest) dimensions.push('event-tail');
  if (legacyFreshProjectionFingerprint !== ledgerFreshProjectionFingerprint) {
    dimensions.push('fresh-projection');
  }
  if (dimensions.length > 0) throw new ModelBenchmarkResumeParityDivergenceError(dimensions);
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}

void MODEL_BENCHMARK_SHARED_ARTIFACT_CONTRACT;
void MODEL_BENCHMARK_SUBSTRATE_IMPORTS_REAL;
void (null as ModelBenchmarkCertificateBundle | null);
