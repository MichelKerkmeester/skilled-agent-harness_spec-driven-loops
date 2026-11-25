---
title: "Tasks: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "v4 2 0 0 release audit research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

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

`P` is `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research`. `C` is `.skilled/changelog/skilled/v4.2.0.0.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the window commit list (`$P/scratch/window-commits.txt`). Verify: `wc -l < $P/scratch/window-commits.txt` prints 1084.
- [x] T002 Freeze the recent packet list (`$P/scratch/recent-packets.txt`). Verify: `grep -vc '^#' $P/scratch/recent-packets.txt` prints 21.
- [x] T003 Preview both lineage commands (`$P/research/`). Verify: the `--dry-run` preview prints one command each for the `codex` and `devin` labels and writes nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the two-lineage fan-out (`$P/research/lineages/`). Verify: `ls $P/research/lineages/*/iterations/ | wc -l` prints a count above 2.
- [x] T005 Merge and synthesize the findings (`$P/research/research.md`). Verify: `test -f $P/research/research.md && echo ok` prints ok.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Re-check every reported finding in the repository (`$P/research/research.md`). Verify: each reported finding names the file read or command that confirmed it.
- [x] T008 Fix the case-sensitive `root/skilled` guard (`overlay-engine.cjs`). Verify: the new strict-writes test fails without the fix and passes with it.
- [x] T009 Restore the lost executable bits. Verify: `git ls-files -s` prints `100755` for the three files.
- [x] T010 Update `C` from `research/research.md`. Verify: `C` names M1 and the corrected install line.
- [x] T007 Validate the packet (`$P/spec.md`). Verify: `validate.sh $P --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research/research.md` holds the verified findings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
