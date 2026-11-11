---
title: "Tasks: Phase 4: split-fanout-run"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "split fanout run tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: split-fanout-run

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

`S` is `.skilled/skills/system-spec-kit/runtime`. `D` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the deep-loop test count (`D`). Verify: `npx vitest list` prints 2881 tests.
- [x] T002 Read fanout-run's per-block seconds from phase 2. Verify: the phase 2 summary names them.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Split the file along its describe blocks (`D/tests/unit/`). Verify: the pieces hold every test, and all stay on the serial list.
- [x] T004 Promote one piece (`D/vitest.config.ts`). Verify: three full-suite runs pass.
- [x] T005 Repeat T004 for each remaining piece. Verify: each promoted piece passes three runs, or returns to the serial list.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Compare the counts. Verify: the count equals T001's.
- [x] T007 Compare the time. Verify: the median is at least 10% under 504 to 511 s, or the change is reverted. Result: about 5 percent, so the change was reverted.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-five-cuts/research/research.md`
<!-- /ANCHOR:cross-refs -->

---



