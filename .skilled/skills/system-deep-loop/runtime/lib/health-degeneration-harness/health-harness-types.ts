// ───────────────────────────────────────────────────────────────────
// MODULE: Health Degeneration Harness Types
// ───────────────────────────────────────────────────────────────────

import type { CycleHealthEventPayload } from '../cycle-detection/index.js';
import type { BudgetEventType } from '../hierarchical-budgets/index.js';
import type { ProjectionWatermark } from '../transactional-projections/index.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. SIGNAL AND POLICY CONTRACTS
// ───────────────────────────────────────────────────────────────────

export const HealthSignalKinds = {
  MODE_COLLAPSE: 'mode_collapse',
  REPETITION: 'repetition',
  NOVELTY_STARVATION: 'novelty_starvation',
  QUALITY_DECAY: 'quality_decay',
  BUDGET_THRASH: 'budget_thrash',
  TELEMETRY_GAP: 'telemetry_gap',
  HEALTH_RECOVERED: 'health_recovered',
  NOT_EVALUABLE: 'not_evaluable',
} as const;

export type HealthSignalKind =
  typeof HealthSignalKinds[keyof typeof HealthSignalKinds];

export const HealthSeverities = {
  INFO: 'info',
  WARNING: 'warning',
  DEGRADED: 'degraded',
  CRITICAL: 'critical',
} as const;

export type HealthSeverity =
  typeof HealthSeverities[keyof typeof HealthSeverities];

export const HealthAggregateStates = {
  OBSERVING: 'observing',
  HEALTHY: 'healthy',
  WARNING: 'warning',
  DEGRADED: 'degraded',
  CRITICAL: 'critical',
  NOT_EVALUABLE: 'not_evaluable',
  RECOVERED: 'recovered',
} as const;

export type HealthAggregateState =
  typeof HealthAggregateStates[keyof typeof HealthAggregateStates];

export const HealthResponseActions = {
  OBSERVE: 'observe',
  PAUSE_REGION: 'pause_region',
  PAUSE_MODE: 'pause_mode',
  RESEED_FRONTIER: 'reseed_frontier',
  QUARANTINE_CANDIDATE: 'quarantine_candidate',
  REQUEST_STOP: 'request_stop',
  REPAIR_TELEMETRY: 'repair_telemetry',
} as const;

export type HealthResponseAction =
  typeof HealthResponseActions[keyof typeof HealthResponseActions];

