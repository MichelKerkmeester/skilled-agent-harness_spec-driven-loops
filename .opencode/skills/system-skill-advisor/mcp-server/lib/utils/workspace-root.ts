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
// Strict sentinel: anchors on the canonical SKILL.md inside system-spec-kit so
// nested mock dirs (e.g. mcp-server/.opencode/skills/.advisor-state/) cannot
// satisfy the walk-up. A bare `.opencode/skills` directory is trivially
// self-perpetuating: once any caller writes anything under it from a wrong
// cwd, the walk-up resolver returns that wrong cwd on subsequent calls.
// `schemas/advisor-tool-schemas.ts:detectRepoRoot` uses the same strict
// sentinel for the same reason — keep these two in lockstep.
const DEFAULT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/**
 * When the sentinel walk-up fails, the resolver must never hand back a
 * directory that sits *inside* an `.opencode/` tree. The advisor writes runtime
 * state under whatever root this returns, so a root inside `.opencode/` would
 * materialize a nested `.opencode/skills/...` tree there on every run — and that
 * nested tree then satisfies future walk-ups, making the leak permanent.
 *
 * The rule is structural rather than an enumeration of known-bad subtrees: an
 * `.opencode/` directory is by definition a child of the workspace root, so any
 * candidate containing an `.opencode` path segment is provably not the root.
 * Hoisting above the OUTERMOST such segment yields the real root.
 *
 * An earlier version listed `specs/` only. That shape could not protect subtrees
 * nobody had thought of, and leaks into `skills/` continued unnoticed because
 * neither the guard nor its test considered them.
 *
 * Returns null when `dir` is not inside an `.opencode` tree.
 */
function hoistAboveOpencodeTree(dir: string): string | null {
  const parts = resolve(dir).split(sep);
  // Outermost wins: a leak can nest several levels deep, and hoisting to the
  // innermost `.opencode` would land inside the real one.
  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index] === '.opencode') {
      return parts.slice(0, index).join(sep) || sep;
    }
  }
  return null;
}

/**
 * Walk up parent directories from `start` until the `sentinel` path is found
 * relative to the candidate directory. Returns the first directory that
 * contains `sentinel`. If no candidate is found within `maxDepth` iterations,
 * returns the canonicalized form of `start` as the safest fallback (matching
 * the prior in-line behavior of `handlers/advisor-recommend.ts`).
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
  const sentinel = opts.sentinel ?? DEFAULT_SENTINEL;
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  // Sentinel not found within maxDepth. Never fall back to a path inside an
  // .opencode/ tree — that is provably not a workspace root, and writing state
  // there creates a nested tree that re-anchors every future walk-up.
  return hoistAboveOpencodeTree(start) ?? resolve(start);
}
