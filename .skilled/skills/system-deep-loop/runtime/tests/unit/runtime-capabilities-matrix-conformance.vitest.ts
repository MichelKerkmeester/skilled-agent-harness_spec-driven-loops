// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Capabilities Matrix Conformance
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const nodeRequire = createRequire(import.meta.url);

// The centralized resolver is the contract every graph-backed mode's matrix must
// honor to be consumable via a per-skill shim. Research and review both ship the
// array schema the resolver reads, and this guard drives each matrix through the
// resolver so a silent per-mode schema change fails CI.
const RUNTIME_MODULE = '../../lib/deep-loop/runtime-capabilities.cjs';
const { createRuntimeCapabilities } = nodeRequire(RUNTIME_MODULE) as {
  createRuntimeCapabilities: (opts: { label: string; defaultCapabilityPath: string }) => {
    loadRuntimeCapabilities: (p?: string) => { capabilityPath: string; matrix: { stopPolicy: string; runtimes: Array<{ id: string }> } };
    listRuntimeCapabilityIds: (p?: string) => string[];
    resolveRuntimeCapability: (id: string, p?: string) => { capabilityPath: string; runtime: { id: string } };
  };
};

const WORKFLOWS = resolve(__dirname, '..', '..', '..');

const RESOLVER_CONFORMANT = [
  {
    label: 'deep-research',
    path: resolve(WORKFLOWS, 'deep-research', 'assets', 'runtime-capabilities.json'),
    expectedRuntimeIds: ['opencode', 'claude'],
  },
  {
    label: 'deep-review',
    path: resolve(WORKFLOWS, 'deep-review', 'assets', 'runtime-capabilities.json'),
    expectedRuntimeIds: ['opencode', 'claude', 'codex'],
  },
];

// Every graph-backed mode mirrors the same supported runtime targets, so a matrix
// that drops one (or grows an unannounced one) is per-mode drift.
describe('runtime_capabilities matrix conformance (resolver-driven)', () => {
  it('every conformant matrix file exists on disk', () => {
    for (const { path } of RESOLVER_CONFORMANT) {
      expect(existsSync(path), `${path} missing`).toBe(true);
    }
  });

  describe.each(RESOLVER_CONFORMANT)('$label matrix', ({ label, path, expectedRuntimeIds }) => {
    const api = createRuntimeCapabilities({ label, defaultCapabilityPath: path });

    it('loads through the resolver with an array runtimes shape', () => {
      const { matrix } = api.loadRuntimeCapabilities();
      expect(matrix.stopPolicy).toBe('fail-closed');
      expect(Array.isArray(matrix.runtimes)).toBe(true);
    });

    it('exposes exactly the expected runtime id set', () => {
      expect([...api.listRuntimeCapabilityIds()].sort()).toEqual([...expectedRuntimeIds].sort());
    });

    it('resolves every declared runtime to a record carrying its own id', () => {
      for (const id of api.listRuntimeCapabilityIds()) {
        const { runtime } = api.resolveRuntimeCapability(id);
        expect(runtime.id).toBe(id);
      }
    });

    it('rejects an unknown runtime with the bound per-skill label', () => {
      expect(() => api.resolveRuntimeCapability('ghost')).toThrow(
        new RegExp(`Unknown ${label} runtime "ghost"`),
      );
    });
  });
});
