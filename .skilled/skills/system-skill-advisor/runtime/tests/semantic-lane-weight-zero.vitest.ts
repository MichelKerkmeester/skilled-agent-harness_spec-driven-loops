// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Lane Weight Zero Tests
// ───────────────────────────────────────────────────────────────

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
});
