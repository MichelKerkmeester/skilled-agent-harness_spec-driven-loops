// TEST: shared write-boundary containment
//
// Covers the one helper every CLI write boundary relies on: a target inside
// the root passes even when it does not exist yet, a lexical escape fails, an
// absolute path outside fails, and a symlinked parent inside the root that
// points outside fails because the existing prefix is canonicalized.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { assertPathInsideRoot, isPathInsideRoot } from '../utils/path-utils';

const roots: string[] = [];

function makeRoot(): string {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'path-containment-')));
  roots.push(root);
  return root;
}

afterEach(() => {
  while (roots.length > 0) {
    fs.rmSync(roots.pop() as string, { recursive: true, force: true });
  }
});

describe('write-boundary containment', () => {
  it('accepts a not-yet-existing target inside the root and returns its resolved path', () => {
    const root = makeRoot();
    expect(assertPathInsideRoot(root, 'notes/out.md')).toBe(path.join(root, 'notes', 'out.md'));
    expect(isPathInsideRoot(root, root)).toBe(true);
  });

  it('rejects a lexical escape and an absolute path outside the root', () => {
    const root = makeRoot();
    const outside = makeRoot();
    expect(() => assertPathInsideRoot(root, '../escape.md', '--output')).toThrow(/--output must resolve inside/);
    expect(() => assertPathInsideRoot(root, path.join(outside, 'x.md'))).toThrow(/must resolve inside/);
  });

  it('rejects a symlinked parent inside the root that points outside it', () => {
    const root = makeRoot();
    const target = makeRoot();
    fs.symlinkSync(target, path.join(root, 'linked'));
    expect(isPathInsideRoot(root, path.join(root, 'linked', 'out.md'))).toBe(false);
    expect(() => assertPathInsideRoot(root, 'linked/out.md')).toThrow(/must resolve inside/);
  });

  it('accepts a symlinked parent that stays inside the root', () => {
    const root = makeRoot();
    fs.mkdirSync(path.join(root, 'real'));
    fs.symlinkSync(path.join(root, 'real'), path.join(root, 'alias'));
    expect(isPathInsideRoot(root, path.join(root, 'alias', 'out.md'))).toBe(true);
  });
});
