// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Types
// ───────────────────────────────────────────────────────────────────

import type { AppendOnlyLedger } from '../authorized-ledger/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  ReplayFingerprintDescriptor,
  VerifyReplayFingerprintInput,
} from '../replay-fingerprint/index.js';
import type {
  ArtifactReferenceSet,
  ArtifactReplayInput,
  SealedArtifactStore,
} from '../sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. MANIFEST CONTRACTS
// ───────────────────────────────────────────────────────────────────

export const SHADOW_PARITY_SCHEMA_VERSION = 1;
export const MINIMUM_DETERMINISTIC_RUNS = 2;
export const TRANSITION_ROLLBACK_MINIMUM_DAYS = 14;
export const TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS = 5;

/** Observable classes that a case must close before fingerprint comparison. */
export type ParityObservationClass =
  | 'terminal-status'
  | 'return-value'
  | 'error-halt'
  | 'ordered-transitions'
  | 'effect-receipts'
  | 'budgets'
  | 'emitted-artifacts'
  | 'reader-results';

/** Frozen baseline row that cannot be removed or reclassified during comparison. */
export interface ParityBaselineRow {
  readonly scenarioId: string;
  readonly mode: string;
  readonly contractDigest: string;
  readonly disposition: 'known-defect' | 'protected';
}

/** Executable comparison boundary for one baseline scenario. */
export interface ParityCaseDefinition {
  readonly caseId: string;
  readonly scenarioId: string;
  readonly mode: string;
  readonly contractDigest: string;
  readonly requiredObservations: readonly ParityObservationClass[];
  readonly projectionIds: readonly string[];
  readonly timeoutMs: number;
  readonly terminationPolicy: string;
}

