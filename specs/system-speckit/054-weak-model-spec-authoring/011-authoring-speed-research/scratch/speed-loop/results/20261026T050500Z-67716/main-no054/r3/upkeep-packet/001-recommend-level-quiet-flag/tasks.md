---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Ordered implementation and verification tasks for the --quiet flag, each naming its file and its evidence."
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `output_text()`, `output_json()` and the argument parser, and confirm `output_text()` is the only human output path (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the baseline default output for `--loc 20 --files 2` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 [P] Confirm the scripted callers pass `--json` and none of them depend on the human report (`.skilled/commands/speckit/assets`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` beside the other output globals (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet` case to the argument parser (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Branch in `output_text()` to print only `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` when quiet (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Reject `--quiet` with `--json` in the main validation block before any output (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 Update the file header OPTIONS block and `show_help()` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T009 [P] Create the regression test with quiet, default and conflict assertions (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T010 Document `--quiet` in the command reference (`.skilled/skills/system-spec-kit/references/workflows/execution-methods.md`)
- [ ] T016 Keep every warning on stderr under `--quiet`, so quiet trims stdout only (REQ-008) (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the new regression test and confirm every assertion passes (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh`)
- [ ] T012 Diff the default output against the baseline and confirm no change (`scratch/baseline-default.txt`)
- [ ] T013 Run the existing phase validation tests (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`)
- [ ] T014 Confirm `--help` lists `--quiet` and `--quiet --help` prints the full help (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T015 Record the command output in the implementation summary (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach and ADR-001 defined in plan.md
- [ ] CHK-003 [P1] Callers inventoried and none of them requires quiet output
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` passes on the modified script
- [ ] CHK-011 [P0] Default output is byte-identical to the baseline
- [ ] CHK-012 [P1] The quiet line uses the same variables as the default report
- [ ] CHK-013 [P1] Help text lists the flag
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] New regression test passes
- [ ] CHK-021 [P0] Existing phase validation tests pass
- [ ] CHK-022 [P1] Conflict case asserts exit 1 and empty stdout
- [ ] CHK-023 [P1] Invalid input with `--quiet` keeps the existing error
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This packet adds a feature. It does not remediate a finding, so there is no finding class, producer inventory or adversarial table to fill. The consumer inventory lives in `plan.md` under Affected Surfaces.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets added
- [ ] CHK-031 [P0] The flag accepts no value, so it adds no input parsing surface
- [ ] CHK-032 [P1] No auth or authz surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized
- [ ] CHK-041 [P1] Header comment and help text match the implementation
- [ ] CHK-042 [P2] Command reference updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline capture lives in `scratch/`
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 14 | 0/14 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 recorded in `plan.md` with status Accepted
- [ ] CHK-101 [P1] Alternatives documented with rejection rationale
- [ ] CHK-102 [P1] No separate decision record is required, ADR-001 is the record for this packet
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Quiet mode returns within 100 ms for typical inputs
- [ ] CHK-111 [P2] Default runtime shows no measurable change
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

Not applicable. The script ships with the repository. It has no deploy step, feature flag, monitoring or runbook.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable. The change adds no dependency, handles no personal data and touches no security control.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] Help text, header comment and command reference agree
- [ ] CHK-141 [P2] No user-facing docs beyond the command reference need an update
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Author | Pending | |
| Technical reviewer | Reviewer | Pending | |
| QA lead | Verification | Pending | |
<!-- /ANCHOR:sign-off -->

