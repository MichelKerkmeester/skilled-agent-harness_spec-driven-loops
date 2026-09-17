// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Mode Contract Types
// ───────────────────────────────────────────────────────────────────

import type {
  EventProducer,
  EventTypeDefinition,
  JsonObject,
} from '../event-envelope/index.js';
import type { FencedLease } from '../locks-and-fencing/index.js';
import type {
  BoundaryReceiptPayload,
  EffectRecoveryClaim,
} from '../receipts-and-effect-recovery/index.js';
import type {
  ReplayFingerprintVerificationResult,
} from '../replay-fingerprint/index.js';
import type { SealedArtifactReference } from '../sealed-reference-artifacts/index.js';
import type {
  ContinuityIdentityFrontier,
} from '../deep-loop/continuity-identity/index.js';
import type {
  CycleEvaluationResult,
} from '../cycle-detection/index.js';
import type {
  HealthAggregate,
  HealthSignal,
} from '../health-degeneration-harness/health-harness-types.js';
import type {
  PathCoverageEvaluation,
} from '../path-coverage-termination/index.js';
import type {
  StoppingClockObservation,
  StoppingClockKinds,
  StoppingClockStates,
} from '../stopping-clocks/index.js';
import type {
  VocAllocationPlan,
  VocAssessment,
} from '../voc-allocation/index.js';
import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  ModeSubstratePortName,
  ModeSubstratePorts,
} from './substrate-ports.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERFACE IDENTITY
// ───────────────────────────────────────────────────────────────────

export const MODE_CONTRACT_INTERFACE_VERSION = '1.0.0' as const;
export const MODE_CONTRACT_SHAPE = 'deep-loop.mode-contract@1.0.0' as const;
export const MODE_COMPATIBILITY_POLICY_VERSION = 'mode-interface-compatibility@1' as const;

export const ModeProvidedCapabilities = Object.freeze([
  'describe',
  'eventTypes',
  'reduce',
  'sealArtifacts',
  'issueCertificate',
  'convergenceHooks',
  'classifyResume',
  'upcastResume',
  'restoreResume',
] as const);

export type ModeProvidedCapability = typeof ModeProvidedCapabilities[number];
export type ModeInterfaceVersion = `${number}.${number}.${number}`;
export type ModeWorkstreamId = string;

// ───────────────────────────────────────────────────────────────────
// 2. EVENTS AND REDUCERS
// ───────────────────────────────────────────────────────────────────

export interface ModeReplayInputDeclaration {
  readonly inputId: string;
  readonly source: 'artifact' | 'configuration' | 'ledger-event' | 'projection';
  readonly digestRequired: true;
}

export interface ModeEventSchema {
  readonly eventType: string;
  readonly schemaVersion: number;
  readonly interfaceVersion: ModeInterfaceVersion;
  readonly requiredFields: readonly string[];
  readonly transitionIntent: string;
  readonly reducerOwner: string;
  readonly replayInputs: readonly ModeReplayInputDeclaration[];
  readonly producer: EventProducer;
  readonly definition: EventTypeDefinition;
  readonly writeBoundary: {
    readonly authorization: 'TransitionAuthorizationGateway';
    readonly append: 'AppendOnlyLedger.appendAuthorized';
  };
}

export interface ModeReducerDefinition<TState extends JsonObject> {
  readonly reducerId: string;
  readonly reducerVersion: string;
  readonly stateVersion: string;
  readonly ownedFields: readonly (keyof TState & string)[];
  readonly inputEventTypes: readonly string[];
  readonly replaySource: 'verified-ledger-events-only';
  readonly outputRule: 'immutable';
}

export interface ModeReducerSet<TState extends JsonObject> {
  readonly persistedFields: readonly (keyof TState & string)[];
  readonly definitions: readonly ModeReducerDefinition<TState>[];
}

