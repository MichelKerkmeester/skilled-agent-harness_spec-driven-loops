---
title: "Tasks: Phase 28: review-scope-recording"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review scope recording tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 28: review-scope-recording

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

- [x] T001 Record the runtime suite baseline and the scope failures over recorded reviews since October (`$RT`). Verify: both numbers are written down.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Strip line suffixes and add the spec-folder target in the scope gate (`$RT/scripts/terminal-gates.cjs`). Verify: new tests pass and fail on the old rule.
- [x] T003 Name the packet docs in the spec-folder scope step (`deep-review.yaml`). Verify: contract recompiled, drift check OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Rerun the suite, typecheck and the recorded-review count (`$RT`). Verify: no baseline test fails and the count is reported.
- [x] T005 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] In-target findings pass the scope gate
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: phase 24's known limitation 2
<!-- /ANCHOR:cross-refs -->