/** Closed, mode-addressable case set committed to one immutable baseline. */
export interface ParityCaseManifest {
  readonly schemaVersion: typeof SHADOW_PARITY_SCHEMA_VERSION;
  readonly baseSha: string;
  readonly baselineRows: readonly ParityBaselineRow[];
  readonly cases: readonly ParityCaseDefinition[];
  readonly caseCount: number;
  readonly manifestDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. SEALED EXECUTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Inputs whose equality must be proven before either execution path starts. */
export interface ParityCaseCapsule {
  readonly baseSha: string;
  readonly baseDigest: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly canonicalizationVersions: Readonly<Record<string, string>>;
  readonly artifactReferenceSet: ArtifactReferenceSet;
  readonly timeoutMs: number;
  readonly terminationPolicy: string;
}

/** Services used to resolve one claimed reference set back to immutable evidence. */
export interface ParitySealedInputBoundary {
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly capsule: ParityCaseCapsule;
}

/** Shared immutable capsule released only after both path claims verify identically. */
export interface VerifiedParityCaseCapsule {
  readonly capsuleDigest: string;
  readonly referenceSetDigest: string;
  readonly replayInput: ArtifactReplayInput;
  readonly baseSha: string;
  readonly baseDigest: string;
  readonly initialStateDigest: string;
  readonly configurationDigest: string;
  readonly canonicalizationVersions: Readonly<Record<string, string>>;
  readonly timeoutMs: number;
  readonly terminationPolicy: string;
}

/** Suppressed effect observation retained for comparison without dispatching live work. */
export interface ShadowEffectReceipt extends JsonObject {
  readonly intent_digest: string;
  readonly receipt_digest: string;
  readonly status: 'suppressed';
}

/** In-memory sink exposed to both paths so comparable intent never becomes a live effect. */
export interface ShadowEffectSink {
  record(intent: JsonValue): ShadowEffectReceipt;
  receipts(): readonly ShadowEffectReceipt[];
}

/** Exact legacy-shaped bytes and reader boundary captured by one path. */
export interface ParityProjectionObservation {
  readonly artifactId: string;
  readonly bytes: Uint8Array;
  readonly readerResult: JsonValue;
  readonly publicationBoundary: string;
  readonly watermarkDigest: string;
  readonly integrityDigest: string;
}

/** Captured output plus the immutable attestation lookup needed by the shared verifier. */
export interface ParityPathExecution<TState extends JsonObject> {
  readonly verification: VerifyReplayFingerprintInput<TState>;
  readonly observations: Readonly<Partial<Record<ParityObservationClass, JsonValue>>>;
  readonly projections: readonly ParityProjectionObservation[];
}

/** Only capabilities supplied to an isolated legacy or dark execution adapter. */
export interface ParityExecutionContext {
  readonly path: 'dark' | 'legacy';
  readonly caseDefinition: ParityCaseDefinition;
  readonly executionRoot: string;
  readonly capsule: VerifiedParityCaseCapsule;
  readonly effectSink: ShadowEffectSink;
  readonly signal: AbortSignal;
  readonly runIndex: number;
}

/** Runtime adapter invoked inside a harness-owned isolated root. */
export type ParityPathExecutor<TState extends JsonObject> = (
  context: ParityExecutionContext,
) => Promise<ParityPathExecution<TState>>;

/** Complete input for one repeated legacy-versus-dark comparison. */
export interface RunShadowParityCaseInput<TState extends JsonObject> {
  readonly caseDefinition: ParityCaseDefinition;
  readonly shadowRootDirectory: string;
  readonly protectedRoots: readonly string[];
  readonly legacy: ParitySealedInputBoundary;
  readonly dark: ParitySealedInputBoundary;
  readonly executeLegacy: ParityPathExecutor<TState>;
  readonly executeDark: ParityPathExecutor<TState>;
  readonly deterministicRuns?: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVIDENCE AND DIVERGENCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Closed failure vocabulary; every class blocks certificate issuance. */
export type ParityDivergenceClass =
  | 'input-inequivalent'
  | 'harness-invalid'
  | 'replay-contract-drift'
  | 'execution-outcome'
  | 'effective-event'
  | 'projection-semantic'
  | 'legacy-byte'
  | 'missing-observation'
  | 'nondeterministic';

/** Bounded mismatch location that never contains protected payload bytes. */
export interface ParityDivergenceLocation {
  readonly component: string;
  readonly sequence: number | null;
  readonly hop: number | null;
  readonly stage: string;
}

/** Immutable evidence for the earliest determinable blocking mismatch. */
export interface ParityDivergenceRecord {
  readonly divergenceId: string;
  readonly caseId: string;
  readonly mode: string;
  readonly class: ParityDivergenceClass;
  readonly owner: string;
  readonly runIndex: number;
  readonly baseSha: string;
  readonly referenceSetDigest: string | null;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
  readonly earliest: ParityDivergenceLocation;
  readonly message: string;
  readonly status: 'open';
}

/** Independently verified path descriptor retained without treating it as the peer oracle. */
export interface ParityFingerprintEvidence {
  readonly finalDigest: string;
  readonly descriptorDigest: string;
  readonly storedDigest: string;
  readonly effectiveEventDigest: string;
  readonly projectionDigest: string;
  readonly replayContractDigest: string;
  readonly sealedInputDigest: string;
  readonly attestationSequence: number;
  readonly descriptor: ReplayFingerprintDescriptor;
}

/** Complete evidence for one deterministic repeated comparison. */
export interface ParityRunEvidence {
  readonly runIndex: number;
  readonly legacy: ParityFingerprintEvidence;
  readonly dark: ParityFingerprintEvidence;
  readonly observationDigest: string;
  readonly legacyProjectionDigest: string;
  readonly darkProjectionDigest: string;
  readonly runEvidenceDigest: string;
}

export interface ShadowParityCasePass {
  readonly ok: true;
  readonly caseId: string;
  readonly mode: string;
  readonly referenceSetDigest: string;
  readonly capsuleDigest: string;
  readonly runs: readonly ParityRunEvidence[];
  readonly evidenceDigest: string;
  readonly openDivergenceCount: 0;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityMutation: false;
}

export interface ShadowParityCaseFailure {
  readonly ok: false;
  readonly caseId: string;
  readonly mode: string;
  readonly divergence: ParityDivergenceRecord;
  readonly openDivergenceCount: 1;
  readonly authorityState: 'legacy_authoritative';
  readonly authorityMutation: false;
}

/** Failed cases have no pass evidence and cannot be relabeled by callers. */
export type ShadowParityCaseResult =
  | ShadowParityCasePass
  | ShadowParityCaseFailure;

// ───────────────────────────────────────────────────────────────────
// 4. CERTIFICATE CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Identities whose drift invalidates parity evidence before any authority decision. */
export interface ParityCertificateBindings extends JsonObject {
  readonly candidate_build_digest: string;
  readonly harness_digest: string;
  readonly comparator_digest: string;
  readonly replay_contract_digest: string;
  readonly reducer_digest: string;
  readonly projection_digest: string;
  readonly adapter_digest: string;
  readonly policy_version: string;
}

/** Immutable mode-scoped parity evidence; it carries no authority mutation capability. */
export interface ParityCertificate extends JsonObject {
  readonly schema_version: typeof SHADOW_PARITY_SCHEMA_VERSION;
  readonly mode: string;
  readonly base_sha: string;
  readonly manifest_digest: string;
  readonly case_ids: string[];
  readonly case_evidence_digests: string[];
  readonly reference_set_digests: string[];
  readonly attestation_final_digests: string[];
  readonly bindings: ParityCertificateBindings;
  readonly evidence_digest: string;
  readonly open_divergence_count: 0;
  readonly authority_state: 'legacy_authoritative';
  readonly authority_mutation: false;
  readonly rollback_minimum_days: typeof TRANSITION_ROLLBACK_MINIMUM_DAYS;
  readonly rollback_minimum_successful_runs:
    typeof TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS;
  readonly certificate_digest: string;
}

export type ParityCertificateRefusalCode =
  | 'ZERO_DISCOVERY'
  | 'PARTIAL_CASE_SET'
  | 'OPEN_DIVERGENCE'
  | 'DUPLICATE_CONFLICT'
  | 'WRONG_MODE'
  | 'STALE_EVIDENCE'
  | 'UNVERIFIABLE';

export interface ParityCertificateRefusal {
  readonly code: ParityCertificateRefusalCode;
  readonly message: string;
  readonly expectedDigest: string | null;
  readonly actualDigest: string | null;
}

export type ParityCertificateIssuanceResult =
  | { readonly ok: true; readonly certificate: ParityCertificate }
  | { readonly ok: false; readonly refusal: ParityCertificateRefusal };

export type ParityCertificateVerificationResult =
  | { readonly ok: true; readonly certificateDigest: string }
  | { readonly ok: false; readonly refusal: ParityCertificateRefusal };

// ───────────────────────────────────────────────────────────────────
// 5. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

export const ShadowParityErrorCodes = Object.freeze({
  INVALID_INPUT: 'INVALID_INPUT',
  MANIFEST_GAP: 'MANIFEST_GAP',
  MANIFEST_CONFLICT: 'MANIFEST_CONFLICT',
  ISOLATION_FAILURE: 'ISOLATION_FAILURE',
} as const);

export type ShadowParityErrorCode =
  typeof ShadowParityErrorCodes[keyof typeof ShadowParityErrorCodes];

/** Structural errors stop setup before a case can be treated as executed. */
export class ShadowParityError extends Error {
  public readonly code: ShadowParityErrorCode;
  public readonly details: Readonly<Record<string, string | number | null>>;

  public constructor(
    code: ShadowParityErrorCode,
    message: string,
    details: Readonly<Record<string, string | number | null>> = {},
  ) {
    super(message);
    this.name = 'ShadowParityError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
