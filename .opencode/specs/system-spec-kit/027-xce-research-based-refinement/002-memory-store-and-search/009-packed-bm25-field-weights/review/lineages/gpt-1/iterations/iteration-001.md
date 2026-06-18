# Iteration 001 - Correctness

## Focus
Review the packed BM25 production warmup path against the requirement that mutable construction arrays are cleared after finalization.

## Finding GPT1-F001
Severity: P0

Category: correctness

Finding class: production-warmup-finalization

`rebuildFromDatabase()` drains `pendingIds` in batches. It calls `finalizePackedPostings()` only when a later callback starts and `batchIds.length === 0` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604]. When the final non-empty batch runs, it syncs rows and then takes the `else` branch that sets `warmupHandle = null` without finalizing [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:613], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:616]. The finalizer is the code path that walks dirty terms and clears `packedMutablePostings` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:510], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:518].

Impact: production async warmup can finish with mutable postings still resident, so the shipped packed engine does not reliably achieve the memory-bounded post-warmup state described by the packet.

## Adversarial Self-Check
Hunter: The branch condition is deterministic; no subsequent scheduled callback exists after the last non-empty batch.

Skeptic: Search lazily compacts dirty terms, so queried terms may eventually pack.

Referee: Lazy compaction does not satisfy the warmup completion claim because unqueried terms remain mutable indefinitely. P0 stands.

## Delta
New findings: 1 P0, 0 P1, 0 P2.

Review verdict: FAIL
