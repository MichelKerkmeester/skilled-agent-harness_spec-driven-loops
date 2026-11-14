---
title: "Tasks: Phase 1: parent-purpose-scaffold"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "parent purpose scaffold tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: parent-purpose-scaffold

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

Run every command from the worktree root unless a task says otherwise. Shell variables:
- `K=.skilled/skills/system-spec-kit`
- `T=$K/templates/packet-types/phase-parent.spec.md.tmpl`
- `C=$K/runtime/cli/spec/create.sh`
- `S=$K/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`
- `G=$K/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`
- `VT="npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts runtime/cli/tests/template-version-parity.vitest.ts runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts runtime/cli/tests/placeholder-token-gate.vitest.ts --config vitest.config.ts"`, run from `$K`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Run the baseline tests (`$K/runtime/cli/tests/`). Verify: `cd $K && $VT` prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`. Evidence: Observed in gates-371-baseline.txt before any edit: `Test Files  4 passed (4)` and `Tests  99 passed (99)`.
- [x] T002 [P] Confirm the template text the edits replace (`$T`). Verify: `sed -n '28p;66p;69p' $T` prints the `v2.2` stamp line and the two `[One-paragraph ...]` lines quoted in `plan.md` steps 1 to 3. Evidence: `git diff` shows the `v2.2` stamp and both `[One-paragraph ...]` hints replaced in place in the template. The pre-edit `sed` cannot be rerun after the build.
- [x] T003 [P] Confirm the generic-text lines in the generator (`$C`). Verify: `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' $C` prints 4 and `bash -n $C` exits 0. Evidence: `git diff` shows exactly four lines deleted from `create.sh`: the two definitions and the two substitutions. The pre-edit count cannot be rerun after the build.
- [x] T017 [P] Confirm the `recent_action` default that steps 9 and 10 replace (`$T`, `$S`). Verify: `grep -c '^    recent_action: "Initialize phase-parent continuity block"$' $T $S` prints `:1` for each file. Evidence: `git diff` shows the old `recent_action: "Initialize phase-parent continuity block"` line replaced once in the template and once in the snapshot.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Apply `plan.md` step 1, the template stamp (`$T`). Verify: `grep -c 'phase-parent-spec | v2.3' $T` prints 1. Evidence: `grep -c` printed 1.
- [x] T005 Apply `plan.md` step 2, the Problem Statement token (`$T`). Verify: `sed -n '66p' $T` prints `[YOUR_VALUE_HERE: what breaks today and for whom, in one paragraph]`. Evidence: `sed -n '66p'` printed `[YOUR_VALUE_HERE: what breaks today and for whom, in one paragraph]`.
- [x] T006 Apply `plan.md` step 3, the Purpose token (`$T`). Verify: `sed -n '69p' $T` prints `[YOUR_VALUE_HERE: one sentence on the outcome every child phase serves]`. Evidence: `sed -n '69p'` printed `[YOUR_VALUE_HERE: one sentence on the outcome every child phase serves]`.
- [x] T007 Apply `plan.md` step 4, the manifest version (`$K/templates/spec-kit-docs.json`). Verify: `grep -c '"phase-parent.spec.md.tmpl": "v2.3",' $K/templates/spec-kit-docs.json` prints 1. Evidence: `grep -c` printed 1.
- [x] T008 Apply `plan.md` step 5, delete the two generic-text definitions (`$C`). Verify: `rg -c '_phase_parent_problem=|_phase_parent_purpose=' $C` prints nothing and exits 1. Evidence: `rg -c` printed nothing and exited 1.
- [x] T009 Apply `plan.md` step 6, delete the two generic-text substitutions (`$C`). Verify: `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' $C` exits 1 and `bash -n $C` exits 0. Evidence: `rg -c` exited 1 and `bash -n` exited 0.
- [x] T010 Apply `plan.md` step 7, the three snapshot lines (`$S`). Verify: `grep -c 'phase-parent-spec | v2.3\|YOUR_VALUE_HERE: what breaks today and for whom\|YOUR_VALUE_HERE: one sentence on the outcome every child phase serves' $S` prints 3. Evidence: `grep -c` printed 3.
- [x] T011 Apply `plan.md` step 8, the Purpose assertion (`$G`). Verify: `grep -c 'the new phase parent does not ask for its purpose' $G` prints 1. Evidence: `grep -c` printed 1.
- [x] T018 Apply `plan.md` step 9, the template `recent_action` default (`$T`). Verify: `grep -c '^    recent_action: "Phase parent created, child phases own continuity"$' $T` prints 1 and `grep -c 'Initialize phase-parent continuity block' $T` prints 0. Evidence: `grep -c` printed 1 for the new default and 0 for the old one.
- [x] T019 Apply `plan.md` step 10, the snapshot `recent_action` line (`$S`). Verify: `grep -c '^    recent_action: "Phase parent created, child phases own continuity"$' $S` prints 1 and `grep -c 'Initialize phase-parent continuity block' $S` prints 0. Evidence: `grep -c` printed 1 for the new default and 0 for the old one.
- [x] T020 Apply `plan.md` step 11, the parent-default assertion, after T011 (`$G`). Verify: `grep -c 'the parent default reads as a scaffold placeholder' $G` prints 1. Evidence: `grep -c` printed 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T012 Rerun the four test files, covering REQ-005 (`$K/runtime/cli/tests/`). Verify: `cd $K && $VT` prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`. Evidence: Observed in gates-371-final.txt: `Test Files  4 passed (4)` and `Tests  99 passed (99)`, the same as the baseline.
- [ ] T013 Scaffold a fresh sandbox phase parent as in `spec.md` Measured Behavior, covering REQ-001 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: `grep -c '^\[YOUR_VALUE_HERE: ' specs/001-purpose-probe/spec.md` prints 2. Open: the sandbox rerun after the build was not done. The planning agent ran this case before the build and nobody reran it, so it stays unticked.
- [ ] T014 Validate the untouched sandbox parent, covering REQ-002 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/001-purpose-probe --strict --no-recursive` prints `! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet` and `Errors: 0`. Open: the sandbox rerun after the build was not done. The planning agent ran this case before the build and nobody reran it, so it stays unticked.
- [ ] T015 Set the sandbox parent's Status cell to `In Progress` and validate again, covering REQ-003 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: the same command prints `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exits 2. Open: the sandbox rerun after the build was not done. The planning agent ran this case before the build and nobody reran it, so it stays unticked.
- [ ] T021 Reset the sandbox parent to its untouched scaffold, set Status to `Complete`, covering REQ-007 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/001-purpose-probe --strict --no-recursive` prints `x SCAFFOLD_NEVER_TOUCHED: Found 1 scaffold-signature marker(s) in Complete spec folder` with `spec.md:10: packet_pointer starts with "scaffold/"`, prints `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exits 2. Open: the sandbox rerun after the build was not done. The planning agent ran this case before the build and nobody reran it, so it stays unticked.
- [ ] T022 Reset the sandbox parent, fill the purpose with the `perl` command in `plan.md` section 5, set Status to `In Progress` and run `node $K/runtime/cli/spec/repair-derived.cjs --folder specs/001-purpose-probe --apply`, covering REQ-006 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: the T014 command prints `Summary: Errors: 0` and `RESULT: PASSED` and exits 0. Open: the sandbox rerun after the build was not done. The planning agent ran this case before the build and nobody reran it, so it stays unticked.
- [ ] T023 Repeat T022 with Status `Complete`, covering REQ-006 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: the T014 command prints `+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec`, `Summary: Errors: 0` and `RESULT: PASSED` and exits 0. Open: the sandbox rerun after the build was not done. The planning agent ran this case before the build and nobody reran it, so it stays unticked.
- [x] T016 Confirm no file outside the five named ones changed, covering REQ-004 (worktree root). Verify: `git diff --stat` lists exactly the five files in `spec.md` section 3, and `rm -rf <sandbox>` leaves no sandbox behind. Evidence: `git diff --stat` over the five named files lists exactly those five files (17 insertions, 13 deletions). `git status` shows no sandbox inside the worktree.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The sandbox parent warned in Draft with `Errors: 0` and failed with exit 2 at `In Progress`
- [ ] The sandbox parent with a filled purpose passed at `In Progress` and at `Complete`, and the untouched one still failed at `Complete`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 4 for the literal edits and section 5 for the test commands
- **Parent**: See `../spec.md` and `../research/research.md` sections 4, 7 and 10
<!-- /ANCHOR:cross-refs -->

---
