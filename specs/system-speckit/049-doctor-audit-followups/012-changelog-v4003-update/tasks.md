---
title: "Tasks: Phase 12: changelog-v4003-update"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "changelog v4003 update tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: changelog-v4003-update

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

- [x] T001 Load the sk-create-changelog template and checklist (`.skilled/skills/sk-doc/sk-create-changelog/`)
- [x] T002 Confirm only the entry quotes its own title, so a retitle touches nothing else
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the Doctor Commands section and the doctor upgrade lines (`.skilled/changelog/skilled/v4.0.0.3.md`)
- [x] T004 Add the missing hook items, correct the trust sentence and extend the push and review paragraphs (same file)
- [x] T005 Merge the glance list to 12 bullets and update the title, description, opening, Why This Release and spec line (same file)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Check each new sentence against its commit or file, and narrow the three that overreached
- [x] T007 Run `validate_document.py`, `extract_structure.py` and `hvr_scan.py`, then the recursive strict validation of the parent packet
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
