---
title: "Tasks: Phase 27: derived-sanitizer-instruction-shape"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "derived sanitizer instruction shape tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 27: derived-sanitizer-instruction-shape

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

- [x] T001 List the 22 labels the old pattern dropped and the words that dropped them
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Rewrite the instruction pattern around phrasing
- [x] T003 Bump the sanitizer version and the stress fixture
- [x] T004 Add the routing-label test
- [x] T005 Stamp all 14 blocks with v2
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the advisor suite
- [x] T007 Prove every curated label against the rebuilt sanitizer
- [x] T008 Run the regenerator, metadata check, route guard and graph validation after restarting the advisor daemon
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



