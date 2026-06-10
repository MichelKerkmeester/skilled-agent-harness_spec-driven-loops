// TEST: CAUSAL TRAVERSAL BFS EQUIVALENCE
import { describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  collectCausalWeightedNeighbors,
  collectDependencyReachability,
} from '../lib/graph/bfs-traversal';
import { RELATION_WEIGHT_MULTIPLIERS, getNeighborBoosts, init as initCausalBoost } from '../lib/search/causal-boost';
import { createMemoStore } from '../lib/storage/memo';

interface CausalSnapshotRow {
  readonly node_id: string;
  readonly min_hop: number;
  readonly max_walk_score: number;
}

interface DependencySnapshotRow {
  readonly child_path: string;
}

function createCausalDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0
    );
    CREATE INDEX idx_causal_edges_source ON causal_edges(source_id);
    CREATE INDEX idx_causal_edges_target ON causal_edges(target_id);
  `);
  return db;
}

function createMemoDb(): Database.Database {
  return new Database(':memory:');
}

function insertFixtureEdges(db: Database.Database): void {
  const relations = ['caused', 'supports', 'supersedes', 'contradicts', 'enabled', 'derived_from'];
  const insert = db.prepare(`
    INSERT INTO causal_edges (source_id, target_id, relation, strength)
    VALUES (?, ?, ?, ?)
  `);
  const insertMany = db.transaction(() => {
    for (let nodeId = 1; nodeId <= 1024; nodeId++) {
      for (let offset = 1; offset <= 10; offset++) {
        const targetId = ((nodeId + offset - 1) % 1024) + 1;
        const relation = relations[(nodeId + offset) % relations.length] ?? 'caused';
        const strength = 0.5 + ((nodeId + offset) % 4) * 0.25;
        insert.run(String(nodeId), String(targetId), relation, strength);
      }
    }
  });
  insertMany();
}

function cteCausalWalk(db: Database.Database, seeds: readonly number[], maxHops: number): Map<number, { minHop: number; maxWalkScore: number }> {
  const originIds = seeds.map((value) => String(value));
  const placeholders = originIds.map(() => '?').join(', ');
  const rows = db.prepare(`
    WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
      SELECT ce.source_id, ce.target_id, 1,
             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
                   WHEN ce.relation = 'contradicts' THEN 0.8
                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_edges ce
      WHERE ce.source_id IN (${placeholders})

      UNION

      SELECT ce.target_id, ce.source_id, 1,
             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
                   WHEN ce.relation = 'contradicts' THEN 0.8
                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_edges ce
      WHERE ce.target_id IN (${placeholders})

      UNION

      SELECT cw.origin_id,
             CASE
               WHEN ce.source_id = cw.node_id THEN ce.target_id
               ELSE ce.source_id
             END,
             cw.hop_distance + 1,
             (cw.walk_score * CASE WHEN ce.relation = 'supersedes' THEN 1.5
                                   WHEN ce.relation = 'contradicts' THEN 0.8
                                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_walk cw
      JOIN causal_edges ce
        ON ce.source_id = cw.node_id OR ce.target_id = cw.node_id
      WHERE cw.hop_distance < ?
        AND (CASE WHEN ce.source_id = cw.node_id THEN ce.target_id ELSE ce.source_id END) != cw.origin_id
    )
    SELECT node_id, MIN(hop_distance) AS min_hop, MAX(walk_score) AS max_walk_score
    FROM causal_walk
    WHERE node_id NOT IN (${placeholders})
    GROUP BY node_id
    ORDER BY CAST(node_id AS INTEGER)
  `).all(
    ...originIds,
    ...originIds,
    maxHops,
    ...originIds,
  ) as CausalSnapshotRow[];

  return new Map(rows.map((row) => [
    Number.parseInt(row.node_id, 10),
    { minHop: row.min_hop, maxWalkScore: row.max_walk_score },
  ]));
}

function cteDependents(db: Database.Database, roots: readonly string[]): string[] {
  const placeholders = roots.map(() => '?').join(', ');
  const rows = db.prepare(`
    WITH RECURSIVE dependents(child_path) AS (
      SELECT child_path
      FROM dependency_edges
      WHERE parent_path IN (${placeholders})
      UNION
      SELECT edge.child_path
      FROM dependency_edges edge
      JOIN dependents dep ON edge.parent_path = dep.child_path
    )
    SELECT DISTINCT child_path
    FROM dependents
    ORDER BY child_path
  `).all(...roots) as DependencySnapshotRow[];
  return rows.map((row) => row.child_path);
}

function causalSnapshot(map: Map<number, { minHop: number; maxWalkScore: number }>): Array<[number, number, number]> {
  return Array.from(map.entries())
    .map(([nodeId, row]) => [nodeId, row.minHop, row.maxWalkScore] as [number, number, number])
    .sort((left, right) => left[0] - right[0]);
}

function measureMs(callback: () => unknown, iterations: number): number {
  const started = performance.now();
  for (let index = 0; index < iterations; index++) {
    callback();
  }
  return Number(((performance.now() - started) / iterations).toFixed(3));
}

describe('causal traversal BFS equivalence', () => {
  it('matches recursive CTE weighted-walk output exactly on live-shaped fixtures', () => {
    const db = createCausalDb();
    try {
      insertFixtureEdges(db);
      const seeds = [1, 8, 33, 144, 377];
      const expected = cteCausalWalk(db, seeds, 2);
      const actual = collectCausalWeightedNeighbors(db, seeds, 2, RELATION_WEIGHT_MULTIPLIERS);

      expect(causalSnapshot(actual)).toEqual(causalSnapshot(expected));
      expect(causalSnapshot(actual).some(([, , score]) => score !== 1)).toBe(true);
      for (const seed of seeds) {
        expect(actual.has(seed)).toBe(false);
      }
    } finally {
      db.close();
    }
  });

  it('keeps getNeighborBoosts behavior equivalent to the weighted-walk snapshot', () => {
    const db = createCausalDb();
    try {
      db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation, strength)
        VALUES ('1', '2', 'supersedes', 1.0), ('2', '3', 'contradicts', 1.0), ('3', '4', 'caused', 0.5)
      `).run();
      initCausalBoost(db);

      const cteRows = cteCausalWalk(db, [1], 2);
      const boosts = getNeighborBoosts([1], 2);

      for (const [nodeId, row] of cteRows) {
        const walkMultiplier = Math.max(0.1, Math.min(2.0, row.maxWalkScore));
        const expectedBoost = Math.min(0.05, 0.05 / row.minHop) * walkMultiplier;
        expect(boosts.get(nodeId)?.boost).toBe(expectedBoost);
        expect(boosts.get(nodeId)?.hopCount).toBe(row.minHop);
      }
    } finally {
      db.close();
    }
  });

  it('matches recursive CTE directed reachability and skips cycle checks for an empty edge table', () => {
    const db = createMemoDb();
    try {
      const store = createMemoStore(db);
      const prepareSpy = vi.spyOn(db, 'prepare');

      store.addDependencyEdge({ parentPath: 'root', childPath: 'child-a', kind: 'derived' });

      const selectAfterConstruction = prepareSpy.mock.calls
        .map(([source]) => String(source))
        .filter((source) => /^\s*SELECT/i.test(source));
      expect(selectAfterConstruction).toHaveLength(0);

      store.addDependencyEdge({ parentPath: 'child-a', childPath: 'child-b', kind: 'derived' });
      store.addDependencyEdge({ parentPath: 'root', childPath: 'child-c', kind: 'derived' });

      const expected = cteDependents(db, ['root']);
      const actual = collectDependencyReachability(db, ['root']).sort();
      expect(actual).toEqual(expected);
      expect(store.collectDependents(['root'])).toEqual(expected);
      expect(() => store.addDependencyEdge({ parentPath: 'child-b', childPath: 'root', kind: 'derived' }))
        .toThrow(/cycle/);
    } finally {
      db.close();
    }
  });

  it('records BFS latency at or below the recursive CTE on the live-shaped fixture', () => {
    const db = createCausalDb();
    try {
      insertFixtureEdges(db);
      const seeds = [1, 8, 33, 144, 377];
      const iterations = 25;

      const cteMs = measureMs(() => cteCausalWalk(db, seeds, 2), iterations);
      const bfsMs = measureMs(
        () => collectCausalWeightedNeighbors(db, seeds, 2, RELATION_WEIGHT_MULTIPLIERS),
        iterations,
      );

      console.info(`BFS traversal benchmark: fixture_edges=10240 max_degree=20 seeds=5 hops=2 cte_ms=${cteMs} bfs_ms=${bfsMs}`);
      expect(bfsMs).toBeLessThanOrEqual(cteMs);
    } finally {
      db.close();
    }
  });
});
