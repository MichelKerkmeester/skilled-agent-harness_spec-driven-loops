---
title: "Tasks: Phase 1: step-order-acceptance-after-development"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "step order acceptance after development tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: step-order-acceptance-after-development

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

Run every command from the repository root with these shell variables set:

- `I` is `.skilled/commands/speckit/assets/speckit-implement.yaml`.
- `C` is `.skilled/commands/speckit/assets/speckit-complete.yaml`.
- `P` is `.skilled/commands/speckit/assets/speckit-plan.yaml`.
- `F` is whichever of the three files a task names.
- `S` is `specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/001-step-order-acceptance-after-development/scratch/step-keys-before.txt`.

The checkpoints check is `comm -23 <(sed -n 's/^checkpoints: \[\(.*\)\]/\1/p' "$F" | tr ',' '\n' | tr -d ' ' | sort) <(rg -o '^  (step_[0-9._]+[a-z_]+):' -r '$1' "$F" | sort)`. It prints every `checkpoints:` entry that names no step key.

The parse check is `NODE_PATH=.skilled/node_modules node -e 'process.argv.slice(1).forEach(f => console.log(f.split("/").pop(), require("yaml").parseDocument(require("fs").readFileSync(f, "utf8")).errors.length))' "$I" "$C" "$P"`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the implement row-ordering baseline (`speckit-implement.yaml`). Verify: `awk '/^  step_6_development:/{d=NR} /to Met/{print (d?"after":"before"), NR}' "$I"` prints `before 543`.
- [x] T002 [P] Record the complete row-ordering baseline (`speckit-complete.yaml`). Verify: `awk '/^  step_10_development:/{d=NR} /to Met|set Met|Met or Waived/{print (d?"after":"before"), NR}' "$C"` prints `before 853`, `before 881` and `after 1211`.
- [x] T003 [P] Record the parse baseline for the three workflow files (`.skilled/commands/speckit/assets/`). Verify: the parse check prints `speckit-implement.yaml 0`, `speckit-complete.yaml 0` and `speckit-plan.yaml 0`.
- [x] T004 [P] Save the sorted step-key list of the three workflows before any edit (`scratch/step-keys-before.txt`). Verify: `rg -o '^  (step_[0-9._]+[a-z_]+):' -r '$1' "$I" "$C" "$P" | sort > "$S"` exits 0 and `wc -l < "$S"` prints 42.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Implement workflow
- [x] T005 Rewrite `step_4_acceptance_criteria` so it writes one Unmet row per spec requirement when `acceptance-criteria.md` holds only the scaffold row, confirms the rows otherwise and sets no row Met. Its `child_dispatch` defaults to Start Implementation when every requirement has a row (`speckit-implement.yaml`). Verify: `sed -n '/^  step_4_acceptance_criteria:/,/^  step_5_implementation_check:/p' "$I" | rg -n 'to Met|Met or Waived|mark \[x\]|acceptance_verified_and_marked|p0_status|checklist_status|Checklists verified'` prints nothing and exits 1. The same range piped to `rg -c 'scaffold row'` prints at least 1.
- [x] T006 Add `step_6_7_acceptance_verify` after `step_6_5_checkpoint_development`, modeled on complete's `step_11_acceptance_verify` (`speckit-implement.yaml`). Verify: `rg -n '^  step_6_[57]_' "$I"` prints `step_6_5_checkpoint_development` then `step_6_7_acceptance_verify`, and the T001 `awk` prints at least one `after` line and no `before` line.
- [x] T007 Add `step_6_7_acceptance_verify` to the `checkpoints:` list (`speckit-implement.yaml`). Verify: the checkpoints check with `F` set to `$I` prints nothing, and `rg -n '^checkpoints:.*step_6_7_acceptance_verify' "$I"` prints one line.
- [x] T008 Point `checkpoint_options.code_review` and the step 6 `child_dispatch` at Step 6.7 (`speckit-implement.yaml`). Verify: `rg -n 'continue to Step 7 completion|Approve Code reaches Step 7' "$I"` prints nothing, and `rg -n 'Step 6\.7' "$I"` prints the `code_review` line and the step 6 `child_dispatch` line.
- [x] T009 Remove `checklist_verified` from `quality_gates.pre_implementation` (`speckit-implement.yaml`). Verify: `sed -n '/^  pre_implementation:/,/^  post_implementation:/p' "$I" | rg -c checklist_verified` prints nothing and exits 1, and `sed -n '/^  post_implementation:/,/^circuit_breaker:/p' "$I" | rg -c checklist_verified` prints 1.
- [x] T010 Move the design-choice check and its stop message from `step_5_implementation_check` into `step_1_review_plan_and_spec` (`speckit-implement.yaml`). Verify: `awk '/^  step_2_task_breakdown:/{t=NR} /design choice/{print (t?"after":"before"), NR}' "$I"` prints no `after` line, and `sed -n '/^  step_1_review_plan_and_spec:/,/^  step_2_task_breakdown:/p' "$I" | rg -c 'design choice'` prints at least 1.
- [x] T011 Change the coding-start rule to name Step 6 at both places (`speckit-implement.yaml`). Verify: `rg -n 'jump to coding before Step' "$I"` prints two lines and both end in `before Step 6."`.

