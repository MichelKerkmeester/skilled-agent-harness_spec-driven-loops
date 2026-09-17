// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Workspace Root Walk-Up
// ───────────────────────────────────────────────────────────────
// Shared walk-up helper used by every advisor handler, daemon, bench,
// and parity test that needs to resolve the workspace root from a
// runtime-supplied starting directory. Mirrors the `code_graph/lib/utils/
// workspace-path.ts` shape: one canonicalized helper, parametrizable by
// start dir, depth cap, and sentinel path.

import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export interface AdvisorWorkspaceRootOptions {
  readonly maxDepth?: number;
  readonly sentinel?: string;
}

const DEFAULT_MAX_DEPTH = 14;
// The source tree sits under `.skilled` or `.opencode`, and a checkout may link one
// name to the other, so both names mark the same tree. A sentinel that starts with
// either name is tested under each, and the fallback hoists above either.
const SOURCE_ROOT_NAMES: readonly string[] = ['.skilled', '.opencode'];
// Strict sentinel: anchors on the canonical SKILL.md inside system-spec-kit so
// nested mock dirs (e.g. runtime/.opencode/skills/.state/advisor/) cannot
// satisfy the walk-up. A bare `.opencode/skills` directory is trivially
// self-perpetuating: once any caller writes anything under it from a wrong
// cwd, the walk-up resolver returns that wrong cwd on subsequent calls.
// `schemas/advisor-tool-schemas.ts:detectRepoRoot` uses the same strict
// sentinel for the same reason — keep these two in lockstep.
const DEFAULT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/**
 * Spell a sentinel under every source-root name when its first segment is one. The
 * legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under it
 * is tested as written. A sentinel spelled under `.skilled/specs` still tests that
 * legacy spelling, because it is the only one the alias has.
 */
function sentinelSpellings(sentinel: string): string[] {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head) || (head === '.opencode' && rest[0] === 'specs')) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
}

/**
 * When the sentinel walk-up fails, the resolver must never hand back a
 * directory that sits *inside* a source tree. The advisor writes runtime
 * state under whatever root this returns, so a root inside `.opencode/` would
 * materialize a nested `.opencode/skills/...` tree there on every run — and that
 * nested tree then satisfies future walk-ups, making the leak permanent.
 *
 * The rule is structural rather than an enumeration of known-bad subtrees: a
 * `.skilled/` or `.opencode/` directory is by definition a child of the workspace
 * root, so any candidate containing either path segment is provably not the root.
 * Hoisting above the OUTERMOST such segment yields the real root.
 *
 * An earlier version listed `specs/` only. That shape could not protect subtrees
 * nobody had thought of, and leaks into `skills/` continued unnoticed because
 * neither the guard nor its test considered them.
 *
 * Returns null when `dir` is not inside a `.skilled` or `.opencode` tree.
 */
function hoistAboveOpencodeTree(dir: string): string | null {
  const parts = resolve(dir).split(sep);
  // Outermost wins: a leak can nest several levels deep, and hoisting to the
  // innermost source-root segment would land inside the real tree.
  for (let index = 1; index < parts.length; index += 1) {
    if (SOURCE_ROOT_NAMES.includes(parts[index])) {
      return parts.slice(0, index).join(sep) || sep;
    }
  }
  return null;
}

/**
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * start itself or the parent of one source-root segment in the start path. Testing the
 * start, then those parents nearest first, as the walk would, keeps a workspace that
 * sits under a directory named `.skilled` or `.opencode` instead of hoisting past it.
 * Returns null when none of them holds the sentinel.
 */
function nearestSentinelHolder(dir: string, sentinels: readonly string[]): string | null {
  const holdsSentinel = (candidate: string): boolean => sentinels.some((sentinel) => existsSync(resolve(candidate, sentinel)));
  if (holdsSentinel(dir)) return resolve(dir);
  const parts = resolve(dir).split(sep);
  for (let index = parts.length - 1; index >= 1; index -= 1) {
    if (!SOURCE_ROOT_NAMES.includes(parts[index])) continue;
    const parent = parts.slice(0, index).join(sep) || sep;
    if (holdsSentinel(parent)) return parent;
  }
  return null;
}

/**
 * Walk up parent directories from `start` until the `sentinel` path is found
 * relative to the candidate directory. Returns the first directory that
 * contains `sentinel`. If no candidate is found within `maxDepth` iterations,
 * the start or the nearest source-root parent in its path that holds the
 * sentinel is the root. Failing that, the result is the directory above the
 * outermost source-root segment in `start`, and a `start` outside any source
 * tree comes back canonicalized.
 *
 * The default sentinel is the canonical `.opencode/skills/system-spec-kit/SKILL.md`
 * file rather than a bare `.opencode/skills` directory. Bare-directory sentinels
 * are vulnerable to self-perpetuation: a buggy caller writing to
 * `<wrong-cwd>/.opencode/skills/...` creates a directory that satisfies the
 * sentinel check on every subsequent walk-up, so the resolver returns the
 * wrong cwd forever. Anchoring on a real authored file in the canonical skill
 * removes that footgun.
 *
 * @param start - The directory to start walking from. Defaults to `process.cwd()`.
 * @param opts.maxDepth - Maximum number of parent steps to walk. Defaults to 14.
 * @param opts.sentinel - Path (relative to a candidate directory) used as the
 *   workspace marker. Defaults to `'.opencode/skills/system-spec-kit/SKILL.md'`.
 */
export function findAdvisorWorkspaceRoot(
  start: string = process.cwd(),
  opts: AdvisorWorkspaceRootOptions = {},
): string {
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinels = sentinelSpellings(opts.sentinel ?? DEFAULT_SENTINEL);
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (sentinels.some((sentinel) => existsSync(resolve(current, sentinel)))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  // Sentinel not found within maxDepth. Never fall back to a path inside a
  // source tree — that is provably not a workspace root, and writing state
  // there creates a nested tree that re-anchors every future walk-up.
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
