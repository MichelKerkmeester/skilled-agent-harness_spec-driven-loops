---
title: "Implementation Plan: 118/007 — Test Migration"
description: "Level 2 plan covering test-file moves, MCP-handler test deletions, direct-invocation .cjs script tests, and a DB lifecycle test. Targets phase 007 of the 118 FULL_ISOLATE_NO_MCP arc."
trigger_phrases:
  - "phase 007 plan"
  - "test migration plan"
  - "deep-loop-runtime tests plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/007-test-migration"
    last_updated_at: "2026-05-22T20:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan for test migration"
    next_safe_action: "Wait for phase 006 completion; execute T001-T006 setup."
    blockers:
      - "phase 006 must complete first"
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180071180071180071180071180071180071180071180071180071180070001"
      session_id: "118-007-plan-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 118/007 — Test Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (test files), Node.js (.cjs scripts under test), SQLite via better-sqlite3 |
| **Framework** | Vitest |
| **Storage** | SQLite (`deep-loop-graph.sqlite`) — isolated temp DB for tests |
| **Package Manager** | pnpm (monorepo root + skill-local) |

### Overview

Phase 007 realigns the vitest test layer to the post-isolation source layout. Three operations: **move** existing unit tests from `system-spec-kit/mcp_server/tests/deep-loop/` into `deep-loop-runtime/tests/unit/` (or `integration/` for coverage-graph), **delete** MCP-handler tests that asserted on the 4 removed `deep_loop_graph_*` tools, and **create** 4 new direct-invocation integration tests plus 1 DB lifecycle test. Verification is `pnpm vitest run` exit 0 plus zero orphan imports of removed code paths.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 006 closed (collateral updates done; system stable)
- [ ] Phase 003 .cjs scripts exist + `--health-check` smoke passes for all 4
- [ ] Phase 004 MCP handlers + tool schemas already deleted
- [ ] Test inventory pass complete: known file counts for moved/deleted/created sets

### Definition of Done

- [ ] All P0 checklist items verified with evidence (see `checklist.md`)
- [ ] `pnpm vitest run` exits 0 with zero failures and zero unhandled rejections
- [ ] `grep -r "mcp_server/lib/deep-loop\|mcp_server/lib/coverage-graph" --include="*.vitest.ts"` returns 0 matches
- [ ] `grep -r "deep_loop_graph_upsert\|deep_loop_graph_query\|deep_loop_graph_status\|deep_loop_graph_convergence" --include="*.vitest.ts"` returns 0 matches under MCP-handler test folders
- [ ] `implementation-summary.md` completed with concrete moved/created/deleted file lists and final test counts

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Test-layer realignment** — strict mirror of the source layout after phases 001-004. No semantics change; the structure is the design.

### Key Components

- **`tests/unit/`**: pure-function tests for lib modules (Bayesian scorer, post-dispatch-validate, fallback router, etc.). Moved from `system-spec-kit/mcp_server/tests/deep-loop/`.
- **`tests/integration/`**: cross-module + coverage-graph + .cjs script invocation tests. Coverage-graph tests move here; new `*-script.vitest.ts` files are authored here.
- **`tests/lifecycle/`**: DB open/close + sequential-write isolation test. New folder; one file initially (`db-open-close.vitest.ts`).
- **Shared invocation helper**: small TS helper (e.g., `tests/_helpers/spawn-cjs.ts`) that wraps `child_process.spawn` and returns `{ exit, stdout, stderr, parsedJson }`. All 4 `*-script.vitest.ts` files use it.

### Data Flow

