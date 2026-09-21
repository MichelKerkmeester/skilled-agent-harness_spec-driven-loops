---
title: "Tasks: Phase 1: v4-changelog-review-fixes"
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
# Tasks: Phase 1: v4-changelog-review-fixes

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

- [x] T001 Capture the pre-edit evidence: the sentinel (sha256 e3b1b5c1…, 722 lines), the 722-line before-copy and the facts-before extraction into this packet's scratch/ (CHANGELOG-v4.0.0.0.md)
- [x] T002 [P] Prove all thirteen edit anchors unique (count==1) against the pinned pre-edit file (CHANGELOG-v4.0.0.0.md)
- [x] T003 [P] Author this packet's spec, plan and tasks from the review dispositions, preserving every scaffold anchor (spec.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply the eight findings as one atomic thirteen-anchor edit call against the pinned state (CHANGELOG-v4.0.0.0.md)
- [x] T005 Account for the facts-before to facts-after extraction diff 1:1 against the thirteen declared edits (scratch/)
- [x] T006 Re-verify each of the eight findings with its own acceptance grep, keyed to the reviewer's cited lines (CHANGELOG-v4.0.0.0.md)
- [x] T007 [P] Refresh the 033 bookkeeping: the phase-47 scope row, the 046→047 handoff row and the timeline milestone (../spec.md, ../timeline.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the standing gates: the wall census, the HVR scan, the semicolon survey and the 17/55/18/43 skeleton count (CHANGELOG-v4.0.0.0.md)
- [x] T009 Record the count-record deltas, complete the continuity block, repair the derived metadata for this packet and the parent, and run validate.sh 047-v4-changelog-review-fixes --strict (spec.md, implementation-summary.md)
- [x] T010 One local commit over explicit paths with nothing pushed, then the final-state verification (git)
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
- **Review under remediation**: ../046-v4-changelog-remediation/scratch/luna-review-2026-09-21.md
- **Predecessor**: 046-v4-changelog-remediation (Complete; its count record is the baseline this pass amends)
<!-- /ANCHOR:cross-refs -->

---

