// ───────────────────────────────────────────────────────────────
// MODULE: Outcome-Weighted Ranking Follow-On Tests
// ───────────────────────────────────────────────────────────────
// Covers the shadow-only build: execution-success record (distinct from
// recommendation-acceptance), the durable store + replay-safe fold, the
// idempotent ambient-tick, the outcome-weighted shadow re-rank over a Beta
// adapter seam, query-scored failure-mode recall, the live-sort guardrail, and
// the default-off query-length BM25 calibration.

import { mkdtempSync, rmSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createAdvisorHookOutcomeRecord,
  createSkillExecutionOutcomeRecord,
  validateSkillExecutionOutcomeRecord,
} from '../../lib/metrics.js';
import {
  appendSkillExecutionOutcome,
  foldSkillOutcomeRecords,
  foldSkillOutcomeStore,
  readSkillExecutionOutcomeRecords,
  recallSkillFailureModes,
  recordSkillExecutionOutcome,
  skillOutcomeStorePath,
  tickSkillOutcomeFold,
  type SkillOutcomeFold,
} from '../../lib/scorer/skill-outcome-store.js';
import {
  FRESH_SKILL_RELIABILITY,
  isAdvisorOutcomeWeightedRerankEnabled,
  outcomeWeightedRerank,
  type ReliabilityResolver,
} from '../../lib/scorer/outcome-weighted-rerank.js';
import {
  ADVISOR_BM25_QUERY_LENGTH_CALIBRATION_FLAG,
  BM25_DEFAULT_LOGISTIC_MIDPOINT,
  resolveBm25LogisticMidpoint,
  scoreBm25LexicalShadowLane,
} from '../../lib/scorer/lanes/bm25.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

const STORE_DIR_ENV = 'SPECKIT_ADVISOR_OUTCOME_STORE_DIR';
const RERANK_FLAG = 'SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK';
const WORKSPACE = '/tmp/fixture-workspace';

let storeDir: string;

beforeEach(() => {
  storeDir = mkdtempSync(join(tmpdir(), 'advisor-outcome-store-'));
  process.env[STORE_DIR_ENV] = storeDir;
  delete process.env[ADVISOR_BM25_QUERY_LENGTH_CALIBRATION_FLAG];
  delete process.env[RERANK_FLAG];
});

afterEach(() => {
  delete process.env[STORE_DIR_ENV];
  delete process.env[ADVISOR_BM25_QUERY_LENGTH_CALIBRATION_FLAG];
  delete process.env[RERANK_FLAG];
  rmSync(storeDir, { recursive: true, force: true });
});

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

// Reference Beta-posterior mean used ONLY in tests to exercise the blend. The
// production resolver is the shared primitive (owned by the sibling sub-phase);
// the adapter seam stays neutral until it is wired.
const A0 = 1;
const B0 = 1;
const betaMeanResolver: ReliabilityResolver = ({ success, failure }) =>
  (A0 + success) / (A0 + B0 + success + failure);

describe('execution-success record (distinct from recommendation acceptance)', () => {
  it('carries execution success, not an acceptance verb', () => {
    const record = createSkillExecutionOutcomeRecord({
      runtime: 'claude',
      skillId: 'sk-code',
      success: false,
      eventId: 'evt-1',
      failureMode: 'wrong-surface',
      contextTags: ['webflow', 'css'],
    });
    expect(record.success).toBe(false);
    expect(record.skillId).toBe('sk-code');
    expect(record.failureMode).toBe('wrong-surface');
    expect(record.contextTags).toEqual(['webflow', 'css']);
    expect(validateSkillExecutionOutcomeRecord(record)).toBe(true);
    // The new record has no acceptance verb field; the two contracts are distinct.
    expect('outcome' in record).toBe(false);
  });

  it('leaves the acceptance record builder unchanged', () => {
    const acceptance = createAdvisorHookOutcomeRecord({
      runtime: 'claude',
      outcome: 'accepted',
      skillLabel: 'sk-code',
    });
    expect(acceptance.outcome).toBe('accepted');
    expect('success' in acceptance).toBe(false);
  });

  it('bounds and dedupes context tags', () => {
    const record = createSkillExecutionOutcomeRecord({
      runtime: 'codex',
      skillId: 'a',
      success: true,
      eventId: 'e',
      contextTags: ['x', 'x', 'y'],
    });
    expect(record.contextTags).toEqual(['x', 'y']);
  });
});

