---
title: "Verification Checklist: 118/007 — Test Migration"
description: "Level 2 verification checklist for phase 007. P0 gates: full vitest sweep green and zero orphan imports / removed-tool references in test files."
trigger_phrases:
  - "phase 007 checklist"
  - "test migration verification"
  - "deep-loop-runtime tests verify"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/008-test-migration"
    last_updated_at: "2026-05-22T20:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 checklist with P0 P1 P2 and fix-completeness"
    next_safe_action: "Mark items [x] with evidence after implementation lands."
    blockers:
      - "phase 006 must complete first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180071180071180071180071180071180071180071180071180071180070003"
      session_id: "118-007-checklist-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 118/007 — Test Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 006 complete (collateral updates landed; `_memory.continuity.completion_pct` for 006 = 100)
  - **Evidence**: _to be filled at phase entry_
- [ ] CHK-002 [P0] Phase 003 .cjs scripts exist and `--health-check` exits 0 for all 4
  - **Evidence**: _to be filled at phase entry_
- [ ] CHK-003 [P0] Phase 004 MCP handler deletions landed (grep returns 0 in production code)
  - **Evidence**: _to be filled at phase entry_
- [ ] CHK-004 [P1] Test inventory recorded for moved/deleted/created sets
  - **Evidence**: _T001-T003 outputs in implementation-summary.md Notes_

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Full `pnpm vitest run` exits 0 with zero failures
  - **Evidence**: _exit code + summary line copied here_
- [ ] CHK-011 [P0] No test file imports a removed code path (REQ-002 grep gate)
  - **Evidence**: _`grep -r 'mcp_server/lib/deep-loop\|mcp_server/lib/coverage-graph' --include='*.vitest.ts' .` returns 0 matches_
- [ ] CHK-012 [P0] No test file references the 4 removed `deep_loop_graph_*` tool IDs in MCP-handler test folders (REQ-005)
  - **Evidence**: _grep result pasted here_
- [ ] CHK-013 [P1] Moved tests preserve original assertions (only import paths changed)
  - **Evidence**: _spot-check 2-3 moved files; confirm diff = imports only_
- [ ] CHK-014 [P1] Each moved test passes when run in isolation
  - **Evidence**: _T021 + T032 outputs_
- [ ] CHK-015 [P1] New direct-invocation tests use shared `spawn-cjs.ts` helper (single point of change for script CLI shape)
  - **Evidence**: _grep shows 4 imports of `_helpers/spawn-cjs.ts`_

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 4 .cjs scripts have at least one direct-invocation test exercising script boundary (REQ-003)
  - **Evidence**: _4 `*-script.vitest.ts` files exist + pass under `pnpm vitest run`_
- [ ] CHK-021 [P0] DB lifecycle test verifies clean open/close + sequential-write isolation (REQ-004)
  - **Evidence**: _`db-open-close.vitest.ts` passes 5x in isolation (T085)_
- [ ] CHK-022 [P1] Direct-invocation tests cover both empty-DB and populated-DB cases (where applicable)
  - **Evidence**: _per-test assertion list_
- [ ] CHK-023 [P1] vitest config (`vitest.config.*`) collects new paths
  - **Evidence**: _T083 `pnpm vitest list` confirms `deep-loop-runtime/tests/**/*.vitest.ts` in collection summary_
- [ ] CHK-024 [P1] Test runtime within 1.5x of pre-migration baseline (NFR-P01)
  - **Evidence**: _pre vs post wall-clock times from vitest summary line_

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] Every relocated test file in the inventory (T001-T003) is accounted for: moved, deleted, or explicitly skipped with reason
  - **Evidence**: _T001-T003 inventory list mapped 1:1 to the post-migration action; no row left without a status_
- [ ] CHK-026 [P0] All 4 .cjs scripts from phase 003 have at least one direct-invocation test in `tests/integration/`
  - **Evidence**: _`ls .opencode/skills/deep-loop-runtime/tests/integration/*-script.vitest.ts` returns 4 files_
- [ ] CHK-027 [P1] No `[B]` blocked tasks remain in `tasks.md`
  - **Evidence**: _`grep -c '\[B\]' tasks.md` returns 0_
- [ ] CHK-028 [P1] Open questions in `spec.md` (Section 10) marked RESOLVED or DEFERRED with explicit decision text
  - **Evidence**: _no `PENDING:` markers remain in spec.md Section 10_

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] DB lifecycle test uses temp DB path (not production `deep-loop-runtime/storage/deep-loop-graph.sqlite`)
  - **Evidence**: _grep of `db-open-close.vitest.ts` shows `mkdtempSync` usage; no hardcoded production paths_
- [ ] CHK-031 [P2] No hardcoded credentials, tokens, or sensitive paths in new test files
  - **Evidence**: _spot check_

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `implementation-summary.md` fully populated with concrete moved/created/deleted counts
  - **Evidence**: _Files Changed table no longer contains placeholder text_
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md` reflect final implementation (status updated; deferrals documented)
  - **Evidence**: _diff between scaffold and final reviewed_
- [ ] CHK-042 [P2] `_memory.continuity.completion_pct` updated to 100 + `recent_action` + `next_safe_action` set for downstream phase 008
  - **Evidence**: _continuity block in spec.md updated_

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files in spec folder (all artifacts under `tests/` and `vitest.config.*` only)
  - **Evidence**: _git status clean for non-test paths_
- [ ] CHK-051 [P1] Strict validator passes
  - **Evidence**: _`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/008-test-migration --strict` exit 0_

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: _pending_
**Verified By**: _pending_

<!-- /ANCHOR:summary -->
