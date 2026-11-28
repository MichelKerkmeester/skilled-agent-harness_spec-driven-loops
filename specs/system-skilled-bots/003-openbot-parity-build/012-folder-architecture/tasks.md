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

Every command runs from the repository root. `F` is `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture`, `H` is `.skilled/skills/system-skilled-bots` and `C` is `.skilled/crates/bots-tui/Cargo.toml`. `BASE` is the commit `main` held when T001 ran, which T001 writes into `$F/scratch/tree-baseline.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Measure every in-scope root as it stands when the phase opens, after 011.005 to 011.007 and 010.003 have merged: tracked file count, folder count, the folders that hold one file and the deepest path, for `$H` and each of its top-level folders, `.skilled/crates/bots-tui`, `.skilled/bin/bots.cjs` and the deep-loop executor audit files, and record `BASE` (`$F/scratch/tree-baseline.md`). Verify: `rg -c '^\| ' $F/scratch/tree-baseline.md` prints at least 6, and `rg -n 'BASE' $F/scratch/tree-baseline.md` prints the commit.
- [ ] T002 Record every gate's output before the first move: the runtime `npm test` and `npm run typecheck`, `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings` and `cargo test --locked` on `$C`, the deep-loop executor audit tests, `parent-skill-check.cjs` on `$H`, `check-gate-inputs.sh`, the playbook validator and `node .skilled/bin/bots.cjs --help` (`$F/scratch/gate-baseline.md`). Verify: `rg -c 'Test Files|test result: ok|OK: parent-skill-check|RESULT: PASSED|scenarios=58' $F/scratch/gate-baseline.md` prints at least 12.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the move map from T001's measure: one row per candidate with an id `M001` up, the old path, the verdict `move` or `keep`, the new path for a move, the reason and the count `rg -c -F '<old path>' .` returns. Keep every folder `parent-skill-check.cjs` or the mode registry fixes, and group the move rows by the task below that lands them (`$F/scratch/move-map.md`). Verify: `rg -c '^\| M[0-9]{3} \|' $F/scratch/move-map.md` prints the row count, and `rg -n '^\| M[0-9]{3} \|[^|]*\|[^|]*\|[^|]*\| *\|' $F/scratch/move-map.md` prints nothing, so no row has an empty reason.
- [ ] T004 Land the runtime lib and test rows with `git mv` and rewrite every import and every reference in code, CI, docs and specs in the same commit (`$H/runtime/`). Verify: `npm --prefix $H/runtime run typecheck` exits 0 and `npm --prefix $H/runtime test` prints the baseline counts with no `failed`.
- [ ] T005 Land the script and fixture rows the same way (`$H/scripts/`). Verify: `npm --prefix $H/runtime test` prints the baseline counts, and for each landed row `rg -n -F '<old path>' . -g "!$F/scratch/**"` prints nothing.
- [ ] T006 Land the mode packet, reference and asset rows the same way (`$H/bots-*/`, `$H/assets/`, `$H/shared/`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H` prints `OK: parent-skill-check`.
- [ ] T007 Land the playbook and feature catalog rows the same way (`$H/manual-testing-playbook/`, `$H/feature-catalog/`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0`.
- [ ] T008 Land the crate and CLI rows the same way, and keep the crate's `design/` copy equal to the packet's two design folders (`.skilled/crates/bots-tui/`, `.skilled/bin/bots.cjs`, `.github/workflows/bots-runtime.yml`). Verify: `cargo test --locked --manifest-path $C` prints the baseline counts per target, the guard's diff commands from `bots-runtime.yml` print nothing and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
- [ ] T009 Land the deep-loop executor audit rows the same way, when the map holds any (`.skilled/skills/system-deep-loop/runtime/`). Verify: the executor audit tests print the baseline counts.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Rerun every gate T002 recorded from the final state and compare each line with the baseline. Verify: each count matches and no output names `failed` or `FAILED`.
- [ ] T011 Prove every move is a rename. Verify: `git diff -M --diff-filter=D --name-only $BASE HEAD -- .skilled` prints nothing.
- [ ] T012 Prove no old path survives. Verify: for each `move` row, `rg -n -F '<old path>' . -g "!$F/scratch/**"` prints nothing.
- [ ] T013 Measure the final state the way T001 did (`$F/scratch/tree-after.md`). Verify: the one-file folder count under `$H` is lower than the baseline's, or each keep row the difference rests on names its reason.
- [ ] T014 Validate this folder. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $F --strict` prints `RESULT: PASSED`.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] 011.007, 010.003 and every runtime unit merged before T001 runs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cargo fmt --check` and `cargo clippy --locked --all-targets -- -D warnings` on `$C` and the runtime `npm run typecheck` pass from the final state
- [ ] CHK-011 [P0] No gate prints a warning the baseline did not
- [ ] CHK-012 [P1] No moved file changes beyond its path and the paths it names
- [ ] CHK-013 [P1] Every move follows a row in `scratch/move-map.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` reads `Met`
- [ ] CHK-021 [P0] Every gate count in T010 equals the baseline
- [ ] CHK-022 [P1] `node .skilled/bin/bots.cjs ui` refuses `ui-not-built` on a bare tree with the crate folder and opens on the built crate
- [ ] CHK-023 [P1] A group whose gate failed was reverted, not patched
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each move row is `instance-only`: one path and every reference to it.
- [ ] CHK-FIX-002 [P0] Each move row carries the `rg -c -F` count of the files that name it.
- [ ] CHK-FIX-003 [P0] T012 proves no consumer still names an old path.
- [ ] CHK-FIX-004 [P0] N/A: no path, parser or redaction logic changes, only where files live.
- [ ] CHK-FIX-005 [P1] The move map's row count is stated in `scratch/tree-after.md`.
- [ ] CHK-FIX-006 [P1] N/A: no code or test reads new process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence names `BASE` and the final commit, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, token or state-root path enters a tracked file
- [ ] CHK-031 [P0] N/A: no input handling changes
- [ ] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] No code comment names a spec path or a task id
- [ ] CHK-042 [P2] The hub `README.md` names any moved folder it described
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files stay in `scratch/`
- [ ] CHK-051 [P1] `scratch/` keeps only the four records the spec names
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
