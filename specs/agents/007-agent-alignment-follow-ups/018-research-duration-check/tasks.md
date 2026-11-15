---
title: "Tasks: Phase 18: research-duration-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "research duration check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: research-duration-check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `R` is `.skilled/skills/system-deep-loop/runtime`. `Y` is `.skilled/commands/deep/assets`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the runtime suite, the drift check and the loop step order (`scratch/baseline.txt`). Verify: the file holds the `Tests` line and the step order.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Move `step_check_max_duration` unchanged to just after `step_read_state` (`Y/deep-research.yaml`). Verify: the step order lists `step_read_state` before `step_check_max_duration`, and every changed line appears once removed and once added.
- [x] T003 Recompile the deep-research contract (`Y/compiled/deep-research.contract.markdown`). Verify: `node R/scripts/check-contract-drift.cjs` prints `OK`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Rerun the suite, the duration test and the drift check (`scratch/after.txt`). Verify: no failure `scratch/baseline.txt` lacks.
- [x] T006 Apply the @review P2s: `workflow-max-duration.vitest.ts` asserts `step_read_state` comes before `step_check_max_duration` in both workflows, and the research pre-synthesis `on_B` says to raise `maxDurationMinutes` after a duration stop (`R/tests/unit/workflow-max-duration.vitest.ts`, `Y/deep-research.yaml`). Verify: the test fails on the old research order and passes on the new one (`scratch/after.txt`).
- [x] T005 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `scratch/after.txt` shows the suite and drift check with no new failure
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: 017's known limitation on deep research, and the operator's "Fix follow" of 2026-11-15
<!-- /ANCHOR:cross-refs -->
