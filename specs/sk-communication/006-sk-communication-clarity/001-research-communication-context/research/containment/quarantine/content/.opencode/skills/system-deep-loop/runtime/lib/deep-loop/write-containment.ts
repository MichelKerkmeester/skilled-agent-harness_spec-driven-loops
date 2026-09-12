// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Write Containment
// ───────────────────────────────────────────────────────────────────

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: deep-loop codex write-containment guard                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: A codex leaf runs under `--sandbox workspace-write`, which lets   ║
// ║          it write anywhere in the workspace -- the artifact dir boundary   ║
// ║          is prompt-only. This module turns that boundary into a structural ║
// ║          one: after a dispatch, diff the git working tree for NEW changes  ║
// ║          outside the artifact dir, save those changes as a recoverable     ║
// ║          patch, revert exactly those paths, emit a containment_violation   ║
// ║          event, and let the caller fail the iteration.                     ║
// ║          Pre-existing dirty paths are subtracted so unrelated in-flight    ║
// ║          work is never reverted. Fails OPEN: when it cannot reason about   ║
// ║          git (no repo, no binary, artifact dir outside the worktree) it    ║
// ║          returns empty results and never breaks the loop it guards.        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ContainmentViolationKind =
  | 'modified'
  | 'deleted'
  | 'added'
  | 'untracked'
  | 'other';

export interface ContainmentViolation {
  /** Repo-root-relative POSIX path as git reports it. */
  path: string;
  /** Absolute path resolved against repoRoot. */
  absolutePath: string;
  kind: ContainmentViolationKind;
  /** Raw XY status code from `git status --porcelain`. */
  status: string;
}

export interface ContainmentRevertAction {
  path: string;
  action: 'restored_from_head' | 'restored_from_baseline' | 'preserved_untracked' | 'preserved_in_head';
  ok: boolean;
  error?: string;
}

export interface ContainmentRevertResult {
  reverted: ContainmentRevertAction[];
}

export interface ContainmentOptions {
  repoRoot: string;
  artifactDir: string;
  /**
   * Directories that are neither this leaf's artifact dir nor its business.
   *
   * Under a concurrent fan-out, sibling lineages write their own artifacts while
   * this leaf runs. Those writes appear in `git status` after the pre-dispatch
   * baseline was taken and are indistinguishable from writes this leaf made, so
   * attributing them to this leaf is unsound — and reverting them destroys a
   * sibling's legitimate in-flight work. Paths under these directories are
   * therefore excluded from detection entirely rather than reported and reverted.
   *
   * Passing sibling artifact dirs here narrows only attribution; every path
   * outside both this leaf's dir and these exclusions stays fully guarded.
   */
  unattributableDirs?: string[];
  /**
   * Individual files that the ORCHESTRATOR writes while this leaf is dispatched.
   *
   * The parent appends to its own run ledgers on a timer for the whole life of a
   * dispatch, and those files sit one level above every leaf's artifact dir. A
   * tree diff cannot tell the parent's append from the leaf's, so the leaf gets
   * blamed for its own supervisor's bookkeeping. That is fatal rather than
   * cosmetic once those ledgers are committed: the revert restores them from
   * HEAD, so the live record of the run in progress survives only as a saved
   * patch — the guard undoing the very evidence it exists to protect, and
   * costing an operator a manual re-apply to get it back.
   *
   * Matched as WHOLE PATHS, never as prefixes. A sibling that merely starts with
   * an exempted name (`<ledger>.bak`) stays guarded, so the exemption cannot be
   * widened by choosing a filename.
   *
   * Kept separate from `unattributableDirs` even though that list's matcher
   * happens to accept exact paths today. Naming a file in a field called `Dirs`
   * would make the exemption depend on an incidental branch, and a later move to
   * prefix-only matching would silently reinstate this failure.
   */
  unattributablePaths?: string[];
  /**
   * Absolute directory under which the pre-dispatch snapshot copies dirty files' bytes.
   *
   * Read only by `snapshotOutOfScopeDirtyPaths`; detection and enforcement ignore it. A
   * baseline recorded as a hash can prove a file changed but cannot restore it, and the only
   * other source of the old bytes is HEAD -- which throws away whatever a concurrent editor
   * had already written before this lane even started. Copying the bytes is what makes a
   * faithful restore possible later. Omitted means no copy is made.
   */
  captureContentDir?: string;
  env?: NodeJS.ProcessEnv;
}

export interface DirtyPathEntry {
  path: string;
  hash: string;
  /**
   * Capture-dir-relative POSIX path where this file's pre-dispatch bytes were stored.
   *
   * Present only when content capture was requested AND the copy succeeded. It is the only
   * faithful restore source: the hash says the file changed, but not what it held.
   */
  baselineContentPath?: string;
  /**
   * Set when the bytes were NOT stored -- the file is over the size bound, the lane budget
   * was already spent, or the copy failed.
   *
   * Explicit rather than implied by an absent `baselineContentPath`, so a degraded baseline
   * is visible to whoever later restores from it instead of looking like nothing to record.
   */
  baselineTruncated?: boolean;
}

export interface DetectOptions extends ContainmentOptions {
  /** Dirty out-of-scope paths captured BEFORE the dispatch (the baseline). */
  preDispatchDirtyPaths: DirtyPathEntry[];
}

export interface ContainmentViolationEvent {
  type: 'event';
  event: 'containment_violation';
  severity: 'error';
  iteration?: number;
  label?: string;
  violations: Array<{ path: string; kind: ContainmentViolationKind; status: string }>;
  reverted: ContainmentRevertAction[];
  /**
   * Repo-relative POSIX path of the patch holding the guarded paths' diff against HEAD:
   * the only surviving copy of an edit a restore overwrites, and the record of a write the
   * default preserve leaves in place. Absent when no in-HEAD path was captured, when the
   * diff was empty, or when the patch could not be written.
   */
  revertedPatchPath?: string;
  /** Why the patch could not be saved. The revert still happened; the edit is gone. */
  revertedPatchError?: string;
  /**
   * Set only when a TRACKED path was rolled back to HEAD, which is the one
   * containment outcome that destroys work rather than protecting it. Preserving an
   * untracked file costs its author nothing; restoring a tracked one discards
   * whatever they had written and not yet committed, and if that author is another
   * session running concurrently, nobody is watching this log to find out. Reading
   * a containment event as a successful guard action is how eighteen events of a
   * concurrent run were lost without anyone noticing, so the destructive case says
   * so in its own field rather than hiding among the benign ones.
   */
  dataLossPossible?: {
    paths: string[];
    /** Where the discarded content survives, when the patch was written. */
    recoverFrom?: string;
    note: string;
  };
  timestamp: string;
}

