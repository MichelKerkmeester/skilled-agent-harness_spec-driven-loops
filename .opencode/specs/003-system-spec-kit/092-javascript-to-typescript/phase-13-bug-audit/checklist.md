# Verification Checklist: Phase 12 — Post-Migration Bug Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## Priority Legend

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

---

## Stream A: Test Infrastructure

- [ ] CHK-400 [P0] `npm run test:mcp` completes within 5 minutes (no hang)
  - **Evidence**:

- [ ] CHK-401 [P0] `npm run test:mcp` exit code reflects actual pass/fail
  - **Evidence**:

- [ ] CHK-402 [P0] `npm test` runs all 3 suites (cli, embeddings, mcp) sequentially
  - **Evidence**:

- [ ] CHK-403 [P1] Test scripts return non-zero exit code on failure
  - **Evidence**:

---

## Stream B: Logic Bugs

- [ ] CHK-410 [P0] tier-classifier: R=0.95 → HOT (not DORMANT)
  - **Evidence**:

- [ ] CHK-411 [P0] tier-classifier: R=0.80 → HOT (boundary)
  - **Evidence**:

- [ ] CHK-412 [P0] tier-classifier: R=0.50 → WARM
  - **Evidence**:

- [ ] CHK-413 [P0] tier-classifier: R=0.04 → DORMANT
  - **Evidence**:

- [ ] CHK-414 [P0] tier-classifier: Tests T201-T210 all pass
  - **Evidence**:

- [ ] CHK-415 [P0] FSRS scheduler: test failure count reduced from 7 to ≤ 2
  - **Evidence**:

- [ ] CHK-416 [P1] IVectorStore.search() throws on unimplemented
  - **Evidence**:

- [ ] CHK-417 [P1] isBm25Enabled is a function (export works)
  - **Evidence**:

---

## Stream C: Module Path Breakage

- [ ] CHK-420 [P0] 0 "Cannot find module" errors across all test files
  - **Evidence**:

- [ ] CHK-421 [P0] All 8 failing original JS mcp_server tests run without path errors
  - **Evidence**:

- [ ] CHK-422 [P0] All 6 failing scripts tests run without path errors
  - **Evidence**:

---

## Stream D: require() → import

- [ ] CHK-430 [P1] 0 `require()` calls in mcp_server production .ts files
  - **Evidence**: `grep -rn "require(" --include="*.ts" mcp_server/ --exclude-dir=tests --exclude-dir=dist`

- [ ] CHK-431 [P1] 0 `module.exports` in production .ts files
  - **Evidence**: `grep -rn "module.exports" --include="*.ts" mcp_server/ --exclude-dir=tests --exclude-dir=dist`

- [ ] CHK-432 [P1] `tsc --build` passes after import conversion
  - **Evidence**:

- [ ] CHK-433 [P1] No runtime regressions after import conversion
  - **Evidence**: All previously-passing tests still pass

---

## Stream E: Test File Consolidation

- [ ] CHK-440 [P1] No duplicate .js/.ts test files
  - **Evidence**:

- [ ] CHK-441 [P1] Test runner uses compiled dist/tests/ exclusively
  - **Evidence**:

---

## Stream F: Type-Safety Hardening

- [ ] CHK-450 [P2] `allowJs: false` in mcp_server/tsconfig.json
  - **Evidence**:

- [ ] CHK-451 [P2] No `'use strict'` in .ts files
  - **Evidence**:

- [ ] CHK-452 [P2] Type assertion count reduced by ≥ 50% (from 180+)
  - **Evidence**:

- [ ] CHK-453 [P2] Non-null assertion count reduced by ≥ 50% (from 70+)
  - **Evidence**:

---

## Final Verification

- [ ] CHK-490 [P0] `tsc --build` — 0 errors
  - **Evidence**:

- [ ] CHK-491 [P0] `npm test` passes (all suites)
  - **Evidence**:

- [ ] CHK-492 [P0] MCP server starts: `node mcp_server/dist/context-server.js` — all 20+ tools register
  - **Evidence**:

- [ ] CHK-493 [P1] CLI tools: generate-context and rank-memories produce valid output
  - **Evidence**:

---

## Summary

| Category | P0 | P1 | P2 | Total |
|----------|---:|---:|---:|------:|
| Stream A: Test Infrastructure | 3 | 1 | 0 | 4 |
| Stream B: Logic Bugs | 6 | 2 | 0 | 8 |
| Stream C: Path Breakage | 3 | 0 | 0 | 3 |
| Stream D: require→import | 0 | 4 | 0 | 4 |
| Stream E: Test Consolidation | 0 | 2 | 0 | 2 |
| Stream F: Type Hardening | 0 | 0 | 4 | 4 |
| Final Verification | 2 | 1 | 0 | 3 |
| **Total** | **14** | **10** | **4** | **28** |
