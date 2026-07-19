// ───────────────────────────────────────────────────────────────
// MODULE: Code Edge Governance Vocabulary Tests
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV,
  CODE_GRAPH_EDGE_TYPE_VOCABULARY,
  SCHEMA_VERSION,
  backfillCodeEdgeGovernanceVocabulary,
  closeDb,
  codeGraphEdgeGovernanceVocabEnabled,
  codeGraphEdgeGovernanceVocabSchemaApplied,
  ensureCodeEdgeGovernanceVocabSchema,
  getDb,
  initDb,
  rollbackCodeEdgeGovernanceVocabSchema,
  scanCodeEdgeGovernanceVocabulary,
} from '../lib/code-graph-db.js';

let tempDirs: string[] = [];
let originalFlag: string | undefined;

function createTempDir(label: string): string {
  const tempDir = mkdtempSync(join(tmpdir(), `code-edge-governance-${label}-`));
  tempDirs.push(tempDir);
  return tempDir;
}

function createLegacyDatabase(dbDir: string): Database.Database {
  const database = new Database(join(dbDir, 'code-graph.sqlite'));
  database.exec(`
    CREATE TABLE code_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      edge_type TEXT NOT NULL,
      weight REAL DEFAULT 1.0,
      metadata TEXT,
      valid_at INTEGER,
      invalid_at INTEGER
    );
    CREATE TABLE schema_version (
      version INTEGER NOT NULL
    );
    CREATE TABLE code_graph_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    INSERT INTO schema_version (version) VALUES (7);
    INSERT INTO code_graph_metadata (key, value, updated_at)
    VALUES ('graph_generation', '42', '2026-06-19T00:00:00.000Z');
    INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata, valid_at, invalid_at)
    VALUES ('source-a', 'target-a', 'CALLS', 0.8, '{"confidence":0.8}', 42, NULL);
  `);
  return database;
}

function insertEdge(database: Database.Database, edgeType: string, suffix: string): void {
  database.prepare(`
    INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
    VALUES (?, ?, ?, 1.0, NULL)
  `).run(`source-${suffix}`, `target-${suffix}`, edgeType);
}

afterEach(() => {
  closeDb();
  for (const tempDir of tempDirs) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  tempDirs = [];
  if (originalFlag === undefined) {
    delete process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV];
  } else {
    process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV] = originalFlag;
  }
});