export interface EnforceInput extends DetectOptions {
  /** When set, the containment_violation event is appended to this JSONL log. */
  stateLogPath?: string;
  iteration?: number;
  label?: string;
  /**
   * Remedy forwarded to the revert. Omitted means 'preserve', so a caller that has not
   * decided a HEAD restore is safe here cannot destroy uncommitted work by default; a
   * caller that has decided opts in per call, exactly as the low-level API requires.
   */
  mode?: 'preserve' | 'restore';
  /**
   * Absolute directory the baseline entries' `baselineContentPath` values were captured
   * under. Forwarded to the revert so an opted-in restore puts back a dirty path's
   * pre-dispatch bytes; omitted, every in-HEAD path is restored from HEAD as before.
   */
  baselineContentRoot?: string;
}

export interface EnforceResult {
  /** In-HEAD out-of-scope breaches, reported not undone under the default remedy; the caller decides fatality. */
  violations: ContainmentViolation[];
  /** Regenerable state and not-in-HEAD paths preserved on disk -- advisory, never fatal. */
  advisories: ContainmentViolation[];
  revertResult: ContainmentRevertResult;
  event: ContainmentViolationEvent | null;
  /**
   * Ready-made sentence naming the saved patch, for the caller to append to the fatal
   * message it already surfaces. Null when no patch was written, so a caller can append
   * it unconditionally without inventing wording for the nothing-to-recover case.
   */
  recoveryHint: string | null;
  /**
   * Repo-relative POSIX path of the directory holding what each guarded path left behind:
   * its bytes, its diff against HEAD and its diff against the pre-dispatch bytes. Null when
   * no path was quarantined, or when the directory could not be created.
   *
   * `recoveryHint` names the one patch a caller surfaces in its fatal message. This names the
   * record an operator reads afterwards, and it exists under both remedies.
   */
  quarantinePath: string | null;
}

export interface QuarantineEntry {
  /** Repo-relative POSIX path of the guarded path this entry records. */
  path: string;
  /** Git blob hash of the bytes as they were on disk at quarantine time; '' when unhashable. */
  hash: string;
  /** True when those bytes were copied under `content/`. */
  content_stored: boolean;
  /** True when the bytes were deliberately NOT stored, because a capture bound was reached. */
  content_truncated?: boolean;
  /** Quarantine-relative POSIX path of the stored bytes. */
  content_path?: string;
  /** Quarantine-relative POSIX path of the diff against HEAD. */
  head_patch_path?: string;
  /** Quarantine-relative POSIX path of the diff against the pre-dispatch bytes. */
  baseline_patch_path?: string;
  /** First failure while recording this path; the rest of the record is still attempted. */
  error?: string;
}

