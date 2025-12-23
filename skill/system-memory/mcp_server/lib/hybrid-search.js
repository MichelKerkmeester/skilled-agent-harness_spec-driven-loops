/**
 * Hybrid Search Module - Combined vector + FTS5 search
 * @module lib/hybrid-search
 * @version 11.0.0
 */

'use strict';

const { fuseResults } = require('./rrf-fusion');

// Database reference
let db = null;
let vectorSearchFn = null;

/**
 * Initialize hybrid search
 * @param {Object} database - better-sqlite3 instance
 * @param {Function} vectorSearch - Vector search function from vector-index
 */
function init(database, vectorSearch) {
  db = database;
  vectorSearchFn = vectorSearch;
}

/**
 * Check if FTS5 table exists
 * @returns {boolean}
 */
function isFtsAvailable() {
  if (!db) return false;
  try {
    db.prepare("SELECT 1 FROM memory_fts LIMIT 1").get();
    return true;
  } catch {
    return false;
  }
}

/**
 * FTS5-only search
 * @param {string} queryText - Search query
 * @param {Object} [options]
 * @param {number} [options.limit=10]
 * @param {string} [options.specFolder]
 * @returns {Array} FTS5 results
 */
function ftsSearch(queryText, options = {}) {
  const { limit = 10, specFolder = null } = options;

  // Escape FTS5 special characters
  const escapedQuery = queryText
    .replace(/"/g, '""')
    .replace(/[*:()]/g, ' ')
    .trim();

  if (!escapedQuery) return [];

  const sql = `
    SELECT m.*,
           -rank as fts_score
    FROM memory_fts f
    JOIN memory_index m ON f.rowid = m.id
    WHERE memory_fts MATCH ?
    ${specFolder ? 'AND m.spec_folder = ?' : ''}
    AND m.importance_tier != 'deprecated'
    ORDER BY rank
    LIMIT ?
  `;

  const params = specFolder
    ? [escapedQuery, specFolder, limit]
    : [escapedQuery, limit];

  try {
    return db.prepare(sql).all(...params);
  } catch (err) {
    console.warn('[hybrid-search] FTS5 query failed:', err.message);
    return [];
  }
}

/**
 * Hybrid search combining vector and FTS5
 * @param {Buffer} queryEmbedding - Query vector
 * @param {string} queryText - Query text for FTS5
 * @param {Object} [options]
 * @param {number} [options.limit=10]
 * @param {string} [options.specFolder]
 * @param {boolean} [options.useDecay=true]
 * @returns {Array} Fused results
 */
function hybridSearch(queryEmbedding, queryText, options = {}) {
  const { limit = 10, specFolder = null, useDecay = true } = options;

  // Get vector results (2x limit for fusion headroom)
  const vectorResults = vectorSearchFn ?
    vectorSearchFn(queryEmbedding, { limit: limit * 2, specFolder }) : [];

  // Get FTS5 results if available
  const ftsResults = isFtsAvailable() ?
    ftsSearch(queryText, { limit: limit * 2, specFolder }) : [];

  // If only one source has results, return those
  if (vectorResults.length === 0) return ftsResults.slice(0, limit);
  if (ftsResults.length === 0) return vectorResults.slice(0, limit);

  // Fuse results using RRF
  return fuseResults(vectorResults, ftsResults, { limit });
}

/**
 * Search with automatic fallback
 * Uses hybrid if both available, otherwise falls back to whichever is available
 * @param {Buffer} queryEmbedding - Query vector (can be null)
 * @param {string} queryText - Query text
 * @param {Object} options - Search options
 * @returns {Array} Search results
 */
function searchWithFallback(queryEmbedding, queryText, options = {}) {
  const hasVector = queryEmbedding && vectorSearchFn;
  const hasFts = isFtsAvailable();

  if (hasVector && hasFts) {
    return hybridSearch(queryEmbedding, queryText, options);
  } else if (hasVector) {
    return vectorSearchFn(queryEmbedding, options);
  } else if (hasFts) {
    return ftsSearch(queryText, options);
  }

  console.warn('[hybrid-search] No search method available');
  return [];
}

module.exports = {
  init,
  isFtsAvailable,
  ftsSearch,
  hybridSearch,
  searchWithFallback
};
