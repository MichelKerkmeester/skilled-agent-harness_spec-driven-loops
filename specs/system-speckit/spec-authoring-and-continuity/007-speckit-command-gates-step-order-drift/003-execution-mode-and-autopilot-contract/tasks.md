---
title: "Tasks: Phase 3: execution-mode-and-autopilot-contract"
description: "Ordered tasks that give auto, confirm and autopilot one contract in the plan, implement and complete workflows, their routers and their presentation files."
trigger_phrases:
  - "execution mode and autopilot contract tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: execution-mode-and-autopilot-contract

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

Every command runs from the repository root.
- `A` is `.skilled/commands/speckit/assets`.
- `C` is `specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/003-execution-mode-and-autopilot-contract`.
- `R` is `.skilled/skills/system-deep-loop/runtime`.
- `$A/speckit-{plan,implement,complete}.yaml` expands to the three workflows in bash and zsh.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm the decisions this phase builds on are recorded in section 10 (`$C/spec.md`). Verify: `rg -c '^- Decided 2026-11-14' $C/spec.md` prints 7.
- [ ] T002 Rebuild the stop-and-ask inventory from the live files after phases 1 and 2 (`$C/spec.md`). Verify: every key printed by `rg -n -e wait_for -e 'STOP - Ask' -e 'ask user' -e '\[Y/n/review\]' -e prompt_user -e 'user must approve' -e 'still pause' $A/speckit-{plan,implement,complete}.yaml` sits under a key named in the `spec.md` section 3 table.
- [ ] T003 Write the checker that walks each workflow and reports every ask with no `modes` map and no `applies_to: confirm` above it, and every `modes.autopilot` that says `ask` (`$C/scratch/check-mode-tags.py`). Verify: `python3 $C/scratch/check-mode-tags.py $A/speckit-{plan,implement,complete}.yaml` on the unchanged files names every key in the `spec.md` section 3 table, so the inventory is the checker's own acceptance test.
- [ ] T004 Capture the baseline: the Measured Behavior counts, the checker output and the contract test result (`$C/scratch/baseline.txt`). Verify: `rg -c 'Tests  4 passed' $C/scratch/baseline.txt` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Autopilot block (M1, M3)
- [ ] T005 Rewrite `unattended_autopilot` to the no-merge contract with `workspace_choice`, `"merged":false`, `bind_workspace` in place of `branch_first` and no `merge_on_clean` (`$A/speckit-complete.yaml`). Verify: `rg -n -e merge_on_clean -e '"merged":true' -e branch_first $A/speckit-complete.yaml` prints nothing.
- [ ] T006 Rewrite `step_0_autopilot_envelope` so the workspace comes from `workspace_choice`, a branch is made only by `git worktree add -b` and a missing choice ends with `uncertainty_blocked` before any write (`$A/speckit-complete.yaml`). Verify: `rg -n -e branch_first -e 'create or switch to an autopilot branch' $A/speckit-complete.yaml` prints nothing and `rg -c 'git worktree add -b' $A/speckit-complete.yaml` prints a count above 0.
- [ ] T007 Rename `step_13_5_autopilot_archive_verify_merge` to `step_13_5_autopilot_archive_verify` and remove its merge activity. Keep the four `failure_policy` lines byte for byte, because the contract test asserts `{ branch_preserved: true, merge: false, emit_terminal_result: true }` for each reason (`$A/speckit-complete.yaml`). Verify: `rg -n -e step_13_5_autopilot_archive_verify_merge -e 'Merge the autopilot branch' $A/speckit-complete.yaml` prints nothing and `rg -c 'branch_preserved: true, merge: false, emit_terminal_result: true' $A/speckit-complete.yaml` prints 4.
- [ ] T008 Copy the rewritten `unattended_autopilot` block into the plan workflow (`$A/speckit-plan.yaml`). Verify: `rg -c SPECKIT_AUTOPILOT_RESULT $A/speckit-plan.yaml` prints a count above 0.
- [ ] T009 Copy the rewritten `unattended_autopilot` block into the implement workflow (`$A/speckit-implement.yaml`). Verify: `rg -c SPECKIT_AUTOPILOT_RESULT $A/speckit-implement.yaml` prints a count above 0.
- [ ] T010 Point `execution_mode.rule` at the in-file `unattended_autopilot` block (`$A/speckit-plan.yaml`). Verify: `rg -c 'as the command router states' $A/speckit-plan.yaml` prints nothing.
- [ ] T011 Point `execution_mode.rule` at the in-file `unattended_autopilot` block (`$A/speckit-implement.yaml`). Verify: `rg -c 'as the command router states' $A/speckit-implement.yaml` prints nothing.
- [ ] T012 Point `execution_mode.rule` at the in-file `unattended_autopilot` block (`$A/speckit-complete.yaml`). Verify: `rg -c 'as the command router states' $A/speckit-complete.yaml` prints nothing.

