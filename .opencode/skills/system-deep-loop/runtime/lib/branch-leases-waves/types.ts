// ───────────────────────────────────────────────────────────────────
// MODULE: Branch Leases and Waves Types
// ───────────────────────────────────────────────────────────────────

import type { JsonObject } from '../event-envelope/index.js';
import type { FencedLease } from '../locks-and-fencing/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITY AND WAVE TYPES
// ───────────────────────────────────────────────────────────────────

/** Canonical coordinate tuple from which a logical branch identity is derived. */
export interface LogicalBranchCoordinates extends JsonObject {
  readonly modelId: string;
  readonly branchId: string;
  readonly replicaOrdinal: number;
  readonly derivationVersion: number;
}

/** One expanded manifest entry and its unchanged pool payload. */
export interface BranchManifestEntry<TItem = unknown> {
  readonly modelId: string;
  readonly branchId: string;
  readonly replicaOrdinal: number;
  readonly derivationVersion?: number;
  readonly invocationFingerprint: string;
  readonly poolItem: TItem;
}

/** Validated coordinate identity bound to one pool payload. */
export interface CompiledLogicalBranch<TItem = unknown> {
  readonly logicalBranchId: string;
  readonly coordinateKey: string;
  readonly coordinates: LogicalBranchCoordinates;
  readonly invocationFingerprint: string;
  readonly poolItem: TItem;
}

/** Versioned deterministic partitioning policy. */
export interface WavePolicy extends JsonObject {
  readonly policyVersion: number;
  readonly maxBranchesPerWave: number;
}

/** Ordered immutable membership and prerequisites for one admission wave. */
export interface ImmutableWave extends JsonObject {
  readonly waveId: string;
  readonly ordinal: number;
  readonly memberBranchIds: string[];
  readonly prerequisiteWaveIds: string[];
}

/** Complete deterministic wave plan bound to one manifest fingerprint. */
export interface ImmutableWavePlan extends JsonObject {
  readonly planVersion: number;
  readonly policy: WavePolicy;
  readonly manifestFingerprint: string;
  readonly planFingerprint: string;
  readonly waves: ImmutableWave[];
}

/** Compiled branch with its immutable registry and wave assignment. */
export interface RegisteredLogicalBranch<TItem = unknown>
  extends CompiledLogicalBranch<TItem> {
  readonly manifestFingerprint: string;
  readonly registrationKey: string;
  readonly waveId: string;
  readonly waveOrdinal: number;
  readonly wavePlanFingerprint: string;
}

/** Fully validated branch registry and wave plan for one run. */
export interface CompiledBranchRun<TItem = unknown> {
  readonly manifestFingerprint: string;
  readonly branches: readonly RegisteredLogicalBranch<TItem>[];
  readonly wavePlan: ImmutableWavePlan;
}

/** Optional expected fingerprint and deterministic collision-test seam. */
export interface CompileBranchRunOptions {
  readonly expectedManifestFingerprint?: string;
  readonly digestCoordinates?: (coordinates: LogicalBranchCoordinates) => string;
}

// ───────────────────────────────────────────────────────────────────
// 2. LEDGER RECORD TYPES
// ───────────────────────────────────────────────────────────────────

export const BranchRecordTypes = {
  BRANCH_REGISTERED: 'branch_registered',
  BRANCH_MUTATED: 'branch_mutated',
  LEASE_ACQUIRED: 'lease_acquired',
  LEASE_REJECTED: 'lease_rejected',
  LEASE_RELEASED: 'lease_released',
  LEASE_RENEWED: 'lease_renewed',
  RESUME_RECONSTRUCTED: 'resume_reconstructed',
  WAVE_ADMITTED: 'wave_admitted',
  WAVE_CLOSED: 'wave_closed',
  WAVE_PLANNED: 'wave_planned',
} as const;

export type BranchRecordType =
  typeof BranchRecordTypes[keyof typeof BranchRecordTypes];

export const BranchMutationKinds = {
  DISPATCH: 'dispatch',
  RESULT: 'result',
  RETRY: 'retry',
  SALVAGE: 'salvage',
  STATUS: 'status',
  TERMINAL: 'terminal',
} as const;

export type BranchMutationKind =
  typeof BranchMutationKinds[keyof typeof BranchMutationKinds];

/** Canonical ledger body that registers one logical branch. */
export interface BranchRegisteredBody extends JsonObject {
  readonly logical_branch_id: string;
  readonly coordinate_key: string;
  readonly model_id: string;
  readonly branch_id: string;
  readonly replica_ordinal: number;
  readonly derivation_version: number;
  readonly manifest_fingerprint: string;
  readonly invocation_fingerprint: string;
  readonly registration_key: string;
  readonly wave_id: string;
  readonly wave_ordinal: number;
  readonly wave_plan_fingerprint: string;
}

