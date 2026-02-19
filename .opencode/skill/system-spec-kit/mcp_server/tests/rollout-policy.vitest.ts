// ---------------------------------------------------------------
// TEST: ROLLOUT POLICY (T061-T065 prep)
// ---------------------------------------------------------------

import { afterEach, describe, expect, it } from 'vitest';
import {
  deterministicBucket,
  getRolloutPercent,
  isFeatureEnabled,
  isIdentityInRollout,
} from '../lib/cache/cognitive/rollout-policy';

const originalPercent = process.env.SPECKIT_ROLLOUT_PERCENT;
const originalFlag = process.env.SPECKIT_EXTRACTION;

describe('rollout policy', () => {
  afterEach(() => {
    if (originalPercent === undefined) {
      delete process.env.SPECKIT_ROLLOUT_PERCENT;
    } else {
      process.env.SPECKIT_ROLLOUT_PERCENT = originalPercent;
    }

    if (originalFlag === undefined) {
      delete process.env.SPECKIT_EXTRACTION;
    } else {
      process.env.SPECKIT_EXTRACTION = originalFlag;
    }
  });

  it('uses full rollout when percent not configured', () => {
    delete process.env.SPECKIT_ROLLOUT_PERCENT;
    expect(getRolloutPercent()).toBe(100);
  });

  it('supports deterministic bucket assignment', () => {
    const bucketA = deterministicBucket('session-a');
    const bucketB = deterministicBucket('session-a');
    expect(bucketA).toBe(bucketB);
    expect(bucketA).toBeGreaterThanOrEqual(0);
    expect(bucketA).toBeLessThan(100);
  });

  it('gates identities by configured rollout percent', () => {
    process.env.SPECKIT_ROLLOUT_PERCENT = '0';
    expect(isIdentityInRollout('x')).toBe(false);

    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    expect(isIdentityInRollout('x')).toBe(true);
  });

  it('requires both feature flag and rollout membership', () => {
    process.env.SPECKIT_EXTRACTION = 'false';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', 'session-1')).toBe(false);

    process.env.SPECKIT_EXTRACTION = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', 'session-1')).toBe(true);
  });
});
