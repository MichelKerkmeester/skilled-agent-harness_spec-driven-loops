---
title: "Feature Specification: 118/007 — Test Migration (Split by Responsibility)"
description: "Phase 007 of 118 FULL ISOLATE + NO MCP arc. Moves vitest test files for the relocated deep-loop / coverage-graph runtime code out of system-spec-kit/mcp_server/tests/ into deep-loop-runtime/tests/, deletes MCP-handler tests for the 4 removed deep_loop_graph_* tools, creates direct-invocation tests for the 4 new .cjs scripts, and adds a DB lifecycle test. Depends on phase 006 (collateral done; system stable enough to run a full vitest sweep)."
trigger_phrases:
  - "phase 007 test migration"
  - "deep-loop runtime tests"
  - "mcp deep-loop test deletion"
  - "cjs script direct-invocation tests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/008-test-migration"
    last_updated_at: "2026-05-22T20:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 2 spec docs for phase 007 test migration"
    next_safe_action: "Execute phase 006 first then begin phase 007 vitest moves"
    blockers: []
    completion_pct: 5
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180071180071180071180071180071180071180071180071180071180070000"
      session_id: "118-007-test-migration-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 118/007 — Test Migration (Split by Responsibility)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Scaffolded; awaits phase 006 completion |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `..` (118 phase parent) |
| **Predecessor** | `006-collateral-doctor-playbook` |
| **Successor** | `008-verification-changelog-closeout` |
| **Handoff Criteria** | Full vitest sweep green; zero test files importing removed code paths; new direct-invocation tests cover all 4 .cjs scripts; DB lifecycle test passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phases 001-006 land, the test layout in `system-spec-kit/mcp_server/tests/deep-loop/` is out of sync with the runtime code's new home in `deep-loop-runtime/lib/`. Three problems result:

1. **Orphaned imports**: vitest files in the old location import relocated source modules. Even if `tsconfig` paths resolve, the test layer no longer matches the source layer it covers — operators reading `system-spec-kit/mcp_server/tests/` get a misleading mental model.
2. **Dead tests for deleted tools**: MCP-handler tests asserting `mcp tools list` includes `deep_loop_graph_*` tool IDs (and any tool-registration tests for the 4 removed handlers) now test nothing — the tools are gone. These tests must be deleted, not skipped.
3. **No coverage for the new .cjs scripts**: phases 003 added 4 direct-invocation scripts (`convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs`) and a DB ownership relocation, but no test currently exercises them at the script boundary. The lib-level tests cover the inner functions; we still need smoke + JSON-shape + DB-lifecycle tests at the script boundary.

### Purpose

Realign the test layer to the post-isolation source layer. Specifically:

1. **MOVE** vitest test files for relocated lib code from `system-spec-kit/mcp_server/tests/deep-loop/` into `deep-loop-runtime/tests/unit/` and `.../tests/integration/` (split by test type).
2. **DELETE** MCP-handler tests for the 4 removed deep_loop_graph_* tools — these tools no longer exist; the tests would fail or assert nothing useful.
3. **CREATE** 4 new direct-invocation integration tests (one per .cjs script) plus one DB lifecycle test verifying clean open/close and no overlapping writes when scripts run in sequence.

After this phase, `pnpm vitest run` covers exactly the surfaces that exist post-isolation, with no orphan imports and no dead-tool assertions.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **MOVE** the following vitest files from `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/` into `.opencode/skills/deep-loop-runtime/tests/unit/`:
  - `post-dispatch-validate.vitest.ts`
  - `bayesian-scorer.vitest.ts`
  - `cli-matrix.vitest.ts`
  - `dispatch-failure.vitest.ts`
  - `executor-audit.vitest.ts`
  - `executor-config.vitest.ts`
  - `fallback-router.vitest.ts`
  - `permissions-gate.vitest.ts`
  - `prompt-pack.vitest.ts`
- **MOVE OR REWRITE** 4 Phase B `review-depth-*.vitest.ts` fixtures alongside the post-dispatch-validate code they cover (move if they test moved code only; rewrite import paths if they straddle moved + retained code — decision documented in tasks.md T013).
- **MOVE** any 9 coverage-graph test files (if they exist at phase entry) into `.opencode/skills/deep-loop-runtime/tests/integration/`.
- **DELETE** MCP-handler tests that specifically assert `mcp tools list` contains `deep_loop_graph_*` tool IDs.
- **DELETE** tool-registration tests for the 4 removed handlers (`deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status`, `deep_loop_graph_convergence`).
- **CREATE** 4 direct-invocation integration tests under `.opencode/skills/deep-loop-runtime/tests/integration/`:
  - `convergence-script.vitest.ts` (smoke + JSON-output shape)
  - `upsert-script.vitest.ts`
  - `query-script.vitest.ts`
  - `status-script.vitest.ts`
