// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Worktree Lease
// ───────────────────────────────────────────────────────────────────

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: per-worktree ownership and liveness lease                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Record who owns a lineage worktree and whether that owner is     ║
// ║          still working in it, so a later sweep can reclaim dead trees     ║
// ║          without ever touching a live peer's tree. Reclaim is deliberately║
// ║          conservative: absence of proof of inactivity is never treated as ║
// ║          proof of inactivity. A missed reclaim costs a leaked directory;  ║
// ║          a wrong one destroys another run's uncommitted work, which has   ║
// ║          no committed copy to restore from.                               ║
// ║                                                                          ║
// ║          The lease file is a loop-lock record, written and refreshed by   ║
// ║          the same primitives as every other deep-loop lock, so there is   ║
// ║          one locking contract in the runtime instead of a second one      ║
// ║          free to drift from it. Nothing in the runtime calls this module  ║
// ║          yet: it is the ownership mechanism on its own, wired in later.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  LoopLockHeldError,
  acquireLoopLock,
  isStaleLoopLock,
  processAlive,
  refreshLoopLock,
} from './loop-lock.js';

import type { LoopLockData } from './loop-lock.js';

// ─────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────

/** Lease states a caller may write. Only `active` trees can ever be reclaimed. */
export const WORKTREE_LEASE_STATES = ['active', 'claimed', 'retained'] as const;

/**
 * State of a worktree lease.
 *
 * `claimed` and `retained` are deliberately terminal for reclamation purposes: a claimed
 * tree has been handed to a consumer that may not have read it yet, and a retained tree was
 * kept on purpose after a failed publish, which is exactly when its uncommitted work is most
 * valuable. Both stay put until a human decides otherwise.
 */
export type WorktreeLeaseState = typeof WORKTREE_LEASE_STATES[number];

/** What the owning run tells the lease at write time. */
export interface WorktreeLeaseRequest {
  ownerPid: number;
  runId: string;
  label: string;
  ttlMs: number;
}

/**
 * The lease as read back from disk.
 *
 * `state` stays a plain string instead of the writable union: a value this module does not
 * recognise has to be able to name itself in a decision reason rather than being coerced
 * into a known state. Identity fields degrade to `''` when the on-disk record lost them --
 * reclamation never rests on identity, so a lease whose identity was truncated is still read
 * as a lease. Downgrading it to unmarked is the one classification that eventually becomes
 * reclaimable, and that is how a corrupt identity would end in a deleted worktree.
 */
export interface WorktreeLeaseRecord {
  ownerPid: number;
  runId: string;
  label: string;
  state: string;
  ttlMs: number;
  startedAtIso: string;
  lastHeartbeatIso: string;
  acquireNonce?: string;
}

/**
 * Why a sweep may, or may not, delete a worktree directory.
 *
 * The reason is load-bearing: a caller records it, so a log or a test can tell a decision
 * that discriminated between the checks apart from one that merely produced the expected
 * boolean by accident.
 */
export type WorktreeReclaimReason =
  | 'stale-lease-owner-dead'
  | 'unmarked-beyond-grace'
  | 'state-claimed'
  | 'state-retained'
  | 'state-unrecognized'
  | 'heartbeat-not-stale'
  | 'owner-process-alive'
  | 'lease-missing-within-grace'
  | 'lease-unreadable-within-grace'
  | 'worktree-directory-missing';

export interface WorktreeReclaimDecision {
  reclaimable: boolean;
  reason: WorktreeReclaimReason;
}

export interface WorktreeReclaimOptions {
  /** Clock used for the heartbeat and grace comparisons. Defaults to now. */
  now?: Date;
  /** How long an unmarked directory must sit untouched before it counts as abandoned. */
  graceMs: number;
}

/** File name of the lease inside the worktree directory. */
export const WORKTREE_LEASE_FILENAME = '.fanout-worktree.lock';

// ─────────────────────────────────────────────────────────────────────
// 2. ON-DISK VIEW
// ─────────────────────────────────────────────────────────────────────

type LeaseRead =
  | { kind: 'lease'; record: WorktreeLeaseRecord }
  | { kind: 'missing' }
  | { kind: 'unreadable' };

function leasePathFor(worktreeDir: string): string {
  return join(worktreeDir, WORKTREE_LEASE_FILENAME);
}

/**
 * Project an on-disk lock record into the lease view.
 *
 * Only liveness-bearing fields are required: owner pid, ttl, heartbeat and state. Identity
 * is optional by design -- see `WorktreeLeaseRecord`.
 *
 * @param raw - Parsed JSON of the lease file.
 * @returns The lease record, or null when the file is not a record this module may act on.
 */
