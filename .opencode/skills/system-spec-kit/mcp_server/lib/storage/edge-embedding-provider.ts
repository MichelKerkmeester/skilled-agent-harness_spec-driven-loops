// ───────────────────────────────────────────────────────────────
// MODULE: Edge Embedding Provider
// ───────────────────────────────────────────────────────────────
// Bridges the daemon's async embedder to the synchronous EdgeEmbeddingProvider
// contract consumed by runSemanticEdgeEmbeddingPass.
//
// The consolidation pass calls provider.embedEdgeText(text) synchronously inside
// a write-lock-bounded loop, but every real embedder in this codebase is async
// (Promise<Float32Array | null>). Rather than make the consolidation loop async —
// which would force every save-time caller onto an await path it deliberately
// avoids — the batch maintenance pass pre-computes the embeddings off the hot
// path and hands the consolidation loop a provider that is a pure synchronous
// map lookup. The async work happens once, ahead of time; the sync contract the
// loop relies on stays intact.

export interface PrecomputedEdgeEmbeddingProvider {
  embedEdgeText(text: string): Float32Array | null;
  modelId: string;
  profileKey: string;
}

/**
 * Build a synchronous edge-embedding provider from a precomputed text→vector
 * map. The maintenance pass embeds each distinct fact_text once (async), then
 * the consolidation loop resolves each row's vector by exact-text lookup with no
 * I/O. A miss returns null, which runSemanticEdgeEmbeddingPass already treats as
 * a skip rather than a failure.
 */
export function createPrecomputedEdgeEmbeddingProvider(
  embeddings: ReadonlyMap<string, Float32Array>,
  identity: { modelId: string; profileKey: string },
): PrecomputedEdgeEmbeddingProvider {
  return {
    modelId: identity.modelId,
    profileKey: identity.profileKey,
    embedEdgeText(text: string): Float32Array | null {
      const key = text.trim();
      if (key.length === 0) {
        return null;
      }
      return embeddings.get(key) ?? null;
    },
  };
}
