// ───────────────────────────────────────────────────────────────
// ADDITIVE TAIL-LANE RECALL TESTS
// ───────────────────────────────────────────────────────────────
// Proves the append-not-displace contract for the two opt-in tail recall
// features: flag-off is byte-identical, the baseline window is never reordered
// or evicted, and appended candidates only extend the tail. The multihop suite
// drives an in-memory better-sqlite3 fixture so slug resolution and the 1:1
// uniqueness gate are exercised against a real query path.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { applyDeterministicMultihop } from '../lib/search/deterministic-multihop';
import { applyLaneChampionBackfill } from '../lib/search/lane-champion-backfill';

interface Row {
  id: number | string;
  score: number;
  source?: string;
  sources?: string[];
  [key: string]: unknown;
}

const baseline: Row[] = [
  { id: 1, score: 0.9, source: 'vector', sources: ['vector'] },
  { id: 2, score: 0.7, source: 'fts', sources: ['fts'] },
  { id: 3, score: 0.5, source: 'bm25', sources: ['bm25'] },
];

describe('lane champion backfill', () => {
  it('flag off is byte-identical (same reference, applied=false)', () => {
    const lanes = [{ lane: 'vector', results: [{ id: 99 }] }];
    const out = applyLaneChampionBackfill(baseline, lanes, false);
    expect(out.results).toBe(baseline);
    expect(out.backfill.applied).toBe(false);
    expect(out.backfill.appendedCount).toBe(0);
  });

  it('appends one champion per lane and never evicts a baseline hit', () => {
    const lanes = [
      // id 1 is already fused → champion is the next un-fused lane candidate.
      { lane: 'vector', results: [{ id: 1 }, { id: 10 }] },
      { lane: 'fts', results: [{ id: 2 }, { id: 11 }] },
      { lane: 'trigger', results: [{ id: 12 }] },
    ];
    const out = applyLaneChampionBackfill(baseline, lanes, true);
    // Baseline window preserved exactly, in order, at the head.
    expect(out.results.slice(0, 3)).toEqual(baseline);
    // Champions appended to the tail: 10 (vector), 11 (fts), 12 (trigger).
    const appendedIds = out.results.slice(3).map((r) => r.id);
    expect(appendedIds).toEqual([10, 11, 12]);
    expect(out.backfill.appendedCount).toBe(3);
    expect(out.backfill.perLane).toEqual({ vector: 1, fts: 1, trigger: 1 });
  });

  it('appended champions score strictly below the weakest baseline hit', () => {
    const lanes = [{ lane: 'vector', results: [{ id: 50 }] }];
    const out = applyLaneChampionBackfill(baseline, lanes, true);
    const weakestBaseline = Math.min(...baseline.map((r) => r.score));
    const champion = out.results.find((r) => r.id === 50);
    expect(champion).toBeDefined();
    expect((champion as Row).score).toBeLessThan(weakestBaseline);
  });

  it('does not duplicate a champion already claimed by an earlier lane', () => {
    const lanes = [
      { lane: 'vector', results: [{ id: 20 }] },
      { lane: 'fts', results: [{ id: 20 }, { id: 21 }] },
    ];
    const out = applyLaneChampionBackfill(baseline, lanes, true);
    const appendedIds = out.results.slice(3).map((r) => r.id);
    expect(appendedIds).toEqual([20, 21]);
  });

  it('no empty tail slots to fill still reports applied with zero appends', () => {
    // Every lane candidate is already in the fused window.
    const lanes = [{ lane: 'vector', results: [{ id: 1 }] }];
    const out = applyLaneChampionBackfill(baseline, lanes, true);
    expect(out.results).toBe(baseline);
    expect(out.backfill.applied).toBe(true);
    expect(out.backfill.appendedCount).toBe(0);
  });
});

describe('deterministic multihop', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        content_text TEXT
      );
    `);
    const insert = db.prepare(
      'INSERT INTO memory_index (id, spec_folder, file_path, content_text) VALUES (?, ?, ?, ?)',
    );
    // Hop-1 hub doc: references a unique slug (014-target) and an ambiguous one
    // (099-dup, reused under two tracks) and a self-reference (already fused).
    insert.run(1, 'track-a/001-hub', '/specs/track-a/001-hub/spec.md',
      'See 014-target for the prior decision. Also touches 099-dup and 001-hub.');
    // Unique resolvable target.
    insert.run(14, 'track-a/014-target', '/specs/track-a/014-target/spec.md', 'target spec body');
    // Ambiguous slug 099-dup under two distinct folders → must NOT resolve.
    insert.run(98, 'track-a/099-dup', '/specs/track-a/099-dup/spec.md', 'dup a');
    insert.run(99, 'track-b/099-dup', '/specs/track-b/099-dup/spec.md', 'dup b');
    // A doc whose folder is also 001-hub's own folder (self) — already fused.
    insert.run(2, 'track-a/001-hub', '/specs/track-a/001-hub/plan.md', 'hub plan');
  });

  afterEach(() => {
    db.close();
  });

  const hubBaseline: Row[] = [
    { id: 1, score: 0.9, source: 'vector', sources: ['vector'] },
    { id: 2, score: 0.6, source: 'fts', sources: ['fts'] },
  ];

  it('flag off is byte-identical (same reference, applied=false)', () => {
    const out = applyDeterministicMultihop(hubBaseline, false, db);
    expect(out.results).toBe(hubBaseline);
    expect(out.multihop.applied).toBe(false);
  });

  it('null db is a safe no-op even when enabled', () => {
    const out = applyDeterministicMultihop(hubBaseline, true, null);
    expect(out.results).toBe(hubBaseline);
    expect(out.multihop.applied).toBe(false);
  });

  it('appends only the uniquely-resolved hop-2 spec.md, skipping ambiguous slugs', () => {
    const out = applyDeterministicMultihop(hubBaseline, true, db);
    // Baseline window preserved exactly at the head.
    expect(out.results.slice(0, 2)).toEqual(hubBaseline);
    // Only id 14 (014-target) appended: 099-dup is ambiguous (skipped at
    // resolution), 001-hub resolves uniquely but dedups out (already fused).
    const appendedIds = out.results.slice(2).map((r) => r.id);
    expect(appendedIds).toEqual([14]);
    expect(out.multihop.appendedCount).toBe(1);
    // Both 014-target and 001-hub resolve 1:1; 099-dup does not. 001-hub is
    // then deduped at append because its spec.md is already in the window.
    expect(out.multihop.slugsResolved).toBe(2);
    // The appended doc carries the multihop source attribution.
    const appended = out.results.find((r) => r.id === 14) as Row;
    expect(appended.source).toBe('multihop');
    expect(appended.sources).toEqual(['multihop']);
  });

  it('appended hop-2 doc scores strictly below the weakest baseline hit', () => {
    const out = applyDeterministicMultihop(hubBaseline, true, db);
    const weakestBaseline = Math.min(...hubBaseline.map((r) => r.score));
    const appended = out.results.find((r) => r.id === 14) as Row;
    expect(appended.score).toBeLessThan(weakestBaseline);
  });

  it('dedups a hop-2 target already present in the protected window', () => {
    // Fuse id 14 already → multihop must not re-append it.
    const withTarget: Row[] = [...hubBaseline, { id: 14, score: 0.4, source: 'graph' }];
    const out = applyDeterministicMultihop(withTarget, true, db);
    expect(out.results).toHaveLength(withTarget.length);
    expect(out.multihop.appendedCount).toBe(0);
  });
});
