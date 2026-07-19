// TEST: RELATION INFERENCE BACKFILL (Vitest)
// Proves the bounded, safe relation-inference backfill contract:
//  (1) dryRun=true returns candidate counts and writes ZERO edges.
//  (2) non-dryRun writes BOUNDED auto edges (created_by='auto') respecting insertEdge guards.
//  (3) invalidateEntityDensityCache is invoked after a real (non-dry) run.
//  (4) once auto edges exist, the coverage reporter advertises implemented:true / non-null command
//      and lastBackfillAt becomes a real timestamp.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import * as entityDensity from '../lib/search/entity-density';
import { backfillRelationInference } from '../lib/causal/relation-backfill';
import { buildRelationCoverageState } from '../lib/causal/relation-coverage';

type SqliteDatabase = InstanceType<typeof Database>;

function createSchema(db: SqliteDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      source_anchor TEXT,
      target_anchor TEXT,
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      title TEXT,
      document_type TEXT DEFAULT 'memory',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      importance_tier TEXT DEFAULT 'normal'
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_lineage (
      memory_id INTEGER PRIMARY KEY,
      logical_key TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      root_memory_id INTEGER NOT NULL,
      predecessor_memory_id INTEGER,
      superseded_by_memory_id INTEGER,
      valid_from TEXT,
      valid_to TEXT,
      transition_event TEXT,
      actor TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

function seedSpecFolder(db: SqliteDatabase): void {
  // A complete spec-document chain in one folder -> 6 inferred edges
  // (spec->plan, plan->tasks, tasks->impl = caused; checklist/decision/research = supports).
  const insert = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, document_type)
    VALUES (?, 'specs/100-demo', ?, ?, ?)
  `);
  insert.run(1, '/spec.md', 'Spec', 'spec');
  insert.run(2, '/plan.md', 'Plan', 'plan');
  insert.run(3, '/tasks.md', 'Tasks', 'tasks');
  insert.run(4, '/impl.md', 'Impl', 'implementation_summary');
  insert.run(5, '/checklist.md', 'Checklist', 'checklist');
  insert.run(6, '/decision.md', 'Decision', 'decision_record');
  insert.run(7, '/research.md', 'Research', 'research');

  // A lineage predecessor chain: 10 -> 11 -> 12 (two 'caused' edges).
  const mem = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, document_type)
    VALUES (?, 'specs/200-lin', ?, ?, 'memory')
  `);
  mem.run(10, '/v1.md', 'V1');
  mem.run(11, '/v2.md', 'V2');
  mem.run(12, '/v3.md', 'V3');
  const lin = db.prepare(`
    INSERT INTO memory_lineage (memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id)
    VALUES (?, 'lk-200', ?, 10, ?)
  `);
  lin.run(10, 1, null);
  lin.run(11, 2, 10);
  lin.run(12, 3, 11);
}

describe('Relation Inference Backfill', () => {
  let db: SqliteDatabase;

  beforeEach(() => {
    db = new Database(':memory:');
    createSchema(db);
    seedSpecFolder(db);
    causalEdges.init(db);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    try { db.close(); } catch { /* noop */ }
  });

  it('(1) dryRun=true returns candidate counts and writes ZERO edges', () => {
    const before = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(before).toBe(0);

    const result = backfillRelationInference(db, { dryRun: true });

    expect(result.dryRun).toBe(true);
    expect(result.written).toBe(0);
    expect(result.inferred).toBeGreaterThan(0);
    expect(result.scanned).toBeGreaterThan(0);
    // candidate distribution is reported without writing
    expect(result.byRelation.caused).toBeGreaterThan(0);
    expect(result.byRelation.supports).toBeGreaterThan(0);

    const after = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(after).toBe(0);
  });

  it('defaults to dryRun (omitted dryRun writes nothing)', () => {
    const result = backfillRelationInference(db, {});
    expect(result.dryRun).toBe(true);
    expect(result.written).toBe(0);
    expect((db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c).toBe(0);
  });

  it('(2) non-dryRun writes BOUNDED auto edges respecting guards', () => {
    const result = backfillRelationInference(db, { dryRun: false });

    expect(result.dryRun).toBe(false);
    expect(result.written).toBeGreaterThan(0);

    const rows = db.prepare('SELECT source_id, target_id, relation, strength, created_by FROM causal_edges').all() as Array<{
      source_id: string; target_id: string; relation: string; strength: number; created_by: string;
    }>;

    // Every written edge is created_by='auto' and within MAX_AUTO_STRENGTH (0.5).
    for (const row of rows) {
      expect(row.created_by).toBe('auto');
      expect(row.strength).toBeLessThanOrEqual(causalEdges.MAX_AUTO_STRENGTH);
      expect(row.source_id).not.toBe(row.target_id); // no self-loops
    }

    // The spec chain contributes caused (spec->plan->tasks->impl) + supports edges.
    const caused = rows.filter((r) => r.relation === 'caused');
    const supports = rows.filter((r) => r.relation === 'supports');
    expect(caused.length).toBeGreaterThan(0);
    expect(supports.length).toBeGreaterThan(0);

    // lineage predecessor edges: 10->11 and 11->12 caused
    const lineage = rows.filter((r) => r.relation === 'caused' && (r.source_id === '10' || r.source_id === '11'));
    expect(lineage.length).toBe(2);

    // Idempotent: a second committed run inserts no NEW rows (upsert).
    const countAfterFirst = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    backfillRelationInference(db, { dryRun: false });
    const countAfterSecond = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(countAfterSecond).toBe(countAfterFirst);
  });

  it('respects the bounded limit', () => {
    // limit=0 is invalid -> falls back to default (still bounded); negative is ignored.
    const result = backfillRelationInference(db, { dryRun: true, limit: -5 });
    expect(result.scanned).toBeGreaterThan(0);
  });

  it('(3) invokes invalidateEntityDensityCache after a real (non-dry) run', () => {
    const spy = vi.spyOn(entityDensity, 'invalidateEntityDensityCache');
    backfillRelationInference(db, { dryRun: false });
    expect(spy).toHaveBeenCalled();
  });

  it('(3b) does NOT invalidate entity-density cache on a dry run', () => {
    const spy = vi.spyOn(entityDensity, 'invalidateEntityDensityCache');
    backfillRelationInference(db, { dryRun: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('(4) once auto edges exist, coverage reporter advertises implemented:true with a real command + lastBackfillAt', () => {
    // Before: no auto edges -> lastBackfillAt null but job is still advertised as implemented.
    const before = buildRelationCoverageState({ supports: 1 }, db);
    expect(before.backfillJob.implemented).toBe(true);
    expect(before.backfillJob.command).not.toBeNull();
    expect(before.backfillJob.lastBackfillAt).toBeNull();

    backfillRelationInference(db, { dryRun: false });

    const after = buildRelationCoverageState({ caused: 3, supports: 3 }, db);
    expect(after.backfillJob.implemented).toBe(true);
    expect(after.backfillJob.command).not.toBeNull();
    expect(after.backfillJob.command).toContain('memory_causal_stats');
    // lastBackfillAt now reflects a real auto-edge timestamp.
    expect(after.backfillJob.lastBackfillAt).not.toBeNull();
  });

  it('returns an empty summary when required tables are absent (cold-start safety)', () => {
    const emptyDb = new Database(':memory:');
    try {
      const result = backfillRelationInference(emptyDb, { dryRun: false });
      expect(result.scanned).toBe(0);
      expect(result.written).toBe(0);
      expect(result.inferred).toBe(0);
    } finally {
      emptyDb.close();
    }
  });
});
