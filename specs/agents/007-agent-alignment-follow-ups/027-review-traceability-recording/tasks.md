---
title: "Tasks: Phase 27: review-traceability-recording"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review traceability recording tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 27: review-traceability-recording

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

- [x] T001 Record the runtime suite baseline and the coverage count over about ten recorded packets (`$RT`). Verify: both numbers are written down.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Show the result shape and the core-protocol instruction in the prompt pack (`prompt-pack-iteration.md.tmpl`). Verify: no empty `traceabilityChecks` example remains.
- [x] T003 Normalize `protocol` and the status spellings in the rollup (`$RT/scripts/reduce-state.cjs`). Verify: a test through `terminal-gates.cjs` passes and fails on the old rollup.
- [x] T004 Check the status list in the state schema doc (`state-jsonl.md`). Verify: it names `notApplicable`, the reducer's form.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the suite, typecheck, contract drift and the coverage count (`$RT`). Verify: no baseline test fails and the count is reported.
- [x] T006 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Core protocol results reach the coverage gate
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: phase 24's known limitation 1
<!-- /ANCHOR:cross-refs -->
