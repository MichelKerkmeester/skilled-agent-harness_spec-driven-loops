# Tasks: JavaScript to TypeScript Migration — system-spec-kit

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**3-Tier Task Format (Level 3+):**
```
T### [W-X] [P?] Description (file path) [effort] {deps: T###}
```

---

## Workstream Organization

| Workstream | Owner | Scope | Target Files |
|------------|-------|-------|-------------|
| **W-A** | Standards Agent | TypeScript standards in workflows-code--opencode | 9 files (4 new + 5 updates) |
| **W-B** | Infrastructure Agent | tsconfig, deps, build pipeline, circular dep fix | ~15 files |
| **W-C** | Shared Agent | Convert shared/ to TypeScript | 9 → 12 .ts files |
| **W-D** | MCP Foundation Agent | Convert mcp_server/ leaf modules | 34 files |
| **W-E** | MCP Upper Agent | Convert mcp_server/ stateful modules | 42 files |
| **W-F** | Scripts Agent | Convert scripts/ to TypeScript | 42 files |
| **W-G** | Test Agent (MCP) | Convert mcp_server/tests/ | 46 files |
| **W-H** | Test Agent (Scripts) | Convert scripts/tests/ | 13 files |
| **W-I** | Documentation Agent | Update all READMEs, SKILL.md, references, assets | ~55 files |
| **W-J** | Verification Agent | Final build, test, smoke tests | All |

---

## Milestone Reference

| Milestone | Tasks | Target | Status | Workstreams |
|-----------|-------|--------|--------|-------------|
| M1: Standards Ready | T001–T009 | Session 1 | Pending | W-A |
| M2: Infrastructure Ready | T010–T019 | Session 1 | Pending | W-B |
| M3: Dependencies Clean | T020–T027 | Session 1 | Pending | W-B |
| M4: Shared Converted | T030–T042 | Session 2 | Pending | W-C |
| M5: MCP Foundation Done | T050–T085 | Session 2 | Pending | W-D |
| M6: MCP Upper Done | T090–T130 | Session 3 | Pending | W-E |
| M7: Scripts Done | T140–T175 | Session 3 | Pending | W-F |
| M8: All Tests Converted | T180–T210 | Session 4 | Pending | W-G, W-H |
| M9: Docs Updated | T220–T250 | Session 4 | Pending | W-I |
| M10: Final Verified | T260–T270 | Session 4 | Pending | W-J |

---

## Phase 0: TypeScript Standards (workflows-code--opencode)

> **Goal:** Establish TypeScript coding standards before any conversion begins.
> **Workstream:** W-A
> **Effort:** ~3,000 new lines across 9 files

### New Reference Files

- [ ] T001 [W-A] Create TypeScript style guide (`references/typescript/style_guide.md`) [2h]
  - File headers, naming (PascalCase interfaces/types/enums), formatting, section organization with TYPE DEFINITIONS
  - Import ordering: Node built-ins → third-party → local modules → type-only imports
  - TypeScript-specific formatting: type annotation placement, multiline type definitions
  - `strict` mode in tsconfig as equivalent of `'use strict'`

- [ ] T002 [W-A] Create TypeScript quality standards (`references/typescript/quality_standards.md`) [2h] {deps: T001}
  - `interface` vs `type` decision guide (interfaces for object shapes, types for unions/intersections)
  - `unknown` over `any` policy, generic constraints
  - Strict null checks, discriminated unions for state management
  - Utility types: `Partial<T>`, `Required<T>`, `Pick<T,K>`, `Omit<T,K>`, `Record<K,V>`, `Readonly<T>`
  - Return type annotations: explicit for public API, inferred for private helpers
  - TSDoc format (`@param`, `@returns`, `@throws`, `@typeParam`)
  - Typed error classes, async patterns with typed Promises
  - `tsconfig.json` baseline settings for OpenCode projects

- [ ] T003 [W-A] Create TypeScript quick reference (`references/typescript/quick_reference.md`) [1h] {deps: T001, T002}
  - Complete TS file template (copy-paste ready)
  - Naming cheat sheet (extending JS table with Interface, Type, Enum, Generic rows)
  - Type annotation patterns quick lookup
  - Common utility type patterns
  - Import/export template (ES module syntax for source)
  - Error handling patterns with typed catches

- [ ] T004 [W-A] Create TypeScript checklist (`assets/checklists/typescript_checklist.md`) [1h] {deps: T001, T002}
  - P0: File header present, no `any` in public API, PascalCase types/interfaces, no commented-out code
  - P1: Explicit return types on public functions, interfaces for all data shapes, strict mode enabled, no non-null assertions without justification, TSDoc on public API
  - P2: Utility types used where appropriate, discriminated unions for complex state, type-only imports separated, generic constraints where applicable

### Existing File Updates

- [ ] T005 [W-A] Update SKILL.md language detection + resource router [1h] {deps: T001}
  - Remove "TypeScript (not currently used in OpenCode)" exclusion (line 48)
  - Add TypeScript to keyword triggers table (lines 35-38): `typescript, ts, tsx, interface, type, tsconfig, tsc, strict`
  - Add TypeScript to FILE_EXTENSIONS mapping (lines 77-89): `.ts`, `.tsx`, `.mts`, `.d.ts`
  - Add TYPESCRIPT resource router block (lines 94-148)
  - Add TypeScript use case router table (lines 150-161)
  - Update naming matrix (lines 469-476) with TypeScript column
  - Add TypeScript file header template to quick reference section

- [ ] T006 [W-A] [P] Update universal_patterns.md (`references/shared/universal_patterns.md`) [30m] {deps: T001}
  - Add TypeScript examples alongside JavaScript in naming section (lines 46-65)
  - Add TypeScript to language list in overview (line 16)

