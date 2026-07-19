// TEST: RELATION INFERENCE BACKFILL — OPT-IN SIMILARITY + CONTRADICTS (Vitest)
// Proves the two opt-in collectors added on top of the shipped backfill:
//  (1) opt-in OFF by default — no similarity/contradicts edges unless enabled.
//  (2) dryRun=true writes ZERO even with similarity+contradicts on.
//  (3) non-dry + similarity:true writes bounded 'supports' auto edges
//      respecting threshold>=75, K<=5, strength<=0.5.
//  (4) non-dry + contradicts:true writes 'contradicts' from supersession.
//  (5) idempotent re-run (count unchanged).
//  (6) graceful no-op when related_memories is empty.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import { backfillRelationInference } from '../lib/causal/relation-backfill';
import { validateToolArgs, ToolSchemaValidationError } from '../schemas/tool-input-schemas';

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
  // memory_index carries the PRE-COMPUTED related_memories column the
  // similarity collector reads (no live vector_search).
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

// Plain memory rows (no spec_folder) so the spec-chain collector stays silent
// and we isolate the new collectors. related_memories holds the cached
// [{ id, similarity }] (0-100 scale) shape written by link_related_on_save.
function seedSimilarity(db: SqliteDatabase): void {
  const insert = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, document_type, related_memories)
    VALUES (?, '', ?, ?, 'memory', ?)
  `);

  // Node 1: two neighbours over threshold (90, 80), one under (40 -> dropped),
  // and a self-reference (excluded).
  insert.run(1, '/a.md', 'A', JSON.stringify([
    { id: 2, similarity: 90 },
    { id: 3, similarity: 80 },
    { id: 4, similarity: 40 },
    { id: 1, similarity: 99 },
  ]));
  // Node 2: one over-threshold neighbour.
  insert.run(2, '/b.md', 'B', JSON.stringify([{ id: 5, similarity: 88 }]));
  // Nodes 3,4,5: targets only, no related_memories.
  insert.run(3, '/c.md', 'C', null);
  insert.run(4, '/d.md', 'D', null);
  insert.run(5, '/e.md', 'E', null);

  // Node 6: SIX neighbours all over threshold -> top-K must clamp to 5.
  insert.run(6, '/f.md', 'F', JSON.stringify([
    { id: 100, similarity: 99 },
    { id: 101, similarity: 98 },
    { id: 102, similarity: 97 },
    { id: 103, similarity: 96 },
    { id: 104, similarity: 95 },
    { id: 105, similarity: 94 },
  ]));
  for (let id = 100; id <= 105; id++) {
    insert.run(id, `/n${id}.md`, `N${id}`, null);
  }
}

function seedSupersession(db: SqliteDatabase): void {
  const mem = db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, document_type)
    VALUES (?, '', ?, ?, 'memory')
  `);
  mem.run(20, '/old.md', 'Old');
  mem.run(21, '/new.md', 'New');
  // 20 was superseded by 21 -> predecessor 20 'contradicts' successor 21.
  db.prepare(`
    INSERT INTO memory_lineage (memory_id, logical_key, version_number, root_memory_id, superseded_by_memory_id)
    VALUES (20, 'lk-sup', 1, 20, 21)
  `).run();
  db.prepare(`
    INSERT INTO memory_lineage (memory_id, logical_key, version_number, root_memory_id, superseded_by_memory_id)
    VALUES (21, 'lk-sup', 2, 20, NULL)
  `).run();
}

function countByRelation(db: SqliteDatabase, relation: string): number {
  return (db.prepare(
    'SELECT COUNT(*) AS c FROM causal_edges WHERE relation = ?'
  ).get(relation) as { c: number }).c;
}

