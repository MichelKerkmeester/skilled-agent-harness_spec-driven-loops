---
title: "Tasks: Phase 8: restore-and-phase-numbering"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "restore and phase numbering tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: restore-and-phase-numbering

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

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. `AR` is `bash $C/spec/archive.sh`. `V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `$C`. `SCRATCH` is a `mktemp -d` copy of the tooling with its own git repository, deleted when the phase closes. Build it by copying `.skilled` without any `node_modules` folder and linking `.skilled/skills/system-spec-kit/node_modules`, which is 504M, into the copy. No run touches the real `specs/` tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce A6, A7 and A9 in `SCRATCH`, and run the sub-track restore command the A7 refusal will name, saving each command with its output and exit status (`scratch/reproduce.txt`). Verify: `rg -c '^## (A6|A7|A9|A7 sub-track restore)' scratch/reproduce.txt` prints 4, and each section ends with the exit status the review reports or states the difference. Evidence: Deviation: no separate reproduce.txt. Each finding was reproduced as a failing test before its fix; see scratch/build-evidence.md.
- [x] T002 List every caller of `relocate.mjs` that reads its exit status (`scratch/relocate-callers.txt`). Verify: `rg -n 'relocate\.mjs' .skilled --glob '*.sh' --glob '*.mjs' --glob '*.cjs' --glob '*.ts'` output is saved with one line per caller saying what it does with the status. Evidence: scratch/relocate-callers.txt: archive.sh is the only production caller.
- [x] T003 Save the suite baseline before any edit (`scratch/baseline.txt`). Verify: the file holds the output of `V tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts tests/relocate.vitest.ts` with its `Tests` line and `exit=0`. Evidence: Baseline 98 passed (three suites) after phase 007, recorded in scratch/build-evidence.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing phase-parent cases: an archived highest phase, and an archive that holds only a lower number (`$C/tests/archive-numbering.vitest.ts`). Verify: `V tests/archive-numbering.vitest.ts` fails on the archived-highest case only. Evidence: scratch/build-evidence.md, worker report 008a.
- [x] T005 Read `"$FEATURE_DIR"/z_archive/` in the phase numbering loop and keep the predecessor on the highest live phase (`$C/spec/create.sh`). Verify: in `SCRATCH` with `001-alpha` live and `z_archive/002-gamma` archived, `create.sh --phase --parent <parent> --phase-names delta` creates `003-delta` and `rg -n 'Predecessor' <parent>/003-delta/spec.md` prints a line with `001-alpha`. Evidence: scratch/build-evidence.md, worker report 008a; 100 passed.
- [x] T006 Add the failing case for a close whose only failure is a moved packet's validation (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the new case only. Evidence: scratch/build-evidence.md, worker report 008b.
- [x] T007 Return the added exit status for that close and list it in the header (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` the A6 relocate call exits 3 after ten `step ...: ok` lines, the same call again prints `relocate: nothing to do` and exits 0, and the call with `repair-derived.cjs` made to exit 1 exits 2. Evidence: scratch/build-evidence.md, worker report 008b.
- [x] T008 State the added exit status in the `relocate.mjs` row (`$C/spec/README.md`). Verify: `rg -c 'exit 3' $C/spec/README.md` prints 1, and that line also says a rerun after status 3 finds nothing to do. Evidence: rg -c "exit 3" spec/README.md prints 1.
- [x] T009 Add the failing restore cases: a packet that fails its own validation, and a relocate step that fails (`$C/tests/archive-track.vitest.ts`). Verify: `V tests/archive-track.vitest.ts` fails on the own-validation case only. Evidence: scratch/build-evidence.md, worker report 008b.
- [x] T010 Read the added status in `restore_on_next_number`, capturing it with `status=0; node … || status=$?` because the script runs under `set -euo pipefail` (`$C/spec/archive.sh`). Verify: in `SCRATCH` the A6 restore prints the `Restored:` line and one warning that names `specs/zeta/005-old`, and exits 0. Evidence: scratch/build-evidence.md, worker report 008b; 104 passed.
- [x] T011 Add the restore cases for a track with sub-tracks, for a flat track and for an archive followed by a restore with no commit in between (`$C/tests/archive-track.vitest.ts`). Verify: `V tests/archive-track.vitest.ts` fails on the sub-track case only, and the other two pass before the fix and must still pass after it. Evidence: scratch/build-evidence.md, worker report 008c.
- [x] T012 Ask the relocate preflight before either restore path moves anything, and refuse only when its output holds `would hold flat packets` (`$C/spec/archive.sh`). Verify: in `SCRATCH` the A7 restore exits 1, `ls specs/delta/z_archive/009-old` lists the folder and `node $C/spec/sweep-track-roots.mjs` exits 0, and an archive followed by a restore with no commit in between exits 0. Evidence: scratch/build-evidence.md, worker report 008c; 107 passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the reproductions from T001 against the changed scripts (`scratch/after.txt`). Verify: `rg -c '^## (A6|A7|A9)' scratch/after.txt` prints 3 and each section shows the output its requirement names. Evidence: Deviation: no separate after.txt. The failing-first cases pass after the fixes (107 passed); see scratch/build-evidence.md.
- [x] T014 Check the three scripts parse (`$C/spec/archive.sh`). Verify: `bash -n $C/spec/archive.sh`, `bash -n $C/spec/create.sh` and `node --check $C/spec/relocate.mjs` each exit 0. Evidence: bash -n archive.sh and create.sh exit 0, node --check relocate.mjs exit 0.
- [x] T015 Run the three suites and compare with the baseline (`scratch/baseline.txt`). Verify: `V tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts tests/relocate.vitest.ts` exits 0 and its passed count is the baseline count plus the new cases. Evidence: 107 passed against a baseline of 98, exit 0; full CLI suite 2595 passed, 0 failed.
- [x] T016 Confirm no added code comment names a spec path, a packet number or a finding id (`$C/spec/archive.sh`). Verify: `git diff -U0 -- $C/spec $C/tests` shows no added comment line with such a label. Evidence: Added comment lines checked: no spec path, packet number or finding id.
- [x] T017 Validate this phase folder (`spec.md`). Verify: `bash $C/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: validate.sh --strict prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows a new phase numbered `003`, a restore that exits 0 with a warning and a refused restore with the tree unchanged - deviation: shown by the failing-first tests in scratch/build-evidence.md, not a separate after.txt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../scratch/review-20261114-core-code.md`
<!-- /ANCHOR:cross-refs -->

---
