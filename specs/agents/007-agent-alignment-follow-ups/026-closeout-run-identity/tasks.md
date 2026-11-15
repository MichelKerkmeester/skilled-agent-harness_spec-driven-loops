---
title: "Tasks: Phase 26: closeout-run-identity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "closeout run identity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 26: closeout-run-identity

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

- [x] T001 Record the runtime suite baseline (`$RT`). Verify: the pass count is written down.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Scope closeout rows by the config's session id (`$RT/scripts/synthesis-closeout.cjs`). Verify: review and research tests read the config's ids.
- [x] T003 Append a staged closeout row through the gateway (`$RT/tests/unit/synthesis-closeout-run-identity.vitest.ts`). Verify: exit 0 and the projected row carries the config's session id.
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
- [x] Every closeout row names its run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: phase 25's known limitation 3
<!-- /ANCHOR:cross-refs -->
