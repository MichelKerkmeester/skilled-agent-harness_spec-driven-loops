# Tasks: Phase 4 - Convert mcp_server/ Foundation Layers

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-D
> **Session:** 2
> **Agent Allocation:** Agents 4-10

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

## Phase 4: Convert mcp_server/ Foundation Layers (34 files)

> **Goal:** Convert bottom-up from leaf modules to avoid cascading type errors.
> **Workstream:** W-D
> **Effort:** 34 files across 12 sub-layers, ~8,500 lines

### Layer 4a: lib/utils/ (4 files)

- [ ] T050 [W-D] Convert `lib/utils/format-helpers.ts` (44 lines) [15m] {deps: T042}
  - Type `formatAgeString(isoDate: string): string`

- [ ] T051 [W-D] [P] Convert `lib/utils/token-budget.ts` (99 lines) [30m] {deps: T042}
  - Type `TOKEN_CONFIG`, `estimateTokens(text: string): number`
  - Type `truncateToTokenLimit<T>(items: T[], budget: number): T[]`

- [ ] T052 [W-D] [P] Convert `lib/utils/retry.ts` re-export stub (re-exports shared/) [10m] {deps: T032}

- [ ] T053 [W-D] [P] Convert `lib/utils/path-security.ts` re-export stub [10m] {deps: T031}

- [ ] T054 [W-D] Convert `lib/utils/index.ts` barrel export [10m] {deps: T050-T053}

### Layer 4b: lib/errors/ (4 files)

- [ ] T055 [W-D] [P] Convert `lib/errors/recovery-hints.ts` (852 lines) [1h] {deps: T042}
  - Type `ERROR_CODES` as const object
  - Type `RECOVERY_HINTS` record with hint structure
  - Type `getRecoveryHint(code: string): RecoveryHint`

- [ ] T056 [W-D] Convert `lib/errors/core.ts` (283 lines) [45m] {deps: T055}
  - `MemoryError` class extends `Error` with typed `code: ErrorCode`
  - Define `ErrorCode` enum or string union
  - Type `buildErrorResponse(code: ErrorCode, message: string, details?: Record<string, unknown>): ErrorResponse`

- [ ] T057 [W-D] Convert `lib/errors/index.ts` barrel [10m] {deps: T055, T056}
- [ ] T058 [W-D] Convert `lib/errors.ts` re-export wrapper [5m] {deps: T057}

### Layer 4c: lib/interfaces/ (3 files)

- [ ] T059 [W-D] [P] Convert `lib/interfaces/embedding-provider.ts` (230 lines) [45m] {deps: T030}
  - Convert JS abstract class → proper TypeScript `abstract class` or import `IEmbeddingProvider` from `shared/types`
  - Keep `MockEmbeddingProvider` as concrete test implementation

- [ ] T060 [W-D] [P] Convert `lib/interfaces/vector-store.ts` (192 lines) [45m] {deps: T030}
  - Convert JS abstract class → proper TypeScript `abstract class` or import `IVectorStore` from `shared/types`
  - Keep `MockVectorStore` as concrete test implementation

- [ ] T061 [W-D] Convert `lib/interfaces/index.ts` barrel [10m] {deps: T059, T060}

### Layer 4d: lib/config/ (3 files)

- [ ] T062 [W-D] [P] Convert `lib/config/memory-types.ts` (323 lines) [45m] {deps: T042}
  - Define `MemoryType` interface (name, halfLifeDays, pathPatterns, keywords)
  - Type `MEMORY_TYPES` as `Record<MemoryTypeName, MemoryType>`
  - Define `MemoryTypeName` string union

- [ ] T063 [W-D] Convert `lib/config/type-inference.ts` (310 lines) [45m] {deps: T062}
  - Type `inferMemoryType(filePath: string, content: string, tier?: string): MemoryTypeName`
  - Type `TIER_TO_TYPE_MAP` as `Record<string, MemoryTypeName>`

- [ ] T064 [W-D] Convert `lib/config/index.ts` barrel [10m] {deps: T062, T063}

