---
title: "Tasks: 118/007 — Test Migration"
description: "Level 2 task breakdown for phase 007 test migration in the 118 FULL_ISOLATE_NO_MCP arc. Phase-1/2/3 anchored, with effort estimates and verification tasks."
trigger_phrases:
  - "phase 007 tasks"
  - "test migration tasks"
  - "deep-loop-runtime tests tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/008-test-migration"
    last_updated_at: "2026-05-22T20:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 tasks T001-T100 for test migration"
    next_safe_action: "Execute T001-T006 setup once phase 006 is merged."
    blockers:
      - "phase 006 must complete first"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180071180071180071180071180071180071180071180071180071180070002"
      session_id: "118-007-tasks-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 118/007 — Test Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [30 minutes]

- [ ] T001 Inventory `system-spec-kit/mcp_server/tests/deep-loop/` — record file list + line counts to `implementation-summary.md` Notes [10m]
- [ ] T002 [P] Inventory `system-spec-kit/mcp_server/tests/coverage-graph/` if present — record file list [5m]
- [ ] T003 [P] Inventory MCP-handler tests referencing `deep_loop_graph_*` tools — record file paths + line numbers [10m]
- [ ] T004 Confirm phase 003 .cjs scripts exist and `--health-check` exits 0 for all 4 (`node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs --health-check`) [5m]
- [ ] T005 Confirm phase 004 deletions landed (`grep -r 'deep_loop_graph_upsert' .opencode/skills/system-spec-kit/mcp_server/src/` returns 0 in production code) [5m]
- [ ] T006 [P] Create test folder skeleton under `.opencode/skills/deep-loop-runtime/tests/`: `unit/`, `integration/`, `lifecycle/`, `_helpers/` [5m]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [5.5-7.5 hours]

### Step 1: Move Unit Tests [1.5 hours]

- [ ] T010 [P] `git mv` `post-dispatch-validate.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T011 [P] `git mv` `bayesian-scorer.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T012 [P] `git mv` `cli-matrix.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T013 Inspect 4 `review-depth-*.vitest.ts` fixtures — decide per-file move-whole vs rewrite; document in this task's evidence row [30m]
- [ ] T014 [P] Apply T013 decisions for `review-depth-*` files (move + import rewrites) [20m]
- [ ] T015 [P] `git mv` `dispatch-failure.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T016 [P] `git mv` `executor-audit.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T017 [P] `git mv` `executor-config.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T018 [P] `git mv` `fallback-router.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T019 [P] `git mv` `permissions-gate.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T020 [P] `git mv` `prompt-pack.vitest.ts` -> `deep-loop-runtime/tests/unit/` + rewrite imports [10m]
- [ ] T021 Run each moved file individually (`pnpm vitest run <path>`) to confirm pass [15m]

### Step 2: Move Integration / Coverage-Graph Tests [45 minutes]

- [ ] T030 [P] Move all coverage-graph vitest files identified in T002 to `deep-loop-runtime/tests/integration/` via `git mv` [20m]
- [ ] T031 Rewrite import paths in each moved coverage-graph file [15m]
- [ ] T032 Run moved coverage-graph files individually to confirm pass [10m]

### Step 3: Delete MCP-Handler Tests for Removed Tools [30 minutes]

- [ ] T040 Delete tool-list assertion test cases / files referencing `deep_loop_graph_*` (use T003 inventory; surgical deletion if file mixes tests) [15m]
- [ ] T041 Delete tool-registration tests for the 4 removed handlers [10m]
- [ ] T042 Verify deletions via grep: `grep -r 'deep_loop_graph_upsert\|deep_loop_graph_query\|deep_loop_graph_status\|deep_loop_graph_convergence' --include='*.vitest.ts' .opencode/skills/system-spec-kit/mcp_server/tests/` returns 0 [5m]

### Step 4: Create Direct-Invocation Tests [2-3 hours]

