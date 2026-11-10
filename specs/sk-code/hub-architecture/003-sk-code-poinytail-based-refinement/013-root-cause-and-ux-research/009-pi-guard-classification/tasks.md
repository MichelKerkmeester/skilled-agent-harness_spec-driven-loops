---
title: "Tasks: Phase 9: pi-guard-classification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi guard classification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: pi-guard-classification

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

- [x] T000 Capture the before numbers the goal criteria compare against (`goal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Add the mkdir and node negative rows (`dispatch-audit.test.mjs`)
- [x] T002 Count an expanded token only in command position (`dispatch-audit.mjs`)
- [x] T003 Add the three wrapper rows and the Pi boundary row (`dispatch-audit.test.mjs`)
- [x] T004 Unwrap the shell wrapper in inspectDispatch (`dispatch-audit.mjs`)
- [x] T005 Unwrap before shape matching in resolveSegment (`dispatch-audit.mjs`)
- [x] T006 Assert and drop the word path in the deny text (`dispatch-preflight-lint.ts`)
- [x] T007 Update the catalog and playbook wording (`cli-dispatch-authorization.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the inspector, Pi and rule-checks suites (`dispatch-audit.test.mjs`)
- [x] T009 Strict-validate this phase (`spec.md`)
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
