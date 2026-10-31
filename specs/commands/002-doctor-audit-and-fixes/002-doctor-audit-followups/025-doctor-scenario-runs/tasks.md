---
title: "Tasks: Phase 25: doctor-scenario-runs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor scenario runs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 25: doctor-scenario-runs

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

- [x] T001 Write the brief template and the sequential runner
- [x] T002 Pilot DOC-379 on the update fixture
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the five update scenarios on the fixture
- [x] T004 Run the 26 current-code scenarios in two batches
- [x] T005 Trace each non-pass to its cause and fix what was in reach
- [x] T006 Regenerate the sk-doc leaf manifest on main
- [x] T007 Run the four copy-or-clone scenarios
- [x] T008 Add the advisor-state note to the environment guide
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm a clean environment after every run
- [x] T010 Rerun each scenario whose cause was fixed
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



