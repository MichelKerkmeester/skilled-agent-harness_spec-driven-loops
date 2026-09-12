import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EXECUTOR_KINDS } from '../../lib/deep-loop/executor-config.js';
import { resolveLineagePaths } from '../../lib/deep-loop/worktree-paths.js';
import type { ExecutorKind } from '../../lib/deep-loop/executor-config.js';

const REPO_ROOT = '/repo/main-checkout';
const WORKTREE_DIR = '/repo/worktrees/lineage-alpha';
const LINEAGE_DIR_NAME = 'run-artifacts/research/lineages/lineage-alpha';

const FLAG_KINDS: readonly ExecutorKind[] = ['native', 'cli-opencode'];
const SPAWN_KINDS: readonly ExecutorKind[] = ['cli-claude-code', 'cli-codex', 'cli-devin', 'cli-pi'];
const CURSOR_KIND: ExecutorKind = 'cli-cursor';

function resolvePaths(kind: ExecutorKind, worktreeDir: string | null) {
  return resolveLineagePaths({
    kind,
    repoRoot: REPO_ROOT,
    worktreeDir,
    lineageDirName: LINEAGE_DIR_NAME,
  });
}

describe('resolveLineagePaths without a worktree', () => {
  it.each([...EXECUTOR_KINDS])(
    '%s keeps the write surface and the publish target on the shared checkout',
    (kind) => {
      const paths = resolvePaths(kind, null);
      expect(paths.writeSurface).toBe(join(REPO_ROOT, LINEAGE_DIR_NAME));
      expect(paths.publishTarget).toBe(paths.writeSurface);
      expect(paths.containmentRoot).toBe(REPO_ROOT);
      expect(paths.spawnCwd).toBe(REPO_ROOT);
    },
  );

  it.each([...FLAG_KINDS])('%s still carries the shared checkout in its --dir flag', (kind) => {
    expect(resolvePaths(kind, null).directoryFlag).toEqual({ flag: '--dir', value: REPO_ROOT });
  });

  it.each([...SPAWN_KINDS, CURSOR_KIND])('%s has no --dir flag to rewrite', (kind) => {
    expect(resolvePaths(kind, null).directoryFlag).toBeNull();
  });

  it.each([...SPAWN_KINDS])('%s reads no extra root', (kind) => {
    expect(resolvePaths(kind, null).readRoot).toBeNull();
  });

  it('cli-cursor reads the shared checkout', () => {
    expect(resolvePaths(CURSOR_KIND, null).readRoot).toBe(REPO_ROOT);
  });
});

describe('resolveLineagePaths with a worktree', () => {
  it.each([...EXECUTOR_KINDS])(
    '%s writes and contains inside the worktree but publishes to the main checkout',
    (kind) => {
      const paths = resolvePaths(kind, WORKTREE_DIR);
      expect(paths.writeSurface).toBe(join(WORKTREE_DIR, LINEAGE_DIR_NAME));
      expect(paths.publishTarget).toBe(join(REPO_ROOT, LINEAGE_DIR_NAME));
      expect(paths.writeSurface).not.toBe(paths.publishTarget);
      expect(paths.containmentRoot).toBe(WORKTREE_DIR);
    },
  );

  it.each([...SPAWN_KINDS])('%s spawns in the worktree, its only directory lever', (kind) => {
    const paths = resolvePaths(kind, WORKTREE_DIR);
    expect(paths.directoryFlag).toBeNull();
    expect(paths.spawnCwd).toBe(WORKTREE_DIR);
  });

  it.each([...FLAG_KINDS])('%s keeps its spawn directory and rewrites the flag', (kind) => {
    const paths = resolvePaths(kind, WORKTREE_DIR);
    expect(paths.spawnCwd).toBe(REPO_ROOT);
    expect(paths.directoryFlag).toEqual({ flag: '--dir', value: WORKTREE_DIR });
  });

  it('cli-cursor keeps its spawn directory and rewrites its read root', () => {
    const paths = resolvePaths(CURSOR_KIND, WORKTREE_DIR);
    expect(paths.spawnCwd).toBe(REPO_ROOT);
    expect(paths.directoryFlag).toBeNull();
    expect(paths.readRoot).toBe(WORKTREE_DIR);
  });
});

describe('executor kind coverage', () => {
  it('classifies every executor kind', () => {
    const covered = [...FLAG_KINDS, ...SPAWN_KINDS, CURSOR_KIND].sort();
    expect(covered).toEqual([...EXECUTOR_KINDS].sort());
  });
});
