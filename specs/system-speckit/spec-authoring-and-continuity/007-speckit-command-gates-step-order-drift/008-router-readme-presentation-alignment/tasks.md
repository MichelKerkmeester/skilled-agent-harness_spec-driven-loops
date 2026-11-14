---
title: "Tasks: Phase 8: router-readme-presentation-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "router readme presentation alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: router-readme-presentation-alignment

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

`S` is `.skilled/commands/speckit`. `A` is `.skilled/commands/speckit/assets`. `P` is `specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift`. `F` is `$P/008-router-readme-presentation-alignment`. A CHECK name refers to the fenced block of that name in `plan.md` section 5, run with `bash` from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm phase 7 is closed (`$P/007-shared-blocks-and-retired-mechanisms/acceptance-criteria.md`). Verify: `rg -c 'Unmet' $P/007-shared-blocks-and-retired-mechanisms/acceptance-criteria.md` prints no count and exits 1.
- [ ] T002 Run each CHECK block after an `echo "== CHECK-<name>"` header line and save the output as the baseline (`$F/scratch/baseline.txt`). Verify: `rg -c '^== CHECK-' $F/scratch/baseline.txt` prints 12.
- [ ] T003 Record the parity test and mirror check baselines (`$F/scratch/baseline.txt`). Verify: `rg -n 'ℹ fail 0|^STATUS=OK' $F/scratch/baseline.txt` prints both lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Step counts (REQ-004)
- [ ] T004 Set the step count in the `description` line to the workflow's N (`$S/plan.md`). Verify: CHECK-A1 prints no `MISMATCH plan router` line.
- [ ] T005 Set the step count in the `description` line to the workflow's N (`$S/implement.md`). Verify: CHECK-A1 prints no `MISMATCH implement router` line.
- [ ] T006 Set the step count in the `description` line to the workflow's N with no `+` (`$S/complete.md`). Verify: CHECK-A1 prints no `MISMATCH complete router` line.
- [ ] T007 Set every Steps cell of the README command table to the derived number (`$S/README.txt`). Verify: CHECK-A1 prints no `readme=` line.
- [ ] T008 Set the success line and dashboard total to N (`$A/speckit-plan-presentation.txt`). Verify: CHECK-A1 prints no `MISMATCH plan success` or `MISMATCH plan dashboard` line.
- [ ] T009 Set the success line and dashboard total to N (`$A/speckit-implement-presentation.txt`). Verify: CHECK-A1 prints no `MISMATCH implement success` or `MISMATCH implement dashboard` line.
- [ ] T010 Set the success line and dashboard total to N (`$A/speckit-complete-presentation.txt`). Verify: CHECK-A1 prints no `MISMATCH complete success` or `MISMATCH complete dashboard` line.
- [ ] T011 Set `termination.after_step` and its message to L, the last counted step number (`$A/speckit-plan.yaml`). Verify: CHECK-A1 prints no `MISMATCH plan after_` line.
- [ ] T012 Set `termination.after_step` and its message to L, the last counted step number (`$A/speckit-implement.yaml`). Verify: CHECK-A1 prints no `MISMATCH implement after_` line.
- [ ] T013 Set `termination.after_step` and its message to L, the last counted step number (`$A/speckit-complete.yaml`). Verify: CHECK-A1 prints no `MISMATCH complete after_` line.

### README index (REQ-005, REQ-006, REQ-007, REQ-002, REQ-011)
- [ ] T014 Copy each router's `argument-hint` tokens into its README Invocation cell (`$S/README.txt`). Verify: CHECK-A2 prints nothing.
- [ ] T015 List every router, `README.txt` and every `assets/` file in the `speckit/` tree and drop the stale command count (`$S/README.txt`). Verify: CHECK-A3 prints nothing.
- [ ] T016 List every Workflow Flag Surface entry of `complete.md` in section 7 and drop the flag count from its lead sentence (`$S/README.txt`). Verify: CHECK-A4 prints nothing.
- [ ] T017 Rewrite the phase-decomposition usage example in the router form `/speckit:plan "<description>" :auto :with-phases --phases 3` (`$S/README.txt`). Verify: `rg -n '/speckit:[a-z]+:[a-z]' $S/README.txt` prints nothing and exits 1.
- [ ] T018 Confirm the `/speckit:handoff` row is present once and its Steps cell matches `handoff.md` section 3 (`$S/README.txt`). Verify: CHECK-A9 prints no `README ROWS` line.

