---
title: "Tasks: Phase 2: required-artifact-gates"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "required artifact gates tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: required-artifact-gates

<!-- SPECKIT_LEVEL: 2 -->

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

Run every command from `.skilled/commands/speckit/assets/` unless the task names another folder. `Q` is `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f'`, which prints a file's `quality_gates` block. `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`, run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm phase 1 is Complete (`../001-step-order-acceptance-after-development/acceptance-criteria.md`). Verify: `rg -c '\| Unmet \|' ../001-step-order-acceptance-after-development/acceptance-criteria.md` prints nothing.
- [ ] T002 Record the contract test baseline (`T`). Verify: `node T` prints `Result: passed=N failed=0`, and N is written into this task line.
- [ ] T003 List every gate check and the step keys that exist after phase 1 (`speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`). Verify: `Q speckit-*.yaml | rg 'id:'` and `rg -n '^  step_' speckit-*.yaml` print the inventory, and it is pasted into `scratch/gate-inventory.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Rewrite both plan gates as required checks with `pass_when`, `from:` and `criteria:` on each check, one `exists_rule`, `tasks_exists` read from `step_5_5_task_breakdown`, a non-empty `feature_description` rule and a `spec_path_valid` rule that exempts `:with-phases` (`speckit-plan.yaml`). Verify: `Q speckit-plan.yaml | rg 'points:|threshold:|\{score\}' | wc -l` prints 0, `Q speckit-plan.yaml | rg -c 'pass_when:'` prints 2, `Q speckit-plan.yaml | rg tasks_exists | rg -c 'from: step_5_5_task_breakdown'` prints 1 and `sed -n '/^  pre_execution:/,/^  [a-z_]*:$/p' speckit-plan.yaml | rg spec_path_valid | rg -c 'with-phases'` prints 1. Today the first command prints 10 and the last two print nothing.
- [ ] T005 Rewrite both implement gates as required checks with `from:` and `criteria:`, one `exists_rule`, `tasks_exists` added to `pre_implementation` and `checklist_verified` kept out of it after phase 1 removed it (`speckit-implement.yaml`). Verify: `Q speckit-implement.yaml | rg 'points:|threshold:|\{score\}' | wc -l` prints 0, `sed -n '/^  pre_implementation:/,/^  [a-z_]*:$/p' speckit-implement.yaml | rg -c 'tasks_exists'` prints 1 and the same range piped to `rg -c checklist_verified` prints nothing and exits 1.
- [ ] T006 Drop `--require-tasks` from the prerequisite line of `step_1_review_plan_and_spec` (`speckit-implement.yaml`). Verify: `sed -n '/^  step_1_review_plan_and_spec:/,/^  step_[0-9]/p' speckit-implement.yaml | rg require-tasks | wc -l` prints 0.
- [ ] T007 Add the four severities and an `on_fail` branch with the return targets and the three-round stop to `step_3_analysis` (`speckit-implement.yaml`). Verify: `sed -n '/^  step_3_analysis:/,/^  step_[0-9]/p' speckit-implement.yaml | rg -c 'on_fail:'` prints 1 and the same range piped to `rg -c CRITICAL` prints a count above 0.
- [ ] T008 Rewrite the three complete gates as required checks with `from:` and `criteria:`, one `exists_rule`, a non-empty `feature_description` rule, a `spec_path_valid` rule that exempts `:with-phases` and no `review_approval` or `checklist_verified` in `planning_gate` (`speckit-complete.yaml`). Verify: `Q speckit-complete.yaml | rg 'points:|threshold:|\{score\}' | wc -l` prints 0, `Q speckit-complete.yaml | rg -c 'pass_when:'` prints 3 and `sed -n '/^  pre_execution:/,/^  [a-z_]*:$/p' speckit-complete.yaml | rg spec_path_valid | rg -c 'with-phases'` prints 1. Today the last command prints nothing.
- [ ] T009 Point `workflow_enforcement.phase_gate` and the step 7 `phase_gate_checkpoint` at `quality_gates.planning_gate` (`speckit-complete.yaml`). Verify: `rg -c 'quality_gates.planning_gate' speckit-complete.yaml` prints at least 2.
- [ ] T010 Add an `on_fail` branch with the return targets and the three-round stop to `step_8_analysis` (`speckit-complete.yaml`). Verify: `sed -n '/^  step_8_analysis:/,/^  step_[0-9]/p' speckit-complete.yaml | rg -c 'on_fail:'` prints 1.
- [ ] T016 Make `step_2_task_breakdown` validate an existing `tasks.md` and write one only when the file is missing or fails `exists_rule` (`speckit-implement.yaml`). Verify: `sed -n '/^  step_2_task_breakdown:/,/^  step_3_analysis:/p' speckit-implement.yaml | rg -c 'exists_rule'` prints at least 1, and the same range piped to `rg -c 'missing or'` prints at least 1. Today both print nothing and exit 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T011 Check that every `from:` key names a step in its own file (`speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`). Verify: for each file, `Q <file> | rg -o 'from: [a-z0-9_.]+' | sort -u` lists keys, and `rg -c '^  <key>:' <file>` prints 1 for each key other than `invocation`.
- [ ] T012 Check that no gate check lacks a producer or a rule (`speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`). Verify: `Q <file> | rg 'id:' | rg -v 'from:' | wc -l` and the same with `criteria:` print 0 for each file.
- [ ] T013 Run every Verification command in `acceptance-criteria.md` and record its output in the row (`acceptance-criteria.md`). Verify: `rg -c '\| Unmet \|' acceptance-criteria.md` prints nothing.
- [ ] T014 Rerun the workflow contract test (`T`). Verify: `node T` prints `failed=0` with a pass count no lower than the T002 baseline.
- [ ] T015 Validate this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `acceptance-criteria.md` has no `Unmet` row and the Measured Behavior command in `spec.md` prints no `threshold:` or `points:` line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked by phase 1 state is marked `[B]` with the step key it waits on. A `[B]` task blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Phase 1 is Complete: `rg -c '\| Unmet \|' ../001-step-order-acceptance-after-development/acceptance-criteria.md` prints nothing.
- [ ] CHK-002 [P0] The gate inventory exists: `ls scratch/gate-inventory.txt` prints the path.
- [ ] CHK-003 [P1] The contract test baseline is recorded on the T002 line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] The three workflow files still parse: `node T` prints `failed=0`.
- [ ] CHK-011 [P0] No gate keeps a score: `Q speckit-*.yaml | rg 'points:|threshold:|\{score\}' | wc -l` prints 0.
- [ ] CHK-012 [P1] Every gate `on_fail` names the failed checks: `Q speckit-*.yaml | rg 'on_fail:' | rg -v 'missing_checks|failed_checks' | wc -l` prints 0.
- [ ] CHK-013 [P1] Every check uses the inline form the file already uses: `Q speckit-*.yaml | rg 'id:' | rg -v '^ +- \{ id:' | wc -l` prints 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] Each `acceptance-criteria.md` row is `Met` with its command output recorded.
- [ ] CHK-021 [P0] The empty-input edge case holds: plan's `pre_execution` range piped to `rg 'feature_description' | rg -c 'non-empty'` prints 1.
- [ ] CHK-022 [P1] The scaffold edge case holds: `rg -c 'YOUR_VALUE_HERE:' <a fresh Level 2 scaffold>/tasks.md` prints a count above 0, so `exists_rule` fails it.
- [ ] CHK-023 [P1] The analysis failure path holds: both analysis `on_fail` branches name a stop after the third round.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Each finding has a class: G1, G2, G4 and G7 are `class-of-bug` (scored gates), G3 and G5 are `cross-consumer` (scaffold and prerequisite script) and G6 is `instance-only` across two steps.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete: `scratch/gate-inventory.txt` lists every gate in the three workflows.
- [ ] CHK-FIX-003 [P0] The consumer inventory is complete: `rg -n 'quality_gates|planning_gate|pre_implementation' .skilled --glob '*.{ts,js,cjs,mjs,sh,py}' -g '!**/node_modules/**'` prints nothing.
- [ ] CHK-FIX-004 [P0] N/A. The change touches no security, path, parser or redaction code.
- [ ] CHK-FIX-005 [P1] The matrix is three workflows by seven gates by two rules, and every cell is covered by an `acceptance-criteria.md` row.
- [ ] CHK-FIX-006 [P1] N/A. No test reads process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence in `acceptance-criteria.md` names the commit that holds the change.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] N/A. The change edits workflow text and reads no credential, input or secret.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md` and `acceptance-criteria.md` name the same REQ ids: `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same list.
- [ ] CHK-041 [P1] No comment in the three workflow files names a phase, finding or packet id: `rg -n '#.*\b(G[1-7]|phase 2|002-required)' speckit-plan.yaml speckit-implement.yaml speckit-complete.yaml` prints nothing.
- [ ] CHK-042 [P2] The router `plan.md`, `implement.md` and `complete.md` state no gate score: `rg -n -i 'threshold|/100' ../plan.md ../implement.md ../complete.md` prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The gate inventory lives under this folder's `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` and `gate-inventory.txt` before close: `ls scratch` prints those names.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



