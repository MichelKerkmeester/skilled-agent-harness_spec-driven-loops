// TEST: RELATION BACKFILL — CONFLICT GUARD + HONEST COUNTING (Vitest)
// Locks the data-integrity + honesty contract added on top of the backfill:
//  (a) reciprocal lineage pair: the 'caused' edge is NOT invalidated by the
//      supersession 'contradicts' (which is skipped), and summary.skippedConflicting>=1.
//  (b) a PRE-EXISTING manual valid 'caused' edge survives a backfill contradicts
//      candidate on the same pair (auto contradicts skipped).
//  (c) written===0 on a second committed run (upserts add nothing new).
//  (d) result.byRelation equals the live valid-auto-edge distribution.
//  (e) the strict inner backfill schema rejects a typo'd opt-in key.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import { backfillRelationInference } from '../lib/causal/relation-backfill';
import { validateToolArgs, ToolSchemaValidationError } from '../schemas/tool-input-schemas';

type SqliteDatabase = InstanceType<typeof Database>;

// causal_edges carries the temporal columns (valid_at/invalid_at) so the
// conflict guard and the valid-only counters resolve deterministically, matching
// the shipped schema where SPECKIT_TEMPORAL_EDGES is on by default.
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
      valid_at TEXT DEFAULT NULL,
      invalid_at TEXT DEFAULT NULL,
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
      related_memories TEXT,
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

// Reciprocal lineage pair: 20.superseded_by = 21 AND 21.predecessor = 20.
// The lineage collector emits 'caused' 20->21; the supersession collector emits
// 'contradicts' 20->21 — the SAME directed pair with conflicting relations.
function seedReciprocalLineage(db: SqliteDatabase): void {
  const mem = db.prepare(
    `INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, '', ?, ?)`,
  );
  mem.run(20, '/old.md', 'Old');
  mem.run(21, '/new.md', 'New');
  db.prepare(`
    INSERT INTO memory_lineage (memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id, superseded_by_memory_id)
    VALUES (20, 'lk', 1, 20, NULL, 21)
  `).run();
  db.prepare(`
    INSERT INTO memory_lineage (memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id, superseded_by_memory_id)
    VALUES (21, 'lk', 2, 20, 20, NULL)
  `).run();
}

