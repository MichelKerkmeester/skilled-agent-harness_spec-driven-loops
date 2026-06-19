// ───────────────────────────────────────────────────────────────
// MODULE: Community Search
// ───────────────────────────────────────────────────────────────
// Community-level search as fallback channel.
//
// When primary search returns weak or zero results, this module
// searches community summaries by keyword matching and returns
// matching community member IDs for injection into the pipeline.
//
// FEATURE FLAG: SPECKIT_COMMUNITY_SEARCH_FALLBACK (default ON, graduated)

import type Database from 'better-sqlite3';

import { isCommunitySearchFallbackEnabled, isCommunitySummariesEnabled } from './search-flags.js';
import { specFolderLikePattern } from './vector-index-types.js';

// -- Types --

export interface CommunitySearchResult {
  communityId: number;
  summary: string;
  memberIds: number[];
  memberCount: number;
  matchScore: number;
}

export interface CommunitySearchOutput {
  results: CommunitySearchResult[];
  totalMemberIds: number[];
  source: 'community_fallback';
}

export interface CommunitySearchOptions {
  respectFallbackFlag?: boolean;
}

export interface CommunityLaneScope {
  specFolder?: string | null;
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
}

export interface CommunityRankedResult extends Record<string, unknown> {
  id: number;
  source: 'community';
  score: number;
  similarity: number;
  communityIds: number[];
  communityScore: number;
  summaryLaneSources: string[];
}

// -- Internal helpers --

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(tableName) as { name?: string } | undefined;
  return row?.name === tableName;
}

function parseMemberIds(memberIdsJson: string): number[] {
  try {
    const parsed = JSON.parse(memberIdsJson) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-search] parseMemberIds failed (fail-open): ${message}`);
    return [];
  }
}

function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  try {
    const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
    return rows.some((row) => row.name === columnName);
  } catch {
    return false;
  }
}

/**
 * Score a community summary against query terms.
 * Returns 0-1 based on fraction of query terms found in the summary.
 */
function scoreSummary(summary: string, queryTerms: string[]): number {
  if (queryTerms.length === 0) return 0;
  const lowerSummary = summary.toLowerCase();
  let matches = 0;
  for (const term of queryTerms) {
    if (lowerSummary.includes(term)) matches++;
  }
  return matches / queryTerms.length;
}

/**
 * Extract meaningful search terms from a query string.
 * Filters out common stop words.
 */
function extractQueryTerms(query: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'and', 'or', 'not', 'is', 'are', 'was', 'were',
    'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
    'it', 'its', 'my', 'your', 'our', 'their', 'all', 'any', 'some',
  ]);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}

// -- Public API --

/**
 * Search community summaries by keyword matching.
 *
 * Returns communities whose summaries match the query terms, sorted by match
 * score. Used as a fallback channel when primary search returns weak results.
 *
 * @param query - The search query string
 * @param db - SQLite database instance
 * @param limit - Maximum communities to return (default 5)
 * @returns Community search results with member IDs for pipeline injection
 */
export function searchCommunities(
  query: string,
  db: Database.Database,
  limit: number = 5,
  options: CommunitySearchOptions = {},
): CommunitySearchOutput {
  const emptyOutput: CommunitySearchOutput = {
    results: [],
    totalMemberIds: [],
    source: 'community_fallback',
  };

  const respectFallbackFlag = options.respectFallbackFlag ?? true;
  if ((respectFallbackFlag && !isCommunitySearchFallbackEnabled()) || !isCommunitySummariesEnabled()) {
    return emptyOutput;
  }

  try {
    if (!tableExists(db, 'community_summaries')) {
      return emptyOutput;
    }

    const queryTerms = extractQueryTerms(query);
    if (queryTerms.length === 0) return emptyOutput;

    const rows = db.prepare(`
      SELECT community_id, summary, member_ids, member_count
      FROM community_summaries
      ORDER BY community_id ASC
    `).all() as Array<{
      community_id: number;
      summary: string;
      member_ids: string;
      member_count: number;
    }>;

    if (rows.length === 0) return emptyOutput;

    // Score and rank communities by query-term match
    const scored: CommunitySearchResult[] = [];
    for (const row of rows) {
      const matchScore = scoreSummary(row.summary, queryTerms);
      if (matchScore > 0) {
        scored.push({
          communityId: row.community_id,
          summary: row.summary,
          memberIds: parseMemberIds(row.member_ids),
          memberCount: row.member_count,
          matchScore,
        });
      }
    }

    // Sort by match score descending, then by member count descending
    scored.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.memberCount - a.memberCount;
    });

    const topResults = scored.slice(0, limit);

    // Collect unique member IDs across all matched communities
    const memberIdSet = new Set<number>();
    for (const r of topResults) {
      for (const id of r.memberIds) {
        memberIdSet.add(id);
      }
    }

    return {
      results: topResults,
      totalMemberIds: Array.from(memberIdSet),
      source: 'community_fallback',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-search] searchCommunities failed (fail-open): ${message}`);
    return emptyOutput;
  }
}

