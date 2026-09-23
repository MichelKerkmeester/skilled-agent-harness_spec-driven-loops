---
title: "Tasks: Warn when a playbook scenario's prompt fields disagree"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook prompt sync warning"
  - "PROMPT_UNSYNCED"
  - "playbook prompt fields disagree"
  - "turn 1 prompt out of sync"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Warn when a playbook scenario's prompt fields disagree

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

- [x] T001 Measure the corpus for disagreeing prompt copies before choosing warning over violation
- [x] T002 Confirm the gate's field list in `SKILL.md` and how a scenario runner picks Turn 1
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the prompt readers, the root summary index and the comparison (`scripts/validate-playbook-package.cjs`)
- [x] T004 Normalize quotes and backticks after the corpus showed them as the only false positives (`scripts/validate-playbook-package.cjs`)
- [x] T005 Add eight assertions covering both directions (`scripts/tests/validate-playbook-package.test.cjs`)
- [x] T006 Update the gate text, the README and the v1.0.2.0 changelog (`SKILL.md`, `README.md`, `changelog/v1.0.2.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Suite passes, and three broken builds of the check each fail it
- [x] T008 Planted table, Turn 1 and root differences on a 42-scenario copy each raise exactly one warning, and all 42 root summaries map
- [x] T009 Fleet run before and after: same statuses, violation counts and exit code
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



