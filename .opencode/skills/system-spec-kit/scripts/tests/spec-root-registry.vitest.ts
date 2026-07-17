// -------------------------------------------------------------------
// MODULE: Spec Root Registry Tests
// -------------------------------------------------------------------

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

describe('spec root resolver registry', () => {
  it('contains only well-formed resolver entries', () => {
    expect(SPEC_ROOT_RESOLVERS.length).toBeGreaterThan(0);

    for (const entry of SPEC_ROOT_RESOLVERS) {
      expect(entry.file.trim()).not.toBe('');
      expect(entry.file).toMatch(/^(scripts|mcp_server|shared)\/.+:\d/u);
      expect(entry.symbol.trim()).not.toBe('');
      expect(entry.consumerOrEffect.trim()).not.toBe('');
      expect(ALLOWED_PRECEDENCE.has(entry.precedence)).toBe(true);
    }
  });

  it('has no registry coverage gaps', () => {
    expect(registryCoverageGaps()).toEqual([]);
  });
});
