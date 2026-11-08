---
title: "Tasks: Phase 5: deep-review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase under the parent (`005-deep-review-remediation/`)
- [x] T002 Confirm each of the twelve findings against its file and line (`../review-archive/20261018T184826Z/review-report.md`)
- [x] T003 Record the gate baseline before the first build (`../scratch/run-ledger.md`) Evidence: `../scratch/run-ledger.md:423`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] WS1 tests first, then fixes for R1-P2-001, R1-P2-003, R2-P2-001, R2-P2-002 (`lib/relaunch-core.cjs`, `lib/killer.cjs`) Evidence: ledger `:429`, `:434`, accepted at `:436`.
- [x] T005 WS2 tests first, then the shared helpers for M4-P2-001, M4-P2-002, M4-P2-003 and the Claude arm guard for M5-P2-001 (`lib/relaunch-core.cjs`, the five adapters) Evidence: ledger `:429`, accepted at `:431`.
- [x] T006 WS3 tests first, then the balanced Skip suffix for R1-P2-002 with the old spelling still parsed (`lib/relaunch-core.cjs`, `lib/nudge.cjs`, `.skilled/bin/skilled-loop`) Evidence: ledger `:438`, accepted at `:441`.
- [x] T007 [P] WS4 doc and evidence fixes for F7-P2-001, T3-P2-001, T3-P2-002 (`.skilled/bin/README.md`, the playbook, `../003-command-trigger-runtimes/tasks.md`, `../scratch/contracts/interface-contract.md`) Evidence: ledger `:426`.
- [x] T008 Review each build lane with a fresh SWE session and fix what it confirms Evidence: fresh SWE reviews at ledger `:431`, `:432`, `:436`, `:441`, `:448`, `:454`; every confirmed finding fixed (`:434`, `:438`, `:444`, `:446`, `:450`, `:452`, `:456`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 sk-code-opencode alignment review of the packet code, then a fix for each confirmed finding Evidence: alignment review ledger `:442`, fixes `:444` and `:446`, drift 4/4 (278).
- [x] T010 Doc updates through the matching sk-doc modes, with their validators Evidence: ledger `:426`, `:440`, `:457`.
- [x] T011 Rerun the full gate from the final state and compare with the baseline Evidence: final gate node 375/375 and every other count at or above baseline (acceptance-criteria AC-007).
- [x] T012 Recursive strict validation of the parent Evidence: `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` RESULT: PASSED (acceptance-criteria AC-007).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Final Review Wave Open Items

- [x] T013 Rename the 001 plan halts heading and update its cross-reference (`specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/plan.md:170`, `specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/plan.md:227`) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:460`; both lines read back in this session.
- [x] T014 Split the 004 AC-005 range citation into single-line citations (`specs/hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure/acceptance-criteria.md:63`) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:461`.
- [x] T015 Pi Fast Mode duplicate guard (`.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:110`, `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts:266`, three READMEs) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:462`, `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:472`, `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`. The Pi suite was not rerun here, see AC-008.
- [x] T016 Rename the README checklist `has_toc` to `no_toc` (`.skilled/skills/sk-doc/shared/scripts/extract_structure.py:682`) with its regression test (`.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py:71`) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:463`; pytest on the regression file in this session exits 0 with 4 passed.
- [x] T017 Write the session-relaunch tests README (`.skilled/hooks/session-relaunch/tests/README.md`) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:467`; file present in this session.
- [x] T018 Refresh the durable directory manifest (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:61`, `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:62`) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:466`, `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:476`.
- [x] T019 Hand the deep-loop reducer and verifier fixes to packet 009 (`specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity/`) Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:464`, `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:473`, `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`; packet 009 validates `RESULT: PASSED` in this session.
- [x] T020 Record the final gate in AC-007 from the orchestrator run. Evidence: ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:476`; the figures are the orchestrator's and were not rerun here.
- [x] T021 Repair derived outputs, save continuity, and run `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` until `RESULT: PASSED`. Evidence: `repair-derived.cjs --folder` with `--apply` exits 0; the continuity save exits 0; the recursive strict run exits 0 with `RESULT: PASSED` for the parent and all five children, Errors 0 and Warnings 0 (recorded in implementation-summary.md).
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: drift guards 4/4, shellcheck 0, tsc 0.
- [x] CHK-011 [P0] No console errors or warnings Evidence: node 375/375 with no warnings in the run.
- [x] CHK-012 [P1] Error handling implemented Evidence: killer and log error paths tested (ledger `:434`, `:456`).
- [x] CHK-013 [P1] Code follows project patterns Evidence: sk-code-opencode alignment review fixes (ledger `:442`-`:446`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md all seven rows Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: no new live behavior; the phase 004 live runs stand and every changed behavior has an automated test.
- [x] CHK-022 [P1] Edge cases tested Evidence: edge cases per finding tested (stray files, pid collision, legacy suffix, relative REPO_ROOT).
- [x] CHK-023 [P1] Error scenarios validated Evidence: error scenarios tested (unreadable transcript, unreadable owner, throwing release).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: every finding is instance-only or class-of-bug, recorded per lane in the ledger.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: same-class producers swept with `rg` (suffix, helpers, process lookup, rmdir sites).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: consumers of changed helpers inventoried: five adapters, wrapper, tests, docs.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: path and parser fixes carry adversarial tests (raw backslash path, relative and untrimmed paths, both suffixes).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: matrix: 5 adapters by 3 helpers, 3 suffix spellings by 3 readers, 5 arm paths by live or dead killer.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: tests set XDG_RUNTIME_DIR, REPO_ROOT and SESSION_RELAUNCH_THRESHOLD per sandbox.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: evidence pinned to the working tree on top of `b830fd0276`; the commit SHA is added at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secrets in the change.
- [x] CHK-031 [P0] Input validation implemented Evidence: seed parser validates absolute, trimmed, single-line paths.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: state dir 0700 and log 0600 enforced; killer signals descendants only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec, plan, tasks and acceptance criteria synchronized.
- [x] CHK-041 [P1] Code comments adequate Evidence: WHY comments only; comment hygiene checked by reviewers.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: READMEs updated (ledger `:426`, `:440`, `:457`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temp output only in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: scratch holds no task-created files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->

---



