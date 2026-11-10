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

**Task variables**: `S=".skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh"` and `P="specs/zz-bench-authoring/001-recommend-level-quiet-flag"`. Set both in the shell before running a `Verify:` command.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the parser loop and both output functions (`$S`). Verify: `rg -n 'output_text|output_json|JSON_OUTPUT' "$S"` prints the global, both functions and the section 7 dispatch site.
- [ ] T002 Capture the default report for the reference input (`$P/scratch/baseline-default.txt`). Verify: `bash "$S" --loc 50 --files 2 > "$P/scratch/baseline-default.txt"; wc -l < "$P/scratch/baseline-default.txt"` prints 16.
- [ ] T003 Record the reference recommendation line (`$P/scratch/baseline-default.txt`). Verify: `grep -c '^Recommended Level: 0 (Quick)$' "$P/scratch/baseline-default.txt"` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `QUIET=false` global beside `JSON_OUTPUT` (`$S`). Verify: `rg -n '^QUIET=false$' "$S"` prints one line.
- [ ] T005 Add the `--quiet` case to the argument parser (`$S`). Verify: `bash "$S" --loc 50 --files 2 --quiet >/dev/null; echo $?` prints 0.
- [ ] T006 Return after the recommendation line in `output_text()` when quiet mode is active (`$S`). Verify: `bash "$S" --loc 50 --files 2 --quiet | wc -l` prints 1.
- [ ] T007 Keep the recommendation line's text identical in both modes (`$S`). Verify: `bash "$S" --loc 50 --files 2 --quiet` prints `Recommended Level: 0 (Quick)`.
- [ ] T008 List `--quiet` in the header usage block and in `show_help()` (`$S`). Verify: `bash "$S" --help | grep -c -- '--quiet'` prints 1.
- [ ] T014 Keep the quiet branch free of stderr redirection, so every warning still reaches stderr and only stdout is trimmed (REQ-006) (`$S`). Verify: `bash "$S" --loc 50 --files 2 --quiet 2>"$P/scratch/quiet-stderr.txt" | wc -l` prints 1 and `rg -n 'QUIET' "$S"` shows no `2>` or `exec` redirection inside `output_text()`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Diff the default report against the captured baseline (`$S`). Verify: `bash "$S" --loc 50 --files 2 | diff - "$P/scratch/baseline-default.txt"` prints nothing and exits 0.
- [ ] T010 Confirm the JSON path ignores quiet (`$S`). Verify: `bash "$S" --loc 50 --files 2 --json --quiet | wc -l` prints 36.
- [ ] T011 Confirm quiet composes with `--no-recommend-phases` (`$S`). Verify: `bash "$S" --loc 50 --files 2 --no-recommend-phases --quiet | wc -l` prints 1.
- [ ] T012 Confirm quiet never suppresses an error (`$S`). Verify: `bash "$S" --quiet 2>&1 >/dev/null | grep -c 'At least --loc or --files'` prints 1.
- [ ] T013 Syntax-check the edited script (`$S`). Verify: `bash -n "$S"; echo $?` prints 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: both output forms read correctly in a terminal, and every row of `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: `plan.md` carries ADR-001; this packet writes no separate `decision-record.md`.
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-00' "$P/spec.md"` prints 5.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -c '^### Step|^## 4. IMPLEMENTATION PHASES' "$P/plan.md"` prints at least 1.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `command -v bash diff wc` names all three.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Script parses cleanly. Verify: `bash -n "$S"; echo $?` prints 0.
- [ ] CHK-011 [P0] No stray debug output. Verify: `rg -n 'set -x|echo DEBUG' "$S"` prints nothing.
- [ ] CHK-012 [P1] Error handling preserved: quiet never suppresses stderr. Verify: `bash "$S" --quiet 2>&1 >/dev/null | grep -c 'ERROR'` prints 1.
- [ ] CHK-013 [P1] Code follows the file's existing pattern: a global, a parser case, a renderer branch. Verify: `rg -n 'QUIET|JSON_OUTPUT' "$S"` shows the new global in the same block as the old one.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row of `acceptance-criteria.md` reads `Met`.
- [ ] CHK-021 [P0] Quiet prints exactly one line. Verify: `bash "$S" --loc 50 --files 2 --quiet | wc -l` prints 1.
- [ ] CHK-022 [P1] Default report unchanged. Verify: `bash "$S" --loc 50 --files 2 | diff - "$P/scratch/baseline-default.txt"` prints nothing.
- [ ] CHK-023 [P1] Error and JSON paths tested. Verify: `bash "$S" --loc 50 --files 2 --json --quiet | wc -l` prints 36 and `bash "$S" --quiet` exits 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: both output functions were read before the branch was added. Verify: `rg -n '^output_text\(\)|^output_json\(\)' "$S"` prints both.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: every invocation of the script in the skill was checked for a `--quiet` expectation. Verify: `rg -n 'recommend-level.sh' .skilled/skills/system-spec-kit | rg -c -- '--quiet'` prints 0 before this packet publishes the flag.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the packet's diff, not to a moving branch. Verify: the commit named in `implementation-summary.md` is the one holding the change.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'password|token|secret' "$S"` prints nothing.
- [ ] CHK-031 [P0] Input validation intact: the numeric checks still run before any renderer. Verify: `bash "$S" --loc abc --files 2 --quiet; echo $?` prints an error and 1.
- [ ] CHK-032 [P1] No auth surface exists to regress. Verify: `rg -n 'curl|wget|http' "$S"` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized on the flag's name and its one-line output. Verify: `rg -c -- '--quiet' "$P/spec.md" "$P/plan.md" "$P/tasks.md"` prints a non-zero count for each file.
- [ ] CHK-041 [P1] Code comments adequate: the header usage block and `show_help()` both name the flag. Verify: `rg -c -- '--quiet' "$S"` prints at least 3.
- [ ] CHK-042 [P2] No README or reference page needs an edit: every existing example invocation stays valid. Verify: `rg -n 'recommend-level.sh' .skilled/skills/system-spec-kit/references | rg -c -- '--quiet'` prints 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only. Verify: `ls "$P/scratch"` lists the baseline and no stray copy of the script.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion, keeping only the baseline that the evidence cites. Verify: `ls "$P/scratch"` lists `baseline-default.txt` and `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 19 | [ ]/19 |
| P2 Items | 12 | [ ]/12 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 in `plan.md` is followed: quiet is read in `output_text()` only. Verify: `rg -n 'QUIET' "$S"` shows no reference inside `output_json()`.
- [ ] CHK-101 [P1] The ADR carries a status. Verify: `rg -n '^\*\*Status\*\*: Proposed' "$P/plan.md"` prints one line.
- [ ] CHK-102 [P1] Alternatives are documented with a rejection rationale. Verify: `rg -n 'Alternatives Rejected' "$P/plan.md"` prints one line.
- [ ] CHK-103 [P2] No migration path is needed: the change is additive and the default path is untouched. Verify: `bash "$S" --loc 50 --files 2 | diff - "$P/scratch/baseline-default.txt"` prints nothing.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds: the quiet run stays under 100 ms. Verify: `time bash "$S" --loc 50 --files 2 --quiet >/dev/null` reports a real time below 0.1 s.
- [ ] CHK-111 [P1] Quiet does less work than the report, never more: it returns before the breakdown prints. Verify: `bash "$S" --loc 50 --files 2 --quiet | wc -l` prints 1, which is fewer lines than the 16-line report.
- [ ] CHK-112 [P2] No load test applies: the script is a single-shot CLI. Verify: `rg -n 'sleep|while true' "$S"` prints nothing.
- [ ] CHK-113 [P2] No benchmark is recorded: the only performance claim is NFR-P01, measured by CHK-110. Verify: `rg -n 'NFR-P01' "$P/spec.md"` prints one line.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` section 7 and in the L2 enhanced rollback. Verify: `rg -n 'Rollback Plan|Rollback Procedure' "$P/plan.md"` prints both headings.
- [ ] CHK-121 [P1] No feature flag or rollout switch exists: `--quiet` is per-invocation. Verify: `rg -n 'feature.flag|rollout' "$S"` prints nothing.
- [ ] CHK-122 [P2] No monitoring surface exists: the script emits no metrics. Verify: `rg -n 'metrics|statsd|otel' "$S"` prints nothing.
- [ ] CHK-123 [P2] No runbook is needed: the rollback is one revert plus two commands. Verify: `rg -c '^[0-9]\. ' "$P/plan.md"` counts the rollback steps that exist.
- [ ] CHK-124 [P2] No deployment step exists: the script ships inside the skill tree. Verify: `rg -n 'deploy|release' "$P/plan.md"` prints no deployment action.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No security review surface: the change adds no input parsing beyond a boolean flag. Verify: `rg -n 'eval|exec' "$S"` prints nothing.
- [ ] CHK-131 [P1] No dependency license changes: no package is added. Verify: `git diff --stat -- '*.json' 'package.json' 'package-lock.json'` prints nothing for this change.
- [ ] CHK-132 [P2] No OWASP surface applies: the script reads no request, cookie or credential. Verify: `rg -n 'cookie|session|credential' "$S"` prints nothing.
- [ ] CHK-133 [P2] No data handling applies: the script persists nothing. Verify: `rg -n '> *[^&]|tee ' "$S"` prints no write outside stdout.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents agree on the flag's behaviour and the one-line output. Verify: `rg -c 'Recommended Level: <N> (<Name>)' "$P/spec.md" "$P/plan.md"` prints a non-zero count for each file.
- [ ] CHK-141 [P2] No API documentation exists to update: the script is a CLI, not a service. Verify: `rg -n 'openapi|swagger' "$P"` prints nothing.
- [ ] CHK-142 [P2] No user-facing page changes: the reference docs list usage examples that remain valid. Verify: `rg -n 'recommend-level.sh' .skilled/skills/system-spec-kit/references | rg -c -- '--quiet'` prints 0.
- [ ] CHK-143 [P2] Knowledge transfer is the help text itself. Verify: `bash "$S" --help | rg -c -- '--quiet'` prints 1.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required: the packet is Draft and no implementation has run | |
| N/A | Product Owner | Not required: the change is additive and the caller requested it | |
| N/A | QA Lead | Not required: verification is the two output forms in `tasks.md` | |
<!-- /ANCHOR:sign-off -->
