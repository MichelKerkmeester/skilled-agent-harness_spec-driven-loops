// ───────────────────────────────────────────────────────────────
// MODULE: Worktree restore
// ───────────────────────────────────────────────────────────────
//
// A measured turn runs inside a checkout someone else may be working in, so the
// runner has to put back exactly what the turn changed and nothing else. The
// snapshot is the baseline: any path that was already dirty when the turn began
// belongs to an earlier edit and is never touched, even when the turn adds that
// path to the index on top of the edit.
//
// Restoring from the index is not enough. A staged new file is in the index, so
// restoring from the index keeps it, while only HEAD is the state the turn
// started from. A path HEAD knows is checked out from HEAD, and a path HEAD does
// not know is dropped from the index and deleted from the worktree. A second
// snapshot after the restore reports what is still different, so the caller can
// fail the run instead of claiming a clean worktree.

import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

// A filesystem monitor that decides a path is unchanged makes a status snapshot
// lie, and the restore trusts that snapshot.
const GIT_PREFIX = ['-c', 'core.fsmonitor=false'];

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_PREFIX, ...args], { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
}

function trimTrailingSlash(path) {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Read the working tree state of one checkout.
 *
 * Porcelain names each path relative to the checkout, and a rename names both
 * the old and the new path. Both sides are separate keys because both have to
 * be restored.
 *
 * @param {string} cwd - Root of the checkout to read.
 * @returns {Map<string, string>} Path to its two-letter status code.
 */
export function statusSnapshot(cwd) {
  const result = git(cwd, ['status', '--porcelain']);
  if (result.status !== 0) {
    throw new Error(`git status --porcelain failed: ${(result.stderr ?? '').trim()}`);
  }
  const paths = new Map();
  for (const line of result.stdout.split('\n')) {
    if (line.length < 4) continue;
    for (const path of line.slice(3).split(' -> ')) {
      paths.set(path, line.slice(0, 2));
    }
  }
  return paths;
}

// A staged new file is in the index, so restoring from the index would keep it.
// Only HEAD is the state the turn started from, so a path without a HEAD entry
// loses its index entry as well as its file.
function restorePath(cwd, path) {
  const failures = [];
  const inHead = git(cwd, ['cat-file', '-e', `HEAD:${path}`]);
  if (inHead.status === 0) {
    const checkout = git(cwd, ['checkout', 'HEAD', '--', path]);
    if (checkout.status !== 0) {
      failures.push(`checkout ${path}: ${(checkout.stderr ?? '').trim()}`);
    }
    return failures;
  }
  const dropped = git(cwd, ['rm', '-r', '-q', '--cached', '--ignore-unmatch', '--', path]);
  if (dropped.status !== 0) {
    failures.push(`rm --cached ${path}: ${(dropped.stderr ?? '').trim()}`);
  }
  try {
    rmSync(resolve(cwd, path), { recursive: true, force: true });
  } catch (error) {
    failures.push(`delete ${path}: ${error.message}`);
  }
  return failures;
}

/**
 * Put every path the turn changed back to the state its HEAD held.
 *
 * A path that was already present before the turn is never passed to git or
 * deleted, because the turn did not put it there.
 *
 * @param {object} options
 * @param {string} options.cwd - Root of the checkout to restore.
 * @param {Map<string, string>} options.before - Snapshot taken before the turn.
 * @returns {{ restored: boolean, leftoverPaths: string[], failures: string[] }}
 */
export function restoreTurn({ cwd, before }) {
  const after = statusSnapshot(cwd);
  const changed = [...after.keys()]
    .filter((path) => after.get(path) !== before.get(path) && !before.has(path))
    .sort();
  const failures = [];
  for (const raw of changed) {
    const path = trimTrailingSlash(raw);
    // A path the turn inherited is not the turn's to restore.
    if (before.has(path)) continue;
    try {
      failures.push(...restorePath(cwd, path));
    } catch (error) {
      failures.push(`restore ${path}: ${error.message}`);
    }
  }
  const final = statusSnapshot(cwd);
  const leftoverPaths = [...new Set([...before.keys(), ...final.keys()])]
    .filter((path) => final.get(path) !== before.get(path))
    .sort();
  return {
    restored: leftoverPaths.length === 0 && failures.length === 0,
    leftoverPaths,
    failures,
  };
}
