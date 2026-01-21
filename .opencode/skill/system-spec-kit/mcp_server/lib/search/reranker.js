// ───────────────────────────────────────────────────────────────
// SEARCH: RERANKER
// ───────────────────────────────────────────────────────────────
'use strict';

const { execSync } = require('child_process');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const RERANKER_SCRIPT = path.join(__dirname, '../scripts/rerank.py');
const RERANKER_ENABLED = process.env.ENABLE_RERANKER === 'true';
const RERANKER_TIMEOUT = 5000;

let _python_available = null;

/* ─────────────────────────────────────────────────────────────
   2. AVAILABILITY CHECKS
──────────────────────────────────────────────────────────────── */

function is_python_available() {
  if (_python_available !== null) return _python_available;

  try {
    execSync('python3 -c "from sentence_transformers import CrossEncoder"', {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    _python_available = true;
  } catch {
    _python_available = false;
    console.warn('[reranker] Python cross-encoder not available. Reranking disabled.');
  }

  return _python_available;
}

function is_reranker_available() {
  return RERANKER_ENABLED && is_python_available();
}

/* ─────────────────────────────────────────────────────────────
   3. CORE FUNCTIONS
──────────────────────────────────────────────────────────────── */

function rerank_results(query, results, top_k = 5) {
  if (!RERANKER_ENABLED || results.length <= 1) {
    return results.slice(0, top_k);
  }

  if (!is_python_available()) {
    return results.slice(0, top_k);
  }

  try {
    const input = JSON.stringify({
      query,
      documents: results.map(r => ({
        id: r.id,
        text: `${r.title || ''} ${r.content || ''}`,
      })),
    });

    const output = execSync(
      `python3 "${RERANKER_SCRIPT}"`,
      { input, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024, timeout: RERANKER_TIMEOUT }
    );

    const scores = JSON.parse(output);

    return results
      .map((r, i) => ({ ...r, rerank_score: scores[i] }))
      .sort((a, b) => b.rerank_score - a.rerank_score)
      .slice(0, top_k);

  } catch (error) {
    console.warn(`[reranker] Failed, using original ranking: ${error.message}`);
    return results.slice(0, top_k);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  rerank_results,
  is_reranker_available,
  is_python_available,
  RERANKER_ENABLED,
};
