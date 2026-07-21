// ───────────────────────────────────────────────────────────────────
// MODULE: Rollback Drill Types
// ───────────────────────────────────────────────────────────────────

import type { AuthorityState } from '../authorized-ledger/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  CertificationEnvelope,
  CertificationProfile,
  ReceiptCertificationProvider,
} from '../receipts-and-effect-recovery/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const ROLLBACK_DRILL_SCHEMA_VERSION = 1;
export const ROLLBACK_CERTIFICATE_SCHEMA_VERSION = 1;
export const ROLLBACK_POLICY_MINIMUM_CALENDAR_DAYS = 14;
export const ROLLBACK_POLICY_MINIMUM_SUCCESSFUL_RUNS = 5;

export const RollbackFaultFixtures = {
  REPLAY_FINGERPRINT_MISMATCH: 'replay_fingerprint_mismatch',
  LEGACY_PROJECTION_MISMATCH: 'legacy_projection_mismatch',
  STALE_AUTHORITY_EPOCH: 'stale_authority_epoch',
  MISSING_RECEIPT: 'missing_receipt',
  CONFLICTING_RECEIPT: 'conflicting_receipt',
  UNRESOLVED_EFFECT_INTENT: 'unresolved_effect_intent',
  CRASH_AT_CUT_POINT: 'crash_at_cut_point',
  TIMEOUT_AT_CUT_POINT: 'timeout_at_cut_point',
} as const;

export type RollbackFaultFixture =
  typeof RollbackFaultFixtures[keyof typeof RollbackFaultFixtures];

export const RollbackDetectors = {
  REPLAY_FINGERPRINT: 'replay_fingerprint_detector',
  LEGACY_PROJECTION: 'legacy_projection_detector',
  AUTHORITY_EPOCH: 'authority_epoch_detector',
  RECEIPT_COMPLETENESS: 'receipt_completeness_detector',
  RECEIPT_CONFLICT: 'receipt_conflict_detector',
  EFFECT_UNCERTAINTY: 'effect_uncertainty_detector',
  CRASH_BOUNDARY: 'crash_boundary_detector',
  TIMEOUT_BOUNDARY: 'timeout_boundary_detector',
} as const;

export type RollbackDetector =
  typeof RollbackDetectors[keyof typeof RollbackDetectors];

export const DetectorByFaultFixture: Readonly<Record<RollbackFaultFixture, RollbackDetector>> =
  Object.freeze({
    replay_fingerprint_mismatch: RollbackDetectors.REPLAY_FINGERPRINT,
    legacy_projection_mismatch: RollbackDetectors.LEGACY_PROJECTION,
    stale_authority_epoch: RollbackDetectors.AUTHORITY_EPOCH,
    missing_receipt: RollbackDetectors.RECEIPT_COMPLETENESS,
    conflicting_receipt: RollbackDetectors.RECEIPT_CONFLICT,
    unresolved_effect_intent: RollbackDetectors.EFFECT_UNCERTAINTY,
    crash_at_cut_point: RollbackDetectors.CRASH_BOUNDARY,
    timeout_at_cut_point: RollbackDetectors.TIMEOUT_BOUNDARY,
  });

export const InflightDispositions = {
  UPCAST: 'UPCAST',
  PIN: 'PIN',
  FORK: 'FORK',
  MIGRATE: 'MIGRATE',
  BLOCK: 'BLOCK',
} as const;

export type InflightDisposition =
  typeof InflightDispositions[keyof typeof InflightDispositions];

export const DrillTimelineSteps = {
  PREFLIGHT: 'preflight',
  CONTROL_CONTINUED: 'control_continued',
  TEST_CUTOVER: 'test_cutover',
  SPINE_WORK_COMMITTED: 'spine_work_committed',
  REGRESSION_DETECTED: 'regression_detected',
  ADMISSION_FROZEN: 'admission_frozen',
  SPINE_FENCED: 'spine_fenced',
  STATE_RECONCILED: 'state_reconciled',
  LEGACY_RESTORED: 'legacy_restored',
  STALE_WRITER_DENIED: 'stale_writer_denied',
  LEGACY_RESUMED: 'legacy_resumed',
  INTEGRITY_VERIFIED: 'integrity_verified',
  CLEANUP_VERIFIED: 'cleanup_verified',
} as const;

export type DrillTimelineStep =
  typeof DrillTimelineSteps[keyof typeof DrillTimelineSteps];

export const DRILL_INPUT_BINDING_KEYS = Object.freeze([
  'adapterRegistry',
  'base',
  'candidate',
  'classificationManifest',
  'contractDefectLedger',
  'eventSchemaCensus',
  'fingerprintContract',
  'modeRegistry',
  'parityCertificate',
  'phaseTree',
  'policy',
  'projectionContract',
  'receiptContract',
  'rollbackAsset',
] as const);

