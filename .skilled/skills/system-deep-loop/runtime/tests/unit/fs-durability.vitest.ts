// ───────────────────────────────────────────────────────────────────
// MODULE: FS Durability Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { fsyncPath, makeTempPath } from '../../lib/deep-loop/fs-durability';

const roots: string[] = [];

function makeRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'fs-durability-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('fs-durability', () => {
  it('fsyncs an existing file and its parent directory', () => {
    const file = join(makeRoot(), 'state.json');
    writeFileSync(file, '{}');

    expect(() => fsyncPath(file)).not.toThrow();
    expect(() => fsyncPath(dirname(file))).not.toThrow();
  });

  it('throws on a missing path instead of swallowing the error', () => {
    const missing = join(makeRoot(), 'absent.json');

    expect(() => fsyncPath(missing)).toThrow(/ENOENT/);
  });

  it('builds distinct sibling temp paths that carry the pid', () => {
    const target = join(makeRoot(), 'state.json');
    const first = makeTempPath(target);
    const second = makeTempPath(target);

    expect(first.startsWith(`${target}.tmp.${process.pid}.`)).toBe(true);
    expect(dirname(first)).toBe(dirname(target));
    expect(first).not.toBe(second);
  });
});
