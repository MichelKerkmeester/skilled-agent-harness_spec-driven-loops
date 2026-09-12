// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Worktree Reclaim Sweep
// ───────────────────────────────────────────────────────────────────

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: startup sweep of one runner-owned worktree prefix              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Reclaim worktrees an interrupted run left behind without         ║
// ║          deleting a live peer's tree. A deleted directory has no          ║
// ║          committed copy to restore from, so every entry is kept unless    ║
// ║          the liveness delegate returns positive proof of death, and every ║
// ║          entry leaves a decision with a reason: an empty directory        ║
// ║          listing and a sweep that correctly refused everything look the   ║
// ║          same without them.                                               ║
// ║                                                                          ║
// ║          Three guards run before the liveness question is even asked.     ║
// ║          The pass holds a lease on the shared prefix for its whole        ║
// ║          duration, because the prefix outlives any single run's lease and ║
// ║          a peer sweep is otherwise free to race this one over the same    ║
// ║          entries. The current run's own entries are live by definition.   ║
// ║          Labels the caller read from the ledger as resumable belong to    ║
// ║          the lanes a resume is about to requeue, so the sweep must not    ║
// ║          take their predecessor's tree before the resume reaches it; the  ║
// ║          parameter is required rather than defaulted, because a sweep     ║
// ║          that ran before the ledger read is indistinguishable from one    ║
// ║          that ran with no exclusions at all.                              ║
// ║                                                                          ║
// ║          Removal is delegated to the lineage lifecycle and liveness to    ║
// ║          the worktree lease, so this module owns only the sweep's         ║
// ║          ordering and its decisions -- never a second opinion about       ║
// ║          whether a tree is still owned.                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { mkdirSync, readdirSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

import { acquireLoopLock, releaseLoopLock } from './loop-lock.js';
import type { LoopLockData } from './loop-lock.js';
import { isWorktreeReclaimable } from './worktree-lease.js';
import { removeLineageWorktree } from './worktree-lifecycle.js';

// ─────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────

export type ReclaimWorktreeAction = 'reclaimed' | 'kept';

export interface ReclaimWorktreeDecision {
  /** Absolute directory the sweep considered. */
  path: string;
  action: ReclaimWorktreeAction;
  /** Why the entry was reclaimed or kept. Always present and never empty. */
  reason: string;
}

export interface ReclaimWorktreesInput {
  /** Checkout the worktrees are registered against; removal runs through it. */
  repoRoot: string;
  /** Directory holding the prefix's worktrees. A relative path resolves against `repoRoot`. */
  worktreeBase: string;
  /** Runner-owned name prefix that identifies this sweep's entries. */
  prefix: string;
  /** Run identity of the sweeping run. Its own entries are never candidates. */
  currentRunId: string;
  /** Process that owns the prefix lease for the duration of the pass. */
  ownerPid: number;
  /**
   * Lanes the ledger can resume. Required, not defaulted: an omitted value is an
   * error because "the ledger has not been read yet" and "no lane can be resumed"
   * must not be the same input.
   */
  resumableLabels: readonly string[];
  /** Clock for the lease timestamps and the liveness comparison. Defaults to now. */
  now?: Date;
  /** Unmarked-entry grace window, passed to the liveness delegate unchanged. */
  graceMs: number;
  /** Lease budget for the prefix lease, and the comparison window it carries. */
  ttlMs: number;
}

export interface ReclaimWorktreesResult {
  /** One decision per candidate entry, in directory-name order. */
  decisions: ReclaimWorktreeDecision[];
  /** Entries this pass removed, or found already gone. */
  reclaimed: number;
  /** Entries left in place. */
  kept: number;
}

/** Entry the sweep found in its own prefix namespace. */
interface CandidateEntry {
  /** Directory entry name exactly as it appears inside the base. */
  name: string;
  /** Absolute path of the entry. */
  path: string;
  /** False for files and for symlinks, which are never removal candidates. */
  isDirectory: boolean;
}

