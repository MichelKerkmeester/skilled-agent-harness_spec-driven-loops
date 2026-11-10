---
title: "Tasks: Phase 7: dispatch-recognition-and-stress-adapter"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dispatch recognition and stress adapter tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: dispatch-recognition-and-stress-adapter

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

`H` is `.skilled/hooks/dispatch/lib/`. `S` is `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/`. Authoring mode is `sk-code` `sk-code-skilled`. Executor is `cli-codex gpt-6-luna xhigh fast`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phases 003 and 006 landed (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json`, `buildDshLineageCommand`). Verify: `ls` prints the file and `rg -n buildDshLineageCommand` on `fanout-run.cjs` prints a line.
- [ ] T002 Record baseline counts (`H/dispatch-audit.test.mjs`, `H/dispatch-rule-checks.test.mjs`, `S/cli-pi.vitest.ts`, `S/cli-hermes.vitest.ts`). Verify: all four pass, counts saved in `goal.md` section 4. Reason: pre-edit counts for Pi and Hermes were not captured.
- [x] T003 [P] Read `S/shims/adapter-shim-core.cjs` and decide whether it can express a JSON `final` with a separate exit code. Verify: the decision is recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Write the dsh positive and negative cases first (`H/dispatch-audit.test.mjs`). Verify: the new cases fail before T005. Reason: no committed or saved record proves the test-first order.
- [x] T005 Add the dsh task shape (`H/dispatch-audit.mjs`). Verify: `.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` reports 23 files and 2854 tests passed (`evidence/dispatch-audit-after.txt`).
- [x] T006 Add cases for the twelve declared rules (`H/dispatch-rule-checks.test.mjs`) and the checks (`H/dispatch-rule-checks.mjs`). Verify: `node --test` reports 50 passed and 0 failed (`evidence/rule-checks-after.txt`).
- [x] T007 Write the shim (`S/shims/dsh-shim.cjs`), extending `S/shims/adapter-shim-core.cjs` only if T003 says it must. Verify: `node --check` passes in `evidence/task-verify-outputs.txt`. The shared core stayed unchanged in `evidence/sibling-diff.txt`.
- [x] T008 Register the subject (`S/matrix-manifest.ts`, `S/fixtures/adapter-fixture.ts`, `S/fixtures/adapter-suite.ts`). Verify: subject registration is recorded in `evidence/task-verify-outputs.txt`.
- [x] T009 Write the stress suite (`S/cli-deepseek-harness.vitest.ts`). Verify: 18 tests pass and the live probe skips in `evidence/stress-dsh-pi-hermes-verbose.txt`.
- [x] T010 [P] List the shim and subject (`S/shims/README.md`, `S/README.md`). Verify: both README checks are in `evidence/task-verify-outputs.txt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Rerun both hook tests (REQ-001, REQ-002). Verify: dispatch audit reports 2854 passed under Vitest and rule checks report 50 passed, 0 failed (`evidence/dispatch-audit-after.txt`, `evidence/rule-checks-after.txt`).
- [x] T012 Rerun the dsh stress suite (REQ-003). Verify: 18 pass and 1 live-probe skip (`evidence/stress-dsh-pi-hermes-verbose.txt`).
- [x] T013 Rerun the sibling suites (REQ-004). Verify: Pi and Hermes pass and the diff exits 0 (`evidence/stress-dsh-pi-hermes-verbose.txt`, `evidence/sibling-diff.txt`).
- [x] T014 Validate the phase docs. Verify: strict validation prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` (`evidence/closeout-validation.txt`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`. Reason: T002 baseline counts and T004 test-first order remain unverified.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries the `[B]` state.
- [ ] Manual verification passed. Reason: all dsh coverage uses the shim. Live proof belongs to phase 013.
- [ ] Baseline and final counts for the four existing suites are recorded in `implementation-summary.md`. Reason: Pi and Hermes pre-edit counts were not captured.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase plan**: `../001-deep-research/research/phase-plan.md` section 4, `007-dispatch-recognition-and-stress-adapter`
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
| **[P1]** | Required | Must complete OR secure user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked by phase 003 or 006 is marked `[B]` with the missing file named and the phase stays open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
  - Evidence: the requirements table in `spec.md`.
- [ ] CHK-002 [P0] Baseline counts for the four existing suites are in `goal.md` section 4 before T004
  - Reason: pre-edit Pi and Hermes counts were not captured (`evidence/part-one-checks.txt`).
- [x] CHK-003 [P1] The shim-core decision from T003 is recorded
  - Evidence: `goal.md` section 4 records why the JSON stream uses a standalone shim.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check` exits 0 on all three files: `H/dispatch-audit.mjs`, `H/dispatch-rule-checks.mjs` and `S/shims/dsh-shim.cjs`
  - Evidence: `evidence/task-verify-outputs.txt`.
- [x] CHK-011 [P0] Every existing case in both hook tests still passes
  - Evidence: the audit and rule-check runs pass in `evidence/dispatch-audit-after.txt` and `evidence/rule-checks-after.txt`.
- [x] CHK-012 [P1] Each flagged rule names its id from `hard-rules.json`
  - Evidence: the current rule-check run and declared/implemented check guard pass in `evidence/rule-checks-after.txt`.
- [x] CHK-013 [P1] `rg -n -E 'specs/|packet [0-9]|phase [0-9]'` on the changed files adds no new match
  - Evidence: `evidence/task-verify-outputs.txt` records no new matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met
  - Evidence: AC-001 through AC-004 cite the passing hook and stress runs.
- [x] CHK-021 [P0] Negative cases cover the plugin, help, version and dump forms listed in REQ-001
  - Evidence: `evidence/dispatch-audit-after.txt`.
- [x] CHK-022 [P1] Positive cases cover env-wrapped and shell-wrapped forms
  - Evidence: `evidence/dispatch-audit-after.txt`.
- [x] CHK-023 [P1] The shim covers completed, error, denial, timeout, stdin and lineage-write scenarios
  - Evidence: `evidence/stress-dsh-pi-hermes-verbose.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] `rg -n 'API_KEY|\.env' S/shims/dsh-shim.cjs` returns nothing, so the shim reads no credential
  - Evidence: `evidence/task-verify-outputs.txt`.
