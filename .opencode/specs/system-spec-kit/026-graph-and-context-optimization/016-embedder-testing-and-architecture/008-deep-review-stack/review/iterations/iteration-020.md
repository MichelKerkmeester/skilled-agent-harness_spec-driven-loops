# Iteration 020 — MAINTAINABILITY (final holistic sweep)

## P0

### P0-1: In-scope test file missing from codebase
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts` (MISSING)
- **Issue:** The review scope explicitly includes `dist-freshness.vitest.ts` as an in-scope file, but this file does not exist in the tests directory. The test directory contains many other test files but not this specific one. This represents a gap between the spec/test expectations and actual implementation.
- **Repro:** Run `ls -la .opencode/skills/system-spec-kit/mcp_server/tests/` and observe that `dist-freshness.vitest.ts` is not present. The file is referenced in iteration-019 findings as existing at lines 17-24, but the actual file is missing from the filesystem.
- **Recommendation:** Either (1) create the missing `dist-freshness.vitest.ts` test file if it was intended to exist, or (2) update the review scope to remove this file from the in-scope list if it was never implemented. If the file should exist, it should test build artifact freshness and verify that critical functions like `applyRetrievalRescueLayer` are present in compiled output.

## P1

### P1-1: Inconsistent error handling patterns across embedder layer
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:36-64`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:95-101`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:302-305`
- **Issue:** The embedder layer uses inconsistent error handling patterns. `ollama.ts` defines custom error classes (`OllamaAdapterError`, `OllamaBackendUnreachableError`, etc.) with inheritance hierarchies, `registry.ts` defines `NotImplementedError` as a custom class, but `reindex.ts` and `schema.ts` use generic `Error`, `RangeError`, and `TypeError` without custom classes. This inconsistency makes error handling, logging, and client error response handling more difficult across the embedder stack.
- **Repro:** Compare error handling patterns: (1) `ollama.ts:36-64` has 4 custom error classes with proper inheritance, (2) `registry.ts:95-101` has 1 custom error class, (3) `reindex.ts:302-305` uses generic `Error` with string messages, (4) `schema.ts:38-40,98-100` uses built-in `RangeError` and `TypeError`. A client trying to catch embedder-specific errors must handle multiple patterns.
- **Recommendation:** Standardize error handling across the embedder layer by either: (1) creating a shared set of embedder error base classes in `embedders/errors.ts` that all adapters and orchestrators use, or (2) document the intentional inconsistency if different error domains require different handling patterns. At minimum, ensure all embedder-related errors have a consistent `code` property for programmatic error classification.