### Task metadata (M1)
- [ ] T013 Add the unattended task metadata rule to `step_2_task_breakdown` (`$A/speckit-implement.yaml`). Verify: `rg -n 'touched-files' $A/speckit-implement.yaml` prints a line between the `step_2_task_breakdown:` and `step_3_analysis:` lines.
- [ ] T014 Move the unattended task metadata rule onto `step_7_task_breakdown` (`$A/speckit-complete.yaml`). Verify: `rg -n 'touched-files' $A/speckit-complete.yaml` prints a line between the `step_7_task_breakdown:` and `step_8_analysis:` lines.
- [ ] T015 Make the Unattended Task Metadata section name plan's task breakdown step as the step that writes the task rows (`.skilled/commands/speckit/plan.md`). Verify: `rg -n -i 'task breakdown' .skilled/commands/speckit/plan.md` prints a line. On 2026-11-14 it printed nothing.
- [ ] T057 Add the unattended task metadata rule to plan's `step_5_5_task_breakdown` (`$A/speckit-plan.yaml`). Verify: `python3 -c "import yaml,sys; print(sorted(k for k,v in yaml.safe_load(open(sys.argv[1]))['workflow'].items() if k.endswith('_task_breakdown') and 'touched-files' in yaml.safe_dump(v)))" $A/speckit-plan.yaml` prints one key. On 2026-11-14 it printed `[]`.

### Mode statement on every ask (M2)
- [ ] T016 Add a `modes` map to each plan key in the section 3 inventory (`$A/speckit-plan.yaml`). Verify: `python3 $C/scratch/check-mode-tags.py $A/speckit-plan.yaml` prints `untagged: 0` and `autopilot_ask: 0`.
- [ ] T017 Add a `modes` map to each implement key in the section 3 inventory (`$A/speckit-implement.yaml`). Verify: `python3 $C/scratch/check-mode-tags.py $A/speckit-implement.yaml` prints `untagged: 0` and `autopilot_ask: 0`.
- [ ] T018 Add a `modes` map to each complete key in the section 3 inventory, and drop the `still pause` sentence from `operating_mode.description` (`$A/speckit-complete.yaml`). Verify: `python3 $C/scratch/check-mode-tags.py $A/speckit-complete.yaml` prints `untagged: 0` and `autopilot_ask: 0`.

### Mode statement on every parallel check (X1)
- [ ] T058 Add a `modes` map to each `pre_phase_parallel_check` in `step_3_specification`, `step_8_analysis` and `step_10_development`, with `confirm` keeping the ask and `direct` under `auto` and `autopilot` (`$A/speckit-complete.yaml`). Verify: `python3 -c "import yaml,sys; print(sorted(k for k,v in yaml.safe_load(open(sys.argv[1]))['workflow'].items() if isinstance(v,dict) and 'pre_phase_parallel_check' in v and not (all(str(v['pre_phase_parallel_check'].get('modes',{}).get(m,'')).startswith('direct') for m in ('auto','autopilot')) and 'confirm' in v['pre_phase_parallel_check'].get('modes',{}))))" $A/speckit-complete.yaml` prints `[]`. On 2026-11-14 it printed `['step_10_development', 'step_3_specification', 'step_8_analysis']`.
- [ ] T059 Add the same `modes` map to `step_6_development.pre_phase_parallel_check`, the same edit T017 makes for its inventory row (`$A/speckit-implement.yaml`). Verify: the T058 command run on `$A/speckit-implement.yaml` prints `[]`. On 2026-11-14 it printed `['step_6_development']`.

