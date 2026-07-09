// TEST: CAUSAL BOOST
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as causalBoost from '../lib/search/causal-boost';
import type { RankedSearchResult } from '../lib/search/causal-boost';

function createDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT
    );

    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    );

    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      importance_tier TEXT,
      deleted_at TEXT,
      trigger_phrases TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  causalBoost.init(db);
  return db;
}

describe('T038-T044 causal boost', () => {
  let db: Database.Database | null = null;
  const previousFlag = process.env.SPECKIT_CAUSAL_BOOST;

  beforeEach(() => {
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    db = createDb();
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
      VALUES
      (1, 'spec', '/tmp/a.md', 'A', 'important', '[]'),
      (2, 'spec', '/tmp/b.md', 'B', 'important', '[]'),
      (3, 'spec', '/tmp/c.md', 'C', 'important', '[]'),
      (4, 'spec', '/tmp/d.md', 'D', 'important', '[]')
    `).run();
  });

  afterEach(() => {
    if (db) db.close();
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_CAUSAL_BOOST;
    } else {
      process.env.SPECKIT_CAUSAL_BOOST = previousFlag;
    }
    delete process.env.SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES;
  });

  it('T039/T043: computes 1-hop and 2-hop neighbors from causal_edges', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'caused'), ('2', '3', 'supports')
    `).run();

    const boosts = causalBoost.getNeighborBoosts([1]);
    expect(boosts.get(2)?.boost).toBeCloseTo(0.05, 6);
    expect(boosts.get(2)?.hopCount).toBe(1);
    expect(boosts.get(3)?.boost).toBeCloseTo(0.025, 6);
    expect(boosts.get(3)?.hopCount).toBe(2);
  });

  it('T040/T044: applies bounded boost and deduplicates existing semantic results', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'caused'), ('1', '3', 'supports')
    `).run();

    const baseResults = [
      { id: 1, score: 0.9 },
      { id: 2, score: 0.6, sessionBoost: 0.1 },
    ];

    const { results, metadata } = causalBoost.applyCausalBoost(baseResults as unknown as RankedSearchResult[]);
    const idList = results.map((item) => item.id);

    expect(metadata.applied).toBe(true);
    expect(metadata.boostedCount).toBeGreaterThanOrEqual(1);
    expect(idList.filter((id) => id === 2)).toHaveLength(1);
    expect(idList.includes(3)).toBe(true);
  });

  it('assigns a non-zero causal boost to injected neighbors under default traversal', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '3', 'caused', 1.0)
    `).run();

    const { results, metadata } = causalBoost.applyCausalBoost([
      { id: 1, score: 0.8 },
    ] as RankedSearchResult[]);
    const injected = results.find((item) => item.id === 3);

    expect(metadata.applied).toBe(true);
    expect(metadata.injectedCount).toBe(1);
    expect(injected?.injectedByCausalBoost).toBe(true);
    expect(injected?.causalBoost).toBeGreaterThan(0);
  });

  it('T043: handles no edges and cyclic edges without duplication', () => {
    const empty = causalBoost.getNeighborBoosts([4]);
    expect(empty.size).toBe(0);

    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'caused'), ('2', '1', 'supports')
    `).run();

    const cycle = causalBoost.getNeighborBoosts([1]);
    expect(cycle.get(2)?.boost).toBeCloseTo(0.05, 6);
  });

  it('excludes entity-linker co-occurrence edges by default with explicit opt-in', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength, created_by)
      VALUES ('1', '2', 'supports', 0.05, 'entity_linker'),
             ('1', '3', 'caused', 1.0, 'manual')
    `).run();

    const defaultBoosts = causalBoost.getNeighborBoosts([1]);
    expect(defaultBoosts.has(2)).toBe(false);
    expect(defaultBoosts.has(3)).toBe(true);

    process.env.SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES = 'true';
    const optedInBoosts = causalBoost.getNeighborBoosts([1]);
    expect(optedInBoosts.has(2)).toBe(true);
  });

  // includeEntityLinkerCausalEdges() delegates to the shared parseFlagTristate(name, false)
  // helper instead of a raw === 'true' || raw === '1' check, so the full opt-in
  // vocabulary now opts in, not just 'true'/'1'.
  it('opts in to entity-linker causal edges for every recognized opt-in value post-migration', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength, created_by)
      VALUES ('1', '2', 'supports', 0.05, 'entity_linker')
    `).run();

    for (const value of ['true', '1', 'yes', 'on', 'enabled']) {
      process.env.SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES = value;
      expect(causalBoost.getNeighborBoosts([1]).has(2), `value=${value}`).toBe(true);
    }

    for (const value of ['false', '0', 'no', 'off', 'disabled']) {
      process.env.SPECKIT_INCLUDE_ENTITY_LINKER_CAUSAL_EDGES = value;
      expect(causalBoost.getNeighborBoosts([1]).has(2), `value=${value}`).toBe(false);
    }
  });
});

describe('T008 — Seed cap and multiplier precedence', () => {
  it('RELATION_WEIGHT_MULTIPLIERS covers all relation types from causal-edges', () => {
    const boostRelations = Object.keys(causalBoost.RELATION_WEIGHT_MULTIPLIERS);
    const expectedRelations = ['supersedes', 'contradicts', 'caused', 'enabled', 'derived_from', 'supports'];
    expect(boostRelations).toEqual(expect.arrayContaining(expectedRelations));
  });

  it('seed cap limits number of seed nodes used for graph walk', () => {
    const localDb = createDb();
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    // Disable typed traversal to test classic boost values (SPECKIT_TYPED_TRAVERSAL now defaults ON)
    const prevTyped = process.env.SPECKIT_TYPED_TRAVERSAL;
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    localDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
      VALUES
      (1, 'spec', '/tmp/1.md', '1', 'important', '[]'),
      (2, 'spec', '/tmp/2.md', '2', 'important', '[]'),
      (3, 'spec', '/tmp/3.md', '3', 'important', '[]'),
      (4, 'spec', '/tmp/4.md', '4', 'important', '[]'),
      (5, 'spec', '/tmp/5.md', '5', 'important', '[]'),
      (6, 'spec', '/tmp/6.md', '6', 'important', '[]'),
      (7, 'spec', '/tmp/7.md', '7', 'important', '[]'),
      (30, 'spec', '/tmp/30.md', '30', 'important', '[]'),
      (31, 'spec', '/tmp/31.md', '31', 'important', '[]')
    `).run();
    localDb.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES
      ('5', '31', 'caused', 1.0),
      ('6', '30', 'caused', 1.0)
    `).run();
    causalBoost.init(localDb);

    const baseResults = Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      score: 1 - index * 0.01,
    }));

    const { results } = causalBoost.applyCausalBoost(baseResults as RankedSearchResult[]);
    const injectedIds = results.filter((item) => item.injectedByCausalBoost).map((item) => item.id);

    expect(injectedIds).toContain(31);
    expect(injectedIds).not.toContain(30);

    const injectedResult = results.find((item) => item.id === 31);
    expect(injectedResult?.causalBoost).toBeCloseTo(0.05, 6);

    // Restore SPECKIT_TYPED_TRAVERSAL
    if (prevTyped === undefined) delete process.env.SPECKIT_TYPED_TRAVERSAL;
    else process.env.SPECKIT_TYPED_TRAVERSAL = prevTyped;
  });

  it('relation multipliers change boost precedence behavior', () => {
    const localDb = createDb();
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    localDb.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '2', 'supersedes', 1.0), ('1', '3', 'contradicts', 1.0)
    `).run();
    causalBoost.init(localDb);

    const boosts = causalBoost.getNeighborBoosts([1]);

    expect(boosts.get(2)?.boost).toBeCloseTo(0.05 * 1.5, 6);
    expect(boosts.get(3)?.boost).toBeCloseTo(0.05 * 0.8, 6);
    expect((boosts.get(2)?.boost ?? 0)).toBeGreaterThan(boosts.get(3)?.boost ?? 0);
  });
});