- [ ] T050 Author `tests/helpers/spawn-cjs.ts` shared helper (`spawn` wrapper returning `{ exit, stdout, stderr, parsedJson }`) [30m]
- [ ] T051 [P] Author `tests/integration/convergence-script.vitest.ts` (smoke + JSON shape; empty-DB + populated-DB cases) [30m]
- [ ] T052 [P] Author `tests/integration/upsert-script.vitest.ts` (smoke + JSON shape; success + invalid-args cases) [30m]
- [ ] T053 [P] Author `tests/integration/query-script.vitest.ts` (smoke + JSON shape; empty-DB + populated-DB cases) [30m]
- [ ] T054 [P] Author `tests/integration/status-script.vitest.ts` (smoke + JSON shape) [30m]
- [ ] T055 Run all 4 new `*-script.vitest.ts` files individually to confirm pass [15m]

### Step 5: Create DB Lifecycle Test [1-1.5 hours]

- [ ] T060 Author `tests/lifecycle/db-open-close.vitest.ts` — uses temp DB path via `mkdtempSync`; calls `upsert.cjs` then `query.cjs` sequentially; asserts no overlapping write lock + clean close [1h]
- [ ] T061 Run lifecycle test in isolation; confirm deterministic pass on 5 consecutive runs (no flake) [15m]

### Step 6: Wire Vitest Config [30 minutes]

- [ ] T070 Identify which `vitest.config.*` file(s) collect test paths (root, skill-local, or both) [10m]
- [ ] T071 Add `deep-loop-runtime/tests/**/*.vitest.ts` to collection globs [10m]
- [ ] T072 Remove or update any exclude pattern referencing `system-spec-kit/mcp_server/tests/deep-loop/` or `system-spec-kit/mcp_server/tests/coverage-graph/` (folders may be empty) [10m]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [1 hour]

### Sweep + Static Gates

- [ ] T080 Run `pnpm vitest run` — assert exit 0, zero failures, zero unhandled rejections (REQ-001) [15m]
- [ ] T081 Run orphan-import grep gate: `grep -r 'mcp_server/lib/deep-loop\|mcp_server/lib/coverage-graph' --include='*.vitest.ts'` returns 0 (REQ-002) [5m]
- [ ] T082 Run removed-tool reference grep gate against MCP-handler test folders (REQ-005) [5m]
- [ ] T083 Run `pnpm vitest list` and confirm new `deep-loop-runtime/tests/**` files are in the collection summary (REQ-007) [5m]

### Per-File Isolation Confirmation

- [ ] T084 Run each of 4 `*-script.vitest.ts` individually to confirm no inter-test interference [10m]
- [ ] T085 Run `db-open-close.vitest.ts` 5x in isolation to confirm deterministic pass [10m]

### Documentation

- [ ] T090 Populate `implementation-summary.md` Files Changed table with concrete moved/created/deleted file lists [10m]
- [ ] T091 Update `implementation-summary.md` Verification table with concrete pre/post test counts (e.g., before: 47 tests pass; after: 52 tests pass — 9 moved, 5 created, X deleted) [10m]
- [ ] T092 Mark every `checklist.md` item with evidence (or note as N/A with reason) [10m]

### Strict Validate

- [ ] T100 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/008-test-migration --strict` and confirm exit 0 [5m]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 tasks `[x]`
- [ ] All Phase 2 tasks `[x]`
- [ ] All Phase 3 tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `pnpm vitest run` exits 0
- [ ] Both grep gates return 0 matches
- [ ] Strict validate passes (exit 0)
- [ ] `implementation-summary.md` fully populated (no placeholder text)
- [ ] `checklist.md` 100% verified

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md` (template at scaffold time; populated during Phase 3)
- **Phase Parent**: `../spec.md`
- **Predecessor**: `../006-collateral-doctor-playbook/`
- **Successor**: `../008-verification-changelog-closeout/`

<!-- /ANCHOR:cross-refs -->
