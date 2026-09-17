// ───────────────────────────────────────────────────────────────────
// MODULE: Cutover binding resolution
//   The resolver exists to keep a human keyboard off an irreversible
//   transition. These tests pin the refusals rather than the happy path:
//   a binding that quietly invents an actor or a commit would put an
//   unattributable flip in the ledger, which is worse than no flip.
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  CutoverBindingError,
  CutoverBindingErrorCodes,
  resolveCutoverBinding,
  type CutoverBindingEnvironment,
} from '../../lib/cutover-binding/index.js';

function environment(overrides: Partial<CutoverBindingEnvironment> = {}): CutoverBindingEnvironment {
  return Object.freeze({
    gitConfigEmail: () => 'operator@example.test',
    gitHeadSha: () => 'a'.repeat(40),
    gitParentSha: () => 'b'.repeat(40),
    gitCommitExists: () => true,
    osUser: () => 'localuser',
    osHost: () => 'workstation.local',
    ...overrides,
  });
}

const NOW = () => new Date('2026-08-19T00:00:00.000Z');

describe('cutover binding resolution', () => {
  it('resolves every execution-time fact the flip needs without being handed one', () => {
    const binding = resolveCutoverBinding({ mode: 'deep-research', environment: environment(), now: NOW });

    expect(binding.actorId).toBe('operator:operator@example.test');
    expect(binding.candidateSha).toBe('a'.repeat(40));
    expect(binding.baseSha).toBe('b'.repeat(40));
    expect(binding.streamId).toBe('authority-flip:deep-research');
    expect(binding.decidedAt).toBe('2026-08-19T00:00:00.000Z');
    expect(binding.capabilityId).toMatch(/^capability:authority-flip:[0-9a-f]{16}$/u);
    expect(binding.requestId).not.toBe(binding.correlationId);
  });

  it('attributes the flip to the committer identity, not the OS account', () => {
    // The ledger and the git log should name the same person for the same
    // change; preferring the OS user would split that attribution.
    const binding = resolveCutoverBinding({ mode: 'deep-research', environment: environment(), now: NOW });
    expect(binding.actorId).toBe('operator:operator@example.test');
  });

  it('falls back to the OS account only when no committer identity exists', () => {
    const binding = resolveCutoverBinding({
      mode: 'deep-research',
      environment: environment({ gitConfigEmail: () => null }),
      now: NOW,
    });
    expect(binding.actorId).toBe('operator:localuser');
  });

  it('refuses to bind a flip that would have no accountable actor', () => {
    expect(() => resolveCutoverBinding({
      mode: 'deep-research',
      environment: environment({ gitConfigEmail: () => null, osUser: () => null }),
      now: NOW,
    })).toThrowError(expect.objectContaining({
      name: 'CutoverBindingError',
      code: CutoverBindingErrorCodes.IDENTITY_UNRESOLVED,
    }));
  });

  it('scopes the capability to the host so a copied credential does not carry flip authority', () => {
    const here = resolveCutoverBinding({ mode: 'deep-research', environment: environment(), now: NOW });
    const elsewhere = resolveCutoverBinding({
      mode: 'deep-research',
      environment: environment({ osHost: () => 'other-machine.local' }),
      now: NOW,
    });

    expect(here.actorId).toBe(elsewhere.actorId);
    expect(here.capabilityId).not.toBe(elsewhere.capabilityId);
  });

  it('refuses when the host cannot be established, rather than issuing an unscoped capability', () => {
    expect(() => resolveCutoverBinding({
      mode: 'deep-research',
      environment: environment({ osHost: () => null }),
      now: NOW,
    })).toThrowError(CutoverBindingError);
  });

  it('refuses when there is no commit to bind the flip to', () => {
    expect(() => resolveCutoverBinding({
      mode: 'deep-research',
      environment: environment({ gitHeadSha: () => null }),
      now: NOW,
    })).toThrowError(expect.objectContaining({
      code: CutoverBindingErrorCodes.COMMIT_UNRESOLVED,
    }));
  });

  it('refuses when no baseline was supplied and the candidate has no parent', () => {
    expect(() => resolveCutoverBinding({
      mode: 'deep-research',
      environment: environment({ gitParentSha: () => null }),
      now: NOW,
    })).toThrowError(expect.objectContaining({
      code: CutoverBindingErrorCodes.COMMIT_UNRESOLVED,
    }));
  });

  it('refuses a supplied baseline that is not a commit in this repository', () => {
    // A typo'd baseline would otherwise produce a regression comparison
    // against nothing, and read as evidence.
    expect(() => resolveCutoverBinding({
      mode: 'deep-research',
      baseSha: 'c'.repeat(40),
      environment: environment({ gitCommitExists: () => false }),
      now: NOW,
    })).toThrowError(expect.objectContaining({
      code: CutoverBindingErrorCodes.COMMIT_UNKNOWN,
    }));
  });

  it('keeps each mode on its own transition stream', () => {
    const research = resolveCutoverBinding({ mode: 'deep-research', environment: environment(), now: NOW });
    const review = resolveCutoverBinding({ mode: 'deep-review', environment: environment(), now: NOW });

    expect(research.streamId).not.toBe(review.streamId);
  });
});