### Plan and complete presentation and workflow text (REQ-001, REQ-002, REQ-003, REQ-009)
- [ ] T019 Rewrite the plan `termination.next_steps` entry as `Use /speckit:implement <spec-folder> :auto or /speckit:implement <spec-folder> :confirm` (`$A/speckit-plan.yaml`). Verify: CHECK-A5 prints no match line and `rg exit=1`.
- [ ] T020 Limit the success `Artifacts:` line and the dashboard `Artifacts:` row to files a plan step `outputs:` list writes (`$A/speckit-plan-presentation.txt`). Verify: CHECK-A10 prints nothing.
- [ ] T021 Add the outcome in parentheses after `D) Skip documentation` in Q1 (`$A/speckit-plan-presentation.txt`). Verify: `rg -c '^Q1\. Spec Folder: .*D\) Skip documentation \(' $A/speckit-plan-presentation.txt` prints 1.
- [ ] T022 Add the outcome in parentheses after `D) Skip documentation` in Q1 (`$A/speckit-complete-presentation.txt`). Verify: `rg -c '^Q1\. Spec Folder: .*D\) Skip documentation \(' $A/speckit-complete-presentation.txt` prints 1.
- [ ] T023 Add one `spec_folder_skip:` key under `field_handling` that states the D outcome (`$A/speckit-plan.yaml`). Verify: `rg -c '^\s+spec_folder_skip:' $A/speckit-plan.yaml` prints 1.
- [ ] T024 Add one `spec_folder_skip:` key under `field_handling` that states the D outcome (`$A/speckit-complete.yaml`). Verify: `rg -c '^\s+spec_folder_skip:' $A/speckit-complete.yaml` prints 1.
- [ ] T025 Use `[description]` and `[number]` in the failure block (`$A/speckit-complete-presentation.txt`). Verify: the first line of CHECK-A7 output prints 1.

### Asset names (REQ-008)
- [ ] T026 Keep both asset names and keep the one README sentence that states the naming rule in the structure section beside the tree (`$S/README.txt`). Verify: `sed -n '/ANCHOR:structure/,/\/ANCHOR:structure/p' $S/README.txt | rg -c '^`save` and `search` .*`save-presentation\.txt` and `search-presentation\.txt` .*prefix'` prints 1.