- **CREATE** lifecycle test `.opencode/skills/deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts` verifying each script opens + closes DB cleanly with no overlapping write locks when invoked sequentially.
- Update import paths in moved tests so they resolve from the new location to the runtime skill's lib modules.
- Wire the new test folders into the relevant `vitest.config.*` so `pnpm vitest run` picks them up.

### Out of Scope

- Migrating the actual `lib/` code (that is phase 002).
- Creating the .cjs scripts themselves (phase 003).
- Removing the MCP handler source files (phase 004; we only delete the **tests** here).
- Changing test semantics for moved tests — moves preserve behavior; only paths/imports change.
- Adding new coverage for code paths that already had unit tests; this phase is structural realignment plus the four script smoke tests plus one lifecycle test, not a coverage push.
- Test framework migration (vitest stays).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/bayesian-scorer.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/bayesian-scorer.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/cli-matrix.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/dispatch-failure.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/executor-audit.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/executor-config.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/fallback-router.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/fallback-router.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/permissions-gate.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/permissions-gate.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/prompt-pack.vitest.ts` | Move | -> `deep-loop-runtime/tests/unit/prompt-pack.vitest.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-*.vitest.ts` (4 files) | Move-or-rewrite | T013 decides per-file; same destination folder |
| `.opencode/skills/system-spec-kit/mcp_server/tests/coverage-graph/*.vitest.ts` (~9 files if present) | Move | -> `deep-loop-runtime/tests/integration/` |
| MCP-handler tool-list tests asserting `deep_loop_graph_*` presence | Delete | Tools no longer exist after phase 004 |
| MCP-handler tool-registration tests for the 4 removed handlers | Delete | Handlers no longer exist after phase 004 |
| `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` | Create | Smoke + JSON-shape test for `convergence.cjs` |
| `.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts` | Create | Smoke + JSON-shape test for `upsert.cjs` |
| `.opencode/skills/deep-loop-runtime/tests/integration/query-script.vitest.ts` | Create | Smoke + JSON-shape test for `query.cjs` |
| `.opencode/skills/deep-loop-runtime/tests/integration/status-script.vitest.ts` | Create | Smoke + JSON-shape test for `status.cjs` |
| `.opencode/skills/deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts` | Create | DB open/close lifecycle + sequential-write isolation test |
| `vitest.config.*` (root or skill-local; phase resolves which) | Modify | Include `deep-loop-runtime/tests/**/*.vitest.ts` in collection globs |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full `pnpm vitest run` exits 0 with zero failures and zero unhandled errors | Exit code 0; summary shows N tests run, 0 failed, 0 skipped-for-failure |
| REQ-002 | No test file imports a removed code path | `grep -r "mcp_server/lib/deep-loop\|mcp_server/lib/coverage-graph" --include="*.vitest.ts"` returns 0 results |
| REQ-003 | All 4 .cjs scripts have at least one direct-invocation test asserting non-zero exit code semantics + JSON output shape | 4 `*-script.vitest.ts` files exist under `deep-loop-runtime/tests/integration/` and each pass `pnpm vitest run` |
| REQ-004 | DB lifecycle test verifies clean open/close + sequential-write isolation | `db-open-close.vitest.ts` exists and passes; no overlapping write locks asserted via file-handle inspection or sqlite_busy detection |
| REQ-005 | No MCP-handler tests reference the 4 deleted deep_loop_graph_* tools | `grep -r "deep_loop_graph_upsert\|deep_loop_graph_query\|deep_loop_graph_status\|deep_loop_graph_convergence" --include="*.vitest.ts"` returns 0 results in MCP-handler test folders |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Moved tests preserve original test names + assertions | git history of each moved file shows rename, not delete-create; or, if rename detection fails, line-by-line diff shows only import-path changes |
| REQ-007 | `vitest.config.*` collects new `deep-loop-runtime/tests/` paths | `pnpm vitest list` shows the new files in the collection summary |
| REQ-008 | Phase B `review-depth-*.vitest.ts` files migrated in alignment with the post-dispatch-validate code they cover | T013 decision recorded in tasks.md with per-file rationale; no orphan imports |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `pnpm vitest run` exits 0 with zero failures after the migration.
- **SC-002**: Zero orphan imports — every test file imports from a code path that still exists.
- **SC-003**: All 4 .cjs scripts and the DB lifecycle have direct test coverage at the script boundary, independent of the lib-level unit tests.
- **SC-004**: MCP-handler test surface contains zero references to the 4 removed deep_loop_graph_* tools.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 collateral complete | Phase 007 cannot start until /doctor + playbook reference the new script paths (the integration tests assert against the same paths) | Hard gate: 007 starts only after 006 PASSes its checklist |
| Dependency | Phase 003 .cjs scripts exist + are smoke-testable | New `*-script.vitest.ts` tests need real scripts to invoke | Verify `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs --health-check` exits 0 before authoring each test |
| Dependency | Phase 004 MCP handlers deleted | Without phase 004, `mcp tools list` still shows the 4 tools and the "no references to deleted tools" gate is unenforceable | 007 explicitly inherits 004's deletion status; gate REQ-005 only meaningful post-004 |
| Risk | Import-path rewrite breaks moved tests | Tests pass locally but fail in CI due to relative-path vs alias mismatch | Run `pnpm vitest run <moved-file>` individually before claiming move complete; CI gate is the final sweep in REQ-001 |
| Risk | review-depth-*.vitest.ts straddle moved + retained code | Move loses coverage of retained code; rewrite is more invasive than a move | T013 inspects each file's imports before deciding move vs rewrite; documents decision per file |
| Risk | DB lifecycle test flaky (timing-dependent locks) | Test passes locally, fails in CI | Sequential invocation (not parallel) per test plus explicit `await closeDb()` before next open; no race conditions to detect |
| Risk | `vitest.config.*` configuration error excludes new paths silently | Tests exist but never run; sweep passes deceptively | After phase 007, run `pnpm vitest list` and assert expected file count matches expected (encoded in T021) |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Full `pnpm vitest run` completes within 1.5x the pre-migration baseline runtime (moves shouldn't add cost; new tests add 5 tests).
- **NFR-P02**: DB lifecycle test completes in < 5 seconds (sequential, deterministic).

### Reliability

- **NFR-R01**: Moved tests must pass on first run after move (no flakiness introduced by path changes).
- **NFR-R02**: Direct-invocation script tests must work under both `node` and `pnpm vitest` (script invocation is shell-out; vitest spawns child processes).

### Maintainability

- **NFR-M01**: Each new test file < 200 lines and follows existing vitest patterns in the runtime skill.
- **NFR-M02**: Direct-invocation tests use a shared helper (one place to update if .cjs script CLI shape changes).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **Empty DB at script invocation**: `query.cjs` / `status.cjs` against empty DB — test asserts well-formed JSON with empty data, not error exit.
- **DB file missing**: scripts should create-if-missing or error cleanly with non-zero exit + structured JSON error; test covers both.
- **Concurrent sequential calls**: lifecycle test calls `upsert.cjs` then `query.cjs` back-to-back; asserts no lingering write lock.

### Error Scenarios

- **Script not executable**: chmod failure or missing shebang — test asserts spawn fails with diagnostic, not silently.
- **Invalid CLI args**: script invoked with bad flags — test asserts non-zero exit + JSON error on stdout (or stderr — phase 003 contract decides; phase 007 inherits and tests).
- **DB schema mismatch**: scripts running against an older DB — out of scope here; phase 003 owns the schema check, and any related tests live with it.

### Concurrent Operations

- **Parallel test runs**: vitest may run multiple test files in parallel — DB lifecycle test must use an isolated temp DB path (not the production `deep-loop-runtime/storage/deep-loop-graph.sqlite`) to avoid corrupting other tests.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~9 unit-test moves + up-to-9 integration moves + 4 review-depth fixtures + targeted MCP-handler test deletions + 5 new test files + 1 shared helper + vitest config edit |
| Risk | 8/25 | Test-only changes; primary risk is silent loss-of-coverage (vitest config exclude pattern) and import-path drift; lifecycle test flakiness controlled by sequential design |
| Research | 5/20 | Phase entry inventory (T001-T003) + JSON shape verification for script tests; no novel design |
| **Total** | **25/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Do any 9 coverage-graph tests exist at phase entry, or only the 9 deep-loop unit tests listed? **PENDING: Confirmed in T001 inventory pass at implementation start; spec scope assumes "up to 9" until inventoried.**
- Should the 4 `review-depth-*.vitest.ts` fixtures move whole, or split (each may cover both moved + retained code paths)? **PENDING: T013 inspects imports and decides per-file; default is move-whole unless an import straddles.**
- Does the test runner config live at repo root (`vitest.config.ts`), skill root, or both? **PENDING: T020 inspection at phase entry; current pattern across the repo varies.**
- Should we add a separate `tests/contract/` folder for the .cjs script contract tests, or fold them under `integration/`? **DECISION: `integration/` per current scope; revisit if more contract layers emerge.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Predecessor phase**: `../006-collateral-doctor-playbook/`
- **Successor phase**: `../008-verification-changelog-closeout/`
- **Sibling (script source)**: `../003-script-shim-and-db-relocation/`
- **Sibling (MCP deletion)**: `../004-mcp-tool-surface-removal/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Graph Metadata**: `graph-metadata.json`
