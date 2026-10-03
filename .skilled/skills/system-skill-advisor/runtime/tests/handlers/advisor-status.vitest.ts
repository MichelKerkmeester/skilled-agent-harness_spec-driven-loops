// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Status Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import Database from 'better-sqlite3';

import { describe, expect, it } from 'vitest';

import { handleAdvisorStatus, readAdvisorStatus } from '../../handlers/advisor-status.js';
import { computeAdvisorSourceSignature } from '../../lib/freshness.js';
import { computeSkillMetadataContentHash } from '../../lib/skill-graph/skill-graph-db.js';
import { AdvisorStatusOutputSchema } from '../../schemas/advisor-tool-schemas.js';

const ADVISOR_DB_RELATIVE_PATH = join(
  '.skilled',
  'skills',
  'system-skill-advisor',
  'runtime',
  'database',
  'skill-graph.sqlite',
);

function workspace(name: string): string {
  const root = mkdtempSync(join(tmpdir(), `advisor-status-${name}-`));
  mkdirSync(join(root, '.skilled', 'skills', '.state', 'advisor'), { recursive: true });
  mkdirSync(join(root, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'database'), { recursive: true });
  mkdirSync(join(root, '.skilled', 'skills', 'alpha'), { recursive: true });
  writeFileSync(join(root, '.skilled', 'skills', 'alpha', 'graph-metadata.json'), '{"skill_id":"alpha"}\n', 'utf8');
  return root;
}

function writeGeneration(
  root: string,
  state: 'live' | 'stale' | 'absent' | 'unavailable',
  generation = 1,
  sourceSignature: string | null = null,
): void {
  writeFileSync(join(root, '.skilled', 'skills', '.state', 'advisor', 'skill-graph-generation.json'), `${JSON.stringify({
    generation,
    updatedAt: '2026-04-20T00:00:00.000Z',
    sourceSignature,
    reason: `${state.toUpperCase()}_FIXTURE`,
    state,
  })}\n`, 'utf8');
}

function writeDb(root: string): void {
  writeFileSync(join(root, ADVISOR_DB_RELATIVE_PATH), '', 'utf8');
}

function writeIndexDb(root: string, contentHash: string | null): void {
  const database = new Database(join(root, ADVISOR_DB_RELATIVE_PATH));
  try {
    database.exec(`
      CREATE TABLE skill_nodes (
        id TEXT PRIMARY KEY,
        source_path TEXT,
        content_hash TEXT
      );
    `);
    database.prepare(`
      INSERT INTO skill_nodes (id, source_path, content_hash)
      VALUES (?, ?, ?)
    `).run(
      'alpha',
      join('.skilled', 'skills', 'alpha', 'graph-metadata.json'),
      contentHash,
    );
  } finally {
    database.close();
  }
}

