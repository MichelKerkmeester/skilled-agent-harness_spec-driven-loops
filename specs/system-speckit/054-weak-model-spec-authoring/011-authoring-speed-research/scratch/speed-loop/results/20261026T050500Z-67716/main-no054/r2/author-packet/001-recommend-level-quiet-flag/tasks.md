---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

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

Every implementation task touches the same file, `recommend-level.sh`, so `[P]` marks only work that is independent of the code edit — baseline captures, environment checks, and the read-back review.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `recommend-level.sh` end to end and map the output path: parser `:656-719`, `output_text()` `:508-558`, `output_json()` `:562-649`, dispatch `:770-774` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the pre-change baselines in `scratch/`: default text for `--loc 50 --files 2`, `--no-recommend-phases` text, and `--json` (scratch/baseline-text.txt, baseline-no-phases.txt, baseline-json.txt)
- [ ] T003 [P] Record today's rejection of the flag: `--quiet --loc 50 --files 2` prints `ERROR: Unknown option: --quiet` and exits 1 (scratch/baseline-quiet-rejected.txt)
- [ ] T004 [P] Confirm the target shell and syntax budget: `bash --version` on macOS reports 3.2; the change adds no construct the file does not already use (recommend-level.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `QUIET_MODE=false` beside `JSON_OUTPUT=false` in the globals block (recommend-level.sh:116-142)
- [ ] T006 Add the `--quiet)` case to the argument parser, setting `QUIET_MODE=true` and shifting once (recommend-level.sh:656-719)
- [ ] T007 Add the guard as the first statement in `output_text()`: echo `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` and `return 0` before the leading blank line (recommend-level.sh:508-558)
- [ ] T008 Add the `--quiet` row to the header OPTIONS block, aligned with the existing rows (recommend-level.sh:16-27)
- [ ] T009 Add the `--quiet` row and one example to `show_help()`, including the sentence that `--json` takes precedence (recommend-level.sh:162-211)
- [ ] T010 [P] Re-read the finished diff and confirm no scoring, JSON, phase, or exit-code line changed (recommend-level.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the matrix — flag position (leading, trailing) × text default, `--no-recommend-phases`, `--json` — and assert one line for every quiet text run (scratch/matrix.md)
- [ ] T012 Diff default text, `--no-recommend-phases` text and `--json` against the T002 baselines; every diff must be empty (scratch/)
- [ ] T013 Run the error paths with `--quiet` present: `--loc abc`, no inputs, and an unknown option; each must exit 1 with its existing stderr message (scratch/)
- [ ] T014 Confirm `--help` lists `--quiet` and that `--quiet --help` is byte-identical to `--help` (scratch/)
- [ ] T015 Run `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js`; both must exit 0 (tests/)
- [ ] T016 Record evidence in the Verification cell of each criterion and flip AC-001 to AC-010 to `Met` as each is proven (acceptance-criteria.md)
<!-- /ANCHOR:phase-3 -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] T001 is done before any edit: the parser, `output_text()` and the dispatch site are read in the current file, not from memory
- [ ] T002 baselines are captured before T005 to T009, because a baseline taken after the edit proves nothing
- [ ] The edit stays inside `recommend-level.sh`; no scoring constant, JSON field, or phase rule is touched
- [ ] Bash 3.2 is the syntax ceiling: no `mapfile`, no associative arrays, no `${var,,}`

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | T002 gates T005 onward; T005 to T009 land in one change so the diff reads as one behavior |
| TASK-SCOPE | Only `recommend-level.sh`; the header and help text are in that file, so no doc file is edited |
| TASK-EVIDENCE | Each completed task records the command and its observed output in `scratch/` and then in the acceptance row |
| TASK-BYTE | Default output is compared byte for byte, never by eye or by line count alone |

### Status Reporting Format

Report per task as `T### status (pending/active/done/blocked) — evidence pointer — blocker if any`. A verification task also names the command that produced the evidence.

### Blocked Task Protocol

On a blocked task: mark it `[B]`, record the blocker in this file and in the acceptance criteria, halt dependent tasks, and escalate with the conflicting facts and the decision needed. Never substitute a hand-parsed report for the `--quiet` output the criterion names.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] SC-001 to SC-004 evidenced in `acceptance-criteria.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See the ADR section of `plan.md`
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
- [x] CHK-003 [P1] Dependencies identified and available — Bash 3.2 is the target shell and no external package is added
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — `bash -n recommend-level.sh`, plus `shellcheck` when it is installed
- [ ] CHK-011 [P0] No console errors or warnings — a quiet run prints one line and nothing on stderr
- [ ] CHK-012 [P1] Error handling implemented — the guard sits in `output_text()` only, so `exit 1` paths keep their messages
- [ ] CHK-013 [P1] Code follows project patterns — the flag is a global set in the parser and read at render time, the shape `JSON_OUTPUT` already uses
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete — T011 matrix executed
- [ ] CHK-022 [P1] Edge cases tested — repeated flag, leading and trailing position, `--help` combination
- [ ] CHK-023 [P1] Error scenarios validated — T013 exit codes and stderr messages
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded — N/A: this is a feature addition, not a review finding
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — `rg -n 'JSON_OUTPUT|QUIET' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` finds one text producer and one JSON producer, both listed in `plan.md` affected surfaces
- [x] CHK-FIX-003 [P0] Consumer inventory completed — `rg -n 'recommend-level\.sh' .skilled --glob '*.js' --glob '*.sh'` finds the two legacy suites; neither passes `--quiet`
- [x] CHK-FIX-004 [P0] Adversarial table tests — N/A: no path, redaction, or parser-security surface; `--quiet` takes no value
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed — `plan.md` affected surfaces names the four axes; T011 enumerates the rows
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — N/A: the script reads no environment variable and `QUIET_MODE` is script-local
- [ ] CHK-FIX-007 [P1] Evidence pinned to the change commit rather than a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the change adds a boolean and two help lines
- [ ] CHK-031 [P0] Input validation implemented — the flag takes no value; the existing numeric validation stays unchanged and AC-007 proves it still fires
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no auth surface in this script
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate — T008 and T009 add the flag to the header block and `show_help()`
- [x] CHK-042 [P2] README updated — N/A: the in-script help is the flag's reference; no README lists per-flag options
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — baselines and the matrix record live in `scratch/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 9/15 |
| P1 Items | 23 | 15/23 |
| P2 Items | 9 | 9/9 |

