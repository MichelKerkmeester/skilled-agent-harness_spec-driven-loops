---
title: "Tasks: Claude relaunch loop"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "Claude relaunch tasks"
  - "Claude relaunch verification checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Claude relaunch loop

This checklist records phase 001 task status and the evidence behind each verified item. Items without a receipt remain open.

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
Before starting a task:
1. [ ] Read spec.md, plan.md and tasks.md.
2. [ ] Confirm the lane and its file list.
3. [ ] Check that prior lane gates and dependencies passed.
4. [ ] Identify the AC row and plan section 11 check that prove the task.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow the lane order. Spikes precede tests, tests precede builds, reviews follow builds, docs precede Gate PG. |
| TASK-SCOPE | Touch only the file list assigned to the lane. |
| TASK-VERIFY | Rerun the lane checks from the final state and read output and exit code. |
| TASK-REVIEW | A review waits for its build. Dispatch only on disjoint file lists, with at most one Luna and one SWE run at a time. |

### Status Reporting Format

STATUS <gate> | <phase/lane> | evidence: <cmd> rc=<n> | open halts: <ids or none> | next: <lane>

### Blocked Task Protocol
1. Record the blocking fact, evidence and applicable halt ID in the ledger.
2. For a stalled dispatch, kill the captured PID and re-dispatch once with a narrower brief. A second stall on the same lane goes to H4.
3. After three fixes for the same symptom, escalate under H4. Stop immediately for H1 or H9. Under H10, record the live-run failure and continue other work without claiming C3.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Lane 1.0 read-only probe recorded. Evidence: run-ledger.md, Lane 1.0.
- [x] T002 Lane 1.1 SWE spike captured and accepted. Evidence: run-ledger.md, D1 result and scratch/spike/SPIKE-REPORT.md.
- [x] T003 Gate S1 answers were first recorded in run-ledger.md at 22:31 before lane 1.2 began, then moved into implementation-summary.md at closure (lane 1.9). The planned location differed, but the answers were available before tests. Evidence: run-ledger.md, Deviation: S1 answers location and implementation-summary.md, S1 Answers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Lane 1.2 tests preceded implementation and the red run recorded 64 assertion failures with no syntax or import errors. Evidence: run-ledger.md, Red run.
- [x] T005 Core, context reader and CLI landed, were reviewed, fixed and accepted at 76/76 tests. Evidence: run-ledger.md, D9, D10, D15, D17 and D18.
- [x] T006 Killer and wrapper landed, received review and follow-up fixes, then passed the 101-test suite and shell checks. Evidence: run-ledger.md, D11, D14, D16, D19 and D22.
- [x] T007 Claude adapters and registry rows passed sync and the registry vitest. Review follow-ups were accepted. Evidence: run-ledger.md, D12, D20, D23 and Gate PG, PG2.
- [x] T008 The runtime-mirror checker results are recorded. sync-runtime-mirrors --check passed at 189, codex sync-agents --check passed at 11, agent-roster-mirror-check returned STATUS=OK, install-codex-hooks --check --allow-worktree returned OK and pi sync-agents-pi --check passed at 11. The scan found missing Codex and Pi handoff prompt stubs and catalog drift at 39/40 commands with the speckit count at 6/7. The orchestrator generated .codex/prompts/speckit-handoff.md and .pi/prompts/speckit-handoff.md, one of 38 each. Both prompt rechecks passed at 38. Evidence: run-ledger.md, Doctor runtime-mirrors.
- [x] T009 The phase documentation set passed its recorded validators. Evidence: run-ledger.md, D21 and D24.
- [x] T010 Added the five switches to ENV-REFERENCE.md. Evidence: run-ledger.md, D8 and D21.
- [x] T011 Added the five switches to hook-flags.env.example. Evidence: run-ledger.md, D8 and D21.
- [x] T012 Updated the hooks README with the relaunch concern. Evidence: run-ledger.md, D8 and D21.
- [x] T013 Added the session-relaunch README with the documented usage and protocol. Evidence: run-ledger.md, D21.
- [x] T014 Updated the injection contract with the nudge row. Evidence: run-ledger.md, D21.
- [x] T015 Updated the bin README for skilled-loop. Evidence: run-ledger.md, D21.
- [x] T016 Added the feature-catalog entry. Evidence: run-ledger.md, D21.
- [x] T017 Updated the feature-catalog index. Evidence: run-ledger.md, D21.
- [x] T018 Added Claude scenarios and recorded their automatable or live results. Evidence: run-ledger.md, D21 and PG7 playbook results.
- [x] T019 Updated the manual-testing-playbook index. Evidence: run-ledger.md, D21.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Gate PG, the live Claude relaunch and the forced killer-timeout run are recorded. Evidence: run-ledger.md, Gate PG, Live runs 1 and 2.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 through T020 have evidence and their lane order is complete. T003 and T008 now include their closure receipts. Evidence: this task list and run-ledger.md, D6, D7 and Doctor runtime-mirrors.
- [x] Every AC row is Met and has evidence. AC-004 is supported by the named non-descendant behavior test. Evidence: acceptance-criteria.md, AC-004 and tests/killer.test.cjs:219.
- [x] Strict child validation reports RESULT: PASSED. The earlier SOURCE_FINGERPRINT_MISMATCH and description drift no longer appear; the orchestrator rerun from the final state (2026-10-18) gave Errors: 0, Warnings: 1.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Acceptance criteria**: See acceptance-criteria.md
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Cannot claim phase Done until complete. |
| [P1] | Required | Must complete or receive user-approved deferral. |
| [P2] | Optional | Can defer with documented reason. |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Lane order, Gate S1 and the test-first sequence are defined in plan section 4. Evidence for phase completion is listed below.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-001 [P0] The explicit node:test suite ends with # fail 0 and the expected test count. Lane 1.10 passed 102 tests with exit 0. Evidence: node --test .skilled/hooks/session-relaunch/tests/*.test.cjs, lane 1.10.
- [x] CHK-002 [P0] sync-hook-registrations.cjs --check exits 0 with only the Claude-row delta and hook-registration-sync.vitest.ts passes. Evidence: run-ledger.md, Gate PG, PG2 and PG5.
- [x] CHK-003 [P1] The runtime-mirror doctor checker set passed: sync-runtime-mirrors --check at 189, codex sync-agents --check at 11, agent-roster-mirror-check STATUS=OK, install-codex-hooks --check --allow-worktree OK and pi sync-agents-pi --check at 11. The Codex and Pi handoff prompt mirrors rechecked at 38 after generation. Evidence: run-ledger.md, Doctor runtime-mirrors.
- [x] CHK-004 [P0] The drift-guard wrapper exits 0. Evidence: run-ledger.md, Gate PG, PG4, 4/4 guards.
- [x] CHK-005 [P1] shellcheck exits 0 on touched shell files. Evidence: run-ledger.md, Gate PG, PG5.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

