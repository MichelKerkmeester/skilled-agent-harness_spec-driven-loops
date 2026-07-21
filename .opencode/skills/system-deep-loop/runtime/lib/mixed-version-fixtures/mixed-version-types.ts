// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Fixture Types
// ───────────────────────────────────────────────────────────────────

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  ParityCaseManifest,
  ParityExecutionContext,
} from '../shadow-parity/index.js';
import type {
  SealedArtifactReference,
  SealedArtifactStore,
} from '../sealed-reference-artifacts/index.js';

export type MixedVersionScenarioFamily =
  | 'pure-old'
  | 'pure-new'
  | 'mid-upgrade'
  | 'interrupted-migration';

export type MixedVersionResumeClassification =
  | 'upcast'
  | 'pin-legacy'
  | 'fork'
  | 'migrate'
  | 'block';

/** Exact causal point shared by stored records and both replay paths. */
export interface MixedVersionCausalBoundary extends JsonObject {
  readonly runId: string;
  readonly streamId: string;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly boundarySequence: number;
  readonly continuityId: string;
}

/** Stored event bytes with an independently declared wire version. */
export interface MixedVersionEventInput extends JsonObject {
  readonly eventId: string;
  readonly storedVersion: number;
  readonly causalPosition: number;
  readonly serializedEnvelope: string;
}

/** Stored state bytes with an independently declared representation version. */
export interface MixedVersionStateInput extends JsonObject {
  readonly stateId: string;
  readonly storedVersion: number;
  readonly serializedState: string;
}

/** One immutable transition authored from contract evidence. */
export interface AuthoredStateTransition extends JsonObject {
  readonly from: string;
  readonly eventId: string;
  readonly to: string;
}

/** Complete expected observation set that cannot be derived from a tested reducer. */
export interface AuthoredMixedVersionOutcome extends JsonObject {
  readonly provenance: 'authored-contract-evidence';
  readonly acceptedEventIds: string[];
  readonly rejectedEventIds: string[];
  readonly stateTransitions: AuthoredStateTransition[];
  readonly terminalResult: string;
  readonly pendingEffects: string[];
  readonly receipts: string[];
  readonly effectExecutions: string[];
  readonly outputArtifacts: string[];
  readonly resumeClassification: MixedVersionResumeClassification | null;
  readonly eventHopTrace: string[][];
  readonly stateHopTrace: string[];
}

/** One restart lease whose fencing state constrains safe resume handling. */
export interface MixedVersionRestartLease extends JsonObject {
  readonly leaseId: string;
  readonly fencingToken: number;
  readonly state: 'quiescent' | 'active' | 'uncertain';
}

/** Receipt identity explicitly bound to the pending effect it acknowledges. */
export interface MixedVersionRestartReceipt extends JsonObject {
  readonly effectId: string;
  readonly receiptId: string;
}

/** Replay-bound restart state used to produce in-flight classification evidence. */
export interface MixedVersionRestartMetadata extends JsonObject {
  readonly stopSequence: number | null;
  readonly pendingEffects: string[];
  readonly receipts: MixedVersionRestartReceipt[];
  readonly leases: MixedVersionRestartLease[];
  readonly continuityId: string | null;
}

/** Closed set of values that can affect deterministic replay. */
export interface MixedVersionReplayInputs extends JsonObject {
  readonly prompts: JsonValue;
  readonly initialState: JsonValue;
  readonly configuration: JsonValue;
  readonly evaluatorMaterial: JsonValue;
  readonly priorOutputs: JsonValue;
  readonly versionPolicy: JsonValue;
  readonly environment: JsonValue;
  readonly eventStream: JsonValue;
  readonly restartMetadata: MixedVersionRestartMetadata;
}

/** Frozen classifier inputs that exclude evidence owned by the verified fixture. */
export interface MixedVersionResumeClassifierConfig {
  readonly classificationId: string;
  readonly classifiedAt: string;
  readonly classifierBuildId: string;
  readonly censusBytes: Uint8Array;
  readonly rowId: string;
}

/** Versioned fixture envelope shared by every mode workstream. */
export interface MixedVersionCase extends JsonObject {
  readonly fixtureSchemaVersion: 1;
  readonly caseId: string;
  readonly workstream: string;
  readonly mode: string;
  readonly scenarioFamily: MixedVersionScenarioFamily;
  readonly interfaceVersion: string;
  readonly eventVersions: number[];
  readonly stateVersion: number;
  readonly causalBoundary: MixedVersionCausalBoundary;
  readonly events: MixedVersionEventInput[];
  readonly state: MixedVersionStateInput;
  readonly comparableVersionPair: string;
  readonly sourceContractIdentities: string[];
  readonly replayInputs: MixedVersionReplayInputs;
  readonly expected: AuthoredMixedVersionOutcome;
}

/** Sealed case input exposed to reducers without the oracle's authored evidence. */
export type MixedVersionExecutionFixture = Omit<MixedVersionCase, 'expected'>;

/** Ordered content-addressed reference within a compiled case capsule. */
export interface SealedMixedVersionInput extends JsonObject {
  readonly key: string;
  readonly reference: SealedArtifactReference;
}

/** Published capsule identity released by the seal compiler. */
export interface CompiledMixedVersionCase {
  readonly caseId: string;
  readonly capsuleReference: SealedArtifactReference;
  readonly orderedInputs: readonly SealedMixedVersionInput[];
  readonly capsuleDigest: string;
}

