// ───────────────────────────────────────────────────────────────────
// MODULE: Isolated Worktree Fixture
// ───────────────────────────────────────────────────────────────────

import {
  closeSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

export interface IsolatedWorktreeFixture {
  readonly root: string;
  readonly repository: string;
  readonly worktrees: readonly [string, string];
  cleanup(): void;
}

function runGit(cwd: string, args: readonly string[]): void {
  const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd,
    encoding: 'utf8',
    timeout: 3_000,
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
}

export function isPathInside(childPath: string, parentPath: string): boolean {
  const canonicalChild = realpathSync(resolve(childPath));
  const canonicalParent = realpathSync(resolve(parentPath));
  const rel = relative(canonicalParent, canonicalChild);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

export function createIsolatedWorktrees(): IsolatedWorktreeFixture {
  const root = mkdtempSync(join(tmpdir(), 'cli-adapter-worktrees-'));
  const repository = join(root, 'repository');
  const first = join(root, 'worktree-a');
  const second = join(root, 'worktree-b');
  mkdirSync(repository, { recursive: true });
  runGit(repository, ['init', '--initial-branch=main']);
  runGit(repository, ['config', 'user.email', 'fixture@example.invalid']);
  runGit(repository, ['config', 'user.name', 'Fixture']);
  writeFileSync(join(repository, 'fixture.txt'), 'fixture\n', 'utf8');
  runGit(repository, ['add', 'fixture.txt']);
  runGit(repository, ['commit', '-m', 'fixture']);
  runGit(repository, ['worktree', 'add', '--detach', first, 'HEAD']);
  runGit(repository, ['worktree', 'add', '--detach', second, 'HEAD']);
  mkdirSync(join(first, 'node_modules'), { recursive: true });
  mkdirSync(join(second, 'node_modules'), { recursive: true });

  return {
    root,
    repository,
    worktrees: [first, second],
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

export function claimOwnership(claimPath: string, owner: string): void {
  const descriptor = openSync(claimPath, 'wx', 0o600);
  try {
    writeFileSync(descriptor, owner, 'utf8');
  } finally {
    closeSync(descriptor);
  }
}

export function nodeModulesRealpaths(
  worktrees: readonly [string, string],
): readonly [string, string] {
  return [
    realpathSync(join(worktrees[0], 'node_modules')),
    realpathSync(join(worktrees[1], 'node_modules')),
  ];
}
