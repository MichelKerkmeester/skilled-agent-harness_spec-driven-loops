---
title: "Tasks: Phase 21: doctor-test-environments"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor test environments tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: doctor-test-environments

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

- [x] T001 Create the update fixture from `v4.0.0.0` with the allocator and add the dot-name symlink
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Commit the updater overlay and the release ignore file
- [x] T003 Commit the Webflow customization and the local web-dev packet
- [x] T004 Commit the Barter sk-git replacement
- [x] T005 Record and commit the v4.0.0.0 base
- [x] T006 Work around the sk-design symlink crash in the fixture after the operator chose a workaround first
- [x] T007 Cut the local `v4.0.0.3-fixture` tag
- [x] T008 Create the current-code environment from `origin/main` and add its symlink
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the scoped checks for all four units
- [x] T010 Run align, decide, apply and rollback and compare with the committed state
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



