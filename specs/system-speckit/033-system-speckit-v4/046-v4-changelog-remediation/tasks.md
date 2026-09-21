---
title: "Tasks: v4 changelog remediation (the 045 research pass)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4 changelog remediation (the 045 research pass)

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

- [x] T001 Create the 046 packet via the canonical phase append (this packet)
- [x] T002 Author spec/plan/tasks from the 045 report's Sections 7, 9, 10, 13 (spec.md, plan.md, tasks.md)
- [x] T003 Capture the pre-edit evidence: `scratch/changelog-before.md` + its sha, the facts-before extraction, the census/HVR/semicolon baseline (scratch/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Sentinel: verify the pinned sha, then archive the before-copy (scratch/changelog-before.md)
- [x] T005 Apply report 10-A: the eight path/consistency corrections, L168 verify-only (../CHANGELOG-v4.0.0.0.md)
- [x] T006 Apply report 10-B: Six→Seven, the F-010 agent clause, the F-011 spelling, the two F-016 sentence fixes and the eight listed prose trims (../CHANGELOG-v4.0.0.0.md)
- [x] T007 Apply report 10-C: the five count dispositions (../CHANGELOG-v4.0.0.0.md)
- [x] T008 Apply report 10-D: merge One Shape into Why This Release, compress the glance, the F-018 reorder, Internal Seams → Appendix: Under the Hood, drop After This Draft, the listed H4 folds (../CHANGELOG-v4.0.0.0.md)
- [x] T009 Deposit the dropped facts to their 033 owners and the two no-owner classes to component records (../timeline.md, component changelogs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Report 10-E: the count greps, the `.skilled/` mention probe, the `.opencode` spelling check, the six/seven re-verify
- [x] T011 The gates: census 0 walls, HVR 0 hard blockers, 0 semicolon lines outside `&nbsp;`
- [x] T012 Record the measured post-edit counts next to the pinned 18/56/19/44 baseline (spec.md, implementation-summary.md)
- [x] T013 `validate.sh 046 --strict` and the 033 parent `--strict` (030's known failure disclosed, untouched)
- [x] T014 Author the implementation summary, repair the derived metadata, fill the parent's row 46 + handoff, add the timeline milestone, then one local commit (explicit paths, plain `git commit`)
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
- **Instruction set**: `../045-v4-changelog-voice-rewrite/research/research.md` (Sections 7, 9, 10, 13)
<!-- /ANCHOR:cross-refs -->