### Complete workflow
- [x] T012 Make `step_5_acceptance_criteria` author-only: drop the set-Met and checklist activities, the `closure_status` and `p0_status` outputs, the `acceptance_verified_and_marked` validation and the "Checklist verified" question, and default its `child_dispatch` to Proceed when every requirement has a row (`speckit-complete.yaml`). Verify: `sed -n '/^  step_5_acceptance_criteria:/,/^  step_6_planning:/p' "$C" | rg -n 'set Met|Met or Waived|acceptance_verified_and_marked|closure_status|p0_status|Checklist verified'` prints nothing and exits 1.
- [x] T013 Reword the `step_9_implementation_check` row activity to "Confirm each requirement has an acceptance-criteria row" (`speckit-complete.yaml`). Verify: `sed -n '/^  step_9_implementation_check:/,/^  step_9_5_preflight:/p' "$C" | rg -n 'Check acceptance-criteria.md rows'` prints nothing. The same range piped to `rg -c 'Confirm each requirement has an acceptance-criteria row'` prints 1. The T002 `awk` prints no `before` line.
- [x] T014 Remove `checklist_verified_L2_plus` from `request_analysis_framework.pre_change_validation` (`speckit-complete.yaml`). Verify: `rg -n checklist_verified_L2_plus "$C"` prints nothing and exits 1.
- [x] T015 Change the `quality_gates.post_execution` location to `Between Step 13 and Step 13.5` (`speckit-complete.yaml`). Verify: `sed -n '/^  post_execution:/,/^circuit_breaker:/p' "$C" | rg -n 'location:'` prints one line reading `location: "Between Step 13 and Step 13.5"`.
- [x] T016 Move `step_12_5_autopilot_archive_verify_merge` after `step_13_save_context` and rename it `step_13_5_autopilot_archive_verify_merge` (`speckit-complete.yaml`). Verify: `rg -n '^  step_1[2-4][._0-9]*[a-z_]*:' "$C"` prints `step_12_completion`, `step_13_save_context`, `step_13_5_autopilot_archive_verify_merge` and `step_14_handover_check` in that order, and `rg -n step_12_5 "$C"` prints nothing.
- [x] T017 Change the coding-start rule to name Step 10 (`speckit-complete.yaml`). Verify: `rg -n 'jump to code before Step' "$C"` prints one line ending in `before Step 10.`.

### Plan workflow
- [x] T018 Change the `quality_gates.post_execution` location from `After Step 7` to `After Step 6` (`speckit-plan.yaml`). Verify: `rg -n 'location:' "$P"` prints `spec-folder root`, `Before Step 1`, `After Step 6` and `After Step 5` and no `After Step 7`.

