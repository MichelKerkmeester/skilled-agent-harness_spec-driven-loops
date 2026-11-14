---
title: "Tasks: Phase 4: code-review-and-dispatch-policy"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "code review and dispatch policy tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: code-review-and-dispatch-policy

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

Run every command from the repository root.
- `A` is `.skilled/commands/speckit/assets`
- `P` is `specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm phases 1 to 3 are closed (`$P/003-execution-mode-and-autopilot-contract/acceptance-criteria.md`). Verify: `rg -l '\| Unmet \|' $P/00[123]-*/acceptance-criteria.md` prints nothing.
- [ ] T002 Read the review step keys phase 1 left (`$A/speckit-implement.yaml`). Verify: `rg -n 'available_at_step' $A/speckit-implement.yaml $A/speckit-complete.yaml` prints step numbers that match step keys under `workflow:` in each file.
- [ ] T003 Record the test baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `Result: passed=150 failed=0` or the count phases 1 to 3 left, with `failed=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Review step
- [ ] T004 Add the `@review` dispatch as the first activity of the step `agent_availability.review.available_at_step` names, with the `CODE-REVIEW` first line, Gate Validation mode, `gate_type: post_execution`, the spec folder and the changed files (`$A/speckit-implement.yaml`). Verify: `awk '/^workflow:/{w=1} w && /CODE-REVIEW/{n++} END{print n+0}' $A/speckit-implement.yaml` prints 1 or more.
- [ ] T005 Add the verdict branch: `REQUESTED_CHANGES` blocks the summary, returns to development once and halts on a second FAIL (`$A/speckit-implement.yaml`). Verify: `awk '/^workflow:/{w=1} w && /REQUESTED_CHANGES/{n++} END{print n+0}' $A/speckit-implement.yaml` prints 1 or more.
- [ ] T006 Replace `dual_phase` with the one Gate Validation mode and add the line that the `general` fallback keeps the blocking verdict (`$A/speckit-implement.yaml`). Verify: `rg -n dual_phase $A/speckit-implement.yaml` prints nothing.
- [ ] T007 Add the `@review` dispatch as the first activity of the step `agent_availability.review.available_at_step` names (`$A/speckit-complete.yaml`). Verify: `awk '/^workflow:/{w=1} w && /CODE-REVIEW/{n++} END{print n+0}' $A/speckit-complete.yaml` prints 1 or more.
- [ ] T008 Add the same verdict branch to that step (`$A/speckit-complete.yaml`). Verify: `awk '/^workflow:/{w=1} w && /REQUESTED_CHANGES/{n++} END{print n+0}' $A/speckit-complete.yaml` prints 1 or more.
- [ ] T009 Replace `dual_phase` with the one Gate Validation mode and move the keep-blocking rule from `circuit_breaker.agents` into `agent_availability.review` (`$A/speckit-complete.yaml`). Verify: `rg -n -e dual_phase -e '^  agents: ' $A/speckit-complete.yaml` prints nothing.

### Plan dispatch policy
- [ ] T010 Remove `parallel_dispatch_config`, `multi_agent_config` and `step_3_specification.pre_phase_parallel_check` (`$A/speckit-plan.yaml`). Verify: `rg -n -e parallel_dispatch_config -e multi_agent_config -e pre_phase_parallel_check -e session_preference_s $A/speckit-plan.yaml` prints nothing.
- [ ] T011 Drop `model: opus` from `step_5_planning.inline_parallel_exploration.execution` (`$A/speckit-plan.yaml`). Verify: `rg -n 'subagent_type: context.*model:' $A/speckit-plan.yaml` prints nothing.
- [ ] T012 Rewrite the four explorer prompts to ask for findings with paths and lines, remove the `Query Code Graph` line and change the verification approach to "Verify each finding" (`$A/speckit-plan.yaml`). Verify: `rg -n -e 'Query Code Graph' -e hypothesis $A/speckit-plan.yaml` prints nothing.
- [ ] T013 Replace "Phase 0: Generate research/research.md" with recording unknowns in `plan.md` Technical Context and naming `/deep:research`, and drop `research/research.md` from `outputs` (`$A/speckit-plan.yaml`). Verify: `rg -n -e 'Generate research/research' -e 'outputs: \[plan.md, research/research.md\]' $A/speckit-plan.yaml` prints nothing.
- [ ] T014 Change the `agent_availability.deep-research` condition from below 60 to below 40 percent (`$A/speckit-plan.yaml`). Verify: `rg -n 'confidence < 40' $A/speckit-plan.yaml` prints one line.

