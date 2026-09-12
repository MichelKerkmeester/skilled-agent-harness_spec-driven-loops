---
title: "Tasks: The five suite failures the decommission inherited"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "suite failure task breakdown"
  - "diagnose five advisor failures"
  - "accuracy neutrality check"
  - "census recount task"
importance_tier: "normal"
contextType: "general"
---
# Tasks: The five suite failures the decommission inherited

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read each of the five failures' actual assertion output rather than its test name
- [x] T002 Establish that three share one cause: a rename applied to two of three descriptions
- [x] T003 Confirm the retired command behind the census drift by reading history, not by guessing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Align the inventory projection block with the command-bridge block it is compared against
- [x] T005 Recount the census and update the pin, recording the retirement that moved it
- [x] T006 Leave the Python scorer's vocabulary alone, since it is what the parity suites measure against
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the three command suites and read the counts
- [x] T008 Measure the accuracy pin with the change and without it, to prove neutrality
- [x] T009 Run the shipped routing-accuracy floor gate and read its verdict
- [x] T010 Establish what moved the accuracy pins, by diffing routing inputs since the baseline commit
- [x] T011 Run `validate.sh --strict` on this packet and require `RESULT: PASSED`
- [x] T012 Identify the two regressed prompts by name from the parity suite's accepted-regression list
- [x] T013 Measure both in the pinned regime and live, and record the margins
- [x] T014 Attempt a vocabulary fix and measure it, to separate dilution from a missing term
- [x] T015 Re-capture the baseline and confirm the diff is only the four expected lines
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
