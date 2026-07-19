import { describe, expect, it } from 'vitest';

import {
  DEFAULT_EPHEMERAL_TTL_MS,
  validateGovernedIngest,
} from '../lib/governance/scope-governance';

describe('governance ephemeral retention decoupling', () => {
  it('preserves explicit deleteAfter when ephemeral includes full governance fields', () => {
    const deleteAfter = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const decision = validateGovernedIngest({
      tenantId: 'tenant-a',
      sessionId: 'session-1',
      userId: 'user-1',
      provenanceSource: 'vitest',
      provenanceActor: 'agent:test',
      retentionPolicy: 'ephemeral',
      deleteAfter,
    });

    expect(decision.allowed).toBe(true);
    expect(decision.issues).toEqual([]);
    expect(decision.normalized.deleteAfter).toBe(deleteAfter);
  });

  it('allows ephemeral alone and supplies the default TTL', () => {
    const before = Date.now();

    const decision = validateGovernedIngest({
      retentionPolicy: 'ephemeral',
    });

    const after = Date.now();
    const normalizedDeleteAfter = decision.normalized.deleteAfter;

    expect(decision.allowed).toBe(true);
    expect(decision.issues).toEqual([]);
    expect(normalizedDeleteAfter).toEqual(expect.any(String));

    const deleteAfterMs = new Date(normalizedDeleteAfter as string).getTime();
    expect(deleteAfterMs).toBeGreaterThanOrEqual(before + DEFAULT_EPHEMERAL_TTL_MS);
    expect(deleteAfterMs).toBeLessThanOrEqual(after + DEFAULT_EPHEMERAL_TTL_MS + 5000);
  });

  it('allows ephemeral with explicit deleteAfter only and preserves the caller value', () => {
    const deleteAfter = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const decision = validateGovernedIngest({
      retentionPolicy: 'ephemeral',
      deleteAfter,
    });

    expect(decision.allowed).toBe(true);
    expect(decision.issues).toEqual([]);
    expect(decision.normalized.deleteAfter).toBe(deleteAfter);
  });
});
