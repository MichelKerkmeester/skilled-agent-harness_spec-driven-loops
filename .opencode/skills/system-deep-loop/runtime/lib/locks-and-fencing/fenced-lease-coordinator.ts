// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced Lease Coordinator
// ───────────────────────────────────────────────────────────────────

import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  acquireLoopLock,
  refreshLoopLock,
  releaseLoopLock,
} from '../deep-loop/loop-lock.js';
import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { appendUtf8Durable, readUtf8IfExists, writeCanonicalJsonAtomic } from './durable-file.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import {
  AtomicityDomains,
  LockLifecycleActions,
} from './locks-and-fencing-types.js';
import {
  canonicalizeProtectedResource,
  validateOpaqueIdentity,
} from './protected-resource-registry.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  AcquireLeaseRequest,
  CanonicalProtectedResource,
  FencedLease,
  FencedLeaseCoordinatorOptions,
  FencedMutationContext,
  FencingCoordinatorSnapshot,
  LeaseGrant,
  LockLifecycleDecision,
  ProtectedResourceIdentity,
} from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. STORAGE TYPES
// ───────────────────────────────────────────────────────────────────

interface StoredCoordinatorStateCore {
  readonly schemaVersion: 1;
  readonly resource: CanonicalProtectedResource;
  readonly lastFenceToken: number;
  readonly generation: number;
  readonly activeLease: FencedLease | null;
  readonly journalHeadHash: string;
}

interface StoredCoordinatorState extends StoredCoordinatorStateCore {
  readonly stateHash: string;
}

interface GrantJournalRecordCore {
  readonly schemaVersion: 1;
  readonly sequence: number;
  readonly resource: CanonicalProtectedResource;
  readonly fenceToken: number;
  readonly lease: FencedLease;
  readonly reason: string;
  readonly recordedAt: string;
  readonly priorRecordHash: string;
}

interface GrantJournalRecord extends GrantJournalRecordCore {
  readonly recordHash: string;
}

interface AcquisitionAttemptGranted {
  readonly status: 'granted';
  readonly grant: LeaseGrant;
  readonly expiredLease: FencedLease | null;
  readonly reason: string;
}

interface AcquisitionAttemptContended {
  readonly status: 'contended';
  readonly holder: FencedLease;
}

type AcquisitionAttempt = AcquisitionAttemptGranted | AcquisitionAttemptContended;

export interface CoordinatorStoragePaths {
  readonly resourceDirectory: string;
  readonly statePath: string;
  readonly journalPath: string;
  readonly mutexPath: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND VALIDATION
// ───────────────────────────────────────────────────────────────────

const SCHEMA_VERSION = 1;
const GENESIS_HASH = '0'.repeat(64);
const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const DEFAULT_RETRY_INTERVAL_MS = 10;
const DEFAULT_OPERATION_TIMEOUT_MS = 1_000;
const DEFAULT_MUTEX_TTL_MS = 60_000;
const DEFAULT_TELEMETRY_CAPACITY = 256;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isSafeNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isSafePositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function requireDuration(value: unknown, field: string, allowZero: boolean): number {
  const isValid = allowZero
    ? isSafeNonNegativeInteger(value)
    : isSafePositiveInteger(value);
  if (!isValid) {
    throw new TypeError(`${field} must be a ${allowZero ? 'non-negative' : 'positive'} safe integer`);
  }
  return value as number;
}

function requireIsoTimestamp(value: unknown, field: string): string {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) {
    throw malformedState(`Stored ${field} is not an ISO timestamp`, { field, value });
  }
  return value;
}

function malformedState(
  message: string,
  details: Readonly<Record<string, unknown>>,
): LocksAndFencingError {
  return new LocksAndFencingError(
    LocksAndFencingErrorCodes.MALFORMED_STATE,
    'storage',
    message,
    details,
  );
}

function stateDigest(state: StoredCoordinatorStateCore): string {
  return sha256Bytes(canonicalBytes(state as unknown as JsonObject));
}

function journalDigest(record: GrantJournalRecordCore): string {
  return sha256Bytes(canonicalBytes(record as unknown as JsonObject));
}

function sameLease(left: FencedLease, right: FencedLease): boolean {
  return left.resource.resourceKey === right.resource.resourceKey
    && left.fenceToken === right.fenceToken
    && left.leaseId === right.leaseId
    && left.ownerId === right.ownerId;
}