- [ ] T007 [W-A] [P] Update code_organization.md (`references/shared/code_organization.md`) [30m] {deps: T001}
  - Add TypeScript import ordering section (ES modules with `import type`)
  - Add TypeScript export patterns (`export`, `export default`, `export type`)
  - Add `.test.ts` to test naming conventions (line 401)
  - Add TypeScript file structure example

- [ ] T008 [W-A] [P] Update universal_checklist.md (`assets/checklists/universal_checklist.md`) [15m] {deps: T004}
  - Add TypeScript to naming conventions row in P1 section
  - Add `tsc --noEmit` to validation workflow

- [ ] T009 [W-A] Update CHANGELOG.md [15m] {deps: T001-T008}
  - Version entry for TypeScript standard additions

>>> SYNC-001: Phase 0 complete — TypeScript standards established. All agents use these conventions. <<<

---

## Phase 1: Infrastructure Setup

> **Goal:** Set up TypeScript compilation infrastructure without changing any source code.
> **Workstream:** W-B
> **Effort:** ~500 lines across 8 files

### Dependencies

- [ ] T010 [W-B] Install `typescript` as root dev dependency [10m]
- [ ] T011 [W-B] [P] Install `@types/node` as root dev dependency [5m]
- [ ] T012 [W-B] [P] Install `@types/better-sqlite3` as root dev dependency [5m]

### Workspace Configuration

- [ ] T013 [W-B] Create `shared/package.json` — make shared/ a proper workspace [15m] {deps: T010}
  - `"name": "@spec-kit/shared"`, `"version": "1.7.2"`, `"private": true`
  - `"main": "embeddings.js"` (compiled entry point)

- [ ] T014 [W-B] Update root `package.json` — add shared to workspaces [10m] {deps: T013}
  - `"workspaces": ["shared", "mcp_server", "scripts"]`
  - Add build scripts: `"build": "tsc --build"`, `"typecheck": "tsc --noEmit"`, `"build:watch": "tsc --build --watch"`

### TypeScript Configuration

- [ ] T015 [W-B] Create root `tsconfig.json` [30m] {deps: T010}
  - `target: "es2022"`, `module: "commonjs"`, `moduleResolution: "node"`
  - `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`
  - `declaration: true`, `declarationMap: true`, `sourceMap: true`
  - `composite: true`, project references to shared, mcp_server, scripts

- [ ] T016 [W-B] Create `shared/tsconfig.json` [15m] {deps: T015}
  - Extends root, `composite: true`, `rootDir: "."`, `outDir: "."`
  - `include: ["**/*.ts"]`, `exclude: ["node_modules"]`

- [ ] T017 [W-B] Create `mcp_server/tsconfig.json` [15m] {deps: T015}
  - Extends root, `composite: true`, references `../shared`
  - `include: ["**/*.ts"]`, `exclude: ["node_modules"]`

- [ ] T018 [W-B] Create `scripts/tsconfig.json` [15m] {deps: T015}
  - Extends root, `composite: true`, references `../shared`, `../mcp_server`
  - `include: ["**/*.ts"]`, `exclude: ["node_modules"]`

### Type Declarations

- [ ] T019 [W-B] Create `sqlite-vec.d.ts` custom type declarations [1h] {deps: T010}
  - Declare module for `sqlite-vec`
  - Type `load(db: Database): void` and vector search functions
  - Cover only the API surface actually used in `vector-index.js`

>>> SYNC-002: Phase 1 complete — TypeScript compiles (with expected errors from unconverted files). <<<

---

## Phase 2: Break Circular Dependencies

> **Goal:** Resolve shared/ ↔ mcp_server/ circular imports so TypeScript project references work.
> **Workstream:** W-B
> **Effort:** 5 files moved, 3 re-export stubs, 1 deletion

### File Moves (shared/ ← mcp_server/)

- [ ] T020 [W-B] Move `retry.js` from `mcp_server/lib/utils/` to `shared/utils/retry.js` [30m] {deps: T015}
  - File is self-contained (no mcp_server-internal dependencies)
  - Used by `shared/embeddings/providers/{voyage,openai}.js`
  - Update all import paths in shared/ consumers

- [ ] T021 [W-B] Move `path-security.js` from `mcp_server/lib/utils/` to `shared/utils/path-security.js` [30m] {deps: T015}
  - File is self-contained (only depends on `path` built-in)
  - Used by deprecated `shared/utils.js`
  - Update all import paths

- [ ] T022 [W-B] Move `folder-scoring.js` from `mcp_server/lib/scoring/` to `shared/scoring/folder-scoring.js` [30m] {deps: T015}
  - File is self-contained (no internal mcp_server dependencies)
  - Used by `scripts/memory/rank-memories.js` (removes scripts→mcp_server cross-dep)

### Backward Compatibility

- [ ] T023 [W-B] Create re-export stub at `mcp_server/lib/utils/retry.js` [10m] {deps: T020}
  - `module.exports = require('../../../shared/utils/retry');`

- [ ] T024 [W-B] [P] Create re-export stub at `mcp_server/lib/utils/path-security.js` [10m] {deps: T021}
  - `module.exports = require('../../../shared/utils/path-security');`

- [ ] T025 [W-B] [P] Create re-export stub at `mcp_server/lib/scoring/folder-scoring.js` [10m] {deps: T022}
  - `module.exports = require('../../../shared/scoring/folder-scoring');`

### Cleanup

- [ ] T026 [W-B] Delete deprecated `shared/utils.js` [10m] {deps: T021}
  - Was only re-exporting path-security from mcp_server — no longer needed after move
  - Verify no remaining consumers (grep for `require.*shared/utils`)

### Verification

- [ ] T027 [W-B] Verify circular dependency resolution [30m] {deps: T020-T026}
  - Run all existing tests — 100% pass rate
  - `tsc --build` resolves project references without circular errors
  - Dependency graph is now DAG: `shared` ← `mcp_server` ← `scripts`
  - No remaining `shared/` → `mcp_server/` imports

