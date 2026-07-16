---
title: "022/013 Remove Voyage/Cohere Cloud Rerankers"
description: "Closed the cloud-reranker auto-routing footgun. Setting VOYAGE_API_KEY or COHERE_API_KEY for embedding purposes would silently activate cloud reranking. Eight live files were modified and one test file was deleted to narrow the RerankerProvider type to local-only. 31 of 31 tests pass post-rewrite."
trigger_phrases:
  - "022/013 remove voyage cohere"
  - "remove cloud reranker footgun"
  - "voyage cohere reranker removal"
  - "cloud reranker auto-routing fix"
  - "cross-encoder local-only narrowing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Two separate gates in the cross-encoder pipeline were auto-routing reranking calls to Voyage or Cohere cloud APIs whenever the corresponding API key was present in the environment. Because Voyage and Cohere each sell both embedding and reranking services under the same key, an operator who set `VOYAGE_API_KEY` purely for embeddings would unknowingly send every query to `api.voyageai.com/v1/rerank`. The local sidecar (`Qwen/Qwen3-Reranker-0.6B`) was already the production reranker. The cloud paths were silent footguns.

This packet removed both providers entirely from the reranker surface. The `RerankerProvider` type was narrowed to `'local'`. All voyage/cohere provider config entries, routing functions, API-key opt-in signals and related tests were deleted. The cross-encoder now activates only via the explicit two-flag combination `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`. Eight live files were modified and one test file deleted across approximately 340 net lines removed. All 31 tests pass post-rewrite.

### Added

None.

### Changed

- `RerankerProvider` type in `shared/embeddings/registry.ts` narrowed from `'local' | 'voyage' | 'cohere'` to `'local'` only. `RERANKER_CANONICAL` voyage and cohere rows removed. Comment rewritten to document the removal rationale.
- `mcp_server/lib/search/cross-encoder.ts` `resolveProvider()` updated to no longer auto-route on API-key presence. Only `RERANKER_LOCAL=true` resolves to `'local'`. Header, circuit-breaker and `maxDocuments` comments updated to drop the cloud narrative.
- `mcp_server/lib/search/search-flags.ts` `hasAnyCrossEncoderOptInSignal()` updated to no longer treat `VOYAGE_API_KEY` or `COHERE_API_KEY` as opt-in signals. Only `SPECKIT_CROSS_ENCODER=true` activates the cross-encoder gate.
- `mcp_server/lib/search/evidence-gap-detector.ts` `Z_SCORE_THRESHOLD` comment updated to reference `RERANKER_LOCAL=true` as the only activation path.
- `mcp_server/ENV_REFERENCE.md` section 14 RERANKER intro rewritten with the removal narrative and updated activation instructions.
- `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` `VOYAGE_API_KEY` row scoped to embeddings only, `RERANKER_LOCAL` description updated to reflect it is now the sole activation path.
- `mcp_server/tests/cross-encoder-extended.vitest.ts` voyage/cohere describe blocks removed. Routes test rewritten to use `SPECKIT_CROSS_ENCODER=true` plus `RERANKER_LOCAL=true`. Mock response shapes updated from `data: [...]` to `results: [...]`.
- `mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts` all `'voyage'` and `'cohere'` fixture strings replaced with `'local'`. Multi-provider isolation test removed.

### Fixed

- `VOYAGE_API_KEY` alone no longer silently activates cloud reranking. Setting it for embeddings now has no effect on the reranker pipeline.
- `COHERE_API_KEY` alone no longer silently activates cloud reranking.
- `resolveProvider()` no longer auto-routes on API-key presence. Requires explicit `RERANKER_LOCAL=true` opt-in.

### Verification

| Requirement | Check | Result |
|-------------|-------|--------|
| R1 | `rg` sweep excluding archived paths returns only removal-narrative comments and Voyage-as-embedder rows | PASS |
| R2 | `npx tsc --noEmit -p .opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | PASS (pre-existing `TS5101 baseUrl` warning only) |
| R3 | `npx vitest run tests/cross-encoder-extended.vitest.ts` | 23 of 23 pass |
| R4 | `npx vitest run tests/cross-encoder-circuit-breaker.vitest.ts` | 8 of 8 pass |
| R5 | Setting `VOYAGE_API_KEY` alone yields `provider === 'none'` and `scoringMethod === 'fallback'` | PASS (covered by rewritten describe 5 test) |

### Files Changed

| File | What changed |
|------|--------------|
| `shared/embeddings/registry.ts` | `RerankerProvider` type narrowed to `'local'`. Voyage and cohere rows removed from `RERANKER_CANONICAL`. |
| `mcp_server/lib/search/cross-encoder.ts` | `PROVIDER_CONFIG` reduced to local-only. `rerankVoyage()` and `rerankCohere()` deleted (~90 LOC). `resolveProvider()` API-key auto-routing removed. Switch case branches and barrel exports trimmed. |
| `mcp_server/lib/search/search-flags.ts` | `hasAnyCrossEncoderOptInSignal()` no longer treats `VOYAGE_API_KEY` or `COHERE_API_KEY` as activation signals. `looksLikeValidApiKey()` helper deleted (no remaining callers). |
| `mcp_server/lib/search/evidence-gap-detector.ts` | `Z_SCORE_THRESHOLD` comment updated. |
| `mcp_server/ENV_REFERENCE.md` | Section 14 RERANKER intro rewritten with removal narrative. |
| `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` | `COHERE_API_KEY` row deleted. `VOYAGE_API_KEY` row scoped to embeddings only. `RERANKER_LOCAL` description updated. |
| `mcp_server/tests/cross-encoder-extended.vitest.ts` | Voyage/cohere describe blocks removed. Routes test and mock shapes rewritten for local-only path. 23 tests pass. |
| `mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts` | Provider fixture strings updated to `'local'`. Multi-provider isolation test removed. 8 tests pass. |
| `mcp_server/tests/reranker-eval-comparison.vitest.ts` (DELETED) | Entire file was a Voyage/Cohere comparison skeleton with no remaining applicable contract. |

### Follow-Ups

- Activation now requires both `SPECKIT_CROSS_ENCODER=true` and `RERANKER_LOCAL=true`. Future cleanup could collapse these into a single flag but that is a behavior change outside this packet's scope.
- Operators who set `VOYAGE_API_KEY` for embeddings and relied on implicit reranking activation need to add `SPECKIT_CROSS_ENCODER=true` and `RERANKER_LOCAL=true` explicitly.
- `Z_SCORE_THRESHOLD` in `evidence-gap-detector.ts` remains at 1.3. That floor was tuned for the no-reranker-available baseline. With `RERANKER_LOCAL=true` always available the threshold could potentially rise back to 1.5. Out of scope for this packet.
- If a cloud reranker is ever reintroduced the correct pattern is an explicit `RERANKER_PROVIDER=voyage|cohere|local` env var rather than API-key-gated auto-resolution.
