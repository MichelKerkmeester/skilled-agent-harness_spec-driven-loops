# Iteration 013 — CORRECTNESS (adversarial boundary pass)

## P0 Findings

### P0-1: Indefinite hang on network timeout in reindex embed call
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:282`
- **Issue:** `await adapter.embed(rows.map(memoryText))` has no timeout wrapper. If the embedder backend hangs or network is slow, the reindex job will hang indefinitely with no way to recover.
- **Repro:** Start a reindex job, then block the embedder backend (e.g., firewall rule, process pause). The job will never complete or fail.
- **Recommendation:** Wrap adapter.embed() with a timeout (e.g., 30-60s) and fail the job with a clear error message on timeout.

### P0-2: No transaction rollback on partial vector write failure
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:287`
- **Issue:** `writeVectors()` uses a transaction (line 222) but if the transaction fails partway through, there's no explicit rollback handling. The catch block at line 302 will mark the job as failed, but partial data may remain in the target table.
- **Repro:** Trigger a database constraint violation or disk full error during writeVectors(). Some vectors may be written before failure, leaving the target table in an inconsistent state.
- **Recommendation:** Ensure writeVectors transaction is atomic (it is via db.transaction), but verify that any partial writes are rolled back. Consider using a temporary table and atomic swap on completion.

### P0-3: Division by zero produces NaN in lexical score
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:190`
- **Issue:** `const tokenCoverage = focused.length > 0 ? matched.length / focused.length : 0;` guards against division by zero, but if `focused` array is empty, downstream calculations may still produce NaN if other divisions occur. At line 200, the score calculation uses `tokenCoverage * 0.58` which would be 0, but if other components have NaN, the final score becomes NaN.
- **Repro:** Call `lexicalScore()` with a query that produces no important tokens (e.g., "a an the"). The `focused` array will be empty, and if any downstream division uses zero denominator, score becomes NaN.
- **Recommendation:** Add explicit NaN guards after score calculation: `if (Number.isNaN(score)) score = 0;` or validate all inputs before division.

## P1 Findings

### P1-1: No fetch timeout in Ollama HTTP requests
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:265`
- **Issue:** `fetch()` call in `postJson()` has no timeout option. If the Ollama backend hangs, the request will wait indefinitely.
- **Repro:** Start Ollama, then pause the process or block the port. The fetch will hang forever.
- **Recommendation:** Add AbortController with timeout (e.g., 30s) to all fetch calls.

### P1-2: Silent data loss on malformed Ollama response body
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:122`
- **Issue:** `parseEmbeddingRows()` returns empty array `[]` on malformed body instead of throwing an error. This can cause silent data loss if Ollama returns unexpected JSON structure.
- **Repro:** Configure Ollama to return malformed JSON (e.g., via proxy or mock). The embed() call will succeed but return empty embeddings, causing the caller to receive fewer embeddings than expected.
- **Recommendation:** Throw an error when body structure is invalid, or at minimum log a warning when returning empty array for non-empty input.

### P1-3: Cancellation check doesn't abort in-flight embed call
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:273`
- **Issue:** Cancellation check `if (getCancellationStatus(db, jobId) === 'cancelled')` occurs before the embed call, but once `await adapter.embed()` starts, it cannot be aborted. The job will continue processing even if cancelled mid-batch.
- **Repro:** Start a reindex job, then immediately cancel it. The current batch will still complete embedding before cancellation takes effect.
- **Recommendation:** Use AbortController with the embed call if the adapter supports it, or check cancellation status more frequently within the batch loop.

## P2 Findings

### P2-1: No NaN/Infinity validation in Ollama vector conversion
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:288`
- **Issue:** `toVector()` validates dimension but doesn't check for NaN or Infinity values in the number array before creating Float32Array. Invalid values will propagate to the database.
- **Repro:** If Ollama returns a vector with NaN or Infinity (due to model bug or numerical instability), these values will be stored in the database and may cause issues in similarity search.
- **Recommendation:** Add validation: `if (!row.every(v => Number.isFinite(v))) throw new OllamaAdapterError('Vector contains NaN or Infinity');`

### P2-2: Silent SQL error hides schema issues in lexical backfill
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:281`
- **Issue:** `fetchLexicalBackfillRows()` has a try/catch at line 281 that returns empty array on SQL error. This hides potential schema issues or missing columns.
- **Repro:** If the memory_index table schema changes (e.g., column renamed), the SQL query will fail silently and return no results, masking the schema problem.
- **Recommendation:** Log the error before returning empty array, or propagate the error to the caller for proper handling.

## Summary

**P0:** 3 findings (critical correctness failures)
**P1:** 3 findings (significant robustness gaps)
**P2:** 2 findings (minor validation issues)

Total: 8 findings