>>> SYNC-003: Phase 2 complete — Circular dependencies resolved. TypeScript project references viable. <<<

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

## Phase 5: Convert mcp_server/ Upper Layers (42 files)

> **Goal:** Convert the stateful, complex modules that depend on the foundation.
> **Workstream:** W-E
> **Effort:** 42 files, ~23,300 lines

### Layer 5a: lib/embeddings/ (2 files)

- [ ] T100 [W-E] Convert `lib/embeddings/provider-chain.ts` (650 lines) [1.5h] {deps: T092, T039}
  - Define `ProviderTier` enum, `FallbackReason` type
  - `EmbeddingProviderChain` class with typed chain logic
  - `BM25OnlyProvider` class implements `IEmbeddingProvider`
- [ ] T101 [W-E] Convert `lib/embeddings/index.ts` barrel [10m] {deps: T100}

### Layer 5b: lib/cognitive/ (11 files)

- [ ] T102 [W-E] Convert `lib/cognitive/fsrs-scheduler.ts` (260 lines) [45m] {deps: T092}
  - Type FSRS v4 algorithm: `calculateRetrievability`, `updateStability`
  - Define grade constants as enum: `GRADE_AGAIN`, `GRADE_HARD`, `GRADE_GOOD`, `GRADE_EASY`

- [ ] T103 [W-E] Convert `lib/cognitive/composite-scoring.ts` (proxy to lib/scoring/) [15m] {deps: T066}

- [ ] T104 [W-E] Convert `lib/cognitive/tier-classifier.ts` (784 lines) [1.5h] {deps: T102}
  - Define `TierState` type: `'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED'`
  - Define `STATE_THRESHOLDS` as typed constant
  - Type all classification and filtering functions

- [ ] T105 [W-E] [P] Convert `lib/cognitive/summary-generator.ts` (227 lines) [30m] {deps: T092}
- [ ] T106 [W-E] [P] Convert `lib/cognitive/temporal-contiguity.ts` (162 lines) [30m] {deps: T092}

- [ ] T107 [W-E] Convert `lib/cognitive/attention-decay.ts` (843 lines) [1.5h] {deps: T102, T104}
  - Type 5-factor composite scoring integration
  - Type decay configuration by importance tier

- [ ] T108 [W-E] Convert `lib/cognitive/prediction-error-gate.ts` (528 lines) [1h] {deps: T092}
  - Define `PE_ACTIONS` type: `'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'REINFORCE' | 'CREATE_LINKED'`
  - Type conflict detection logic

- [ ] T109 [W-E] Convert `lib/cognitive/co-activation.ts` (384 lines) [45m] {deps: T104}
- [ ] T110 [W-E] Convert `lib/cognitive/consolidation.ts` (1,054 lines) [2h] {deps: T104}
  - Type 4-phase engine: REPLAY, ABSTRACT, INTEGRATE, PRUNE
  - Define `ConsolidationPhase` enum
- [ ] T111 [W-E] Convert `lib/cognitive/working-memory.ts` (582 lines) [1h] {deps: T092}
- [ ] T112 [W-E] Convert `lib/cognitive/archival-manager.ts` (589 lines) [1h] {deps: T104}
- [ ] T113 [W-E] Convert `lib/cognitive/index.ts` barrel (164 lines) [30m] {deps: T102-T112}

### Layer 5c: lib/search/ (9 files)

- [ ] T114 [W-E] Convert `lib/search/bm25-index.ts` (312 lines) [45m] {deps: T092}
  - `BM25Index` class with typed document interface
- [ ] T115 [W-E] [P] Convert `lib/search/fuzzy-match.ts` (387 lines) [45m] {deps: T092}
- [ ] T116 [W-E] [P] Convert `lib/search/intent-classifier.ts` (457 lines) [45m] {deps: T092}
  - Define `IntentType` type: `'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand'`
- [ ] T117 [W-E] [P] Convert `lib/search/rrf-fusion.ts` (292 lines) [45m] {deps: T092}
- [ ] T118 [W-E] [P] Convert `lib/search/reranker.ts` (98 lines) [15m] {deps: T092}
- [ ] T119 [W-E] Convert `lib/search/cross-encoder.ts` (642 lines) [1h] {deps: T092}
- [ ] T120 [W-E] Convert `lib/search/hybrid-search.ts` (366 lines) [45m] {deps: T114, T117}
- [ ] T121 [W-E] Convert `lib/search/vector-index.ts` (3,309 lines) [4h] {deps: T092, T019}
  - LARGEST FILE — SQLite + sqlite-vec, schema migrations, vector operations
  - Type all database query results, schema management
  - Type `better-sqlite3` interactions with `@types/better-sqlite3`
  - Type `sqlite-vec` interactions with custom `.d.ts`
- [ ] T122 [W-E] Convert `lib/search/index.ts` barrel [10m] {deps: T114-T121}

### Layer 5d: lib/storage/ (8 files)

- [ ] T123 [W-E] [P] Convert `lib/storage/access-tracker.ts` (188 lines) [30m] {deps: T092}
- [ ] T124 [W-E] [P] Convert `lib/storage/history.ts` (373 lines) [45m] {deps: T092}
  - Define `HistoryEvent` type, `HistoryActor` union
- [ ] T125 [W-E] Convert `lib/storage/causal-edges.ts` (661 lines) [1h] {deps: T092}
  - Define `CausalEdge` interface, `RelationType` union of 6 types
- [ ] T126 [W-E] Convert `lib/storage/checkpoints.ts` (823 lines) [1.5h] {deps: T092, T040}
  - Define `Checkpoint` interface with gzip compression typing
- [ ] T127 [W-E] [P] Convert `lib/storage/incremental-index.ts` (334 lines) [45m] {deps: T092}
- [ ] T128 [W-E] [P] Convert `lib/storage/index-refresh.ts` (142 lines) [20m] {deps: T092}
- [ ] T129 [W-E] Convert `lib/storage/transaction-manager.ts` (474 lines) [1h] {deps: T092}
  - Define `TransactionResult` interface, atomic operation types
