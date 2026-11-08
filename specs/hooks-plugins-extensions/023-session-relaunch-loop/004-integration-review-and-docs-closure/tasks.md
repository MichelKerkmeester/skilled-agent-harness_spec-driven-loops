---
title: "Tasks: Phase 4: integration-review-and-docs-closure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "integration review and docs closure tasks"
  - "session relaunch closure checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: integration-review-and-docs-closure

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
3. [ ] Check that prior lanes and their gates passed.
4. [ ] Identify the AC row and the plan section 11 check that prove the task.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow the lane order. Review precedes fixes, fixes precede the doc rollup, docs precede live runs and live runs precede closure. |
| TASK-SCOPE | Touch only the file list assigned to the lane or named by a confirmed finding. |
| TASK-VERIFY | Rerun the lane checks from the final state and read output and exit code. |
| TASK-REVIEW | A review waits for its build, and a re-review waits for its fix. Dispatch only on disjoint file lists, with at most one Luna and one SWE run at a time. |

### Status Reporting Format

STATUS <gate> | <phase/lane> | evidence: <cmd> rc=<n> | open halts: <ids or none> | next: <lane>

### Blocked Task Protocol
1. Record the blocking fact, evidence and applicable halt ID in the ledger.
2. For a stalled dispatch, kill the captured PID and re-dispatch once with a narrower brief. A second stall on the same lane goes to H4.
3. After three fixes for the same symptom, escalate under H4. Stop immediately for H9. Under H10, record the live-run failure with the exact command and make no completion claim for that runtime. Under H13, ship the runtime on the command trigger and report PARTIAL at closure.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Review and Fixes

- [x] T001 Lane 4.1: SWE runs the cross-phase review of the union of changed files under a read-only instruction. Every finding carries a severity, a file and line, and a repro. Evidence: D118. Final review: D141.
- [x] T002 Lane 4.2: the orchestrator verifies every P0 and P1 finding, dispatches one fix per confirmed finding to Luna with one change each, then re-reviews. The P2 findings are listed. Evidence: D118, D120-D141.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Documentation Rollup

- [x] T003 Lane 4.3: Luna updates the root README.md with the skilled-loop mention through the normal README mode (sk-create-readme). Evidence: D128.
- [x] T004 Lane 4.3: Luna adds the continuity section to the system-spec-kit README.md. Evidence: D128.
- [x] T005 Lane 4.3: Luna finalizes the feature-catalog index so its entries equal the files on disk by name. Evidence: closure-evidence.md AC-002.
- [x] T006 Lane 4.3: Luna finalizes the manual-testing-playbook index so its entries equal the files on disk by name. Evidence: closure-evidence.md AC-002.
- [x] T007 Lane 4.4: Luna runs sk-create-quality-control over every doc touched and applies the human-voice rules through sk-create-with-human-voice. Evidence: D130, D132, D136-D137.
- [x] T008 The orchestrator reruns the scans: validate_document.py per touched doc, the extract_structure.py DQI and hvr_scan.py, and records the results. Evidence: D130, D132, D136-D137.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Live Runs, Gate and Closure

- [x] T009 Lane 4.5: the orchestrator runs the final live run on every runtime whose verdict is AUTO, using the phase 001 live-run procedure, and records the command, observed evidence and exit state per runtime. Evidence: closure-evidence.md AC-004 and the ledger live-run sections.
- [x] T010 Lane 4.6: the orchestrator runs the closure list from the final state: recursive strict validation, evidence on every acceptance-criteria row, completion-metadata reconciliation, temporary-output removal, the lane file-list scope check and the final honest status. Evidence: ../scratch/closure-evidence.md, Closure section.
- [x] T011 Gate PG from the final state per plan section 11 items 1 through 10, then post the status line. Evidence (orchestrator, after lane 9s): node 328/328, pytest 62/62, Pi vitest 14/14, tsc 0, shellcheck 0, hook sync PASS 32, mirrors PASS 192, prompts PASS 38 (codex, pi, hermes), agents PASS 11 (codex, pi), registration vitest 7/7, drift guards 4/4 at the 278-warning baseline, phase 004 strict RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001 through T011 have evidence and their lane order is complete. Verify phase scope against plan section 11, item 8.
- [x] Every AC row is Met and has evidence. Verify with plan section 11, item 9.
- [x] Strict child validation reports RESULT: PASSED. Verify with plan section 11, item 9.
- [x] Recursive strict validation on the packet reports RESULT: PASSED and the final honest status is sent. Verify with the 004 closure list.
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

