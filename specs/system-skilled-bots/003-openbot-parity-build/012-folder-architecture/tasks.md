---
title: "Tasks: Phase 12: folder-architecture"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "folder architecture tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: folder-architecture

<!-- SPECKIT_LEVEL: 2 -->
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

Every command runs from the repository root. `F` is `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture`, `H` is `.skilled/skills/system-skilled-bots` and `C` is `.skilled/crates/bots-tui/Cargo.toml`. `BASE` is the commit `system-skilled-bots` held when the phase opened, which T001 writes into `$F/scratch/tree-baseline.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure every in-scope root as it stands when the phase opens, after 011.005 to 011.007 and 010.003 have merged: tracked file count, folder count, the folders that hold one file and the deepest path, for `$H` and each of its top-level folders, `.skilled/crates/bots-tui`, `.skilled/bin/bots.cjs` and the deep-loop executor audit files, and record `BASE`, the commit `system-skilled-bots` held when the phase opened (`$F/scratch/tree-baseline.md`). Verify: `rg -c '^\| ' $F/scratch/tree-baseline.md` prints at least 6, and `rg -n 'BASE' $F/scratch/tree-baseline.md` prints the commit. Evidence: BASE recorded, 18 table rows.
- [x] T002 Record every gate's output before the first move: the runtime `npm test` and `npm run typecheck`, `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings` and `cargo test --locked` on `$C`, the deep-loop executor audit tests, `parent-skill-check.cjs` on `$H`, `check-gate-inputs.sh`, the playbook validator and `node .skilled/bin/bots.cjs --help` (`$F/scratch/gate-baseline.md`). Verify: `rg -c 'Test Files|test result: ok|OK: parent-skill-check|RESULT: PASSED|scenarios=58' $F/scratch/gate-baseline.md` prints at least 12. Evidence: gate-baseline.md, 43 matching lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the move map from T001's measure: one row per candidate with an id `M001` up, the old path, the verdict `move` or `keep`, the new path for a move, the reason and the count `rg -c -F '<old path>' .` returns. Keep every folder `parent-skill-check.cjs` or the mode registry fixes, and group the move rows by the task below that lands them (`$F/scratch/move-map.md`). Verify: `rg -c '^\| M[0-9]{3} \|' $F/scratch/move-map.md` prints the row count, and `rg -n '^\| M[0-9]{3} \|[^|]*\|[^|]*\|[^|]*\| *\|' $F/scratch/move-map.md` prints nothing, so no row has an empty reason. Evidence: 32 M rows, no empty reason.
- [x] T004 Land the runtime lib and test rows with `git mv` and rewrite every import and every reference in code, CI, docs and specs in the same commit (`$H/runtime/`). Verify: `npm --prefix $H/runtime run typecheck` exits 0 and `npm --prefix $H/runtime test` prints the baseline counts with no `failed`. Evidence: M016 in 150c1d4d2b2, typecheck exit 0, 57 files 794 passed.
- [x] T005 Land the script and fixture rows the same way (`$H/scripts/`). Verify: `npm --prefix $H/runtime test` prints the baseline counts, and for each landed row `rg -n -F '<old path>' . -g "!$F/scratch/**"` prints nothing. Evidence: no rows in the map, and npm test prints 57 files 794 passed at FINAL.
- [x] T006 Land the mode packet, reference and asset rows the same way (`$H/bots-*/`, `$H/assets/`, `$H/shared/`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H` prints `OK: parent-skill-check`. Evidence: no rows in the map, and parent-skill-check prints OK: parent-skill-check with 0 warnings at FINAL.
- [x] T007 Land the playbook and feature catalog rows the same way (`$H/manual-testing-playbook/`, `$H/feature-catalog/`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0`. Evidence: no rows in the map, and the playbook validator prints PASS with scenarios=58 and violations=0 at FINAL.
- [B] T008 Land the crate and CLI rows the same way, and keep the crate's `design/` copy equal to the packet's two design folders (`.skilled/crates/bots-tui/`, `.skilled/bin/bots.cjs`, `.github/workflows/bots-runtime.yml`). Verify: `cargo test --locked --manifest-path $C` prints the baseline counts per target, the guard's diff commands from `bots-runtime.yml` print nothing and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`. Blocked: cargo test and check-gate-inputs.sh pass with baseline counts and the map has no crate or CLI rows, but the CI design guard prints the pre-existing line Only in .skilled/crates/bots-tui/design: chat-mockups.md at BASE and at FINAL (cause 44216a6ad13). Held for the top orchestrator.
- [x] T009 Land the deep-loop executor audit rows the same way, when the map holds any (`.skilled/skills/system-deep-loop/runtime/`). Verify: the executor audit tests print the baseline counts. Evidence: no rows in the map, and the executor audit tests print 6 files 135 passed at FINAL.
- [x] T010 Author a README through `/create:readme`, which applies sk-doc's `sk-create-readme` standards, for each folder that is new or unique in the final layout. It runs after T004 to T009, because the move map creates folders that do not exist until the moves land. Each README says what belongs in its folder and what does not. Write `.skilled/crates/README.md` and refresh `.skilled/crates/bots-tui/README.md`. The rest comes from the move map's new folders and the folders the build created under an in-scope root. Add a README table to `$F/scratch/move-map.md` with one row per folder in the form `| R001 | <folder> | readme | <reason> |`, ids `R001` up, the verdict `readme` or `skip` and a reason. The two named folders are rows. Skip a fixture case folder, the crate's `design/` copy the CI diff guard compares, a feature catalog category folder or a folder whose parent README already says what it holds (each folder named here and in the table). Verify: `test -f .skilled/crates/README.md && test -f .skilled/crates/bots-tui/README.md` exits 0, `rg -c '^\| R[0-9]{3} \|' $F/scratch/move-map.md` prints at least 2, `rg -N -o -r '$1' '^\| R[0-9]{3} \| ([^ |]+) \| readme \|' $F/scratch/move-map.md | while read d; do test -f "$d/README.md" || echo "missing $d"; done` prints nothing and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <folder>/README.md` prints `VALID` for each `readme` row. Evidence: two readme rows VALID, 28 R rows, 56529b6deab.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun every gate T002 recorded from the final state and compare each line with the baseline. Verify: each count matches and no output names `failed` or `FAILED`. Evidence: every gate equal to the baseline, the design guard equal to its pre-existing failure.
- [x] T012 Prove every move is a rename. Verify: `git diff -M --diff-filter=D --name-only $BASE HEAD -- .skilled` prints nothing. Evidence: prints nothing.
- [x] T013 Prove no old path survives. Verify: for each `move` row, `rg -n -F '<old path>' . -g "!$F/scratch/**"` prints nothing. Evidence: full path and tails print nothing.
- [x] T014 Measure the final state the way T001 did (`$F/scratch/tree-after.md`). Verify: the one-file folder count under `$H` is lower than the baseline's, or each keep row the difference rests on names its reason. Evidence: tree-after.md, 123 to 122.
- [x] T015 Validate this folder. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $F --strict` prints `RESULT: PASSED`. Evidence: strict validate on this folder prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row in `acceptance-criteria.md` reads `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] 011.007, 010.003 and every runtime unit merged before T001 runs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `cargo fmt --check` and `cargo clippy --locked --all-targets -- -D warnings` on `$C` and the runtime `npm run typecheck` pass from the final state
- [x] CHK-011 [P0] No gate prints a warning the baseline did not
- [x] CHK-012 [P1] No moved file changes beyond its path and the paths it names
- [x] CHK-013 [P1] Every move follows a row in `scratch/move-map.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` reads `Met` Open: AC-007 stays Unmet.
- [x] CHK-021 [P0] Every gate count in T011 equals the baseline
- [ ] CHK-022 [P1] `node .skilled/bin/bots.cjs ui` refuses `ui-not-built` on a bare tree with the crate folder and opens on the built crate Partly observed: bots ui refuses ui-not-built on this tree. Opening it on a built crate needs a terminal and was not run.
- [x] CHK-023 [P1] A group whose gate failed was reverted, not patched Evidence: no group failed, so none needed a revert.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each move row is `instance-only`: one path and every reference to it.
- [x] CHK-FIX-002 [P0] Each move row carries the `rg -c -F` count of the files that name it.
- [x] CHK-FIX-003 [P0] T013 proves no consumer still names an old path.
- [x] CHK-FIX-004 [P0] N/A: no path, parser or redaction logic changes, only where files live.
- [x] CHK-FIX-005 [P1] The move map's row count is stated in `scratch/tree-after.md`.
- [x] CHK-FIX-006 [P1] N/A: no code or test reads new process-wide state.
- [x] CHK-FIX-007 [P1] Evidence names `BASE` and the final commit, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token or state-root path enters a tracked file
- [x] CHK-031 [P0] N/A: no input handling changes
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] No code comment names a spec path or a task id
- [x] CHK-042 [P2] The hub `README.md` names any moved folder it described Evidence: the hub README names no moved folder.
- [x] CHK-043 [P1] Every `readme` row in the move map's README table, `.skilled/crates/` and `.skilled/crates/bots-tui/` among them, holds a `README.md` authored through `/create:readme` that says what belongs in the folder and what does not
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files stay in `scratch/`
- [x] CHK-051 [P1] `scratch/` keeps only the four records the spec names, so the two `draft-*.md` files are deleted once T001 and T003 have written the real records
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 14 | 13/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-28
<!-- /ANCHOR:summary -->

---
