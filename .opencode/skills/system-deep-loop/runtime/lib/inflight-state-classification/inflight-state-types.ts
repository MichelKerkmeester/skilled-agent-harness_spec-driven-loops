// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Classification Types
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const InflightDisposition = {
  UPCAST: 'UPCAST',
  PIN: 'PIN',
  FORK: 'FORK',
  MIGRATE: 'MIGRATE',
  BLOCK: 'BLOCK',
} as const;

export type InflightDisposition =
  typeof InflightDisposition[keyof typeof InflightDisposition];

export const ClassificationReasonCodes = {
  UPCAST_PROVEN: 'UPCAST_PROVEN',
  PIN_LEGACY_BOUNDED: 'PIN_LEGACY_BOUNDED',
  FORK_ISOLATED: 'FORK_ISOLATED',
  MIGRATION_REVERSIBLE: 'MIGRATION_REVERSIBLE',
  POLICY_BLOCK: 'POLICY_BLOCK',
  MISSING_EVIDENCE: 'MISSING_EVIDENCE',
  INVALID_EVIDENCE: 'INVALID_EVIDENCE',
  CORRUPT_STATE: 'CORRUPT_STATE',
  UNKNOWN_SHAPE: 'UNKNOWN_SHAPE',
  LEGACY_AUTHORITY_REQUIRED: 'LEGACY_AUTHORITY_REQUIRED',
  ROLLBACK_ANCHOR_UNSAFE: 'ROLLBACK_ANCHOR_UNSAFE',
  LEASE_STATE_UNSAFE: 'LEASE_STATE_UNSAFE',
  PENDING_EFFECTS_UNSAFE: 'PENDING_EFFECTS_UNSAFE',
  UPCAST_UNSAFE: 'UPCAST_UNSAFE',
  PIN_UNSAFE: 'PIN_UNSAFE',
  FORK_UNSAFE: 'FORK_UNSAFE',
  MIGRATION_UNSAFE: 'MIGRATION_UNSAFE',
  CLASSIFICATION_STALE: 'CLASSIFICATION_STALE',
  MANIFEST_INTEGRITY_FAILED: 'MANIFEST_INTEGRITY_FAILED',
  RECEIPT_INCOMPLETE: 'RECEIPT_INCOMPLETE',
  VERIFIER_FAILED: 'VERIFIER_FAILED',
} as const;

export type ClassificationReasonCode =
  typeof ClassificationReasonCodes[keyof typeof ClassificationReasonCodes];

export const ClassificationErrorCodes = {
  INVALID_CENSUS_BYTES: 'INFLIGHT_INVALID_CENSUS_BYTES',
  CENSUS_DIGEST_MISMATCH: 'INFLIGHT_CENSUS_DIGEST_MISMATCH',
  CENSUS_SCHEMA_MISMATCH: 'INFLIGHT_CENSUS_SCHEMA_MISMATCH',
  CENSUS_BASE_MISMATCH: 'INFLIGHT_CENSUS_BASE_MISMATCH',
  CENSUS_ROW_INVALID: 'INFLIGHT_CENSUS_ROW_INVALID',
  CENSUS_DUPLICATE_ROW: 'INFLIGHT_CENSUS_DUPLICATE_ROW',
  CENSUS_ROW_MISSING: 'INFLIGHT_CENSUS_ROW_MISSING',
  CENSUS_ROW_UNRECOGNIZED: 'INFLIGHT_CENSUS_ROW_UNRECOGNIZED',
  EVIDENCE_DUPLICATE_ROW: 'INFLIGHT_EVIDENCE_DUPLICATE_ROW',
  EVIDENCE_UNRECOGNIZED_ROW: 'INFLIGHT_EVIDENCE_UNRECOGNIZED_ROW',
  MANIFEST_INVALID: 'INFLIGHT_MANIFEST_INVALID',
} as const;

export type ClassificationErrorCode =
  typeof ClassificationErrorCodes[keyof typeof ClassificationErrorCodes];

export type WorkflowMode =
  | 'research'
  | 'review'
  | 'ai-council'
  | 'agent-improvement'
  | 'model-benchmark'
  | 'skill-benchmark'
  | 'alignment';

