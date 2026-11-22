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

/** One input a mode's replay depends on, naming its source; a digest of it is always required. */
export interface ModeReplayInputDeclaration {
  readonly inputId: string;
  readonly source: 'artifact' | 'configuration' | 'ledger-event' | 'projection';
  readonly digestRequired: true;
}

/**
 * Declares one mode event type: schema and interface version, required fields, transition intent, the owning reducer
 * and its replay inputs.
 */
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

/**
 * Declares one reducer: the state fields it owns and the event types it folds, replaying only verified ledger events
 * into immutable output.
 */
export interface ModeReducerDefinition<TState extends JsonObject> {
  readonly reducerId: string;
  readonly reducerVersion: string;
  readonly stateVersion: string;
  readonly ownedFields: readonly (keyof TState & string)[];
  readonly inputEventTypes: readonly string[];
  readonly replaySource: 'verified-ledger-events-only';
  readonly outputRule: 'immutable';
}

/** A mode's persisted state fields together with the reducers that own them. */
export interface ModeReducerSet<TState extends JsonObject> {
  readonly persistedFields: readonly (keyof TState & string)[];
  readonly definitions: readonly ModeReducerDefinition<TState>[];
}

/** State produced by one reducer after applying an event, with the reducer id, state version and applied event id. */
export interface ModeReductionResult<TState extends JsonObject> {
  readonly reducerId: string;
  readonly stateVersion: string;
  readonly appliedEventId: string;
  readonly state: Readonly<TState>;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVIDENCE PRODUCTS
// ───────────────────────────────────────────────────────────────────

/**
 * How a mode artifact kind is identified, which inputs and events it needs, and that it is sealed through the
 * SealedArtifactStore.
 */
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

/** Source event ids and input digests an artifact is produced from. */
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

/** Evidence that a mode artifact exists, carrying exactly the fields its shape marks as required. */
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

/**
 * How a mode certificate kind is scoped and invalidated; it requires evidence references and has no authority effect.
 */
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

/** Evidence references and input digests a certificate is built from. */
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

/** A mode certificate carrying exactly the fields its shape marks as required. */
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

/**
 * One convergence signal of a given kind with its evidence references; it is an observation only and decides nothing.
 */
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

/** Stopping-clock observations with the kind and state vocabularies they draw on. */
export interface ModeStoppingClockSignals {
  readonly kinds: typeof StoppingClockKinds;
  readonly states: typeof StoppingClockStates;
  readonly observations: readonly StoppingClockObservation[];
}

/** Individual health signals plus their aggregate. */
export interface ModeHealthSignals {
  readonly signals: readonly HealthSignal[];
  readonly aggregate: HealthAggregate;
}

/** Observer hooks a mode provides for coverage, cycles, stopping clocks, value of computation and health. */
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

/**
 * Checks a resume must pass: replay fingerprint, lease, receipts, continuity identity, artifacts and pending effects.
 */
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

/** Saved mode state plus the interface version it was written under and the evidence a resume checks it against. */
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

/** Resume outcome where an adapter upcasts the snapshot to a newer interface version. */
export interface ModeResumeUpcastOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'upcast';
  readonly adapterId: string;
  readonly targetInterfaceVersion: ModeInterfaceVersion;
}

/** Resume outcome where the run stays pinned to a legacy projection. */
export interface ModeResumePinLegacyOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'pin-legacy';
  readonly legacyProjectionId: string;
}

/** Resume outcome where the run continues under a new fork identity. */
export interface ModeResumeForkOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'fork';
  readonly forkIdentity: string;
}

/** Resume outcome where the snapshot is migrated under a named migration. */
export interface ModeResumeMigrateOutcome extends ModeResumeOutcomeBase {
  readonly outcome: 'migrate';
  readonly migrationId: string;
}

/** Resume outcome that refuses the resume, listing which evidence checks failed. */
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

/**
 * One change between mode interface versions, with its kind, the safe defaults it supplies and the fields it
 * deprecates.
 */
export interface ModeInterfaceChange {
  readonly changeId: string;
  readonly kind: ModeInterfaceChangeKind;
  readonly fromVersion: ModeInterfaceVersion;
  readonly toVersion: ModeInterfaceVersion;
  readonly safeDefaults: Readonly<Record<string, unknown>>;
  readonly deprecatedFields: readonly string[];
}

/** A deterministic adapter between two mode interface versions. */
export interface ModeCompatibilityAdapter {
  readonly adapterId: string;
  readonly fromVersion: ModeInterfaceVersion;
  readonly toVersion: ModeInterfaceVersion;
  readonly deterministic: true;
}

/**
 * A deterministic adapter that resumes a snapshot into the current interface version after the named evidence checks
 * pass.
 */
export interface ModeResumeAdapterDeclaration {
  readonly adapterId: string;
  readonly fromInterfaceVersion: ModeInterfaceVersion;
  readonly toInterfaceVersion: typeof MODE_CONTRACT_INTERFACE_VERSION;
  readonly deterministic: true;
  readonly requiredChecks: readonly (keyof ModeResumeEvidence)[];
}

/** One resource a mode writes, with its conflict key, owner, mutation kind and how concurrent writes are serialized. */
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

/**
 * Every resource a mode writes; the ledger is shadow-written, the legacy projection stays required and authority stays
 * legacy.
 */
export interface ModeWriteSet {
  readonly resources: readonly ModeWriteResource[];
  readonly legacyProjection: 'required';
  readonly ledgerPosture: 'shadow-write';
  readonly authority: 'legacy';
}

/**
 * Top-level contract for one mode: identity, interface and compatibility versions, provided capabilities and the
 * declarations that follow.
 */
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

/**
 * The interface every mode implements: its reducer set and artifact and certificate policies, plus methods to describe
 * itself, reduce verified events and seal artifacts.
 */
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
