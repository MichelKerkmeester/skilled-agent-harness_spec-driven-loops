# Verification Checklist: Phase 3 — Convert shared/ Foundation Layer

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-C
> **Session:** 2

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence / screenshot]
```

---

## Phase 3: shared/ Conversion Verification

### Type System Foundation

- [ ] CHK-060 [P0] `shared/types.ts` created with all cross-workspace interfaces
  - **Evidence**:
  - `IEmbeddingProvider` interface (10+ methods typed)
  - `IVectorStore` interface (8+ methods typed)
  - `SearchResult`, `MemoryRecord`, `SearchOptions` types defined
  - `RetryConfig`, `FolderScore`, `RankingMode` types defined

### File-by-File Conversion

- [ ] CHK-061 [P0] `shared/utils/path-security.ts` — compiles, exports `validateFilePath`, `escapeRegex`
  - **Evidence**:

- [ ] CHK-062 [P0] `shared/utils/retry.ts` — compiles, exports `retryWithBackoff`, `withRetry`, `classifyError`
  - **Evidence**:

- [ ] CHK-063 [P0] `shared/scoring/folder-scoring.ts` — compiles, exports `calculateFolderScores`, `rankFolders`
  - **Evidence**:

- [ ] CHK-064 [P0] `shared/chunking.ts` — compiles, exports `semanticChunk`, constants
  - **Evidence**:

- [ ] CHK-065 [P0] `shared/embeddings/profile.ts` — compiles, `EmbeddingProfile` class typed
  - **Evidence**:

- [ ] CHK-066 [P0] `shared/embeddings/providers/hf-local.ts` — compiles, implements `IEmbeddingProvider`
  - **Evidence**:

- [ ] CHK-067 [P0] `shared/embeddings/providers/openai.ts` — compiles, implements `IEmbeddingProvider`
  - **Evidence**:

- [ ] CHK-068 [P0] `shared/embeddings/providers/voyage.ts` — compiles, implements `IEmbeddingProvider`
  - **Evidence**:

- [ ] CHK-069 [P0] `shared/embeddings/factory.ts` — compiles, exports `createEmbeddingsProvider`
  - **Evidence**:

- [ ] CHK-070 [P0] `shared/embeddings.ts` — compiles, all 25+ exports preserved (camelCase + snake_case)
  - **Evidence**:

- [ ] CHK-071 [P0] `shared/trigger-extractor.ts` — compiles, all exports preserved (camelCase + snake_case)
  - **Evidence**:

### Phase 3 Quality Gate

- [ ] CHK-072 [P0] `tsc --build shared` — 0 errors, 0 warnings
  - **Evidence**:

- [ ] CHK-073 [P0] All downstream tests (mcp_server + scripts) still pass against compiled shared/
  - **Evidence**:

- [ ] CHK-074 [P0] No `any` in exported function signatures in shared/
  - **Evidence**:

- [ ] CHK-075 [P1] All public functions have explicit return type annotations
  - **Evidence**:

---

## Export Preservation Verification

### Critical Exports (Must Preserve Both Styles)

#### embeddings.ts

**Modern (camelCase):**
- [ ] `embedText(text: string): Promise<number[]>`
- [ ] `embedBatch(texts: string[]): Promise<number[][]>`
- [ ] `getEmbeddingDimension(): number`
- [ ] `isEmbeddingsReady(): Promise<boolean>`
- [ ] `embedQuery(query: string): Promise<number[]>`
- [ ] `embedDocument(doc: string): Promise<number[]>`

**Backward-compatible (snake_case):**
- [ ] `embed_text` (alias of `embedText`)
- [ ] `embed_batch` (alias of `embedBatch`)
- [ ] `get_embedding_dimension` (alias of `getEmbeddingDimension`)
- [ ] `is_embeddings_ready` (alias of `isEmbeddingsReady`)
- [ ] `embed_query` (alias of `embedQuery`)
- [ ] `embed_document` (alias of `embedDocument`)

**Evidence**:

#### trigger-extractor.ts

**Modern (camelCase):**
- [ ] `extractTriggers(content: string, config?: TriggerConfig): TriggerPhrase[]`
- [ ] `scoreTrigger(phrase: string, context: string): number`

**Backward-compatible (snake_case):**
- [ ] `extract_triggers` (alias)
- [ ] `score_trigger` (alias)

**Evidence**:

---

## Type Safety Verification

### Interface Compliance

- [ ] CHK-076 [P0] All provider classes (`HfLocalProvider`, `OpenAIProvider`, `VoyageProvider`) implement `IEmbeddingProvider`
  - **Evidence**:

- [ ] CHK-077 [P0] `createEmbeddingsProvider()` return type is `Promise<IEmbeddingProvider>`
  - **Evidence**:

### Strict Mode Compliance

- [ ] CHK-078 [P0] No implicit `any` types
  - **Evidence**: `tsc --noImplicitAny` passes

- [ ] CHK-079 [P0] Strict null checks pass
  - **Evidence**: `tsc --strictNullChecks` passes

- [ ] CHK-080 [P1] All function parameters have explicit types
  - **Evidence**:

---

## Build Verification

### Compilation

- [ ] CHK-081 [P0] `tsc --build shared` completes in < 5 seconds
  - **Evidence**:

- [ ] CHK-082 [P0] All `.ts` files compile to `.js` in same directory (in-place compilation)
  - **Evidence**:

- [ ] CHK-083 [P0] All compiled `.js` files are valid CommonJS modules
  - **Evidence**:

### Project References

- [ ] CHK-084 [P0] `mcp_server/tsconfig.json` can reference `../shared` without errors
  - **Evidence**:

- [ ] CHK-085 [P0] `scripts/tsconfig.json` can reference `../shared` without errors
  - **Evidence**:

---

## Test Verification

### Downstream Test Compatibility

- [ ] CHK-086 [P0] All MCP server tests pass against compiled shared/
  - **Evidence**: `npm run test:mcp` (if available) or full test suite

- [ ] CHK-087 [P0] All scripts tests pass against compiled shared/
  - **Evidence**: `npm run test:cli` (if available) or full test suite

- [ ] CHK-088 [P0] Re-export stubs in `mcp_server/lib/utils/retry.js` resolve correctly
  - **Evidence**:

- [ ] CHK-089 [P0] Re-export stubs in `mcp_server/lib/utils/path-security.js` resolve correctly
  - **Evidence**:

- [ ] CHK-090 [P0] Re-export stubs in `mcp_server/lib/scoring/folder-scoring.js` resolve correctly
  - **Evidence**:

---

## Code Quality Verification

### TypeScript Standards (from Phase 0)

- [ ] CHK-091 [P1] File headers present on all `.ts` files
  - **Evidence**:

- [ ] CHK-092 [P1] PascalCase naming for interfaces/types/enums
  - **Evidence**:

- [ ] CHK-093 [P1] camelCase naming for functions/variables
  - **Evidence**:

- [ ] CHK-094 [P2] Import ordering: Node built-ins → third-party → local modules → type-only imports
  - **Evidence**:

---

## Risk Mitigation Verification

### Dynamic ESM Import (hf-local.ts)

- [ ] CHK-095 [P0] `@huggingface/transformers` dynamic import properly typed
  - **Evidence**:

### HTTP Status Codes (retry.ts)

- [ ] CHK-096 [P0] Status code arrays typed as `readonly number[]`
  - **Evidence**:

### LRU Cache (embeddings.ts)

- [ ] CHK-097 [P0] Cache typed as `Map<string, number[]>`
  - **Evidence**:

### Regex Patterns (trigger-extractor.ts)

- [ ] CHK-098 [P0] Regex arrays typed as `readonly RegExp[]`
  - **Evidence**:

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Type System | 1 | /1 | 1 P0 |
| File Conversion | 11 | /11 | 11 P0 |
| Quality Gate | 4 | /4 | 3 P0, 1 P1 |
| Export Preservation | 12 | /12 | All critical |
| Type Safety | 5 | /5 | 3 P0, 2 P1 |
| Build | 5 | /5 | 4 P0, 1 P1 |
| Test | 5 | /5 | 5 P0 |
| Code Quality | 4 | /4 | 2 P1, 2 P2 |
| Risk Mitigation | 4 | /4 | 4 P0 |
| **TOTAL** | **51** | **/51** | |

**Verification Date**: ________________

---

## Completion Criteria

Phase 3 is complete when:

- [ ] All 51 checklist items verified
- [ ] No P0 items unresolved
- [ ] `tsc --build shared` passes with 0 errors
- [ ] All downstream tests pass
- [ ] All export aliases preserved

---

## Cross-References

- **Parent Checklist**: `../checklist.md` (CHK-060 through CHK-075)
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Decisions**: `decision-record.md`
