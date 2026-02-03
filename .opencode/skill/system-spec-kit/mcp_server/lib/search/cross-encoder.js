// ───────────────────────────────────────────────────────────────
// SEARCH: CROSS-ENCODER RERANKING
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');
const { ERROR_CODES, getRecoveryHint } = require('../errors/recovery-hints.js');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION

   REQ-013: Cross-Encoder Reranking
   REQ-008: Length Penalty for Short Content

   Features:
   - Configurable providers (Voyage rerank-2, Cohere, local)
   - Response caching with configurable TTL
   - Length penalty (0.8-1.0x) for short content (<100 chars)
   - Top-20 candidate limiting (R1 mitigation)
   - P95 latency monitoring with auto-disable
────────────────────────────────────────────────────────────────*/

const ENABLE_CROSS_ENCODER = process.env.ENABLE_CROSS_ENCODER === 'true';
const CROSS_ENCODER_PROVIDER = process.env.CROSS_ENCODER_PROVIDER || 'auto';
const MAX_RERANK_CANDIDATES = parseInt(process.env.MAX_RERANK_CANDIDATES || '20', 10);
const P95_LATENCY_THRESHOLD_MS = parseInt(process.env.RERANK_P95_THRESHOLD || '500', 10);

// REQ-008: Length penalty (0.8-1.0x) for short content (<100 chars)
const LENGTH_PENALTY = {
  threshold: 100,
  minPenalty: 0.8,
  maxPenalty: 1.0,
};

const CACHE_TTL_MS = parseInt(process.env.RERANK_CACHE_TTL || '300000', 10);
const CACHE_MAX_SIZE = parseInt(process.env.RERANK_CACHE_SIZE || '1000', 10);

const PROVIDER_CONFIG = {
  voyage: {
    name: 'Voyage rerank-2',
    model: 'rerank-2',
    endpoint: 'https://api.voyageai.com/v1/rerank',
    envKey: 'VOYAGE_API_KEY',
    timeout: 10000,
    maxDocuments: 100,
  },
  cohere: {
    name: 'Cohere Rerank',
    model: 'rerank-v3.5',
    endpoint: 'https://api.cohere.ai/v1/rerank',
    envKey: 'COHERE_API_KEY',
    timeout: 10000,
    maxDocuments: 100,
  },
  local: {
    name: 'Local Cross-Encoder',
    model: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
    pythonScript: true,
    timeout: 5000,
    maxDocuments: 50,
  },
};

/* ─────────────────────────────────────────────────────────────
   2. MODULE STATE
────────────────────────────────────────────────────────────────*/

const cache = new Map();
const latency_history = [];
const MAX_LATENCY_SAMPLES = 100;

let session_disabled = false;
let disable_reason = null;
let resolved_provider = null;
let provider_availability = null;

/* ─────────────────────────────────────────────────────────────
   3. PROVIDER AVAILABILITY CHECKS
────────────────────────────────────────────────────────────────*/

function is_voyage_available() {
  return !!process.env.VOYAGE_API_KEY;
}

function is_cohere_available() {
  return !!process.env.COHERE_API_KEY;
}

