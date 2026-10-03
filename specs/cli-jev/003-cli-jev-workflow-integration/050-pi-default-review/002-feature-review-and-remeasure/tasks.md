---
title: "Tasks: Phase 2: Review, test, re-measure and fix nine Jev features"
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
# Tasks: Phase 2: Review, test, re-measure and fix nine Jev features

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

- [ ] T001 Brief the fresh reviewer with the nine features, their last verdicts and the worker rules
- [ ] T002 Capture the suite baselines before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Review and test 032 citation drift and 037 Pi transport
- [ ] T004 Review and test 035 injection screen, 025 verdict fallback and 024 hallucination grader
- [ ] T005 Review and test 017 search narrowing, 026 completion claims, 029 P0 reread order and 031 debug next check
- [ ] T006 Re-measure each feature live, with route counts
- [ ] T007 Fix each defect found, with a cross-family review
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Session reruns each changed suite and checks each verdict line against its run folder
- [ ] T009 Cross-family review: fix P0 and P1, record P2
- [ ] T010 Run `validate.sh --strict` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



