# Iteration 1: D1 Correctness — Throw vs. Null Contract Audit

## Focus
Correctness of the throw vs. null contract change in `shared/embeddings.ts` (Bug A, commit 534563fb2). Systematic audit of all callers to verify error propagation reaches the right error handler.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1 — Required

- **F001**: Reconsolidation-bridge:643 passthrough lacks explicit try/catch when `generateDocumentEmbedding` now throws — `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:642-644`. The `generateEmbedding` callback passes `embeddings.generateDocumentEmbedding(content)` directly. The task description claims "executeMerge already catches callback failures," but the `executeMerge` function in reconsolidation-bridge does NOT wrap `generateEmbedding` callbacks in try/catch — the burden falls on the caller. Since `generateDocumentEmbedding` now throws on provider errors (instead of returning null), any reconsolidation path that calls `generateEmbedding` will now propagate a thrown Error instead of silently returning null. The `similarityFailureMessage` path (line 648 onward) handles this gracefully because `executeSearch` would catch and produce a failure message, but a direct throw from the embedding call could escape if `similarityPromise` (line 643) is not awaited within a try/catch. Evidence: reconsolidation-bridge.ts:642-644 passes the function reference without wrapping. The existing test suite (reconsolidation-bridge.vitest.ts:25) mocks `generateDocumentEmbedding`, so production behavior is untested for thrown errors.

- **F002**: `stage1-candidate-gen.ts:541-557` top-level catch returns empty candidates on ANY throw from executeStage1Core — `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:543-557`. This is intentional and correct as a degraded-null fallback. However, the catch block swallows ALL error types uniformly, returning `metadata.candidateCount: 0`. If the throw comes from a provider error that previously would have returned null (and the circuit breaker would open), the error message is only `console.warn`-ed. There is no propagation of the error type to the caller or to the search metadata. This means that `failure_reason` in the database cannot be populated by this path — the error context is lost at stage 1. The retry-manager path (which does write `failure_reason`) is separate and does benefit from the thrown error.

### P2 — Suggestion

- **F003**: `generateBatchEmbeddings` retains `null[]` semantics — `.opencode/skills/system-spec-kit/shared/embeddings.ts:582-602`. This is by design (documented in the task spec), creating an asymmetry where single-item functions throw but batch returns nulls. While correct, the behavioral contract difference is not documented in JSDoc or code comments, which increases the risk of future callers making wrong assumptions.

- **F004**: `batchErrorCount` only logged when `verbose` is true — `.opencode/skills/system-spec-kit/shared/embeddings.ts:619-621`. In production (verbose=false), batch errors are silently counted with `batchErrorCount` but never reported. This reduces observability in production embedding failures.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | embeddings.ts:504-509,671-674,725-728 | Throw contract matches spec change. Reconsolidation-bridge passthrough is the gap. |

## Assessment
- New findings ratio: 0.55 (high — first iteration, many new findings)
- Dimensions addressed: correctness
- Novelty justification: All findings are newly discovered in this iteration.

## Ruled Out
- `eval-reporting.ts:83-91` and `run-ablation.ts:141-146`: Both wrap `generateQueryEmbedding` in try/catch returning null. Correct degradation wrapper.

## Dead Ends
- None.

## Recommended Next Focus
D1 continued: Tokenizer API correctness and BOS/EOS overhead in llama-cpp.ts.