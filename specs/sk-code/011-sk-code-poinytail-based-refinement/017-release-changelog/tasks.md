---
title: "Tasks: Phase 17: release-changelog"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "release changelog tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: release-changelog

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

- [x] T001 List the commits whose Spec trailer names either track
- [x] T002 Record the voice scan baseline (`.skilled/changelog/skilled/v4.0.0.4.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Check v4.0.0.0 to v4.0.0.4 for entries already listed
- [x] T004 Add the entries and Upgrade Notes lines (`.skilled/changelog/skilled/v4.0.0.4.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the voice scan and the document validator
- [x] T006 Validate the parent recursively and commit
- [x] T007 Fold the v4.0.0.5 note and the later surface, setup doctor, Commit-Id and Pi Fast Mode changes into v4.0.0.4, delete v4.0.0.5.md and trim the glance list to 12 bullets
- [x] T008 Rerun the voice scan, the document validator and the trigger index rebuild
- [x] T009 Order the sections, glance bullets and upgrade notes from most to least impact for outside users, split long sections and cut entries only this repository's maintainers would notice (`.skilled/changelog/skilled/v4.0.0.4.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every goal.md criterion passes on the orchestrator's rerun
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