export interface HealthPolicy extends JsonObject {
  readonly schemaVersion: 1;
  readonly policyVersion: string;
  readonly observationWindow: number;
  readonly minimumComparableSamples: number;
  readonly collapseConcentrationCount: number;
  readonly collapseProgressFloorBps: number;
  readonly noveltyWindow: number;
  readonly noveltyLowYieldCount: number;
  readonly independentEvidenceFloorBps: number;
  readonly coverageProgressFloorBps: number;
  readonly qualityComparableSamples: number;
  readonly qualityDecayDeltaBps: number;
  readonly budgetDecisionWindow: number;
  readonly budgetPressureCount: number;
  readonly budgetPressureRatioBps: number;
  readonly budgetEvidenceYieldFloorBps: number;
  readonly healthyWindowsToRecover: number;
  readonly cooldownObservations: number;
  readonly observationRetention: number;
  readonly signalRetention: number;
  readonly requestRetention: number;
  readonly deduplicationRetention: number;
  readonly policyDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. MODE-NEUTRAL ADAPTER CONTRACTS
// ───────────────────────────────────────────────────────────────────

export const HealthInputFields = {
  SEMANTIC_CONCENTRATION: 'semanticConcentration',
  PROGRESS: 'progress',
  FRONTIER: 'frontier',
  QUALITY: 'quality',
  BUDGET_PRESSURE: 'budgetPressure',
  CYCLE_EVENT: 'cycleEvent',
} as const;

export type HealthInputField =
  typeof HealthInputFields[keyof typeof HealthInputFields];

export type HealthInputAvailability = 'required' | 'optional' | 'unavailable';

export interface HealthProjectionBinding extends JsonObject {
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly bundleDigest: string;
  readonly reducerDigest: string;
  readonly configurationDigest: string;
  readonly eventRegistryDigest: string;
}

export interface ModeHealthAdapterDefinition {
  readonly modeId: string;
  readonly adapterId: string;
  readonly adapterVersion: string;
  readonly projection: HealthProjectionBinding;
  readonly fields: Readonly<Record<HealthInputField, HealthInputAvailability>>;
  readonly sourceVersions: Readonly<Partial<Record<HealthInputField, readonly string[]>>>;
  readonly sourceReducerDigests: Readonly<
    Partial<Record<HealthInputField, readonly string[]>>
  >;
}

export interface RegisteredModeHealthAdapter extends ModeHealthAdapterDefinition {
  readonly fields: Readonly<Record<HealthInputField, HealthInputAvailability>>;
  readonly sourceVersions: Readonly<Partial<Record<HealthInputField, readonly string[]>>>;
  readonly sourceReducerDigests: Readonly<
    Partial<Record<HealthInputField, readonly string[]>>
  >;
  readonly adapterDigest: string;
}

export interface HealthLedgerCursor extends JsonObject {
  readonly ledgerId: string;
  readonly sequence: number;
  readonly recordHash: string;
  readonly eventHash: string;
}

export interface HealthSourceProvenance extends JsonObject {
  readonly sourceId: string;
  readonly sourceVersion: string;
  readonly reducerDigest: string;
  readonly watermarkSequence: number;
  readonly watermarkRecordHash: string;
}

export interface SemanticConcentrationObservation extends JsonObject {
  readonly identityKind: 'semantic_community' | 'canonical_fingerprint';
  readonly identity: string;
  readonly textSimilarityBps: number | null;
  readonly provenance: HealthSourceProvenance;
}

export interface ProgressHealthObservation extends JsonObject {
  readonly noveltyYieldBps: number;
  readonly independentEvidenceYieldBps: number;
  readonly coverageGainBps: number;
  readonly claimProgressCount: number;
  readonly qualifyingEvidenceIds: string[];
  readonly provenance: HealthSourceProvenance;
}

export type FrontierStatus = 'eligible' | 'exhausted' | 'empty' | 'unknown';

export interface FrontierHealthObservation extends JsonObject {
  readonly status: FrontierStatus;
  readonly eligibleWorkCount: number | null;
  readonly frontierRef: string | null;
  readonly provenance: HealthSourceProvenance;
}

export interface QualityHealthObservation extends JsonObject {
  readonly normalizedScoreBps: number;
  readonly lowerConfidenceBoundBps: number;
  readonly baselineId: string;
  readonly baselineLowerConfidenceBoundBps: number;
  readonly evaluatorDigest: string;
  readonly rubricDigest: string;
  readonly verifierDigest: string;
  readonly calibrationDigest: string;
  readonly candidateRef: string | null;
  readonly validThroughSequence: number;
  readonly provenance: HealthSourceProvenance;
}

export type BudgetPressureKind =
  | 'normal'
  | 'retry'
  | 'cancellation'
  | 'lease'
  | 'denial'
  | 'reallocation'
  | 'settlement'
  | 'exhaustion';

export type BudgetPressureDimension = 'tokens' | 'cost' | 'iterations' | 'wall-time';

export interface BudgetPressureHealthObservation extends JsonObject {
  readonly sourceEventType: BudgetEventType;
  readonly pressureKind: BudgetPressureKind;
  readonly dimension: BudgetPressureDimension;
  readonly decisionId: string;
  readonly receiptDigest: string;
  readonly evidenceYieldBps: number;
  readonly exhausted: boolean;
  readonly provenance: HealthSourceProvenance;
}

export interface NormalizedHealthInputs extends JsonObject {
  readonly semanticConcentration: SemanticConcentrationObservation | null;
  readonly progress: ProgressHealthObservation | null;
  readonly frontier: FrontierHealthObservation | null;
  readonly quality: QualityHealthObservation | null;
  readonly budgetPressure: BudgetPressureHealthObservation | null;
  readonly cycleEvent: CycleHealthEventPayload | null;
}

export interface HealthBoundaryInput {
  readonly runId: string;
  readonly modeId: string;
  readonly lineageId: string;
  readonly regionId: string | null;
  readonly completedAttemptId: string;
  readonly ledgerCursor: HealthLedgerCursor;
  readonly projectionWatermark: ProjectionWatermark;
  readonly sourceEventIds: readonly string[];
  readonly sourceDigests: Readonly<Record<string, string>>;
  readonly adapterId: string;
  readonly adapterVersion: string;
  readonly adapterDigest: string;
  readonly replayFingerprintDigest: string;
  readonly inputs: NormalizedHealthInputs;
}

// ───────────────────────────────────────────────────────────────────
// 3. OBSERVATION, SIGNAL, AND RESPONSE CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface HealthValidationIssue extends JsonObject {
  readonly code: string;
  readonly field: string;
  readonly message: string;
}

export interface HealthObservation extends JsonObject {
  readonly schemaVersion: 1;
  readonly projectorVersion: string;
  readonly observationId: string;
  readonly observationHash: string;
  readonly boundaryId: string;
  readonly runId: string;
  readonly modeId: string;
  readonly lineageId: string;
  readonly regionId: string | null;
  readonly completedAttemptId: string;
  readonly ledgerCursor: HealthLedgerCursor;
  readonly projectionWatermark: ProjectionWatermark;
  readonly sourceEventIds: string[];
  readonly sourceDigests: JsonObject;
  readonly adapterId: string;
  readonly adapterVersion: string;
  readonly adapterDigest: string;
  readonly policyVersion: string;
  readonly policyDigest: string;
  readonly replayFingerprintDigest: string;
  readonly inputDigest: string;
  readonly inputs: NormalizedHealthInputs;
  readonly coherent: boolean;
  readonly validationIssues: HealthValidationIssue[];
}