describe('Relation Backfill — opt-in similarity + contradicts collectors', () => {
  let db: SqliteDatabase;

  beforeEach(() => {
    db = new Database(':memory:');
    createSchema(db);
    seedSimilarity(db);
    seedSupersession(db);
    causalEdges.init(db);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    try { db.close(); } catch { /* noop */ }
  });

  it('(1) opt-in OFF by default — no similarity/contradicts edges', () => {
    const result = backfillRelationInference(db, { dryRun: false });
    expect(result.written).toBe(0); // no spec chains, no predecessor lineage seeded
    expect(countByRelation(db, 'supports')).toBe(0);
    expect(countByRelation(db, 'contradicts')).toBe(0);
  });

  it('(2) dryRun=true writes ZERO even with both collectors on', () => {
    const before = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(before).toBe(0);

    const result = backfillRelationInference(db, {
      dryRun: true,
      similarity: true,
      contradicts: true,
    });

    expect(result.dryRun).toBe(true);
    expect(result.written).toBe(0);
    // dry run still reports candidate distribution.
    expect(result.byRelation.supports).toBeGreaterThan(0);
    expect(result.byRelation.contradicts).toBeGreaterThan(0);

    const after = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(after).toBe(0);
  });

  it('(3) non-dry + similarity:true writes bounded supports edges (threshold/K/strength)', () => {
    const result = backfillRelationInference(db, { dryRun: false, similarity: true });

    expect(result.dryRun).toBe(false);
    expect(result.written).toBeGreaterThan(0);

    const supports = db.prepare(
      "SELECT source_id, target_id, strength, created_by FROM causal_edges WHERE relation = 'supports'"
    ).all() as Array<{ source_id: string; target_id: string; strength: number; created_by: string }>;

    // Every supports edge is auto + within MAX_AUTO_STRENGTH.
    for (const row of supports) {
      expect(row.created_by).toBe('auto');
      expect(row.strength).toBeLessThanOrEqual(causalEdges.MAX_AUTO_STRENGTH);
      expect(row.source_id).not.toBe(row.target_id);
    }

    // Node 1: only neighbours >= 75 kept (2 and 3), under-threshold (40) and
    // self (1) excluded.
    const fromOne = supports.filter((r) => r.source_id === '1').map((r) => r.target_id).sort();
    expect(fromOne).toEqual(['2', '3']);

    // Node 6: six over-threshold neighbours clamp to top-K=5.
    const fromSix = supports.filter((r) => r.source_id === '6');
    expect(fromSix.length).toBe(5);
    // The dropped neighbour is the lowest-similarity one (id 105 @ 94).
    expect(fromSix.map((r) => r.target_id)).not.toContain('105');

    // No contradicts edges — that collector stayed off.
    expect(countByRelation(db, 'contradicts')).toBe(0);
  });

  it('(3b) respects a custom similarityThreshold', () => {
    // Raise threshold to 85: node 1 keeps only id 2 (90), drops id 3 (80).
    const result = backfillRelationInference(db, {
      dryRun: false,
      similarity: true,
      similarityThreshold: 85,
    });
    expect(result.written).toBeGreaterThan(0);

    const fromOne = db.prepare(
      "SELECT target_id FROM causal_edges WHERE relation = 'supports' AND source_id = '1'"
    ).all().map((r) => (r as { target_id: string }).target_id).sort();
    expect(fromOne).toEqual(['2']);
  });

  it('(4) non-dry + contradicts:true writes contradicts from supersession', () => {
    const result = backfillRelationInference(db, { dryRun: false, contradicts: true });
    expect(result.written).toBeGreaterThan(0);

    const contradicts = db.prepare(
      "SELECT source_id, target_id, strength, created_by FROM causal_edges WHERE relation = 'contradicts'"
    ).all() as Array<{ source_id: string; target_id: string; strength: number; created_by: string }>;

    // predecessor 20 'contradicts' successor 21.
    expect(contradicts.length).toBe(1);
    expect(contradicts[0].source_id).toBe('20');
    expect(contradicts[0].target_id).toBe('21');
    expect(contradicts[0].created_by).toBe('auto');
    expect(contradicts[0].strength).toBeLessThanOrEqual(causalEdges.MAX_AUTO_STRENGTH);

    // similarity stayed off.
    expect(countByRelation(db, 'supports')).toBe(0);
  });

  it('(5) idempotent re-run leaves edge count unchanged', () => {
    backfillRelationInference(db, { dryRun: false, similarity: true, contradicts: true });
    const first = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(first).toBeGreaterThan(0);

    backfillRelationInference(db, { dryRun: false, similarity: true, contradicts: true });
    const second = (db.prepare('SELECT COUNT(*) AS c FROM causal_edges').get() as { c: number }).c;
    expect(second).toBe(first);
  });

  it('(6) graceful no-op when related_memories is empty/absent', () => {
    // Clear every cached neighbour list.
    db.prepare('UPDATE memory_index SET related_memories = NULL').run();

    const result = backfillRelationInference(db, { dryRun: false, similarity: true });
    expect(countByRelation(db, 'supports')).toBe(0);
    // No throw, no supports written.
    expect(result.byRelation.supports ?? 0).toBe(0);
  });

  it('(6b) graceful no-op on unparseable related_memories', () => {
    db.prepare("UPDATE memory_index SET related_memories = '{not json' WHERE id = 1").run();
    expect(() => backfillRelationInference(db, { dryRun: false, similarity: true })).not.toThrow();
  });

  it('(7) genuinely-absent schema: no related_memories column AND no memory_lineage table', () => {
    // Isolated DB with a memory_index that LACKS related_memories and NO
    // memory_lineage table at all — exercises the columnExists/tableExists
    // no-op guards rather than the empty/NULL/unparseable VALUES branch.
    const bare = new Database(':memory:');
    bare.exec(`
      CREATE TABLE causal_edges (
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
    bare.exec(`
      CREATE TABLE weight_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
        old_strength REAL NOT NULL,
        new_strength REAL NOT NULL,
        changed_by TEXT DEFAULT 'manual',
        changed_at TEXT DEFAULT (datetime('now')),
        reason TEXT
      )
    `);
    // memory_index WITHOUT a related_memories column.
    bare.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        title TEXT,
        document_type TEXT DEFAULT 'memory',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    bare.prepare(
      "INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (1, '', '/x.md', 'X')"
    ).run();
    causalEdges.init(bare);

    let result: ReturnType<typeof backfillRelationInference> | undefined;
    expect(() => {
      result = backfillRelationInference(bare, { dryRun: false, similarity: true, contradicts: true });
    }).not.toThrow();

    expect(countByRelation(bare, 'supports')).toBe(0);
    expect(countByRelation(bare, 'contradicts')).toBe(0);
    expect(result?.byRelation.supports ?? 0).toBe(0);
    expect(result?.byRelation.contradicts ?? 0).toBe(0);

    try { bare.close(); } catch { /* noop */ }
  });

  it('(8) spec-chain pair is not re-linked by the similarity collector', () => {
    // Seed a spec-document chain (spec + plan in the SAME spec_folder) so the
    // spec-chain collector produces a caused pair between 200 and 201, then make
    // 200 and 201 mutual cached neighbours (both directions) over threshold. The
    // direction-agnostic excludedPairs suppression must drop the duplicate.
    const chain = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, document_type, related_memories)
      VALUES (?, '/specs/dedup', ?, ?, ?, ?)
    `);
    chain.run(200, '/specs/dedup/spec.md', 'Spec', 'spec', JSON.stringify([{ id: 201, similarity: 95 }]));
    chain.run(201, '/specs/dedup/plan.md', 'Plan', 'plan', JSON.stringify([{ id: 200, similarity: 95 }]));

    const result = backfillRelationInference(db, { dryRun: false, similarity: true });
    expect(result.written).toBeGreaterThan(0);

    // The structural chain produced the caused edge for the pair.
    const causedPair = db.prepare(
      "SELECT COUNT(*) AS c FROM causal_edges WHERE relation = 'caused' AND source_id = '200' AND target_id = '201'"
    ).get() as { c: number };
    expect(causedPair.c).toBe(1);

    // The similarity collector must NOT add a supports edge in EITHER direction
    // for the already-linked {200, 201} pair.
    const supportsForPair = db.prepare(`
      SELECT COUNT(*) AS c FROM causal_edges
      WHERE relation = 'supports'
        AND ((source_id = '200' AND target_id = '201')
          OR (source_id = '201' AND target_id = '200'))
    `).get() as { c: number };
    expect(supportsForPair.c).toBe(0);
  });

  it('(9) memoryCausalStatsSchema rejects bad backfill.similarityThreshold / similarity type', () => {
    // A fully-correct backfill payload validates.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { dryRun: false, similarity: true, contradicts: true, similarityThreshold: 75 },
    })).not.toThrow();

    // similarityThreshold above its 1-100 range is rejected.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { similarityThreshold: 101 },
    })).toThrow(ToolSchemaValidationError);

    // similarityThreshold below its range is rejected.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { similarityThreshold: 0 },
    })).toThrow(ToolSchemaValidationError);

    // Wrong-typed similarity flag is rejected.
    expect(() => validateToolArgs('memory_causal_stats', {
      backfill: { similarity: 'yes' as unknown as boolean },
    })).toThrow(ToolSchemaValidationError);
  });
});
