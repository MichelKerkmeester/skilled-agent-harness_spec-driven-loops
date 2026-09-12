// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Lineage Path Resolution
// ───────────────────────────────────────────────────────────────────

// One lineage directory value used to answer three different questions at
// once: where the lane's prompt said to write, which tree its executor process
// was rooted in, and which tree containment, liveness polling and publication
// inspected. In the shared checkout those questions had a single answer, so one
// value could stand in for all three. A worktree breaks that coincidence: the
// lane writes inside its own tree, while finished artifacts must still land in
// the main checkout and containment has to watch the tree the lane can actually
// dirty. Answering one question with another question's value then fails
// quietly, because every path involved still looks plausible.
//
// This module resolves each question separately from the same two roots.
// Without a worktree the caller has not opted into isolation, so every value is
// the shared-checkout mapping that existed before this resolution did.

import { join } from 'node:path';

import type { ExecutorKind } from './executor-config.js';

// ─────────────────────────────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────────────────────────────

export interface ResolveLineagePathsInput {
  /** Executor kind, which decides how the process is pointed at its tree. */
  readonly kind: ExecutorKind;
  /** Main checkout. Published artifacts land under it. */
  readonly repoRoot: string;
  /** The lane's isolated checkout, or null to run in the shared checkout. */
  readonly worktreeDir: string | null;
  /** Repository-relative lineage directory within the tree the lane runs in. */
  readonly lineageDirName: string;
}

export interface LineageDirectoryFlag {
  /** Argument name the executor CLI expects for a directory override. */
  readonly flag: '--dir';
  /** Path the flag carries: the tree the lane runs in. */
  readonly value: string;
}

export interface ResolvedLineagePaths {
  /** Where the lane is told to write: its lineage directory in the write tree. */
  readonly writeSurface: string;
  /** Directory the executor process is spawned in. */
  readonly spawnCwd: string;
  /** Explicit directory argument for kinds that take one, null otherwise. */
  readonly directoryFlag: LineageDirectoryFlag | null;
  /** Read root for the kind that needs the tree added to its read scope. */
  readonly readRoot: string | null;
  /** Where finished artifacts belong: the lineage directory in the main checkout. */
  readonly publishTarget: string;
  /** Tree containment, liveness polling and publication inspect. */
  readonly containmentRoot: string;
}

/** How a kind is pointed at the tree its lineage runs in. */
type DirectoryLever = 'directory-flag' | 'read-root' | 'spawn-directory';

// ─────────────────────────────────────────────────────────────────────
// 2. EXECUTOR DIRECTORY LEVERS
// ─────────────────────────────────────────────────────────────────────

/**
 * Flag kinds carry the tree in an argument, so their spawn directory is only
 * the process's starting point and stays where it was. Spawn kinds have no
 * directory argument at all, so the working directory is the only lever and it
 * has to become the tree. Cursor's own workspace argument points at a neutral
 * hook and MCP config area, not the lineage tree, so the tree reaches cursor
 * through the read root it adds to its read scope.
 *
 * The record is exhaustive over executor kinds: adding one without classifying
 * it here is a compile error rather than a lane that silently runs in the
 * wrong tree.
 */
const DIRECTORY_LEVER_BY_KIND: Record<ExecutorKind, DirectoryLever> = {
  native: 'directory-flag',
  // Verified against the command builder rather than inferred: this kind's argv carries
  // a model, a permission mode and an output format, and no directory flag at all. Marked
  // as flag-bearing it would compute a value nobody applies, leaving the lane in the shared
  // checkout while every signal claimed it was isolated.
  'cli-claude-code': 'spawn-directory',
  'cli-opencode': 'directory-flag',
  'cli-cursor': 'read-root',
  'cli-codex': 'spawn-directory',
  'cli-devin': 'spawn-directory',
  'cli-pi': 'spawn-directory',
};

// ─────────────────────────────────────────────────────────────────────
// 3. RESOLUTION
// ─────────────────────────────────────────────────────────────────────

/**
 * Resolve the paths one lineage needs, keeping the write tree and the publish
 * tree apart.
 *
 * With a worktree, `writeSurface` and `containmentRoot` fall inside it while
 * `publishTarget` stays in the main checkout. Without one, both resolve to the
 * shared checkout and the result is the pre-isolation mapping a caller that
 * has not opted in already expects. No filesystem access happens here.
 *
 * @param input - Kind, repository root, optional worktree and lineage directory
 * @returns The lineage's write, spawn, directory-argument, read and publish paths
 */
export function resolveLineagePaths(input: ResolveLineagePathsInput): ResolvedLineagePaths {
  const { kind, repoRoot, worktreeDir, lineageDirName } = input;
  // The tree the lane runs in: its own worktree when it has one, otherwise the
  // shared checkout, which is the single tree that answered every question
  // before isolation existed.
  const treeRoot = worktreeDir ?? repoRoot;
  const lever = DIRECTORY_LEVER_BY_KIND[kind];

  return {
    writeSurface: join(treeRoot, lineageDirName),
    spawnCwd: lever === 'spawn-directory' ? treeRoot : repoRoot,
    directoryFlag: lever === 'directory-flag'
      ? { flag: '--dir', value: treeRoot }
      : null,
    readRoot: lever === 'read-root' ? treeRoot : null,
    publishTarget: join(repoRoot, lineageDirName),
    containmentRoot: treeRoot,
  };
}
