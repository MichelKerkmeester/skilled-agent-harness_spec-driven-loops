---
title: "Tasks: Phase 6: save-search-handoff-contracts"
description: "Ordered tasks that give the save, search and handoff commands one contract each and leave each lifecycle workflow with one save step."
trigger_phrases:
  - "save search handoff contracts tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: save-search-handoff-contracts

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

Run every command from the repository root after setting `C=.skilled/commands/speckit` and `A=$C/assets` in the shell. An unset variable makes `rg` exit 2 with empty stdout, so every absence check below requires exit 1, never empty output alone. The canonical writer call is `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin --full-auto --session-id <id> --runtime <slug> <spec-folder>`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Record the workflow contract test baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints a `Result:` line with `failed=0`, written into `implementation-summary.md` as the baseline.
- [ ] T002 Record the predicate test baseline (`.skilled/skills/system-spec-kit/shared/tests/boolean-expr.test.ts`). Verify: `node --import tsx --test tests/boolean-expr.test.ts` run from `.skilled/skills/system-spec-kit/shared` prints `fail 0`.
- [ ] T003 Locate the one save step in each lifecycle workflow after phases 1 to 5 (`$A/speckit-implement.yaml`). Verify: `rg -c '^  step_[0-9_]+_save_context:' $A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml` prints 1 for each file.
- [ ] T004 Confirm the checkpoint scratch files still have no reader (`.skilled`). Verify: `rg -n 'checkpoint__' .skilled --glob '!**/node_modules/**'` prints lines only from `$A/speckit-implement.yaml` and `$A/speckit-complete.yaml`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Save tail
- [ ] T005 Replace the `pre_index_instruction` key with an `invocation` key that holds the canonical writer call with `{spec_path}` as the folder (`$A/speckit-save-context-tail.yaml`). Verify: `rg -n 'pre_index' $A/speckit-save-context-tail.yaml` prints nothing and exits 1, and `rg -c -F 'generate-context.js --stdin --full-auto --session-id <id> --runtime <slug>' $A/speckit-save-context-tail.yaml` prints 1.
- [ ] T006 Rewrite `critical_note` to say the writer refreshes `description.json` and `graph-metadata.json` itself, and name `validate.sh {spec_path} --strict` as the one check after it (`$A/speckit-save-context-tail.yaml`). Verify: `rg -n -e 'Regenerate the packet' -e 'Nothing else runs' $A/speckit-save-context-tail.yaml` prints nothing and `rg -c 'validate.sh' $A/speckit-save-context-tail.yaml` prints 1.
- [ ] T007 Delete the `anchor_requirements` block (`$A/speckit-save-context-tail.yaml`). Verify: `rg -n -e 'anchor_requirements' -e 'minimum_anchors' $A/speckit-save-context-tail.yaml` prints nothing and exits 1.
- [ ] T008 Drop the `anchor_requirements:` clause from the T-EM7 assertion and its message (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `rg -c 'anchor_requirements' .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints nothing and the test prints `failed=0`.

### Lifecycle save steps
- [ ] T009 Delete the `write_continuity` block from the save step (`$A/speckit-implement.yaml`). Verify: `rg -n 'write_continuity' $A/speckit-implement.yaml` prints nothing and exits 1.
- [ ] T010 Delete `step_6_5_checkpoint_development` and its entry in `checkpoints:` (`$A/speckit-implement.yaml`). Verify: `rg -n -e 'step_6_5' -e 'checkpoint__' $A/speckit-implement.yaml` prints nothing and exits 1.
- [ ] T011 Delete the closing `/speckit:save` offer step, drop it from `checkpoints:` and point `termination.after_step` and its message at the save step, with the step's closeout text in the message (`$A/speckit-implement.yaml`). Verify: `rg -n -e 'Run /speckit:save' -e 'handover_check' $A/speckit-implement.yaml` prints nothing and exits 1, `sed -n '/^termination:/,/^[a-z]/p' $A/speckit-implement.yaml | rg -c '^  message: ".*[Cc]omplete'` prints 1 and `python3 -c "__import__('yaml').safe_load(open(__import__('sys').argv[1]))" $A/speckit-implement.yaml` exits 0.
- [ ] T012 Delete the `write_continuity` block from the save step (`$A/speckit-complete.yaml`). Verify: `rg -n 'write_continuity' $A/speckit-complete.yaml` prints nothing and exits 1.
- [ ] T013 Delete `step_6_5_checkpoint_planning` and `step_10_5_checkpoint_development` and their entries in `checkpoints:` (`$A/speckit-complete.yaml`). Verify: `rg -n -e 'step_6_5' -e 'step_10_5' -e 'checkpoint__' $A/speckit-complete.yaml` prints nothing and exits 1.
- [ ] T014 Delete the closing `/speckit:save` offer step, drop it from `checkpoints:` and point `termination.after_step` and its message at the save step, with the step's closeout text in the message (`$A/speckit-complete.yaml`). Verify: `rg -n -e 'Run /speckit:save' -e 'handover_check' $A/speckit-complete.yaml` prints nothing and exits 1, `sed -n '/^termination:/,/^[a-z]/p' $A/speckit-complete.yaml | rg -c '^  message: ".*[Cc]omplete'` prints 1 and `python3 -c "__import__('yaml').safe_load(open(__import__('sys').argv[1]))" $A/speckit-complete.yaml` exits 0.
- [ ] T015 Point the `after:` timing assertion and its two messages at the tail's `post_save_write` block (`.skilled/skills/system-spec-kit/shared/tests/boolean-expr.test.ts`). Verify: `rg -n 'write_continuity' .skilled/skills/system-spec-kit/shared/tests/boolean-expr.test.ts` prints nothing and exits 1, and `node --import tsx --test tests/boolean-expr.test.ts` run from `.skilled/skills/system-spec-kit/shared` prints `fail 0`.
- [ ] T016 Delete the closing `/speckit:save` offer step, drop it from `checkpoints:`, remove the save offer from `mode_overrides.confirm.user_response_handling` and point `termination` at the save step, with the step's closeout text in its message (`$A/speckit-plan.yaml`). Verify: `rg -n -e 'Run /speckit:save' -e 'handover_check' $A/speckit-plan.yaml` prints nothing and exits 1, and `sed -n '/^termination:/,/^[a-z]/p' $A/speckit-plan.yaml | rg -c '^  message: ".*[Cc]omplete'` prints 1.

### Save router and display
- [ ] T017 Replace the bare writer name in the router contract with the canonical call and merge "apply/full-auto" into one full-auto mode (`$C/save.md`). Verify: `rg -c -F 'generate-context.js --stdin --full-auto --session-id <id> --runtime <slug>' $C/save.md` prints at least 1 and `rg -n 'apply/full-auto' $C/save.md` prints nothing.
- [ ] T018 Label the runtime list as the writer's `--runtime` values from `KNOWN_RUNTIMES` (`$C/save.md`). Verify: `rg -n 'dsh.*generate-context.js|generate-context.js.*dsh' $C/save.md` prints at least one line.
- [ ] T019 Remove "Trigger-edit display" from the presentation boundary list (`$C/save.md`). Verify: `rg -n 'Trigger-edit' $C/save.md` prints nothing and exits 1.
- [ ] T020 Delete the `SPECKIT:TRIGGERS` editor in Section 4 and renumber the sections after it (`$A/save-presentation.txt`). Verify: `rg -n -e 'SPECKIT:TRIGGERS' -e 'Record      #' $A/save-presentation.txt` prints nothing and exits 1.
- [ ] T021 Add `Blockers`, `Advisories`, `Decisions` and `Orphans` rows to the plan display (`$A/save-presentation.txt`). Verify: `rg -c '^Blockers ' $A/save-presentation.txt` prints at least 1, and the same command prints at least 1 for each of `^Advisories `, `^Decisions ` and `^Orphans `.
- [ ] T022 Drop `refresh-graph` from the follow-up values (`$A/save-presentation.txt`). Verify: `rg -n 'refresh-graph' $A/save-presentation.txt` prints nothing and exits 1.
- [ ] T023 Replace the apply result block with a `SPECKIT:SAVE FULL-AUTO` block whose rows render the writer's continuity, decision and `session_ref` lines and carry no anchor rows (`$A/save-presentation.txt`). Verify: `rg -c 'SPECKIT:SAVE FULL-AUTO' $A/save-presentation.txt` prints 1 and `rg -n -e 'ANCHORS=' -e '<anchor_1>' $A/save-presentation.txt` prints nothing and exits 1.

### Handoff router
- [ ] T024 Replace the Step 2 writer call with the canonical call (`$C/handoff.md`). Verify: `rg -c -F 'generate-context.js --stdin --full-auto --session-id <id> --runtime <slug>' $C/handoff.md` prints 1.
- [ ] T025 Put the four STATUS shapes in one table in section 2 and make Steps 2 and 5 name the row (`$C/handoff.md`). Verify: `rg -c -e 'STATUS=OK' -e 'STATUS=FAIL' $C/handoff.md` prints 4.
- [ ] T026 Label the Step 4 runtime list as the `session-relaunch.cjs --runtime` values and add that a DSH session saves through the writer but `prepare` refuses `--runtime dsh` (`$C/handoff.md`). Verify: `rg -n -i 'dsh' $C/handoff.md` prints at least one line.

### Search router and display
- [ ] T027 Add `[--limit <n>]` to the argument hint and pass `--limit <n>` on the trigger-index lane with the default of 20 and `--limit 0` for all (`$C/search.md`). Verify: `rg -n 'argument-hint:.*--limit' $C/search.md` prints one line and `rg -n 'lookup-trigger-index.mjs.*--limit' $C/search.md` prints at least one line.
- [ ] T028 Run the path-only and count modes through `rg-wrapper.mjs path` and `rg-wrapper.mjs count`, and say they keep the wrapper's cap of 20 files that `--limit 0` lifts (`$C/search.md`). Verify: `rg -n 'run their recipe directly' $C/search.md` prints nothing and exits 1, `rg -c -e 'rg-wrapper.mjs path' -e 'rg-wrapper.mjs count' $C/search.md` prints at least 2 and `rg -n 'path-only and count.*--limit 0' $C/search.md` prints at least one line.
- [ ] T029 Route a query that starts with `--` to the raw Section 2.1 recipe before any wrapper run, and keep exit 2 or higher as the error display only (`$C/search.md`). Verify: `rg -n 'as a flag and exits' $C/search.md` prints nothing and `rg -n 'starts with .--. .*before .*wrapper' $C/search.md` prints one line.
- [ ] T030 Add the `<path>` and `<count>  <path>` row shapes with `HIDDEN` from `record.hidden`, and replace the rule that omits `HIDDEN` for path-only and count runs (`$A/search-presentation.txt`). Verify: `rg -c -F '<count>  <path>' $A/search-presentation.txt` prints at least 1 and `rg -n 'Omit .HIDDEN. for path-only and count' $A/search-presentation.txt` prints nothing and exits 1.
- [ ] T031 Relabel the filled example's recipe line to match its rows (`$A/search-presentation.txt`). Verify: `rg -c -F 'recipe    2.1 structured' $A/search-presentation.txt` prints 1.

### Complete closeout display
- [ ] T032 Remove the `memory-save` choice from the workflow closeout block, the display side of the removed closing step (`$A/speckit-complete-presentation.txt`). Verify: `rg -n 'memory-save' $A/speckit-complete-presentation.txt` prints nothing and exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T033 Check REQ-001 across the command folder (`$C`). Verify: the AC-001 commands print what AC-001 names, and the Measured Behavior command in `spec.md` prints no `/tmp/save-context-data` line.
- [ ] T034 Check REQ-002 (`$A/speckit-save-context-tail.yaml`). Verify: the AC-002 commands print what AC-002 names.
- [ ] T035 Check REQ-003 (`$C/search.md`). Verify: the AC-003 commands print what AC-003 names.
- [ ] T036 Check REQ-004 (`$A/speckit-save-context-tail.yaml`). Verify: the AC-004 commands print what AC-004 names, including `failed=0`.
- [ ] T037 Check REQ-005 (`$A/speckit-save-context-tail.yaml`). Verify: the AC-005 commands print what AC-005 names.
- [ ] T038 Check REQ-006 (`$A/save-presentation.txt`). Verify: the AC-006 command prints nothing and exits 1.
- [ ] T039 Check REQ-007 (`$C/handoff.md`). Verify: the AC-007 commands print what AC-007 names.
- [ ] T040 Check REQ-008 (`$A/search-presentation.txt`). Verify: the AC-008 commands print what AC-008 names.
- [ ] T041 Check REQ-009 (`$C/search.md`). Verify: the AC-009 commands print what AC-009 names.
- [ ] T042 Check REQ-010 (`$A/save-presentation.txt`). Verify: the AC-010 commands each print at least 1.
- [ ] T043 Check REQ-011 (`$A/save-presentation.txt`). Verify: the AC-011 commands print what AC-011 names.
- [ ] T044 Check REQ-012 (`$C/handoff.md`). Verify: the AC-012 commands print 4 and nothing.
- [ ] T045 Check REQ-013 (`$A/speckit-complete.yaml`). Verify: the AC-013 commands print what AC-013 names, including `fail 0`.
- [ ] T046 Check REQ-014 (`$A/speckit-plan.yaml`). Verify: the AC-014 commands print what AC-014 names, including `failed=0`.
- [ ] T047 Confirm the four YAML files still parse (`$A/speckit-save-context-tail.yaml`). Verify: `python3 -c "print('parsed', len([__import__('yaml').safe_load(open(f)) for f in __import__('sys').argv[1:]]))" $A/speckit-save-context-tail.yaml $A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml` prints `parsed 4`.
- [ ] T048 Mark each acceptance row with its evidence (`acceptance-criteria.md`). Verify: `rg -c '^\| AC-[0-9]+ .*\| Unmet \|' acceptance-criteria.md` run in this folder prints nothing and exits 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `acceptance-criteria.md` has no `Unmet` row and both test files print zero failures
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent findings ledger**: See `../spec.md`, rows S1 to S14
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

A task blocked by an unanswered open question is marked `[B]` and names the question. A `[B]` task on a P0 requirement blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 5 is Complete: `rg -c '^\| AC-[0-9]+ .*\| Unmet \|' ../005-resume-detection-and-single-workflow/acceptance-criteria.md` prints nothing and exits 1
- [ ] CHK-002 [P0] Both test baselines are recorded in `implementation-summary.md` (T001 and T002)
- [ ] CHK-003 [P1] The test-file edit and `--full-auto` on lifecycle saves are recorded as decided in `spec.md` Open Questions: `rg -c 'Decided 2026-11-14' spec.md` run in this folder prints at least 2
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The four YAML files parse: T047 prints `parsed 4`
- [ ] CHK-011 [P0] No line this phase adds holds an em dash: `git diff -U0 -- $C | rg '^\+.*\x{2014}'` prints nothing
- [ ] CHK-012 [P1] Every removed step is gone from its `checkpoints:` list: `test-phase-command-workflows.js` prints every T-EM3 line as `PASS`
- [ ] CHK-013 [P1] Comments in the edited YAML name no spec path, phase number or finding id: `rg -n -e 'S1[0-4]\b' -e 'phase 6' $A/speckit-save-context-tail.yaml` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met` (T048)
- [ ] CHK-021 [P0] `test-phase-command-workflows.js` prints `failed=0` and `boolean-expr.test.ts` prints `fail 0`
- [ ] CHK-022 [P1] The phrase edge case is covered: AC-003 passes
- [ ] CHK-023 [P1] The error path is covered: the save and search error displays are unchanged, so `rg -c 'STATUS=FAIL' $A/save-presentation.txt $A/search-presentation.txt` still prints 1 for the save display and 2 for the search display
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding has a class. S4, S13 and S14 are `class-of-bug` across three workflows. S1, S2, S3, S12 and S10 are `instance-only` in the tail or the save display. S5, S6, S7, S8, S9 and S11 are `cross-consumer` between a router and a script or display.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done: `rg -n -e 'generate-context.js' -e 'Run /speckit:save' -e 'checkpoint__' $C` lists only the canonical call and no save offer.
- [ ] CHK-FIX-003 [P0] Consumer inventory done: `rg -n -e 'write_continuity' -e 'anchor_requirements' -e 'pre_index_instruction' .skilled --glob '!**/node_modules/**' --glob '!.skilled/commands/create/**' --glob '!.skilled/commands/design/**'` prints nothing.
- [ ] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction logic changes.
- [ ] CHK-FIX-005 [P1] Matrix listed: three lifecycle workflows by two save shapes, every row tail only (`plan.md` affected surfaces).
- [ ] CHK-FIX-006 [P1] N/A. The tests read files and no process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence in `acceptance-criteria.md` names the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No edited file holds a credential: `rg -n -i -e 'api[_-]?key' -e 'token=' $C/save.md $C/search.md $C/handoff.md` prints nothing and exits 1
- [ ] CHK-031 [P0] The canonical writer call reads JSON from stdin, so no session content lands in a shared `/tmp` path: AC-001 passes
- [ ] CHK-032 [P1] N/A. No auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md` and `tasks.md` name the same canonical writer call: `rg -c -F -- '--stdin --full-auto --session-id <id> --runtime <slug>' spec.md tasks.md` prints at least 1 for each
- [ ] CHK-041 [P1] The tail's header comment still describes what the tail holds: read lines 1 to 9 of `$A/speckit-save-context-tail.yaml`
- [ ] CHK-042 [P2] N/A. Phase 8 owns the README.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in this folder's `scratch/` only: `git status --porcelain` lists no new file outside `$C`, the two test files and this folder
- [ ] CHK-051 [P1] `scratch/` is empty before completion: `ls scratch` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



