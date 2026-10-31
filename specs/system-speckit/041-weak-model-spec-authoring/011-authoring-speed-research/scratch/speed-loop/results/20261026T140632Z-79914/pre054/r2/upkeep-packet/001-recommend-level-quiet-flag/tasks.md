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

Task ids are stable. A completed task carries the command and the observed result as evidence; a task marked `[x]` without evidence is treated as not done.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read sections 5-7 of `recommend-level.sh` (argument parsing, output functions, main dispatch) and record the line numbers that will change (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the current default text output and `--json` output for one fixed input into `scratch/` as the regression baseline (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 [P] Confirm no caller passes `--quiet` today by inventorying every reference to the script (`.skilled/commands/speckit/assets/speckit-plan.yaml`, `.skilled/commands/speckit/assets/speckit-complete.yaml`)
- [ ] T004 Add `QUIET=false` beside the `JSON_OUTPUT` global (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet|-q` case to the argument parser, following the existing `--json|-j` pattern (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add a shared recommended-level line helper so the text report and quiet mode print the same string (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Add `output_quiet()`, printing the helper's line with no leading blank line in text mode (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 Add the reduced one-line JSON branch inside `output_quiet()` for the `--json --quiet` combination (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T009 Wire the output dispatch in section 7: quiet first, then JSON, then text (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T010 Document `--quiet` in the file header OPTIONS block and add one example (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T011 Document `--quiet` in the `show_help()` OPTIONS block and its EXAMPLES block (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T012 Create the regression script with pass/fail counters and an EXIT trap for its temp directory (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T013 [P] Add the default-output regression cases against the Phase 1 captures (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T014 [P] Add the quiet-line cases: one line, exact pattern, equality with the report line, `-q` alias (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T015 [P] Add the reduced-JSON cases: one line, valid JSON, exact key set (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T016 [P] Add the error and flag-interaction cases: invalid input, unknown option, `--help`, flag order (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T023 Keep every warning the script writes to stderr on stderr in quiet mode, so `--quiet` trims stdout only, per REQ-009 (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run `bash -n` on the modified script and record the exit status (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T018 Run the regression script and record its PASS/FAIL/SKIP totals (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T019 Execute all 16 matrix rows (quiet × json × phases × validity) and record the outcome per row (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T020 Diff default text output and default `--json` output against the Phase 1 captures (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T021 Confirm `--help` lists the flag and one example (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T022 Run `validate.sh --strict` on this packet and record the RESULT line (`specs/zz-bench-authoring/001-recommend-level-quiet-flag`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every acceptance criterion in `acceptance-criteria.md` is `Met`
- [ ] Default output diffs are empty and the regression script reports zero failures
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P1] Dependencies identified and available; no new runtime dependency introduced
- [ ] CHK-004 [P1] Baseline captures of default text and JSON output taken before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` passes on the modified script
- [ ] CHK-011 [P0] Quiet mode writes nothing to stdout except the single answer line
- [ ] CHK-012 [P1] Flag handling follows the existing `case` pattern and global naming
- [ ] CHK-013 [P1] No bash 4-only construct; the script still runs on bash 3.2
- [ ] CHK-014 [P1] No new external command is invoked at runtime
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Regression script reports zero failures
- [ ] CHK-022 [P1] All 16 matrix rows executed and recorded
- [ ] CHK-023 [P1] Default text and JSON output diff clean against the baseline
- [ ] CHK-024 [P1] Error paths verified: invalid `--loc`, invalid `--files`, unknown option
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This is a feature packet with no deep-review finding in scope, so there is no finding class to assign, no same-class producer inventory to run and no adversarial path or redaction matrix to build. The inventory that does apply to this change lives in `plan.md` under `FIX ADDENDUM: AFFECTED SURFACES` and covers producers, consumers and the output matrix.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials in the script or the test
- [ ] CHK-031 [P0] `--quiet` does not bypass the existing numeric validation for `--loc`, `--files` or `--phase-threshold`
- [ ] CHK-032 [P1] No file is written by the script in any output mode; the test writes only to its own temp directory
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with the implemented behaviour
- [ ] CHK-041 [P1] The file header comment and `show_help()` both list `--quiet`
- [ ] CHK-042 [P2] `runtime/cli/spec/README.md` updated only if it grows a flag inventory; it currently carries none
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 21 | 0/21 |
| P2 Items | 8 | 0/8 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decision recorded as ADR-001 in `plan.md`
- [ ] CHK-101 [P1] ADR-001 carries a status and a decision statement
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented; N/A because the flag is opt-in and no caller migrates
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Quiet mode adds no measurable runtime: one `printf`, no new process
- [ ] CHK-111 [P1] No additional subshell or external command in the quiet path
- [ ] CHK-112 [P2] Load testing; N/A for a single-invocation CLI
- [ ] CHK-113 [P2] Performance benchmarks documented; N/A beyond the qualitative check above
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

No deployment step exists. The script ships in place under `.skilled/skills/system-spec-kit/runtime/cli/spec/` and is invoked from the repository, so a change reaches callers as soon as the commit lands.

- Rollback: revert the commit that modifies the script and delete the new test file.
- Feature flag: none. `--quiet` is itself the opt-in.
- Monitoring: none applies; the script has no runtime telemetry and adds none.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review: the flag adds a boolean and no input surface; existing validation still gates every run
- [ ] CHK-131 [P1] Dependency licenses: no dependency added, so no license surface changes
- [ ] CHK-132 [P2] OWASP Top 10 checklist; N/A for a local shell script with no network, storage or auth
- [ ] CHK-133 [P2] Data handling: the script reads no user data and writes none
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation; N/A because the script exposes a CLI, not an API
- [ ] CHK-142 [P2] User-facing documentation updated: `--help` is the user-facing surface and lists the flag
- [ ] CHK-143 [P2] Knowledge transfer documented in the ADR and this packet
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Packet Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

