// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Shadow Cosine Lane Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { embedDocument, embedQuery, createEmbeddingsProvider } = vi.hoisted(() => {
  const embedDocument = vi.fn(async (text: string) => (
    text.includes('changed')
      ? new Float32Array([0, 1])
      : new Float32Array([1, 0])
  ));
  const embedQuery = vi.fn(async () => new Float32Array([1, 0]));
  return {
    embedDocument,
    embedQuery,
    createEmbeddingsProvider: vi.fn(async () => ({
      embedDocument,
      embedQuery,
      getProfile: () => ({
        provider: 'mock',
        model: 'fixture',
        dim: 2,
        slug: 'mock-fixture-2',
      }),
    })),
  };
});

vi.mock('@spec-kit/shared/embeddings/factory', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@spec-kit/shared/embeddings/factory')>();
  return {
    ...actual,
    createEmbeddingsProvider,
  };
});

import {
  closeDb,
  getDb,
  indexSkillMetadata,
  initDb,
  refreshSkillEmbeddings,
} from '../../../../../lib/skill-graph/skill-graph-db.js';
import {
  _semanticShadowTest,
  clearSemanticShadowPromptEmbedding,
  scoreSemanticShadowLane,
  setSemanticShadowPromptEmbedding,
} from '../semantic-shadow.js';
import { scoreAdvisorPrompt } from '../../fusion.js';
import { createFixtureProjection } from '../../projection.js';
import type { AdvisorProjection, SkillProjection } from '../../types.js';
import { writeGraphMetadata } from '../../../../../tests/fixtures/skill-graph-db.js';

function buffer(values: readonly number[]): Buffer {
  const vector = Float32Array.from(values);
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength);
}

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
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
    ...overrides,
    id: overrides.id,
  };
}

function writeSkill(skillRoot: string, skillId: string, description: string): void {
  writeGraphMetadata(skillRoot, skillId);
  writeFileSync(join(skillRoot, skillId, 'SKILL.md'), [
    '---',
    `name: ${skillId}`,
    `description: "${description}"`,
    '---',
    '',
  ].join('\n'), 'utf8');
}

describe('semantic shadow cosine lane', () => {
  let root: string;
  let dbDir: string;
  let skillRoot: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'semantic-shadow-cosine-'));
    dbDir = join(root, 'db');
    skillRoot = join(root, 'skills');
    initDb(dbDir);
    embedDocument.mockClear();
    embedQuery.mockClear();
    createEmbeddingsProvider.mockClear();
  });

  afterEach(() => {
    clearSemanticShadowPromptEmbedding();
    closeDb();
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('applies the embedding schema migration idempotently', () => {
    closeDb();
    initDb(dbDir);
    closeDb();
    initDb(dbDir);

    const columns = getDb().prepare('PRAGMA table_info(skill_nodes)').all() as Array<{ name: string }>;
    expect(columns.map((column) => column.name)).toEqual(expect.arrayContaining([
      'embedding',
      'embedding_model_id',
      'embedding_content_hash',
    ]));
  });

  it('embeds changed skill descriptions and skips matching hash/model rows', async () => {
    writeSkill(skillRoot, 'alpha', 'stable local embedding workflow');
    indexSkillMetadata(skillRoot);

    const first = await refreshSkillEmbeddings(skillRoot);
    const second = await refreshSkillEmbeddings(skillRoot);

    expect(first).toEqual(expect.objectContaining({ embedded: 1, skipped: 0, failed: 0 }));
    expect(second).toEqual(expect.objectContaining({ embedded: 0, skipped: 1, failed: 0 }));
    expect(embedDocument).toHaveBeenCalledTimes(1);

    writeSkill(skillRoot, 'alpha', 'changed local embedding workflow');
    indexSkillMetadata(skillRoot);
    const third = await refreshSkillEmbeddings(skillRoot);

    expect(third).toEqual(expect.objectContaining({ embedded: 1, failed: 0 }));
    expect(embedDocument).toHaveBeenCalledTimes(2);
  });

  it('computes cosine lane matches from cached skill vectors', () => {
    writeSkill(skillRoot, 'alpha', 'north vector');
    writeSkill(skillRoot, 'beta', 'east vector');
    indexSkillMetadata(skillRoot);
    getDb().prepare(`
      UPDATE skill_nodes
      SET embedding = ?, embedding_model_id = ?, embedding_content_hash = ?
      WHERE id = ?
    `).run(buffer([1, 0]), 'mock-fixture-2', 'hash-alpha', 'alpha');
    getDb().prepare(`
      UPDATE skill_nodes
      SET embedding = ?, embedding_model_id = ?, embedding_content_hash = ?
      WHERE id = ?
    `).run(buffer([0, 1]), 'mock-fixture-2', 'hash-beta', 'beta');

    const projection: AdvisorProjection = {
      skills: [skill({ id: 'alpha' }), skill({ id: 'beta' })],
      edges: [],
      generatedAt: '2026-05-13T00:00:00.000Z',
      source: 'sqlite',
    };
    setSemanticShadowPromptEmbedding('north', new Float32Array([1, 0]));

    expect(_semanticShadowTest.cosineSimilarity(new Float32Array([1, 0]), new Float32Array([1, 0]))).toBe(1);
    expect(_semanticShadowTest.cosineSimilarity(new Float32Array([1, 0]), new Float32Array([0, 1]))).toBe(0);
    expect(scoreSemanticShadowLane('north', projection)).toEqual([
      {
        skillId: 'alpha',
        lane: 'semantic_shadow',
        score: 1,
        evidence: ['cosine:1.0000'],
        shadowOnly: false,
      },
    ]);
  });

  it('keeps semantic matches from overturning an explicit top route', () => {
    const projection = createFixtureProjection([
      skill({
        id: 'alpha',
        description: 'plain implementation route',
        intentSignals: ['alpha exact route'],
      }),
      skill({
        id: 'beta',
        description: 'semantic shadow should not promote beta',
      }),
    ]);

    const withShadow = scoreAdvisorPrompt('alpha exact route', {
      workspaceRoot: process.cwd(),
      projection,
    });
    const withoutShadow = scoreAdvisorPrompt('alpha exact route', {
      workspaceRoot: process.cwd(),
      projection,
      disabledLanes: ['semantic_shadow'],
    });

    const semantic = withShadow.recommendations[0]?.laneContributions.find((lane) => lane.lane === 'semantic_shadow');

    expect(withShadow.topSkill).toBe(withoutShadow.topSkill);
    expect(withShadow.topSkill).toBe('alpha');
    expect(semantic?.weightedScore).toBeGreaterThan(0);
    expect(semantic?.shadowOnly).toBe(false);
  });
});
