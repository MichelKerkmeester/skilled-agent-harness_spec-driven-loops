import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CanonicalDbDirError, resolveCanonicalDbDir } from '../../lib/canonical-db-dir.js';

const tempDirs: string[] = [];

function tempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cg-canonical-db-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('resolveCanonicalDbDir', () => {
  it('collapses symlink aliases to the same effective DB directory', () => {
    const root = tempRoot();
    const realDir = join(root, 'real-db');
    const aliasA = join(root, 'alias-a');
    const aliasB = join(root, 'alias-b');
    mkdirSync(realDir, { recursive: true });
    symlinkSync(realDir, aliasA, 'dir');
    symlinkSync(realDir, aliasB, 'dir');

    expect(resolveCanonicalDbDir(aliasA, root)).toBe(resolveCanonicalDbDir(aliasB, root));
    expect(resolveCanonicalDbDir(aliasA, root)).toBe(resolveCanonicalDbDir(realDir, root));
  });

  it('creates a missing DB directory before canonicalization', () => {
    const root = tempRoot();
    const missingDir = join(root, 'missing', 'db');

    expect(resolveCanonicalDbDir(missingDir, root)).toBe(resolveCanonicalDbDir(missingDir, root));
  });

  it('rejects DB directories outside the workspace root', () => {
    const root = tempRoot();
    const outside = mkdtempSync(join(tmpdir(), 'cg-outside-db-'));
    tempDirs.push(outside);

    expect(() => resolveCanonicalDbDir(outside, root)).toThrow(CanonicalDbDirError);
  });

  it('rejects symlink escapes after canonicalization', () => {
    const root = tempRoot();
    const outside = mkdtempSync(join(tmpdir(), 'cg-outside-db-'));
    tempDirs.push(outside);
    const alias = join(root, 'db-link');
    symlinkSync(outside, alias, 'dir');

    expect(() => resolveCanonicalDbDir(alias, root)).toThrow(CanonicalDbDirError);
    expect(resolve(alias).startsWith(root)).toBe(true);
  });

  it('DR-003-02: rejects a symlink escape BEFORE creating any directory outside the workspace', () => {
    const root = tempRoot();
    const outside = mkdtempSync(join(tmpdir(), 'cg-outside-db-'));
    tempDirs.push(outside);
    // A symlink inside the workspace points outside; the requested DB leaf does not exist yet.
    const alias = join(root, 'escape-link');
    symlinkSync(outside, alias, 'dir');
    const requested = join(alias, 'code-graph', 'database');

    expect(() => resolveCanonicalDbDir(requested, root)).toThrow(CanonicalDbDirError);
    // The fix rejects on the deepest existing ancestor BEFORE mkdir, so the leaf dirs must NOT
    // have been created under the real outside target (the pre-fix code mkdir'd then rejected).
    expect(existsSync(join(outside, 'code-graph', 'database'))).toBe(false);
    expect(existsSync(join(outside, 'code-graph'))).toBe(false);
  });

  it('surfaces EPERM canonicalization failures instead of guessing identity', async () => {
    const root = tempRoot();
    const dbDir = join(root, 'db');
    mkdirSync(dbDir, { recursive: true });
    const fs = await import('node:fs');
    const realpathNative = vi.spyOn(fs.realpathSync, 'native').mockImplementation(() => {
      const error = new Error('permission denied') as NodeJS.ErrnoException;
      error.code = 'EPERM';
      throw error;
    });

    expect(() => resolveCanonicalDbDir(dbDir, root)).toThrow(CanonicalDbDirError);
    expect(realpathNative).toHaveBeenCalled();
  });
});
