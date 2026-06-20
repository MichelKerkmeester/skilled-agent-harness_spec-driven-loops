// ───────────────────────────────────────────────────────────────
// MODULE: Derived Id Provenance Tests
// ───────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION,
  deriveCausalEdgeDerivedId,
} from '../lib/content-id';
import { sweepCausalEdges } from '../lib/causal/sweep';
import {
  ensureDerivedIdProvenanceSchema,
  rollbackDerivedIdProvenanceSchema,
} from '../lib/search/vector-index-schema';
import * as causalEdges from '../lib/storage/causal-edges';

type SqliteDatabase = InstanceType<typeof Database>;

interface DerivedIdRow {
  id: number;
  derived_id: string | null;
  source_id: string;
  target_id: string;
  source_anchor: string | null;
  target_anchor: string | null;
  relation: string;
  created_by: string | null;
}

const FLAG_NAME = 'SPECKIT_DERIVED_ID_PROVENANCE';
let originalFlag: string | undefined;

function createDbBeforeDerivedId(unique: boolean = true): SqliteDatabase {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      source_anchor TEXT,
      target_anchor TEXT,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      extraction_method TEXT DEFAULT 'manual',
      last_accessed TEXT${unique ? `,
      UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)` : ''}
    );
    CREATE TABLE weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    );
  `);
  return db;
}

function createDbWithDerivedId(): SqliteDatabase {
  const db = createDbBeforeDerivedId();
  ensureDerivedIdProvenanceSchema(db, 'test setup');
  return db;
}

function columnNames(db: SqliteDatabase): string[] {
  return (db.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
    .map((column) => column.name);
}

function indexNames(db: SqliteDatabase): string[] {
  return (db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'index'
    ORDER BY name
  `).all() as Array<{ name: string }>).map((row) => row.name);
}

function rows(db: SqliteDatabase): DerivedIdRow[] {
  return db.prepare(`
    SELECT id, derived_id, source_id, target_id, source_anchor, target_anchor, relation, created_by
    FROM causal_edges
    ORDER BY id ASC
  `).all() as DerivedIdRow[];
}

// The backfill hashes the SAME rule_version the live writer defaults to, so a
// backfilled edge and its live-written twin share one derived id.
function expectedBackfillId(row: Pick<DerivedIdRow, 'source_id' | 'target_id' | 'relation' | 'source_anchor' | 'target_anchor'>): string {
  return deriveCausalEdgeDerivedId({
    sourceId: row.source_id,
    targetId: row.target_id,
    relation: row.relation,
    sourceAnchor: row.source_anchor,
    targetAnchor: row.target_anchor,
    source: 'frontmatter',
    ruleVersion: DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION,
  });
}

