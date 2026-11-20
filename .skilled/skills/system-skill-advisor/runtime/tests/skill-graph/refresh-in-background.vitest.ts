// ───────────────────────────────────────────────────────────────
// MODULE: Background Skill Embedding Refresh Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  ACTIVE_EMBEDDER_NAME,
  ACTIVE_EMBEDDER_DIM,
  adapterEmbed,
  probeOllamaModel,
  resolveOllamaBaseUrl,
} = vi.hoisted(() => ({
  ACTIVE_EMBEDDER_NAME: 'nomic-embed-text-v1.5',
  ACTIVE_EMBEDDER_DIM: 768,
  adapterEmbed: vi.fn(async (texts: ReadonlyArray<string>) => texts.map(() => new Float32Array(768))),
  probeOllamaModel: vi.fn(async (
    _baseUrl: string,
    _modelName: string,
    _timeoutMs: number,
  ): Promise<{ available: boolean; reason?: string }> => ({ available: true })),
  resolveOllamaBaseUrl: vi.fn(() => 'http://127.0.0.1:11434'),
}));

vi.mock('../../lib/embedders/registry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/embedders/registry.js')>();
  return {
    ...actual,
    getAdapter: vi.fn((name: string) => (name === ACTIVE_EMBEDDER_NAME
      ? {
          name: ACTIVE_EMBEDDER_NAME,
          dim: ACTIVE_EMBEDDER_DIM,
          backend: 'ollama' as const,
          embed: adapterEmbed,
          ready: async () => true,
        }
      : actual.getAdapter(name))),
  };
});

vi.mock('../../lib/embedders/adapters/ollama.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/embedders/adapters/ollama.js')>();
  return {
    ...actual,
    probeOllamaModel,
    resolveOllamaBaseUrl,
  };
});

let tmpRoot = '';
let previousRefreshFlag: string | undefined;
let graphModule: typeof import('../../lib/skill-graph/skill-graph-db.js') | null = null;

function seedSkillTree(rootDir: string, skillName: string, description: string): string {
  const skillDir = join(rootDir, '.skilled', 'skills', skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, 'SKILL.md'),
    [
      '---',
      'title: "' + skillName + '"',
      'description: "' + description + '"',
      '---',
      '',
      '# ' + skillName,
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(skillDir, 'graph-metadata.json'),
    JSON.stringify({
      schema_version: 1,
      skill_id: skillName,
      family: 'system',
      category: 'test-fixture',
      domains: ['test'],
      intent_signals: ['fixture'],
      derived: {},
      edges: {},
    }, null, 2),
  );
  return skillDir;
}

async function prepareGraph(): Promise<{
  graph: typeof import('../../lib/skill-graph/skill-graph-db.js');
  skillRoot: string;
}> {
  vi.resetModules();
  const graph = await import('../../lib/skill-graph/skill-graph-db.js');
  graphModule = graph;
  const { setActiveEmbedder } = await import('../../lib/embedders/schema.js');
  const skillRoot = join(tmpRoot, '.skilled', 'skills');

  graph.initDb(join(tmpRoot, '.skill-graph'));
  seedSkillTree(tmpRoot, 'sk-background-refresh', 'skill used to verify background refresh behavior');
  graph.indexSkillMetadata(skillRoot);
  setActiveEmbedder(graph.getDb(), ACTIVE_EMBEDDER_NAME, ACTIVE_EMBEDDER_DIM);

  return { graph, skillRoot };
}

