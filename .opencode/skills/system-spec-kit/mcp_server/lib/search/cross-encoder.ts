// ───────────────────────────────────────────────────────────────
// MODULE: Cross Encoder
// ───────────────────────────────────────────────────────────────
// Feature catalog: positional fallback reranking
//
// Neural reranker providers have been removed. The module now returns a
// positional fallback (scored 0-0.5) and marks results with
// scoringMethod:'fallback' so callers keep receiving valid scored rows.
/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
----------------------------------------------------------------*/

interface ProviderConfigEntry {
  name: string;
  model: string;
  maxDocuments: number;
  timeout: number;
}

const PROVIDER_CONFIG: Record<string, ProviderConfigEntry> = {} as const;

const LENGTH_PENALTY = {
  shortThreshold: 50,
  longThreshold: 2000,
  shortPenalty: 1.0,
  longPenalty: 1.0,
} as const;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface RerankDocument {
  id: number | string;
  content: string;
  title?: string;
  [key: string]: unknown;
}

interface RerankResult {
  id: number | string;
  score: number;
  originalRank: number;
  rerankerScore: number;
  provider: string;
  /**
   * P3-16: Discriminator for score origin.
   *   'cross-encoder'      — score from a neural reranker provider
   *   'cross-encoder-tail' — F-011-C1-03: candidate fell outside the provider
   *                          maxDocuments window; original ordering preserved,
   *                          synthetic positional score appended after the
   *                          reranked head
   *   'fallback'           — synthetic positional score (0–0.5) when no provider is available
   */
  scoringMethod: 'cross-encoder' | 'cross-encoder-tail' | 'fallback';
  [key: string]: unknown;
}

interface RerankerStatus {
  available: boolean;
  provider: string | null;
  model: string | null;
  latency: {
    avg: number;
    p95: number;
    count: number;
  };
  cache: {
    hits: number;
    misses: number;
    staleHits: number;
    evictions: number;
    entries: number;
    maxEntries: number;
    ttlMs: number;
  };
}

type CacheKeyDocumentInput = RerankDocument | number | string;

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

