import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const migrationScript = path.resolve(testDir, '../scripts/migrations/normalize-embedding-model-provenance.mjs');

function createShard(shardPath: string, model: string, ids: number[]): void {
  fs.mkdirSync(path.dirname(shardPath), { recursive: true });
  const db = new Database(shardPath);
  try {
    db.exec(`
      CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE vec_memories_rowids (rowid INTEGER PRIMARY KEY);
    `);
    db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('model', model);
    const insert = db.prepare('INSERT INTO vec_memories_rowids (rowid) VALUES (?)');
    for (const id of ids) insert.run(id);
  } finally {
    db.close();
  }
}

describe('normalize embedding model provenance migration', () => {
  let tempDir: string;
  let dbPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'embedding-model-provenance-'));
    dbPath = path.join(tempDir, 'context-index.sqlite');
    const db = new Database(dbPath);
    try {
      db.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          embedding_model TEXT,
          embedding_status TEXT NOT NULL,
          updated_at TEXT
        );
      `);
      const insert = db.prepare('INSERT INTO memory_index (id, embedding_model, embedding_status) VALUES (?, ?, ?)');
      insert.run(1, '', 'success');
      insert.run(2, '', 'success');
      insert.run(3, '', 'success');
      insert.run(4, 'nomic-ai/nomic-embed-text-v1.5', 'success');
    } finally {
      db.close();
    }
    createShard(path.join(tempDir, 'vectors', 'context-vectors__custom.sqlite'), 'custom-embedder-v2', [1, 3]);
    createShard(path.join(tempDir, 'vectors', 'context-vectors__nomic.sqlite'), 'nomic-ai/nomic-embed-text-v1.5', [2, 3]);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('reports shard-derived backfill candidates and leaves ambiguous rows unchanged in dry-run', () => {
    const output = execFileSync(process.execPath, [migrationScript, '--db', dbPath], { encoding: 'utf8' });
    const result = JSON.parse(output) as {
      mode: string;
      backfillCandidatesByModel: Record<string, { count: number; sampleIds: number[] }>;
      unknownProvenanceRows: number;
      unknownProvenanceSampleIds: number[];
    };

    expect(result.mode).toBe('dry-run');
    expect(result.backfillCandidatesByModel['custom-embedder-v2']).toMatchObject({ count: 1, sampleIds: [1] });
    expect(result.backfillCandidatesByModel['nomic-embed-text-v1.5']).toMatchObject({ count: 1, sampleIds: [2] });
    expect(result.unknownProvenanceRows).toBe(1);
    expect(result.unknownProvenanceSampleIds).toContain(3);

    const db = new Database(dbPath, { readonly: true });
    try {
      const row = db.prepare('SELECT embedding_model FROM memory_index WHERE id = 1').get() as { embedding_model: string };
      expect(row.embedding_model).toBe('');
    } finally {
      db.close();
    }
  });
});
