// ───────────────────────────────────────────────────────────────────
// MODULE: Host Trigger Index Location
// ───────────────────────────────────────────────────────────────────
// Skilled is both a repository of its own and a dependency a host repository
// vendors: the host keeps a copy of the source tree under `.skilled` and its own
// spec packets under `<host>/specs`. The packaged trigger index describes the
// framework's documents only, so a lookup run from a host would answer every
// question from the wrong corpus, and a generation run there would publish the
// host's corpus over the packaged artifact.
//
// The two roots are distinguishable without configuration. This checkout holds
// a real `.skilled` directory directly under its own root. A host either keeps
// its index at `.speckit-index/`, or points `.skilled` at a tree that lives
// outside itself — a symlink into an installed copy, or a vendored tree placed
// elsewhere. Neither signal can be produced by accident inside the framework
// checkout, so a bare invocation can select the host corpus and index safely.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Location of a host repository's own index, relative to its root. */
export const HOST_INDEX_RELATIVE = '.speckit-index/trigger-index.json';

// ───────────────────────────────────────────────────────────────────
// 2. ROOT RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Asks git for the root of the checkout the caller is working in.
 *
 * Deliberately a subprocess rather than a walk for a `.git` entry: a linked
 * worktree carries `.git` as a file, and `spawnSync` without a shell keeps a
 * path containing spaces intact. A missing git, a directory outside any
 * checkout and any other git failure all report null, because a caller that
 * cannot name its own repository must fall back to the packaged default
 * rather than guess one.
 *
 * @param {string} [cwd] Directory the caller works in.
 * @returns {string|null} Absolute caller repository root, or null.
 */
export function callerRepoRoot(cwd = process.cwd()) {
  const run = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  if (run.error !== undefined || run.status !== 0) return null;
  const root = run.stdout.trim();
  return root.length > 0 ? root : null;
}

/**
 * Returns whether a root is a host repository that vendors Skilled.
 *
 * Two signals count, and both are absent from this checkout:
 *
 *   - the root carries its own index directory, so it has already opted in;
 *   - the source tree at `<root>/.skilled` resolves to a directory whose parent
 *     is not the root itself, which is what a vendored or symlinked install
 *     looks like while a real `.skilled` directory in the framework checkout
 *     resolves inside its own root.
 *
 * A root with no `.skilled` at all is not a host: it carries no source tree to
 * walk, so indexing it would fail closed anyway.
 *
 * @param {string} root Absolute or resolvable repository root.
 * @returns {boolean} True when the root keeps a corpus outside the framework tree.
 */
export function isHostRepository(root) {
  const absolute = path.resolve(root);
  if (isDirectory(path.join(absolute, '.speckit-index'))) return true;

  let sourceTree;
  try {
    sourceTree = fs.realpathSync(path.join(absolute, '.skilled'));
  } catch {
    return false;
  }

  let rootReal;
  try {
    rootReal = fs.realpathSync(absolute);
  } catch {
    rootReal = absolute;
  }
  return path.dirname(sourceTree) !== rootReal;
}

/**
 * Resolves where a host repository keeps its own index.
 *
 * @param {string} root Host repository root.
 * @returns {string} Absolute index path under the root.
 */
export function hostIndexPath(root) {
  return path.resolve(root, HOST_INDEX_RELATIVE);
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string} candidate Absolute path.
 * @returns {boolean} True when the path is an existing directory.
 */
function isDirectory(candidate) {
  try {
    return fs.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}
