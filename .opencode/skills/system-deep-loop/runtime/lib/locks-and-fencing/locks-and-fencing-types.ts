// ───────────────────────────────────────────────────────────────────
// MODULE: Locks and Fencing Types
// ───────────────────────────────────────────────────────────────────

import type { JsonObject } from '../event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
  VerifiedReplayFingerprint,
} from '../replay-fingerprint/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. RESOURCE TYPES
// ───────────────────────────────────────────────────────────────────

export const AtomicityDomains = {
  SINGLE_HOST_FILESYSTEM: 'single-host-filesystem',
} as const;

export type AtomicityDomain = typeof AtomicityDomains[keyof typeof AtomicityDomains];

export const ProtectedResourceKinds = {
  COUNCIL_ROUND: 'council-round',
  FANOUT_STATUS: 'fanout-status',
  LEDGER: 'ledger',
  LINEAGE_STATE: 'lineage-state',
  MERGE_TARGET: 'merge-target',
  PAUSE_RESUME: 'pause-resume',
  PROJECTION: 'projection',
  WAIT_CHECKPOINT: 'wait-checkpoint',
  WRITER: 'writer',
} as const;

export type ProtectedResourceKind =
  typeof ProtectedResourceKinds[keyof typeof ProtectedResourceKinds];

/** Untrusted resource identity accepted at the coordinator boundary. */
export interface ProtectedResourceIdentity {
  readonly kind: ProtectedResourceKind;
  readonly components: Readonly<Record<string, string>>;
  readonly atomicityDomain: AtomicityDomain;
}

/** Normalized resource identity used for paths, ordering, and lock authority. */
export interface CanonicalProtectedResource extends ProtectedResourceIdentity {
  readonly resourceKey: string;
  readonly resourceDigest: string;
  readonly orderKey: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. LEASE TYPES
// ───────────────────────────────────────────────────────────────────

export interface AcquireLeaseRequest {
  readonly resource: ProtectedResourceIdentity;
  readonly ownerId: string;
  readonly correlationId: string;
  readonly ttlMs: number;
  readonly acquireTimeoutMs?: number;
  readonly restoredFenceToken?: number;
}

/** Complete ownership tuple required by every guarded mutation. */
export interface FencedLease {
  readonly resource: CanonicalProtectedResource;
  readonly fenceToken: number;
  readonly leaseId: string;
  readonly ownerId: string;
  readonly correlationId: string;
  readonly acquiredAt: string;
  readonly renewedAt: string;
  readonly expiresAt: string;
}

export type LeaseAcquisition = 'acquired' | 'takeover';

export interface LeaseGrant extends FencedLease {
  readonly acquisition: LeaseAcquisition;
}

export interface FencingCoordinatorSnapshot {
  readonly resource: CanonicalProtectedResource;
  readonly lastFenceToken: number;
  readonly generation: number;
  readonly activeLease: FencedLease | null;
  readonly journalHeadHash: string;
  readonly isExpired: boolean;
}

export interface FencedMutationContext {
  readonly resources: readonly CanonicalProtectedResource[];
  readonly fenceTokens: readonly number[];
}

/** Side effect executed only after the coordinator revalidates the current fence. */
export type FencedCommit<TResult> = () => TResult | Promise<TResult>;

/** Side-effect-free preparation that returns the operation's fenced commit. */
export type FencedMutationPreparation<TResult> = (
  context: FencedMutationContext,
) => FencedCommit<TResult> | Promise<FencedCommit<TResult>>;

export interface CoordinatorFaultInjection {
  readonly afterJournalFsyncBeforeStateCommit?: () => void;
}

export interface FencedLeaseCoordinatorOptions {
  readonly rootDirectory: string;
  readonly now?: () => Date;
  readonly randomId?: () => string;
  readonly sleep?: (durationMs: number) => Promise<void>;
  readonly retryIntervalMs?: number;
  readonly operationTimeoutMs?: number;
  readonly telemetryCapacity?: number;
  readonly faultInjection?: CoordinatorFaultInjection;
}

// ───────────────────────────────────────────────────────────────────
// 3. EVIDENCE TYPES
// ───────────────────────────────────────────────────────────────────

export const LockLifecycleActions = {
  ACQUIRED: 'acquired',
  EXPIRED: 'expired',
  REJECTED: 'rejected',
  RELEASED: 'released',
  RENEWED: 'renewed',
  TAKEOVER: 'takeover',
  TIMEOUT: 'timeout',
} as const;

export type LockLifecycleAction =
  typeof LockLifecycleActions[keyof typeof LockLifecycleActions];

/** Redacted decision data that can be promoted to typed ledger evidence. */
export interface LockLifecycleDecision {
  readonly action: LockLifecycleAction;
  readonly reason: string;
  readonly resourceDigest: string;
  readonly fenceToken: number;
  readonly leaseId: string | null;
  readonly ownerId: string;
  readonly correlationId: string;
  readonly atomicityDomain: AtomicityDomain;
  readonly latencyMs: number;
  readonly replayFingerprint: string | null;
  readonly observedAt: string;
}

export interface ReplayIdentity {
  readonly fingerprintVersion: number;
  readonly ledgerId: string;
  readonly runId: string;
  readonly rangeStartSequence: number;
  readonly rangeEndSequence: number;
  readonly finalDigest: string;
}

export type ReplayFingerprintSource<TState extends JsonObject = JsonObject> =
  | DerivedReplayFingerprint<TState>
  | VerifiedReplayFingerprint<TState>;