describe('skill-outcome store fold — replay-safe and order-independent', () => {
  it('dedupes by eventId so replay folds to the same counts', () => {
    const base = { runtime: 'claude' as const, skillId: 'alpha', success: true };
    const records = [
      createSkillExecutionOutcomeRecord({ ...base, eventId: 'e1' }),
      createSkillExecutionOutcomeRecord({ ...base, eventId: 'e1' }), // double-delivery
      createSkillExecutionOutcomeRecord({ ...base, eventId: 'e2' }),
      createSkillExecutionOutcomeRecord({ ...base, eventId: 'e2' }), // replay
    ];
    const fold = foldSkillOutcomeRecords(records, { now: 'fixed' });
    expect(fold.recordCount).toBe(2);
    expect(fold.bySkill.alpha.success).toBe(2);
    expect(fold.bySkill.alpha.failure).toBe(0);
  });

  it('folds order-independently', () => {
    const a = createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 's', success: true, eventId: 'a' });
    const b = createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 's', success: false, eventId: 'b' });
    const c = createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 's', success: true, eventId: 'c' });
    const forward = foldSkillOutcomeRecords([a, b, c], { now: 'x' });
    const reversed = foldSkillOutcomeRecords([c, b, a], { now: 'x' });
    expect(reversed).toEqual(forward);
    expect(forward.bySkill.s.success).toBe(2);
    expect(forward.bySkill.s.failure).toBe(1);
  });

  it('skips poison rows defensively', async () => {
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 's', success: true, eventId: 'ok' });
    appendFileSync(skillOutcomeStorePath(WORKSPACE), 'not-json\n{"partial":true}\n', 'utf8');
    const records = readSkillExecutionOutcomeRecords(WORKSPACE);
    expect(records).toHaveLength(1);
    expect(records[0].eventId).toBe('ok');
  });
});

describe('idempotent ambient-tick cadence', () => {
  it('first tick writes; an unchanged re-tick is a no-op; new data writes again', async () => {
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 's', success: true, eventId: 'e1' });

    const first = await tickSkillOutcomeFold(WORKSPACE, { now: 't1' });
    expect(first.changed).toBe(true);
    expect(first.locked).toBe(false);
    expect(first.fold?.recordCount).toBe(1);

    const second = await tickSkillOutcomeFold(WORKSPACE, { now: 't2' });
    expect(second.changed).toBe(false); // no-op: data identical despite new stamp
    expect(second.locked).toBe(false);

    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 's', success: false, eventId: 'e2' });
    const third = await tickSkillOutcomeFold(WORKSPACE, { now: 't3' });
    expect(third.changed).toBe(true);
    expect(third.fold?.bySkill.s.failure).toBe(1);
  });

  it('folds the live store from disk', async () => {
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'x', success: true, eventId: '1' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'x', success: false, eventId: '2' });
    const fold = foldSkillOutcomeStore(WORKSPACE, { now: 'n' });
    expect(fold.bySkill.x.total).toBe(2);
  });
});

describe('outcome-weighted shadow re-rank', () => {
  const candidates = [
    { skillId: 'alpha', similarity: 0.5 },
    { skillId: 'beta', similarity: 0.5 },
  ];

  it('is off by default', () => {
    expect(isAdvisorOutcomeWeightedRerankEnabled()).toBe(false);
  });

  it('empty store / fresh skills preserve similarity order (blend == pure similarity)', () => {
    const ranked = outcomeWeightedRerank(
      [
        { skillId: 'low', similarity: 0.2 },
        { skillId: 'high', similarity: 0.9 },
        { skillId: 'mid', similarity: 0.5 },
      ],
      { reliabilityResolver: betaMeanResolver },
    );
    expect(ranked.map((r) => r.skillId)).toEqual(['high', 'mid', 'low']);
    expect(ranked.every((r) => r.reliability === FRESH_SKILL_RELIABILITY)).toBe(true);
  });

  it('boosts a reliably-successful skill over an equally-similar failing one', () => {
    const fold = foldSkillOutcomeRecords([
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'alpha', success: true, eventId: 'a1' }),
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'beta', success: false, eventId: 'b1' }),
    ], { now: 'n' });
    const ranked = outcomeWeightedRerank(candidates, { fold, reliabilityResolver: betaMeanResolver });
    expect(ranked[0].skillId).toBe('alpha');
    expect(ranked[0].reliability).toBeGreaterThan(ranked[1].reliability);
  });

  it('anti-flood: a high-count posterior cannot reach certainty and outranks a low-count one', () => {
    const records = [];
    for (let i = 0; i < 100; i += 1) {
      records.push(createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'high', success: true, eventId: `h${i}` }));
    }
    records.push(createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'low', success: true, eventId: 'l1' }));
    const fold = foldSkillOutcomeRecords(records, { now: 'n' });
    const ranked = outcomeWeightedRerank(
      [{ skillId: 'high', similarity: 0.5 }, { skillId: 'low', similarity: 0.5 }],
      { fold, reliabilityResolver: betaMeanResolver },
    );
    const high = ranked.find((r) => r.skillId === 'high')!;
    const low = ranked.find((r) => r.skillId === 'low')!;
    expect(high.reliability).toBeGreaterThan(low.reliability);
    expect(high.reliability).toBeLessThan(1); // anti-flood: never certain
    expect(low.reliability).toBeGreaterThan(FRESH_SKILL_RELIABILITY);
  });

  it('keeps a fresh skill at neutral even when a resolver is supplied', () => {
    const fold = foldSkillOutcomeRecords([
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'seen', success: true, eventId: 's1' }),
    ], { now: 'n' });
    const ranked = outcomeWeightedRerank(
      [{ skillId: 'fresh', similarity: 0.5 }],
      { fold, reliabilityResolver: betaMeanResolver },
    );
    expect(ranked[0].reliability).toBe(FRESH_SKILL_RELIABILITY);
  });
});

