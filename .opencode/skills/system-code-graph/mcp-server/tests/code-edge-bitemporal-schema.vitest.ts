// ───────────────────────────────────────────────────────────────
// MODULE: Code Edge Bitemporal Schema Tests
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV,
  SCHEMA_VERSION,
  backfillCodeEdgeBitemporalColumns,
  closeDb,
  codeGraphEdgeBitemporalReadsEnabled,
  ensureCodeEdgeBitemporalSchema,
  getDb,
  initDb,
  rollbackCodeEdgeBitemporalSchema,
} from '../lib/code-graph-db.js';

let tempDirs: string[] = [];
let originalFlag: string | undefined;

function createTempDir(label: string): string {
  const tempDir = mkdtempSync(join(tmpdir(), `code-edge-bitemporal-${label}-`));
  tempDirs.push(tempDir);
  return tempDir;
}

function edgeColumns(database: Database.Database): string[] {
  const rows = database.prepare('PRAGMA table_info(code_edges)').all() as Array<{ name: string }>;
  return rows.map((row) => row.name);
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
      metadata TEXT
    );
    CREATE TABLE schema_version (
      version INTEGER NOT NULL
    );
    CREATE TABLE code_graph_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    INSERT INTO schema_version (version) VALUES (6);
    INSERT INTO code_graph_metadata (key, value, updated_at)
    VALUES ('graph_generation', '42', '2026-06-19T00:00:00.000Z');
    INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
    VALUES ('source-a', 'target-a', 'CALLS', 0.8, '{"confidence":0.8}');
  `);
  return database;
}

afterEach(() => {
  closeDb();
  for (const tempDir of tempDirs) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  tempDirs = [];
  if (originalFlag === undefined) {
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
  } else {
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = originalFlag;
  }
});

describe('code edge bitemporal schema migration', () => {
  it('applies through initDb and backfills legacy edges to the current generation', () => {
    const dbDir = createTempDir('legacy-up');
    const legacy = createLegacyDatabase(dbDir);
    expect(edgeColumns(legacy)).not.toContain('valid_at');
    legacy.close();

    initDb(dbDir);
    const database = getDb();
    expect(edgeColumns(database)).toEqual(expect.arrayContaining(['valid_at', 'invalid_at']));

    const version = database.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number };
    expect(version.version).toBe(SCHEMA_VERSION);

    const row = database.prepare(`
      SELECT source_id, target_id, valid_at, invalid_at
      FROM code_edges
      WHERE source_id = 'source-a'
    `).get() as {
      source_id: string;
      target_id: string;
      valid_at: number | null;
      invalid_at: number | null;
    };
    expect(row).toEqual({
      source_id: 'source-a',
      target_id: 'target-a',
      valid_at: 42,
      invalid_at: null,
    });
  });

  it('rolls back the additive edge window columns and can be re-run safely', () => {
    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE code_edges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          edge_type TEXT NOT NULL,
          weight REAL DEFAULT 1.0,
          metadata TEXT
        );
        CREATE TABLE code_graph_metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        INSERT INTO code_graph_metadata (key, value, updated_at)
        VALUES ('graph_generation', '7', '2026-06-19T00:00:00.000Z');
      `);

      ensureCodeEdgeBitemporalSchema(database, 'test migration');
      expect(edgeColumns(database)).toEqual(expect.arrayContaining(['valid_at', 'invalid_at']));

      rollbackCodeEdgeBitemporalSchema(database, 'test rollback');
      rollbackCodeEdgeBitemporalSchema(database, 'test rollback idempotent');
      expect(edgeColumns(database)).not.toContain('valid_at');
      expect(edgeColumns(database)).not.toContain('invalid_at');
    } finally {
      database.close();
    }
  });

  it('preserves existing temporal values on idempotent up and backfill reruns', () => {
    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE code_edges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          edge_type TEXT NOT NULL,
          weight REAL DEFAULT 1.0,
          metadata TEXT
        );
        CREATE TABLE code_graph_metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        INSERT INTO code_graph_metadata (key, value, updated_at)
        VALUES ('graph_generation', '9', '2026-06-19T00:00:00.000Z');
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
        VALUES ('fresh-source', 'fresh-target', 'CALLS', 0.8, NULL);
      `);

      ensureCodeEdgeBitemporalSchema(database, 'test migration');
      database.prepare(`
        UPDATE code_edges
        SET valid_at = 3, invalid_at = 8
        WHERE source_id = 'fresh-source'
      `).run();

      ensureCodeEdgeBitemporalSchema(database, 'test migration rerun');
      backfillCodeEdgeBitemporalColumns(database, 'test backfill rerun');

      const rows = database.prepare(`
        SELECT valid_at, invalid_at
        FROM code_edges
        WHERE source_id = 'fresh-source'
      `).all() as Array<{ valid_at: number | null; invalid_at: number | null }>;
      expect(rows).toEqual([{ valid_at: 3, invalid_at: 8 }]);
      expect(edgeColumns(database).filter((column) => column === 'valid_at')).toHaveLength(1);
      expect(edgeColumns(database).filter((column) => column === 'invalid_at')).toHaveLength(1);
    } finally {
      database.close();
    }
  });

  it('creates the bitemporal columns on a fresh database init path', () => {
    const dbDir = createTempDir('fresh-init');
    initDb(dbDir);
    const database = getDb();

    expect(edgeColumns(database)).toEqual(expect.arrayContaining(['valid_at', 'invalid_at']));
    const version = database.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number };
    expect(version.version).toBe(SCHEMA_VERSION);
  });

  it('fails closed when required migration tables are missing', () => {
    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE code_graph_metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);

      expect(() => ensureCodeEdgeBitemporalSchema(database, 'test migration'))
        .toThrow(/required table "code_edges" is missing/);
    } finally {
      database.close();
    }
  });

  it('keeps temporal read consumption default-off behind an explicit flag', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    expect(codeGraphEdgeBitemporalReadsEnabled()).toBe(false);

    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    expect(codeGraphEdgeBitemporalReadsEnabled()).toBe(true);
  });
});