### Folder creation and phase decomposition
- [x] T019 Remove folder creation from `step_1_request_analysis` and `step_3_specification`, and make `step_0.5_intake_branch` skip its Emit phase under `:with-phases` (`speckit-plan.yaml`). Verify: `sed -n '/^  step_1_request_analysis:/,/^  step_4_clarification:/p' "$P" | rg -n 'create\.sh|Verify/create|auto-create'` prints nothing, and `sed -n '/^  step_0.5_intake_branch:/,/^  step_0.6_intake_only_gate:/p' "$P" | rg -c 'with-phases'` prints at least 1.
- [x] T020 [P] Make the same single-creator change in complete (`speckit-complete.yaml`). Verify: `sed -n '/^  step_1_request_analysis:/,/^  step_4_clarification:/p' "$C" | rg -n 'create\.sh|Verify or create|auto-create'` prints nothing, and `sed -n '/^  step_0.5_intake_branch:/,/^  step_1_request_analysis:/p' "$C" | rg -c 'with-phases'` prints at least 1.
- [x] T021 Set the phase decomposition `insert_point` to `after_step_1` and name `estimated_loc` and `estimated_files` in the step 1 outputs (`speckit-plan.yaml`). Verify: `rg -n 'insert_point' "$P"` prints one line reading `insert_point: "after_step_1"`, and `sed -n '/^  step_1_request_analysis:/,/^  step_2_pre_work_review:/p' "$P" | rg -c 'estimated_loc|estimated_files'` prints at least 1.
- [x] T022 [P] Make the same insert-point change in complete (`speckit-complete.yaml`). Verify: `rg -n 'insert_point' "$C"` prints `after_phase_2` for `research_integration` and `after_step_1` for `phase_decomposition`, and the step 1 block names `estimated_loc` and `estimated_files`.
- [x] T023 Replace the fixed `phase_count` and `parent_level` defaults with P2's phase count and P1's `recommended_level` (`speckit-plan.yaml`). Verify: `rg -n 'phase_count: 3|parent_level: "3\+"' "$P"` prints nothing and exits 1, and `rg -n 'recommended_level' "$P"` prints the P3 command line.
- [x] T024 [P] Make the same defaults change in complete (`speckit-complete.yaml`). Verify: `rg -n 'phase_count: 3|parent_level: "3\+"' "$C"` prints nothing and exits 1, and `rg -n 'recommended_level' "$C"` prints the P3 command line.
- [x] T025 Record `remaining_children` after decomposition and name each remaining child with `/speckit:plan` at termination (`speckit-plan.yaml`). Verify: `rg -n 'remaining_children' "$P"` prints one line in `post_decomposition` and one in `termination`.
- [x] T026 [P] Record `remaining_children` and name each remaining child with `/speckit:complete` at termination (`speckit-complete.yaml`). Verify: `rg -n 'remaining_children' "$C"` prints one line in `post_decomposition` and one in `termination`.

