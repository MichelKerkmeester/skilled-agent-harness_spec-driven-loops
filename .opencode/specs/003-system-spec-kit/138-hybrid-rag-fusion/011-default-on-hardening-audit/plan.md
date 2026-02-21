# Implementation Plan: 011 - Default-On Hardening Audit

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)

## 1. OVERVIEW

This document defines the execution plan, workstreams, and gates for Child 011 hardening.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Bash + Markdown command specs |
| **Framework** | system-spec-kit scripts + MCP server |
| **Storage** | SQLite (existing), no schema expansion required for this hardening scope |
| **Testing** | Vitest + script-based shell/node tests |

### Overview

This implementation hardens specs 136/138/139 with five coordinated tracks: default-on policy enforcement, known defect fixes, dead-code/runtime-claim closure, shared-module/script reorganization, and full type/test gate restoration. The change set is explicitly corrective and does not introduce new product features.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature inventory matrix completed and frozen in `spec.md`
- [x] Baseline failures captured (`typecheck`, MCP tests, full test gate)
- [x] Scope boundaries frozen (in-scope vs out-of-scope)
- [x] Verification commands fixed for completion criteria

### Definition of Done
- [x] All P0 requirements complete
- [x] All P1 requirements complete or explicitly deferred by user
- [x] `npm run typecheck` passes
- [x] `npm run test --workspace=mcp_server` passes
- [x] `npm test` passes
- [x] checklist evidence populated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE / EXECUTION MODEL

### Pattern

Focused hardening sprint with minimal behavioral delta: fix correctness and reliability first, then stabilize module boundaries and tests.

### Workstreams

- **WS-A Default-On Policy**
  - Standardize flag interpretation to default-on semantics (unset/empty/`true` enabled, only explicit `false` disabled) for target surfaces.
- **WS-B Correctness Fixes**
  - `create.sh` phase append map behavior.
  - SGQS skill-root resolution in runtime and scripts.
- **WS-C Runtime Contract Cleanup**
  - Semantic bridge runtime wiring decision.
  - SGQS handler runtime coverage.
  - AST/chunker runtime-vs-non-runtime contract clarity.
- **WS-D Shared Module / Script Reorg**
  - Move dataset generator under fixture tooling.
  - Consolidate SGQS builder/types and chunker into shared workspace location.
  - Remove generated source-adjacent artifacts outside `dist` for migrated modules.
- **WS-E Verification and Closure**
  - Fill missing `/spec_kit:phase` and `--phase-folder` tests.
  - Drive all gates green.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline Lock + Default-On Contract
- Freeze baseline evidence in docs.
- Implement default-on semantics in covered flag checks.
- Add explicit tests for unset/empty/`true`/`false` behavior.

### Phase 2: Known Defect Remediation
- Fix `scripts/spec/create.sh` append map update logic.
- Fix SGQS skill-root resolution in:
  - `mcp_server/context-server.ts`
  - `scripts/memory/reindex-embeddings.ts`

### Phase 3: Runtime Gap Closure
- Decide and implement semantic-bridge runtime behavior for deep mode.
- Add runtime coverage for `handlers/sgqs-query.ts`.
- Resolve AST/chunker contract ambiguity with code + tests.

### Phase 4: Reorganization + Import Boundary Cleanup
- Move `scripts/evals/generate-phase1-5-dataset.ts` to fixture tooling location.
- Move SGQS shared builder/types and structure-aware chunker to shared workspace module.
- Remove migrated source-adjacent generated artifacts outside `dist`.
- Update imports to eliminate TS6059/TS2307 path leakage.

### Phase 5: Gate Closure
- Resolve remaining strict typing issues in `mcp_server` and tests.
- Add command flow coverage for `/spec_kit:phase` and `--phase-folder` handling.
- Run full verification suite and populate checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Script tests | phase scoring/creation/validation, command-path behavior | Node script tests (`scripts/tests/*.js`) |
| Unit tests | flag semantics, SGQS/chunker shared modules, hybrid/deep search helpers | Vitest |
| Handler runtime tests | `sgqs-query`, memory-search deep-mode expansion | Vitest |
| Integration tests | graph-channel and command-flow routing | Vitest + script fixtures |
| Gate tests | type safety + full workspace test pipeline | `npm run typecheck`, `npm run test --workspace=mcp_server`, `npm test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing 136/138/139 implementation files | Internal | Green | Hardening cannot proceed without preserving behavior |
| Existing phase fixtures (`scripts/tests`) | Internal | Green | Required for non-regression and new test extension |
| MCP Vitest suite | Internal | Yellow (currently failing) | Completion gate remains blocked |
| TypeScript strict checks | Internal | Red (currently failing) | Completion gate remains blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New regressions in command routing, graph search, or phase creation flows.
- **Procedure**:
  1. Revert hardening change set for affected workstream.
  2. Re-run mandatory verification commands.
  3. Restore previous passing baseline before re-attempt.
- **Data Reversal**: N/A (no schema migrations planned in this scope).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION COMMANDS (EXACT)

```bash
node scripts/tests/test-phase-system.js
node scripts/tests/test-phase-validation.js
npm run test --workspace=mcp_server
npm run typecheck
npm test
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## 9. MILESTONES

| Milestone | Success Criteria |
|-----------|------------------|
| M1 Baseline Frozen | Failure categories + test gaps documented in `spec.md` |
| M2 Correctness Fixed | Phase map append + SGQS root fixes merged with tests |
| M3 Runtime Gaps Closed | Semantic bridge/SGQS handler/chunker contracts and tests aligned |
| M4 Type Boundaries Clean | No rootDir/module boundary errors; artifacts cleaned |
| M5 Release Gate | All five verification commands pass |
<!-- /ANCHOR:milestones -->