### Rules split by mode (M4)
- [ ] T019 Move `get_user_approval_for_p1_deferrals` from `rules.ALWAYS` to a new `rules.CONFIRM_ONLY` list and `do_not_prompt_for_user_approval` to a new `rules.AUTO_AND_AUTOPILOT` list (`$A/speckit-plan.yaml`). Verify: `python3 -c "print(sorted(k for k,v in __import__('yaml').safe_load(open('$A/speckit-plan.yaml'))['rules'].items() if 'get_user_approval_for_p1_deferrals' in v or 'do_not_prompt_for_user_approval' in v))"` prints `['AUTO_AND_AUTOPILOT', 'CONFIRM_ONLY']`.
- [ ] T020 Move `get_user_approval_for_p1_deferrals` from `rules.ALWAYS` to a new `rules.CONFIRM_ONLY` list and `do_not_prompt_for_user_approval` to a new `rules.AUTO_AND_AUTOPILOT` list (`$A/speckit-implement.yaml`). Verify: `python3 -c "print(sorted(k for k,v in __import__('yaml').safe_load(open('$A/speckit-implement.yaml'))['rules'].items() if 'get_user_approval_for_p1_deferrals' in v or 'do_not_prompt_for_user_approval' in v))"` prints `['AUTO_AND_AUTOPILOT', 'CONFIRM_ONLY']`.
- [ ] T021 Move `get_user_approval_for_p1_deferrals` from `rules.ALWAYS` to a new `rules.CONFIRM_ONLY` list and `do_not_prompt_for_user_approval` to a new `rules.AUTO_AND_AUTOPILOT` list (`$A/speckit-complete.yaml`). Verify: `python3 -c "print(sorted(k for k,v in __import__('yaml').safe_load(open('$A/speckit-complete.yaml'))['rules'].items() if 'get_user_approval_for_p1_deferrals' in v or 'do_not_prompt_for_user_approval' in v))"` prints `['AUTO_AND_AUTOPILOT', 'CONFIRM_ONLY']`.
- [ ] T022 State the P1 split in `step_4_acceptance_criteria.verification_protocol.p1` (`$A/speckit-implement.yaml`). Verify: `rg -n 'p1:' $A/speckit-implement.yaml` prints a line that names confirm and `Unmet`.
- [ ] T023 State the P1 split in `step_5_acceptance_criteria` and `step_11_acceptance_verify` (`$A/speckit-complete.yaml`). Verify: `rg -n -e 'p1_handling' -e 'P1 items' $A/speckit-complete.yaml` prints lines that each name confirm and `Unmet`.

### Review and Modify loop (M7)
- [ ] T024 State the Review and Modify loop in `mode_overrides.confirm.checkpoint_behavior` (`$A/speckit-complete.yaml`). Verify: `rg -c 'same checkpoint again' $A/speckit-complete.yaml` prints a count above 0.
- [ ] T025 Copy the same `checkpoint_behavior` text (`$A/speckit-plan.yaml`). Verify: `rg -c 'same checkpoint again' $A/speckit-plan.yaml` prints a count above 0.
- [ ] T026 Copy the same `checkpoint_behavior` text (`$A/speckit-implement.yaml`). Verify: `rg -c 'same checkpoint again' $A/speckit-implement.yaml` prints a count above 0.

### Intake-only result (M6)
- [ ] T027 Add an Intake-Only Result block that names the trio, says planning steps 1 to 7 did not run and ends with `STATUS=OK PATH=[spec-folder-path]` (`$A/speckit-plan-presentation.txt`). Verify: `rg -n -e 'Intake-Only Result' -e 'Planning Steps 1-7 bypassed' $A/speckit-plan-presentation.txt` prints two lines.
- [ ] T028 Name the Intake-Only Result block from `step_0.6_intake_only_gate` (`$A/speckit-plan.yaml`). Verify: `rg -n 'Intake-Only Result' $A/speckit-plan.yaml` prints one line.