- [ ] T130 [W-E] Convert `lib/storage/index.ts` barrel [10m] {deps: T123-T129}

### Layer 5e: lib/session/ (4 files)

- [ ] T131 [W-E] [P] Convert `lib/session/channel.ts` (150 lines) [20m] {deps: T092}
- [ ] T132 [W-E] Convert `lib/session/session-manager.ts` (1,045 lines) [2h] {deps: T092}
  - Type deduplication logic, crash recovery, session state
- [ ] T133 [W-E] Convert `lib/session/index.ts` barrel [10m] {deps: T131, T132}
- [ ] T134 [W-E] Convert `lib/channel.ts` re-export wrapper [5m] {deps: T133}

### Layer 5f–5h: Remaining lib/ (7 files)

- [ ] T135 [W-E] [P] Convert `lib/cache/tool-cache.ts` (546 lines) [1h] {deps: T092}
  - Type `CacheEntry<T>` generic, LRU eviction, TTL logic
- [ ] T136 [W-E] Convert `lib/cache/index.ts` barrel [10m] {deps: T135}
- [ ] T137 [W-E] [P] Convert `lib/learning/corrections.ts` (698 lines) [1h] {deps: T092}
  - Define `CorrectionType` enum: `SUPERSEDED | DEPRECATED | REFINED | MERGED`
- [ ] T138 [W-E] Convert `lib/learning/index.ts` barrel [10m] {deps: T137}
- [ ] T139 [W-E] [P] Convert `lib/providers/retry-manager.ts` (515 lines) [1h] {deps: T121, T100}
- [ ] T140 [W-E] Convert `lib/providers/embeddings.ts` re-export stub [10m] {deps: T040}
- [ ] T141 [W-E] Convert `lib/providers/index.ts` barrel [10m] {deps: T139, T140}

### Layer 5i: hooks/ (2 files)

- [ ] T142 [W-E] Convert `hooks/memory-surface.ts` (161 lines) [30m] {deps: T078, T121}
- [ ] T143 [W-E] Convert `hooks/index.ts` barrel [10m] {deps: T142}

### Layer 5j: handlers/ (10 files)

- [ ] T144 [W-E] Convert `handlers/memory-context.ts` (396 lines) [1h] {deps: T113, T116, T150}
- [ ] T145 [W-E] Convert `handlers/memory-search.ts` (790 lines) [1.5h] {deps: T121, T100, T119, T132, T135}
  - Type search pipeline: query → hybrid search → reranking → dedup → format
- [ ] T146 [W-E] Convert `handlers/memory-triggers.ts` (263 lines) [45m] {deps: T078, T107, T104}
- [ ] T147 [W-E] Convert `handlers/memory-save.ts` (1,215 lines) [2.5h] {deps: T108, T121, T129}
  - LARGEST HANDLER — PE gating, FSRS scheduling, causal links, atomic saves
- [ ] T148 [W-E] Convert `handlers/memory-crud.ts` (494 lines) [1h] {deps: T121, T068}
- [ ] T149 [W-E] Convert `handlers/memory-index.ts` (374 lines) [45m] {deps: T077, T121, T127}
- [ ] T150 [W-E] Convert `handlers/causal-graph.ts` (496 lines) [1h] {deps: T125, T121}
- [ ] T151 [W-E] Convert `handlers/checkpoints.ts` (255 lines) [30m] {deps: T126, T067}
- [ ] T152 [W-E] Convert `handlers/session-learning.ts` (691 lines) [1.5h] {deps: T121}
- [ ] T153 [W-E] Convert `handlers/index.ts` barrel (56 lines) [15m] {deps: T144-T152}

### Layer 5k–5l: Entry Points (2 files)

- [ ] T154 [W-E] Convert `scripts/reindex-embeddings.ts` (119 lines) [30m] {deps: T121, T100}
- [ ] T155 [W-E] Convert `context-server.ts` (525 lines) [2h] {deps: T153, T143}
  - MCP entry point with 20+ tool definitions
  - Type all tool input schemas and dispatch logic
  - Type MCP SDK server initialization

### Layer 5m: lib master barrel

- [ ] T156 [W-E] Convert `lib/index.ts` master barrel (50 lines) [15m] {deps: all lib/}

### Phase 5 Verification

- [ ] T157 [W-E] Verify full mcp_server compilation and tests [1h] {deps: T155, T156}
  - `tsc --build mcp_server` compiles with 0 errors
  - All 46 mcp_server tests pass against compiled output
  - MCP server starts and initializes all tools

>>> SYNC-006: Phase 5 complete — Full MCP server in TypeScript. All tools operational. <<<

---

## Phase 6: Convert scripts/ (42 files)

> **Goal:** Convert CLI scripts and their modules.
> **Workstream:** W-F (can start after Phase 3 SYNC-004)
> **Effort:** 42 files, ~9,096 lines

### Layer 6a: utils/ (10 files)

- [ ] T160 [W-F] Convert `utils/logger.ts` (38 lines) [10m] {deps: T042}
- [ ] T161 [W-F] [P] Convert `utils/path-utils.ts` (72 lines) [15m] {deps: T042}
- [ ] T162 [W-F] [P] Convert `utils/data-validator.ts` (100 lines) [30m] {deps: T042}
- [ ] T163 [W-F] [P] Convert `utils/input-normalizer.ts` (339 lines) [45m] {deps: T042}
- [ ] T164 [W-F] [P] Convert `utils/message-utils.ts` (185 lines) [30m] {deps: T042}
- [ ] T165 [W-F] [P] Convert `utils/prompt-utils.ts` (104 lines) [20m] {deps: T042}
- [ ] T166 [W-F] [P] Convert `utils/tool-detection.ts` (119 lines) [20m] {deps: T042}
- [ ] T167 [W-F] [P] Convert `utils/validation-utils.ts` (92 lines) [20m] {deps: T160}
- [ ] T168 [W-F] [P] Convert `utils/file-helpers.ts` (90 lines) [15m] {deps: T042}
- [ ] T169 [W-F] Convert `utils/index.ts` barrel [10m] {deps: T160-T168}