1. Vitest discovers test files via `vitest.config.*` collection globs (now including `deep-loop-runtime/tests/**/*.vitest.ts`).
2. Unit tests directly import lib modules from `deep-loop-runtime/lib/` (relative imports; path-mapping aliases optional).
3. Integration tests for .cjs scripts spawn child Node processes via the helper, point them at a fresh temp DB (`mkdtempSync`), assert exit code + parsed-JSON shape.
4. DB lifecycle test: open via script -> close -> reopen via second script -> assert no leftover write locks (`sqlite_busy` not raised, lockfile cleared).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Inventory `system-spec-kit/mcp_server/tests/deep-loop/` and `.../tests/coverage-graph/` (if present) — record exact file list + line counts
- [ ] Inventory MCP-handler tests referencing `deep_loop_graph_*` tools — record exact file list + line numbers
- [ ] Confirm phase 003 scripts exist + `--health-check` exits 0 for all 4
- [ ] Confirm phase 004 deletions landed (`grep -r 'deep_loop_graph_upsert' .opencode/skills/system-spec-kit/mcp_server/src/` returns 0 in production code)
- [ ] Create test folder structure under `deep-loop-runtime/tests/`: `unit/`, `integration/`, `lifecycle/`, `_helpers/`

### Phase 2: Implementation

#### Step 1: Move unit tests

- [ ] Move 9 deep-loop vitest files from `system-spec-kit/mcp_server/tests/deep-loop/` -> `deep-loop-runtime/tests/unit/` (`git mv` to preserve history)
- [ ] Rewrite import paths in each moved file to resolve to new `deep-loop-runtime/lib/` locations
- [ ] Move 4 `review-depth-*.vitest.ts` fixtures per T013 decision (move-whole or rewrite)

#### Step 2: Move integration / coverage-graph tests

- [ ] If `system-spec-kit/mcp_server/tests/coverage-graph/` contains vitest files, move them to `deep-loop-runtime/tests/integration/`
- [ ] Rewrite import paths

#### Step 3: Delete MCP-handler tests for removed tools

- [ ] Delete tool-list assertion tests that include `deep_loop_graph_*` tools in the expected set
- [ ] Delete tool-registration tests for the 4 removed handlers
- [ ] If a test file is partly MCP-deep-loop and partly other-MCP: keep the file, delete only the relevant test cases (not the whole file)

#### Step 4: Create new direct-invocation tests

- [ ] Author `tests/_helpers/spawn-cjs.ts` (shared invocation helper)
- [ ] Author `tests/integration/convergence-script.vitest.ts`
- [ ] Author `tests/integration/upsert-script.vitest.ts`
- [ ] Author `tests/integration/query-script.vitest.ts`
- [ ] Author `tests/integration/status-script.vitest.ts`

#### Step 5: Create DB lifecycle test

- [ ] Author `tests/lifecycle/db-open-close.vitest.ts` (open-close + sequential-write isolation)

#### Step 6: Wire vitest config

- [ ] Update `vitest.config.*` to include `deep-loop-runtime/tests/**/*.vitest.ts` in collection globs
- [ ] Update any exclude patterns that previously pointed at `system-spec-kit/mcp_server/tests/deep-loop/` (the folder may now be empty or removed)

### Phase 3: Verification

