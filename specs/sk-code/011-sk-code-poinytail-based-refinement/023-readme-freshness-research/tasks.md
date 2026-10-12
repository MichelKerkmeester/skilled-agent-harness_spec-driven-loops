---
title: "Tasks: Phase 23: readme-freshness-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "readme freshness research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 23: readme-freshness-research

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

- [ ] T001 Read `spec.md`, `goal.md` and the v4.0.0.4 release note, and load `.skilled/repo-rules/prevent-overengineering.md`
- [ ] T002 Configure `/deep:research` with the questions from `spec.md` section 2, 10 iterations and executor `cli-devin` (`research/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run all 10 iterations; continue rather than stop on early convergence (`research/`)
- [ ] T004 Spot-check every cited path:line and rerun every quoted command
- [ ] T005 Write the per-README fix list that `spec.md` REQ-002 defines, and the OK-VERIFIED section (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Run every criterion in `goal.md` and record the output in its log
- [ ] T007 Fill `implementation-summary.md`
- [ ] T008 Run strict validation on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every criterion in `goal.md` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



