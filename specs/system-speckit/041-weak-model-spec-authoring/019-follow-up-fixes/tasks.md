---
title: "Tasks: Phase 19: follow-up-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "follow up fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: follow-up-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Commands run from the repository root unless stated. `M` is `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh`. `L` is `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop`. `G` is `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the manifest test failure (`../017-measured-behavior-and-draft-metadata/scratch/baseline/suite-after-cli.txt`). Verify: `rg -n 'recursive-child-manifest'` on that file prints line 150 ending `853305ms`.
- [x] T002 Record the dropped variant (`$L/results/20261026T164410Z-40710/results.tsv`). Verify: `rg 'main-no054' results.tsv | rg -c ABORT` prints 3.
- [x] T003 Write the brief for change A (`scratch/briefs/brief-A.txt`). Verify: `ls scratch/briefs/brief-A.txt` prints the path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `-c core.fsmonitor=false` to both git calls and a reason comment, via DeepSeek V4.1 Flash through cli-pi (`$M`, output `scratch/runs/A.out`). Verify: `rg -c 'core.fsmonitor=false' $M` prints 2.
- [x] T005 Add the round-start re-prepare with its head and leak checks (`$L/loop.sh`). Verify: `bash -n $L/loop.sh` exits 0.
- [x] T006 [P] Document the re-prepare (`$L/README.md`). Verify: `rg -n 'Re-prepare between rounds' $L/README.md` prints `75:### Re-prepare between rounds`.
- [x] T007 Fix the review findings: restore the executable bit, and skip the dry-run round-start plan for a variant already planned (`$M`, `$L/loop.sh`). Verify: `ls -l $M` prints `-rwxr-xr-x`, and `rg -n 'PREPPED' $L/loop.sh` prints lines 93, 106 and 143.
- [x] T012 Make a refused re-prepare final for the rest of the run, and say so in the refusal line and the README (`$L/loop.sh`, `$L/README.md`). Verify: `rg -n 'REFUSED=' $L/loop.sh` prints lines 135 and 164, and `rg -c 'does not try it again' $L/README.md` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the manifest test (`recursive-child-manifest.vitest.ts`). Verify: from `.skilled/skills/system-spec-kit`, `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` exits 0 and prints `Tests  2 passed (2)`.
- [x] T009 Probe the fail-closed path and the file mode (`$M`). Verify: `SPECKIT_MANIFEST_GIT_BIN=missing-git-command bash $M` prints `FAIL CLOSED: git is unavailable` with exit 2, and `$G diff -- $M` shows `index c5fe8d9871c..56da9621a05 100755` and no `old mode` line.
- [x] T010 Dry-run the loop (`$L/loop.sh`). Verify: from `$L`, `/bin/bash loop.sh --task minpct --variants pre054,main-no054 --runs 2 --dry-run --reuse-refined` exits 0 with 158 lines, prints `+ reuse sandbox` for both variants and no `prepare.sh` line, and `ls results | wc -l` prints 8 before and after.
- [x] T011 Record the review (`scratch/review.md`). Verify: `rg -c 'P1|P2' scratch/review.md` prints a count above 0.
- [x] T013 Run the real re-prepare paths against a stub `prepare.sh` (`scratch/test/reprepare-harness.sh`). Verify: `/bin/bash scratch/test/reprepare-harness.sh` exits 0, prints `re-prepared a (head unchanged)` twice, prints three `refused to re-prepare` lines (head, `prepare.sh failed`, `task_term_refs=3`) and nothing between the round 3 and round 4 markers.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: T008 to T010 and T013 printed the expected output on 2026-10-26
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: See `scratch/review.md`
<!-- /ANCHOR:cross-refs -->

---
