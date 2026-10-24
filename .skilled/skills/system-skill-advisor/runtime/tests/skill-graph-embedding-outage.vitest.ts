// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Embedding Refresh Outage Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedProvider = vi.hoisted(() => ({
  embedDocument: vi.fn(),
  adapterEmbed: vi.fn(),
}));

vi.mock('@spec-kit/shared/embeddings/factory.js', () => ({
  createEmbeddingsProvider: async () => ({
    getProfile: () => ({ provider: 'test', model: 'fixture', dim: 3 }),
    embedDocument: mockedProvider.embedDocument,
  }),
}));

vi.mock('../lib/embedders/registry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/embedders/registry.js')>();
  return {
    ...actual,
    getAdapter: (name: string) => (name === 'mock-3'
      ? {
          name: 'mock-3',
          dim: 3,
          backend: 'ollama' as const,
          embed: mockedProvider.adapterEmbed,
          ready: async () => true,
        }
      : actual.getAdapter(name)),
  };
});

import { setActiveEmbedder } from '../lib/embedders/schema.js';
import { closeDb, getDb, indexSkillMetadata, initDb, refreshSkillEmbeddings } from '../lib/skill-graph/skill-graph-db.js';
import { writeGraphMetadata } from './fixtures/skill-graph-db.js';

const SKILL_IDS = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'] as const;

describe('skill graph embedding refresh', () => {
  let root = '';
  let skillRoot = '';

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'skill-graph-embedding-'));
    skillRoot = join(root, 'skills');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    initDb(join(root, 'db'));
    for (const id of SKILL_IDS) {
      writeGraphMetadata(skillRoot, id);
      writeFileSync(
        join(skillRoot, id, 'SKILL.md'),
        `---\nname: ${id}\ndescription: "Fixture skill ${id}"\n---\n`,
        'utf8',
      );
    }
    indexSkillMetadata(skillRoot);
  });

  afterEach(() => {
    closeDb();
    rmSync(root, { recursive: true, force: true });
    mockedProvider.embedDocument.mockReset();
    mockedProvider.adapterEmbed.mockReset();
    vi.restoreAllMocks();
  });

  // Sorted by id the refresh visits alpha, beta, delta, epsilon, gamma, zeta.
  // Three stale rows lead, so the outage trips on the third, then two rows that
  // are already current follow, then one more stale row the outage never asks.
  const STALE_IDS = ['alpha', 'beta', 'delta', 'zeta'] as const;
  const CURRENT_IDS = ['epsilon', 'gamma'] as const;

  function makeStale(): void {
    for (const id of STALE_IDS) {
      writeFileSync(
        join(skillRoot, id, 'SKILL.md'),
        `---\nname: ${id}\ndescription: "Fixture skill ${id} rewritten"\n---\n`,
        'utf8',
      );
    }
  }

  it('embeds every skill when the backend answers', async () => {
    mockedProvider.embedDocument.mockResolvedValue(new Float32Array([1, 2, 3]));

    const result = await refreshSkillEmbeddings(skillRoot);

    expect(result).toEqual(expect.objectContaining({ embedded: SKILL_IDS.length, failed: 0 }));
    expect(mockedProvider.embedDocument).toHaveBeenCalledTimes(SKILL_IDS.length);
  });

  it('stops asking a dead backend after three straight failures and counts the rest as failed', async () => {
    mockedProvider.embedDocument.mockRejectedValue(new Error('model server unreachable'));

    const result = await refreshSkillEmbeddings(skillRoot);

    expect(mockedProvider.embedDocument).toHaveBeenCalledTimes(3);
    expect(result).toEqual(expect.objectContaining({ embedded: 0, skipped: 0, failed: SKILL_IDS.length }));
    expect(result.warnings.some((warning) => warning.startsWith('EMBEDDING-BACKEND-OUTAGE'))).toBe(true);
  });

  it('keeps the stored vector of a current row after the outage trips (legacy column)', async () => {
    mockedProvider.embedDocument.mockResolvedValue(new Float32Array([1, 2, 3]));
    await refreshSkillEmbeddings(skillRoot);
    makeStale();
    mockedProvider.embedDocument.mockReset();
    mockedProvider.embedDocument.mockRejectedValue(new Error('model server unreachable'));

    const result = await refreshSkillEmbeddings(skillRoot);

    expect(mockedProvider.embedDocument).toHaveBeenCalledTimes(3);
    expect(result).toEqual(expect.objectContaining({ embedded: 0, skipped: CURRENT_IDS.length, failed: STALE_IDS.length }));
    const stored = new Map(
      (getDb().prepare('SELECT id, embedding FROM skill_nodes').all() as Array<{ id: string; embedding: Buffer | null }>)
        .map((row) => [row.id, row.embedding]),
    );
    for (const id of CURRENT_IDS) {
      expect(stored.get(id), `${id} keeps its vector`).not.toBeNull();
    }
    for (const id of STALE_IDS) {
      expect(stored.get(id), `${id} holds no vector`).toBeNull();
    }
  });

  it('keeps the stored vector of a current row after the outage trips (adapter table)', async () => {
    setActiveEmbedder(getDb(), 'mock-3', 3);
    mockedProvider.adapterEmbed.mockResolvedValue([new Float32Array([1, 2, 3])]);
    await refreshSkillEmbeddings(skillRoot);
    makeStale();
    mockedProvider.adapterEmbed.mockReset();
    mockedProvider.adapterEmbed.mockRejectedValue(new Error('model server unreachable'));

    const result = await refreshSkillEmbeddings(skillRoot);

    expect(mockedProvider.adapterEmbed).toHaveBeenCalledTimes(3);
    expect(result).toEqual(expect.objectContaining({ embedded: 0, skipped: CURRENT_IDS.length, failed: STALE_IDS.length }));
    const stored = (getDb().prepare('SELECT skill_id FROM vec_3').all() as Array<{ skill_id: string }>)
      .map((row) => row.skill_id)
      .sort();
    expect(stored).toEqual([...CURRENT_IDS].sort());
  });
});
