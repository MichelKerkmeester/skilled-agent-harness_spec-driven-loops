# Iteration 019 — TRACEABILITY (testability + diagnostic depth)

## P0

### P0-1: Missing test for adapter HTTP error handling in reindex flow
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:282`
- **Issue:** The `runJob` function calls `adapter.embed()` at line 282 but only validates cardinality (line 283-285). There is no test coverage for HTTP errors (timeouts, 500 errors, rate limits, malformed responses) from the embedder adapter. When the adapter throws a network error, it will be caught by the catch block (line 302-305) but this error path is untested.
- **Repro:** No test scenario exists where `adapter.embed()` throws an HTTPError or times out. The test suite for reindex.ts is missing entirely - only dist-freshness tests exist for the build artifacts.
- **Recommendation:** Create a new test file `reindex.test.ts` that mocks `getAdapter()` to return an adapter that throws HTTP errors. Verify that: (1) the job status transitions to 'failed', (2) the error message is persisted, (3) processed count is preserved, (4) setActiveEmbedder is NOT called on failure.

### P0-2: Missing test for rescue layer trigger conditions
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:17-24`
- **Issue:** The dist-freshness test verifies that rescue layer markers exist (`SPECKIT_RERANK_LAYER`, `applyRetrievalRescueLayer`, `isRetrievalRescueEnabled`) but there are no behavioral tests for when the rescue layer actually triggers. The rescue layer is a critical fallback mechanism (referenced in stage2-fusion.ts:24) but its trigger conditions are untested.
- **Repro:** No test scenario exists that: (1) triggers the rescue layer with low-confidence retrieval results, (2) verifies that `isRetrievalRescueEnabled` correctly enables/disables the layer, (3) confirms that the rescue layer actually modifies results when triggered.
- **Recommendation:** Create behavioral tests for the rescue layer in a new test file (e.g., `rescue-layer.test.ts`). Mock retrieval results with varying confidence scores and verify: (1) rescue layer triggers only when confidence is below threshold, (2) rescue results are blended correctly, (3) the layer respects the enable/disable flag.

### P0-3: Missing test for concurrent reindex job guard
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:88,242-250`
- **Issue:** The `runningJobs` Set (line 88) and `enqueueJob` guard (lines 242-250) prevent concurrent reindex operations, but this guard is untested. If the guard fails, multiple jobs could corrupt the vector index by writing to the same table simultaneously.
- **Repro:** No test scenario exists that: (1) attempts to start two reindex jobs concurrently, (2) verifies that the second job is rejected or queued, (3) confirms that only one job runs at a time.
- **Recommendation:** Add a test in `reindex.test.ts` that: (1) starts a slow reindex job (mock adapter with delay), (2) attempts to start a second job immediately, (3) verifies that the second job is rejected or queued, (4) confirms the `runningJobs` Set contains exactly one job ID.

### P0-4: Missing test for transaction rollback on setActiveEmbedder failure
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:297-301`
- **Issue:** The completion step wraps `setActiveEmbedder` and `setJobStatus` in a transaction (lines 297-301) to ensure atomicity, but there is no test for rollback behavior. If `setActiveEmbedder` fails after `setJobStatus('completed')`, the database could be left in an inconsistent state.
- **Repro:** No test scenario exists where `setActiveEmbedder` throws an error during the completion transaction. The transaction rollback path is untested.
- **Recommendation:** Add a test in `reindex.test.ts` that mocks `setActiveEmbedder` to throw an error. Verify that: (1) the transaction rolls back, (2) the job status does NOT transition to 'completed', (3) the active embedder is NOT changed in the database.

## P1

### P1-1: Weak diagnostic visibility in reindex error handling
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:302-305`
- **Issue:** When a reindex job fails, the error message is persisted (line 304) but there is no logging or diagnostic output. Tests do not verify that error messages are actionable or contain sufficient context for debugging (e.g., batch offset, memory ID, adapter response details).
- **Repro:** No test verifies that error messages include diagnostic context like batch number, processed count, or adapter-specific error details. The current error handling only stores `error.message` which may not be sufficient for production debugging.
- **Recommendation:** Enhance error messages to include diagnostic context (batch offset, processed count, total count, adapter name). Add tests that verify error messages contain this context when failures occur at different points in the reindex loop.

### P1-2: Missing edge case fixtures for device resolution
- **File:** `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:27-30`
- **Issue:** The `test_no_env_no_torch_returns_none` test (lines 27-30) only covers the case where torch is `None`. It does not test for other import failure modes (e.g., torch throws ImportError on attribute access, torch.cuda exists but is not callable, partial module availability).
- **Repro:** No test scenario exists where torch module is present but accessing `torch.cuda` or `torch.backends.mps` throws an AttributeError or ImportError.
- **Recommendation:** Add test fixtures for partial torch failures: (1) torch exists but `torch.cuda` raises AttributeError, (2) torch exists but `torch.cuda.is_available` is not callable, (3) torch exists but calling `is_available()` throws an exception. Verify that `_resolve_device` handles these gracefully.

### P1-3: No tests for embedder registry corruption recovery
- **File:** `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py:32-43`
- **Issue:** The `test_each_entry_well_formed` test (lines 32-43) validates schema compliance but assumes the registry is well-formed. There are no tests for recovery from corrupted registry state (e.g., manifest with missing required fields, negative dimensions, invalid URLs).
- **Repro:** No test scenario exists where the MANIFESTS list contains corrupted entries. The system does not test how it handles or recovers from registry corruption at runtime.
- **Recommendation:** Add tests that inject corrupted manifests into the registry (via monkey-patching or test fixtures) and verify that: (1) lookup functions handle missing/bad data gracefully, (2) default_embedder() falls back safely, (3) list_embedders() filters or reports invalid entries.

## P2

### P2-1: Missing assertion for dist file content validity beyond markers
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:61-65`
- **Issue:** The test only checks for the presence of string markers (line 63-64) but does not verify that the compiled JavaScript is syntactically valid or that the exported functions actually exist and are callable.
- **Repro:** A dist file could contain the marker strings in comments or dead code while being syntactically invalid or missing the actual exports, and the test would still pass.
- **Recommendation:** Enhance the test to: (1) attempt to require/import the dist file, (2) verify that the expected exports are present on the module object, (3) optionally run a simple smoke test on the exported functions if safe to do so in a test environment.

### P2-2: No test for empty memory_index table in reindex
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:328-329`
- **Issue:** The `startReindex` function queries the total count from memory_index (lines 328-329) but does not explicitly handle the case where the table is empty (count = 0). While the code likely handles this gracefully, it is untested.
- **Repro:** No test scenario exists where `memory_index` is empty (count = 0). It is unclear whether a reindex job with total=0 would be created correctly, or whether it would immediately complete/fail.
- **Recommendation:** Add a test that creates an empty memory_index table and calls `startReindex`. Verify that: (1) the job is created with total=0, (2) the job completes immediately without errors, (3) setActiveEmbedder is still called correctly.

### P2-3: Weak assertions in device resolution priority
- **File:** `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:32-38`
- **Issue:** The `test_no_env_cuda_available` test (lines 32-38) verifies that CUDA is preferred when both CUDA and MPS are available, but the assertion is a simple equality check (line 38). It does not verify that the priority order is explicitly documented or enforced by the implementation.
- **Repro:** If the implementation changes the priority order (e.g., preferring MPS over CUDA), the test would fail but the intent (priority ordering) would not be clear from the test alone.
- **Recommendation:** Add a comment or docstring in the test that explicitly states the priority order (CUDA > MPS > CPU). Consider adding a test that verifies the priority order is consistent across all combinations of available devices.
