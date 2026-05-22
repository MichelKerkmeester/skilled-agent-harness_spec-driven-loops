import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { writeStateAtomic } from '../../lib/deep-loop/atomic-state.js';

function withTempState(run: (statePath: string, tempDir: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'atomic-state-'));
  try {
    run(join(tempDir, 'state.json'), tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function tempSiblings(path: string): string[] {
  const prefix = `${basename(path)}.tmp.`;
  return readdirSync(dirname(path)).filter((entry) => entry.startsWith(prefix));
}

describe('atomic-state', () => {
  it('writes JSON state through an atomic replacement path', () => {
    withTempState((statePath) => {
      writeStateAtomic(statePath, { status: 'started', iteration: 1 });

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'started', iteration: 1 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('replaces an existing state file without leaving torn JSON', () => {
    withTempState((statePath) => {
      writeStateAtomic(statePath, { status: 'old', iteration: 1 });
      writeStateAtomic(statePath, { status: 'new', iteration: 2 });

      const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
      expect(parsed).toEqual({ status: 'new', iteration: 2 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('cleans up the temp file when rename cannot replace a directory target', () => {
    withTempState((statePath) => {
      mkdirSync(statePath);

      expect(() => writeStateAtomic(statePath, { status: 'new' })).toThrow();
      expect(existsSync(statePath)).toBe(true);
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });
});
