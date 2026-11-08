---
title: "Tasks: Phase 4: advisor-hooks-relaunch"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor hooks relaunch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: advisor-hooks-relaunch

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

`R` is `research/` inside this folder. `S` is `R/deep-research-state.jsonl`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the phase spec with the research topic in Open Questions (`spec.md`). Verify: `grep -c 'Read-only outside your research folder' spec.md` prints 1.
- [x] T002 Initialize the run through `phase_init` (`R/deep-research-config.json`). Verify: the init log printed `gateway exit=0` for the run-initialized event.
- [x] T003 Seed 12 key questions and the first focus (`R/deep-research-strategy.md`). Verify: `grep -c '^- \[ \]' R/deep-research-strategy.md` printed 12 at init.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run iterations through the workflow's `if_cli_*` dispatch, `cli-devin` first and `cli-pi` after the quota switch (`S`). Verify: `grep -c '"type":"iteration"' S` prints 22 rows for 20 distinct iterations (generation 2).
- [x] T005 Steer after every iteration and log each verdict (`decision-record.md`). Verify: the Steering Log has one row per iteration.
- [x] T006 Run the depth checkpoint and extend by +5 when below the bar (`decision-record.md`). Verify: decisions D-09 (extend to 15), D-10 (stop at 15, superseded), the reopen decision and the final stop decision name their reasons.
- [x] T007 Synthesize (`R/research.md`). Verify: `test -s R/research.md` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Open the top findings' citations (`implementation-summary.md`). Verify: each top finding row names the line read.
- [x] T009 Fill the coverage table (`implementation-summary.md`). Verify: no release row in `research/research.md` section 14 reads unread.
- [x] T010 Validate the folder (`spec.md`). Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research/research.md` exists and the strict validate passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
