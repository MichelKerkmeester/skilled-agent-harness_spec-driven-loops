---
title: "Tasks: Phase 26: alignment-remaining-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment remaining findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 26: alignment-remaining-findings

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DL` is `.skilled/skills/system-deep-loop` and `BL` is `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Hash the three corpus files. Verify: only `holdout-prompts.jsonl` differs from its pin, at 64 rows.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Recapture the top-1 and top-3 numbers in the recorded regime (`BL/`). Verify: the capture prints holdout `49/64`.
- [x] T003 Update the pin, the holdout metrics and the discrepancy record (`BL/routing-baseline.json`). Verify: the pin step prints `corpus matches the pinned baseline hashes`.
- [x] T004 Fix the dispatch branches (`DL/deep-review/feature-catalog/`). Verify: `grep -c "one of three dispatch branches"` prints 0.
- [x] T005 Name `--full-auto` in the save docs (`DL/deep-review/feature-catalog/loop-lifecycle/memory-save.md`, `DL/deep-research/feature-catalog/feature-catalog.md`, the review save scenario). Verify: `grep -c "full-auto"` prints at least 1 in each.
- [x] T006 Add `cli-mistral-vibe` and correct `:confirm` (both presentations), then regenerate both contracts. Verify: the drift check prints OK.
- [x] T007 Correct the two packet labels and add the Claude session id row. Verify: `grep -c "004-goal-hook"` on both reports prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the scorer suites and the corpus floors. Verify: each passes.
- [x] T009 Run the playbook, catalog and link checks. Verify: each exits 0 and the link check prints `0 broken`.
- [x] T010 Validate this phase and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both.
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
