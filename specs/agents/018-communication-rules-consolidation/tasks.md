---
title: "Tasks: Consolidate the communication repo rules"
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
# Tasks: Consolidate the communication repo rules

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

- [x] T001 Analyze the five communication rules and the changelog template (`research/analysis-under-review.md`)
- [x] T002 [P] Four parallel read-only reviews (`research/reviews/`)
- [x] T003 Record a compliance baseline (`research/baseline-2026-10-07.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move the registers into communication.md and keep the hedge rule in uncertainty-and-honesty.md
- [x] T005 Merge the first-line and outcome sections into one answer-first section (`communication.md`)
- [x] T006 Replace the restate/approach/questions opening (`communication-decisions.md`)
- [x] T007 Fix the em dashes, semicolons and serial commas in the rules and the router rows
- [x] T008 Add identifier, number, reader-impact and say-once guidance (`communication-prose.md`, `communication.md`)
- [x] T009 Shorten the plain-rewrite procedure in place, state the receipts order, make the semicolon join explicit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `check-repo-rules` 11/11 PASS, `check-rule-copies` OK
- [x] T011 `hvr_scan.py` 0 hard blockers in every edited rule, apart from quoted banned-word examples in communication.md
- [x] T012 Rule measurement tests 18 passed, and no stale section references remain
- [x] T013 `validate.sh --strict` RESULT: PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-ups

- [x] T014 Credit an injected rule only when its title, as the rule or its card, and its first rule line arrive, and end delivery at compaction (`measure-rule-compliance.py`)
- [x] T015 Tests for both, each failing on the old script; the Codex row test now expects a post-compaction reply as "before" (`test_measure_rule_compliance.py`)
- [x] T016 Base a long-stretch estimate on a named earlier run or mark it an assumption (`communication-decisions.md` §4 and self-check)
- [x] T017 Record Codex's `request_user_input` and where it is available (`communication-handoff.md` §5)
- [x] T018 Replace the stale claim that Devin surfaces root `CLAUDE.md` (`cli-devin/SKILL.md`) and regenerate the Hermes skill copies
- [ ] T019 Re-measure compliance once more sessions run under the new rule versions
<!-- /ANCHOR:phase-4 -->

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



