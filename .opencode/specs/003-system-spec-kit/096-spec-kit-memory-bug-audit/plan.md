# Plan — System Spec-Kit & Memory MCP Bug Fix

| Field              | Value                                    |
| ------------------ | ---------------------------------------- |
| **Spec ID**        | 096                                      |
| **Phases**         | 7                                        |
| **Estimated LOC**  | 2,000–3,000+                             |
| **Estimated Files**| ~50                                      |
| **Execution**      | Sequential phases with parallel overlap  |

---

## Dependency Graph

```
Phase 1 (Critical Crashers & Config)
    │
    ▼
Phase 2 (Embedding System)
    │
    ├──────────────────┬──────────────────┐
    ▼                  ▼                  ▼
Phase 3 (Search)   Phase 4 (Atomicity)  Phase 5 (FSRS/Cognitive)
    │                  │                  │
    └──────────────────┴──────────────────┘
                       │
                       ▼
                Phase 6 (Type System Unification)
                       │
                       ▼
                Phase 7 (Test Coverage)
```

**Key constraint**: Phases 3, 4, and 5 can run in parallel after Phase 2 completes. Phase 6 requires all logic fixes (3–5) done before the type sweep. Phase 7 is last because it tests the fixed code.

---

## Build & Test Commands

```bash
cd .opencode/skill/system-spec-kit
npm run typecheck    # Type check only (tsc --noEmit)
npm run build        # Full compilation (tsc --build)
npm test             # All tests
npm run test:mcp     # MCP server tests only
```

**Gate after every phase**: `npm run typecheck` and `npm run build` must pass before proceeding to the next phase.

---

## Phase 1: Critical Crashers & Configuration (~14 bugs)

**Goal**: Eliminate all crash-on-startup bugs, shell script failures, and configuration conflicts.

**Files touched**:
- `scripts/spec/validate.sh`
- `scripts/spec/create.sh`
- `scripts/spec/compose.sh`
- `shared/config.ts` (or equivalent configuration module)
- `shared/path-security.ts`
- `mcp_server/context-server.ts`

**Bugs**: P1-01 through P1-14

**Approach**:
1. Fix shell scripts for macOS compatibility (date, local keyword, argument checks)
2. Sanitize all shell variables used in JSON output to prevent injection
3. Unify DB path environment variable to a single canonical name
4. Add `fs.realpathSync` to path-security.ts for symlink traversal protection
5. Fix context-server.ts warmup timeout to properly handle embedding init failure
6. Fix MCP transport shutdown, unhandledRejection behavior, and TOCTOU race

**Dependencies**: None (first phase)
**Risk**: LOW — isolated fixes, mostly shell scripts and config
**Exit gate**: `npm run typecheck` passes, shell scripts run on macOS without error

---

## Phase 2: Embedding System (~10 bugs)

**Goal**: Ensure embedding provider fallback is safe, dimensions are validated, and caching is correct.

**Files touched**:
- `shared/embeddings/factory.ts`
- `shared/embeddings.ts`
- `shared/embeddings/provider-chain.ts`
- `shared/embeddings/openai.ts`
- `shared/embeddings/voyage.ts`
- `mcp_server/vector-index-impl.js` (config section)
- `mcp_server/checkpoints.ts`

**Bugs**: P2-01 through P2-10

**Approach**:
1. Add dimension validation when provider fallback occurs — reject or rebuild index if dimension changes
2. Key embedding cache by `{provider, model, text}` tuple instead of text alone
3. Replace `require()` with static import for retry module; add explicit error on load failure
4. Fix backoff calculation off-by-one so first retry uses 1min, not 5min
5. Add 429 backpressure handling in batch embedding operations
6. Fix content load retry counting to prevent infinite loops
7. Add dimension validation on checkpoint restore

