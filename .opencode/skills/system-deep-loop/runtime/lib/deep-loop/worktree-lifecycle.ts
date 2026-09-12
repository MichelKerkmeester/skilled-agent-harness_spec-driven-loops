// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Lineage Worktree Lifecycle
// ───────────────────────────────────────────────────────────────────

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: per-lineage create / seed / remove of a detached worktree     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Give one lineage its own checkout of HEAD, so a write found     ║
// ║          outside the lineage directory inside that tree belongs to that  ║
// ║          lineage, and the shared checkout stops being a party to the     ║
// ║          run instead of a party whose writes are guessed at. The tree is ║
// ║          detached: no branch is created, so no name allocator is         ║
// ║          consulted and nothing enters a counter built for a workspace    ║
// ║          that lives for days.                                            ║
// ║                                                                          ║
// ║          Three properties are deliberate rather than incidental:         ║
// ║          - a fresh worktree has no installed dependencies, and the       ║
// ║            resulting failure reads as broken code rather than as a       ║
// ║            missing directory, so the shared dependency roots are         ║
// ║            symlinked in (same list and same containment rules as the     ║
// ║            launch-wrapper lane);                                         ║
// ║          - HEAD alone does not carry a packet that is still being        ║
// ║            written, so the working-tree bytes of the paths a lineage     ║
// ║            must read are seeded in;                                      ║
// ║          - the ownership lease is written last, so a half-created tree   ║
// ║            is never mistaken for an owned one. A tree with no lease is   ║
// ║            also exactly what the reclaim sweep may take once its grace   ║
// ║            window passes, which is how a creation that died mid-way      ║
// ║            cleans up without this module having to delete anything.      ║
// ║                                                                          ║
// ║          Every function returns a result instead of throwing. A lane     ║
// ║          that cannot be isolated has to degrade to the shared checkout,  ║
// ║          and a run that dies over one worktree takes every sibling lane  ║
// ║          down with it.                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
} from 'node:fs';
import type { Stats } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

import { releaseLoopLock } from './loop-lock.js';
import { WORKTREE_LEASE_FILENAME, writeWorktreeLease } from './worktree-lease.js';

// ─────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────

/**
 * A created worktree's location, or the reason the lane has to run elsewhere.
 *
 * The directory is absent from the failure branch on purpose: nothing was made, so
 * naming a path would invite a caller to treat it as a tree it may remove.
 */
export type CreateLineageWorktreeResult =
  | { ok: true; worktreeDir: string }
  | { ok: false; error: string };

export interface CreateLineageWorktreeInput {
  /** Checkout the tree is created from; its HEAD is the base commit. */
  repoRoot: string;
  /** Directory the per-lineage tree is placed under. Relative paths resolve against `repoRoot`. */
  worktreeBase: string;
  /** Runner-owned name prefix, so a later sweep can recognize the trees this runner made. */
  prefix: string;
  /** Run identity, unique per run. */
  runId: string;
  /** Lineage label, unique within the run. */
  label: string;
  /** Process that will own the tree while it is in use. */
  ownerPid: number;
  /** Lease budget in milliseconds. */
  ttlMs: number;
}

export interface SeedWorktreeInput {
  repoRoot: string;
  worktreeDir: string;
  /** Repo-relative POSIX paths whose current bytes the lineage has to be able to read. */
  paths: readonly string[];
}

/**
 * What a seed actually put in the worktree.
 *
 * `missing` and `skipped` are not failures. A path that does not exist in the working
 * tree has no bytes to copy, and a caller that treats its absence as an error would be
 * reporting the operator's own deletion back at them. `errors` holds the paths that
 * existed and still could not be written, and only those make `ok` false.
 */
export interface SeedWorktreeResult {
  ok: boolean;
  /** Requested paths whose bytes were written, in request order. */
  copied: string[];
  /** Requested paths absent from the working tree, so there was nothing to copy. */
  missing: string[];
  /** Requested paths or discovered entries not copied, with the reason they were left out. */
  skipped: string[];
  /** One entry per path that could not be written. */
  errors: string[];
}