export type DrillInputBindingKey = typeof DRILL_INPUT_BINDING_KEYS[number];

export const RollbackDrillReasonCodes = {
  PASSED: 'passed',
  INPUT_INVALID: 'input_invalid',
  ISOLATION_INVALID: 'isolation_invalid',
  REGRESSION_NOT_DETECTED: 'regression_not_detected',
  REGRESSION_CLASS_MISMATCH: 'regression_class_mismatch',
  AUTHORITY_TRANSITION_FAILED: 'authority_transition_failed',
  RECONCILIATION_BLOCKED: 'reconciliation_blocked',
  EFFECT_CONFLICT: 'effect_conflict',
  EFFECT_IN_DOUBT: 'effect_in_doubt',
  REPLAY_INTEGRITY_FAILED: 'replay_integrity_failed',
  PROJECTION_INTEGRITY_FAILED: 'projection_integrity_failed',
  STATE_INTEGRITY_FAILED: 'state_integrity_failed',
  WINDOW_CLOSED: 'window_closed',
  PROTECTED_STATE_CHANGED: 'protected_state_changed',
  CLEANUP_FAILED: 'cleanup_failed',
  CERTIFICATE_INVALID: 'certificate_invalid',
  BINDING_DRIFT: 'binding_drift',
} as const;

export type RollbackDrillReasonCode =
  typeof RollbackDrillReasonCodes[keyof typeof RollbackDrillReasonCodes];

// ───────────────────────────────────────────────────────────────────
// 2. MANIFEST INPUTS
// ───────────────────────────────────────────────────────────────────

/** Complete content identities that make a drill result freshness-bound. */
export interface DrillInputBindings extends JsonObject {
  readonly adapterRegistry: string;
  readonly base: string;
  readonly candidate: string;
  readonly classificationManifest: string;
  readonly contractDefectLedger: string;
  readonly eventSchemaCensus: string;
  readonly fingerprintContract: string;
  readonly modeRegistry: string;
  readonly parityCertificate: string;
  readonly phaseTree: string;
  readonly policy: string;
  readonly projectionContract: string;
  readonly receiptContract: string;
  readonly rollbackAsset: string;
}

/** One frozen state row and its only permitted rollback disposition. */
export interface InflightStateClassification extends JsonObject {
  readonly rowId: string;
  readonly stateDigest: string;
  readonly shapeVersion: string;
  readonly lifecyclePoint: string;
  readonly authorityEpoch: number;
  readonly mutability: string;
  readonly activeLeaseIds: string[];
  readonly pendingEffectIds: string[];
  readonly identityCoverageComplete: boolean;
  readonly orderCoverageComplete: boolean;
  readonly rollbackAnchorDigest: string;
  readonly disposition: InflightDisposition;
  readonly reasonCode: string;
  readonly verifier: string;
  readonly terminalReceiptId: string | null;
  readonly isQuiescent: boolean;
}

export interface InflightClassificationManifest extends JsonObject {
  readonly expectedRowIds: string[];
  readonly rows: InflightStateClassification[];
}

/** Runtime actions whose outputs are materialized into restored state. */
export const InflightDispositionActions = {
  UPCAST: 'upcast-effective-shape',
  PIN: 'pin-legacy-state',
  FORK: 'fork-isolated-shadow-copy',
  MIGRATE: 'migrate-reversible-checkpoint',
} as const;

export type InflightDispositionAction =
  typeof InflightDispositionActions[keyof typeof InflightDispositionActions];

/** Durable result of applying one declared state disposition during reconstruction. */
export interface AppliedInflightDisposition extends JsonObject {
  readonly rowId: string;
  readonly disposition: Exclude<InflightDisposition, 'BLOCK'>;
  readonly action: InflightDispositionAction;
  readonly sourceStateDigest: string;
  readonly restoredStateDigest: string;
}

/** Canonical state used by the isolated legacy control and cutover lanes. */
export interface RollbackLaneState extends JsonObject {
  readonly facts: string[];
  readonly artifacts: Record<string, string>;
  readonly completedSteps: number;
}

export interface RollbackAnchor extends JsonObject {
  readonly anchorId: string;
  readonly state: RollbackLaneState;
  readonly digest: string;
}

export interface RollbackWorkload extends JsonObject {
  readonly factIds: string[];
  readonly artifactName: string;
  readonly artifactContent: string;
}

/** Persisted restoration payload read back after the legacy restore action. */
export interface RollbackStateReconstruction extends JsonObject {
  readonly state: RollbackLaneState;
  readonly appliedDispositions: AppliedInflightDisposition[];
  readonly dispositionCounts: Record<InflightDisposition, number>;
}