/** Stored/effective version and exact-hop evidence from the canonical adapters. */
export interface MixedVersionCompatibilityObservation {
  readonly eventStoredVersions: readonly number[];
  readonly eventEffectiveVersions: readonly number[];
  readonly eventHopTrace: readonly (readonly string[])[];
  readonly eventSourceDigests: readonly string[];
  readonly stateStoredVersion: number;
  readonly stateEffectiveVersion: number;
  readonly stateHopTrace: readonly string[];
  readonly stateSourceDigest: string;
}

/** Complete reducer and resume observation compared with authored evidence. */
export interface MixedVersionReducerObservation extends JsonObject {
  readonly acceptedEventIds: string[];
  readonly rejectedEventIds: string[];
  readonly stateTransitions: AuthoredStateTransition[];
  readonly terminalResult: string;
  readonly pendingEffects: string[];
  readonly receipts: string[];
  readonly effectExecutions: string[];
  readonly outputArtifacts: string[];
  readonly resumeClassification: MixedVersionResumeClassification | null;
}

/** Isolated path context with no authority or live-effect capability. */
export interface MixedVersionExecutionContext extends Pick<
  ParityExecutionContext,
  'executionRoot' | 'path' | 'runIndex'
> {
  readonly fixture: MixedVersionExecutionFixture;
}

export type MixedVersionReducerExecutor = (
  context: MixedVersionExecutionContext,
) => MixedVersionReducerObservation | Promise<MixedVersionReducerObservation>;

/** Services and path executors required for one fail-closed oracle run. */
export interface MixedVersionOracleInput {
  readonly store: SealedArtifactStore;
  readonly compiled: CompiledMixedVersionCase;
  readonly compatibility: MixedVersionCompatibilityPort;
  readonly executeLegacy: MixedVersionReducerExecutor;
  readonly executeDark: MixedVersionReducerExecutor;
  readonly resumeClassifier?: MixedVersionResumeClassifierConfig;
  readonly executionRoot: string;
}

/** Narrow compatibility boundary consumed by the oracle. */
export interface MixedVersionCompatibilityPort {
  observe(fixture: MixedVersionCase): MixedVersionCompatibilityObservation;
}

/** Trusted evidence emitted only after every blocking comparison succeeds. */
export interface MixedVersionOraclePass {
  readonly ok: true;
  readonly caseId: string;
  readonly capsuleDigest: string;
  readonly evidenceDigest: string;
  readonly deterministicRuns: 2;
  readonly parityEligible: true;
  readonly certificateEligible: true;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityMutation: false;
}

/** Bounded blocking result that cannot grant parity or certificate eligibility. */
export interface MixedVersionOracleFailure {
  readonly ok: false;
  readonly caseId: string;
  readonly code: MixedVersionFixtureErrorCode;
  readonly stage: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly parityEligible: false;
  readonly certificateEligible: false;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityMutation: false;
}

export type MixedVersionOracleResult =
  | MixedVersionOraclePass
  | MixedVersionOracleFailure;

/** Manifest-derived authored cases and their canonical parity manifest. */
export interface MixedVersionCorpus {
  readonly workstreams: readonly string[];
  readonly cases: readonly MixedVersionCase[];
  readonly parityManifest: ParityCaseManifest;
}

export const MixedVersionFixtureErrorCodes = Object.freeze({
  INVALID_FIXTURE: 'MIXED_VERSION_INVALID_FIXTURE',
  MANIFEST_DRIFT: 'MIXED_VERSION_MANIFEST_DRIFT',
  FIXTURE_REBASELINE: 'MIXED_VERSION_FIXTURE_REBASELINE',
  UNSUPPORTED_VERSION_PAIR: 'MIXED_VERSION_UNSUPPORTED_VERSION_PAIR',
  SEAL_VERIFICATION_FAILED: 'MIXED_VERSION_SEAL_VERIFICATION_FAILED',
  CAUSAL_BOUNDARY_MISMATCH: 'MIXED_VERSION_CAUSAL_BOUNDARY_MISMATCH',
  HOP_TRACE_MISMATCH: 'MIXED_VERSION_HOP_TRACE_MISMATCH',
  REDUCER_DIVERGENCE: 'MIXED_VERSION_REDUCER_DIVERGENCE',
  RESUME_DIVERGENCE: 'MIXED_VERSION_RESUME_DIVERGENCE',
  DUPLICATE_EFFECT: 'MIXED_VERSION_DUPLICATE_EFFECT',
  NONDETERMINISTIC_RERUN: 'MIXED_VERSION_NONDETERMINISTIC_RERUN',
  INPUT_INEQUALITY: 'MIXED_VERSION_INPUT_INEQUALITY',
} as const);

export type MixedVersionFixtureErrorCode =
  typeof MixedVersionFixtureErrorCodes[keyof typeof MixedVersionFixtureErrorCodes];

/** Bounded fixture failure that never carries protected replay payloads. */
export class MixedVersionFixtureError extends Error {
  public readonly code: MixedVersionFixtureErrorCode;
  public readonly stage: string;

  public constructor(
    code: MixedVersionFixtureErrorCode,
    stage: string,
    message: string,
  ) {
    super(message);
    this.name = 'MixedVersionFixtureError';
    this.code = code;
    this.stage = stage;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