- [ ] Run `pnpm vitest run` end-to-end; confirm exit 0 + zero failures
- [ ] Run `grep` orphan-import gate (REQ-002)
- [ ] Run `grep` removed-tool reference gate (REQ-005)
- [ ] Run `pnpm vitest list` and confirm new files appear
- [ ] Run new direct-invocation tests in isolation (`pnpm vitest run tests/integration/convergence-script.vitest.ts`, etc.) to confirm no inter-test interference
- [ ] Run DB lifecycle test in isolation to confirm deterministic pass
- [ ] Populate `implementation-summary.md` with concrete numbers (moved=X, deleted=Y, created=Z, total tests run=N)
- [ ] Mark every `checklist.md` item with evidence
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` (exit 0)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (moved) | Pure-function coverage for lib modules at new home | Vitest |
| Integration (moved) | Coverage-graph cross-module tests | Vitest |
| Integration (new, .cjs scripts) | Script smoke + JSON shape via child_process.spawn | Vitest + shared `spawn-cjs.ts` helper |
| Lifecycle (new) | DB open/close + sequential-write isolation | Vitest |
| Sweep | Full repo `pnpm vitest run` | Vitest |
| Orphan-import grep | Static check that no test imports removed paths | ripgrep |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 done | Internal | Pending | Cannot start phase 007 |
| Phase 003 .cjs scripts | Internal | Pending | New `*-script.vitest.ts` tests cannot author |
| Phase 004 MCP deletions | Internal | Pending | REQ-005 grep gate unenforceable |
| Phase 002 lib moves | Internal | Pending | Import-path rewrites in moved tests cannot resolve |
| vitest (workspace dependency) | External | Green | All test execution blocked |
| better-sqlite3 (in deep-loop-runtime via phase 003) | External | Green | DB lifecycle test cannot run |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `pnpm vitest run` fails with cascading errors that cannot be resolved within reasonable effort; or move operation loses test history.
- **Procedure**:
  1. `git revert` the 007 commits in reverse order (deletions first, then creations, then moves).
  2. Confirm `pnpm vitest run` returns to the pre-007 baseline (which still includes the 4 deleted-tool tests — they pass against still-existing phase-004 handlers if 004 also reverted).
  3. If only 007 reverted (not 004): 4 deleted tool tests will fail (because the tools they assert on are gone); accept this transient state until 007 can be re-attempted or 004 also reverted.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup/Inventory) ───> Phase 2 (Implementation) ───> Phase 3 (Verification)
                                       │
                                       ├── Step 1: Move unit tests
                                       ├── Step 2: Move integration tests
                                       ├── Step 3: Delete MCP tests
                                       ├── Step 4: Create script tests
                                       ├── Step 5: Create lifecycle test
                                       └── Step 6: Wire vitest config
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 006 done; phases 002+003+004 already complete | Implementation |
| Implementation Step 1 (move unit) | Setup; phase 002 lib moves landed | Verification |
| Implementation Step 2 (move integ) | Setup | Verification |
| Implementation Step 3 (delete MCP) | Setup; phase 004 deletions landed | Verification |
| Implementation Step 4 (create script) | Setup; phase 003 .cjs scripts landed | Verification |
| Implementation Step 5 (create lifecycle) | Step 4 (uses same helper) | Verification |
| Implementation Step 6 (vitest config) | Steps 1-5 (knows which paths to include) | Verification |
| Verification | All Implementation steps | Closeout in phase 008 |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (inventory + folder creation) | Low | 30 minutes |
| Step 1: Move unit tests (9 files + import rewrites) | Low-Medium | 1.5 hours |
| Step 2: Move integration / coverage-graph tests | Low | 45 minutes |
| Step 3: Delete MCP-handler tests | Low | 30 minutes |
| Step 4: Create 4 script tests + shared helper | Medium | 2-3 hours |
| Step 5: Create DB lifecycle test | Medium | 1-1.5 hours |
| Step 6: Wire vitest config | Low | 30 minutes |
| Verification (sweep + greps + per-file isolation runs) | Medium | 1 hour |
| **Total** | | **8-10 hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup created (git commit checkpoint before phase 007 begins)
- [ ] Feature flag configured (N/A — test-only changes)
- [ ] Monitoring alerts set (CI vitest sweep is the gate)

### Rollback Procedure

1. **Immediate**: Identify failing commit(s); `git revert <sha>` for phase 007 commits.
2. **Verify**: `pnpm vitest run` returns to pre-007 baseline.
3. **Document**: Note failure mode in `decision-record.md` of any follow-on packet (or here in this packet if reattempted).
4. **Notify**: Update phase parent's `_memory.continuity.recent_action` with the revert and reason.

### Data Reversal

- **Has data migrations?** No — no DB schema or data changes in 007.
- **Reversal procedure**: N/A; pure file moves + creates + deletes under `tests/` and `vitest.config.*`.

<!-- /ANCHOR:enhanced-rollback -->