/** Validated, normalized view of the caller's input. */
interface NormalizedReclaimInput {
  repoRoot: string;
  worktreeBase: string;
  prefix: string;
  currentRunId: string;
  ownerPid: number;
  resumableLabels: readonly string[];
  now: Date | undefined;
  graceMs: number;
  ttlMs: number;
}

// ─────────────────────────────────────────────────────────────────────
// 2. DECISION REASONS
// ─────────────────────────────────────────────────────────────────────

const PREFIX_LEASE_HELD_REASON = 'prefix-lease-held-by-live-run';
const CURRENT_RUN_REASON = 'entry-belongs-to-current-run';
const RESUMABLE_LABEL_REASON = 'resumable-label';
const NOT_A_DIRECTORY_REASON = 'not-a-worktree-directory';
const REMOVAL_FAILED_REASON = 'worktree-removal-failed';

// ─────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────

/**
 * Lock file that serializes sweeps of one prefix under a shared base.
 *
 * The file sits beside the worktrees rather than inside one, because the resource
 * being guarded is the prefix itself: a lease scoped to a single run's directory
 * cannot exclude a peer sweep that is about to consider that directory's siblings.
 * The `.` separator also keeps the file out of this module's own candidate filter,
 * which looks for `<prefix>-` names, so the lease can never be mistaken for an
 * entry the sweep might try to remove.
 *
 * Does not resolve a relative base; pass the same base `reclaimWorktrees` uses.
 */
export function worktreePrefixLeasePath(worktreeBase: string, prefix: string): string {
  return join(worktreeBase, `${prefix}.reclaim.lock`);
}

function keptDecision(path: string, reason: string): ReclaimWorktreeDecision {
  return { path, action: 'kept', reason };
}

