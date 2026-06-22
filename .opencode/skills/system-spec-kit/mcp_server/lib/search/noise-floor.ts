// ───────────────────────────────────────────────────────────────
// MODULE: Corpus Noise-Floor
// ───────────────────────────────────────────────────────────────
// The background absolute-relevance (cosine) a structurally-absent, off-corpus
// term still earns from the active embedder. Subtracting this floor before the
// request-quality band read stops a fluent-but-unrelated hit from inflating the
// verdict, since its score is mostly background, not real overlap.
//
// The floor is embedder-specific: the background cosine distribution differs by
// model, so a floor measured on one embedder is meaningless on another. The map
// is therefore keyed by the embedder the floor was measured against, and a key
// with no measured floor resolves to null so the caller fails closed to the raw
// relevance band rather than subtracting an unknown value.

/**
 * Measured corpus noise-floor per embedder. The key records the embedder the
 * floor was measured against. The nomic value is the background cosine an
 * off-corpus absent-term query (kubernetes, terraform, oauth, kafka) earns
 * against the local-first default embedder, the model the benchmarked
 * off-corpus false-positive was scored on.
 */
export const NOISE_FLOOR_BY_EMBEDDER: Readonly<Record<string, number>> = Object.freeze({
  'nomic-embed-text-v1.5': 0.15,
});

/**
 * The local-first default embedder (cascade head). Used as the resolution target
 * when no explicit embedder is supplied, so a graduated noise-floor flag subtracts
 * the floor measured against the model the steady-state local setup runs.
 */
export const DEFAULT_NOISE_FLOOR_EMBEDDER = 'nomic-embed-text-v1.5';

/** The floor a measurement resolves to, with the embedder it was measured against. */
export interface ResolvedNoiseFloor {
  embedder: string;
  floor: number;
}

/**
 * Resolve the measured noise-floor for an embedder, or null when none is
 * recorded. A null result is the fail-closed signal: the caller bands on the raw
 * relevance rather than subtracting an unknown floor. The returned object records
 * the embedder so a downstream report can name what the floor was measured on.
 */
export function resolveNoiseFloor(embedder?: string): ResolvedNoiseFloor | null {
  const id = typeof embedder === 'string' && embedder.trim().length > 0
    ? embedder.trim()
    : DEFAULT_NOISE_FLOOR_EMBEDDER;
  const floor = NOISE_FLOOR_BY_EMBEDDER[id];
  if (typeof floor !== 'number' || !Number.isFinite(floor) || floor < 0) {
    return null;
  }
  return { embedder: id, floor };
}