**Dependencies**: Phase 1 (shared config/vector-index file touched in both)
**Risk**: MEDIUM — embedding dimension mismatch can corrupt the entire vector index
**Exit gate**: `npm run typecheck` passes, `npm run build` succeeds, embedding dimension validated on provider switch

---

## Phase 3: Search Pipeline (~21 bugs)

**Goal**: Fix the search pipeline so intent weights are actually applied, scores are comparable, and all code paths are reachable.

**Files touched**:
- `mcp_server/handlers/memory-search.ts`
- `mcp_server/search/hybrid-search.ts`
- `mcp_server/search/bm25-index.ts`
- `mcp_server/search/cross-encoder.ts`
- `mcp_server/search/intent-classifier.ts` (or equivalent)
- `mcp_server/search/rrf-fusion.ts`
- `mcp_server/search/filter-stats.ts`
- `mcp_server/search/filter-noise.ts`

**Bugs**: P3-01 through P3-21

**Approach**:
1. Wire intent weights into the actual scoring path (currently computed then discarded)
2. Normalize BM25 scores to 0–1 range before hybrid merge with cosine scores
3. Connect hybridSearchEnhanced with RRF fusion to the call path (or remove dead code)
4. Persist BM25 index to SQLite so it survives restarts
5. Fix specFolder filter to use exact ID match instead of string containment
6. Complete FTS5 query sanitization (handle all SQLite special characters)
7. Fix cross-encoder originalRank calculation
8. Debias intent classifier away from "understand" default
9. Restore RRF fusion .ts source (currently only orphaned .js in dist/)
10. Eliminate testing-effect writes during read operations (40 DB ops per search)
11. Fix filterStats singleton mutation and filterNoise input-array mutation

**Dependencies**: Phase 2 (correct embeddings needed for vector search to produce valid scores)
**Risk**: MEDIUM-HIGH — search is the most user-facing subsystem; incorrect scoring affects all memory retrieval
**Exit gate**: `npm run typecheck` passes, `npm run test:mcp` passes, intent weights verified in search results

---

## Phase 4: Atomicity & Transactions (~20 bugs)

**Goal**: Ensure all database mutations are properly wrapped in transactions with correct error handling.

**Files touched**:
- `mcp_server/handlers/memory-save.ts`
- `mcp_server/handlers/memory-crud.ts`
- `mcp_server/session-manager.ts`
- `mcp_server/checkpoints.ts`
- `mcp_server/access-tracker.ts`
- `mcp_server/incremental-index.ts`

**Bugs**: P4-01 through P4-20

**Approach**:
1. Fix atomicSaveMemory to actually execute the DB insert (currently a no-op)
2. Wrap updateExistingMemory in a SQLite transaction
3. Check markMemorySuperseded return value and handle failure
4. Wrap bulk delete in transaction and clean causal edges
5. Fix session-manager to refresh DB handle after reinitializeDatabase()
6. Fix reinitializeMutex pattern (likely double-release or missing acquire)
7. Add duplicate detection on checkpoint restore
8. Add embedding validation on checkpoint restore
9. Cap access-tracker Map growth to prevent unbounded memory
10. Fix exit handlers to check DB state before writing
11. Fix generateMemoryHash to use consistent casing
12. Wrap executeAtomicSave in actual SQLite transaction

**Dependencies**: Phase 2 (checkpoint validation requires correct embedding dimensions)
**Risk**: MEDIUM — transaction bugs can cause data loss or corruption, but fixes are localized
**Exit gate**: `npm run typecheck` passes, atomicSaveMemory verified to write to DB

---

## Phase 5: FSRS / Cognitive Memory (~7 bugs)

**Goal**: Fix the spaced-repetition and cognitive memory subsystem so stability calculations are correct and archival decisions are consistent.

**Files touched**:
- `mcp_server/cognitive/tier-classifier.ts`
- `mcp_server/cognitive/prediction-error-gate.ts`
- `mcp_server/cognitive/attention-decay.ts`

**Bugs**: P5-01 through P5-07

