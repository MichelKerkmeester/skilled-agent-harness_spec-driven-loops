# Iteration 5: shared/** beyond config/gate-3-classifier/frontmatter/path-containment

## Focus
Priority surface 5 — `shared/**` beyond config/gate-3-classifier/frontmatter/path-containment: algorithms, contracts, ranking/scoring/chunking/predicates/embeddings providers — dead code, boundaries, coverage floor, retired residue.

## Findings

### F5.1 [P2] Vestigial test-only exports with no in-repo test consumer
- **Code:** `shared/embeddings/providers/ollama.ts:425` (`__ollamaProviderTestables`) and `shared/parsing/secret-scrubber.ts:246` (`__secretScrubberTestables`).
- **Standard:** `universal/code-quality-standards.md` §5 P2 (dead/test-adjacent code and cleanup), and the module-family convention of this package (several sibling modules export a `__*Testables` object consumed by their own test).
- **What is present:** The package convention is to export `__*Testables` for the module's test: `__embeddingCircuitTestables` (1 test ref) and `__hfLocalProviderTestables` (2 test refs) are both consumed. But `__ollamaProviderTestables` and `__secretScrubberTestables` are exported for tests and are referenced by zero test files repo-wide. Both are "test surface" additions that no test harness currently opens.
- **Severity:** P2 — vestigial test residue; no runtime behavior, but it is a debug surface that can be mistaken for a supported API and adds a sync obligation when the underlying internals change.
- **One-line fix:** **judgment-required** — either add the tests that consume these testables, or remove the unused `__*Testables` export.

### F5.2 [P2] `shared/ranking/*` has no co-located tests; matrix helpers are covered only transitively
- **Code:** `shared/ranking/matrix-math.ts:18,38,63,85,104` (`transpose`, `matMul`, `matVecMul`, `addScaledIdentity`, `solveLinearSystem`); `shared/ranking/learned-combiner.ts:16,19`; no `shared/ranking/*.test.ts`.
- **Standard:** `universal/code-quality-standards.md` §4 P1#2 (happy path + one edge case per public surface); `shared/code-organization/directory-and-test-conventions.md` (tests co-located with the tested module).
- **What is present:** The `shared/ranking/` directory has no `.test.ts`. Coverage for the ranking algorithms lives in `runtime/tests/*.vitest.ts` (`learned-combiner.vitest.ts`, `rrf-fusion.vitest.ts`, `adaptive-fusion.vitest.ts`, `mmr-reranker.vitest.ts`, `unit-rrf-fusion.vitest.ts`). The five `matrix-math.ts` helpers are exercised only transitively through `learned-combiner` (which imports and re-exports them), not by a direct per-helper happy-path/edge test in the shared package.
- **Severity:** P2 — the coverage exists but is not co-located and the low-level matrix helpers lack a direct edge-case test (singular matrix, dimension mismatch), so a regression there is not isolated.
- **One-line fix:** **judgment-required** — add a `shared/ranking/matrix-math.test.ts` (happy path + singular/dimension-mismatch edge) and consider co-locating the ranking tests, or document why the ranking tests live in `runtime/tests/`.

## Sources Consulted
- `shared/embeddings/providers/ollama.ts:425` (`__ollamaProviderTestables`)
- `shared/parsing/secret-scrubber.ts:246` (`__secretScrubberTestables`)
- `shared/embeddings.ts` (`__embeddingCircuitTestables`)
- `shared/embeddings/providers/hf-local.ts` (`__hfLocalProviderTestables`)
- `shared/ranking/matrix-math.ts:18,38,63,85,104`
- `shared/ranking/learned-combiner.ts:16,19`
- `runtime/tests/{learned-combiner,rrf-fusion,adaptive-fusion,mmr-reranker,unit-rrf-fusion}.vitest.ts`
- `shared/embeddings/providers/README.md` and `shared/embeddings/adapters/README.md` (layering contract)
- `shared/ipc/socket-server.ts` (consumed by system-skill-advisor MCP)
- `shared/references/universal/code-quality-standards.md`

## Assessment
- **newInfoRatio:** 0.3
- **Novelty justification:** The two vestigial `__*Testables` exports and the non-co-located ranking tests are the only net-new items; the rest of shared is a confirming pass.
- **Confidence:** High for F5.1 (repo-wide grep: zero test refs for both symbols, while sibling testables are consumed). Medium for F5.2 (coverage exists in runtime/tests, so this is a co-location/directness gap, not a coverage absence). Confirmed-negatives: the `providers/` vs `adapters/` double-ollama is a documented two-layer design (READMEs describe `IEmbeddingProvider` providers vs `EmbedderAdapter` adapters) — not duplication; `shared/ipc/socket-server.ts` is live, imported by `system-skill-advisor/mcp-server/lib/ipc/socket-server.ts:16` (resolving the prior pass's open question); `mf-local`/embeddings subsystem is live, not retired residue.

## Reflection
- What worked: Reading the `providers/` and `adapters/` READMEs before flagging the double-ollama avoided a false duplication finding; grepping the testable-export family established which are consumed.
- What failed: The "retired residue / dead code" probe again returned mostly-live subsystems (embedding providers, socket-server) — the embeddings and IPC layers are genuinely in use.
- Ruled out: The `providers/ollama.ts` + `adapters/ollama.ts` coexistence as duplication (documented layering), and `socket-server.ts` as unimported (consumed by the MCP server).

## Recommended Next Focus
Loop complete (max-iterations reached at 5). Synthesize the 11-finding deviation inventory into `research.md` and the convergence report; record `stopReason: maxIterationsReached`.
