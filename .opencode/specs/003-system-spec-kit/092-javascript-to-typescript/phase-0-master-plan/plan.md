# Plan: JavaScript to TypeScript Migration — system-spec-kit

> **Spec Folder:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Level:** 3+
> **Status:** Planning
> **Created:** 2026-02-07

---

## 1. Migration Strategy

### Approach: Phased Bottom-Up with CommonJS Output

Convert layer by layer from the dependency graph leaves to the entry points. Each phase produces a working system — no "big bang" switchover.

**Key decisions:**
- **CommonJS output** (`"module": "commonjs"`) — preserves `__dirname`, all `path.join()` patterns, and `require()` at runtime. The compiled `.js` files are drop-in replacements.
- **In-place compilation** — `.ts` source files compile to `.js` in the same directory. No `dist/` folder. All relative path references stay valid.
- **Strict mode** — `tsconfig.json` uses `"strict": true` from the start. No half-measures.
- **Incremental migration** — each phase converts a complete module boundary (e.g., all of `shared/`, all of `mcp_server/lib/utils/`). Tests run after each phase.

### Build Pipeline

```
.ts source → tsc (CommonJS output) → .js files (in-place) → node runs .js
```

**tsconfig structure (project references):**
```
system-spec-kit/
├── tsconfig.json           (root, references: [shared, mcp_server, scripts])
├── shared/
│   └── tsconfig.json       (composite: true, outDir: ".")
├── mcp_server/
│   └── tsconfig.json       (composite: true, references: [../shared])
└── scripts/
    └── tsconfig.json       (composite: true, references: [../shared, ../mcp_server])
```

### File Conversion Pattern

For each `.js` file:
1. Rename to `.ts`
2. Replace `require()` → `import` (source), keep compiled output as CommonJS
3. Replace `module.exports` → `export` (source), compiled keeps `exports.`
4. Add type annotations to function parameters and return types
5. Convert JSDoc `@param {Type}` to TypeScript type annotations
6. Convert JS "interfaces" (abstract classes with `throw`) to TypeScript `interface`
7. Run `tsc --noEmit` to verify types
8. Run existing tests against compiled output

---

## 2. Phases Overview

| Phase | Name | Files | LOC | Depends On | Parallelizable |
|-------|------|------:|----:|------------|---------------|
| 0 | TypeScript Standards (workflows-code--opencode) | 9 | ~3,000 | — | Yes (independent) |
| 1 | Infrastructure Setup | 8 | ~500 | Phase 0 | No |
| 2 | Break Circular Dependencies | 5 | ~560 | Phase 1 | No |
| 3 | Convert `shared/` | 9 | 2,622 | Phase 2 | No |
| 4 | Convert `mcp_server/` foundation layers | 34 | ~8,500 | Phase 3 | Partially |
| 5 | Convert `mcp_server/` upper layers | 42 | ~23,300 | Phase 4 | Partially |
| 6 | Convert `scripts/` | 42 | 9,096 | Phase 3 | Yes (after Phase 3) |
| 7 | Convert test files | 59 | 55,297 | Phases 5, 6 | Yes (parallel batches) |
| 8 | Documentation updates | ~55 | ~20,624 | Phases 5, 6 | Yes (parallel) |
| 9 | Final verification | — | — | All | No |

**Estimated total: ~241 files, ~119,458 lines**

---

## 3. Phase Details

### Phase 0: TypeScript Standards in workflows-code--opencode

**Goal:** Establish TypeScript coding standards BEFORE any conversion begins.

**Why first:** The conversion must follow consistent conventions. Without documented standards, each agent or session might make different choices for interface naming, type placement, import ordering, etc.

#### New files to create (4):

| File | Content | Est. Lines |
|------|---------|--------:|
| `references/typescript/style_guide.md` | File headers, naming (PascalCase interfaces/types/enums, camelCase functions), formatting, import ordering (type-only imports separated), section organization (TYPE DEFINITIONS section added) | ~350 |
| `references/typescript/quality_standards.md` | `interface` vs `type` decisions, `unknown` over `any`, strict null checks, discriminated unions, utility types, TSDoc format, typed error classes, async patterns with typed Promises, tsconfig baseline | ~400 |
| `references/typescript/quick_reference.md` | Complete TS file template, naming cheat sheet, type annotation patterns, import/export template, error handling patterns, tsconfig settings | ~250 |
| `assets/checklists/typescript_checklist.md` | P0: no `any` in public API, PascalCase types, file header. P1: explicit return types on public functions, interfaces for all data shapes, strict mode. P2: utility types, discriminated unions, type-only imports | ~150 |

