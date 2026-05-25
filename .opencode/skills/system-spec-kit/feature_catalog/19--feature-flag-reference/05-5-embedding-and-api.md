---
title: "5. Embedding and API"
description: "This document captures the implemented behavior, source references, and validation scope for 5. Embedding and API."
---

# 5. Embedding and API

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 5. Embedding and API.

These settings pick which embedding and reranking providers the system uses and which credentials unlock them. They let you switch between cloud and local options without changing application logic.

---

## 2. CURRENT REALITY

### Embedding and reranker provider flags

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts`, `shared/embeddings/factory.ts` | Compatibility check and startup override for the stored vector dimension. Any positive explicit `EMBEDDING_DIM` value is honored first; otherwise runtime dimension selection comes from the active provider profile (Voyage 1024, OpenAI 1536, local BGE local fallback 768). |
| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `shared/embeddings/factory.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, `'ollama'`, and `'voyage'`. In `'auto'` mode, resolution precedence is explicit `EMBEDDINGS_PROVIDER` -> `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local `ollama` default -> `hf-local` fallback. The local default model is `nomic-embed-text-v1.5` (Ollama); the hf-local fallback model is `nomic-ai/nomic-embed-text-v1.5` (ADR-014 local-first cascade). |
| `OPENAI_API_KEY` | _(none)_ | string | `shared/embeddings/factory.ts` | API key for the OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when `'auto'` mode selects OpenAI as the available provider. |
| `VOYAGE_API_KEY` | _(none)_ | string | `shared/embeddings/factory.ts` | API key for the Voyage AI embeddings provider. In `'auto'` mode, Voyage is preferred over OpenAI and local providers when this key is present, using `voyage-4` embeddings. (Voyage reranker support was removed in 022/013.) |

### Retrieval and ranking runtime overrides

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_CALIBRATION_PROFILE_NAME` | `default` | string | `mcp_server/lib/search/graph-calibration.ts` | Selects the named graph-calibration profile. `aggressive` loads the tighter caps/thresholds profile; `default`, unset, and unrecognized values fall back to the default profile. |
| `SPECKIT_GRAPH_LOCAL_THRESHOLD` | `50` | number | `mcp_server/lib/search/graph-lifecycle.ts` | Maximum estimated dirty-component size that still uses synchronous local recompute. Invalid or non-positive values fall back to 50. |
| `SPECKIT_GRAPH_WEIGHT_CAP` | `0.05` | number | `mcp_server/lib/search/graph-calibration.ts` | Optional override for the Stage 2 graph-weight cap applied by `loadCalibrationProfile()`. Invalid values are ignored. |
| `SPECKIT_LEARNED_STAGE2_MODEL` | `models/learned-stage2-combiner.json` | string | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Optional absolute or cwd-relative JSON model path for persisted learned Stage 2 fusion weights. Used only when shadow-model loading is enabled. |
| `SPECKIT_LOUVAIN_MIN_DENSITY` | `0.3` | number | `mcp_server/lib/search/graph-calibration.ts` | Optional override for the minimum graph density required before Louvain community detection can activate. Invalid values are ignored. |
| `SPECKIT_LOUVAIN_MIN_SIZE` | `10` | number | `mcp_server/lib/search/graph-calibration.ts` | Optional override for the minimum component size required before Louvain community detection can activate. Invalid values are ignored. |
| `SPECKIT_N2A_CAP` | `0.10` | number | `mcp_server/lib/search/graph-calibration.ts` | Optional override for the N2a graph-signal cap in the active calibration profile. Invalid values are ignored. |
| `SPECKIT_N2B_CAP` | `0.10` | number | `mcp_server/lib/search/graph-calibration.ts` | Optional override for the N2b graph-signal cap in the active calibration profile. Invalid values are ignored. |
| `SPECKIT_RRF_K` | `60` | number | `shared/algorithms/rrf-fusion.ts` | Global Reciprocal Rank Fusion smoothing override. Accepted only when parseable as a finite positive number; otherwise the runtime falls back to `DEFAULT_K = 60`. |
| `SPECKIT_SHADOW_LEARNING` | `false` | boolean | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Enables loading the persisted learned Stage 2 combiner model for shadow scoring. When off, Stage 2 stays on the manual-only path even if a model file exists. |
| `SPECKIT_TOKEN_BUDGET` | `2000` | number | `mcp_server/lib/search/hybrid-search.ts` | Positive integer override for budget-aware result truncation. Invalid or non-positive values fall back to 2000 tokens. |

---

## 3. SOURCE FILES

Source file references are included in the flag tables above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `19--feature-flag-reference/05-5-embedding-and-api.md`
