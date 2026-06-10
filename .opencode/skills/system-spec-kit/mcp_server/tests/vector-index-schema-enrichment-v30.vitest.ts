import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  SCHEMA_VERSION,
  create_schema,
  run_migrations,
} from '../lib/search/vector-index-schema';

const MARKER_COLUMNS = [
  'post_insert_enrichment_status',
  'post_insert_enrichment_state',
  'post_insert_enrichment_completed_at',
  'post_insert_enrichment_version',
] as const;

function getColumnNames(db: Database.Database): string[] {
  return (db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>).map((row) => row.name);
}

function getIndexSql(db: Database.Database, indexName: string): string | null {
  const row = db.prepare(`
    SELECT sql
    FROM sqlite_master
    WHERE type = 'index'
      AND name = ?
  `).get(indexName) as { sql?: string | null } | undefined;

  return row?.sql ?? null;
}

describe('vector-index schema v30 post-insert enrichment markers', () => {
  it('creates marker columns and the repair partial index on a fresh schema', () => {
    const db = new Database(':memory:');
    try {
      create_schema(db, {
        sqlite_vec_available: false,
        get_embedding_dim: () => 4,
      });

      const columns = getColumnNames(db);
      for (const column of MARKER_COLUMNS) {
        expect(columns).toContain(column);
      }

      const statusColumn = (db.prepare('PRAGMA table_info(memory_index)').all() as Array<{
        name: string;
        notnull: number;
        dflt_value: string | null;
      }>).find((column) => column.name === 'post_insert_enrichment_status');
      expect(statusColumn).toMatchObject({ notnull: 1, dflt_value: "'complete'" });

      const indexSql = getIndexSql(db, 'idx_post_insert_enrichment_incomplete');
      expect(indexSql).toContain("WHERE post_insert_enrichment_status != 'complete'");
      expect(SCHEMA_VERSION).toBeGreaterThanOrEqual(30);
    } finally {
      db.close();
    }
  });

  it('upgrades a v29 memory_index idempotently and defaults existing rows to complete', () => {
    const db = new Database(':memory:');
    try {
      db.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT NOT NULL,
          file_path TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        INSERT INTO memory_index (id, spec_folder, file_path, created_at, updated_at)
        VALUES (1, 'specs/example', 'specs/example/spec.md', datetime('now'), datetime('now'));
      `);

      run_migrations(db, 29, 30);
      run_migrations(db, 29, 30);

      const columns = getColumnNames(db);
      for (const column of MARKER_COLUMNS) {
        expect(columns.filter((name) => name === column)).toHaveLength(1);
      }

      const row = db.prepare(`
        SELECT post_insert_enrichment_status AS status,
               post_insert_enrichment_state AS state,
               post_insert_enrichment_completed_at AS completedAt,
               post_insert_enrichment_version AS version
        FROM memory_index
        WHERE id = 1
      `).get() as { status: string; state: string | null; completedAt: string | null; version: number | null };
      expect(row).toEqual({
        status: 'complete',
        state: null,
        completedAt: null,
        version: null,
      });

      const matchingIndexes = db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'index'
          AND name = 'idx_post_insert_enrichment_incomplete'
      `).all();
      expect(matchingIndexes).toHaveLength(1);
    } finally {
      db.close();
    }
  });
});
