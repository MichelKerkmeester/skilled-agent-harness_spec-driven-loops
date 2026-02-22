// ---------------------------------------------------------------
// MODULE: Co-Activation
// Spreading activation for related memory retrieval
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONFIGURATION
----------------------------------------------------------------*/

const CO_ACTIVATION_CONFIG = {
  enabled: process.env.SPECKIT_COACTIVATION !== 'false',
  boostFactor: 0.15,
  maxRelated: 5,
  minSimilarity: 70,
  decayPerHop: 0.5,
  maxHops: 2,
  maxSpreadResults: 20,
} as const;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

interface CoActivationEvent {
  timestamp: string;
  sourceId: number;
  targetId: number;
  similarity: number;
  boost: number;
}

interface RelatedMemory {
  id: number;
  similarity: number;
  title?: string;
  spec_folder?: string;
  [key: string]: unknown;
}

interface SpreadResult {
  id: number;
  activationScore: number;
  hop: number;
  path: number[];
}

/* -------------------------------------------------------------
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* -------------------------------------------------------------
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
}

function isEnabled(): boolean {
  return CO_ACTIVATION_CONFIG.enabled;
}

/* -------------------------------------------------------------
   5. CORE FUNCTIONS
----------------------------------------------------------------*/

/**
 * Boost a search result's score based on co-activation with related memories.
 */
function boostScore(
  baseScore: number,
  relatedCount: number,
  avgSimilarity: number
): number {
  if (!CO_ACTIVATION_CONFIG.enabled || relatedCount === 0) {
    return baseScore;
  }

  const boost = CO_ACTIVATION_CONFIG.boostFactor * (relatedCount / CO_ACTIVATION_CONFIG.maxRelated) * (avgSimilarity / 100);
  return baseScore + boost;
}

/**
 * Get related memories for a given memory ID from stored relations.
 */
function getRelatedMemories(
  memoryId: number,
  limit: number = CO_ACTIVATION_CONFIG.maxRelated
): RelatedMemory[] {
  if (!db) {
    console.warn('[co-activation] Database not initialized. Server may still be starting up.');
    return [];
  }

  try {
    const memory = (db.prepare(
      'SELECT related_memories FROM memory_index WHERE id = ?'
    ) as Database.Statement).get(memoryId) as { related_memories: string | null } | undefined;

    if (!memory || !memory.related_memories) {
      return [];
    }

    let related: Array<{ id: number; similarity: number }>;
    try {
      related = JSON.parse(memory.related_memories);
    } catch {
      return [];
    }

    if (!Array.isArray(related)) return [];

    // Fetch full memory details for each related
    const results: RelatedMemory[] = [];
    for (const rel of related.slice(0, limit)) {
      if (rel.id == null) continue;
      try {
        const fullMemory = (db.prepare(
          'SELECT id, title, spec_folder, file_path, importance_tier FROM memory_index WHERE id = ?'
        ) as Database.Statement).get(rel.id) as Record<string, unknown> | undefined;

        if (fullMemory) {
          results.push({
            ...(fullMemory as RelatedMemory),
            similarity: rel.similarity,
          });
        }
      } catch {
        // Skip individual failures
      }
    }

    return results;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[co-activation] getRelatedMemories error: ${msg}`);
    return [];
  }
}

/**
 * Populate related memories field for a given memory.
 */
async function populateRelatedMemories(
  memoryId: number,
  vectorSearchFn: (embedding: Float32Array, options: Record<string, unknown>) => Array<{ id: number; similarity: number; [key: string]: unknown }>
): Promise<number> {
  if (!db) return 0;

  try {
    // Get the memory's embedding via a vector search for itself
    const memory = (db.prepare('SELECT * FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
    if (!memory) return 0;

    // Get the memory's actual embedding from vec_memories
    const embeddingRow = db ? (db.prepare(
      'SELECT embedding FROM vec_memories WHERE rowid = ?'
    ) as import('better-sqlite3').Statement).get(memoryId) as { embedding: Buffer } | undefined : undefined;

    if (!embeddingRow || !embeddingRow.embedding || embeddingRow.embedding.length === 0) return 0;

    // Convert Buffer to Float32Array with proper byte alignment
    const uint8 = new Uint8Array(embeddingRow.embedding);
    if (uint8.byteLength === 0 || uint8.byteLength % 4 !== 0) {
      // Embedding data is empty or not aligned to 4-byte float boundaries
      console.warn(`[co-activation] Invalid embedding size (${uint8.byteLength} bytes) for memory ${memoryId}`);
      return 0;
    }
    const embedding = new Float32Array(uint8.buffer, uint8.byteOffset, uint8.byteLength / 4);
    const similar = vectorSearchFn(embedding, {
      limit: CO_ACTIVATION_CONFIG.maxRelated + 1,
      minSimilarity: CO_ACTIVATION_CONFIG.minSimilarity,
    });

    const related = similar
      .filter(r => r.id !== memoryId)
      .slice(0, CO_ACTIVATION_CONFIG.maxRelated)
      .map(r => ({ id: r.id, similarity: r.similarity }));

    if (related.length > 0) {
      (db.prepare(
        'UPDATE memory_index SET related_memories = ? WHERE id = ?'
      ) as Database.Statement).run(JSON.stringify(related), memoryId);
    }

    return related.length;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[co-activation] populateRelatedMemories error: ${msg}`);
    return 0;
  }
}

