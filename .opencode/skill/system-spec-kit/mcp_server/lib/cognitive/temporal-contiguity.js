// ───────────────────────────────────────────────────────────────
// temporal-contiguity.js: Temporal adjacency for memory retrieval
// ───────────────────────────────────────────────────────────────
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const DEFAULT_WINDOW = 2;
const MAX_WINDOW = 10;

/* ───────────────────────────────────────────────────────────────
   2. CORE FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

// Returns primary matches plus temporally adjacent memories
function vector_search_with_contiguity(db, vector_search_fn, query_embedding, options = {}) {
  const {
    limit = 10,
    contiguity_window = DEFAULT_WINDOW,
    spec_folder = null,
  } = options;

  const window = Math.min(Math.max(1, contiguity_window), MAX_WINDOW);
  const primary = vector_search_fn(query_embedding, { limit, spec_folder });

  if (primary.length === 0) {
    return { primary: [], contiguous: [] };
  }

  const contiguous_ids = new Set();
  const seen_primary = new Set(primary.map(p => p.id));

  for (const result of primary) {
    // Get neighbors within same spec folder by time proximity
    const neighbors = db.prepare(`
      SELECT id, title, created_at, spec_folder
      FROM memory_index
      WHERE spec_folder = ?
        AND id != ?
        AND embedding_status = 'success'
        AND importance_tier != 'deprecated'
      ORDER BY ABS(julianday(created_at) - julianday(?))
      LIMIT ?
    `).all(result.spec_folder, result.id, result.created_at, window * 2);

    for (const neighbor of neighbors) {
      if (!seen_primary.has(neighbor.id)) {
        contiguous_ids.add(neighbor.id);
      }
    }
  }

  const contiguous = [];
  if (contiguous_ids.size > 0) {
    const ids = Array.from(contiguous_ids);
    const placeholders = ids.map(() => '?').join(',');

    const rows = db.prepare(`
      SELECT * FROM memory_index
      WHERE id IN (${placeholders})
      ORDER BY created_at ASC
    `).all(...ids);

    for (const row of rows) {
      // T121: Wrap JSON.parse in try-catch to handle parse errors gracefully
      if (row.trigger_phrases) {
        try {
          row.trigger_phrases = JSON.parse(row.trigger_phrases);
        } catch (e) {
          console.warn(`[temporal-contiguity] Failed to parse trigger_phrases for memory ${row.id}: ${e.message}`);
          row.trigger_phrases = [];
        }
      }
      contiguous.push({ ...row, contiguity_source: 'temporal' });
    }
  }

  return { primary, contiguous };
}

function get_temporal_neighbors(db, memory_id, options = {}) {
  const { before = 2, after = 2 } = options;

  const source = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(memory_id);
  if (!source) {
    return { before: [], after: [] };
  }

  const before_rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE spec_folder = ?
      AND created_at < ?
      AND id != ?
      AND embedding_status = 'success'
      AND importance_tier != 'deprecated'
    ORDER BY created_at DESC
    LIMIT ?
  `).all(source.spec_folder, source.created_at, memory_id, before);

  const after_rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE spec_folder = ?
      AND created_at > ?
      AND id != ?
      AND embedding_status = 'success'
      AND importance_tier != 'deprecated'
    ORDER BY created_at ASC
    LIMIT ?
  `).all(source.spec_folder, source.created_at, memory_id, after);

  // T121: Wrap JSON.parse in try-catch to handle parse errors gracefully
  const parse_row = row => {
    if (row.trigger_phrases) {
      try {
        row.trigger_phrases = JSON.parse(row.trigger_phrases);
      } catch (e) {
        console.warn(`[temporal-contiguity] Failed to parse trigger_phrases for memory ${row.id}: ${e.message}`);
        row.trigger_phrases = [];
      }
    }
    return row;
  };

  return {
    before: before_rows.reverse().map(parse_row),
    after: after_rows.map(parse_row),
  };
}

function build_timeline(db, spec_folder, options = {}) {
  const { limit = 50 } = options;

  const rows = db.prepare(`
    SELECT id, title, created_at, context_type, importance_tier
    FROM memory_index
    WHERE spec_folder = ?
      AND embedding_status = 'success'
      AND importance_tier != 'deprecated'
    ORDER BY created_at ASC
    LIMIT ?
  `).all(spec_folder, limit);

  return rows.map((row, index) => ({
    ...row,
    position: index + 1,
    total: rows.length,
  }));
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  DEFAULT_WINDOW,
  MAX_WINDOW,
  vector_search_with_contiguity,
  get_temporal_neighbors,
  build_timeline,
};
