---
title: "Tasks: Phase 10: fix-alignment-report-findings-for-speckit-command-surfaces"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix alignment report findings for speckit command surfaces tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: fix-alignment-report-findings-for-speckit-command-surfaces

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

`K` is `.skilled/skills`. `A` is `.skilled/commands/speckit/assets`. `F` is this phase folder. `RUN` is `~/.local/state/local-skilled-alignment/381-speckit-command-gates-step-order-drift/20261114T170200Z`, the alignment run this phase closes. Finding ids such as `B-1` are the ids in `$RUN/findings.json`. Every command runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the run folder holds the findings and the fix plan (`$RUN/findings.json`). Verify: `aggregate-findings.cjs --run-dir $RUN` prints `findings=26 P0=1 P1=10 P2=15`.
- [x] T002 Record the baselines before any edit (`$F/scratch/baseline.txt`). Verify: the file shows `passed=131 failed=0`, the autopilot vitest at 4 passed, the ratchet with three routing suites at 31 passed, contract drift at exit 2 and `frontmatter-version verify` ok for five skills.
- [x] T003 Record the probe baseline (`$RUN/probes.json`). Verify: `run-probes.cjs --probes $RUN/probes-input.json` printed `pass=11 fail=6` before the edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Step counts (REQ-001)
- [x] T004 Set the complete and resume rows to 13 and 5, finding `B-1` (`$K/system-spec-kit/README.md`). Verify: `rg -n 'speckit:(complete|resume)\` \| (13|5) ' $K/system-spec-kit/README.md` prints lines 347 and 348.
- [x] T005 Write `sequential_13_step` and `13-step workflow`, finding `A-1` (`$A/speckit-complete.yaml`). Verify: `rg -n 'sequential_14|14-step' $A/speckit-complete.yaml` prints nothing.
- [x] T006 Set the Python bridge rows to 7-step and 13-step, finding `B-6`, then run `derive-command-bridges.cjs` (`$K/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`). Verify: `derive-command-bridges.cjs --check` prints `"changed": []`.

### Removed files and detection model (REQ-002)
- [x] T007 Replace the auto and confirm asset rows with one workflow row that also names `/speckit:resume`, finding `B-2` (`$K/sk-doc/sk-create-command/assets/command-contract.json`). Verify: `rg -n 'speckit-<name>-(auto|confirm)\.yaml' ` on that file prints nothing.
- [x] T008 Describe detection as CLI argument, handoff note, `session_ref`, then the No Session result, and `handover.md` at any age, finding `B-3` (`$K/system-spec-kit/feature-catalog/retrieval/session-recovery-spec-kit-resume.md`). Verify: `rg -n 'strongest session candidate|24h' ` on that file prints nothing.
- [x] T009 Rewrite the scenario contract, the commands and the expected text to the same detection order, finding `K-1` (`$K/system-spec-kit/manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md`). Verify: `rg -c 'session detection, and final next-step guidance work' ` on that file prints 2, the two prompt copies.
- [x] T010 Name the shared include as the home of the `Generate LITERAL phase names` activity, finding `B-4` (`$K/system-spec-kit/feature-catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md`). Verify: `rg -n 'four' ` on that file prints nothing.
- [x] T011 State that plan, implement and complete all route to their single workflow under `unattended_autopilot`, finding `B-5` (`$K/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md`). Verify: `rg -n 'All three route to their single workflow' ` on that file prints line 27.
- [x] T012 List the five detection values, finding `D-4`, and add the Not-Matched Candidate Panel, finding `K-2` (`$A/speckit-resume-presentation.txt`). Verify: `rg -n '^Detection:|Not-Matched Candidate Panel' ` on that file prints lines 74 and 94.

### Metadata and order (REQ-003, REQ-004)
- [x] T013 Copy the resume and search argument hints from the router frontmatter, findings `D-6` and `D-7` (`$K/system-spec-kit/command-metadata.json`). Verify: `command-catalog-mirror-check.cjs` prints no `/speckit:` line.
- [x] T014 List `step_6_7_acceptance_verify` after `step_6_development` in `checkpoints`, finding `A-2` (`$A/speckit-implement.yaml`). Verify: the `checkpoints` list at line 11 matches the step keys under `workflow:` in order.