function freezeLease(lease: FencedLease): FencedLease {
  return Object.freeze({
    resource: Object.freeze({ ...lease.resource }),
    fenceToken: lease.fenceToken,
    leaseId: lease.leaseId,
    ownerId: lease.ownerId,
    correlationId: lease.correlationId,
    acquiredAt: lease.acquiredAt,
    renewedAt: lease.renewedAt,
    expiresAt: lease.expiresAt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. COORDINATOR
// ───────────────────────────────────────────────────────────────────

/** Durable per-resource lease coordinator whose commit guards own the safety boundary. */
export class FencedLeaseCoordinator {
  readonly #rootDirectory: string;
  readonly #now: () => Date;
  readonly #randomId: () => string;
  readonly #sleep: (durationMs: number) => Promise<void>;
  readonly #retryIntervalMs: number;
  readonly #operationTimeoutMs: number;
  readonly #mutexTtlMs: number;
  readonly #telemetryCapacity: number;
  readonly #faultInjection: FencedLeaseCoordinatorOptions['faultInjection'];
  readonly #guardContext = new AsyncLocalStorage<readonly string[]>();
  readonly #telemetry: LockLifecycleDecision[] = [];

  public constructor(options: FencedLeaseCoordinatorOptions) {
    if (!options || typeof options.rootDirectory !== 'string' || options.rootDirectory.trim() === '') {
      throw new TypeError('Fenced lease coordinator requires a rootDirectory');
    }
    this.#rootDirectory = resolve(options.rootDirectory, 'locks-and-fencing-v1');
    this.#now = options.now ?? (() => new Date());
    this.#randomId = options.randomId ?? randomUUID;
    this.#sleep = options.sleep ?? ((durationMs) => new Promise((done) => {
      setTimeout(done, durationMs);
    }));
    this.#retryIntervalMs = requireDuration(
      options.retryIntervalMs ?? DEFAULT_RETRY_INTERVAL_MS,
      'retryIntervalMs',
      false,
    );
    this.#operationTimeoutMs = requireDuration(
      options.operationTimeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS,
      'operationTimeoutMs',
      true,
    );
    this.#mutexTtlMs = requireDuration(
      options.mutexTtlMs ?? DEFAULT_MUTEX_TTL_MS,
      'mutexTtlMs',
      false,
    );
    this.#telemetryCapacity = requireDuration(
      options.telemetryCapacity ?? DEFAULT_TELEMETRY_CAPACITY,
      'telemetryCapacity',
      false,
    );
    this.#faultInjection = options.faultInjection;
    mkdirSync(this.#rootDirectory, { recursive: true });
  }

  /** Allocate a strictly newer durable token or end at the bounded timeout. */
  public async acquire(request: AcquireLeaseRequest): Promise<LeaseGrant> {
    this.#assertOutsideGuard('acquire');
    const resource = canonicalizeProtectedResource(request.resource);
    const ownerId = validateOpaqueIdentity(request.ownerId, 'ownerId');
    const correlationId = validateOpaqueIdentity(request.correlationId, 'correlationId');
    const ttlMs = requireDuration(request.ttlMs, 'ttlMs', false);
    const acquireTimeoutMs = requireDuration(
      request.acquireTimeoutMs ?? this.#operationTimeoutMs,
      'acquireTimeoutMs',
      true,
    );
    if (
      request.restoredFenceToken !== undefined
      && !isSafeNonNegativeInteger(request.restoredFenceToken)
    ) {
      throw new TypeError('restoredFenceToken must be a non-negative safe integer');
    }

    const startedAtMs = Date.now();
    const deadlineMs = startedAtMs + acquireTimeoutMs;
    let lastHolder: FencedLease | null = null;
    while (true) {
      const remainingMs = Math.max(0, deadlineMs - Date.now());
      let attempt: AcquisitionAttempt;
      try {
        attempt = await this.#withMutex(resource, remainingMs, () => this.#attemptAcquire(
          resource,
          ownerId,
          correlationId,
          ttlMs,
          request.restoredFenceToken,
        ));
      } catch (error: unknown) {
        if (
          error instanceof LocksAndFencingError
          && error.code === LocksAndFencingErrorCodes.LOCK_TIMEOUT
        ) {
          if (Date.now() < deadlineMs) {
            await this.#sleep(this.#retryDelay(deadlineMs - Date.now()));
            continue;
          }
          this.#recordDecision({
            action: LockLifecycleActions.TIMEOUT,
            reason: 'bounded-mutex-timeout',
            ownerId,
            correlationId,
            resource,
            latencyMs: Date.now() - startedAtMs,
          });
        }
        throw error;
      }

      if (attempt.status === 'granted') {
        if (attempt.expiredLease) {
          this.#recordDecision({
            action: LockLifecycleActions.EXPIRED,
            reason: 'lease-expired-before-takeover',
            lease: attempt.expiredLease,
            latencyMs: Date.now() - startedAtMs,
          });
        }
        this.#recordDecision({
          action: attempt.grant.acquisition === 'takeover'
            ? LockLifecycleActions.TAKEOVER
            : LockLifecycleActions.ACQUIRED,
          reason: attempt.reason,
          lease: attempt.grant,
          latencyMs: Date.now() - startedAtMs,
        });
        return attempt.grant;
      }

      lastHolder = attempt.holder;
      if (Date.now() >= deadlineMs) {
        this.#recordDecision({
          action: LockLifecycleActions.TIMEOUT,
          reason: 'bounded-acquisition-timeout',
          lease: lastHolder,
          ownerId,
          correlationId,
          resource,
          latencyMs: Date.now() - startedAtMs,
        });
        throw new LocksAndFencingError(
          LocksAndFencingErrorCodes.LOCK_TIMEOUT,
          'acquire',
          'Fenced lease acquisition reached its bounded timeout',
          {
            resourceDigest: resource.resourceDigest,
            holderToken: lastHolder.fenceToken,
          },
        );
      }
      await this.#sleep(this.#retryDelay(deadlineMs - Date.now()));
    }
  }

  /** Extend only the exact live owner tuple; displaced holders cannot renew. */
  public async renew(lease: FencedLease, ttlMs: number): Promise<FencedLease> {
    this.#assertOutsideGuard('renew');
    const durationMs = requireDuration(ttlMs, 'ttlMs', false);
    const startedAtMs = Date.now();
    try {
      const renewed = await this.#withMutex(
        lease.resource,
        this.#operationTimeoutMs,
        () => {
          const state = this.#loadState(lease.resource);
          this.#assertCurrentLease(state, lease, 'renew');
          const renewedAt = this.#now().toISOString();
          const activeLease = freezeLease({
            ...lease,
            renewedAt,
            expiresAt: new Date(Date.parse(renewedAt) + durationMs).toISOString(),
          });
          this.#writeState({
            ...state,
            generation: state.generation + 1,
            activeLease,
          });
          return activeLease;
        },
      );
      this.#recordDecision({
        action: LockLifecycleActions.RENEWED,
        reason: 'owner-renewed',
        lease: renewed,
        latencyMs: Date.now() - startedAtMs,
      });
      return renewed;
    } catch (error: unknown) {
      this.#recordLeaseFailure(lease, error, startedAtMs);
      throw error;
    }
  }

  /** Clear only the exact live owner tuple while retaining its token forever. */
  public async release(lease: FencedLease): Promise<void> {
    this.#assertOutsideGuard('release');
    const startedAtMs = Date.now();
    try {
      await this.#withMutex(lease.resource, this.#operationTimeoutMs, () => {
        const state = this.#loadState(lease.resource);
        this.#assertCurrentLease(state, lease, 'release', false);
        this.#writeState({
          ...state,
          generation: state.generation + 1,
          activeLease: null,
        });
      });
      this.#recordDecision({
        action: LockLifecycleActions.RELEASED,
        reason: 'owner-released',
        lease,
        latencyMs: Date.now() - startedAtMs,
      });
    } catch (error: unknown) {
      this.#recordLeaseFailure(lease, error, startedAtMs);
      throw error;
    }
  }

  /** Run one mutation while fence validation and takeover exclusion share one mutex. */
  public async withFence<TResult>(
    lease: FencedLease,
    mutation: (context: FencedMutationContext) => TResult | Promise<TResult>,
  ): Promise<TResult> {
    return this.withFences([lease], mutation);
  }

  /** Enforce canonical multi-resource order and hold every fence through commit. */
  public async withFences<TResult>(
    leases: readonly FencedLease[],
    mutation: (context: FencedMutationContext) => TResult | Promise<TResult>,
  ): Promise<TResult> {
    this.#assertOutsideGuard('withFences');
    if (leases.length === 0) throw new TypeError('withFences requires at least one lease');
    const keys = leases.map((lease) => lease.resource.orderKey);
    const sortedKeys = [...keys].sort();
    if (
      new Set(keys).size !== keys.length
      || keys.some((key, index) => key !== sortedKeys[index])
    ) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.LOCK_ORDER_VIOLATION,
        'guard',
        'Protected resources must be unique and supplied in canonical order',
        { orderKeys: keys },
      );
    }

    const startedAtMs = Date.now();
    return this.#guardContext.run(keys, async () => {
      try {
        return await this.#withLeaseMutexes(leases, 0, async () => {
          for (const lease of leases) {
            const state = this.#loadState(lease.resource);
            this.#assertCurrentLease(state, lease, 'guard');
          }
          return mutation(Object.freeze({
            resources: Object.freeze(leases.map((lease) => lease.resource)),
            fenceTokens: Object.freeze(leases.map((lease) => lease.fenceToken)),
          }));
        });
      } catch (error: unknown) {
        this.#recordLeaseFailure(leases[0], error, startedAtMs);
        throw error;
      }
    });
  }

  /** Read verified coordinator state without exposing a mutation capability. */
  public async inspect(
    resourceInput: ProtectedResourceIdentity,
  ): Promise<FencingCoordinatorSnapshot> {
    this.#assertOutsideGuard('inspect');
    const resource = canonicalizeProtectedResource(resourceInput);
    return this.#withMutex(resource, this.#operationTimeoutMs, () => {
      const state = this.#loadState(resource);
      return Object.freeze({
        resource,
        lastFenceToken: state.lastFenceToken,
        generation: state.generation,
        activeLease: state.activeLease,
        journalHeadHash: state.journalHeadHash,
        isExpired: state.activeLease !== null && this.#isExpired(state.activeLease),
      });
    });
  }

  /** Expose deterministic paths for operator inspection and corruption quarantine. */
  public storagePaths(resourceInput: ProtectedResourceIdentity): CoordinatorStoragePaths {
    const resource = canonicalizeProtectedResource(resourceInput);
    const resourceDirectory = join(this.#rootDirectory, resource.resourceDigest);
    return Object.freeze({
      resourceDirectory,
      statePath: join(resourceDirectory, 'coordinator-state.json'),
      journalPath: join(resourceDirectory, 'grant-journal.jsonl'),
      mutexPath: join(resourceDirectory, 'coordinator.lock'),
    });
  }

  /** Return bounded copies so observations cannot mutate lease authority. */
  public readTelemetry(): readonly LockLifecycleDecision[] {
    return Object.freeze(this.#telemetry.map((entry) => Object.freeze({ ...entry })));
  }

  async #attemptAcquire(
    resource: CanonicalProtectedResource,
    ownerId: string,
    correlationId: string,
    ttlMs: number,
    restoredFenceToken: number | undefined,
  ): Promise<AcquisitionAttempt> {
    const state = this.#loadState(resource);
    if (restoredFenceToken !== undefined && restoredFenceToken < state.lastFenceToken) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.TOKEN_ROLLBACK,
        'recovery',
        'Restored fencing state is older than the durable local high-water mark',
        {
          durableFenceToken: state.lastFenceToken,
          restoredFenceToken,
          resourceDigest: resource.resourceDigest,
        },
      );
    }
    if (state.activeLease && !this.#isExpired(state.activeLease)) {
      return { status: 'contended', holder: state.activeLease };
    }

    const baseToken = Math.max(state.lastFenceToken, restoredFenceToken ?? 0);
    if (baseToken >= Number.MAX_SAFE_INTEGER) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.FENCE_OVERFLOW,
        'acquire',
        'Fencing token high-water mark cannot be advanced safely',
        { baseToken, resourceDigest: resource.resourceDigest },
      );
    }
    const acquiredAt = this.#now().toISOString();
    const leaseId = validateOpaqueIdentity(this.#randomId(), 'leaseId');
    const lease = freezeLease({
      resource,
      fenceToken: baseToken + 1,
      leaseId,
      ownerId,
      correlationId,
      acquiredAt,
      renewedAt: acquiredAt,
      expiresAt: new Date(Date.parse(acquiredAt) + ttlMs).toISOString(),
    });
    const expiredLease = state.activeLease;
    const acquisition = expiredLease ? 'takeover' : 'acquired';
    const reason = restoredFenceToken !== undefined && restoredFenceToken > state.lastFenceToken
      ? 'restored-high-watermark-advanced'
      : expiredLease
        ? 'expired-holder-replaced'
        : 'resource-available';
    const journal = this.#appendGrant(state, lease, reason);
    this.#faultInjection?.afterJournalFsyncBeforeStateCommit?.();
    this.#writeState({
      schemaVersion: SCHEMA_VERSION,
      resource,
      lastFenceToken: lease.fenceToken,
      generation: state.generation + 1,
      activeLease: lease,
      journalHeadHash: journal.recordHash,
      stateHash: '',
    });
    return {
      status: 'granted',
      grant: Object.freeze({ ...lease, acquisition }),
      expiredLease,
      reason,
    };
  }

  async #withLeaseMutexes<TResult>(
    leases: readonly FencedLease[],
    index: number,
    mutation: () => TResult | Promise<TResult>,
  ): Promise<TResult> {
    if (index >= leases.length) return mutation();
    return this.#withMutex(
      leases[index].resource,
      this.#operationTimeoutMs,
      () => this.#withLeaseMutexes(leases, index + 1, mutation),
    );
  }

  async #withMutex<TResult>(
    resource: CanonicalProtectedResource,
    timeoutMs: number,
    operation: () => TResult | Promise<TResult>,
  ): Promise<TResult> {
    const paths = this.storagePaths(resource);
    mkdirSync(paths.resourceDirectory, { recursive: true });
    const deadlineMs = Date.now() + timeoutMs;
    while (true) {
      const mutexNow = new Date();
      const result = acquireLoopLock(paths.mutexPath, {
        ownerPid: process.pid,
        startedAtIso: mutexNow.toISOString(),
        ttlMs: this.#mutexTtlMs,
        lastHeartbeatIso: mutexNow.toISOString(),
        packetId: resource.resourceDigest,
        runtimeKind: 'main',
        phase: 'fenced-mutation',
      });
      if (result.acquired) {
        let didThrow = false;
        const heartbeat = setInterval(() => {
          refreshLoopLock(paths.mutexPath, result.lock.ownerPid, new Date(), {
            acquireNonce: result.lock.acquireNonce,
            phase: 'fenced-mutation',
          });
        }, Math.max(1, Math.floor(this.#mutexTtlMs / 2)));
        heartbeat.unref?.();
        try {
          return await operation();
        } catch (error: unknown) {
          didThrow = true;
          throw error;
        } finally {
          clearInterval(heartbeat);
          const didRelease = releaseLoopLock(
            paths.mutexPath,
            result.lock.ownerPid,
            result.lock.acquireNonce,
          );
          if (!didRelease && !didThrow) {
            throw new LocksAndFencingError(
              LocksAndFencingErrorCodes.LEASE_LOST,
              'storage',
              'Coordinator mutex ownership changed before release',
              { resourceDigest: resource.resourceDigest },
            );
          }
        }
      }
      if (Date.now() >= deadlineMs) {
        throw new LocksAndFencingError(
          LocksAndFencingErrorCodes.LOCK_TIMEOUT,
          'acquire',
          'Coordinator mutex acquisition reached its bounded timeout',
          { resourceDigest: resource.resourceDigest },
        );
      }
      await this.#sleep(this.#retryDelay(deadlineMs - Date.now()));
    }
  }

  #loadState(resource: CanonicalProtectedResource): StoredCoordinatorState {
    const paths = this.storagePaths(resource);
    const journal = this.#readJournal(resource, paths.journalPath);
    const stateText = readUtf8IfExists(paths.statePath);
    if (stateText === null && journal.length === 0) {
      return this.#initialState(resource);
    }
    if (stateText === null) {
      return this.#recoverState(resource, journal, null);
    }

    let state: StoredCoordinatorState;
    try {
      state = this.#parseState(JSON.parse(stateText), resource);
    } catch (error: unknown) {
      if (error instanceof LocksAndFencingError) throw error;
      throw malformedState('Coordinator state is not valid JSON', {
        resourceDigest: resource.resourceDigest,
      });
    }
    if (journal.length === 0 && state.lastFenceToken > 0) {
      throw malformedState('Coordinator state has no durable grant journal', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const lastRecord = journal.at(-1);
    const journalToken = lastRecord?.fenceToken ?? 0;
    if (state.lastFenceToken > journalToken) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.TOKEN_ROLLBACK,
        'recovery',
        'Grant journal is older than the coordinator high-water mark',
        {
          journalToken,
          stateToken: state.lastFenceToken,
          resourceDigest: resource.resourceDigest,
        },
      );
    }
    if (state.lastFenceToken < journalToken) {
      return this.#recoverState(resource, journal, state);
    }
    if (state.journalHeadHash !== (lastRecord?.recordHash ?? GENESIS_HASH)) {
      throw malformedState('Coordinator state is not bound to the grant journal head', {
        resourceDigest: resource.resourceDigest,
      });
    }
    return state;
  }

  #initialState(resource: CanonicalProtectedResource): StoredCoordinatorState {
    const core: StoredCoordinatorStateCore = {
      schemaVersion: SCHEMA_VERSION,
      resource,
      lastFenceToken: 0,
      generation: 0,
      activeLease: null,
      journalHeadHash: GENESIS_HASH,
    };
    return Object.freeze({ ...core, stateHash: stateDigest(core) });
  }

  #recoverState(
    resource: CanonicalProtectedResource,
    journal: readonly GrantJournalRecord[],
    prior: StoredCoordinatorState | null,
  ): StoredCoordinatorState {
    const lastRecord = journal.at(-1);
    if (!lastRecord) return this.#initialState(resource);
    const recovered: StoredCoordinatorState = {
      schemaVersion: SCHEMA_VERSION,
      resource,
      lastFenceToken: lastRecord.fenceToken,
      generation: Math.max(lastRecord.sequence, (prior?.generation ?? 0) + 1),
      activeLease: lastRecord.lease,
      journalHeadHash: lastRecord.recordHash,
      stateHash: '',
    };
    this.#writeState(recovered);
    return this.#loadWrittenState(recovered);
  }

  #loadWrittenState(state: StoredCoordinatorState): StoredCoordinatorState {
    const core: StoredCoordinatorStateCore = {
      schemaVersion: SCHEMA_VERSION,
      resource: state.resource,
      lastFenceToken: state.lastFenceToken,
      generation: state.generation,
      activeLease: state.activeLease,
      journalHeadHash: state.journalHeadHash,
    };
    return Object.freeze({ ...core, stateHash: stateDigest(core) });
  }

  #writeState(state: StoredCoordinatorState): void {
    const complete = this.#loadWrittenState(state);
    const paths = this.storagePaths(complete.resource);
    writeCanonicalJsonAtomic(paths.statePath, complete as unknown as JsonObject);
  }

  #appendGrant(
    state: StoredCoordinatorState,
    lease: FencedLease,
    reason: string,
  ): GrantJournalRecord {
    const core: GrantJournalRecordCore = {
      schemaVersion: SCHEMA_VERSION,
      sequence: state.lastFenceToken === 0 ? 1 : this.#readJournal(
        state.resource,
        this.storagePaths(state.resource).journalPath,
      ).length + 1,
      resource: state.resource,
      fenceToken: lease.fenceToken,
      lease,
      reason,
      recordedAt: this.#now().toISOString(),
      priorRecordHash: state.journalHeadHash,
    };
    const record = Object.freeze({ ...core, recordHash: journalDigest(core) });
    appendUtf8Durable(
      this.storagePaths(state.resource).journalPath,
      `${Buffer.from(canonicalBytes(record as unknown as JsonObject)).toString('utf8')}\n`,
    );
    return record;
  }

  #readJournal(
    resource: CanonicalProtectedResource,
    journalPath: string,
  ): readonly GrantJournalRecord[] {
    const text = readUtf8IfExists(journalPath);
    if (text === null) return Object.freeze([]);
    if (text.length === 0 || !text.endsWith('\n')) {
      throw malformedState('Grant journal has an empty or partial tail', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const records: GrantJournalRecord[] = [];
    let priorRecordHash = GENESIS_HASH;
    let priorFenceToken = 0;
    for (const [index, line] of text.slice(0, -1).split('\n').entries()) {
      let record: GrantJournalRecord;
      try {
        record = this.#parseJournalRecord(JSON.parse(line), resource);
      } catch (error: unknown) {
        if (
          error instanceof LocksAndFencingError
          && error.code === LocksAndFencingErrorCodes.MALFORMED_STATE
        ) {
          throw error;
        }
        throw malformedState('Grant journal contains malformed JSON', {
          line: index + 1,
          resourceDigest: resource.resourceDigest,
        });
      }
      if (
        record.sequence !== index + 1
        || record.priorRecordHash !== priorRecordHash
        || record.fenceToken <= priorFenceToken
      ) {
        throw malformedState('Grant journal ordering or hash linkage is invalid', {
          line: index + 1,
          resourceDigest: resource.resourceDigest,
        });
      }
      priorRecordHash = record.recordHash;
      priorFenceToken = record.fenceToken;
      records.push(record);
    }
    return Object.freeze(records);
  }

  #parseState(raw: unknown, resource: CanonicalProtectedResource): StoredCoordinatorState {
    if (!isRecord(raw)) throw malformedState('Coordinator state must be an object', {});
    const storedResource = canonicalizeProtectedResource(raw.resource);
    if (
      storedResource.resourceKey !== resource.resourceKey
      || !isSafeNonNegativeInteger(raw.lastFenceToken)
      || !isSafeNonNegativeInteger(raw.generation)
      || typeof raw.journalHeadHash !== 'string'
      || !HASH_PATTERN.test(raw.journalHeadHash)
      || typeof raw.stateHash !== 'string'
      || !HASH_PATTERN.test(raw.stateHash)
      || raw.schemaVersion !== SCHEMA_VERSION
    ) {
      throw malformedState('Coordinator state fields are invalid', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const activeLease = raw.activeLease === null
      ? null
      : this.#parseLease(raw.activeLease, resource);
    if (activeLease && activeLease.fenceToken !== raw.lastFenceToken) {
      throw malformedState('Active lease does not carry the current fencing token', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const core: StoredCoordinatorStateCore = {
      schemaVersion: SCHEMA_VERSION,
      resource,
      lastFenceToken: raw.lastFenceToken,
      generation: raw.generation,
      activeLease,
      journalHeadHash: raw.journalHeadHash,
    };
    if (stateDigest(core) !== raw.stateHash) {
      throw malformedState('Coordinator state integrity digest does not match', {
        resourceDigest: resource.resourceDigest,
      });
    }
    return Object.freeze({ ...core, stateHash: raw.stateHash });
  }

  #parseJournalRecord(
    raw: unknown,
    resource: CanonicalProtectedResource,
  ): GrantJournalRecord {
    if (!isRecord(raw)) throw malformedState('Grant journal record must be an object', {});
    const storedResource = canonicalizeProtectedResource(raw.resource);
    if (
      raw.schemaVersion !== SCHEMA_VERSION
      || !isSafePositiveInteger(raw.sequence)
      || !isSafePositiveInteger(raw.fenceToken)
      || storedResource.resourceKey !== resource.resourceKey
      || typeof raw.reason !== 'string'
      || raw.reason.length === 0
      || typeof raw.priorRecordHash !== 'string'
      || !HASH_PATTERN.test(raw.priorRecordHash)
      || typeof raw.recordHash !== 'string'
      || !HASH_PATTERN.test(raw.recordHash)
    ) {
      throw malformedState('Grant journal record fields are invalid', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const lease = this.#parseLease(raw.lease, resource);
    if (lease.fenceToken !== raw.fenceToken) {
      throw malformedState('Grant journal lease token does not match its record', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const core: GrantJournalRecordCore = {
      schemaVersion: SCHEMA_VERSION,
      sequence: raw.sequence,
      resource,
      fenceToken: raw.fenceToken,
      lease,
      reason: raw.reason,
      recordedAt: requireIsoTimestamp(raw.recordedAt, 'recordedAt'),
      priorRecordHash: raw.priorRecordHash,
    };
    if (journalDigest(core) !== raw.recordHash) {
      throw malformedState('Grant journal record integrity digest does not match', {
        sequence: raw.sequence,
        resourceDigest: resource.resourceDigest,
      });
    }
    return Object.freeze({ ...core, recordHash: raw.recordHash });
  }

  #parseLease(raw: unknown, resource: CanonicalProtectedResource): FencedLease {
    if (!isRecord(raw)) throw malformedState('Stored lease must be an object', {});
    const storedResource = canonicalizeProtectedResource(raw.resource);
    if (
      storedResource.resourceKey !== resource.resourceKey
      || !isSafePositiveInteger(raw.fenceToken)
    ) {
      throw malformedState('Stored lease resource or token is invalid', {
        resourceDigest: resource.resourceDigest,
      });
    }
    const lease = freezeLease({
      resource,
      fenceToken: raw.fenceToken,
      leaseId: validateOpaqueIdentity(raw.leaseId, 'leaseId'),
      ownerId: validateOpaqueIdentity(raw.ownerId, 'ownerId'),
      correlationId: validateOpaqueIdentity(raw.correlationId, 'correlationId'),
      acquiredAt: requireIsoTimestamp(raw.acquiredAt, 'acquiredAt'),
      renewedAt: requireIsoTimestamp(raw.renewedAt, 'renewedAt'),
      expiresAt: requireIsoTimestamp(raw.expiresAt, 'expiresAt'),
    });
    if (
      Date.parse(lease.renewedAt) < Date.parse(lease.acquiredAt)
      || Date.parse(lease.expiresAt) <= Date.parse(lease.renewedAt)
    ) {
      throw malformedState('Stored lease timestamps are not monotonic', {
        resourceDigest: resource.resourceDigest,
      });
    }
    return lease;
  }

  #assertCurrentLease(
    state: StoredCoordinatorState,
    lease: FencedLease,
    phase: 'guard' | 'release' | 'renew',
    requireUnexpired = true,
  ): void {
    const current = state.activeLease;
    if (!current || !sameLease(current, lease)) {
      const isStaleToken = lease.fenceToken < state.lastFenceToken;
      throw new LocksAndFencingError(
        isStaleToken
          ? LocksAndFencingErrorCodes.STALE_FENCE
          : LocksAndFencingErrorCodes.LEASE_LOST,
        phase,
        isStaleToken
          ? 'Mutation fencing token has been displaced by a newer grant'
          : 'Lease owner tuple is not current',
        {
          currentFenceToken: state.lastFenceToken,
          suppliedFenceToken: lease.fenceToken,
          resourceDigest: lease.resource.resourceDigest,
        },
      );
    }
    if (requireUnexpired && this.#isExpired(current)) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.LEASE_LOST,
        phase,
        'Lease expired before the protected mutation boundary',
        {
          fenceToken: lease.fenceToken,
          resourceDigest: lease.resource.resourceDigest,
        },
      );
    }
  }

  #isExpired(lease: FencedLease): boolean {
    return this.#now().getTime() >= Date.parse(lease.expiresAt);
  }

  #retryDelay(remainingMs: number): number {
    const jitterMs = Math.floor(Math.random() * this.#retryIntervalMs);
    return Math.max(0, Math.min(this.#retryIntervalMs + jitterMs, remainingMs));
  }

  #assertOutsideGuard(operation: string): void {
    const activeKeys = this.#guardContext.getStore();
    if (activeKeys && activeKeys.length > 0) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.LOCK_ORDER_VIOLATION,
        'guard',
        'Nested or re-entrant coordinator operations are forbidden',
        { activeKeys, operation },
      );
    }
  }

  #recordLeaseFailure(lease: FencedLease, error: unknown, startedAtMs: number): void {
    this.#recordDecision({
      action: LockLifecycleActions.REJECTED,
      reason: error instanceof LocksAndFencingError ? error.code : 'unexpected-failure',
      lease,
      latencyMs: Date.now() - startedAtMs,
    });
  }

  #recordDecision(input: Readonly<{
    action: LockLifecycleDecision['action'];
    reason: string;
    latencyMs: number;
    lease?: FencedLease | null;
    resource?: CanonicalProtectedResource;
    ownerId?: string;
    correlationId?: string;
  }>): void {
    const lease = input.lease ?? null;
    const resource = lease?.resource ?? input.resource;
    if (!resource) return;
    const decision: LockLifecycleDecision = Object.freeze({
      action: input.action,
      reason: input.reason,
      resourceDigest: resource.resourceDigest,
      fenceToken: lease?.fenceToken ?? 0,
      leaseId: lease?.leaseId ?? null,
      ownerId: lease?.ownerId ?? input.ownerId ?? 'unknown-owner',
      correlationId: lease?.correlationId ?? input.correlationId ?? 'unknown-correlation',
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
      latencyMs: Math.max(0, Math.round(input.latencyMs)),
      replayFingerprint: null,
      observedAt: this.#now().toISOString(),
    });
    this.#telemetry.push(decision);
    if (this.#telemetry.length > this.#telemetryCapacity) this.#telemetry.shift();
  }
}