const cache = new Map<string, { results: RerankResult[]; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes
const MAX_CACHE_ENTRIES = 200;
const cacheTelemetry = {
  hits: 0,
  misses: 0,
  staleHits: 0,
  evictions: 0,
};

/**
 * Phase C: Enforce cache size bound.
 * Follows the enforceCacheBound() pattern from graph-signals.ts.
 * When the cache exceeds MAX_CACHE_ENTRIES, evicts the oldest entry
 * by timestamp to prevent unbounded memory growth.
 */
function enforceCacheBound(): void {
  if (cache.size <= MAX_CACHE_ENTRIES) return;
  let oldestKey: string | null = null;
  let oldestTime = Infinity;
  for (const [key, entry] of cache) {
    if (entry.timestamp < oldestTime) {
      oldestTime = entry.timestamp;
      oldestKey = key;
    }
  }
  if (oldestKey) {
    cache.delete(oldestKey);
    cacheTelemetry.evictions++;
  }
}

const latencyTracker: { durations: number[] } = { durations: [] };
const MAX_LATENCY_SAMPLES = 100;

// T3-15 circuit breaker — retained for test harness compatibility. With no
// configured provider, callers return positional fallback before this is used.
const CIRCUIT_FAILURE_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 60_000; // 1 minute

interface CircuitState {
  failures: number;
  openedAt: number | null;
}

const circuitBreakers = new Map<string, CircuitState>();

function getCircuit(provider: string): CircuitState {
  let state = circuitBreakers.get(provider);
  if (!state) {
    state = { failures: 0, openedAt: null };
    circuitBreakers.set(provider, state);
  }
  return state;
}

function isCircuitOpen(provider: string): boolean {
  const state = getCircuit(provider);
  if (state.openedAt === null) return false;
  if (Date.now() - state.openedAt >= CIRCUIT_COOLDOWN_MS) {
    // Cooldown elapsed — half-open: allow one attempt
    state.openedAt = null;
    state.failures = 0;
    return false;
  }
  return true;
}

function recordSuccess(provider: string): void {
  const state = getCircuit(provider);
  state.failures = 0;
  state.openedAt = null;
}

function recordFailure(provider: string): void {
  const state = getCircuit(provider);
  state.failures++;
  if (state.failures >= CIRCUIT_FAILURE_THRESHOLD) {
    state.openedAt = Date.now();
    console.warn(`[cross-encoder] Circuit breaker OPEN for ${provider} after ${state.failures} consecutive failures. Cooldown: ${CIRCUIT_COOLDOWN_MS}ms`);
  }
}

/* ───────────────────────────────────────────────────────────────
   4. PROVIDER RESOLUTION
----------------------------------------------------------------*/

function resolveProvider(): string | null {
  return null;
}

/* ───────────────────────────────────────────────────────────────
   5. LENGTH PENALTY
----------------------------------------------------------------*/

function calculateLengthPenalty(contentLength: number): number {
  void contentLength;
  return 1.0;
}

function applyLengthPenalty(
  results: RerankResult[]
): RerankResult[] {
  // Length penalty removed - in an embedded RAG system, penalizing docs for natural size is counterproductive (78.6% of spec docs exceed 2000 chars)
  return [...results];
}

/* ───────────────────────────────────────────────────────────────
   6. CACHE
----------------------------------------------------------------*/

// H19 FIX: Include provider and option bits in the cache key while
// canonicalizing document identity so equivalent document sets hit the same cache entry.
function generateCacheKey(
  query: string,
  documents: CacheKeyDocumentInput[],
  provider?: string,
  optionBits?: string,
): string {
  void optionBits;
  const sortedDocuments = [...documents]
    .map(document => {
      if (typeof document === 'object' && document !== null && 'id' in document) {
        return `${String(document.id)}:${hashString(document.content)}`;
      }
      return String(document);
    })
    .sort();
  const key = `${provider || 'default'}:${query}:${sortedDocuments.join(',')}`;
  return `rerank-${hashString(key)}`;
}

function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/* ───────────────────────────────────────────────────────────────
   8. MAIN RERANK FUNCTION
----------------------------------------------------------------*/

async function rerankResults(
  query: string,
  documents: RerankDocument[],
  options: { limit?: number; useCache?: boolean; applyLengthPenalty?: boolean } = {}
): Promise<RerankResult[]> {
  const { limit = 10, useCache = true, applyLengthPenalty: shouldApplyLengthPenalty = true } = options;

  if (!documents || documents.length === 0) return [];

  void query;
  void useCache;
  void shouldApplyLengthPenalty;

  // No reranker provider remains. Preserve the D1 invariant: callers still get
  // deterministic scored rows instead of an exception, hang, or empty result.
  return documents.slice(0, limit).map((d, i) => ({
    ...d,
    rerankerScore: 0.5 - (i / (documents.length * 2)),
    score: 0.5 - (i / (documents.length * 2)),
    originalRank: i,
    provider: 'none',
    scoringMethod: 'fallback' as const,
  }));
}

/* ───────────────────────────────────────────────────────────────
   9. STATUS & CLEANUP
----------------------------------------------------------------*/

function isRerankerAvailable(): boolean {
  return resolveProvider() !== null;
}

function getRerankerStatus(): RerankerStatus {
  const provider = resolveProvider();
  const durations = latencyTracker.durations;

  let avg = 0;
  let p95 = 0;

  if (durations.length > 0) {
    avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const sorted = [...durations].sort((a, b) => a - b);
    // L3 FIX: Correct p95 percentile index with bounds clamping
    p95 = sorted[Math.min(Math.ceil(sorted.length * 0.95) - 1, sorted.length - 1)] || 0;
  }

  return {
    available: provider !== null,
    provider,
    model: provider ? PROVIDER_CONFIG[provider]?.model || null : null,
    latency: {
      avg: Math.round(avg),
      p95: Math.round(p95),
      count: durations.length,
    },
    cache: {
      hits: cacheTelemetry.hits,
      misses: cacheTelemetry.misses,
      staleHits: cacheTelemetry.staleHits,
      evictions: cacheTelemetry.evictions,
      entries: cache.size,
      maxEntries: MAX_CACHE_ENTRIES,
      ttlMs: CACHE_TTL,
    },
  };
}

function resetSession(): void {
  cache.clear();
  cacheTelemetry.hits = 0;
  cacheTelemetry.misses = 0;
  cacheTelemetry.staleHits = 0;
  cacheTelemetry.evictions = 0;
  latencyTracker.durations = [];
  circuitBreakers.clear();
}

function resetProvider(): void {
  // No-op: provider cache removed (was never populated)
}

/* ───────────────────────────────────────────────────────────────
   10. EXPORTS
----------------------------------------------------------------*/

export {
  PROVIDER_CONFIG,
  LENGTH_PENALTY,

  // Provider
  resolveProvider,
  calculateLengthPenalty,
  applyLengthPenalty,
  generateCacheKey,

  // Reranking
  rerankResults,

  // Status
  isRerankerAvailable,
  getRerankerStatus,
  resetSession,
  resetProvider,
};

export type {
  RerankDocument,
  RerankResult,
  RerankerStatus,
  ProviderConfigEntry,
};

/**
 * G3: Internal circuit breaker functions exposed for unit testing.
 * Not intended for production use outside the test harness.
 */
export const __testables = {
  getCircuit,
  isCircuitOpen,
  recordSuccess,
  recordFailure,
  circuitBreakers,
  CIRCUIT_FAILURE_THRESHOLD,
  CIRCUIT_COOLDOWN_MS,
  enforceCacheBound,
  MAX_CACHE_ENTRIES,
  cache,
};
