// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Lane Weight Zero Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdvisorProjection } from '../lib/scorer/types.js';

const mocks = vi.hoisted(() => ({
  embed: vi.fn(),
  embeddingCoverage: vi.fn(),
  getAdapter: vi.fn(),
  getActiveEmbedder: vi.fn(),
  getDbReadOnly: vi.fn(),
  loadSkillEmbeddings: vi.fn(),
}));

vi.mock('../lib/embedders/registry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/embedders/registry.js')>();
  return {
    ...actual,
    getAdapter: mocks.getAdapter,
  };
});

vi.mock('../lib/embedders/schema.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/embedders/schema.js')>();
  return {
    ...actual,
    getActiveEmbedder: mocks.getActiveEmbedder,
  };
});

vi.mock('../lib/skill-graph/skill-graph-db.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/skill-graph/skill-graph-db.js')>();
  return {
    ...actual,
    embeddingCoverage: mocks.embeddingCoverage,
    getDbReadOnly: mocks.getDbReadOnly,
    loadSkillEmbeddings: mocks.loadSkillEmbeddings,
  };
});

function projectionWith(overrides: Partial<AdvisorProjection>): AdvisorProjection {
  return {
    skills: [{
      id: 'semantic-skill',
      kind: 'skill',
      family: 'system',
      category: 'test',
      name: 'semantic-skill',
      description: 'semantic token overlap only',
      keywords: [],
      domains: [],
      intentSignals: [],
      derivedTriggers: [],
      derivedKeywords: [],
      sourcePath: '.skilled/skills/semantic-skill/graph-metadata.json',
      lifecycleStatus: 'active',
    }],
    edges: [],
    generatedAt: '2026-11-20T00:00:00.000Z',
    source: 'sqlite',
    ...overrides,
  } as AdvisorProjection;
}

const STALE = {
  embeddingStaleness: {
    stale: true,
    reason: "projection model 'old-model' != active 'new-model'",
    active: null,
    stored: null,
    vectorCount: 1,
    modelIds: ['old-model'],
  },
} as Partial<AdvisorProjection>;

describe('semantic lane weight zero', () => {
  beforeEach(() => {
    vi.stubEnv('VITEST', 'false');
    vi.stubEnv('SPECKIT_ADVISOR_LANE_WEIGHTS_JSON', undefined);
    for (const mock of Object.values(mocks)) {
      mock.mockReset();
    }

    mocks.getDbReadOnly.mockReturnValue({ name: 'mocked-read-only-database' });
    mocks.getActiveEmbedder.mockReturnValue({ name: 'nomic-embed-text:v1.5', dim: 2 });
    mocks.getAdapter.mockReturnValue({
      name: 'nomic-embed-text:v1.5',
      dim: 2,
      backend: 'ollama',
      embed: mocks.embed,
    });
    mocks.embed.mockResolvedValue([new Float32Array([1, 0])]);
    mocks.loadSkillEmbeddings.mockReturnValue([]);
    mocks.embeddingCoverage.mockReturnValue({ complete: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('skips embedding when the lane weight is zero', async () => {
    vi.resetModules();
    const {
      getSemanticShadowRuntimeHealth,
      withSemanticShadowPromptEmbedding,
    } = await import('../lib/scorer/lanes/semantic-shadow.js');

    const result = await withSemanticShadowPromptEmbedding('route this prompt', () => 1);

    expect(result).toBe(1);
    expect(mocks.embed).toHaveBeenCalledTimes(0);
    expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('lane_weight_zero');
  });

  it('embeds when the lane has a positive weight override', async () => {
    vi.stubEnv('SPECKIT_ADVISOR_LANE_WEIGHTS_JSON', '{"semantic_shadow":0.05}');
    vi.resetModules();
    const { withSemanticShadowPromptEmbedding } = await import('../lib/scorer/lanes/semantic-shadow.js');

    const result = await withSemanticShadowPromptEmbedding('route this prompt', () => 1);

    expect(result).toBe(1);
    expect(mocks.embed).toHaveBeenCalledTimes(1);
  });

  it('keeps the zero-weight reason and the live total when the projection is stale', async () => {
    vi.resetModules();
    const lane = await import('../lib/scorer/lanes/semantic-shadow.js');
    const { scoreAdvisorPrompt } = await import('../lib/scorer/fusion.js');
    const projection = projectionWith(STALE);

    await lane.withSemanticShadowPromptEmbedding('semantic token overlap only', () => 1);
    lane.scoreSemanticShadowLane('semantic token overlap only', projection);
    lane.scoreSemanticShadowExactSubset('semantic token overlap only', projection, ['semantic-skill']);
    expect(lane.getSemanticShadowRuntimeHealth().disabledReason).toBe('lane_weight_zero');

    const result = scoreAdvisorPrompt('semantic token overlap only', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });
    expect(result.metrics.degradedLanes ?? []).not.toContain('semantic_shadow');
  });

  it('checks coverage before it pays for a prompt embed', async () => {
    vi.stubEnv('SPECKIT_ADVISOR_LANE_WEIGHTS_JSON', '{"semantic_shadow":0.05}');
    mocks.embeddingCoverage.mockReturnValue({ complete: false });
    vi.resetModules();
    const lane = await import('../lib/scorer/lanes/semantic-shadow.js');

    await lane.withSemanticShadowPromptEmbedding('route this prompt', () => 1);

    expect(mocks.embed).toHaveBeenCalledTimes(0);
    expect(lane.getSemanticShadowRuntimeHealth().disabledReason).toBe('incomplete_skill_vectors');
    const { mergeSemanticShadowRuntimeLaneHealth } = await import('../handlers/advisor-recommend.js');
    for (const reason of ['incomplete_skill_vectors', 'dim_mismatch', 'adapter_unavailable', 'database_absent']) {
      expect(mergeSemanticShadowRuntimeLaneHealth(undefined, reason)?.semantic_shadow)
        .toEqual({ status: 'runtime_degraded', reason });
    }
    expect(mergeSemanticShadowRuntimeLaneHealth(undefined, 'lane_weight_zero')?.semantic_shadow).toBeUndefined();
  });

  it('refuses an exact rerank while coverage is incomplete', async () => {
    vi.stubEnv('SPECKIT_ADVISOR_LANE_WEIGHTS_JSON', '{"semantic_shadow":0.05}');
    vi.resetModules();
    const lane = await import('../lib/scorer/lanes/semantic-shadow.js');
    mocks.loadSkillEmbeddings.mockReturnValue([{ skillId: 'semantic-skill', embedding: new Float32Array([1, 0]) }]);
    lane.setSemanticShadowPromptEmbedding('route this prompt', new Float32Array([1, 0]));
    const projection = projectionWith({});

    expect(lane.scoreSemanticShadowExactSubset('route this prompt', projection, ['semantic-skill'])).toHaveLength(1);

    mocks.embeddingCoverage.mockReturnValue({ complete: false });
    expect(lane.scoreSemanticShadowExactSubset('route this prompt', projection, ['semantic-skill'])).toEqual([]);
    expect(lane.getSemanticShadowRuntimeHealth().disabledReason).toBe('incomplete_skill_vectors');
  });
});