### Layer 4e: lib/scoring/ (6 files)

- [ ] T065 [W-D] [P] Convert `lib/scoring/scoring.ts` (162 lines) [30m] {deps: T042}
  - Type `DecayConfig`, `calculateDecayScore(similarity: number, ageDays: number, config?: DecayConfig): number`

- [ ] T066 [W-D] [P] Convert `lib/scoring/composite-scoring.ts` (459 lines) [1h] {deps: T042}
  - Define `FiveFactorWeights` interface
  - Type all 5 factor functions: temporal, usage, importance, pattern, citation

- [ ] T067 [W-D] [P] Convert `lib/scoring/confidence-tracker.ts` (229 lines) [30m] {deps: T042}
  - Type `trackFeedback(memoryId: string, positive: boolean): void`
  - Type `isPromotionEligible(memoryId: string): boolean`

- [ ] T068 [W-D] [P] Convert `lib/scoring/importance-tiers.ts` (206 lines) [30m] {deps: T042}
  - Define `ImportanceTier` type: `'constitutional' | 'critical' | 'important' | 'normal' | 'temporary' | 'deprecated'`
  - Type `IMPORTANCE_TIERS` as `Record<ImportanceTier, TierConfig>`

- [ ] T069 [W-D] Convert `lib/scoring/folder-scoring.ts` re-export stub [10m] {deps: T033}

- [ ] T070 [W-D] Convert `lib/scoring/index.ts` barrel [10m] {deps: T065-T069}

### Layer 4f: lib/response/ (2 files)

- [ ] T071 [W-D] [P] Convert `lib/response/envelope.ts` (189 lines) [45m] {deps: T042}
  - Define `MCPResponse<T>` generic envelope type
  - Type `createMCPSuccessResponse<T>(data: T, summary: string, hints?: string[]): MCPResponse<T>`
  - Type `createMCPErrorResponse(code: string, message: string): MCPResponse<never>`

- [ ] T072 [W-D] Convert `lib/response/index.ts` barrel [10m] {deps: T071}

### Layer 4g: lib/architecture/ (3 files)

- [ ] T073 [W-D] [P] Convert `lib/architecture/layer-definitions.ts` (275 lines) [45m] {deps: T042}
  - Define `Layer` interface (id, name, tokenBudget, description)
  - Define `LAYERS` as `Record<string, Layer>`
  - Type `TOOL_LAYER_MAP` as `Record<string, string>`

- [ ] T074 [W-D] Convert `lib/architecture/index.ts` barrel [10m] {deps: T073}

### Layer 4h: lib/validation/ (2 files)

- [ ] T075 [W-D] [P] Convert `lib/validation/preflight.ts` (545 lines) [1h] {deps: T042}
  - Define `PreflightResult` type (passed, errors, warnings)
  - Define `PreflightConfig` interface
  - `PreflightError` class extends `Error`
  - Type `runPreflight(content: string, config?: PreflightConfig): PreflightResult`

- [ ] T076 [W-D] Convert `lib/validation/index.ts` barrel [10m] {deps: T075}

### Layer 4i: lib/parsing/ (5 files)

- [ ] T077 [W-D] Convert `lib/parsing/memory-parser.ts` (664 lines) [1.5h] {deps: T042, T031}
  - Define `ParsedMemory` interface (title, content, metadata, anchors, triggers, causalLinks)
  - Type `parseMemoryFile(filePath: string): ParsedMemory`
  - Type content hash computation

- [ ] T078 [W-D] [P] Convert `lib/parsing/trigger-matcher.ts` (382 lines) [1h] {deps: T042}
  - Type `matchTriggerPhrases(query: string, triggers: TriggerPhrase[]): TriggerMatch[]`
  - Type regex cache management

- [ ] T079 [W-D] [P] Convert `lib/parsing/entity-scope.ts` (160 lines) [30m] {deps: T042}
  - Define `ContextType` string union
  - Type `detectContextType(content: string): ContextType`