function is_local_available() {
  if (provider_availability !== null && provider_availability.local !== undefined) {
    return provider_availability.local;
  }

  try {
    const { execSync } = require('child_process');
    execSync('python3 -c "from sentence_transformers import CrossEncoder"', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (!provider_availability) provider_availability = {};
    provider_availability.local = true;
    return true;
  } catch {
    if (!provider_availability) provider_availability = {};
    provider_availability.local = false;
    return false;
  }
}

function resolve_provider() {
  if (resolved_provider !== null) {
    return resolved_provider;
  }

  const provider = CROSS_ENCODER_PROVIDER.toLowerCase();

  if (provider === 'voyage') {
    resolved_provider = is_voyage_available() ? 'voyage' : null;
  } else if (provider === 'cohere') {
    resolved_provider = is_cohere_available() ? 'cohere' : null;
  } else if (provider === 'local') {
    resolved_provider = is_local_available() ? 'local' : null;
  } else if (provider === 'auto') {
    if (is_voyage_available()) {
      resolved_provider = 'voyage';
    } else if (is_cohere_available()) {
      resolved_provider = 'cohere';
    } else if (is_local_available()) {
      resolved_provider = 'local';
    } else {
      resolved_provider = null;
    }
  } else {
    console.warn(`[cross-encoder] Unknown provider: ${provider}, using 'auto'`);
    return resolve_provider();
  }

  if (resolved_provider) {
    console.error(
      `[cross-encoder] Resolved provider: ${PROVIDER_CONFIG[resolved_provider]?.name || resolved_provider}`
    );
  } else {
    console.warn('[cross-encoder] No cross-encoder provider available');
  }

  return resolved_provider;
}

/* ─────────────────────────────────────────────────────────────
   4. LENGTH PENALTY
────────────────────────────────────────────────────────────────*/

function calculate_length_penalty(content) {
  if (!content || typeof content !== 'string') {
    return LENGTH_PENALTY.minPenalty;
  }

  const length = content.trim().length;

  if (length >= LENGTH_PENALTY.threshold) {
    return LENGTH_PENALTY.maxPenalty;
  }

  if (length === 0) {
    return LENGTH_PENALTY.minPenalty;
  }

  const ratio = length / LENGTH_PENALTY.threshold;
  return LENGTH_PENALTY.minPenalty +
         (LENGTH_PENALTY.maxPenalty - LENGTH_PENALTY.minPenalty) * ratio;
}

function apply_length_penalty(results) {
  return results.map(result => {
    const content = result.content || result.text || '';
    const penalty = calculate_length_penalty(content);

    return {
      ...result,
      rerank_score_raw: result.rerank_score,
      length_penalty: penalty,
      rerank_score: result.rerank_score * penalty,
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   5. CACHING
────────────────────────────────────────────────────────────────*/

function generate_cache_key(query, documents) {
  const doc_ids = documents.map(d => d.id || '').sort().join(',');
  const payload = `${query}|${doc_ids}`;
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

function get_cached_scores(key) {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  // Check expiration
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.scores;
}

function set_cached_scores(key, scores) {
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldest = [...cache.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, Math.floor(CACHE_MAX_SIZE * 0.1));

    for (const [oldKey] of oldest) {
      cache.delete(oldKey);
    }
  }

  cache.set(key, {
    scores,
    timestamp: Date.now(),
  });
}

function clear_cache() {
  cache.clear();
}

/* ─────────────────────────────────────────────────────────────
   6. LATENCY TRACKING
────────────────────────────────────────────────────────────────*/

function record_latency(latency_ms) {
  latency_history.push(latency_ms);

  if (latency_history.length > MAX_LATENCY_SAMPLES) {
    latency_history.shift();
  }

  if (latency_history.length >= 20) {
    const p95 = calculate_p95();

    if (p95 > P95_LATENCY_THRESHOLD_MS && !session_disabled) {
      session_disabled = true;
      disable_reason = `P95 latency ${p95}ms exceeds threshold ${P95_LATENCY_THRESHOLD_MS}ms`;
      console.warn(`[cross-encoder] Auto-disabled: ${disable_reason}`);
    }
  }
}

function calculate_p95() {
  if (latency_history.length === 0) {
    return 0;
  }

  const sorted = [...latency_history].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.95);
  return sorted[Math.min(index, sorted.length - 1)];
}

function get_latency_stats() {
  if (latency_history.length === 0) {
    return { p50: 0, p95: 0, p99: 0, samples: 0 };
  }

  const sorted = [...latency_history].sort((a, b) => a - b);
  const len = sorted.length;

  return {
    p50: sorted[Math.floor(len * 0.50)],
    p95: sorted[Math.floor(len * 0.95)],
    p99: sorted[Math.floor(len * 0.99)],
    samples: len,
    session_disabled,
    disable_reason,
  };
}

/* ─────────────────────────────────────────────────────────────
   7. PROVIDER IMPLEMENTATIONS
────────────────────────────────────────────────────────────────*/

async function rerank_voyage(query, documents) {
  const config = PROVIDER_CONFIG.voyage;
  const api_key = process.env.VOYAGE_API_KEY;

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      model: config.model,
      query: query,
      documents: documents.map(d => d.text || d.content || ''),
      return_documents: false,
    }),
    signal: AbortSignal.timeout(config.timeout),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage rerank failed: ${response.status} - ${error}`);
  }

  const result = await response.json();

  const scores = new Array(documents.length).fill(0);

  if (result.data) {
    for (const item of result.data) {
      scores[item.index] = item.relevance_score;
    }
  }

  return scores;
}

async function rerank_cohere(query, documents) {
  const config = PROVIDER_CONFIG.cohere;
  const api_key = process.env.COHERE_API_KEY;

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      model: config.model,
      query: query,
      documents: documents.map(d => d.text || d.content || ''),
      return_documents: false,
    }),
    signal: AbortSignal.timeout(config.timeout),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cohere rerank failed: ${response.status} - ${error}`);
  }

  const result = await response.json();

  const scores = new Array(documents.length).fill(0);

  if (result.results) {
    for (const item of result.results) {
      scores[item.index] = item.relevance_score;
    }
  }

  return scores;
}