Lane order, the verified-fix loop and the closure list are defined in plan section 4. Evidence for phase completion is listed below.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-001 [P0] The explicit node:test suite ends with # fail 0 and the expected test count, and the vitest suites for touched adapters pass. Evidence: D140.
- [x] CHK-002 [P0] sync-hook-registrations.cjs --check exits 0 with only this phase's row delta and hook-registration-sync.vitest.ts passes. Evidence: D141.
- [x] CHK-003 [P1] sync-runtime-mirrors.cjs --check and /doctor:runtime-mirrors are at baseline or better. Evidence: the doctor workflow's checks run directly, all exit 0: runtime mirrors PASS 192, codex and pi agents PASS 11, codex, pi and hermes prompts PASS 38, agent-roster and command-catalog STATUS=OK, and 64 of 64 hook paths exist.
- [x] CHK-004 [P0] The drift-guard wrapper exits 0. Evidence: D141, drift guards 4/4 PASS with 278 warnings at baseline.
- [x] CHK-005 [P1] shellcheck exits 0 on touched shell files. Evidence: D140.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

The named killer test for descendant-only signalling and the stub-runtime wrapper tests live in the explicit suite checked by CHK-001.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P1] Every P0 and P1 finding was verified by the orchestrator before its fix dispatched, each confirmed finding received one change in one dispatch, and the re-review landed. Evidence: every finding was confirmed against the code before dispatch (ledger D109 to D139), each finding got one change, and the last re-review (D141, lane 9r8) reported no findings. Deviation, recorded: findings that share files went to one lane together (9d, 9h, 9j, 9n, 9s) rather than one dispatch each.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

The descendants-only signal and SKILLED_LOOP_ID guard stay verified by the named killer test under plan section 11, item 1 and by the live-run records under AC-004.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P1] Every doc touched by the packet exists and passes its mode validator. Evidence: all 24 touched Markdown paths exist and every authored doc validates 0 (D130, D132, D136, D137). Justified exception: the generated .codex, .hermes and .pi speckit-handoff prompts fail the generic validator exactly as every other command's generated prompt does (speckit-plan fails the same way), a generator convention outside this scope.
- [x] CHK-007 [P1] Playbook scenarios are executed and their results recorded in the implementation summary. Phase 004 adds no new scenarios, and the live-run records under AC-004 are this phase's recorded results. Evidence: closure-evidence.md AC-004 and the ledger live-run sections.
- [x] CHK-009 [P0] Strict validation reports RESULT: PASSED and every acceptance-criteria row has evidence. Evidence: child and recursive strict validation RESULT: PASSED from the final state, ../scratch/closure-evidence.md, Closure section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 [P0] The worktree delta against baseline matches the union of the lane file lists. Evidence: the 89 changed paths outside specs/ all map to lane file lists: the session-relaunch concern, the wrapper, registry and generated hook rows, command mirrors, the Pi, OpenCode and Hermes adapters and their type stubs, docs, indexes and READMEs, the recorded vitest pin and the recorded AGENTS.md change. .pi/settings.json no longer differs from HEAD.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 3/5 |
| P1 Items | 5 | 2/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

N/A. The phase plan uses embedded decision records and lists no separate decision-record.md output.
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
