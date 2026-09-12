// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Worktree Publication
// ───────────────────────────────────────────────────────────────────

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: run-keyed publication of a finished lineage directory         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: A lineage works in its own worktree, and what it produced has   ║
// ║          to come back out. The main checkout is the one surface every    ║
// ║          writer can reach, so publication is a named operation with one  ║
// ║          owner instead of four writers racing one path: this run's own   ║
// ║          salvage pass, a second fan-out reusing the same label, the      ║
// ║          operator's hand edits, and a stale copy from a previous run.    ║
// ║                                                                          ║
// ║          Four properties are deliberate rather than incidental:          ║
// ║          - the target is keyed by RUN, so two runs sharing a lineage     ║
// ║            label never target the same directory. The collision is       ║
// ║            removed rather than refereed;                                 ║
// ║          - content is staged under the target's own parent, on the same  ║
// ║            filesystem as the target, so publishing is one rename and is  ║
// ║            therefore atomic. Staging inside the worktree risks a         ║
// ║            cross-device rename, which is a copy and is not atomic;       ║
// ║          - the staging manifest is written LAST, so its presence is      ║
// ║            what marks a staging directory complete. A publisher that     ║
// ║            dies mid-copy leaves an unmarked directory that nothing can   ║
// ║            mistake for a finished copy;                                  ║
// ║          - an existing published directory is renamed into an attic,     ║
// ║            never deleted. What is in there may be an operator's hand     ║
// ║            edits, and a rename keeps them recoverable.                   ║
// ║                                                                          ║
// ║          Wired into nothing yet: this is the mechanism on its own.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, isAbsolute, join, resolve } from 'node:path';

import { acquireLoopLock, isStaleLoopLock, releaseLoopLock } from './loop-lock.js';
import type { LoopLockData } from './loop-lock.js';

// ─────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────

export interface PublishLineageDirectoryInput {
  /** The main checkout. A relative `sourceDir` or `targetParent` resolves against it. */
  repoRoot: string;
  /** Finished lineage directory, usually inside the lineage's own worktree. */
  sourceDir: string;
  /** Directory in the main checkout the published directory is created under. */
  targetParent: string;
  /** Lineage label, unique within a run. */
  label: string;
  /** Run identity. Keying the target by it is what keeps two runs apart. */
  runId: string;
  /** Attempt within the run, so residue from an earlier attempt is recognisable. */
  attempt: number;
  /** Process that owns the claim while the publish is in flight. */
  ownerPid: number;
  /** Claim budget in milliseconds. */
  ttlMs: number;
}

/**
 * Outcome of a publish, as the caller needs to act on it.
 *
 * The token is load-bearing: a caller records it, so a log or a test can tell a decision that
 * discriminated between the checks apart from one that merely produced the expected boolean.
 */
export type PublishLineageReason =
  | 'published'
  | 'published-after-moving-target-aside'
  | 'source-missing'
  | 'source-holds-manifest-name'
  | 'target-claim-held'
  | 'copy-failed'
  | 'rename-failed';

export interface PublishLineageDirectoryResult {
  ok: boolean;
  /** Absolute path of the published directory; null when nothing was published. */
  publishedPath: string | null;
  /** Absolute path an existing target was renamed to; null when the target was free. */
  movedAsidePath: string | null;
  reason: PublishLineageReason;
}

export interface SweepStagingResidueInput {
  targetParent: string;
  runId: string;
}

export interface SweepStagingResidueResult {
  ok: boolean;
  /** Absolute paths that were removed: staging directories and stale claims of this run. */
  removed: string[];
  /** Staging directories left alone because a live claim still guards their target. */
  inUse: string[];
  /** One entry per path that could not be removed. */
  errors: string[];
}

/** One published file, as the manifest records it. */
interface ManifestEntry {
  /** Published-directory-relative POSIX path. */
  path: string;
  kind: 'file' | 'symlink';
  bytes?: number;
  sha256?: string;
  link_target?: string;
}

