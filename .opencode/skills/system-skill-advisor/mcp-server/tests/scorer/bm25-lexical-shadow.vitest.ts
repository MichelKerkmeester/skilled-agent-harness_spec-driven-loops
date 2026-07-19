// ───────────────────────────────────────────────────────────────
// MODULE: Advisor BM25 Lexical Shadow Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  ADVISOR_BM25_FIELD_WEIGHTS,
  AdvisorPackedBm25Index,
  scoreBm25LexicalShadowLane,
} from '../../lib/scorer/lanes/bm25.js';
import { scoreLexicalLane, scoreLexicalShadowLanes } from '../../lib/scorer/lanes/lexical.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';
import { INTENT_PROMPT_CORPUS } from './fixtures/intent-prompt-corpus.js';

const BM25_SHADOW_ENV = 'SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW';
const ORIGINAL_BM25_SHADOW = process.env[BM25_SHADOW_ENV];

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

afterEach(() => {
  if (ORIGINAL_BM25_SHADOW === undefined) {
    delete process.env[BM25_SHADOW_ENV];
  } else {
    process.env[BM25_SHADOW_ENV] = ORIGINAL_BM25_SHADOW;
  }
});

describe('advisor packed BM25 lexical shadow lane', () => {
  it('is default-off and does not change live scorer output when the flag is enabled', () => {
    const projection = createFixtureProjection([
      skill({ id: 'sk-code', description: 'TypeScript implementation and tests', keywords: ['typescript', 'vitest'] }),
      skill({ id: 'sk-doc', description: 'Documentation and markdown writing', keywords: ['markdown', 'docs'] }),
      skill({ id: 'system-spec-kit', description: 'Spec folders and task tracking', keywords: ['spec', 'tasks'] }),
    ]);
    const prompt = 'implement the TypeScript vitest scorer change';
    delete process.env[BM25_SHADOW_ENV];

    const flagOffShadow = scoreLexicalShadowLanes(prompt, projection);
    const flagOffLive = JSON.stringify(scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    }));

    process.env[BM25_SHADOW_ENV] = '1';
    const flagOnShadow = scoreLexicalShadowLanes(prompt, projection);
    const flagOnLive = JSON.stringify(scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    }));

    expect(flagOffShadow.bm25).toEqual([]);
    expect(flagOnShadow.bm25.length).toBeGreaterThan(0);
    expect(flagOnShadow.bm25.every((match) => match.shadowOnly)).toBe(true);
    expect(flagOnLive).toBe(flagOffLive);
  });

  it('applies query-time BM25F weights so name and keywords beat repeated description text', () => {
    const projection = createFixtureProjection([
      skill({ id: 'name-hit', name: 'Auth Guard', description: 'single strong field' }),
      skill({ id: 'keyword-hit', keywords: ['auth guard'], description: 'keyword field' }),
      skill({ id: 'description-hit', name: 'Generic Helper', description: 'auth guard auth guard' }),
    ]);

    const weighted = scoreBm25LexicalShadowLane('auth guard', projection, { limit: 3 });
    const flat = scoreBm25LexicalShadowLane('auth guard', projection, {
      limit: 3,
      fieldWeights: {
        name: 1,
        keywords: 1,
        domains: 1,
        intentSignals: 1,
        derivedTriggers: 1,
        description: 1,
      },
    });

    expect(ADVISOR_BM25_FIELD_WEIGHTS.name).toBeGreaterThan(ADVISOR_BM25_FIELD_WEIGHTS.keywords);
    expect(ADVISOR_BM25_FIELD_WEIGHTS.keywords).toBeGreaterThan(ADVISOR_BM25_FIELD_WEIGHTS.description);
    expect(weighted[0].skillId).toBe('name-hit');
    expect(weighted[1].skillId).toBe('keyword-hit');
    expect(flat[0].skillId).toBe('description-hit');
  });

  it('indexes derived triggers as a field without promoting them above authored name or keywords', () => {
    const projection = createFixtureProjection([
      skill({ id: 'derived-route', derivedTriggers: ['nightly browser smoke'] }),
      skill({ id: 'keyword-route', keywords: ['nightly browser smoke'] }),
    ]);

    const matches = scoreBm25LexicalShadowLane('nightly browser smoke', projection, { limit: 2 });

    expect(matches.map((match) => match.skillId)).toEqual(['keyword-route', 'derived-route']);
    expect(matches.find((match) => match.skillId === 'derived-route')?.evidence).toContain('field:derivedTriggers');
  });

  it('packs postings into typed arrays and clears mutable warmup arrays', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', name: 'Alpha Router', keywords: ['routing alpha'] }),
      skill({ id: 'beta', name: 'Beta Router', description: 'routing beta beta' }),
    ]);
    const index = new AdvisorPackedBm25Index(projection.skills);
    const stats = index.getFootprintStats();

    expect(stats.documentCount).toBe(2);
    expect(stats.termCount).toBeGreaterThan(0);
    expect(stats.postingCount).toBeGreaterThan(0);
    expect(stats.typedArrayBytes).toBeGreaterThan(0);
    expect(stats.mutablePostingCount).toBe(0);
  });

  it('matches or beats the current lexical lane on exact-label advisor corpus prompts', () => {
    const expectedSkills = [...new Set(INTENT_PROMPT_CORPUS.map((item) => item.expectedSkill))];
    const projection = createFixtureProjection(expectedSkills.map((id) => skill({
      id,
      name: id,
      description: `${id} advisor routing target`,
      keywords: [id, id.replace(/-/g, ' ')],
      intentSignals: [id, `use ${id}`],
    })));
    const exactLabelCases = INTENT_PROMPT_CORPUS.filter((item) => item.prompt.includes(item.expectedSkill));

    let lexicalHits = 0;
    let bm25Hits = 0;
    for (const item of exactLabelCases) {
      if (scoreLexicalLane(item.prompt, projection)[0]?.skillId === item.expectedSkill) lexicalHits += 1;
      if (scoreBm25LexicalShadowLane(item.prompt, projection, { limit: 1 })[0]?.skillId === item.expectedSkill) bm25Hits += 1;
    }

    expect(exactLabelCases.length).toBeGreaterThan(0);
    expect(bm25Hits).toBeGreaterThanOrEqual(lexicalHits);
  });
});
