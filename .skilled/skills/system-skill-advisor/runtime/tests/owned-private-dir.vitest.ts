// ───────────────────────────────────────────────────────────────────
// MODULE: Owned Private Directory Tests
// ───────────────────────────────────────────────────────────────────

// 1. IMPORTS

import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { isOwnedPrivateDir } from '../lib/owned-private-dir.js';

// 2. TEST FIXTURES

const tempRoots: string[] = [];

function createTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'owned-private-dir-'));
  tempRoots.push(root);
  return root;
}

function createPrivateDirectory(): string {
  const directory = join(createTempRoot(), 'private');
  mkdirSync(directory, { mode: 0o700 });
  return directory;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// 3. TESTS

describe('isOwnedPrivateDir', () => {
  it('accepts an owned directory with private permissions', () => {
    expect(isOwnedPrivateDir(createPrivateDirectory())).toBe(true);
  });

  it.skipIf(typeof process.getuid !== 'function')('rejects a directory owned by another user', () => {
    const getuid = process.getuid;
    if (typeof getuid !== 'function') throw new Error('process.getuid is unavailable');
    vi.spyOn(process, 'getuid').mockReturnValue(getuid() + 1);

    expect(isOwnedPrivateDir(createPrivateDirectory())).toBe(false);
  });

  it('rejects a symbolic link to a private directory', () => {
    const target = createPrivateDirectory();
    const link = join(createTempRoot(), 'private-link');
    symlinkSync(target, link);

    expect(isOwnedPrivateDir(link)).toBe(false);
  });

  it('rejects permission bits selected by the caller', () => {
    const directory = createPrivateDirectory();
    chmodSync(directory, 0o775);

    expect(isOwnedPrivateDir(directory)).toBe(false);
    expect(isOwnedPrivateDir(directory, 0o022)).toBe(false);
  });

  it('rejects a path that is not a directory', () => {
    const file = join(createTempRoot(), 'file');
    writeFileSync(file, '');

    expect(isOwnedPrivateDir(file)).toBe(false);
  });

  it('ignores POSIX mode bits on win32, where Node reports every directory as 0o40777', () => {
    const directory = createTempRoot();
    chmodSync(directory, 0o777);
    const platform = Object.getOwnPropertyDescriptor(process, 'platform');
    Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });

    try {
      expect(isOwnedPrivateDir(directory)).toBe(true);
    } finally {
      if (platform) Object.defineProperty(process, 'platform', platform);
    }
  });

  it('lets lstat errors reach the caller', () => {
    const missing = join(createTempRoot(), 'missing');

    expect(() => isOwnedPrivateDir(missing)).toThrow(/ENOENT/);
  });
});