### Presentation text (M5, M2)
- [ ] T029 [P] Add autopilot to the execution mode question, the dashboard `Mode:` field, the startup rules, the fail-fast display and an Autopilot Result block (`$A/speckit-plan-presentation.txt`). Verify: `rg -c SPECKIT_AUTOPILOT_RESULT $A/speckit-plan-presentation.txt` prints a count above 0.
- [ ] T030 [P] Add autopilot to the execution mode question, the dashboard `Mode:` field, the startup rules, the fail-fast display and an Autopilot Result block (`$A/speckit-implement-presentation.txt`). Verify: `rg -c SPECKIT_AUTOPILOT_RESULT $A/speckit-implement-presentation.txt` prints a count above 0.
- [ ] T031 [P] Add autopilot to the execution mode question, the dashboard `Mode:` field, the startup rules, the fail-fast display and an Autopilot Result block (`$A/speckit-complete-presentation.txt`). Verify: `rg -c SPECKIT_AUTOPILOT_RESULT $A/speckit-complete-presentation.txt` prints a count above 0.
- [ ] T032 [P] Add a `Defaults taken:` line to the success and failure result blocks (`$A/speckit-plan-presentation.txt`). Verify: `rg -c 'Defaults taken:' $A/speckit-plan-presentation.txt` prints a count above 0.
- [ ] T033 [P] Add a `Defaults taken:` line to the success and failure result blocks (`$A/speckit-implement-presentation.txt`). Verify: `rg -c 'Defaults taken:' $A/speckit-implement-presentation.txt` prints a count above 0.
- [ ] T034 [P] Add a `Defaults taken:` line to the success and failure result blocks (`$A/speckit-complete-presentation.txt`). Verify: `rg -c 'Defaults taken:' $A/speckit-complete-presentation.txt` prints a count above 0.

### Routers (M1, M3)
- [ ] T035 Replace the branch-first and merge lines of the Unattended Result Contract with the workspace choice and no-merge rule (`.skilled/commands/speckit/complete.md`). Verify: `rg -n -e 'Branch before any' -e 'Merge only after' .skilled/commands/speckit/complete.md` prints nothing.
- [ ] T036 Make Unattended Termination name the operator's workspace and state that autopilot never merges on success either (`.skilled/commands/speckit/implement.md`). Verify: `rg -c 'workspace_choice' .skilled/commands/speckit/implement.md` prints a count above 0.
- [ ] T037 Make the autopilot execution target name the in-workflow `unattended_autopilot` block (`.skilled/commands/speckit/plan.md`). Verify: `rg -c 'unattended_autopilot' .skilled/commands/speckit/plan.md` prints a count above 0.

