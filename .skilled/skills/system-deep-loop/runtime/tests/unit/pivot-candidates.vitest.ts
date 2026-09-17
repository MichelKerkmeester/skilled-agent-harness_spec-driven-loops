import { describe, expect, it } from 'vitest';

import {
  deduplicatePivotCandidate,
  validatePivotCandidate,
} from '../../lib/deep-loop/pivot-candidates.js';

import type { PivotCandidate } from '../../lib/deep-loop/pivot-candidates.js';

function candidate(overrides: Partial<PivotCandidate> = {}): PivotCandidate {
  return {
    id: 'candidate-001',
    title: 'Explore cache invalidation boundary',
    focus: 'Explore cache invalidation boundary across the worker lifecycle',
    evidenceRefs: ['artifact:12'],
    relevanceRationale: 'This remains relevant to the current saturation trigger',
    boundaryVerdict: {
      status: 'within_boundary',
      rationale: 'The direction retains the caller supplied boundary',
    },
    fingerprint: 'sha256:cache-boundary',
    seatProvenance: ['seat-001'],
    ...overrides,
  };
}

describe('pivot candidate validation and deduplication', () => {
  it('rejects an exact normalized fingerprint duplicate', () => {
    const result = deduplicatePivotCandidate(
      candidate({ id: 'candidate-002', fingerprint: '  SHA256:CACHE-BOUNDARY  ' }),
      [candidate()],
    );

    expect(result.accepted).toBe(false);
    if (!result.accepted) {
      expect(result.rejections).toEqual(expect.arrayContaining([
        expect.objectContaining({ code: 'exact_duplicate', priorCandidateId: 'candidate-001' }),
      ]));
    }
  });

  it('rejects a materially similar direction above the default threshold', () => {
    const result = deduplicatePivotCandidate(candidate({
      id: 'candidate-002',
      title: 'Examine cache invalidation boundary',
      fingerprint: 'sha256:cache-boundary-alternate',
    }), [candidate()]);

    expect(result.accepted).toBe(false);
    if (!result.accepted) {
      expect(result.maxSimilarity).toBeGreaterThanOrEqual(0.85);
      expect(result.rejections).toEqual(expect.arrayContaining([
        expect.objectContaining({ code: 'materially_similar' }),
      ]));
    }
  });

  it('accepts a genuinely novel direction', () => {
    const result = deduplicatePivotCandidate(candidate({
      id: 'candidate-002',
      title: 'Measure queue fairness under burst load',
      focus: 'Compare scheduling fairness when independent producers burst concurrently',
      relevanceRationale: 'A distinct execution path can explain the unresolved behavior',
      fingerprint: 'sha256:queue-fairness',
    }), [candidate()]);

    expect(result).toMatchObject({
      accepted: true,
      candidate: { id: 'candidate-002' },
    });
  });

  it('rejects a candidate that omits any required contract field', () => {
    const { evidenceRefs: _evidenceRefs, ...incomplete } = candidate();

    const result = validatePivotCandidate(incomplete);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.rejections).toEqual(expect.arrayContaining([
        expect.objectContaining({ code: 'invalid_candidate', field: 'evidenceRefs' }),
      ]));
    }
  });
});