#### Files to update (5):

| File | Changes |
|------|---------|
| `SKILL.md` | Add TypeScript to language detection, resource router, use case router, naming matrix. Remove "TypeScript not used" exclusion. Add TS keyword triggers. |
| `references/shared/universal_patterns.md` | Add TypeScript examples alongside JavaScript in naming section |
| `references/shared/code_organization.md` | Add TypeScript import ordering, export patterns, `.test.ts` naming |
| `assets/checklists/universal_checklist.md` | Add TypeScript to naming conventions, add `tsc --noEmit` to validation |
| `CHANGELOG.md` | Version entry for TypeScript additions |

---

### Phase 1: Infrastructure Setup

**Goal:** Set up TypeScript compilation infrastructure without changing any source code.

#### Tasks:

1. **Install dev dependencies** (root `package.json`):
   ```
   typescript @types/node @types/better-sqlite3
   ```

2. **Create `shared/package.json`** — make it a proper workspace:
   ```json
   {
     "name": "@spec-kit/shared",
     "version": "1.7.2",
     "private": true,
     "main": "embeddings.js"
   }
   ```

3. **Update root `package.json`** — add `shared` to workspaces:
   ```json
   "workspaces": ["shared", "mcp_server", "scripts"]
   ```

4. **Create `tsconfig.json` files** (4 total):
   - Root: project references, `strict: true`, `module: "commonjs"`, `target: "es2022"`, `declaration: true`
   - `shared/tsconfig.json`: `composite: true`
   - `mcp_server/tsconfig.json`: `composite: true`, references `../shared`
   - `scripts/tsconfig.json`: `composite: true`, references `../shared`, `../mcp_server`

5. **Create `sqlite-vec.d.ts`** — custom type declarations for the native module

6. **Add build scripts** to root `package.json`:
   ```json
   "build": "tsc --build",
   "build:watch": "tsc --build --watch",
   "typecheck": "tsc --noEmit"
   ```

7. **Add `.gitignore` entries** for compiled output (if source and output are in same dir):
   ```
   # TypeScript compiled output coexists with source
   *.js.map
   *.d.ts
   !sqlite-vec.d.ts
   ```