The killer suite covers descendant signaling and loop-id-1 refusal. It adds the named non-descendant behavior test. The full suite passed 102 tests with exit 0. Evidence: tests/killer.test.cjs:198 and tests/killer.test.cjs:219 and lane 1.10 test run.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A. This phase adds a feature and the approved plan names no bug-fix findings.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

The descendant signal case and non-descendant refusal case both pass with SKILLED_LOOP_ID set to the loop id. The refusal test keeps the sibling target alive and the relaunch record armed. Evidence: tests/killer.test.cjs:198 and tests/killer.test.cjs:219 and lane 1.10 test run.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P1] Every phase doc exists and passes its mode validator. Evidence: run-ledger.md, D21 and D24.
- [x] CHK-007 [P1] Every Claude playbook scenario has a recorded result. Evidence: run-ledger.md, PG7 playbook results.
- [x] CHK-009 [P0] Strict validation returns RESULT: PASSED (Errors: 0, one COMPLEXITY_MATCH phase-count warning) after the orchestrator ran repair-derived.cjs --apply on this folder. Evidence: run-ledger.md, Phase 001 closure.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 [P0] The full worktree delta against the clean baseline (13 modified, 31 untracked outside the packet) maps to the lane file lists plus three recorded generator runs and one recorded pin bump; no unrelated file changed. Evidence: run-ledger.md, Phase 001 closure, scope receipt.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 4 | 4/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-17
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

N/A. The phase plan uses an embedded decision record and lists no separate decision-record.md output.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

N/A. The phase plan defines no response-time or throughput target.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

N/A. The phase plan names no deployment or release step.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

N/A. The phase plan names no license, OWASP or compliance review.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

The documentation validator check is CHK-006 under plan section 11, item 6.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

N/A. The phase plan names no sign-off approvers.
<!-- /ANCHOR:sign-off -->
