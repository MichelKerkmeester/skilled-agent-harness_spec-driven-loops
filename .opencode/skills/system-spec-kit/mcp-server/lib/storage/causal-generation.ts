// ───────────────────────────────────────────────────────────────
// MODULE: Causal Edges Generation Counter
// ───────────────────────────────────────────────────────────────
// Process-local monotonic counter that participates in cache keys (e.g.
// memory_search with causal boost) so any causal-edge mutation makes prior
// cache entries stale without a wholesale tool-cache invalidation. Lives in
// its own module because both the edge store and the tombstone sweep must
// bump it, and they import each other.

let causalEdgesGeneration = 0;

function bumpCausalEdgesGeneration(): void {
  // Wrap near MAX_SAFE_INTEGER to avoid overflow in ultra-long-lived
  // processes; consumers only compare for inequality, so wrapping is safe.
  causalEdgesGeneration = causalEdgesGeneration >= Number.MAX_SAFE_INTEGER
    ? 1
    : causalEdgesGeneration + 1;
}

function getCausalEdgesGeneration(): number {
  return causalEdgesGeneration;
}

export { bumpCausalEdgesGeneration, getCausalEdgesGeneration };
