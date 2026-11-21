// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Shadow Cosine Lane Tests
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { embedDocument, embedQuery, createEmbeddingsProvider } = vi.hoisted(() => {
  process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON = '{"semantic_shadow":0.05}';
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

vi.mock('@spec-kit/shared/embeddings/factory.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@spec-kit/shared/embeddings/factory.js')>();
  return {
    ...actual,
    createEmbeddingsProvider,
  };
});

vi.mock('../../lib/embedders/registry.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/embedders/registry.js')>();
  return {
    ...actual,
    getAdapter: (name: string) => name === 'mock-fixture-2'
      ? {
          name: 'mock-fixture-2',
          dim: 2,
          backend: 'ollama' as const,
          embed: async (texts: readonly string[]) => Promise.all(texts.map((text) => embedDocument(text))),
          ready: async () => true,
        }
      : actual.getAdapter(name),
  };
});

import {
  closeDb,
  getDb,
  indexSkillMetadata,
  initDb,
} from '../../lib/skill-graph/skill-graph-db.js';
import * as skillGraphDb from '../../lib/skill-graph/skill-graph-db.js';
import {
  commandVecTableNameForDim,
  ensureCommandVecTableForDim,
  setActiveEmbedder,
} from '../../lib/embedders/schema.js';
import {
  _semanticShadowTest,
  clearSemanticShadowPromptEmbedding,
  getSemanticShadowRuntimeHealth,
  scoreSemanticShadowLane,
  setSemanticShadowPromptEmbedding,
} from '../../lib/scorer/lanes/semantic-shadow.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { AdvisorProjection, SkillProjection } from '../../lib/scorer/types.js';
import { writeGraphMetadata } from '../fixtures/skill-graph-db.js';

function buffer(values: readonly number[]): Buffer {
  const vector = Float32Array.from(values);
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength);
}

function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
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

