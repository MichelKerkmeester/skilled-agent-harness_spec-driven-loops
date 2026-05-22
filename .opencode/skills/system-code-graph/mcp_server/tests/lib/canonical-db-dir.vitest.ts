import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

    expect(resolveCanonicalDbDir(aliasA)).toBe(resolveCanonicalDbDir(aliasB));
    expect(resolveCanonicalDbDir(aliasA)).toBe(resolveCanonicalDbDir(realDir));
  });

  it('creates a missing DB directory before canonicalization', () => {
    const root = tempRoot();
    const missingDir = join(root, 'missing', 'db');

    expect(resolveCanonicalDbDir(missingDir)).toBe(resolveCanonicalDbDir(missingDir));
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

    expect(() => resolveCanonicalDbDir(dbDir)).toThrow(CanonicalDbDirError);
    expect(realpathNative).toHaveBeenCalled();
  });
});