export interface ModeReductionResult<TState extends JsonObject> {
  readonly reducerId: string;
  readonly stateVersion: string;
  readonly appliedEventId: string;
  readonly state: Readonly<TState>;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVIDENCE PRODUCTS
// ───────────────────────────────────────────────────────────────────

export interface ModeArtifactPolicy {
  readonly artifactKind: string;
  readonly schemaVersion: number;
  readonly identityStrategy: string;
  readonly requiredInputDigests: readonly string[];
  readonly sourceEventTypes: readonly string[];
  readonly sealBoundary: 'SealedArtifactStore';
  readonly validityScope: string;
  readonly producerVersion: string;
  readonly invalidationConditions: readonly string[];
  readonly authorityEffect: 'none';
}

export interface ModeArtifactContext extends JsonObject {
  readonly sourceEventIds: string[];
  readonly inputDigests: JsonObject;
}

interface ModeArtifactEvidenceShape {
  readonly artifactId: string;
  readonly artifactKind: string;
  readonly contentDigest: string;
  readonly inputDigests: string[];
  readonly sourceEventIds: string[];
  readonly validityScope: string;
  readonly producerVersion: string;
  readonly invalidationConditions: string[];
  readonly authorityEffect: 'none';
  readonly legacyAuthority: 'unchanged';
  readonly sealedReference: SealedArtifactReference;
}

export interface ModeArtifactEvidence extends JsonObject, ModeArtifactEvidenceShape {}

export const ModeArtifactEvidenceFieldSet = Object.freeze({
  artifactId: true,
  artifactKind: true,
  contentDigest: true,
  inputDigests: true,
  sourceEventIds: true,
  validityScope: true,
  producerVersion: true,
  invalidationConditions: true,
  authorityEffect: true,
  legacyAuthority: true,
  sealedReference: true,
} as const satisfies Readonly<Record<keyof ModeArtifactEvidenceShape, true>>);

export interface ModeCertificatePolicy {
  readonly certificateKind: string;
  readonly evidenceReferencesRequired: true;
  readonly validityScope: string;
  readonly producerVersion: string;
  readonly invalidationConditions: readonly string[];
  readonly migrationUse: 'shadow-parity' | 'phase-014-cutover-input';
  readonly authorityEffect: 'none';
  readonly legacyAuthority: 'unchanged';
}

export interface ModeCertificateEvidence extends JsonObject {
  readonly evidenceReferences: string[];
  readonly inputDigests: string[];
}

interface ModeCertificateShape {
  readonly certificateId: string;
  readonly certificateKind: string;
  readonly evidenceReferences: string[];
  readonly validityScope: string;
  readonly producerVersion: string;
  readonly invalidationConditions: string[];
  readonly migrationUse: 'shadow-parity' | 'phase-014-cutover-input';
  readonly authorityEffect: 'none';
  readonly legacyAuthority: 'unchanged';
}

export interface ModeCertificate extends JsonObject, ModeCertificateShape {}

export const ModeCertificateFieldSet = Object.freeze({
  certificateId: true,
  certificateKind: true,
  evidenceReferences: true,
  validityScope: true,
  producerVersion: true,
  invalidationConditions: true,
  migrationUse: true,
  authorityEffect: true,
  legacyAuthority: true,
} as const satisfies Readonly<Record<keyof ModeCertificateShape, true>>);

// ───────────────────────────────────────────────────────────────────
// 4. CONVERGENCE OBSERVATIONS
// ───────────────────────────────────────────────────────────────────

export interface ModeConvergenceObservation<TSignal> {
  readonly kind: 'coverage' | 'cycle' | 'health' | 'stopping-clock' | 'value-of-computation';
  readonly signal: TSignal;
  readonly evidenceReferences: readonly string[];
  readonly authority: 'observation-only';
}

export const ModeConvergenceObservationFieldSet = Object.freeze({
  kind: true,
  signal: true,
  evidenceReferences: true,
  authority: true,
} as const satisfies Readonly<Record<keyof ModeConvergenceObservation<unknown>, true>>);

export interface ModeStoppingClockSignals {
  readonly kinds: typeof StoppingClockKinds;
  readonly states: typeof StoppingClockStates;
  readonly observations: readonly StoppingClockObservation[];
}

export interface ModeHealthSignals {
  readonly signals: readonly HealthSignal[];
  readonly aggregate: HealthAggregate;
}

export interface ModeConvergenceHooks {
  readonly observeCoverage: (
    signal: PathCoverageEvaluation,
  ) => ModeConvergenceObservation<PathCoverageEvaluation>;
  readonly observeCycle: (
    signal: CycleEvaluationResult,
  ) => ModeConvergenceObservation<CycleEvaluationResult>;
  readonly observeStoppingClocks: (
    signal: ModeStoppingClockSignals,
  ) => ModeConvergenceObservation<ModeStoppingClockSignals>;
  readonly observeValueOfComputation: (
    signal: VocAssessment | VocAllocationPlan,
  ) => ModeConvergenceObservation<VocAssessment | VocAllocationPlan>;
  readonly observeHealth: (
    signal: ModeHealthSignals,
  ) => ModeConvergenceObservation<ModeHealthSignals>;
}

export const ModeConvergenceHookSet = Object.freeze({
  observeCoverage: true,
  observeCycle: true,
  observeStoppingClocks: true,
  observeValueOfComputation: true,
  observeHealth: true,
} as const satisfies Readonly<Record<keyof ModeConvergenceHooks, true>>);

// ───────────────────────────────────────────────────────────────────
// 5. RESUME ADAPTERS
// ───────────────────────────────────────────────────────────────────

export type ModeResumeOutcomeKind =
  | 'upcast'
  | 'pin-legacy'
  | 'fork'
  | 'migrate'
  | 'block';

export interface ModeResumeEvidence {
  readonly replayFingerprint: {
    readonly status: 'mismatch' | 'unknown' | 'verified';
    readonly verification: ReplayFingerprintVerificationResult<JsonObject> | null;
  };
  readonly lease: {
    readonly status: 'lost' | 'stale' | 'unknown' | 'valid';
    readonly lease: FencedLease | null;
  };
  readonly receipts: {
    readonly status: 'conflict' | 'missing' | 'unknown' | 'verified';
    readonly receipts: readonly BoundaryReceiptPayload[];
  };
  readonly continuityIdentity: {
    readonly status: 'conflict' | 'missing' | 'unknown' | 'verified';
    readonly frontier: ContinuityIdentityFrontier | null;
  };
  readonly artifacts: {
    readonly status: 'invalid' | 'missing' | 'unknown' | 'verified';
    readonly references: readonly SealedArtifactReference[];
  };
  readonly pendingEffects: {
    readonly status: 'in-doubt' | 'none' | 'recoverable' | 'unknown';
    readonly claims: readonly EffectRecoveryClaim[];
  };
}

export interface ModeResumeSnapshot<TSnapshot extends JsonObject> {
  readonly snapshotId: string;
  readonly sourceInterfaceVersion: ModeInterfaceVersion;
  readonly state: Readonly<TSnapshot>;
  readonly evidence: ModeResumeEvidence;
}

interface ModeResumeOutcomeBase {
  readonly outcome: ModeResumeOutcomeKind;
  readonly snapshotId: string;
  readonly evidence: ModeResumeEvidence;
  readonly reasonCodes: readonly string[];
}

export interface ModeResumeUpcastOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'upcast';
  readonly adapterId: string;
  readonly targetInterfaceVersion: ModeInterfaceVersion;
}