### Layer 6b: lib/ (10 files)

- [ ] T170 [W-F] Convert `lib/ascii-boxes.ts` (163 lines) [20m] {deps: T042}
- [ ] T171 [W-F] Convert `lib/decision-tree-generator.ts` (165 lines) [30m] {deps: T170}
- [ ] T172 [W-F] [P] Convert `lib/anchor-generator.ts` (229 lines) [30m] {deps: T042}
- [ ] T173 [W-F] [P] Convert `lib/content-filter.ts` (417 lines) [1h] {deps: T042}
- [ ] T174 [W-F] [P] Convert `lib/flowchart-generator.ts` (363 lines) [45m] {deps: T042}
- [ ] T175 [W-F] [P] Convert `lib/simulation-factory.ts` (416 lines) [45m] {deps: T042}
- [ ] T176 [W-F] [P] Convert `lib/semantic-summarizer.ts` (591 lines) [1h] {deps: T042}
- [ ] T177 [W-F] Convert `lib/embeddings.ts` re-export stub [10m] {deps: T040}
- [ ] T178 [W-F] [P] Convert `lib/trigger-extractor.ts` re-export stub [10m] {deps: T041}
- [ ] T179 [W-F] [P] Convert `lib/retry-manager.ts` re-export stub [10m] {deps: T139}

### Layer 6c: renderers/ (2 files)

- [ ] T180 [W-F] Convert `renderers/template-renderer.ts` (189 lines) [45m] {deps: T042}
  - Type Mustache-like template engine: `{{VAR}}`, `{{#ARRAY}}...{{/ARRAY}}`
- [ ] T181 [W-F] Convert `renderers/index.ts` barrel [10m] {deps: T180}

### Layer 6d: loaders/ (2 files)

- [ ] T182 [W-F] Convert `loaders/data-loader.ts` (151 lines) [30m] {deps: T042, T161}
  - Type 3-priority data loading chain
- [ ] T183 [W-F] Convert `loaders/index.ts` barrel [10m] {deps: T182}

### Layer 6e: extractors/ (9 files)

- [ ] T184 [W-F] Convert `extractors/conversation-extractor.ts` (204 lines) [30m] {deps: T164, T166}
- [ ] T185 [W-F] [P] Convert `extractors/decision-extractor.ts` (295 lines) [45m] {deps: T171, T172}
- [ ] T186 [W-F] [P] Convert `extractors/diagram-extractor.ts` (216 lines) [30m] {deps: T174, T171}
- [ ] T187 [W-F] [P] Convert `extractors/opencode-capture.ts` (443 lines) [1h] {deps: T042}
- [ ] T188 [W-F] [P] Convert `extractors/session-extractor.ts` (357 lines) [45m] {deps: T042}
- [ ] T189 [W-F] Convert `extractors/file-extractor.ts` (235 lines) [30m] {deps: T172, T168}
- [ ] T190 [W-F] Convert `extractors/implementation-guide-extractor.ts` (373 lines) [45m] {deps: T189}
- [ ] T191 [W-F] Convert `extractors/collect-session-data.ts` (757 lines) [1.5h] {deps: T184-T190, T173, T089}
  - Largest non-test file in scripts/ — assembles all session data
- [ ] T192 [W-F] Convert `extractors/index.ts` barrel [10m] {deps: T184-T191}

### Layer 6f: spec-folder/ (4 files)

- [ ] T193 [W-F] Convert `spec-folder/alignment-validator.ts` (451 lines) [1h] {deps: T042}
- [ ] T194 [W-F] Convert `spec-folder/directory-setup.ts` (103 lines) [20m] {deps: T161}
- [ ] T195 [W-F] Convert `spec-folder/folder-detector.ts` (238 lines) [30m] {deps: T089, T193}
- [ ] T196 [W-F] Convert `spec-folder/index.ts` barrel (48 lines) [15m] {deps: T193-T195}
  - Preserve snake_case aliases: `detect_spec_folder`, `setup_context_directory`, etc.

### Layer 6g: core/ (3 files)

- [ ] T197 [W-F] Convert `core/config.ts` (213 lines) [30m] {deps: T042}
  - Type `CONFIG` object, `loadConfig()`, specs directory utilities
- [ ] T198 [W-F] Convert `core/workflow.ts` (550 lines) [1.5h] {deps: T169, T192, T183, T181, T196, T176, T172, T173}
  - 12-step pipeline orchestration — depends on nearly everything
  - Type all pipeline stages and data flow
- [ ] T199 [W-F] Convert `core/index.ts` barrel [10m] {deps: T197, T198}

### Layer 6h: memory/ entry points (3 files)

- [ ] T200 [W-F] Convert `memory/generate-context.ts` (277 lines) [45m] {deps: T198}
  - CLI entry point — argument parsing, spec folder validation
- [ ] T201 [W-F] [P] Convert `memory/rank-memories.ts` (333 lines) [45m] {deps: T033}
  - Stdin/file reader, folder grouping, scoring
- [ ] T202 [W-F] [P] Convert `memory/cleanup-orphaned-vectors.ts` (140 lines) [30m] {deps: T042}

### Phase 6 Verification

- [ ] T203 [W-F] Verify full scripts/ compilation and tests [30m] {deps: T200-T202}
  - `tsc --build scripts` compiles with 0 errors
  - All 13 scripts tests pass against compiled output
  - `node scripts/memory/generate-context.js` (compiled) produces valid output