export interface RollbackWindowDeclaration extends JsonObject {
  readonly openedAt: string;
  readonly successfulAuthoritativeRuns: number;
  readonly minimumCalendarDays: number;
  readonly minimumSuccessfulRuns: number;
  readonly stricterDeadlineAt: string | null;
}

export interface RollbackFaultDeclaration extends JsonObject {
  readonly fixture: RollbackFaultFixture;
  readonly expectedDetector: RollbackDetector;
  readonly cutPoint: string;
  readonly timeoutMs: number;
}

/** Path-free drill contract; filesystem targets are supplied through runtime options. */
export interface RollbackDrillManifest extends JsonObject {
  readonly schemaVersion: number;
  readonly drillId: string;
  readonly mode: string;
  readonly baseSha: string;
  readonly candidateSha: string;
  readonly policyVersion: string;
  readonly verifierIdentity: string;
  readonly startingAuthorityEpoch: number;
  readonly legacyWriterId: string;
  readonly spineWriterId: string;
  readonly bindings: DrillInputBindings;
  readonly parityUnresolvedDivergences: number;
  readonly classification: InflightClassificationManifest;
  readonly rollbackAnchor: RollbackAnchor;
  readonly workload: RollbackWorkload;
  readonly rollbackWindow: RollbackWindowDeclaration;
  readonly fault: RollbackFaultDeclaration;
}

// ───────────────────────────────────────────────────────────────────
// 3. RUNTIME OPTIONS
// ───────────────────────────────────────────────────────────────────

export interface ProtectedPathDeclaration {
  readonly id: string;
  readonly path: string;
}

/** Synthetic clocks make window and timeout proofs reproducible. */
export interface RollbackDrillClock {
  now(): Date;
  advance(milliseconds: number): void;
}

/** Test-only interruption points around the durable restoration boundary. */
export interface RollbackDrillFaultHooks {
  readonly beforeLegacyRestore?: () => void;
  readonly afterLegacyRestore?: () => void;
}

export interface RollbackDrillOptions {
  readonly manifest: RollbackDrillManifest;
  readonly currentMode: string;
  readonly currentBindings: DrillInputBindings;
  readonly sandboxRoot: string;
  readonly protectedPaths: readonly ProtectedPathDeclaration[];
  readonly certificationProvider: ReceiptCertificationProvider;
  readonly certificationProfile: CertificationProfile;
  readonly clock: RollbackDrillClock;
  readonly faultHooks?: RollbackDrillFaultHooks;
}

// ───────────────────────────────────────────────────────────────────
// 4. CERTIFICATE EVIDENCE
// ───────────────────────────────────────────────────────────────────

export interface DrillTimelineEntry extends JsonObject {
  readonly step: DrillTimelineStep;
  readonly at: string;
  readonly authorityState: AuthorityState;
  readonly authorityEpoch: number;
}

export interface AuthorityTransitionEvidence extends JsonObject {
  readonly fromState: AuthorityState;
  readonly fromEpoch: number;
  readonly toState: AuthorityState;
  readonly toEpoch: number;
  readonly owner: string;
  readonly at: string;
}

export interface ReplayIntegrityEvidence extends JsonObject {
  readonly controlVerified: boolean;
  readonly resumedVerified: boolean;
  readonly effectiveEventDigestMatch: boolean;
  readonly projectionDigestMatch: boolean;
  readonly controlEffectiveEventDigest: string;
  readonly resumedEffectiveEventDigest: string;
  readonly controlProjectionDigest: string;
  readonly resumedProjectionDigest: string;
  readonly controlRange: ReplayRangeCoverage;
  readonly resumedRange: ReplayRangeCoverage;
}

/** Concrete proof that fingerprint verification crossed the divergence boundary. */
export interface ReplayRangeCoverage extends JsonObject {
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly sealedHeadSequence: number;
  readonly postDivergenceEventCount: number;
  readonly boundedSpineWorkCovered: boolean;
  readonly effectEventsCovered: boolean;
  readonly forwardCutoverCovered: boolean;
  readonly rollbackTransitionCovered: boolean;
  readonly restoredStateCovered: boolean;
}

export interface LegacyProjectionIntegrityEvidence extends JsonObject {
  readonly bytesMatch: boolean;
  readonly readerResultMatch: boolean;
  readonly controlDigest: string;
  readonly resumedDigest: string;
  readonly byteLength: number;
}