8. **Verify** — `npm run typecheck` should complete (with errors from unconverted files — that's expected at this stage)

---

### Phase 2: Break Circular Dependencies

**Goal:** Resolve `shared/` ↔ `mcp_server/` circular imports so TypeScript project references work.

#### Moves:

| File | From | To | Reason |
|------|------|----|--------|
| `retry.js` | `mcp_server/lib/utils/retry.js` | `shared/utils/retry.ts` | Used by `shared/embeddings/providers/{voyage,openai}.js` |
| `path-security.js` | `mcp_server/lib/utils/path-security.js` | `shared/utils/path-security.ts` | Used by deprecated `shared/utils.js` |
| `folder-scoring.js` | `mcp_server/lib/scoring/folder-scoring.js` | `shared/scoring/folder-scoring.ts` | Used by `scripts/memory/rank-memories.js` |

#### Deletions:

| File | Reason |
|------|--------|
| `shared/utils.js` | DEPRECATED. Was only re-exporting `path-security.js`. After move, consumers import from `shared/utils/path-security` directly. |

#### Re-export stubs (backward compatibility):

| File | Exports from |
|------|-------------|
| `mcp_server/lib/utils/retry.ts` | Re-exports `shared/utils/retry` |
| `mcp_server/lib/utils/path-security.ts` | Re-exports `shared/utils/path-security` |
| `mcp_server/lib/scoring/folder-scoring.ts` | Re-exports `shared/scoring/folder-scoring` |

#### Verification:

- All tests pass with new import paths
- `tsc --build` can resolve project references without circular errors
- Dependency graph is now: `shared` ← `mcp_server` ← `scripts` (DAG, no cycles)

---

### Phase 3: Convert `shared/` (9 files → 9 .ts files)

**Goal:** Convert the foundational shared layer first. All other code depends on this.

#### Conversion order (dependency-aware):

| # | File | Lines | Key types to define |
|---|------|------:|---------------------|
| 1 | `shared/utils/path-security.ts` | 75 | `validateFilePath(path: string, allowedPaths: string[]): boolean` |
| 2 | `shared/utils/retry.ts` | 385 | `RetryConfig`, `ErrorClassification`, `BackoffSequence` |
| 3 | `shared/scoring/folder-scoring.ts` | 397 | `FolderScore`, `RankingMode`, `ArchivePattern` |
| 4 | `shared/chunking.ts` | 118 | `ChunkOptions`, `semanticChunk(text: string, maxLength?: number): string` |
| 5 | `shared/embeddings/profile.ts` | 78 | `EmbeddingProfile` class (already well-structured) |
| 6 | `shared/embeddings/providers/hf-local.ts` | 242 | `HfLocalProvider` class implementing `IEmbeddingProvider` |
| 7 | `shared/embeddings/providers/openai.ts` | 257 | `OpenAIProvider` class, `ModelDimensions` |
| 8 | `shared/embeddings/providers/voyage.ts` | 275 | `VoyageProvider` class, `ModelDimensions` |
| 9 | `shared/embeddings/factory.ts` | 370 | `ProviderConfig`, `createEmbeddingsProvider()` |
| 10 | `shared/embeddings.ts` | 585 | Facade types, `EmbeddingResult`, cache types |
| 11 | `shared/trigger-extractor.ts` | 686 | `TriggerConfig`, `TriggerPhrase`, `ExtractionStats` |

#### Key interface definitions (canonical, used across project):

```typescript
// shared/types.ts (NEW — central type definitions)
export interface EmbeddingProfile { provider: string; model: string; dimension: number; }
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
export interface IVectorStore {
  search(embedding: number[], options?: SearchOptions): Promise<SearchResult[]>;
  upsert(id: string, embedding: number[], metadata: Record<string, unknown>): Promise<void>;
  delete(id: string): Promise<boolean>;
  get(id: string): Promise<MemoryRecord | null>;
  getStats(): Promise<StoreStats>;
  isAvailable(): boolean;
  close(): void;
}
```

---

### Phase 4: Convert `mcp_server/` Foundation Layers (34 files)

**Goal:** Convert bottom-up from leaf modules to avoid cascading type errors.

#### Conversion order (12 sub-layers, dependency-aware):

| Layer | Directory | Files | Key types |
|-------|-----------|------:|-----------|
| 4a | `lib/utils/` | 4 | `formatAgeString`, `TokenConfig`, `PathValidation` |
| 4b | `lib/errors/` | 4 | `MemoryError`, `ErrorCode` enum, `RecoveryHint` |
| 4c | `lib/interfaces/` | 3 | Already well-structured → proper TS interfaces |
| 4d | `lib/config/` | 3 | `MemoryType`, `MemoryTypeConfig`, `TypeInference` |
| 4e | `lib/scoring/` | 6 | `CompositeScore`, `FiveFactorWeights`, `ImportanceTier` |
| 4f | `lib/response/` | 2 | `MCPResponse<T>`, `ResponseEnvelope` |
| 4g | `lib/architecture/` | 3 | `Layer`, `ToolLayerMap`, `TokenBudget` |
| 4h | `lib/validation/` | 2 | `PreflightResult`, `PreflightConfig`, `PreflightError` |
| 4i | `lib/parsing/` | 5 | `MemoryMetadata`, `ParsedMemory`, `TriggerMatch` |
| 4j | `formatters/` | 3 | `TokenMetrics`, `FormattedSearchResult` |
| 4k | `utils/` (top-level) | 4 | `InputLimits`, `BatchOptions`, `JsonParseResult` |
| 4l | `core/` | 3 | `ServerConfig`, `DatabaseState`, `ConstitutionalCache` |

**Total: 34 barrel index files + source modules across 12 sub-layers**

Each sub-layer is independently compilable after its dependencies are converted. Sub-layers 4a–4h can be parallelized (they have no inter-dependencies within this phase).

---

### Phase 5: Convert `mcp_server/` Upper Layers (42 files)

**Goal:** Convert the stateful, complex modules that depend on the foundation.

#### Conversion order:

| Layer | Directory | Files | Lines | Key types |
|-------|-----------|------:|------:|-----------|
| 5a | `lib/embeddings/` | 2 | 662 | `ProviderChain`, `ProviderTier`, `FallbackReason` |
| 5b | `lib/cognitive/` | 11 | 5,577 | `DecayScore`, `FSRSState`, `ConsolidationPhase`, `TierState`, `WorkingMemory` |
| 5c | `lib/search/` | 9 | 5,887 | `SearchResult`, `BM25Document`, `HybridConfig`, `RRFConfig`, `IntentType` |
| 5d | `lib/storage/` | 8 | 3,022 | `CausalEdge`, `Checkpoint`, `HistoryEvent`, `TransactionResult` |
| 5e | `lib/session/` | 4 | 1,217 | `SessionState`, `DeduplicationResult`, `Channel` |
| 5f | `lib/cache/` | 2 | 559 | `CacheEntry<T>`, `CacheStats` |
| 5g | `lib/learning/` | 2 | 712 | `Correction`, `CorrectionType`, `StabilityPenalty` |
| 5h | `lib/providers/` | 3 | 535 | `RetryQueue`, `BackgroundJob` |
| 5i | `hooks/` | 2 | 194 | `SurfaceConfig`, `MemoryAwareTool` |
| 5j | `handlers/` | 10 | 5,029 | `HandlerResult`, per-handler input/output types |
| 5k | `scripts/` | 1 | 119 | CLI entry point |
| 5l | `context-server.ts` | 1 | 525 | MCP server entry point, tool definitions |

**Dependency chain:** 5a → 5b → 5c → 5d → 5e → 5f/5g/5h (parallel) → 5i → 5j → 5k/5l

---

### Phase 6: Convert `scripts/` (42 files)

**Goal:** Convert CLI scripts and their modules. Can start after Phase 3 (shared/ complete).

#### Conversion order:

| Layer | Directory | Files | Lines |
|-------|-----------|------:|------:|
| 6a | `utils/` | 9+1 | 1,060 |
| 6b | `lib/` | 10 | 2,368 |
| 6c | `renderers/` | 2 | 224 |
| 6d | `loaders/` | 2 | 173 |
| 6e | `extractors/` | 9 | 2,903 |
| 6f | `spec-folder/` | 4 | 840 |
| 6g | `core/` | 3 | 778 |
| 6h | `memory/` | 3 | 750 |

6a–6d can be parallelized. 6e–6f depend on 6a–6b. 6g depends on all. 6h is the entry point.

---

### Phase 7: Convert Test Files (59 files)

**Goal:** Convert all test files to TypeScript.

#### Strategy:
- Tests import from compiled source, so they can be converted batch-by-batch
- Use `node:test` and `node:assert` (already used) — both have TypeScript types via `@types/node`
- Group by test target area for parallel conversion

| Batch | Area | Files | Lines |
|-------|------|------:|------:|
| 7a | `mcp_server/tests/` — cognitive/scoring | 12 | ~12,000 |
| 7b | `mcp_server/tests/` — search/storage | 10 | ~9,000 |
| 7c | `mcp_server/tests/` — handlers/integration | 10 | ~10,000 |
| 7d | `mcp_server/tests/` — remaining | 14 | ~11,000 |
| 7e | `scripts/tests/` | 13 | 12,820 |

All 5 batches can run in parallel (tests have no inter-file dependencies).

---

### Phase 8: Documentation Updates

**Goal:** Update all documentation to reflect TypeScript codebase.

#### Parallel streams:

| Stream | Files | Key changes |
|--------|------:|-------------|
| 8a: READMEs | 7 | `.js` → `.ts` in paths, `require` → `import` in examples, `node` invocation notes |
| 8b: SKILL.md | 1 | "JavaScript modules" → "TypeScript modules", script path updates |
| 8c: References (memory/) | 6 | Code samples → TypeScript, architecture diagrams updated |
| 8d: References (other) | 8 | Script path references, code samples where applicable |
| 8e: Assets | 1 | Template mapping script references |
| 8f: CHANGELOG | 1 | Migration entry |

All 6 streams can run in parallel.

---

### Phase 9: Final Verification

**Goal:** Full system verification before declaring completion.

#### Checklist:

1. **Clean build**: `npm run build` completes without errors
2. **Type check**: `tsc --noEmit` passes with zero errors
3. **All tests pass**: `npm test` (both workspaces)
4. **MCP server starts**: `node mcp_server/context-server.js` (compiled) initializes all tools
5. **CLI scripts work**: `node scripts/memory/generate-context.js` (compiled) produces valid output
6. **No `.js` source files**: Only compiled output `.js`, source is `.ts`
7. **Import graph clean**: No circular project references
8. **Documentation accurate**: All paths, examples, and diagrams match reality

---

## 4. Parallel Execution Strategy

### Agent Allocation (up to 10 opus agents)

Given the dependency graph, here's the optimal agent allocation per execution session:

#### Session 1: Foundation (Phases 0–2)

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | Phase 0: TS style_guide.md + quality_standards.md | 2 new |
| Agent 2 | Phase 0: TS quick_reference.md + checklist.md | 2 new |
| Agent 3 | Phase 0: Update SKILL.md + shared refs | 3 updates |
| Agent 4 | Phase 1: tsconfig files + package.json updates | 6 files |
| Agent 5 | Phase 1: sqlite-vec.d.ts + build scripts | 2 files |
| Agent 6 | Phase 2: Move retry.js, path-security.js to shared/ | 5 files |
| Agent 7 | Phase 2: Move folder-scoring.js, update re-exports | 4 files |
| Agent 8–10 | (idle — wait for Phase 3) | — |

#### Session 2: Shared + MCP Foundation (Phases 3–4)

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | Phase 3: shared/utils/ + chunking.ts + profile.ts | 5 files |
| Agent 2 | Phase 3: shared/embeddings/providers/ | 3 files |
| Agent 3 | Phase 3: shared/embeddings.ts + factory.ts + trigger-extractor.ts | 3 files |
| Agent 4 | Phase 4a+4b: lib/utils/ + lib/errors/ | 8 files |
| Agent 5 | Phase 4c+4d: lib/interfaces/ + lib/config/ | 6 files |
| Agent 6 | Phase 4e+4f: lib/scoring/ + lib/response/ | 8 files |
| Agent 7 | Phase 4g+4h: lib/architecture/ + lib/validation/ | 5 files |
| Agent 8 | Phase 4i: lib/parsing/ | 5 files |
| Agent 9 | Phase 4j+4k: formatters/ + utils/ (top-level) | 7 files |
| Agent 10 | Phase 4l: core/ | 3 files |

#### Session 3: Upper Layers (Phase 5 + 6)

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | Phase 5a+5b: lib/embeddings/ + lib/cognitive/ | 13 files |
| Agent 2 | Phase 5c: lib/search/ | 9 files |
| Agent 3 | Phase 5d+5e: lib/storage/ + lib/session/ | 12 files |
| Agent 4 | Phase 5f+5g+5h: lib/cache/ + lib/learning/ + lib/providers/ | 7 files |
| Agent 5 | Phase 5i+5j: hooks/ + handlers/ | 12 files |
| Agent 6 | Phase 5k+5l: scripts/ + context-server.ts | 2 files |
| Agent 7 | Phase 6a+6b: scripts/utils/ + scripts/lib/ | 19 files |
| Agent 8 | Phase 6c+6d+6e: scripts/renderers/ + loaders/ + extractors/ | 13 files |
| Agent 9 | Phase 6f+6g: scripts/spec-folder/ + scripts/core/ | 7 files |
| Agent 10 | Phase 6h: scripts/memory/ (entry points) | 3 files |

#### Session 4: Tests + Docs (Phases 7–9)

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | Phase 7a: mcp tests — cognitive/scoring | 12 files |
| Agent 2 | Phase 7b: mcp tests — search/storage | 10 files |
| Agent 3 | Phase 7c: mcp tests — handlers/integration | 10 files |
| Agent 4 | Phase 7d: mcp tests — remaining | 14 files |
| Agent 5 | Phase 7e: scripts tests | 13 files |
| Agent 6 | Phase 8a: READMEs (all 7) | 7 files |
| Agent 7 | Phase 8b+8c: SKILL.md + memory references | 7 files |
| Agent 8 | Phase 8d+8e+8f: Other refs + assets + changelog | 10 files |
| Agent 9 | Phase 9: Build verification + test execution | — |
| Agent 10 | Phase 9: MCP server smoke test + CLI verification | — |

---

## 5. tsconfig Configuration

### Root tsconfig.json

```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": ".",
    "rootDir": ".",
    "composite": true
  },
  "references": [
    { "path": "./shared" },
    { "path": "./mcp_server" },
    { "path": "./scripts" }
  ],
  "exclude": ["node_modules"]
}
```

### Workspace tsconfig.json (example: shared/)

```jsonc
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Workspace tsconfig.json (example: mcp_server/)

```jsonc
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."
  },
  "references": [
    { "path": "../shared" }
  ],
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 6. Naming Conventions (TypeScript-Specific)

