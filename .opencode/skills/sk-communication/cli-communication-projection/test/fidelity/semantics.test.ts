// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Coverage Semantics Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { compareCausalDirection, compareClaimCoverage } from '../../src/fidelity/semantics.js';
import { FidelityReasonCodes } from '../../src/fidelity/types.js';

describe('compareClaimCoverage', () => {
  it('fires CLAIM_OMITTED when a candidate drops the claim sentence', () => {
    const source = 'The file must be signed before upload.';
    const candidate = 'The file goes up now.';
    const result = compareClaimCoverage(source, candidate);
    expect(result).toMatchObject({
      reasonCode: FidelityReasonCodes.CLAIM_OMITTED,
      expectedCount: 1,
      actualCount: 0,
    });
  });

  it('returns null when a reworded candidate keeps the claim content words', () => {
    const source = 'The file must be signed before upload.';
    const candidate = 'Before upload, the file must be signed.';
    expect(compareClaimCoverage(source, candidate)).toBeNull();
  });

  it('returns null when the dropped sentence carries no claim marker', () => {
    const source = 'The file must be signed before upload. The folder is blue.';
    const candidate = 'The file must be signed before upload.';
    expect(compareClaimCoverage(source, candidate)).toBeNull();
  });

  it('returns null for any candidate when the source has no claim sentence', () => {
    const source = 'The folder is blue. The report runs weekly.';
    expect(compareClaimCoverage(source, 'Nothing here matches at all.')).toBeNull();
    expect(compareClaimCoverage(source, '')).toBeNull();
  });
});

describe('compareCausalDirection', () => {
  it('fires CAUSE_INVERTED when a reorder swaps the cause and the effect', () => {
    const source = 'The deploy failed because the cache was stale.';
    const candidate = 'The cache was stale because the deploy failed.';
    expect(compareCausalDirection(source, candidate)).toMatchObject({
      reasonCode: FidelityReasonCodes.CAUSE_INVERTED,
      expectedCount: 1,
      actualCount: 0,
    });
  });

  it('fires when the swap crosses connective families', () => {
    const source = 'The cache was stale, therefore the deploy failed.';
    const candidate = 'The cache was stale because the deploy failed.';
    expect(compareCausalDirection(source, candidate)).toMatchObject({
      reasonCode: FidelityReasonCodes.CAUSE_INVERTED,
    });
  });

  it('returns null when a reworded candidate keeps the direction', () => {
    const source = 'The deploy failed because the cache was stale.';
    const candidate = 'Because the cache was stale, the deploy failed and had to be rerun.';
    expect(compareCausalDirection(source, 'The stale cache is why the deploy failed.')).toBeNull();
    expect(compareCausalDirection(source, candidate)).toBeNull();
  });

  it('returns null when the candidate drops the causal sentence, which the claim check owns', () => {
    const source = 'The deploy failed because the cache was stale.';
    expect(compareCausalDirection(source, 'The deploy failed.')).toBeNull();
    expect(compareCausalDirection(source, '')).toBeNull();
  });

  it('returns null for any candidate when the source states no cause', () => {
    const source = 'The folder is blue. The report runs weekly.';
    expect(compareCausalDirection(source, 'The report runs weekly because the folder is blue.')).toBeNull();
  });
});
