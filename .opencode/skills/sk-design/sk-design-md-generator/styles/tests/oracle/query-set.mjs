// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Fixed Oracle Query Matrix                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// A frozen matrix of retrieval requests that exercises each ranking path the
// differential oracle must pin: structured-only, lexical FTS, facet filtering,
// exclusions, vector-only, hybrid, channel-local degradation, exact-reuse
// rights, and cursor pagination. The embedder is deterministic so the vector
// lane reproduces byte-for-byte without a real embedding model.

export const ORACLE_VECTOR_PROFILE = Object.freeze({
  id: 'style-default-v1',
  provider: 'external',
  model: 'configured',
  dimensions: 2,
  configHash: 'style-default-v1',
});

/**
 * Deterministically embed document text into a fixed two-dimensional vector.
 *
 * @param {string} text - Document text passed by the vector drain.
 * @returns {number[]} A stable unit-basis vector.
 */
export function oracleEmbedder(text) {
  return text.includes('Alpha Editorial') ? [1, 0] : [0, 1];
}

export const ORACLE_QUERY_SET = Object.freeze([
  { name: 'structured-only', request: { text: '', requiredFacets: [] } },
  { name: 'fts-text', request: { text: 'editorial serif' } },
  { name: 'facet-filter', request: { text: 'motion animation transition kinetic', requiredFacets: ['warm-surface'] } },
  { name: 'exclusions', request: { text: 'editorial serif interface', exclusions: ['motion'] } },
  { name: 'vector-only', request: { queryVector: [1, 0], vectorProfile: 'style-default-v1', disableFts: true } },
  { name: 'hybrid', request: { text: 'editorial serif', queryVector: [1, 0], vectorProfile: 'style-default-v1' } },
  { name: 'degraded-disable-fts', request: { text: 'editorial serif', disableFts: true } },
  { name: 'exact-reuse', request: { text: 'editorial', usage: 'exact-reuse' } },
  {
    name: 'paged',
    request: { text: 'style reference', limit: 1 },
    follow: (result) => ({ text: 'style reference', limit: 1, cursor: result.nextCursor }),
  },
]);
