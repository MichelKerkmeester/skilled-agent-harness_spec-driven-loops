// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Shadow Parity Harness Adapter
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
  parseSkillBenchmarkCertificateBundle,
  verifySkillBenchmarkCertificateOffline,
} from '../skill-benchmark-certificates/index.js';
import {
  SKILL_BENCHMARK_EVENT_VERSION,
  SkillBenchmarkEventStems,
  SkillBenchmarkSpecificEventStems,
  SkillBenchmarkWireEventTypes,
  skillBenchmarkEventDefinitions,
} from '../skill-benchmark-ledger-schema/index.js';
import {
  SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  SKILL_BENCHMARK_REDUCER_VERSION,
  foldSkillBenchmarkEvents,
} from '../skill-benchmark-reducers/index.js';
import {
  SkillBenchmarkResumeAdapter,
  parseSkillBenchmarkResumeDecision,
  parseSkillBenchmarkResumeRequest,
} from '../skill-benchmark-resume-adapter/index.js';
import {
  SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY,
  SkillBenchmarkArtifactKinds,
} from '../skill-benchmark-sealed-artifacts/index.js';
import {
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
  prepareReplayFingerprintAttestation,
  recordReplayFingerprintAttestation,
  replayFingerprintAttestationEventDefinition,
} from '../replay-fingerprint/index.js';
import { SEALED_ARTIFACT_REPLAY_INPUT_KEY } from '../sealed-reference-artifacts/index.js';
import { parseParityCertificateIdentityRegistry } from '../shadow-parity/parity-identity-registry.js';
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
  SkillBenchmarkCertificateBundle,
  SkillBenchmarkOfflineVerifierReceipt,
} from '../skill-benchmark-certificates/index.js';
import type {
  SkillBenchmarkEventStem,
  SkillBenchmarkLedgerEvent,
} from '../skill-benchmark-ledger-schema/index.js';
import type {
  SkillBenchmarkProjectionState,
} from '../skill-benchmark-reducers/index.js';
import type {
  SkillBenchmarkResumeDecision,
  SkillBenchmarkResumeRequest,
} from '../skill-benchmark-resume-adapter/index.js';
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
  SkillBenchmarkFrozenParityInput,
  SkillBenchmarkLegacyResumeOracle,
  SkillBenchmarkLegacyResumeSnapshot,
  SkillBenchmarkLifecycleEventMapping,
  SkillBenchmarkModeCertificateBinding,
  SkillBenchmarkModeGateBlockReasonCode,
  SkillBenchmarkModeGateInput,
  SkillBenchmarkParityCaseOutcome,
  SkillBenchmarkParityCaseRun,
  SkillBenchmarkParityCertificateEvidenceBinding,
  SkillBenchmarkParityCell,
  SkillBenchmarkParityDiffClass,
  SkillBenchmarkParityDiffRecord,
  SkillBenchmarkParityEventObservation,
  SkillBenchmarkParityExecutorPair,
  SkillBenchmarkParityFaultInjection,
  SkillBenchmarkParityFixture,
  SkillBenchmarkParityFixtureScenario,
  SkillBenchmarkParityProjection,
  SkillBenchmarkParityReceipt,
  SkillBenchmarkParityReplayState,
  SkillBenchmarkParitySuiteResult,
  SkillBenchmarkPathEvidence,
  SkillBenchmarkResumeParityEvidence,
  SkillBenchmarkTerminalDecision,
  SkillBenchmarkVolatilityAllowance,
} from './types.js';

export const SKILL_BENCHMARK_SHADOW_PARITY_SCHEMA_VERSION =
  'skill-benchmark-shadow-parity@1' as const;
export const SKILL_BENCHMARK_COMPARATOR_VERSION =
  'skill-benchmark-event-comparator@1' as const;
export const SKILL_BENCHMARK_MODE_GATE_INPUT_VERSION =
  'skill-benchmark-mode-gate-input@1' as const;
export const SKILL_BENCHMARK_PARITY_PROJECTION_VERSION =
  'skill-benchmark-parity-projection@1' as const;

export const SKILL_BENCHMARK_SHARED_PARITY_SERVICES = Object.freeze({
  contractId: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId,
  contractVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractVersion,
  comparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
  schemaVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.schemaVersion,
  projectionVersion: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.projectionVersion,
  authority: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.authority,
  sealedArtifactContract: SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY,
  sealedArtifactKinds: SkillBenchmarkArtifactKinds,
  substrateImportsReal: true,
  consumer: 'skill-benchmark',
} as const);

const PARITY_REDUCER_ID = 'skill-benchmark:shadow-parity-fold';
const PARITY_REDUCER_VERSION = 'skill-benchmark-shadow-parity-reducer@1';
const PARITY_ARTIFACT_ID = 'skill-benchmark-parity-projection';
const PARITY_LEDGER_ID = 'skill-benchmark-shadow-parity';
const PARITY_AUDIT_LEDGER_ID = 'skill-benchmark-shadow-parity-audit';
const PARITY_POLICY_ID = 'skill-benchmark-shadow-parity-policy';
const PARITY_CAPABILITY_ID = 'skill-benchmark-shadow-parity-write';
const PARITY_TIMESTAMP = '2026-07-28T00:00:00.000Z';
const MAX_RECORD_COUNT = 1_000_000;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const BASE_SHA_PATTERN = /^[a-f0-9]{40}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;
const TRANSPORT_TOKEN_PATTERN = /^transport-[a-f0-9]{16}$/;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const SKILL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS = Object.freeze([
  'no-skill',
  'full-skill',
  'distractor',
  'skill-md-only',
  'references-ablated',
  'scripts-ablated',
  'compatibility-boundary',
  'negative-control',
  'pending-gold',
  'structural-only-gold',
  'score-policy-change',
  'replay',
  'resume',
  'duplicate-delivery',
  'quarantine-priority',
  'shared-service-veto',
  'certificate-withheld',
] as const satisfies readonly SkillBenchmarkParityFixtureScenario[]);

export const SKILL_BENCHMARK_VOLATILITY_ALLOWLIST = Object.freeze(
  DEEP_IMPROVEMENT_COMMON_VOLATILITY_ALLOWLIST.map((entry) => Object.freeze({
    field: entry.field,
    valueKind: entry.valueKind,
    owner: 'skill-benchmark-shadow-parity',
    volatilityReason: entry.volatilityReason,
    semanticIdentity: false,
  })) as readonly SkillBenchmarkVolatilityAllowance[],
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
  'artifact', 'availability', 'causal-link', 'canary', 'compatibility', 'cost',
  'duplicated', 'evaluator-integrity', 'exposure', 'extra', 'gold',
  'input-inequality', 'invocation', 'malformed',
  'missing', 'nondeterministic', 'payload', 'projection', 'promotion', 'receipt',
  'quarantine-priority', 'reference-digest', 'reordered', 'resume-continuity',
  'score', 'security-probe', 'shared-reference', 'trajectory', 'treatment', 'outcome',
  'stale', 'telemetry-gap', 'terminal-decision', 'unauthorized',
  'unsupported-version',
] as const satisfies readonly SkillBenchmarkParityDiffClass[]);

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

function dataRecord(event: SkillBenchmarkLedgerEvent): Record<string, unknown> {
  return event.payload.data as unknown as Record<string, unknown>;
}

function specificStage(stem: SkillBenchmarkEventStem): SkillBenchmarkLifecycleEventMapping {
  const stages: Partial<Record<SkillBenchmarkEventStem, readonly [
    SkillBenchmarkLifecycleEventMapping['lifecycleStage'], string,
  ]>> = {
    'skill_benchmark.run_planned': ['design', 'run-plan'],
    'skill_benchmark.treatment_assigned': ['assignment', 'treatment-assign'],
    'skill_benchmark.run_closed': ['terminal', 'run-close'],
    'skill_benchmark.scenario_started': ['scenario', 'scenario-start'],
    'skill_benchmark.scenario_finished': ['scenario', 'scenario-finish'],
    'skill_benchmark.scenario_aborted': ['scenario', 'scenario-abort'],
    'skill_benchmark.skill_discovered': ['discovery', 'skill-discover'],
    'skill_benchmark.skill_loaded': ['loading', 'skill-load'],
    'skill_benchmark.skill_invoked': ['invocation', 'skill-invoke'],
    'skill_benchmark.resource_exposed': ['exposure', 'resource-expose'],
    'skill_benchmark.milestone_observed': ['trajectory', 'milestone-observe'],
    'skill_benchmark.trajectory_recorded': ['trajectory', 'trajectory-record'],
    'skill_benchmark.outcome_recorded': ['observation', 'outcome-record'],
    'skill_benchmark.score_observed': ['scoring', 'score-observe'],
    'skill_benchmark.gold_integrity_recorded': ['gold', 'gold-record'],
    'skill_benchmark.compatibility_observed': ['compatibility', 'compatibility-observe'],
    'skill_benchmark.negative_transfer_observed': ['diagnostic', 'negative-transfer'],
    'skill_benchmark.security_probe_recorded': ['diagnostic', 'probe-record'],
    'skill_benchmark.effect_certificate_issued': ['certificate', 'certificate-issue'],
    'skill_benchmark.effect_certificate_withheld': ['certificate', 'certificate-withhold'],
    'skill_benchmark.effect_certificate_expired': ['certificate', 'certificate-expire'],
  };
  const stage = stages[stem];
  if (stage === undefined) throw new TypeError(`Missing Skill Benchmark lifecycle mapping for ${stem}`);
  return Object.freeze({
    wireEventType: SkillBenchmarkWireEventTypes[stem],
    lifecycleStage: stage[0],
    stepKey: stage[1],
    sharedService: false,
  });
}

const EventStages = Object.freeze(Object.fromEntries(SkillBenchmarkEventStems.map((stem) => {
  if ((SkillBenchmarkSpecificEventStems as readonly string[]).includes(stem)) {
    return [stem, specificStage(stem)];
  }
  const shared = DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP[
    stem as keyof typeof DEEP_IMPROVEMENT_COMMON_LIFECYCLE_EVENT_MAP
  ];
  if (shared === undefined) throw new TypeError(`Missing shared lifecycle mapping for ${stem}`);
  return [stem, Object.freeze({
    wireEventType: SkillBenchmarkWireEventTypes[stem],
    lifecycleStage: 'shared-service',
    stepKey: `common:${shared.stepKey}`,
    sharedService: true,
  })];
}))) as Readonly<Record<SkillBenchmarkEventStem, SkillBenchmarkLifecycleEventMapping>>;

export const SKILL_BENCHMARK_LIFECYCLE_EVENT_MAP = EventStages;

