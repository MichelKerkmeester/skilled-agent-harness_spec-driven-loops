---
title: "Tasks: Phase 25: stop-path-live-proof"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "stop path live proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 25: stop-path-live-proof

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
`RT` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 24 is on origin/main and the suite baseline holds (`$RT`). Verify: 3,035 passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the stop-path replay test (`$RT/tests/integration/review-stop-path-replay.vitest.ts`). Verify: it passes, and fails with one assertion broken.
- [x] T003 Run one live review with a one-minute time limit (`review/`). Verify: the state log holds `maxDurationReached` and a `terminal_gates` row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Rerun the full suite and typecheck (`$RT`). Verify: no test that passed at baseline fails.
- [x] T005 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each stop reason is shown to reach the verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: gap 2 of the earlier analysis, recorded as a known limitation of this packet
<!-- /ANCHOR:cross-refs -->
