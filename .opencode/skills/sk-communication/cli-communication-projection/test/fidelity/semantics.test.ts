// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Coverage Semantics Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { compareClaimCoverage } from '../../src/fidelity/semantics.js';
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
