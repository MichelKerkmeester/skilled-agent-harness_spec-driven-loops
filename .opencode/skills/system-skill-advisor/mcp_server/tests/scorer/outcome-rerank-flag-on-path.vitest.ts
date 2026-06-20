// ───────────────────────────────────────────────────────────────
// MODULE: Outcome-Weighted Rerank — Flag ON-Path Contract
// ───────────────────────────────────────────────────────────────
// The sibling outcome-weighted-ranking suite proves the rerank is OFF by
// default and exercises the pure function. This suite closes the ON-path gap:
// with SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK enabled, the flag predicate flips
// to true and the rerank actively REORDERS candidates by observed-outcome
// reliability — asserting the NEW behaviour the flag turns on, not parity with
// the off state.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createSkillExecutionOutcomeRecord } from '../../lib/metrics.js';
import { foldSkillOutcomeRecords } from '../../lib/scorer/skill-outcome-store.js';
import {
  ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG,
  FRESH_SKILL_RELIABILITY,
  isAdvisorOutcomeWeightedRerankEnabled,
  outcomeWeightedRerank,
  type ReliabilityResolver,
} from '../../lib/scorer/outcome-weighted-rerank.js';

// Beta-posterior mean reliability — the production resolver is the shared
// primitive; this seam blends success/failure counts into [0,1].
const A0 = 1;
const B0 = 1;
const betaMean: ReliabilityResolver = ({ success, failure }) =>
  (A0 + success) / (A0 + B0 + success + failure);

beforeEach(() => {
  delete process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG];
});

afterEach(() => {
  delete process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG];
});

describe('outcome-weighted rerank — flag ON path', () => {
  it('the flag predicate is true for every documented truthy value', () => {
    for (const truthy of ['1', 'true', 'TRUE', 'yes', 'on', 'enabled']) {
      process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG] = truthy;
      expect(isAdvisorOutcomeWeightedRerankEnabled()).toBe(true);
    }
  });

  it('flag ON reorders an equally-similar pair so the reliable skill wins', () => {
    process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG] = 'true';
    expect(isAdvisorOutcomeWeightedRerankEnabled()).toBe(true);

    // Two skills at IDENTICAL fused similarity. The similarity-only baseline
    // would tie-break alphabetically (failing 'a-skill' first); the rerank must
    // instead promote the reliably-successful one.
    const candidates = [
      { skillId: 'a-skill-fails', similarity: 0.5 },
      { skillId: 'b-skill-succeeds', similarity: 0.5 },
    ];
    const fold = foldSkillOutcomeRecords(
      [
        createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'a-skill-fails', success: false, eventId: 'f1' }),
        createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'a-skill-fails', success: false, eventId: 'f2' }),
        createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'b-skill-succeeds', success: true, eventId: 's1' }),
        createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'b-skill-succeeds', success: true, eventId: 's2' }),
      ],
      { now: 'n' },
    );

    const similarityOnlyTop = [...candidates]
      .sort((l, r) => r.similarity - l.similarity || l.skillId.localeCompare(r.skillId))[0].skillId;
    const reranked = outcomeWeightedRerank(candidates, { fold, reliabilityResolver: betaMean });

    // The NEW contract: the rerank does NOT agree with the similarity-only order.
    expect(similarityOnlyTop).toBe('a-skill-fails');
    expect(reranked[0].skillId).toBe('b-skill-succeeds');
    expect(reranked[0].skillId).not.toBe(similarityOnlyTop);
    expect(reranked[0].reliability).toBeGreaterThan(reranked[1].reliability);
  });

  it('flag ON lets a reliable lower-similarity skill overtake a slightly-higher unreliable one', () => {
    process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG] = 'true';

    // Baseline ranks 'higher-sim' first by similarity. Its observed reliability
    // is poor enough that the reliability-weighted blend flips the order.
    const candidates = [
      { skillId: 'higher-sim-unreliable', similarity: 0.55 },
      { skillId: 'lower-sim-reliable', similarity: 0.5 },
    ];
    const fold = foldSkillOutcomeRecords(
      [
        ...Array.from({ length: 8 }, (_, i) =>
          createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'higher-sim-unreliable', success: false, eventId: `f${i}` })),
        ...Array.from({ length: 8 }, (_, i) =>
          createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'lower-sim-reliable', success: true, eventId: `s${i}` })),
      ],
      { now: 'n' },
    );

    const reranked = outcomeWeightedRerank(candidates, { fold, reliabilityResolver: betaMean });
    expect(reranked[0].skillId).toBe('lower-sim-reliable');
    expect(reranked[0].shadowScore).toBeGreaterThan(reranked[1].shadowScore);
  });

  it('flag ON keeps a fresh (un-observed) skill at neutral reliability', () => {
    process.env[ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG] = 'on';
    const fold = foldSkillOutcomeRecords(
      [createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'observed', success: true, eventId: 'o1' })],
      { now: 'n' },
    );
    const reranked = outcomeWeightedRerank(
      [{ skillId: 'fresh', similarity: 0.5 }],
      { fold, reliabilityResolver: betaMean },
    );
    expect(reranked[0].reliability).toBe(FRESH_SKILL_RELIABILITY);
  });
});
