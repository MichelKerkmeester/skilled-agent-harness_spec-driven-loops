---
title: "Tasks: Phase 4: Live-Follow Log Hygiene"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "live follow log hygiene tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: Live-Follow Log Hygiene

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

- [ ] T001 Answer the cap policy question: size, line count, or rotated files
- [ ] T002 Build a synthetic diverged repository to drive the loop
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Track the last reported ahead/behind state and emit only on transition (`.opencode/bin/git-live-follow.sh`)
- [ ] T004 Apply the same treatment to any other per-poll emission in the loop
- [ ] T005 Add the log cap or rotation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Hold a divergence across many intervals; count emitted lines
- [ ] T007 Clear and re-enter the condition; confirm a second entry
- [ ] T008 Confirm the cap holds and the pid lock is undisturbed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Line counts recorded before and after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
