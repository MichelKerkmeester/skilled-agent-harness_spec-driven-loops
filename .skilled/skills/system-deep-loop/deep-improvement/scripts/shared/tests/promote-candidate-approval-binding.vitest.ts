// Regression guard for a candidate time-of-check/time-of-use gap: the approval receipt binds the
// exact approved candidate bytes, but the initial verification runs long before the bytes are
// consumed (the byte copy for a single-phase promote, and the accepted snapshot for the two-phase
// accept), across an intervening window of gate/git/mirror-sync I/O. Without a re-bind at the
// consumption boundary, a concurrent writer with access to the candidate file but not the signing
// key could swap malicious bytes into a protected target after approval. assertCandidateMatchesApproval
// is the single guard both consumption sites call; these cases prove it fails closed.
import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { assertCandidateMatchesApproval } = require('../promote-candidate.cjs') as {
  assertCandidateMatchesApproval: (
    consumedCandidateHash: string,
    approvalReceipt: unknown,
    failGate: (message: string, details?: Record<string, unknown>) => void,
  ) => void;
};

function collectingFailGate() {
  const calls: Array<{ message: string; details: Record<string, unknown> }> = [];
  const failGate = (message: string, details: Record<string, unknown> = {}) => {
    calls.push({ message, details });
    // The real failGate terminates the run; throwing here reproduces that fail-closed control flow.
    throw Object.assign(new Error(message), details);
  };
  return { calls, failGate };
}

const APPROVED_HASH = 'a'.repeat(64);
const SWAPPED_HASH = 'b'.repeat(64);

describe('assertCandidateMatchesApproval — candidate re-bind at the consumption boundary', () => {
  it('passes when the consumed candidate hash matches the approval binding', () => {
    const { calls, failGate } = collectingFailGate();
    assertCandidateMatchesApproval(
      APPROVED_HASH,
      { binding: { candidate: { hash: APPROVED_HASH } } },
      failGate,
    );
    expect(calls).toHaveLength(0);
  });

  it('fails closed when the consumed candidate hash differs from the approval binding', () => {
    const { calls, failGate } = collectingFailGate();
    expect(() =>
      assertCandidateMatchesApproval(
        SWAPPED_HASH,
        { binding: { candidate: { hash: APPROVED_HASH } } },
        failGate,
      ),
    ).toThrow();
    expect(calls).toHaveLength(1);
    expect(calls[0].details.errorType).toBe('approved_candidate_changed');
  });

  it('fails closed when the approval binding is missing entirely', () => {
    const { calls, failGate } = collectingFailGate();
    expect(() => assertCandidateMatchesApproval(APPROVED_HASH, {}, failGate)).toThrow();
    expect(calls[0]?.details.errorType).toBe('approved_candidate_changed');
  });

  it('fails closed when the approval receipt is null', () => {
    const { failGate } = collectingFailGate();
    expect(() => assertCandidateMatchesApproval(APPROVED_HASH, null, failGate)).toThrow();
  });
});