- [ ] T080 [W-D] Convert `lib/parsing/trigger-extractor.ts` re-export stub [10m] {deps: T041}
- [ ] T081 [W-D] Convert `lib/parsing/index.ts` barrel [10m] {deps: T077-T080}

### Layer 4j: formatters/ (3 files)

- [ ] T082 [W-D] [P] Convert `formatters/token-metrics.ts` (77 lines) [15m] {deps: T042}
- [ ] T083 [W-D] Convert `formatters/search-results.ts` (219 lines) [45m] {deps: T082, T031}
- [ ] T084 [W-D] Convert `formatters/index.ts` barrel [10m] {deps: T082, T083}

### Layer 4k: utils/ top-level (4 files)

- [ ] T085 [W-D] [P] Convert `utils/validators.ts` (157 lines) [30m] {deps: T042}
- [ ] T086 [W-D] [P] Convert `utils/json-helpers.ts` (59 lines) [15m] {deps: T042}
- [ ] T087 [W-D] [P] Convert `utils/batch-processor.ts` (155 lines) [30m] {deps: T056}
- [ ] T088 [W-D] Convert `utils/index.ts` barrel [10m] {deps: T085-T087}

### Layer 4l: core/ (3 files)

- [ ] T089 [W-D] Convert `core/config.ts` (103 lines) [30m] {deps: T042}
  - Type all path constants, batch config, rate limiting, query limits
- [ ] T090 [W-D] Convert `core/db-state.ts` (225 lines) [45m] {deps: T089}
  - Type database state management, mutex, constitutional cache
- [ ] T091 [W-D] Convert `core/index.ts` barrel [10m] {deps: T089, T090}

### Phase 4 Verification

- [ ] T092 [W-D] Verify mcp_server foundation compilation [30m] {deps: T050-T091}
  - `tsc --build mcp_server` compiles foundation layers with 0 errors
  - All barrel exports resolve correctly
  - No type errors in cross-layer imports

>>> SYNC-005: Phase 4 complete — MCP foundation layers in TypeScript. Upper layers can build on typed foundation. <<<

---

## Dependency Notes

- **T042**: Phase 3 verification complete (shared/ fully converted)
- **T030**: `shared/types.ts` created with central interfaces
- **T031**: `shared/utils/path-security.ts` converted
- **T032**: `shared/utils/retry.ts` converted
- **T033**: `shared/scoring/folder-scoring.ts` converted
- **T041**: `shared/trigger-extractor.ts` converted
- **T056**: `lib/errors/core.ts` converted (needed for batch-processor error handling)

---

## Parallelization Map

### Wave 1 (Can run in parallel after Phase 3)

| Agent | Tasks | Sub-Layers |
|-------|-------|------------|
| Agent 4 | T050-T058 | 4a (lib/utils/) + 4b (lib/errors/) |
| Agent 5 | T059-T064 | 4c (lib/interfaces/) + 4d (lib/config/) |
| Agent 6 | T065-T072 | 4e (lib/scoring/) + 4f (lib/response/) |
| Agent 7 | T073-T076 | 4g (lib/architecture/) + 4h (lib/validation/) |
| Agent 10 | T089-T091 | 4l (core/) |

**Estimated duration:** 2-3 hours

### Wave 2 (Sequential after Wave 1)

| Agent | Tasks | Sub-Layers |
|-------|-------|------------|
| Agent 8 | T077-T081 | 4i (lib/parsing/) |
| Agent 9 | T082-T088 | 4j (formatters/) + 4k (utils/ top-level) |

**Estimated duration:** 1-2 hours

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks
- [ ] T092 verification passed (0 compilation errors)
- [ ] All barrel exports resolve
- [ ] Checklist CHK-080 through CHK-094 verified

---

## Cross-References

- **Phase 4 Plan:** `plan.md`
- **Phase 4 Checklist:** `checklist.md`
- **Parent Spec:** `../spec.md`
- **Full Tasks List:** `../tasks.md` (T050–T092)
- **Decisions:** `../decision-record.md`