- [x] CHK-031 [P0] A repo-root cwd is flagged by the rule checks
  - Evidence: `evidence/rule-checks-after.txt`.
- [ ] CHK-032 [P1] No test spawns the real `dsh` binary
  - Reason: the evidence says shims precede the real binary on PATH, but no test asserts that the real binary is never spawned (`evidence/task-verify-outputs.txt`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] The three docs list the same positive and negative shapes: `spec.md`, `plan.md` and `tasks.md`
  - Reason: `plan.md` was outside the requested closeout document set and remains unchecked.
- [ ] CHK-041 [P1] `S/README.md` states that the dsh live smoke waits on a keyed run
  - Reason: the README lists shim-only coverage but does not mention the keyed-run gate (`evidence/task-verify-outputs.txt`).
- [x] CHK-042 [P2] `S/shims/README.md` lists `dsh-shim.cjs` with its scenarios
  - Evidence: `evidence/task-verify-outputs.txt`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Baseline and run logs live in `scratch/` only
  - Reason: baseline and run logs remain under `evidence/`, including `evidence/part-one-checks.txt` and `evidence/stress-dsh-pi-hermes-verbose.txt`.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - Evidence: `evidence/task-verify-outputs.txt` lists only `.gitkeep` under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 7/8 |
| P1 Items | 10 | 6/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. Acceptance criteria are met. The phase remains In Progress while CHK-002, CHK-032, CHK-040, CHK-041 and CHK-050 remain open.
<!-- /ANCHOR:summary -->

---