### Consumers outside the command folder (M3, approved 2026-11-14)
- [ ] T038 Replace `branch_first` and `merge_on_clean` in `AUTOPILOT_SEQUENCE` with the new contract and keep the plan-side metadata assertion (`$R/tests/unit/speckit-autopilot-contract.vitest.ts`). Verify: `rg -n -e merge_on_clean -e branch_first $R/tests/unit/speckit-autopilot-contract.vitest.ts` prints nothing.
- [ ] T039 [P] Rewrite the Branch Preservation paragraph and keep the Planning Metadata paragraph (`.skilled/skills/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md`). Verify: `rg -n -i 'merge only on clean' .skilled/skills/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md` prints nothing.
- [ ] T040 [P] Rewrite the scenario text that expects a clean-verification merge and keep step 3, which expects task metadata from `/speckit:plan` (`.skilled/skills/system-spec-kit/manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md`). Verify: `rg -n -i 'merge behavior' .skilled/skills/system-spec-kit/manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md` prints nothing. On 2026-11-14 it printed line 14.
- [ ] T041 [P] Rewrite the autopilot row to name the workspace choice and no merge (`.skilled/skills/system-spec-kit/README.md`). Verify: `rg -n 'operator chooses the workspace' .skilled/skills/system-spec-kit/README.md` prints one line.
- [ ] T042 [P] Replace the `autopilot merges git branches after clean verification` operation (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`). Verify: `rg -n 'merges git branches' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints nothing and `python3 -m json.tool .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T043 Check that the three workflows still parse (`$A/speckit-complete.yaml`). Verify: `python3 -c "[__import__('yaml').safe_load(open(f)) for f in __import__('sys').argv[1:]]" $A/speckit-{plan,implement,complete}.yaml` prints nothing and exits 0.
- [ ] T044 Run AC-001 (`$C/acceptance-criteria.md`). Verify: the PyYAML one-liner prints `1` and `rg -c 'as the command router states' $A/speckit-{plan,implement,complete}.yaml` prints nothing.
- [ ] T045 Run AC-002 (`$C/acceptance-criteria.md`). Verify: the AC-002 one-liner prints one `_task_breakdown` key for each of the three workflows.
- [ ] T046 Run AC-003 (`$C/acceptance-criteria.md`). Verify: `python3 $C/scratch/check-mode-tags.py $A/speckit-{plan,implement,complete}.yaml` prints `untagged: 0` and `autopilot_ask: 0`.
- [ ] T047 Run AC-004 (`$C/acceptance-criteria.md`). Verify: `rg -n -e merge_on_clean -e '"merged":true' -e 'Merge only after' -e step_13_5_autopilot_archive_verify_merge .skilled/commands/speckit` prints nothing.
- [ ] T048 Run AC-005 (`$C/acceptance-criteria.md`). Verify: `rg -n -e branch_first -e 'Branch before any' .skilled/commands/speckit` prints nothing and `rg -c 'workspace_choice' $A/speckit-{plan,implement,complete}.yaml` prints a count above 0 for each file.
- [ ] T049 Run AC-006 (`$R/tests/unit/speckit-autopilot-contract.vitest.ts`). Verify: `npx vitest run tests/unit/speckit-autopilot-contract.vitest.ts` from `$R` exits 0 with every test passed.
- [ ] T050 Run AC-007 (`$C/acceptance-criteria.md`). Verify: the PyYAML rules one-liner prints `['CONFIRM_ONLY', 'CONFIRM_ONLY', 'CONFIRM_ONLY']` for the approval rule and `['AUTO_AND_AUTOPILOT', 'AUTO_AND_AUTOPILOT', 'AUTO_AND_AUTOPILOT']` for the no-prompt rule.
- [ ] T051 Run AC-008 (`$C/acceptance-criteria.md`). Verify: `rg -n 'Planning Steps 1-7 bypassed' $A/speckit-plan-presentation.txt $A/speckit-plan.yaml` prints one line per file.
- [ ] T052 Run AC-009 and AC-011 (`$C/acceptance-criteria.md`). Verify: `rg --count --include-zero -e SPECKIT_AUTOPILOT_RESULT -e 'Defaults taken:' $A/speckit-{plan,implement,complete}-presentation.txt` prints a count above 0 for each file.
- [ ] T053 Run AC-010 (`$C/acceptance-criteria.md`). Verify: the `checkpoint_behavior` one-liner prints `1`.
- [ ] T060 Run AC-012 (`$C/acceptance-criteria.md`). Verify: the AC-012 one-liner prints `speckit-implement.yaml []` and `speckit-complete.yaml []`.
- [ ] T054 Rerun the Measured Behavior command and compare it to the baseline (`$C/scratch/baseline.txt`). Verify: all six rows print a count above 0.
- [ ] T055 Set each acceptance row to `Met` with its observed output (`$C/acceptance-criteria.md`). Verify: `rg -c '\| Unmet \|' $C/acceptance-criteria.md` prints nothing.
- [ ] T056 Validate the phase folder (`$C/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $C --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `python3 $C/scratch/check-mode-tags.py $A/speckit-{plan,implement,complete}.yaml` prints `untagged: 0` and `autopilot_ask: 0`, and the autopilot contract test exits 0
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

A task blocked on a phase that has not closed is marked `[B]` with that phase named, and the phase cannot close while any `[B]` line remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' $C/spec.md` prints 12
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 4' $C/plan.md` prints one line
- [ ] CHK-003 [P1] The decisions are recorded: `rg -c '^- Decided 2026-11-14' $C/spec.md` prints 7
- [ ] CHK-004 [P0] The baseline is captured: `rg -c 'Tests  4 passed' $C/scratch/baseline.txt` prints 1
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] The three workflows load with `yaml.safe_load`: the T043 command prints nothing and exits 0
- [ ] CHK-011 [P0] `command-contract.json` is valid JSON: `python3 -m json.tool` on it exits 0
- [ ] CHK-012 [P1] The copied blocks are identical: the AC-001 and AC-010 one-liners each print `1`
- [ ] CHK-013 [P1] No comment in a changed file carries a phase or finding id: `rg -n '# .*\b(M[1-7]|phase 3)\b' $A/speckit-{plan,implement,complete}.yaml` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`: `rg -c '\| Unmet \|' $C/acceptance-criteria.md` prints nothing
- [ ] CHK-021 [P0] The checker prints `untagged: 0` and `autopilot_ask: 0` over the three workflows
- [ ] CHK-022 [P0] The autopilot contract test exits 0 from `$R`
- [ ] CHK-023 [P1] Edge case: the complete workflow says a run with no bound `workspace_choice` ends with `uncertainty_blocked` before any write: `rg -n 'workspace_choice' $A/speckit-complete.yaml` prints a line that names `uncertainty_blocked`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Each finding has a class. M1, M2, M4 and M7 are `class-of-bug` across three workflows. M3 is `cross-consumer`. M5 is `class-of-bug` across three presentation files. M6 is `instance-only`. X1 is `class-of-bug` across implement and complete.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: the T002 rg prints only keys named in the `spec.md` section 3 table.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: `rg -n --glob '!specs/**' -e SPECKIT_AUTOPILOT_RESULT -e unattended_autopilot -e merge_on_clean .` prints only files named in the `plan.md` Affected Surfaces table.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction code changes. The git safety rule is checked by NFR-S01 in `spec.md`.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: mode by command, nine rows, in `plan.md` Affected Surfaces.
- [ ] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state. The checker reads only the files it is given.
- [ ] CHK-FIX-007 [P1] Evidence in `implementation-summary.md` names the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No workflow tells autopilot to run `git branch`, `git checkout -b`, `git switch -c`, `git merge` or `git push`: `rg -n 'git (branch|checkout -b|switch -c|merge|push)' $A/speckit-{plan,implement,complete}.yaml` prints only lines that forbid them
- [ ] CHK-031 [P0] No credential or token is added to any changed file: `git diff -U0 | rg -i -e 'token' -e 'secret' -e 'password'` prints nothing
- [ ] CHK-032 [P1] The only branch-creating command named is `git worktree add -b`: `rg -c 'git worktree add -b' $A/speckit-{plan,implement,complete}.yaml` prints a count above 0 for each file
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same checker path: `rg -l 'scratch/check-mode-tags.py' $C/spec.md $C/plan.md $C/tasks.md` lists all three
- [ ] CHK-041 [P1] The three routers and their workflows agree on no merge: `rg -n -i 'merge' .skilled/commands/speckit/{plan,implement,complete}.md` prints only lines that say autopilot does not merge
- [ ] CHK-042 [P2] The README is left to phase 8: `git diff --stat .skilled/commands/speckit/README.txt` prints nothing
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The checker and the baseline live only under `$C/scratch/`: `ls $C/scratch` lists `check-mode-tags.py` and `baseline.txt`
- [ ] CHK-051 [P1] No new file appears under `.skilled/commands/speckit/`: `git status --short .skilled/commands/speckit` prints only `M` lines
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
