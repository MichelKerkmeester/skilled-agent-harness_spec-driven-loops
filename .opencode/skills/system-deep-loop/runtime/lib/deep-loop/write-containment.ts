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
import { appendFileSync, mkdirSync, readlinkSync, realpathSync, writeFileSync } from 'node:fs';
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
  action: 'restored_from_head' | 'preserved_untracked';
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
  env?: NodeJS.ProcessEnv;
}

export interface DirtyPathEntry {
  path: string;
  hash: string;
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
   * Repo-relative POSIX path of the patch holding everything the revert undid —
   * the only surviving copy of a reverted edit. Absent when no in-HEAD path was
   * reverted, when the diff was empty, or when the patch could not be written.
   */
  revertedPatchPath?: string;
  /** Why the patch could not be saved. The revert still happened; the edit is gone. */
  revertedPatchError?: string;
  timestamp: string;
}

export interface EnforceInput extends DetectOptions {
  /** When set, the containment_violation event is appended to this JSONL log. */
  stateLogPath?: string;
  iteration?: number;
  label?: string;
}

export interface EnforceResult {
  /** In-HEAD out-of-scope breaches reverted from HEAD -- fatal; the caller fails the iteration. */
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
 * Pre-dispatch snapshot: every dirty path (tracked modified/deleted AND untracked)
 * that lies OUTSIDE artifactDir. This is the baseline subtracted after dispatch so
 * pre-existing unrelated changes are never treated as the leaf's violations.
 *
 * Returns [] (no-op) when git is unavailable, repoRoot is not a worktree, or
 * artifactDir is outside the worktree.
 */
export function snapshotOutOfScopeDirtyPaths(opts: ContainmentOptions): DirtyPathEntry[] {
  const scope = resolveArtifactScope(opts);
  if (!scope) return [];
  const entries = readStatusEntries({ repoRoot: opts.repoRoot, env: opts.env });
  const out: DirtyPathEntry[] = [];
  for (const entry of entries) {
    if (isUnattributable(entry.path, scope.unattributableRelPosix, scope.unattributableFileRelPosix)) continue;
    if (!isContainedInArtifact(scope.repoRealRoot, scope.artifactRealRoot, scope.artifactRelPosix, entry.path)) {
      const entryPath = toPosix(entry.path);
      // Hash every dirty path on disk, tracked or not: an untracked baseline entry left
      // unhashed always short-circuits the later comparison as "unknown, skip" regardless of
      // its content, so a leaf that overwrites the SAME out-of-scope path in a later iteration
      // would go undetected forever behind the first iteration's now-stale advisory.
      const hash = gitHashObject(opts.repoRoot, entryPath, opts.env);
      out.push({ path: entryPath, hash });
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
 * Save everything the revert is about to undo as an appliable patch inside the artifact dir.
 *
 * The guard cannot tell a leaf's stray write from an operator editing the same checkout by
 * hand, so reverting from HEAD is correct and destructive at once: correct because an
 * unattributable out-of-scope change must not survive the run, destructive because a real
 * person's unsaved work goes with it. The patch is what makes that trade recoverable —
 * `git apply` restores the edit — and it must be taken BEFORE the checkout, since afterwards
 * there is no diff left to take.
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
  const absolutePath = join(input.artifactDir, 'containment-reverted', fileName);
  try {
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, stdout, 'utf8');
  } catch (error) {
    return { path: null, error: `patch write failed: ${(error as Error).message}` };
  }
  const prefix = input.artifactRelPosix === '' ? '' : `${input.artifactRelPosix}/`;
  return { path: `${prefix}containment-reverted/${fileName}` };
}

/**
 * Revert the given out-of-scope violating paths WITHOUT ever irreversibly deleting a file.
 * A tracked path present in HEAD is restored from HEAD -- which resurrects deletions and
 * undoes modifications, and is fully recoverable. A not-in-HEAD path (untracked or newly
 * added) has no HEAD content to restore, so the only "revert" would be a hard delete; but on
 * a dirty, multi-actor tree such a path may be a concurrent write by the orchestrator or a
 * parallel session, indistinguishable from the leaf's own. Deleting it would be irreversible
 * data loss, so it is PRESERVED and reported instead. NEVER a blanket `git clean`, NEVER a
 * delete -- the caller decides fatal-ness separately, by whether the path belongs to the
 * packet's own directory tree.
 */
export function revertOutOfScopeViolations(opts: {
  repoRoot: string;
  violations: ContainmentViolation[];
  env?: NodeJS.ProcessEnv;
}): ContainmentRevertResult {
  const reverted: ContainmentRevertAction[] = [];
  for (const violation of opts.violations) {
    if (pathInHead(opts.repoRoot, violation.path, opts.env)) {
      const ok = checkoutFromHead(opts.repoRoot, violation.path, opts.env);
      reverted.push({
        path: violation.path,
        action: 'restored_from_head',
        ok,
        ...(ok ? {} : { error: 'git checkout HEAD -- <path> failed' }),
      });
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
 * High-level post-dispatch guard: detect NEW out-of-scope violations, save what the
 * revert will undo as a patch, revert them, and (when stateLogPath is provided) append
 * a containment_violation event. Returns the violations, revert result, the event (null
 * when clean), and `recoveryHint` naming the saved patch for the caller's fatal message.
 * The caller fails the iteration fail-closed when `violations.length > 0`.
 */
export function enforceWriteContainment(input: EnforceInput): EnforceResult {
  const detected = detectNewOutOfScopeViolations(input);
  if (detected.length === 0) {
    return {
      violations: [], advisories: [], revertResult: { reverted: [] }, event: null, recoveryHint: null,
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
  // Taken before the revert, because the revert is what destroys the content it copies.
  const patch = captureRevertPatch({
    repoRoot: input.repoRoot,
    artifactDir: input.artifactDir,
    artifactRelPosix,
    violations: guarded,
    iteration: input.iteration,
    env: input.env,
  });
  const revertResult = revertOutOfScopeViolations({
    repoRoot: input.repoRoot,
    violations: guarded,
    env: input.env,
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
  return { violations, advisories, revertResult, event, recoveryHint };
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
