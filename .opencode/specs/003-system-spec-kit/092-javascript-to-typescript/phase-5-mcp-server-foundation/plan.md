# Plan: Phase 4 - Convert mcp_server/ Foundation Layers

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-D
> **Session:** 2
> **Agent Allocation:** Agents 4-10
> **Estimated Effort:** 34 files across 12 sub-layers, ~8,500 lines

---

## Overview

**Goal:** Convert bottom-up from leaf modules to avoid cascading type errors.

**Strategy:** Convert the 12 foundation layers of `mcp_server/` in dependency order. Each layer represents a complete module boundary with minimal inter-dependencies. Layers 4a–4h can be parallelized since they have no dependencies on each other within Phase 4.

**Success Criteria:**
- All 34 files compile with `tsc --build mcp_server`
- All barrel exports resolve correctly
- No type errors in cross-layer imports
- Zero `any` types in public APIs

---

## Conversion Order (12 Sub-Layers)

### Layer 4a: lib/utils/ (4 files)

**Agent:** Agent 4
**Files:**
1. `lib/utils/format-helpers.ts` (44 lines)
2. `lib/utils/token-budget.ts` (99 lines)
3. `lib/utils/retry.ts` (re-export stub)
4. `lib/utils/path-security.ts` (re-export stub)
5. `lib/utils/index.ts` (barrel)

**Key Types:**
- `formatAgeString(isoDate: string): string`
- `TokenConfig` interface
- `estimateTokens(text: string): number`
- `truncateToTokenLimit<T>(items: T[], budget: number): T[]`

**Dependencies:** Phase 3 (shared/) complete

**Parallelizable:** Yes (with 4b–4h)

---

### Layer 4b: lib/errors/ (4 files)

**Agent:** Agent 4
**Files:**
1. `lib/errors/recovery-hints.ts` (852 lines)
2. `lib/errors/core.ts` (283 lines)
3. `lib/errors/index.ts` (barrel)
4. `lib/errors.ts` (re-export wrapper)

**Key Types:**
- `ErrorCode` enum or string union
- `MemoryError` class extends `Error` with typed `code`
- `RecoveryHint` interface
- `ERROR_CODES` as const object
- `buildErrorResponse(code: ErrorCode, message: string, details?: Record<string, unknown>): ErrorResponse`

**Dependencies:** Phase 3 complete

**Parallelizable:** Yes (with 4a, 4c–4h)

---

### Layer 4c: lib/interfaces/ (3 files)

**Agent:** Agent 5
**Files:**
1. `lib/interfaces/embedding-provider.ts` (230 lines)
2. `lib/interfaces/vector-store.ts` (192 lines)
3. `lib/interfaces/index.ts` (barrel)

**Key Types:**
- Convert JS abstract classes → proper TypeScript `abstract class` OR import from `shared/types.ts`
- `IEmbeddingProvider` interface (if not importing)
- `IVectorStore` interface (if not importing)
- `MockEmbeddingProvider` class (concrete test implementation)
- `MockVectorStore` class (concrete test implementation)

**Dependencies:** `shared/types.ts` (Phase 3)

**Parallelizable:** Yes (with 4a, 4b, 4d–4h)

---

### Layer 4d: lib/config/ (3 files)

**Agent:** Agent 5
**Files:**
1. `lib/config/memory-types.ts` (323 lines)
2. `lib/config/type-inference.ts` (310 lines)
3. `lib/config/index.ts` (barrel)

**Key Types:**
- `MemoryType` interface (name, halfLifeDays, pathPatterns, keywords)
- `MemoryTypeName` string union: `'constitutional' | 'critical' | 'implementation' | ...`
- `MEMORY_TYPES` as `Record<MemoryTypeName, MemoryType>`
- `inferMemoryType(filePath: string, content: string, tier?: string): MemoryTypeName`
- `TIER_TO_TYPE_MAP` as `Record<string, MemoryTypeName>`

**Dependencies:** Phase 3 complete

**Parallelizable:** Yes (with 4a–4c, 4e–4h)

---

### Layer 4e: lib/scoring/ (6 files)

**Agent:** Agent 6
**Files:**
1. `lib/scoring/scoring.ts` (162 lines)
2. `lib/scoring/composite-scoring.ts` (459 lines)
3. `lib/scoring/confidence-tracker.ts` (229 lines)
4. `lib/scoring/importance-tiers.ts` (206 lines)
5. `lib/scoring/folder-scoring.ts` (re-export stub → shared/)
6. `lib/scoring/index.ts` (barrel)