export interface QuarantineResult {
  /** Repo-relative POSIX path of the quarantine dir, or null when it could not be created. */
  dirPath: string | null;
  /** One entry per guarded path, in the order they were given. */
  entries: QuarantineEntry[];
  /** Why the record is incomplete, when it is. */
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** True when `child` is equal to or nested under `parent` (both resolved absolute). */
function isSubpath(childAbs: string, parentAbs: string): boolean {
  const rel = relative(parentAbs, childAbs);
  return rel === '' || (!isAbsolute(rel) && !rel.startsWith('..'));
}

/** Normalize a path to POSIX separators for git-relative comparisons. */
function toPosix(p: string): string {
  return sep === '\\' ? p.split(sep).join('/') : p;
}

/** POSIX dirname of a repo-relative path; '' when the path has no directory (a repo-root file). */
function dirnameRelPosix(p: string): string {
  const idx = p.lastIndexOf('/');
  return idx === -1 ? '' : p.slice(0, idx);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GIT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

interface GitCallOptions {
  repoRoot: string;
  env?: NodeJS.ProcessEnv;
}

function gitOutput(args: string[], opts: GitCallOptions): { ok: boolean; stdout: string } {
  try {
    const result = spawnSync('git', ['-C', opts.repoRoot, ...args], {
      encoding: 'utf8',
      env: opts.env ?? process.env,
      maxBuffer: 10 * 1024 * 1024,
    });
    if (result.error || typeof result.status !== 'number' || result.status !== 0) {
      return { ok: false, stdout: typeof result.stdout === 'string' ? result.stdout : '' };
    }
    return { ok: true, stdout: typeof result.stdout === 'string' ? result.stdout : '' };
  } catch {
    return { ok: false, stdout: '' };
  }
}

/** Absolute worktree toplevel, or '' when repoRoot is not inside a git worktree. */
function resolveGitToplevel(repoRoot: string, env?: NodeJS.ProcessEnv): string {
  const { ok, stdout } = gitOutput(['rev-parse', '--show-toplevel'], { repoRoot, env });
  if (!ok) return '';
  const top = stdout.trim();
  // A bare repo returns the bare path and has no working tree; treat as unavailable.
  const isBare = gitOutput(['rev-parse', '--is-bare-repository'], { repoRoot, env });
  if (isBare.ok && isBare.stdout.trim() === 'true') return '';
  return top;
}

interface StatusEntry {
  status: string;
  path: string;
}

/**
 * Parse `git status --porcelain=v1 -z --no-renames --untracked-files=all`.
 * With -z and --no-renames every record is `XY <path>` NUL-terminated (no rename
 * target), so each chunk is exactly [status(2)][space][path].
 */
function parseStatusPorcelain(output: string): StatusEntry[] {
  const entries: StatusEntry[] = [];
  const chunks = output.split('\0');
  for (const chunk of chunks) {
    if (chunk.length < 4) continue;
    entries.push({ status: chunk.slice(0, 2), path: chunk.slice(3) });
  }
  return entries;
}

function readStatusEntries(opts: GitCallOptions): StatusEntry[] {
  const { ok, stdout } = gitOutput(
    ['status', '--porcelain=v1', '-z', '--no-renames', '--untracked-files=all'],
    opts,
  );
  if (!ok) return [];
  return parseStatusPorcelain(stdout);
}

/** Compute the git blob hash of an on-disk file (tracked or not) for content-identity comparison. */
function gitHashObject(repoRoot: string, filePath: string, env?: NodeJS.ProcessEnv): string {
  const { ok, stdout } = gitOutput(['hash-object', '--', filePath], { repoRoot, env });
  if (!ok) return '';
  return stdout.trim();
}

/** Compute the git blob hash from stdin without writing to the object store. */
function gitHashStdin(repoRoot: string, content: string, env?: NodeJS.ProcessEnv): string {
  try {
    const result = spawnSync('git', ['-C', repoRoot, 'hash-object', '--stdin'], {
      encoding: 'utf8',
      input: content,
      env: env ?? process.env,
    });
    if (result.error || result.status !== 0) return '';
    return (typeof result.stdout === 'string' ? result.stdout : '').trim();
  } catch {
    return '';
  }
}

/**
 * Hash bytes and store them as a blob, so a scratch index can reference them.
 *
 * The held-bytes diff below needs a git object to name, and the bytes it holds came from a
 * file on disk rather than from a commit, so there is nothing to look up: they have to be
 * written. The object is dangling, which is the whole of its effect on the repository.
 */
function gitHashObjectWrite(repoRoot: string, content: Buffer, env?: NodeJS.ProcessEnv): string {
  try {
    const result = spawnSync('git', ['-C', repoRoot, 'hash-object', '-w', '--stdin'], {
      encoding: 'utf8',
      input: content,
      env: env ?? process.env,
    });
    if (result.error || result.status !== 0) return '';
    return (typeof result.stdout === 'string' ? result.stdout : '').trim();
  } catch {
    return '';
  }
}

/**
 * Diff bytes we hold against the bytes on disk now, as a patch with repo-relative headers.
 *
 * Held bytes are not a git object, so `git diff` has nothing to compare them with until
 * something puts them in an index: a scratch index carrying that one blob gives git both
 * sides -- the held bytes as the pre-image, the working tree as the post-image -- and the
 * result carries the same headers as every other patch here, so it applies the way those do.
 */
function diffAgainstHeldBytes(input: {
  repoRoot: string;
  repoRelativePosixPath: string;
  bytes: Buffer;
  env?: NodeJS.ProcessEnv;
}): { ok: true; diff: string } | { ok: false; error: string } {
  let scratchDir = '';
  try {
    scratchDir = mkdtempSync(join(tmpdir(), 'containment-held-bytes-'));
    const env = { ...(input.env ?? process.env), GIT_INDEX_FILE: join(scratchDir, 'index') };
    const blob = gitHashObjectWrite(input.repoRoot, input.bytes, env);
    if (blob === '') return { ok: false, error: 'git hash-object -w --stdin failed' };
    const indexed = gitOutput(
      ['update-index', '--add', '--cacheinfo', `100644,${blob},${input.repoRelativePosixPath}`],
      { repoRoot: input.repoRoot, env },
    );
    if (!indexed.ok) return { ok: false, error: 'git update-index --cacheinfo failed' };
    const diff = gitOutput(
      ['diff', '--no-ext-diff', '--no-textconv', '--binary', '--', input.repoRelativePosixPath],
      { repoRoot: input.repoRoot, env },
    );
    if (!diff.ok) return { ok: false, error: 'git diff <scratch index> -- <path> failed' };
    return { ok: true, diff: diff.stdout };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  } finally {
    if (scratchDir !== '') {
      try {
        rmSync(scratchDir, { recursive: true, force: true });
      } catch {
        // Scratch only: a temp dir that will not go away must not fail the record using it.
      }
    }
  }
}

/** True when the path exists in HEAD (it is a tracked file that checkout can restore). */
function pathInHead(repoRoot: string, pathSpec: string, env?: NodeJS.ProcessEnv): boolean {
  const { ok } = gitOutput(['cat-file', '-e', `HEAD:${pathSpec}`], { repoRoot, env });
  return ok;
}

/** Restore a tracked path to its HEAD content (handles both modification and deletion). */
function checkoutFromHead(repoRoot: string, pathSpec: string, env?: NodeJS.ProcessEnv): boolean {
  const { ok } = gitOutput(['checkout', 'HEAD', '--', pathSpec], { repoRoot, env });
  return ok;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export function classifyViolation(status: string): ContainmentViolationKind {
  if (status === '??') return 'untracked';
  if (status.includes('D')) return 'deleted';
  if (status.includes('A')) return 'added';
  if (status.includes('M')) return 'modified';
  return 'other';
}

function isInsideArtifact(repoRelativePath: string, artifactRelPosix: string): boolean {
  const p = toPosix(repoRelativePath);
  // artifactDir == repoRoot: everything is inside.
  if (artifactRelPosix === '' || artifactRelPosix === '.') return true;
  return p === artifactRelPosix || p.startsWith(`${artifactRelPosix}/`);
}

/** Resolve a path through symlinks; fall back to the lexical absolute path when absent. */
function realpathSafe(p: string): string {
  try {
    return realpathSync(p);
  } catch {
    return resolve(p);
  }
}

/**
 * Deepest existing ancestor of `dir` resolved through symlinks, with the missing
 * tail re-appended. git reports paths that no longer exist (a deletion) and paths
 * that never will (a dangling link), so resolution has to survive an absent path
 * rather than give up and hand back a name that hides a symlink.
 */
function realpathAncestor(dir: string): string {
  try {
    return realpathSync(dir);
  } catch {
    const parent = dirname(dir);
    if (parent === dir) return dir;
    return join(realpathAncestor(parent), basename(dir));
  }
}

/**
 * Where a path's bytes actually live: every component resolved through symlinks.
 *
 * A missing leaf keeps its resolved parent chain, and a DANGLING symlink is read
 * through its recorded target -- an escape currently pointing at nothing is still
 * an escape, and turns into a live one the moment that target is created.
 */
function canonicalPath(absolutePath: string): string {
  const target = resolve(absolutePath);
  try {
    return realpathSync(target);
  } catch {
    const parentReal = realpathAncestor(dirname(target));
    const leaf = join(parentReal, basename(target));
    try {
      const link = readlinkSync(leaf);
      return isAbsolute(link) ? resolve(link) : resolve(parentReal, link);
    } catch {
      return leaf;
    }
  }
}

/**
 * True when a git-reported path is inside the artifact tree BOTH by name and after
 * every component is resolved through symlinks.
 *
 * git reports the path it walked, never the place the write landed. A symlink under
 * the artifact dir therefore passes a name-only test while the bytes it carries go
 * wherever it points -- one `ln -s` retiring the boundary this module exists to
 * make structural. Canonicalizing the whole component chain closes that: a path
 * that escapes is out of scope and gets guarded like any other outside write.
 *
 * The name test is kept alongside it so the rule can only ever NARROW scope -- a
 * symlink outside the artifact dir that happens to resolve into it must not be able
 * to buy its way in.
 */
function isContainedInArtifact(
  repoRealRoot: string,
  artifactRealRoot: string,
  artifactRelPosix: string,
  repoRelativePath: string,
): boolean {
  if (!isInsideArtifact(repoRelativePath, artifactRelPosix)) return false;
  return isSubpath(canonicalPath(join(repoRealRoot, repoRelativePath)), artifactRealRoot);
}

/**
 * The artifact-dir subtree relative to repoRoot in POSIX form, or null when the
 * artifact dir is not inside the resolved git worktree (hermetic test artifact
 * dirs, external paths) -- the signal to skip containment entirely.
 *
 * All three paths are resolved through realpath so a symlinked repo root (e.g.
 * macOS `/var` -> `/private/var`) does not make the worktree toplevel disagree
 * with the caller-supplied paths and silently disable containment.
 */
function resolveArtifactScope(
  opts: ContainmentOptions,
): {
  artifactRelPosix: string;
  repoRealRoot: string;
  artifactRealRoot: string;
  unattributableRelPosix: string[];
  unattributableFileRelPosix: string[];
} | null {
  const toplevel = resolveGitToplevel(opts.repoRoot, opts.env);
  if (!toplevel) return null;
  const repoReal = realpathSafe(opts.repoRoot);
  const artifactReal = realpathSafe(opts.artifactDir);
  const toplevelReal = realpathSafe(toplevel);
  if (!isSubpath(artifactReal, toplevelReal)) return null;
  const artifactRelPosix = toPosix(relative(repoReal, artifactReal));
  // An artifact dir resolved outside repoRoot (e.g. '../other') cannot be scoped.
  if (artifactRelPosix.startsWith('..') || isAbsolute(artifactRelPosix)) return null;

  // Same resolution rules as the artifact dir: anything that cannot be expressed
  // as a repo-relative subpath is dropped rather than silently widening scope.
  const unattributableRelPosix: string[] = [];
  for (const dir of opts.unattributableDirs ?? []) {
    const rel = toPosix(relative(repoReal, realpathSafe(dir)));
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) continue;
    if (rel === artifactRelPosix) continue;
    unattributableRelPosix.push(rel);
  }

  // The file itself is resolved through its PARENT directory, because an exempted
  // ledger legitimately does not exist yet on a packet's first run and realpath on
  // a missing path would drop the exemption exactly when it is first needed.
  const unattributableFileRelPosix: string[] = [];
  for (const file of opts.unattributablePaths ?? []) {
    const resolvedFile = join(realpathSafe(dirname(file)), basename(file));
    const rel = toPosix(relative(repoReal, resolvedFile));
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) continue;
    unattributableFileRelPosix.push(rel);
  }
  return {
    artifactRelPosix,
    repoRealRoot: repoReal,
    artifactRealRoot: artifactReal,
    unattributableRelPosix,
    unattributableFileRelPosix,
  };
}

/**
 * True when a path's writes cannot be attributed to this leaf.
 *
 * Directories match themselves and everything beneath them; files match only
 * themselves, so exempting a ledger never exempts its neighbours.
 */
function isUnattributable(
  repoRelativePath: string,
  unattributableRelPosix: string[],
  unattributableFileRelPosix: string[] = [],
): boolean {
  const p = toPosix(repoRelativePath);
  if (unattributableFileRelPosix.some((file) => p === file)) return true;
  return unattributableRelPosix.some((dir) => p === dir || p.startsWith(`${dir}/`));
}

/**
 * True for runtime-owned regenerable telemetry and memory-index state. When `artifactRelPosix`
 * is given, a description.json/descriptions.json write is exempted only when its own directory
 * is an ancestor of (or equal to) that artifact dir -- this leaf's own packet index -- never an
 * unrelated packet's metadata living elsewhere in the repo, which merely shares the basename. A
 * caller that omits the scope (a direct probe) keeps the unscoped basename match.
 */
function isRegenerableRuntimeState(repoRelativePath: string, artifactRelPosix?: string): boolean {
  const p = toPosix(repoRelativePath);
  const runtimeDatabase = '.opencode/skills/system-deep-loop/runtime/database';
  const isRuntimeDatabasePath = p.startsWith(`${runtimeDatabase}/`);
  const isMemoryIndexBasename =
    p === 'description.json' ||
    p.endsWith('/description.json') ||
    p === 'descriptions.json' ||
    p.endsWith('/descriptions.json');
  const isMemoryIndexMetadata =
    isMemoryIndexBasename &&
    (artifactRelPosix === undefined || isInsideArtifact(artifactRelPosix, dirnameRelPosix(p)));
  // These files are written by the runtime itself, not by a lineage as source output.
  // Reverting regenerable telemetry or index state must not fail a contained lineage.
  return isRuntimeDatabasePath || isMemoryIndexMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Largest single dirty file whose bytes are copied into the baseline capture.
 *
 * The capture exists so a later restore has real bytes to restore TO. An unbounded copy
 * would let one large blob in an unrelated part of the tree spend the whole lane budget or
 * the dispatcher's disk on a file the guard only needed to compare, so anything over this
 * size is recorded as truncated instead.
 */
export const BASELINE_MAX_FILE_BYTES = 2 * 1024 * 1024;

/**
 * Total baseline bytes a single snapshot call may copy.
 *
 * Bounded per call rather than per file because the cost that matters is the whole
 * pre-dispatch sweep on a tree with many dirty files at once. Once the budget is spent the
 * remaining entries are marked truncated, so the shortfall is visible rather than silent.
 */
export const BASELINE_MAX_LANE_BYTES = 64 * 1024 * 1024;

interface BaselineCaptureOutcome {
  /** Capture-dir-relative POSIX path of the stored bytes; absent when nothing was stored. */
  contentPath?: string;
  /** True when the bytes were deliberately NOT stored, so absence is not read as cleanness. */
  truncated: boolean;
  /** Bytes this capture adds to the running lane total. */
  bytes: number;
}

/**
 * Copy one dirty file's pre-dispatch bytes under the capture dir.
 *
 * A baseline recorded as a hash alone can only ever answer "did this change"; it leaves a
 * later restore with nothing to put back, and the only other source of the old bytes is
 * HEAD -- which throws away whatever a concurrent editor had already written before this
 * lane started. Keeping the bytes is what makes a faithful restore possible.
 *
 * Never throws: a baseline that cannot be captured is a degraded baseline, not a failed
 * lane, so a size over the bound, an exhausted budget, a vanished file or a failed write
 * all mark the entry truncated and let the sweep continue.
 */
function captureBaselineFile(input: {
  sourceAbsolutePath: string;
  repoRelativePosixPath: string;
  captureContentDir: string;
  laneBytes: number;
}): BaselineCaptureOutcome {
  try {
    const size = statSync(input.sourceAbsolutePath).size;
    if (size > BASELINE_MAX_FILE_BYTES) return { truncated: true, bytes: 0 };
    if (input.laneBytes + size > BASELINE_MAX_LANE_BYTES) return { truncated: true, bytes: 0 };
    const relativePath = toPosix(join('containment', 'baseline', input.repoRelativePosixPath));
    const destination = join(input.captureContentDir, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(input.sourceAbsolutePath, destination);
    return { contentPath: relativePath, truncated: false, bytes: size };
  } catch {
    return { truncated: true, bytes: 0 };
  }
}

/**
 * Pre-dispatch snapshot: every dirty path (tracked modified/deleted AND untracked)
 * that lies OUTSIDE artifactDir. This is the baseline subtracted after dispatch so
 * pre-existing unrelated changes are never treated as the leaf's violations.
 *
 * With `captureContentDir` set, each recorded file's current bytes are copied under that dir
 * too, so the baseline can later be restored from rather than only compared against. A file
 * whose bytes cannot be copied is marked truncated; the snapshot itself never fails on a
 * capture problem.
 *
 * Returns [] (no-op) when git is unavailable, repoRoot is not a worktree, or
 * artifactDir is outside the worktree.
 */
export function snapshotOutOfScopeDirtyPaths(opts: ContainmentOptions): DirtyPathEntry[] {
  const scope = resolveArtifactScope(opts);
  if (!scope) return [];
  const entries = readStatusEntries({ repoRoot: opts.repoRoot, env: opts.env });
  const out: DirtyPathEntry[] = [];
  // The lane budget spans this call's whole loop: one snapshot is one lane's baseline.
  let laneBytes = 0;
  for (const entry of entries) {
    if (isUnattributable(entry.path, scope.unattributableRelPosix, scope.unattributableFileRelPosix)) continue;
    if (!isContainedInArtifact(scope.repoRealRoot, scope.artifactRealRoot, scope.artifactRelPosix, entry.path)) {
      const entryPath = toPosix(entry.path);
      // Hash every dirty path on disk, tracked or not: an untracked baseline entry left
      // unhashed always short-circuits the later comparison as "unknown, skip" regardless of
      // its content, so a leaf that overwrites the SAME out-of-scope path in a later iteration
      // would go undetected forever behind the first iteration's now-stale advisory.
      const hash = gitHashObject(opts.repoRoot, entryPath, opts.env);
      // Capture is opt-in and additive: with no dir configured the entry carries exactly the
      // keys it always did, so an existing caller's baseline shape does not change.
      const captured = opts.captureContentDir
        ? captureBaselineFile({
            sourceAbsolutePath: join(scope.repoRealRoot, entryPath),
            repoRelativePosixPath: entryPath,
            captureContentDir: opts.captureContentDir,
            laneBytes,
          })
        : null;
      if (captured) laneBytes += captured.bytes;
      out.push({
        path: entryPath,
        hash,
        ...(captured?.contentPath ? { baselineContentPath: captured.contentPath } : {}),
        ...(captured?.truncated ? { baselineTruncated: true } : {}),
      });
    }
  }
  return Array.from(new Map(out.map((e) => [e.path, e])).values()).sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Post-dispatch detection: NEW out-of-scope violations introduced by the leaf,
 * computed as (current out-of-scope dirty) minus (pre-dispatch baseline).
 */
export function detectNewOutOfScopeViolations(opts: DetectOptions): ContainmentViolation[] {
  const scope = resolveArtifactScope(opts);
  if (!scope) {
    // Artifact outside worktree: hard failure, not an empty violation list.
    if (resolveGitToplevel(opts.repoRoot, opts.env)) {
      throw new Error(`artifact scope ${opts.artifactDir} is outside the git worktree — containment cannot be enforced`);
    }
    return [];
  }
  const entries = readStatusEntries({ repoRoot: opts.repoRoot, env: opts.env });
  const preMap = new Map(opts.preDispatchDirtyPaths.map((e) => [toPosix(e.path), e.hash]));
  const violations: ContainmentViolation[] = [];
  for (const entry of entries) {
    const p = toPosix(entry.path);
    if (isContainedInArtifact(scope.repoRealRoot, scope.artifactRealRoot, scope.artifactRelPosix, p)) continue;
    if (isUnattributable(p, scope.unattributableRelPosix, scope.unattributableFileRelPosix)) continue;
    if (preMap.has(p)) {
      const preHash = preMap.get(p) || '';
      if (!preHash) continue;
      const curHash = gitHashObject(opts.repoRoot, p, opts.env);
      if (curHash && preHash && curHash === preHash) continue;
    }
    violations.push({
      path: p,
      absolutePath: resolve(opts.repoRoot, p),
      kind: classifyViolation(entry.status),
      status: entry.status,
    });
  }
  return violations;
}

interface RevertPatchCapture {
  /** Repo-relative POSIX path of the written patch, or null when nothing was saved. */
  path: string | null;
  /** Why the patch could not be written. The revert proceeds regardless — fail-closed stays. */
  error?: string;
}

/**
 * Save the guarded paths' diff against HEAD as an appliable patch inside the artifact dir, and
 * name the directory it lands in after the remedy the caller is about to apply.
 *
 * The guard cannot tell a leaf's stray write from an operator editing the same checkout by
 * hand, so the capture is what keeps the caller's action recoverable either way. Under
 * 'restore' it must be taken BEFORE the checkout: the rollback is what destroys the bytes it
 * copies, and afterwards there is no diff left to take. Under 'preserve' nothing is rolled
 * back and the tree still holds every byte, so the patch is a record of what the lane wrote
 * outside its scope -- calling that reverted would claim a destructive action that never ran.
 *
 * Only in-HEAD paths are captured: a not-in-HEAD path is preserved on disk rather than
 * reverted, so it needs no copy. `--no-textconv` and `--no-ext-diff` keep repo diff config
 * from producing a human-readable diff that cannot be applied, and `--binary` keeps a
 * non-text file recoverable too.
 */
function captureRevertPatch(input: {
  repoRoot: string;
  artifactDir: string;
  artifactRelPosix: string;
  violations: ContainmentViolation[];
  iteration?: number;
  /**
   * The remedy the caller applies after this capture. Omitted means 'preserve', matching the
   * remedy's own default: a capture made alongside no rollback must not land in a directory
   * whose name claims one happened.
   */
  mode?: 'preserve' | 'restore';
  env?: NodeJS.ProcessEnv;
}): RevertPatchCapture {
  const inHeadPaths = input.violations
    .filter((violation) => pathInHead(input.repoRoot, violation.path, input.env))
    .map((violation) => violation.path);
  if (inHeadPaths.length === 0) return { path: null };

  const { ok, stdout } = gitOutput(
    ['diff', '--no-ext-diff', '--no-textconv', '--binary', 'HEAD', '--', ...inHeadPaths],
    { repoRoot: input.repoRoot, env: input.env },
  );
  if (!ok) return { path: null, error: 'git diff HEAD -- <paths> failed' };
  if (stdout.trim() === '') return { path: null };

  // Coercing rather than trusting the declared type: the primary caller is untyped
  // CommonJS, and this value becomes a path segment.
  const iterationSegment =
    typeof input.iteration === 'number' && Number.isFinite(input.iteration)
      ? String(input.iteration)
      : 'unknown';
  const fileName = `${iterationSegment}-${new Date().toISOString().replace(/:/g, '-')}.patch`;
  // The directory name is a claim about what happened to the bytes, so it follows the remedy:
  // only 'restore' rolls a path back, and only a rollback's patch belongs under a name that
  // says so. Under 'preserve' the bytes stay exactly where they are, and the patch is the
  // record of an out-of-scope write.
  const patchDirName = input.mode === 'restore' ? 'containment-reverted' : 'containment-out-of-scope';
  const absolutePath = join(input.artifactDir, patchDirName, fileName);
  try {
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, stdout, 'utf8');
  } catch (error) {
    return { path: null, error: `patch write failed: ${(error as Error).message}` };
  }
  const prefix = input.artifactRelPosix === '' ? '' : `${input.artifactRelPosix}/`;
  return { path: `${prefix}${patchDirName}/${fileName}` };
}

/**
 * The bytes a baseline entry recorded for a path, or null when nothing may be restored from it.
 *
 * Null covers all three ways a baseline goes unusable -- the entry is marked truncated, no
 * capture dir was configured, or the recorded copy can no longer be read -- and they mean the
 * same thing at the moment of a restore: we do NOT hold what the file contained before the lane
 * started. HEAD is not a stand-in for those bytes, so a null here is never a cue to fall back
 * to it.
 */
function readBaselineContent(entry: DirtyPathEntry, baselineContentRoot?: string): Buffer | null {
  if (entry.baselineTruncated) return null;
  if (!entry.baselineContentPath || !baselineContentRoot) return null;
  try {
    return readFileSync(join(baselineContentRoot, entry.baselineContentPath));
  } catch {
    return null;
  }
}

/**
 * Run one write, creating its parent directories; null on success, the failure message otherwise.
 *
 * A record exists so it can be read back later, so a write that fails must cost the record
 * only the part it covers: the caller keeps the message on that path's entry and goes on.
 */
function writeQuarantineFile(destination: string, write: (absolutePath: string) => void): string | null {
  try {
    mkdirSync(dirname(destination), { recursive: true });
    write(destination);
    return null;
  } catch (error) {
    return (error as Error).message;
  }
}

/**
 * Record one guarded path under the quarantine tree. Never throws.
 *
 * `lane.bytes` is the budget for the whole sweep rather than for this file, exactly as it is
 * for the pre-dispatch capture these bounds come from: what has to stay bounded is the run.
 */
function quarantineOnePath(input: {
  violation: ContainmentViolation;
  quarantineDir: string;
  repoRoot: string;
  baselineEntry?: DirtyPathEntry;
  baselineContentRoot?: string;
  env?: NodeJS.ProcessEnv;
  lane: { bytes: number };
}): QuarantineEntry {
  const { violation } = input;
  const entry: QuarantineEntry = {
    path: violation.path,
    hash: gitHashObject(input.repoRoot, violation.path, input.env),
    content_stored: false,
  };
  // The first failure wins: what fails here is usually the destination itself, so every write
  // below fails for the same reason, and the first message is the one that names it.
  let failure: string | null = null;
  const fail = (message: string): void => {
    if (failure === null) failure = message;
  };

  // The bytes as the lane left them, which is the last moment they exist: a later lane, a
  // commit or a checkout replaces them, and nothing else in the run keeps a copy.
  try {
    const size = statSync(violation.absolutePath).size;
    if (size > BASELINE_MAX_FILE_BYTES || input.lane.bytes + size > BASELINE_MAX_LANE_BYTES) {
      entry.content_truncated = true;
    } else {
      const contentPath = `content/${violation.path}`;
      const writeError = writeQuarantineFile(join(input.quarantineDir, contentPath), (destination) => {
        copyFileSync(violation.absolutePath, destination);
      });
      if (writeError !== null) {
        fail(`content copy failed: ${writeError}`);
      } else {
        input.lane.bytes += size;
        entry.content_stored = true;
        entry.content_path = contentPath;
      }
    }
  } catch (error) {
    // A deleted or dangling path has nothing to copy; its hash and its patches still stand.
    fail(`content copy failed: ${(error as Error).message}`);
  }

  // The diff against HEAD: the content a rollback would have put in place of these bytes. A
  // path that is not in HEAD has no pre-image there, so only its stored bytes record it.
  const headDiff = gitOutput(
    ['diff', '--no-ext-diff', '--no-textconv', '--binary', 'HEAD', '--', violation.path],
    { repoRoot: input.repoRoot, env: input.env },
  );
  if (!headDiff.ok) {
    fail('git diff HEAD -- <path> failed');
  } else if (headDiff.stdout.trim() !== '') {
    const patchPath = `patch-head/${violation.path}.patch`;
    const writeError = writeQuarantineFile(join(input.quarantineDir, patchPath), (destination) => {
      writeFileSync(destination, headDiff.stdout, 'utf8');
    });
    if (writeError !== null) fail(`patch-head write failed: ${writeError}`);
    else entry.head_patch_path = patchPath;
  }

  // The diff against the bytes captured before the dispatch, for the paths that hold them:
  // HEAD is not what such a path held then, so `patch-head` cannot answer this question.
  const baselineBytes = input.baselineEntry
    ? readBaselineContent(input.baselineEntry, input.baselineContentRoot)
    : null;
  if (baselineBytes !== null) {
    const held = diffAgainstHeldBytes({
      repoRoot: input.repoRoot,
      repoRelativePosixPath: violation.path,
      bytes: baselineBytes,
      env: input.env,
    });
    if (!held.ok) {
      fail(`patch-baseline diff failed: ${held.error}`);
    } else {
      const patchPath = `patch-baseline/${violation.path}.patch`;
      const writeError = writeQuarantineFile(join(input.quarantineDir, patchPath), (destination) => {
        writeFileSync(destination, held.diff, 'utf8');
      });
      if (writeError !== null) fail(`patch-baseline write failed: ${writeError}`);
      else entry.baseline_patch_path = patchPath;
    }
  }

  if (failure !== null) entry.error = failure;
  return entry;
}

/**
 * Write what each guarded path left behind into `<artifactDir>/containment/quarantine/`:
 * `manifest.json`, the current bytes under `content/`, the diff against HEAD under
 * `patch-head/`, and the diff against the pre-dispatch bytes under `patch-baseline/`.
 *
 * The working tree keeps what the lane left, so this record is the only durable answer to
 * what an out-of-scope write actually said. The combined patch beside it answers what a
 * rollback undid, which is a different question, and neither the tree nor the loop state
 * holds the bytes themselves. A later pass over the same artifact dir replaces the manifest
 * and the files it names.
 *
 * Never throws. A record that cannot be written is a degraded record, not a failed lane: the
 * failure is kept on that path's entry, the rest of the sweep continues, and the guard goes
 * on reporting the violation it already found.
 */
export function quarantineViolations(input: {
  repoRoot: string;
  artifactDir: string;
  /** Repo-relative POSIX path of the artifact dir, prefixed onto the returned directory path. */
  artifactRelPosix: string;
  /** The guarded violations; a path that is not here is not quarantined. */
  violations: ContainmentViolation[];
  /** Pre-dispatch baseline: only a path whose bytes it holds gets a `patch-baseline/` diff. */
  preDispatchDirtyPaths?: DirtyPathEntry[];
  /** Absolute directory the entries' `baselineContentPath` values were captured under. */
  baselineContentRoot?: string;
  env?: NodeJS.ProcessEnv;
}): QuarantineResult {
  const quarantineDir = join(input.artifactDir, 'containment', 'quarantine');
  const prefix = input.artifactRelPosix === '' ? '' : `${input.artifactRelPosix}/`;
  const dirPath = `${prefix}containment/quarantine`;
  const baselineByPath = new Map(
    (input.preDispatchDirtyPaths ?? []).map((entry) => [toPosix(entry.path), entry]),
  );

  let mkdirError: string | null = null;
  try {
    mkdirSync(quarantineDir, { recursive: true });
  } catch (error) {
    mkdirError = (error as Error).message;
  }

  const lane = { bytes: 0 };
  const entries = input.violations.map((violation) =>
    quarantineOnePath({
      violation,
      quarantineDir,
      repoRoot: input.repoRoot,
      baselineEntry: baselineByPath.get(toPosix(violation.path)),
      baselineContentRoot: input.baselineContentRoot,
      env: input.env,
      lane,
    }),
  );

  if (mkdirError !== null) {
    // Every write above failed on this one reason, and each entry carries it.
    return { dirPath: null, entries, error: `quarantine dir unavailable: ${mkdirError}` };
  }
  try {
    writeFileSync(
      join(quarantineDir, 'manifest.json'),
      `${JSON.stringify({ timestamp: new Date().toISOString(), entries }, null, 2)}\n`,
      'utf8',
    );
  } catch (error) {
    return { dirPath, entries, error: `manifest write failed: ${(error as Error).message}` };
  }
  return { dirPath, entries };
}

/**
 * Apply the configured remedy to the given out-of-scope violating paths, WITHOUT ever
 * irreversibly deleting a file. `mode` selects that remedy and defaults to 'preserve',
 * under which a tracked path present in HEAD is left byte-for-byte as it is on disk and
 * reported as 'preserved_in_head'.
 *
 * Preserve is the default because a HEAD restore is the one containment outcome that
 * destroys work: the guard cannot distinguish this leaf's stray write from a concurrent
 * session's in-flight edit to the same file, and the edited bytes die with the restore
 * with nobody watching to reclaim them. 'restore' is the opt-in for the checkouts where
 * that trade is safe -- it resurrects deletions and undoes modifications. A not-in-HEAD
 * path (untracked or newly added) has no HEAD content to restore, so the only "revert"
 * would be a hard delete; but on a dirty, multi-actor tree such a path may be a concurrent
 * write by the orchestrator or a parallel session, indistinguishable from the leaf's own.
 * Deleting it would be irreversible data loss, so it is PRESERVED and reported instead in
 * BOTH modes. NEVER a blanket `git clean`, NEVER a delete -- the caller decides fatal-ness
 * separately, by whether the path belongs to the packet's own directory tree.
 *
 * Under 'restore', the pre-dispatch baseline decides what a path goes back TO. A path that
 * was CLEAN at dispatch is restored from HEAD, which is what it held then. A path that was
 * ALREADY DIRTY is restored from the bytes the baseline captured, because HEAD is not those
 * bytes -- it is the last commit, and rolling back to it discards whatever a concurrent
 * editor had written before this lane started. A dirty path whose baseline holds no bytes
 * is left exactly as it is on disk, for the same reason.
 */
export function revertOutOfScopeViolations(opts: {
  repoRoot: string;
  violations: ContainmentViolation[];
  env?: NodeJS.ProcessEnv;
  /** Remedy for a path that exists in HEAD; the default leaves the working tree untouched. */
  mode?: 'preserve' | 'restore';
  /**
   * The pre-dispatch baseline; consulted only by 'restore', only to pick a path's target.
   *
   * Omitting it keeps the previous behaviour verbatim -- every in-HEAD path comes from HEAD --
   * so a caller with a baseline can opt in per call, exactly as it opts into 'restore' itself.
   */
  preDispatchDirtyPaths?: DirtyPathEntry[];
  /** Absolute directory the entry's `baselineContentPath` values were captured under. */
  baselineContentRoot?: string;
}): ContainmentRevertResult {
  const mode = opts.mode ?? 'preserve';
  const baselineByPath = new Map((opts.preDispatchDirtyPaths ?? []).map((entry) => [toPosix(entry.path), entry]));
  const reverted: ContainmentRevertAction[] = [];
  for (const violation of opts.violations) {
    if (pathInHead(opts.repoRoot, violation.path, opts.env)) {
      if (mode === 'restore') {
        const baseline = baselineByPath.get(toPosix(violation.path));
        if (baseline === undefined) {
          const ok = checkoutFromHead(opts.repoRoot, violation.path, opts.env);
          reverted.push({
            path: violation.path,
            action: 'restored_from_head',
            ok,
            ...(ok ? {} : { error: 'git checkout HEAD -- <path> failed' }),
          });
        } else {
          const baselineBytes = readBaselineContent(baseline, opts.baselineContentRoot);
          if (baselineBytes === null) {
            // The bytes exist on this tree and nowhere else we may reach: the restore target the
            // baseline described is unavailable, so the file is left as the lane left it rather
            // than rolled back past work the baseline is the only record of.
            reverted.push({ path: violation.path, action: 'preserved_in_head', ok: true });
          } else {
            try {
              writeFileSync(join(opts.repoRoot, violation.path), baselineBytes);
              reverted.push({ path: violation.path, action: 'restored_from_baseline', ok: true });
            } catch (error) {
              reverted.push({
                path: violation.path,
                action: 'restored_from_baseline',
                ok: false,
                error: `baseline restore failed: ${(error as Error).message}`,
              });
            }
          }
        }
      } else {
        reverted.push({ path: violation.path, action: 'preserved_in_head', ok: true });
      }
    } else {
      // A not-in-HEAD path can't be attributed to this leaf under concurrent fan-out --
      // a parent orchestrator or a sibling session may have created it during the same
      // window -- so treating it as this leaf's own and deleting it is unsound and
      // irreversible. Preserve it on disk and report it; the caller decides whether it
      // stays a non-fatal advisory or fails the iteration based on packet scope.
      reverted.push({ path: violation.path, action: 'preserved_untracked', ok: true });
    }
  }
  return { reverted };
}

/** Build the JSONL event payload appended to the loop state log on a violation. */
export function buildContainmentViolationEvent(input: {
  iteration?: number;
  label?: string;
  violations: ContainmentViolation[];
  revertResult: ContainmentRevertResult;
  /** Outcome of the pre-revert patch capture; omitted when no revert was attempted. */
  patch?: { path: string | null; error?: string };
}): ContainmentViolationEvent {
  const destroyed = input.revertResult.reverted
    .filter((a) => a.action === 'restored_from_head')
    .map((a) => a.path);
  return {
    type: 'event',
    event: 'containment_violation',
    severity: 'error',
    timestamp: new Date().toISOString(),
    ...(typeof input.iteration === 'number' ? { iteration: input.iteration } : {}),
    ...(typeof input.label === 'string' && input.label.length > 0 ? { label: input.label } : {}),
    violations: input.violations.map((v) => ({ path: v.path, kind: v.kind, status: v.status })),
    reverted: input.revertResult.reverted,
    ...(input.patch?.path ? { revertedPatchPath: input.patch.path } : {}),
    ...(input.patch?.error ? { revertedPatchError: input.patch.error } : {}),
    ...(destroyed.length > 0
      ? {
        dataLossPossible: {
          paths: destroyed,
          ...(input.patch?.path ? { recoverFrom: input.patch.path } : {}),
          note: input.patch?.path
            ? 'Tracked file(s) rolled back to HEAD. Uncommitted work by whoever wrote them is gone from the tree and survives only in the patch named here. If another session was writing, tell them.'
            : 'Tracked file(s) rolled back to HEAD and NO patch was saved. Uncommitted work by whoever wrote them is unrecoverable. If another session was writing, tell them.',
        },
      }
      : {}),
  };
}

function appendContainmentEvent(stateLogPath: string, event: ContainmentViolationEvent): void {
  try {
    mkdirSync(dirname(stateLogPath), { recursive: true });
    appendFileSync(stateLogPath, `${JSON.stringify(event)}\n`, 'utf8');
  } catch {
    // Logging must never block the containment decision already taken.
  }
}

/**
 * High-level post-dispatch guard: detect NEW out-of-scope violations, quarantine what each
 * guarded path left behind, save what a restore would undo as a patch, apply the remedy, and
 * (when stateLogPath is provided) append a containment_violation event. Returns the
 * violations, revert result, the event (null when clean), `recoveryHint` naming the saved
 * patch for the caller's fatal message, and `quarantinePath` naming the durable record.
 * The caller fails the iteration fail-closed when `violations.length > 0`.
 */
export function enforceWriteContainment(input: EnforceInput): EnforceResult {
  const detected = detectNewOutOfScopeViolations(input);
  if (detected.length === 0) {
    return {
      violations: [], advisories: [], revertResult: { reverted: [] }, event: null, recoveryHint: null,
      quarantinePath: null,
    };
  }
  // detectNewOutOfScopeViolations above only returns non-empty once it has already resolved
  // this same scope from this same input (it throws or returns [] otherwise), so this
  // recomputes the identical artifact-dir boundary. Falls open to '' (root) on the
  // practically-unreachable case where it diverges, consistent with this module's fail-open
  // design when it cannot reason about the tree.
  const scope = resolveArtifactScope(input);
  const artifactRelPosix = scope ? scope.artifactRelPosix : '';
  // A detected path that is nonetheless INSIDE the artifact dir by name got here only
  // because its canonical form escapes that tree -- a symlink pointing out. Both
  // carve-outs below key off the path's name, which is exactly what such a link
  // controls, so an escape is held out of them and stays fatal.
  const escapesArtifactTree = (violation: ContainmentViolation): boolean =>
    scope !== null && isInsideArtifact(violation.path, scope.artifactRelPosix);
  const exempted = detected.filter(
    (violation) => !escapesArtifactTree(violation) && isRegenerableRuntimeState(violation.path, artifactRelPosix),
  );
  const guarded = detected.filter(
    (violation) => escapesArtifactTree(violation) || !isRegenerableRuntimeState(violation.path, artifactRelPosix),
  );
  // The capture precedes the rollback under 'restore' because the rollback is what destroys
  // the bytes it copies: afterwards there is no diff left to take. Under 'preserve' nothing
  // is rolled back, so it is a record of what the lane wrote outside its scope -- and it
  // lands under a name that says exactly that.
  const patch = captureRevertPatch({
    repoRoot: input.repoRoot,
    artifactDir: input.artifactDir,
    artifactRelPosix,
    violations: guarded,
    iteration: input.iteration,
    mode: input.mode,
    env: input.env,
  });
  // Then the same paths again as their own files, while they are still on disk. The combined
  // patch above records what a restore would undo; this records what each path held and what
  // it changed from. It writes whatever it can and never throws, so it cannot fail the lane.
  const quarantine = quarantineViolations({
    repoRoot: input.repoRoot,
    artifactDir: input.artifactDir,
    artifactRelPosix,
    violations: guarded,
    preDispatchDirtyPaths: input.preDispatchDirtyPaths,
    baselineContentRoot: input.baselineContentRoot,
    env: input.env,
  });
  const revertResult = revertOutOfScopeViolations({
    repoRoot: input.repoRoot,
    violations: guarded,
    env: input.env,
    mode: input.mode,
    preDispatchDirtyPaths: input.preDispatchDirtyPaths,
    baselineContentRoot: input.baselineContentRoot,
  });
  // Partition by what the revert actually did: HEAD-restored paths are recoverable breaches
  // and always fatal. A preserved not-in-HEAD path is a non-fatal advisory only when it sits
  // inside the packet's own directory tree -- an ancestor of (or equal to) this leaf's
  // artifact dir, e.g. a spec doc some other process in the same packet wrote alongside this
  // lineage. A preserved path with no such relationship is a genuine out-of-scope breach: it
  // still cannot be safely deleted (it may be an unregistered concurrent writer), but it must
  // fail the iteration rather than silently becoming a permanent, unattributed pass.
  const preservedPaths = new Set(
    revertResult.reverted.filter((a) => a.action === 'preserved_untracked').map((a) => a.path),
  );
  const isPacketScopedPath = (path: string): boolean => {
    // An escaping symlink is never a packet neighbour: it was flagged precisely because
    // its bytes leave the tree, so it must not inherit the concurrent-writer pass.
    if (scope !== null && isInsideArtifact(path, scope.artifactRelPosix)) return false;
    const dir = dirnameRelPosix(path);
    // A bare repo-root file has no real relationship to any specific packet -- excluding it
    // keeps a genuinely unrelated stray write from qualifying merely because every path is
    // trivially "under" the repo root.
    return dir !== '' && isInsideArtifact(artifactRelPosix, dir);
  };
  const violations = guarded.filter((v) => !preservedPaths.has(v.path) || !isPacketScopedPath(v.path));
  const advisories = [
    ...exempted,
    ...guarded.filter((v) => preservedPaths.has(v.path) && isPacketScopedPath(v.path)),
  ];
  // The logged event carries every detected path (fatal + advisory) for visibility -- an
  // operator reading the state log needs to see preserved advisories too, not just the
  // fatal subset -- while the RETURNED `violations`/`advisories` partition is what the
  // caller acts on to decide whether the iteration fails.
  const event = buildContainmentViolationEvent({
    iteration: input.iteration,
    label: input.label,
    violations: detected,
    revertResult,
    patch,
  });
  if (input.stateLogPath) {
    appendContainmentEvent(input.stateLogPath, event);
  }
  const recoveryHint = patch.path ? `recoverable patch: ${patch.path}` : null;
  return { violations, advisories, revertResult, event, recoveryHint, quarantinePath: quarantine.dirPath };
}

// Exported for tests / diagnostics.
export const __internals = {
  resolveGitToplevel,
  resolveArtifactScope,
  parseStatusPorcelain,
  isInsideArtifact,
  isContainedInArtifact,
  canonicalPath,
  isRegenerableRuntimeState,
  isSubpath,
};
