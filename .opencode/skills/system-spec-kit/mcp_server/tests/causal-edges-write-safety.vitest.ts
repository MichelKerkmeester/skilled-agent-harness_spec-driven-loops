// TEST: CAUSAL EDGES WRITE SAFETY
// Covers automatic-provenance cap broadening (auto + auto-*), the
// manual-edge overwrite guard on insertEdge conflicts, and the shared
// predicate semantics used by both the insert and consolidation cap paths.
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import { runHebbianCycle } from '../lib/storage/consolidation';

type SqliteDatabase = InstanceType<typeof Database>;

interface EdgeRow {
  id: number;
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
  evidence: string | null;
  created_by: string;
}

describe('Causal Edges Write Safety', () => {
  let testDb: SqliteDatabase;

  function resetEdges(): void {
    testDb.exec('DELETE FROM weight_history');
    testDb.exec('DELETE FROM causal_edges');
  }

  function getEdge(sourceId: string, targetId: string, relation: string): EdgeRow | undefined {
    return testDb.prepare(`
      SELECT id, source_id, target_id, relation, strength, evidence, created_by
      FROM causal_edges
      WHERE source_id = ? AND target_id = ? AND relation = ?
    `).get(sourceId, targetId, relation) as EdgeRow | undefined;
  }

  beforeAll(() => {
    testDb = new Database(':memory:');
    testDb.exec(`
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
    testDb.exec(`
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
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        title TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        importance_tier TEXT DEFAULT 'normal'
      )
    `);
    causalEdges.init(testDb);
  });

  afterAll(() => {
    testDb.close();
  });

  beforeEach(() => {
    resetEdges();
  });

  describe('isAutoEdgeCreator predicate', () => {
    it('classifies auto and namespaced auto-* creators as automatic', () => {
      expect(causalEdges.isAutoEdgeCreator('auto')).toBe(true);
      expect(causalEdges.isAutoEdgeCreator('auto-session')).toBe(true);
      expect(causalEdges.isAutoEdgeCreator('auto-rq-b3')).toBe(true);
      expect(causalEdges.isAutoEdgeCreator('auto-reducer')).toBe(true);
    });

    it('does not classify non-auto creators as automatic', () => {
      expect(causalEdges.isAutoEdgeCreator('manual')).toBe(false);
      expect(causalEdges.isAutoEdgeCreator('automatic')).toBe(false);
      expect(causalEdges.isAutoEdgeCreator('author')).toBe(false);
      expect(causalEdges.isAutoEdgeCreator('autosession')).toBe(false);
      expect(causalEdges.isAutoEdgeCreator('curated')).toBe(false);
      expect(causalEdges.isAutoEdgeCreator('')).toBe(false);
      expect(causalEdges.isAutoEdgeCreator(null)).toBe(false);
      expect(causalEdges.isAutoEdgeCreator(undefined)).toBe(false);
    });
  });

  describe('insert cap path', () => {
    it('caps auto-session edges at MAX_AUTO_STRENGTH on insert', () => {
      const id = causalEdges.insertEdge('1', '2', 'caused', 1.0, null, true, 'auto-session');
      expect(id).not.toBeNull();
      const edge = getEdge('1', '2', 'caused');
      expect(edge?.strength).toBe(causalEdges.MAX_AUTO_STRENGTH);
      expect(edge?.created_by).toBe('auto-session');
    });

    it('caps other auto-* namespaced edges on insert', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.9, null, true, 'auto-rq-b3');
      expect(getEdge('1', '2', 'caused')?.strength).toBe(causalEdges.MAX_AUTO_STRENGTH);
    });

    it('keeps the legacy auto cap behavior unchanged', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null, true, 'auto');
      expect(getEdge('1', '2', 'caused')?.strength).toBe(causalEdges.MAX_AUTO_STRENGTH);
    });

    it('does not cap manual or non-auto provenance values', () => {
      causalEdges.insertEdge('1', '2', 'caused', 1.0, null, true, 'manual');
      expect(getEdge('1', '2', 'caused')?.strength).toBe(1.0);

      causalEdges.insertEdge('1', '3', 'caused', 1.0, null, true, 'automatic');
      expect(getEdge('1', '3', 'caused')?.strength).toBe(1.0);
    });

    it('applies edge bounds to auto-session edges like auto edges', () => {
      for (let i = 0; i < causalEdges.MAX_EDGES_PER_NODE; i++) {
        const id = causalEdges.insertEdge('hub', `n${i}`, 'supports', 0.8, null, true, 'manual');
        expect(id).not.toBeNull();
      }

      const rejected = causalEdges.insertEdge('hub', 'overflow', 'supports', 0.4, null, true, 'auto-session');
      expect(rejected).toBeNull();
      expect(getEdge('hub', 'overflow', 'supports')).toBeUndefined();

      const manualAllowed = causalEdges.insertEdge('hub', 'overflow', 'supports', 0.4, null, true, 'manual');
      expect(manualAllowed).not.toBeNull();
    });
  });

  describe('manual-edge overwrite guard', () => {
    it('preserves an existing manual edge when an auto upsert conflicts', () => {
      const manualId = causalEdges.insertEdge('1', '2', 'caused', 0.9, 'curated evidence', true, 'manual');
      expect(manualId).not.toBeNull();

      const result = causalEdges.insertEdge('1', '2', 'caused', 0.3, 'inferred evidence', true, 'auto-session');
      expect(result).toBeNull();

      const edge = getEdge('1', '2', 'caused');
      expect(edge?.created_by).toBe('manual');
      expect(edge?.strength).toBe(0.9);
      expect(edge?.evidence).toBe('curated evidence');
    });

    it('preserves manual edges against legacy auto upserts too', () => {
      causalEdges.insertEdge('1', '2', 'supports', 0.8, null, true, 'manual');
      const result = causalEdges.insertEdge('1', '2', 'supports', 0.2, null, true, 'auto');
      expect(result).toBeNull();
      const edge = getEdge('1', '2', 'supports');
      expect(edge?.created_by).toBe('manual');
      expect(edge?.strength).toBe(0.8);
    });

    it('allows auto-to-auto conflict updates within the cap', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.4, null, true, 'auto');
      const result = causalEdges.insertEdge('1', '2', 'caused', 0.9, null, true, 'auto-session');
      expect(result).not.toBeNull();

      const edge = getEdge('1', '2', 'caused');
      expect(edge?.created_by).toBe('auto-session');
      expect(edge?.strength).toBe(causalEdges.MAX_AUTO_STRENGTH);
    });

    it('still allows manual writers to update manual edges', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.5, null, true, 'manual');
      const result = causalEdges.insertEdge('1', '2', 'caused', 0.8, null, true, 'manual');
      expect(result).not.toBeNull();
      expect(getEdge('1', '2', 'caused')?.strength).toBe(0.8);
    });

    it('still allows manual writers to curate existing auto edges', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.3, null, true, 'auto');
      const result = causalEdges.insertEdge('1', '2', 'caused', 0.9, null, true, 'manual');
      expect(result).not.toBeNull();

      const edge = getEdge('1', '2', 'caused');
      expect(edge?.created_by).toBe('manual');
      expect(edge?.strength).toBe(0.9);
    });
  });

  describe('consolidation strengthening cap', () => {
    function touchRecently(sourceId: string, targetId: string, relation: string): void {
      testDb.prepare(`
        UPDATE causal_edges SET last_accessed = datetime('now')
        WHERE source_id = ? AND target_id = ? AND relation = ?
      `).run(sourceId, targetId, relation);
    }

    it('caps hebbian strengthening for auto-session edges at MAX_AUTO_STRENGTH', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.48, null, true, 'auto-session');
      touchRecently('1', '2', 'caused');

      const result = runHebbianCycle(testDb);

      expect(result.strengthened).toBeGreaterThanOrEqual(1);
      expect(getEdge('1', '2', 'caused')?.strength).toBe(causalEdges.MAX_AUTO_STRENGTH);
    });

    it('does not strengthen an auto-session edge already at the cap', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.5, null, true, 'auto-session');
      touchRecently('1', '2', 'caused');

      runHebbianCycle(testDb);

      expect(getEdge('1', '2', 'caused')?.strength).toBe(causalEdges.MAX_AUTO_STRENGTH);
    });

    it('allows manual edges to strengthen past MAX_AUTO_STRENGTH', () => {
      causalEdges.insertEdge('1', '2', 'caused', 0.48, null, true, 'manual');
      touchRecently('1', '2', 'caused');

      runHebbianCycle(testDb);

      const strength = getEdge('1', '2', 'caused')?.strength ?? 0;
      expect(strength).toBeGreaterThan(causalEdges.MAX_AUTO_STRENGTH);
      expect(strength).toBeCloseTo(0.53, 10);
    });
  });
});
