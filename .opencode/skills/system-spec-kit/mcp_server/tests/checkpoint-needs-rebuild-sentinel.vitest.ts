import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import * as checkpoints from '../lib/storage/checkpoints';
import { create_schema } from '../lib/search/vector-index-schema';

const tempDirs: string[] = [];

function makeTempDir(): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'checkpoint-needs-rebuild-'));
  tempDirs.push(tempDir);
  return tempDir;
}

function sentinelPathFor(dbPath: string): string {
  return path.join(path.dirname(fs.realpathSync(dbPath)), 'checkpoints', '.needs-rebuild');
}

function createHealthyDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  create_schema(db, {
    sqlite_vec_available: false,
    get_embedding_dim: () => 3,
  });
  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS degree_snapshots (
      memory_id INTEGER NOT NULL,
      degree_count INTEGER NOT NULL,
      snapshot_date TEXT NOT NULL,
      PRIMARY KEY (memory_id, snapshot_date)
    );
    CREATE TABLE IF NOT EXISTS memory_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      entity_text TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      frequency INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL DEFAULT 'entity_extractor',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(memory_id, entity_text)
    );
    CREATE TABLE IF NOT EXISTS entity_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      canonical_name TEXT NOT NULL UNIQUE,
      aliases TEXT DEFAULT '[]',
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      memory_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, trigger_phrases, created_at, updated_at, content_text)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    1,
    'system-spec-kit/healthy-repair',
    path.join(path.dirname(dbPath), 'healthy.md'),
    'Healthy Repair',
    'checkpoint repair',
    now,
    now,
    'Using TypeScript with Node.js to repair derived checkpoint artifacts.',
  );
  return db;
}

function createBrokenDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT,
      created_at TEXT NOT NULL,
      parent_id INTEGER
    );
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL
    );
    CREATE TABLE degree_snapshots (
      memory_id INTEGER NOT NULL,
      degree_count INTEGER NOT NULL,
      snapshot_date TEXT NOT NULL,
      PRIMARY KEY (memory_id, snapshot_date)
    );
  `);
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, parent_id)
    VALUES (?, ?, ?, ?, ?, NULL)
  `).run(1, 'system-spec-kit/broken-repair', path.join(path.dirname(dbPath), 'broken.md'), 'Broken Repair', new Date().toISOString());
  return db;
}

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('checkpoint needs-rebuild sentinel repair', () => {
  it('clears the sentinel after a successful derived rebuild repair', () => {
    const tempDir = makeTempDir();
    const dbPath = path.join(tempDir, 'memory.sqlite');
    const db = createHealthyDatabase(dbPath);

    try {
      checkpoints.init(db);
      const sentinelPath = checkpoints.writeNeedsRebuildSentinelForDatabase(db, {
        source: 'test',
        reason: 'repair test',
      });

      const result = checkpoints.repairNeedsRebuildSentinel(db, {
        source: 'test_repair',
        actor: 'mcp:test_repair',
      });

      expect(sentinelPath).toBe(sentinelPathFor(dbPath));
      expect(result.sentinelPresent).toBe(true);
      expect(result.attempted).toBe(true);
      expect(result.cleared).toBe(true);
      expect(result.summary?.failed).toEqual([]);
      expect(result.summary?.skipped).toEqual([]);
      expect(fs.existsSync(sentinelPathFor(dbPath))).toBe(false);
    } finally {
      db.close();
    }
  });

  it('keeps the sentinel after a failed derived rebuild repair', () => {
    const tempDir = makeTempDir();
    const dbPath = path.join(tempDir, 'memory.sqlite');
    const db = createBrokenDatabase(dbPath);

    try {
      checkpoints.init(db);
      checkpoints.writeNeedsRebuildSentinelForDatabase(db, {
        source: 'test',
        reason: 'repair test',
      });

      const result = checkpoints.repairNeedsRebuildSentinel(db, {
        source: 'test_repair',
        actor: 'mcp:test_repair',
      });

      expect(result.sentinelPresent).toBe(true);
      expect(result.attempted).toBe(true);
      expect(result.cleared).toBe(false);
      expect(result.summary?.failed.some((entry) => entry.name === 'auto-entities')).toBe(true);
      expect(result.summary?.skipped.some((entry) => entry.name === 'fts-rebuild')).toBe(true);
      expect(fs.existsSync(sentinelPathFor(dbPath))).toBe(true);
    } finally {
      db.close();
    }
  });
});
