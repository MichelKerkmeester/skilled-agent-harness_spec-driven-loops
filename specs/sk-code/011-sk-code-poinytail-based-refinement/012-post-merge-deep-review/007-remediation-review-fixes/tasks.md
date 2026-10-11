---
title: "Tasks: Phase 7: remediation-review-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remediation review fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: remediation-review-fixes

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

- [x] T001 Read the review report and the shared suite
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Build the three suite rows through DeepSeek V4.1 Flash at max
- [x] T003 [P] Build the Webflow link fix
- [x] T004 [P] Build the two provenance fixes
- [x] T005 [P] Build the sk-git hooks README update
- [x] T006 [P] Build the shared README count
- [x] T007 Delete `stdin-deadline.test.mjs` and update both unreleased changelogs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the extended suite on the pre-fix archive and on the current tree
- [x] T009 Rerun the searches and validators
- [x] T010 Strict validation
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