function writeHealthDb(root: string): void {
  const database = new Database(join(root, ADVISOR_DB_RELATIVE_PATH));
  try {
    database.exec(`
      CREATE TABLE skill_nodes (
        id TEXT PRIMARY KEY,
        embedding BLOB,
        embedding_model_id TEXT,
        embedding_content_hash TEXT
      );
      CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE vec_768 (
        skill_id TEXT PRIMARY KEY,
        embedding BLOB NOT NULL,
        model_id TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
    database.prepare('INSERT INTO skill_nodes (id) VALUES (?)').run('alpha');
    database.prepare('INSERT INTO skill_nodes (id) VALUES (?)').run('beta');
    database.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_name', 'nomic-embed-text-v1.5');
    database.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_dim', '768');
    database.prepare('INSERT INTO vec_768 (skill_id, embedding, model_id, content_hash, updated_at) VALUES (?, ?, ?, ?, ?)')
      .run('alpha', Buffer.from([1, 2, 3]), 'nomic-embed-text-v1.5', 'hash-alpha', '2026-04-20T00:00:00.000Z');
  } finally {
    database.close();
  }
}

function writeDimMismatchHealthDb(root: string): void {
  const database = new Database(join(root, ADVISOR_DB_RELATIVE_PATH));
  try {
    database.exec(`
      CREATE TABLE skill_nodes (id TEXT PRIMARY KEY, embedding BLOB);
      CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE vec_123 (
        skill_id TEXT PRIMARY KEY,
        embedding BLOB NOT NULL,
        model_id TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
    database.prepare('INSERT INTO skill_nodes (id) VALUES (?)').run('alpha');
    database.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_name', 'nomic-embed-text-v1.5');
    database.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_dim', '123');
  } finally {
    database.close();
  }
}

describe('advisor_status handler', () => {
  // drift: verified against shipped behavior during Unit H
  it('reports live freshness', () => {
    const root = workspace('live');
    writeDb(root);
    writeGeneration(root, 'live', 3);

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('live');
    expect(status.trustState.state).toBe('live');
    expect(status.generation).toBe(3);
    expect(status.trustState.lastLiveAt).toBe('2026-04-20T00:00:00.000Z');
    expect(status.lastScanAt).toBe('2026-04-20T00:00:00.000Z');
    expect(status.skillCount).toBe(1);
    expect(status.laneWeights.explicit_author).toBe(0.42);
    expect(status.semanticLaneHealth).toBeUndefined();
  });

  it('reports fresh index hashes without changing a live generation', () => {
    const root = workspace('index-fresh');
    const metadataPath = join(root, '.skilled', 'skills', 'alpha', 'graph-metadata.json');
    const contentHash = computeSkillMetadataContentHash(readFileSync(metadataPath, 'utf8'));
    writeIndexDb(root, contentHash);
    writeGeneration(root, 'live', 3, computeAdvisorSourceSignature(root));

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('live');
    expect(status.indexStaleness).toEqual({
      state: 'fresh',
      reason: null,
      trackedSkills: 1,
      freshSourceFiles: 1,
      changedSourceFiles: 0,
      missingSourceFiles: 0,
      staleSkillIds: [],
    });
  });

  it('marks live generations stale when index hashes differ from disk', () => {
    const root = workspace('index-stale');
    writeIndexDb(root, 'outdated-hash');
    writeGeneration(root, 'live', 4, computeAdvisorSourceSignature(root));

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('stale');
    expect(status.trustState.state).toBe('stale');
    expect(status.indexStaleness).toEqual(expect.objectContaining({
      state: 'stale',
      reason: 'source_hash_mismatch',
      changedSourceFiles: 1,
    }));
    expect(status.errors).toContain(
      'advisor_status index content hashes differ from disk for 1 skill; run advisor_rebuild',
    );
  });

  it('reports unavailable index staleness when the database is absent', () => {
    const root = workspace('index-absent');
    writeGeneration(root, 'live', 5, computeAdvisorSourceSignature(root));

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.indexStaleness).toEqual(expect.objectContaining({
      state: 'unavailable',
      reason: 'database_absent',
    }));
  });

  it('reports semantic-lane health only when requested', () => {
    const root = workspace('semantic-health');
    writeHealthDb(root);
    writeGeneration(root, 'live', 8);

    const compact = readAdvisorStatus({ workspaceRoot: root });
    const detailed = readAdvisorStatus({ workspaceRoot: root, includeSemanticHealth: true });

    expect(compact.semanticLaneHealth).toBeUndefined();
    expect(detailed.semanticLaneHealth).toEqual(expect.objectContaining({
      activeEmbedder: expect.objectContaining({
        name: 'nomic-embed-text-v1.5',
        dim: 768,
        adapterDim: 768,
      }),
      vectorCoverage: {
        embedded: 1,
        total: 2,
        ratio: 0.5,
      },
      dimMismatch: false,
      lastRefresh: '2026-04-20T00:00:00.000Z',
      disabledReason: null,
      laneEnabled: true,
    }));
  });

  it('surfaces semantic-lane dim mismatch as a disabled reason', () => {
    const root = workspace('semantic-dim-mismatch');
    writeDimMismatchHealthDb(root);
    writeGeneration(root, 'live', 9);

    const status = readAdvisorStatus({ workspaceRoot: root, includeSemanticHealth: true });

    expect(status.semanticLaneHealth).toEqual(expect.objectContaining({
      activeEmbedder: expect.objectContaining({
        name: 'nomic-embed-text-v1.5',
        dim: 123,
        adapterDim: 768,
      }),
      dimMismatch: true,
      disabledReason: 'dim_mismatch',
      laneEnabled: false,
    }));
  });

  // drift: verified against shipped behavior during Unit H
  it('keeps signed generations live when source mtimes exceed skipped SQLite writes', () => {
    const root = workspace('signed-live');
    writeDb(root);
    const dbPath = join(root, ADVISOR_DB_RELATIVE_PATH);
    const metadataPath = join(root, '.skilled', 'skills', 'alpha', 'graph-metadata.json');
    utimesSync(dbPath, new Date('2026-04-19T00:00:00.000Z'), new Date('2026-04-19T00:00:00.000Z'));
    utimesSync(metadataPath, new Date('2026-04-21T00:00:00.000Z'), new Date('2026-04-21T00:00:00.000Z'));
    const sourceSignature = computeAdvisorSourceSignature(root);
    writeFileSync(join(root, '.skilled', 'skills', '.state', 'advisor', 'skill-graph-generation.json'), `${JSON.stringify({
      generation: 9,
      updatedAt: '2026-04-22T00:00:00.000Z',
      sourceSignature,
      reason: 'advisor_rebuild',
      state: 'live',
    })}\n`, 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('live');
    expect(status.trustState.state).toBe('live');
  });

  // drift: verified against shipped behavior during Unit H
  it('marks live generations stale when nested graph metadata is newer than the database', () => {
    const root = workspace('nested-mtime');
    writeDb(root);
    writeGeneration(root, 'live', 6);
    const dbPath = join(root, ADVISOR_DB_RELATIVE_PATH);
    const metadataPath = join(root, '.skilled', 'skills', 'alpha', 'graph-metadata.json');
    utimesSync(dbPath, new Date('2026-04-19T00:00:00.000Z'), new Date('2026-04-19T00:00:00.000Z'));
    utimesSync(metadataPath, new Date('2026-04-21T00:00:00.000Z'), new Date('2026-04-21T00:00:00.000Z'));

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('stale');
    expect(status.trustState.lastLiveAt).toBe('2026-04-20T00:00:00.000Z');
  });

  // drift: verified against shipped behavior during Unit H
  it('reports stale freshness', () => {
    const root = workspace('stale');
    writeDb(root);
    writeGeneration(root, 'stale', 4);

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('stale');
    expect(status.trustState.reason).toBe('STALE_FIXTURE');
  });

  it('reports absent freshness when no artifact exists', () => {
    const root = workspace('absent');
    writeGeneration(root, 'absent', 0);

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('absent');
  });

  // drift: verified against shipped behavior during Unit H
  it('reports unavailable for corrupt generation metadata', () => {
    const root = workspace('unavailable');
    writeFileSync(join(root, '.skilled', 'skills', '.state', 'advisor', 'skill-graph-generation.json'), '{', 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('unavailable');
    expect(status.errors?.length).toBeGreaterThan(0);
  });

  it('does not leak prompt content in status output', async () => {
    const root = workspace('privacy');
    writeDb(root);
    writeGeneration(root, 'live', 5);

    const raw = (await handleAdvisorStatus({ workspaceRoot: root })).content[0].text;

    expect(raw).not.toContain('prompt');
    expect(raw).not.toContain('secret@example.com');
  });

  it('omits embeddings health when the option is absent', async () => {
    const root = workspace('embeddings-health-omitted');
    const response = await handleAdvisorStatus({ workspaceRoot: root });
    const envelope = JSON.parse(response.content[0].text) as { data: unknown };
    const status = AdvisorStatusOutputSchema.parse(envelope.data);

    expect(status).not.toHaveProperty('embeddingsHealth');
  });

  it('returns a schema-valid unavailable model-server state when requested', async () => {
    const root = workspace('embeddings-health-unavailable');
    const originalServerUrl = process.env.HF_EMBED_SERVER_URL;

    try {
      process.env.HF_EMBED_SERVER_URL = join(root, 'missing-hf-embed.sock');
      const response = await handleAdvisorStatus({
        workspaceRoot: root,
        includeEmbeddingsHealth: true,
      });
      const envelope = JSON.parse(response.content[0].text) as { data: unknown };
      const status = AdvisorStatusOutputSchema.parse(envelope.data);

      expect(status.embeddingsHealth?.modelServer.state).toBe('unavailable');
    } finally {
      if (originalServerUrl === undefined) delete process.env.HF_EMBED_SERVER_URL;
      else process.env.HF_EMBED_SERVER_URL = originalServerUrl;
    }
  });

  // drift: verified against shipped behavior during Unit H
  it('caps metadata scanning when requested to avoid unbounded status walks', () => {
    const root = workspace('scan-cap');
    writeDb(root);
    writeGeneration(root, 'live', 7);
    mkdirSync(join(root, '.skilled', 'skills', 'beta'), { recursive: true });
    writeFileSync(join(root, '.skilled', 'skills', 'beta', 'graph-metadata.json'), '{"skill_id":"beta"}\n', 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root, maxMetadataFiles: 1 });

    expect(status.skillCount).toBe(1);
    expect(status.errors).toEqual([
      expect.stringContaining('metadata scan capped at 1 files'),
    ]);
  });

  it('counts only depth-one skill roots with graph metadata', () => {
    const root = workspace('root-only-scan');
    writeDb(root);
    writeGeneration(root, 'live', 7);
    mkdirSync(join(root, '.skilled', 'skills', 'beta'), { recursive: true });
    writeFileSync(join(root, '.skilled', 'skills', 'beta', 'graph-metadata.json'), '{"skill_id":"beta"}\n', 'utf8');
    mkdirSync(join(root, '.skilled', 'skills', 'alpha', 'nested'), { recursive: true });
    writeFileSync(join(root, '.skilled', 'skills', 'alpha', 'nested', 'graph-metadata.json'), '{"skill_id":"nested"}\n', 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.skillCount).toBe(2);
  });

  it('probes the env-override artifact path the writer uses, read live', () => {
    // The probe must target the file the writing daemon actually opens. With an
    // env override set, the writer resolves there; the probe must too, even
    // when called with an unrelated workspaceRoot. A healthy DB under the
    // workspace would mask a corrupt override DB if the probe used the wrong
    // base.
    const workspaceRootDir = workspace('override-probe-workspace');
    writeDb(workspaceRootDir);
    writeGeneration(workspaceRootDir, 'live', 11);

    const overrideDir = mkdtempSync(join(tmpdir(), 'advisor-status-override-'));
    writeFileSync(join(overrideDir, 'skill-graph.sqlite'), 'not-a-sqlite-database-file-at-all-this-is-corrupt', 'utf8');
    // The generation counter follows the DB dir override, so the live
    // generation the writing daemon published sits beside its database.
    writeFileSync(join(overrideDir, 'skill-graph-generation.json'), `${JSON.stringify({
      generation: 11,
      updatedAt: '2026-04-20T00:00:00.000Z',
      sourceSignature: null,
      reason: 'LIVE_FIXTURE',
      state: 'live',
    })}\n`, 'utf8');

    const previous = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = overrideDir;
    try {
      const status = readAdvisorStatus({ workspaceRoot: workspaceRootDir, checkArtifactIntegrity: true });
      // Corruption is read from the OVERRIDE artifact, not the healthy
      // workspace-relative DB, so freshness downgrades to stale.
      expect(status.freshness).toBe('stale');
      expect(status.errors?.some((message) => message.includes('integrity check failed'))).toBe(true);
    } finally {
      if (previous === undefined) {
        delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
      } else {
        process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = previous;
      }
    }
  });

  it('downgrades a corrupt artifact from live to stale only when integrity is checked', () => {
    const root = workspace('corrupt-artifact');
    writeFileSync(join(root, ADVISOR_DB_RELATIVE_PATH), 'definitely-not-a-valid-sqlite-database-header', 'utf8');
    writeGeneration(root, 'live', 12);

    // Without the integrity opt-in the generation counters alone report live.
    const optimistic = readAdvisorStatus({ workspaceRoot: root });
    expect(optimistic.freshness).toBe('live');

    // The recommend path opts in, so the same corrupt artifact reads stale.
    const guarded = readAdvisorStatus({ workspaceRoot: root, checkArtifactIntegrity: true });
    expect(guarded.freshness).toBe('stale');
    expect(guarded.errors?.some((message) => message.includes('integrity check failed'))).toBe(true);
  });
});