/** Canonical ledger body that freezes the complete wave plan. */
export interface WavePlannedBody extends JsonObject {
  readonly plan: ImmutableWavePlan;
}

/** Durable authorization to admit exactly one planned wave. */
export interface WaveAdmittedBody extends JsonObject {
  readonly wave_id: string;
  readonly wave_ordinal: number;
  readonly plan_fingerprint: string;
  readonly authorization_id: string;
}

/** Durable policy decision that closes a current wave. */
export interface WaveClosedBody extends JsonObject {
  readonly wave_id: string;
  readonly wave_ordinal: number;
  readonly plan_fingerprint: string;
  readonly authorization_id: string;
  readonly policy_id: string;
  readonly decision: 'advance' | 'stop';
}

/** Exact accepted lease tuple carried by protected ledger records. */
export interface LeaseBody extends JsonObject {
  readonly logical_branch_id: string;
  readonly wave_id: string;
  readonly lease_id: string;
  readonly owner_id: string;
  readonly attempt_id: string;
  readonly fence_token: number;
  readonly acquired_at: string;
  readonly renewed_at: string;
  readonly expires_at: string;
}

/** Lease tuple plus whether it is an initial claim or expired takeover. */
export interface LeaseAcquiredBody extends LeaseBody {
  readonly acquisition: 'acquired' | 'takeover';
}

/** Diagnostic evidence for a rejected stale protected mutation. */
export interface LeaseRejectedBody extends JsonObject {
  readonly logical_branch_id: string;
  readonly lease_id: string;
  readonly owner_id: string;
  readonly attempt_id: string;
  readonly fence_token: number;
  readonly mutation_kind: BranchMutationKind | 'lease_renew' | 'lease_release';
  readonly rejection_code: string;
}

/** Fenced branch mutation and its canonical content digest. */
export interface BranchMutatedBody extends JsonObject {
  readonly logical_branch_id: string;
  readonly wave_id: string;
  readonly lease_id: string;
  readonly owner_id: string;
  readonly attempt_id: string;
  readonly fence_token: number;
  readonly mutation_kind: BranchMutationKind;
  readonly mutation_digest: string;
  readonly data: JsonObject;
}

/** Auditable summary of a ledger-only resume reconstruction. */
export interface ResumeReconstructedBody extends JsonObject {
  readonly manifest_fingerprint: string;
  readonly plan_fingerprint: string;
  readonly registered_branches: number;
  readonly satisfied_branches: number;
  readonly current_wave_ordinal: number | null;
  readonly next_wave_ordinal: number | null;
}

export type BranchRecordBody =
  | BranchRegisteredBody
  | WavePlannedBody
  | WaveAdmittedBody
  | WaveClosedBody
  | LeaseAcquiredBody
  | LeaseBody
  | LeaseRejectedBody
  | BranchMutatedBody
  | ResumeReconstructedBody;

/** Closed discriminated record stored inside the canonical event envelope. */
export interface BranchOrchestrationRecord extends JsonObject {
  readonly record_type: BranchRecordType;
  readonly run_id: string;
  readonly transition_id: string;
  readonly body: BranchRecordBody;
}

// ───────────────────────────────────────────────────────────────────
// 3. PROJECTION TYPES
// ───────────────────────────────────────────────────────────────────

/** Reducer-owned accepted lifecycle for one registered branch. */
export interface ProjectedBranch extends JsonObject {
  readonly registration: BranchRegisteredBody;
  lifecycle: 'registered' | 'leased' | 'dispatched' | 'running' | 'result-accepted' | 'terminal';
  lastStatus: string | null;
  lastAttemptId: string | null;
  acceptedResultDigest: string | null;
  acceptedSalvageDigest: string | null;
  terminalOutcome: 'succeeded' | 'failed' | 'cancelled' | null;
}

/** Reducer-owned latest accepted lease state for one branch. */
export interface ProjectedLease extends JsonObject {
  readonly logicalBranchId: string;
  readonly waveId: string;
  readonly leaseId: string;
  readonly ownerId: string;
  readonly attemptId: string;
  readonly fenceToken: number;
  readonly acquiredAt: string;
  renewedAt: string;
  expiresAt: string;
  status: 'active' | 'released';
}

/** Reducer-owned durable admission state for one immutable wave. */
export interface ProjectedWave extends JsonObject {
  readonly wave: ImmutableWave;
  status: 'planned' | 'admitted' | 'closed-advance' | 'closed-stop';
  authorizationId: string | null;
}