async function rerank_local(query, documents) {
  const { execSync } = require('child_process');
  const path = require('path');

  const config = PROVIDER_CONFIG.local;
  // NOTE: rerank.py does not exist - local Python reranker is unimplemented.
  // This function will throw an error if called. Use API providers instead.
  const script_path = path.join(__dirname, '../scripts/rerank.py');

  const input = JSON.stringify({
    query,
    documents: documents.map(d => ({
      id: d.id,
      text: d.text || d.content || '',
    })),
    model: config.model,
  });

  try {
    const output = execSync(
      `python3 "${script_path}"`,
      {
        input,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: config.timeout,
      }
    );

    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Local rerank failed: ${error.message}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. CORE RERANKING FUNCTION
────────────────────────────────────────────────────────────────*/

async function rerank_results(query, results, options = {}) {
  const {
    rerank = true,
    topK = 10,
    maxCandidates = MAX_RERANK_CANDIDATES,
    applyLengthPenalty = true,
    useCache = true,
  } = options;

  const metadata = {
    reranking_enabled: ENABLE_CROSS_ENCODER,
    reranking_requested: rerank,
    reranking_applied: false,
    provider: null,
    latency_ms: null,
    cache_hit: false,
    length_penalty_applied: false,
    candidates_evaluated: 0,
    session_disabled: session_disabled,
  };

  if (!ENABLE_CROSS_ENCODER || !rerank) {
    return {
      results: results.slice(0, topK),
      metadata,
    };
  }

  if (session_disabled) {
    metadata.disable_reason = disable_reason;
    return {
      results: results.slice(0, topK),
      metadata,
    };
  }

  const provider = resolve_provider();
  if (!provider) {
    metadata.disable_reason = 'No cross-encoder provider available';
    return {
      results: results.slice(0, topK),
      metadata,
    };
  }
  metadata.provider = PROVIDER_CONFIG[provider]?.name || provider;

  const candidates = results.slice(0, Math.min(results.length, maxCandidates));
  metadata.candidates_evaluated = candidates.length;

  if (candidates.length <= 1) {
    return {
      results: candidates.slice(0, topK),
      metadata,
    };
  }

  const documents = candidates.map(r => ({
    id: r.id,
    text: `${r.title || ''} ${r.content || ''}`.trim(),
    content: r.content || '',
  }));

  const cache_key = useCache ? generate_cache_key(query, documents) : null;

  if (cache_key) {
    const cached_scores = get_cached_scores(cache_key);
    if (cached_scores) {
      metadata.cache_hit = true;
      metadata.reranking_applied = true;

      const reranked = apply_cached_scores(candidates, cached_scores, applyLengthPenalty);
      metadata.length_penalty_applied = applyLengthPenalty;

      return {
        results: reranked.slice(0, topK),
        metadata,
      };
    }
  }

  const start_time = Date.now();

  try {
    let scores;

    if (provider === 'voyage') {
      scores = await rerank_voyage(query, documents);
    } else if (provider === 'cohere') {
      scores = await rerank_cohere(query, documents);
    } else if (provider === 'local') {
      scores = await rerank_local(query, documents);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const latency_ms = Date.now() - start_time;
    metadata.latency_ms = latency_ms;
    record_latency(latency_ms);

    if (cache_key) {
      set_cached_scores(cache_key, scores);
    }

    let reranked = candidates.map((r, i) => ({
      ...r,
      rerank_score: scores[i] || 0,
    }));

    if (applyLengthPenalty) {
      reranked = apply_length_penalty(reranked);
      metadata.length_penalty_applied = true;
    }

    reranked.sort((a, b) => b.rerank_score - a.rerank_score);

    metadata.reranking_applied = true;

    return {
      results: reranked.slice(0, topK),
      metadata,
    };

  } catch (error) {
    const latency_ms = Date.now() - start_time;
    metadata.latency_ms = latency_ms;
    metadata.error = error.message;

    console.warn(`[cross-encoder] Reranking failed: ${error.message}`);

    return {
      results: results.slice(0, topK),
      metadata,
    };
  }
}

function apply_cached_scores(candidates, scores, applyLengthPenalty) {
  let reranked = candidates.map((r, i) => ({
    ...r,
    rerank_score: scores[i] || 0,
  }));

  if (applyLengthPenalty) {
    reranked = apply_length_penalty(reranked);
  }

  return reranked.sort((a, b) => b.rerank_score - a.rerank_score);
}

/* ─────────────────────────────────────────────────────────────
   9. STATUS AND CONFIGURATION
────────────────────────────────────────────────────────────────*/

function is_reranker_available() {
  if (!ENABLE_CROSS_ENCODER) {
    return false;
  }

  if (session_disabled) {
    return false;
  }

  return resolve_provider() !== null;
}

function get_reranker_status() {
  const provider = resolve_provider();

  return {
    enabled: ENABLE_CROSS_ENCODER,
    available: is_reranker_available(),
    provider: provider ? PROVIDER_CONFIG[provider]?.name || provider : null,
    providerConfig: provider ? PROVIDER_CONFIG[provider] : null,
    maxCandidates: MAX_RERANK_CANDIDATES,
    p95Threshold: P95_LATENCY_THRESHOLD_MS,
    lengthPenalty: LENGTH_PENALTY,
    cacheStats: {
      size: cache.size,
      maxSize: CACHE_MAX_SIZE,
      ttlMs: CACHE_TTL_MS,
    },
    latencyStats: get_latency_stats(),
    provider_availability: {
      voyage: is_voyage_available(),
      cohere: is_cohere_available(),
      local: provider_availability?.local ?? 'unknown',
    },
    session_disabled,
    disable_reason,
  };
}

function reset_session() {
  latency_history.length = 0;
  session_disabled = false;
  disable_reason = null;
}

function reset_provider() {
  resolved_provider = null;
  provider_availability = null;
}

/* ─────────────────────────────────────────────────────────────
   10. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core function
  rerank_results,

  // Length penalty
  calculate_length_penalty,
  apply_length_penalty,

  // Cache management
  clear_cache,

  // Status and configuration
  is_reranker_available,
  get_reranker_status,
  get_latency_stats,
  reset_session,
  reset_provider,

  // Provider checks (for testing)
  is_voyage_available,
  is_cohere_available,
  is_local_available,
  resolve_provider,

  // Configuration constants
  ENABLE_CROSS_ENCODER,
  CROSS_ENCODER_PROVIDER,
  MAX_RERANK_CANDIDATES,
  P95_LATENCY_THRESHOLD_MS,
  LENGTH_PENALTY,
  CACHE_TTL_MS,
  PROVIDER_CONFIG,
};
