# Verification Checklist: Phase 10 — Type Error Remediation

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level3plus-govern | v2.0 -->

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

## Stream 10a: Barrel Export Fixes

- [ ] CHK-200 [P0] `lib/storage/index.ts` — 0 ambiguous re-export errors (TS2308)
  - **Evidence**:

- [ ] CHK-201 [P0] `lib/search/index.ts` — 0 ambiguous re-export errors (TS2308)
  - **Evidence**:

- [ ] CHK-202 [P0] `formatters/index.ts` — 0 ambiguous re-export errors (TS2308)
  - **Evidence**:

---

## Stream 10b: Production Type Fixes

- [ ] CHK-203 [P0] `lib/scoring/composite-scoring.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-204 [P0] `formatters/search-results.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-205 [P0] `handlers/memory-triggers.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-206 [P0] `lib/search/hybrid-search.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-207 [P0] `lib/search/fuzzy-match.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-208 [P0] `lib/parsing/trigger-matcher.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-209 [P0] `lib/parsing/memory-parser.ts` — 0 type errors
  - **Evidence**:

- [ ] CHK-210 [P0] All non-test `mcp_server/` files compile with 0 errors
  - **Evidence**:

---

## Stream 10c: Test File Remediation

- [ ] CHK-211 [P0] `provider-chain.test.ts` — 0 type errors (down from 253)
  - **Evidence**:
  - Constructor tests compile
  - Embedding method tests compile
  - Fallback/tier tests compile
  - Status/health tests compile
  - MockProvider aligns with `IEmbeddingProvider`

- [ ] CHK-212 [P0] `session-manager.test.ts` — 0 type errors (down from 1)
  - **Evidence**:

---

## Stream 10d: Runtime Bug Fix

- [ ] CHK-213 [P1] `vector-index.js` self-require infinite recursion fixed
  - **Evidence**:
  - `node -e "require('./mcp_server/lib/search/vector-index')"` completes without stack overflow
  - No runtime errors during module load

---

## Phase 10 Quality Gate

- [ ] CHK-214 [P0] `tsc --build` exits with 0 errors (all 3 workspaces)
  - **Evidence**:
  - shared/ — 0 errors
  - mcp_server/ — 0 errors
  - scripts/ — 0 errors

- [ ] CHK-215 [P0] `npm run test:cli` — PASS
  - **Evidence**:

- [ ] CHK-216 [P0] `npm run test:embeddings` — PASS
  - **Evidence**:

- [ ] CHK-217 [P0] `npm run test:mcp` — PASS
  - **Evidence**:

- [ ] CHK-218 [P0] MCP server starts: `node mcp_server/context-server.js` initializes without crash
  - **Evidence**:

- [ ] CHK-219 [P0] All 20+ MCP tools listed in server initialization
  - **Evidence**:

- [ ] CHK-220 [P1] No regressions in shared/ or scripts/ workspaces
  - **Evidence**:

- [ ] CHK-221 [P2] Parent `tasks.md` and `checklist.md` updated with Phase 10 completion status
  - **Evidence**:

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Barrel Export Fixes | 3 | /3 | 3 P0 |
| Production Type Fixes | 8 | /8 | 8 P0 |
| Test File Remediation | 2 | /2 | 2 P0 |
| Runtime Bug Fix | 1 | /1 | 1 P1 |
| Quality Gate | 8 | /8 | 6 P0, 1 P1, 1 P2 |
| **TOTAL** | **22** | **/22** | **19 P0, 2 P1, 1 P2** |

**Verification Date**: ________________

---

## Cross-References

- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Decision Record:** See `decision-record.md`
- **Parent Checklist:** `092-javascript-to-typescript/checklist.md`
