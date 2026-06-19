// ───────────────────────────────────────────────────────────────
// MODULE: Edge-Presence Currentness Tests
// ───────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { reconcileEdgePresenceCurrentness } from '../lib/graph/temporal-edges.js';
import {
  ensureEdgePresenceCurrentnessSchema,
  rollbackEdgePresenceCurrentnessSchema,
} from '../lib/search/vector-index-schema.js';

type SqliteDatabase = InstanceType<typeof Database>;

interface CausalEdgeRow {
  id: number;
  source_id: string;
  target_id: string;
  relation: string;
  invalid_at: string | null;
  invalidation_source: string | null;
}

const ENV_KEYS = [
  'SPECKIT_EDGE_PRESENCE_CURRENTNESS',
  'SPECKIT_TEMPORAL_EDGES',
] as const;

const ORIGINAL_ENV: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

function createDbWithCurrentnessColumn(): SqliteDatabase {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      invalid_at TEXT DEFAULT NULL,
      invalidation_source TEXT DEFAULT NULL
    )
  `);
  return db;
}

function createDbBeforeCurrentnessColumn(): SqliteDatabase {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      invalid_at TEXT DEFAULT NULL,
      extracted_at TEXT DEFAULT '2026-01-01T00:00:00Z'
    )
  `);
  return db;
}

function saveEnv(): void {
  for (const key of ENV_KEYS) {
    ORIGINAL_ENV[key] = process.env[key];
  }
}

function restoreEnv(): void {
  for (const key of ENV_KEYS) {
    const value = ORIGINAL_ENV[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function insertCurrentnessRows(db: SqliteDatabase): void {
  db.exec(`
    INSERT INTO causal_edges (id, source_id, target_id, relation, invalid_at, invalidation_source)
    VALUES
      (1, '10', '20', 'supports', NULL, 'legacy'),
      (2, '30', '40', 'supersedes', '2026-01-01T00:00:00Z', NULL),
      (3, '50', '60', 'contradicts', '2026-01-02T00:00:00Z', 'direct')
  `);
}

function getRows(db: SqliteDatabase): CausalEdgeRow[] {
  return db.prepare(`
    SELECT id, source_id, target_id, relation, invalid_at, invalidation_source
    FROM causal_edges
    ORDER BY id
  `).all() as CausalEdgeRow[];
}

function getColumnNames(db: SqliteDatabase): string[] {
  return (db.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
    .map((column) => column.name)
    .sort();
}

function getIndexNames(db: SqliteDatabase): string[] {
  return (db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'index'
    ORDER BY name
  `).all() as Array<{ name: string }>).map((row) => row.name);
}

function snapshot(db: SqliteDatabase): string {
  return JSON.stringify({
    columns: getColumnNames(db),
    rows: getRows(db),
  });
}

describe('Edge-presence currentness', () => {
  beforeEach(() => {
    saveEnv();
    delete process.env.SPECKIT_EDGE_PRESENCE_CURRENTNESS;
    delete process.env.SPECKIT_TEMPORAL_EDGES;
  });

  afterEach(() => {
    restoreEnv();
  });

  it('keeps rows byte-identical when reconciliation is disabled', () => {
    const db = createDbWithCurrentnessColumn();
    try {
      process.env.SPECKIT_TEMPORAL_EDGES = 'true';
      insertCurrentnessRows(db);

      const before = snapshot(db);
      const result = reconcileEdgePresenceCurrentness(db);
      const after = snapshot(db);

      expect(result).toEqual({
        enabled: false,
        clearedOpenMarkers: 0,
        markedLegacyClosures: 0,
      });
      expect(after).toBe(before);
    } finally {
      db.close();
    }
  });

  it('reconciles closure markers with edge presence when enabled', () => {
    const db = createDbWithCurrentnessColumn();
    try {
      process.env.SPECKIT_EDGE_PRESENCE_CURRENTNESS = 'true';
      process.env.SPECKIT_TEMPORAL_EDGES = 'true';
      insertCurrentnessRows(db);

      const result = reconcileEdgePresenceCurrentness(db);

      expect(result).toEqual({
        enabled: true,
        clearedOpenMarkers: 1,
        markedLegacyClosures: 1,
      });
      expect(getRows(db)).toEqual([
        {
          id: 1,
          source_id: '10',
          target_id: '20',
          relation: 'supports',
          invalid_at: null,
          invalidation_source: null,
        },
        {
          id: 2,
          source_id: '30',
          target_id: '40',
          relation: 'supersedes',
          invalid_at: '2026-01-01T00:00:00Z',
          invalidation_source: 'legacy',
        },
        {
          id: 3,
          source_id: '50',
          target_id: '60',
          relation: 'contradicts',
          invalid_at: '2026-01-02T00:00:00Z',
          invalidation_source: 'direct',
        },
      ]);
    } finally {
      db.close();
    }
  });

  it('migrates up with legacy backfill and rolls back the marker plus open-edge index', () => {
    const db = createDbBeforeCurrentnessColumn();
    try {
      db.exec(`
        INSERT INTO causal_edges (id, source_id, target_id, relation, invalid_at)
        VALUES
          (1, '10', '20', 'supports', NULL),
          (2, '30', '40', 'supersedes', '2026-01-01T00:00:00Z')
      `);

      ensureEdgePresenceCurrentnessSchema(db, 'test migration');

      expect(getColumnNames(db)).toContain('invalidation_source');
      expect(getRows(db)).toEqual([
        {
          id: 1,
          source_id: '10',
          target_id: '20',
          relation: 'supports',
          invalid_at: null,
          invalidation_source: null,
        },
        {
          id: 2,
          source_id: '30',
          target_id: '40',
          relation: 'supersedes',
          invalid_at: '2026-01-01T00:00:00Z',
          invalidation_source: 'legacy',
        },
      ]);

      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_causal_edges_open_currentness
        ON causal_edges(source_id, target_id)
        WHERE invalid_at IS NULL
      `);
      expect(getIndexNames(db)).toContain('idx_causal_edges_open_currentness');

      rollbackEdgePresenceCurrentnessSchema(db, 'test rollback');

      expect(getColumnNames(db)).not.toContain('invalidation_source');
      expect(getIndexNames(db)).not.toContain('idx_causal_edges_open_currentness');
    } finally {
      db.close();
    }
  });
});
