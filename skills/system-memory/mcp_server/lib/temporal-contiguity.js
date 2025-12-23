/**
 * Temporal Contiguity Module - Adjacent memory retrieval
 * @module lib/temporal-contiguity
 * @version 11.0.0
 */

'use strict';

// Default contiguity window (neighbors before and after)
const DEFAULT_WINDOW = 2;
const MAX_WINDOW = 10;

/**
 * Vector search with temporal contiguity
 * Returns primary matches plus temporally adjacent memories
 *
 * @param {Object} db - Database instance
 * @param {Function} vectorSearchFn - Vector search function
 * @param {Buffer} queryEmbedding - Query vector
 * @param {Object} [options]
 * @param {number} [options.limit=10] - Primary results limit
 * @param {number} [options.contiguityWindow=2] - Neighbors to include
 * @param {string} [options.specFolder] - Filter by spec folder
 * @returns {Object} { primary: Array, contiguous: Array }
 */
function vectorSearchWithContiguity(db, vectorSearchFn, queryEmbedding, options = {}) {
  const {
    limit = 10,
    contiguityWindow = DEFAULT_WINDOW,
    specFolder = null
  } = options;

  // Validate window size
  const window = Math.min(Math.max(1, contiguityWindow), MAX_WINDOW);

  // Get primary results
  const primary = vectorSearchFn(queryEmbedding, { limit, specFolder });

  if (primary.length === 0) {
    return { primary: [], contiguous: [] };
  }

  // Find temporally adjacent memories
  const contiguousIds = new Set();
  const seenPrimary = new Set(primary.map(p => p.id));

  for (const result of primary) {
    // Get neighbors within the same spec folder by time proximity
    const neighbors = db.prepare(`
      SELECT id, title, created_at, spec_folder
      FROM memory_index
      WHERE spec_folder = ?
        AND id != ?
        AND embedding_status = 'success'
        AND importance_tier != 'deprecated'
      ORDER BY ABS(julianday(created_at) - julianday(?))
      LIMIT ?
    `).all(
      result.spec_folder,
      result.id,
      result.created_at,
      window * 2
    );

    for (const neighbor of neighbors) {
      if (!seenPrimary.has(neighbor.id)) {
        contiguousIds.add(neighbor.id);
      }
    }
  }

  // Fetch contiguous memories
  const contiguous = [];
  if (contiguousIds.size > 0) {
    const ids = Array.from(contiguousIds);
    const placeholders = ids.map(() => '?').join(',');

    const rows = db.prepare(`
      SELECT * FROM memory_index
      WHERE id IN (${placeholders})
      ORDER BY created_at ASC
    `).all(...ids);

    for (const row of rows) {
      if (row.trigger_phrases) {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      }
      contiguous.push({
        ...row,
        contiguitySource: 'temporal'
      });
    }
  }

  return { primary, contiguous };
}

/**
 * Get temporal neighbors for a specific memory
 * @param {Object} db - Database instance
 * @param {number} memoryId - Memory ID to find neighbors for
 * @param {Object} [options]
 * @param {number} [options.before=2] - Neighbors before
 * @param {number} [options.after=2] - Neighbors after
 * @returns {Object} { before: Array, after: Array }
 */
function getTemporalNeighbors(db, memoryId, options = {}) {
  const { before = 2, after = 2 } = options;

  // Get the source memory
  const source = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId);
  if (!source) {
    return { before: [], after: [] };
  }

  // Get memories before
  const beforeRows = db.prepare(`
    SELECT * FROM memory_index
    WHERE spec_folder = ?
      AND created_at < ?
      AND id != ?
      AND embedding_status = 'success'
      AND importance_tier != 'deprecated'
    ORDER BY created_at DESC
    LIMIT ?
  `).all(source.spec_folder, source.created_at, memoryId, before);

  // Get memories after
  const afterRows = db.prepare(`
    SELECT * FROM memory_index
    WHERE spec_folder = ?
      AND created_at > ?
      AND id != ?
      AND embedding_status = 'success'
      AND importance_tier != 'deprecated'
    ORDER BY created_at ASC
    LIMIT ?
  `).all(source.spec_folder, source.created_at, memoryId, after);

  // Parse trigger phrases
  const parseRow = row => {
    if (row.trigger_phrases) {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    }
    return row;
  };

  return {
    before: beforeRows.reverse().map(parseRow),
    after: afterRows.map(parseRow)
  };
}

/**
 * Build timeline of memories in a spec folder
 * @param {Object} db - Database instance
 * @param {string} specFolder - Spec folder name
 * @param {Object} [options]
 * @param {number} [options.limit=50]
 * @returns {Array} Chronological memory list
 */
function buildTimeline(db, specFolder, options = {}) {
  const { limit = 50 } = options;

  const rows = db.prepare(`
    SELECT id, title, created_at, context_type, importance_tier
    FROM memory_index
    WHERE spec_folder = ?
      AND embedding_status = 'success'
      AND importance_tier != 'deprecated'
    ORDER BY created_at ASC
    LIMIT ?
  `).all(specFolder, limit);

  return rows.map((row, index) => ({
    ...row,
    position: index + 1,
    total: rows.length
  }));
}

module.exports = {
  DEFAULT_WINDOW,
  MAX_WINDOW,
  vectorSearchWithContiguity,
  getTemporalNeighbors,
  buildTimeline
};
