// ───────────────────────────────────────────────────────────────
// MODULE: Beta-Reliability Primitive + Gate Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  NEUTRAL_PRIOR,
  applyDecayUnpromotion,
  asymmetricSinkDelta,
  betaPosteriorMean,
  coldStartPosterior,
  contentAddressEvent,
  evaluateHeldOutAttestation,
  evaluateTwoGate,
  foldContentAddressed,
  laneReliabilityPosterior,
  maxAchievablePosterior,
  posteriorToWeightDelta,
  validatePolicyReachability,
  type ContentAddressedEvent,
  type TwoGatePolicy,
} from '../../lib/scorer/beta-reliability.js';
import { reduceAdvisorFeedbackCalibration } from '../../lib/scorer/feedback-calibration.js';
import type { AdvisorHookOutcomeRecord } from '../../lib/metrics.js';

function event(contentId: string, successes: number, failures: number): ContentAddressedEvent {
  return { contentId, successes, failures };
}

describe('beta posterior primitive', () => {
  it('reads the uninformative 0.5 on cold start with Beta(1,1)', () => {
    expect(coldStartPosterior()).toBe(0.5);
    expect(betaPosteriorMean(NEUTRAL_PRIOR, { successes: 0, failures: 0 })).toBe(0.5);
  });

  it('is flood-immune: 8 vs 10,000 all-accepted samples are NOT identical', () => {
    const few = betaPosteriorMean(NEUTRAL_PRIOR, { successes: 8, failures: 0 });
    const many = betaPosteriorMean(NEUTRAL_PRIOR, { successes: 10_000, failures: 0 });
    expect(few).toBe(0.9); // (1+8)/(2+8)
    expect(many).toBeGreaterThan(few);
    expect(many).toBeLessThan(1); // never pushed to certainty by count
    expect(few).not.toBe(many);
  });

  it('holds the neutral prior below the count floor', () => {
    expect(laneReliabilityPosterior({ successes: 3, failures: 0 }, { countFloor: 8 })).toBe(0.5);
    expect(laneReliabilityPosterior({ successes: 8, failures: 0 }, { countFloor: 8 })).toBe(0.9);
  });

  it('rejects non-finite / negative counts', () => {
    expect(() => betaPosteriorMean(NEUTRAL_PRIOR, { successes: -1, failures: 0 })).toThrow(RangeError);
    expect(() => betaPosteriorMean(NEUTRAL_PRIOR, { successes: Number.NaN, failures: 0 })).toThrow(RangeError);
  });
});

describe('advisor adapter (posterior → weight delta)', () => {
  it('maps the neutral posterior to a zero delta (promotes nothing)', () => {
    expect(posteriorToWeightDelta(0.5, { maxAbs: 0.03 })).toBe(0);
  });

  it('maps the poles to ±maxAbs', () => {
    expect(posteriorToWeightDelta(1, { maxAbs: 0.03 })).toBe(0.03);
    expect(posteriorToWeightDelta(0, { maxAbs: 0.03 })).toBe(-0.03);
  });
});

describe('asymmetric sink delta', () => {
  it('is decay-only at gain 0 (acceptances never raise)', () => {
    expect(asymmetricSinkDelta({ raisePressure: 1, sinkPressure: 0, gain: 0, maxAbs: 0.05 })).toBe(0);
    expect(asymmetricSinkDelta({ raisePressure: 1, sinkPressure: 0.5, gain: 0, maxAbs: 0.05 })).toBe(0.025);
  });

  it('keeps the sink at least as hard as the raise (down ≥ up) for equal pressure', () => {
    const tie = asymmetricSinkDelta({ raisePressure: 0.5, sinkPressure: 0.5, gain: 1, maxAbs: 0.05 });
    const sinkBiased = asymmetricSinkDelta({ raisePressure: 0.5, sinkPressure: 0.5, gain: 0.5, maxAbs: 0.05 });
    expect(tie).toBe(0); // full gain ties exactly
    expect(sinkBiased).toBeGreaterThan(0); // partial gain → sink dominates
  });

  it('never ratchets past the cap', () => {
    expect(asymmetricSinkDelta({ raisePressure: 0, sinkPressure: 9, gain: 0, maxAbs: 0.05 })).toBe(0.05);
  });
});

describe('two-gate promotion', () => {
  const policy: TwoGatePolicy = {
    kMin: 2,
    stopThreshold: 0.6,
    prior: NEUTRAL_PRIOR,
    maxDistinctSources: 5,
  };

  it('promotes only when BOTH gates pass (non-trading conjunction)', () => {
    expect(evaluateTwoGate({ posterior: 0.7, distinctAttesters: 2 }, policy)).toEqual({
      promote: true,
      reason: 'two_gate_satisfied',
    });
  });

  it('refuses on the k-floor even with a strong posterior', () => {
    expect(evaluateTwoGate({ posterior: 0.99, distinctAttesters: 1 }, policy)).toEqual({
      promote: false,
      reason: 'below_k_floor',
    });
  });

  it('refuses on the posterior even with enough attesters', () => {
    expect(evaluateTwoGate({ posterior: 0.55, distinctAttesters: 4 }, policy)).toEqual({
      promote: false,
      reason: 'below_posterior_threshold',
    });
  });

  it('refuses an unreachable policy rather than silently never-promoting', () => {
    const unreachable: TwoGatePolicy = { ...policy, stopThreshold: 0.999, maxDistinctSources: 2 };
    expect(validatePolicyReachability(unreachable)).toEqual({
      reachable: false,
      reason: 'threshold_unreachable',
    });
    expect(evaluateTwoGate({ posterior: 0.75, distinctAttesters: 2 }, unreachable)).toEqual({
      promote: false,
      reason: 'policy_unreachable',
    });
    expect(maxAchievablePosterior(NEUTRAL_PRIOR, 2)).toBe(0.75); // (1+2)/(2+2)
  });

  it('refuses degenerate k-floors', () => {
    expect(validatePolicyReachability({ ...policy, kMin: 0 }).reason).toBe('k_floor_below_one');
    expect(validatePolicyReachability({ ...policy, kMin: 3, maxDistinctSources: 2 }).reason)
      .toBe('k_floor_exceeds_sources');
  });
});

