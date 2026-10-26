---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "recommend-level quiet task breakdown"
  - "quiet flag verification checklist"
importance_tier: "normal"
contextType: "planning"
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

- [ ] T001 Capture baseline stdout and exit codes for six invocations of the current script (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Record the exact level-line format and confirm it is the only line `--quiet` may print (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 [P] Confirm no shell caller parses the text report today (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` beside `JSON_OUTPUT` in the globals block (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet` arm to the option loop, next to the other boolean flags (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Extract `print_level_line()` and call it from `output_text` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Add `output_quiet()` that calls only `print_level_line()` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 Route the dispatch: JSON first, then quiet, then text (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T009 Document `--quiet` in the header OPTIONS block and in `show_help` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T016 Keep the quiet path off stderr so `--quiet` trims stdout only and every warning the script emits still reaches stderr, REQ-007 (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 [P] Add the fixture matrix test file (`.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T011 Run the new test file (`cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T012 Run the two existing suites that exercise `--json` (`cli/tests/test-phase-system.js`, `cli/tests/test-phase-validation.js`)
- [ ] T013 Diff non-quiet stdout against the T001 baseline byte for byte (`scratch/baseline/`)
- [ ] T014 Run `bash -n` on the modified script (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T015 Run strict validation on this packet (`specs/zz-bench-authoring/001-recommend-level-quiet-flag`)
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
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` reports no syntax error
- [ ] CHK-011 [P0] The new arms keep the file's existing quoting and `[[ ]]` style
- [ ] CHK-012 [P1] Error handling unchanged: every failure path still writes stderr and exits 1
- [ ] CHK-013 [P1] The new code follows the existing `case` and helper conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every review finding carries a finding class, or is recorded as not applicable because this packet ships a feature and not a fix.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "Recommended Level:"` returns exactly one literal, inside the shared formatter.
- [ ] CHK-FIX-003 [P0] Consumer inventory: the two test suites and every shell caller are listed in the plan's affected-surfaces table.
- [ ] CHK-FIX-004 [P0] The adversarial table covers flag order, repeated flags, JSON plus quiet and invalid input; path, parser and redaction rows are not applicable to an output selector.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed in plan.md before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile environment variant: the script reads no environment variable, so the row is satisfied by inspection.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the commit that touches the script, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation unchanged: `--quiet` takes no value and adds no parsing path
- [ ] CHK-032 [P1] Auth and authz not applicable: local CLI with no authentication surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] The header OPTIONS block and `show_help` match the implemented behavior
- [ ] CHK-042 [P2] README update not required: `runtime/cli/spec/README.md` names the script in the topology list and documents no option list
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
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

- [ ] CHK-100 [P0] Architecture decisions documented as ADR-001 and ADR-002 in plan.md
- [ ] CHK-101 [P1] Both ADRs carry a status of Accepted
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path not applicable: the flag is additive and no caller must change
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time target met for NFR-P01 on every fixture
- [ ] CHK-111 [P1] The quiet path adds no subprocess, file read or network call
- [ ] CHK-112 [P2] Load testing not applicable: a single-shot CLI invoked once per call
- [ ] CHK-113 [P2] The fixture timing table is recorded with the test output
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented in plan.md section 7
- [ ] CHK-121 [P0] Feature flag not applicable: `--quiet` is an opt-in call-site switch, not a runtime toggle
- [ ] CHK-122 [P1] Monitoring not applicable: the script exposes no service and emits no metrics
- [ ] CHK-123 [P1] The `--help` text serves as the operator reference and lists the flag
- [ ] CHK-124 [P2] Deployment runbook review not applicable: the script ships with the working tree
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed for the new option arm
- [ ] CHK-131 [P1] Dependency licenses unchanged: the change adds no dependency
- [ ] CHK-132 [P2] OWASP Top 10 not applicable: local CLI with no network, session or stored data
- [ ] CHK-133 [P2] Data handling unchanged: the script stores and transmits nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] The `--help` OPTIONS block is the interface reference and matches the parse loop
- [ ] CHK-142 [P2] No user-facing documentation update needed beyond the help text
- [ ] CHK-143 [P2] Knowledge transfer recorded in ADR-001 and ADR-002
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Documentation review | Pending | |
| Technical Lead | Code review | Pending | |
| QA Lead | Verification review | Pending | |
<!-- /ANCHOR:sign-off -->
