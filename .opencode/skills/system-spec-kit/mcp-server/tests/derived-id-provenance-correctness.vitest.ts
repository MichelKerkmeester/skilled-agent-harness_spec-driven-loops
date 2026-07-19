// ───────────────────────────────────────────────────────────────
// MODULE: Derived Id Provenance Correctness (ON-path contract)
// ───────────────────────────────────────────────────────────────
//
// Guards the correctness contract that run-derived-id-eval.mjs reports as a
// pass/fail verdict (this is a correctness feature, not a recall metric):
//   1. STABILITY  — same canonical content → same id, across re-derivation.
//   2. REPLAY     — delete + re-insert an identical generated edge (flag ON)
//                   reproduces the same derived_id through the live insert path.
//   3. DEDUP      — distinct canonical fields → distinct ids; byte-identical
//                   generated content → one id (no split, no collision).
//
// These are ON-path assertions: SPECKIT_DERIVED_ID_PROVENANCE is ENABLED and we
// assert the new derived_id contract, not flag-off byte-identity. The existing
// derived-id-provenance suite covers schema migration / backfill / rollback
// mechanics; this suite is disjoint and owns the content-addressed identity
// correctness contract the eval driver flips on.

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { deriveCausalEdgeDerivedId } from '../lib/content-id.js';
import { ensureDerivedIdProvenanceSchema } from '../lib/search/vector-index-schema.js';
import * as causalEdges from '../lib/storage/causal-edges.js';

type SqliteDatabase = InstanceType<typeof Database>;

const FLAG_NAME = 'SPECKIT_DERIVED_ID_PROVENANCE';
const HASH_SHAPE = /^[a-f0-9]{64}$/;

function createDbWithDerivedId(): SqliteDatabase {
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
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)
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
  ensureDerivedIdProvenanceSchema(db, 'correctness test setup');
  return db;
}

function derivedIdOf(db: SqliteDatabase, edgeId: number | null): string | null {
  if (edgeId === null) return null;
  const row = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(edgeId) as { derived_id: string | null } | undefined;
  return row?.derived_id ?? null;
}

describe('derived id provenance correctness (ON-path)', () => {
  let originalFlag: string | undefined;

  beforeEach(() => {
    originalFlag = process.env[FLAG_NAME];
    process.env[FLAG_NAME] = 'true';
  });

  afterEach(() => {
    if (originalFlag === undefined) delete process.env[FLAG_NAME];
    else process.env[FLAG_NAME] = originalFlag;
  });

  it('STABILITY: re-deriving the same canonical content yields the same 64-hex id', () => {
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
    expect(first).toMatch(HASH_SHAPE);
    expect(second).toBe(first);
  });

  it('REPLAY: delete + re-insert an identical generated edge reproduces the derived id', () => {
    const db = createDbWithDerivedId();
    try {
      causalEdges.init(db);

      const firstId = causalEdges.insertEdge(
        '100', '200', 'derived_from', 0.4, 'generated', true, 'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter' },
      );
      const firstDerived = derivedIdOf(db, firstId);
      expect(firstDerived).toMatch(HASH_SHAPE);

      db.prepare('DELETE FROM causal_edges WHERE id = ?').run(firstId);

      const secondId = causalEdges.insertEdge(
        '100', '200', 'derived_from', 0.4, 'generated', true, 'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter' },
      );
      const secondDerived = derivedIdOf(db, secondId);

      // Same content, fresh row → same content-addressed identity.
      expect(secondDerived).toBe(firstDerived);
    } finally {
      db.close();
    }
  });

  it('DEDUP discrimination: distinct canonical fields produce distinct ids', () => {
    const base = {
      sourceId: '10', targetId: '20', relation: 'supports',
      sourceAnchor: 's:a', targetAnchor: 't:a',
      source: 'frontmatter', ruleVersion: 'frontmatter:v1',
    };
    const baseId = deriveCausalEdgeDerivedId(base);
    const anchorChanged = deriveCausalEdgeDerivedId({ ...base, sourceAnchor: 's:b' });
    const ruleChanged = deriveCausalEdgeDerivedId({ ...base, ruleVersion: 'frontmatter:v2' });
    const endpointChanged = deriveCausalEdgeDerivedId({ ...base, targetId: '21' });

    expect(anchorChanged).not.toBe(baseId);
    expect(ruleChanged).not.toBe(baseId);
    expect(endpointChanged).not.toBe(baseId);
  });

  it('DEDUP collapse: byte-identical generated writes converge to one derived id', () => {
    const db = createDbWithDerivedId();
    try {
      causalEdges.init(db);

      const first = causalEdges.insertEdge(
        '300', '400', 'supports', 0.4, 'generated', true, 'auto',
        { sourceAnchor: 's:x', targetAnchor: 't:x' },
        { extractionMethod: 'frontmatter' },
      );
      // Identical canonical content upserts the same row (the UNIQUE constraint),
      // keeping a single derived identity — no duplicate id is minted.
      const second = causalEdges.insertEdge(
        '300', '400', 'supports', 0.4, 'generated again', true, 'auto',
        { sourceAnchor: 's:x', targetAnchor: 't:x' },
        { extractionMethod: 'frontmatter' },
      );

      expect(second).toBe(first);
      const ids = db.prepare(`
        SELECT derived_id FROM causal_edges WHERE derived_id IS NOT NULL
      `).all() as Array<{ derived_id: string }>;
      const distinct = new Set(ids.map((row) => row.derived_id));
      expect(distinct.size).toBe(1);
    } finally {
      db.close();
    }
  });

  it('manual writes stay null while generated writes are content-addressed (flag ON)', () => {
    const db = createDbWithDerivedId();
    try {
      causalEdges.init(db);

      const generatedId = causalEdges.insertEdge(
        '10', '20', 'supports', 0.4, 'generated', true, 'auto',
        { sourceAnchor: 's:a', targetAnchor: 't:a' },
        { extractionMethod: 'frontmatter', ruleVersion: 'frontmatter:v1' },
      );
      const manualId = causalEdges.insertEdge(
        '30', '40', 'supports', 0.7, 'curated', true, 'manual',
        { sourceAnchor: 's:m', targetAnchor: 't:m' },
      );

      expect(derivedIdOf(db, generatedId)).toBe(deriveCausalEdgeDerivedId({
        sourceId: '10', targetId: '20', relation: 'supports',
        sourceAnchor: 's:a', targetAnchor: 't:a',
        source: 'frontmatter', ruleVersion: 'frontmatter:v1',
      }));
      expect(derivedIdOf(db, manualId)).toBeNull();
    } finally {
      db.close();
    }
  });
});