function validateVolatilityBoundary(event: SkillBenchmarkLedgerEvent): void {
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

function scopeIdentity(event: SkillBenchmarkLedgerEvent) {
  const scope = event.payload.scope;
  return Object.freeze({
    eventStem: event.payload.stem,
    runId: String(scope.runId),
    lineageId: String(scope.lineageId),
    benchmarkDesignId: stringField(scope, 'benchmarkDesignId'),
    scenarioId: stringField(scope, 'scenarioId'),
    assignmentId: stringField(scope, 'assignmentId'),
    executionId: stringField(scope, 'executionId'),
    skillBundleId: stringField(scope, 'skillBundleId'),
    resourceId: stringField(scope, 'resourceId'),
    milestoneId: stringField(scope, 'milestoneId'),
    observationId: stringField(scope, 'observationId'),
    certificateId: stringField(scope, 'certificateId'),
    logicalStep: EventStages[event.payload.stem].stepKey,
    producerSequence: event.stream_sequence,
  });
}

function logicalIdentityDigest(event: SkillBenchmarkLedgerEvent): string {
  return digest(scopeIdentity(event));
}

function valuesBySuffix(event: SkillBenchmarkLedgerEvent, suffixes: readonly string[]): string[] {
  return sortedUnique(Object.entries(dataRecord(event)).flatMap(([key, value]) => (
    suffixes.some((suffix) => key.endsWith(suffix))
      ? typeof value === 'string' ? [value] : stringArray(value)
      : []
  )));
}

function receiptRefs(event: SkillBenchmarkLedgerEvent): string[] {
  return valuesBySuffix(event, ['ReceiptRef', 'ReceiptRefs']);
}

function artifactRefs(event: SkillBenchmarkLedgerEvent): string[] {
  return valuesBySuffix(event, ['Digest', 'Digests', 'PayloadDigest'])
    .filter((entry) => SHA256_PATTERN.test(entry));
}

function sharedServiceRefs(event: SkillBenchmarkLedgerEvent): string[] {
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

function refsContaining(event: SkillBenchmarkLedgerEvent, fragments: readonly string[]): string[] {
  return sortedUnique(Object.entries(dataRecord(event)).flatMap(([key, value]) => (
    fragments.some((fragment) => key.toLowerCase().includes(fragment))
      ? typeof value === 'string' ? [value] : stringArray(value)
      : []
  )));
}

function terminalDecisionForEvent(event: SkillBenchmarkLedgerEvent): SkillBenchmarkTerminalDecision | null {
  switch (event.payload.stem) {
    case 'skill_benchmark.run_closed':
      return event.payload.data.terminalStatus === 'closed'
        ? 'completed'
        : event.payload.data.terminalStatus === 'incomplete'
          ? 'inconclusive'
          : 'aborted';
    case 'skill_benchmark.scenario_aborted': return 'aborted';
    case 'skill_benchmark.effect_certificate_withheld': return 'blocked';
    case 'skill_benchmark.effect_certificate_issued': return 'selection-prepared';
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
export function canonicalizeSkillBenchmarkEventStream(
  events: readonly SkillBenchmarkLedgerEvent[],
  projectionFingerprints: readonly string[],
): readonly SkillBenchmarkParityEventObservation[] {
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
      treatmentRefs: Object.freeze(refsContaining(event, ['treatment', 'assignment', 'paired', 'designcell'])),
      availabilityRefs: Object.freeze(refsContaining(event, ['discovery', 'availability'])),
      invocationRefs: Object.freeze(refsContaining(event, ['invocation', 'activation'])),
      exposureRefs: Object.freeze(refsContaining(event, ['resource', 'exposure', 'canary'])),
      trajectoryRefs: Object.freeze(refsContaining(event, ['milestone', 'trajectory', 'keypoint', 'compliance'])),
      outcomeRefs: Object.freeze(refsContaining(event, ['outcome', 'finalstate', 'constraintcoverage'])),
      scoreRefs: Object.freeze(refsContaining(event, ['score', 'evaluator', 'deterministicresults', 'dynamicreference'])),
      goldRefs: Object.freeze(refsContaining(event, ['gold', 'provenance'])),
      costRefs: Object.freeze(refsContaining(event, ['cost', 'token', 'latency', 'workload'])),
      compatibilityRefs: Object.freeze(refsContaining(event, ['compatibility', 'registry', 'permission', 'dependency'])),
      securityProbeRefs: Object.freeze(refsContaining(event, ['probe', 'refusal', 'composition'])),
      authorizationRefs: Object.freeze(refsContaining(event, ['authorization'])),
      terminalDecision: terminalDecisionForEvent(event),
    });
  }));
}

/** Prove shared and mode event mappings form an exact closed namespace. */
export function verifySkillBenchmarkLifecycleEventMap(): void {
  const mapped = Object.keys(EventStages).sort();
  const expected = [...SkillBenchmarkEventStems].sort();
  if (mapped.length !== expected.length
    || mapped.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Skill Benchmark lifecycle mapping must close every event stem');
  }
  for (const stem of SkillBenchmarkEventStems) {
    if (EventStages[stem].wireEventType !== SkillBenchmarkWireEventTypes[stem]) {
      throw new TypeError(`Lifecycle mapping changed the wire type for ${stem}`);
    }
  }
}

function emptyProjection(): SkillBenchmarkParityProjection {
  return Object.freeze({
    runId: null,
    lineageId: null,
    generation: 0,
    runState: 'planned',
    designIds: Object.freeze([]),
    cells: Object.freeze([]),
    availabilityEvidenceDigests: Object.freeze([]),
    invocationEvidenceDigests: Object.freeze([]),
    exposureEvidenceDigests: Object.freeze([]),
    milestoneEvidenceDigests: Object.freeze([]),
    trajectoryEvidenceDigests: Object.freeze([]),
    outcomeEvidenceDigests: Object.freeze([]),
    scorePolicyVersions: Object.freeze([]),
    scoreVectorDigests: Object.freeze([]),
    goldEvidenceDigests: Object.freeze([]),
    costEvidenceDigests: Object.freeze([]),
    compatibilityEvidenceDigests: Object.freeze([]),
    negativeTransferEvidenceDigests: Object.freeze([]),
    securityProbeEvidenceDigests: Object.freeze([]),
    certificateEvidenceDigests: Object.freeze([]),
    sharedServiceRefs: Object.freeze([]),
    unresolvedEvidenceRefs: Object.freeze([]),
    blockingVetoCodes: Object.freeze([]),
    treatmentCoverage: 0,
    scoringState: 'not-started',
    terminalDecision: 'active',
    resumeDecisionDigest: null,
  });
}