export interface RemoveLineageWorktreeInput {
  repoRoot: string;
  worktreeDir: string;
  /**
   * Pass git's own force flag. Needed as soon as the lane left a byte behind in its
   * tree, which is the normal case for a lane that produced artefacts.
   */
  force?: boolean;
}

export interface RemoveLineageWorktreeResult {
  ok: boolean;
  /** True when the directory existed and this call is what took it away. */
  removed: boolean;
  error?: string;
}

/** Mutable tally shared by the seed walk, before it is closed into a `SeedWorktreeResult`. */
type SeedTally = Omit<SeedWorktreeResult, 'ok'>;

// ─────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────

/**
 * Dependency roots a lineage needs but a worktree made from HEAD does not have.
 *
 * Mirrors the launch-wrapper lane's list, plus the deep-loop runtime's own dependency
 * root: the wrapper runs a session against the spec-kit runtime, while a fan-out lane
 * runs this runtime and resolves its own `tsx`, `zod` and `better-sqlite3` from that
 * directory rather than from a sibling skill's. Both `node_modules` and `dist` are
 * gitignored, so HEAD never carries them.
 */
const DEFAULT_SHARED_PATHS: readonly string[] = [
  '.opencode/skills/system-spec-kit/node_modules',
  '.opencode/skills/system-spec-kit/runtime/node_modules',
  '.opencode/skills/system-spec-kit/runtime/dist',
  '.opencode/skills/system-spec-kit/runtime/cli/dist',
  '.opencode/skills/system-spec-kit/runtime/cli/node_modules',
  '.opencode/skills/system-deep-loop/runtime/node_modules',
];

/** Same override the launch wrapper reads, and the same separator it splits on. */
const SHARED_PATHS_ENV = 'SPECKIT_WORKTREE_SHARED_PATHS';

/**
 * Variables git uses to redirect its own target, stripped before every call here.
 *
 * Git resolves these in preference to `-C`. They are set for hooks, so without the strip
 * a hook that runs this runtime would send every worktree command at the repository that
 * invoked the hook instead of the one named by the caller.
 */
const GIT_ENV_REDIRECTORS: readonly string[] = [
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_COMMON_DIR',
  'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG',
  'GIT_CONFIG_GLOBAL',
  'GIT_CONFIG_SYSTEM',
  'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE',
  'GIT_CEILING_DIRECTORIES',
];

/** Entries never copied by a seed, so a seeded tree cannot register a repository of its own. */
const SEED_SKIP_ENTRIES = new Set(['.git']);

// ─────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** A single directory-name segment: no separators, no traversal, no NUL. */
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

/**
 * A repo-relative path that can be joined under either tree without leaving it.
 *
 * Rejecting `..` and absolute forms is not a convenience check: a caller that hands a
 * path through from a status scan is handing through repository content, and content
 * must not be able to name a destination outside the worktree.
 */
