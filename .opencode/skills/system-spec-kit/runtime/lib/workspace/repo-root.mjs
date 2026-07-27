// ───────────────────────────────────────────────────────────────
// MODULE: Repository Root Resolution
// ───────────────────────────────────────────────────────────────
// Every runtime writer that persists state must anchor to the repository root.
// Deriving a write root from the working directory instead plants a nested
// `.opencode/` tree wherever the process happened to run, and that nested tree
// then satisfies future walk-ups, so the leak becomes permanent and spreads.
//
// Two properties matter and both are load-bearing:
//
//   1. The sentinel is a real authored FILE, not a bare `.opencode` directory.
//      A directory sentinel is self-perpetuating: once a buggy caller creates
//      `<wrong-dir>/.opencode/...`, every later walk-up from that subtree finds
//      it and returns the wrong root forever.
//
//   2. The fallback hoists above the OUTERMOST `.opencode` segment rather than
//      rejecting an enumerated list of known-bad subtrees. `.opencode/` is by
//      definition a child of the root, so any candidate containing that segment
//      is provably not the root. A deny-list cannot protect subtrees nobody
//      thought of, which is how leaks into `skills/` went unnoticed while a
//      guard for `specs/` was in place and believed to be working.

import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

/** Authored file that marks the workspace root. Never a bare directory. */
export const REPO_ROOT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

const DEFAULT_MAX_DEPTH = 14;

/**
 * Hoist above the outermost `.opencode` segment in `dir`.
 *
 * @param {string} dir - Candidate directory.
 * @returns {string|null} The directory containing the outermost `.opencode`, or
 *   null when `dir` is not inside an `.opencode` tree.
 */
export function hoistAboveOpencodeTree(dir) {
  const parts = resolve(dir).split(sep);
  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index] === '.opencode') {
      return parts.slice(0, index).join(sep) || sep;
    }
  }
  return null;
}

/**
 * Resolve the repository root for a runtime writer.
 *
 * Walks up from `start` looking for the authored sentinel. When the walk
 * exhausts, falls back to hoisting above any `.opencode` tree so the caller can
 * never be handed a root that would nest state inside one.
 *
 * @param {string} [start] - Directory to resolve from. Defaults to `process.cwd()`.
 * @param {{ maxDepth?: number, sentinel?: string }} [opts]
 * @returns {string} An absolute directory that is safe to write state under.
 */
export function findRepoRoot(start = process.cwd(), opts = {}) {
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinel = opts.sentinel ?? REPO_ROOT_SENTINEL;
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return hoistAboveOpencodeTree(start) ?? resolve(start);
}
