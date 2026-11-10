---
title: "Tasks: Pi advisor diagnostic on stderr"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi advisor diagnostic stderr tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi advisor diagnostic on stderr

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the stderr line by calling the built hook the way Pi does (scratch repro script)
- [x] T002 Capture the bridge suite baseline: 12 of 12 (`runtime/tests/hooks/prompt-advisor.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Pass `writeDiagnostic: () => {}` to the in-process hook call (`hooks/pi/prompt-advisor.ts`)
- [x] T004 Add the stderr test and update the call-shape assertion (`runtime/tests/hooks/prompt-advisor.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the new test without the fix and see it fail
- [x] T006 Run the full bridge suite with the fix: 13 of 13
- [x] T007 Strict-validate this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



