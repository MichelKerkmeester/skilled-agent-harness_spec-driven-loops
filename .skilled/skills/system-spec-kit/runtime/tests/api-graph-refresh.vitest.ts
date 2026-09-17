// ───────────────────────────────────────────────────────────────────
// TEST: API Graph Refresh Resolver
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { resolveSpecFolderPath } from '../api/graph-refresh.js';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('resolveSpecFolderPath', () => {
  it('returns an existing absolute folder unchanged', () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-refresh-'));
    tempDirs.push(folder);
    expect(resolveSpecFolderPath(folder)).toBe(folder);
  });

  it('throws a named error when no candidate resolves', () => {
    const missing = path.join(os.tmpdir(), `graph-refresh-missing-${process.pid}`);
    expect(() => resolveSpecFolderPath(missing)).toThrow(/Unable to resolve spec folder path/);
  });
});