// Typed-traversal boost must let edge-prior tiers differentiate. The intent
// traversal score is on a semantic-score scale (~seedScore); consumed raw as a
// boost it exceeds the combined-boost ceiling for every neighbor, so the ceiling
// clamp flattens all relations to the same maximum and the prior tiers go inert.
describe('typed-traversal relation-prior differentiation', () => {
  let db: Database.Database | null = null;
  const prevTyped = process.env.SPECKIT_TYPED_TRAVERSAL;
  const prevCausal = process.env.SPECKIT_CAUSAL_BOOST;

  beforeEach(() => {
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
    db = createDb();
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
      VALUES
      (1, 'spec', '/tmp/seed.md', 'seed', 'important', '[]'),
      (10, 'spec', '/tmp/high.md', 'high-prior neighbor', 'important', '[]'),
      (11, 'spec', '/tmp/low.md', 'low-prior neighbor', 'important', '[]')
    `).run();
    // For intent 'understand', 'caused' is the top edge-prior tier (1.0) and
    // 'derived_from' a lower tier (0.5). Both neighbors are 1-hop from the seed
    // with identical base scores, so any boost gap is purely the prior tier.
    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '10', 'caused', 1.0), ('1', '11', 'derived_from', 1.0)
    `).run();
  });

  afterEach(() => {
    if (db) db.close();
    if (prevTyped === undefined) delete process.env.SPECKIT_TYPED_TRAVERSAL;
    else process.env.SPECKIT_TYPED_TRAVERSAL = prevTyped;
    if (prevCausal === undefined) delete process.env.SPECKIT_CAUSAL_BOOST;
    else process.env.SPECKIT_CAUSAL_BOOST = prevCausal;
  });

  it('gives the higher-prior relation a strictly larger sub-ceiling boost', () => {
    const results = [
      { id: 1, score: 0.9 },
      { id: 10, score: 0.5 },
      { id: 11, score: 0.5 },
    ];
    const { results: boosted } = causalBoost.applyCausalBoost(
      results as RankedSearchResult[],
      { intent: 'understand' },
    );
    const high = boosted.find((r) => r.id === 10)?.causalBoost ?? 0;
    const low = boosted.find((r) => r.id === 11)?.causalBoost ?? 0;

    expect(high).toBeGreaterThan(0);
    expect(low).toBeGreaterThan(0);
    // Priors differentiate rather than both pinning to the combined ceiling.
    expect(high).toBeGreaterThan(low + 1e-6);
    // Boost scales with the prior tier ratio (1.0 / 0.5 = 2). Pre-fix both
    // saturate to 0.20, so the ratio collapses to 1.
    expect(high / low).toBeCloseTo(2.0, 3);
    // The strongest prior stays within the documented combined ceiling.
    expect(high).toBeLessThanOrEqual(0.2 + 1e-9);
  });

  it('does not flatten distinct priors to an identical saturated boost', () => {
    const results = [
      { id: 1, score: 0.9 },
      { id: 10, score: 0.5 },
      { id: 11, score: 0.5 },
    ];
    const { results: boosted } = causalBoost.applyCausalBoost(
      results as RankedSearchResult[],
      { intent: 'understand' },
    );
    const high = boosted.find((r) => r.id === 10)?.causalBoost ?? 0;
    const low = boosted.find((r) => r.id === 11)?.causalBoost ?? 0;

    // avgSeedScore 0.9 x prior x combined-ceiling 0.20: caused=0.18, derived_from=0.09.
    expect(high).toBeCloseTo(0.18, 6);
    expect(low).toBeCloseTo(0.09, 6);
  });
});