function resumeEvidenceDigest(
  evidence: SkillBenchmarkResumeParityEvidence | null,
  path: 'legacy' | 'ledger',
): string | null {
  if (evidence === null) return null;
  const decision = parseSkillBenchmarkResumeDecision(
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
  event: SkillBenchmarkLedgerEvent,
  current: SkillBenchmarkParityCell | undefined,
): SkillBenchmarkParityCell | null {
  const scenarioId = stringField(event.payload.scope, 'scenarioId');
  const assignmentId = stringField(event.payload.scope, 'assignmentId');
  if (scenarioId === null || assignmentId === null) return null;
  const data = dataRecord(event);
  const disposition = event.payload.stem === 'skill_benchmark.treatment_assigned' ? 'assigned'
    : event.payload.stem === 'skill_benchmark.scenario_started' ? 'running'
      : event.payload.stem === 'skill_benchmark.scenario_finished' ? 'finished'
        : event.payload.stem === 'skill_benchmark.scenario_aborted' ? 'aborted'
          : event.payload.stem === 'skill_benchmark.skill_discovered' ? 'available'
            : event.payload.stem === 'skill_benchmark.skill_loaded' ? 'loaded'
              : event.payload.stem === 'skill_benchmark.skill_invoked' ? 'invoked'
                : event.payload.stem === 'skill_benchmark.trajectory_recorded'
                  ? 'trajectory-recorded'
                  : event.payload.stem === 'skill_benchmark.outcome_recorded'
                    ? 'outcome-recorded'
                    : event.payload.stem === 'skill_benchmark.score_observed'
                      ? 'scored'
                      : current?.disposition ?? 'assigned';
  return Object.freeze({
    scenarioId,
    assignmentId,
    executionId: stringField(event.payload.scope, 'executionId') ?? current?.executionId ?? null,
    treatmentArm: stringField(data, 'treatmentArm') ?? current?.treatmentArm ?? 'unassigned',
    pairedReplicateId: stringField(data, 'pairedReplicateId')
      ?? current?.pairedReplicateId ?? 'unpaired',
    disposition,
    sourceEventId: current?.sourceEventId ?? event.event_id,
    availabilityDigest: stringField(data, 'discoveryEvidenceDigest')
      ?? current?.availabilityDigest ?? null,
    invocationDigest: stringField(data, 'activationDigest')
      ?? current?.invocationDigest ?? null,
    exposureDigest: stringField(data, 'canaryDigest')
      ?? stringField(data, 'resourceDigest') ?? current?.exposureDigest ?? null,
    trajectoryDigest: stringField(data, 'traceDigest')
      ?? current?.trajectoryDigest ?? null,
    outcomeDigest: stringField(data, 'outcomeDigest')
      ?? stringField(data, 'finalStateDigest') ?? current?.outcomeDigest ?? null,
    scoreDigest: event.payload.stem === 'skill_benchmark.score_observed'
      ? digest(event.payload.data.rawScoreAxes) : current?.scoreDigest ?? null,
    goldDigest: stringField(data, 'goldDigest') ?? current?.goldDigest ?? null,
    costDigest: event.payload.stem === 'skill_benchmark.score_observed'
      ? digest({
        tokenCount: event.payload.data.tokenCount,
        latencyMs: event.payload.data.latencyMs,
        costMicrounits: event.payload.data.costMicrounits,
        workloadDigest: event.payload.data.workloadDigest,
      }) : current?.costDigest ?? null,
  });
}

const TERMINAL_SPECIFIC_STEMS = Object.freeze(new Set([
  'skill_benchmark.run_closed',
  'skill_benchmark.scenario_aborted',
  'skill_benchmark.effect_certificate_issued',
  'skill_benchmark.effect_certificate_withheld',
]));

const TERMINAL_SHARED_STEMS = Object.freeze(new Set([
  'deep_improvement_common.run_paused',
  'deep_improvement_common.run_aborted',
  'deep_improvement_common.run_quarantined',
  'deep_improvement_common.evaluation_inconclusive',
  'deep_improvement_common.canary_vetoed',
  'deep_improvement_common.promotion_denied',
]));

function maxBySequence(
  eventIds: readonly string[],
  sequenceByEventId: ReadonlyMap<string, number>,
): string | null {
  let best: string | null = null;
  let bestSequence = -1;
  for (const eventId of eventIds) {
    const sequence = sequenceByEventId.get(eventId) ?? -1;
    if (sequence > bestSequence) {
      best = eventId;
      bestSequence = sequence;
    }
  }
  return best;
}

/**
 * Recover the single legacy-compatible digest for a per-scenario evidence
 * slot from the reducer's accumulated, deduplicated, sort-order evidence
 * set. Legacy overwrites a sticky scalar every time the tracked stem fires;
 * the typed fold instead keeps a set with insertion order lost to
 * `sortStrings`. For the common case (a stage fires once per scenario) the
 * set holds exactly the sticky value. `exclude`, when given, removes a value
 * already attributed to a sibling field (see `reducerExposureDigest`) so the
 * remaining entry is recovered even when two evidence values differ.
 */
function lastEvidenceDigest(
  digests: readonly string[],
  exclude?: string | null,
): string | null {
  const candidates = exclude === null || exclude === undefined
    ? digests
    : digests.filter((entry) => entry !== exclude);
  return candidates.length === 0 ? null : candidates[candidates.length - 1];
}

/**
 * Legacy's `exposureDigest` is a sticky scalar set from `canaryDigest` (a
 * mandatory field on every `resource_exposed` event, so its `?? resourceDigest`
 * fallback never actually triggers). The typed fold instead accumulates both
 * `resourceDigest` and `canaryDigest` into one deduplicated set with no
 * per-value tag, so `canaryDigest` is recovered as the set entry that is not
 * the resource-exposure artifact's own digest (which the reducer always
 * assigns from `resourceDigest`). When both values coincide the two sources
 * agree trivially.
 */
function reducerExposureDigest(
  exposureEvidenceDigests: readonly string[],
  resourceDigest: string | null,
): string | null {
  return lastEvidenceDigest(exposureEvidenceDigests, resourceDigest)
    ?? resourceDigest;
}

/**
 * Recompute each scenario cell's disposition and digests from the reducer's
 * own typed scenario record and its sibling artifact/measurement
 * collections, never from raw event payload. Legacy tracks disposition as a
 * single sticky field overwritten by whichever tracked stem fires last; the
 * reducer instead keeps a set of per-stage event-id pointers, so the last
 * stem is recovered here by comparing those pointers' `seenEvents` stream
 * sequence. `outcomeDigest` replays legacy's own overwrite order: once
 * `outcome_recorded` fires it always wins (its payload carries only
 * `finalStateDigest`, never `outcomeDigest`, so legacy's sticky field ends up
 * holding that value), recovered here from the `outcome` artifact; absent
 * that later event, `scenario_finished`'s own persisted `outcomeDigest`
 * stands, since nothing subsequent overwrites it. `costDigest` is a
 * composite of the four raw-measurement fields legacy hashes together,
 * rebuilt here from the same four fields the reducer now persists verbatim.
 */
function reducerCells(state: SkillBenchmarkProjectionState): SkillBenchmarkParityCell[] {
  const sequenceByEventId = new Map(
    state.seenEvents.map((entry) => [entry.eventId, entry.streamSequence]),
  );
  const latestArtifactByScenarioAndKind = new Map<string, typeof state.artifactIndex.artifacts[number]>();
  for (const artifact of state.artifactIndex.artifacts) {
    if (artifact.scenarioId === null) continue;
    const key = `${artifact.scenarioId}:${artifact.artifactKind}`;
    const current = latestArtifactByScenarioAndKind.get(key);
    const currentSequence = current === undefined
      ? -1 : sequenceByEventId.get(current.producerEventId) ?? -1;
    const candidateSequence = sequenceByEventId.get(artifact.producerEventId) ?? -1;
    if (candidateSequence >= currentSequence) {
      latestArtifactByScenarioAndKind.set(key, artifact);
    }
  }
  const measurementByAssignmentId = new Map<string, typeof state.artifactIndex.rawMeasurements[number]>();
  for (const measurement of state.artifactIndex.rawMeasurements) {
    const current = measurementByAssignmentId.get(measurement.assignmentId);
    const currentSequence = current === undefined
      ? -1 : sequenceByEventId.get(current.producerEventId) ?? -1;
    const candidateSequence = sequenceByEventId.get(measurement.producerEventId) ?? -1;
    if (candidateSequence >= currentSequence) {
      measurementByAssignmentId.set(measurement.assignmentId, measurement);
    }
  }
  return [...state.iterationConvergence.scenarios]
    .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
    .map((scenario) => {
      const rawScoreEventId = maxBySequence(scenario.rawScoreEventIds, sequenceByEventId);
      const stageCandidates: ReadonlyArray<readonly [string | null, string]> = [
        [scenario.assignmentEventId, 'assigned'],
        [scenario.startedEventId, 'running'],
        [scenario.discoveryEventId, 'available'],
        [scenario.loadEventId, 'loaded'],
        [scenario.invocationEventId, 'invoked'],
        [scenario.trajectoryEventId, 'trajectory-recorded'],
        [scenario.outcomeEventId, 'outcome-recorded'],
        [scenario.terminalEventId, scenario.state === 'finished' ? 'finished' : 'aborted'],
        [rawScoreEventId, 'scored'],
      ];
      let disposition = 'assigned';
      let bestSequence = -1;
      for (const [eventId, label] of stageCandidates) {
        if (eventId === null) continue;
        const sequence = sequenceByEventId.get(eventId) ?? -1;
        if (sequence >= bestSequence) {
          disposition = label;
          bestSequence = sequence;
        }
      }
      const exposureArtifact = latestArtifactByScenarioAndKind.get(
        `${scenario.scenarioId}:resource-exposure`,
      );
      const trajectoryArtifact = latestArtifactByScenarioAndKind.get(
        `${scenario.scenarioId}:trajectory`,
      );
      const outcomeArtifact = latestArtifactByScenarioAndKind.get(
        `${scenario.scenarioId}:outcome`,
      );
      const goldArtifact = latestArtifactByScenarioAndKind.get(`${scenario.scenarioId}:gold`);
      const measurement = measurementByAssignmentId.get(scenario.assignmentId);
      return {
        scenarioId: scenario.scenarioId,
        assignmentId: scenario.assignmentId,
        executionId: scenario.executionId,
        treatmentArm: scenario.treatmentArm,
        pairedReplicateId: scenario.pairedReplicateId,
        disposition,
        sourceEventId: scenario.assignmentEventId,
        availabilityDigest: lastEvidenceDigest(scenario.availabilityEvidenceDigests),
        invocationDigest: lastEvidenceDigest(scenario.invocationEvidenceDigests),
        exposureDigest: reducerExposureDigest(
          scenario.exposureEvidenceDigests,
          exposureArtifact?.digest ?? null,
        ),
        trajectoryDigest: trajectoryArtifact?.digest ?? null,
        outcomeDigest: outcomeArtifact?.digest ?? scenario.outcomeDigest,
        scoreDigest: measurement === undefined ? null : digest(measurement.rawScoreAxes),
        goldDigest: goldArtifact?.digest ?? null,
        costDigest: measurement === undefined ? null : digest({
          tokenCount: measurement.tokenCount,
          latencyMs: measurement.latencyMs,
          costMicrounits: measurement.costMicrounits,
          workloadDigest: measurement.workloadDigest,
        }),
      } satisfies SkillBenchmarkParityCell;
    });
}

/**
 * Recover the legacy oracle's blocking-veto vocabulary from typed records
 * only. The reducer's own veto codes for gold-integrity, negative-transfer,
 * and security-probe sources use a different naming convention than the
 * legacy scan (e.g. `gold-integrity-rejected` vs legacy's
 * `gold:${reasonCode}`), so those exact strings cannot be recovered; the two
 * sources whose codes coincide (`compatibility-incompatible`,
 * `resource-canary-triggered`) are reused directly, and the negative-transfer
 * / security-probe categories are re-emitted under legacy's fixed strings
 * using only the veto's `source` field. `gold:${reasonCode}` cannot be
 * recovered at all: the reducer's gold veto never persists the raw
 * `reasonCode`.
 */
function reducerBlockingVetoCodes(state: SkillBenchmarkProjectionState): string[] {
  const stemByEventId = new Map(
    state.common.seenEvents.map((entry) => [entry.eventId, entry.stem]),
  );
  const commonVetoCodes = state.common.iterationConvergence.hardVetoes
    .filter((veto) => {
      const stem = stemByEventId.get(veto.producerEventId);
      return stem === 'deep_improvement_common.canary_vetoed'
        || stem === 'deep_improvement_common.promotion_denied';
    })
    .map((veto) => veto.vetoCode);
  const specificVetoCodes = state.iterationConvergence.hardVetoes.flatMap((veto) => {
    switch (veto.source) {
      case 'compatibility': return ['compatibility-incompatible'];
      case 'canary': return ['resource-canary-triggered'];
      case 'negative-transfer': return ['negative-transfer'];
      case 'security-probe': return ['probe-failed'];
      // gold-integrity's raw reasonCode is not persisted in typed state.
      case 'gold-integrity': return [];
      case 'shared-common': return [];
    }
  });
  return sortedUnique([...commonVetoCodes, ...specificVetoCodes]);
}

function terminalStatusToDecision(
  runState: SkillBenchmarkProjectionState['run']['state'],
): SkillBenchmarkTerminalDecision {
  return runState === 'closed' ? 'completed'
    : runState === 'incomplete' ? 'inconclusive'
      : 'aborted';
}

/**
 * Replay the same sticky, stem-keyed terminal mapping the legacy oracle
 * applies, off `seenEvents` stream order instead of a second raw-event scan.
 * `run_closed`'s outcome is read off the reducer's own final run state.
 */
function reducerTerminalDecision(
  state: SkillBenchmarkProjectionState,
): SkillBenchmarkTerminalDecision {
  let terminalDecision: SkillBenchmarkTerminalDecision = 'active';
  for (const seen of [...state.seenEvents].sort(
    (left, right) => left.streamSequence - right.streamSequence,
  )) {
    if (TERMINAL_SPECIFIC_STEMS.has(seen.stem)) {
      switch (seen.stem) {
        case 'skill_benchmark.run_closed':
          terminalDecision = terminalStatusToDecision(state.run.state);
          break;
        case 'skill_benchmark.scenario_aborted':
          terminalDecision = 'aborted';
          break;
        case 'skill_benchmark.effect_certificate_withheld':
          terminalDecision = 'blocked';
          break;
        case 'skill_benchmark.effect_certificate_issued':
          terminalDecision = 'selection-prepared';
          break;
        default:
          break;
      }
    } else if (TERMINAL_SHARED_STEMS.has(seen.stem)) {
      switch (seen.stem) {
        case 'deep_improvement_common.run_paused':
          terminalDecision = 'paused';
          break;
        case 'deep_improvement_common.run_aborted':
          terminalDecision = 'aborted';
          break;
        case 'deep_improvement_common.run_quarantined':
          terminalDecision = 'quarantined';
          break;
        case 'deep_improvement_common.evaluation_inconclusive':
          terminalDecision = 'inconclusive';
          break;
        case 'deep_improvement_common.canary_vetoed':
        case 'deep_improvement_common.promotion_denied':
          terminalDecision = 'blocked';
          break;
        default:
          break;
      }
    }
  }
  return terminalDecision;
}

/**
 * Replay legacy's sticky `scoringState` (last write wins across
 * score/certificate stems) off `seenEvents` order, reading
 * `numeratorEligible` from the reducer's own raw-measurement record instead
 * of the raw event payload.
 */
function reducerScoringState(state: SkillBenchmarkProjectionState): string {
  const measurementByEventId = new Map(
    state.artifactIndex.rawMeasurements.map((entry) => [entry.producerEventId, entry]),
  );
  let scoringState = 'not-started';
  for (const seen of [...state.seenEvents].sort(
    (left, right) => left.streamSequence - right.streamSequence,
  )) {
    if (seen.stem === 'skill_benchmark.score_observed') {
      const eligible = measurementByEventId.get(seen.eventId)?.numeratorEligible ?? false;
      scoringState = eligible ? 'raw-observed' : 'blocked';
    } else if (seen.stem === 'skill_benchmark.effect_certificate_issued') {
      scoringState = 'ranked';
    } else if (seen.stem === 'skill_benchmark.effect_certificate_withheld') {
      scoringState = 'blocked';
    }
  }
  return scoringState;
}

/**
 * Recover the shared-service scope refs the legacy scan reads from every
 * `deep_improvement_common.*` event's `scope` fields. No field in the
 * skill-benchmark ledger schema ends with `ServiceRef` or
 * `ServiceContractVersion`, so the mode-specific contribution legacy's
 * suffix scan would read from `skill_benchmark.*` events is structurally
 * always empty on both paths -- there is nothing to lose here.
 */
function reducerSharedServiceRefs(state: SkillBenchmarkProjectionState): string[] {
  const fromSeenEvents = state.common.seenEvents.flatMap((entry) => [
    entry.candidateId, entry.evaluationEpochId, entry.canaryEpochId, entry.promotionId,
  ]);
  const baselineIds = state.common.iterationConvergence.promotions.map(
    (entry) => entry.baselineId,
  );
  return sortedUnique([...fromSeenEvents, ...baselineIds].filter(
    (entry): entry is string => entry !== null,
  ));
}

function reducerRunState(state: SkillBenchmarkProjectionState): string {
  if (state.seenEvents.some((entry) => entry.stem === 'skill_benchmark.run_closed')) {
    return state.run.state;
  }
  if (state.seenEvents.some((entry) => entry.stem === 'skill_benchmark.scenario_started')) {
    return 'active';
  }
  return 'planned';
}

function reducerTreatmentCoverage(cells: readonly SkillBenchmarkParityCell[]): number {
  if (cells.length === 0) return 0;
  const completed = cells.filter((cell) => cell.disposition === 'finished'
    || cell.disposition === 'outcome-recorded'
    || cell.disposition === 'scored').length;
  return completed / cells.length;
}

/**
 * Derive the parity projection from the reducer's own typed fold output
 * only.
 *
 * This never reads the raw event stream: every field is read off the typed
 * collections the real reducer (`foldSkillBenchmarkEvents`) persisted, so a
 * defect in the reducer's own field computation is visible here rather than
 * being silently re-derived away by a second scan of the same events.
 * `availabilityEvidenceDigests`, `invocationEvidenceDigests`,
 * `exposureEvidenceDigests`, `goldEvidenceDigests`, and `costEvidenceDigests`
 * are unioned from the scenario- and measurement-level evidence the typed
 * fold now persists per event, matching the legacy hand-scan's own
 * per-event union. `certificateEvidenceDigests` remains a documented
 * exception: `evidenceSetDigest` (`effect_certificate_issued`/`withheld`) is
 * used only for referential-integrity checks during folding and is never
 * written into any persisted collection, so it stays genuinely unrecoverable
 * from the typed state.
 */
function skillBenchmarkProjectionFromReducerState(
  state: SkillBenchmarkProjectionState,
  resumeEvidence: SkillBenchmarkResumeParityEvidence | null,
): SkillBenchmarkParityProjection {
  const cells = reducerCells(state);
  const blockingVetoCodes = reducerBlockingVetoCodes(state);
  const hasGenerationEvent = state.seenEvents.some(
    (entry) => entry.stem === 'deep_improvement_common.run_resumed',
  );
  const terminalDecision = reducerTerminalDecision(state);
  const negativeTransferArtifacts = state.artifactIndex.artifacts.filter(
    (artifact) => artifact.artifactKind === 'negative-transfer',
  );
  const securityProbeArtifacts = state.artifactIndex.artifacts.filter(
    (artifact) => artifact.artifactKind === 'security-probe',
  );
  const milestoneArtifacts = state.artifactIndex.artifacts.filter(
    (artifact) => artifact.artifactKind === 'milestone',
  );
  const trajectoryArtifacts = state.artifactIndex.artifacts.filter(
    (artifact) => artifact.artifactKind === 'trajectory',
  );
  const outcomeArtifacts = state.artifactIndex.artifacts.filter(
    (artifact) => artifact.artifactKind === 'outcome',
  );
  const compatibilityArtifacts = state.artifactIndex.artifacts.filter(
    (artifact) => artifact.artifactKind === 'compatibility',
  );
  return Object.freeze({
    // Legacy reads runId/lineageId off every event's own scope, so a run
    // whose very first event is the shared `run_started` (before any
    // skill-benchmark-specific event exists) already has both. The
    // skill-benchmark-specific run record is populated only once
    // `run_planned` fires; the shared run record is populated by
    // `run_started` itself, so it is the source of truth here.
    runId: state.common.run.runId ?? state.run.runId,
    lineageId: state.common.run.lineageId ?? state.run.lineageId,
    // Legacy never reads a generation field from any skill-benchmark or
    // shared event, so its own scan output is always the constant 0.
    generation: 0,
    runState: reducerRunState(state),
    designIds: Object.freeze(
      state.run.benchmarkDesignId === null ? [] : [state.run.benchmarkDesignId],
    ),
    cells: Object.freeze(cells),
    availabilityEvidenceDigests: Object.freeze(sortedUnique(
      state.iterationConvergence.scenarios.flatMap((entry) => entry.availabilityEvidenceDigests),
    )),
    invocationEvidenceDigests: Object.freeze(sortedUnique(
      state.iterationConvergence.scenarios.flatMap((entry) => entry.invocationEvidenceDigests),
    )),
    exposureEvidenceDigests: Object.freeze(sortedUnique(
      state.iterationConvergence.scenarios.flatMap((entry) => entry.exposureEvidenceDigests),
    )),
    milestoneEvidenceDigests: Object.freeze(
      sortedUnique(milestoneArtifacts.map((artifact) => artifact.digest)),
    ),
    trajectoryEvidenceDigests: Object.freeze(
      sortedUnique(trajectoryArtifacts.map((artifact) => artifact.digest)),
    ),
    outcomeEvidenceDigests: Object.freeze(
      sortedUnique(outcomeArtifacts.map((artifact) => artifact.digest)),
    ),
    scorePolicyVersions: Object.freeze(sortedUnique(
      state.artifactIndex.rawMeasurements.map((entry) => entry.evaluatorVersion),
    )),
    scoreVectorDigests: Object.freeze(sortedUnique(
      state.artifactIndex.rawMeasurements.map((entry) => digest(entry.rawScoreAxes)),
    )),
    goldEvidenceDigests: Object.freeze(sortedUnique(
      state.iterationConvergence.scenarios.flatMap((entry) => entry.goldEvidenceDigests),
    )),
    costEvidenceDigests: Object.freeze(sortedUnique(
      state.artifactIndex.rawMeasurements.map((entry) => digest({
        tokenCount: entry.tokenCount,
        latencyMs: entry.latencyMs,
        costMicrounits: entry.costMicrounits,
        workloadDigest: entry.workloadDigest,
      })),
    )),
    compatibilityEvidenceDigests: Object.freeze(
      sortedUnique(compatibilityArtifacts.map((artifact) => artifact.digest)),
    ),
    negativeTransferEvidenceDigests: Object.freeze(
      sortedUnique(negativeTransferArtifacts.map((artifact) => artifact.digest)),
    ),
    securityProbeEvidenceDigests: Object.freeze(
      sortedUnique(securityProbeArtifacts.map((artifact) => artifact.digest)),
    ),
    // evidenceSetDigest (effect_certificate_issued/withheld) is never
    // persisted anywhere in the typed fold.
    certificateEvidenceDigests: Object.freeze([]),
    sharedServiceRefs: Object.freeze(reducerSharedServiceRefs(state)),
    unresolvedEvidenceRefs: Object.freeze(
      sortedUnique(state.common.iterationConvergence.unresolvedEvidenceRefs),
    ),
    blockingVetoCodes: Object.freeze(blockingVetoCodes),
    treatmentCoverage: reducerTreatmentCoverage(cells),
    scoringState: reducerScoringState(state),
    terminalDecision: terminalDecision !== 'quarantined' && blockingVetoCodes.length > 0
      ? 'blocked'
      : terminalDecision,
    resumeDecisionDigest: hasGenerationEvent
      ? resumeEvidenceDigest(resumeEvidence, 'ledger')
      : null,
  });
}

/** Model the pinned legacy emitter without invoking the typed reducer. */
function legacyProjection(
  events: readonly SkillBenchmarkLedgerEvent[],
  resumeEvidence: SkillBenchmarkResumeParityEvidence | null,
): SkillBenchmarkParityProjection {
  if (events.length === 0) return emptyProjection();
  let runId: string | null = null;
  let lineageId: string | null = null;
  let generation = 0;
  let runState = 'planned';
  let terminalDecision: SkillBenchmarkTerminalDecision = 'active';
  let scoringState = 'not-started';
  const designIds = new Set<string>();
  const cells = new Map<string, SkillBenchmarkParityCell>();
  const availabilityEvidenceDigests = new Set<string>();
  const invocationEvidenceDigests = new Set<string>();
  const exposureEvidenceDigests = new Set<string>();
  const milestoneEvidenceDigests = new Set<string>();
  const trajectoryEvidenceDigests = new Set<string>();
  const outcomeEvidenceDigests = new Set<string>();
  const scorePolicyVersions = new Set<string>();
  const scoreVectorDigests = new Set<string>();
  const goldEvidenceDigests = new Set<string>();
  const costEvidenceDigests = new Set<string>();
  const compatibilityEvidenceDigests = new Set<string>();
  const negativeTransferEvidenceDigests = new Set<string>();
  const securityProbeEvidenceDigests = new Set<string>();
  const certificateEvidenceDigests = new Set<string>();
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
    const scenarioId = stringField(scope, 'scenarioId');
    const cell = projectionCell(
      event,
      scenarioId === null ? undefined : cells.get(scenarioId),
    );
    if (cell !== null) cells.set(cell.scenarioId, cell);
    switch (event.payload.stem) {
      case 'skill_benchmark.run_planned':
        designIds.add(String(scope.benchmarkDesignId));
        runState = 'planned';
        break;
      case 'skill_benchmark.scenario_started': runState = 'active'; break;
      case 'skill_benchmark.run_closed': runState = event.payload.data.terminalStatus; break;
      case 'skill_benchmark.skill_discovered':
        availabilityEvidenceDigests.add(event.payload.data.discoveryEvidenceDigest);
        break;
      case 'skill_benchmark.skill_invoked':
        invocationEvidenceDigests.add(event.payload.data.activationDigest);
        break;
      case 'skill_benchmark.resource_exposed':
        exposureEvidenceDigests.add(event.payload.data.resourceDigest);
        exposureEvidenceDigests.add(event.payload.data.canaryDigest);
        if (event.payload.data.canaryStatus === 'triggered') {
          blockingVetoCodes.add('resource-canary-triggered');
        }
        break;
      case 'skill_benchmark.milestone_observed':
        milestoneEvidenceDigests.add(event.payload.data.observationDigest);
        break;
      case 'skill_benchmark.trajectory_recorded':
        trajectoryEvidenceDigests.add(event.payload.data.traceDigest);
        break;
      case 'skill_benchmark.outcome_recorded':
        outcomeEvidenceDigests.add(event.payload.data.finalStateDigest);
        break;
      case 'skill_benchmark.score_observed':
        scorePolicyVersions.add(event.payload.data.evaluatorVersion);
        scoreVectorDigests.add(digest(event.payload.data.rawScoreAxes));
        costEvidenceDigests.add(digest({
          tokenCount: event.payload.data.tokenCount,
          latencyMs: event.payload.data.latencyMs,
          costMicrounits: event.payload.data.costMicrounits,
          workloadDigest: event.payload.data.workloadDigest,
        }));
        scoringState = event.payload.data.numeratorEligible ? 'raw-observed' : 'blocked';
        break;
      case 'skill_benchmark.gold_integrity_recorded':
        goldEvidenceDigests.add(event.payload.data.goldDigest);
        goldEvidenceDigests.add(event.payload.data.provenanceDigest);
        if (event.payload.data.integrityStatus === 'blocked'
          || (event.payload.data.goldPolicy === 'scored'
            && event.payload.data.coverageRatio === 0)) {
          blockingVetoCodes.add(`gold:${event.payload.data.reasonCode}`);
        }
        break;
      case 'skill_benchmark.compatibility_observed':
        compatibilityEvidenceDigests.add(event.payload.data.evidenceDigest);
        if (event.payload.data.compatibilityStatus === 'incompatible') {
          blockingVetoCodes.add('compatibility-incompatible');
        }
        break;
      case 'skill_benchmark.negative_transfer_observed':
        negativeTransferEvidenceDigests.add(event.payload.data.evidenceDigest);
        if (event.payload.data.transferStatus === 'negative-transfer') {
          blockingVetoCodes.add('negative-transfer');
        }
        break;
      case 'skill_benchmark.security_probe_recorded':
        securityProbeEvidenceDigests.add(event.payload.data.evidenceDigest);
        if (event.payload.data.probeOutcome === 'fail') blockingVetoCodes.add('probe-failed');
        break;
      case 'skill_benchmark.effect_certificate_issued':
      case 'skill_benchmark.effect_certificate_withheld':
        certificateEvidenceDigests.add(event.payload.data.evidenceSetDigest);
        scoringState = event.payload.stem === 'skill_benchmark.effect_certificate_issued'
          ? 'ranked'
          : 'blocked';
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
  }
  if (terminalDecision !== 'quarantined' && blockingVetoCodes.size > 0) {
    terminalDecision = 'blocked';
  }
  const cellValues = [...cells.values()].sort(
    (left, right) => left.scenarioId.localeCompare(right.scenarioId),
  );
  const completed = cellValues.filter((entry) => (
    ['finished', 'outcome-recorded', 'scored'].includes(entry.disposition)
  )).length;
  return Object.freeze({
    runId,
    lineageId,
    generation,
    runState,
    designIds: Object.freeze(sortedUnique([...designIds])),
    cells: Object.freeze(cellValues),
    availabilityEvidenceDigests: Object.freeze(sortedUnique([...availabilityEvidenceDigests])),
    invocationEvidenceDigests: Object.freeze(sortedUnique([...invocationEvidenceDigests])),
    exposureEvidenceDigests: Object.freeze(sortedUnique([...exposureEvidenceDigests])),
    milestoneEvidenceDigests: Object.freeze(sortedUnique([...milestoneEvidenceDigests])),
    trajectoryEvidenceDigests: Object.freeze(sortedUnique([...trajectoryEvidenceDigests])),
    outcomeEvidenceDigests: Object.freeze(sortedUnique([...outcomeEvidenceDigests])),
    scorePolicyVersions: Object.freeze(sortedUnique([...scorePolicyVersions])),
    scoreVectorDigests: Object.freeze(sortedUnique([...scoreVectorDigests])),
    goldEvidenceDigests: Object.freeze(sortedUnique([...goldEvidenceDigests])),
    costEvidenceDigests: Object.freeze(sortedUnique([...costEvidenceDigests])),
    compatibilityEvidenceDigests: Object.freeze(sortedUnique([...compatibilityEvidenceDigests])),
    negativeTransferEvidenceDigests: Object.freeze(sortedUnique([...negativeTransferEvidenceDigests])),
    securityProbeEvidenceDigests: Object.freeze(sortedUnique([...securityProbeEvidenceDigests])),
    certificateEvidenceDigests: Object.freeze(sortedUnique([...certificateEvidenceDigests])),
    sharedServiceRefs: Object.freeze(sortedUnique([...sharedServiceReferenceSet])),
    unresolvedEvidenceRefs: Object.freeze(sortedUnique([...unresolvedEvidenceRefs])),
    blockingVetoCodes: Object.freeze(sortedUnique([...blockingVetoCodes])),
    treatmentCoverage: cellValues.length === 0 ? 0 : completed / cellValues.length,
    scoringState,
    terminalDecision,
    resumeDecisionDigest: events.some(
      (event) => event.payload.stem === 'deep_improvement_common.run_resumed',
    ) ? resumeEvidenceDigest(resumeEvidence, 'legacy') : null,
  });
}

function ledgerProjection(
  events: readonly SkillBenchmarkLedgerEvent[],
  resumeEvidence: SkillBenchmarkResumeParityEvidence | null,
): SkillBenchmarkParityProjection {
  if (events.length === 0) return emptyProjection();
  const folded = foldSkillBenchmarkEvents(events);
  if (folded.outcome !== 'projected') {
    throw new TypeError(`Ledger projection requires rebuild: ${folded.reasonCodes.join(',')}`);
  }
  return skillBenchmarkProjectionFromReducerState(folded.projection, resumeEvidence);
}

function replayState(
  events: readonly SkillBenchmarkLedgerEvent[],
  fixture: SkillBenchmarkParityFixture,
  path: 'legacy' | 'ledger',
): SkillBenchmarkParityReplayState {
  const projection = path === 'legacy'
    ? legacyProjection(events, fixture.resumeEvidence)
    : ledgerProjection(events, fixture.resumeEvidence);
  const fingerprints = events.map((_, index) => digest(
    path === 'legacy'
      ? legacyProjection(events.slice(0, index + 1), fixture.resumeEvidence)
      : ledgerProjection(events.slice(0, index + 1), fixture.resumeEvidence),
  ));
  const observations = canonicalizeSkillBenchmarkEventStream(events, fingerprints);
  return Object.freeze({
    eventIds: Object.freeze(events.map((event) => event.event_id)),
    eventCanonicalJson: Object.freeze(events.map((event) => JSON.stringify(event))),
    projectionCanonicalJson: JSON.stringify(projection),
    projectionFingerprint: digest(projection),
    observationCanonicalJson: Object.freeze(observations.map((entry) => JSON.stringify(entry))),
  }) as unknown as SkillBenchmarkParityReplayState;
}

function replayObservations(
  state: SkillBenchmarkParityReplayState,
): readonly SkillBenchmarkParityEventObservation[] {
  return Object.freeze(state.observationCanonicalJson.map(
    (entry) => JSON.parse(entry) as SkillBenchmarkParityEventObservation,
  ));
}

function replayProjection(state: SkillBenchmarkParityReplayState): SkillBenchmarkParityProjection {
  return JSON.parse(state.projectionCanonicalJson) as SkillBenchmarkParityProjection;
}

export function skillBenchmarkParityInitialStateDigest(
  fixture: SkillBenchmarkParityFixture,
): string {
  return digest(replayState([], fixture, 'ledger'));
}

function commonObservation(
  observation: SkillBenchmarkParityEventObservation,
): DeepImprovementCommonParityEventObservation {
  return {
    eventId: observation.eventId,
    eventType: observation.eventType,
    logicalIdentity: {
      eventStem: observation.logicalIdentity.eventStem,
      runId: observation.logicalIdentity.runId,
      lineageId: observation.logicalIdentity.lineageId,
      variant: 'skill-benchmark',
      candidateId: observation.logicalIdentity.skillBundleId,
      evaluationEpochId: null,
      fixtureId: observation.logicalIdentity.scenarioId,
      observationId: observation.logicalIdentity.observationId,
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
  diffClass: SkillBenchmarkParityDiffClass,
  eventIndex: number,
  expectedDigest: string | null,
  actualDigest: string | null,
): SkillBenchmarkParityDiffRecord {
  const body = {
    fixtureId,
    class: diffClass,
    eventIndex,
    expectedDigest,
    actualDigest,
    disposition: 'unexplained' as const,
    owner: 'skill-benchmark-mode-owner' as const,
    dispositionReason: 'The difference can change treatment evidence or a downstream decision.',
    trustedStateProof: digest({ fixtureId, class: diffClass, eventIndex, expectedDigest, actualDigest }),
  };
  return Object.freeze({ diffId: digest(body), ...body });
}

function identityKey(value: SkillBenchmarkParityEventObservation): string {
  return digest(value.logicalIdentity);
}

/** Pair events by logical identity and reject every difference outside the closed allowlist. */
export function compareSkillBenchmarkEventStreams(
  fixtureId: string,
  legacy: readonly SkillBenchmarkParityEventObservation[],
  ledger: readonly SkillBenchmarkParityEventObservation[],
): readonly SkillBenchmarkParityDiffRecord[] {
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
      ['treatment', expected.entry.treatmentRefs, actual.treatmentRefs],
      ['availability', expected.entry.availabilityRefs, actual.availabilityRefs],
      ['invocation', expected.entry.invocationRefs, actual.invocationRefs],
      ['exposure', expected.entry.exposureRefs, actual.exposureRefs],
      ['trajectory', expected.entry.trajectoryRefs, actual.trajectoryRefs],
      ['outcome', expected.entry.outcomeRefs, actual.outcomeRefs],
      ['score', expected.entry.scoreRefs, actual.scoreRefs],
      ['gold', expected.entry.goldRefs, actual.goldRefs],
      ['cost', expected.entry.costRefs, actual.costRefs],
      ['compatibility', expected.entry.compatibilityRefs, actual.compatibilityRefs],
      ['security-probe', expected.entry.securityProbeRefs, actual.securityProbeRefs],
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
    if (marker !== undefined && DIFF_CLASSES.includes(marker as SkillBenchmarkParityDiffClass)) {
      diffs.push(makeDiff(
        fixtureId,
        marker as SkillBenchmarkParityDiffClass,
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

function faultClass(fault: SkillBenchmarkParityFaultInjection['kind']): SkillBenchmarkParityDiffClass {
  if (fault === 'authorization') return 'unauthorized';
  if (fault === 'drop-event') return 'missing';
  if (fault === 'duplicate-event') return 'duplicated';
  if (fault === 'extra-event') return 'extra';
  if (fault === 'reorder-event') return 'reordered';
  return fault;
}

function stateWithFault(
  state: SkillBenchmarkParityReplayState,
  fault: SkillBenchmarkParityFaultInjection | undefined,
  path: 'legacy' | 'ledger',
  runIndex: number,
): SkillBenchmarkParityReplayState {
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
      treatmentRefs: fault.kind === 'treatment' || fault.kind === 'input-inequality'
        ? Object.freeze([...source.treatmentRefs, 'fault-treatment-reference'])
        : source.treatmentRefs,
      availabilityRefs: fault.kind === 'availability'
        ? Object.freeze([...source.availabilityRefs, 'fault-availability-reference'])
        : source.availabilityRefs,
      invocationRefs: fault.kind === 'invocation'
        ? Object.freeze([...source.invocationRefs, 'fault-invocation-reference'])
        : source.invocationRefs,
      exposureRefs: fault.kind === 'exposure'
        ? Object.freeze([...source.exposureRefs, 'fault-exposure-reference'])
        : source.exposureRefs,
      trajectoryRefs: fault.kind === 'trajectory'
        ? Object.freeze([...source.trajectoryRefs, 'fault-trajectory-reference'])
        : source.trajectoryRefs,
      outcomeRefs: fault.kind === 'outcome'
        ? Object.freeze([...source.outcomeRefs, 'fault-outcome-reference'])
        : source.outcomeRefs,
      scoreRefs: fault.kind === 'score'
        ? Object.freeze([...source.scoreRefs, 'fault-score-reference'])
        : source.scoreRefs,
      goldRefs: fault.kind === 'gold'
        ? Object.freeze([...source.goldRefs, 'fault-gold-reference'])
        : source.goldRefs,
      costRefs: fault.kind === 'cost'
        ? Object.freeze([...source.costRefs, 'fault-cost-reference'])
        : source.costRefs,
      compatibilityRefs: fault.kind === 'compatibility'
        ? Object.freeze([...source.compatibilityRefs, 'fault-compatibility-reference'])
        : source.compatibilityRefs,
      securityProbeRefs: fault.kind === 'security-probe'
        ? Object.freeze([...source.securityProbeRefs, 'fault-probe-reference'])
        : source.securityProbeRefs,
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
  }) as unknown as SkillBenchmarkParityReplayState;
}

function evaluateParityPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
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

function createLedgerBoundary(rootDirectory: string) {
  const authority: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
  const registry = new EventTypeRegistry([
    ...skillBenchmarkEventDefinitions(),
    replayFingerprintAttestationEventDefinition(),
  ]);
  const policies = new TransitionPolicyRegistry([{
    policyId: PARITY_POLICY_ID,
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['shadow-only-write'],
    capturedAuthorizationState: { state: authority.state, epoch: authority.epoch },
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
    mode: 'improvement',
    event,
    priorHead: await ledger.getVerifiedHead(),
    priorStateVersion: SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
    priorStateFingerprint: digest({ fixture: 'skill-benchmark-shadow-parity' }),
    actorId: 'skill-benchmark-shadow-parity',
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
  fixture: SkillBenchmarkParityFixture,
): TypedReducerRegistry<SkillBenchmarkParityReplayState> {
  return new TypedReducerRegistry(SkillBenchmarkEventStems.map((stem) => ({
    eventType: SkillBenchmarkWireEventTypes[stem],
    reducerVersion: PARITY_REDUCER_VERSION,
    reduce: (state, event) => {
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as SkillBenchmarkLedgerEvent,
      );
      return replayState([
        ...history,
        event.effective.envelope as SkillBenchmarkLedgerEvent,
      ], fixture, path);
    },
  })));
}

function createComponentRegistry(
  context: ParityExecutionContext,
  path: 'legacy' | 'ledger',
  fixture: SkillBenchmarkParityFixture,
): ReplayComponentRegistry<SkillBenchmarkParityReplayState> {
  const bindReplayInputs = (
    replayInputs: Readonly<Record<string, JsonValue>>,
  ): TypedReducerRegistry<SkillBenchmarkParityReplayState> => {
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
    projectionSchemaVersion: SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state', SEALED_ARTIFACT_REPLAY_INPUT_KEY],
    reducerRegistry: bindReplayInputs(
      replayInputSources as unknown as Readonly<Record<string, JsonValue>>,
    ),
    replayInputSources,
    bindReplayInputs,
  }]);
}

function assertResumeLeaseContinuity(
  frozen: SkillBenchmarkFrozenParityInput,
  evidence: SkillBenchmarkResumeParityEvidence | null,
): void {
  if (evidence === null) return;
  for (const [name, decision] of [
    ['legacyDecision', parseSkillBenchmarkResumeDecision(evidence.legacyDecision)],
    ['ledgerDecision', parseSkillBenchmarkResumeDecision(evidence.ledgerDecision)],
  ] as const) {
    const mismatches = ['leaseId', 'runId', 'lineageId', 'generation', 'deadlineAt'].filter(
      (field) => decision.lease[field as keyof typeof decision.lease]
        !== frozen.budgetLease[field as keyof typeof frozen.budgetLease],
    );
    if (mismatches.length > 0) {
      throw new TypeError(`SKILL_BENCHMARK_RESUME_LEASE_CONTINUITY: ${name} ${mismatches.join(',')}`);
    }
  }
}

function validateFixtureShape(fixture: SkillBenchmarkParityFixture): void {
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
  frozen: SkillBenchmarkFrozenParityInput,
  fixture: SkillBenchmarkParityFixture,
  context: ParityExecutionContext,
  initialState: SkillBenchmarkParityReplayState,
): void {
  const keys = [
    'baseSha', 'runManifestDigest', 'scenarioManifestDigest',
    'treatmentMatrixDigest', 'taskSetDigest', 'skillBundleDigest', 'registryDigest',
    'executorDescriptorDigest', 'environmentDigest', 'toolDigest', 'permissionDigest',
    'dependencyDigest', 'goldSnapshotDigest', 'seedPolicyDigest',
    'evaluatorEpochDigest', 'scoringPolicyDigest', 'commonServiceContractDigest',
    'sealedArtifactContractDigest',
    'initialStateDigest', 'configurationDigest', 'budgetLease',
  ];
  if (!isRecord(frozen) || !hasExactKeys(frozen, keys)) {
    throw new TypeError('frozenInput must use the closed allowed-key set');
  }
  requireBaseSha(frozen.baseSha, 'frozenInput.baseSha');
  for (const field of keys.filter((entry) => entry.endsWith('Digest'))) {
    requireDigest(frozen[field as keyof SkillBenchmarkFrozenParityInput], `frozenInput.${field}`);
  }
  if (
    frozen.baseSha !== context.capsule.baseSha
    || frozen.initialStateDigest !== context.capsule.initialStateDigest
    || frozen.configurationDigest !== context.capsule.configurationDigest
    || frozen.initialStateDigest !== digest(initialState)
    || frozen.commonServiceContractDigest !== digest(SKILL_BENCHMARK_SHARED_PARITY_SERVICES)
    || frozen.sealedArtifactContractDigest !== digest(SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY)
  ) throw new TypeError('Executor fixture does not match its sealed parity capsule');
  if (!isRecord(frozen.budgetLease) || !hasExactKeys(frozen.budgetLease, [
    'leaseId', 'runId', 'lineageId', 'generation', 'maxIterations',
    'remainingIterations', 'deadlineAt',
  ])) throw new TypeError('frozenInput.budgetLease must use the closed allowed-key set');
  assertResumeLeaseContinuity(frozen, fixture.resumeEvidence);
}

async function projectThroughLegacyOracle(
  context: ParityExecutionContext,
  fixture: SkillBenchmarkParityFixture,
  ledger: AppendOnlyLedger,
  fingerprint: DerivedReplayFingerprint<SkillBenchmarkParityReplayState>,
  initialState: SkillBenchmarkParityReplayState,
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
    relativePath: 'improvement/skill-benchmark-parity-projection.json',
    format: 'json' as const,
    refreshBoundary: 'lifecycle' as const,
    foldId: 'legacy-improvement-derived-state-fold@1',
    reducerId: PARITY_REDUCER_ID,
    projectionVersion: SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
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
      SkillBenchmarkEventStems.map((stem) => [SkillBenchmarkWireEventTypes[stem], [1]]),
    ),
    reduce: (
      state: Readonly<SkillBenchmarkParityReplayState>,
      event: Readonly<VerifiedLedgerEvent['event']>,
    ): SkillBenchmarkParityReplayState => {
      const history = state.eventCanonicalJson.map(
        (entry) => JSON.parse(entry) as SkillBenchmarkLedgerEvent,
      );
      return replayState([
        ...history,
        event.effective.envelope as SkillBenchmarkLedgerEvent,
      ], fixture, 'legacy');
    },
    serialize: (state: Readonly<SkillBenchmarkParityReplayState>) => (
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
  fixture: SkillBenchmarkParityFixture,
  state: SkillBenchmarkParityReplayState,
) {
  const projection = replayProjection(state);
  context.effectSink.record({
    operation: 'skill-benchmark-shadow-observation',
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
      ...projection.outcomeEvidenceDigests,
      ...projection.scoreVectorDigests,
      ...projection.goldEvidenceDigests,
    ] as unknown as JsonValue,
    'reader-results': state.projectionFingerprint,
  });
}

function attestationEnvelope(path: 'legacy' | 'ledger') {
  return {
    eventId: `${path}-skill-benchmark-parity-attestation`,
    streamId: 'skill-benchmark-parity-attestations',
    streamSequence: 1,
    occurredAt: PARITY_TIMESTAMP,
    recordedAt: PARITY_TIMESTAMP,
    producer: { name: 'skill-benchmark-shadow-parity', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ path }).slice(0, 16)}`,
    causationId: null,
    idempotencyKey: `${path}-skill-benchmark-parity-attestation`,
  };
}

function createPathExecutor(
  path: 'legacy' | 'ledger',
  fixture: SkillBenchmarkParityFixture,
  fault: SkillBenchmarkParityFaultInjection | undefined,
  captured: SkillBenchmarkPathEvidence[],
): SkillBenchmarkParityExecutorPair['legacy'] {
  let ledgerTemplateRoot: string | null = null;
  return async (context): Promise<ParityPathExecution<SkillBenchmarkParityReplayState>> => {
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
        await appendAuthorizedThroughFence(ledger, prepared, proof);
      }
      ledgerTemplateRoot = resolve(context.executionRoot, '..', `${path}-ledger-template`);
      cpSync(ledgerRoot, ledgerTemplateRoot, { recursive: true, preserveTimestamps: true });
    }
    const versionRegistry = createReplayFingerprintVersionRegistry();
    const verification: VerifyReplayFingerprintInput<SkillBenchmarkParityReplayState> = {
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
        projectionSchemaVersion: SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
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

/** Create independent legacy-oracle and typed-ledger executors over the real substrate. */
export function createSkillBenchmarkParityExecutors(
  fixture: SkillBenchmarkParityFixture,
  fault?: SkillBenchmarkParityFaultInjection,
): SkillBenchmarkParityExecutorPair {
  verifySkillBenchmarkLifecycleEventMap();
  validateFixtureShape(fixture);
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  if (fixture.events.length === 0) throw new TypeError('Parity fixture must contain events');
  const captured: SkillBenchmarkPathEvidence[] = [];
  return Object.freeze({
    legacy: createPathExecutor('legacy', fixture, fault, captured),
    ledger: createPathExecutor('ledger', fixture, fault, captured),
    evidence: () => Object.freeze([...captured]),
    legacyOracleImplementation: 'modeled-legacy-oracle',
    ledgerImplementation: 'typed-ledger-pipeline',
    commonParityContractId: DEEP_IMPROVEMENT_COMMON_SHARED_PARITY_CONTRACT.contractId,
    substrateImportsReal: true,
  });
}

function caseContractDigest(fixture: SkillBenchmarkParityFixture): string {
  return digest({
    scenario: fixture.scenario,
    lifecycleMap: EventStages,
    comparatorVersion: SKILL_BENCHMARK_COMPARATOR_VERSION,
    projectionVersion: SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
    sharedParityServices: SKILL_BENCHMARK_SHARED_PARITY_SERVICES,
  });
}

export function createSkillBenchmarkParityCaseDefinition(
  fixture: SkillBenchmarkParityFixture,
): ParityCaseDefinition {
  requireToken(fixture.fixtureId, 'fixture.fixtureId');
  return Object.freeze({
    caseId: fixture.fixtureId,
    scenarioId: fixture.fixtureId,
    mode: 'skill-benchmark',
    contractDigest: caseContractDigest(fixture),
    requiredObservations: REQUIRED_OBSERVATIONS,
    projectionIds: [PARITY_ARTIFACT_ID],
    timeoutMs: 30_000,
    terminationPolicy: 'skill-benchmark-bounded-shadow',
  });
}

/** Compile the exact mode-specific fixture closure without cloning shared cases. */
export function compileSkillBenchmarkParityManifest(input: Readonly<{
  baseSha: string;
  fixtures: readonly SkillBenchmarkParityFixture[];
}>): ParityCaseManifest {
  requireBaseSha(input.baseSha, 'baseSha');
  const scenarios = input.fixtures.map((fixture) => fixture.scenario).sort();
  const expected = [...SKILL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS].sort();
  if (scenarios.length !== expected.length
    || new Set(scenarios).size !== expected.length
    || scenarios.some((entry, index) => entry !== expected[index])) {
    throw new TypeError('Skill Benchmark parity requires the exact fixture scenario closure');
  }
  const baselineRows: ParityBaselineRow[] = input.fixtures.map((fixture) => ({
    scenarioId: fixture.fixtureId,
    mode: 'skill-benchmark',
    contractDigest: caseContractDigest(fixture),
    disposition: 'protected',
  }));
  return compileParityCaseManifest({
    baseSha: input.baseSha,
    baselineRows,
    cases: input.fixtures.map(createSkillBenchmarkParityCaseDefinition),
  });
}

function requiredCaseIds(manifest: ParityCaseManifest): string[] {
  return manifest.cases.filter((entry) => entry.mode === 'skill-benchmark')
    .map((entry) => entry.caseId).sort();
}

function comparatorConfigDigest(): string {
  return digest({
    comparatorVersion: SKILL_BENCHMARK_COMPARATOR_VERSION,
    sharedComparatorVersion: DEEP_IMPROVEMENT_COMMON_COMPARATOR_VERSION,
    lifecycleMap: EventStages,
    volatilityAllowlist: SKILL_BENCHMARK_VOLATILITY_ALLOWLIST,
    diffClasses: DIFF_CLASSES,
  });
}

/** Verify the real mode certificate before binding it to parity evidence. */
export async function verifySkillBenchmarkParityModeCertificate(
  caseRun: SkillBenchmarkParityCaseRun,
  manifest: ParityCaseManifest,
): Promise<SkillBenchmarkModeCertificateBinding | null> {
  const verification = await verifySkillBenchmarkCertificateOffline(
    caseRun.modeCertificateVerification.input,
  );
  if (verification.verdict !== 'valid') return null;
  const bundle = parseSkillBenchmarkCertificateBundle(
    caseRun.modeCertificateVerification.input.bundle,
  );
  const body = {
    bundle,
    certificateDigest: bundle.certificate.certificateDigest,
    verificationReceipt: verification.verificationReceipt,
    manifestDigest: manifest.manifestDigest,
    comparatorVersion: SKILL_BENCHMARK_COMPARATOR_VERSION,
    caseSetDigest: digest(requiredCaseIds(manifest)),
  };
  return Object.freeze({ ...body, bindingDigest: digest(body) });
}

function pathEvidence(executors: SkillBenchmarkParityExecutorPair, path: 'legacy' | 'ledger') {
  const evidence = executors.evidence().filter((entry) => entry.path === path);
  if (evidence.length === 0) return Object.freeze({
    streamDigest: digest({ missing: path }),
    projectionFingerprint: digest({ missingProjection: path }),
    observations: Object.freeze([]) as readonly SkillBenchmarkParityEventObservation[],
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
  fixture: SkillBenchmarkParityFixture,
  result: ShadowParityCaseResult,
  executors: SkillBenchmarkParityExecutorPair,
): SkillBenchmarkParityCertificateEvidenceBinding | null {
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
  evidence: readonly SkillBenchmarkParityCertificateEvidenceBinding[],
  modeBinding: SkillBenchmarkModeCertificateBinding | null,
): ParityCertificateBindings {
  return Object.freeze({
    candidate_build_digest: digest({
      manifest: manifest.manifestDigest,
      modeCertificate: modeBinding?.certificateDigest ?? null,
    }),
    harness_digest: digest({
      legacy: 'modeled-skill-benchmark-emitter',
      ledger: 'runtime/lib/skill-benchmark-reducers',
      sealedArtifacts: 'runtime/lib/skill-benchmark-sealed-artifacts',
      common: SKILL_BENCHMARK_SHARED_PARITY_SERVICES,
      certificate: 'runtime/lib/skill-benchmark-certificates',
      resume: 'runtime/lib/skill-benchmark-resume-adapter',
    }),
    comparator_digest: comparatorConfigDigest(),
    replay_contract_digest: digest({
      reducerId: PARITY_REDUCER_ID,
      reducerVersion: PARITY_REDUCER_VERSION,
      projectionVersion: SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
    }),
    reducer_digest: digest({ version: SKILL_BENCHMARK_REDUCER_VERSION }),
    projection_digest: digest({ version: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION }),
    adapter_digest: digest({
      lifecycleMap: EventStages,
      evidence,
      modeBinding: modeBinding?.bindingDigest ?? null,
    }),
    policy_version: 'skill-benchmark-shadow-only@1',
  });
}

function receiptBody(
  manifest: ParityCaseManifest,
  fixture: SkillBenchmarkParityFixture,
  result: ShadowParityCaseResult,
  executors: SkillBenchmarkParityExecutorPair,
  parityCertificate: SkillBenchmarkParityReceipt['parityCertificate'],
  evidence: readonly SkillBenchmarkParityCertificateEvidenceBinding[],
  modeBinding: SkillBenchmarkModeCertificateBinding | null,
  refusalCode: SkillBenchmarkParityReceipt['certificateRefusalCode'],
): Omit<SkillBenchmarkParityReceipt, 'receiptDigest'> {
  const legacy = pathEvidence(executors, 'legacy');
  const ledger = pathEvidence(executors, 'ledger');
  const diffs = compareSkillBenchmarkEventStreams(
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
    schemaVersion: SKILL_BENCHMARK_SHADOW_PARITY_SCHEMA_VERSION,
    receiptId: `skill-benchmark-parity-${fixture.fixtureId}`,
    baseSha: manifest.baseSha,
    runManifestDigest: manifest.manifestDigest,
    eventSchemaVersion: `skill-benchmark-event@${SKILL_BENCHMARK_EVENT_VERSION}`,
    reducerVersion: SKILL_BENCHMARK_REDUCER_VERSION,
    comparatorVersion: SKILL_BENCHMARK_COMPARATOR_VERSION,
    projectionVersion: SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
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
): SkillBenchmarkModeCertificateBinding {
  if (!isRecord(input) || !hasExactKeys(input, [
    'bundle', 'certificateDigest', 'verificationReceipt', 'manifestDigest',
    'comparatorVersion', 'caseSetDigest', 'bindingDigest',
  ])) throw new TypeError('modeCertificateBinding must use the closed binding shape');
  const bundle = parseSkillBenchmarkCertificateBundle(input.bundle);
  const verificationReceipt = input.verificationReceipt as SkillBenchmarkOfflineVerifierReceipt;
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
    || input.comparatorVersion !== SKILL_BENCHMARK_COMPARATOR_VERSION
    || input.caseSetDigest !== digest(requiredCaseIds(manifest))
    || input.bindingDigest !== digest(body)
  ) throw new TypeError('modeCertificateBinding does not match trusted parity inputs');
  return Object.freeze({
    ...body,
    bindingDigest: String(input.bindingDigest),
  }) as SkillBenchmarkModeCertificateBinding;
}

function parseEmbeddedParityCertificate(
  input: unknown,
): NonNullable<SkillBenchmarkParityReceipt['parityCertificate']> {
  if (!isRecord(input) || !hasExactKeys(input, [
    'schema_version', 'mode', 'base_sha', 'manifest_digest', 'case_ids',
    'case_evidence_digests', 'reference_set_digests', 'attestation_final_digests',
    'bindings', 'identity_registry', 'evidence_digest', 'open_divergence_count',
    'authority_state', 'authority_mutation', 'rollback_minimum_days',
    'rollback_minimum_successful_runs', 'certificate_digest',
  ])) throw new TypeError('parityCertificate must use the closed certificate shape');
  return parseParityCertificateIdentityRegistry(input) as NonNullable<
    SkillBenchmarkParityReceipt['parityCertificate']
  >;
}

function verifyGenericCertificate(
  receipt: SkillBenchmarkParityReceipt,
  manifest: ParityCaseManifest,
): void {
  if (receipt.certificateStatus === 'refused') return;
  const evidence = receipt.certificateEvidenceBindings;
  const bindings = certificateBindings(manifest, evidence, receipt.modeCertificateBinding);
  const verification = verifyParityCertificate(receipt.parityCertificate, {
    manifest,
    mode: 'skill-benchmark',
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
export function parseSkillBenchmarkParityReceipt(
  input: unknown,
  manifest: ParityCaseManifest,
): SkillBenchmarkParityReceipt {
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
    if (!DIFF_CLASSES.includes(entry.class as SkillBenchmarkParityDiffClass)) {
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
    return Object.freeze(entry as unknown as SkillBenchmarkParityDiffRecord);
  });
  if (!Array.isArray(input.certificateEvidenceBindings)) {
    throw new TypeError('certificateEvidenceBindings must be an array');
  }
  const modeBinding = input.modeCertificateBinding === null
    ? null : parseModeBinding(input.modeCertificateBinding, manifest);
  const parityCertificate = input.parityCertificate === null
    ? null
    : parseEmbeddedParityCertificate(input.parityCertificate);
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
    && parityCertificate !== null
    && input.parityCertificateDigest !== null
    && modeBinding !== null
    && input.certificateEvidenceBindings.length > 0
    && input.certificateRefusalCode === null;
  const refused = input.certificateStatus === 'refused'
    && parityCertificate === null
    && input.parityCertificateDigest === null
    && modeBinding === null
    && input.certificateEvidenceBindings.length === 0
    && input.certificateRefusalCode !== null;
  if (!issued && !refused) throw new TypeError('Parity receipt certificate evidence contradicts its status');
  const { receiptDigest, ...body } = input;
  if (digest(body) !== receiptDigest) throw new TypeError('Parity receipt digest does not commit its body');
  const receipt = Object.freeze({
    ...(input as unknown as SkillBenchmarkParityReceipt),
    diffDispositions: Object.freeze(diffs),
    modeCertificateBinding: modeBinding,
    parityCertificate,
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
  fixture: SkillBenchmarkParityFixture,
  result: ShadowParityCaseResult,
  executors: SkillBenchmarkParityExecutorPair,
  certificate: SkillBenchmarkParityReceipt['parityCertificate'],
  evidence: readonly SkillBenchmarkParityCertificateEvidenceBinding[],
  modeBinding: SkillBenchmarkModeCertificateBinding | null,
  refusalCode: SkillBenchmarkParityReceipt['certificateRefusalCode'],
): SkillBenchmarkParityReceipt {
  const body = receiptBody(
    manifest, fixture, result, executors, certificate, evidence, modeBinding, refusalCode,
  );
  return parseSkillBenchmarkParityReceipt(
    Object.freeze({ ...body, receiptDigest: digest(body) }),
    manifest,
  );
}

function modeGateBody(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): Omit<SkillBenchmarkModeGateInput, 'gateInputDigest'> {
  const expected = sortedUnique(input.expectedFixtureIds);
  const required = requiredCaseIds(input.manifest);
  let malformed = false;
  let stale = false;
  const parsed: SkillBenchmarkParityReceipt[] = [];
  for (const candidate of input.receipts) {
    try {
      parsed.push(parseSkillBenchmarkParityReceipt(candidate, input.manifest));
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
  let blockingReasonCode: SkillBenchmarkModeGateBlockReasonCode | null = null;
  if (expected.length === 0) blockingReasonCode = 'ZERO_FIXTURES';
  else if (stale) blockingReasonCode = 'RECEIPT_STALE';
  else if (malformed) blockingReasonCode = 'RECEIPT_MALFORMED';
  else if (!allReceiptsPresent) blockingReasonCode = 'MISSING_RECEIPT';
  else if (certificateFailure) blockingReasonCode = 'CERTIFICATE_UNVERIFIABLE';
  else if (nondeterministic) blockingReasonCode = 'NONDETERMINISTIC_REPLAY';
  else if (unexplained) blockingReasonCode = 'DIFF_UNEXPLAINED';
  else if (fixtureFailure) blockingReasonCode = 'FIXTURE_FAILURE';
  return Object.freeze({
    schemaVersion: SKILL_BENCHMARK_MODE_GATE_INPUT_VERSION,
    mode: 'skill-benchmark',
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
export function createSkillBenchmarkModeGateInput(input: Readonly<{
  manifest: ParityCaseManifest;
  expectedFixtureIds: readonly string[];
  receipts: readonly unknown[];
}>): SkillBenchmarkModeGateInput {
  const body = modeGateBody(input);
  return parseSkillBenchmarkModeGateInput(Object.freeze({
    ...body,
    gateInputDigest: digest(body),
  }));
}

/** Parse a closed handoff that cannot authorize rollback or cutover. */
export function parseSkillBenchmarkModeGateInput(input: unknown): SkillBenchmarkModeGateInput {
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
  if (input.mode !== 'skill-benchmark'
    || input.authorityState !== 'legacy-authoritative'
    || input.authorityMutation !== false
    || input.rollbackReadinessAuthorized !== false
    || input.cutoverAuthorized !== false) {
    throw new TypeError('Mode-gate input cannot carry authority');
  }
  if (!Array.isArray(input.fixtureIds) || !Array.isArray(input.parityReceiptDigests)) {
    throw new TypeError('Mode-gate identities must be arrays');
  }
  const reasonCodes: readonly SkillBenchmarkModeGateBlockReasonCode[] = [
    'CERTIFICATE_UNVERIFIABLE', 'DIFF_UNEXPLAINED', 'FIXTURE_FAILURE',
    'MISSING_RECEIPT', 'NONDETERMINISTIC_REPLAY', 'RECEIPT_MALFORMED',
    'RECEIPT_STALE', 'ZERO_FIXTURES',
  ];
  if (input.blockingReasonCode !== null
    && !reasonCodes.includes(input.blockingReasonCode as SkillBenchmarkModeGateBlockReasonCode)) {
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
  return Object.freeze(input as unknown as SkillBenchmarkModeGateInput);
}

async function runCase(caseRun: SkillBenchmarkParityCaseRun): Promise<ShadowParityCaseResult> {
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

export async function runSkillBenchmarkParityCase(input: Readonly<{
  manifest: ParityCaseManifest;
  caseRun: SkillBenchmarkParityCaseRun;
}>): Promise<SkillBenchmarkParityCaseOutcome> {
  const result = await runCase(input.caseRun);
  const modeBinding = await verifySkillBenchmarkParityModeCertificate(
    input.caseRun,
    input.manifest,
  );
  const binding = evidenceBinding(input.caseRun.fixture, result, input.caseRun.executors);
  const evidence = binding === null ? Object.freeze([]) : Object.freeze([binding]);
  const bindings = certificateBindings(input.manifest, evidence, modeBinding);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'skill-benchmark',
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

export async function runSkillBenchmarkParitySuite(input: Readonly<{
  manifest: ParityCaseManifest;
  cases: readonly SkillBenchmarkParityCaseRun[];
}>): Promise<SkillBenchmarkParitySuiteResult> {
  const manifestIds = requiredCaseIds(input.manifest);
  const runIds = input.cases.map((entry) => entry.caseDefinition.caseId).sort();
  if (manifestIds.length === 0 || digest(manifestIds) !== digest(runIds)) {
    throw new TypeError('Parity suite cases must equal the manifest mode closure');
  }
  const caseResults: ShadowParityCaseResult[] = [];
  const modeBindings: Array<SkillBenchmarkModeCertificateBinding | null> = [];
  for (const caseRun of input.cases) {
    caseResults.push(await runCase(caseRun));
    modeBindings.push(await verifySkillBenchmarkParityModeCertificate(caseRun, input.manifest));
  }
  const evidence = Object.freeze(input.cases.flatMap((caseRun, index) => {
    const binding = evidenceBinding(caseRun.fixture, caseResults[index], caseRun.executors);
    return binding === null ? [] : [binding];
  }).sort((left, right) => left.fixtureId.localeCompare(right.fixtureId)));
  const modeBinding = modeBindings.every((entry) => entry !== null) ? modeBindings[0] : null;
  const bindings = certificateBindings(input.manifest, evidence, modeBinding);
  const issuance = issueParityCertificate({
    manifest: input.manifest,
    mode: 'skill-benchmark',
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
  const modeGateInput = createSkillBenchmarkModeGateInput({
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
export function createSkillBenchmarkLegacyResumeOracle(
  snapshot: SkillBenchmarkLegacyResumeSnapshot,
): SkillBenchmarkLegacyResumeOracle {
  if (snapshot.events.length === 0) throw new TypeError('Legacy resume oracle requires events');
  const tail = snapshot.events.at(-1) as SkillBenchmarkLedgerEvent;
  return Object.freeze({
    async resume(input: SkillBenchmarkResumeRequest) {
      const request = parseSkillBenchmarkResumeRequest(input);
      if (
        request.runId !== snapshot.freshProjection.runId
        || request.lease.runId !== request.runId
        || request.lease.lineageId !== snapshot.freshProjection.lineageId
        || request.lease.generation !== snapshot.freshProjection.generation
      ) throw new TypeError('Legacy continuation identity does not match the persisted lease');
      return Object.freeze({
        decision: parseSkillBenchmarkResumeDecision(snapshot.decision),
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

export class SkillBenchmarkResumeParityDivergenceError extends Error {
  public readonly code = 'SKILL_BENCHMARK_RESUME_PARITY_DIVERGENCE' as const;
  public readonly dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[];

  public constructor(dimensions: readonly ('decision' | 'event-tail' | 'fresh-projection')[]) {
    super(`Resume parity diverged across: ${dimensions.join(', ')}`);
    this.name = 'SkillBenchmarkResumeParityDivergenceError';
    this.dimensions = Object.freeze([...dimensions]);
  }
}

/** Compare the distinct legacy oracle with the landed real resume adapter. */
export async function driveSkillBenchmarkResumeParity(input: Readonly<{
  legacyOracle: SkillBenchmarkLegacyResumeOracle;
  ledgerAdapter: SkillBenchmarkResumeAdapter;
  request: SkillBenchmarkResumeRequest;
}>): Promise<SkillBenchmarkResumeParityEvidence> {
  if (typeof input.legacyOracle?.resume !== 'function'
    || !(input.ledgerAdapter instanceof SkillBenchmarkResumeAdapter)) {
    throw new TypeError('Resume parity requires distinct legacy and real ledger adapters');
  }
  const request = parseSkillBenchmarkResumeRequest(input.request);
  const [legacy, ledger] = await Promise.all([
    input.legacyOracle.resume(request),
    input.ledgerAdapter.resume(request),
  ]);
  const legacyDecision = parseSkillBenchmarkResumeDecision(legacy.decision);
  const ledgerDecision = parseSkillBenchmarkResumeDecision(ledger.decision);
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
  if (dimensions.length > 0) throw new SkillBenchmarkResumeParityDivergenceError(dimensions);
  return Object.freeze({
    legacyDecision,
    ledgerDecision,
    legacyEventTailDigest,
    ledgerEventTailDigest,
    legacyFreshProjectionFingerprint,
    ledgerFreshProjectionFingerprint,
  });
}

void SKILL_BENCHMARK_ARTIFACT_KIND_REGISTRY;
void (null as SkillBenchmarkCertificateBundle | null);
