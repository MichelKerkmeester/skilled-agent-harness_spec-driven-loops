// ───────────────────────────────────────────────────────────────
// MODULE: Worktree restore
// ───────────────────────────────────────────────────────────────

// A turn hands its checkout back to whatever runs next, so these cases pin the
// three shapes a turn leaves behind: a staged edit, a staged new file and an
// untracked folder that all have to go back to HEAD, a path that was already
// dirty before the snapshot and must survive the restore, and a turn that changed
// nothing at all. The dirty-before case decides whether a restore can run beside
// another worker's edit, so it is the one that must never regress.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { restoreTurn, statusSnapshot } from '../scripts/routing-accuracy/worktree-restore.mjs';

function git(cwd: string, args: string[]): string {
  return execFileSync('git', ['-c', 'core.fsmonitor=false', ...args], { cwd, encoding: 'utf8' });
}

function makeRepository(): string {
  const root = mkdtempSync(join(tmpdir(), 'worktree-restore-'));
  git(root, ['init', '--quiet']);
  writeFileSync(join(root, 'kept.txt'), 'committed text\n');
  git(root, ['add', 'kept.txt']);
  git(root, [
    '-c',
    'user.name=fixture',
    '-c',
    'user.email=fixture@example.invalid',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  ]);
  return root;
}

describe('restoreTurn', () => {
  it('restores a staged edit, a staged new file and an untracked folder to HEAD', () => {
    const root = makeRepository();
    try {
      const before = statusSnapshot(root);
      writeFileSync(join(root, 'new.txt'), 'new\n');
      writeFileSync(join(root, 'kept.txt'), 'turn edit\n');
      mkdirSync(join(root, 'out'), { recursive: true });
      writeFileSync(join(root, 'out/a.txt'), 'out\n');
      git(root, ['add', 'new.txt', 'kept.txt']);

      const result = restoreTurn({ cwd: root, before });

      expect(result).toEqual({ restored: true, leftoverPaths: [], failures: [] });
      expect(statusSnapshot(root).size).toBe(0);
      expect(readFileSync(join(root, 'kept.txt'), 'utf8')).toBe('committed text\n');
      expect(existsSync(join(root, 'new.txt'))).toBe(false);
      expect(existsSync(join(root, 'out'))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('removes a file the turn created and never staged', () => {
    const root = makeRepository();
    try {
      const before = statusSnapshot(root);
      writeFileSync(join(root, 'stray.txt'), 'stray\n');

      const result = restoreTurn({ cwd: root, before });

      expect(result).toEqual({ restored: true, leftoverPaths: [], failures: [] });
      expect(existsSync(join(root, 'stray.txt'))).toBe(false);
      expect(statusSnapshot(root).size).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('leaves a path that was already dirty before the snapshot in place', () => {
    const root = makeRepository();
    try {
      writeFileSync(join(root, 'note.txt'), 'note\n');
      const before = statusSnapshot(root);
      git(root, ['add', 'note.txt']);

      const result = restoreTurn({ cwd: root, before });

      expect(result.restored).toBe(false);
      expect(result.leftoverPaths).toEqual(['note.txt']);
      expect(result.failures).toEqual([]);
      expect(existsSync(join(root, 'note.txt'))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('reports a turn that changed nothing as restored', () => {
    const root = makeRepository();
    try {
      const before = statusSnapshot(root);

      expect(restoreTurn({ cwd: root, before })).toEqual({
        restored: true,
        leftoverPaths: [],
        failures: [],
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
