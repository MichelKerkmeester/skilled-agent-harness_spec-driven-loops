// TEST: Phase B — Community Search Fallback
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const {
  mockIsCommunitySearchFallbackEnabled,
  mockIsCommunitySummariesEnabled,
} = vi.hoisted(() => ({
  mockIsCommunitySearchFallbackEnabled: vi.fn(() => true),
  mockIsCommunitySummariesEnabled: vi.fn(() => true),
}));

vi.mock('../lib/search/search-flags', () => ({
  isCommunitySearchFallbackEnabled: mockIsCommunitySearchFallbackEnabled,
  isCommunitySummariesEnabled: mockIsCommunitySummariesEnabled,
}));

import { searchCommunities } from '../lib/search/community-search';
import { filterRowsByScope } from '../lib/governance/scope-governance';

let db: InstanceType<typeof Database>;

interface SeedCommunityRow {
  id: number;
  summary: string;
  memberIds: number[];
  count: number;
}

function createCommunitySummariesTable(): void {
  db.exec(`
    CREATE TABLE community_summaries (
      community_id INTEGER PRIMARY KEY,
      summary TEXT NOT NULL,
      member_ids TEXT NOT NULL,
      member_count INTEGER NOT NULL
    )
  `);
}

function seedCommunities(rows: SeedCommunityRow[]): void {
  createCommunitySummariesTable();

  const insertStatement = db.prepare(`
    INSERT INTO community_summaries (community_id, summary, member_ids, member_count)
    VALUES (?, ?, ?, ?)
  `);

  for (const row of rows) {
    insertStatement.run(row.id, row.summary, JSON.stringify(row.memberIds), row.count);
  }
}

describe('searchCommunities()', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    mockIsCommunitySearchFallbackEnabled.mockReturnValue(true);
    mockIsCommunitySummariesEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    db.close();
    vi.restoreAllMocks();
  });

  it('returns empty when feature flag disabled', () => {
    mockIsCommunitySearchFallbackEnabled.mockReturnValue(false);
    seedCommunities([
      { id: 1, summary: 'search retrieval pipeline', memberIds: [1, 2], count: 2 },
    ]);

    expect(searchCommunities('search', db)).toEqual({
      results: [],
      totalMemberIds: [],
      source: 'community_fallback',
    });
  });

  it('returns empty when no community_summaries table exists', () => {
    expect(searchCommunities('search', db)).toEqual({
      results: [],
      totalMemberIds: [],
      source: 'community_fallback',
    });
  });

  it('scores and ranks communities by keyword match', () => {
    seedCommunities([
      { id: 1, summary: 'vector embeddings and search', memberIds: [1, 2], count: 2 },
      { id: 2, summary: 'graph retrieval search quality', memberIds: [3, 4, 5], count: 3 },
      { id: 3, summary: 'branch workflow automation', memberIds: [6], count: 1 },
    ]);

    const result = searchCommunities('search quality', db);

    expect(result.results.map((community) => community.communityId)).toEqual([2, 1]);
    expect(result.results[0]).toMatchObject({
      communityId: 2,
      memberCount: 3,
      matchScore: 1,
    });
    expect(result.results[1]).toMatchObject({
      communityId: 1,
      matchScore: 0.5,
    });
  });

  it('respects limit parameter', () => {
    seedCommunities([
      { id: 1, summary: 'search one', memberIds: [1], count: 1 },
      { id: 2, summary: 'search two', memberIds: [2], count: 1 },
      { id: 3, summary: 'search three', memberIds: [3], count: 1 },
    ]);

    const result = searchCommunities('search', db, 2);

    expect(result.results).toHaveLength(2);
    expect(result.totalMemberIds).toHaveLength(2);
  });

  it('deduplicates member IDs across communities', () => {
    seedCommunities([
      { id: 1, summary: 'search pipeline alpha', memberIds: [1, 2, 3], count: 3 },
      { id: 2, summary: 'search pipeline beta', memberIds: [2, 3, 4], count: 3 },
    ]);

    const result = searchCommunities('search pipeline', db);

    expect(result.totalMemberIds).toEqual([1, 2, 3, 4]);
  });
});

// B1: the community-search fallback must apply the governed retrieval scope to
// the member rows it fetches, so it cannot bypass the tenant/user/agent
// boundary the canonical pipeline enforces. These cases replicate the handler's
// member-row SELECT (now including scope columns) + filterRowsByScope step.
describe('community fallback governed scope (B1)', () => {
  beforeEach(() => {
    db = new Database(':memory:');
  });

  afterEach(() => {
    db.close();
  });

  function createMemoryIndex(): void {
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        similarity REAL,
        content TEXT,
        file_path TEXT,
        anchor_id TEXT,
        document_type TEXT,
        importance_tier TEXT,
        context_type TEXT,
        quality_score REAL,
        created_at TEXT,
        tenant_id TEXT,
        user_id TEXT,
        agent_id TEXT,
        session_id TEXT
      )
    `);
  }

  function seedMember(
    id: number,
    scope: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null },
  ): void {
    db.prepare(`
      INSERT INTO memory_index (id, title, similarity, content, file_path, anchor_id,
        document_type, importance_tier, context_type, quality_score, created_at,
        tenant_id, user_id, agent_id, session_id)
      VALUES (?, 'm' || ?, 0.5, 'c', '/m/' || ? || '.md', 'a', 'spec_doc', 'normal',
        'general', 0.5, datetime('now'), ?, ?, ?, ?)
    `).run(
      id, id, id,
      scope.tenantId ?? null,
      scope.userId ?? null,
      scope.agentId ?? null,
      scope.sessionId ?? null,
    );
  }

  function fetchMembers(memberIds: number[]): Array<Record<string, unknown> & { id: number }> {
    const placeholders = memberIds.map(() => '?').join(', ');
    return db.prepare(`
      SELECT id, title, similarity, content, file_path, anchor_id, document_type,
             importance_tier, context_type, quality_score, created_at,
             tenant_id, user_id, agent_id
      FROM memory_index
      WHERE id IN (${placeholders})
    `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
  }

  it('drops cross-tenant rows when a tenant scope is supplied', () => {
    createMemoryIndex();
    seedMember(1, { tenantId: 'A' });
    seedMember(2, { tenantId: 'B' });

    const rows = fetchMembers([1, 2]);
    const scoped = filterRowsByScope(rows, { tenantId: 'A' });

    expect(scoped.map((r) => r.id)).toEqual([1]);
  });

  it('returns all member rows when no governance scope is supplied', () => {
    createMemoryIndex();
    seedMember(1, { tenantId: 'A' });
    seedMember(2, { tenantId: 'B' });

    const rows = fetchMembers([1, 2]);
    // No scope -> handler skips filterRowsByScope entirely; rows are unchanged.
    expect(rows.map((r) => r.id)).toEqual([1, 2]);
  });

  it('does not treat sessionId as a row-access boundary', () => {
    createMemoryIndex();
    seedMember(1, { tenantId: 'A', sessionId: 's1' });
    seedMember(2, { tenantId: 'A', sessionId: 's2' });

    const rows = fetchMembers([1, 2]);
    // Scope carries tenant only (mirrors the handler, which excludes sessionId);
    // both same-tenant rows survive regardless of session.
    const scoped = filterRowsByScope(rows, { tenantId: 'A' });
    expect(scoped.map((r) => r.id)).toEqual([1, 2]);
  });
});
