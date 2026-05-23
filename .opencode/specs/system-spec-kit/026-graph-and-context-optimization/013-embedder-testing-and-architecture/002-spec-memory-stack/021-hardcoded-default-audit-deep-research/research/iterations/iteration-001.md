# Iteration 001: Broad Repo-Wide Grep Sweep

**Date:** 2026-05-23T11:45:00Z
**Status:** insight
**Focus:** Broad grep sweep for inline default patterns across all 5 subsystems. Establish baseline candidate-sites table.

## Actions Taken

1. **Subsystem-wide grep for DEFAULT_* patterns**: Searched `.opencode/skills/` across all 5 subsystems (spec-memory, cocoindex, skill-advisor, code-graph, rerank-sidecar) for `DEFAULT_MODEL`, `DEFAULT_PROVIDER`, `DEFAULT_*_FALLBACK`, `_DEFAULT_MODEL`, `DEFAULT_EDGE_WEIGHTS`, and related constants.

2. **Hardcoded model-name sweep**: Grepped for `BAAI/`, `jina-`, `nomic-ai/`, `onnx-community/`, `unsloth/`, `google/`, `sbert/`, `Qwen/`, `ms-marco`, `voyage-code-3`, `text-embedding-3-small`, `cross-encoder/` across production TypeScript and Python files (excluding tests, benchmarks, and spec/docs files).

3. **Hardcoded threshold sweep**: Searched for `THRESHOLD`, `MIN_CONFIDENCE`, `MIN_SCORE`, `SIMILARITY_THRESHOLD`, and numeric defaults in production code paths.

4. **Hardcoded skip-list search**: Checked code-graph parser for skip-list implementation (DB-driven, not hardcoded).

5. **Registry derivation audit**: Traced `getCanonicalFallback()` usage across spec-memory to confirm which sites are registry-derived vs which still carry inline defaults.

## Findings

### P0 — Active Drift (same class as 020's BAAI/jina bug)

These are hardcoded model names that contradict ADR-013/014 consensus (nomic-embed-text-v1.5 is canonical). They sit in active resolution chains — an env var unset means the stale fallback fires.

| ID | File:Line | Hardcoded Value | ADR Consensus | Suspicion |
|----|-----------|-----------------|---------------|-----------|
| P0-001 | `shared/embeddings/profile.ts:192` | `'jina-embeddings-v3'` (ollama fallback) | `nomic-embed-text-v1.5` | P0 — Active drift. `resolveActiveProfileModel('ollama')` falls through to pre-ADR-013 default. |
| P0-002 | `shared/embeddings/profile.ts:195` | `'BAAI/bge-base-en-v1.5'` (hf-local fallback) | `nomic-ai/nomic-embed-text-v1.5` | P0 — Active drift. Exact BAAI anti-pattern that packet 020 fixed in the primary chain; survived in the profile path. |
| P0-003 | `shared/embeddings.ts:774` | `'jina-embeddings-v3'` (ollama fallback in `detectConfiguredModelName`) | `nomic-embed-text-v1.5` | P0 — Active drift. Called by `getModelName()` which feeds `chunking-orchestrator.ts`, `embedding-pipeline.ts`, `memory-crud-health.ts`, and `lineage-state.ts` for runtime model reporting. |

### P1 — Latent Drift (duplicated constants that can diverge)

These are constants that duplicate values available from the canonical registry. They're currently consistent but have no compiler-enforced link to the source of truth.

| ID | File:Line | Value | Canonical Source | Suspicion |
|----|-----------|-------|------------------|-----------|
| P1-001 | `shared/embeddings/auto-select.ts:99-100` | `VOYAGE_MODEL = 'voyage-code-3'` | `registry.ts:171` (`CLOUD_CANONICAL.voyage`) | P1 — Duplicated cloud canonical. |
| P1-002 | `shared/embeddings/auto-select.ts:101-102` | `OPENAI_MODEL = 'text-embedding-3-small'` | `registry.ts:172` (`CLOUD_CANONICAL.openai`) | P1 — Duplicated cloud canonical. |
| P1-003 | `shared/embeddings/auto-select.ts:106` | `HF_LOCAL_MODEL = 'nomic-ai/nomic-embed-text-v1.5'` | `registry.ts:217` (`getCanonicalFallback('hf-local')`) | P1 — Duplicated local canonical. This one is currently consistent but could drift if MANIFESTS[0] changes. |
| P1-004 | `shared/embeddings/auto-select.ts:109-130` | `OLLAMA_PRIORITY` array (4 entries) | `registry.ts:24-83` (`MANIFESTS`) | P1 — Duplicates Ollama manifest entries. Adding a new embedder to MANIFESTS requires remembering to also update this array. |
| P1-005 | `shared/embeddings/providers/openai.ts:13` | `DEFAULT_MODEL = 'text-embedding-3-small'` | `registry.ts:172` (`CLOUD_CANONICAL.openai`) | P1 — Duplicated cloud canonical. Provider file carries own constant instead of importing from registry. |
| P1-006 | `shared/embeddings/providers/voyage.ts:13` | `DEFAULT_MODEL = 'voyage-code-3'` | `registry.ts:171` (`CLOUD_CANONICAL.voyage`) | P1 — Duplicated cloud canonical. Same pattern as openai.ts. |
| P1-007 | `mcp_server/lib/search/cross-encoder.ts:54` | `'cross-encoder/ms-marco-MiniLM-L-6-v2'` | None (no reranker registry exists) | P1 — Local reranker model is a single hardcoded string in PROVIDER_CONFIG. The rerank-sidecar and CocoIndex both have declared default rerankers in registries, but spec-memory's cross-encoder does not. |

