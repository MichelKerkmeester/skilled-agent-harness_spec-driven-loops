---
title: "Tasks: Phase 2: subtrack-predicate"
description: "Ordered, test-first tasks to align the declared-sub-track rule across validation, archive, parent derivation and repair, skip symlinked packets in recursive validation, and correct the 044 claim that the copies already agree."
trigger_phrases:
  - "subtrack predicate tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: subtrack-predicate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`K` is `.skilled/skills/system-spec-kit/runtime`. `T` is the test command in `plan.md` section 5, run from `K/cli` after `npm run build` in `K`.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline pass and fail counts of every test file in `T` (`scratch/baseline.txt`). Evidence: `scratch/baseline.txt` records the 10-file pre-edit baseline and notes that the planned parity test did not exist yet. Verify: `cat scratch/baseline.txt` lists one total per baseline file.
- [x] T002 Record the operator's answers to D-002a and D-002b (`spec.md` section 7). Evidence: `spec.md` records both recommended options with the operator decision date. Verify: `rg -n 'Status: answered' spec.md` prints two lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the red parity test for P2-1: one matrix of `001-odd`, `001_odd`, `.hidden`, `node_modules`, `z_old`, a symlinked description, a symlinked folder and a folder holding `spec.md`, asked of the reader, `create.sh`'s check, `validate.sh`, `archive.sh`, the parser and `repair-derived.cjs` (`K/cli/tests/subtrack-predicate-parity.vitest.ts`). Evidence: `scratch/red-T003-parity-failing-cases.txt` shows the pre-fix consumer mismatches; `scratch/green-T010-parity-matrix.txt` shows all five consumers passing the matrix. Verify: the test failed before implementation and passes after alignment.
- [x] T004 Add the red case for P2-2: a sub-track whose `description.json` is a symlink must not validate as a container (`K/cli/tests/validate-subtrack.vitest.ts`). Evidence: `scratch/red-T004-symlinked-description.txt` shows `RESULT: PASSED` before the fix; `scratch/green-T008-symlinked-description.txt` shows the focused case passing. Verify: the case fails before implementation and passes after the build.
- [x] T005 Add the red case for P2-8: `demo/sub/002-linked` symlinked outside `specs/` must not appear in `validate.sh specs/demo --recursive` (`K/cli/tests/validate-subtrack.vitest.ts`). Evidence: `scratch/red-T005-symlinked-numbered-packet.txt` shows the link listed before the fix; `scratch/green-T007-symlinked-numbered-packet.txt` shows the focused case passing. Verify: the test fails before implementation and passes after the sub-track loop change.
- [x] T006 Align `has_subtrack_declaration` with the reader: the numbered-name pattern, `-L` on `description.json`, hidden and `node_modules` exclusions (`K/cli/spec/validate.sh`). Evidence: `scratch/green-T008-parity-validation.txt` and `scratch/green-T008-symlinked-description.txt` show the validation matrix slice and P2-2 case passing after the orchestrator build. Verify: the T003 and T004 validation cases pass.
- [x] T007 Skip `-L` numbered packet directories in the sub-track loop only (`K/cli/spec/validate.sh`). Evidence: `scratch/green-T007-symlinked-numbered-packet.txt` passes; the flat-track loop at line 361 retains its `[[ -d "$phase_dir" ]]` condition while the sub-track loop at line 380 checks `! -L`. Verify: the T005 case passes and the flat-track loop is unchanged.
- [x] T008 Align `isDeclaredSubTrack` and `hasSubTrackLevel` with the reader, then run `npm run build` in `K` (`K/lib/validation/orchestrator.ts`). Evidence: `scratch/green-T008-build.txt` exits 0; `scratch/green-T008-parity-validation.txt` and `scratch/green-T008-symlinked-description.txt` pass. Verify: the T003 validation matrix and T004 case pass after the build.
- [x] T009 Align `is_declared_subtrack` with the reader (`K/cli/spec/archive.sh`). Evidence: `scratch/green-T009-parity-archive.txt` passes; `scratch/green-T009-archive-track.txt` reports 60 passed; `bash -n spec/archive.sh` exited 0. Verify: the matrix and archive-track suite pass.
- [x] T010 Align the parser and repair copies only where T003 still fails for them (`K/lib/graph/graph-metadata-parser.ts`, `K/cli/spec/repair-derived.cjs`). Evidence: `scratch/green-T010-build.txt` exits 0 and `scratch/green-T010-parity-matrix.txt` reports 5 passed. Verify: every parity consumer passes.
- [x] T011 Correct the row at line 101 so it states the rule and names the parity test (`specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md`). Evidence: the pre-edit `rg` found line 101; the post-edit search prints `old claim absent` and the replacement row names the parity test. Verify: the false claim is absent.
- [x] T012 [P] Optional, P3, P2-7: add the red case for a declared sub-track that holds `spec.md` reading a distinct diagnostic in both views (`K/cli/tests/track-roots.vitest.ts`). Evidence: `scratch/red-T012-own-spec-diagnostic.txt` shows the old generic diagnostic; `scratch/green-T013-own-spec-diagnostic.txt` passes the focused case. Verify: both views report the distinct diagnostic.
- [x] T013 [P] Optional, P3, P2-7: split the two causes behind the diagnostic (`K/cli/lib/track-roots.mjs`). Evidence: `scratch/green-T013-own-spec-diagnostic.txt` passes and `scratch/green-T013-track-roots.txt` reports 19 passed. Verify: both views distinguish the own-spec case and the sweep tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the whole `T` command and `bash -n` on both scripts (`K/cli/spec/validate.sh`, `K/cli/spec/archive.sh`). Evidence: `scratch/final-T014-plan-suite.txt` reports 8 files and 160 passed, and both syntax checks ran in the same command with exit 0; `scratch/final-step2-requested-suite.txt` reports 11 files and 190 passed. Verify: both suites report zero failures and the shell syntax checks exit 0.
- [x] T015 Rerun the two Measured Behavior commands in a scratch workspace (`spec.md` section 2). Evidence: `scratch/final-T015-measured-behavior.txt` records the sweep diagnostic and validation result. Verify: sweep prints `demo/sub2: undeclared folder ignored`; strict validation exits 2 with `RESULT: FAILED` and no `RESULT: PASSED`.
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