describe('held-out attestation', () => {
  it('drops self-attestations (a producer cannot vote up its own reliability)', () => {
    const verdict = evaluateHeldOutAttestation({
      subjectProducerId: 'skill-a',
      kMin: 2,
      attestations: [
        { sourceId: 's1', producerId: 'skill-a', success: true }, // dropped (self)
        { sourceId: 's2', producerId: 'reviewer', success: true },
        { sourceId: 's3', producerId: 'runtime', success: true },
      ],
    });
    expect(verdict.droppedSelfAttestations).toBe(1);
    expect(verdict.distinctSources).toBe(2);
    expect(verdict.corroborated).toBe(true);
  });

  it('counts one vote per source and stays below certainty', () => {
    const verdict = evaluateHeldOutAttestation({
      subjectProducerId: 'subject',
      kMin: 2,
      attestations: Array.from({ length: 50 }, () => ({
        sourceId: 'only-one-source',
        producerId: 'p',
        success: true,
      })),
    });
    expect(verdict.distinctSources).toBe(1); // 50 votes collapse to one source
    expect(verdict.corroborated).toBe(false); // one source < kMin
    expect(verdict.posterior).toBeLessThan(1);
  });

  it('resolves a tied source to failure (the conservative direction)', () => {
    const verdict = evaluateHeldOutAttestation({
      subjectProducerId: 'subject',
      kMin: 1,
      attestations: [
        { sourceId: 's', producerId: 'p', success: true },
        { sourceId: 's', producerId: 'p', success: false },
      ],
    });
    expect(verdict.successes).toBe(0);
    expect(verdict.failures).toBe(1);
  });
});

describe('content-addressed fold', () => {
  it('folds a replay / double-delivery exactly once', () => {
    const a = event('id-a', 3, 1);
    const replay = event('id-a', 3, 1);
    const b = event('id-b', 2, 0);
    const folded = foldContentAddressed([a, replay, b]);
    expect(folded.distinctEvents).toBe(2);
    expect(folded.evidence).toEqual({ successes: 5, failures: 1 });
  });

  it('is order-independent', () => {
    const a = event('id-a', 3, 1);
    const b = event('id-b', 2, 0);
    expect(foldContentAddressed([a, b])).toEqual(foldContentAddressed([b, a]));
  });

  it('derives a stable content id regardless of key order', () => {
    const left = contentAddressEvent({ a: 1, b: { c: 2, d: 3 } });
    const right = contentAddressEvent({ b: { d: 3, c: 2 }, a: 1 });
    expect(left).toBe(right);
  });
});

describe('decay un-promotion (reversible, audit-tagged)', () => {
  const base = {
    lane: 'explicit_author' as const,
    defaultShadowWeight: 0.4,
    promotedShadowWeight: 0.43,
    promoteThreshold: 0.6,
    decayThreshold: 0.5,
  };

  it('re-promotes on regained support (stable lane id)', () => {
    expect(applyDecayUnpromotion({ ...base, posterior: 0.7, hasEvidence: true })).toEqual({
      lane: 'explicit_author',
      shadowWeight: 0.43,
      auditTag: 'promoted',
    });
  });

  it('distinguishes support-went-bad from lost-support on demotion', () => {
    expect(applyDecayUnpromotion({ ...base, posterior: 0.3, hasEvidence: true }).auditTag)
      .toBe('support_decayed');
    expect(applyDecayUnpromotion({ ...base, posterior: 0.3, hasEvidence: false }).auditTag)
      .toBe('support_lost');
  });

  it('holds the frozen default between thresholds', () => {
    const state = applyDecayUnpromotion({ ...base, posterior: 0.55, hasEvidence: true });
    expect(state.shadowWeight).toBe(0.4);
    expect(state.auditTag).toBe('frozen_default');
  });
});

// The asymmetric helper is wired at the estimator's threshold seam behind a
// default-off gain. Proves the default output is byte-identical and the opt-in
// changes only what it should.
describe('asymmetric threshold wiring stays default-off', () => {
  function outcome(skillLabel: string, kind: AdvisorHookOutcomeRecord['outcome']): AdvisorHookOutcomeRecord {
    return { timestamp: '2026-06-10T00:00:00.000Z', runtime: 'opencode', outcome: kind, skillLabel };
  }
  const records = [
    ...Array.from({ length: 4 }, () => outcome('alpha', 'accepted')),
    ...Array.from({ length: 4 }, () => outcome('beta', 'corrected')),
  ];
  const opts = {
    currentThresholds: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
    minSamples: 4,
    laneAttributionBySkill: { alpha: 'explicit_author', beta: 'lexical' } as const,
  };

  it('keeps the symmetric value when no gain is set', () => {
    const report = reduceAdvisorFeedbackCalibration(records, opts);
    expect(report.thresholdSignals.confidenceThresholdDelta).toBe(0.025);
    expect(reduceAdvisorFeedbackCalibration(records, { ...opts, thresholdRaiseGain: 0 })
      .thresholdSignals.confidenceThresholdDelta).toBe(0.025);
  });

  it('lets acceptances offset corrections at full gain', () => {
    const report = reduceAdvisorFeedbackCalibration(records, { ...opts, thresholdRaiseGain: 1 });
    expect(report.thresholdSignals.confidenceThresholdDelta).toBe(0);
  });
});
