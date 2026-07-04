// ───────────────────────────────────────────────────────────────
// MODULE: Memory Summaries
// ───────────────────────────────────────────────────────────────
// Feature catalog: Memory summary search channel
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer.js';
import { isMemorySummariesEnabled } from './search-flags.js';
import { specFolderLikePattern } from './vector-index-types.js';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

/**
 * Caller scope for summary-embedding retrieval. Mirrors the primary vector
 * lane: a spec-folder boundary (prefix-aware) plus the governance triple.
 * All fields are optional so unscoped callers keep the legacy behaviour.
 */
export interface SummaryScope {
  specFolder?: string | null;
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
}

export interface SummaryRankedResult extends Record<string, unknown> {
  id: number;
  source: 'summary';
  score: number;
  similarity: number;
  summaryId: number;
  summaryScore: number;
  summaryLaneSources: string[];
}

export interface WorldSummaryPreludeSection {
  memoryId: number;
  title: string;
  specFolder: string | null;
  summary: string;
  score: number;
}

export interface WorldSummaryPrelude {
  rootSummary: string;
  sections: WorldSummaryPreludeSection[];
  text: string;
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Compute cosine similarity between two vectors.
 * Handles mismatched dimensions gracefully by returning 0.
 */
function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number {
  const lenA = a.length;
  const lenB = b.length;

  // Mismatched dimensions: cannot compute meaningful similarity
  if (lenA !== lenB || lenA === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < lenA; i++) {
    const valA = a[i];
    const valB = b[i];
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Convert a Float32Array to a Buffer for SQLite BLOB storage.
 */
function float32ToBuffer(arr: Float32Array): Buffer {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
}

/**
 * Convert a Buffer (SQLite BLOB) back to a Float32Array.
 */
function bufferToFloat32(buf: Buffer): Float32Array {
  // Create a copy to avoid alignment issues
  const copy = new ArrayBuffer(buf.length);
  const view = new Uint8Array(copy);
  for (let i = 0; i < buf.length; i++) {
    view[i] = buf[i];
  }
  return new Float32Array(copy);
}

/**
 * True when a table is present in the main schema. The summary lane runs
 * against the full production schema, but unit fixtures wire a minimal
 * memory_index; probing keeps the scoped query graceful on partial schemas.
 */
function tableExists(db: Database.Database, tableName: string): boolean {
  try {
    const row = db.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type = 'table' AND name = ?
      LIMIT 1
    `).get(tableName) as { found?: number } | undefined;
    return row?.found === 1;
  } catch {
    return false;
  }
}

/**
 * True when a column is present on the given table. Used to gate the
 * expiry/governance predicates that only exist on the full memory_index.
 */
function columnExists(db: Database.Database, tableName: string, columnName: string): boolean {
  try {
    const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
    return rows.some((r) => r.name === columnName);
  } catch {
    return false;
  }
}

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
    .split(/[^a-z0-9_-]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length > 1 && !stopWords.has(term));
}

function scoreTextAgainstQuery(text: string, queryTerms: string[]): number {
  if (queryTerms.length === 0) return 0;
  const haystack = text.toLowerCase();
  let matches = 0;
  for (const term of queryTerms) {
    if (haystack.includes(term)) {
      matches += 1;
    }
  }
  return matches / queryTerms.length;
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Generate summary, compute embedding, store in memory_summaries.
 *
 * 1. Call generateSummary(content)
 * 2. If summary empty, return { stored: false, summary: '' }
 * 3. Call embeddingFn(summary) to get embedding
 * 4. INSERT OR REPLACE into memory_summaries
 * 5. Store embedding as Buffer (Float32Array -> Buffer)
 * 6. Store key_sentences as JSON string
 *
 * @param db - SQLite database instance
 * @param memoryId - ID of the memory to summarize
 * @param content - Raw content to generate summary from
 * @param embeddingFn - Async function to compute embedding vector
 * @returns Object with stored flag and summary text
 */
export async function generateAndStoreSummary(
  db: Database.Database,
  memoryId: number,
  content: string,
  embeddingFn: (text: string) => Promise<Float32Array | null>
): Promise<{ stored: boolean; summary: string }> {
  if (!isMemorySummariesEnabled()) {
    return { stored: false, summary: '' };
  }

  try {
    const { summary, keySentences } = generateSummary(content);

    if (!summary) {
      return { stored: false, summary: '' };
    }

    const embedding = await embeddingFn(summary);
    const embeddingBlob = embedding ? float32ToBuffer(embedding) : null;
    const keySentencesJson = JSON.stringify(keySentences);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO memory_summaries
        (memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, COALESCE((SELECT created_at FROM memory_summaries WHERE memory_id = ?), ?), ?)
    `);

    stmt.run(
      memoryId,
      summary,
      embeddingBlob,
      keySentencesJson,
      memoryId,
      now,
      now
    );

    return { stored: true, summary };
  } catch (error: unknown) {
    console.warn(
      `[memory-summaries] Failed to generate/store summary for memory ${memoryId}:`,
      error instanceof Error ? error.message : error
    );
    return { stored: false, summary: '' };
  }
}

/**
 * Vector search on summary embeddings — parallel channel for stage1.
 *
 * 1. SELECT summary embeddings joined to memory_index, applying the caller's
 *    scope (spec-folder prefix + governance triple) and the active/expiry/
 *    embedding_status gate inside SQL — so the row cap lands AFTER scope.
 * 2. Compute cosine similarity between query embedding and each summary embedding
 * 3. Return top `limit` results sorted by similarity descending
 * 4. Convert BLOB back to Float32Array for comparison
 *
 * Scoping the fetch matters at scale: the row cap previously selected an
 * arbitrary rowid prefix before ranking, starving scoped callers whose hits
 * lived past the cap. Pushing scope into the WHERE keeps the cap on the
 * relevant slice and mirrors the primary vector lane's active-row gate.
 *
 * @param db - SQLite database instance
 * @param queryEmbedding - Query vector to compare against stored summaries
 * @param limit - Maximum number of results to return
 * @param scope - Optional caller scope; omitted fields impose no restriction
 * @returns Array of summary search results sorted by similarity descending
 */
export function querySummaryEmbeddings(
  db: Database.Database,
  queryEmbedding: Float32Array | number[],
  limit: number,
  scope: SummaryScope = {}
): SummarySearchResult[] {
  try {
    // Cap rows fetched to avoid full-table scans on large databases.
    // Over-fetch by a factor so that after cosine ranking we can still return `limit` results.
    const fetchCap = Math.max(limit * 10, 1000);

    // Join memory_index so scope and the active-row gate apply BEFORE the cap.
    // Predicates that depend on columns/tables absent from minimal fixtures are
    // gated on schema presence so partial schemas degrade rather than throw.
    const whereClauses = ['s.summary_embedding IS NOT NULL'];
    const params: unknown[] = [];

    if (columnExists(db, 'memory_index', 'embedding_status')) {
      whereClauses.push("m.embedding_status = 'success'");
    }
    if (columnExists(db, 'memory_index', 'expires_at')) {
      whereClauses.push("(m.expires_at IS NULL OR m.expires_at > datetime('now'))");
    }

    // Spec-folder scope: prefix-aware so a parent-scope query keeps descendants.
    if (scope.specFolder) {
      whereClauses.push("(m.spec_folder = ? OR m.spec_folder LIKE ? ESCAPE '\\')");
      params.push(scope.specFolder, specFolderLikePattern(scope.specFolder));
    }

    // Governance triple: exact-match per axis, mirroring the post-filter applied
    // downstream. Pushing it here keeps the row cap on the in-scope slice instead
    // of letting out-of-scope rows consume the budget before ranking.
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

    // active_memory_projection restricts to the live revision of each logical
    // memory; only joinable when the projection table is present (production).
    const projectionJoin = tableExists(db, 'active_memory_projection')
      ? 'JOIN active_memory_projection p ON p.active_memory_id = s.memory_id'
      : '';

    params.push(fetchCap);
    const rows = db.prepare(`
      SELECT s.id, s.memory_id, s.summary_embedding
      FROM memory_summaries s
      JOIN memory_index m ON m.id = s.memory_id
      ${projectionJoin}
      WHERE ${whereClauses.join(' AND ')}
      LIMIT ?
    `).all(...params) as Array<{ id: number; memory_id: number; summary_embedding: Buffer }>;

    const results: SummarySearchResult[] = [];

    for (const row of rows) {
      const storedEmbedding = bufferToFloat32(row.summary_embedding);
      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);

      results.push({
        id: row.id,
        memoryId: row.memory_id,
        similarity,
      });
    }

    // Sort by similarity descending, take top `limit`
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  } catch (error: unknown) {
    console.warn(
      '[memory-summaries] Failed to query summary embeddings:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

export function querySummaryEmbeddingRows(
  db: Database.Database,
  queryEmbedding: Float32Array | number[],
  limit: number,
  scope: SummaryScope = {},
): SummaryRankedResult[] {
  const summaryHits = querySummaryEmbeddings(db, queryEmbedding, limit, scope);
  if (summaryHits.length === 0) {
    return [];
  }

  try {
    const memoryIds = summaryHits.map((hit) => hit.memoryId);
    const placeholders = memoryIds.map(() => '?').join(', ');
    const params: unknown[] = [...memoryIds];
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

    const rowById = new Map(rows.map((row) => [row.id, row]));
    return summaryHits
      .map((hit): SummaryRankedResult | null => {
        const row = rowById.get(hit.memoryId);
        if (!row) return null;
        return {
          ...row,
          id: hit.memoryId,
          source: 'summary',
          score: hit.similarity,
          similarity: hit.similarity,
          summaryId: hit.id,
          summaryScore: hit.similarity,
          summaryLaneSources: ['summary'],
        };
      })
      .filter((row): row is SummaryRankedResult => row !== null);
  } catch (error: unknown) {
    console.warn(
      '[memory-summaries] Failed to build summary ranked rows:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

export function buildWorldSummaryPrelude(
  db: Database.Database,
  query: string,
  scope: SummaryScope = {},
  options: { limit?: number } = {},
): WorldSummaryPrelude | null {
  const sectionLimit = Math.max(1, Math.min(10, options.limit ?? 3));
  const queryTerms = extractQueryTerms(query);

  try {
    if (!tableExists(db, 'memory_summaries') || !tableExists(db, 'memory_index')) {
      return null;
    }

    const params: unknown[] = [];
    const whereClauses = ["s.summary_text IS NOT NULL", "trim(s.summary_text) != ''"];

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
      ? 'JOIN active_memory_projection p ON p.active_memory_id = s.memory_id'
      : '';
    params.push(Math.max(sectionLimit * 25, 50));

    const rows = db.prepare(`
      SELECT s.memory_id, s.summary_text, m.title, m.spec_folder, m.created_at
      FROM memory_summaries s
      JOIN memory_index m ON m.id = s.memory_id
      ${projectionJoin}
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY COALESCE(m.created_at, '') DESC, s.memory_id ASC
      LIMIT ?
    `).all(...params) as Array<{
      memory_id: number;
      summary_text: string;
      title?: string | null;
      spec_folder?: string | null;
      created_at?: string | null;
    }>;

    if (rows.length === 0) {
      return null;
    }

    const scored = rows
      .map((row): WorldSummaryPreludeSection => {
        const title = typeof row.title === 'string' && row.title.length > 0
          ? row.title
          : `Memory ${row.memory_id}`;
        const summary = row.summary_text.trim();
        const score = scoreTextAgainstQuery(`${title}\n${summary}`, queryTerms);
        return {
          memoryId: row.memory_id,
          title,
          specFolder: typeof row.spec_folder === 'string' ? row.spec_folder : null,
          summary,
          score,
        };
      })
      .filter((section) => queryTerms.length === 0 || section.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.memoryId - b.memoryId;
      })
      .slice(0, sectionLimit);

    if (scored.length === 0) {
      return null;
    }

    const rootSummary = scored
      .map((section) => section.summary)
      .join(' ')
      .slice(0, 800)
      .trim();
    const text = [
      'World summary',
      rootSummary,
      '',
      'Relevant subsections',
      ...scored.map((section) => `- ${section.title}: ${section.summary}`),
    ].join('\n');

    return {
      rootSummary,
      sections: scored,
      text,
    };
  } catch (error: unknown) {
    console.warn(
      '[memory-summaries] Failed to build world summary prelude:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Runtime scale gate check: returns true when >5000 indexed memories.
 * Used to determine if the summary search channel should be activated
 * as an additional retrieval source.
 *
 * @param db - SQLite database instance
 * @returns True if indexed memory count exceeds 5000
 */
export function checkScaleGate(db: Database.Database): boolean {
  try {
    const row = db.prepare(`
      SELECT COUNT(*) AS cnt
      FROM memory_index
      WHERE embedding_status = 'success'
    `).get() as { cnt: number } | undefined;

    return (row?.cnt ?? 0) > 5000;
  } catch (error: unknown) {
    console.warn(
      '[memory-summaries] Failed to check scale gate:',
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// 4. TEST EXPORTS

// ───────────────────────────────────────────────────────────────
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  cosineSimilarity,
  float32ToBuffer,
  bufferToFloat32,
  extractQueryTerms,
  scoreTextAgainstQuery,
};
