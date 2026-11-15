---
title: "Tasks: Phase 19: fork-compact-pointer-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fork compact pointer research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: fork-compact-pointer-research

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

- [x] T001 Run 10 iterations of deep research with DeepSeek v4.1 Flash (`research/lineages/deepseek-pi/`)
- [x] T002 Verify the synthesis against the transcripts and record the correction (`research/research.md`)
- [x] T003 Independent Opus 5.5 review of the synthesis, re-checked and recorded (`research/research.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Tests first: four new compact-pointer tests, red 3 of 36 (`tests/claude-adapters.test.cjs`)
- [x] T005 Fork guard, basename check, missing-path skip, reset after the guards (`claude/compact-pointer.mjs`)
- [x] T006 README paragraph on the skips (`README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Adapter tests 36 of 36, session-relaunch suite 584 of 584
- [x] T008 Replay of the six recorded fires: five suppressed, 19:03:48 delivered
- [x] T009 Drift guards and strict validation
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