interface PublishManifest {
  run_id: string;
  label: string;
  attempt: number;
  source_dir: string;
  published_at_iso: string;
  entries: ManifestEntry[];
}

// ─────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────

/** Manifest whose presence marks a staging directory complete. */
const PUBLISH_MANIFEST_FILENAME = 'publish-manifest.json';

/** Staging directories are named by this prefix so a sweep can recognize its own run's residue. */
const STAGING_DIRNAME_PREFIX = '.staging-';

/** A publish claim sits beside the target it guards, under this suffix. */
const CLAIM_PATH_SUFFIX = '.publish.lock';

/** Where a displaced published directory is kept. Inside the target parent, never deleted. */
const ATTIC_DIRNAME = '.publish-attic';

/**
 * Phase recorded on the claim.
 *
 * Kept distinct from the loop's own running phase so a claim read back by hand cannot be
 * mistaken for the run lock.
 */
const CLAIM_PHASE = 'publishing';

// ─────────────────────────────────────────────────────────────────────
// 3. NAMES AND PATHS
// ─────────────────────────────────────────────────────────────────────

/**
 * A single directory-name segment: no separators, no traversal, no NUL.
 *
 * The same rule the worktree lifecycle applies to its own name segments. Run ids and labels
 * arrive from a caller and become path segments here, so a segment that could traverse must
 * never reach a path.
 */
function isSafeSegment(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value !== '.' &&
    value !== '..' &&
    !value.includes('/') &&
    !value.includes('\\') &&
    !value.includes('\0')
  );
}

/** The published directory's name: run first, so runs sharing a label can never collide. */
function publishedDirName(runId: string, label: string): string {
  return `${runId}-${label}`;
}

/** The staging directory's name: recognisably residue of this run and this attempt. */
function stagingDirName(runId: string, label: string, attempt: number): string {
  return `${STAGING_DIRNAME_PREFIX}${publishedDirName(runId, label)}-${attempt}`;
}

/**
 * The claim path for a target: a sibling of the target, in the target's own parent.
 *
 * Beside the target rather than inside it, because the target may not exist yet and may be
 * replaced by a rename while the claim is held.
 */
function publishClaimPath(publishedPath: string): string {
  return `${publishedPath}${CLAIM_PATH_SUFFIX}`;
}

/**
 * The published directory a run's staging directory belongs to, or null when the name is not one
 * that run wrote.
 *
 * Scoped by run rather than by the staging prefix alone: another run's staging directory sits in
 * the same target parent, and a sweep that cannot tell whose it is must not reclaim it.
 *
 * Only the attempt is stripped. The label is free-form and may itself end in digits, so the
 * attempt is read off the end and everything between it and the run id stays the label.
 */
