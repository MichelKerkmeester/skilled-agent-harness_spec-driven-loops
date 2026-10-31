---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Paths used below**: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`; `P` is `specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting any task, confirm:
1. [ ] `spec.md` scope is unchanged and the task maps to REQ-001 through REQ-005.
2. [ ] The current phase is the one named in `plan.md` section 4.
3. [ ] The baseline captures in `P/scratch/` exist before any edit to `S`.
4. [ ] The verify command for the task is known and its expected output is written down.
5. [ ] No blocked task sits upstream of this one.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run Setup, then Implementation, then Verification; do not verify before the flag exists. |
| TASK-SCOPE | Touch `S` and this packet only; no scoring, threshold or JSON changes. |
| TASK-VERIFY | A task is done only when its verify command ran and its output was read. |
| TASK-DOC | Update the task checkbox and the matching AC row in the same pass. |
| TASK-SYNC | Stop after Phase 2 and re-read the diff before starting verification. |

### Status Reporting Format

Each update names the task, its state, the verify command and the observed output: `T### | state | command | output`. Never mark `[x]` on an exit code alone.

### Blocked Task Protocol

Mark the task `[B]`, record the failing command and its output, and stop the dependent chain. Do not start a downstream task until the blocker clears or the operator amends scope; record the resolution next to the task.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the argument parser and output dispatch in `S`. Verify: `rg -n 'JSON_OUTPUT|output_text\(\)' S` prints the parser case and the dispatch block.
- [ ] T002 Capture the baseline default output for `--loc 500 --files 15` into `P/scratch/baseline-default.txt`. Verify: `wc -l < P/scratch/baseline-default.txt` prints 16.
- [ ] T003 Capture the baseline JSON output for the same arguments into `P/scratch/baseline-json.txt`. Verify: `grep -c '"recommended_level"' P/scratch/baseline-json.txt` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` beside `JSON_OUTPUT=false` in the globals block (`S`). Verify: `rg -n 'QUIET_OUTPUT=false' S` prints one line.
- [ ] T005 Add the `--quiet)` case to the argument parser, setting `QUIET_OUTPUT=true` and shifting (`S`). Verify: `S --loc 10 --files 1 --quiet` exits 0.
- [ ] T006 Add the quiet branch to the output dispatch, after the JSON branch and before `output_text` (`S`). Verify: `S --loc 500 --files 15 --quiet | wc -l` prints 1.
- [ ] T007 Add `--quiet` to the header OPTIONS block and to the `show_help` heredoc (`S`). Verify: `S --help | grep -c -- '--quiet'` prints 1.
- [ ] T008 [P] Confirm `spec.md`, `plan.md` and `tasks.md` name the same flag and the same JSON precedence rule (`P`). Verify: `rg -n -- '--quiet' P` finds the flag in all three docs.
- [ ] T017 Keep every warning path on stderr in the quiet branch, so `--quiet` trims stdout only (REQ-006) (`S`). Verify: `diff <(S --loc 500 --files 15 2>&1 >/dev/null) <(S --loc 500 --files 15 --quiet 2>&1 >/dev/null)` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify the quiet line text and count (`S`). Verify: `S --loc 500 --files 15 --quiet` prints exactly `Recommended Level: 2 (Verification)` on one line.
- [ ] T010 Verify the default report is byte-identical (`S`, `P/scratch/baseline-default.txt`). Verify: `diff P/scratch/baseline-default.txt <(S --loc 500 --files 15)` prints nothing.
- [ ] T011 Verify the JSON payload is byte-identical (`S`, `P/scratch/baseline-json.txt`). Verify: `diff P/scratch/baseline-json.txt <(S --loc 500 --files 15 --json)` prints nothing.
- [ ] T012 Verify `--quiet --json` in both orders (`S`). Verify: `S --loc 500 --files 15 --quiet --json | grep '"recommended_level": 2'` matches in both orders.
- [ ] T013 Verify error paths survive quiet (`S`). Verify: `S --quiet` exits 1, writes the "At least --loc or --files" error to stderr and nothing to stdout.
- [ ] T014 Verify syntax (`S`). Verify: `bash -n S` exits 0.
- [ ] T015 Run the suite that exercises the JSON path (`S`). Verify: `npm run test:legacy` in `runtime/cli` exits 0.
- [ ] T016 Validate the packet (`P`). Verify: `validate.sh P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `P/scratch/` holds the baseline captures that AC-003 and AC-004 cite
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Decision records**: See `plan.md` L3 Architecture Decision Record (ADR-001, ADR-002)
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`: `rg -n 'REQ-00[1-5]' spec.md` prints five rows.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`: `rg -n 'ADR-00[12]' plan.md` prints two headings.
- [ ] CHK-003 [P1] Dependencies available: `bash --version` reports 3.2 or later.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n S` exits 0.
- [ ] CHK-011 [P0] No new shellcheck findings: `shellcheck S` exits 0, or the tool is absent and the check is recorded as skipped.
- [ ] CHK-012 [P1] Error handling unchanged: `S --quiet` exits 1 with the existing stderr message.
- [ ] CHK-013 [P1] The new case and branch follow the script's existing `case` and dispatch patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` is `Met` with evidence.
- [ ] CHK-021 [P0] Manual testing complete: quiet, default, JSON and `--help` each exercised once.
- [ ] CHK-022 [P1] Edge cases tested: repeated `--quiet`, both flag orders, `--quiet --help`, invalid numeric values.
- [ ] CHK-023 [P1] Error scenarios validated: no inputs, unknown option, and a missing value after `--loc`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'JSON_OUTPUT|QUIET_OUTPUT' S` lists every output-mode flag.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: `rg -n -- '--quiet' .skilled/skills/system-spec-kit` finds the script and this packet only.
- [ ] CHK-FIX-004 [P0] Adversarial table tests cover repeated flag, both flag orders, no-input, and the `--help` path.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: output mode x quiet x phase section (8 rows) plus 2 flag-order rows.
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: `env -i bash S --loc 500 --files 15 --quiet` still prints one line.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the change commit SHA or an explicit diff range, not a moving branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets: `rg -n 'password|token|secret' S` prints no new match.
- [ ] CHK-031 [P0] Input validation unchanged: numeric and unknown-option checks still exit 1.
- [ ] CHK-032 [P1] Auth/authz: N/A, the script is a local CLI with no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same flag and the same precedence rule.
- [ ] CHK-041 [P1] New code carries comments in the neighboring style, with no ephemeral artifact labels.
- [ ] CHK-042 [P2] README: N/A, its invocation examples stay valid without `--quiet`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline captures live under `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` is cleaned of throwaway files; the two baselines stay as evidence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 are followed: `output_text()` is unchanged and the JSON branch is evaluated before quiet.
- [ ] CHK-101 [P1] All ADRs carry a status: `rg -n '^\*\*Status\*\*' plan.md` prints two `Accepted` rows.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for both ADRs.
- [ ] CHK-103 [P2] Migration path: N/A, the flag is additive and defaults off.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 met: the quiet path stays within 5% of the default form over 20 runs.
- [ ] CHK-111 [P1] NFR-P02: N/A, no throughput target is defined for a local CLI.
- [ ] CHK-112 [P2] Load testing: N/A, the script is single-shot and local.
- [ ] CHK-113 [P2] Benchmarks documented: N/A, the timing check in CHK-110 is the record.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed in a copy.
- [ ] CHK-121 [P0] Feature flag: N/A, `--quiet` is the flag and it defaults off.
- [ ] CHK-122 [P1] Monitoring/alerting: N/A, no service is deployed.
- [ ] CHK-123 [P1] Runbook: N/A, `--help` is the operating instruction.
- [ ] CHK-124 [P2] Deployment runbook reviewed: N/A, no deployment step.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed: no new input, file or credential surface (NFR-S01).
- [ ] CHK-131 [P1] Dependency licenses: N/A, no new dependency.
- [ ] CHK-132 [P2] OWASP Top 10 checklist: N/A, local CLI with no request surface.
- [ ] CHK-133 [P2] Data handling: N/A, the script stores no data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized on the flag name, the one-line format and the JSON precedence.
- [ ] CHK-141 [P1] CLI documentation complete: `--help` lists `--quiet` with a one-line description.
- [ ] CHK-142 [P2] User-facing documentation: N/A, the help text is the user-facing surface.
- [ ] CHK-143 [P2] Knowledge transfer: N/A, the flag is small enough for the ADR and help text to carry it.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author (this session) | Technical Lead | [ ] Pending | |
| Repository maintainer | Product Owner | [ ] Pending | |
| Verification owner | QA Lead | [ ] Pending | |
<!-- /ANCHOR:sign-off -->