/** Canonical projection rebuilt from ordered verified ledger records. */
export interface BranchOrchestrationProjection extends JsonObject {
  readonly schemaVersion: 1;
  runId: string | null;
  manifestFingerprint: string | null;
  wavePlan: ImmutableWavePlan | null;
  branches: Record<string, ProjectedBranch>;
  coordinateToBranch: Record<string, string>;
  leases: Record<string, ProjectedLease>;
  waves: Record<string, ProjectedWave>;
  currentWaveOrdinal: number | null;
  nextWaveOrdinal: number | null;
  blockedPrerequisiteWaveIds: string[];
  transitionDigests: Record<string, string>;
}

/** Current ledger-derived lease owner and expiry view. */
export interface ResumeLeaseState {
  readonly logicalBranchId: string;
  readonly ownerId: string;
  readonly attemptId: string;
  readonly leaseId: string;
  readonly fenceToken: number;
  readonly expiresAt: string;
  readonly isExpired: boolean;
}

/** Complete dispatch-relevant state reconstructed without process or directory inference. */
export interface LedgerResumeState {
  readonly runId: string;
  readonly manifestFingerprint: string;
  readonly wavePlanFingerprint: string;
  readonly registeredBranchIds: readonly string[];
  readonly satisfiedBranchIds: readonly string[];
  readonly activeLeases: readonly ResumeLeaseState[];
  readonly currentWave: ImmutableWave | null;
  readonly nextWave: ImmutableWave | null;
  readonly blockedPrerequisiteWaveIds: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 4. SERVICE AND POOL TYPES
// ───────────────────────────────────────────────────────────────────

/** Durable storage, resource namespace, clock, and authority configuration. */
export interface DurableBranchOrchestratorOptions {
  readonly rootDirectory: string;
  readonly ledgerId: string;
  readonly packetId: string;
  readonly now?: () => Date;
  readonly authorityEpoch?: number;
}

/** Validated input for claiming one admitted unsatisfied branch. */
export interface AcquireBranchLeaseInput {
  readonly runId: string;
  readonly logicalBranchId: string;
  readonly ownerId: string;
  readonly attemptId: string;
  readonly ttlMs: number;
  readonly acquireTimeoutMs?: number;
}

/** Physical fenced lease bound to one logical attempt and wave. */
export interface BranchLeaseGrant {
  readonly lease: FencedLease;
  readonly attemptId: string;
  readonly waveId: string;
}

/** Protected mutation request carrying the exact branch lease grant. */
export interface CommitBranchMutationInput {
  readonly runId: string;
  readonly transitionId: string;
  readonly grant: BranchLeaseGrant;
  readonly mutationKind: BranchMutationKind;
  readonly data: JsonObject;
}

/** Stable worker context exposed by the shipped capped pool. */
export interface PoolWorkerContext {
  readonly index: number;
  readonly label: string;
  readonly attempt: number;
  readonly signal?: AbortSignal;
}

/** Pool context augmented with durable logical identity and ownership. */
export interface DurablePoolWorkerContext extends PoolWorkerContext {
  readonly logicalBranchId: string;
  readonly lease: FencedLease;
}

/** Unchanged pool controls plus durable ownership settings for one admitted wave. */
export interface RunAuthorizedWaveOptions<TItem, TResult> {
  readonly runId: string;
  readonly workerOwnerId: string;
  readonly leaseTtlMs: number;
  readonly leaseAcquireTimeoutMs?: number;
  readonly concurrency: number;
  readonly maxRetries?: number;
  readonly initialRetryCounts?: Readonly<Record<string, number>>;
  readonly lagCeilingMs?: number;
  readonly lagCeilingAction?: 'abort-requeue';
  readonly postExitGraceMs?: number;
  readonly postExitPollMs?: number;
  readonly getAttemptLiveness?: (attempt: unknown) => unknown;
  readonly now?: () => Date;
  readonly onEvent?: (event: Readonly<Record<string, unknown>>) => void;
  readonly worker: (
    item: TItem,
    context: DurablePoolWorkerContext,
  ) => TResult | Promise<TResult>;
}

/** Never-throw per-item settlement emitted in admitted input order. */
export interface PoolSettlement<TResult = unknown> {
  readonly label: string;
  readonly status: 'fulfilled' | 'rejected';
  readonly attempt: number;
  readonly output?: TResult;
  readonly error?: Readonly<Record<string, unknown>>;
}

/** Ordered pool settlements and the shipped summary payload. */
export interface PoolRunResult<TResult = unknown> {
  readonly results: readonly PoolSettlement<TResult>[];
  readonly summary: Readonly<Record<string, unknown>>;
}