**Key Types:**
- `DecayConfig` interface
- `calculateDecayScore(similarity: number, ageDays: number, config?: DecayConfig): number`
- `FiveFactorWeights` interface (temporal, usage, importance, pattern, citation)
- `ImportanceTier` type: `'constitutional' | 'critical' | 'important' | 'normal' | 'temporary' | 'deprecated'`
- `IMPORTANCE_TIERS` as `Record<ImportanceTier, TierConfig>`

**Dependencies:** Phase 3 (shared/scoring/folder-scoring.ts)

**Parallelizable:** Yes (with 4a–4d, 4f–4h)

---

### Layer 4f: lib/response/ (2 files)

**Agent:** Agent 6
**Files:**
1. `lib/response/envelope.ts` (189 lines)
2. `lib/response/index.ts` (barrel)

**Key Types:**
- `MCPResponse<T>` generic envelope type
- `ResponseEnvelope<T>` interface
- `createMCPSuccessResponse<T>(data: T, summary: string, hints?: string[]): MCPResponse<T>`
- `createMCPErrorResponse(code: string, message: string): MCPResponse<never>`

**Dependencies:** Phase 3 complete

**Parallelizable:** Yes (with 4a–4e, 4g–4h)

---

### Layer 4g: lib/architecture/ (3 files)

**Agent:** Agent 7
**Files:**
1. `lib/architecture/layer-definitions.ts` (275 lines)
2. `lib/architecture/index.ts` (barrel)

**Key Types:**
- `Layer` interface (id, name, tokenBudget, description)
- `LAYERS` as `Record<string, Layer>`
- `ToolLayerMap` type
- `TOOL_LAYER_MAP` as `Record<string, string>`
- `TokenBudget` type

**Dependencies:** Phase 3 complete

**Parallelizable:** Yes (with 4a–4f, 4h)

---

### Layer 4h: lib/validation/ (2 files)

**Agent:** Agent 7
**Files:**
1. `lib/validation/preflight.ts` (545 lines)
2. `lib/validation/index.ts` (barrel)

**Key Types:**
- `PreflightResult` type (passed: boolean, errors: string[], warnings: string[])
- `PreflightConfig` interface
- `PreflightError` class extends `Error`
- `runPreflight(content: string, config?: PreflightConfig): PreflightResult`

**Dependencies:** Phase 3 complete

**Parallelizable:** Yes (with 4a–4g)

---

### Layer 4i: lib/parsing/ (5 files)

**Agent:** Agent 8
**Files:**
1. `lib/parsing/memory-parser.ts` (664 lines)
2. `lib/parsing/trigger-matcher.ts` (382 lines)
3. `lib/parsing/entity-scope.ts` (160 lines)
4. `lib/parsing/trigger-extractor.ts` (re-export stub → shared/)
5. `lib/parsing/index.ts` (barrel)

**Key Types:**
- `ParsedMemory` interface (title, content, metadata, anchors, triggers, causalLinks)
- `MemoryMetadata` interface
- `parseMemoryFile(filePath: string): ParsedMemory`
- `TriggerMatch` interface
- `matchTriggerPhrases(query: string, triggers: TriggerPhrase[]): TriggerMatch[]`
- `ContextType` string union

**Dependencies:** 4a (format-helpers for path security), shared/trigger-extractor

**Parallelizable:** No (depends on 4a)

---

### Layer 4j: formatters/ (3 files)

**Agent:** Agent 9
**Files:**
1. `formatters/token-metrics.ts` (77 lines)
2. `formatters/search-results.ts` (219 lines)
3. `formatters/index.ts` (barrel)

**Key Types:**
- `TokenMetrics` interface
- `FormattedSearchResult` interface

**Dependencies:** 4a (token-budget), 4i (memory-parser for path security)

**Parallelizable:** Partial (4j can start with 4k in parallel after 4a–4i complete)

---

### Layer 4k: utils/ top-level (4 files)

**Agent:** Agent 9
**Files:**
1. `utils/validators.ts` (157 lines)
2. `utils/json-helpers.ts` (59 lines)
3. `utils/batch-processor.ts` (155 lines)
4. `utils/index.ts` (barrel)

**Key Types:**
- `InputLimits` interface
- `BatchOptions` interface
- `JsonParseResult` type

**Dependencies:** 4b (errors/core for error handling in batch-processor)

**Parallelizable:** Partial (with 4j after 4a–4i)

---

### Layer 4l: core/ (3 files)

**Agent:** Agent 10
**Files:**
1. `core/config.ts` (103 lines)
2. `core/db-state.ts` (225 lines)
3. `core/index.ts` (barrel)