>>> SYNC-007: Phase 6 complete — All scripts in TypeScript. CLI tools operational. <<<

---

## Phase 7: Convert Test Files (59 files)

> **Goal:** Convert all test files to TypeScript for full type safety.
> **Workstream:** W-G (mcp tests), W-H (scripts tests)
> **Effort:** 59 files, ~55,297 lines

### Batch 7a: MCP Tests — Cognitive/Scoring (12 files)

- [ ] T210 [W-G] [P] Convert `tests/fsrs-scheduler.test.ts` (1,308 lines) [1h] {deps: T157}
- [ ] T211 [W-G] [P] Convert `tests/attention-decay.test.ts` (1,361 lines) [1h] {deps: T157}
- [ ] T212 [W-G] [P] Convert `tests/co-activation.test.ts` (456 lines) [30m] {deps: T157}
- [ ] T213 [W-G] [P] Convert `tests/consolidation.test.ts` (791 lines) [45m] {deps: T157}
- [ ] T214 [W-G] [P] Convert `tests/tier-classifier.test.ts` (1,277 lines) [1h] {deps: T157}
- [ ] T215 [W-G] [P] Convert `tests/composite-scoring.test.ts` (1,620 lines) [1h] {deps: T157}
- [ ] T216 [W-G] [P] Convert `tests/five-factor-scoring.test.ts` (1,068 lines) [1h] {deps: T157}
- [ ] T217 [W-G] [P] Convert `tests/prediction-error-gate.test.ts` (973 lines) [45m] {deps: T157}
- [ ] T218 [W-G] [P] Convert `tests/working-memory.test.ts` (545 lines) [30m] {deps: T157}
- [ ] T219 [W-G] [P] Convert `tests/archival-manager.test.ts` (908 lines) [45m] {deps: T157}
- [ ] T220 [W-G] [P] Convert `tests/summary-generator.test.ts` (594 lines) [30m] {deps: T157}
- [ ] T221 [W-G] [P] Convert `tests/test-cognitive-integration.js` (1,889 lines) [1.5h] {deps: T157}

### Batch 7b: MCP Tests — Search/Storage (10 files)

- [ ] T222 [W-G] [P] Convert `tests/bm25-index.test.ts` (960 lines) [45m] {deps: T157}
- [ ] T223 [W-G] [P] Convert `tests/hybrid-search.test.ts` (1,008 lines) [45m] {deps: T157}
- [ ] T224 [W-G] [P] Convert `tests/cross-encoder.test.ts` (600 lines) [30m] {deps: T157}
- [ ] T225 [W-G] [P] Convert `tests/fuzzy-match.test.ts` (851 lines) [45m] {deps: T157}
- [ ] T226 [W-G] [P] Convert `tests/rrf-fusion.test.ts` (470 lines) [30m] {deps: T157}
- [ ] T227 [W-G] [P] Convert `tests/intent-classifier.test.ts` (724 lines) [30m] {deps: T157}
- [ ] T228 [W-G] [P] Convert `tests/causal-edges.test.ts` (1,017 lines) [45m] {deps: T157}
- [ ] T229 [W-G] [P] Convert `tests/incremental-index.test.ts` (732 lines) [30m] {deps: T157}
- [ ] T230 [W-G] [P] Convert `tests/transaction-manager.test.ts` (841 lines) [45m] {deps: T157}
- [ ] T231 [W-G] [P] Convert `tests/schema-migration.test.ts` (1,107 lines) [45m] {deps: T157}

### Batch 7c: MCP Tests — Handlers/Integration (10 files)

- [ ] T232 [W-G] [P] Convert `tests/memory-context.test.ts` (802 lines) [45m] {deps: T157}
- [ ] T233 [W-G] [P] Convert `tests/memory-save-integration.test.ts` (1,500 lines) [1h] {deps: T157}
- [ ] T234 [W-G] [P] Convert `tests/memory-search-integration.test.ts` (1,148 lines) [1h] {deps: T157}
- [ ] T235 [W-G] [P] Convert `tests/test-memory-handlers.js` (2,059 lines) [1.5h] {deps: T157}
- [ ] T236 [W-G] [P] Convert `tests/test-session-learning.js` (1,973 lines) [1.5h] {deps: T157}
- [ ] T237 [W-G] [P] Convert `tests/session-manager.test.ts` (649 lines) [30m] {deps: T157}
- [ ] T238 [W-G] [P] Convert `tests/crash-recovery.test.ts` (789 lines) [45m] {deps: T157}
- [ ] T239 [W-G] [P] Convert `tests/continue-session.test.ts` (694 lines) [30m] {deps: T157}
- [ ] T240 [W-G] [P] Convert `tests/corrections.test.ts` (787 lines) [45m] {deps: T157}
- [ ] T241 [W-G] [P] Convert `tests/test-mcp-tools.js` (1,419 lines) [1h] {deps: T157}

### Batch 7d: MCP Tests — Remaining (14 files)

- [ ] T242 [W-G] [P] Convert `tests/preflight.test.ts` (914 lines) [45m] {deps: T157}
- [ ] T243 [W-G] [P] Convert `tests/provider-chain.test.ts` (1,562 lines) [1h] {deps: T157}
- [ ] T244 [W-G] [P] Convert `tests/recovery-hints.test.ts` (1,207 lines) [1h] {deps: T157}
- [ ] T245 [W-G] [P] Convert `tests/retry.test.ts` (1,160 lines) [1h] {deps: T157}
- [ ] T246 [W-G] [P] Convert `tests/envelope.test.ts` (477 lines) [30m] {deps: T157}
- [ ] T247 [W-G] [P] Convert `tests/tool-cache.test.ts` (851 lines) [45m] {deps: T157}
- [ ] T248 [W-G] [P] Convert `tests/layer-definitions.test.ts` (1,155 lines) [45m] {deps: T157}
- [ ] T249 [W-G] [P] Convert `tests/interfaces.test.ts` (308 lines) [15m] {deps: T157}
- [ ] T250 [W-G] [P] Convert `tests/memory-types.test.ts` (410 lines) [30m] {deps: T157}
- [ ] T251 [W-G] [P] Convert `tests/modularization.test.ts` (430 lines) [30m] {deps: T157}
- [ ] T252 [W-G] [P] Convert `tests/api-key-validation.test.ts` (256 lines) [15m] {deps: T157}
- [ ] T253 [W-G] [P] Convert `tests/api-validation.test.ts` (436 lines) [30m] {deps: T157}
- [ ] T254 [W-G] [P] Convert `tests/lazy-loading.test.ts` (122 lines) [10m] {deps: T157}
- [ ] T255 [W-G] [P] Convert `tests/verify-cognitive-upgrade.js` (269 lines) [15m] {deps: T157}

