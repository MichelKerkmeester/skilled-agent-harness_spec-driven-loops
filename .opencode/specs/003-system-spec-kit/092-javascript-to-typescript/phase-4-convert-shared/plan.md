# Plan: Phase 3 — Convert shared/ Foundation Layer

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-C
> **Session:** 2
> **Status:** Pending

---

## 1. Phase Overview

**Goal:** Convert the foundational shared layer to TypeScript. All other code depends on this.

**Effort:** 9 existing files + 1 new types.ts + 2 new util dirs = ~2,800 lines

**Dependencies:** Phase 2 complete (circular dependencies resolved, project references viable)

---

## 2. Conversion Strategy

### Approach

Convert in dependency-aware order: utilities first, then embedding system layers from profile → providers → factory → facade.

**Key principles:**
- Create `shared/types.ts` first as the central type definition file (Decision D7)
- Keep `IEmbeddingProvider` and `IVectorStore` with `I` prefix (Decision D5)
- Preserve all backward-compatible export aliases (camelCase + snake_case)
- CommonJS output (`module: "commonjs"`) keeps `__dirname` working (Decision D1)
- In-place compilation (`outDir: "."`) preserves all paths (Decision D2)

---

## 3. Conversion Order (Dependency-Aware)

| # | File | Lines | Key types to define | Priority |
|---|------|------:|---------------------|----------|
| 1 | `shared/types.ts` | ~200 | Central cross-workspace interfaces | **P0** |
| 2 | `shared/utils/path-security.ts` | 75 | `validateFilePath(path: string, allowedPaths: string[]): boolean` | **P0** |
| 3 | `shared/utils/retry.ts` | 385 | `RetryConfig`, `ErrorClassification`, `BackoffSequence` | **P0** |
| 4 | `shared/scoring/folder-scoring.ts` | 397 | `FolderScore`, `RankingMode`, `ArchivePattern` | **P0** |
| 5 | `shared/chunking.ts` | 118 | `ChunkOptions`, `semanticChunk(text: string, maxLength?: number): string` | **P0** |
| 6 | `shared/embeddings/profile.ts` | 78 | `EmbeddingProfile` class (already well-structured) | **P0** |
| 7 | `shared/embeddings/providers/hf-local.ts` | 242 | `HfLocalProvider` class implementing `IEmbeddingProvider` | **P0** |
| 8 | `shared/embeddings/providers/openai.ts` | 257 | `OpenAIProvider` class, `ModelDimensions` | **P0** |
| 9 | `shared/embeddings/providers/voyage.ts` | 275 | `VoyageProvider` class, `ModelDimensions` | **P0** |
| 10 | `shared/embeddings/factory.ts` | 370 | `ProviderConfig`, `createEmbeddingsProvider()` | **P0** |
| 11 | `shared/embeddings.ts` | 585 | Facade types, `EmbeddingResult`, cache types | **P0** |
| 12 | `shared/trigger-extractor.ts` | 686 | `TriggerConfig`, `TriggerPhrase`, `ExtractionStats` | **P0** |

**Total: 12 files (1 new + 11 conversions)**

---

## 4. Central Type Definitions (`shared/types.ts`)

This NEW file serves as the single source of truth for cross-workspace types (Decision D7).

### Interface Definitions

```typescript
// Embedding Provider Interface (Keep I prefix per Decision D5)
export interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  batchEmbed(texts: string[]): Promise<number[][]>;
  embedQuery(text: string): Promise<number[]>;
  embedDocument(text: string): Promise<number[]>;
  getDimension(): number;
  getModelName(): string;
  getProfile(): EmbeddingProfile;
  isReady(): boolean;
}

// Vector Store Interface (Keep I prefix per Decision D5)
export interface IVectorStore {
  search(embedding: number[], options?: SearchOptions): Promise<SearchResult[]>;
  upsert(id: string, embedding: number[], metadata: Record<string, unknown>): Promise<void>;
  delete(id: string): Promise<boolean>;
  get(id: string): Promise<MemoryRecord | null>;
  getStats(): Promise<StoreStats>;
  isAvailable(): boolean;
  getEmbeddingDimension(): number;
  close(): void;
}

// Core Data Types
export interface EmbeddingProfile {
  provider: string;
  model: string;
  dimension: number;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
  content?: string;
}

export interface MemoryRecord {
  id: string;
  title: string;
  content: string;
  triggers: string[];
  importance: number;
  created: string;
  lastAccessed?: string;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  filters?: Record<string, unknown>;
  anchors?: string[];
}

export interface StoreStats {
  totalMemories: number;
  totalEmbeddings: number;
  dimensions: number;
}

// Retry Configuration Types
export interface RetryConfig {
  maxRetries?: number;
  backoffMs?: number[];
  timeoutMs?: number;
}

export type ErrorClassification = 'transient' | 'permanent';

export type BackoffSequence = readonly number[];

// Folder Scoring Types
export interface FolderScore {
  folder: string;
  score: number;
  memoryCount: number;
  avgImportance: number;
  lastModified: string;
}

export type RankingMode = 'composite' | 'recency' | 'importance' | 'volume';

export interface ArchivePattern {
  pattern: RegExp;
  reason: string;
}
```

