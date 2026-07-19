// TEST: COMMUNITY DETECTION — Phase A label propagation
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  __testables,
  detectCommunities,
  rebuildCommunityArtifactsIfStale,
  resetCommunityDetectionState,
} from '../lib/graph/community-detection.js';
import { generateCommunitySummaries } from '../lib/graph/community-summaries.js';
import { getCommunities, getCommunitySummaries, storeCommunities } from '../lib/graph/community-storage.js';

function createDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      spec_folder TEXT,
      importance_tier TEXT DEFAULT 'normal',
      deleted_at TEXT
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

function insertMemory(
  db: Database.Database,
  id: number,
  title = `Memory ${id}`,
  specFolder = 'specs/graph-test',
  importanceTier = 'normal',
): void {
  db.prepare(`
    INSERT OR REPLACE INTO memory_index (id, title, spec_folder, importance_tier)
    VALUES (?, ?, ?, ?)
  `).run(id, title, specFolder, importanceTier);
}

function insertEdge(
  db: Database.Database,
  sourceId: number,
  targetId: number,
  relation = 'caused',
  strength = 1.0,
): void {
  db.prepare(`
    INSERT INTO causal_edges (source_id, target_id, relation, strength)
    VALUES (?, ?, ?, ?)
  `).run(String(sourceId), String(targetId), relation, strength);
}