function isSafeRelativePosixPath(value: string): boolean {
  if (value.length === 0 || value.includes('\0') || isAbsolute(value)) {
    return false;
  }
  return value.split('/').every((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
}

/** Split a repo-relative POSIX path into the segments `join` writes under a tree. */
function relativeSegments(repoRelativePosixPath: string): string[] {
  return repoRelativePosixPath.split('/');
}

/** True when `candidate` is `root` itself or nested under it (both resolved absolute). */
function isInside(candidate: string, root: string): boolean {
  const rel = relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function realpathOrNull(target: string): string | null {
  try {
    return realpathSync(target);
  } catch {
    return null;
  }
}

function lstatOrNull(target: string): Stats | null {
  try {
    return lstatSync(target);
  } catch {
    return null;
  }
}

/**
 * Canonical absolute form of a path whose tail may not exist yet.
 *
 * The deepest existing ancestor is resolved through symlinks and the missing tail is
 * re-appended. Resolving only the deepest anchor is what makes the check meaningful for a
 * destination that is about to be created: a lexical join says nothing about an ancestor
 * that is a symlink pointing out of the tree, and that ancestor is how a link planted in
 * HEAD would redirect a write.
 *
 * @returns The canonical path, or null when no ancestor exists at all.
 */
function canonicalTargetPath(target: string): string | null {
  let existing = target;
  const missing: string[] = [];
  while (!existsSync(existing)) {
    const parent = dirname(existing);
    if (parent === existing) {
      return null;
    }
    missing.unshift(basename(existing));
    existing = parent;
  }

  const canonical = realpathOrNull(existing);
  if (canonical === null) {
    return null;
  }
  return missing.length === 0 ? canonical : join(canonical, ...missing);
}

function cleanGitEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of GIT_ENV_REDIRECTORS) {
    delete env[key];
  }
  return env;
}

interface GitCallResult {
  ok: boolean;
  /** stderr when git failed, empty when it succeeded. */
  message: string;
}

function runGit(args: readonly string[], repoRoot: string): GitCallResult {
  try {
    const result = spawnSync('git', ['-C', repoRoot, ...args], {
      encoding: 'utf8',
      env: cleanGitEnv(),
      maxBuffer: 10 * 1024 * 1024,
    });
    if (result.error || typeof result.status !== 'number' || result.status !== 0) {
      const stderr = typeof result.stderr === 'string' ? result.stderr.trim() : '';
      const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
      const detail = stderr.length > 0 ? stderr : stdout;
      return { ok: false, message: detail.length > 0 ? detail : `git ${args.join(' ')} failed` };
    }
    return { ok: true, message: '' };
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }
}

/** The shared-path list for this run: the override when set, the defaults otherwise. */
function resolveSharedPaths(env: NodeJS.ProcessEnv): string[] {
  const override = env[SHARED_PATHS_ENV];
  if (typeof override !== 'string' || override.trim().length === 0) {
    return [...DEFAULT_SHARED_PATHS];
  }
  return override
    .split(/[:\n]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

/**
 * Create a destination's parent directory, refusing to reach one through a symlink.
 *
 * A worktree is checked out from HEAD, and HEAD may hold a symlink where a dependency
 * root belongs. Creating the directory "successfully" through such a link would place
 * everything the lane then writes outside the tree, which is the one thing this module
 * exists to prevent.
 *
 * Runs before anything at the destination is removed, so no removal is ever aimed at a
 * path whose parent only resolves outside the tree.
 */
function prepareDestinationParent(destAbs: string, worktreeRootReal: string): void {
  const parentAbs = dirname(destAbs);
  const canonicalParent = canonicalTargetPath(parentAbs);
  if (canonicalParent === null || !isInside(canonicalParent, worktreeRootReal)) {
    throw new Error(`destination escapes the worktree: ${destAbs}`);
  }
  mkdirSync(parentAbs, { recursive: true });
}

/** Create `destAbs` itself as a directory, on the same terms as its parent. */
function prepareDestinationDir(destAbs: string, worktreeRootReal: string): void {
  const canonical = canonicalTargetPath(destAbs);
  if (canonical === null || !isInside(canonical, worktreeRootReal)) {
    throw new Error(`destination escapes the worktree: ${destAbs}`);
  }
  mkdirSync(destAbs, { recursive: true });
}

/**
 * Make `destAbs` ready to receive a file's bytes.
 *
 * A symlink already sitting at the destination is removed rather than followed: copying
 * through it would write to whatever it points at, which HEAD decides and this module
 * never inspected. A directory there is a type change the seed has no business resolving.
 */
function prepareDestinationFile(destAbs: string, worktreeRootReal: string): void {
  prepareDestinationParent(destAbs, worktreeRootReal);
  const existing = lstatOrNull(destAbs);
  if (existing !== null) {
    if (existing.isDirectory()) {
      throw new Error(`destination is a directory: ${destAbs}`);
    }
    if (existing.isSymbolicLink()) {
      rmSync(destAbs, { force: true });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────
// 4. CREATE
// ─────────────────────────────────────────────────────────────────────

interface SharedLinkTally {
  linked: string[];
  skipped: string[];
  failed: string | null;
}

/**
 * Link one shared dependency root from the main checkout into a fresh worktree.
 *
 * An entry whose source is absent is skipped, not failed: a repository that has never
 * installed a given dependency root cannot be missing it. An entry that cannot be linked
 * for any other reason fails the whole create, because that is the state this step
 * exists to avoid — a tree that looks ready and is not.
 */
function linkSharedPath(input: {
  repoRoot: string;
  worktreeDir: string;
  worktreeRootReal: string;
  repoRelativePosixPath: string;
  tally: SharedLinkTally;
}): void {
  const { repoRoot, worktreeDir, worktreeRootReal, repoRelativePosixPath, tally } = input;

  if (!isSafeRelativePosixPath(repoRelativePosixPath)) {
    tally.skipped.push(repoRelativePosixPath);
    return;
  }

  const segments = relativeSegments(repoRelativePosixPath);
  const sourceAbs = join(repoRoot, ...segments);
  if (!existsSync(sourceAbs)) {
    tally.skipped.push(repoRelativePosixPath);
    return;
  }

  const destAbs = join(worktreeDir, ...segments);
  try {
    prepareDestinationParent(destAbs, worktreeRootReal);
    // The replacement mirrors the launch wrapper: whatever HEAD checked out at this
    // path is not the installed artefact, and a link cannot be created over it.
    rmSync(destAbs, { recursive: true, force: true });
    symlinkSync(sourceAbs, destAbs, 'dir');
    tally.linked.push(repoRelativePosixPath);
  } catch (error) {
    tally.failed = `${repoRelativePosixPath}: ${errorMessage(error)}`;
  }
}

/**
 * Create the detached worktree one lineage runs in, and mark it owned.
 *
 * Order is load-bearing. The tree is added first, then the dependency links, then the
 * lease. A failure anywhere earlier leaves a directory that is recognizable as unfinished
 * (by its missing lease) and reclaimable by the sweep, rather than a tree some later step
 * treats as a live, owned workspace.
 *
 * @returns The worktree directory, or why the lane must fall back to the shared checkout.
 */
export function createLineageWorktree(
  input: CreateLineageWorktreeInput,
): CreateLineageWorktreeResult {
  const repoRoot = typeof input.repoRoot === 'string' && input.repoRoot.length > 0
    ? resolve(input.repoRoot)
    : '';
  if (repoRoot === '' || !existsSync(repoRoot)) {
    return { ok: false, error: `repository root does not exist: ${String(input.repoRoot)}` };
  }

  for (const segment of [input.prefix, input.runId, input.label]) {
    if (!isSafeSegment(segment)) {
      return { ok: false, error: `worktree name segment is not a safe path segment: ${String(segment)}` };
    }
  }

  const worktreeBase = typeof input.worktreeBase === 'string' && input.worktreeBase.length > 0
    ? (isAbsolute(input.worktreeBase) ? input.worktreeBase : resolve(repoRoot, input.worktreeBase))
    : '';
  if (worktreeBase === '') {
    return { ok: false, error: 'worktree base is required' };
  }

  const worktreeDir = join(worktreeBase, `${input.prefix}-${input.runId}-${input.label}`);
  const added = runGit(['worktree', 'add', '--detach', worktreeDir, 'HEAD'], repoRoot);
  if (!added.ok) {
    return { ok: false, error: `git worktree add failed: ${added.message}` };
  }

  const worktreeRootReal = realpathOrNull(worktreeDir);
  if (worktreeRootReal === null) {
    return { ok: false, error: `created worktree cannot be resolved: ${worktreeDir}` };
  }

  const tally: SharedLinkTally = { linked: [], skipped: [], failed: null };
  for (const sharedPath of resolveSharedPaths(process.env)) {
    linkSharedPath({
      repoRoot,
      worktreeDir,
      worktreeRootReal,
      repoRelativePosixPath: sharedPath,
      tally,
    });
    if (tally.failed !== null) {
      return { ok: false, error: `shared dependency link failed: ${tally.failed}` };
    }
  }

  try {
    writeWorktreeLease(worktreeDir, {
      ownerPid: input.ownerPid,
      runId: input.runId,
      label: input.label,
      ttlMs: input.ttlMs,
    });
  } catch (error) {
    return { ok: false, error: `worktree lease could not be written: ${errorMessage(error)}` };
  }

  return { ok: true, worktreeDir };
}

// ─────────────────────────────────────────────────────────────────────
// 5. SEED
// ─────────────────────────────────────────────────────────────────────

/**
 * Copy one entry from the working tree into the worktree.
 *
 * A directory is walked, an unresolvable or already-visited one is skipped. Symlinks are
 * followed: what a lineage needs is the bytes it would read in the shared checkout, and a
 * link that resolves to a directory would drag in a whole tree that is not part of the
 * change, so it is skipped by name instead.
 *
 * @throws When this entry's own bytes cannot be written; the caller records it against
 *   the requested path and keeps going, so one bad entry does not abandon the rest.
 */
function seedEntry(input: {
  sourceAbs: string;
  destAbs: string;
  repoRelativePosixPath: string;
  worktreeRootReal: string;
  visitedDirs: Set<string>;
  tally: SeedTally;
}): void {
  const { sourceAbs, destAbs, repoRelativePosixPath, worktreeRootReal, visitedDirs, tally } = input;
  const sourceStat = statSync(sourceAbs);

  if (!sourceStat.isDirectory()) {
    prepareDestinationFile(destAbs, worktreeRootReal);
    copyFileSync(sourceAbs, destAbs);
    tally.copied.push(repoRelativePosixPath);
    return;
  }

  const sourceReal = realpathOrNull(sourceAbs);
  if (sourceReal === null || visitedDirs.has(sourceReal)) {
    tally.skipped.push(`${repoRelativePosixPath} (directory already visited)`);
    return;
  }
  visitedDirs.add(sourceReal);

  prepareDestinationDir(destAbs, worktreeRootReal);
  for (const entry of readdirSync(sourceAbs, { withFileTypes: true })) {
    const childRel = `${repoRelativePosixPath}/${entry.name}`;
    if (SEED_SKIP_ENTRIES.has(entry.name)) {
      tally.skipped.push(`${childRel} (never seeded)`);
      continue;
    }
    try {
      seedEntry({
        sourceAbs: join(sourceAbs, entry.name),
        destAbs: join(destAbs, entry.name),
        repoRelativePosixPath: childRel,
        worktreeRootReal,
        visitedDirs,
        tally,
      });
    } catch (error) {
      tally.errors.push(`${childRel}: ${errorMessage(error)}`);
    }
  }
}

/**
 * Seed the current working-tree bytes of each path into the worktree.
 *
 * The seed reads the working tree rather than the index for a reason: modified-tracked,
 * staged-uncommitted and wholly-untracked content are three different states to git and
 * exactly one thing on disk — the bytes. Anything the index would say about them is a
 * different question from the one a lineage has, which is what a reader would see if it
 * opened the file in the shared checkout.
 *
 * A path deleted in the working tree is reported missing rather than removed from the
 * worktree: this function only ever adds, so it cannot be the reason a lane loses a file.
 *
 * @returns What was copied, what had nothing to copy, and what could not be written.
 */
export function seedWorktree(input: SeedWorktreeInput): SeedWorktreeResult {
  const tally: SeedTally = { copied: [], missing: [], skipped: [], errors: [] };

  const repoRoot = typeof input.repoRoot === 'string' && input.repoRoot.length > 0
    ? resolve(input.repoRoot)
    : '';
  const worktreeDir = typeof input.worktreeDir === 'string' && input.worktreeDir.length > 0
    ? resolve(input.worktreeDir)
    : '';
  const worktreeRootReal = worktreeDir === '' ? null : realpathOrNull(worktreeDir);
  if (repoRoot === '' || worktreeRootReal === null) {
    tally.errors.push(`seed needs an existing repository root and worktree: ${repoRoot} -> ${worktreeDir}`);
    return { ok: false, ...tally };
  }

  const requested = Array.isArray(input.paths) ? input.paths : [];
  const visitedDirs = new Set<string>();
  for (const requestedPath of requested) {
    const repoRelativePosixPath = typeof requestedPath === 'string' ? requestedPath.replace(/\/+$/, '') : '';
    if (!isSafeRelativePosixPath(repoRelativePosixPath)) {
      tally.errors.push(`not a repo-relative path: ${String(requestedPath)}`);
      continue;
    }

    const sourceAbs = join(repoRoot, ...relativeSegments(repoRelativePosixPath));
    if (!existsSync(sourceAbs)) {
      tally.missing.push(repoRelativePosixPath);
      continue;
    }

    try {
      seedEntry({
        sourceAbs,
        destAbs: join(worktreeDir, ...relativeSegments(repoRelativePosixPath)),
        repoRelativePosixPath,
        worktreeRootReal,
        visitedDirs,
        tally,
      });
    } catch (error) {
      tally.errors.push(`${repoRelativePosixPath}: ${errorMessage(error)}`);
    }
  }

  return { ok: tally.errors.length === 0, ...tally };
}

// ─────────────────────────────────────────────────────────────────────
// 6. REMOVE
// ─────────────────────────────────────────────────────────────────────

/**
 * Drop the lease before the directory holding it is handed to git.
 *
 * The order is what makes a clean teardown possible without force: the lease is itself an
 * untracked file inside the worktree, and `git worktree remove` refuses any tree carrying
 * untracked content. Left in place, a leased tree could only ever be removed with force —
 * and a teardown that always forces cannot tell a settled lane from one still writing.
 *
 * Best effort by design. The directory is about to go, so a lease that cannot be read or
 * released is not a reason to refuse removal; the recorded owner is used because teardown
 * is rarely the process that acquired it.
 *
 * @returns True when a lease was present and released.
 */
function releaseLineageLease(worktreeDir: string): boolean {
  const leasePath = join(worktreeDir, WORKTREE_LEASE_FILENAME);

  let ownerPid: unknown;
  let nonce: string | undefined;
  try {
    const record = JSON.parse(readFileSync(leasePath, 'utf8')) as Record<string, unknown>;
    ownerPid = record.owner_pid;
    nonce =
      typeof record.acquire_nonce === 'string' && record.acquire_nonce.length > 0
        ? record.acquire_nonce
        : undefined;
  } catch {
    return false;
  }

  if (typeof ownerPid !== 'number' || !Number.isInteger(ownerPid) || ownerPid <= 0) {
    return false;
  }

  try {
    return releaseLoopLock(leasePath, ownerPid, nonce);
  } catch {
    return false;
  }
}

/**
 * Remove a lineage worktree, leaving the main checkout as it found it.
 *
 * Release, remove, prune, in that order. A directory that is already gone is not an error:
 * the caller asked for it to be gone, and the prune is still worth running because a
 * registration outliving its directory is what makes the next worktree at that path fail.
 *
 * @returns Whether the directory is gone, and why not when it is not.
 */
export function removeLineageWorktree(
  input: RemoveLineageWorktreeInput,
): RemoveLineageWorktreeResult {
  const repoRoot = typeof input.repoRoot === 'string' && input.repoRoot.length > 0
    ? resolve(input.repoRoot)
    : '';
  const worktreeDir = typeof input.worktreeDir === 'string' && input.worktreeDir.length > 0
    ? resolve(input.worktreeDir)
    : '';
  if (repoRoot === '' || worktreeDir === '') {
    return { ok: false, removed: false, error: 'remove needs a repository root and a worktree path' };
  }

  releaseLineageLease(worktreeDir);

  let removed = false;
  if (existsSync(worktreeDir)) {
    const args = ['worktree', 'remove'];
    if (input.force === true) {
      args.push('--force');
    }
    args.push(worktreeDir);
    const result = runGit(args, repoRoot);
    if (!result.ok) {
      // A concurrent teardown that reached the directory first is still the outcome the
      // caller asked for, so it reports success rather than an error it cannot act on.
      if (existsSync(worktreeDir)) {
        return { ok: false, removed: false, error: `git worktree remove failed: ${result.message}` };
      }
    }
    removed = true;
  }

  const pruned = runGit(['worktree', 'prune'], repoRoot);
  if (!pruned.ok) {
    return { ok: false, removed, error: `git worktree prune failed: ${pruned.message}` };
  }

  return { ok: true, removed };
}
