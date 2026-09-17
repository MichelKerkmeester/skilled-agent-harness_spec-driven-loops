// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Registry Tests
// ───────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  SPEC_ROOT_RESOLVERS,
  registryCoverageGaps,
} from '../core/spec-root-registry.js';
import type { SpecRootPrecedence } from '../core/spec-root-registry.js';

const ALLOWED_PRECEDENCE = new Set<SpecRootPrecedence>([
  'legacy-first',
  'canonical-first',
  'canonical-only',
  'direct-path-first',
  'membership-only',
]);

// Entry file values carry a trailing ':line-range' (and sometimes several,
// comma-separated) suffix for human navigation; strip it to get the real path.
function registryEntryFilePath(entryFile: string): string {
  return entryFile.replace(/:\d.*$/u, '');
}

const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

describe('spec root resolver registry', () => {
  it('contains only well-formed resolver entries', () => {
    expect(SPEC_ROOT_RESOLVERS.length).toBeGreaterThan(0);

    for (const entry of SPEC_ROOT_RESOLVERS) {
      expect(entry.file.trim()).not.toBe('');
      expect(entry.file).toMatch(/^(runtime|shared)\/.+:\d/u);
      expect(entry.symbol.trim()).not.toBe('');
      expect(entry.consumerOrEffect.trim()).not.toBe('');
      expect(ALLOWED_PRECEDENCE.has(entry.precedence)).toBe(true);
    }
  });

  it('every listed source path exists on disk', () => {
    const missing = SPEC_ROOT_RESOLVERS
      .map((entry) => registryEntryFilePath(entry.file))
      .filter((relativePath) => !existsSync(path.join(SKILL_ROOT, relativePath)));
    expect(missing).toEqual([]);
  });

  it('has no registry coverage gaps', () => {
    expect(registryCoverageGaps()).toEqual([]);
  });
});
