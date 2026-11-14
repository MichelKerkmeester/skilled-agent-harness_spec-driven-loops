---
title: "Tasks: Phase 5: resume-detection-and-single-workflow"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "resume detection and single workflow tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: resume-detection-and-single-workflow

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

Run every command from the repository root. `A` is `.skilled/commands/speckit/assets`. `W` is `.skilled/commands/speckit/assets/speckit-resume.yaml`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Run the workflow asset test for a baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `Result: passed=154 failed=0`, the count phases 1 to 4 left.
- [x] T002 Run the goal-offer test for a baseline (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `pass 5` and `fail 0`.
- [x] T003 Record every file that names an old resume workflow file (`scratch/old-refs.txt`). Verify: `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` lists seven files, the same seven the file holds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### The merged workflow

- [x] T004 Create the merged workflow from the confirm file, with an `execution_mode` block (`source: "$ARGUMENTS"`, `values: [auto, confirm]`, `default: confirm`) and a `mode_overrides.confirm` block holding the interactive role, purpose, approvals and philosophy wording (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -c -e '^execution_mode:' -e '^mode_overrides:' $W` prints 2.
- [x] T005 Mark each confirm-only block `applies_to: confirm` and list its step keys in `checkpoints:` (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n '^checkpoints:' $W` prints one line, and each step it names shows `applies_to: confirm` in `rg -n -A14 '^  step_' $W`.
- [x] T006 Set one `termination.after_step` equal to the last step number (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -c 'after_step:' $W` prints 1 and its value equals the highest `step_N` key that `rg -o '^  step_[0-9]+' $W` prints.
- [x] T007 Rewrite `session_detection` so the argument comes first, then the handoff note whose `claimed_by` or `session_id` equals the calling session id, then the packet whose `_memory.continuity.session_ref.sessionId` equals it (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n -e 'session-relaunch/handoffs' -e 'claimed_by' -e 'session_ref.sessionId' $W` prints lines inside `session_detection`.
- [x] T008 Replace the two modification-time tiers with the No Session result under auto and a labelled candidate list under confirm (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n -B6 'not matched to this session' $W` shows `applies_to: confirm`, and `rg -n 'head -1' $W` prints nothing.
- [x] T009 Remove `tier_3_triggers` and its `priority_order` entry (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n -e 'resume work session context' -e 'tier_3_triggers' $W` prints nothing.
- [x] T010 Remove the semantic and MCP fallback text and the two MCP rules (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n -i -e 'mcp' -e 'semantic/' $W` prints nothing.
- [x] T011 Remove the `.opencode/specs/` root, its normalization line and the `{.opencode/,}` glob prefixes (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n '\.opencode/' $W` prints nothing.
- [x] T012 Name the access-telemetry store file, its key and the `graph-metadata.json` fallback in the phase redirect (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n 'access-telemetry.json' $W` prints one line and `rg -n 'the telemetry store' $W` prints nothing.
- [x] T013 Replace the 24-hour handover rule with the ladder ranking from `buildResumeLadder` and an age line in the brief (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n '<24h' $W` prints nothing and `rg -n 'unbound handover' $W` prints one line.
- [x] T014 Change the start-new suggestion in `fallback` and `error_recovery` to `/speckit:plan` (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `rg -n 'speckit:complete' $W` prints nothing.

### Old files and the router

- [x] T015 Delete the auto workflow (`.skilled/commands/speckit/assets/speckit-resume-auto.yaml`). Verify: `ls $A/speckit-resume-auto.yaml` exits 1.
- [x] T016 Delete the confirm workflow (`.skilled/commands/speckit/assets/speckit-resume-confirm.yaml`). Verify: `ls $A/speckit-resume*.yaml` prints only `speckit-resume.yaml`.
- [x] T017 Point the Owned Assets and Execution Targets rows at the merged file with its `execution_mode` value (`.skilled/commands/speckit/resume.md`). Verify: `rg -c 'speckit-resume.yaml' .skilled/commands/speckit/resume.md` prints at least 2 and `rg -n 'speckit-resume-[a-z]+\.yaml' .skilled/commands/speckit/resume.md` prints nothing.
- [x] T018 Add the Workflow Flag Surface table and `--no-redirect` in the argument hint (`.skilled/commands/speckit/resume.md`). Verify: `rg -n -e '^[|] .--no-redirect. [|]' -e '^[|] .--phase-folder. [|]' .skilled/commands/speckit/resume.md` prints two lines and `rg -n '^argument-hint:.*--no-redirect' .skilled/commands/speckit/resume.md` prints one line.

### Presentation, README, metadata and tests

- [x] T019 Change the Q0 and No Session start-new command to `/speckit:plan` (`.skilled/commands/speckit/assets/speckit-resume-presentation.txt`). Verify: `rg -n 'speckit:complete' $A/speckit-resume-presentation.txt` prints nothing.
- [x] T020 Replace `mcp_enrichment` in the Resume Brief Source values with the dashboard values (`.skilled/commands/speckit/assets/speckit-resume-presentation.txt`). Verify: `rg -n -i 'mcp' $A/speckit-resume-presentation.txt` prints nothing.
- [x] T021 Change the `purpose_row` sentence to name the one resume workflow (`.skilled/commands/speckit/assets/speckit-resume-presentation.txt`). Verify: `rg -n 'both resume workflow' $A/speckit-resume-presentation.txt` prints nothing.
- [x] T022 Name the merged file in the asset tree and the workflow asset line (`.skilled/commands/speckit/README.txt`). Verify: `rg -n 'speckit-resume-[a-z]+\.yaml' .skilled/commands/speckit/README.txt` prints nothing.
- [x] T023 [P] Replace the two resume workflow resources with one (`.skilled/skills/system-spec-kit/command-metadata.json`). Verify: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" .skilled/skills/system-spec-kit/command-metadata.json` exits 0 and `rg -c 'speckit-resume.yaml' .skilled/skills/system-spec-kit/command-metadata.json` prints 1.
- [x] T024 [P] Replace the two resume execution targets with one (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`). Verify: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` exits 0 and `rg -c 'speckit-resume.yaml' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints 1.
- [x] T025 [P] Replace the two workflow rows with one (`.skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md`). Verify: `rg -c 'speckit-resume.yaml' .skilled/skills/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md` prints 1.
- [x] T026 Name the merged file in the asset list and widen the `speckit-resume-` prefix check so the `purpose_row` assertion runs on it (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: the test prints `failed=0` and a PASS line for `speckit-resume.yaml keeps the shared purpose label shape in purpose_row`.
- [x] T027 Name the merged file in `WORKFLOW_YAML_FILES` and change the test title from five to four assets (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T028 Check REQ-001 and record the output in AC-001 (`acceptance-criteria.md`). Verify: the AC-001 command prints the handoff-note and `session_ref` lines inside `session_detection`.
- [x] T029 Check REQ-002 and record the output in AC-002 (`acceptance-criteria.md`). Verify: the AC-002 commands print `applies_to: confirm` in context and no `head -1` line.
- [x] T030 Check REQ-003 and record the output in AC-003 (`acceptance-criteria.md`). Verify: the AC-003 command prints nothing.
- [x] T031 Check REQ-004 and record the output in AC-004 (`acceptance-criteria.md`). Verify: the AC-004 command prints nothing.
- [x] T032 Check REQ-005 and record the output in AC-005 (`acceptance-criteria.md`). Verify: the AC-005 command prints nothing.
- [x] T033 Check REQ-006 and record the output in AC-006 (`acceptance-criteria.md`). Verify: `ls` prints one resume workflow and the count command prints 4.
- [x] T034 Check REQ-007 and record the output in AC-007 (`acceptance-criteria.md`). Verify: the inventory command prints nothing and both tests print `failed=0` and `fail 0`.
- [x] T035 Check REQ-008 and record the output in AC-008 (`acceptance-criteria.md`). Verify: the store path prints one line and `the telemetry store` prints nothing.
- [x] T036 Check REQ-009 and record the output in AC-009 (`acceptance-criteria.md`). Verify: `speckit:complete` prints nothing and `speckit:plan` prints the Q0 and No Session lines.
- [x] T037 Check REQ-010 and record the output in AC-010 (`acceptance-criteria.md`). Verify: `<24h` prints nothing and `unbound handover` prints one line.
- [x] T038 Check REQ-011 and record the output in AC-011 (`acceptance-criteria.md`). Verify: the flag rows print two lines and the argument hint prints one line.
- [x] T039 Parse the merged workflow (`.skilled/commands/speckit/assets/speckit-resume.yaml`). Verify: `python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" $W` exits 0.
- [x] T040 Validate this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `acceptance-criteria.md` has no `Unmet` row and `ls .skilled/commands/speckit/assets/speckit-resume*.yaml` prints one file
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A task blocked by an unclosed phase 3 or phase 4 is marked `[B]` with the blocking phase named on the line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Each requirement names the ledger id it closes. Check: `rg -c '\(closes R[0-9]\)' spec.md` prints 11.
- [x] CHK-002 [P0] Both baseline tests pass before any edit. Check: T001 and T002 print `failed=0` and `fail 0`.
- [x] CHK-003 [P1] The phase 3 `execution_mode` shape is read. Check: `rg -n -A4 '^execution_mode:' .skilled/commands/speckit/assets/speckit-plan.yaml` prints the block.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The merged workflow parses as YAML. Check: T039 exits 0.
- [x] CHK-011 [P0] Both JSON files parse. Check: the T023 and T024 parse commands exit 0.
- [x] CHK-012 [P1] Every step named in `checkpoints:` exists. Check: T005 output names only keys that `rg -o '^  step_[0-9a-z_]+' $W` prints.
- [x] CHK-013 [P1] The merged file follows the lifecycle pattern. Check: `rg -n -e '^execution_mode:' -e '^mode_overrides:' $W` and the same command on `$A/speckit-plan.yaml` print the same two keys.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] AC-001 and AC-002 are `Met`. Check: T028 and T029 outputs are recorded in `acceptance-criteria.md`.
- [x] CHK-021 [P1] AC-003, AC-004 and AC-005 are `Met`. Check: T030, T031 and T032 print nothing.
- [x] CHK-022 [P1] AC-006 and AC-007 are `Met`. Check: T033 and T034 outputs, with both tests passing.
- [x] CHK-023 [P1] AC-008, AC-009, AC-010 and AC-011 are `Met`. Check: T035 to T038 outputs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each finding has a class. R1 and R8 are `algorithmic`. R5 is `cross-consumer`. R2, R3, R4, R6, R7 and R9 are `instance-only`. Check: this line matches the ledger rows in `../spec.md`.
- [x] CHK-FIX-002 [P0] Same-class producers are inventoried. Check: `rg -n -e 'by mtime' -e '\.opencode/specs' -e 'speckit:complete' $A/speckit-resume*` prints nothing after the change.
- [x] CHK-FIX-003 [P0] Consumers of the old file names are inventoried. Check: T003 lists seven files and `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` prints nothing at the end.
- [x] CHK-FIX-004 [P0] The detection rule covers its adversarial cases: a note owned by another session, a note with `spec_folder: none`, a note naming a missing folder and a malformed `session_ref`. Check: each case is named in `session_detection` of `$W`.
- [x] CHK-FIX-005 [P1] The matrix of mode by detection source has eight rows, each read in `$W`. Check: the rows are listed in `plan.md` Affected Surfaces.
- [x] CHK-FIX-006 [P1] The session id source is stated for runtimes without an id variable. Check: `rg -n 'CLAUDE_CODE_SESSION_ID' $W` prints one line inside `session_detection`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit. Check: each `Met` row in `acceptance-criteria.md` names the commit SHA it was observed on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] The workflow never prints the `session_ref.workspace` path, which `save-workflow.md` keeps out of the brief. Check: `rg -n 'workspace' $W` prints no line that adds it to the brief.
- [x] CHK-031 [P1] Detection never opens a handoff note owned by another session. Check: `rg -n -e 'claimed_by' -e 'session_id' $W` shows both compared to the calling session id.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] The router and the workflow name the same flags. Check: `--phase-folder` and `--no-redirect` appear in both `resume.md` and `$W`.
- [x] CHK-041 [P1] The router and the presentation name the same start-new command. Check: `rg -n 'speckit:plan' .skilled/commands/speckit/assets/speckit-resume-presentation.txt $W` prints lines in both.
- [x] CHK-042 [P2] The README names the merged file. Check: T022 prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temporary files live in this folder's `scratch/` only. Check: `git status --short` names no new file outside the changed files and `scratch/`.
- [x] CHK-051 [P1] `scratch/` is cleaned before completion. Check: `ls scratch/` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