### Setup prompt fields (REQ-012, REQ-013)
- [ ] T047 Remove Q3 Dispatch Mode, the `dispatch_mode` marker line and its table row, renumber the later questions and fix the reply format range and examples (`$A/speckit-plan-presentation.txt`). Verify: CHECK-X2 prints no line that contains `plan`.
- [ ] T048 Remove Q3 Dispatch Mode, the `dispatch_mode` marker line and its table row, renumber the later questions and fix the reply format range and examples (`$A/speckit-implement-presentation.txt`). Verify: CHECK-X2 prints no line that contains `implement`.
- [ ] T049 Remove Q3 Dispatch Mode, the `dispatch_mode` marker line and its table row, renumber the later questions and fix the reply format range and examples (`$A/speckit-complete-presentation.txt`). Verify: CHECK-X2 prints no line that contains `complete`.
- [ ] T050 Rename `memory_choice` to `prior_continuity_choice` in the marker block and the resolution table (`$A/speckit-plan-presentation.txt`). Verify: `rg -c -w memory_choice $A/speckit-plan-presentation.txt` prints nothing and exits 1, and `rg -c -w prior_continuity_choice $A/speckit-plan-presentation.txt` prints 2.
- [ ] T051 Rename `memory_choice` to `prior_continuity_choice` in the marker block and the resolution table (`$A/speckit-implement-presentation.txt`). Verify: `rg -c -w memory_choice $A/speckit-implement-presentation.txt` prints nothing and exits 1, and `rg -c -w prior_continuity_choice $A/speckit-implement-presentation.txt` prints 2.
- [ ] T052 Rename `memory_choice` to `prior_continuity_choice` in the marker block and the resolution table (`$A/speckit-complete-presentation.txt`). Verify: `rg -c -w memory_choice $A/speckit-complete-presentation.txt` prints nothing and exits 1, and `rg -c -w prior_continuity_choice $A/speckit-complete-presentation.txt` prints 2.
- [ ] T053 Rename `memory_choice` to `prior_continuity_choice` in the marker block and the resolution table (`$A/speckit-resume-presentation.txt`). Verify: `rg -c -w memory_choice $A/speckit-resume-presentation.txt` prints nothing and exits 1, and `rg -c -w prior_continuity_choice $A/speckit-resume-presentation.txt` prints 2.
- [ ] T054 Confirm no router, workflow or presentation file in the command folder still names either retired field (`$S`). Verify: `rg -n -w -e dispatch_mode -e memory_choice $S` prints nothing and exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T035 Run CHECK-A10 for REQ-001 (`$A/speckit-plan-presentation.txt`). Verify: it prints nothing.
- [ ] T036 Run CHECK-A5 for REQ-002 (`$S`). Verify: it prints no match line and `rg exit=1`.
- [ ] T037 Run CHECK-A8 for REQ-003 and REQ-010 (`$A`). Verify: it prints `ℹ fail 0` and a count of 1 for each of the four files.
- [ ] T038 Run CHECK-A1 for REQ-004 (`$S`). Verify: it prints nothing.
- [ ] T039 Run CHECK-A2 for REQ-005 (`$S/README.txt`). Verify: it prints nothing.
- [ ] T040 Run CHECK-A3 for REQ-006 (`$S/README.txt`). Verify: it prints nothing.
- [ ] T041 Run CHECK-A4 for REQ-007 (`$S/README.txt`). Verify: it prints nothing.
- [ ] T042 Run CHECK-A6 for REQ-008 (`.skilled`). Verify: `ls` lists both files, no `UNRESOLVED` line prints, the README sentence count is 1 and the last line is `STATUS=OK`.
- [ ] T043 Run CHECK-A7 for REQ-009 (`$A`). Verify: every line it prints is 1.
- [ ] T044 Run CHECK-A9 for REQ-011 (`$S/README.txt`). Verify: it prints no `README ROWS` line and prints `STATUS=OK`.
- [ ] T045 Parse the edited lifecycle workflows (`$A/speckit-plan.yaml`). Verify: `python3 -c "[__import__('yaml').safe_load(open(p)) for p in __import__('sys').argv[1:]]" $A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml` exits 0.
- [ ] T046 Validate this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $F --strict --quiet` prints `RESULT: PASSED`.
- [ ] T055 Run CHECK-X2 for REQ-012 (`$A`). Verify: it prints only `rg exit=1`.
- [ ] T056 Run CHECK-X3 for REQ-013 (`$A`). Verify: it prints `rg exit=1` and then a count of 2 for each of the four presentation files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every CHECK block in `plan.md` section 5 prints the expected output its row in `acceptance-criteria.md` names
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 5 holds the CHECK blocks
- **Acceptance**: See `acceptance-criteria.md`
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

A task blocked by an earlier phase that has not closed is marked `[B]` with the phase number, and this phase does not close while any `[B]` line remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Phase 7 is closed: `rg -c 'Unmet' $P/007-shared-blocks-and-retired-mechanisms/acceptance-criteria.md` prints no count
- [ ] CHK-002 [P0] The baseline holds every CHECK output: `rg -c '^== CHECK-' $F/scratch/baseline.txt` prints 12
- [ ] CHK-003 [P1] The parity test and mirror check pass before any edit: `rg -n 'ℹ fail 0|^STATUS=OK' $F/scratch/baseline.txt` prints both lines
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] The three lifecycle workflows parse: the T045 `python3` command exits 0
- [ ] CHK-011 [P0] N/A. This phase edits no JSON file, because both presentation asset names stay
- [ ] CHK-012 [P1] Every caller of the two kept asset names resolves: CHECK-A6 prints no `UNRESOLVED` line
- [ ] CHK-013 [P1] No attached mode suffix remains: `rg -n '/speckit:[a-z]+:[a-z]' .skilled/commands/speckit` exits 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] CHECK-A10, CHECK-A5 and CHECK-A8 print the outputs that the P0 rows of `acceptance-criteria.md` name
- [ ] CHK-021 [P1] CHECK-A1, CHECK-A2, CHECK-A3, CHECK-A4, CHECK-A6, CHECK-A7, CHECK-A9, CHECK-X2 and CHECK-X3 print the outputs that the P1 rows name
- [ ] CHK-022 [P1] `node --test gate-3-menu-parity.test.mjs` prints `ℹ fail 0`
- [ ] CHK-023 [P1] `command-catalog-mirror-check.cjs` prints `STATUS=OK`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Each finding has a class: A1, A2, A3, A4 and A10 are `cross-consumer`. A5, A7, X2 and X3 are `class-of-bug`. A8 and A9 are `instance-only`. A6 closes as intentional.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory is done: CHECK-A5, CHECK-A6 and T054 grep the whole command folder or `.skilled`, not only the cited line.
- [ ] CHK-FIX-003 [P0] Consumer inventory is done for the kept asset names and the two retired fields: CHECK-A6 prints no `UNRESOLVED` line, T054 prints nothing and the mirror check prints `STATUS=OK`.
- [ ] CHK-FIX-004 [P0] N/A. No security, path parser or redaction code changes.
- [ ] CHK-FIX-005 [P1] Matrix axes are listed in `plan.md` Affected Surfaces: command by copy.
- [ ] CHK-FIX-006 [P1] N/A. No test or code here reads process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence in `implementation-summary.md` names the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] N/A. The edits are command text. No credential, input parser or permission changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same CHECK for each REQ
- [ ] CHK-041 [P1] `README.txt`, the routers and the presentation files agree: CHECK-A1, CHECK-A2 and CHECK-A3 print nothing
- [ ] CHK-042 [P2] The parent `spec.md` Files to Change table names phase 8 for the lifecycle workflows, or the gap is recorded in this phase's Open Questions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The baseline lives at `$F/scratch/baseline.txt` only
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion: `ls $F/scratch` lists nothing but `.gitkeep` when present
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



