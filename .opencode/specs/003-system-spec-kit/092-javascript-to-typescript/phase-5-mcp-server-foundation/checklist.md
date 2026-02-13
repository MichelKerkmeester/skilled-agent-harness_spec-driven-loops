# Verification Checklist: Phase 4 - Convert mcp_server/ Foundation Layers

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-D
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
  - **Evidence**: [compilation output / test result / file existence]
```

---

## Phase 4: mcp_server/ Foundation Verification

### Sub-Layer Compilation

- [ ] CHK-080 [P0] `lib/utils/` (4 files) — all compile, barrel exports resolve
  - **Evidence**:
  - `format-helpers.ts`: `formatAgeString` exported
  - `token-budget.ts`: `TOKEN_CONFIG`, `estimateTokens`, `truncateToTokenLimit` exported
  - `retry.ts` stub: re-exports from `shared/utils/retry`
  - `path-security.ts` stub: re-exports from `shared/utils/path-security`
  - `index.ts`: all 4 modules exported correctly

- [ ] CHK-081 [P0] `lib/errors/` (4 files) — `MemoryError` class typed, `ErrorCode` enum defined
  - **Evidence**:
  - `recovery-hints.ts`: `ERROR_CODES` const object, `RECOVERY_HINTS` record, `getRecoveryHint` typed
  - `core.ts`: `MemoryError` class extends `Error` with typed `code: ErrorCode`
  - `core.ts`: `ErrorCode` enum or string union defined
  - `core.ts`: `buildErrorResponse` fully typed
  - `index.ts` barrel: all error exports resolve
  - `errors.ts` re-export wrapper: resolves `lib/errors/index`

- [ ] CHK-082 [P0] `lib/interfaces/` (3 files) — JS abstract classes → proper TS interfaces/abstract classes
  - **Evidence**:
  - `embedding-provider.ts`: `IEmbeddingProvider` as proper interface OR imported from `shared/types`
  - `embedding-provider.ts`: `MockEmbeddingProvider` class compiles, implements interface
  - `vector-store.ts`: `IVectorStore` as proper interface OR imported from `shared/types`
  - `vector-store.ts`: `MockVectorStore` class compiles, implements interface
  - `index.ts`: both interfaces/mocks exported

- [ ] CHK-083 [P0] `lib/config/` (3 files) — `MemoryType` interface, type inference typed
  - **Evidence**:
  - `memory-types.ts`: `MemoryType` interface defined (name, halfLifeDays, pathPatterns, keywords)
  - `memory-types.ts`: `MemoryTypeName` string union defined
  - `memory-types.ts`: `MEMORY_TYPES` as `Record<MemoryTypeName, MemoryType>`
  - `type-inference.ts`: `inferMemoryType` fully typed
  - `type-inference.ts`: `TIER_TO_TYPE_MAP` as `Record<string, MemoryTypeName>`
  - `index.ts`: all config exports resolve

- [ ] CHK-084 [P0] `lib/scoring/` (6 files) — composite scoring, importance tiers fully typed
  - **Evidence**:
  - `scoring.ts`: `DecayConfig` interface, `calculateDecayScore` typed
  - `composite-scoring.ts`: `FiveFactorWeights` interface defined
  - `composite-scoring.ts`: All 5 factor functions typed (temporal, usage, importance, pattern, citation)
  - `confidence-tracker.ts`: `trackFeedback`, `isPromotionEligible` typed
  - `importance-tiers.ts`: `ImportanceTier` type defined
  - `importance-tiers.ts`: `IMPORTANCE_TIERS` as `Record<ImportanceTier, TierConfig>`
  - `folder-scoring.ts` stub: re-exports from `shared/scoring/folder-scoring`
  - `index.ts`: all scoring exports resolve

- [ ] CHK-085 [P0] `lib/response/` (2 files) — `MCPResponse<T>` generic envelope working
  - **Evidence**:
  - `envelope.ts`: `MCPResponse<T>` generic type defined
  - `envelope.ts`: `ResponseEnvelope<T>` interface defined
  - `envelope.ts`: `createMCPSuccessResponse<T>` fully typed
  - `envelope.ts`: `createMCPErrorResponse` typed with `MCPResponse<never>`
  - `index.ts`: all response exports resolve

- [ ] CHK-086 [P1] `lib/architecture/` (3 files) — layer definitions typed
  - **Evidence**:
  - `layer-definitions.ts`: `Layer` interface defined (id, name, tokenBudget, description)
  - `layer-definitions.ts`: `LAYERS` as `Record<string, Layer>`
  - `layer-definitions.ts`: `TOOL_LAYER_MAP` as `Record<string, string>`
  - `index.ts`: all architecture exports resolve

- [ ] CHK-087 [P0] `lib/validation/` (2 files) — preflight checks typed
  - **Evidence**:
  - `preflight.ts`: `PreflightResult` type defined (passed, errors, warnings)
  - `preflight.ts`: `PreflightConfig` interface defined
  - `preflight.ts`: `PreflightError` class extends `Error`
  - `preflight.ts`: `runPreflight` function fully typed
  - `index.ts`: all validation exports resolve

- [ ] CHK-088 [P0] `lib/parsing/` (5 files) — `ParsedMemory` interface, trigger matching typed
  - **Evidence**:
  - `memory-parser.ts`: `ParsedMemory` interface defined (title, content, metadata, anchors, triggers, causalLinks)
  - `memory-parser.ts`: `MemoryMetadata` interface defined
  - `memory-parser.ts`: `parseMemoryFile` fully typed
  - `memory-parser.ts`: Content hash computation typed
  - `trigger-matcher.ts`: `TriggerMatch` interface defined
  - `trigger-matcher.ts`: `matchTriggerPhrases` fully typed
  - `trigger-matcher.ts`: Regex cache management typed
  - `entity-scope.ts`: `ContextType` string union defined
  - `entity-scope.ts`: `detectContextType` fully typed
  - `trigger-extractor.ts` stub: re-exports from `shared/trigger-extractor`
  - `index.ts`: all parsing exports resolve

- [ ] CHK-089 [P0] `formatters/` (3 files) — search results, token metrics typed
  - **Evidence**:
  - `token-metrics.ts`: `TokenMetrics` interface defined
  - `token-metrics.ts`: All token metric functions typed
  - `search-results.ts`: `FormattedSearchResult` interface defined
  - `search-results.ts`: Formatting functions fully typed
  - `index.ts`: all formatter exports resolve

- [ ] CHK-090 [P0] `utils/` top-level (4 files) — validators, batch processor typed
  - **Evidence**:
  - `validators.ts`: `InputLimits` interface defined
  - `validators.ts`: All validator functions typed
  - `json-helpers.ts`: `JsonParseResult` type defined
  - `json-helpers.ts`: JSON helper functions typed
  - `batch-processor.ts`: `BatchOptions` interface defined
  - `batch-processor.ts`: Batch processing functions typed
  - `index.ts`: all utils exports resolve

- [ ] CHK-091 [P0] `core/` (3 files) — config constants, db-state typed
  - **Evidence**:
  - `config.ts`: `ServerConfig` interface defined
  - `config.ts`: All path constants typed
  - `config.ts`: Batch config, rate limiting, query limits typed
  - `db-state.ts`: `DatabaseState` interface defined
  - `db-state.ts`: `ConstitutionalCache` type defined
  - `db-state.ts`: Database state management functions typed
  - `index.ts`: all core exports resolve

---

## Phase 4 Quality Gate

- [ ] CHK-092 [P0] All 34 files compile: `tsc --build mcp_server` (foundation only) — 0 errors
  - **Evidence**:
  - Compilation output shows 0 errors
  - All 12 sub-layers (4a through 4l) compile successfully
  - `.d.ts` declaration files generated for all modules

- [ ] CHK-093 [P0] All barrel `index.ts` files export correctly — import chain verified
  - **Evidence**:
  - Can import from each `index.ts` without errors
  - Re-export chains resolve (e.g., `lib/errors.ts` → `lib/errors/index.ts` → `lib/errors/core.ts`)
  - Test imports from barrels compile successfully

- [ ] CHK-094 [P1] No cross-layer circular imports within mcp_server/lib/
  - **Evidence**:
  - `tsc --build` completes without circular dependency warnings
  - Dependency graph inspection shows clean DAG within lib/
  - Each sub-layer only depends on shared/ or earlier sub-layers within Phase 4

---

## Type Quality Checks

- [ ] CHK-095 [P0] No `any` in public API function signatures (foundation layers)
  - **Evidence**:
  - `grep -rn ': any' mcp_server/lib/ mcp_server/formatters/ mcp_server/utils/ mcp_server/core/ | grep -v test | grep -v node_modules` — minimal/zero results
  - All exported functions have explicit type annotations

- [ ] CHK-096 [P1] All public functions have explicit return type annotations
  - **Evidence**:
  - Spot-checked 20+ public functions across sub-layers
  - Return types explicitly stated (not inferred)

- [ ] CHK-097 [P1] Enums/string unions used for discriminated types
  - **Evidence**:
  - `ErrorCode` defined as enum or string union
  - `MemoryTypeName` defined as string union
  - `ImportanceTier` defined as string union
  - `ContextType` defined as string union

---

## Re-Export Stub Verification

- [ ] CHK-098 [P0] `lib/utils/retry.ts` stub correctly re-exports `shared/utils/retry`
  - **Evidence**:
  - Import from `mcp_server/lib/utils/retry` resolves to shared/
  - No compilation errors in dependent modules

- [ ] CHK-099 [P0] `lib/utils/path-security.ts` stub correctly re-exports `shared/utils/path-security`
  - **Evidence**:
  - Import from `mcp_server/lib/utils/path-security` resolves to shared/
  - No compilation errors in dependent modules

- [ ] CHK-100 [P0] `lib/scoring/folder-scoring.ts` stub correctly re-exports `shared/scoring/folder-scoring`
  - **Evidence**:
  - Import from `mcp_server/lib/scoring/folder-scoring` resolves to shared/
  - No compilation errors in dependent modules

- [ ] CHK-101 [P0] `lib/parsing/trigger-extractor.ts` stub correctly re-exports `shared/trigger-extractor`
  - **Evidence**:
  - Import from `mcp_server/lib/parsing/trigger-extractor` resolves to shared/
  - No compilation errors in dependent modules

---

## Dependency Verification

- [ ] CHK-102 [P0] All imports from `shared/` resolve correctly
  - **Evidence**:
  - `shared/types.ts` imports work in lib/interfaces/
  - `shared/utils/retry` imports work in lib/utils/ stub
  - `shared/utils/path-security` imports work in lib/utils/ stub
  - `shared/scoring/folder-scoring` imports work in lib/scoring/ stub
  - `shared/trigger-extractor` imports work in lib/parsing/ stub

- [ ] CHK-103 [P0] No imports from Phase 5 upper layers (not yet converted)
  - **Evidence**:
  - Foundation layers do not import from lib/cognitive/, lib/search/, lib/storage/, etc.
  - Dependency graph shows foundation layers are self-contained + shared/

---

## Backward Compatibility

- [ ] CHK-104 [P1] Compiled `.js` output maintains original export structure
  - **Evidence**:
  - Existing consumers can still `require()` compiled modules
  - Export names unchanged (no breaking renames)

- [ ] CHK-105 [P1] Re-export stubs provide backward compatibility
  - **Evidence**:
  - Old import paths still work (e.g., `require('mcp_server/lib/utils/retry')`)
  - No breaking changes for downstream modules

---

## Completion Criteria

- [ ] All sub-layer checks (CHK-080 through CHK-091) verified with evidence
- [ ] Quality gate checks (CHK-092 through CHK-094) passed
- [ ] All tasks T050–T092 marked `[x]` in tasks.md
- [ ] Phase 4 SYNC-005 checkpoint reached

---

## Cross-References

- **Phase 4 Plan:** `plan.md`
- **Phase 4 Tasks:** `tasks.md` (T050–T092)
- **Parent Checklist:** `../checklist.md` (CHK-080–CHK-094)
- **Decisions:** `../decision-record.md` (D1: CommonJS, D2: In-place, D3: Strict, D7: Central types)
