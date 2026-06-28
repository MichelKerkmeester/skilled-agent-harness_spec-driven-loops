import { afterEach, describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const nodeRequire = createRequire(import.meta.url);

const RUNTIME_MODULE = '../../lib/deep-loop/runtime-capabilities.cjs';
const DR_SHIM = '../../../deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs';
const DRV_SHIM = '../../../deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs';

const { createRuntimeCapabilities } = nodeRequire(RUNTIME_MODULE) as {
  createRuntimeCapabilities: (opts: { label: string; defaultCapabilityPath: string }) => {
    DEFAULT_CAPABILITY_PATH: string;
    loadRuntimeCapabilities: (p?: string) => { capabilityPath: string; matrix: { stopPolicy: string; runtimes: Array<{ id: string }> } };
    listRuntimeCapabilityIds: (p?: string) => string[];
    resolveRuntimeCapability: (id: string, p?: string) => { capabilityPath: string; runtime: { id: string } };
  };
};

const tempDirs: string[] = [];

function writeMatrix(runtimes: Array<Record<string, unknown>>): string {
  return writeRawMatrix({ stopPolicy: 'fail-closed', runtimes });
}

function writeRawMatrix(matrix: Record<string, unknown>): string {
  const dir = mkdtempSync(join(tmpdir(), 'runtime-cap-'));
  tempDirs.push(dir);
  const matrixPath = join(dir, 'runtime_capabilities.json');
  writeFileSync(matrixPath, JSON.stringify(matrix), 'utf8');
  return matrixPath;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('runtime-capabilities factory (promoted backend)', () => {
  it('requires a label and a default capability path', () => {
    expect(() => createRuntimeCapabilities({ label: '', defaultCapabilityPath: '/x' })).toThrow(/label/);
    expect(() => createRuntimeCapabilities({ label: 'deep-x', defaultCapabilityPath: '' })).toThrow(/defaultCapabilityPath/);
  });

  it('lists runtime ids and resolves a record against the bound default path', () => {
    const matrixPath = writeMatrix([{ id: 'alpha', kind: 'a' }, { id: 'beta', kind: 'b' }]);
    const api = createRuntimeCapabilities({ label: 'deep-x', defaultCapabilityPath: matrixPath });

    expect(api.listRuntimeCapabilityIds()).toEqual(['alpha', 'beta']);
    expect(api.resolveRuntimeCapability('beta')).toEqual({
      capabilityPath: resolve(matrixPath),
      runtime: { id: 'beta', kind: 'b' },
    });
    expect(api.loadRuntimeCapabilities().capabilityPath).toBe(resolve(matrixPath));
  });

  it('uses the bound label verbatim in the not-found error', () => {
    const matrixPath = writeMatrix([{ id: 'alpha' }]);
    const api = createRuntimeCapabilities({ label: 'deep-research', defaultCapabilityPath: matrixPath });
    expect(() => api.resolveRuntimeCapability('ghost')).toThrow(
      `Unknown deep-research runtime "ghost". Known runtimes: alpha. Matrix: ${resolve(matrixPath)}`,
    );
  });

  it('throws on a malformed matrix that is missing the runtimes array', () => {
    const matrixPath = writeRawMatrix({ stopPolicy: 'fail-closed', notRuntimes: [] });
    const api = createRuntimeCapabilities({ label: 'deep-x', defaultCapabilityPath: matrixPath });
    expect(() => api.listRuntimeCapabilityIds()).toThrow(/missing runtimes array/);
  });

  it('rejects a matrix that does not declare a fail-closed stop policy', () => {
    const matrixPath = writeRawMatrix({ runtimes: [{ id: 'alpha' }] });
    const api = createRuntimeCapabilities({ label: 'deep-x', defaultCapabilityPath: matrixPath });
    expect(() => api.loadRuntimeCapabilities()).toThrow(/missing stopPolicy/);
  });

  it('rejects a matrix that declares an unsupported stop policy', () => {
    const matrixPath = writeRawMatrix({ stopPolicy: 'fail-open', runtimes: [{ id: 'alpha' }] });
    const api = createRuntimeCapabilities({ label: 'deep-x', defaultCapabilityPath: matrixPath });
    expect(() => api.loadRuntimeCapabilities()).toThrow(/stopPolicy must be "fail-closed"/);
  });
});

describe('per-skill shims stay byte-compatible', () => {
  const dr = nodeRequire(DR_SHIM) as Record<string, unknown> & {
    DEFAULT_CAPABILITY_PATH: string;
    listRuntimeCapabilityIds: () => string[];
    resolveRuntimeCapability: (id: string) => { runtime: { id: string } };
  };
  const drv = nodeRequire(DRV_SHIM) as typeof dr;

  it('expose the same module surface as before the promotion', () => {
    const expected = ['DEFAULT_CAPABILITY_PATH', 'listRuntimeCapabilityIds', 'loadRuntimeCapabilities', 'resolveRuntimeCapability'];
    expect(Object.keys(dr).sort()).toEqual(expected);
    expect(Object.keys(drv).sort()).toEqual(expected);
  });

  it('point DEFAULT_CAPABILITY_PATH at each skill assets dir', () => {
    expect(dr.DEFAULT_CAPABILITY_PATH.endsWith('deep-loop-workflows/deep-research/assets/runtime_capabilities.json')).toBe(true);
    expect(drv.DEFAULT_CAPABILITY_PATH.endsWith('deep-loop-workflows/deep-review/assets/runtime_capabilities.json')).toBe(true);
  });

  it('preserve the frozen baseline runtime id set', () => {
    expect(dr.listRuntimeCapabilityIds()).toEqual(['opencode', 'claude', 'codex']);
    expect(drv.listRuntimeCapabilityIds()).toEqual(['opencode', 'claude', 'codex']);
  });

  it('keep per-skill labels in the not-found error', () => {
    expect(() => dr.resolveRuntimeCapability('ghost')).toThrow(/Unknown deep-research runtime "ghost"/);
    expect(() => drv.resolveRuntimeCapability('ghost')).toThrow(/Unknown deep-review runtime "ghost"/);
  });

  it('resolve a known runtime record', () => {
    expect(dr.resolveRuntimeCapability('opencode').runtime.id).toBe('opencode');
    expect(drv.resolveRuntimeCapability('codex').runtime.id).toBe('codex');
  });
});
