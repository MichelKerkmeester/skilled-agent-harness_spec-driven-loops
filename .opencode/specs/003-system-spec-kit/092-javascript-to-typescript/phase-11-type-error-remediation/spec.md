# Phase 10: Type Error Remediation

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-K
> **Tasks:** T330–T356
> **Milestone:** M10 (Clean Build)
> **SYNC Gate:** SYNC-010
> **Depends On:** Phases 0–9 (all prior migration work complete)
> **Session:** 5

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3plus-govern | v2.0 -->

---

## Goal

Resolve all 275 remaining TypeScript compilation errors in the `mcp_server/` workspace so that `tsc --build` exits with 0 errors across all three workspaces (shared/, mcp_server/, scripts/). This is the final remediation phase before the JS-to-TS migration can be declared complete.

## Context

Phases 0–9 created 179 `.ts` files across the entire system-spec-kit codebase. The `shared/` and `scripts/` workspaces compile cleanly (0 errors). However, `mcp_server/` has 275 type errors remaining — **92% concentrated in a single test file** (`provider-chain.test.ts` with 253 errors), plus 22 errors across 11 production/barrel files.

### Error Distribution

| Category | Files | Errors | % of Total |
|----------|------:|-------:|-----------:|
| Test file: `provider-chain.test.ts` | 1 | 253 | 92% |
| Barrel export conflicts | 3 | 8 | 3% |
| Production type mismatches | 7 | 11 | 4% |
| Test file: `session-manager.test.ts` | 1 | 1 | <1% |
| Missing default exports | 2 | 2 | <1% |
| **Total** | **14** | **275** | **100%** |

### Error Codes

| Code | Count | Description |
|------|------:|-------------|
| TS2339 | 168 | Property does not exist on type |
| TS2554 | 67 | Expected N arguments, but got M |
| TS2551 | 16 | Property name mismatch (camelCase vs snake_case) |
| TS2308 | 8 | Duplicate/ambiguous re-export |
| TS2739 | 7 | Type missing required properties |
| TS2322 | 2 | Type not assignable |
| TS1192 | 2 | Module has no default export |
| Other | 5 | Various (TS2459, TS2352, TS18047, TS18048, TS1117) |

## Scope

**In scope:**
- Fix all 275 type errors in `mcp_server/` workspace
- Resolve barrel export conflicts in `lib/storage/index.ts`, `lib/search/index.ts`, `formatters/index.ts`
- Update `provider-chain.test.ts` to match current `EmbeddingProviderChain` API
- Fix production type mismatches in 7 files
- Fix pre-existing `vector-index.js` self-require bug (blocks MCP server startup)

**Out of scope:**
- Converting remaining 33 `.js`-only test files to `.ts` (separate future effort)
- Refactoring module APIs — only align types with existing runtime behavior
- Performance optimization of build pipeline

## Root Cause Analysis

### 1. `provider-chain.test.ts` (253 errors)

The `EmbeddingProviderChain` class underwent a significant API refactor during Phase 5 conversion:
- Constructor changed from accepting config object to no-arg
- Method names changed from camelCase to snake_case (`embedQuery` → `embed_query`)
- Enum values consolidated (`TERTIARY` tier removed, error reasons simplified)
- Class properties renamed/removed (`initialized` → no direct property, `activeProvider` → different access pattern)

The test file was mechanically converted from `.js` to `.ts` (Phase 7) but the test assertions still reference the **old** API surface.

### 2. Barrel export conflicts (8 errors)

Multiple modules in `lib/storage/` and `lib/search/` export symbols with the same name (e.g., `init`), causing ambiguous re-export errors in barrel `index.ts` files.

### 3. Production type mismatches (11 errors)

Cross-module type alignment issues where interfaces defined during Phase 4–5 conversion don't exactly match usage patterns in consuming code.

### 4. `vector-index.js` self-require bug (runtime crash)

Pre-existing issue where `vector-index.js` requires itself during initialization, causing infinite recursion. This blocks `test:mcp` and MCP server startup.

## Exit Criteria

- [ ] `tsc --build` exits with 0 errors (all 3 workspaces)
- [ ] `npm run test:cli` passes
- [ ] `npm run test:embeddings` passes
- [ ] `npm run test:mcp` passes (requires vector-index fix)
- [ ] MCP server starts: `node mcp_server/context-server.js` initializes all 20+ tools
- [ ] No regressions in shared/ or scripts/ workspaces
- [ ] SYNC-010 gate: Migration Verified

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Parent Plan:** `092-javascript-to-typescript/plan.md`
- **Phase 9 Verification Report:** `phase-10-final-verification/` (source of error data)
- **Phase 5 Spec:** `phase-6-mcp-server-upper/spec.md` (where API changes originated)
- **Phase 7 Spec:** `phase-8-convert-tests/spec.md` (where test conversion happened)