| Construct | Convention | Example |
|-----------|-----------|---------|
| Interface | PascalCase (no `I` prefix) | `EmbeddingProvider`, `VectorStore` |
| Type alias | PascalCase | `SearchResult`, `MemoryRecord` |
| Enum | PascalCase name, PascalCase members | `enum ErrorCode { NotFound, Timeout }` |
| Generic parameter | Single uppercase or `T`-prefixed | `<T>`, `<TResult>` |
| Function | camelCase | `calculateDecayScore()` |
| Constant | UPPER_SNAKE_CASE | `MAX_QUERY_LENGTH` |
| File name | kebab-case (unchanged from JS) | `vector-index.ts` |
| Type-only import | Separate line | `import type { Config } from './config';` |

**Note on interface naming:** The existing `IEmbeddingProvider` and `IVectorStore` use `I` prefix. Decision: **Keep `I` prefix for these two** for backward compatibility in re-export aliases, but new interfaces omit it. Document this exception in the style guide.

---

## 7. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Compiled JS differs from hand-written JS | Compare function signatures using `tsc --declaration` output; run full test suite |
| `__dirname` unavailable | Use `"module": "commonjs"` — `__dirname` works natively |
| `sqlite-vec` has no types | Write minimal `.d.ts` covering only used API surface |
| Tests break during migration | Keep `.js` tests runnable against compiled output; convert tests last |
| Dynamic `require()` in rank-memories.js | Convert to static import during Phase 6 |
| Agent generates inconsistent types | Phase 0 standards + central `types.ts` in shared/ provide canonical definitions |
| Re-export proxies break | Keep proxies as `.ts` files that `export * from` the canonical location |

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| TypeScript strict errors | 0 |
| Test pass rate | 100% (all 59 files) |
| MCP tools functional | All 20+ tools respond correctly |
| CLI scripts functional | All 3 scripts produce identical output |
| Source `.js` files remaining | 0 (all converted to `.ts`) |
| `any` usage in public API | 0 |
| Documentation accuracy | All paths and examples match reality |
| Circular project references | 0 |