export type LegacyAuthorityState =
  | 'legacy_authoritative'
  | 'shadowing'
  | 'cutover_ready'
  | 'new_authoritative_reversible'
  | 'rollback_pending'
  | 'new_authoritative_final';

export type LeaseState = 'none' | 'quiescent' | 'active' | 'uncertain';

export type PendingEffectsState =
  | 'none'
  | 'reconciled'
  | 'active-legacy'
  | 'uncertain';

export type ShapeStatus = 'registered' | 'unknown' | 'future' | 'malformed';

// ───────────────────────────────────────────────────────────────────
// 2. FROZEN CENSUS CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Immutable census, policy, migration-model, and rollback minima consumed by the classifier. */
export interface FrozenCensusContract {
  readonly schemaVersion: 2;
  readonly baseSha: string;
  readonly stateBackendCensusSha256: string;
  readonly stateBackendRowCount: number;
  readonly transitionPolicyRevision: string;
  readonly transitionPolicySha256: string;
  readonly phaseTreeSha256: string;
  readonly rollbackMinimumDays: 14;
  readonly rollbackMinimumSuccessfulRuns: 5;
}

/** Bounded metadata for one persisted-state surface in the frozen census. */
export interface StateBackendCensusRow {
  readonly id: string;
  readonly surface: string;
  readonly mutability: string;
  readonly resolvedPath: string;
  readonly owner: string;
  readonly lifecycle: string;
  readonly recovery: string;
  readonly archivalReader: string;
  readonly authority: string;
  readonly fixture: string;
  readonly evidence: string;
}

/** Parsed census document accepted only after byte and closure verification. */
export interface StateBackendCensus {
  readonly schemaVersion: number;
  readonly baseSha: string;
  readonly rows: readonly StateBackendCensusRow[];
  readonly discovery: Readonly<Record<string, unknown>>;
}

