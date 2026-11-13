// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Prompt Embedding Degrade Tests
// ───────────────────────────────────────────────────────────────
// Matrix axes: server reachable or absent, model pulled or missing, answer
// inside or past the deadline, model warm or cold. Seven rows:
// 1. warm answer inside the deadline, scored with a cosine
// 2. cold answer at 300 ms, still inside the deadline, scored with a cosine
// 3. absent server, reported as prompt_embedding_unreachable
// 4. missing model, reported as prompt_embedding_model_missing
// 5. an answer that never arrives, returned inside the deadline plus 100 ms
// 6. a generic failure reported as prompt_embedding_failed, whose result
//    equals the result of a call made with no embedder at all
// 7. the warning carries the reason a degraded lane fell back, and is empty
//    when the lane answered

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  embed: vi.fn(),
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
    getDbReadOnly: mocks.getDbReadOnly,
    loadSkillEmbeddings: mocks.loadSkillEmbeddings,
  };
});

import { semanticLaneOffWarning } from '../handlers/advisor-recommend.js';
import {
  OllamaAdapterError,
  OllamaBackendUnreachableError,
  OllamaModelNotLoadedError,
} from '../lib/embedders/adapters/ollama.js';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import {
  PROMPT_EMBEDDING_DEADLINE_MS,
  getSemanticShadowRuntimeHealth,
  withSemanticShadowPromptEmbedding,
} from '../lib/scorer/lanes/semantic-shadow.js';
import type { AdvisorProjection, AdvisorScoringResult, SkillProjection } from '../lib/scorer/types.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const PROMPT = 'measure the local meaning runner';
const WARM_VECTOR = new Float32Array([1, 0]);
const COLD_DELAY_MS = 300;
const DEADLINE_SLACK_MS = 100;

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
    sourcePath: null,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

// A sqlite-source projection keeps the real scoring path: no fixture vectors
// stand in for the prompt or the skills, so only the injected adapter and the
// mocked skill rows can produce a cosine.
const projection: AdvisorProjection = {
  skills: [
    skill({ id: 'alpha-skill', description: 'local meaning runner' }),
    skill({ id: 'beta-skill', description: 'unrelated other work' }),
  ],
  edges: [],
  generatedAt: '2026-11-12T00:00:00.000Z',
  source: 'sqlite',
};

function score(): AdvisorScoringResult {
  return scoreAdvisorPrompt(PROMPT, {
    workspaceRoot: process.cwd(),
    projection,
    includeAllCandidates: true,
  });
}

function semanticEvidence(result: AdvisorScoringResult, skillId: string): readonly string[] {
  const recommendation = result.recommendations.find((entry) => entry.skill === skillId);
  expect(recommendation).toBeDefined();
  return recommendation?.laneContributions.find((entry) => entry.lane === 'semantic_shadow')?.evidence ?? [];
}

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('semantic prompt embedding degrade matrix', () => {
  beforeEach(() => {
    vi.stubEnv('VITEST', 'false');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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
    mocks.loadSkillEmbeddings.mockReturnValue([
      { skillId: 'alpha-skill', embedding: new Float32Array([1, 0]), modelId: 'nomic-embed-text-v1.5', contentHash: 'hash-alpha' },
      { skillId: 'beta-skill', embedding: new Float32Array([0, 1]), modelId: 'nomic-embed-text-v1.5', contentHash: 'hash-beta' },
    ]);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('scores a warm answer with a cosine', async () => {
    mocks.embed.mockResolvedValue([WARM_VECTOR]);

    const result = await withSemanticShadowPromptEmbedding(PROMPT, score);

    expect(mocks.embed).toHaveBeenCalledWith([PROMPT], { inputType: 'query' });
    expect(semanticEvidence(result, 'alpha-skill')).toContain('cosine:1.0000');
    expect(getSemanticShadowRuntimeHealth().disabledReason).toBeNull();
  });

  it('scores a cold answer at 300 ms with a cosine', async () => {
    mocks.embed.mockImplementation(() => new Promise<Float32Array[]>((resolve) => {
      setTimeout(() => resolve([WARM_VECTOR]), COLD_DELAY_MS);
    }));

    const startedAt = performance.now();
    const result = await withSemanticShadowPromptEmbedding(PROMPT, score);
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeGreaterThanOrEqual(COLD_DELAY_MS);
    expect(elapsedMs).toBeLessThan(PROMPT_EMBEDDING_DEADLINE_MS);
    expect(semanticEvidence(result, 'alpha-skill')).toContain('cosine:1.0000');
    expect(getSemanticShadowRuntimeHealth().disabledReason).toBeNull();
  });

  it('reports an absent server and scores without the cosine lane', async () => {
    mocks.embed.mockRejectedValue(new OllamaBackendUnreachableError('http://127.0.0.1:11434'));

    const result = await withSemanticShadowPromptEmbedding(PROMPT, score);

    expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('prompt_embedding_unreachable');
    expect(semanticEvidence(result, 'alpha-skill')).toEqual([]);
  });

  it('reports a missing model and scores without the cosine lane', async () => {
    mocks.embed.mockRejectedValue(new OllamaModelNotLoadedError('nomic-embed-text:v1.5'));

    const result = await withSemanticShadowPromptEmbedding(PROMPT, score);

    expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('prompt_embedding_model_missing');
    expect(semanticEvidence(result, 'alpha-skill')).toEqual([]);
  });

  it('returns inside the deadline plus 100 ms when no answer arrives', async () => {
    mocks.embed.mockImplementation(() => new Promise<Float32Array[]>(() => {}));

    const startedAt = performance.now();
    const result = await withSemanticShadowPromptEmbedding(PROMPT, score);
    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(PROMPT_EMBEDDING_DEADLINE_MS + DEADLINE_SLACK_MS);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('prompt_embedding_timeout');
  });

  it('leaves the result equal to the no-embedder result after a failure', async () => {
    mocks.embed.mockRejectedValue(new OllamaAdapterError('embedding failed'));

    const noEmbedder = score();
    const degraded = await withSemanticShadowPromptEmbedding(PROMPT, score);

    expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('prompt_embedding_failed');
    expect(degraded).toEqual(noEmbedder);
  });

  it('warns with the reason a degraded lane fell back', () => {
    expect(semanticLaneOffWarning('prompt_embedding_unreachable')).toEqual([
      'semantic_lane_off:prompt_embedding_unreachable',
    ]);
    expect(semanticLaneOffWarning(null)).toEqual([]);
  });
});
