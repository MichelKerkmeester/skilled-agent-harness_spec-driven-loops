// ───────────────────────────────────────────────────────────────
// MODULE: Skill Embedding Coverage Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { adapterEmbed } = vi.hoisted(() => ({
  adapterEmbed: vi.fn(async (texts: ReadonlyArray<string>) => texts.map(() => new Float32Array(1024))),
}));

vi.mock('../../lib/embedders/registry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/embedders/registry.js')>();
  return {
    ...actual,
    getAdapter: vi.fn((name: string) => (name === 'mock-1024'
      ? {
          name: 'mock-1024',
          dim: 1024,
          backend: 'ollama' as const,
          embed: adapterEmbed,
          ready: async () => true,
        }
      : actual.getAdapter(name))),
  };
});

let tmpRoot = '';
let graphModule: typeof import('../../lib/skill-graph/skill-graph-db.js') | null = null;

function writeSkill(skillDir: string, skillName: string, description: string): void {
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
}

function seedSkillTree(rootDir: string, skillName: string, description: string): string {
  const skillDir = join(rootDir, '.skilled', 'skills', skillName);
  mkdirSync(skillDir, { recursive: true });
  writeSkill(skillDir, skillName, description);
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

describe('embeddingCoverage', () => {
  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'embedding-coverage-'));
    adapterEmbed.mockClear();
  });

  afterEach(() => {
    graphModule?.closeDb();
    graphModule = null;
    rmSync(tmpRoot, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('counts current, stale, and missing vectors and excludes empty descriptions', async () => {
    const graph = await import('../../lib/skill-graph/skill-graph-db.js');
    graphModule = graph;
    const { setActiveEmbedder, vecTableNameForDim } = await import('../../lib/embedders/schema.js');
    const skillRoot = join(tmpRoot, '.skilled', 'skills');
    const staleSkillDir = seedSkillTree(tmpRoot, 'coverage-stale', 'original stale description');

    seedSkillTree(tmpRoot, 'coverage-current', 'unchanged current description');
    seedSkillTree(tmpRoot, 'coverage-missing', 'description without a stored vector');
    seedSkillTree(tmpRoot, 'coverage-empty', '');
    graph.initDb(join(tmpRoot, '.skill-graph'));
    graph.indexSkillMetadata(skillRoot);
    setActiveEmbedder(graph.getDb(), 'mock-1024', 1024);

    // The generated projection is the same bridge source the refresh reads.
    const commandSources = graph.readCommandEmbeddingSources() ?? [];
    expect(commandSources.length).toBeGreaterThan(0);
    await graph.refreshSkillEmbeddings();
    expect(graph.embeddingCoverage().complete).toBe(true);

    writeSkill(staleSkillDir, 'coverage-stale', 'changed description is now stale');
    graph.getDb().prepare(`DELETE FROM ${vecTableNameForDim(1024)} WHERE skill_id = ?`).run('coverage-missing');

    const coverage = graph.embeddingCoverage();

    expect(coverage.skills).toEqual({ total: 3, current: 1, stale: 1, missing: 1 });
    expect(coverage.commands).toEqual({
      total: commandSources.length,
      current: commandSources.length,
      stale: 0,
      missing: 0,
    });
    expect(coverage.incompleteIds).toEqual(['coverage-missing', 'coverage-stale']);
    expect(coverage.complete).toBe(false);
  });

  it('counts every embeddable row as missing without an active embedder', async () => {
    const graph = await import('../../lib/skill-graph/skill-graph-db.js');
    graphModule = graph;
    const skillRoot = join(tmpRoot, '.skilled', 'skills');

    seedSkillTree(tmpRoot, 'coverage-no-pointer', 'row without an active embedder');
    graph.initDb(join(tmpRoot, '.skill-graph'));
    graph.indexSkillMetadata(skillRoot);
    const commandSources = graph.readCommandEmbeddingSources() ?? [];

    const coverage = graph.embeddingCoverage();

    expect(coverage.skills).toEqual({ total: 1, current: 0, stale: 0, missing: 1 });
    expect(coverage.commands).toEqual({
      total: commandSources.length,
      current: 0,
      stale: 0,
      missing: commandSources.length,
    });
    expect(coverage.incompleteIds).toContain('coverage-no-pointer');
    expect(coverage.complete).toBe(false);
  });
});