function seedCurrentCommandVectors(): void {
  const commandSources = skillGraphDb.readCommandEmbeddingSources() ?? [];
  ensureCommandVecTableForDim(getDb(), 2);
  const insertVector = getDb().prepare(`
    INSERT INTO ${commandVecTableNameForDim(2)} (command_id, embedding, model_id, content_hash)
    VALUES (?, ?, ?, ?)
  `);
  for (const source of commandSources) {
    insertVector.run(
      source.commandId,
      buffer([1, 0]),
      'mock-fixture-2',
      computeContentHash(source.embeddingText),
    );
  }
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
    setActiveEmbedder(getDb(), 'mock-fixture-2', 2);
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

  afterAll(() => {
    delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
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

  it('computes cosine lane matches from cached skill vectors', () => {
    writeSkill(skillRoot, 'alpha', 'north vector');
    writeSkill(skillRoot, 'beta', 'east vector');
    indexSkillMetadata(skillRoot);
    getDb().prepare(`
      INSERT INTO vec_2 (skill_id, embedding, model_id, content_hash)
      VALUES (?, ?, ?, ?)
    `).run('alpha', buffer([1, 0]), 'mock-fixture-2', computeContentHash('north vector'));
    getDb().prepare(`
      INSERT INTO vec_2 (skill_id, embedding, model_id, content_hash)
      VALUES (?, ?, ?, ?)
    `).run('beta', buffer([0, 1]), 'mock-fixture-2', computeContentHash('east vector'));

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

  it('requires current vectors for every described skill', () => {
    vi.stubEnv('VITEST', 'false');
    try {
      seedCurrentCommandVectors();
      writeSkill(skillRoot, 'alpha', 'north vector');
      writeSkill(skillRoot, 'beta', 'north vector');
      indexSkillMetadata(skillRoot);

      const insertVector = getDb().prepare(`
        INSERT INTO vec_2 (skill_id, embedding, model_id, content_hash)
        VALUES (?, ?, ?, ?)
      `);
      insertVector.run('alpha', buffer([1, 0]), 'mock-fixture-2', computeContentHash('north vector'));

      const projection: AdvisorProjection = {
        skills: [
          skill({ id: 'alpha', description: 'north vector' }),
          skill({ id: 'beta', description: 'north vector' }),
        ],
        edges: [],
        generatedAt: '2026-05-13T00:00:00.000Z',
        source: 'sqlite',
      };
      setSemanticShadowPromptEmbedding('north', new Float32Array([1, 0]));

      expect(scoreSemanticShadowLane('north', projection)).toEqual([]);
      expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('incomplete_skill_vectors');

      insertVector.run('beta', buffer([1, 0]), 'mock-fixture-2', computeContentHash('north vector'));
      expect(scoreSemanticShadowLane('north', projection)).toEqual([
        {
          skillId: 'alpha',
          lane: 'semantic_shadow',
          score: 1,
          evidence: ['cosine:1.0000'],
          shadowOnly: false,
        },
        {
          skillId: 'beta',
          lane: 'semantic_shadow',
          score: 1,
          evidence: ['cosine:1.0000'],
          shadowOnly: false,
        },
      ]);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('checks coverage without opening the database read-write', () => {
    seedCurrentCommandVectors();
    writeSkill(skillRoot, 'alpha', 'north vector');
    indexSkillMetadata(skillRoot);
    getDb().prepare(`
      INSERT INTO vec_2 (skill_id, embedding, model_id, content_hash)
      VALUES (?, ?, ?, ?)
    `).run('alpha', buffer([1, 0]), 'mock-fixture-2', computeContentHash('north vector'));
    closeDb();

    vi.stubEnv('SYSTEM_SKILL_ADVISOR_DB_DIR', dbDir);
    vi.stubEnv('VITEST', 'false');
    try {
      const projection: AdvisorProjection = {
        skills: [skill({ id: 'alpha', description: 'north vector' })],
        edges: [],
        generatedAt: '2026-05-13T00:00:00.000Z',
        source: 'sqlite',
      };
      setSemanticShadowPromptEmbedding('north', new Float32Array([1, 0]));

      expect(scoreSemanticShadowLane('north', projection)).toHaveLength(1);
      expect(skillGraphDb.getDbReadOnly()?.readonly).toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('disables scoring when a stored vector hash does not match its description', () => {
    vi.stubEnv('VITEST', 'false');
    try {
      seedCurrentCommandVectors();
      writeSkill(skillRoot, 'alpha', 'north vector');
      indexSkillMetadata(skillRoot);
      getDb().prepare(`
        INSERT INTO vec_2 (skill_id, embedding, model_id, content_hash)
        VALUES (?, ?, ?, ?)
      `).run('alpha', buffer([1, 0]), 'mock-fixture-2', computeContentHash('outdated north vector'));

      const projection: AdvisorProjection = {
        skills: [skill({ id: 'alpha', description: 'north vector' })],
        edges: [],
        generatedAt: '2026-05-13T00:00:00.000Z',
        source: 'sqlite',
      };
      setSemanticShadowPromptEmbedding('north', new Float32Array([1, 0]));

      expect(scoreSemanticShadowLane('north', projection)).toEqual([]);
      expect(getSemanticShadowRuntimeHealth().disabledReason).toBe('incomplete_skill_vectors');
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('does not use fixture skill vectors with a real prompt embedding', () => {
    vi.stubEnv('VITEST', 'false');
    try {
      const prompt = 'shared vector words';
      const projection = createFixtureProjection([
        skill({ id: 'alpha', description: prompt }),
      ]);
      const promptVector = new Float32Array(768);
      promptVector.set(_semanticShadowTest.fixtureVector(prompt));
      setSemanticShadowPromptEmbedding(prompt, promptVector);

      expect(skillGraphDb.loadSkillEmbeddings(['alpha'])).toEqual([]);
      expect(scoreSemanticShadowLane(prompt, projection)).toEqual([]);
    } finally {
      vi.unstubAllEnvs();
    }
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