A checked row is settled, either by evidence or by an N/A reason written in the row. No acceptance criterion is `Met` yet: the verification items that depend on the implementation stay open until T011 to T016 run.

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented — ADR-001 and ADR-002 in `plan.md`; this packet's Level 3 contract does not require `decision-record.md`
- [x] CHK-101 [P1] All ADRs have status — both are `Proposed`
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — ADR-001 rejects the hard error and the quiet-overrides-JSON variant; ADR-002 rejects the bare integer
- [x] CHK-103 [P2] Migration path documented — N/A: the flag is additive and no caller has to change
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) — one extra string comparison; confirm the script still finishes under 100 ms
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — N/A: no NFR-P02 is defined and the script is a one-shot CLI
- [x] CHK-112 [P2] Load testing completed — N/A: no service surface
- [x] CHK-113 [P2] Performance benchmarks documented — N/A: NFR-P01 is an order-of-magnitude bound, not a benchmark
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested — documented in `plan.md` §7 and §L2; the revert is exercised only if a criterion fails
- [x] CHK-121 [P0] Feature flag configured — N/A: `--quiet` is a caller-controlled opt-in, so no deployment flag is needed
- [x] CHK-122 [P1] Monitoring/alerting configured — N/A: an internal CLI with no telemetry surface
- [x] CHK-123 [P1] Runbook created — N/A: `show_help()` is the runbook for a one-flag script
- [x] CHK-124 [P2] Deployment runbook reviewed — N/A: nothing is deployed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — N/A: no auth, network, or data handling; the review is the diff itself
- [x] CHK-131 [P1] Dependency licenses compatible — N/A: no dependency is added
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — N/A: no web surface
- [x] CHK-133 [P2] Data handling compliant with requirements — N/A: the script handles no data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete — N/A: no API; the CLI option is documented in `show_help()`
- [x] CHK-142 [P2] User-facing documentation updated — N/A: see CHK-042
- [x] CHK-143 [P2] Knowledge transfer documented — N/A: a single-file change whose reasoning is in `plan.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | Pending | |
| Operator | Product Owner | Pending | |
| Reviewer | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->
