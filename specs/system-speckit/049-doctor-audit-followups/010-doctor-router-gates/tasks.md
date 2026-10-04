---
title: "Tasks: Phase 10: doctor-router-gates"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: doctor-router-gates

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

- [x] T001 List each doctor router's argument hint and find the ones with a required `<argument>` outside optional brackets (`.skilled/commands/doctor/*.md`)
- [x] T002 Count the `allowed-tools` style across commands and skills (38 commands comma-separated, 58 skills array)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the input gate and point the target-binding step at it (`skill-advisor.md`)
- [x] T004 Add the input gate and point the sub-action step at it (`mcp.md`)
- [x] T005 Pass the document type into the frontmatter parser and exempt commands (`extract_structure.py`)
- [x] T006 Add the skill and command regression case (`test_extract_structure_regressions.py`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the regression suite, and the new case against a copy without the exemption
- [x] T008 Validate both routers, then run the route validator, the router generator, the mirror checks, the route guard and the doctor suite
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
