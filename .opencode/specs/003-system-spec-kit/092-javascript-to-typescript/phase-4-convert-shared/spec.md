# Phase 3: Convert shared/ (Foundation Layer)

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-C
> **Tasks:** T030–T042
> **Milestone:** M4 (Shared Converted)
> **SYNC Gate:** SYNC-004
> **Depends On:** Phase 2 (SYNC-003)
> **Session:** 2

---

## Goal

Convert the foundational `shared/` layer to TypeScript. All other modules depend on this — it must be solid.

## Scope

**Target:** `system-spec-kit/shared/` — 9 existing files + 1 new `types.ts`

### Conversion Order (dependency-aware)

| # | File | Lines | Key Types |
|---|------|------:|-----------|
| 1 | `shared/types.ts` | NEW | `IEmbeddingProvider`, `IVectorStore`, `SearchResult`, `MemoryRecord` (central type defs) |
| 2 | `shared/utils/path-security.ts` | 75 | `validateFilePath()` |
| 3 | `shared/utils/retry.ts` | 385 | `RetryConfig`, `ErrorClassification`, `BackoffSequence` |
| 4 | `shared/scoring/folder-scoring.ts` | 397 | `FolderScore`, `RankingMode`, `ArchivePattern` |
| 5 | `shared/chunking.ts` | 118 | `ChunkOptions`, `semanticChunk()` |
| 6 | `shared/embeddings/profile.ts` | 78 | `EmbeddingProfile` class |
| 7 | `shared/embeddings/providers/hf-local.ts` | 242 | `HfLocalProvider` implementing `IEmbeddingProvider` |
| 8 | `shared/embeddings/providers/openai.ts` | 257 | `OpenAIProvider`, `ModelDimensions` |
| 9 | `shared/embeddings/providers/voyage.ts` | 275 | `VoyageProvider`, `ModelDimensions` |
| 10 | `shared/embeddings/factory.ts` | 370 | `ProviderConfig`, `createEmbeddingsProvider()` |
| 11 | `shared/embeddings.ts` | 585 | Facade types, `EmbeddingResult`, cache types |
| 12 | `shared/trigger-extractor.ts` | 686 | `TriggerConfig`, `TriggerPhrase`, `ExtractionStats` |

### Key Deliverable: `shared/types.ts`

Central type definitions file — single source of truth for cross-workspace types:
- `IEmbeddingProvider` interface (keep `I` prefix per D5)
- `IVectorStore` interface (keep `I` prefix per D5)
- `SearchResult`, `MemoryRecord`, `EmbeddingResult`
- All types imported by mcp_server and scripts via project references

## Exit Criteria

- [ ] All 12 files compile with `tsc --noEmit` (zero errors)
- [ ] `shared/types.ts` created with canonical interface definitions
- [ ] All downstream imports resolve (mcp_server, scripts)
- [ ] Existing tests pass against compiled output
- [ ] SYNC-004 gate passed
