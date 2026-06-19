// ───────────────────────────────────────────────────────────────
// MODULE: Projection Embedding Staleness Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import { readAdvisorStatus } from '../../handlers/advisor-status.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { scoreSemanticShadowLane } from '../../lib/scorer/lanes/semantic-shadow.js';
import { createFixtureProjection, loadAdvisorProjection } from '../../lib/scorer/projection.js';
import type { AdvisorProjection, SkillProjection } from '../../lib/scorer/types.js';

const ADVISOR_DB_RELATIVE_PATH = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp_server',
  'database',
  'skill-graph.sqlite',
);

const roots: string[] = [];

interface SqliteProjectionOptions {
  readonly activeName?: string;
  readonly activeDim?: number;
  readonly tableDim?: number;
  readonly modelIds: readonly (string | null)[];
}

function workspace(name: string): string {
  const root = join(tmpdir(), `${name}-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  roots.push(root);
  return root;
}

function write(filePath: string, content: string | Buffer): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function vector(values: readonly number[] = [1, 0]): Buffer {
  const array = Float32Array.from(values);
  return Buffer.from(array.buffer, array.byteOffset, array.byteLength);
}

function writeSkill(root: string, skillId: string): string {
  const skillDir = join(root, '.opencode', 'skills', skillId);
  const metadataPath = join(skillDir, 'graph-metadata.json');
  write(join(skillDir, 'SKILL.md'), [
    '---',
    `name: ${skillId}`,
    `description: ${skillId} test skill`,
    '---',
    '',
  ].join('\n'));
  write(metadataPath, JSON.stringify({
    schema_version: 1,
    skill_id: skillId,
    family: 'system',
    category: 'test',
    domains: ['projection'],
    intent_signals: [skillId],
    derived: {},
    edges: {},
  }));
  return metadataPath;
}

function writeSqliteProjection(options: SqliteProjectionOptions): string {
  const root = workspace('advisor-projection-embedding-staleness');
  const dbPath = join(root, ADVISOR_DB_RELATIVE_PATH);
  mkdirSync(dirname(dbPath), { recursive: true });
  const database = new Database(dbPath);
  try {
    database.exec(`
      CREATE TABLE skill_nodes (
        id TEXT PRIMARY KEY,
        family TEXT NOT NULL,
        category TEXT NOT NULL,
        schema_version INTEGER NOT NULL,
        domains TEXT,
        intent_signals TEXT,
        derived TEXT,
        source_path TEXT NOT NULL UNIQUE,
        content_hash TEXT NOT NULL,
        embedding BLOB,
        embedding_model_id TEXT,
        embedding_content_hash TEXT,
        indexed_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE skill_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        edge_type TEXT NOT NULL,
        weight REAL NOT NULL,
        context TEXT NOT NULL
      );
      CREATE TABLE vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    const activeName = options.activeName ?? 'nomic-embed-text-v1.5';
    const activeDim = options.activeDim ?? 768;
    database.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_name', activeName);
    database.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_dim', String(activeDim));

    const tableDim = options.tableDim ?? activeDim;
    database.exec(`
      CREATE TABLE vec_${tableDim} (
        skill_id TEXT PRIMARY KEY,
        embedding BLOB NOT NULL,
        model_id TEXT,
        content_hash TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    const insertNode = database.prepare(`
      INSERT INTO skill_nodes (id, family, category, schema_version, domains, intent_signals, derived, source_path, content_hash)
      VALUES (?, 'system', 'test', 1, ?, ?, ?, ?, ?)
    `);
    const insertVector = database.prepare(`
      INSERT INTO vec_${tableDim} (skill_id, embedding, model_id, content_hash, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    options.modelIds.forEach((modelId, index) => {
      const skillId = index === 0 ? 'alpha' : `alpha-${index}`;
      const metadataPath = writeSkill(root, skillId);
      insertNode.run(
        skillId,
        JSON.stringify(['projection']),
        JSON.stringify([skillId]),
        JSON.stringify({}),
        metadataPath,
        `hash-${skillId}`,
      );
      insertVector.run(skillId, vector(), modelId, `hash-${skillId}`, '2026-06-19T00:00:00.000Z');
    });
  } finally {
    database.close();
  }
  return root;
}

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
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('advisor projection embedding staleness', () => {
  it('carries a fresh signature when stored vectors match the active embedder', () => {
    const root = writeSqliteProjection({ modelIds: ['nomic-embed-text-v1.5', 'nomic-embed-text-v1.5'] });

    const projection = loadAdvisorProjection(root);

    expect(projection.source).toBe('sqlite');
    expect(projection.generatedAt).toEqual(expect.any(String));
    expect(projection.embeddingSignature).toEqual(expect.objectContaining({
      provider: 'ollama',
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      modelId: 'nomic-embed-text-v1.5',
    }));
    expect(projection.embeddingStaleness).toEqual(expect.objectContaining({
      stale: false,
      vectorCount: 2,
    }));
  });

  it('flags a projection stale when stored vectors belong to a different model', () => {
    const root = writeSqliteProjection({ modelIds: ['old-model'] });

    const projection = loadAdvisorProjection(root);

    expect(projection.embeddingStaleness).toEqual(expect.objectContaining({
      stale: true,
      reason: "projection model 'old-model' != active 'nomic-embed-text-v1.5'",
      vectorCount: 1,
      modelIds: ['old-model'],
    }));
  });

  it('fails closed when populated vectors have no stored model signature', () => {
    const root = writeSqliteProjection({ modelIds: [null] });

    const projection = loadAdvisorProjection(root);

    expect(projection.embeddingStaleness).toEqual(expect.objectContaining({
      stale: true,
      reason: 'projection embedding model missing',
      vectorCount: 1,
    }));
  });

  it('does not mark an empty projection stale when there are no stored vectors', () => {
    const root = writeSqliteProjection({ modelIds: [] });

    const projection = loadAdvisorProjection(root);

    expect(projection.embeddingStaleness).toEqual(expect.objectContaining({
      stale: false,
      vectorCount: 0,
    }));
  });

  it('degrades the semantic shadow lane when the projection verdict is stale', () => {
    const projection: AdvisorProjection = {
      ...createFixtureProjection([
        skill({
          id: 'semantic-skill',
          description: 'semantic token overlap only',
        }),
      ]),
      embeddingStaleness: {
        stale: true,
        reason: "projection model 'old-model' != active 'new-model'",
        active: null,
        stored: null,
        vectorCount: 1,
        modelIds: ['old-model'],
      },
    };

    expect(scoreSemanticShadowLane('semantic token overlap only', projection)).toEqual([]);

    const result = scoreAdvisorPrompt('semantic token overlap only', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });
    const top = result.recommendations[0];
    const semantic = top?.laneContributions.find((lane) => lane.lane === 'semantic_shadow');

    expect(semantic?.rawScore).toBe(0);
    expect(semantic?.weight).toBe(0);
    expect(result.metrics.degradedLanes).toEqual(['semantic_shadow']);
    expect(result.metrics.laneHealth?.find((lane) => lane.lane === 'semantic_shadow')).toEqual({
      lane: 'semantic_shadow',
      status: 'runtime_degraded',
      matchCount: 0,
      reason: "projection model 'old-model' != active 'new-model'",
    });
  });

  it('reports stale projection vectors in semantic lane health', () => {
    const root = writeSqliteProjection({ modelIds: ['old-model'] });

    const status = readAdvisorStatus({
      workspaceRoot: root,
      includeSemanticHealth: true,
      checkArtifactIntegrity: false,
    });

    expect(status.semanticLaneHealth).toEqual(expect.objectContaining({
      disabledReason: 'projection_embedding_stale',
      laneEnabled: false,
    }));
  });
});