### Plan task breakdown step
- [x] T035 Insert `step_5_5_task_breakdown` between `step_5_planning` and `step_6_save_context`, modelled on implement `step_2_task_breakdown`, so it writes `tasks.md` from the tasks template (`speckit-plan.yaml`). Verify: `awk '/^  step_5_planning:/{p=NR} /^  step_5_5_task_breakdown:/{t=NR} /^  step_6_save_context:/{s=NR} END{print (p<t && t<s)?"ordered":"not ordered"}' "$P"` prints `ordered`, and `sed -n '/^  step_5_5_task_breakdown:/,/^  step_6_save_context:/p' "$P" | rg -c 'tasks\.md'` prints at least 1. Today the `awk` prints `not ordered`.
- [x] T036 Add a `tasks_md` entry to `template_compliance.inline_scaffolds`, copied from implement's `tasks_md` (`speckit-plan.yaml`). Verify: `sed -n '/^  inline_scaffolds:/,/^# /p' "$P" | rg -c 'tasks_md:'` prints 1. Today it prints nothing and exits 1.
- [x] T037 Add `step_5_5_task_breakdown` to the `checkpoints:` list (`speckit-plan.yaml`). Verify: the checkpoints check with `F` set to `$P` prints nothing, and `rg -n '^checkpoints:.*step_5_5_task_breakdown' "$P"` prints one line. Today the `rg` prints nothing and exits 1.
- [x] T038 Point the step 5 Approve Plan option at task breakdown (`speckit-plan.yaml`). Verify: `rg -n 'proceed to save context' "$P"` prints nothing and exits 1, and `rg -c 'proceed to task breakdown' "$P"` prints 1. Today the first `rg` prints line 793.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Rerun the implement ordering checks (`speckit-implement.yaml`). Verify: the T001 `awk` prints only `after` lines and the T010 `awk` prints no `after` line.
- [x] T028 Rerun the complete ordering check (`speckit-complete.yaml`). Verify: the T002 `awk` prints only `after` lines.
- [x] T029 Run the checkpoints check on each workflow (`.skilled/commands/speckit/assets/`). Verify: with `F` set to `$I`, then `$C`, then `$P`, each run prints nothing.
- [x] T030 Compare the step keys with the Setup list (`scratch/step-keys-before.txt`). Verify: `diff "$S" <(rg -o '^  (step_[0-9._]+[a-z_]+):' -r '$1' "$I" "$C" "$P" | sort)` shows `step_12_5_autopilot_archive_verify_merge` removed and `step_6_7_acceptance_verify`, `step_5_5_task_breakdown` and `step_13_5_autopilot_archive_verify_merge` added, and no other key line.
- [x] T031 Run the parse check (`.skilled/commands/speckit/assets/`). Verify: it prints `0` after each of the three file names.
- [x] T032 Confirm no consumer outside the workflows names a moved key (repository root). Verify: `rg -l 'step_12_5|step_13_5|step_6_7|step_5_5' --glob '!specs/**' .` lists only `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml`.
- [x] T033 Record the renamed and added step keys and every ordering-check output (`implementation-summary.md`). Verify: `rg -n 'step_13_5_autopilot_archive_verify_merge|step_6_7_acceptance_verify|step_5_5_task_breakdown' implementation-summary.md` prints at least three lines.
- [x] T034 Validate this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/001-step-order-acceptance-after-development --strict --quiet` prints `RESULT: PASSED` as its first `RESULT:` line.
- [x] T039 Rerun the workflow contract test after the workflow edits (`test-phase-command-workflows.js`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js | tail -1` prints `Result: passed=150 failed=0` or a higher pass count with `failed=0`. Today it prints `Result: passed=150 failed=0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `implementation-summary.md` holds the T027 and T028 `awk` output showing only `after` lines
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent findings ledger**: See `../spec.md`, rows L1 to L7
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

A blocked task is marked `[B]` with the failing command and its output on the task line. A P0 blocker stops the phase. A P1 blocker needs the operator's recorded approval to defer.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints one line per requirement row.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 4' plan.md` prints one line.
- [x] CHK-003 [P1] The T001 to T004 baselines print what those tasks say before any edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The parse check prints `0` errors for each of the three files.
- [x] CHK-011 [P0] No added line carries an em dash: `git diff -U0 -- .skilled/commands/speckit/assets | rg -n '^\+.*\x{2014}'` prints nothing.
- [x] CHK-012 [P1] Every stop branch in a moved step names the step it returns to: `rg -n 'return to' "$I"` prints the step 1 design-choice line.
- [x] CHK-013 [P1] `step_6_7_acceptance_verify` carries the same keys as complete's `step_11_acceptance_verify`: `purpose`, `activities`, `p0_enforcement`, `validation` and `checkpoint`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met with the output its Verification cell names.
- [x] CHK-021 [P0] The T027 and T028 ordering checks print only `after` lines.
- [x] CHK-022 [P1] Level 1 edge case: `step_6_7_acceptance_verify` applies at Level 2 and above only: `sed -n '/^  step_6_7_acceptance_verify:/,/^  step_7_completion:/p' "$I" | rg -c 'Level 2\+'` prints at least 1.
- [x] CHK-023 [P1] Failure path: `step_6_7_acceptance_verify` halts on an Unmet P0 row: `sed -n '/^  step_6_7_acceptance_verify:/,/^  step_7_completion:/p' "$I" | rg -c 'HALTED'` prints at least 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. L1, L2, L6 and L7 are `class-of-bug` because the same order appears in more than one workflow. L3, L4 and L5 are `instance-only`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory in `plan.md` was rerun after the edits and every hit sits after its producer.
- [x] CHK-FIX-003 [P0] The consumer inventory in T032 lists only the two workflow files.
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction code changes. The change edits workflow prose and keys.
- [x] CHK-FIX-005 [P1] Matrix axes are the three workflows and the seven findings. The rows are the requirement rows in `spec.md`.
- [x] CHK-FIX-006 [P1] N/A. No test or code reads process-wide state.
- [x] CHK-FIX-007 [P1] Every Met row in `acceptance-criteria.md` cites output taken at one named commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No added line reads a credential or an env file: `git diff -U0 -- .skilled/commands/speckit/assets | rg -n '^\+.*(\.env|secret|token)'` prints nothing.
- [x] CHK-031 [P1] No moved step writes outside the spec folder it is given. The only folder writers stay P3 and the intake Emit phase.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `step_6_7_acceptance_verify`, `step_5_5_task_breakdown` and `step_13_5_autopilot_archive_verify_merge`.
- [x] CHK-041 [P1] No added YAML comment carries a spec path, phase number or finding id: `git diff -U0 -- .skilled/commands/speckit/assets | rg -n '^\+\s*#.*(specs/|L[1-7]\b|REQ-)'` prints nothing.
- [x] CHK-042 [P2] Routers and presentation files are left for phase 8, and `implementation-summary.md` names that handoff.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



