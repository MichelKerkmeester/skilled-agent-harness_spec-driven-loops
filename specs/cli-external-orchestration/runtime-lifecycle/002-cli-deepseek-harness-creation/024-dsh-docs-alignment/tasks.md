---
title: "Tasks: Phase 24: dsh-docs-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh docs alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 24: dsh-docs-alignment

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

`DL` is `.skilled/skills/system-deep-loop`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the alignment report and the deep-loop changelogs v1.6.27.0 to v2.0.2.0 (`DL/changelog/`). Verify: `ls DL/changelog/v2.0.2.0.md` prints the path.
- [x] T002 Record the baseline issue count of each doc to edit. Verify: `validate_document.py README.md` prints `Total issues: 1`, the other five print 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the executor item, the save bullet and the inventory versions (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: `grep -c "executor_missing"` prints 1.
- [x] T004 Correct the direct-write sentence (`README.md`). Verify: `grep -c "keeps direct writes" README.md` prints 1.
- [x] T005 Name the packet purpose line (`.skilled/skills/system-spec-kit/README.md`). Verify: `grep -c "purpose line"` prints 2.
- [x] T006 Fix the save command, the state-writer bullet and the failure modes (`DL/deep-review/references/protocol/loop-protocol.md`). Verify: `grep -c "executor_missing"` prints 1.
- [x] T007 Match the save step to the workflow (`DL/deep-research/references/protocol/loop-protocol.md`). Verify: `grep -c "full-auto"` prints 2.
- [x] T008 Correct the executor branch sentence (`DL/deep-research/SKILL.md`). Verify: `grep -c "shared fan-out adapters"` prints 0.
- [x] T009 Regenerate both compiled contracts (`.skilled/commands/deep/assets/compiled/`). Verify: the drift check prints OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Validate each edited doc. Verify: `validate_document.py` prints the baseline issue count for each.
- [x] T011 Run the contract drift check (`DL/runtime`). Verify: `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`.
- [x] T012 Validate this phase and its parent. Verify: `validate.sh --strict` prints `RESULT: PASSED` for both.
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