function projectLeaseRecord(raw: unknown): WorktreeLeaseRecord | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const fields = raw as Record<string, unknown>;
  const ownerPid = fields.owner_pid;
  const ttlMs = fields.ttl_ms;
  const lastHeartbeatIso = fields.last_heartbeat_iso;
  const phase = fields.phase;

  if (typeof ownerPid !== 'number' || !Number.isInteger(ownerPid) || ownerPid <= 0) {
    return null;
  }
  if (typeof ttlMs !== 'number' || !Number.isFinite(ttlMs) || ttlMs <= 0) {
    return null;
  }
  if (typeof lastHeartbeatIso !== 'string' || lastHeartbeatIso.length === 0) {
    return null;
  }
  if (typeof phase !== 'string' || phase.length === 0) {
    return null;
  }

  const record: WorktreeLeaseRecord = {
    ownerPid,
    runId: typeof fields.packet_id === 'string' ? fields.packet_id : '',
    label: typeof fields.runtime_kind === 'string' ? fields.runtime_kind : '',
    state: phase,
    ttlMs,
    startedAtIso:
      typeof fields.started_at_iso === 'string' && fields.started_at_iso.length > 0
        ? fields.started_at_iso
        : lastHeartbeatIso,
    lastHeartbeatIso,
  };

  if (typeof fields.acquire_nonce === 'string' && fields.acquire_nonce.length > 0) {
    record.acquireNonce = fields.acquire_nonce;
  }

  return record;
}

function readWorktreeLease(worktreeDir: string): LeaseRead {
  const leasePath = leasePathFor(worktreeDir);
  if (!existsSync(leasePath)) {
    return { kind: 'missing' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(leasePath, 'utf8'));
  } catch {
    return { kind: 'unreadable' };
  }

  const record = projectLeaseRecord(parsed);
  return record === null ? { kind: 'unreadable' } : { kind: 'lease', record };
}

/**
 * The lease's projection onto the loop-lock record.
 *
 * Every lease field has to live in a slot the refresh path preserves verbatim. Refreshing a
 * heartbeat re-serializes the record through the lock's own writer, which knows only the
 * lock's fields and silently drops anything else -- so a lease-only JSON key would vanish on
 * the first heartbeat. A lease whose state vanished reads as unmarked, and an unmarked
 * directory past its grace window is reclaimable: a routine refresh would thereby become the
 * deletion this lease exists to prevent. The lock schema has exactly three round-tripping
 * free-form string slots, and this is how the lease fills them.
 */
function leaseToLoopLockData(record: WorktreeLeaseRecord): LoopLockData {
  const lock: LoopLockData = {
    ownerPid: record.ownerPid,
    startedAtIso: record.startedAtIso,
    ttlMs: record.ttlMs,
    lastHeartbeatIso: record.lastHeartbeatIso,
    packetId: record.runId,
    // The label rides the runtime-kind slot for the round-trip reason above. Nothing reads a
    // runtime kind out of this file -- the file name marks it as a lease, not a loop lock,
    // and no lock consumer scans for it.
    runtimeKind: record.label as LoopLockData['runtimeKind'],
    phase: record.state,
    lastActivityIso: record.lastHeartbeatIso,
  };

  if (record.acquireNonce !== undefined) {
    lock.acquireNonce = record.acquireNonce;
  }

  return lock;
}

/**
 * The heartbeat-age half of staleness, with owner liveness held constant on purpose.
 *
 * `isStaleLoopLock` answers "heartbeat expired OR owner gone", so on its own it cannot tell
 * those two apart: a lease whose owner died a second ago already reads as stale. Reclaim
 * requires both signals separately -- this check proves the heartbeat itself went quiet, and
 * `processAlive` proves nobody is left to extend it -- so the expiry rule is evaluated here
 * against a pid that is known to be alive right now (this one). Re-deriving "twice the ttl"
 * locally is exactly how the two definitions drift apart.
 */
function heartbeatExpiredBeyondTwiceTtl(record: WorktreeLeaseRecord, now: Date): boolean {
  return isStaleLoopLock({ ...leaseToLoopLockData(record), ownerPid: process.pid }, now);
}

function isWorktreeLeaseState(value: unknown): value is WorktreeLeaseState {
  return typeof value === 'string' && WORKTREE_LEASE_STATES.some((state) => state === value);
}

