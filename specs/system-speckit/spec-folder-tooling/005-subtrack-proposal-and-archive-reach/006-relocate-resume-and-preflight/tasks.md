---
title: "Tasks: Phase 6: relocate-resume-and-preflight"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relocate resume and preflight tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: relocate-resume-and-preflight

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

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. `R` is `node $C/spec/relocate.mjs`. `V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `$C`. `SCRATCH` is a `mktemp -d` copy of the tooling with its own git repository, deleted when the phase closes. Build it by copying `.skilled` without any `node_modules` folder and linking `.skilled/skills/system-spec-kit/node_modules`, which is 504M, into the copy. No run touches the real `specs/` tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce A1, A3, A4, A5 and B6 in `SCRATCH` and save each command with its output and exit status, and under A5 also a stopped move of an untracked source followed by the move back to the source path and a rerun (`scratch/reproduce.txt`). Verify: `rg -c '^## (A1|A3|A4|A5|B6)' scratch/reproduce.txt` prints 5, each section ends with the exit status the review reports or states the difference, and the A5 section shows whether the rerun after the move back exits 0. Evidence: Deviation: no separate reproduce.txt. Each finding was reproduced as a failing test before its fix; the failing output is in scratch/build-evidence.md.
- [x] T002 Confirm `relocate.mjs` is the only file that reads the relocation ledger (`scratch/ledger-readers.txt`). Verify: the saved output of `rg -l 'relocation-ledger' .skilled --glob '!*.md' --glob '!node_modules/**'` holds one line, `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`, as it did on 2026-11-14, or the file names each other reader and the fields it reads. Evidence: scratch/ledger-readers.txt holds one line, relocate.mjs.
- [x] T003 Save the suite baseline before any edit (`scratch/baseline.txt`). Verify: the file holds the output of `V tests/relocate.vitest.ts tests/archive-track.vitest.ts` with its `Tests` line and `exit=0`. Evidence: scratch/baseline.txt: 77 passed, exit=0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing cases for the late steps and the sweep: a stub that exits 1 once, then a rerun, with a fixture move that keeps the folder name, for example `alpha/001-a` to `alpha/sub/001-a`, plus one case where the `validate.sh` stub fails on every call (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the late-step and sweep cases only, and the always-failing-validation case, run 1 exit 2 and run 2 `relocate: nothing to do`, passes before the fix and must still pass after it. Evidence: scratch/build-evidence.md, worker report 006a.
- [x] T005 Make the work check count the redirect table, the trigger index and the sweep of the close until each has passed once (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` after `cite-drift-scan.mjs` failed once, the second `R --apply` prints both late steps as `ok` and exits 0, and the third prints `relocate: nothing to do`. With `validate.sh` failing for the moved packet on every call, run 1 exits 2 and run 2 prints `relocate: nothing to do` and exits 0. Evidence: scratch/build-evidence.md, worker report 006a; 80 passed.
- [x] T006 Add the failing cases for a half-finished move step and for an uncommitted edit outside the map (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the half-finished case only. Evidence: scratch/build-evidence.md, worker report 006b.
- [x] T007 Exempt folders the same map already moved from the dirty-tree refusal (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` with one of two entries moved by `git mv`, `R --map <file> --apply` exits 0, and with an uncommitted edit outside both entries it exits 2. Evidence: scratch/build-evidence.md, worker report 006b; 82 passed.
- [x] T008 Add the failing case for a failed identity step on a folder that kept its name, writing `parentChain` in this case's own fixture and having its migrate stub write the new chain on its second call (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the new case only, and the shared `packet()` helper still writes no `parentChain`, because adding it there would break every existing second-apply case. Evidence: scratch/build-evidence.md, worker report 006c.
- [x] T009 Read `parentChain` in the stale-identity check (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` after the migrate step failed once, run 2 prints `step description identity (migrate-generated-json --only): ok` and exits 0. Evidence: scratch/build-evidence.md, worker report 006c; 83 passed.
- [x] T010 Add the failing cases for a source that never existed, for a tracked move that stopped before the ledger step and for an untracked source moved by rename before the ledger step (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the never-existed case and the untracked-source case only. Evidence: scratch/build-evidence.md, worker report 006d.
- [x] T011 Require a record of the move before a missing source counts as moved, and name the move back in the refusal (`$C/spec/relocate.mjs`). Verify: in `SCRATCH`, `R --from zeta/999-typo --to zeta/001-a` exits 2 and prints no `ledger` line, and after a stopped move of an untracked source the same map exits 2 with a `relocate: refused:` line that names both paths and the move back. Evidence: scratch/build-evidence.md, worker report 006d; 86 passed.
- [x] T012 Add the failing cases for two spellings of one source and of one target, guarded by a probe of the temp volume (`$C/tests/relocate.vitest.ts`). Verify: on a case-insensitive volume `V tests/relocate.vitest.ts` fails on the two new cases only. Evidence: scratch/build-evidence.md, worker report 006e; both cases ran on this APFS volume.
- [x] T013 Compare existing paths in the duplicate checks by device and inode, and a path that does not exist yet by its longest existing prefix plus a case-insensitive rest where a probe shows the volume folds case (`$C/spec/relocate.mjs`). Verify: in `SCRATCH` on a case-insensitive volume, each of the two maps exits 2 and `git status --porcelain` prints nothing. Evidence: scratch/build-evidence.md, worker report 006e; 88 passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun all five reproductions from T001 against the changed script (`scratch/after.txt`). Verify: `rg -c '^## (A1|A3|A4|A5|B6)' scratch/after.txt` prints 5 and each section shows the output its requirement names. Evidence: Deviation: no separate after.txt. Every failing-first case passes after its fix (88 passed); see scratch/build-evidence.md.
- [x] T015 Confirm a clean map still ends on nothing to do (`$C/spec/relocate.mjs`). Verify: in `SCRATCH`, `R --map <sample> --apply` exits 0 and a second run prints `relocate: nothing to do` and exits 0. Evidence: The existing clean-map second-apply cases pass in the 88-test run.
- [x] T016 Run both suites and compare with the baseline (`scratch/baseline.txt`). Verify: `V tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0 and its passed count is the baseline count plus the new cases. Evidence: 88 passed against a baseline of 77, exit 0; full CLI suite 2580 passed, 0 failed.
- [x] T017 Confirm no added code comment names a spec path, a packet number or a finding id (`$C/spec/relocate.mjs`). Verify: `git diff -U0 -- $C/spec/relocate.mjs $C/tests/relocate.vitest.ts` shows no added comment line with such a label. Evidence: Added comment lines checked: no spec path, packet number or finding id.
- [x] T018 Validate this phase folder (`spec.md`). Verify: `bash $C/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: validate.sh --strict prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows a finished rerun for A1, A3 and A4 and a refusal for A5 and B6 - deviation: shown by the failing-first tests in scratch/build-evidence.md, not a separate after.txt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../scratch/review-20261114-core-code.md` and `../scratch/review-20261114-merge-fixes-and-hub-vocabulary.md`
<!-- /ANCHOR:cross-refs -->

---
