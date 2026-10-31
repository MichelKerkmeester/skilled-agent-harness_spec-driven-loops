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

**Task Format**: `T### [P?] Description (file path)` — every task ends with a `Verify:` clause naming the command and the output it must print.

**Shell variables** used in the commands below:
- `$S` = `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`
- `$P` = `specs/zz-bench-authoring/001-recommend-level-quiet-flag`
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
- [ ] Read `spec.md`, `plan.md` and this file before the first edit
- [ ] Confirm `$S` is the only source file the task touches
- [ ] Know the verification command for the task before starting it
- [ ] Confirm `scratch/baseline-default.txt` exists before changing the script

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run the tasks in order; T001 blocks every edit and T010 blocks every completion claim |
| TASK-SCOPE | Touch only `$S` and files under `$P/scratch/`; report anything else as a finding |
| TASK-VERIFY | Run the task's verification command before marking it complete |
| TASK-OUTPUT | Leave stdout without `--quiet` unchanged; a diff against the baseline is a hard stop |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task `[B]` with the blocking fact
2. Record the fact under this section
3. Continue with the next unblocked task; escalate after two blocked tasks

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the pre-change default report (`scratch/baseline-default.txt`). Verify: `bash $S --loc 500 --files 15 --auth --api --db --architectural > $P/scratch/baseline-default.txt && wc -l < $P/scratch/baseline-default.txt` prints `17`.
- [ ] T002 Inventory the output-mode globals and the script's documented consumers (`recommend-level.sh`). Verify: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' $S` prints the globals block and both output branches.
- [ ] T003 Record the validator baseline for this packet (`specs/zz-bench-authoring/001-recommend-level-quiet-flag`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` to the globals block (`recommend-level.sh`). Verify: `rg -n '^QUIET=false$' $S` prints one line.
- [ ] T005 Add `--quiet` to the argument parser (`recommend-level.sh`). Verify: `bash $S --quiet --loc 50 --files 2 >/dev/null; echo $?` prints `0`.
- [ ] T006 Reject `--quiet` combined with `--json` before scoring (`recommend-level.sh`). Verify: `bash $S --quiet --json --loc 50 --files 2 >/dev/null 2>&1; echo $?` prints `1`.
- [ ] T007 Print only the level line when `QUIET` is set (`recommend-level.sh`). Verify: `bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints `1`.
- [ ] T008 Document the flag in the header OPTIONS block (`recommend-level.sh`). Verify: `rg -n -- '^#   --quiet' $S` prints one line.
- [ ] T009 Document the flag in `show_help` (`recommend-level.sh`). Verify: `bash $S --help | grep -c -- '--quiet'` prints `1`.
- [ ] T015 Keep every stderr warning in place under `--quiet`: branch at the stdout dispatch only and leave each `>&2` write unguarded (REQ-006) (`recommend-level.sh`). Verify: `rg -n 'QUIET' $S` lists the global, the parser arm, the `--json` conflict and the stdout branch with no `>&2` line among them, and `bash $S --quiet 2>&1 >/dev/null | grep -c 'At least --loc or --files'` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Prove the default report is unchanged (`scratch/baseline-default.txt`). Verify: `diff <(bash $S --loc 500 --files 15 --auth --api --db --architectural) $P/scratch/baseline-default.txt` prints nothing and exits `0`.
- [ ] T011 Prove quiet output across the low, medium and full-risk profiles (`recommend-level.sh`). Verify: `for a in "--loc 50 --files 2" "--loc 200 --files 5 --api" "--loc 500 --files 15 --auth --api --db --architectural"; do bash $S --quiet $a | wc -l; done` prints `1` three times.
- [ ] T012 Prove error paths keep stderr and exit 1 under `--quiet` (`recommend-level.sh`). Verify: `bash $S --quiet 2>&1 >/dev/null | grep -c 'At least --loc or --files'` prints `1`.
- [ ] T013 Run the syntax check (`recommend-level.sh`). Verify: `bash -n $S; echo $?` prints `0`.
- [ ] T014 Re-run strict validation on the packet (`specs/zz-bench-authoring/001-recommend-level-quiet-flag`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `wc -l` prints `1` with `--quiet` and `17` without, on the full-risk profile
- [ ] The default report diffs clean against `scratch/baseline-default.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 through REQ-005). Proof: `rg -c '^\| REQ-' $P/spec.md` prints `5`.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (three steps). Proof: `rg -c '^### Step ' $P/plan.md` prints `3`.
- [ ] CHK-003 [P1] Dependencies identified and available. Proof: `bash --version | head -1` prints a 3.2-or-later version.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script parses. Proof: `bash -n $S; echo $?` prints `0`.
- [ ] CHK-011 [P0] A valid run writes nothing to stderr. Proof: `bash $S --loc 50 --files 2 2>&1 >/dev/null | wc -l` prints `0`.
- [ ] CHK-012 [P1] The conflict error and every existing diagnostic go to stderr. Proof: `bash $S --quiet --json --loc 50 --files 2 2>&1 >/dev/null | grep -c 'ERROR'` prints `1`.
- [ ] CHK-013 [P1] The flag follows the parser's existing `case` pattern and adds no dependency. Proof: `rg -n -- '--quiet\)' $S` prints one case arm.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Proof: every row in `acceptance-criteria.md` reads `Met` with a command result in its Verification cell.
- [ ] CHK-021 [P0] Quiet output is one line for the full-risk profile. Proof: `bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints `1`.
- [ ] CHK-022 [P1] Default output is byte-identical to the baseline. Proof: `diff <(bash $S --loc 500 --files 15 --auth --api --db --architectural) $P/scratch/baseline-default.txt` prints nothing.
- [ ] CHK-023 [P1] Error scenarios validated. Proof: no inputs, a non-numeric `--loc`, and an unknown option each exit `1` with a stderr line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Proof: T002 lists every output-mode global, and `QUIET` is added beside `JSON_OUTPUT`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed output contract. Proof: T002 lists the documentation and workflow references; none parses the report.
- [ ] CHK-FIX-004 [P0] Security/path/parser adversarial cases. Proof: N/A - the change adds one boolean flag and reads no path, delimiter or redaction boundary.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed. Proof: `plan.md` names four output modes crossed with four input profiles, and the rows map to AC-001 through AC-006 plus T012.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant. Proof: N/A - the script reads no environment variable and holds no state between runs.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit or explicit diff range. Proof: `implementation-summary.md` records the commit SHA once the change lands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Proof: `rg -n 'secret|password|api[_-]?key' $S` prints nothing.
- [ ] CHK-031 [P0] Input validation stays in force. Proof: `rg -c 'must be a positive integer' $S` prints `3`.
- [ ] CHK-032 [P1] Auth/authz. Proof: N/A - the script has no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same flag and the same output line. Proof: `rg -c -- '--quiet' $P/spec.md $P/plan.md $P/tasks.md` prints a non-zero count for each file.
- [ ] CHK-041 [P1] The header comment and `show_help` describe the flag the same way. Proof: both name `--quiet`, the single line, and the `--json` conflict.
- [ ] CHK-042 [P2] README updated. Proof: N/A - `README.md` lists the script but not its options, so no line changes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only. Proof: `git status --short` lists no file outside the packet folder.
- [ ] CHK-051 [P1] `scratch/` holds only the baseline capture this packet needs. Proof: `ls $P/scratch` lists `baseline-default.txt` and `.gitkeep`.
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

This is a planning packet: the script is unchanged, so no checklist item is ticked yet. Each row names the command that will prove it once implementation starts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001, ADR-002 and ADR-003 are recorded in `plan.md`. Proof: `rg -c '^### ADR-' $P/plan.md` prints `3`.
- [ ] CHK-101 [P1] Every ADR has a status. Proof: `rg -c '^\*\*Status\*\*: Accepted' $P/plan.md` prints `3`.
- [ ] CHK-102 [P1] Alternatives are recorded with a rejection reason. Proof: `rg -c '^\*\*Alternatives Rejected\*\*' $P/plan.md` prints `3`.
- [ ] CHK-103 [P2] Migration path documented. Proof: N/A - no stored data and no schema change.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 met. Proof: `time bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural` finishes under `100 ms`.
- [ ] CHK-111 [P1] Throughput target. Proof: N/A - a one-shot CLI has no throughput target.
- [ ] CHK-112 [P2] Load testing completed. Proof: N/A - there is no concurrent service to load.
- [ ] CHK-113 [P2] Performance benchmarks documented. Proof: N/A - the wall-clock check above is the whole claim.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback documented and exercised in a scratch copy. Proof: `plan.md` section 7 names the trigger and the command; the copy restores the baseline output.
- [ ] CHK-121 [P0] Feature flag configured. Proof: N/A - `--quiet` is a CLI option for the caller, not a toggle for other users.
- [ ] CHK-122 [P1] Monitoring/alerting configured. Proof: N/A - there is no service to monitor.
- [ ] CHK-123 [P1] Runbook created. Proof: N/A - the change is one script and one flag, and `plan.md` section 7 is the runbook.
- [ ] CHK-124 [P2] Deployment runbook reviewed. Proof: N/A - no separate runbook exists.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed. Proof: N/A - no new input, dependency or secret surface.
- [ ] CHK-131 [P1] Dependency licenses compatible. Proof: N/A - no dependency is added.
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed. Proof: N/A - there is no web surface.
- [ ] CHK-133 [P2] Data handling compliant with requirements. Proof: N/A - the script stores no data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All packet documents agree on the flag, the label and the `--json` conflict. Proof: `rg -n -- '--quiet' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md` shows the same contract in each.
- [ ] CHK-141 [P1] CLI documentation complete. Proof: `bash $S --help` lists `--quiet` in OPTIONS.
- [ ] CHK-142 [P2] User-facing documentation updated. Proof: N/A - `--help` is the user-facing surface.
- [ ] CHK-143 [P2] Knowledge transfer documented. Proof: N/A - single-author packet.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Operator | [ ] Approved | |
| `recommend-level.sh` maintainer | Technical review | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