describe('refreshEmbeddingsInBackground', () => {
  beforeEach(() => {
    previousRefreshFlag = process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH;
    delete process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH;
    tmpRoot = mkdtempSync(join(tmpdir(), 'refresh-in-background-'));
    adapterEmbed.mockClear();
    probeOllamaModel.mockReset();
    probeOllamaModel.mockResolvedValue({ available: true });
    resolveOllamaBaseUrl.mockReset();
    resolveOllamaBaseUrl.mockReturnValue('http://127.0.0.1:11434');
  });

  afterEach(() => {
    graphModule?.closeDb();
    graphModule = null;
    rmSync(tmpRoot, { recursive: true, force: true });
    if (previousRefreshFlag === undefined) {
      delete process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH;
    } else {
      process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH = previousRefreshFlag;
    }
    vi.restoreAllMocks();
  });

  it('returns null when refresh is opted out', async () => {
    const { graph, skillRoot } = await prepareGraph();
    process.env.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH = 'OFF';

    await expect(graph.refreshEmbeddingsInBackground(skillRoot)).resolves.toBeNull();
    expect(probeOllamaModel).not.toHaveBeenCalled();
    expect(adapterEmbed).not.toHaveBeenCalled();
  });

  it('returns null for full coverage without probing or embedding', async () => {
    const { graph, skillRoot } = await prepareGraph();
    await graph.refreshSkillEmbeddings(skillRoot);
    adapterEmbed.mockClear();

    await expect(graph.refreshEmbeddingsInBackground(skillRoot)).resolves.toBeNull();
    expect(probeOllamaModel).not.toHaveBeenCalled();
    expect(adapterEmbed).not.toHaveBeenCalled();
  });

  it('does not refresh rows when the Ollama backend is unavailable', async () => {
    const { graph, skillRoot } = await prepareGraph();
    const reason = 'Ollama backend unreachable';
    probeOllamaModel.mockResolvedValue({ available: false, reason });
    const before = graph.embeddingCoverage();

    await expect(graph.refreshEmbeddingsInBackground(skillRoot)).resolves.toEqual({
      embedded: 0,
      skipped: 0,
      failed: 0,
      warnings: [`embedding backend unavailable: ${reason}`],
    });

    expect(probeOllamaModel).toHaveBeenCalledWith(
      'http://127.0.0.1:11434',
      'nomic-embed-text:v1.5',
      500,
    );
    expect(adapterEmbed).not.toHaveBeenCalled();
    expect(graph.embeddingCoverage()).toEqual(before);
  });

  it('refreshes incomplete rows when the backend is available', async () => {
    const { graph, skillRoot } = await prepareGraph();

    const result = await graph.refreshEmbeddingsInBackground(skillRoot);

    expect(result?.embedded).toBe(1);
    expect(probeOllamaModel).toHaveBeenCalledTimes(1);
    expect(adapterEmbed).toHaveBeenCalled();
  });

  it('shares one refresh run across concurrent callers', async () => {
    const { graph, skillRoot } = await prepareGraph();
    let finishProbe: ((result: { available: boolean; reason?: string }) => void) | undefined;
    probeOllamaModel.mockReturnValueOnce(new Promise((resolve) => {
      finishProbe = resolve;
    }));

    const first = graph.refreshEmbeddingsInBackground(skillRoot);
    const second = graph.refreshEmbeddingsInBackground(skillRoot);

    expect(probeOllamaModel).toHaveBeenCalledTimes(1);
    finishProbe?.({ available: true });
    const [firstResult, secondResult] = await Promise.all([first, second]);

    expect(firstResult).toEqual(secondResult);
    expect(probeOllamaModel).toHaveBeenCalledTimes(1);
    expect(adapterEmbed).toHaveBeenCalled();
  });

  it('makes one more pass for a skill indexed while a refresh is embedding', async () => {
    const { graph, skillRoot } = await prepareGraph();
    let releaseEmbed: (() => void) | undefined;
    let embedStarted: (() => void) | undefined;
    const started = new Promise<void>((resolve) => {
      embedStarted = resolve;
    });
    adapterEmbed.mockImplementationOnce(async (texts: ReadonlyArray<string>) => {
      embedStarted?.();
      await new Promise<void>((resolve) => {
        releaseEmbed = resolve;
      });
      return texts.map(() => new Float32Array(ACTIVE_EMBEDDER_DIM));
    });

    const first = graph.refreshEmbeddingsInBackground(skillRoot);
    await started;
    seedSkillTree(tmpRoot, 'sk-late-arrival', 'skill indexed while the first pass embeds');
    graph.indexSkillMetadata(skillRoot);
    const second = graph.refreshEmbeddingsInBackground(skillRoot);
    releaseEmbed?.();
    await Promise.all([first, second]);

    const coverage = graph.embeddingCoverage();
    expect(coverage.skills).toEqual(expect.objectContaining({ total: 2, current: 2, missing: 0 }));
    expect(coverage.complete).toBe(true);
  });

  it('clears the in-flight slot when a pass throws', async () => {
    const { graph, skillRoot } = await prepareGraph();
    probeOllamaModel.mockRejectedValueOnce(new Error('probe exploded'));

    await expect(graph.refreshEmbeddingsInBackground(skillRoot)).rejects.toThrow('probe exploded');
    const result = await graph.refreshEmbeddingsInBackground(skillRoot);

    expect(result?.embedded).toBe(1);
  });
});