/** Name the state that held a reclaim decision, including states this module does not know. */
function stateHeldReason(state: string): WorktreeReclaimReason {
  if (state === 'claimed') {
    return 'state-claimed';
  }
  if (state === 'retained') {
    return 'state-retained';
  }
  return 'state-unrecognized';
}

function assertWorktreeDir(worktreeDir: string): void {
  if (typeof worktreeDir !== 'string' || worktreeDir.length === 0) {
    throw new TypeError('Worktree lease requires a non-empty worktree directory');
  }
}

/**
 * Reject a lease that could not prove liveness or could not be attributed.
 *
 * A record with a bogus pid or ttl would sit on disk looking like a dead owner and become
 * reclaimable while the run that wrote it is still working, so bad identities are refused at
 * the boundary instead of being written and judged later.
 */
function assertLeaseRequest(request: WorktreeLeaseRequest): void {
  if (!Number.isInteger(request.ownerPid) || request.ownerPid <= 0) {
    throw new TypeError('Worktree lease requires a positive integer ownerPid');
  }
  if (typeof request.runId !== 'string' || request.runId.length === 0) {
    throw new TypeError('Worktree lease requires a non-empty runId');
  }
  if (typeof request.label !== 'string' || request.label.length === 0) {
    throw new TypeError('Worktree lease requires a non-empty label');
  }
  if (!Number.isFinite(request.ttlMs) || request.ttlMs <= 0) {
    throw new TypeError('Worktree lease requires a positive finite ttlMs');
  }
}

// ─────────────────────────────────────────────────────────────────────
// 3. WRITE, REFRESH, TRANSITION
// ─────────────────────────────────────────────────────────────────────

/**
 * Write the lease that marks a worktree as owned and in use.
 *
 * The lease is written through the loop-lock acquire path, so it inherits the same atomic
 * publish, stale-holder reclamation and fencing nonce as every other deep-loop lock. A live
 * existing lease is a conflict rather than something to overwrite: replacing it would erase
 * the only evidence that another run is still writing in that directory.
 *
 * @param worktreeDir - Worktree directory that will hold the lease.
 * @param request - Owning run identity and heartbeat budget.
 * @returns The lease as written, including its fencing nonce, so the caller can carry both.
 * @throws {TypeError} When the request cannot describe a live, attributable owner.
 * @throws {LoopLockHeldError} When a live lease already owns the directory.
 */
export function writeWorktreeLease(
  worktreeDir: string,
  request: WorktreeLeaseRequest,
): WorktreeLeaseRecord {
  assertWorktreeDir(worktreeDir);
  assertLeaseRequest(request);

  const nowIso = new Date().toISOString();
  const record: WorktreeLeaseRecord = {
    ownerPid: request.ownerPid,
    runId: request.runId,
    label: request.label,
    state: 'active',
    ttlMs: request.ttlMs,
    startedAtIso: nowIso,
    lastHeartbeatIso: nowIso,
  };

  const leasePath = leasePathFor(worktreeDir);
  const result = acquireLoopLock(leasePath, leaseToLoopLockData(record));
  if (!result.acquired) {
    if (result.holder) {
      throw new LoopLockHeldError(result.holder);
    }
    throw new Error(`Worktree lease at ${leasePath} was not written and no holder could be read back`);
  }

  return { ...record, acquireNonce: result.lock.acquireNonce };
}

/**
 * Extend the lease heartbeat.
 *
 * Safe to call on a cadence and safe to ignore: it never throws, and a directory without a
 * readable lease just reports false. Only the heartbeat moves -- the state rides through
 * unchanged, so a refresh can never revive a claimed or retained tree.
 *
 * @param worktreeDir - Worktree directory holding the lease.
 * @returns True when the heartbeat was written.
 */
export function refreshWorktreeLease(worktreeDir: string): boolean {
  try {
    const read = readWorktreeLease(worktreeDir);
    if (read.kind !== 'lease') {
      return false;
    }

    // The nonce is the lock's fencing token: a refresh that cannot present the one stored
    // with the record is rejected as a different owner, so it is read back rather than
    // re-derived. Refreshing needs no identity argument of its own because its only possible
    // effect is to extend a lease, never to end or relabel one.
    const nonce = read.record.acquireNonce;
    return refreshLoopLock(
      leasePathFor(worktreeDir),
      read.record.ownerPid,
      new Date(),
      nonce === undefined ? {} : { acquireNonce: nonce },
    );
  } catch {
    return false;
  }
}

