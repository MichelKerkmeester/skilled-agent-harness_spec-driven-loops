---
title: "Tasks: Phase 6: deep-loop-executor-kind"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep loop executor kind tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: deep-loop-executor-kind

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

`R` is `.skilled/skills/system-deep-loop/runtime/`. `U` is `R/tests/unit/`. Authoring mode is `sk-code` `sk-code-skilled`, then `sk-code-quality` for T013. Executor is `cli-codex gpt-6-luna xhigh fast`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phases 002 and 004 landed (`../002-dsh-offline-contract-pin/evidence/headless-help.txt`, `.dsh/patches/lineage.patch.yml`). Verify: both paths are listed in `evidence/task-verify-outputs.txt`.
- [x] T002 Record the unit baseline (`U`). Verify: `evidence/baseline-unit.txt` records 139 files, 2503 tests passed and exit 0. The count is also in `goal.md` section 4.
- [x] T003 [P] Inventory every kind table (`R/lib`, `R/scripts`). Verify: `evidence/kind-table-inventory.txt` records the `rg -n "'cli-hermes'" R/lib R/scripts` output.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add the kind to every config table and leave it out of defaults (`R/lib/deep-loop/executor-config.ts`). Verify: the inventory and config checks are recorded in `evidence/kind-table-inventory.txt` and `evidence/task-verify-outputs.txt`. The focused suites pass in `evidence/focused-suites-after.txt`.
- [x] T005 Add the binary map, state env, default home and env allowlist with no recursion exemption (`R/lib/deep-loop/executor-audit.ts`). Verify: the binary map and env-filter checks are in `evidence/task-verify-outputs.txt`. The focused suites pass in `evidence/focused-suites-after.txt`.
- [x] T006 Add `buildDshLineageCommand`, the adapter map entry, the version probe and JSON-final validation (`R/scripts/fanout-run.cjs`). Verify: the builder and adapter map are in `evidence/task-verify-outputs.txt`. The focused suites pass in `evidence/focused-suites-after.txt`.
- [x] T007 [P] Add config tests (`U/executor-config.vitest.ts`). Verify: the focused run reports 4 files and 356 tests passed in `evidence/focused-suites-after.txt`.
- [x] T008 [P] Add exact-argv, stdin, cwd, timeout and final-handling tests (`U/fanout-run.vitest.ts`). Verify: the focused run reports 4 files and 356 tests passed in `evidence/focused-suites-after.txt`.
- [x] T009 [P] Add matrix rows and exclusions (`U/combo-matrix.vitest.ts`). Verify: the focused run reports 4 files and 356 tests passed in `evidence/focused-suites-after.txt`.
- [x] T010 [P] Add env drop-list and recursion tests (`U/executor-audit.vitest.ts`). Verify: the env and recursion checks are in `evidence/task-verify-outputs.txt`. The focused suites pass in `evidence/focused-suites-after.txt`.
- [x] T011 Document the builder (`R/feature-catalog/fanout/fanout-run.md`). Verify: the builder entry is in `evidence/task-verify-outputs.txt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T012 Rerun the four suites and the full unit directory (REQ-001). Verify: the focused run passed 4 files and 356 tests (`evidence/focused-suites-after.txt`). The later full-unit run passed 139 files and 2524 tests with exit 0 after the latest code mtime (`evidence/full-unit-current.txt`). The baseline was 139 files and 2503 tests (`evidence/baseline-unit.txt`).
- [ ] T013 Quality pass with `sk-code-quality` on the three runtime files. Verify: no quality report is recorded for this closeout.
- [ ] T014 Check default allowlist absence (REQ-005). Verify: the saved global grep includes registry entries and does not isolate every default table (`evidence/task-verify-outputs.txt`).
- [x] T015 Validate the phase docs. Verify: strict validation prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` (`evidence/closeout-validation.txt`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`. Reason: T013 has no recorded quality report and T014 lacks an isolated default-table search.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries the `[B]` state.
- [ ] Manual verification passed. Reason: this phase has no keyed or live run.
- [x] The baseline and final unit counts are both recorded in `implementation-summary.md`. Evidence: `implementation-summary.md` cites the 139-file, 2503-test baseline and the 139-file, 2524-test final run.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase plan**: `../001-deep-research/research/phase-plan.md` section 4, `006-deep-loop-executor-kind`
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

A task blocked by phase 002 or 004 is marked `[B]` with the missing file named and the phase stays open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
  - Evidence: the requirements table in `spec.md`.
- [x] CHK-002 [P0] The unit baseline counts are in `goal.md` section 4 before T004
  - Evidence: `goal.md` section 4 and `evidence/baseline-unit.txt` record 139 files and 2503 passed.
- [x] CHK-003 [P1] The kind-table inventory is recorded
  - Evidence: `evidence/kind-table-inventory.txt`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The runtime's TypeScript check exits 0 after the edit
  - Evidence: `evidence/tsc-noemit.txt`.
- [x] CHK-011 [P0] `node --check R/scripts/fanout-run.cjs` exits 0
  - Evidence: `evidence/task-verify-outputs.txt`.
- [x] CHK-012 [P1] Every existing kind's tests pass unchanged
  - Evidence: the full unit run reports 139 files and 2524 tests passed, exit 0 (`evidence/full-unit-current.txt`).
- [ ] CHK-013 [P1] `rg -n -E 'specs/|packet [0-9]|phase [0-9]'` on the changed runtime files adds no new match
  - Reason: `evidence/task-verify-outputs.txt` records two added test-fixture matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] All acceptance criteria met
  - Reason: AC-005 remains unmet because the search does not isolate every default table.
- [x] CHK-021 [P0] The exact-argv test asserts every flag in order and stdin `-`
  - Evidence: `evidence/focused-suites-after.txt`.
- [x] CHK-022 [P0] Failure tests cover non-zero exit, a missing `final`, an `error` event and a non-`completed` reason
  - Evidence: `evidence/focused-suites-after.txt`.
- [x] CHK-023 [P1] The recursion test refuses a nested `dsh` with no self-presence exemption
  - Evidence: `evidence/focused-suites-after.txt`.
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

- [x] CHK-030 [P0] The env test drops inherited `DSH_HOME`, `DEEPSEEK_API_KEY` and `DSH_TELEMETRY_OTLP_URL` plus `OPENCODE_FOO`
  - Evidence: `evidence/task-verify-outputs.txt` and `evidence/focused-suites-after.txt`.
- [x] CHK-031 [P0] The builder sets cwd to the lineage directory, never the repo root
  - Evidence: `evidence/focused-suites-after.txt`.
- [x] CHK-032 [P1] The runner sets a fresh `DSH_HOME` under system temp and removes it after the lineage
  - Evidence: the lifecycle test passes in `evidence/focused-suites-after.txt`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] The three docs state the same argv and env allowlist: `spec.md`, `plan.md` and `tasks.md`
  - Reason: `plan.md` was outside the requested closeout document set and remains unchecked.
- [x] CHK-041 [P1] `fanout-run.md` documents the dsh builder and marks the kind experimental
  - Evidence: `evidence/task-verify-outputs.txt`.
- [ ] CHK-042 [P2] Code comments name the durable reason for the missing recursion exemption
  - Reason: the saved check finds the exemption list but no comment that records this reason (`evidence/task-verify-outputs.txt`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Inventories and run logs live in `scratch/` only
  - Reason: the inventory and run logs remain in `evidence/` (`evidence/kind-table-inventory.txt`, `evidence/focused-suites-after.txt`).
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - Evidence: `evidence/task-verify-outputs.txt` lists only `.gitkeep` under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 8/9 |
| P1 Items | 9 | 6/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-06. Partly verified. AC-005 remains unmet. CHK-013, CHK-040 and CHK-050 also remain open for the reasons above.
<!-- /ANCHOR:summary -->

---
