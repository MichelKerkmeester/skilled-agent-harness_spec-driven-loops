/**
 * Reranker Module - Optional cross-encoder reranking
 * @module lib/reranker
 * @version 11.0.0
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const RERANKER_SCRIPT = path.join(__dirname, '../scripts/rerank.py');
const RERANKER_ENABLED = process.env.ENABLE_RERANKER === 'true';
const RERANKER_TIMEOUT = 5000; // 5 seconds

// Cache availability check
let _pythonAvailable = null;

/**
 * Check if Python and required packages are available
 * @returns {boolean}
 */
function isPythonAvailable() {
  if (_pythonAvailable !== null) {
    return _pythonAvailable;
  }

  try {
    execSync('python3 -c "from sentence_transformers import CrossEncoder"', {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    _pythonAvailable = true;
  } catch {
    _pythonAvailable = false;
    console.warn('[reranker] Python cross-encoder not available. Reranking disabled.');
  }

  return _pythonAvailable;
}

/**
 * Rerank results using cross-encoder (optional enhancement)
 * @param {string} query - Search query
 * @param {Array} results - Results to rerank
 * @param {number} [topK=5] - Number of results to keep
 * @returns {Array} Reranked results
 */
function rerankResults(query, results, topK = 5) {
  // Skip if disabled or single result
  if (!RERANKER_ENABLED || results.length <= 1) {
    return results.slice(0, topK);
  }

  // Check Python availability
  if (!isPythonAvailable()) {
    return results.slice(0, topK);
  }

  try {
    const input = JSON.stringify({
      query,
      documents: results.map(r => ({
        id: r.id,
        text: `${r.title || ''} ${r.content || ''}`
      }))
    });

    const output = execSync(
      `python3 "${RERANKER_SCRIPT}"`,
      {
        input,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: RERANKER_TIMEOUT
      }
    );

    const scores = JSON.parse(output);

    // Add rerank scores and sort
    return results
      .map((r, i) => ({ ...r, rerankScore: scores[i] }))
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, topK);

  } catch (error) {
    console.warn(`[reranker] Failed, using original ranking: ${error.message}`);
    return results.slice(0, topK);
  }
}

/**
 * Check if reranking is enabled and available
 * @returns {boolean}
 */
function isRerankerAvailable() {
  return RERANKER_ENABLED && isPythonAvailable();
}

module.exports = {
  rerankResults,
  isRerankerAvailable,
  isPythonAvailable,
  RERANKER_ENABLED
};