// Three-node transitive contradiction cycle 30->31->32->30. Each consecutive
// directed pair is reciprocal in the SAME way as seedReciprocalLineage: the
// successor records predecessor_memory_id (lineage emits 'caused' pred->succ) AND
// the predecessor records superseded_by_memory_id (supersession emits 'contradicts'
// on the SAME directed pair). So all three directed pairs carry both a 'caused'
// and a conflicting 'contradicts' candidate, forming a transitive cycle of
// conflicts the guard must resolve independently per pair.
//   pair 30->31 : 31.predecessor=30, 30.superseded_by=31
//   pair 31->32 : 32.predecessor=31, 31.superseded_by=32
//   pair 32->30 : 30.predecessor=32, 32.superseded_by=30
function seedThreeNodeCycle(db: SqliteDatabase): void {
  const mem = db.prepare(
    `INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, '', ?, ?)`,
  );
  mem.run(30, '/n30.md', 'N30');
  mem.run(31, '/n31.md', 'N31');
  mem.run(32, '/n32.md', 'N32');
  const lin = db.prepare(`
    INSERT INTO memory_lineage (memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id, superseded_by_memory_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  // 30: predecessor 32 (closes cycle), superseded_by 31
  lin.run(30, 'cyc', 1, 30, 32, 31);
  // 31: predecessor 30, superseded_by 32
  lin.run(31, 'cyc', 2, 30, 30, 32);
  // 32: predecessor 31, superseded_by 30 (closes cycle)
  lin.run(32, 'cyc', 3, 30, 31, 30);
}

function selectEdge(
  db: SqliteDatabase,
  source: string,
  target: string,
  relation: string,
): { invalid_at: string | null; created_by: string } | undefined {
  return db.prepare(
    'SELECT invalid_at, created_by FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?',
  ).get(source, target, relation) as { invalid_at: string | null; created_by: string } | undefined;
}

describe('Relation Backfill — conflict guard + honest counting', () => {
  let db: SqliteDatabase;

  beforeEach(() => {
    db = new Database(':memory:');
    createSchema(db);
    causalEdges.init(db);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    try { db.close(); } catch { /* noop */ }
  });

  it('(a) reciprocal lineage: caused survives, contradicts skipped, skippedConflicting>=1', () => {
    seedReciprocalLineage(db);

    const result = backfillRelationInference(db, { dryRun: false, contradicts: true });

    // The lineage 'caused' edge exists and is NOT invalidated.
    const caused = selectEdge(db, '20', '21', 'caused');
    expect(caused).toBeDefined();
    expect(caused?.invalid_at).toBeNull();

    // The conflicting supersession 'contradicts' was NOT inserted.
    const contradicts = selectEdge(db, '20', '21', 'contradicts');
    expect(contradicts).toBeUndefined();

    // It was counted as skipped-conflicting, not written.
    expect(result.skippedConflicting).toBeGreaterThanOrEqual(1);
    // Only the lineage 'caused' edge was written.
    expect(result.written).toBe(1);
    expect(result.byRelation.contradicts ?? 0).toBe(0);
    expect(result.byRelation.caused).toBe(1);
  });

  it('(b) pre-existing MANUAL valid caused survives a backfill contradicts candidate', () => {
    seedReciprocalLineage(db);

    // A higher-strength MANUAL caused edge on the pair, inserted before backfill.
    causalEdges.insertEdge('20', '21', 'caused', 0.95, 'manual baseline', true, 'manual');
    const beforeManual = selectEdge(db, '20', '21', 'caused');
    expect(beforeManual?.created_by).toBe('manual');
    expect(beforeManual?.invalid_at).toBeNull();

    const result = backfillRelationInference(db, { dryRun: false, contradicts: true });

    // The manual edge is still valid (NOT invalidated by the auto contradicts).
    const afterManual = selectEdge(db, '20', '21', 'caused');
    expect(afterManual).toBeDefined();
    expect(afterManual?.invalid_at).toBeNull();

    // The auto contradicts on that pair was skipped.
    const contradicts = selectEdge(db, '20', '21', 'contradicts');
    expect(contradicts).toBeUndefined();
    expect(result.skippedConflicting).toBeGreaterThanOrEqual(1);
  });

  it('(c) written===0 on a second committed run', () => {
    seedReciprocalLineage(db);

    const first = backfillRelationInference(db, { dryRun: false, contradicts: true });
    expect(first.written).toBeGreaterThan(0);

    const second = backfillRelationInference(db, { dryRun: false, contradicts: true });
    expect(second.written).toBe(0);
    // A no-op re-run reports an empty byRelation distribution (no NEW edges).
    expect(Object.values(second.byRelation).reduce((a, b) => a + b, 0)).toBe(0);
  });

  it('(d) byRelation equals the live valid-auto-edge distribution', () => {
    // Spec-document chain (caused + supports) + reciprocal lineage (one skipped).
    const chain = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, document_type)
      VALUES (?, 'specs/300-demo', ?, ?, ?)
    `);
    chain.run(1, '/spec.md', 'Spec', 'spec');
    chain.run(2, '/plan.md', 'Plan', 'plan');
    chain.run(3, '/tasks.md', 'Tasks', 'tasks');
    chain.run(4, '/checklist.md', 'Checklist', 'checklist');
    seedReciprocalLineage(db);

    const result = backfillRelationInference(db, { dryRun: false, contradicts: true });

    const liveRows = db.prepare(`
      SELECT relation, COUNT(*) AS c FROM causal_edges
      WHERE created_by = 'auto' AND (invalid_at IS NULL OR invalid_at = '')
      GROUP BY relation
    `).all() as Array<{ relation: string; c: number }>;
    const live: Record<string, number> = {};
    for (const row of liveRows) live[row.relation] = row.c;

    expect(result.byRelation).toEqual(live);
  });

  it('(f) 3-node transitive contradiction cycle: all caused survive, all contradicts skipped', () => {
    seedThreeNodeCycle(db);

    const result = backfillRelationInference(db, { dryRun: false, contradicts: true });

    // The three lineage 'caused' edges that form the cycle all exist and stay valid.
    const causedPairs: Array<[string, string]> = [['32', '30'], ['30', '31'], ['31', '32']];
    for (const [src, tgt] of causedPairs) {
      const caused = selectEdge(db, src, tgt, 'caused');
      expect(caused, `caused ${src}->${tgt}`).toBeDefined();
      expect(caused?.invalid_at, `caused ${src}->${tgt} valid`).toBeNull();
    }

    // The three conflicting supersession 'contradicts' candidates on the SAME
    // directed pairs were all skipped — none inserted, none invalidated a caused.
    const contradictsPairs: Array<[string, string]> = [['30', '31'], ['31', '32'], ['32', '30']];
    for (const [src, tgt] of contradictsPairs) {
      expect(selectEdge(db, src, tgt, 'contradicts'), `contradicts ${src}->${tgt}`).toBeUndefined();
    }

    // Counts are honest: exactly the 3 caused edges written, exactly 3 conflicts skipped.
    expect(result.written).toBe(3);
    expect(result.skippedConflicting).toBe(3);
    expect(result.byRelation.caused).toBe(3);
    expect(result.byRelation.contradicts ?? 0).toBe(0);

    // No contradicts edge is left valid anywhere in the cycle.
    const liveContradicts = db.prepare(`
      SELECT COUNT(*) AS c FROM causal_edges
      WHERE relation = 'contradicts' AND (invalid_at IS NULL OR invalid_at = '')
    `).get() as { c: number };
    expect(liveContradicts.c).toBe(0);
  });

  it('(e) strict inner backfill schema rejects a typo\'d opt-in key', () => {
    // A valid payload still passes.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { dryRun: false, contradicts: true },
    })).not.toThrow();

    // A typo of a real key ('contradict' for 'contradicts') is rejected, not dropped.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { contradict: true },
    })).toThrow(ToolSchemaValidationError);

    // An arbitrary unknown inner key is rejected too.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { threshold: 50 },
    })).toThrow(ToolSchemaValidationError);
  });
});
