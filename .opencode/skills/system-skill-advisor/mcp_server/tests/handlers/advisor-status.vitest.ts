// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Status Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import Database from 'better-sqlite3';

import { describe, expect, it } from 'vitest';

import { handleAdvisorStatus, readAdvisorStatus } from '../../handlers/advisor-status.js';
import { computeAdvisorSourceSignature } from '../../lib/freshness.js';

const ADVISOR_DB_RELATIVE_PATH = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp_server',
  'database',
  'skill-graph.sqlite',
);

function workspace(name: string): string {
  const root = mkdtempSync(join(tmpdir(), `advisor-status-${name}-`));
  mkdirSync(join(root, '.opencode', 'skills', '.advisor-state'), { recursive: true });
  mkdirSync(join(root, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database'), { recursive: true });
  mkdirSync(join(root, '.opencode', 'skills', 'alpha'), { recursive: true });
  writeFileSync(join(root, '.opencode', 'skills', 'alpha', 'graph-metadata.json'), '{"skill_id":"alpha"}\n', 'utf8');
  return root;
}

function writeGeneration(root: string, state: 'live' | 'stale' | 'absent' | 'unavailable', generation = 1): void {
  writeFileSync(join(root, '.opencode', 'skills', '.advisor-state', 'skill-graph-generation.json'), `${JSON.stringify({
    generation,
    updatedAt: '2026-04-20T00:00:00.000Z',
    sourceSignature: null,
    reason: `${state.toUpperCase()}_FIXTURE`,
    state,
  })}\n`, 'utf8');
}

function writeDb(root: string): void {
  writeFileSync(join(root, ADVISOR_DB_RELATIVE_PATH), '', 'utf8');
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
    const metadataPath = join(root, '.opencode', 'skills', 'alpha', 'graph-metadata.json');
    utimesSync(dbPath, new Date('2026-04-19T00:00:00.000Z'), new Date('2026-04-19T00:00:00.000Z'));
    utimesSync(metadataPath, new Date('2026-04-21T00:00:00.000Z'), new Date('2026-04-21T00:00:00.000Z'));
    const sourceSignature = computeAdvisorSourceSignature(root);
    writeFileSync(join(root, '.opencode', 'skills', '.advisor-state', 'skill-graph-generation.json'), `${JSON.stringify({
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
    const metadataPath = join(root, '.opencode', 'skills', 'alpha', 'graph-metadata.json');
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
    writeFileSync(join(root, '.opencode', 'skills', '.advisor-state', 'skill-graph-generation.json'), '{', 'utf8');

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

  // drift: verified against shipped behavior during Unit H
  it('caps metadata scanning when requested to avoid unbounded status walks', () => {
    const root = workspace('scan-cap');
    writeDb(root);
    writeGeneration(root, 'live', 7);
    mkdirSync(join(root, '.opencode', 'skills', 'beta'), { recursive: true });
    writeFileSync(join(root, '.opencode', 'skills', 'beta', 'graph-metadata.json'), '{"skill_id":"beta"}\n', 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root, maxMetadataFiles: 1 });

    expect(status.skillCount).toBe(1);
    expect(status.errors).toEqual([
      expect.stringContaining('metadata scan capped at 1 files'),
    ]);
  });
});
