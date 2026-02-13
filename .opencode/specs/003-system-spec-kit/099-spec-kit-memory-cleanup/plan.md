# 099: Spec Kit Memory Cleanup — Plan

## Phases

### Phase 1: Database Consolidation (P1)
**Goal**: Ensure all memory .md files are indexed in the active Voyage DB.

**Approach**:
1. Run `memory_index_scan()` with `force: false` (incremental) to discover unindexed files
2. Verify results — compare pre/post memory count
3. Run `memory_health` to confirm system stability

**Risk**: Embedding API cost for ~170+ new embeddings. Mitigated by incremental mode (skips already-indexed files).

**Estimated effort**: Low — mostly automated via `memory_index_scan`

### Phase 2: Unsafe Cast Removal (P2)
**Goal**: Eliminate unnecessary `as unknown as` and `as any` casts.

**Approach by root cause**:

| Root Cause | Count | Fix Strategy |
|-----------|-------|-------------|
| MCP args dispatch (context-server.ts) | 14 | Add index signatures to arg types OR create generic dispatch helper |
| JS→TS bridge (vector-index.ts, memory-search.ts) | 8 | Create `.d.ts` declaration files for JS implementations |
| DB type mismatch (better-sqlite3) | 5 | Create unified `Database` type alias or wrapper interface |
| Missing index signatures | 8 | Add `[key: string]: unknown` to return types that need it |
| Shape mismatch (EnrichedTriggerMatch vs MemoryRow) | 4 | Extract common interface, use generics on tier-classifier |
| Test casts (deliberate) | 30 | KEEP — these are intentional for error path testing |

**Priority**: Fix business logic casts first (26), then protocol boundary (17). Skip test casts (35).

**Estimated effort**: Medium — 10 source files to modify

### Phase 3: Type System Unification (P3)
**Goal**: Migrate from deprecated `MemoryRow`/`MemoryRecord` to canonical `Memory`/`MemoryDbRow`.

**Approach**:
1. Audit all consumers of `MemoryRow` (4 importers + composite-scoring re-export)
2. Audit all consumers of `MemoryRecord` (2 importers + IVectorStore)
3. Update function signatures to use `Memory` (camelCase) for app-layer code
4. Update DB-layer code to use `MemoryDbRow` (snake_case)
5. Insert `dbRowToMemory()` / `memoryToDbRow()` conversions at boundaries
6. Remove deprecated type definitions
7. Update `MemorySearchRow` local shadow type in memory-search.ts

**Dependencies**: Phase 2 should complete first (some casts are between these types)

**Estimated effort**: High — ~20 files to touch, careful migration needed

### Phase 4: Score Field Documentation (P4)
**Goal**: Document that `.score` is intentionally context-dependent.

**Approach**: After research, the score naming is NOT inconsistent — `.score` means "relevance in this context" and `scoringMethod` disambiguates. The real issue was just documentation.

1. Add JSDoc comments to key score fields explaining semantics
2. Document the score taxonomy in a reference file

**Estimated effort**: Low — documentation only

### Phase 5: Test Coverage (P5)
**Goal**: Add unit tests for untested modules.

**Approach**: Work through P7-01 to P7-51 from spec 096 tasks.md. Prioritize:
1. Modules with unsafe casts being fixed (validate fixes work)
2. Core business logic modules
3. Utility/helper modules

**Estimated effort**: Very High — 48 modules, likely 1000+ LOC of tests

### Phase 6: Verification (P6)
1. Run full test suite: `npx vitest run`
2. TypeScript typecheck: `npx tsc --noEmit`
3. Build: verify dist/ output
4. Memory health check
5. Update implementation-summary.md

## Execution Order
```
P1 (DB consolidation) ──┐
                         ├── P4 (Score docs) ── P6 (Verify)
P2 (Unsafe casts) ──────┤
                         │
P3 (Type unification) ───┘ (depends on P2)
                         
P5 (Tests) ── runs throughout, final push after P3
```

## Constraints
- Do NOT commit changes (user preference)
- All 62 existing tests must continue passing
- No breaking changes to MCP protocol interface