export function queryCommunityMembersAsRankedList(
  query: string,
  db: Database.Database,
  limit: number = 10,
  scope: CommunityLaneScope = {},
): CommunityRankedResult[] {
  const communities = searchCommunities(query, db, Math.max(limit, 5), {
    respectFallbackFlag: false,
  });
  if (communities.totalMemberIds.length === 0) {
    return [];
  }

  const memberScores = new Map<number, {
    score: number;
    communityIds: number[];
  }>();

  for (const [rank, community] of communities.results.entries()) {
    const rankDamping = Math.max(0.5, 1 - rank * 0.03);
    const score = community.matchScore * rankDamping;
    for (const memberId of community.memberIds) {
      const existing = memberScores.get(memberId);
      if (!existing || score > existing.score) {
        memberScores.set(memberId, {
          score,
          communityIds: [community.communityId],
        });
      } else if (existing.score === score && !existing.communityIds.includes(community.communityId)) {
        existing.communityIds.push(community.communityId);
      }
    }
  }

  const memberIds = Array.from(memberScores.keys());
  if (memberIds.length === 0) {
    return [];
  }

  try {
    const placeholders = memberIds.map(() => '?').join(', ');
    const params: unknown[] = [...memberIds];
    const whereClauses = [`m.id IN (${placeholders})`];

    if (columnExists(db, 'memory_index', 'embedding_status')) {
      whereClauses.push("m.embedding_status = 'success'");
    }
    if (columnExists(db, 'memory_index', 'expires_at')) {
      whereClauses.push("(m.expires_at IS NULL OR m.expires_at > datetime('now'))");
    }
    if (scope.specFolder && columnExists(db, 'memory_index', 'spec_folder')) {
      whereClauses.push("(m.spec_folder = ? OR m.spec_folder LIKE ? ESCAPE '\\')");
      params.push(scope.specFolder, specFolderLikePattern(scope.specFolder));
    }
    if (scope.tenantId && columnExists(db, 'memory_index', 'tenant_id')) {
      whereClauses.push('m.tenant_id = ?');
      params.push(scope.tenantId);
    }
    if (scope.userId && columnExists(db, 'memory_index', 'user_id')) {
      whereClauses.push('m.user_id = ?');
      params.push(scope.userId);
    }
    if (scope.agentId && columnExists(db, 'memory_index', 'agent_id')) {
      whereClauses.push('m.agent_id = ?');
      params.push(scope.agentId);
    }

    const projectionJoin = tableExists(db, 'active_memory_projection')
      ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id'
      : '';
    const contentSelect = columnExists(db, 'memory_index', 'content') ? ', m.content' : '';

    const rows = db.prepare(`
      SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier,
             m.importance_weight, m.quality_score, m.created_at, m.context_type,
             m.tenant_id, m.user_id, m.agent_id, m.session_id${contentSelect}
      FROM memory_index m
      ${projectionJoin}
      WHERE ${whereClauses.join(' AND ')}
    `).all(...params) as Array<Record<string, unknown> & { id: number }>;

    return rows
      .map((row): CommunityRankedResult | null => {
        const laneScore = memberScores.get(row.id);
        if (!laneScore) return null;
        return {
          ...row,
          id: row.id,
          source: 'community',
          score: laneScore.score,
          similarity: laneScore.score,
          communityIds: laneScore.communityIds,
          communityScore: laneScore.score,
          summaryLaneSources: ['community'],
        };
      })
      .filter((row): row is CommunityRankedResult => row !== null)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.id - b.id;
      })
      .slice(0, limit);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-search] queryCommunityMembersAsRankedList failed (fail-open): ${message}`);
    return [];
  }
}
