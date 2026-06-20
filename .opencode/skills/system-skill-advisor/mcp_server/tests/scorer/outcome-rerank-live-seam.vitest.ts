// ───────────────────────────────────────────────────────────────
// MODULE: Outcome-Weighted Rerank — Live Near-Tie Seam + Beta Resolver
// ───────────────────────────────────────────────────────────────
// The sibling suites prove the pure rerank function and the flag predicate. This
// suite closes two newly-wired gaps:
//   1. The production default resolver is now the shared Beta posterior (not the
//      flat neutral seam), so an observed reliable skill outranks an observed
//      unreliable one at equal similarity.
//   2. scoreAdvisorPrompt's live fused sort consults the durable outcome ledger
//      at a NEAR-TIE window only when the flag is ON — and stays byte-identical
//      when the flag is OFF or the ledger is empty.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createSkillExecutionOutcomeRecord } from '../../lib/metrics.js';
import {
  readSkillOutcomeFoldSnapshot,
  recordSkillExecutionOutcome,
  tickSkillOutcomeFold,
} from '../../lib/scorer/skill-outcome-store.js';
import {
  ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG,
  betaReliabilityResolver,
  isAdvisorOutcomeWeightedRerankEnabled,
  neutralReliabilityResolver,
  outcomeWeightedRerank,
} from '../../lib/scorer/outcome-weighted-rerank.js';
import { foldSkillOutcomeRecords } from '../../lib/scorer/skill-outcome-store.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

const STORE_DIR_ENV = 'SPECKIT_ADVISOR_OUTCOME_STORE_DIR';
const RERANK_FLAG = ADVISOR_OUTCOME_WEIGHTED_RERANK_FLAG;
const WORKSPACE = '/tmp/fixture-workspace-outcome-live';

let storeDir: string;

beforeEach(() => {
  storeDir = mkdtempSync(join(tmpdir(), 'advisor-outcome-live-'));
  process.env[STORE_DIR_ENV] = storeDir;
  delete process.env[RERANK_FLAG];
});

afterEach(() => {
  delete process.env[STORE_DIR_ENV];
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

describe('production Beta reliability resolver is the default', () => {
  it('an observed reliable skill outranks an equally-similar observed-unreliable one with NO explicit resolver', () => {
    // No reliabilityResolver passed — exercises the production default, which is
    // now the shared Beta posterior, not the flat neutral seam.
    const fold = foldSkillOutcomeRecords([
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'reliable', success: true, eventId: 'r1' }),
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'reliable', success: true, eventId: 'r2' }),
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'unreliable', success: false, eventId: 'u1' }),
      createSkillExecutionOutcomeRecord({ runtime: 'claude', skillId: 'unreliable', success: false, eventId: 'u2' }),
    ], { now: 'n' });
    const ranked = outcomeWeightedRerank(
      [{ skillId: 'reliable', similarity: 0.5 }, { skillId: 'unreliable', similarity: 0.5 }],
      { fold },
    );
    expect(ranked[0].skillId).toBe('reliable');
    expect(ranked[0].reliability).toBeGreaterThan(ranked[1].reliability);
    // Anti-flood: the Beta posterior never reaches certainty.
    expect(ranked[0].reliability).toBeLessThan(1);
  });

  it('the Beta resolver matches the closed-form posterior mean; the neutral seam stays flat', () => {
    expect(betaReliabilityResolver({ success: 3, failure: 1 })).toBeCloseTo((1 + 3) / (1 + 1 + 3 + 1), 6);
    expect(betaReliabilityResolver({ success: 0, failure: 0 })).toBeCloseTo(0.5, 6);
    expect(neutralReliabilityResolver({ success: 9, failure: 0 })).toBe(0.5);
  });
});

describe('live fused sort — near-tie outcome rerank seam', () => {
  // Two skills that fire identically on a shared route → a genuine near-tie the
  // similarity-only sort breaks alphabetically.
  const projection = createFixtureProjection([
    skill({ id: 'aaa-route', keywords: ['shared route'], intentSignals: ['shared route'] }),
    skill({ id: 'zzz-route', keywords: ['shared route'], intentSignals: ['shared route'] }),
  ]);
  const prompt = 'shared route please';

  async function seedLedger(): Promise<void> {
    // zzz-route has the strong observed track record; aaa-route fails.
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'zzz-route', success: true, eventId: 'z1' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'zzz-route', success: true, eventId: 'z2' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'zzz-route', success: true, eventId: 'z3' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'aaa-route', success: false, eventId: 'a1' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'aaa-route', success: false, eventId: 'a2' });
    await recordSkillExecutionOutcome(WORKSPACE, { runtime: 'claude', skillId: 'aaa-route', success: false, eventId: 'a3' });
    await tickSkillOutcomeFold(WORKSPACE, { now: 'n' });
  }

  function rank(): readonly string[] {
    return scoreAdvisorPrompt(prompt, {
      workspaceRoot: WORKSPACE,
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    }).recommendations.map((recommendation) => recommendation.skill);
  }

  it('flag OFF: the near-tie keeps the similarity-only (alphabetical) order even with a seeded ledger', async () => {
    await seedLedger();
    const ranked = rank();
    expect(ranked.indexOf('aaa-route')).toBeLessThan(ranked.indexOf('zzz-route'));
  });

  it('flag ON: the reliable skill overtakes the equally-scored unreliable one at the near-tie', async () => {
    await seedLedger();
    process.env[RERANK_FLAG] = 'true';
    expect(isAdvisorOutcomeWeightedRerankEnabled()).toBe(true);
    // The durable fold the live sort will read holds the seeded outcomes.
    const snap = readSkillOutcomeFoldSnapshot(WORKSPACE);
    expect(snap?.bySkill['zzz-route']?.success).toBe(3);
    expect(snap?.bySkill['aaa-route']?.failure).toBe(3);
    const ranked = rank();
    expect(ranked.indexOf('zzz-route')).toBeLessThan(ranked.indexOf('aaa-route'));
  });

  it('flag ON but EMPTY ledger: order is byte-identical to flag OFF (no live impact without data)', () => {
    const off = scoreAdvisorPrompt(prompt, {
      workspaceRoot: WORKSPACE,
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    });
    process.env[RERANK_FLAG] = 'true';
    const onEmpty = scoreAdvisorPrompt(prompt, {
      workspaceRoot: WORKSPACE,
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    });
    expect(JSON.stringify(onEmpty.recommendations)).toBe(JSON.stringify(off.recommendations));
  });
});
