# Iteration 3: D1 Correctness — Circuit Breaker Accounting Under Throw Contract

## Focus
Examine how the circuit breaker interacts with the new throw contract. Previously, failures returned null, incrementing the failure counter and eventually opening the breaker. Now that failures throw, the interaction has changed.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 1
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.37

## Findings

### P1 — Required

- **F008**: Circuit breaker threshold of 3 consecutive failures may be too aggressive under the throw contract — `.opencode/skills/system-spec-kit/shared/embeddings.ts:55,90-100`. The `EMBEDDING_CB_THRESHOLD` defaults to 3 consecutive failures before opening. Under the old `return null` contract, a provider error incremented the failure counter and returned null — callers got null and continued with degraded search. Under the new `throw error` contract, a provider error still increments `recordEmbeddingFailure()` (called before `throw error` at lines 505, 671, 725), but now the caller must catch the throw. The circuit breaker opens after 3 consecutive failures (configurable via `SPECKIT_EMBEDDING_CB_THRESHOLD`). Once open, `isEmbeddingCircuitOpen()` returns true, and the three functions return null WITHOUT calling the provider — this is still correct behavior. However, the interaction path has changed: (1) Provider throws → `recordEmbeddingFailure()` increments counter → throw propagates to caller → caller may or may not retry. (2) After 3 such throws, circuit opens → subsequent calls return null immediately. The concern is that 3 consecutive throws from different concurrent calls could open the circuit breaker even if those calls are from different search requests with independent retry logic. For the MCP server (single-process), this is acceptable — the circuit breaker is process-wide and correctly prevents cascading failures. But the threshold documentation should note the interaction change.

  Claim adjudication packet:
  ```json
  {
    "findingId": "F008",
    "claim": "Circuit breaker threshold of 3 may be aggressive under throw contract but is not functionally broken.",
    "evidenceRefs": [".opencode/skills/system-spec-kit/shared/embeddings.ts:55", ".opencode/skills/system-spec-kit/shared/embeddings.ts:90-100"],
    "counterevidenceSought": "Checked if the circuit breaker opens prematurely during batch operations with mixed success/failure patterns.",
    "alternativeExplanation": "The threshold could be appropriate since there are now exactly 3 entry points (generateEmbedding, generateDocumentEmbedding, generateQueryEmbedding) that all increment the same counter.",
    "finalSeverity": "P1",
    "confidence": 0.72,
    "downgradeTrigger": "If concurrent search requests cannot trigger 3 independent failures fast enough to cause premature circuit opening, downgrade to P2 documentation advisory.",
    "transitions": [{"iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery — threshold interaction changed under throw contract"}]
  }
  ```

### P2 — Suggestion

- **F009**: `addTestables.resetForTesting()` added in the embeddings.ts diff exports `resetForTesting` and `setProviderForTesting` — `.opencode/skills/system-spec-kit/shared/embeddings.ts:945-963`. These are test-only utilities properly gated behind `__embeddingCircuitTestables`. The export is conditional (named export on a testables object). This is standard practice and not a security concern, but the `resetForTesting()` method resets the circuit breaker state, provider instance, and cache — if accidentally called in production, it would reset all state including the cache. The function name with `ForTesting` suffix makes this unlikely.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | embeddings.ts:55,90-100 |

## Assessment
- New findings ratio: 0.37
- Dimensions addressed: correctness
- Novelty justification: Circuit breaker interaction is a new correctness surface not examined in prior iterations.

## Ruled Out
- Concurrent batch + circuit breaker interaction: `generateBatchEmbeddings` still returns null entries when a batch fails. The circuit breaker counter increments on each failure, which is correct within a single batch.

## Recommended Next Focus
D2: Security review of modified code.