**Approach**:
1. Replace exponential formula in halfLifeToStability() with correct FSRS power-law formula (current is 18.5x too slow)
2. Change ARCHIVED condition from `&&` to `||` per FSRS spec
3. Tighten contradiction detection to reduce false positives
4. Fix working memory decay/delete race condition (likely needs mutex or check-before-delete)
5. Reconcile dual archival decision paths to use single source of truth
6. Persist ephemeral archival stats across restarts
7. Fix documentation comment about FACTOR position

**Dependencies**: None (can run in parallel with Phases 3 and 4)
**Risk**: LOW-MEDIUM — incorrect stability affects long-term memory scheduling but not immediate crashes
**Exit gate**: `npm run typecheck` passes, halfLifeToStability produces correct values for known inputs

---

## Phase 6: Type System Unification (~7 systemic issues)

**Goal**: Create a single source of truth for shared types, eliminate unsafe casts, and ensure consistent naming.

**Files touched**:
- `shared/types.ts`
- New normalization module (e.g., `shared/normalize.ts`)
- All handler files (for cast removal)
- All files with duplicate type definitions

**Bugs**: P6-01 through P6-07

**Approach**:
1. Define canonical `MemoryDbRow` type with snake_case fields matching SQLite columns
2. Create a normalization layer (`toDbRow()` / `fromDbRow()`) for camelCase ↔ snake_case conversion
3. Unify `SearchResult` to a single definition, update all import sites
4. Unify `Database` interface to a single definition with clear contract
5. Unify `EmbeddingProfile` to a single definition
6. Replace 91 unsafe `as unknown as` casts with runtime validation or proper type narrowing
7. Standardize score field naming across all result types

**Dependencies**: Phases 3–5 (all logic fixes must be done before the type sweep, otherwise type changes would conflict with logic fixes)
**Risk**: HIGH — touches many files across all packages; must be done carefully with build verification after each sub-task
**Exit gate**: `npm run typecheck` passes, `npm run build` succeeds, zero `as unknown as` casts remaining

---

## Phase 7: Test Coverage (~35+ new test files)

**Goal**: Add unit tests for all untested modules, with focus on critical paths.

**Files touched**:
- New files in `mcp_server/tests/`
- New files in `scripts/tests/`

**Untested script modules (35)**:
1. generate-context.ts
2. validate-spec.ts
3. compose-memory.ts
4. extraction modules (content-filter, metadata-extractor, etc.)
5. template modules (template-engine, template-loader, etc.)
6. All shell script wrappers
7. Configuration loaders
8. Path utilities
9. Remaining script modules

**Untested MCP server modules (17)**:
1. context-server.ts (integration)
2. vector-index-impl.js
3. path-security.ts
4. session-manager.ts
5. access-tracker.ts
6. incremental-index.ts
7. checkpoints.ts
8. SQLite layer
9. Several handler files
10. Cognitive modules (tier-classifier, attention-decay, prediction-error-gate)
11. Search modules (bm25-index, cross-encoder, intent-classifier, rrf-fusion)
12. Filter modules (filter-stats, filter-noise)
13. Remaining server modules

**Approach**:
1. Start with critical untested modules: SQLite layer, generate-context.ts, vector-index-impl.js, path-security.ts, context-server.ts
2. Add tests for each bug fix (regression tests)
3. Add integration tests for the search pipeline end-to-end
4. Add tests for cognitive memory calculations (known-input/known-output)
5. Add tests for transaction atomicity (simulate failures mid-transaction)

**Dependencies**: All phases (tests should verify the fixed code)
**Risk**: LOW — additive only, no existing code modified
**Exit gate**: `npm test` passes (full suite including all new tests)

---

## Rollback Strategy

Each phase produces a separate commit. If a phase introduces regressions:

1. `git revert` the phase commit
2. Investigate and fix in isolation
3. Re-apply with corrections

For Phase 6 (highest risk), consider sub-commits per type unification task.