**Key Types:**
- `ServerConfig` interface (all path constants, batch config, rate limiting, query limits)
- `DatabaseState` interface
- `ConstitutionalCache` type

**Dependencies:** Phase 3 complete

**Parallelizable:** Yes (with 4a–4h)

---

## Parallelization Strategy

### Parallel Wave 1 (Agents 4-7, 10)

All independent of each other within Phase 4:
- Agent 4: 4a + 4b (lib/utils/, lib/errors/)
- Agent 5: 4c + 4d (lib/interfaces/, lib/config/)
- Agent 6: 4e + 4f (lib/scoring/, lib/response/)
- Agent 7: 4g + 4h (lib/architecture/, lib/validation/)
- Agent 10: 4l (core/)

**Estimated time:** 2-3 hours

### Parallel Wave 2 (Agents 8-9)

Sequential after Wave 1:
- Agent 8: 4i (lib/parsing/) — depends on 4a
- Agent 9: 4j + 4k (formatters/, utils/) — depends on 4a, 4b, 4i

**Estimated time:** 1-2 hours

---

## File Conversion Pattern (Standard for All Layers)

For each `.js` file:

1. **Rename** `.js` → `.ts`
2. **Replace imports:** `require()` → `import` (source syntax, compiled output remains CommonJS)
3. **Replace exports:** `module.exports` → `export` (source syntax)
4. **Add type annotations:**
   - Function parameters
   - Return types (explicit for public API, can infer for private helpers)
   - Constants and variables where type isn't obvious
5. **Convert JSDoc → TypeScript:**
   - `@param {Type}` → inline parameter type
   - `@returns {Type}` → return type annotation
   - Keep TSDoc for documentation (`@param description`, `@returns description`)
6. **Convert JS "interfaces" → TypeScript:**
   - Abstract classes with `throw new Error()` → proper `interface` or `abstract class`
   - Duck-typed objects → `interface` definitions
7. **Compile:** `tsc --noEmit` to verify types
8. **Test:** Run existing tests against compiled output

---

## Verification Checkpoints

### Per-Layer Verification

After each layer completes:

1. **Compilation:** `tsc --build mcp_server` includes that layer with 0 errors
2. **Barrel exports:** All `index.ts` files export correctly
3. **No `any` in public APIs:** Public function signatures fully typed
4. **Re-exports work:** Stubs to shared/ resolve correctly

### Phase 4 Complete Verification

After all 12 layers:

1. **Full compilation:** `tsc --build mcp_server` — foundation layers, 0 errors
2. **Import graph clean:** No circular dependencies within mcp_server/lib/
3. **All barrel exports resolve:** Import chains verified
4. **Type coverage:** No `any` escapes in public API

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Type errors cascade across layers | Bottom-up conversion order; each layer compiles independently |
| Re-export stubs break | Test after each stub creation; verify import path resolution |
| Generic types too complex | Start with concrete types; generalize only where needed |
| Mock implementations diverge | Keep mocks in interfaces/ files; update alongside real interfaces |
| `__dirname` issues | Using `module: "commonjs"` (Decision D1) preserves `__dirname` |

---

## Dependencies

**Prerequisite:** Phase 3 (shared/) MUST be complete before Phase 4 begins.

**Phase 3 outputs used:**
- `shared/types.ts` — `IEmbeddingProvider`, `IVectorStore`, etc.
- `shared/utils/retry.ts` — re-exported by 4a
- `shared/utils/path-security.ts` — re-exported by 4a
- `shared/scoring/folder-scoring.ts` — re-exported by 4e
- `shared/trigger-extractor.ts` — re-exported by 4i

---

## Success Metrics

- [ ] All 34 files converted from `.js` to `.ts`
- [ ] `tsc --build mcp_server` compiles foundation layers with 0 errors
- [ ] All barrel `index.ts` exports resolve correctly
- [ ] Zero `any` types in public function signatures
- [ ] No circular imports within mcp_server/lib/
- [ ] All tasks T050–T092 marked `[x]`
- [ ] Checklist items CHK-080 through CHK-094 verified

---

## Cross-References

- **Specification:** `../spec.md`
- **Full Plan:** `../plan.md` (Phase 4: lines 237-261)
- **Tasks:** `../tasks.md` (T050–T092)
- **Checklist:** `../checklist.md` (CHK-080–CHK-094)
- **Decisions:** `../decision-record.md` (D1: CommonJS, D2: In-place, D3: Strict, D7: Central types)