### P2 — Cosmetic (hardcoded configs, reasonable but worth noting)

These are configuration-like values that are hardcoded today. They're not model-name drift, but create single points of change for runtime tuning.

| ID | File:Line | Description | Suspicion |
|----|-----------|-------------|-----------|
| P2-001 | `cross-encoder.ts:35-60` | `PROVIDER_CONFIG` — 3 providers with hardcoded model names, endpoints, and timeouts | P2 — Reasonable config object but the `local` entry's model name is the same as P1-007 concern. |
| P2-002 | `cross-encoder.ts:62-67` | `LENGTH_PENALTY` thresholds (50, 2000) | P2 — Tuning knobs without env-var override. |
| P2-003 | `indexer-types.ts:23-34` | `DEFAULT_EDGE_WEIGHTS` — 9 edge types with numeric weights | P2 — Already uses spread-override pattern (`...DEFAULT_EDGE_WEIGHTS, ...edgeWeights`). Standard config pattern. |
| P2-004 | `edge-drift.ts:17-19` | `EDGE_DRIFT_PSI_THRESHOLD = 0.25`, `EDGE_DRIFT_JSD_THRESHOLD = 0.10`, `EDGE_DRIFT_SHARE_THRESHOLD = 0.05` | P2 — Shared between production and tests via single export. Clean pattern, no env override. |
| P2-005 | `config/config.py:21-30` | `_DEFAULT_MODEL = DEFAULT_EMBEDDER_NAME`, `_DEFAULT_RERANK_MODEL = DEFAULT_RERANKER_NAME` | P2 — CocoIndex's defaults properly derive from registered_embedders.py constants. Single source of truth within CocoIndex. |
| P2-006 | `registered_embedders.py:255-256` | `DEFAULT_EMBEDDER_NAME = "sbert/nomic-ai/CodeRankEmbed"`, `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` | P2 — Top-level declared defaults in cocoindex registry. Reasonable registry design. |
| P2-007 | `rerank_sidecar.py:49-53` | `DEFAULT_MODEL_NAME` reads from `RERANK_MODEL_NAME` env, falls back to `"Qwen/Qwen3-Reranker-0.6B"` | P2 — Env-first with hardcoded fallback. Consistent with CocoIndex's default. |

### Subsystems Already Clean (no issues found)

- **Skill-advisor**: `DEFAULT_ACTIVE_EMBEDDER` is set to `'auto'` sentinel (schema.ts:38-41), routing to the shared `auto-select.ts` cascade. No hardcoded model names remain.
- **Code-graph**: Parser skip-list is DB-driven (`parser-skip-list.ts`), not hardcoded. Edge weights use spread-override. Thresholds are documented and shared between production and tests.
- **CocoIndex embedder**: Registry-aware with `DEFAULT_EMBEDDER_NAME` feeding `_DEFAULT_MODEL`. Consistent with arc consensus.
- **Rerank-sidecar**: Env-first design (`RERANK_MODEL_NAME`) with hardcoded fallback. Consistent.

## Questions Answered

1. **Are there more BAAI/jina leftovers like packet 020 found?** Yes — 3 P0 sites in spec-memory where hardcoded model names contradict ADR-013/014. Two are in profile.ts (a file not touched by packet 020). One is in embeddings.ts `detectConfiguredModelName()`.

2. **Is CocoIndex's embedder chain registry-derived?** Yes. `DEFAULT_EMBEDDER_NAME` → `_DEFAULT_MODEL` → `Config.embedding_model`. Single source of truth within CocoIndex.

3. **Does skill-advisor have its own hardcoded model defaults?** No. It uses the `'auto'` sentinel and delegates to the shared auto-select cascade.

4. **Are code-graph parser engines hardcoded?** The skip-list is DB-driven. Edge weights and thresholds are configurable via spread-override.

5. **Are there duplicated constants across subsystems?** Yes. `auto-select.ts` duplicates model name constants present in `registry.ts` (P1-001 through P1-004). Cloud provider files (`openai.ts`, `voyage.ts`) duplicate cloud canonicals.

## Questions Remaining

1. Is `profile.ts` the ACTIVE resolution path for DB filename construction, or is it a legacy path? The BAAI/jina fallbacks here may only affect rare code paths.
2. Does `detectConfiguredModelName()` ever actually fire its fallback in practice, or does the provider chain always resolve before reaching it?
3. Are there hardcoded defaults in config files (JSON/YAML/TOML), READMEs, INSTALL_GUIDE.md, and skill docs that need auditing? (Scope for iteration 002.)
4. Does the spec-memory reranker need a registry similar to the embedder registry?
5. Are there hardcoded defaults in the `deep-loop-runtime` or other cross-cutting skills?

## Next Focus

**Iter-002:** Deep-dive into spec-memory profile.ts and embeddings.ts to trace the active resolution chains. Determine whether the P0 sites identified in profile.ts are in active code paths or legacy codepaths. Also audit config files, READMEs, and INSTALL_GUIDE.md for documented defaults that contradict code.
