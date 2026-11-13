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

- [ ] T001 Run the baseline tests (`$K/runtime/cli/tests/`). Verify: `cd $K && $VT` prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`.
- [ ] T002 [P] Confirm the template text the edits replace (`$T`). Verify: `sed -n '28p;66p;69p' $T` prints the `v2.2` stamp line and the two `[One-paragraph ...]` lines quoted in `plan.md` steps 1 to 3.
- [ ] T003 [P] Confirm the generic-text lines in the generator (`$C`). Verify: `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' $C` prints 4 and `bash -n $C` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Apply `plan.md` step 1, the template stamp (`$T`). Verify: `grep -c 'phase-parent-spec | v2.3' $T` prints 1.
- [ ] T005 Apply `plan.md` step 2, the Problem Statement token (`$T`). Verify: `sed -n '66p' $T` prints `[YOUR_VALUE_HERE: what breaks today and for whom, in one paragraph]`.
- [ ] T006 Apply `plan.md` step 3, the Purpose token (`$T`). Verify: `sed -n '69p' $T` prints `[YOUR_VALUE_HERE: one sentence on the outcome every child phase serves]`.
- [ ] T007 Apply `plan.md` step 4, the manifest version (`$K/templates/spec-kit-docs.json`). Verify: `grep -c '"phase-parent.spec.md.tmpl": "v2.3",' $K/templates/spec-kit-docs.json` prints 1.
- [ ] T008 Apply `plan.md` step 5, delete the two generic-text definitions (`$C`). Verify: `rg -c '_phase_parent_problem=|_phase_parent_purpose=' $C` prints nothing and exits 1.
- [ ] T009 Apply `plan.md` step 6, delete the two generic-text substitutions (`$C`). Verify: `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' $C` exits 1 and `bash -n $C` exits 0.
- [ ] T010 Apply `plan.md` step 7, the three snapshot lines (`$S`). Verify: `grep -c 'phase-parent-spec | v2.3\|YOUR_VALUE_HERE: what breaks today and for whom\|YOUR_VALUE_HERE: one sentence on the outcome every child phase serves' $S` prints 3.
- [ ] T011 Apply `plan.md` step 8, the Purpose assertion (`$G`). Verify: `grep -c 'the new phase parent does not ask for its purpose' $G` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T012 Rerun the four test files, covering REQ-005 (`$K/runtime/cli/tests/`). Verify: `cd $K && $VT` prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`.
- [ ] T013 Scaffold a fresh sandbox phase parent as in `spec.md` Measured Behavior, covering REQ-001 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: `grep -c '^\[YOUR_VALUE_HERE: ' specs/001-purpose-probe/spec.md` prints 2.
- [ ] T014 Validate the untouched sandbox parent, covering REQ-002 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/001-purpose-probe --strict --no-recursive` prints `! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet` and `Errors: 0`.
- [ ] T015 Set the sandbox parent's Status cell to `In Progress` and validate again, covering REQ-003 (`<sandbox>/specs/001-purpose-probe/spec.md`). Verify: the same command prints `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exits 2.
- [ ] T016 Confirm no file outside the five named ones changed, covering REQ-004 (worktree root). Verify: `git diff --stat` lists exactly the five files in `spec.md` section 3, and `rm -rf <sandbox>` leaves no sandbox behind.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The sandbox parent warned in Draft with `Errors: 0` and failed with exit 2 at `In Progress`
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
