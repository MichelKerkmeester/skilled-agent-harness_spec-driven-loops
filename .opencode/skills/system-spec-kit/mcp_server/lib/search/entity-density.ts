// ───────────────────────────────────────────────────────────────
// MODULE: Entity Density
// ───────────────────────────────────────────────────────────────
// Cached lookup that flags queries whose terms hit titles / trigger_phrases of
// memory_index rows with ≥3 outgoing causal_edges. Used by the query router
// (REQ-003) to activate the graph channel for entity-rich short queries.
//
// The cache is a Set of lowercase tokens drawn from high-degree memory rows.
// Refreshes lazily on a 60s TTL or via invalidateEntityDensityCache(). Falls
// back to score=0 when the DB / tables are missing (cold-start safety).

import type Database from 'better-sqlite3';

// Feature catalog: Causal graph channel routing utilization

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS & STATE
----------------------------------------------------------------*/

const MIN_OUTGOING_EDGES = 3;
const CACHE_TTL_MS = 60_000;
const TOKEN_MIN_LENGTH = 2;

const STOPWORDS: ReadonlySet<string> = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but',
  'with', 'this', 'that', 'it', 'from', 'by', 'as', 'be',
  'has', 'had', 'have', 'do', 'does', 'did',
  'will', 'would', 'can', 'could', 'should', 'may', 'might',
]);

let cachedTerms: Set<string> = new Set();
let lastBuiltAt = 0;
let lastBuildOk = false;

/* ───────────────────────────────────────────────────────────────
   2. TOKENIZATION
----------------------------------------------------------------*/

function tokenize(text: string): string[] {
  if (!text) return [];
  const tokens = text.toLowerCase().match(/[a-z0-9_-]+/g) ?? [];
  return tokens.filter((t) => t.length >= TOKEN_MIN_LENGTH && !STOPWORDS.has(t));
}

function parseTriggerPhrases(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((p): p is string => typeof p === 'string');
    }
  } catch {
    // Not JSON — treat as a single phrase.
    return [raw];
  }
  return [];
}

/* ───────────────────────────────────────────────────────────────
   3. CACHE BUILD
----------------------------------------------------------------*/

interface HighDegreeRow {
  title: string | null;
  trigger_phrases: string | null;
}

function buildIndex(db: Database.Database): Set<string> {
  const rows = db.prepare(`
    SELECT mi.title, mi.trigger_phrases
    FROM memory_index mi
    INNER JOIN (
      SELECT source_id, COUNT(*) AS edge_count
      FROM causal_edges
      GROUP BY source_id
      HAVING COUNT(*) >= ?
    ) ce ON CAST(mi.id AS TEXT) = ce.source_id
  `).all(MIN_OUTGOING_EDGES) as HighDegreeRow[];

  const terms = new Set<string>();
  for (const row of rows) {
    for (const tok of tokenize(row.title ?? '')) {
      terms.add(tok);
    }
    for (const phrase of parseTriggerPhrases(row.trigger_phrases)) {
      for (const tok of tokenize(phrase)) {
        terms.add(tok);
      }
    }
  }
  return terms;
}

function refreshIfStale(db: Database.Database | null): void {
  if (!db) {
    cachedTerms = new Set();
    lastBuildOk = false;
    return;
  }
  const now = Date.now();
  if (lastBuildOk && now - lastBuiltAt < CACHE_TTL_MS) {
    return;
  }
  try {
    cachedTerms = buildIndex(db);
    lastBuiltAt = now;
    lastBuildOk = true;
  } catch {
    // Table missing or query failed — keep prior cache state, mark not-ok so
    // we retry on next call rather than silently serving stale data.
    cachedTerms = new Set();
    lastBuiltAt = now;
    lastBuildOk = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   4. PUBLIC API
----------------------------------------------------------------*/

/**
 * Count distinct query terms that match titles/trigger_phrases of memory_index
 * rows with ≥3 outgoing causal_edges. Returns 0 on cold-start (no DB / no
 * edges) so the entity-density override stays inactive when the signal would
 * be unreliable.
 */
function getEntityDensityScore(query: string, db: Database.Database | null): number {
  if (!query) return 0;
  refreshIfStale(db);
  if (cachedTerms.size === 0) return 0;

  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return 0;

  let hits = 0;
  for (const tok of queryTokens) {
    if (cachedTerms.has(tok)) {
      hits += 1;
    }
  }
  return hits;
}

/**
 * Force the next score lookup to rebuild the cache. Wire into post-commit
 * hooks (memory_save, memory_bulk_delete) when the cache becomes stale enough
 * to mis-route. The 60s TTL is the floor — this is the precision tool.
 */
function invalidateEntityDensityCache(): void {
  cachedTerms = new Set();
  lastBuiltAt = 0;
  lastBuildOk = false;
}

/** Test-only: inspect cache state. */
function _getEntityDensityCacheState(): { size: number; builtAt: number; ok: boolean } {
  return { size: cachedTerms.size, builtAt: lastBuiltAt, ok: lastBuildOk };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
----------------------------------------------------------------*/

export {
  getEntityDensityScore,
  invalidateEntityDensityCache,
  // Test-only helpers
  _getEntityDensityCacheState,
  MIN_OUTGOING_EDGES,
  CACHE_TTL_MS,
};