### Complete copies and unread config
- [ ] T015 Drop `model: opus` from `step_6_planning.inline_parallel_exploration.execution` (`$A/speckit-complete.yaml`). Verify: `rg -n 'subagent_type: context.*model:' $A/speckit-complete.yaml` prints nothing.
- [ ] T016 Rewrite the four explorer prompts and the verification approach as in T012 (`$A/speckit-complete.yaml`). Verify: `rg -n -e 'Query Code Graph' -e hypothesis $A/speckit-complete.yaml` prints nothing.
- [ ] T017 Replace the Phase 0 `research/research.md` activity and output in `step_6_planning` as in T013 (`$A/speckit-complete.yaml`). Verify: `rg -n -e 'Generate research/research' -e 'research/research.md: resolved_unknowns' $A/speckit-complete.yaml` prints nothing.
- [ ] T018 Change `agent_availability.deep-research` and `phase_3_research.condition` from below 60 to below 40 percent (`$A/speckit-complete.yaml`). Verify: `rg -n -e 'confidence < 40' -e 'confidence_score < 40' $A/speckit-complete.yaml` prints three lines.
- [ ] T019 Change the pointer in `step_10_development` from `agent_dispatch.review.standards_contract` to `agent_availability.review.standards_contract` and leave the rest of the line to phase 7 (`$A/speckit-complete.yaml`). Verify: `rg -c 'agent_availability.review.standards_contract' $A/speckit-complete.yaml` prints 1.
- [ ] T020 Remove `multi_agent_config` and `quality_standards` (`$A/speckit-complete.yaml`). Verify: `rg -n -e '^multi_agent_config:' -e '^quality_standards:' $A/speckit-complete.yaml` prints nothing.
- [ ] T021 Remove `multi_agent_config` (`$A/speckit-implement.yaml`). Verify: `rg -n '^multi_agent_config:' $A/speckit-implement.yaml` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T022 Check REQ-001 in both lifecycle files (`$A/speckit-complete.yaml`). Verify: the `CODE-REVIEW` awk counter prints 1 or more on `$A/speckit-implement.yaml` and 1 or more on `$A/speckit-complete.yaml`.
- [ ] T023 Check REQ-002 in both lifecycle files (`$A/speckit-implement.yaml`). Verify: the `REQUESTED_CHANGES` awk counter prints 1 or more on each file and `rg -n dual_phase $A/` prints nothing.
- [ ] T024 Check REQ-003 (`$A/speckit-plan.yaml`). Verify: `rg -c 'subagent_type: context' $A/speckit-plan.yaml` prints 1 and the T010 command prints nothing.
- [ ] T025 Check REQ-004 (`$A/speckit-plan.yaml`). Verify: `rg -n -e 'Generate research/research' -e 'research/research.md: resolved_unknowns' -e 'outputs: \[plan.md, research/research.md\]' $A/speckit-plan.yaml $A/speckit-complete.yaml` prints nothing.
- [ ] T026 Check REQ-005 (`$A/speckit-complete.yaml`). Verify: `rg -n 'agent_dispatch.review' $A/` prints nothing.
- [ ] T027 Check REQ-006 (`$A/speckit-complete.yaml`). Verify: `rg -n -e '^multi_agent_config:' -e '^quality_standards:' -e '^  agents: ' $A/speckit-complete.yaml $A/speckit-implement.yaml` prints nothing.
- [ ] T028 Check REQ-007 (`$A/speckit-plan.yaml`). Verify: `rg -n 'subagent_type: context' $A/speckit-plan.yaml $A/speckit-complete.yaml` prints two lines and `rg -c 'model: opus' $A/` prints nothing.
- [ ] T029 Check REQ-008 (`$A/speckit-plan.yaml`). Verify: `rg -n -e 'Query Code Graph' -e hypothesis $A/speckit-plan.yaml $A/speckit-complete.yaml` prints nothing.
- [ ] T030 Check REQ-009 (`$A/speckit-plan.yaml`). Verify: `rg -n -e 'confidence < 60' -e 'confidence_score < 60' $A/` prints nothing.
- [ ] T031 Run the command workflow test (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: it prints a `Result:` line with `failed=0`.
- [ ] T032 Confirm no file outside the three workflows changed (`.skilled/commands/speckit/`). Verify: `git diff --name-only -- .skilled/ .claude/` prints only `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` under `$A`.
- [ ] T033 Validate this phase folder (`$P/004-code-review-and-dispatch-policy/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/004-code-review-and-dispatch-policy --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `acceptance-criteria.md` has no `Unmet` row and the command workflow test prints `failed=0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent Findings Ledger**: See `../spec.md`, rows D1 to D7
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

A task marked `[B]` names its blocker on the same line. A `[B]` task that a P0 requirement depends on blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Phases 1 to 3 are closed: `rg -l '\| Unmet \|' $P/00[123]-*/acceptance-criteria.md` prints nothing
- [ ] CHK-002 [P0] The review step keys exist: each `available_at_step` value in implement and complete matches a step key under `workflow:`
- [ ] CHK-003 [P1] The test baseline is recorded: `test-phase-command-workflows.js` prints `failed=0` before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] The three workflow files still load in the test harness: `test-phase-command-workflows.js` prints `failed=0`
- [ ] CHK-011 [P0] No workflow overrides an agent file's model: `rg -c 'model: opus' $A/` prints nothing
- [ ] CHK-012 [P1] The review FAIL path ends: the edited step names one re-dispatch and a halt on the second `REQUESTED_CHANGES`
- [ ] CHK-013 [P1] No step key is added: `rg -c '^  step_' $A/speckit-implement.yaml` prints the same count before and after
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] AC-001: the `CODE-REVIEW` awk counter prints 1 or more on implement and on complete
- [ ] CHK-021 [P0] AC-002: the `REQUESTED_CHANGES` awk counter prints 1 or more on each file and `rg -n dual_phase $A/` prints nothing
- [ ] CHK-022 [P0] AC-003: plan holds one `subagent_type: context` line and no `parallel_dispatch_config` or `multi_agent_config`
- [ ] CHK-023 [P0] AC-004: no `research/research.md` write remains in plan or complete planning
- [ ] CHK-024 [P1] AC-005: `rg -n 'agent_dispatch.review' $A/` prints nothing
- [ ] CHK-025 [P1] AC-006: no `multi_agent_config`, `quality_standards` or `circuit_breaker.agents` in implement or complete
- [ ] CHK-026 [P1] AC-007: no `@context` dispatch names a model
- [ ] CHK-027 [P1] AC-008: no `Query Code Graph` or `hypothesis` text in plan or complete
- [ ] CHK-028 [P1] AC-009: no research trigger below 60 percent remains
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: D2 `cross-consumer`, D1 and D4 `class-of-bug`, D3 `instance-only`, D5, D6 and D7 `class-of-bug` because complete carries the same text as plan.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n -e 'model: opus' -e 'confidence < 60' -e 'confidence_score < 60' -e 'Query Code Graph' $A/` prints nothing after the change.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: `rg -n -e multi_agent_config -e parallel_dispatch_config -e quality_standards .skilled/ --glob '!**/node_modules/**'` lists no reader outside the removed blocks, and the `dispatch_mode` readers are handed to phase 8.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction code changes. The edits are workflow text.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: three workflow files by findings D1 to D7, as `plan.md` names them.
- [ ] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state from these edits.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the commit SHA that edits the three workflow files, written in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No dispatch prompt grants a write tool: `@context` keeps `Read, Grep, Glob` and `@review` keeps `Read, Bash, Grep, Glob` in their agent files
- [ ] CHK-031 [P0] The review prompt passes file paths, not file contents
- [ ] CHK-032 [P1] N/A: the phase adds no authentication or authorization surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three workflow files and the same step keys
- [ ] CHK-041 [P1] No comment added to a workflow file carries a spec path, phase number or finding id
- [ ] CHK-042 [P2] N/A for the README here: phase 8 aligns `README.txt` and the presentation files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Temp files live only in this phase's `scratch/` folder
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