---

## 5. Conversion Patterns

### File Conversion Checklist

For each `.js` file:
1. Rename to `.ts`
2. Replace `require()` → `import` (source), compiled output stays CommonJS
3. Replace `module.exports` → `export` (source), compiled keeps `exports.`
4. Add type annotations to function parameters and return types
5. Convert JSDoc `@param {Type}` to TypeScript type annotations
6. Convert JS "interfaces" (abstract classes with `throw`) to TypeScript `interface`
7. Import types from `shared/types.ts` where applicable
8. Run `tsc --noEmit` to verify types
9. Run existing tests against compiled output

### Export Alias Preservation

**CRITICAL:** The shared layer has backward-compatible snake_case aliases. These MUST be preserved.

Example from `embeddings.ts`:
```typescript
// Modern camelCase export
export async function embedText(text: string): Promise<number[]> { ... }

// Backward-compatible snake_case alias
export const embed_text = embedText;
```

---

## 6. Agent Allocation (Session 2)

From the master plan's Session 2 allocation:

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | shared/utils/ + chunking.ts + profile.ts | 5 files |
| Agent 2 | shared/embeddings/providers/ (all 3) | 3 files |
| Agent 3 | shared/embeddings.ts + factory.ts + trigger-extractor.ts | 3 files |

---

## 7. Quality Gates

### Compilation

- [ ] `tsc --build shared` completes with 0 errors
- [ ] All `.ts` files compile to `.js` in same directory
- [ ] No `any` in exported function signatures
- [ ] All public functions have explicit return type annotations

### Tests

- [ ] All downstream tests (mcp_server + scripts) pass against compiled shared/
- [ ] Re-export stubs in mcp_server/ and scripts/ resolve correctly
- [ ] Compiled `.js` output is functionally identical to original

### Exports

- [ ] All camelCase exports present
- [ ] All snake_case export aliases preserved
- [ ] Barrel exports (`index.ts`) if needed

---

## 8. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Dynamic ESM import in `hf-local.js` | Use `import()` with proper typing for `@huggingface/transformers` |
| HTTP status code arrays in `retry.js` | Type as `readonly number[]` |
| LRU cache in `embeddings.js` | Type as `Map<string, number[]>` with generic |
| Regex patterns in `trigger-extractor.js` | Type as `readonly RegExp[]` |
| Export aliases break | Verify with `grep` that all snake_case aliases exist |

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| TypeScript strict errors | 0 |
| Compilation time | < 5 seconds for shared/ only |
| Test pass rate | 100% (all downstream tests) |
| Export preservation | All 50+ exports (camelCase + snake_case) present |
| `any` usage in public API | 0 |

---

## 10. Verification Checklist

From master `checklist.md` Phase 3 section:

- [ ] CHK-060 [P0] `shared/types.ts` created with all cross-workspace interfaces
- [ ] CHK-061 [P0] `shared/utils/path-security.ts` compiles, exports correct
- [ ] CHK-062 [P0] `shared/utils/retry.ts` compiles, exports correct
- [ ] CHK-063 [P0] `shared/scoring/folder-scoring.ts` compiles, exports correct
- [ ] CHK-064 [P0] `shared/chunking.ts` compiles, exports correct
- [ ] CHK-065 [P0] `shared/embeddings/profile.ts` compiles, class typed
- [ ] CHK-066 [P0] `shared/embeddings/providers/hf-local.ts` implements `IEmbeddingProvider`
- [ ] CHK-067 [P0] `shared/embeddings/providers/openai.ts` implements `IEmbeddingProvider`
- [ ] CHK-068 [P0] `shared/embeddings/providers/voyage.ts` implements `IEmbeddingProvider`
- [ ] CHK-069 [P0] `shared/embeddings/factory.ts` compiles, exports `createEmbeddingsProvider`
- [ ] CHK-070 [P0] `shared/embeddings.ts` compiles, all 25+ exports preserved
- [ ] CHK-071 [P0] `shared/trigger-extractor.ts` compiles, all exports preserved
- [ ] CHK-072 [P0] `tsc --build shared` — 0 errors
- [ ] CHK-073 [P0] All downstream tests pass
- [ ] CHK-074 [P0] No `any` in exported function signatures
- [ ] CHK-075 [P1] All public functions have explicit return types

---

## 11. Next Steps

After Phase 3 completion:
- **SYNC-004:** Phase 3 complete — Shared foundation in TypeScript. All downstream modules can import typed shared/.
- Proceed to Phase 4: Convert `mcp_server/` foundation layers (34 files)

---

## Cross-References

- **Parent Plan**: `../plan.md` (lines 189-234)
- **Tasks**: `tasks.md` (T030-T042)
- **Checklist**: `checklist.md` (CHK-060 through CHK-075)
- **Decision Records**: `decision-record.md` (D5: Interface Naming, D7: Central Types File)