function stagingTargetName(stagingName: string, runId: string): string | null {
  const prefix = `${STAGING_DIRNAME_PREFIX}${runId}-`;
  if (!stagingName.startsWith(prefix)) {
    return null;
  }

  const attemptSuffix = stagingName.slice(prefix.length);
  const attemptAt = attemptSuffix.lastIndexOf('-');
  if (attemptAt <= 0 || !/^\d+$/.test(attemptSuffix.slice(attemptAt + 1))) {
    return null;
  }

  return `${runId}-${attemptSuffix.slice(0, attemptAt)}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────
// 4. STAGING
// ─────────────────────────────────────────────────────────────────────

function sha256Of(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * Copy one entry of the lineage directory into the staging directory, recording it in the manifest.
 *
 * A symlink is recreated as a link rather than followed: a lineage tree carries links to shared
 * dependency roots, and following one would drag a whole dependency tree into the main checkout
 * instead of the handful of files the lineage produced.
 *
 * Entries are walked in name order so the same tree always produces the same manifest, and a
 * type that is neither file, directory nor symlink fails the copy rather than being dropped
 * silently.
 */
function stageEntry(input: {
  sourceAbs: string;
  stagingAbs: string;
  relPosix: string;
  entries: ManifestEntry[];
}): void {
  const stats = lstatSync(input.sourceAbs);

  if (stats.isSymbolicLink()) {
    const linkTarget = readlinkSync(input.sourceAbs);
    symlinkSync(linkTarget, input.stagingAbs);
    input.entries.push({ path: input.relPosix, kind: 'symlink', link_target: linkTarget });
    return;
  }

  if (stats.isDirectory()) {
    mkdirSync(input.stagingAbs, { recursive: true });
    for (const name of [...readdirSync(input.sourceAbs)].sort()) {
      stageEntry({
        sourceAbs: join(input.sourceAbs, name),
        stagingAbs: join(input.stagingAbs, name),
        relPosix: input.relPosix === '' ? name : `${input.relPosix}/${name}`,
        entries: input.entries,
      });
    }
    return;
  }

  if (!stats.isFile()) {
    throw new Error(`unsupported entry type in the lineage directory: ${input.relPosix}`);
  }

  const bytes = readFileSync(input.sourceAbs);
  copyFileSync(input.sourceAbs, input.stagingAbs);
  input.entries.push({
    path: input.relPosix,
    kind: 'file',
    bytes: bytes.byteLength,
    sha256: sha256Of(bytes),
  });
}

/**
 * Stage a complete copy of the lineage directory, then mark it complete.
 *
 * The manifest is written LAST and is the only completion marker there is: a publisher that dies
 * during the walk leaves a directory that any later reader, human or sweep, can see is unfinished
 * without having to guess from its contents.
 *
 * The finished copy becomes the published directory by rename, so the manifest stays inside it:
 * the published directory carries its own provenance, and the marker is what made the staging
 * directory publishable in the first place.
 */
function stageCompleteCopy(input: {
  sourceDir: string;
  stagingDir: string;
  runId: string;
  label: string;
  attempt: number;
}): void {
  const entries: ManifestEntry[] = [];
  stageEntry({ sourceAbs: input.sourceDir, stagingAbs: input.stagingDir, relPosix: '', entries });

  const manifest: PublishManifest = {
    run_id: input.runId,
    label: input.label,
    attempt: input.attempt,
    source_dir: input.sourceDir,
    published_at_iso: new Date().toISOString(),
    entries,
  };

  writeFileSync(
    join(input.stagingDir, PUBLISH_MANIFEST_FILENAME),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

/**
 * Remove a staging directory this call created.
 *
 * Best effort by design: a staging directory that will not go away is residue the sweep
 * reclaims, and it must not turn a refusal into a thrown failure.
 */
function discardStaging(stagingDir: string): void {
  try {
    rmSync(stagingDir, { recursive: true, force: true });
  } catch {
    // Residue, not a failure: the caller is told about the outcome that matters.
  }
}

// ─────────────────────────────────────────────────────────────────────
// 5. CLAIM
// ─────────────────────────────────────────────────────────────────────

/** The lock record a publish claim holds, as the lock file stores it. */
function readClaimLock(claimPath: string): LoopLockData | null {
  try {
    const raw = JSON.parse(readFileSync(claimPath, 'utf8')) as Record<string, unknown>;
    const ownerPid = raw.owner_pid;
    const ttlMs = raw.ttl_ms;
    const lastHeartbeatIso = raw.last_heartbeat_iso;

    if (typeof ownerPid !== 'number' || !Number.isInteger(ownerPid) || ownerPid <= 0) return null;
    if (typeof ttlMs !== 'number' || !Number.isFinite(ttlMs) || ttlMs <= 0) return null;
    if (typeof lastHeartbeatIso !== 'string' || lastHeartbeatIso.length === 0) return null;

    return {
      ownerPid,
      startedAtIso: typeof raw.started_at_iso === 'string' ? raw.started_at_iso : lastHeartbeatIso,
      ttlMs,
      lastHeartbeatIso,
      packetId: typeof raw.packet_id === 'string' ? raw.packet_id : '',
      runtimeKind: (typeof raw.runtime_kind === 'string' ? raw.runtime_kind : 'main') as LoopLockData['runtimeKind'],
      phase: typeof raw.phase === 'string' ? raw.phase : CLAIM_PHASE,
      lastActivityIso: lastHeartbeatIso,
    };
  } catch {
    return null;
  }
}

/**
 * True when a claim is still held by someone who can act on it.
 *
 * An unreadable claim is not live: the lock writer publishes a complete record or nothing at all,
 * so a file that will not parse cannot be held by anybody. Staleness is the lock's own rule --
 * owner process gone, or heartbeat past twice its own ttl -- reused here rather than re-derived,
 * because a second definition of staleness is a second answer to the same question.
 */
function claimIsLive(claimPath: string): boolean {
  if (!existsSync(claimPath)) {
    return false;
  }

  const record = readClaimLock(claimPath);
  return record !== null && !isStaleLoopLock(record);
}

/** The record a publish claim is written with. */
function claimData(input: { runId: string; ownerPid: number; ttlMs: number }): LoopLockData {
  const nowIso = new Date().toISOString();
  return {
    ownerPid: input.ownerPid,
    startedAtIso: nowIso,
    ttlMs: input.ttlMs,
    lastHeartbeatIso: nowIso,
    // The run rides the lock's packet slot so a refusal can name whose transaction it was. The
    // label needs no slot: it is already in the claim's own file name.
    packetId: input.runId,
    // The publisher is the run itself, never a dispatched executor leaf.
    runtimeKind: 'main',
    phase: CLAIM_PHASE,
    lastActivityIso: nowIso,
  };
}

// ─────────────────────────────────────────────────────────────────────
// 6. TARGET
// ─────────────────────────────────────────────────────────────────────

/**
 * Rename the existing published directory into the attic and report where it went.
 *
 * The attic lives in the target's own parent, so this rename stays on one filesystem and is
 * atomic for the same reason the publish rename is. The timestamp says when the occupant was
 * displaced; the suffix loop keeps two displacements in the same millisecond from colliding and
 * turning a recoverable overwrite into a lost publish.
 */
function moveTargetAside(publishedPath: string, targetParent: string): string {
  const atticDir = join(targetParent, ATTIC_DIRNAME);
  mkdirSync(atticDir, { recursive: true });

  const name = basename(publishedPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  let atticPath = join(atticDir, `${name}.${stamp}`);
  for (let suffix = 1; existsSync(atticPath); suffix += 1) {
    atticPath = join(atticDir, `${name}.${stamp}-${suffix}`);
  }

  renameSync(publishedPath, atticPath);
  return atticPath;
}

// ─────────────────────────────────────────────────────────────────────
// 7. PUBLISH
// ─────────────────────────────────────────────────────────────────────

/**
 * Reject a call that cannot describe a publishable run.
 *
 * A bogus identity is a programming error, not a publish outcome: it is refused here rather than
 * written into a claim file that would then sit on the shared surface looking like a dead owner's.
 */
function assertPublishInput(input: PublishLineageDirectoryInput): void {
  for (const [field, value] of [
    ['repoRoot', input.repoRoot],
    ['sourceDir', input.sourceDir],
    ['targetParent', input.targetParent],
  ] as const) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new TypeError(`Publish requires a non-empty ${field}`);
    }
  }
  if (!isSafeSegment(input.runId)) {
    throw new TypeError('Publish requires a runId that is a safe path segment');
  }
  if (!isSafeSegment(input.label)) {
    throw new TypeError('Publish requires a label that is a safe path segment');
  }
  if (!Number.isInteger(input.attempt) || input.attempt < 0) {
    throw new TypeError('Publish requires a non-negative integer attempt');
  }
  if (!Number.isInteger(input.ownerPid) || input.ownerPid <= 0) {
    throw new TypeError('Publish requires a positive integer ownerPid');
  }
  if (!Number.isFinite(input.ttlMs) || input.ttlMs <= 0) {
    throw new TypeError('Publish requires a positive finite ttlMs');
  }
}

/**
 * Move a finished lineage directory into the main checkout, under a run-keyed name.
 *
 * Two things are true of every failure below: nothing here ever deletes what it found, and a
 * failed publish leaves the caller free to retain its worktree, because the worktree is the only
 * copy of work that was not published.
 *
 * @param input - Source lineage directory, publish target, run identity and claim budget.
 * @returns Whether the directory was published, where it landed, what was displaced, and why.
 * @throws {TypeError} When the call cannot describe a live, attributable publisher.
 */
export function publishLineageDirectory(
  input: PublishLineageDirectoryInput,
): PublishLineageDirectoryResult {
  assertPublishInput(input);

  const repoRoot = resolve(input.repoRoot);
  const sourceDir = isAbsolute(input.sourceDir) ? input.sourceDir : resolve(repoRoot, input.sourceDir);
  const targetParent = isAbsolute(input.targetParent) ? input.targetParent : resolve(repoRoot, input.targetParent);

  if (!isDirectory(sourceDir)) {
    // There is nothing to publish. Reporting it as anything else would invite the caller to
    // release a worktree whose contents were never read.
    return { ok: false, publishedPath: null, movedAsidePath: null, reason: 'source-missing' };
  }

  if (existsSync(join(sourceDir, PUBLISH_MANIFEST_FILENAME))) {
    // The manifest is this module's completion marker and it would overwrite a real file of the
    // lineage's, leaving a manifest whose own entries no longer match the bytes on disk.
    return {
      ok: false,
      publishedPath: null,
      movedAsidePath: null,
      reason: 'source-holds-manifest-name',
    };
  }

  const publishedPath = join(targetParent, publishedDirName(input.runId, input.label));
  const stagingDir = join(targetParent, stagingDirName(input.runId, input.label, input.attempt));
  const claimPath = publishClaimPath(publishedPath);

  // Staged beside the target, never inside the worktree: staging in the worktree would put the
  // copy on the worktree's filesystem, where the final rename may become a cross-device copy that
  // can fail half-done. The copy itself is unclaimed, so the claim never has to outlive a walk
  // over an unknown number of files.
  try {
    mkdirSync(targetParent, { recursive: true });
    // An earlier attempt of this run may have died holding this staging path. Clearing it first
    // starts this attempt from an empty directory instead of merging into a copy nothing finished.
    rmSync(stagingDir, { recursive: true, force: true });
    stageCompleteCopy({
      sourceDir,
      stagingDir,
      runId: input.runId,
      label: input.label,
      attempt: input.attempt,
    });
  } catch {
    discardStaging(stagingDir);
    return { ok: false, publishedPath: null, movedAsidePath: null, reason: 'copy-failed' };
  }

  // The claim is a sibling of the target and is held across BOTH the existence check and the
  // rename. Checking and then renaming without it leaves a window in which two publishers both
  // see a free target, and whichever renames second silently wins.
  const acquired = acquireLoopLock(claimPath, claimData(input));
  if (!acquired.acquired) {
    // Someone is publishing this exact target right now, so this copy is redundant: the source
    // the caller still holds is the better record of the attempt. Refusing is what lets the
    // caller retain its worktree instead of overwriting work that is still being written.
    discardStaging(stagingDir);
    return { ok: false, publishedPath: null, movedAsidePath: null, reason: 'target-claim-held' };
  }

  let movedAsidePath: string | null = null;
  try {
    // A rename cannot replace a non-empty directory on POSIX, so the occupant is moved out of the
    // way first and the staging directory takes its place. Between those two renames the target
    // path is briefly absent: a reader finds the new content or no content, never a half-old one,
    // and the displaced directory is in the attic rather than gone.
    if (existsSync(publishedPath)) {
      movedAsidePath = moveTargetAside(publishedPath, targetParent);
    }
    renameSync(stagingDir, publishedPath);
  } catch {
    discardStaging(stagingDir);
    return { ok: false, publishedPath: null, movedAsidePath, reason: 'rename-failed' };
  } finally {
    // Released here rather than after the return so the claim covers the whole check-and-rename
    // and is released even when the rename failed: a claim kept past its transaction only blocks
    // the next publisher.
    releaseLoopLock(claimPath, input.ownerPid, acquired.lock.acquireNonce);
  }

  return {
    ok: true,
    publishedPath,
    movedAsidePath,
    reason: movedAsidePath === null ? 'published' : 'published-after-moving-target-aside',
  };
}

// ─────────────────────────────────────────────────────────────────────
// 8. SWEEP
// ─────────────────────────────────────────────────────────────────────

function removePath(path: string, result: SweepStagingResidueResult): void {
  try {
    rmSync(path, { recursive: true, force: true });
    result.removed.push(path);
  } catch (error) {
    result.errors.push(`${path}: ${errorMessage(error)}`);
  }
}

/**
 * Reclaim this run's publish residue under a target parent.
 *
 * A publisher that dies mid-transaction leaves two things behind: a staging directory nothing
 * will ever rename, and possibly a claim file. Both are reclaimed here so a dead attempt leaves
 * state a later one can use rather than a permanent block.
 *
 * What is NOT reclaimed is a staging directory whose target still has a live claim: that claim is
 * evidence of a publisher still working in it, and a transaction's copy is not residue until
 * nobody is left to finish it. A claim is live only while its owner process answers, so a stale
 * claim is reclaimed first and the staging directory it guarded becomes reclaimable in the same
 * pass.
 *
 * Scoped to one run on purpose: it is meant to be called by the run that owns the id, before or
 * after its own publishes. Anything whose name does not parse as one of this run's staging
 * directories is left alone -- reclaiming a directory whose owner cannot be established is how a
 * sweep deletes live work.
 *
 * @param input - Target parent to sweep and the run whose residue may be reclaimed.
 * @returns The paths removed, the paths still in use, and anything that could not be removed.
 * @throws {TypeError} When the run or the target parent cannot name a path.
 */
export function sweepStagingResidue(input: SweepStagingResidueInput): SweepStagingResidueResult {
  if (!isSafeSegment(input.runId)) {
    throw new TypeError('Staging sweep requires a runId that is a safe path segment');
  }
  if (typeof input.targetParent !== 'string' || input.targetParent.length === 0) {
    throw new TypeError('Staging sweep requires a non-empty target parent');
  }

  const targetParent = resolve(input.targetParent);
  const result: SweepStagingResidueResult = { ok: true, removed: [], inUse: [], errors: [] };
  if (!isDirectory(targetParent)) {
    return result;
  }

  const names = [...readdirSync(targetParent)].sort();
  const runPrefix = `${input.runId}-`;

  // Stale claims first: an unheld claim is not evidence of a transaction in flight, and leaving
  // it would keep the staging directory it guards looking busy for this whole pass.
  for (const name of names) {
    if (!name.startsWith(runPrefix) || !name.endsWith(CLAIM_PATH_SUFFIX)) {
      continue;
    }
    const claimPath = join(targetParent, name);
    if (claimIsLive(claimPath)) {
      continue;
    }
    removePath(claimPath, result);
  }

  for (const name of names) {
    if (!name.startsWith(STAGING_DIRNAME_PREFIX)) {
      continue;
    }
    const targetName = stagingTargetName(name, input.runId);
    if (targetName === null) {
      continue;
    }

    const stagingPath = join(targetParent, name);
    if (claimIsLive(publishClaimPath(join(targetParent, targetName)))) {
      result.inUse.push(stagingPath);
      continue;
    }
    removePath(stagingPath, result);
  }

  result.ok = result.errors.length === 0;
  return result;
}