export interface HealthSignalScope extends JsonObject {
  readonly runId: string;
  readonly modeId: string;
  readonly lineageId: string;
  readonly regionId: string | null;
}

export interface HealthSignal extends JsonObject {
  readonly schemaVersion: 1;
  readonly signalId: string;
  readonly kind: HealthSignalKind;
  readonly severity: HealthSeverity;
  readonly status: 'active' | 'informational';
  readonly scope: HealthSignalScope;
  readonly observationId: string;
  readonly observationHash: string;
  readonly ledgerCursor: HealthLedgerCursor;
  readonly projectionWatermark: ProjectionWatermark;
  readonly sourceEventIds: string[];
  readonly inputDigest: string;
  readonly replayFingerprintDigest: string;
  readonly inputGauges: NormalizedHealthInputs;
  readonly policyVersion: string;
  readonly policyDigest: string;
  readonly adapterDigest: string;
  readonly priorActiveSignalId: string | null;
  readonly materialEvidenceDigest: string;
  readonly evidence: JsonObject;
  readonly decisionTrace: JsonObject[];
}

export interface HealthAggregate extends JsonObject {
  readonly schemaVersion: 1;
  readonly aggregateId: string;
  readonly state: HealthAggregateState;
  readonly severity: HealthSeverity;
  readonly observationId: string;
  readonly activeSignalIds: string[];
  readonly policyVersion: string;
  readonly policyDigest: string;
}

export interface HealthRequestedScope extends JsonObject {
  readonly runId: string;
  readonly modeId: string;
  readonly lineageId: string;
  readonly regionId: string | null;
  readonly frontierRef: string | null;
  readonly candidateRef: string | null;
}

export interface HealthResponseRequest extends JsonObject {
  readonly schemaVersion: 1;
  readonly requestId: string;
  readonly action: HealthResponseAction;
  readonly authority: 'request_only';
  readonly authorizationState: 'pending_gateway';
  readonly gatewayDecisionId: null;
  readonly executionDecision: null;
  readonly executionReceipt: null;
  readonly safePointRequired: boolean;
  readonly requestedScope: HealthRequestedScope;
  readonly signalIds: string[];
  readonly aggregateId: string;
  readonly aggregateState: HealthAggregateState;
  readonly severity: HealthSeverity;
  readonly evidenceDigest: string;
  readonly reason: string;
  readonly policyVersion: string;
  readonly policyDigest: string;
  readonly budgetHandling: 'preserve' | 'settle_before_transition';
  readonly leaseHandling: 'preserve_inflight' | 'await_safe_point';
}

// ───────────────────────────────────────────────────────────────────
// 4. PROJECTION AND EXECUTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

export interface HealthDeduplicationRecord extends JsonObject {
  readonly boundaryId: string;
  readonly inputDigest: string;
  readonly observationHash: string;
  readonly observation: HealthObservation;
  readonly emittedSignals: HealthSignal[];
  readonly responseRequests: HealthResponseRequest[];
  readonly aggregate: HealthAggregate;
}

export interface HealthProjectionState extends JsonObject {
  readonly schemaVersion: 1;
  readonly projectorVersion: string;
  readonly policyVersion: string;
  readonly policyDigest: string;
  readonly observations: HealthObservation[];
  readonly signals: HealthSignal[];
  readonly requests: HealthResponseRequest[];
  readonly activeSignals: JsonObject;
  readonly deduplicationRecords: HealthDeduplicationRecord[];
  readonly lastLedgerCursor: HealthLedgerCursor | null;
  readonly healthyWindowStreaks: JsonObject;
  readonly projectionHash: string;
}

export interface HealthProjectionResult {
  readonly status: 'applied' | 'idempotent';
  readonly observation: HealthObservation;
  readonly emittedSignals: readonly HealthSignal[];
  readonly aggregate: HealthAggregate;
  readonly responseRequests: readonly HealthResponseRequest[];
  readonly state: HealthProjectionState;
}

export interface HealthShadowResult<TLegacy> {
  readonly legacyResult: TLegacy;
  readonly healthResult: HealthProjectionResult;
  readonly authority: 'legacy_unchanged';
}

export const HealthHarnessErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNSUPPORTED_POLICY: 'UNSUPPORTED_POLICY',
  ADAPTER_UNREGISTERED: 'ADAPTER_UNREGISTERED',
  ADAPTER_CONFLICT: 'ADAPTER_CONFLICT',
  NON_MONOTONIC_CURSOR: 'NON_MONOTONIC_CURSOR',
  EVENT_CONFLICT: 'EVENT_CONFLICT',
  PROJECTION_CORRUPT: 'PROJECTION_CORRUPT',
} as const;

export type HealthHarnessErrorCode =
  typeof HealthHarnessErrorCodes[keyof typeof HealthHarnessErrorCodes];

export class HealthHarnessError extends Error {
  public readonly code: HealthHarnessErrorCode;
  public readonly details: Readonly<Record<string, unknown>>;

  public constructor(
    code: HealthHarnessErrorCode,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = 'HealthHarnessError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