### Batch 7e: Scripts Tests (13 files)

- [ ] T256 [W-H] [P] Convert `tests/test-scripts-modules.js` (3,467 lines) [2h] {deps: T203}
- [ ] T257 [W-H] [P] Convert `tests/test-validation-system.js` (1,774 lines) [1h] {deps: T203}
- [ ] T258 [W-H] [P] Convert `tests/test-extractors-loaders.js` (1,330 lines) [1h] {deps: T203}
- [ ] T259 [W-H] [P] Convert `tests/test-template-comprehensive.js` (1,233 lines) [1h] {deps: T203}
- [ ] T260 [W-H] [P] Convert `tests/test-integration.js` (1,043 lines) [45m] {deps: T203}
- [ ] T261 [W-H] [P] Convert `tests/test-five-checks.js` (963 lines) [45m] {deps: T203}
- [ ] T262 [W-H] [P] Convert `tests/test-template-system.js` (819 lines) [30m] {deps: T203}
- [ ] T263 [W-H] [P] Convert `tests/test-bug-fixes.js` (561 lines) [30m] {deps: T203}
- [ ] T264 [W-H] [P] Convert `tests/test-utils.js` (439 lines) [30m] {deps: T203}
- [ ] T265 [W-H] [P] Convert `tests/test-export-contracts.js` (314 lines) [15m] {deps: T203}
- [ ] T266 [W-H] [P] Convert `tests/test-naming-migration.js` (349 lines) [15m] {deps: T203}
- [ ] T267 [W-H] [P] Convert `tests/test-bug-regressions.js` (313 lines) [15m] {deps: T203}
- [ ] T268 [W-H] [P] Convert `tests/test-embeddings-factory.js` (115 lines) [10m] {deps: T203}

### Phase 7 Verification

- [ ] T269 [W-G] Verify all mcp_server tests pass as TypeScript [30m] {deps: T210-T255}
- [ ] T270 [W-H] Verify all scripts tests pass as TypeScript [30m] {deps: T256-T268}
- [ ] T271 [W-G] Run full `npm test` — 100% pass rate across all 59 test files [15m] {deps: T269, T270}

>>> SYNC-008: Phase 7 complete — All test files in TypeScript. 100% test suite passing. <<<

---

## Phase 8: Documentation Updates

> **Goal:** Update all documentation to reflect TypeScript codebase.
> **Workstream:** W-I
> **Effort:** ~55 files, ~20,624 lines

### Stream 8a: READMEs (7 files)

- [ ] T280 [W-I] [P] Update `system-spec-kit/README.md` (713 lines, 5 JS refs) [30m] {deps: T157, T203}
  - Update Node.js requirement note, .js → .ts in paths, script references

- [ ] T281 [W-I] [P] Update `shared/README.md` (453 lines, 44 JS refs) [2h] {deps: T042}
  - Rewrite architecture diagram (require → import)
  - Update all code examples from CommonJS to ES module syntax
  - Update directory structure listing (.js → .ts)
  - Update provider documentation

- [ ] T282 [W-I] [P] Update `mcp_server/README.md` (1,066 lines, 56 JS refs) [2h] {deps: T157}
  - Update directory structure listing (50+ .js → .ts)
  - Update module description table
  - Update test running instructions

- [ ] T283 [W-I] [P] Update `scripts/README.md` (703 lines, 59 JS refs) [2h] {deps: T203}
  - Update directory structure listing (40+ .js → .ts)
  - Update JavaScript section descriptions
  - Update code examples

- [ ] T284 [W-I] [P] Update `config/README.md` (176 lines, 6 JS refs) [15m] {deps: T203}
- [ ] T285 [W-I] [P] Update `templates/README.md` (179 lines, 3 JS refs) [15m] {deps: T203}
- [ ] T286 [W-I] [P] Update `constitutional/README.md` (751 lines, 1 JS ref) [10m] {deps: T157}

### Stream 8b: SKILL.md (1 file)

- [ ] T287 [W-I] Update SKILL.md (883 lines) [1h] {deps: T157, T203}
  - "Canonical JavaScript modules" → "Canonical TypeScript modules" (line 167)
  - Update script path references (generate-context.js → compiled .js from .ts)
  - Update architecture descriptions (module counts may change)
  - Update code examples to TypeScript
  - Update resource inventory

### Stream 8c: References — Memory (6 files)

- [ ] T288 [W-I] [P] Update `references/memory/embedding_resilience.md` (422 lines, 10+ JS blocks) [1.5h] {deps: T042}
  - Convert all JS code blocks to TypeScript with proper types
  - Update .js file path references to .ts
  - Update architecture table

- [ ] T289 [W-I] [P] Update `references/memory/memory_system.md` (594 lines, 8+ JS blocks) [1.5h] {deps: T157}
  - Convert code samples: crypto usage → typed, state management → enums
  - Update architecture table

- [ ] T290 [W-I] [P] Update `references/memory/save_workflow.md` (539 lines) [30m] {deps: T203}
  - Update script paths, Node.js invocation references