/** One explicit disposition and durable rationale for one exact census row. */
export interface FrozenCensusRowPolicy {
  readonly disposition: InflightDisposition;
  readonly modes: readonly WorkflowMode[];
  readonly rationale: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CLASS-SPECIFIC EVIDENCE
// ───────────────────────────────────────────────────────────────────

/** Restoration evidence retained through both rollback-window minimums. */
export interface RollbackAnchorEvidence {
  readonly anchorId: string;
  readonly digest: string;
  readonly retained: boolean;
  readonly restorable: boolean;
  readonly minimumRetentionDays: number;
  readonly minimumSuccessfulRuns: number;
}

/** Content-addressed result from a class-specific verifier. */
export interface VerifierEvidence {
  readonly verified: boolean;
  readonly receiptDigest: string;
  readonly replayFingerprintDigest: string | null;
  readonly rollbackScenarioDigest: string;
  readonly parityCaseDigest: string | null;
}

/** Proof that a source can receive a pure effective shape without rewriting storage. */
export interface UpcastProof {
  readonly kind: 'upcast';
  readonly adjacentChainComplete: boolean;
  readonly pure: boolean;
  readonly deterministic: boolean;
  readonly sideEffectFree: boolean;
  readonly sourceBytesPreserved: boolean;
  readonly immutableIdentityPreserved: boolean;
  readonly replayEquivalent: boolean;
  readonly sourceBytesDigest: string;
  readonly effectiveStateDigest: string;
  readonly registryDigest: string;
  readonly chainIdentitiesDigest: string;
}

/** Proof that active work can finish under bounded legacy-only authority. */
export interface PinProof {
  readonly kind: 'pin';
  readonly legacyWriterSoleAuthority: boolean;
  readonly legacyCompletionAvailable: boolean;
  readonly boundedCompletion: boolean;
  readonly timedOut: boolean;
  readonly terminalBoundary: string;
  readonly terminalReceiptRequired: boolean;
}

/** Proof that a diagnostic copy is isolated from authority, budgets, and live effects. */
export interface ForkProof {
  readonly kind: 'fork';
  readonly executionNamespace: string;
  readonly effectNamespace: string;
  readonly shadowOnlySink: boolean;
  readonly livePublicationEnabled: boolean;
  readonly sourceStateUnchanged: boolean;
  readonly authorityUnaffected: boolean;
  readonly budgetsUnaffected: boolean;
}

/** Proof that a complete checkpoint can move atomically and restore from legacy state. */
export interface MigrateProof {
  readonly kind: 'migrate';
  readonly quiescentCheckpoint: boolean;
  readonly transactionalSnapshot: boolean;
  readonly atomicImport: boolean;
  readonly reversible: boolean;
  readonly identityPreserved: boolean;
  readonly orderPreserved: boolean;
  readonly idempotencyPreserved: boolean;
  readonly budgetsPreserved: boolean;
  readonly receiptsPreserved: boolean;
  readonly pendingWorkPreserved: boolean;
  readonly checkpointDigest: string;
  readonly restorationReceiptDigest: string;
}

/** Explicit safety veto retained for audit. */
export interface BlockProof {
  readonly kind: 'block';
  readonly veto: string;
}

export type DispositionProof =
  | UpcastProof
  | PinProof
  | ForkProof
  | MigrateProof
  | BlockProof;

/** Bounded state metadata and class proof supplied without source payload bytes. */
export interface ClassificationEvidence {
  readonly rowId: string;
  readonly isPresent: boolean;
  readonly stateDigest: string;
  readonly shapeVersion: string;
  readonly shapeStatus: ShapeStatus;
  readonly schemaDigest: string;
  readonly lifecyclePoint: string;
  readonly authorityState: LegacyAuthorityState;
  readonly authorityEpoch: number;
  readonly mutability: string;
  readonly leaseState: LeaseState;
  readonly activeLeaseCount: number;
  readonly leaseSetDigest: string;
  readonly pendingEffectsState: PendingEffectsState;
  readonly pendingEffectSetDigest: string;
  readonly identityCoverage: boolean;
  readonly orderCoverage: boolean;
  readonly idempotencyCoverage: boolean;
  readonly budgetCoverage: boolean;
  readonly receiptCoverage: boolean;
  readonly pendingWorkCoverage: boolean;
  readonly isCorrupt: boolean;
  readonly rollbackAnchor: RollbackAnchorEvidence;
  readonly verifier: VerifierEvidence;
  readonly proof: DispositionProof;
}

// ───────────────────────────────────────────────────────────────────
// 4. MANIFEST AND HANDLING OUTPUTS
// ───────────────────────────────────────────────────────────────────

/** Sanitized evidence fields committed into one manifest row. */
export interface ClassifiedEvidenceSnapshot {
  readonly isPresent: boolean | null;
  readonly stateDigest: string | null;
  readonly shapeVersion: string | null;
  readonly shapeStatus: ShapeStatus | null;
  readonly schemaDigest: string | null;
  readonly lifecyclePoint: string | null;
  readonly authorityState: LegacyAuthorityState | null;
  readonly authorityEpoch: number | null;
  readonly mutability: string | null;
  readonly leaseState: LeaseState | null;
  readonly leaseSetDigest: string | null;
  readonly pendingEffectsState: PendingEffectsState | null;
  readonly pendingEffectSetDigest: string | null;
  readonly identityCoverage: boolean | null;
  readonly orderCoverage: boolean | null;
  readonly idempotencyCoverage: boolean | null;
  readonly budgetCoverage: boolean | null;
  readonly receiptCoverage: boolean | null;
  readonly pendingWorkCoverage: boolean | null;
  readonly rollbackAnchorId: string | null;
  readonly rollbackAnchorDigest: string | null;
  readonly verifierReceiptDigest: string | null;
  readonly replayFingerprintDigest: string | null;
  readonly rollbackScenarioDigest: string | null;
  readonly parityCaseDigest: string | null;
  readonly proofDigest: string | null;
  readonly freshnessDigest: string | null;
}

/** Exactly one auditable handling disposition for one census row. */
export interface ClassifiedInflightStateRow {
  readonly rowId: string;
  readonly censusRowDigest: string;
  readonly modes: readonly WorkflowMode[];
  readonly disposition: InflightDisposition;
  readonly reasonCode: ClassificationReasonCode;
  readonly rationale: string;
  readonly evidence: ClassifiedEvidenceSnapshot;
}

/** Per-mode disposition counts used by the readiness gate. */
export interface ModeClassificationSummary {
  readonly mode: WorkflowMode;
  readonly rowCount: number;
  readonly liveRowCount: number;
  readonly liveBlockedRowCount: number;
  readonly dispositions: Readonly<Record<InflightDisposition, number>>;
}

/** Machine-verifiable totality and fail-closed closure counters. */
export interface ClassificationClosure {
  readonly censusRows: number;
  readonly classifiedRows: number;
  readonly missingCensusRows: 0;
  readonly duplicateCensusRows: 0;
  readonly unrecognizedCensusRows: 0;
  readonly duplicateManifestRows: 0;
  readonly unknownDispositionRows: 0;
  readonly missingEvidenceRows: number;
  readonly invalidEvidenceRows: number;
  readonly blockedRows: number;
  readonly liveBlockedRows: number;
}

/** Self-hash input that binds the complete classification without its final commitment. */
export interface InflightClassificationManifestCore {
  readonly manifestVersion: 1;
  readonly classificationId: string;
  readonly classifiedAt: string;
  readonly classifierBuildId: string;
  readonly census: FrozenCensusContract;
  readonly authorityPosture: 'legacy-authoritative-dark';
  readonly authorityMutationPermitted: false;
  readonly legacyRetirementPermitted: false;
  readonly rows: readonly ClassifiedInflightStateRow[];
  readonly modeSummaries: readonly ModeClassificationSummary[];
  readonly closure: ClassificationClosure;
}

/** Immutable manifest whose final digest commits the core fields. */
export interface InflightClassificationManifest
  extends InflightClassificationManifestCore {
  readonly finalDigest: string;
}

/** Manifest plus its canonical persisted bytes. */
export interface BuiltClassificationManifest {
  readonly manifest: InflightClassificationManifest;
  readonly canonicalBytes: Uint8Array;
}

/** Read-only inputs required to classify the frozen census. */
export interface CreateClassificationManifestInput {
  readonly classificationId: string;
  readonly classifiedAt: string;
  readonly classifierBuildId: string;
  readonly censusBytes: Uint8Array;
  readonly evidence: readonly unknown[];
}

/** Freshness-checked row instruction that cannot mutate authority. */
export interface Phase014HandlingInstruction {
  readonly rowId: string;
  readonly modes: readonly WorkflowMode[];
  readonly classifiedDisposition: InflightDisposition;
  readonly instruction: InflightDisposition;
  readonly reasonCode: ClassificationReasonCode;
  readonly isLive: boolean;
  readonly freshnessDigest: string | null;
}

/** Self-hash input for a read-only handling plan. */
export interface Phase014HandlingPlanCore {
  readonly planVersion: 1;
  readonly manifestDigest: string;
  readonly authorityPosture: 'legacy-authoritative-dark';
  readonly authorityMutationPermitted: false;
  readonly instructions: readonly Phase014HandlingInstruction[];
}

/** Read-only handling plan bound to one classification manifest. */
export interface Phase014HandlingPlan extends Phase014HandlingPlanCore {
  readonly finalDigest: string;
}

/** Receipts required before a mode can be considered cutover-ready. */
export interface Phase014EvidenceReceipts {
  readonly rollbackRehearsalReceiptDigest: string | null;
  readonly terminalPinReceipts: Readonly<Record<string, string>>;
  readonly forkParityReceipts: Readonly<Record<string, string>>;
  readonly migrationReceipts: Readonly<Record<string, string>>;
  readonly failedVerifierRowIds: readonly string[];
}

/** Readiness verdict only; authority mutation is deliberately unavailable. */
export interface ModeCutoverReadiness {
  readonly mode: WorkflowMode;
  readonly eligible: boolean;
  readonly authorityMutationPermitted: false;
  readonly reasonCodes: readonly ClassificationReasonCode[];
  readonly blockedRowIds: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 5. ERRORS
// ───────────────────────────────────────────────────────────────────

/** Fail-closed structural error that never includes state payloads. */
export class InflightClassificationError extends Error {
  public readonly code: ClassificationErrorCode;
  public readonly details: Readonly<Record<string, boolean | number | string>>;

  public constructor(
    code: ClassificationErrorCode,
    message: string,
    details: Readonly<Record<string, boolean | number | string>> = {},
  ) {
    super(message);
    this.name = 'InflightClassificationError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