### P1-2: stage2-fusion.ts is approaching god module size (1478 lines)
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1-1478`
- **Issue:** The `stage2-fusion.ts` file is 1478 lines long, which makes it difficult to maintain, understand, and modify safely. While the file has some internal organization (helpers, constants, type aliases), the sheer number of concerns (session boost, causal boost, co-activation, FSRS, validation signals, graph calibration, learned models, provenance, etc.) creates cognitive load and increases the risk of unintended side effects when making changes.
- **Repro:** Run `wc -l .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` to confirm 1478 lines. Open the file and observe that it handles: (1) 13 different signal application steps, (2) multiple database queries, (3) model loading and caching, (4) graph evidence population, (5) validation metadata enrichment, (6) artifact routing, (7) negative feedback, (8) learned combiner shadow scoring. All these concerns are intermixed in a single file.
- **Recommendation:** Decompose `stage2-fusion.ts` into smaller, focused modules following the single responsibility principle. Potential decomposition: (1) extract signal application logic into individual modules (session-boost.ts, causal-boost.ts, validation-signals.ts, etc.), (2) extract graph-related operations into graph-provenance.ts, (3) extract learned model loading into learned-model-loader.ts, (4) keep a thin orchestrator in stage2-fusion.ts that coordinates the extracted modules. The extraction should preserve the 13-step signal application order as documented in the file header.

## P2

### P2-1: Code duplication in error message construction
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:46-47,54,61`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:97,122,125-127`
- **Issue:** Error message construction follows similar patterns across files but is duplicated rather than centralized. For example, both `ollama.ts:46-47` and `registry.ts:97` construct error messages with the pattern "Backend unreachable at ${baseUrl}" and "Embedder backend is not implemented yet: ${backend}" respectively. This duplication makes it harder to maintain consistent error message formatting and i18n support.
- **Repro:** Compare error message patterns: (1) `ollama.ts:46-47` constructs `Ollama backend unreachable at ${baseUrl}${suffix}`, (2) `registry.ts:97` constructs `Embedder backend is not implemented yet: ${backend}`, (3) `registry.ts:122` constructs `llama-cpp embedding provider returned no embedding for ${this.name}`, (4) `registry.ts:125-127` constructs a multi-line dimension mismatch error. Each follows similar patterns but is implemented independently.
- **Recommendation:** Create a shared error message utility in `embedders/error-messages.ts` that provides consistent formatting functions for common error patterns (unreachable backend, not implemented, dimension mismatch, model not loaded, etc.). This would centralize message templates and make it easier to add i18n support or consistent formatting in the future.

### P2-2: Scattered dimension validation logic
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:37-41,43-46`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:111-116`
- **Issue:** Dimension validation logic is implemented in multiple places with slightly different patterns. `schema.ts:37-41` validates dimensions in `validateDim()` and `schema.ts:43-46` has a separate `vecTableNameForDim()` that also validates, while `reindex.ts:111-116` has its own `tableNameForDim()` with similar validation. This duplication creates maintenance burden and risk of validation inconsistencies.
- **Repro:** Compare dimension validation: (1) `schema.ts:37-41` checks `!Number.isInteger(dim) || dim <= 0` and throws `RangeError`, (2) `schema.ts:43-46` calls `validateDim()` then constructs table name, (3) `reindex.ts:111-116` has identical logic `!Number.isInteger(dim) || dim <= 0` with the same `RangeError` message. The validation logic is duplicated across two files.
- **Recommendation:** Consolidate dimension validation into a single shared utility function in `embedders/validation.ts` that both `schema.ts` and `reindex.ts` import. The function should validate dimensions and optionally construct table names, ensuring consistent validation logic across the embedder stack. Update both call sites to use the shared utility.

### P2-3: Missing architectural documentation for embedder adapter extension points
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:176-192`
- **Issue:** The `getAdapter()` factory function contains a hardcoded switch statement that only supports `ollama` and `llama-cpp` backends, with `api` and `sentence-transformers` explicitly throwing `NotImplementedError`. While the architecture is designed for pluggability, there is no documentation explaining how to add a new backend adapter, making it difficult for future developers to extend the system without reading the implementation code.
- **Repro:** Examine `registry.ts:176-192` and observe that adding a new backend requires: (1) adding a case to the switch statement, (2) creating an adapter class in `adapters/<backend>.ts`, (3) implementing the `EmbedderAdapter` interface, (4) adding manifests to `MANIFESTS`. None of these steps are documented in comments or a separate ARCHITECTURE.md file.
- **Recommendation:** Add architectural documentation (either as extensive comments in `registry.ts` or a separate `EMBEDDER_ARCHITECTURE.md`) that explains: (1) how to add a new backend adapter, (2) the interface contract, (3) the factory pattern, (4) manifest requirements, (5) testing requirements. This documentation would reduce the learning curve for future maintainers and ensure consistent extension patterns.

## Summary
- **P0:** 1 finding (missing in-scope test file)
- **P1:** 2 findings (inconsistent error handling, large file size)
- **P2:** 3 findings (error message duplication, scattered validation, missing extension documentation)

The final maintainability sweep identified one P0 issue (missing test file that was explicitly in-scope), and several P1/P2 issues related to code organization, consistency, and documentation. The embedder stack is functionally sound but would benefit from standardization of error handling patterns, decomposition of the large stage2-fusion.ts file, and better documentation of extension points.