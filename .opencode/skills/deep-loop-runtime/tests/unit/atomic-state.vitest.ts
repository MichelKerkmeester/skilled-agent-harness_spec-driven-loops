import { afterEach, describe, expect, it } from 'vitest';

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { writeStateAtomic, writeStateIfChangedAtomic } from '../../lib/deep-loop/atomic-state.js';
import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs';

const hermeticEnvs: HermeticEnv[] = [];

function withHermeticState(testId: string, run: (statePath: string, tempDir: string) => void): void {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  run(join(hermetic.tmpDir, 'state.json'), hermetic.tmpDir);
}

/**
 * Returns temporary sibling files matching the atomic-state naming convention.
 */
function tempSiblings(path: string): string[] {
  const prefix = `${basename(path)}.tmp.`;
  return readdirSync(dirname(path)).filter((entry) => entry.startsWith(prefix));
}

afterEach(() => {
  while (hermeticEnvs.length > 0) {
    hermeticEnvs.pop()?.cleanup();
  }
});

describe('atomic-state', () => {
  it('writes JSON state through an atomic replacement path', () => {
    withHermeticState('atomic-write', (statePath) => {
      writeStateAtomic(statePath, { status: 'started', iteration: 1 });

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'started', iteration: 1 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('replaces an existing state file without leaving torn JSON', () => {
    withHermeticState('atomic-replace', (statePath) => {
      writeStateAtomic(statePath, { status: 'old', iteration: 1 });
      writeStateAtomic(statePath, { status: 'new', iteration: 2 });

      const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
      expect(parsed).toEqual({ status: 'new', iteration: 2 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('cleans up the temp file when rename cannot replace a directory target', () => {
    withHermeticState('atomic-cleanup', (statePath) => {
      mkdirSync(statePath);

      expect(() => writeStateAtomic(statePath, { status: 'new' })).toThrow();
      expect(existsSync(statePath)).toBe(true);
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('writes state only when the serialized payload changes', () => {
    withHermeticState('atomic-if-changed', (statePath) => {
      const cache = new Map<string, string>();

      const firstWrite = writeStateIfChangedAtomic(statePath, { status: 'started', iteration: 1 }, cache);
      const firstMtime = statSync(statePath).mtimeMs;

      expect(firstWrite).toBe(true);
      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'started', iteration: 1 });

      const secondWrite = writeStateIfChangedAtomic(statePath, { status: 'started', iteration: 1 }, cache);
      const secondMtime = statSync(statePath).mtimeMs;

      expect(secondWrite).toBe(false);
      expect(secondMtime).toBe(firstMtime);

      const thirdWrite = writeStateIfChangedAtomic(statePath, { status: 'finished', iteration: 2 }, cache);

      expect(thirdWrite).toBe(true);
      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'finished', iteration: 2 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });
});