- [ ] T291 [W-I] [P] Update `references/memory/trigger_config.md` (345 lines) [30m] {deps: T041}
  - Convert remaining 3 JS code blocks to TypeScript

- [ ] T292 [W-I] [P] Update `references/memory/epistemic-vectors.md` (396 lines, 1 ref) [5m]

- [ ] T293 [W-I] [P] Update `references/memory/index or other memory refs` if they exist [15m]

### Stream 8d: References — Other (8 files)

- [ ] T294 [W-I] [P] Update `references/structure/folder_routing.md` (572 lines) [30m] {deps: T203}
  - Convert 2 JS code blocks, update script paths

- [ ] T295 [W-I] [P] Update `references/debugging/troubleshooting.md` (461 lines) [30m] {deps: T157}
  - Convert 5 JS code examples to TypeScript

- [ ] T296 [W-I] [P] Update `references/config/environment_variables.md` (200 lines) [15m] {deps: T157, T203}
  - Update `node` command references

- [ ] T297 [W-I] [P] Update `references/workflows/execution_methods.md` (256 lines) [15m] {deps: T203}
- [ ] T298 [W-I] [P] Update `references/workflows/quick_reference.md` (609 lines) [15m] {deps: T203}
- [ ] T299 [W-I] [P] Update `references/validation/phase_checklists.md` (182 lines) [10m] {deps: T203}
- [ ] T300 [W-I] [P] Update `references/templates/template_guide.md` (1,060 lines) [15m] {deps: T203}
- [ ] T301 [W-I] [P] Update `references/templates/level_specifications.md` (755 lines) [10m] {deps: T203}

### Stream 8e: Assets (1 file)

- [ ] T302 [W-I] [P] Update `assets/template_mapping.md` (463 lines) [10m] {deps: T203}

### Stream 8f: Changelog

- [ ] T303 [W-I] Update system-spec-kit `CHANGELOG.md` — full migration entry [30m] {deps: T271}
  - Document all phases completed
  - List all architectural decisions (reference decision-record.md)
  - Note new TypeScript infrastructure

>>> SYNC-009: Phase 8 complete — All documentation reflects TypeScript codebase. <<<

---

## Phase 9: Final Verification

> **Goal:** Full system verification before declaring completion.
> **Workstream:** W-J
> **Effort:** Verification only, no new files

### Build Verification

- [ ] T310 [W-J] Clean build: `npm run build` completes with 0 errors [15m] {deps: T271, T303}
- [ ] T311 [W-J] Type check: `tsc --noEmit` passes with 0 errors [10m] {deps: T310}
- [ ] T312 [W-J] All tests: `npm test` passes 100% (all 59 test files) [15m] {deps: T310}

### Functional Verification

- [ ] T313 [W-J] MCP server starts: `node mcp_server/context-server.js` initializes all 20+ tools [15m] {deps: T310}
- [ ] T314 [W-J] CLI works: `node scripts/memory/generate-context.js` produces valid memory file [15m] {deps: T310}
- [ ] T315 [W-J] Embeddings: At least one provider (Voyage/OpenAI/HF-local) connects and produces embeddings [15m] {deps: T313}
- [ ] T316 [W-J] SQLite: Database CRUD + vector search verified [15m] {deps: T313}

### Structural Verification

- [ ] T317 [W-J] Zero `.js` source files remain (only compiled output) [10m] {deps: T310}
  - `find . -name '*.js' -not -path '*/node_modules/*'` should return only compiled output
- [ ] T318 [W-J] No `any` in public API function signatures [15m] {deps: T311}
  - `grep -r ': any' --include='*.ts' | grep -v 'test'` returns minimal results
- [ ] T319 [W-J] No circular project references [5m] {deps: T311}
  - `tsc --build` validates DAG without errors
- [ ] T320 [W-J] All documentation paths match actual file locations [15m] {deps: T303}
  - Spot-check 10 random path references in READMEs

>>> SYNC-010: Phase 9 complete — MIGRATION VERIFIED. All systems operational. <<<

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 10 milestones achieved (M1–M10)
- [ ] All 10 sync points passed (SYNC-001–SYNC-010)
- [ ] All unit/integration tests passing (59 files, 100% pass rate)
- [ ] MCP server fully operational (20+ tools)
- [ ] CLI scripts fully operational (3 entry points)
- [ ] checklist.md fully verified (all P0 items pass)
- [ ] All decision records have status: Decided
- [ ] Zero `.js` source files (only compiled output)

---

## AI Execution Protocol

### Pre-Task Checklist

1. [ ] Load spec.md and verify scope hasn't changed
2. [ ] Load plan.md and identify current phase
3. [ ] Load tasks.md and find next uncompleted task
4. [ ] Verify task dependencies (`{deps}`) are satisfied
5. [ ] Load checklist.md and identify relevant P0/P1 items
6. [ ] Check for blocking issues in decision-record.md
7. [ ] Verify memory/ folder for context from previous sessions
8. [ ] Confirm understanding of success criteria
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order within each phase |
| TASK-SCOPE | Stay within task boundary — no scope creep to adjacent modules |
| TASK-VERIFY | Verify each task: file compiles, exports match, tests pass |
| TASK-DOC | Update task status immediately on completion (`[x]`) |
| TASK-PARALLEL | Tasks marked `[P]` within same phase can run simultaneously |
| TASK-SYNC | Do not cross a `>>> SYNC <<<` barrier until ALL prior tasks complete |

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Workstream**: W-X
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Compilation output / test results / file list]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Research**: See `research.md`

---

## Status Updates Log

*(To be filled during implementation)*

### Session 1 — Phases 0–2
*(pending)*

### Session 2 — Phases 3–4
*(pending)*

### Session 3 — Phases 5–6
*(pending)*

### Session 4 — Phases 7–9
*(pending)*