export interface ModeResumePinLegacyOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'pin-legacy';
  readonly legacyProjectionId: string;
}

export interface ModeResumeForkOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'fork';
  readonly forkIdentity: string;
}

export interface ModeResumeMigrateOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'migrate';
  readonly migrationId: string;
}

export interface ModeResumeBlockOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'block';
  readonly failedChecks: readonly (keyof ModeResumeEvidence)[];
}

export type ModeResumeOutcome =
  | ModeResumeUpcastOutcome
  | ModeResumePinLegacyOutcome
  | ModeResumeForkOutcome
  | ModeResumeMigrateOutcome
  | ModeResumeBlockOutcome;

export type ModeResumeUpcastResult<TSnapshot extends JsonObject> =
  | {
    readonly status: 'upcasted';
    readonly adapterId: string;
    readonly snapshot: ModeResumeSnapshot<TSnapshot>;
  }
  | {
    readonly status: 'refused';
    readonly reasonCodes: readonly string[];
  };

export type ModeRestoreResult<TState extends JsonObject> =
  | {
    readonly status: 'restored';
    readonly state: Readonly<TState>;
    readonly restoredEvidence: ModeResumeEvidence;
  }
  | {
    readonly status: 'blocked';
    readonly reasonCodes: readonly string[];
  };

