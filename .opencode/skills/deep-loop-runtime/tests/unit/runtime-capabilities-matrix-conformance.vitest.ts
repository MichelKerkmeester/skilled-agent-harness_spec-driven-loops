import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const nodeRequire = createRequire(import.meta.url);

// The centralized resolver is the contract every graph-backed mode's matrix must
// honor to be consumable via a per-skill shim. Three matrices exist and they
// diverge by design: research + review ship the array schema the resolver reads;
// ai-council ships a council-specific object schema with no resolver shim. This
// guard drives each matrix through the resolver so a silent per-mode schema
// change (either a conformant matrix regressing, or the council matrix quietly
// adopting the resolver shape without a shim) fails CI.
const RUNTIME_MODULE = '../../lib/deep-loop/runtime-capabilities.cjs';
const { createRuntimeCapabilities } = nodeRequire(RUNTIME_MODULE) as {
  createRuntimeCapabilities: (opts: { label: string; defaultCapabilityPath: string }) => {
    loadRuntimeCapabilities: (p?: string) => { capabilityPath: string; matrix: { runtimes: Array<{ id: string }> } };
    listRuntimeCapabilityIds: (p?: string) => string[];
    resolveRuntimeCapability: (id: string, p?: string) => { capabilityPath: string; runtime: { id: string } };
  };
};

const WORKFLOWS = resolve(__dirname, '..', '..', '..', 'deep-loop-workflows');

const RESOLVER_CONFORMANT = [
  { label: 'deep-research', path: resolve(WORKFLOWS, 'deep-research', 'assets', 'runtime_capabilities.json') },
  { label: 'deep-review', path: resolve(WORKFLOWS, 'deep-review', 'assets', 'runtime_capabilities.json') },
];

const COUNCIL_MATRIX = resolve(WORKFLOWS, 'ai-council', 'assets', 'runtime_capabilities.json');

// Every graph-backed mode mirrors the same three runtime targets, so a matrix
// that drops one (or grows a fourth unannounced) is per-mode drift.
const EXPECTED_RUNTIME_IDS = ['opencode', 'claude', 'codex'];

describe('runtime_capabilities matrix conformance (resolver-driven)', () => {
  it('every conformant matrix file exists on disk', () => {
    for (const { path } of RESOLVER_CONFORMANT) {
      expect(existsSync(path), `${path} missing`).toBe(true);
    }
    expect(existsSync(COUNCIL_MATRIX), `${COUNCIL_MATRIX} missing`).toBe(true);
  });

  describe.each(RESOLVER_CONFORMANT)('$label matrix', ({ label, path }) => {
    const api = createRuntimeCapabilities({ label, defaultCapabilityPath: path });

    it('loads through the resolver with an array runtimes shape', () => {
      const { matrix } = api.loadRuntimeCapabilities();
      expect(Array.isArray(matrix.runtimes)).toBe(true);
    });

    it('exposes exactly the expected runtime id set', () => {
      expect([...api.listRuntimeCapabilityIds()].sort()).toEqual([...EXPECTED_RUNTIME_IDS].sort());
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

  // The council matrix is intentionally NOT resolver-shaped. Pinning this keeps
  // the divergence explicit: if ai-council ever adopts the array schema it must
  // also gain a shim + move into RESOLVER_CONFORMANT, and this assertion is the
  // tripwire that forces that conversation.
  describe('ai-council matrix (deliberate non-conformant council schema)', () => {
    const council = nodeRequire(COUNCIL_MATRIX) as {
      schemaVersion: string;
      runtimes: Record<string, { agentPath: string }>;
    };

    it('declares the council-specific schema version', () => {
      expect(council.schemaVersion).toBe('deep-ai-council.runtime-capabilities.v1');
    });

    it('keys runtimes as an object, not the resolver array shape', () => {
      expect(Array.isArray(council.runtimes)).toBe(false);
      expect([...Object.keys(council.runtimes)].sort()).toEqual([...EXPECTED_RUNTIME_IDS].sort());
    });

    it('throws when forced through the array-only resolver (proves the divergence is real)', () => {
      const api = createRuntimeCapabilities({ label: 'deep-ai-council', defaultCapabilityPath: COUNCIL_MATRIX });
      expect(() => api.listRuntimeCapabilityIds()).toThrow(/missing runtimes array/);
    });
  });
});
