// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: deep-loop codex write-containment guard                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: A codex leaf runs under `--sandbox workspace-write`, which lets   ║
// ║          it write anywhere in the workspace -- the artifact dir boundary   ║
// ║          is prompt-only. This module turns that boundary into a structural ║
// ║          one: after a dispatch, diff the git working tree for NEW changes  ║
// ║          outside the artifact dir, revert exactly those paths, emit a      ║
// ║          containment_violation event, and let the caller fail the iter.    ║
// ║          Pre-existing dirty paths are subtracted so unrelated in-flight    ║
// ║          work is never reverted. Fails OPEN: when it cannot reason about   ║
// ║          git (no repo, no binary, artifact dir outside the worktree) it    ║
// ║          returns empty results and never breaks the loop it guards.        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, realpathSync, rmSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

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
  action: 'restored_from_head' | 'removed_untracked';
  ok: boolean;
  error?: string;
}

export interface ContainmentRevertResult {
  reverted: ContainmentRevertAction[];
}

export interface ContainmentOptions {
  repoRoot: string;
  artifactDir: string;
  env?: NodeJS.ProcessEnv;
}

export interface DetectOptions extends ContainmentOptions {
  /** Dirty out-of-scope paths captured BEFORE the dispatch (the baseline). */
  preDispatchDirtyPaths: string[];
}

export interface ContainmentViolationEvent {
  type: 'event';
  event: 'containment_violation';
  severity: 'error';
  iteration?: number;
  label?: string;
  violations: Array<{ path: string; kind: ContainmentViolationKind; status: string }>;
  reverted: ContainmentRevertAction[];
  timestamp: string;
}

export interface EnforceInput extends DetectOptions {
  /** When set, the containment_violation event is appended to this JSONL log. */
  stateLogPath?: string;
  iteration?: number;
  label?: string;
}

export interface EnforceResult {
  violations: ContainmentViolation[];
  revertResult: ContainmentRevertResult;
  event: ContainmentViolationEvent | null;
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
 * The artifact-dir subtree relative to repoRoot in POSIX form, or null when the
 * artifact dir is not inside the resolved git worktree (hermetic test artifact
 * dirs, external paths) -- the signal to skip containment entirely.
 *
 * All three paths are resolved through realpath so a symlinked repo root (e.g.
 * macOS `/var` -> `/private/var`) does not make the worktree toplevel disagree
 * with the caller-supplied paths and silently disable containment.
 */
function resolveArtifactScope(opts: ContainmentOptions): { artifactRelPosix: string } | null {
  const toplevel = resolveGitToplevel(opts.repoRoot, opts.env);
  if (!toplevel) return null;
  const repoReal = realpathSafe(opts.repoRoot);
  const artifactReal = realpathSafe(opts.artifactDir);
  const toplevelReal = realpathSafe(toplevel);
  if (!isSubpath(artifactReal, toplevelReal)) return null;
  const artifactRelPosix = toPosix(relative(repoReal, artifactReal));
  // An artifact dir resolved outside repoRoot (e.g. '../other') cannot be scoped.
  if (artifactRelPosix.startsWith('..') || isAbsolute(artifactRelPosix)) return null;
  return { artifactRelPosix };
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
export function snapshotOutOfScopeDirtyPaths(opts: ContainmentOptions): string[] {
  const scope = resolveArtifactScope(opts);
  if (!scope) return [];
  const entries = readStatusEntries({ repoRoot: opts.repoRoot, env: opts.env });
  const out: string[] = [];
  for (const entry of entries) {
    if (!isInsideArtifact(entry.path, scope.artifactRelPosix)) {
      out.push(toPosix(entry.path));
    }
  }
  return Array.from(new Set(out)).sort();
}

/**
 * Post-dispatch detection: NEW out-of-scope violations introduced by the leaf,
 * computed as (current out-of-scope dirty) minus (pre-dispatch baseline).
 */
export function detectNewOutOfScopeViolations(opts: DetectOptions): ContainmentViolation[] {
  const scope = resolveArtifactScope(opts);
  if (!scope) return [];
  const entries = readStatusEntries({ repoRoot: opts.repoRoot, env: opts.env });
  const preSet = new Set(opts.preDispatchDirtyPaths.map(toPosix));
  const violations: ContainmentViolation[] = [];
  for (const entry of entries) {
    const p = toPosix(entry.path);
    if (isInsideArtifact(p, scope.artifactRelPosix)) continue;
    if (preSet.has(p)) continue;
    violations.push({
      path: p,
      absolutePath: resolve(opts.repoRoot, p),
      kind: classifyViolation(entry.status),
      status: entry.status,
    });
  }
  return violations;
}

/**
 * Revert EXACTLY the given violating paths. Tracked files (present in HEAD) are
 * restored from HEAD -- which resurrects deletions and undoes modifications --
 * while untracked files the leaf created are removed by a scoped delete on that
 * one path. NEVER a blanket `git clean`.
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
      // Newly-created (untracked) path: remove only this specific path.
      try {
        rmSync(violation.absolutePath, { recursive: true, force: true });
        reverted.push({ path: violation.path, action: 'removed_untracked', ok: true });
      } catch (error) {
        reverted.push({
          path: violation.path,
          action: 'removed_untracked',
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
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
 * High-level post-dispatch guard: detect NEW out-of-scope violations, revert
 * them, and (when stateLogPath is provided) append a containment_violation event.
 * Returns the violations, revert result, and the event (null when clean). The
 * caller fails the iteration fail-closed when `violations.length > 0`.
 */
export function enforceWriteContainment(input: EnforceInput): EnforceResult {
  const violations = detectNewOutOfScopeViolations(input);
  if (violations.length === 0) {
    return { violations, revertResult: { reverted: [] }, event: null };
  }
  const revertResult = revertOutOfScopeViolations({
    repoRoot: input.repoRoot,
    violations,
    env: input.env,
  });
  const event = buildContainmentViolationEvent({
    iteration: input.iteration,
    label: input.label,
    violations,
    revertResult,
  });
  if (input.stateLogPath) {
    appendContainmentEvent(input.stateLogPath, event);
  }
  return { violations, revertResult, event };
}

// Exported for tests / diagnostics.
export const __internals = {
  resolveGitToplevel,
  resolveArtifactScope,
  parseStatusPorcelain,
  isInsideArtifact,
  isSubpath,
};