// ───────────────────────────────────────────────────────────────────
// 6. VERSIONING AND WRITES
// ───────────────────────────────────────────────────────────────────

export type ModeInterfaceChangeKind = 'additive' | 'breaking' | 'deprecated' | 'semantic';

export interface ModeInterfaceChange {
  readonly changeId: string;
  readonly kind: ModeInterfaceChangeKind;
  readonly fromVersion: ModeInterfaceVersion;
  readonly toVersion: ModeInterfaceVersion;
  readonly safeDefaults: Readonly<Record<string, unknown>>;
  readonly deprecatedFields: readonly string[];
}

export interface ModeCompatibilityAdapter {
  readonly adapterId: string;
  readonly fromVersion: ModeInterfaceVersion;
  readonly toVersion: ModeInterfaceVersion;
  readonly deterministic: true;
}

export interface ModeResumeAdapterDeclaration {
  readonly adapterId: string;
  readonly fromInterfaceVersion: ModeInterfaceVersion;
  readonly toInterfaceVersion: typeof MODE_CONTRACT_INTERFACE_VERSION;
  readonly deterministic: true;
  readonly requiredChecks: readonly (keyof ModeResumeEvidence)[];
}

export interface ModeWriteResource {
  readonly resource: string;
  readonly conflictKey: string;
  readonly owner: {
    readonly kind: 'mode-reducer' | 'substrate-service';
    readonly ownerId: string;
  };
  readonly mutation: 'append-event' | 'replace-projection' | 'shadow-project';
  readonly serialization: 'fenced-lease' | 'single-writer' | null;
}

export interface ModeWriteSet {
  readonly resources: readonly ModeWriteResource[];
  readonly legacyProjection: 'required';
  readonly ledgerPosture: 'shadow-write';
  readonly authority: 'legacy';
}

export interface ModeDescriptor {
  readonly modeId: ModeWorkstreamId;
  readonly displayName: string;
  readonly interfaceVersion: typeof MODE_CONTRACT_INTERFACE_VERSION;
  readonly interfaceShape: typeof MODE_CONTRACT_SHAPE;
  readonly compatibilityPolicyVersion: typeof MODE_COMPATIBILITY_POLICY_VERSION;
  readonly providedCapabilities: readonly ModeProvidedCapability[];
  readonly requiredPorts: readonly ModeSubstratePortName[];
  readonly migrationPosture: 'additive-dark';
  readonly legacyAuthority: 'authoritative';
  readonly ledgerAuthority: 'shadow-only';
  readonly writeSet: ModeWriteSet;
  readonly compatibilityChanges: readonly ModeInterfaceChange[];
  readonly compatibilityAdapters: readonly ModeCompatibilityAdapter[];
  readonly resumeAdapters: readonly ModeResumeAdapterDeclaration[];
}

// ───────────────────────────────────────────────────────────────────
// 7. MODE CONTRACT
// ───────────────────────────────────────────────────────────────────

export interface ModeContract<
  TState extends JsonObject = JsonObject,
  TSnapshot extends JsonObject = JsonObject,
> {
  readonly reducers: ModeReducerSet<TState>;
  readonly artifactPolicies: readonly ModeArtifactPolicy[];
  readonly certificatePolicies: readonly ModeCertificatePolicy[];
  describe(): ModeDescriptor;
  eventTypes(): readonly ModeEventSchema[];
  reduce(
    event: VerifiedLedgerEvent,
    state: Readonly<TState>,
  ): ModeReductionResult<TState>;
  sealArtifacts(
    state: Readonly<TState>,
    context: ModeArtifactContext,
  ): readonly ModeArtifactEvidence[];
  issueCertificate(evidence: ModeCertificateEvidence): ModeCertificate;
  convergenceHooks(): ModeConvergenceHooks;
  classifyResume(snapshot: ModeResumeSnapshot<TSnapshot>): ModeResumeOutcome;
  upcastResume(
    snapshot: ModeResumeSnapshot<TSnapshot>,
  ): ModeResumeUpcastResult<TSnapshot>;
  restoreResume(
    snapshot: ModeResumeSnapshot<TSnapshot>,
    services: ModeSubstratePorts,
  ): ModeRestoreResult<TState> | Promise<ModeRestoreResult<TState>>;
}