describe('derived id provenance', () => {
  beforeEach(() => {
    originalFlag = process.env[FLAG_NAME];
    delete process.env[FLAG_NAME];
  });

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env[FLAG_NAME];
    } else {
      process.env[FLAG_NAME] = originalFlag;
    }
  });

  it('derives stable ids and includes anchors plus rule version', () => {
    const input = {
      sourceId: '10',
      targetId: '20',
      relation: 'derived_from',
      sourceAnchor: 'metadata:parent_id',
      targetAnchor: 'packet:target',
      source: 'frontmatter',
      ruleVersion: 'frontmatter:v1',
    };

    const first = deriveCausalEdgeDerivedId(input);
    const second = deriveCausalEdgeDerivedId({ ...input });
    const anchorChanged = deriveCausalEdgeDerivedId({ ...input, sourceAnchor: 'metadata:children_ids' });
    const ruleChanged = deriveCausalEdgeDerivedId({ ...input, ruleVersion: 'frontmatter:v2' });

    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(second).toBe(first);
    expect(anchorChanged).not.toBe(first);
    expect(ruleChanged).not.toBe(first);
  });

  it('adds the derived id column and backfills anchor-distinct generated edges', () => {
    const db = createDbBeforeDerivedId();
    try {
      db.exec(`
        INSERT INTO causal_edges (
          id, source_id, target_id, source_anchor, target_anchor, relation, created_by, extraction_method
        ) VALUES
          (1, '10', '20', 'metadata:parent_id', 'packet:a', 'derived_from', 'auto', 'frontmatter'),
          (2, '10', '20', 'metadata:children_ids', 'packet:a', 'derived_from', 'auto', 'frontmatter'),
          (3, '10', '20', 'manual:curated', 'packet:a', 'supports', 'manual', 'manual')
      `);

      const result = ensureDerivedIdProvenanceSchema(db, 'test migration');
      const migratedRows = rows(db);

      expect(result).toEqual({ scanned: 2, backfilled: 2, duplicatesSkipped: 0 });
      expect(columnNames(db)).toContain('derived_id');
      expect(indexNames(db)).toContain('idx_causal_edges_derived_id');
      expect(migratedRows[0].derived_id).toBe(expectedBackfillId(migratedRows[0]));
      expect(migratedRows[1].derived_id).toBe(expectedBackfillId(migratedRows[1]));
      expect(migratedRows[0].derived_id).not.toBe(migratedRows[1].derived_id);
      expect(migratedRows[2].derived_id).toBeNull();

      const rerun = ensureDerivedIdProvenanceSchema(db, 'test migration rerun');
      expect(rerun).toEqual({ scanned: 0, backfilled: 0, duplicatesSkipped: 0 });
    } finally {
      db.close();
    }
  });

  it('yields one derived id for a backfilled edge and its live-written twin', () => {
    // A logical edge written before the schema existed (backfill path) must share
    // its identity with the same edge written live (insert path). Before the fix
    // the backfill hashed the legacy rule_version while the live writer hashed
    // causal-edge:v1, so the two paths split into two ids the byte-equal partial
    // UNIQUE index could never reconcile.
    const backfillDb = createDbBeforeDerivedId();
    const liveDb = createDbWithDerivedId();
    try {
      backfillDb.exec(`
        INSERT INTO causal_edges (
          id, source_id, target_id, source_anchor, target_anchor, relation, created_by, extraction_method
        ) VALUES
          (1, '10', '20', 's:a', 't:a', 'derived_from', 'auto', 'frontmatter')
      `);
      ensureDerivedIdProvenanceSchema(backfillDb, 'parity backfill');
      const backfilled = backfillDb
        .prepare('SELECT derived_id FROM causal_edges WHERE id = 1')
        .get() as { derived_id: string | null };

      process.env[FLAG_NAME] = 'true';
      causalEdges.init(liveDb);
      // No ruleVersion passed: the live writer defaults to causal-edge:v1, exactly
      // as the real frontmatter callers do.
      const liveId = causalEdges.insertEdge(
        '10',
        '20',
        'derived_from',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter' },
      );
      const live = liveDb
        .prepare('SELECT derived_id FROM causal_edges WHERE id = ?')
        .get(liveId) as { derived_id: string | null };

      expect(backfilled.derived_id).toMatch(/^[a-f0-9]{64}$/);
      expect(live.derived_id).toBe(backfilled.derived_id);
      expect(backfilled.derived_id).toBe(expectedBackfillId({
        source_id: '10',
        target_id: '20',
        relation: 'derived_from',
        source_anchor: 's:a',
        target_anchor: 't:a',
      }));
    } finally {
      backfillDb.close();
      liveDb.close();
    }
  });

  it('does not wedge the unique index when legacy generated duplicates exist', () => {
    const db = createDbBeforeDerivedId(false);
    try {
      db.exec(`
        INSERT INTO causal_edges (
          id, source_id, target_id, source_anchor, target_anchor, relation, created_by, extraction_method
        ) VALUES
          (1, '10', '20', NULL, NULL, 'supports', 'auto', 'frontmatter'),
          (2, '10', '20', NULL, NULL, 'supports', 'auto', 'frontmatter')
      `);

      const result = ensureDerivedIdProvenanceSchema(db, 'test duplicate migration');
      const migratedRows = rows(db);

      expect(result).toEqual({ scanned: 2, backfilled: 1, duplicatesSkipped: 1 });
      expect(migratedRows.filter((row) => row.derived_id !== null)).toHaveLength(1);
      expect(migratedRows.filter((row) => row.derived_id === null)).toHaveLength(1);
      expect(indexNames(db)).toContain('idx_causal_edges_derived_id');
    } finally {
      db.close();
    }
  });

  it('leaves generated writes byte-compatible when the flag is off', () => {
    const db = createDbWithDerivedId();
    try {
      process.env[FLAG_NAME] = 'false';
      causalEdges.init(db);

      const edgeId = causalEdges.insertEdge(
        '10',
        '20',
        'supports',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );

      const row = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(edgeId) as { derived_id: string | null };
      expect(row.derived_id).toBeNull();
    } finally {
      db.close();
    }
  });

  it('persists derived ids for generated writes while leaving manual writes null', () => {
    const db = createDbWithDerivedId();
    try {
      process.env[FLAG_NAME] = 'true';
      causalEdges.init(db);

      const generatedId = causalEdges.insertEdge(
        '10',
        '20',
        'supports',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );
      const manualId = causalEdges.insertEdge(
        '30',
        '40',
        'supports',
        0.7,
        'manual evidence',
        true,
        'manual',
        { sourceAnchor: 's:m', targetAnchor: 't:m' },
      );

      const generated = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(generatedId) as { derived_id: string | null };
      const manual = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(manualId) as { derived_id: string | null };
      expect(generated.derived_id).toBe(deriveCausalEdgeDerivedId({
        sourceId: '10',
        targetId: '20',
        relation: 'supports',
        sourceAnchor: 's:a',
        targetAnchor: 't:a',
        source: 'frontmatter',
        ruleVersion: 'frontmatter:v1',
      }));
      expect(manual.derived_id).toBeNull();
    } finally {
      db.close();
    }
  });

  it('updates generated identity when the rule version changes', () => {
    const db = createDbWithDerivedId();
    try {
      process.env[FLAG_NAME] = 'true';
      causalEdges.init(db);

      const edgeId = causalEdges.insertEdge(
        '10',
        '20',
        'supports',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );
      const first = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(edgeId) as { derived_id: string };

      causalEdges.insertEdge(
        '10',
        '20',
        'supports',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v2' },
      );
      const second = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(edgeId) as { derived_id: string };

      expect(second.derived_id).not.toBe(first.derived_id);
      expect(second.derived_id).toBe(deriveCausalEdgeDerivedId({
        sourceId: '10',
        targetId: '20',
        relation: 'supports',
        sourceAnchor: 's:a',
        targetAnchor: 't:a',
        source: 'frontmatter',
        ruleVersion: 'frontmatter:v2',
      }));
    } finally {
      db.close();
    }
  });

  it('replays the same generated edge with the same derived id', () => {
    const db = createDbWithDerivedId();
    try {
      process.env[FLAG_NAME] = 'true';
      causalEdges.init(db);

      const firstEdgeId = causalEdges.insertEdge(
        '10',
        '20',
        'derived_from',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );
      const first = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(firstEdgeId) as { derived_id: string };
      db.prepare('DELETE FROM causal_edges WHERE id = ?').run(firstEdgeId);

      const secondEdgeId = causalEdges.insertEdge(
        '10',
        '20',
        'derived_from',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );
      const second = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(secondEdgeId) as { derived_id: string };

      expect(second.derived_id).toBe(first.derived_id);
    } finally {
      db.close();
    }
  });

  it('preserves derived id in causal-edge tombstone metadata', () => {
    const db = createDbWithDerivedId();
    try {
      process.env[FLAG_NAME] = 'true';
      causalEdges.init(db);

      const edgeId = causalEdges.insertEdge(
        '10',
        '20',
        'derived_from',
        0.7,
        'generated evidence',
        true,
        'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );
      const row = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(edgeId) as { derived_id: string };

      const sweep = sweepCausalEdges(db, {
        edgeIds: [edgeId ?? 0],
        reason: 'test generated edge removal',
        command: 'derived-id-provenance-test',
      });
      const tombstone = db.prepare('SELECT restore_metadata FROM causal_edge_tombstones').get() as { restore_metadata: string };
      const metadata = JSON.parse(tombstone.restore_metadata) as { edge: { derived_id: string | null } };

      expect(sweep.deleted).toBe(1);
      expect(metadata.edge.derived_id).toBe(row.derived_id);
    } finally {
      db.close();
    }
  });

  it('rolls back only the derived id column and index', () => {
    const db = createDbWithDerivedId();
    try {
      rollbackDerivedIdProvenanceSchema(db, 'test rollback');
      rollbackDerivedIdProvenanceSchema(db, 'test rollback rerun');

      expect(columnNames(db)).not.toContain('derived_id');
      expect(indexNames(db)).not.toContain('idx_causal_edges_derived_id');
      expect(columnNames(db)).toEqual(expect.arrayContaining(['source_id', 'target_id', 'relation']));
    } finally {
      db.close();
    }
  });
});
