// ───────────────────────────────────────────────────────────────
// MODULE: Skill Embedding Coverage Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
  });

  afterEach(() => {
    graphModule?.closeDb();
    graphModule = null;
    rmSync(tmpRoot, { recursive: true, force: true });
    vi.restoreAllMocks();
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