export interface StateIntegrityEvidence extends JsonObject {
  readonly controlFactCount: number;
  readonly resumedFactCount: number;
  readonly controlArtifactCount: number;
  readonly resumedArtifactCount: number;
  readonly controlLedgerEventCount: number;
  readonly cutoverLedgerEventCount: number;
  readonly preservedCutoverEventCount: number;
  readonly cutoverEvidenceRetained: boolean;
  readonly duplicateFactCount: number;
  readonly stateDigestMatch: boolean;
  readonly controlReconstructionDigest: string;
  readonly resumedReconstructionDigest: string;
  readonly reconstructionDigestMatch: boolean;
  readonly expectedDispositionCount: number;
  readonly resumedDispositionCount: number;
}

export interface EffectIntegrityEvidence extends JsonObject {
  readonly intentCount: number;
  readonly confirmationCount: number;
  readonly conflictCount: number;
  readonly operatorRequiredCount: number;
  readonly unresolvedIntentCount: number;
  readonly terminalExactlyOnce: boolean;
}

export interface RollbackTimingEvidence extends JsonObject {
  readonly windowOpenedAt: string;
  readonly regressionDetectedAt: string;
  readonly rollbackStartedAt: string;
  readonly rollbackCompletedAt: string;
  readonly legacyResumedAt: string;
  readonly elapsedMs: number;
  readonly insidePolicyWindow: boolean;
  readonly insideStricterDeadline: boolean;
}

export interface IsolationEvidence extends JsonObject {
  readonly protectedBeforeDigest: string;
  readonly protectedAfterDigest: string;
  readonly protectedStateUnchanged: boolean;
  readonly sandboxRootDigest: string;
  readonly liveEffectCountDelta: number;
}

export interface CleanupEvidence extends JsonObject {
  readonly disposableStateRemoved: boolean;
  readonly evidencePreserved: boolean;
  readonly residualEntries: string[];
}

export interface RollbackDrillCertificateFacts extends JsonObject {
  readonly schemaVersion: number;
  readonly certificateId: string;
  readonly drillId: string;
  readonly mode: string;
  readonly baseSha: string;
  readonly candidateSha: string;
  readonly policyVersion: string;
  readonly manifestDigest: string;
  readonly bindings: DrillInputBindings;
  readonly legacyWriterId: string;
  readonly spineWriterId: string;
  readonly workloadDigest: string;
  readonly forwardCutoverReceiptId: string;
  readonly faultFixture: RollbackFaultFixture;
  readonly faultCutPoint: string;
  readonly faultTimeoutMs: number;
  readonly expectedDetector: RollbackDetector;
  readonly observedDetector: RollbackDetector | null;
  readonly regressionEvidenceDigest: string | null;
  readonly regressionDetected: boolean;
  readonly passed: boolean;
  readonly reasonCodes: RollbackDrillReasonCode[];
  readonly timeline: DrillTimelineEntry[];
  readonly authorityTransitions: AuthorityTransitionEvidence[];
  readonly startingAuthorityEpoch: number;
  readonly restoredAuthorityEpoch: number | null;
  readonly restoredAuthorityState: AuthorityState | null;
  readonly staleWriterDenied: boolean;
  readonly admissionFreezeReceiptId: string | null;
  readonly spineFenceReceiptId: string | null;
  readonly legacyRestoreReceiptId: string | null;
  readonly classificationDigest: string;
  readonly dispositionCounts: Record<InflightDisposition, number>;
  readonly replay: ReplayIntegrityEvidence;
  readonly legacyProjection: LegacyProjectionIntegrityEvidence;
  readonly state: StateIntegrityEvidence;
  readonly effects: EffectIntegrityEvidence;
  readonly timing: RollbackTimingEvidence;
  readonly isolation: IsolationEvidence;
  readonly cleanup: CleanupEvidence;
  readonly preservedLedgerRange: JsonObject;
  readonly preservedEvidenceDigest: string;
  readonly verifierIdentity: string;
  readonly issuedAt: string;
}

export interface RollbackDrillCertificate extends JsonObject {
  readonly facts: RollbackDrillCertificateFacts;
  readonly certification: CertificationEnvelope;
  readonly certificateDigest: string;
}

export interface RollbackDrillExecutionResult {
  readonly certificate: RollbackDrillCertificate;
  readonly certificatePath: string;
}

export interface Phase014RollbackEvidenceInput {
  readonly certificatePath: string;
  readonly expectedMode: string;
  readonly currentBindings: DrillInputBindings;
  readonly certificationProvider: ReceiptCertificationProvider;
}

export type Phase014RollbackEvidenceResult =
  | {
      readonly ok: true;
      readonly certificate: RollbackDrillCertificate;
    }
  | {
      readonly ok: false;
      readonly reasonCode: RollbackDrillReasonCode;
      readonly message: string;
    };

/** Internal detector evidence never accepts a caller-authored success boolean. */
export interface RegressionObservation {
  readonly detector: RollbackDetector;
  readonly evidenceDigest: string;
  readonly details: JsonValue;
}
