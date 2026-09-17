// ───────────────────────────────────────────────────────────────────
// MODULE: Repository Root Resolution
// ───────────────────────────────────────────────────────────────────
// Every writer that persists state, in any package, must anchor to the repository root.
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
//   2. The fallback hoists above the OUTERMOST source-root segment rather than
//      rejecting an enumerated list of known-bad subtrees. The source tree is by
//      definition a child of the root, so any candidate containing that segment
//      is provably not the root. A deny-list cannot protect subtrees nobody
//      thought of, which is how leaks into `skills/` went unnoticed while a
//      guard for `specs/` was in place and believed to be working.
//
// The source tree sits under `.skilled` or `.opencode`, and a checkout may link one
// name to the other. Both names mark the same tree, so a sentinel spelled under one
// is tested under each and the fallback hoists above either. Node reports a script's
// real path through such a link, so a caller may reach the tree by either name.

import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

/** Authored file that marks the workspace root. Never a bare directory. */
export const REPO_ROOT_SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';

/** Directory names the source tree may sit under, in the order a walk tests them. */
export const SOURCE_ROOT_NAMES = Object.freeze(['.skilled', '.opencode']);

const DEFAULT_MAX_DEPTH = 14;

/**
 * Spell a sentinel under every source-root name when its first segment is one.
 *
 * The legacy spec alias keeps its one `.opencode/specs` spelling, so a sentinel under
 * it is tested as written. A sentinel spelled under `.skilled/specs` still tests that
 * legacy spelling, because it is the only one the alias has.
 *
 * @param {string} sentinel - Relative sentinel path.
 * @returns {string[]} One spelling per source-root name, or the sentinel alone.
 */
function sentinelSpellings(sentinel) {
  const [head, ...rest] = sentinel.split('/');
  if (rest.length === 0 || !SOURCE_ROOT_NAMES.includes(head) || (head === '.opencode' && rest[0] === 'specs')) return [sentinel];
  return SOURCE_ROOT_NAMES.map((name) => [name, ...rest].join('/'));
}

/**
 * Hoist above the outermost source-root segment in `dir`.
 *
 * @param {string} dir - Candidate directory.
 * @returns {string|null} The directory containing the outermost `.skilled` or
 *   `.opencode` segment, or null when `dir` is not inside a source tree.
 */
export function hoistAboveOpencodeTree(dir) {
  const parts = resolve(dir).split(sep);
  for (let index = 1; index < parts.length; index += 1) {
    if (SOURCE_ROOT_NAMES.includes(parts[index])) {
      return parts.slice(0, index).join(sep) || sep;
    }
  }
  return null;
}

/**
 * Find the nearest directory in `dir`'s path that a capped walk may have skipped
 * and that holds the sentinel.
 *
 * A walk capped below the root never reaches the sentinel, yet the root is still the
 * start itself or the parent of one source-root segment in the start path. Testing the
 * start, then those parents nearest first, as the walk would, keeps a repository that
 * sits under a directory named `.skilled` or `.opencode` instead of hoisting past it.
 *
 * @param {string} dir - Start directory.
 * @param {string[]} sentinels - Sentinel spellings to test.
 * @returns {string|null} The nearest such directory, or null when none holds the sentinel.
 */
function nearestSentinelHolder(dir, sentinels) {
  const holdsSentinel = (candidate) => sentinels.some((sentinel) => existsSync(resolve(candidate, sentinel)));
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
 * Resolve the repository root for a runtime writer.
 *
 * Walks up from `start` looking for the authored sentinel under either source-root
 * name. When the walk exhausts, the start or the parent of a source-root segment that
 * holds the sentinel is the root. Failing that, it falls back to hoisting above any source tree
 * so the caller can never be handed a root that would nest state inside one.
 *
 * @param {string} [start] - Directory to resolve from. Defaults to `process.cwd()`.
 * @param {{ maxDepth?: number, sentinel?: string }} [opts]
 * @returns {string} An absolute directory that is safe to write state under.
 */
export function findRepoRoot(start = process.cwd(), opts = {}) {
  const maxDepth = opts.maxDepth ?? DEFAULT_MAX_DEPTH;
  const sentinels = sentinelSpellings(opts.sentinel ?? REPO_ROOT_SENTINEL);
  let current = resolve(start);
  for (let index = 0; index < maxDepth; index += 1) {
    if (sentinels.some((sentinel) => existsSync(resolve(current, sentinel)))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return nearestSentinelHolder(start, sentinels) ?? hoistAboveOpencodeTree(start) ?? resolve(start);
}