describe('code edge governance vocabulary migration', () => {
  it('keeps automatic enforcement default-off behind the explicit flag', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV];
    delete process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV];
    expect(codeGraphEdgeGovernanceVocabEnabled()).toBe(false);

    const dbDir = createTempDir('flag-off');
    createLegacyDatabase(dbDir).close();
    initDb(dbDir);

    const database = getDb();
    expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(false);
    const version = database.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number };
    expect(version.version).toBe(SCHEMA_VERSION);
    expect(() => insertEdge(database, 'NOT_A_REAL_EDGE', 'flag-off')).not.toThrow();
  });

  it('applies through initDb when the flag is enabled', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV];
    process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV] = 'true';

    const dbDir = createTempDir('flag-on');
    createLegacyDatabase(dbDir).close();
    initDb(dbDir);

    const database = getDb();
    expect(codeGraphEdgeGovernanceVocabEnabled()).toBe(true);
    expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(true);
    expect(() => insertEdge(database, 'NOT_A_REAL_EDGE', 'flag-on')).toThrow(/CHECK constraint failed/);
  });

  it('rebuilds code_edges with a closed vocabulary and preserves existing rows', () => {
    expect(CODE_GRAPH_EDGE_TYPE_VOCABULARY).toContain('SUPERSEDES');

    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE code_edges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          edge_type TEXT NOT NULL,
          weight REAL DEFAULT 1.0,
          metadata TEXT,
          valid_at INTEGER,
          invalid_at INTEGER
        );
        CREATE TABLE code_graph_metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata, valid_at, invalid_at)
        VALUES ('legacy-source', 'legacy-target', 'CALLS', 0.8, '{"reason":"legacy"}', 12, NULL);
      `);

      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration');
      backfillCodeEdgeGovernanceVocabulary(database, 'test backfill rerun');

      expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(true);
      const preserved = database.prepare(`
        SELECT source_id, target_id, edge_type, weight, metadata, valid_at, invalid_at
        FROM code_edges
        WHERE source_id = 'legacy-source'
      `).get() as {
        source_id: string;
        target_id: string;
        edge_type: string;
        weight: number;
        metadata: string;
        valid_at: number;
        invalid_at: number | null;
      };
      expect(preserved).toEqual({
        source_id: 'legacy-source',
        target_id: 'legacy-target',
        edge_type: 'CALLS',
        weight: 0.8,
        metadata: '{"reason":"legacy"}',
        valid_at: 12,
        invalid_at: null,
      });

      for (const edgeType of CODE_GRAPH_EDGE_TYPE_VOCABULARY) {
        expect(() => insertEdge(database, edgeType, edgeType.toLowerCase())).not.toThrow();
      }
      expect(() => insertEdge(database, 'NOT_A_REAL_EDGE', 'reject')).toThrow(/CHECK constraint failed/);
    } finally {
      database.close();
    }
  });

  it('aborts before rebuild when live edge or tombstone values are outside the vocabulary', () => {
    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE code_edges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          edge_type TEXT NOT NULL,
          weight REAL DEFAULT 1.0,
          metadata TEXT,
          valid_at INTEGER,
          invalid_at INTEGER
        );
        CREATE TABLE code_graph_tombstones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          entity_kind TEXT NOT NULL CHECK (entity_kind IN ('file', 'node', 'edge')),
          entity_id TEXT,
          source_id TEXT,
          target_id TEXT,
          edge_type TEXT,
          file_path TEXT,
          reason TEXT NOT NULL,
          deleted_at TEXT NOT NULL
        );
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
        VALUES ('source-a', 'target-a', 'CALLS', 0.8, NULL);
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
        VALUES ('source-b', 'target-b', 'LEGACY_EDGE', 0.5, NULL);
        INSERT INTO code_graph_tombstones (entity_kind, edge_type, reason, deleted_at)
        VALUES ('edge', NULL, 'null-edge-type-is-allowed', '2026-06-19T00:00:00.000Z');
        INSERT INTO code_graph_tombstones (entity_kind, edge_type, reason, deleted_at)
        VALUES ('edge', 'LEGACY_TOMBSTONE_EDGE', 'bad-edge-type', '2026-06-19T00:00:00.000Z');
      `);

      expect(scanCodeEdgeGovernanceVocabulary(database, 'test scan')).toEqual([
        { tableName: 'code_edges', edgeType: 'LEGACY_EDGE', count: 1 },
        { tableName: 'code_graph_tombstones', edgeType: 'LEGACY_TOMBSTONE_EDGE', count: 1 },
      ]);
      expect(() => ensureCodeEdgeGovernanceVocabSchema(database, 'test migration'))
        .toThrow(/out-of-vocabulary edge_type value/);

      expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(false);
      const count = database.prepare('SELECT COUNT(*) AS count FROM code_edges').get() as { count: number };
      expect(count.count).toBe(2);
      const tempTable = database.prepare(`
        SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_edges__edge_vocab_rebuild'
      `).get();
      expect(tempTable).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('rolls the CHECK migration down and can re-run safely', () => {
    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE code_edges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          edge_type TEXT NOT NULL,
          weight REAL DEFAULT 1.0,
          metadata TEXT,
          valid_at INTEGER,
          invalid_at INTEGER
        );
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
        VALUES ('source-a', 'target-a', 'CALLS', 0.8, NULL);
      `);

      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration');
      expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(true);

      rollbackCodeEdgeGovernanceVocabSchema(database, 'test rollback');
      rollbackCodeEdgeGovernanceVocabSchema(database, 'test rollback idempotent');
      expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(false);

      ensureCodeEdgeGovernanceVocabSchema(database, 'test migration rerun');
      expect(codeGraphEdgeGovernanceVocabSchemaApplied(database)).toBe(true);
    } finally {
      database.close();
    }
  });
});
