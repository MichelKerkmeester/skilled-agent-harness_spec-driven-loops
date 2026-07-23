// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Ledger Types
// ───────────────────────────────────────────────────────────────────

import {
  DeepImprovementCommonEventStems,
  DeepImprovementCommonWireEventTypes,
} from '../deep-improvement-common-ledger-schema/index.js';

import type {
  DeepImprovementCommonBaseScope,
  DeepImprovementCommonCompatibilityStatus,
  DeepImprovementCommonPayloadMap,
  DeepImprovementCommonReplayMetadata,
  DeepImprovementCommonScopeMap,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';

export type Digest = string;
export type Fingerprint = string;
export type Version = string;
export type Uint32 = number;

export interface SkillBenchmarkBaseScope
  extends DeepImprovementCommonBaseScope {
  readonly variant: 'skill-benchmark';
}

export interface SkillBenchmarkDesignScope extends SkillBenchmarkBaseScope {
  readonly benchmarkDesignId: string;
}

export interface SkillBenchmarkTreatmentScope
  extends SkillBenchmarkDesignScope {
  readonly scenarioId: string;
  readonly assignmentId: string;
}

export interface SkillBenchmarkScenarioScope
  extends SkillBenchmarkTreatmentScope {
  readonly executionId: string;
}

export interface SkillBenchmarkSkillScope
  extends SkillBenchmarkScenarioScope {
  readonly skillBundleId: string;
}

export interface SkillBenchmarkResourceScope
  extends SkillBenchmarkSkillScope {
  readonly resourceId: string;
}

export interface SkillBenchmarkMilestoneScope
  extends SkillBenchmarkScenarioScope {
  readonly milestoneId: string;
}

export interface SkillBenchmarkObservationScope
  extends SkillBenchmarkScenarioScope {
  readonly observationId: string;
}

export interface SkillBenchmarkCertificateScope
  extends SkillBenchmarkBaseScope {
  readonly certificateId: string;
}

export type SkillBenchmarkReplayMetadata =
  DeepImprovementCommonReplayMetadata;

export interface RawScoreAxis extends JsonObject {
  readonly dimensionCode: string;
  readonly rawScore: number;
  readonly measurementRef: string;
  readonly measurementDigest: Digest;
}

export interface CertificateValidityDomain extends JsonObject {
  readonly taskSetDigest: Digest;
  readonly skillBundleDigest: Digest;
  readonly registryDigest: Digest;
  readonly executorDigest: Digest;
  readonly environmentDigest: Digest;
  readonly dependencyDigest: Digest;
  readonly workloadDigest: Digest;
  readonly validityPolicyVersion: Version;
}

export interface RunPlannedData extends JsonObject {
  readonly designRef: string;
  readonly designDigest: Digest;
  readonly taskSetRef: string;
  readonly taskSetDigest: Digest;
  readonly skillBundleRef: string;
  readonly skillBundleDigest: Digest;
  readonly registryDigest: Digest;
  readonly executorDescriptorRef: string;
  readonly executorDescriptorDigest: Digest;
  readonly environmentDigest: Digest;
  readonly dependencyDigest: Digest;
  readonly workloadDigest: Digest;
  readonly randomizationSeed: Uint32;
  readonly replicateCount: Uint32;
  readonly designPolicyVersion: Version;
}

export interface TreatmentAssignedData extends JsonObject {
  readonly designEventId: string;
  readonly designPayloadDigest: Digest;
  readonly treatmentArm:
    | 'auto-route'
    | 'compatibility-boundary'
    | 'component-ablation'
    | 'control'
    | 'distractor'
    | 'forced-activation'
    | 'no-skill'
    | 'placebo';
  readonly randomizationSeed: Uint32;
  readonly propensity: number;
  readonly replicateIndex: Uint32;
  readonly pairedReplicateId: string;
  readonly designCellId: string;
  readonly taskRef: string;
  readonly taskDigest: Digest;
  readonly skillBundleRef: string;
  readonly skillBundleDigest: Digest;
  readonly executorDescriptorRef: string;
  readonly executorDescriptorDigest: Digest;
  readonly environmentDigest: Digest;
  readonly assignmentReceiptRef: string;
}

export interface RunClosedData extends JsonObject {
  readonly designEventId: string;
  readonly scenarioTerminalEventIds: string[];
  readonly terminalStatus: 'aborted' | 'closed' | 'incomplete';
  readonly accountingRef: string;
  readonly accountingDigest: Digest;
  readonly closedAt: string;
}

export interface ScenarioStartedData extends JsonObject {
  readonly assignmentEventId: string;
  readonly assignmentPayloadDigest: Digest;
  readonly taskRef: string;
  readonly taskDigest: Digest;
  readonly environmentRef: string;
  readonly environmentDigest: Digest;
  readonly executorDescriptorRef: string;
  readonly executorDescriptorDigest: Digest;
  readonly toolDigest: Digest;
  readonly permissionDigest: Digest;
  readonly dependencyDigest: Digest;
  readonly workloadDigest: Digest;
  readonly executionReceiptRef: string;
  readonly startedAt: string;
}

export interface ScenarioFinishedData extends JsonObject {
  readonly startedEventId: string;
  readonly startedPayloadDigest: Digest;
  readonly outcomeRef: string;
  readonly outcomeDigest: Digest;
  readonly finalStateDigest: Digest;
  readonly executionReceiptRef: string;
  readonly terminalOutcome: 'error' | 'fail' | 'pass' | 'timeout';
  readonly finishedAt: string;
}

export interface ScenarioAbortedData extends JsonObject {
  readonly startedEventId: string;
  readonly startedPayloadDigest: Digest;
  readonly abortReasonCode: string;
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
  readonly executionReceiptRef: string;
  readonly retryable: boolean;
  readonly abortedAt: string;
}

export interface SkillDiscoveredData extends JsonObject {
  readonly scenarioStartedEventId: string;
  readonly skillBundleRef: string;
  readonly skillBundleDigest: Digest;
  readonly registryDigest: Digest;
  readonly discoveryMethod: 'auto-route' | 'forced' | 'registry-query';
  readonly availabilityStatus: 'available' | 'missing' | 'not-applicable';
  readonly discoveryEvidenceRef: string;
  readonly discoveryEvidenceDigest: Digest;
}

export interface SkillLoadedData extends JsonObject {
  readonly discoveredEventId: string;
  readonly discoveredPayloadDigest: Digest;
  readonly disclosureStage: 'full' | 'instructions' | 'metadata' | 'resources';
  readonly skillBundleRef: string;
  readonly skillBundleDigest: Digest;
  readonly loadedResourceClasses: string[];
  readonly loaderReceiptRef: string;
  readonly loadStatus: 'failed' | 'loaded' | 'partial';
}

export interface SkillInvokedData extends JsonObject {
  readonly loadedEventId: string;
  readonly loadedPayloadDigest: Digest;
  readonly invocationMode: 'auto' | 'explicit' | 'forced';
  readonly activationRef: string;
  readonly activationDigest: Digest;
  readonly invocationReceiptRef: string;
  readonly invocationStatus: 'failed' | 'invoked' | 'not-invoked';
  readonly failureReasonCode: string | null;
}

export interface ResourceExposedData extends JsonObject {
  readonly skillLoadedEventId: string;
  readonly resourceRef: string;
  readonly resourceDigest: Digest;
  readonly resourceClass: 'asset' | 'instruction' | 'reference' | 'script' | 'template';
  readonly exposureStage: 'full' | 'instructions' | 'metadata' | 'resources';
  readonly canaryRef: string;
  readonly canaryDigest: Digest;
  readonly exposureReceiptRef: string;
  readonly canaryStatus: 'clean' | 'not-applicable' | 'triggered';
}

export interface MilestoneObservedData extends JsonObject {
  readonly scenarioStartedEventId: string;
  readonly milestoneCode: string;
  readonly ordinal: Uint32;
  readonly milestoneState: 'failed' | 'reached' | 'skipped';
  readonly observationRef: string;
  readonly observationDigest: Digest;
  readonly complianceStatus: 'compliant' | 'noncompliant' | 'unknown';
}

export interface TrajectoryRecordedData extends JsonObject {
  readonly scenarioStartedEventId: string;
  readonly milestoneEventIds: string[];
  readonly orderedKeyPointCodes: string[];
  readonly intermediateStateDigest: Digest;
  readonly traceRef: string;
  readonly traceDigest: Digest;
  readonly complianceObservationRef: string;
  readonly complianceObservationDigest: Digest;
}

export interface OutcomeRecordedData extends JsonObject {
  readonly scenarioTerminalEventId: string;
  readonly finalStateRef: string;
  readonly finalStateDigest: Digest;
  readonly deterministicCheckSetRef: string;
  readonly deterministicCheckSetDigest: Digest;
  readonly dynamicReferenceSetRef: string;
  readonly dynamicReferenceSetDigest: Digest;
  readonly constraintCoverageRef: string;
  readonly constraintCoverageDigest: Digest;
  readonly outcomeStatus: 'error' | 'fail' | 'inconclusive' | 'pass';
}

export interface ScoreObservedData extends JsonObject {
  readonly outcomeEventId: string;
  readonly evaluatorRef: string;
  readonly evaluatorVersion: Version;
  readonly evaluatorFingerprint: Fingerprint;
  readonly deterministicResultsRef: string;
  readonly deterministicResultsDigest: Digest;
  readonly dynamicReferenceResultsRef: string;
  readonly dynamicReferenceResultsDigest: Digest;
  readonly rawScoreAxes: RawScoreAxis[];
  readonly constraintCoverageRef: string;
  readonly constraintCoverageDigest: Digest;
  readonly tokenCount: Uint32;
  readonly latencyMs: Uint32;
  readonly costMicrounits: Uint32;
  readonly workloadDigest: Digest;
  readonly goldIntegrityEventId: string;
  readonly goldIntegrityPayloadDigest: Digest;
  readonly goldPolicy: 'negative' | 'pending' | 'scored' | 'structural-only';
  readonly numeratorEligible: boolean;
  readonly scoreWriteBackendRef: 'backend:deep-improvement-score';
}

export interface GoldIntegrityRecordedData extends JsonObject {
  readonly goldRef: string;
  readonly goldDigest: Digest;
  readonly goldPolicy: 'negative' | 'pending' | 'scored' | 'structural-only';
  readonly provenanceRef: string;
  readonly provenanceDigest: Digest;
  readonly coverageRatio: number;
  readonly integrityStatus: 'accepted' | 'blocked' | 'pending';
  readonly reasonCode: string;
  readonly evaluatorRef: string;
  readonly evaluatorFingerprint: Fingerprint;
}

export interface CompatibilityObservedData extends JsonObject {
  readonly scenarioStartedEventId: string;
  readonly taskDigest: Digest;
  readonly skillBundleDigest: Digest;
  readonly registryDigest: Digest;
  readonly executorDigest: Digest;
  readonly toolDigest: Digest;
  readonly permissionDigest: Digest;
  readonly environmentDigest: Digest;
  readonly dependencyDigest: Digest;
  readonly workloadDigest: Digest;
  readonly compatibilityStatus: 'compatible' | 'incompatible' | 'unknown';
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
}

export interface NegativeTransferObservedData extends JsonObject {
  readonly baselineAssignmentEventId: string;
  readonly treatedAssignmentEventId: string;
  readonly baselineOutcomeEventId: string;
  readonly treatedOutcomeEventId: string;
  readonly axisCode: string;
  readonly rawDelta: number;
  readonly transferStatus: 'inconclusive' | 'negative-transfer' | 'no-negative-transfer';
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
}

export interface SecurityProbeRecordedData extends JsonObject {
  readonly scenarioStartedEventId: string;
  readonly probeRef: string;
  readonly probeDigest: Digest;
  readonly compositionPathDigest: Digest;
  readonly probeOutcome: 'fail' | 'inconclusive' | 'pass';
  readonly evidenceRef: string;
  readonly evidenceDigest: Digest;
  readonly refusalObserved: boolean;
  readonly policyVersion: Version;
}

export interface EffectCertificateIssuedData extends JsonObject {
  readonly normalizedScoreEventRef: string;
  readonly normalizedScorePayloadDigest: Digest;
  readonly goldIntegrityEventId: string;
  readonly evidenceEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly validityDomain: CertificateValidityDomain;
  readonly confidenceIntervalRef: string;
  readonly confidenceIntervalDigest: Digest;
  readonly componentAblationEventIds: string[];
  readonly compatibilityEventIds: string[];
  readonly issueReceiptRef: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
}

export interface EffectCertificateWithheldData extends JsonObject {
  readonly normalizedScoreEventRef: string | null;
  readonly evidenceEventIds: string[];
  readonly evidenceSetDigest: Digest;
  readonly validityDomain: CertificateValidityDomain;
  readonly withholdingReasonCode: string;
  readonly decisionReceiptRef: string;
  readonly withheldAt: string;
}

export interface EffectCertificateExpiredData extends JsonObject {
  readonly issuedEventId: string;
  readonly issuedPayloadDigest: Digest;
  readonly expiryTrigger:
    | 'bundle-drift'
    | 'dependency-drift'
    | 'environment-drift'
    | 'evaluator-drift'
    | 'registry-drift'
    | 'time-limit'
    | 'workload-drift';
  readonly triggerEvidenceRef: string;
  readonly triggerEvidenceDigest: Digest;
  readonly expiredAt: string;
}

export const SkillBenchmarkSpecificEventStems = Object.freeze([
  'skill_benchmark.run_planned',
  'skill_benchmark.treatment_assigned',
  'skill_benchmark.run_closed',
  'skill_benchmark.scenario_started',
  'skill_benchmark.scenario_finished',
  'skill_benchmark.scenario_aborted',
  'skill_benchmark.skill_discovered',
  'skill_benchmark.skill_loaded',
  'skill_benchmark.skill_invoked',
  'skill_benchmark.resource_exposed',
  'skill_benchmark.milestone_observed',
  'skill_benchmark.trajectory_recorded',
  'skill_benchmark.outcome_recorded',
  'skill_benchmark.score_observed',
  'skill_benchmark.gold_integrity_recorded',
  'skill_benchmark.compatibility_observed',
  'skill_benchmark.negative_transfer_observed',
  'skill_benchmark.security_probe_recorded',
  'skill_benchmark.effect_certificate_issued',
  'skill_benchmark.effect_certificate_withheld',
  'skill_benchmark.effect_certificate_expired',
] as const);

export type SkillBenchmarkSpecificEventStem =
  typeof SkillBenchmarkSpecificEventStems[number];

export const SkillBenchmarkSpecificWireEventTypes = Object.freeze({
  'skill_benchmark.run_planned': 'skill-benchmark.ledger.run-planned',
  'skill_benchmark.treatment_assigned': 'skill-benchmark.ledger.treatment-assigned',
  'skill_benchmark.run_closed': 'skill-benchmark.ledger.run-closed',
  'skill_benchmark.scenario_started': 'skill-benchmark.ledger.scenario-started',
  'skill_benchmark.scenario_finished': 'skill-benchmark.ledger.scenario-finished',
  'skill_benchmark.scenario_aborted': 'skill-benchmark.ledger.scenario-aborted',
  'skill_benchmark.skill_discovered': 'skill-benchmark.ledger.skill-discovered',
  'skill_benchmark.skill_loaded': 'skill-benchmark.ledger.skill-loaded',
  'skill_benchmark.skill_invoked': 'skill-benchmark.ledger.skill-invoked',
  'skill_benchmark.resource_exposed': 'skill-benchmark.ledger.resource-exposed',
  'skill_benchmark.milestone_observed': 'skill-benchmark.ledger.milestone-observed',
  'skill_benchmark.trajectory_recorded': 'skill-benchmark.ledger.trajectory-recorded',
  'skill_benchmark.outcome_recorded': 'skill-benchmark.ledger.outcome-recorded',
  'skill_benchmark.score_observed': 'skill-benchmark.ledger.score-observed',
  'skill_benchmark.gold_integrity_recorded':
    'skill-benchmark.ledger.gold-integrity-recorded',
  'skill_benchmark.compatibility_observed':
    'skill-benchmark.ledger.compatibility-observed',
  'skill_benchmark.negative_transfer_observed':
    'skill-benchmark.ledger.negative-transfer-observed',
  'skill_benchmark.security_probe_recorded':
    'skill-benchmark.ledger.security-probe-recorded',
  'skill_benchmark.effect_certificate_issued':
    'skill-benchmark.ledger.effect-certificate-issued',
  'skill_benchmark.effect_certificate_withheld':
    'skill-benchmark.ledger.effect-certificate-withheld',
  'skill_benchmark.effect_certificate_expired':
    'skill-benchmark.ledger.effect-certificate-expired',
} as const satisfies Readonly<
  Record<SkillBenchmarkSpecificEventStem, string>
>);

export const SkillBenchmarkEventStems = Object.freeze([
  ...DeepImprovementCommonEventStems,
  ...SkillBenchmarkSpecificEventStems,
] as const);

export const SKILL_BENCHMARK_EVENT_STEMS = SkillBenchmarkEventStems;

export type SkillBenchmarkEventStem =
  typeof SkillBenchmarkEventStems[number];

export const SkillBenchmarkWireEventTypes = Object.freeze({
  ...DeepImprovementCommonWireEventTypes,
  ...SkillBenchmarkSpecificWireEventTypes,
} as const satisfies Readonly<Record<SkillBenchmarkEventStem, string>>);

export const SKILL_BENCHMARK_WIRE_EVENT_TYPES =
  SkillBenchmarkWireEventTypes;

export type SkillBenchmarkWireEventType =
  typeof SkillBenchmarkWireEventTypes[SkillBenchmarkEventStem];

export interface SkillBenchmarkSpecificPayloadMap {
  readonly 'skill_benchmark.run_planned': RunPlannedData;
  readonly 'skill_benchmark.treatment_assigned': TreatmentAssignedData;
  readonly 'skill_benchmark.run_closed': RunClosedData;
  readonly 'skill_benchmark.scenario_started': ScenarioStartedData;
  readonly 'skill_benchmark.scenario_finished': ScenarioFinishedData;
  readonly 'skill_benchmark.scenario_aborted': ScenarioAbortedData;
  readonly 'skill_benchmark.skill_discovered': SkillDiscoveredData;
  readonly 'skill_benchmark.skill_loaded': SkillLoadedData;
  readonly 'skill_benchmark.skill_invoked': SkillInvokedData;
  readonly 'skill_benchmark.resource_exposed': ResourceExposedData;
  readonly 'skill_benchmark.milestone_observed': MilestoneObservedData;
  readonly 'skill_benchmark.trajectory_recorded': TrajectoryRecordedData;
  readonly 'skill_benchmark.outcome_recorded': OutcomeRecordedData;
  readonly 'skill_benchmark.score_observed': ScoreObservedData;
  readonly 'skill_benchmark.gold_integrity_recorded': GoldIntegrityRecordedData;
  readonly 'skill_benchmark.compatibility_observed': CompatibilityObservedData;
  readonly 'skill_benchmark.negative_transfer_observed':
    NegativeTransferObservedData;
  readonly 'skill_benchmark.security_probe_recorded': SecurityProbeRecordedData;
  readonly 'skill_benchmark.effect_certificate_issued':
    EffectCertificateIssuedData;
  readonly 'skill_benchmark.effect_certificate_withheld':
    EffectCertificateWithheldData;
  readonly 'skill_benchmark.effect_certificate_expired':
    EffectCertificateExpiredData;
}

export interface SkillBenchmarkPayloadMap
  extends DeepImprovementCommonPayloadMap,
  SkillBenchmarkSpecificPayloadMap {}

export interface SkillBenchmarkSpecificScopeMap {
  readonly 'skill_benchmark.run_planned': SkillBenchmarkDesignScope;
  readonly 'skill_benchmark.treatment_assigned': SkillBenchmarkTreatmentScope;
  readonly 'skill_benchmark.run_closed': SkillBenchmarkDesignScope;
  readonly 'skill_benchmark.scenario_started': SkillBenchmarkScenarioScope;
  readonly 'skill_benchmark.scenario_finished': SkillBenchmarkScenarioScope;
  readonly 'skill_benchmark.scenario_aborted': SkillBenchmarkScenarioScope;
  readonly 'skill_benchmark.skill_discovered': SkillBenchmarkSkillScope;
  readonly 'skill_benchmark.skill_loaded': SkillBenchmarkSkillScope;
  readonly 'skill_benchmark.skill_invoked': SkillBenchmarkSkillScope;
  readonly 'skill_benchmark.resource_exposed': SkillBenchmarkResourceScope;
  readonly 'skill_benchmark.milestone_observed': SkillBenchmarkMilestoneScope;
  readonly 'skill_benchmark.trajectory_recorded': SkillBenchmarkScenarioScope;
  readonly 'skill_benchmark.outcome_recorded': SkillBenchmarkObservationScope;
  readonly 'skill_benchmark.score_observed': SkillBenchmarkObservationScope;
  readonly 'skill_benchmark.gold_integrity_recorded':
    SkillBenchmarkObservationScope;
  readonly 'skill_benchmark.compatibility_observed':
    SkillBenchmarkObservationScope;
  readonly 'skill_benchmark.negative_transfer_observed':
    SkillBenchmarkObservationScope;
  readonly 'skill_benchmark.security_probe_recorded':
    SkillBenchmarkObservationScope;
  readonly 'skill_benchmark.effect_certificate_issued':
    SkillBenchmarkCertificateScope;
  readonly 'skill_benchmark.effect_certificate_withheld':
    SkillBenchmarkCertificateScope;
  readonly 'skill_benchmark.effect_certificate_expired':
    SkillBenchmarkCertificateScope;
}

export interface SkillBenchmarkScopeMap
  extends DeepImprovementCommonScopeMap,
  SkillBenchmarkSpecificScopeMap {}

export interface SkillBenchmarkLedgerPayload<
  TStem extends SkillBenchmarkEventStem,
> extends JsonObject {
  readonly stem: TStem;
  readonly eventVersion: 1;
  readonly scope: SkillBenchmarkScopeMap[TStem];
  readonly prevEventHash: Digest;
  readonly payloadDigest: Digest;
  readonly replay: SkillBenchmarkReplayMetadata;
  readonly data: SkillBenchmarkPayloadMap[TStem];
}

export type SkillBenchmarkEventEnvelope<
  TStem extends SkillBenchmarkEventStem = SkillBenchmarkEventStem,
> = EventEnvelope & {
  readonly event_type: typeof SkillBenchmarkWireEventTypes[TStem];
  readonly event_version: 1;
  readonly payload: SkillBenchmarkLedgerPayload<TStem>;
};

export type SkillBenchmarkLedgerEvent = {
  readonly [TStem in SkillBenchmarkEventStem]:
    SkillBenchmarkEventEnvelope<TStem>;
}[SkillBenchmarkEventStem];

export type SkillBenchmarkCompatibilityStatus =
  DeepImprovementCommonCompatibilityStatus;

export interface SkillBenchmarkCompatibilityDecision {
  readonly status: SkillBenchmarkCompatibilityStatus;
  readonly reasonCode: string;
  readonly targetStem: SkillBenchmarkEventStem | null;
  readonly sourceVersion: number | null;
  readonly targetVersion: 1;
}

export interface LegacySkillBenchmarkUpcastContext {
  readonly scope: SkillBenchmarkDesignScope;
  readonly prevEventHash: Digest;
  readonly replay: SkillBenchmarkReplayMetadata;
}

export interface LegacySkillBenchmarkUpcastCandidate {
  readonly status: 'migrated';
  readonly targetStem: SkillBenchmarkSpecificEventStem;
  readonly eventVersion: 1;
  readonly originalRecordDigest: Digest;
  readonly upcasterFingerprint: Fingerprint;
  readonly warnings: readonly string[];
  readonly scope: SkillBenchmarkDesignScope;
  readonly prevEventHash: Digest;
  readonly replay: SkillBenchmarkReplayMetadata;
  readonly data: JsonObject;
}

export type LegacySkillBenchmarkUpcastResult =
  | LegacySkillBenchmarkUpcastCandidate
  | {
    readonly status: 'refused';
    readonly decision: SkillBenchmarkCompatibilityDecision;
  };
