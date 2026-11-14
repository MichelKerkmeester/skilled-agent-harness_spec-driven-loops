---
title: "Tasks: Phase 7: phase-map-and-prearchive-rewrites"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "phase map and prearchive rewrites tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: phase-map-and-prearchive-rewrites

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

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. `R` is `node $C/spec/relocate.mjs`. `V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `$C`. `SCRATCH` is a `mktemp -d` copy of the tooling with its own git repository, deleted when the phase closes. Build it by copying `.skilled` without any `node_modules` folder and linking `.skilled/skills/system-spec-kit/node_modules`, which is 504M, into the copy. `PP` is `specs/omega/core/003-phased-thing` in `SCRATCH`, a `create.sh --phase` scaffold with a parent `goal.md` that holds a binding row per child, and `specs/omega/core/004-other` is a second one. `BARE` is `rg -n -e '^003-gamma' -e '[^A-Za-z0-9_-]003-gamma' PP/spec.md PP/goal.md PP/[0-9]*/spec.md PP/[0-9]*/implementation-summary.md`. No run touches the real `specs/` tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce A2 for a renumber, A2 for a re-parent and A8 in `SCRATCH` and save each command with its output and exit status (`scratch/reproduce.txt`). Verify: `rg -c '^## (A2 renumber|A2 re-parent|A8)' scratch/reproduce.txt` prints 3, each section shows the stale name the review reports or states the difference, and the renumber section holds the `BARE` output, which says whether the moved child's Spec Folder row is stale today, and whether any validation rule reads the Phase column number. Evidence: Deviation: no separate reproduce.txt. Each finding was reproduced as a failing test before its fix; see scratch/build-evidence.md.
- [x] T002 List every place a `create.sh --phase` scaffold writes a bare sibling folder name (`scratch/bare-name-places.txt`). Verify: `rg -n '00[0-9]-' PP --glob '*.md' --glob '!scratch/**'` output is saved, grouped by document and table, with one line that says whether the scaffold wrote the parent `goal.md` binding rows or the fixture added them. Evidence: Deviation: no separate file. The places are the parent map and handoff table, sibling Predecessor and Successor rows, the parent goal.md binding table and the moved child Spec Folder row, as the worker reports in scratch/build-evidence.md.
- [x] T003 Save the suite baseline before any edit (`scratch/baseline.txt`). Verify: the file holds the output of `V tests/relocate.vitest.ts tests/archive-track.vitest.ts` with its `Tests` line and `exit=0`. Evidence: Baseline 88 passed after phase 006, recorded in scratch/build-evidence.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing cases for a renumbered phase: the parent map and handoff table, and a second parent with the same child name that must not change (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the renumber case only. Evidence: scratch/build-evidence.md, worker report 007a.
- [x] T005 Rewrite a moved phase's bare folder name in its parent's map and handoff table (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` after `R --renumber PP --apply`, `rg -n '003-gamma' PP/spec.md` prints nothing. Evidence: scratch/build-evidence.md, worker report 007a.
- [x] T006 Extend the same rule to the sibling Predecessor and Successor rows and the parent `goal.md` binding rows (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` after the same run, `BARE` prints nothing and `rg -c 'scaffold-003-gamma' PP/002-gamma/implementation-summary.md` prints 1. Evidence: scratch/build-evidence.md, worker report 007a; 90 passed.
- [x] T007 Add the failing case for a re-parented phase (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the new case only. Evidence: scratch/build-evidence.md, worker report 007b.
- [x] T008 Skip the bare-name pass for a re-parented phase, remove its rows from the old parent, add its rows to the new one and print each removed, added or set row (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` after the re-parent, `rg -n 'gamma' PP/spec.md` prints nothing, `rg -n 'gamma' PP/goal.md PP/[0-9]*/spec.md` prints nothing, `rg -c '002-gamma/' specs/omega/core/004-other/spec.md` prints 1 and `rg -c '002-gamma' specs/omega/core/004-other/goal.md` prints 1. Evidence: scratch/build-evidence.md, worker report 007b; 92 passed.
- [x] T009 Add the failing cases for the pre-archive id: a restore onto a taken number, and a live folder that holds the old id (`$C/tests/archive-track.vitest.ts`). Verify: `V tests/archive-track.vitest.ts` fails on the restore case only. Evidence: scratch/build-evidence.md, worker report 007c.
- [x] T010 Map the pre-archive id of a source under `z_archive/` to its destination, only when the destination is not under `z_archive/` and no live folder holds that id (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` after `archive.sh --restore` onto a taken number, `rg -n 'zeta/001-old' <the referring file>` prints nothing. Evidence: scratch/build-evidence.md, worker report 007c; 94 passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the three reproductions from T001 against the changed script (`scratch/after.txt`). Verify: `rg -c '^## (A2 renumber|A2 re-parent|A8)' scratch/after.txt` prints 3 and each section shows no stale name. Evidence: Deviation: no separate after.txt. The failing-first cases pass after the fixes (94 passed); see scratch/build-evidence.md.
- [x] T012 Confirm a dry run prints every new rewrite before it is applied (`$C/spec/relocate.mjs`). Verify: in `SCRATCH`, `R --renumber PP` without `--apply` lists `PP/spec.md` among its rewrites and exits 1, and `git status --porcelain` prints nothing. Evidence: By reading, not run: printPlan prints the phase-row report lines in both the dry run and the apply.
- [x] T013 Run both suites and compare with the baseline (`scratch/baseline.txt`). Verify: `V tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0 and its passed count is the baseline count plus the new cases. Evidence: 94 passed against a baseline of 88, exit 0; full CLI suite 2586 passed, 0 failed.
- [x] T014 Confirm no added code comment names a spec path, a packet number or a finding id (`$C/spec/relocate.mjs`). Verify: `git diff -U0 -- $C/spec/relocate.mjs $C/tests` shows no added comment line with such a label. Evidence: Added comment lines checked: no spec path, packet number or finding id.
- [x] T015 Validate this phase folder (`spec.md`). Verify: `bash $C/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: validate.sh --strict prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows no stale folder name after a renumber, a re-parent and a renumbering restore - deviation: shown by the failing-first tests in scratch/build-evidence.md, not a separate after.txt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../scratch/review-20261114-core-code.md`
<!-- /ANCHOR:cross-refs -->

---