describe('query-scored failure-mode recall (advisory only)', () => {
  it('ranks the mode whose recorded context matches the query', () => {
    const fold = foldSkillOutcomeRecords([
      createSkillExecutionOutcomeRecord({
        runtime: 'claude', skillId: 'alpha', success: false, eventId: 'f1',
        failureMode: 'timeout', contextTags: ['network', 'upload'],
      }),
      createSkillExecutionOutcomeRecord({
        runtime: 'claude', skillId: 'alpha', success: false, eventId: 'f2',
        failureMode: 'bad-output', contextTags: ['css', 'layout'],
      }),
    ], { now: 'n' });
    const recall = recallSkillFailureModes(fold, 'alpha', 'css layout broken');
    expect(recall[0].failureMode).toBe('bad-output');
    expect(recall[0].score).toBeGreaterThan(recall[1].score);
  });

  it('returns nothing for an unknown skill', () => {
    const fold: SkillOutcomeFold = { generatedAt: 'n', recordCount: 0, bySkill: {} };
    expect(recallSkillFailureModes(fold, 'nope', 'anything')).toEqual([]);
  });
});

describe('shadow-only guardrail — live fused sort byte-identical', () => {
  it('live recommendations are unchanged whether or not the store has data', async () => {
    const projection = createFixtureProjection([
      skill({ id: 'sk-code', keywords: ['code', 'implement'], domains: ['engineering'] }),
      skill({ id: 'sk-doc', keywords: ['docs', 'markdown'], domains: ['writing'] }),
    ]);
    const prompt = 'implement code changes';

    const before = scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE, projection });

    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'sk-doc', success: true, eventId: 'g1' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'sk-code', success: false, eventId: 'g2' });
    await tickSkillOutcomeFold(WORKSPACE, { now: 'n' });

    const after = scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE, projection });
    expect(JSON.stringify(after.recommendations)).toBe(JSON.stringify(before.recommendations));
    expect(after.topSkill).toBe(before.topSkill);
  });
});

describe('ADV-bm25-calibration — default-off, query-length-bucketed', () => {
  it('default-off resolves the fixed midpoint for every query length', () => {
    expect(resolveBm25LogisticMidpoint(1, false)).toBe(BM25_DEFAULT_LOGISTIC_MIDPOINT);
    expect(resolveBm25LogisticMidpoint(7, false)).toBe(BM25_DEFAULT_LOGISTIC_MIDPOINT);
  });

  it('buckets the midpoint by query length when enabled', () => {
    expect(resolveBm25LogisticMidpoint(0, true)).toBe(4); // degenerate -> default bucket
    expect(resolveBm25LogisticMidpoint(1, true)).toBe(2); // single-token
    expect(resolveBm25LogisticMidpoint(3, true)).toBe(4); // medium
    expect(resolveBm25LogisticMidpoint(5, true)).toBe(8); // long
  });

  it('lane output is byte-identical to the pre-calibration squash when off', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', keywords: ['css', 'animation'], domains: ['frontend'] }),
    ]);
    const matches = scoreBm25LexicalShadowLane('css', projection, { queryLengthCalibration: false });
    for (const match of matches) {
      const expected = Number((match.rawScore / (match.rawScore + 4)).toFixed(6));
      expect(match.score).toBe(expected);
      expect(match.shadowOnly).toBe(true);
    }
  });

  it('a single-token query produces a different squash when calibration is on', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', keywords: ['css', 'animation', 'motion'], domains: ['frontend'] }),
    ]);
    const off = scoreBm25LexicalShadowLane('css', projection, { queryLengthCalibration: false });
    const on = scoreBm25LexicalShadowLane('css', projection, { queryLengthCalibration: true });
    expect(on).toHaveLength(off.length);
    expect(on.length).toBeGreaterThan(0);
    // Single-token query uses the lower midpoint -> a strictly higher squashed score.
    expect(on[0].score).toBeGreaterThan(off[0].score);
    expect(on[0].shadowOnly).toBe(true);
  });
});