function requireSegment(value: unknown, field: string): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value === '.' ||
    value === '..' ||
    value.includes('/') ||
    value.includes('\\') ||
    value.includes('\0')
  ) {
    throw new TypeError(
      `Worktree reclaim requires a single path segment for ${field}: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

/**
 * Reject input that could make the sweep act outside its own prefix.
 *
 * The prefix and the current run id are both used to build a path and to match
 * directory names. A separator in either would point the prefix lease outside the
 * base and could make the sweep fail to recognize the current run's own trees,
 * which is the one misclassification this module exists to prevent.
 */
function normalizeReclaimInput(input: ReclaimWorktreesInput): NormalizedReclaimInput {
  if (input === null || typeof input !== 'object') {
    throw new TypeError('Worktree reclaim requires an input object');
  }

  const repoRootInput = typeof input.repoRoot === 'string' ? input.repoRoot : '';
  if (repoRootInput.length === 0) {
    throw new TypeError('Worktree reclaim requires a non-empty repoRoot');
  }
  const repoRoot = resolve(repoRootInput);

  const worktreeBaseInput = typeof input.worktreeBase === 'string' ? input.worktreeBase : '';
  if (worktreeBaseInput.length === 0) {
    throw new TypeError('Worktree reclaim requires a non-empty worktreeBase');
  }
  const worktreeBase = isAbsolute(worktreeBaseInput) ? worktreeBaseInput : resolve(repoRoot, worktreeBaseInput);

  const prefix = requireSegment(input.prefix, 'prefix');
  const currentRunId = requireSegment(input.currentRunId, 'currentRunId');

  if (!Number.isInteger(input.ownerPid) || input.ownerPid <= 0) {
    throw new TypeError('Worktree reclaim requires a positive integer ownerPid');
  }
  if (!Number.isFinite(input.graceMs) || input.graceMs < 0) {
    throw new TypeError('Worktree reclaim requires a non-negative finite graceMs');
  }
  if (!Number.isFinite(input.ttlMs) || input.ttlMs <= 0) {
    throw new TypeError('Worktree reclaim requires a positive finite ttlMs');
  }
  if (input.now !== undefined && (!(input.now instanceof Date) || !Number.isFinite(input.now.getTime()))) {
    throw new TypeError('Worktree reclaim requires a valid reference clock');
  }

  // Mandatory by contract. The caller must have read the ledger and answered which
  // lanes can be resumed; an omitted value means that read may not have happened
  // yet, and a sweep run against the wrong answer is how the lanes a resume is
  // about to requeue lose the only copy of their predecessor's work. Defaulting an
  // omission to `[]` would erase the distinction instead of surfacing it.
  if (!Array.isArray(input.resumableLabels)) {
    throw new TypeError(
      'Worktree reclaim requires resumableLabels from the ledger read; pass an empty array when no lane can be resumed',
    );
  }
  const resumableLabels = input.resumableLabels.map((label) => {
    if (typeof label !== 'string' || label.length === 0) {
      throw new TypeError('Worktree reclaim requires each resumableLabels entry to be a non-empty string');
    }
    return label;
  });

  return {
    repoRoot,
    worktreeBase,
    prefix,
    currentRunId,
    ownerPid: input.ownerPid,
    resumableLabels,
    now: input.now,
    graceMs: input.graceMs,
    ttlMs: input.ttlMs,
  };
}

function prefixLeaseData(sweep: NormalizedReclaimInput): LoopLockData {
  const startedAtIso = (sweep.now ?? new Date()).toISOString();
  return {
    ownerPid: sweep.ownerPid,
    startedAtIso,
    ttlMs: sweep.ttlMs,
    lastHeartbeatIso: startedAtIso,
    packetId: sweep.currentRunId,
    runtimeKind: 'main',
    phase: 'reclaiming',
  };
}

/**
 * Entries in this prefix's namespace, in one stable order.
 *
 * Only names starting with `<prefix>-` are candidates. Anything else in the base
 * belongs to a different owner and is never enumerated, so no code path in this
 * module can reach it. The worktree lease file is excluded by the same filter,
 * because it uses a `.` separator rather than a `-`.
 */
function listCandidateEntries(worktreeBase: string, prefix: string): CandidateEntry[] {
  let entries;
  try {
    entries = readdirSync(worktreeBase, { withFileTypes: true });
  } catch {
    // An unreadable base yields no entries this pass can prove anything about.
    return [];
  }

  return entries
    .filter((entry) => entry.name.startsWith(`${prefix}-`))
    .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
    .map((entry) => ({
      name: entry.name,
      path: join(worktreeBase, entry.name),
      isDirectory: entry.isDirectory(),
    }));
}

/**
 * Decide one entry, asking the liveness delegate only after the ownership guards.
 *
 * The joined name is `<prefix>-<runId>-<label>` and both the run id and the label
 * may contain `-`, so the two cannot be separated from the name alone. Current-run
 * membership is therefore an exact stem match on prefix plus run id, and resumable
 * membership is a suffix match on each label. Every imprecision in those matches
 * can only keep an entry that a stricter parse would have reclaimed, which is the
 * safe direction: a missed reclaim costs a directory, a wrong one costs work.
 */
function decideEntry(sweep: NormalizedReclaimInput, entry: CandidateEntry): ReclaimWorktreeDecision {
  if (!entry.isDirectory) {
    return keptDecision(entry.path, NOT_A_DIRECTORY_REASON);
  }

  if (entry.name.startsWith(`${sweep.prefix}-${sweep.currentRunId}-`)) {
    return keptDecision(entry.path, CURRENT_RUN_REASON);
  }

  if (sweep.resumableLabels.some((label) => entry.name.endsWith(`-${label}`))) {
    return keptDecision(entry.path, RESUMABLE_LABEL_REASON);
  }

  const verdict = isWorktreeReclaimable(
    entry.path,
    sweep.now === undefined ? { graceMs: sweep.graceMs } : { now: sweep.now, graceMs: sweep.graceMs },
  );
  if (!verdict.reclaimable) {
    return keptDecision(entry.path, verdict.reason);
  }

  // Force reaches only untracked residue inside a tree whose owner has already been
  // proven dead, which is exactly the leftover this sweep exists to clear; without
  // it a lane's own artefacts would make every removal fail forever.
  const removal = removeLineageWorktree({ repoRoot: sweep.repoRoot, worktreeDir: entry.path, force: true });
  if (!removal.ok) {
    return keptDecision(entry.path, `${REMOVAL_FAILED_REASON}: ${removal.error ?? 'git reported no detail'}`);
  }

  return { path: entry.path, action: 'reclaimed', reason: verdict.reason };
}

function sweepCandidates(sweep: NormalizedReclaimInput): ReclaimWorktreesResult {
  const decisions: ReclaimWorktreeDecision[] = [];
  let reclaimed = 0;

  for (const entry of listCandidateEntries(sweep.worktreeBase, sweep.prefix)) {
    const decision = decideEntry(sweep, entry);
    decisions.push(decision);
    if (decision.action === 'reclaimed') {
      reclaimed += 1;
    }
  }

  return { decisions, reclaimed, kept: decisions.length - reclaimed };
}

// ─────────────────────────────────────────────────────────────────────
// 4. SWEEP
// ─────────────────────────────────────────────────────────────────────

/**
 * Sweep one worktree prefix, removing only entries whose owner is proven dead.
 *
 * The pass takes the prefix lease for its whole duration, so two sweeps cannot
 * interleave over the same entries; a live holder aborts the pass with every entry
 * kept and named, because waiting would only delay the caller and forcing would
 * destroy the exclusivity the lease encodes. Stale leases are reclaimed by the lock
 * primitive itself, which is a different act from forcing a live one.
 *
 * Every candidate leaves a decision, kept or reclaimed, with the reason that
 * produced it. Removal is all-or-nothing per entry: a worktree whose removal fails
 * is reported kept with the failure, never counted as reclaimed.
 *
 * @param input - Prefix to sweep, the sweeping run's identity, and the ledger's
 *   resumable labels.
 * @returns Per-entry decisions plus the reclaimed and kept counts.
 * @throws {TypeError} When the input cannot describe a safe sweep, most importantly
 *   when `resumableLabels` is omitted.
 */
export function reclaimWorktrees(input: ReclaimWorktreesInput): ReclaimWorktreesResult {
  const sweep = normalizeReclaimInput(input);

  // The lease needs a home before it can be taken, and a base that does not exist
  // holds no entries to reclaim. Creating it is the runner's own directory, not a
  // caller's.
  mkdirSync(sweep.worktreeBase, { recursive: true });

  const leasePath = worktreePrefixLeasePath(sweep.worktreeBase, sweep.prefix);
  const acquired = acquireLoopLock(leasePath, prefixLeaseData(sweep));

  if (!acquired.acquired) {
    // A peer holds the prefix lease live. Every entry is reported kept with this
    // reason, so an aborted pass is distinguishable from a pass that examined every
    // entry and found none reclaimable. The peer's lease is left exactly as found.
    const decisions = listCandidateEntries(sweep.worktreeBase, sweep.prefix).map((entry) =>
      keptDecision(entry.path, PREFIX_LEASE_HELD_REASON),
    );
    return { decisions, reclaimed: 0, kept: decisions.length };
  }

  try {
    return sweepCandidates(sweep);
  } finally {
    // Released on every path, including a throw from removal, so a failed pass
    // cannot leave a lease that blocks every later sweep until it goes stale.
    try {
      releaseLoopLock(leasePath, sweep.ownerPid, acquired.lock.acquireNonce);
    } catch {
      // A lease that cannot be released is left to the lock primitive's own stale
      // reclamation; it must not replace the pass's own outcome with its error.
    }
  }
}