### Tests and scenario command (REQ-005, REQ-006)
- [x] T015 Pin the `predicate_grammar`, `checkpoint_options` and `documentation_levels` pointers on plan, implement and complete, finding `K-3` (`$K/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: the test prints `passed=143 failed=0`, and with one pointer removed from `speckit-implement.yaml` it prints `passed=142 failed=1` and exits 1.
- [x] T016 Assert that no lifecycle sequence holds `merge_on_clean`, finding `A-3` (`$K/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts`). Verify: vitest prints 5 passed, and with `merge_on_clean` added to `speckit-implement.yaml` it prints 1 failed.
- [x] T017 Split the fence-rule check into one `rg` per file, each with that file's wording, finding `B-7` (`$K/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md`). Verify: each of the three `rg` commands the scenario names exits 0.

### Routing and generated contracts (REQ-007, REQ-008)
- [x] T018 Add four phrases at the end of `intent_signals`, findings `PRB-01`, `PRB-03`, `PRB-04` and `D-10`, then run `skill_graph_compiler.py --export-json` (`$K/system-spec-kit/graph-metadata.json`). Verify: `run-probes.cjs` prints `pass=14 fail=3`.
- [x] T019 Reword `search the spec folders` to `spec folders for the phrase`, because the first form moved the pinned prompt `rr-iter3-061` from `sk-code` to `system-spec-kit` (`$K/system-spec-kit/graph-metadata.json`). Verify: vitest `tests/parity/local-native-divergence-ratchet.vitest.ts` prints 9 passed.
- [x] T020 Regenerate the three compiled deep-loop contracts with `compile-command-contracts.cjs --command <c> --write`, finding `BAT-01` (`.skilled/commands/deep/assets/compiled/`). Verify: `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T021 Rerun the requirement checks from the final state (`spec.md` section 4). Verify: each command of REQ-001 to REQ-004 and REQ-008 prints what its acceptance row states.
- [x] T022 Rerun the advisor suites (`$K/system-skill-advisor/runtime`). Verify: before the merge, vitest over `tests/parity` and the nine routing suites prints `Test Files 17 passed` and `Tests 145 passed`. On the merge commit it prints `144 passed` and `1 failed`, the row `cmd-design-extract-plain-holdout-01` of `command-routing-slice.vitest.ts`, which fails the same way on origin/main `c1dbb1bcc4` without this phase. The cause is `40b8d7e6b7` and its sk-code phrase `the stylesheet`, not `c75c1d8236`. The phrase stays because REQ-005 of sk-code's frontend-reach phase needs it, and the baseline was recaptured: the default suite `npm test` then passes, and `skill-advisor-stress.yml` runs that suite on changes under the advisor runtime path.
- [x] T023 Rerun the alignment recheck (`$RUN`). Verify: `recheck.cjs --from $RUN` prints `resolved=8 still_open=2 new=0`, where the two still open are `C-3`, which is out of scope, and the package check that cannot run without `node_modules`.
- [x] T024 Rerun the whole battery from the final state (`$RUN/scope.json`). Verify: `run-battery.cjs --scope $RUN/scope.json` prints `fail=0`.
- [x] T025 Validate the packet (`$F/..`). Verify: `validate.sh --recursive --strict` prints `RESULT: PASSED` for the parent and every child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the recheck of run `20261114T170200Z` lists no literal finding of this phase as still open
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4 holds REQ-001 to REQ-009.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3 names the source-then-generator pattern.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: vitest ran in both runtimes, and `scratch/baseline.txt` holds the starting numbers.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `quality-gate.cjs --files` on the two changed test files exits 0.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: `test-phase-command-workflows.js` prints `passed=143 failed=0` and the autopilot vitest prints 5 passed.
- [x] CHK-012 [P1] Error handling implemented. Evidence: `extractLifecycleSequence` throws when the block is missing, so the new assertion cannot pass on an empty list.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: both additions reuse the helpers and the assertion style already in each file.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` has no `Unmet` row.
- [x] CHK-021 [P0] Manual testing complete. Evidence: `run-probes.cjs` prints `pass=14 fail=3`, and the three left are P08, P13 and P14.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the prompt `Add a packet-local helper that formats Gate 3 confusion-matrix rows for the research summary.` still returns `sk-code` first.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: each new assertion was watched failing with its defect put back into `speckit-implement.yaml`, then passing after the restore.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the stale counts and stale detection text are `class-of-bug`, the metadata hints and the generated bridges are `cross-consumer`, the two test gaps and the goal-hook command are `matrix/evidence`, and the routing probes are `algorithmic`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the stale-count pattern of `plan.md` over `.skilled/commands/speckit` and the advisor scripts prints nothing.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `plan.md` FIX ADDENDUM lists each generated consumer, and `derive-command-bridges.cjs --check` and `check-contract-drift.cjs` both exit 0.
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction fix is in this phase.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: seventeen probe prompts by one expected skill each, plus the D-10 prompt.
- [x] CHK-FIX-006 [P1] N/A. The changed tests read workflow files only, no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned. Evidence: the checks ran on commit `7d9202ad1b` and again on the merge commit `e13f670cb9`, and the run folder is fixed at `20261114T170200Z`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff holds text, metadata and two test files.
- [x] CHK-031 [P0] N/A. No input is parsed by anything this phase adds.
- [x] CHK-032 [P1] N/A. No auth surface is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: `spec.md`, `plan.md` and this file name the same findings and the same files.
- [x] CHK-041 [P1] Code comments adequate. Evidence: each new comment states why the pointer or the sequence is pinned, with no id or spec path.
- [x] CHK-042 [P2] README updated. Evidence: `.skilled/skills/system-spec-kit/README.md` lines 347 and 348.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: `scratch/` holds `baseline.txt` and nothing else.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the probe rerun output beside the run folder was removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