describe('community detection (Phase A)', () => {
  let db: Database.Database;
  const previousFlag = process.env.SPECKIT_COMMUNITY_SUMMARIES;

  beforeEach(() => {
    process.env.SPECKIT_COMMUNITY_SUMMARIES = 'true';
    resetCommunityDetectionState();
    db = createDb();

    for (let id = 1; id <= 10; id += 1) {
      insertMemory(db, id, `Memory ${id}`, id <= 5 ? 'specs/a' : 'specs/b');
    }
  });

  afterEach(() => {
    db.close();
    resetCommunityDetectionState();
    delete process.env.SPECKIT_COMMUNITY_REBUILD_INTERVAL_MS;
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_COMMUNITY_SUMMARIES;
    } else {
      process.env.SPECKIT_COMMUNITY_SUMMARIES = previousFlag;
    }
  });

  it('label propagation produces valid communities', () => {
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);
    insertEdge(db, 4, 5);
    insertEdge(db, 5, 6);
    insertEdge(db, 6, 4);
    insertEdge(db, 7, 8);
    insertEdge(db, 8, 9);

    const communities = detectCommunities(db);

    expect(communities).toHaveLength(3);
    expect(communities.map((community) => community.memberIds)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    expect(communities.every((community) => community.size >= 3)).toBe(true);
    expect(communities.every((community) => community.density >= 0 && community.density <= 1)).toBe(true);
  });

  it('enforces a minimum community size of 3 nodes', () => {
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);
    insertEdge(db, 8, 9);

    const communities = detectCommunities(db);

    expect(communities).toHaveLength(1);
    expect(communities[0]?.memberIds).toEqual([1, 2, 3]);
  });

  it('merges single-node communities into the nearest neighbor cluster', () => {
    const adjacency = new Map<number, Map<number, number>>([
      [1, new Map([[2, 1], [3, 1], [4, 0.8]])],
      [2, new Map([[1, 1], [3, 1]])],
      [3, new Map([[1, 1], [2, 1]])],
      [4, new Map([[1, 0.8]])],
    ]);
    const groups = new Map<number, number[]>([
      [10, [1, 2, 3]],
      [20, [4]],
    ]);

    const merged = __testables.mergeSmallCommunities(groups, adjacency);

    expect(Array.from(merged.values())).toContainEqual([1, 2, 3, 4]);
  });

  it('handles an empty graph', () => {
    expect(detectCommunities(db)).toEqual([]);
  });

  it('respects the feature flag and fails open when disabled', () => {
    process.env.SPECKIT_COMMUNITY_SUMMARIES = 'false';
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);

    expect(detectCommunities(db)).toEqual([]);
  });

  it('stores communities and summaries for retrieval', () => {
    insertMemory(db, 1, 'Causal Search', 'specs/search', 'critical');
    insertMemory(db, 2, 'Vector Ranking', 'specs/search', 'important');
    insertMemory(db, 3, 'Embedding Pipeline', 'specs/search', 'important');

    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);

    const communities = detectCommunities(db);
    storeCommunities(db, communities);
    const summaries = generateCommunitySummaries(db, communities);

    expect(getCommunities(db)).toEqual(communities.map((community) => ({
      ...community,
      createdAt: expect.any(String),
    })));
    expect(summaries).toHaveLength(1);
    expect(summaries[0]?.summary).toContain('Causal Search');
    expect(getCommunitySummaries(db)).toEqual([{
      communityId: summaries[0]!.communityId,
      summary: summaries[0]!.summary,
      memberCount: summaries[0]!.memberCount,
      memberIds: summaries[0]!.memberIds,
    }]);
  });

  it('stores derived communities from compatibility assignments', () => {
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);

    const communityAssignments = new Map<string, number>([
      ['1', 9],
      ['2', 9],
      ['3', 9],
    ]);

    const communities = __testables.buildCommunitiesFromAssignments(db, communityAssignments);

    expect(communities).toEqual([
      {
        communityId: 1,
        memberIds: [1, 2, 3],
        size: 3,
        density: 1,
      },
    ]);
  });

  it('keeps stable community ids across unchanged rebuilds', () => {
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);

    const first = detectCommunities(db);
    resetCommunityDetectionState();
    const second = detectCommunities(db);

    expect(second).toEqual(first);
    expect(first[0]?.communityId).toBe(1);
  });

  it('refreshes community artifacts on live cadence and keeps community ids stable', () => {
    process.env.SPECKIT_COMMUNITY_REBUILD_INTERVAL_MS = '0';
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);

    const first = rebuildCommunityArtifactsIfStale(db);
    expect(first).toMatchObject({ rebuilt: true, communities: 1, assignments: 3, summaries: 1 });
    const initialAssignments = db.prepare(`
      SELECT memory_id, community_id
      FROM community_assignments
      ORDER BY memory_id
    `).all() as Array<{ memory_id: number; community_id: number }>;

    db.prepare(`UPDATE community_assignments SET community_id = 99`).run();

    const second = rebuildCommunityArtifactsIfStale(db);
    const refreshedAssignments = db.prepare(`
      SELECT memory_id, community_id
      FROM community_assignments
      ORDER BY memory_id
    `).all() as Array<{ memory_id: number; community_id: number }>;

    expect(second.rebuilt).toBe(true);
    expect(refreshedAssignments).toEqual(initialAssignments);
    expect(refreshedAssignments.map((row) => row.community_id)).toEqual([1, 1, 1]);
  });

  it('does not reuse cached communities across DB instances', () => {
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);
    const first = detectCommunities(db);

    const otherDb = createDb();
    try {
      process.env.SPECKIT_COMMUNITY_SUMMARIES = 'true';
      for (let id = 10; id <= 12; id += 1) {
        insertMemory(otherDb, id, `Memory ${id}`, 'specs/other');
      }
      insertEdge(otherDb, 10, 11);
      insertEdge(otherDb, 11, 12);
      insertEdge(otherDb, 12, 10);

      const second = detectCommunities(otherDb);
      expect(first[0]?.memberIds).toEqual([1, 2, 3]);
      expect(second[0]?.memberIds).toEqual([10, 11, 12]);
    } finally {
      otherDb.close();
    }
  });

  it('filters deleted memories from detected and injected community members', () => {
    insertEdge(db, 1, 2);
    insertEdge(db, 2, 3);
    insertEdge(db, 3, 1);
    db.prepare(`UPDATE memory_index SET deleted_at = datetime('now') WHERE id = 3`).run();

    const communities = detectCommunities(db);

    expect(communities).toEqual([]);
  });
});
