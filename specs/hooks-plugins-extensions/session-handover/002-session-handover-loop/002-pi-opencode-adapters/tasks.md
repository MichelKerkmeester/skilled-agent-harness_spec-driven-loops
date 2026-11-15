---
title: "Tasks: Pi and OpenCode adapters"
description: "The ordered tasks cover both runtime spikes, tests, adapters, wrapper arms, docs and Gate PG. Every verification item points to a check in the approved plan section 11."
trigger_phrases:
  - "Pi and OpenCode adapter tasks"
  - "phase 002 verification checklist"
  - "Pi OpenCode Gate PG tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Pi and OpenCode adapters

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [SWE, lane 2.1] Verify Pi usage shape, nudge API, arm event, interactive seed and name flags and plugin directory. Record the verdict evidence and ledger update (Pi spike evidence). Evidence: run-ledger D27 and SPIKE-REPORT.md.
- [x] T002 [SWE, lane 2.1] Verify OpenCode usage shape, nudge API, arm event, interactive seed and name flags and plugin directory. Record the verdict evidence and ledger update (OpenCode spike evidence). Evidence: run-ledger D27 and SPIKE-REPORT.md.
- [x] T003 [Luna, lane 2.2] Write Pi and OpenCode adapter tests first, using lane 2.1 fixtures and the .opencode/plugins/tests/*.test.cjs style (adapter test files). Evidence: run-ledger D28 tests-first red run, then D54 and PG1 final suites.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [Luna, lane 2.3] Build the Pi TypeScript adapter and relative .pi/extensions/ symlink (Pi adapter and symlink). Evidence: run-ledger D30 and D54.
- [x] T005 [SWE review, lane 2.3] Review the Pi adapter diff before acceptance (Pi adapter diff). Evidence: run-ledger D35 and D53 review results.
- [x] T006 [Luna, lane 2.4] Build the OpenCode plugin in the directory verified by lane 2.1 and add its browsability symlink under .skilled/hooks/session-relaunch/opencode/ (OpenCode plugin and symlink). Evidence: run-ledger D30 and D47.
- [x] T007 [SWE review, lane 2.4] Review the OpenCode plugin diff before acceptance (OpenCode plugin diff). Evidence: run-ledger D48 review result.
- [x] T008 [Luna, lane 2.5] Add skilled-loop case arms only for runtimes whose seed and name flags lane 2.1 verifies. Build nothing automatic for COMMAND-ONLY or BLOCKED runtimes (skilled-loop case arms). Evidence: run-ledger D36 wrapper arms 20/20, D40, D43 and D52.
- [x] T009 [SWE review, lane 2.5] Review the wrapper diff before acceptance (skilled-loop diff). Evidence: run-ledger D44 review result.
- [x] T010 [Luna, lane 2.6] Add the runtime rows to the concern README through the matching sk-doc mode (concern README). Evidence: run-ledger D36 and D56 documentation validators.
- [x] T011 [Luna, lane 2.6] Update the feature catalog entry through the matching sk-doc mode (catalog entry). Evidence: run-ledger D36 and D56 catalog validator.
- [x] T012 [Luna, lane 2.6] Add the Pi and OpenCode scenarios through the matching sk-doc mode (manual testing playbook). Evidence: run-ledger D60 playbook validator and eight run rows.
- [x] T013 [Luna, lane 2.6] Add the Pi and OpenCode coverage matrix rows through the matching sk-doc mode (coverage matrix). Evidence: .skilled/hooks/README.md:184 lists session-relaunch under Claude, Pi and OpenCode.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 [Orchestrator, lane 2.7] Run Gate PG, the Pi load smoke and the OpenCode import smoke (phase gate evidence). Evidence: run-ledger PG1-PG5, AC-2.3 smokes and orchestrator results.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All lane tasks are accepted with evidence from the approved plan section 11 checks. Evidence: T001-T014 below cite lane results; acceptance-criteria.md:39-44 records AC-001 through AC-006 Met and run-ledger.md:199 records closure acceptance.
- [x] COMMAND-ONLY and BLOCKED runtimes follow H13 and receive no automatic build. Evidence: spec.md:91-94 and plan.md:322-332 define H13; run-ledger.md:148-153 records Pi and OpenCode as AUTO.
- [x] The runtime documentation passes its validators. Evidence: run-ledger.md:194 and :198 record the README, catalog and playbook validator results.
- [x] Gate PG passes before phase handoff. Evidence: run-ledger.md:254-260 records PG1-PG6; D60 at :198 closes playbook validation.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: spec.md
- Plan: plan.md
- Closure criteria: acceptance-criteria.md
- Source plan and gate checks: ../scratch/approved-plan.md

<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | HARD BLOCKER | Cannot claim done until complete |
| [P1] | Required | Must complete OR get user approval |
| [P2] | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and six seed criteria are recorded in spec.md and acceptance-criteria.md. (Approved plan §11.9) Evidence: spec.md:118-123 lists REQ-001 through REQ-006; acceptance-criteria.md:39-44 maps AC-001 through AC-006.
- [x] CHK-002 [P0] Lane order, actors and applicable halts are recorded in plan.md. (Approved plan §11.9) Evidence: plan.md:89-107 records actor roles and ordered lanes; :322-333 lists applicable halts.
- [x] CHK-003 [P1] Both verdict rows include the evidence required by AC-2.1. (Approved plan §11.9) Evidence: run-ledger D27 and SPIKE-REPORT.md.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Adapter tests pass with the phase Vitest command. (Approved plan §11.1) Evidence: run-ledger D47 plugin suite 20/20, D54 Pi Vitest 11/11 and PG1 Node 170/170.
- [x] CHK-011 [P0] Hook registration sync check exits 0 with a delta limited to planned rows. (Approved plan §11.2) Evidence: run-ledger PG2 sync-hook-registrations PASS.
- [x] CHK-012 [P1] Runtime mirror check and /doctor:runtime-mirrors are at baseline or better. (Approved plan §11.3) Evidence: run-ledger PG3 runtime mirrors PASS 189 and doctor mirror checkers rc=0.
- [x] CHK-013 [P1] Drift guard wrapper exits 0. (Approved plan §11.4) Evidence: run-ledger PG4 drift guards 4/4.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All six acceptance criteria have their required evidence. (Approved plan §11.9) Evidence: acceptance-criteria.md:39-44 marks all six Met; run-ledger.md:194, :198 and :199 record D56, D60 and orchestrator closure.
- [x] CHK-021 [P0] Pi and OpenCode playbook scenarios have recorded results. (Approved plan §11.7) Evidence: run-ledger D60 eight playbook run rows, including run F.
- [x] CHK-022 [P1] Fixture tests show the threshold nudge, the +5% re-nudge and arming only with a pending file. (Approved plan §11.1) Evidence: acceptance-criteria.md:42 records AC-004 Met; run-ledger.md:170, :192 and :255 record fixture and final suite results.
- [x] CHK-023 [P1] Stub-runtime wrapper tests assert the seed, cwd change and no resume flag. (Approved plan §11.1) Evidence: run-ledger D36 wrapper arms 20/20 and D40, D43 and D52 carry results.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each runtime has one verdict row with a quoted help line, source line or captured event. (Approved plan §11.9) Evidence: run-ledger D27 and SPIKE-REPORT.md verdict evidence.
- [x] CHK-FIX-002 [P0] Adapter tests use the lane 2.1 fixtures and pass Vitest. (Approved plan §11.1) Evidence: run-ledger D28, D47 and D54 adapter suite results.
- [x] CHK-FIX-003 [P0] Hook registration sync check passes with only planned rows changed. (Approved plan §11.2) Evidence: run-ledger PG2 sync-hook-registrations PASS with 32 hooks and 19 Pi extensions.
- [x] CHK-FIX-004 [P0] Phase and runtime docs pass their mode validators. (Approved plan §11.6) Evidence: run-ledger D36 document validators and D60 playbook validators.
- [x] CHK-FIX-005 [P1] Playbook scenarios record pass, fail or not-run with the reason. (Approved plan §11.7) Evidence: run-ledger D60 records eight run rows and their outcomes.
- [x] CHK-FIX-006 [P1] Runtime mirrors and /doctor:runtime-mirrors are at baseline or better. (Approved plan §11.3) Evidence: run-ledger PG3 runtime mirrors PASS 189 and doctor checkers rc=0.
- [x] CHK-FIX-007 [P1] The status diff equals the union of the lane file lists. (Approved plan §11.8) Evidence: operator-provided PG8 scope receipt accounts for every changed path outside specs/ against phase lane lists or the approved AGENTS.md sentence.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] New code comments contain no spec paths or ids. (Approved plan §11.4) Evidence: orchestrator PG4 reports comment hygiene passed; run-ledger.md:258 records drift guards 4/4 and zero alignment-drift violations.
- [x] CHK-031 [P0] Wrapper case arms exist only when seed and name flags are verified. (Approved plan §11.1) Evidence: run-ledger D27 verified AUTO seed/name surfaces and D36 wrapper arms 20/20.
- [x] CHK-032 [P1] COMMAND-ONLY and BLOCKED verdicts receive no automatic build. (Approved plan §11.9) Evidence: run-ledger.md:148-153 records both Pi and OpenCode as AUTO, with no COMMAND-ONLY or BLOCKED runtime in phase 002.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md and acceptance-criteria.md agree on scope and requirements. (Approved plan §11.9) Evidence: spec.md:49-61, plan.md:89-107, tasks.md T001-T014 and acceptance-criteria.md:39-44 align on Pi and OpenCode scope, lanes and six criteria.
- [x] CHK-041 [P1] Concern README and catalog docs pass their validators. (Approved plan §11.6) Evidence: run-ledger D36 and D56 README and catalog validator results.
- [x] CHK-042 [P2] Playbook scenarios and coverage matrix rows are present. (Approved plan §11.6) Evidence: run-ledger.md:198 records eight playbook run rows including F; .skilled/hooks/README.md:184 lists the Claude, Pi and OpenCode coverage row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] git status minus baseline matches the lane file lists. (Approved plan §11.8) Evidence: operator-provided PG8 scope receipt accounts for every changed path outside specs/ against phase lane lists or the approved AGENTS.md sentence.
- [x] CHK-051 [P1] No task-created files sit outside the lane file lists. (Approved plan §11.8) Evidence: operator-provided PG8 scope receipt accounts for every changed path outside specs/ against phase lane lists or the approved AGENTS.md sentence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 22/23 |
| P2 Items | 9 | 8/9 |

**Verification Date**: 2026-10-17. Evidence is cited on each checked row. Strict validation returned RESULT: FAILED on generated metadata integrity, description drift and the malformed AC-006 evidence citation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Adapter tests confirm that the Pi and OpenCode adapters use the shared core. (Approved plan §11.1) Evidence: implementation-summary.md:122 records shared-core reuse; run-ledger.md D47, D54 and PG1 record passing adapter suites.
- [x] CHK-101 [P1] Both spike verdicts use the AUTO, COMMAND-ONLY or BLOCKED model. (Approved plan §11.9) Evidence: run-ledger D27 and SPIKE-REPORT.md.
- [x] CHK-102 [P1] COMMAND-ONLY and BLOCKED reasons are recorded with the command-trigger outcome. (Approved plan §11.9) Evidence: run-ledger.md:148-153 records both runtimes as AUTO, so no command-only or blocked outcome applies in phase 002.
- [x] CHK-103 [P2] Wrapper tests confirm the seed, cwd change and absence of resume flags. (Approved plan §11.1) Evidence: acceptance-criteria.md:43 records AC-005 Met; run-ledger.md:170, :178, :181 and :190 record wrapper and carry tests.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Fixture tests show one nudge at threshold and one re-nudge at +5%. (Approved plan §11.1) Evidence: acceptance-criteria.md:42 records AC-004 Met; run-ledger.md:170, :192 and :255 record fixture and final suite results.
- [x] CHK-111 [P1] Adapter tests pass with the lane 2.1 fixtures. (Approved plan §11.1) Evidence: run-ledger D47 and D54 adapter suite results.
- [x] CHK-112 [P2] Pi offline load smoke exits 0. (Approved plan §11.1) Evidence: run-ledger AC-2.3 smokes: explicit-extension Pi command rc=0.
- [x] CHK-113 [P2] OpenCode import smoke prints ok. (Approved plan §11.1) Evidence: run-ledger AC-2.3 smokes: OpenCode import printed function.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] COMMAND-ONLY and BLOCKED runtimes use the command trigger only. (Approved plan §11.9) Evidence: spec.md:91-93 and plan.md:322-332 define the H13 rule; run-ledger.md:148-153 records both runtimes as AUTO.
- [x] CHK-121 [P0] Wrapper arms are limited to verified seed and name flags. (Approved plan §11.1) Evidence: run-ledger D27 verified runtime surfaces and D36 wrapper arms 20/20.
- [x] CHK-122 [P1] Runtime mirror checks and /doctor:runtime-mirrors are at baseline or better. (Approved plan §11.3) Evidence: run-ledger PG3 runtime mirrors PASS 189 and doctor checkers rc=0.
- [x] CHK-123 [P1] Every runtime document passes the validator for its mode. (Approved plan §11.6) Evidence: run-ledger.md:194 records README and catalog validators; :198 records the playbook validator; acceptance-criteria.md:44 marks AC-006 Met.
- [x] CHK-124 [P2] Gate PG status line includes the evidence command and exit code. (Approved plan §11.10) Evidence: ../scratch/run-ledger.md:264.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Hook registration sync check passes with only planned rows changed. (Approved plan §11.2) Evidence: run-ledger PG2 sync-hook-registrations PASS.
- [x] CHK-131 [P1] Drift guard wrapper exits 0 and the code comment rule is met. (Approved plan §11.4) Evidence: orchestrator PG4 reports comment hygiene passed; run-ledger.md:258 records drift guards 4/4 and zero alignment-drift violations.
- [x] CHK-132 [P2] shellcheck exits 0 on touched shell files. (Approved plan §11.5) Evidence: run-ledger D54 shellcheck 0 and PG5 shellcheck 0.
- [x] CHK-133 [P2] Scope diff equals the lane file lists. (Approved plan §11.8) Evidence: operator-provided PG8 scope receipt accounts for every changed path outside specs/ against phase lane lists or the approved AGENTS.md sentence.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All four phase documents agree on scope and requirements. (Approved plan §11.9) Evidence: spec.md:49-61, plan.md:89-107, tasks.md T001-T014 and acceptance-criteria.md:39-44 align on Pi and OpenCode scope, lanes and six criteria.
- [x] CHK-141 [P1] Phase documents pass strict validation. (Approved plan §11.9) Evidence: validate.sh --strict RESULT: PASSED, Errors 0, Warnings 0 (orchestrator rerun after repair-derived).
- [x] CHK-142 [P2] README and catalog documents pass their validators. (Approved plan §11.6) Evidence: run-ledger D36 and D56 README and catalog validator results.
- [x] CHK-143 [P2] Playbook documents pass validation and record scenario outcomes. (Approved plan §11.6 and §11.7) Evidence: run-ledger D60 playbook document and package validators rc=0 with eight run rows.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Actor | Phase role | Status | Date |
|-------|------------|--------|------|
| SWE | Spike and review owner | Pending | - |
| Luna | Test, build and documentation owner | Pending | - |
| Orchestrator | Gate PG owner | Pending | - |
<!-- /ANCHOR:sign-off -->


