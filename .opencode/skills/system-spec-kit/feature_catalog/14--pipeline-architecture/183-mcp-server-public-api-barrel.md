---
title: "MCP Server Public API Barrel"
description: "Stable top-level import surface re-exporting evaluation, indexing, search, provider, and metadata helpers without exposing internal lib/core/handlers modules."
trigger_phrases:
  - "mcp server public api barrel"
  - "api barrel file"
  - "stable top-level import surface"
  - "re-export public MCP helpers"
  - "hide internal lib core handlers"
---

# MCP Server Public API Barrel

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `mcp_server/api/index.ts` file is the public barrel for the MCP server runtime. Its file header explicitly marks it as the single public entry point, and the README reinforces that external consumers such as scripts, eval tooling, and automation should import from `api/` instead of reaching into `lib/`, `core/`, or `handlers/` directly. In practice, that makes the barrel the stable top-level boundary that shields downstream code from internal path churn.

The barrel is broader than a simple re-export of the five `api/*.ts` modules. It also curates selected helper surfaces from internal `lib/` modules when those helpers are needed by script families such as spec-folder workflows, memory tooling, eval benchmarking, architecture metadata consumers, and rollout reporting. That keeps the public import contract centralized: consumers still use one approved boundary even when the underlying implementation lives in multiple subsystems.

Because it re-exports runtime functions, constants, types, namespace modules, and rollout metadata together, the barrel acts as a compatibility layer for orchestration code. Consumers can bootstrap search and indexing, run evals, inspect roadmap flags, and access approved metadata helpers from one import location without taking a direct dependency on private module layout.

---

## 2. HOW IT WORKS

### Entry Point & Routing

The barrel currently re-exports the full evaluation surface from `api/eval.ts`: `runAblation`, `storeAblationResults`, `formatAblationReport`, `toHybridSearchFlags`, `isAblationEnabled`, `ALL_CHANNELS`, `runBM25Baseline`, `recordBaselineMetrics`, `loadGroundTruth`, and `initEvalDb`, plus the associated eval and BM25 types (`AblationChannel`, `AblationSearchFn`, `AblationReport`, `BM25SearchFn`, `BM25SearchResult`, and `BM25BaselineResult`). This makes the barrel an approved entrypoint for benchmark execution, baseline measurement, report formatting, and eval database bootstrap.

From `api/indexing.ts`, it exposes indexing lifecycle controls: `initializeIndexingRuntime`, `warmEmbeddingModel`, `runMemoryIndexScan`, and `closeIndexingRuntime`, along with `MemoryIndexScanArgs`. From `api/search.ts`, it exposes the hybrid search bootstrap and execution surface: `initHybridSearch`, `hybridSearchEnhanced`, `fts5Bm25Search`, `isFts5Available`, and `vectorIndex`, plus the public search types `HybridSearchOptions` and `HybridSearchResult`.

Provider and storage bootstrap surfaces are also promoted through the same boundary. `api/providers.ts` contributes `generateEmbedding`, `generateQueryEmbedding`, `getEmbeddingProfile`, and `retryManager`, while `api/storage.ts` contributes `initCheckpoints` and `initAccessTracker`. Together these exports let consumers initialize storage dependencies, produce embeddings, inspect embedding configuration, and use the retry orchestration surface without importing provider or storage internals directly.

### Core Behavior

The barrel also intentionally promotes several curated internal helpers. Folder-discovery helpers from `lib/search/folder-discovery.ts` include `generatePerFolderDescription`, `savePerFolderDescription`, `loadPerFolderDescription`, `extractKeywords`, `slugifyFolderName`, and the `PerFolderDescription` type. Entity extraction support comes from `lib/extraction/entity-extractor.ts` via `extractEntities` and `rebuildAutoEntities`. For benchmarking and instrumentation, the barrel exports namespace objects `sessionBoost`, `causalBoost`, and `workingMemory`, plus `initExtractionAdapter`, `getExtractionMetrics`, `resetExtractionMetrics`, and the `ExtractionMetrics` type from `lib/extraction/extraction-adapter.ts`.

Finally, the barrel exposes architecture and roadmap metadata surfaces that would otherwise require deep internal imports. From `lib/architecture/layer-definitions.ts`, it exports `LAYER_DEFINITIONS`, `TOOL_LAYER_MAP`, `getLayerForTool`, `getLayerTokenBudget`, `LayerDefinition`, and `LayerId`. From `lib/config/capability-flags.ts`, it exports memory-roadmap defaults, phase, and flag helpers. The result is a single public barrel that spans evaluation, runtime bootstrap, search, provider orchestration, script-facing helper utilities, and roadmap metadata, while keeping consumers on one stable import path.

---

## 3. SOURCE FILES

### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/api/index.ts` | API | Top-level public barrel and stable import boundary |
| `mcp_server/api/eval.ts` | API | Evaluation, ablation, BM25 baseline, and eval DB exports |
| `mcp_server/api/indexing.ts` | API | Indexing runtime bootstrap, warmup, scan, and shutdown exports |
| `mcp_server/api/search.ts` | API | Hybrid search, BM25/FTS5, and vector index exports |
| `mcp_server/api/providers.ts` | API | Embedding generation, profile access, and retry exports |
| `mcp_server/api/storage.ts` | API | Checkpoint and access-tracker initialization exports (DEAD_CODE — only consumed internally by api/indexing.ts; no external callers found) |
| `mcp_server/lib/search/folder-discovery.ts` | Lib | Folder description, keyword extraction, and slug helper exports promoted by the barrel |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction helpers promoted by the barrel |
| `mcp_server/lib/search/session-boost.ts` | Lib | Session boost benchmarking namespace exported by the barrel |
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal boost benchmarking namespace exported by the barrel |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working-memory benchmarking namespace exported by the barrel |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extraction adapter metrics and lifecycle helpers promoted by the barrel |
| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | Layer metadata, tool-layer mapping, and token budget helpers |
| `mcp_server/lib/config/capability-flags.ts` | Lib | Roadmap flag and default/phase helpers |
| `mcp_server/api/README.md` | Docs | Consumer policy documenting `api/` as the approved public surface |

### Validation And Tests
| File | Type | Role |
|---|---|---|
| `mcp_server/tests/api-public-surfaces.vitest.ts` | Automated test | Direct barrel export contract for search and top-level API surfaces |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Automated test | Rollout metadata and roadmap-flag exports exposed by the top-level barrel |
| `mcp_server/tests/memory-roadmap-flags.vitest.ts` | Automated test | Memory-roadmap phase/default helpers exposed through the public barrel |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/183-mcp-server-public-api-barrel.md`
Related references:
- [182-lineage-state-active-projection-and-asof-resolution.md](182-lineage-state-active-projection-and-asof-resolution.md) — Lineage state active projection and asOf resolution
- [184-embeddings-and-retry-api.md](184-embeddings-and-retry-api.md) — Embeddings and Retry API