---

## 9. Decision Record

| # | Decision | Rationale | Alternatives Considered |
|---|----------|-----------|------------------------|
| D1 | CommonJS output (not ESM) | Preserves `__dirname`, all `path.join()` patterns, and existing `opencode.json` startup | ESM output (would require `import.meta.url` + `fileURLToPath` changes across 50+ files) |
| D2 | In-place compilation (no `dist/`) | Preserves all relative path references, `opencode.json` startup path unchanged | Separate `dist/` folder (would require updating all config paths and startup commands) |
| D3 | `strict: true` from start | Catches type errors early; avoids technical debt from lax config | Incremental strictness (risk of never reaching full strict) |
| D4 | Move files to break circular deps | TypeScript project references require DAG; circular deps are a fundamental blocker | Leave circulars and use a single tsconfig (loses incremental compilation benefits) |
| D5 | Keep `I` prefix on existing interfaces | Backward compatibility for `IEmbeddingProvider`, `IVectorStore` | Remove prefix (would break all import sites and re-export aliases) |
| D6 | Phase 0 standards first | Consistent conventions across all agents and sessions | Start converting immediately (risk of inconsistent patterns) |
| D7 | Central `shared/types.ts` | Single source of truth for cross-workspace types | Types defined per-module (risk of duplication and drift) |
| D8 | Convert tests last (Phase 7) | Tests can run as JS against compiled TS; reduces migration risk | Convert tests alongside source (higher risk of broken test suite during migration) |
