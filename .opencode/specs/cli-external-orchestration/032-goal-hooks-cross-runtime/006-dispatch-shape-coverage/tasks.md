---
title: "Tasks: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "dispatch shape coverage tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 2 tasks for dispatch-shape coverage phase"
    next_safe_action: "Start T001 groundtruth trace of evaluate() severity branch"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `evaluate()`'s current severity-mapping line verbatim and quote it in `plan.md` before any edit (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`).
- [ ] T002 [P] `rg` confirm the `CHECKS` registry lacks `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` entries (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`).
- [ ] T003 [P] Confirm real dispatch command examples for `devin -p`, `cursor-agent … -p`, `pi -p` from each skill's own SKILL.md/references (`.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`, `cli-cursor/SKILL.md`, `cli-pi/SKILL.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print` entries to `DISPATCH_SHAPES` (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`).
- [ ] T005 Fold `CODEX_EXEC_SHAPE` into `DISPATCH_SHAPES`; remove the local constant and `DISPATCH_SKILLS` composition from the Codex adapter, repointing it to read `DISPATCH_SHAPES` directly (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`).
- [ ] T006 Implement the resolved `severity: error` -> `block`/`warn` mapping as an explicit branch in `evaluate()` (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 [P] Add a matching/non-matching regression test pair for the devin shape (`dispatch-audit.test.mjs` and/or `dispatch-rule-checks.test.mjs`).
- [ ] T008 [P] Add a matching/non-matching regression test pair for the cursor shape.
- [ ] T009 [P] Add a matching/non-matching regression test pair for the pi shape.
- [ ] T010 [P] Add a matching/non-matching regression test pair confirming the codex shape now resolves from the shared registry alone.
- [ ] T011 Add a test asserting the exact resulting `severity` field for an `error`-severity rule (`dispatch-rule-checks.test.mjs`).
- [ ] T012 Re-run every dispatch-family suite (not only the new tests) via each file's own documented runner; confirm `opencode run`/`claude -p` coverage unregressed.
- [ ] T013 `rg -n "CODEX_EXEC_SHAPE"` repo-wide to confirm zero remaining duplicate.
- [ ] T014 Update `implementation-summary.md` with the honest CHECKS-function gap disclosure (REQ-006).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (full dispatch-family suite green, `rg` sweeps clean, severity-mapping test passing)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: `.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md`
<!-- /ANCHOR:cross-refs -->