/**
 * Move the lease to a new state.
 *
 * The transition carries the same owner identity as a refresh -- owner pid plus fencing
 * nonce -- so a foreign process cannot relabel someone else's worktree. A directory with no
 * readable lease reports false instead of fabricating ownership, because a lease created
 * here would claim a tree this caller never acquired.
 *
 * @param worktreeDir - Worktree directory holding the lease.
 * @param state - Target state. `retained` marks a tree kept on purpose after a failed publish.
 * @returns True when the state was written.
 * @throws {TypeError} When `state` is not a state a lease may hold.
 */
export function setWorktreeLeaseState(worktreeDir: string, state: WorktreeLeaseState): boolean {
  assertWorktreeDir(worktreeDir);
  if (!isWorktreeLeaseState(state)) {
    throw new TypeError(`Unknown worktree lease state: ${String(state)}`);
  }

  try {
    const read = readWorktreeLease(worktreeDir);
    if (read.kind !== 'lease') {
      return false;
    }

    const nonce = read.record.acquireNonce;
    return refreshLoopLock(leasePathFor(worktreeDir), read.record.ownerPid, new Date(), {
      phase: state,
      ...(nonce === undefined ? {} : { acquireNonce: nonce }),
    });
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────
// 4. RECLAIM DECISION
// ─────────────────────────────────────────────────────────────────────

/**
 * Decide whether a sweep may delete this worktree directory.
 *
 * Reclaim holds only when all three of these hold:
 *   1. the lease reads and its state is `active`;
 *   2. the heartbeat has gone quiet beyond twice its own ttl;
 *   3. the owner pid no longer exists.
 *
 * Each refusal names the check that held it, so a caller can distinguish a decision that
 * discriminated from one that merely produced the expected boolean. The two halves of
 * staleness are required separately and deliberately: a dead owner whose heartbeat is still
 * fresh may have died mid-write, and its tree is left alone until the heartbeat itself runs
 * out. The only reclaimable unmarked case is a directory that has been quiet past the grace
 * window, since a worktree is built before its lease is written and the directory mtime is
 * the only evidence of how recently creation touched it.
 *
 * @param worktreeDir - Worktree directory under consideration.
 * @param options - Reference clock and the unmarked grace window.
 * @returns The decision and the reason that produced it.
 * @throws {TypeError} When the grace window or clock cannot be used as a comparison.
 */
export function isWorktreeReclaimable(
  worktreeDir: string,
  options: WorktreeReclaimOptions,
): WorktreeReclaimDecision {
  assertWorktreeDir(worktreeDir);

  // A garbage grace window would silently disable the grace check (every comparison against
  // NaN is false, which reads as "older than grace"), and a garbage clock would make every
  // lease look like it had been quiet forever -- both would turn the one conservative input
  // of this decision into a permission. Refuse instead of guessing.
  if (!Number.isFinite(options.graceMs) || options.graceMs < 0) {
    throw new TypeError('Worktree reclaim requires a non-negative finite graceMs');
  }

  const now = options.now ?? new Date();
  if (!Number.isFinite(now.getTime())) {
    throw new TypeError('Worktree reclaim requires a valid reference clock');
  }

  let directoryMtimeMs: number;
  try {
    directoryMtimeMs = statSync(worktreeDir).mtimeMs;
  } catch {
    // There is nothing here to reclaim. Reporting it as reclaimable would invite a caller to
    // delete a path it only believes exists; the honest answer is that the worktree is gone.
    return { reclaimable: false, reason: 'worktree-directory-missing' };
  }

  const read = readWorktreeLease(worktreeDir);
  if (read.kind !== 'lease') {
    const unmarkedAgeMs = now.getTime() - directoryMtimeMs;
    if (unmarkedAgeMs <= options.graceMs) {
      return {
        reclaimable: false,
        reason: read.kind === 'missing' ? 'lease-missing-within-grace' : 'lease-unreadable-within-grace',
      };
    }
    return { reclaimable: true, reason: 'unmarked-beyond-grace' };
  }

  const record = read.record;
  if (record.state !== 'active') {
    return { reclaimable: false, reason: stateHeldReason(record.state) };
  }

  if (!heartbeatExpiredBeyondTwiceTtl(record, now)) {
    return { reclaimable: false, reason: 'heartbeat-not-stale' };
  }

  if (processAlive(record.ownerPid)) {
    return { reclaimable: false, reason: 'owner-process-alive' };
  }

  return { reclaimable: true, reason: 'stale-lease-owner-dead' };
}
