import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  SCHEMA_VERSION,
  create_schema,
  run_migrations,
} from '../lib/search/vector-index-schema';

const CHUNK_COLUMNS = [
  'chunk_id',
  'chunk_fingerprint',
  'chunk_kind',
  'chunk_start_line',
  'chunk_end_line',
] as const;

function getColumnNames(db: Database.Database, tableName: string): string[] {
  return (db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>).map((row) => row.name);
}

function hasIndex(db: Database.Database, name: string): boolean {
  const row = db.prepare(`
    SELECT 1 AS present
    FROM sqlite_master
    WHERE type = 'index'
      AND name = ?
  `).get(name) as { present?: number } | undefined;
  return row?.present === 1;
}

describe('vector-index schema incremental foundation', () => {
  it('creates memo tables, dependency edges, and chunk metadata on a fresh schema', () => {
    const db = new Database(':memory:');
    try {
      create_schema(db, {
        sqlite_vec_available: false,
        get_embedding_dim: () => 4,
      });

      expect(getColumnNames(db, 'memoization_records')).toEqual(expect.arrayContaining([
        'component_path',
        'input_fingerprint',
        'code_hash',
        'output_blob',
        'computed_at',
      ]));
      expect(getColumnNames(db, 'dependency_edges')).toEqual(expect.arrayContaining([
        'parent_path',
        'child_path',
        'kind',
        'created_at',
      ]));
      expect(getColumnNames(db, 'memory_index')).toEqual(expect.arrayContaining([...CHUNK_COLUMNS]));
      expect(hasIndex(db, 'idx_memory_chunk_identity')).toBe(true);
      expect(hasIndex(db, 'idx_memory_chunk_fingerprint')).toBe(true);
      expect(SCHEMA_VERSION).toBe(32);
    } finally {
      db.close();
    }
  });

  it('upgrades an existing database additively and preserves memory rows', () => {
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
        VALUES (7, 'specs/example', 'specs/example/spec.md', datetime('now'), datetime('now'));
      `);

      run_migrations(db, 30, 31);
      run_migrations(db, 30, 31);

      expect(getColumnNames(db, 'memory_index')).toEqual(expect.arrayContaining([...CHUNK_COLUMNS]));
      expect(getColumnNames(db, 'memoization_records')).toContain('component_path');
      expect(getColumnNames(db, 'dependency_edges')).toContain('parent_path');
      const row = db.prepare('SELECT id, spec_folder, file_path FROM memory_index WHERE id = 7').get();
      expect(row).toEqual({
        id: 7,
        spec_folder: 'specs/example',
        file_path: 'specs/example/spec.md',
      });
      for (const column of CHUNK_COLUMNS) {
        const matches = getColumnNames(db, 'memory_index').filter((name) => name === column);
        expect(matches).toHaveLength(1);
      }
    } finally {
      db.close();
    }
  });
});
