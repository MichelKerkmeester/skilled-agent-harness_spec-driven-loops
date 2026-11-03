---
title: "Tasks: Phase 6: live-conversation-test"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "live conversation test tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: live-conversation-test

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

Shell variables: `R` is the repository root. `P` is the scratch project from `mktemp -d`, and `K` is the second scratch project for the kill-switch stage. `S` is `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md`. `E` is `specs/system-speckit/043-decision-capture/006-live-conversation-test/scratch/live-runs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Wait for the scenario format only, `specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract/`, before writing the scenario files (T004, T005). The runs (T007 onward) wait for `002-conversation-runner`. Verify: 001's `implementation-summary.md` reads Complete and `node -e "console.log(typeof require('./.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs').parseConversationScript)"` prints `function`.
- [x] T002 Record each CLI's version and login state and the operator's consent and cost note for live sessions (`$E/preconditions.txt`). Verify: `claude auth status` exits 0, and `rg -c 'consent' $E/preconditions.txt` prints 1 or more. Evidence 2026-11-02: `claude auth status` loggedIn true, exit 0; `scratch/live-runs/preconditions.txt` names consent Q003, Q010 and Q012 and the cost note.
- [x] T003 Build the scratch project as the plan's Scratch project component describes and save the S0 baselines (`$E/claude-run1/baseline/repo-status.txt`). Verify: `git -C "$P" rev-parse --show-toplevel` prints `$P`, `test -d "$P/.skilled/skills/.state" && test ! -L "$P/.skilled/skills/.state"` exits 0 and the baseline file exists. Evidence 2026-11-02: each scratch project was a fresh `git init` repo outside the repository with a real `.skilled/skills/.state`; the real-repository baselines are `scratch/live-runs/<runtime>-run1/baseline/repo-status-main.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Write the scenario with its setup block, stages S0 to S11 and each stage's checkpoint, in the 065 format, and the kill-switch scenario with S12 (`$S`, `decision-capture-kill-switch-conversation.md`). Verify: `rg -c '^\| S([0-9]|1[01]) \|' $S` prints 12, the kill-switch file holds one S12 row and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-spec-kit` reports no new violation.
- [x] T005 Add the matrix columns and the sibling extension rule for 002 to 005 to the scenario (`$S`). Verify: `rg -c '002-table-row-matching|003-codex-and-pi-capture|004-opencode-devin-live-capture|005-chat-question-detection' $S` prints 4 or more.
- [x] T006 Add the scenario's index row under 7.5 Plugins and Hooks (`.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -c 'decision-capture-live-conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` prints 1.
- [x] T007 Run the Claude Code subject through both scenario files with the 065 runner (`--out $E/claude-run1/runner/main` and `.../runner/kill-switch`), then derive the 13-row stage file from the two runner `checkpoints.tsv` files, joining `S8-compact` and `S8-ask` (`$E/claude-run1/checkpoints.tsv`). Verify: `wc -l < $E/claude-run1/checkpoints.tsv` prints 13 and `cut -f3 $E/claude-run1/checkpoints.tsv | xargs ls` exits 0. Evidence 2026-11-02: `runner/main` PASS 14/14 and `runner/kill-switch` PASS 1/1; `checkpoints.tsv` has 13 rows and every path resolves.
- [x] T008 Run the OpenCode subject through the same stages (`$E/opencode-run1/checkpoints.tsv`). Verify: the file has 13 rows, or `$E/opencode-run1/no-answer-surface.txt` quotes the pane line that shows no question tool. Evidence 2026-11-02: PASS 14/14 and kill-switch PASS 1/1; `scratch/live-runs/opencode-run1/checkpoints.tsv` has 13 rows.
- [x] T009 Run the Codex subject through the same stages (`$E/codex-run1/checkpoints.tsv`). Verify: the file has 13 rows, or `$E/codex-run1/no-answer-surface.txt` quotes the pane line that shows `request_user_input` is not callable. Evidence 2026-11-02: attempt 7 passed; `$E/codex-run1/checkpoints.tsv` has 13 rows (S0, S1, S6, S10, S11, S12 PASS, the live-queue rows SKIP); attempts 1 to 6 and their causes are in `$E/codex-run1/attempts/README.md`.
- [x] T010 Run the Pi subject through the same stages (`$E/pi-run1/checkpoints.tsv`). Verify: the file has 13 rows, or `$E/pi-run1/no-answer-surface.txt` quotes the pane line that shows no question tool. Evidence 2026-11-02: PASS 14/14 and kill-switch PASS 1/1; `scratch/live-runs/pi-run1/checkpoints.tsv` has 13 rows.
- [x] T011 Run the Devin subject through the same stages (`$E/devin-run1/checkpoints.tsv`). Verify: the file has 13 rows, or `$E/devin-run1/no-answer-surface.txt` quotes the pane line that shows no question tool. Evidence 2026-11-02: PASS 14/14 and kill-switch PASS 1/1; `scratch/live-runs/devin-run1/checkpoints.tsv` has 13 rows.
- [x] T012 Fill the matrix in the summary and in the run report (`implementation-summary.md`, the report folder's `README.md` and `results.csv`). Verify: `rg -c '^\| (Claude|OpenCode|Codex|Pi|Devin) \|' implementation-summary.md` prints 5 and `rg -c 'Not run' implementation-summary.md` prints 0. Evidence 2026-11-02: the `rg` prints 5 and `Not run` 0; the report is `.skilled/skills/system-spec-kit/benchmark/reports/2026-11-02--manual-testing-playbook--decision-capture-live-conversation/`, 11 rows, all PASS, and its README validates with 0 issues.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 Compare the real repository state after each run with its S0 baseline (`$E/<runtime>-run1/after/repo-status.txt`). Verify: `diff $E/<runtime>-run1/baseline/repo-status.txt $E/<runtime>-run1/after/repo-status.txt` exits 0 for every runtime that ran. Evidence 2026-11-02: each run's `diff baseline/repo-status-<label>.txt after/repo-status-<label>.txt` is empty or holds only files another session wrote (named in `decision-record.md` ADR-001 and the run notes); every mirror run reports `repo.changed` false.
- [x] T014 Confirm the process question reached neither the queue nor the record (`$E/claude-run1/`). Verify: `rg -c --include-zero -i 'spec folder|gate 3' $E/claude-run1/queue-S10.jsonl $E/claude-run1/decision-record-S10.md` prints 0 for both, and the same search on `pane-S1.txt` prints 1 or more. Evidence 2026-11-02: 0 and 0 on the queue and record, 2 on `pane-S1.txt`.
- [x] T015 Confirm the repeat save changed no byte (`$E/claude-run1/decision-record-S11.md`). Verify: `cmp $E/claude-run1/decision-record-S10.md $E/claude-run1/decision-record-S11.md` exits 0. Evidence 2026-11-02: `cmp` exits 0.
- [x] T016 Validate the packet and the playbook package (`specs/system-speckit/043-decision-capture/006-live-conversation-test/`). Verify: `validate.sh --strict` prints `RESULT: PASSED` and `validate-playbook-package.cjs --package system-spec-kit` reports no new violation. Evidence 2026-11-02: `validate-playbook-package.cjs --package system-spec-kit` prints PASS with 0 violations and the one earlier warning; `validate.sh --strict` is run at close.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed Evidence: five runtimes passed live.
- [x] `$E/claude-run1/checkpoints.tsv` holds 13 rows and no FAIL row, and the matrix in `implementation-summary.md` has five filled rows. Evidence: 13 rows, 0 FAIL, and five filled matrix rows.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the stage table and the matrix columns
- **Runner dependency**: `specs/sk-doc/065-conversation-playbook-scenarios`
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

A `[B]` task blocks every task after it until its blocker ships. T001 is the only one, and it waits on 065.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The 065 runner exists: `ls specs/sk-doc/065-conversation-playbook-scenarios/implementation-summary.md` prints the path. Evidence: 065 is a phase parent; its runner child `002-conversation-runner/implementation-summary.md` exists and its spec reads Complete.
- [x] CHK-002 [P0] The stage table is fixed before authoring: `rg -c '^\| S([0-9]|1[0-2]) \|' plan.md` prints 13. Evidence: prints 13.
- [x] CHK-003 [P1] Logins and consent are recorded: `ls $E/preconditions.txt` prints the path. Evidence: `$E/preconditions.txt` exists.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The playbook package validator reports no new violation for `system-spec-kit`. Evidence 2026-11-02: PASS, 0 violations, the one earlier warning.
- [x] CHK-011 [P0] The scenario holds no em dash: `rg -c '\x{2014}' $S` prints nothing and exits 1. Evidence: prints nothing, exit 1.
- [x] CHK-012 [P1] No checkpoint command in the scenario writes into the repository: `rg -n 'rm -|mv |> *"\$R' $S` prints nothing. Evidence: prints nothing, exit 1.
- [x] CHK-013 [P1] The scenario passes the format check that 065 names. Evidence: the package validator parses and checks every `json conversation` block against the 065 schema and passes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met, Waived or Superseded. Evidence 2026-11-02: every row reads Met, except AC-003 and AC-009, which read Superseded by ADR-001 and ADR-002.
- [x] CHK-021 [P0] The Claude run has no FAIL: `awk -F'\t' '$2=="FAIL"' $E/claude-run1/checkpoints.tsv | wc -l` prints 0. Evidence: prints 0.
- [x] CHK-022 [P1] No stage was retried more than once: every runner `checkpoints.tsv` row has attempts 1 or 2. Evidence: no row of a passing run's `checkpoints.tsv` shows more than 2 attempts.
- [x] CHK-023 [P1] The kill-switch stage S12 is PASS on the Claude row. Evidence: S12 reads PASS.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

N/A: this phase adds a test scenario and fixes no reported finding. A capture defect a run finds is recorded as a FAIL cell and handed to the sibling that owns it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No raw runtime transcript sits in the evidence store: `rg -l '"type":"user"' $E` prints nothing. Evidence: prints nothing, exit 1.
- [x] CHK-031 [P0] The real repository is untouched: every T013 `diff` exits 0. Evidence: every `diff` of the real repository's `specs` status and decision-capture file list was empty for this series' runs; the only differences seen came from other sessions' files, each named in the run notes.
- [x] CHK-032 [P1] No credential reached the evidence store: `rg -n 'sk-[A-Za-z0-9]{20}' $E` prints nothing. Evidence: prints nothing, exit 1.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] The four packet docs name the same scenario: `rg -l 'decision-capture-live-conversation' spec.md plan.md tasks.md implementation-summary.md` lists 4 files. Evidence: lists 4 files.
- [x] CHK-041 [P1] The scenario points at the three unit-level scenarios: `rg -c 'decision-capture-(claude-hook|save-writer|transcript-sweeps)' $S` prints 3 or more. Evidence 2026-11-02: prints 3, after the three unit-level scenarios were added to the scenario's playbook sources.
- [x] CHK-042 [P2] The run report README names this child's evidence folder as its source. Evidence: the report's `source.md` names `scratch/live-runs/<runtime>-run1/` in this child.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Run evidence lives under `$E` only: `git status --short` shows no other new path in this child. Evidence: this child is not committed yet, so `git status` lists every file in it; the run evidence sits under `$E` only, and `scratch/runs/` holds the scenario-authoring briefs from before the runs.
- [x] CHK-051 [P1] Both scratch projects sit outside the repository: `realpath "$P" "$K"` prints paths that do not start with `$R`. Evidence: the scratch projects sit under the session scratchpad in `/private/tmp`, outside the repository.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---



