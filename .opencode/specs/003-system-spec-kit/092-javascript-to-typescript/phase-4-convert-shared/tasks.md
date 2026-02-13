# Tasks: Phase 3 — Convert shared/ Foundation Layer

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-C
> **Session:** 2

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format:**
```
T### [W-X] [P?] Description (file path) [effort] {deps: T###}
```

---

## Phase 3: Convert shared/ (Foundation Layer)

> **Goal:** Convert the foundational shared layer. All other code depends on this.
> **Workstream:** W-C
> **Effort:** 9 existing files + 1 new types.ts + 2 new util dirs = ~2,800 lines

### Central Type Definitions

- [ ] T030 [W-C] Create `shared/types.ts` — central cross-workspace type definitions [2h] {deps: T027}
  - `IEmbeddingProvider` interface (10 methods: embed, batchEmbed, embedQuery, embedDocument, getDimension, getModelName, getProfile, isReady, etc.)
  - `IVectorStore` interface (8 methods: search, upsert, delete, get, getStats, isAvailable, getEmbeddingDimension, close)
  - `EmbeddingProfile` type (provider, model, dimension)
  - `SearchResult` type (id, score, metadata, content)
  - `MemoryRecord` type (id, title, content, triggers, importance, timestamps)
  - `SearchOptions` type (limit, threshold, filters, anchors)
  - `StoreStats` type (totalMemories, totalEmbeddings, dimensions)
  - `RetryConfig`, `ErrorClassification`, `BackoffSequence` types
  - `FolderScore`, `RankingMode`, `ArchivePattern` types

### Utility Modules (moved in Phase 2, now converting to TS)

- [ ] T031 [W-C] Convert `shared/utils/path-security.ts` [30m] {deps: T030}
  - Add types: `validateFilePath(filePath: string, allowedPaths: string[]): boolean`
  - Add types: `escapeRegex(str: string): string`
  - Replace `require('path')` → `import path from 'path'`

- [ ] T032 [W-C] [P] Convert `shared/utils/retry.ts` [1h] {deps: T030}
  - Define `RetryConfig` interface (maxRetries, backoffMs[], timeoutMs)
  - Define `ErrorClassification` type (transient | permanent)
  - Type `retryWithBackoff<T>(fn: () => Promise<T>, config?: RetryConfig): Promise<T>`
  - Type HTTP status code arrays as `readonly number[]`
  - Replace `module.exports` → named exports

- [ ] T033 [W-C] [P] Convert `shared/scoring/folder-scoring.ts` [1h] {deps: T030}
  - Define `FolderScore`, `RankingMode` types
  - Type scoring constants: `TIER_WEIGHTS`, `SCORE_WEIGHTS`, `DECAY_RATE`
  - Type `calculateFolderScores(memories: MemoryRecord[]): FolderScore[]`
  - Type `rankFolders(scores: FolderScore[], mode: RankingMode): FolderScore[]`

### Embedding System

- [ ] T034 [W-C] Convert `shared/chunking.ts` [30m] {deps: T030}
  - Type `semanticChunk(text: string, maxLength?: number): string`
  - Type constants: `MAX_TEXT_LENGTH`, `RESERVED_OVERVIEW`, `RESERVED_OUTCOME`, `MIN_SECTION_LENGTH`

- [ ] T035 [W-C] Convert `shared/embeddings/profile.ts` [30m] {deps: T030}
  - Type `EmbeddingProfile` class with constructor signature
  - Type `createProfileSlug(profile: EmbeddingProfile): string`
  - Type `parseProfileSlug(slug: string): EmbeddingProfile`

- [ ] T036 [W-C] Convert `shared/embeddings/providers/hf-local.ts` [1h] {deps: T030, T034, T035}
  - `HfLocalProvider` class implements `IEmbeddingProvider`
  - Type `TASK_PREFIX` record
  - Handle dynamic ESM import of `@huggingface/transformers` with proper typing
  - Type device detection (MPS, CPU) and health tracking

- [ ] T037 [W-C] [P] Convert `shared/embeddings/providers/openai.ts` [1h] {deps: T030, T032, T035}
  - `OpenAIProvider` class implements `IEmbeddingProvider`
  - Type `MODEL_DIMENSIONS` as `Record<string, number>`
  - Type HTTP response interfaces
  - Type retry integration with imported `RetryConfig`

- [ ] T038 [W-C] [P] Convert `shared/embeddings/providers/voyage.ts` [1h] {deps: T030, T032, T035}
  - `VoyageProvider` class implements `IEmbeddingProvider`
  - Type `MODEL_DIMENSIONS` as `Record<string, number>`
  - Type Voyage-specific `input_type` parameter
  - Type cost tracking interfaces

- [ ] T039 [W-C] Convert `shared/embeddings/factory.ts` [1h] {deps: T036, T037, T038}
  - Type `ProviderConfig` (provider name, API key, model)
  - Type `createEmbeddingsProvider(config?: ProviderConfig): Promise<IEmbeddingProvider>`
  - Type `resolveProvider(): ProviderConfig`
  - Type `validateApiKey(provider: string, key: string): Promise<boolean>`

- [ ] T040 [W-C] Convert `shared/embeddings.ts` (facade) [1.5h] {deps: T039}
  - Type LRU cache with generic: `Map<string, number[]>`
  - Type all 25+ exported functions with proper signatures
  - Type lazy singleton pattern with `Promise<IEmbeddingProvider>`
  - Type batch processing with rate limiting
  - Preserve all camelCase + snake_case export aliases

- [ ] T041 [W-C] Convert `shared/trigger-extractor.ts` [1.5h] {deps: T030}
  - Define `TriggerConfig` interface
  - Define `TriggerPhrase` type (phrase, score, source)
  - Define `ExtractionStats` type
  - Type all NLP pipeline functions (tokenize, filterStopWords, extractNgrams, etc.)
  - Type regex patterns as `readonly RegExp[]`
  - Preserve camelCase + snake_case export aliases

### Verification

- [ ] T042 [W-C] Verify shared/ compilation and test pass [30m] {deps: T031-T041}
  - `tsc --build shared` compiles with 0 errors
  - All tests importing from shared/ still pass
  - Compiled `.js` output is functionally identical to original
  - All re-export stubs in mcp_server/ and scripts/ resolve correctly

>>> SYNC-004: Phase 3 complete — Shared foundation in TypeScript. All downstream modules can import typed shared/. <<<

---

## Completion Criteria

- [ ] All 13 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `tsc --build shared` — 0 errors
- [ ] All downstream tests pass (100%)
- [ ] All export aliases preserved (camelCase + snake_case)

---

## Agent Execution Protocol

### Pre-Task Checklist

1. [ ] Load `plan.md` and verify conversion order
2. [ ] Load `checklist.md` and identify relevant P0 items
3. [ ] Check for blocking issues in `decision-record.md`
4. [ ] Verify task dependencies satisfied
5. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order (T030 first, then utilities, then embedding system) |
| TASK-SCOPE | Stay within task boundary — no scope creep to adjacent modules |
| TASK-VERIFY | Verify each task: file compiles, exports match, tests pass |
| TASK-DOC | Update task status immediately on completion (`[x]`) |
| TASK-PARALLEL | Tasks marked `[P]` can run simultaneously (T032/T033, T037/T038) |

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Workstream**: W-C
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Compilation output / test results / file list]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

---

## Cross-References

- **Parent Tasks**: `../tasks.md` (T030-T042)
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
