# Plan: Phase 10 — Type Error Remediation

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-K
> **Session:** 5
> **Status:** Planning
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3plus-govern | v2.0 -->

---

## 1. Overview

**Goal:** Resolve all 275 remaining TypeScript compilation errors in `mcp_server/` so the entire codebase compiles cleanly.

**Scope:**
- 14 files with errors
- 275 total errors (253 in one test file)
- Estimated effort: 4–6 hours
- 3 streams of work (parallelizable)

**Strategy:** Fix in dependency order — barrel conflicts first (unblocks everything), then production files, then test files (largest batch last).

---

## 2. Execution Strategy

### Stream 10a: Barrel Export Conflicts (8 errors, 3 files)

**Priority:** First — barrel fixes unblock downstream type resolution.

| File | Errors | Root Cause | Fix Strategy |
|------|-------:|------------|-------------|
| `lib/storage/index.ts` | 5 | `init` exported from 5 modules | Use prefixed re-exports: `export { init as historyInit } from './history'` |
| `lib/search/index.ts` | 3 | `RerankResult`, `isRerankerAvailable`, `rerankResults` duplicated | Explicit named exports excluding duplicates |
| `formatters/index.ts` | 1 (TS2308) | Ambiguous export | Explicit named exports |

**Approach:** Read each barrel file, identify conflicting export names, switch from `export *` to explicit named exports with disambiguation.

### Stream 10b: Production Type Fixes (14 errors, 9 files)

**Priority:** Second — production code must compile before tests.

| File | Errors | Error Codes | Fix Strategy |
|------|-------:|-------------|-------------|
| `lib/scoring/composite-scoring.ts` | 3 | TS2339, TS2551 | Align property names with upstream interface |
| `formatters/search-results.ts` | 3 | TS2739, TS2339 | Add missing properties to `MCPResponse` type |
| `handlers/memory-triggers.ts` | 2 | TS2322, TS18048 | Type narrowing + null checks |
| `lib/search/hybrid-search.ts` | 1 | TS2339 | Property access fix |
| `lib/search/fuzzy-match.ts` | 1 | TS2339 | Property access fix |
| `lib/parsing/trigger-matcher.ts` | 1 | TS2459 | Export missing local |
| `lib/parsing/memory-parser.ts` | 1 | TS1192 | Add default export |
| `formatters/token-metrics.ts` | 0 | — | May have cascading fix from search-results |
| `mcp_server/context-server.ts` | 0 | — | May need fixes after barrel resolution |

**Approach:** Read each file, understand the type mismatch, make minimal surgical fix (prefer type assertions over refactoring).

### Stream 10c: Test File Remediation (254 errors, 2 files)

**Priority:** Last — largest batch but self-contained.

#### `provider-chain.test.ts` (253 errors)

This is a comprehensive rewrite of test assertions to match the current `EmbeddingProviderChain` API. The fix requires:

1. **Read the current `provider-chain.ts`** to understand the actual API surface
2. **Map old API → new API** for all test assertions:
   - Constructor: `new EmbeddingProviderChain(config)` → determine current constructor signature
   - Methods: `embed()` → `generateEmbedding()`, `embedQuery()` → `embed_query()`, etc.
   - Properties: `initialized` → check actual property name, `activeTier` → check actual access
   - Enums: `TERTIARY` → removed, error reasons consolidated
3. **Update all 253 assertion sites** with correct API calls
4. **Run the test** to verify functional correctness

#### `session-manager.test.ts` (1 error)

Single type error — likely a minor property access fix.

### Stream 10d: Runtime Bug Fix (1 issue)

**`vector-index.js` self-require infinite recursion:**
- Read `lib/search/vector-index.js` to identify the self-require pattern
- Fix the circular require by restructuring the module initialization
- Verify MCP server starts after fix

---

## 3. Execution Order

```
Stream 10a: Barrel conflicts (3 files)     ← FIRST (unblocks type resolution)
    ↓
Stream 10b: Production fixes (9 files)     ← SECOND (must compile before tests)
    ↓
Stream 10c: Test remediation (2 files)     ← THIRD (largest, self-contained)
    ↓
Stream 10d: Runtime fix (1 file)           ← CAN RUN IN PARALLEL with 10a-10c
    ↓
VERIFY: tsc --build (0 errors) + npm test (all pass) + MCP server starts
```

**Parallelization:**
- Stream 10d is independent and can run anytime
- Streams 10a → 10b → 10c are sequential (each unblocks the next)
- Within Stream 10b, most files are independent and can be fixed in parallel

---

## 4. Agent Allocation

| Agent | Stream | Files | Est. Effort |
|-------|--------|------:|------------|
| Agent 1 | 10a + 10b | 12 files, 22 errors | 1–2 hours |
| Agent 2 | 10c (provider-chain.test.ts) | 1 file, 253 errors | 2–3 hours |
| Agent 3 | 10c (session-manager) + 10d | 2 files, 2 issues | 30 min |

**Total agents:** 3 (parallelizable after Stream 10a completes)

---

## 5. Verification Strategy

### Per-Stream Verification

| Stream | Verification |
|--------|-------------|
| 10a | `tsc --noEmit -p mcp_server/tsconfig.json 2>&1 \| grep TS2308` returns 0 matches |
| 10b | Error count drops from 275 to ≤254 (test-only errors remaining) |
| 10c | `tsc --noEmit -p mcp_server/tsconfig.json` returns 0 errors |
| 10d | `node mcp_server/context-server.js` starts without crash |

### Final Verification

1. `tsc --build` — 0 errors across all 3 workspaces
2. `npm run test:cli` — PASS
3. `npm run test:embeddings` — PASS
4. `npm run test:mcp` — PASS
5. MCP server starts and registers all 20+ tools

---

## 6. Risk Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `provider-chain.test.ts` API has changed more than documented | Medium | High | Read actual `.ts` source first, map complete API surface before editing tests |
| Barrel conflict resolution introduces import breakage | Low | Medium | Run `tsc --noEmit` after each barrel fix |
| `vector-index.js` fix introduces regression | Medium | High | Run `test:mcp` before and after, compare output |
| Fixing one error creates new errors elsewhere | Low | Medium | Incremental compilation after each file fix |

---

## Cross-References

- **Spec:** See `spec.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
- **Decision Record:** See `decision-record.md`
- **Parent Plan:** `092-javascript-to-typescript/plan.md`