/**
 * Get causally related memories for a given memory ID from the causal_edges table.
 * This surfaces memories connected by causal relationships (caused, enabled, supports, etc.)
 * which may be semantically dissimilar but contextually important.
 */
function getCausalNeighbors(
  memoryId: number,
  limit: number = CO_ACTIVATION_CONFIG.maxRelated
): RelatedMemory[] {
  if (!db) return [];

  try {
    const memIdStr = String(memoryId);
    const rows = (db.prepare(`
      SELECT
        CASE WHEN ce.source_id = ? THEN CAST(ce.target_id AS INTEGER)
             ELSE CAST(ce.source_id AS INTEGER)
        END AS neighbor_id,
        ce.strength,
        ce.relation
      FROM causal_edges ce
      WHERE ce.source_id = ? OR ce.target_id = ?
      ORDER BY ce.strength DESC
      LIMIT ?
    `) as Database.Statement).all(memIdStr, memIdStr, memIdStr, limit) as Array<{
      neighbor_id: number;
      strength: number;
      relation: string;
    }>;

    const results: RelatedMemory[] = [];
    for (const row of rows) {
      if (row.neighbor_id == null || row.neighbor_id === memoryId) continue;
      try {
        const fullMemory = (db!.prepare( // non-null safe: guard on line 207 returns early if db is null
          'SELECT id, title, spec_folder, file_path, importance_tier FROM memory_index WHERE id = ?'
        ) as Database.Statement).get(row.neighbor_id) as Record<string, unknown> | undefined;

        if (fullMemory) {
          results.push({
            ...(fullMemory as RelatedMemory),
            // Map edge strength (0-1) to similarity scale (0-100) for consistent scoring
            similarity: Math.round(row.strength * 100),
          });
        }
      } catch {
        // Skip individual failures
      }
    }

    return results;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[co-activation] getCausalNeighbors error: ${msg}`);
    return [];
  }
}

/**
 * Spreading activation: traverse both pre-computed similarity graph
 * and causal_edges graph from seed memories. Merging both sources
 * surfaces causally related but semantically dissimilar memories
 * that pure vector similarity would miss.
 */
function spreadActivation(
  seedIds: number[],
  maxHops: number = CO_ACTIVATION_CONFIG.maxHops,
  limit: number = CO_ACTIVATION_CONFIG.maxSpreadResults
): SpreadResult[] {
  if (!db || seedIds.length === 0) return [];

  const visited = new Set<number>();
  const results: SpreadResult[] = [];

  interface QueueItem {
    id: number;
    score: number;
    hop: number;
    path: number[];
  }

  const queue: QueueItem[] = seedIds.map(id => ({
    id,
    score: 1.0,
    hop: 0,
    path: [id],
  }));

  while (queue.length > 0 && results.length < limit) {
    const current = queue.shift();
    if (!current) break;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.hop > 0) {
      results.push({
        id: current.id,
        activationScore: Math.round(current.score * 1000) / 1000,
        hop: current.hop,
        path: current.path,
      });
    }

    if (current.hop >= maxHops) continue;

    // Merge neighbors from both similarity and causal graphs
    const similarityNeighbors = getRelatedMemories(current.id);
    const causalNeighbors = getCausalNeighbors(current.id);

    // Deduplicate by ID, keeping the higher similarity score
    const neighborMap = new Map<number, RelatedMemory>();
    for (const rel of similarityNeighbors) {
      neighborMap.set(rel.id, rel);
    }
    for (const rel of causalNeighbors) {
      const existing = neighborMap.get(rel.id);
      if (!existing || rel.similarity > existing.similarity) {
        neighborMap.set(rel.id, rel);
      }
    }

    for (const rel of neighborMap.values()) {
      if (visited.has(rel.id)) continue;

      const decayedScore = current.score * CO_ACTIVATION_CONFIG.decayPerHop * (rel.similarity / 100);
      if (decayedScore < 0.01) continue;

      queue.push({
        id: rel.id,
        score: decayedScore,
        hop: current.hop + 1,
        path: [...current.path, rel.id],
      });
    }

    // Sort queue by score (greedy best-first)
    queue.sort((a, b) => b.score - a.score);
  }

  return results.sort((a, b) => b.activationScore - a.activationScore);
}

/**
 * Log a co-activation event.
 */
function logCoActivationEvent(event: CoActivationEvent): void {
  // Currently logging to console; could be stored in DB
  if (process.env.SPECKIT_DEBUG === 'true') {
    console.error(`[co-activation] Event: ${event.sourceId} -> ${event.targetId} (boost: ${event.boost})`);
  }
}

/* -------------------------------------------------------------
   6. EXPORTS
----------------------------------------------------------------*/

export {
  CO_ACTIVATION_CONFIG,
  init,
  isEnabled,
  boostScore,
  getRelatedMemories,
  getCausalNeighbors,
  populateRelatedMemories,
  spreadActivation,
  logCoActivationEvent,
};

export type {
  CoActivationEvent,
  RelatedMemory,
  SpreadResult,
};
